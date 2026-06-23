# PANTHEON+ backend

Deploys the subscription/cloud-backup API on Cloudflare Workers' free tier.
You (the account owner) must do the steps below once — nobody else can create
your Stripe/Cloudflare accounts for you.

## 1. Stripe (one-time, ~10 min)

1. Create a free account at https://dashboard.stripe.com/register
2. Products → Add product → "Pantheon+". Add two recurring prices:
   - Monthly, e.g. $4.99 — copy its Price ID (`price_...`)
   - Yearly, e.g. $29.99 — copy its Price ID
3. Developers → API keys → copy the **Secret key** (`sk_live_...` or `sk_test_...` while testing).
4. Developers → Webhooks → Add endpoint:
   - URL: `https://<your-worker-subdomain>.workers.dev/api/webhook` (you'll get this in step 2 below — add the webhook after first deploy)
   - Events to send: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the **Signing secret** (`whsec_...`)

## 2. Cloudflare Worker (one-time, ~5 min)

```bash
cd worker
npx wrangler login                              # opens browser, free account is fine
npx wrangler kv namespace create pantheon_plus_kv
# paste the printed id into wrangler.toml -> kv_namespaces[0].id

npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
npx wrangler secret put STRIPE_PRICE_MONTHLY
npx wrangler secret put STRIPE_PRICE_ANNUAL

npx wrangler secret put VAPID_PRIVATE_KEY_D
npx wrangler secret put VAPID_PUBLIC_KEY_X
npx wrangler secret put VAPID_PUBLIC_KEY_Y

npx wrangler deploy
```

### Push notifications (daily reminders)

The worker signs Web Push requests with a VAPID keypair instead of a third-party
push service. Generate one once and keep both halves:

```bash
node -e "
const crypto = require('crypto');
const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
const pub = publicKey.export({ format: 'jwk' });
const priv = privateKey.export({ format: 'jwk' });
const x = Buffer.from(pub.x, 'base64url'), y = Buffer.from(pub.y, 'base64url');
const point = Buffer.concat([Buffer.from([4]), x, y]).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+\$/,'');
console.log('client VAPID_PUBLIC_KEY:', point);
console.log('worker secret VAPID_PRIVATE_KEY_D:', priv.d);
console.log('worker secret VAPID_PUBLIC_KEY_X:', pub.x);
console.log('worker secret VAPID_PUBLIC_KEY_Y:', pub.y);
"
```

- Paste the three worker secrets via `wrangler secret put` (above).
- Paste `client VAPID_PUBLIC_KEY` into `finalspartan.html`'s `VAPID_PUBLIC_KEY` constant.
- The Cron Trigger in `wrangler.toml` (`[triggers] crons`) fires `scheduled()` daily,
  which sends a no-payload push to every subscriber stored under `push:<licenseKey>`
  in KV — the service worker (`sw.js`) fills in the default reminder text.

Wrangler prints your live URL, e.g. `https://pantheon-plus.yourname.workers.dev`.

- Go back to Stripe → Webhooks and finish adding the endpoint with that URL + `/api/webhook`.
- Edit `wrangler.toml` → `vars.APP_URL` to wherever you host `finalspartan.html`, then `npx wrangler deploy` again.

## 3. Point the app at the worker

In `finalspartan.html`, set `PANTHEON_PLUS_API` (near the top of the `<script>`) to your worker URL.

## Endpoints

- `POST /api/checkout` `{ plan: 'monthly'|'annual', licenseKey }` → `{ url }` (Stripe Checkout link)
- `GET /api/entitlement?key=<licenseKey>` → `{ premium, until }`
- `POST /api/backup` `{ key, data }` (premium only) → `{ ok }`
- `GET /api/backup?key=<licenseKey>` → `{ data, savedAt }`
- `POST /api/event` `{ name }` → fire-and-forget funnel counters, viewable via `wrangler kv key list` / `wrangler kv key get`
- `POST /api/push-subscribe` `{ key, subscription }` → `{ ok }` (stores a Web Push subscription)
- `DELETE /api/push-subscribe?key=<licenseKey>` → `{ ok }` (unsubscribe)

## Costs

Cloudflare Workers free tier (100k requests/day) and KV free tier are enough for
thousands of users. Stripe takes ~2.9%+30¢ per transaction, no monthly fee.
