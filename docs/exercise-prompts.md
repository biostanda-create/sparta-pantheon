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
Same pull-up mid-motion as above, but with a heavy stone/iron weight plate
hanging from a chain at the waist, added tension visible through the core
and shoulders.

### 5. Lat Pulldown (`latpull`)
Statue seated, leaning slightly back, pulling a wide bar down to the upper
chest, elbows driving down and back, gold veins radiating across the
widest part of the back.

### 6. Cable Row (`cablerow`)
Statue seated upright, knees softly bent, pulling a handle into the
stomach, elbows tight along the body, shoulder blades squeezed together,
gold veins across the mid-back.

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
