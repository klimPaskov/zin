# Erdae generation notes

Erdae was rebuilt from the owner's hand-drawn sheets in a layout the owner chose (17 October 2026). On 18 October the central sea was widened, and the map now holds 305 regional countries. These are working gameplay boundaries drawn from the sheets; the canon lives in the owner's lore vault, `docs/lore/vault/`.

## Layout

The map is 5120 × 2560 pixels, the largest HOI4 accepts at this height (the engine refuses province maps above 13,238,272 pixels). Each region was cut from the original mosaic, cleaned of ink, labels and sheet joins, and placed without rotation or distortion.

| Region | Drawn sheet | Placement |
| --- | --- | --- |
| Cold Lands | Cold Lands | North-west; runs off the west and north edges; largest landmass |
| West Lands | West-Earth ("North Earth") | Joined to the Cold Lands by a natural neck; snow only near the neck |
| Triton's Islands | Tritons Islands | West of the West Lands, with added islands |
| North Lands | East-Earth ("West Earth") | Close north of the Middle Lands, as drawn |
| Dark Lands | Dark Lands | Between Lerendor and the Middle Lands, across narrow straits |
| Middle Lands | Rush Land | Centre; includes Aenor Isle (Rush Islands) |
| Magical Lands | Magical Lands | East of the Middle Lands on the same landmass, extended toward the East Lands across a rift sea |
| Zol's Mistake | Ocean of Edvoid | The whole black north: a generated wasteland landmass and black island arcs |
| East Lands | South-Earth | Mirrored; runs off the east and south edges; open water separates it from the Middle Lands |
| South Lands | (South-Earth desert) | The East Lands' southern desert |
| Dead Lands | Dead Lands | South of the Middle Lands |
| Islands of the South | Islands of The South | Arcs south of the West Lands, with added and enlarged islands |
| Lands of the Sun | Sunhot | Far south-west, original shape, running off the south edge |

### Wider central sea (18 October 2026)

The lore requires a much wider sea between the West Lands and the Middle Lands. Within the engine's area limit the owner chose to shrink the lands:

1. Every landmass was scaled to 90% by majority vote over 3 × 3 sub-samples, so coasts stay smooth and shapes are unchanged apart from the uniform scale.
2. A top-to-bottom seam through open water was found by dynamic programming over the distance to land (it never comes closer than 147 pixels to a coast), and 512 columns of sea were inserted along it. The central sea is about 80% wider.
3. The 128 rows freed at the top and bottom continue the lands that ran off those edges, from rows inside the map, with coasts drifting on smooth noise. These bands stand for the unknown lands beyond.

Name anchors, capitals and the Great Wall line pass through the same transform (`.tmp/zin-widen.mjs`, meta in `final-wide/meta.json`). Places that lay just beyond the old edges are now on the map, so Helen, The Lands of Light, Miaed, Furro and Olor became countries.

## Countries

- Each drawn region becomes a country unless the owner merged it: Kilinti with the Kilinti Forests, Lerendor with Lerenwaith, and Rush with its central homeland as Aenor, the Middle Kingdom.
- Bordon, Dreson, Dulundur, Troll Forest, Nolorim and Herez are separate countries at the owner's request.
- The owner added the Magical Forest elven realm, Afrit's small hidden seat, the Worshipdom (Zilin Hills, Magical Lands; his real power is the Hidden Council inside Aenor), and Horos's Castle of Yeldenne (Mp'E, frozen north of the Cold Lands).
- Zol holds every province of the black north. Volgan holds the Dead Lands' interior; Demon, Dolon and Nezer are its puppets; Mirolon is its rival.
- Aenor rules its homeland and holds 26 Middle Lands puppets, among them Selen, Kilinti, Kingson, Hiloron, Konori, Hunhun, Asgard and Herez. Cursed Lands and Bloody Forest stay independent.
- The Great Wall of Aenor (the brown band drawn from the Organ Mountains past Lunhrim and around Kingson) is a hard border between Middle Lands and Magical Lands countries.
- Every mainland country is one connected piece; island possessions are allowed, and a small island has one owner.
- Eight drawn polities still lie beyond the map or more than 90 pixels from land: Tumo, Lands of Burning Men, Morodor, Shindor, Shachihata, Surla Islands, Poolho Cold Lands and Crepon Islands.
- Each country has a people, an ideology and a stance from the owner-editable table `docs/design/countries.csv`; rows match by country name, because tags follow the politics order.
- Named rulers follow the lore: the Golden King (Aenor), Volgan, Zol, Afrit (Worshipdom), Horos (Yeldenne) and King Lorien (Gala Elves). Other rulers carry generated regional names.

## Capitals and settlements

A capital is a drawn city label inside the country where one exists. Otherwise it, and every unnamed victory-point settlement, gets a name generated from syllables of the same sheet's drawn names. No such name carries an antagonist's name (Zol, Volgan, Afrit, Edvoid), a region's name, an old name (Rush, Klinti, Sunhot) or a near-copy of a drawn name. Generated names are placeholders the owner can replace.

## States and buildings

Generated states are split along country borders (729 become 1,332), with population, resources and factories conserved. Capital states have building slots for their factories. Each building position moves to the state that holds its province. Every state has its own air base, anti-air, factory, silo, reactor, radar, rocket site, stronghold and refinery positions, and every coastal state a dockyard position; dockyards never stand in a state without coast.

## Art

Every picture is image-generated (owner rule, 17 October 2026): flags (20 sheets of up to 16), people emblems, character portraits (two of each sex per people) and the interface frame, buttons and divider. Code only finds the painted items on each sheet, crops, resizes and converts them. The source sheets and their prompts, model, size and hashes are kept under `art/source/` with `provenance.jsonl`.

## Reference image

The generator caps its working reference at 3,072 pixels. A private loader hook (`ZIN_FULLRES_REFERENCE`) passed the full 5,120 × 2,560 cleaned image, `docs/reference/cleaned/Erdae-clean-v3.png`, to the product's own extraction after checking its hash. Geography, provinces, states, regions and rivers came from one `hoi4.map_rewrite` call; politics were written afterwards through the shared atomic rewrite engine, because `create_world` accepts at most 200 countries.

## Limitations

- Starting as Aenor crashed the Linux game at launch in every run up to 17 October; Lerendor, Zol and Selen started fine. Removing Aenor's faction and puppets did not change it. Status on the widened map: see the latest acceptance note in `provenance.json`.
- Population, resources, industry and drainage remain deterministic assumptions (seed 73).
- No events, focuses or decisions are authored yet.
- Province geometry review warnings (holes and one-pixel corridors) remain; offline validation passes.
