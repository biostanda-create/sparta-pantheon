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
(v2 — mnohem víc závaží na tyči.)
```
Photorealistic obsidian statue, full front view, entire body visible. A
muscular man is mid-hinge holding a barbell loaded with many large, thick
heavy iron weight plates stacked tightly on each end — an extremely
heavy load, clearly far more than the man could easily lift, bar visibly
bending slightly under the weight. Hips pushed back, neutral straight
spine, torso leaning forward, barbell sliding down the front of the
thighs close to the body, knees softly bent. Black obsidian material
with glowing gold veins highlighting the hamstrings and lower back.
Normal human-sized head, smooth faceless obsidian surface, no helmet.
Dark dramatic background, 8k, square 1:1.
```

### 8. Back Extension (`backext`)
(v2 — tohle NENÍ stojící cvik, dělá se na hyperextension lavici. v1 se
zjevně vygenerovala jako stojící póza, tak je to teď popsané explicitně
i s konstrukcí lavice.)
```
Photorealistic obsidian statue, full front view. A muscular man is
positioned face-down on a stone hyperextension bench, NOT standing —
his hips and upper thighs rest on an angled pad at roughly hip height,
his ankles are locked under two fixed footpads behind him, legs staying
horizontal/braced on the bench the whole time. His torso is raised up
from a bent-forward position to be in a straight line with his legs,
back arched slightly, glutes and lower back contracted at the top of
the movement. The bench structure (angled pad, footpads, metal frame)
must be clearly visible supporting his body. Black obsidian material
with glowing gold veins along the spine and lower back. Normal
human-sized head, smooth faceless obsidian surface, no helmet. Dark
dramatic background, 8k, square 1:1.
```

### 9. Axle Deadlift (`axledeadlift`)
Same deadlift pulling motion as #1, but gripping a thick axle barbell,
forearms visibly straining with grip effort, gold veins extending into
the hands and forearms.

---

## Kategorie: SHOULDERS (Ramena)
(Obrázky pro tuto kategorii už existují v appce z dřívějška, ale prompty
se tehdy neuložily — toto je zpětná rekonstrukce podle base šablony, pro
budoucí referenci/opravy.)

### 1. Overhead Press (`ohp`)
Statue standing tall, barbell at collarbone height driving straight
overhead to full lockout, core and glutes braced, gold veins tracing up
the shoulders and arms.

### 2. Push Press (`pushpress`)
Statue mid-drive: slight knee dip, barbell exploding upward off the
shoulders with leg drive, gold veins pulsing through the legs and
shoulders simultaneously.

### 3. Log Press (`logpress`)
Statue driving a thick stone/log-shaped implement overhead from chest
height, slight dip mid-drive, gold veins concentrated across the chest
and shoulders.

### 4. Dumbbell Shoulder Press (`db_shoulder`)
Statue seated or standing, two dumbbells pressed overhead to full
lockout, gold veins tracing symmetrically up both arms.

### 5. Lateral Raise (`db_lateral`)
Statue standing, arms raised straight out to the sides at shoulder
height, dumbbells in each hand, gold veins radiating across the top of
the shoulders.

### 6. Arnold Press (`db_arnold`)
Statue mid-rotation: dumbbells transitioning from palms-in at face level
to palms-out overhead, gold veins spiraling around the shoulders.

### 7. Front Raise (`db_frontrise`)
Statue standing, both arms raised straight out in front to shoulder
height, dumbbells in each hand, gold veins tracing up the front delts.

### 8. Dumbbell Shrug (`db_shrug`)
Statue standing, dumbbells at the sides, shoulders driven straight up
toward the ears, gold veins concentrated at the traps and neck line.

### 9. Shoulder Press (machine) (`shoulderm`)
Statue seated in a shoulder press machine, back supported, handles
pressed overhead from shoulder height, gold veins across the shoulders
and upper arms.

### 10. Face Pull (`facepull`)
Statue pulling a rope attachment toward the face at upper-chest height,
elbows high and wide, rope spread apart at the end of the pull, gold
veins across the rear shoulders and upper back.

### 11. Rear Delt Fly (`revpecdeck`)
Statue bent forward or seated at a reverse pec-deck, arms wide pulling
apart, squeezing the rear delts and rhomboids, gold veins tracing across
the upper back.

---

## Kategorie: BICEPS (Biceps)
(Stejná situace jako SHOULDERS — obrázky existují, prompty zpětně
rekonstruované.)

### 1. Barbell Curl (`barbellcurl`)
Statue standing, barbell at hip level curling up to chin height, upper
arms pinned to the sides, gold veins concentrated along the biceps.

### 2. Dumbbell Curl (`db_curl`)
Statue standing tall, dumbbells at the sides curling upward, palms
facing forward, gold veins tracing up both biceps.

### 3. Hammer Curl (`db_hammer`)
Statue standing, dumbbells curling upward with a neutral grip (palms
facing each other the whole time), gold veins along the forearms and
biceps.

### 4. Concentration Curl (`db_conccurl`)
Statue seated, one elbow braced against the inner thigh, curling a
single dumbbell up to the shoulder, gold veins concentrated on the
working arm.

### 5. Cable Curl (`cablecurl`)
Statue standing at a low cable pulley, curling a bar attachment up to
chin height, upper arms pinned still, gold veins tracing the biceps
under constant tension.

### 6. Preacher Curl (`preachercurl`)
Statue with upper arms braced against an angled preacher bench pad,
curling a barbell up from a fully stretched position, gold veins
concentrated along the front of the arms.

---

## Poznámka pro další kategorie
Až budeme dělat další kategorie (SHOULDERS, BICEPS, TRICEPS, CHEST, ABS,
LEGS, CARDIO, CALISTHENICS, STRETCHING, YOGA), použij stejnou base šablonu
výše a jen doplň `[ACCENT]` pro danou akci cviku — seznam cviků je
v `finalspartan.html`, `EXERCISE_CATEGORIES` (řádek ~1005).
