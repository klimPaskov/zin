# Portraits v2 handoff

Status: wired and green for the portrait work. `verify prt` (build exit 0) passes every portrait and provenance test. Seven suite tests still fail; all are in other agents' areas (see Remaining failures). Nothing is committed.

## What changed and why

- Owner answers applied: about one character in a hundred is a woman (K54, Q-104); Black people in the southernmost lands (Q-103); no generic fallbacks, every culture has its own pool (lead brief); mycids fungal (Q-105); God Forest Keepers are spirits (Q-106); giants are primeval (Q-107); the dead are skeletal (Q-107); Yeldenne retired and Horos story only (K56).
- Owner-approved named portraits (K43, K44; Q-32 answered): Aurevan (A), Varner (A), Golbran (v6 B). Named crops: Volgan, Lorien, Bastian, Alleria, The Golden King, The King of Demons (x 430 to 1020 band of the approved design, horns and crown in frame), Kusven, Aurevan, Varner, Golbran. Ten named in total.
- Not named: Eindil (off the roster; his start-reachability gate holds), Horos (story only, K56; his head-and-shoulders crop is kept as an art source for events in `art/source/design_refs/horos_v3_c.png`).

## Prompt pattern (corrected)

- Every sheet is a 2 by 2 grid on pure black, each cell a vertical head-and-shoulders bust, taller than wide (portrait orientation, never landscape). Landscape cells failed the layout check and were regenerated.
- Human cells say "a man" (or "a woman" only in a female pool) and give explicit male cues: masculine jaw and brow, and one beard or bald crown per cell. Each cell carries its own age (about 25 to 70), hair colour and state, face shape, nose, build, mark, expression, head angle and lighting; no mark wording repeats within a sheet.
- Non-human cells use the people's anatomy from `docs/specs/08_art_and_assets/07_peoples_appearance.md` and, where the owner drew it, the owner's card as a reference (not for men). Small folk use the owner's hobbit cards (IMG_20261023_114713_1, IMG_20261023_114743).
- Islands and chart: southern islands get the Malay and Javanese look (headcloth, batik, kris, no tattoos). Chart islanders get the sailors' look from the owner's option 1, with the mainland coastal reference (`raw/portraits/reference/ref_mainland_coast.png`) passed as an image reference. The words island, shell and cowrie are not in these prompts.
- Four sheets with one failing cell were regenerated; the layout failures recorded at `raw/portraits/rejected`.

## Sizing

Pool size is `max(ceil(C/4), largest number of one realm's characters in the pool)`, so each character has a distinct portrait within its realm. The reassign check passes with 181 pools and 634 members.

## Sheets and provenance

- Generated sheets: `raw/portraits/{v2,v3,v4}` in the art store; copied to `art/source/portraits/{v2,v3,v4}` (91, 8 and 79 sheets in these directories, with the regenerated sheets).
- Provenance: one generation row and one review row per shipped sheet, in `art/source/provenance.jsonl`; the same review rows are in the art store's `jobs/provenance.jsonl`, which the gate reads.
- Owner drawings are cited by logical id `owner-drawing:<stem>`. The gate accepts a stem only when a transcription card in `docs/lore/sources/bestiary_cards_part1.md` or `part2.md` names it. All existing rows citing the drawings folder were rewritten. The scheme has a test.
- Design references: review lines added for the ten design files the named crops use (`redesign_<stem>`, reviewer owner).

## Owner decisions recorded

- Q-32 is answered by K43 and K44 in `docs/zin-handoff/OWNER-QUESTIONS.md`.
- Q-105, Q-106, Q-107 answered (see above).

## Open items and limits

- Chart islanders are the closest fit, not met: sheets 005 and 007 are closest; 004 and 006 read heavier. The owner's option 1 is not fully achieved after two attempts.
- The design references (`redesign_*` and `fig_*` rows) record the model `gpt-6-astra`, from the preview rounds. The owner's rule forbids astra for ZIN images. Not changed here; the owner should confirm whether those preview rounds stand.
- Heir coverage: all 109 heirs are in the base table in their realm ruler's culture pool. Heir cells come from the shortfall runs (v3 and v4).
- Human pools: the variety is by attributes per cell; cross-sheet beard and hair repetition is watched but not eliminated.

## Remaining failures (not portrait)

Seven suite tests fail outside the portrait work: the flag cell map and flag jobs (flags agent), `regional_varnondor` in focus_regional_d (focus agent), the leren and state-table hash tests, the migration dry run, and the build determinism hash. The build itself exits 0.

## Changed files (this work)

- `tools/content/lib/asset_sources.mjs`, `tools/content/checks/assets.mjs`, `tools/content/fixtures/assets/make.mjs`, `tools/content/assets.test.mjs` (owner-drawing scheme and test; Q-32 expectations; heir exception removed earlier)
- `tools/content/data/world/portrait_pools.base.json`, `portrait_reassign.json`, `portrait_pools.json`
- `art/source/portraits/v2`, `v3`, `v4`; `art/source/provenance.jsonl`; `docs/zin-handoff/OWNER-QUESTIONS.md`; this handoff
