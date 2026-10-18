# Map accuracy

**Status:** Ready. **Priority:** 1. **Phase:** 1.

## Purpose

The map is the stage for every mechanic. Each lore fact that has a place on the map must be true on it, or recorded here as an accepted difference. This spec lists those facts, what the map shows today, and what to change.

## Sources

- Lore vault: *Erdae and Its Regions*, *Middle Lands and Aenor*, *Great Powers and Relations*, *Fourth Age Map of Erdae*, *Volgans Dead Lands*, *Zols Mistake*, *Castle of Yeldenne and Glo* and the owner's corrections of 17–18 October 2026.
- Map today: `docs/generation/assumptions.md`, the politics output and `localisation/replace/world_l_english.yml`.

## How to change the map

Geography (land, sea, provinces, states, strategic regions) changes only through the HOI4 Agent Tools map rewrite with the full-resolution reference; politics (owners, capitals, names) through the politics step; both write through the shared rewrite engine. Names that are only localisation go through the content builder. After any change, rerun the five map checks and the Linux start test.

## Region and geography facts

| # | Fact (lore) | Status of fact | Map today | Result | Action |
| --- | --- | --- | --- | --- | --- |
| G1 | 13 regions: Cold Lands, West Lands, Triton's Islands, North Lands, Dark Lands, Middle Lands, Magical Lands, Zol's Mistake, East Lands, South Lands, Dead Lands, Islands of the South, Lands of the Sun | established | All present as landmasses | matches | Name them in game (see N1) |
| G2 | Aenor Isle is part of the Middle Lands | owner, 17 Oct | Asgard is an Aenor satellite on the isle | matches | none |
| G3 | The central sea between the West Lands and the Middle Lands is much wider than drawn | owner | 512-column sea inserted; lands scaled to 90% | matches | none |
| G4 | Zol's Mistake is the whole black north and every black island of the Ocean of Zol | owner | Zol owns 104 states including the black lands of the Magical Lands sheet | matches | Confirm the Magical Lands black areas (Dlomntod, Medek, Lost Lands) belong to the Mistake; ask the owner if unsure |
| G5 | The Great Wall of Aenor separates the Middle Lands from the Magical Lands; no Aenoran "horn" into the Magical Lands | owner, 17 Oct | Hard political border on the traced wall line | partly | The wall is only a border. Add a named fort line: a level-5 fort in every wall-side province on the Aenor side, and the wall as a map label |
| G6 | The Cold Lands reach off the west and north edges; the East and South Lands off the east and south edges | established | Edge bands extruded | matches | none |
| G7 | Dead Lands are hot, storm-girt and hard to reach by sea | established | Ordinary terrain | missing | Desert and hills terrain inland; a permanent storm or attrition modifier on Dead Lands coastal sea zones (mechanic in [03_gameplay/04_magic_and_world_systems.md](../03_gameplay/04_magic_and_world_systems.md)) |
| G8 | Zol's Mistake is a barren wasteland, sparsely populated, roamed by the dead | established | 104 states with generated population | check | Population and infrastructure near zero outside Furviatlon; wasteland terrain; no resources except what the mechanic adds |

## Seats of power

The vault's working table names a seat for each great power. Several map capitals differ.

| # | Power | Lore seat (working table) | Map capital today | Result | Action |
| --- | --- | --- | --- | --- | --- |
| S1 | Aenor | Parim | Parim | matches | none |
| S2 | Lerendor | Sonargur | Sonargur | matches | none |
| S3 | Coldor | Fandanar | Fandanar | matches | none |
| S4 | Noris | Furvior | Furvior | matches | none |
| S5 | Stabilo | Postondoroth | Fudol (Postondoroth exists elsewhere) | differs | Move Stabilo's capital to the Postondoroth victory point, or rename; Postondoroth must be in Stabilo's territory |
| S6 | Goldoroth | Cocanoor | Fabdernor | differs | Rename the capital victory point to Cocanoor |
| S7 | Dondor | Notbuton | Dunnoor | differs | Rename to Notbuton |
| S8 | Volgan | Nafeher | Neleelon | differs | Rename to Nafeher |
| S9 | Zol's Mistake | Furviatlon | Fobuler | differs | Rename to Furviatlon |
| S10 | Worshipdom | Zilin Hills (Afrit's hidden seat) | Lenlakron, Zilin Hills region | matches | Keep the Zilin Hills as the state name |
| S11 | Castle of Yeldenne | Mp'E, frozen north of the Cold Lands | Simoto, region Mp'E | partly | Rename the capital victory point **Castle of Yeldenne**; the state **Mp'E** |
| S12 | Magical Forest, Gala elves, Mirolon | not named in the table | Memate, Sodoli, Miherta | accepted | Generated names stand until the owner names them |

Seat names not drawn on the original maps are constructed and replaceable (vault); a rename here does not make them canon.

## Key sites

Sites that lore or mechanics need. Detail and requirements per site in [02_key_sites.md](02_key_sites.md).

| # | Site | Lore | Map today | Action |
| --- | --- | --- | --- | --- |
| K1 | The Great Lake | established, Aenor's heartland | map label | Victory point cities around it in Aenor's states |
| K2 | Dragon Mountain | established, home of dragons; not a country | map label | Make it a named state with no owner rights issue: owned by the nearest elven realm, with the dragon mechanic anchored there |
| K3 | The Abyss | established, Dead Lands, Roka's domain | label; state "Vez Nan / Abyss" in Volgan's realm | Split or rename so a state is called the Abyss |
| K4 | The Nether | established, south of the Dead Lands, seat of the King of Demons | label | A named state; decide owner (Volgan or a demon realm) per the mechanics spec |
| K5 | Dardan | established battle of the First Age; place open | missing | Do **not** place until the owner decides; the vault lists its location as open |
| K6 | Organ Mountains and Lunhrim | owner, Great Wall description | missing | Map labels at the wall's ends |
| K7 | Castle of Yeldenne | established, Cold Lands | state Mp'E | See S11 |
| K8 | Šodolôrō | established, in Zol's Mistake | region label | A named victory point |
| K9 | Mirolon's passes | proposed (the gate Volgan must take) | none | Forts on Mirolon's northern border |
| K10 | Zilin Hills | established (Worshipdom) | state | matches |

## Names players see

| # | Item | Today | Action |
| --- | --- | --- | --- |
| N1 | Strategic regions | "Region 1" … "Region 275" | Name every strategic region from the drawn labels in its area; sea regions by drawn sea names (Pupor Ocean, Sea of Darkness, Ocean of Zol, Sea of Gods…) |
| N2 | Superseded names (Edvoid, Rush, Klinti, Sunhot as a place) | absent from localisation; present in internal file names | Rename internal strategic region files when they are regenerated; no player-facing change needed |
| N3 | Generated placeholder names | settlements and some capitals | Keep until the owner names them; never use an antagonist's or region's name |

## Acceptance

- Every row above is "matches", "accepted" or has a recorded owner decision.
- The five map checks of the map rewrite pass.
- The Linux run starts a campaign as Aenor, Volgan, Zol, Lerendor and the Magical Forest.
- A render of the political map with region names is attached to the phase report.

## Open questions for the owner

1. Do the black areas on the Magical Lands sheet (Dlomntod, Medek, Lost Lands) belong to Zol's Mistake?
2. Where is Dardan? Where are the Organ Mountains and Lunhrim exactly?
3. Who owns the Nether at the start: Volgan, or the King of Demons as a separate realm?
4. Should Mirolon also hold lands on the Magical Lands sheet (it does today)?
