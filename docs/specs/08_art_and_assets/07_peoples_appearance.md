# Peoples' appearance and portrait direction

Status: working specification for the portrait pools and named portraits, from the owner's note of 25 October 2026 (decision K54) and the lead readings Q-103 and Q-104 in `docs/zin-handoff/OWNER-QUESTIONS.md`. It binds every generated character portrait and every creature picture that shows a person of a named people.

## 1. Rules that bind every prompt

- Owner drawings are the primary design. The owner's private drawings (`C:/Users/klimp/Documents/ZIN/World/Erdae/Drawings/`, transcribed in `docs/lore/sources/bestiary_cards_part1.md` and `part2.md`) are passed to the generator as image references. The look is kept (features, proportions, horns, tusks, hides, scale cues) and only the finish changes to the mod's painted style. The drawings are never copied into the repository and never embedded in a committed image.
- Non-humans are never human faces under a recoloured skin. Each non-human sheet states the inhuman features first and forbids "a human face with recoloured skin".
- Scale is visible inside the frame for beings far from 1.8 m (see section 3).
- Elves and sun elves are never dark-skinned.
- Demons are withered and inhuman, with ugly teeth, following the owner's demon and devil drawings. The pentagram is the only allowed religious-looking symbol; a cross is never used (K26).
- Faces are individual and imperfect: age spread, scars, weathering, missing or bad teeth, asymmetry. No two members of a pool share a face.
- Every picture is one of the owner-approved styles. Text, frames, borders, signatures, watermarks and a second figure in a portrait are rejected.
- Named figures keep the approved design (`art/source/design_refs/design_refs.json`). A named portrait is cut from its approved design reference, never from a new generation (K43 to K45). The crop keeps the horns, crown or head and the shoulders inside the 156 x 210 frame.

## 2. Demographics

- Women: about one character in a hundred is a woman (owner answer, lead brief). Only canon women such as Alleria have a female portrait; the human pools are planned as male pools, and the rebalance agent moves characters accordingly.
- Black people (Q-103, owner answer): they appear in the southernmost lands of the mainland (the South Lands and the far south), as the majority look of those southernmost realms where their culture data supports it. Each realm's choice is decided from its culture data and recorded in the handoff. They never appear among elves, dwarves or other non-human peoples, and they are not used as a default look for other realms.
- No generic fallbacks: every people and every culture that has characters has its own portrait pool. No culture borrows another culture's pool, and no people keeps only the legacy two-per-people portraits.
- The islands of the south look Indonesian in the real-world sense: brown and tan skin, dark straight hair, rounder faces, and sarong, batik and wooden jewellery dress. This is a regional look, not a stereotype of any individual.

## 3. Scale cues

A portrait frame has no ruler. Every being far from 1.8 m carries a cue inside the frame.

- Giants, trolls and other beings over ten metres: the head fills the frame from a low, upward vantage; a single 1.8 m man stands at the lower edge beside the face or the shoulder, showing the scale. The owner's card sizes are the reference.
- Dwarves, small folk and gnomes: a hand, a tool or a doorway at human scale sits beside the face.
- Coniferons and ents: branches and crowns fill the frame; a man at the base reads as tiny.

## 4. Anatomy sheets

Each people below has an anatomy sheet, the owner drawing used, the scale rule and the things it must NOT look like. Card numbers are the indices of `bestiary_cards_part1.md` and `part2.md`.

### Men (human)

- Owner references: the drawings of humans (card 27, IMG_20261023_114512, a human), the Horos cards are for named figures only.
- Scale 1.8 m. Skin and features by region, not one default face. Hair, beards, dress and wear are individual.
- Must not look: a perfect model face, the same face twice in one pool, an idealised face with unblemished skin.

### Elves (`elves`) and sun elves (`sun_elves`)

- Owner references: card 1 (pointed-eared portrait, IMG_20261023_112750) for elves; cards 49 and 50 (angels, pointed ears like the sun elves, IMG_20261023_115434 and 115459) for sun elves.
- Scale over 3 m for sun elves (the owner note on the angels), elves human-tall.
- Skin: pale to tan, never dark. Long pointed ears, long narrow face, large eyes, fine bones, ageless but lined faces for the old.
- Must not look: dark-skinned, orcish, or human with a point on the ear.

### Dwarves (`dwarves`)

- Owner references: cards 43 and 44 (IMG_20261023_115127 and 115139): broad, stocky dwarf with a very long, thick beard, broad nose, deep-set eyes, iron helm.
- Scale 1.3 to 1.5 m (owner card). Wide shoulders, short thick limbs, heavy brow.
- Must not look: a scaled-down human face. The jaw and brow are heavier and the nose is broad.

### Small folk, halflings and hobbits (`small_folk`)

- Owner approval (verbatim, lead message): "yes, for halfing, and for hobbit use my reference drawings". Every small-folk and halfling portrait is generated with the owner's cards IMG_20261023_114713_1 and IMG_20261023_114743 as image references, keeping their design.
- Design from the cards: large pointed ears, a broad short face of its own proportions (not a human face), wide cheeks, a broad nose; about 1.0 to 1.3 m tall; bare hairy feet when shown; cloaks over simple farm clothing.
- Farm life, not the film hobbits: harvest, sheaves of wheat, baskets, aprons, straw hats. No pipes, no tankards, no waistcoats, no curly hair set.
- Must not look: a human child, a dwarf, a film hobbit, a human face with a fringe.

### Gnomes (`gnomes`)

- Owner references: cards 37 and 38 (IMG_20261023_114948 and 115007): small old gnome, long grey-white beard, ruddy wrinkled face, small blue eyes, pointed ears, reddish pointed cap with a yellow tassel.
- Scale 0.7 to 1 m. Beard, cap and wrinkles, a small sly face.
- Must not look: a bearded dwarf or a human elder.

### Orcs (`orcs`)

- Owner references: cards 19 and 20 (IMG_20261023_113815 and 113829): heavily built warrior, brow ridge, tusks, scimitar, brown tunic.
- Scale 1.6 to 2.1 m. Green to olive skin, grey-green, dark or patchy; heavy brow and jaw; lower canine tusks; flat broad nose; pointed ears.
- Must not look: a handsome human with green paint. The brow and jaw are the defining features; the face is never symmetric.

### Goblins (`goblins`) and hobgoblins (`hobgoblins`)

- Owner references: goblins cards 35 and 36 (IMG_20261023_114920 and 114932): stocky goblin, olive-green mottled skin, round head, short spiky hair, two short pointed ears, bow and quiver. Hobgoblins cards 28 and 29 (IMG_20261023_114625 and 114636): goblinoid with wooden mallet, hobgoblin with spiked helm.
- Scale 1.4 to 1.8 m for goblins; hobgoblins larger and heavier.
- Must not look: an orc, an elf with green skin, or a human child.

### Dwarf goblins (`dwarf_goblins`)

- Owner references: cards 41 and 42 (IMG_20261023_115056 and 115110): short, stout, bright green skin, very long pointed ears sweeping outward, broad face with a long nose and a grimacing mouth, tall flat-topped black cap, orange cape.
- Scale 0.7 to 1 m.
- Must not look: a small human or a dwarf.

### Trolls (`trolls`)

- Owner references: cards 58 and 59 (IMG_20261023_115945 and 115955): forest troll with a club, huge hunched body, grey-violet rock-textured skin, small head sunk between massive shoulders, small yellow eyes, heavy brow, small open mouth with short yellow tusks. Cards 13 and 14 (IMG_20261023_113634 and 113642): Smash, king of the trolls, green-brown, heavy jaw, small eyes, metal wrist cuffs.
- Scale: 15 to 18 m for forest trolls, 112 m for Smash (the card). Very large. The scale cue is required.
- Must not look: a human-size muscular man, a bodybuilder, a human head with grey skin.

### Giants (`giants`): primeval giants

- Owner answer Q-107: primeval giants, huge, heavy-browed, craggy beings with stone-like hide, cracked grey rock plates, moss and lichen on the brow and shoulders, a massive lower jaw and small deep-set eyes. Not built on the rhino-headed or Roka cards; no owner drawing is passed to the generator for giants.
- Scale over 10 m. Tiny men, trees or houses stand around the face to show the size.
- Must not look: a rhino head, a tall human, a human with a bigger head.


### Ogres (`ogres`)

- Owner references: cards 21 and 22 (IMG_20261023_114228 and 114246): ogre with a club, half-crouch, like a giant orc, resembles a troll but is smaller.
- Scale 2.8 to 3.5 m. Heavy, sloping brow, large lower tusks, coarse skin, pot belly.
- Must not look: an orc, a troll with a human face.

### Yeti (`yeti`)

- Owner references: card 23 (IMG_20261023_114259, dark ape-like creature) and cards 54 and 55 (IMG_20261023_115711 and 115738, shaggy giant beast, black fur, red eyes, jagged teeth).
- Scale: large, shaggy, round-shouldered. Fur covers the face except for red eyes and a fanged mouth.
- Must not look: a bearded man, a human with a fur hood.

### Tree people (`tree_people`) and ents (`ents`)

- Owner references: cards 39 and 40 (IMG_20261023_115024 and 115040), Coniferon: green crown, brown trunk body, branch arms, skin not quite wood but softer, yellow eyes and mouth.
- Scale 10 to 30 m. Crowns and branches fill the frame.
- Must not look: a man with bark makeup, a man with leaves in the hair.

### Demons (`demons`)

- Owner references: cards 47 and 48 (IMG_20261023_115403 and 115416): red, emaciated, two short black horns, large pointed ears, wide mouth full of jagged fangs, ribs, long thin red arms, bat wings. Card 51 (IMG_20261023_115516): demon devouring a creature, brow ridge and spines. Cards 5 and 17 (IMG_20261023_113042 and 113707): Satan, very muscular red demon with curved black horns, dark beard, bat wings, 9.8 m (scale cue needed).
- Scale 3.6 to 5 m, Satan 9.8 m.
- Withered and inhuman: sunken eyes, skin cracked or stretched over bone, teeth broken and ugly, tongue lolling, horns, spines. The pentagram is allowed; a cross is never used (K26).
- Must not look: a red-skinned muscular human with a handsome face, a human with makeup.

### Devils (`netherborn` and `nether_houses`, drawn as devils)

- Owner references: cards 45 and 46 (IMG_20261023_115223 and 115319): skeletal, gaunt devil with ram horns, grey bone, fang grin, torn bat wings. Card 46 shows a red-skinned emaciated humanoid with ribs. Scale 20 to 30 m for the skeletal devil (card 45 gives 25 m).

### The dead (`the_dead`): skeletal

- Owner answer Q-107: the dead are skeletal, armoured skeletons, mostly bone, not rotting corpses and not spectral. Not built on the Elzon or Edvoid cards; no owner drawing is passed to the generator for the dead.
- Variety (lead rejection of the first sheet): crowned skulls with broken iron crowns, bare skulls with cracked crests, helmed skeletons, broken jaws, rotted crests of plumes, mail coifs; armour of plate, mail, robes of rank with gold grave-cloth, lamellar scale, tattered mantles; head angles three-quarter, tilted back, straight on, bowed, profile; grave-light green, pale blue, amber and cold grey dawn.
- Scale human-size. Skull with empty eye sockets, bared teeth, rusted or dark armour plates and grave cloth on the bone.
- Must not look: a rotting corpse, a spectral figure, a pale living person.

### Spirits (`spirits`) and God Forest Keepers (`god_forest_keepers`)

- Owner references: card 60 (Elzon, a hooded figure before a purple vortex) and card 56 (Gektor, a one-eyed hooded figure with a staff). Great spirits are always magical beings, not men in costume.
- Owner answer Q-106: God Forest Keepers are forest spirits, magical and never fully human-shaped, not elves. Their pool is a spirit pool.
- Scale 3 to 4 m. A hood with a void or one eye, bark or leaf-like wisps, glowing eyes; no human features.


### Mycids (`mycids`)

- Owner answer Q-105: fungal humanoids, gill-lined grey-brown skin, cap-like fungal growths on the head, mycelium threads hanging in place of hair, spore-dust, pale eyes. No human face. The mycids live in the Mushroom Forest (vault, Peoples of Aoaz).

### Southern islands and chart islanders (owner answer; lead rejection of human sheet v2h_men_005)

- The islands of the south look Malay and Javanese (Indonesian-like): warm brown skin, a rounder face, a broad nose and a soft brow, dark hair under a headcloth or songkok, batik-like cloth, a kris at the belt, island jewellery. No Polynesian or Maori tattooing on the face or body.
- Chart islanders (`chart_islanders`): their realm characters resolve to the mainland, so they take the chart look, not the southern islands look: sea-weathered tanned faces, cord and shell jewellery, no tattoos.

## 5. Open items

- Giants and the dead have no owner drawing (owner answers Q-107). The generator receives their written anatomy only; the owner checks the sheets.
- Mycids (Q-105) and God Forest Keepers as spirits (Q-106) are recorded as owner answers; the mycid and spirit sheets follow them.
- Yeti and card 54 are assumed to be one people; recorded for the lead.
