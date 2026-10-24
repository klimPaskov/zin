# Names traceability

Every canonical rename, with its old name, what was renamed, and where the old name still legitimately appears. Owner decisions are in `docs/zin-handoff/01-CONTEXT-AND-CANON.md` section 2 and `docs/specs/INTEGRATION_DECISIONS.md`; the vault's retcon register is `docs/lore/vault/09 - Development/Names and Retcons.md`.

## 1. The exchange of Erdae and Aoaz (owner decision, 24 October 2026)

| Old name | New name | Meaning |
| --- | --- | --- |
| Erdae; Arda on the bestiary cards | **Aoaz** | the main setting of ZIN: its land, peoples, kingdoms, gods and history |
| Aoaz | **Erdae** | the small neighbouring continent, with its own magic, history and identity |

Only the names changed; no land, people or history moved between the two continents.

**Method.** `tools/migrations/aoaz_name_exchange.mjs` (tests: `aoaz_name_exchange.test.mjs`) ran on 24 October 2026 in three phases: main-setting Erdae to a temporary token, neighbour Aoaz to Erdae, the token to Aoaz. The dry run and the applied run gave the same counts: **309 files, 1,720 occurrences, 5 neighbour occurrences, 14 renamed paths** (record: `tools/migrations/aoaz_name_exchange.applied.json`). The build's text scan carries the rules `bw_setting_names_001` (Erdae) and `bw_setting_names_002` (Arda): any staged text that says Erdae fails the build unless an allowance says the text means the neighbour.

### 1.1 Renamed paths

| Old path | New path |
| --- | --- |
| `docs/lore/vault/01 - Cosmology/Magic and Sustenance in Erdae.md` | `.../Magic and Sustenance in Aoaz.md` |
| `docs/lore/vault/04 - Peoples/Peoples of Erdae.md` | `.../Peoples of Aoaz.md` |
| `docs/lore/vault/05 - Geography/Erdae and Its Regions.md` | `.../Aoaz and Its Regions.md` |
| `docs/lore/vault/05 - Geography/Fourth Age Map of Erdae.md` | `.../Fourth Age Map of Aoaz.md` |
| `docs/lore/vault/07 - History/Ages of Erdae.md` | `.../Ages of Aoaz.md` |
| `docs/lore/vault/07 - History/The First Age of Erdae.md` | `.../The First Age of Aoaz.md` |
| `docs/lore/vault/07 - History/The Second Age of Erdae.md` | `.../The Second Age of Aoaz.md` |
| `docs/lore/vault/07 - History/The Third Age of Erdae.md` | `.../The Third Age of Aoaz.md` |
| `docs/lore/vault/07 - History/The Fourth Age of Erdae.md` | `.../The Fourth Age of Aoaz.md` |
| `docs/maps/Erdae-continents.png` | `docs/maps/Aoaz-continents.png` |
| `docs/reference/cleaned/Erdae-clean-v1.png` to `v3.png` | `docs/reference/cleaned/Aoaz-clean-v1.png` to `v3.png` |
| `tools/content/data/geography/erdae.json` | `tools/content/data/geography/aoaz.json` |

Vault wiki links (`[[Erdae and Its Regions]]` and the like) were rewritten with the same exchange, so they still resolve.

### 1.2 Renamed identifiers

Builder and game identifiers that carried the name, before the next build regenerates the game files from them: `zin_erdae_bar` (and `_window`, `_panel`, `zin_erdae_bar.gui`, `zin_erdae_bar.txt`) to `zin_aoaz_bar...`; `zin_afrit_claims_erdae` to `zin_afrit_claims_aoaz`; `zin_afrit_tt_erdae` to `zin_afrit_tt_aoaz`; `lord_of_all_erdae` and `zin_wsd_lord_of_all_erdae_name`/`_desc` to `..._aoaz`; `erdae_is_shared`, `erdae_world`, `care_for_erdae`, `magic_of_erdae`, `zin_magical_forest_erdae_shared` to their `aoaz` forms; the default name pool key `zin:all-erdae` to `zin:all-aoaz`; the Chronicle entry `erdae_1748` to `aoaz_1748`.

### 1.3 Where the old names still appear, and why

| Where | Why |
| --- | --- |
| `C:/Users/klimp/Documents/ZIN/World/Erdae/` and its files (`Erdae Full Colored Map.png` ...), `docs/reference/originals/Erdae.png`, `Erdae-working.jpg`, the vault's private `Maps/Fourth Age - Erdae (reference).png` | the owner's private originals keep their file names; every reference to these paths keeps the old name |
| `docs/zin-handoff/` | the handoff package describes the exchange and uses both names on purpose |
| `docs/generation/` | records of the 11 to 18 October map generation (requests, request keys such as `erdae-world`, handoffs) keep their wording |
| `docs/lore/vault/Sources/`, `docs/lore/sources/` | source snapshots and transcriptions keep the source wording, with notes |
| `art/source/provenance.jsonl` | the provenance log records the exact prompts that were sent |
| game files under `common/`, `localisation/`, `gfx/`, `interface/`, `tutorial/` and `.zin-content.json` | build output of the last apply; the next build and apply regenerate them from the migrated sources |
| `C:/Users/klimp/Downloads/ZIN_Lore_Vault` | the owner's copy of the vault is not edited; the mod's `docs/lore/vault/` is the maintained copy and differs from it from 24 October 2026 |
| the politics step `C:/Users/klimp/Documents/Projects/hoi4-agent-tools/.tmp/zin-politics-v4.mts` | moves into the mod as `tools/politics/` with the map tranche and is migrated there |
| "The Path to Erdae" (`docs/name_table.*`, `docs/specs/01_map/05_geography_overlay.md`) | the drawing's route note in the north of the Cold Lands, toward the neighbouring continent: the one place where the old label already meant the neighbour |

## 2. Vez'nan is Volgan (owner, 24 October 2026)

Vez'nan (also Vez'nanit, any spelling with "veznan") is an old name of Volgan; every reference means Volgan. No text in the repository used it as a name for Volgan. The owner's drawing carries the place labels **Vez Nan** (the island realm of Nan and "the hills of Vez Nan", the state label "Vez Nan Abyss") that the old map and the regional tree `docs/design/focus/regional_nan.json` use. Those labels are renamed with the map and roster rebuild (tranches T2 and T3); this table records the new names when they are chosen. Archaic in-world use of Vez'nan, if any, is labelled proposed.

## 3. Edvoid gets a new name (owner, 24 October 2026; question Q-10)

The new name is not chosen yet. Current occurrences: the drawing's sheet and sea label "Ocean of Edvoid" (strategic regions 256 and 262 of the old map, the AI theatre `zin_theater_ocean_of_edvoid`), the state labels "Edvoids Mistake" and "Edvoids Mistake Teste" of the old map, the bestiary card (index 63). They are renamed when the owner accepts the proposed name; this table records it.
