/**
 * PANTHEON+ backend — Cloudflare Worker.
 *
 * Identity model: the app generates a random `licenseKey` (UUID) per install and
 * never collects email/passwords. Stripe Checkout is opened with that key as
 * `client_reference_id`; the webhook below ties Stripe subscription status back
 * to that key in KV. The same key is the user's "recovery code" for restoring
 * premium + cloud backup on a new device.
 */

function withCors(resp) {
  resp.headers.set('Access-Control-Allow-Origin', '*');
  resp.headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  resp.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return resp;
}

function json(data, status = 200) {
  return withCors(new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } }));
}

async function stripe(env, path, params) {
  const body = new URLSearchParams(params);
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });
  return res.json();
}

async function verifyStripeSignature(rawBody, sigHeader, secret) {
  if (!sigHeader) return null;
  const parts = Object.fromEntries(sigHeader.split(',').map((p) => p.split('=')));
  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) return null;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return null; // 5 min tolerance
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${timestamp}.${rawBody}`));
  const expected = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, '0')).join('');
  return expected === signature ? JSON.parse(rawBody) : null;
}

async function countEvent(env, name) {
  const day = new Date().toISOString().slice(0, 10);
  const k = `stat:${day}:${name}`;
  const cur = Number(await env.KV.get(k)) || 0;
  await env.KV.put(k, String(cur + 1));
}

function b64url(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(str) {
  const bin = atob(str.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

// VAPID (RFC 8292): a JWT signed with the app's ES256 keypair, proving to the push
// service that whoever sends this push also controls the public key the browser
// pinned at subscribe time. No payload/encryption needed for a plain "go open the app" ping.
async function vapidAuthHeader(env, endpoint) {
  const aud = new URL(endpoint).origin;
  const header = b64url(new TextEncoder().encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const payload = b64url(
    new TextEncoder().encode(JSON.stringify({ aud, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: 'mailto:admin@example.com' }))
  );
  const unsigned = `${header}.${payload}`;
  const key = await crypto.subtle.importKey(
    'jwk',
    { kty: 'EC', crv: 'P-256', d: env.VAPID_PRIVATE_KEY_D, x: env.VAPID_PUBLIC_KEY_X, y: env.VAPID_PUBLIC_KEY_Y, ext: true },
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, new TextEncoder().encode(unsigned));
  const jwt = `${unsigned}.${b64url(sig)}`;
  const pubKeyRaw = new Uint8Array([0x04, ...b64urlDecode(env.VAPID_PUBLIC_KEY_X), ...b64urlDecode(env.VAPID_PUBLIC_KEY_Y)]);
  return `vapid t=${jwt}, k=${b64url(pubKeyRaw)}`;
}

async function sendPush(env, subscription) {
  await fetch(subscription.endpoint, {
    method: 'POST',
    headers: {
      Authorization: await vapidAuthHeader(env, subscription.endpoint),
      TTL: '86400',
      'Content-Length': '0',
    },
  });
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    if (req.method === 'OPTIONS') return withCors(new Response(null, { status: 204 }));

    // --- Start a subscription checkout ---
    if (url.pathname === '/api/checkout' && req.method === 'POST') {
      const { plan, licenseKey } = await req.json().catch(() => ({}));
      if (!licenseKey) return json({ error: 'missing licenseKey' }, 400);
      const price = plan === 'annual' ? env.STRIPE_PRICE_ANNUAL : env.STRIPE_PRICE_MONTHLY;
      if (!price) return json({ error: 'price not configured' }, 500);
      const session = await stripe(env, 'checkout/sessions', {
        mode: 'subscription',
        'line_items[0][price]': price,
        'line_items[0][quantity]': '1',
        success_url: `${env.APP_URL}?upgraded=1`,
        cancel_url: `${env.APP_URL}?upgraded=0`,
        client_reference_id: licenseKey,
        'subscription_data[metadata][licenseKey]': licenseKey,
        allow_promotion_codes: 'true',
      });
      if (session.error) return json({ error: session.error.message }, 400);
      await countEvent(env, 'checkout_started');
      return json({ url: session.url });
    }

    // --- Stripe webhook: keep KV entitlement in sync with subscription status ---
    if (url.pathname === '/api/webhook' && req.method === 'POST') {
      const raw = await req.text();
      const event = await verifyStripeSignature(raw, req.headers.get('stripe-signature'), env.STRIPE_WEBHOOK_SECRET);
      if (!event) return json({ error: 'bad signature' }, 400);
      const obj = event.data.object;

      if (event.type === 'checkout.session.completed') {
        const key = obj.client_reference_id;
        if (key) {
          await env.KV.put(
            `lic:${key}`,
            JSON.stringify({ active: true, customerId: obj.customer, subscriptionId: obj.subscription, updatedAt: Date.now() })
          );
          await countEvent(env, 'premium_activated');
        }
      } else if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
        const key = obj.metadata && obj.metadata.licenseKey;
        const active = obj.status === 'active' || obj.status === 'trialing';
        if (key) {
          await env.KV.put(
            `lic:${key}`,
            JSON.stringify({
              active,
              customerId: obj.customer,
              subscriptionId: obj.id,
              until: obj.current_period_end ? obj.current_period_end * 1000 : null,
              updatedAt: Date.now(),
            })
          );
        }
      }
      return json({ ok: true });
    }

    // --- Check / refresh entitlement for a license key ---
    if (url.pathname === '/api/entitlement' && req.method === 'GET') {
      const key = url.searchParams.get('key');
      if (!key) return json({ premium: false });
      const raw = await env.KV.get(`lic:${key}`);
      if (!raw) return json({ premium: false });
      const lic = JSON.parse(raw);
      return json({ premium: !!lic.active, until: lic.until || null });
    }

    // --- Cloud backup (premium only) ---
    if (url.pathname === '/api/backup' && req.method === 'POST') {
      const { key, data } = await req.json().catch(() => ({}));
      if (!key) return json({ error: 'missing key' }, 400);
      const raw = await env.KV.get(`lic:${key}`);
      const lic = raw ? JSON.parse(raw) : null;
      if (!lic || !lic.active) return json({ error: 'premium required' }, 403);
      await env.KV.put(`backup:${key}`, JSON.stringify({ data, savedAt: Date.now() }));
      return json({ ok: true });
    }

    if (url.pathname === '/api/backup' && req.method === 'GET') {
      const key = url.searchParams.get('key');
      if (!key) return json({ error: 'missing key' }, 400);
      const raw = await env.KV.get(`backup:${key}`);
      if (!raw) return json({ error: 'not found' }, 404);
      return json(JSON.parse(raw));
    }

    // --- Lightweight funnel analytics, no third party ---
    if (url.pathname === '/api/event' && req.method === 'POST') {
      const { name } = await req.json().catch(() => ({}));
      if (name && /^[a-z0-9_]{1,40}$/.test(name)) await countEvent(env, name);
      return json({ ok: true });
    }

    // --- Save/replace a Web Push subscription for daily training reminders ---
    if (url.pathname === '/api/push-subscribe' && req.method === 'POST') {
      const { key, subscription } = await req.json().catch(() => ({}));
      if (!key || !subscription || !subscription.endpoint) return json({ error: 'missing key/subscription' }, 400);
      await env.KV.put(`push:${key}`, JSON.stringify(subscription));
      await countEvent(env, 'push_subscribed');
      return json({ ok: true });
    }

    if (url.pathname === '/api/push-subscribe' && req.method === 'DELETE') {
      const key = url.searchParams.get('key');
      if (!key) return json({ error: 'missing key' }, 400);
      await env.KV.delete(`push:${key}`);
      return json({ ok: true });
    }

    return json({ error: 'not found' }, 404);
  },

  // Cron Trigger (see wrangler.toml [triggers]) — sends a no-payload reminder push
  // to every stored subscription; the service worker's `push` handler fills in the
  // default title/body since there's no encrypted payload here.
  async scheduled(event, env) {
    let cursor;
    do {
      const page = await env.KV.list({ prefix: 'push:', cursor });
      await Promise.all(
        page.keys.map(async (k) => {
          const raw = await env.KV.get(k.name);
          if (!raw) return;
          try {
            await sendPush(env, JSON.parse(raw));
          } catch {
            // Expired/invalid subscriptions fail silently; the client will resubscribe on next visit.
          }
        })
      );
      cursor = page.list_complete ? null : page.cursor;
    } while (cursor);
  },
};
