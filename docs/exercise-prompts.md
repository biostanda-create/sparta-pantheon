# Exercise Image Prompts — Sparta Pantheon

Prompty pro generování soch cviků (obsidian + zlaté žíly styl). Cíl: jednotný vizuální styl napříč celou aplikací.

## Základní styl (platí pro všechny cviky, všechny kategorie)

- Materiál: **obsidián** (černý vulkanický kámen) s **žhnoucími zlatými žílami** protékajícími celým tělem (jako praskliny s lávou/zlatem)
- Záběr: **celé tělo, front view** (ne z boku, ne detail)
- Pozice: **cvik zachycený v pohybu** (dynamická akční póza, ne statický stoj)
- Obličej: **faceless** — hladký obsidián bez rysů obličeje
- Hlava: **bez helmy**, holá hlava (žádná Spartan helma ani jiná pokrývka hlavy)
- Pozadí: tmavé, dramatické nasvícení zvýrazňující zlaté žíly
- Styl vykreslení: fotorealistický render, vysoké rozlišení

### Šablona base promptu
```
Hyper-detailed obsidian statue of a muscular Spartan warrior, carved from
black obsidian stone with glowing molten-gold veins running through the
entire body like cracks of lava. Full front view, entire body visible,
[ACCENT: exercise-specific pose/action]. Faceless — smooth featureless
obsidian face, no facial details, bare head with no helmet or any
headwear. Dramatic dark background, cinematic lighting reflecting off the
gold veins, photorealistic render, 8k, square 1:1 composition.
```

---

## Kategorie: BACK (Zada)

### 1. Deadlift (`deadlift`)
Statue frozen mid-deadlift: hips hinged back, straight back, gripping a
heavy barbell with both hands at mid-shin height, about to drive upward,
gold veins concentrated along the spine and hamstrings.

### 2. Barbell Row (`barbellrow`)
Statue bent forward ~45°, pulling a barbell up toward the lower chest,
elbows driving back, shoulder blades drawn together, gold veins pulsing
across the upper back and lats.

### 3. Pull-ups (`pullup`)
Statue hanging from a stone bar, mid-pull with chin rising toward the bar,
back fully engaged, arms bent, gold veins tracing down the lats and
forearms.

### 4. Weighted Pull-ups (`wpullup`)
Jeden mega-prompt se přes v2-v8 opakovaně vracel ke stejným chybám (rovné
paže, hlava, počet kotoučů, úchop) — moc protichůdných detailů najednou.
Postup od v9 je krokový: nejdřív dostat pózu + úchop správně jednoduchým
promptem, pak na už hotovém obrázku dodělávat detaily přes Gemini
image-editing (ne psaním nového promptu od nuly).

**Krok A — základní póza a úchop (generuj jako první, samostatně):**
```
Photorealistic obsidian statue, full front view, entire body visible. A
muscular man hangs from a horizontal stone bar. Both hands grip the bar
in a closed fist, palms facing away from the body (pronated/overhand
grip), fingers wrapped fully around the bar, thumbs locking the grip.
Elbows bent at roughly 90 degrees, actively pulling the body upward — not
a straight-armed dead hang. Feet off the ground. Chest and face both
face the camera directly (not a back view). Black obsidian material with
glowing gold veins across the body. Normal human-sized head, smooth
faceless obsidian surface, no helmet. Dark dramatic background, 8k,
square 1:1.
```

**Krok B — jakmile Krok A sedí (póza + úchop OK), edituj TENTO obrázek
v Gemini (ne nový prompt):**
```
Edit this image: add a thick chain hanging from a weight belt around the
waist, with five to six heavy iron weight plates stacked together on the
chain, dangling below the hips. Keep everything else in the image
exactly the same — same pose, same grip, same head, same background.
```

Pokud Krok A vyjde s chybou (rovné ruce / špatný úchop / špatná hlava),
oprav to jako Krok B editem obrázku ("uprav lokty tak, aby byly pokrčené"
/ "sevři ruce do pěsti kolem tyče"), místo přepisování celého promptu.

### 5. Lat Pulldown (`latpull`)
Statue seated, leaning slightly back, pulling a wide bar down to the upper
chest, elbows driving down and back, gold veins radiating across the
widest part of the back.

### 6. Cable Row (`cablerow`)
(v1 chyba: kabel vedený svisle shora namísto vodorovně zepředu, chyběla
opěrka na nohy — vypadalo to jako overhead pulling stroj, ne cable row.
v2 explicitně popisuje nízkou kladku a footplate.)
```
Photorealistic obsidian statue, full front view, entire body visible.
A muscular man sits on the floor of a cable row station with legs
extended straight forward, both feet braced flat against a vertical
metal footplate in front of him. A cable runs horizontally at waist
height from a low pulley mounted at the base of the machine directly in
front of his feet, attached to a V-handle. Both hands grip the handle
and pull it straight back into the stomach, elbows driving back close
along the body, shoulder blades squeezed together, torso upright with a
slight backward lean. Do NOT show any cable or rope going upward or
overhead — the cable is horizontal, at torso height, coming from the
front. Black obsidian material with glowing gold veins across the
back and mid-torso. Normal human-sized head, smooth faceless obsidian
surface, no helmet. Dark dramatic background, 8k, square 1:1.
```

### 7. Barbell RDL (`barbellrdl`)
Statue mid-hinge, barbell sliding down the thighs, hips pushed back,
neutral spine, slight forward lean, gold veins highlighting the hamstrings
and lower back.

### 8. Back Extension (`backext`)
Statue at the top of a back extension, hips on a pad, torso raised in
line with the legs, glutes and lower back contracted, gold veins glowing
along the spine.

### 9. Axle Deadlift (`axledeadlift`)
Same deadlift pulling motion as #1, but gripping a thick axle barbell,
forearms visibly straining with grip effort, gold veins extending into
the hands and forearms.

---

## Poznámka pro další kategorie
Až budeme dělat další kategorie (SHOULDERS, BICEPS, TRICEPS, CHEST, ABS,
LEGS, CARDIO, CALISTHENICS, STRETCHING, YOGA), použij stejnou base šablonu
výše a jen doplň `[ACCENT]` pro danou akci cviku — seznam cviků je
v `finalspartan.html`, `EXERCISE_CATEGORIES` (řádek ~1005).
