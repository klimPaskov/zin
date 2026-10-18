# Conventions

These rules apply to every spec and every implementation in ZIN. Where a spec needs an exception it says so explicitly.

## Lore

- The lore vault is canon. Follow its Canon Policy: **established** facts are fixed; **proposed** ones are drafts until the owner adopts them.
- Label every new name, date or mechanism a spec introduces as *proposed*.
- The start situation is fixed: the Golden King reigns, Eindil has not appeared, Afrit is unrevealed, and Erdae seems at peace.
- Never invent facts the vault explicitly leaves open where they would close a question for good (for example, who governs Zol's Mistake for Zol, or whether Volgan's spirit survives). Gameplay may offer outcomes, but the text must not state them as history.
- Use the canonical spellings: Eindil, Zol's Mistake, Aenor, Šodolôrō. Avoid superseded names (Einendil, Edvoid, Rush) in anything players see.

## Countries and identifiers

- Countries are identified by **name** in specs and generator data. Tags (`Y01`…) follow the politics step and can change when the map changes; generators resolve names to tags at build time.
- Every ZIN identifier starts with `zin_`. Focus ids are `zin_<tree>_<key>`, ideas `zin_<scope>_<key>`, events `zin_<namespace>.<n>`, flags `zin_<scope>_<name>`, variables `zin_<scope>_<name>`.
- The four engine ideologies keep their keys and are re-themed: `democratic` = Light, `fascism` = Dominion, `communism` = Shadow, `neutrality` = Wild.
- Peoples are country flags `zin_people_<key>` and ideas of the same name.

## Writing files

- Game content is produced by the deterministic ZIN content builder and written to the mod in one atomic transaction through the shared rewrite engine. Never hand-edit generated files; change the generator or its data.
- Maps, states and countries come from HOI4 Agent Tools map and politics steps.
- Never launch, automate or capture the Windows game. Game verification is the isolated Linux run under the shared WSL lock.

## Art

- Every picture is image-generated. Code only slices, resizes and converts generated images. Record every generation in `art/source/provenance.jsonl`.
- 3D models come from Meshy through the app-owned launcher route, following the kit's 3D pipeline.
- Never copy assets, text or scripts from other mods, including the Lord of the Rings mods. Study them for design only.
- The owner's original drawings stay private and out of the repository.

## Text

- Player-facing text is short, concrete and in plain English. One idea per sentence.
- Localisation is UTF-8 with BOM, limited to characters the game font draws (Windows-1252).
- Names of focuses, ideas and events are title-cased; descriptions are one to three sentences.

## Specs

- One topic per file. Start with a status line, then purpose, lore basis, design, implementation, acceptance and open questions.
- Numbers in a spec are design targets. Implementation may tune them and records the final values in the spec.
- Cross-link related specs with relative links.
