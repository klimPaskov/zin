# The Chronicle of Aoaz: brief for entry authors (lane W9)

This brief is for the agents who write the entry text of the Chronicle of Aoaz, the in-game codex of ZIN (a Hearts of Iron IV total conversion set in the world of Aoaz).
The builder (`tools/content/modules/chronicle.mjs`, written by the lane owner) turns your JSON into localisation, scripted triggers and the window.
You write only your own entry files under `tools/content/data/chronicle/entries/`.
Do not edit any other file, do not run git, do not run the full build.

## Read first

1. The spec: `docs/specs/07_interface/04_chronicle_codex.md`, in full: section 1 (voice rules), section 3 (entry layout), section 6 (unlock rules), section 7 (text limits), section 10 (entry data), section 12 (checks), section 13 (the entry list: your categories' tables and the "Hard cases"), and "Lore basis" with the list of open questions that the text must never close.
2. The vault's `docs/lore/vault/Canon Policy.md`, then every vault note your categories' Sources column names (paths under `docs/lore/vault/`). The vault is canon. Use Eindil, never Einendil.
3. For story flags: `docs/specs/04_mechanics/00_shared_contract.md` and `docs/specs/04_mechanics/00_contract_additions.md` (what each flag means), and `docs/specs/02_lore/03_names_and_terms.md` (public and true labels).

Owner decisions newer than the spec, which override it:

- K29 and K55: the Great Spirit once called Edvoid is named **Kusven** (Leren, "the grave-wind"), and Kusven is named from the start; the sea north of Zol's Mistake is **Kusmeel**. Never write Edvoid. (The spec's ban on "Kusven" is outdated.) No body of water is called an "Ocean".
- K7: Vez'nan is an old name of Volgan; always write Volgan.
- K56: Yeldenne is a small town in the far north of the Cold Lands with the Castle of Yeldenne; it is not a realm or a country. Horos sits in the castle with Glo.
- K13: Hirolon (never Hiloron) is a sovereign giant kingdom.
- S11: write Šodolôro (the font has no ō). Only Windows-1252 characters.

## Output format

One file per category: `tools/content/data/chronicle/entries/<category key>.json`, UTF-8 without BOM, two-space indentation:

```json
{
  "category": "order",
  "entries": [
    {
      "id": 101,
      "key": "he_who_was",
      "title": "He Who Was, Is and Will Be",
      "short": null,
      "title_after": null,
      "subtitle": "Before the Ages · Order of Being",
      "plate": null,
      "unlock": "start",
      "parts": [
        {
          "when": "start",
          "paragraphs": [
            { "text": "…", "status": "established", "sources": [ { "note": "01 - Cosmology/He Who Was, Is and Will Be.md", "section": "He Who Was, Is and Will Be" } ] }
          ]
        }
      ],
      "related": [ "holy_seven", "order_of_being" ],
      "secrets": []
    }
  ]
}
```

Fields:

- `id`, `key`, `title`, `unlock`: exactly as the spec table (section 13). The bracketed name in the Title column is `short` (the list title, at most 28 characters); otherwise `short` is null. A title with "; after X: Y" becomes `"title": "<first>"` and `"title_after": { "when": "<X>", "text": "<Y>" }`.
- `subtitle`: "Era · Kind" (the middle dot is U+00B7), for example "Second Age · Event", "Fourth Age · Great Spirit", "Before the Ages · Order of Being". One line, at most about 50 characters.
- `plate`: from the spec's Plate column: `null` for "cat"; `{ "subject": "<the subject words of the column>" }` for a described subject; `{ "reuse": "<catalog key>" }` for "reuse `key`". If an entry's later part changes the plate (the column says "plate `x`"), add `"plate_after": [ { "when": "<cond>", "plate": "x" } ]`.
- `parts`: the first part has `when` equal to the entry's `unlock`. Each later part of the "Later parts" column is its own part with its own `when`. A later part's condition must include the entry's own unlock condition (write it out, for example unlock `F:zin_eindil_awake` and a later part `F:zin_eindil_awake, heir`). Divergent outcomes get their own parts.
- `paragraphs`: each `{ text, status, sources }`; `status` is `established`, `proposed` or `mixed` (a `mixed` paragraph adds `"note": "<which clause is proposed>"`). `sources` cite the vault note path relative to `docs/lore/vault/` and the exact heading text (without the #) of the section the paragraph uses; for a note without sections use the note's title heading. Cite every section you used; the builder adds the hashes.
- `related`: up to four keys of other entries (any category, keys from the spec tables).
- `secrets`: the secret classes the entry's text touches anywhere: `afrit`, `heir`, `glo`, `story`.

### Conditions

`start`; `F:<global flag>`; `rev` (= `F:zin_afrit_revealed`); `hub` (the viewer is the Worshipdom); `heir` (the heir's name is public to this viewer); `S>=n` (Eindil's journey stage, `global.zin_eindil_stage` at least n); `D:<loop>` (fallen-realm category only: the viewer has passed the knowledge gate of that realm: `low_country`, `two_shores`, `kalioth`, `sea_doors`, `sea_roads`, `ice`); combined with `,` (and), `|` (or) and parentheses. Use only flags the spec table or the contract documents name.

## Length and characters

The page is 432 pixels wide in Garamond 16 (about 66 characters a line) and holds 10 lines; the builder packs whole paragraphs into pages and refuses a paragraph longer than one page.

- Each paragraph at most **520 characters**. One to three short paragraphs is a normal entry; a large subject may take more.
- The first part at most **6 paragraphs**; each later part at most **2 paragraphs**; an entry at most **10 paragraphs** in all.
- Title at most about 34 characters; `short` at most 28.
- Only Windows-1252 characters. Use “ ” and ’ (curly). Never straight double quotes, never `$`, `£`, `§`, `[`, `]`, never a line break inside a paragraph.

## Voice (spec section 1, binding)

The Chronicle is "the histories kept by the scholars of Parim and Selen".
Past tense for history, present tense for what still holds in 4A 1748.
Plain, concrete sentences, one idea each.
No meta words anywhere in the text: canon, established, proposed, lore, vault, owner, player, game, mod, map (except a map inside the world), spec, ZIN, faction, mechanic, flag, unlock, campaign, version.
No modern words (factory, rifle, democracy, percent, nation-state, technology, 1936, and the like).
Open questions are said as open, with the fixed phrases: "No chronicle tells…", "The scholars do not agree whether…", "It is not known…", "The elves say… The chronicles of men do not."
Never pick one of the vault's mutually exclusive alternatives (the possible natures of the Abyss, Agon's possible roles, the King of Demons' possible origins, the unselected names for the Holy Seven, the alternative public names for Afrit).
Proposed material reads as plain history (a name or date written as fact) and is marked `proposed` in the data only.
An established paragraph keeps every fact and the key wording of its vault section; editing is limited to shortening, reordering, joining sentences, removing status labels and hedges about canon, and replacing modern words.
No foreshadowing: an entry open at the start describes the world up to 1 Lumae 4A 1748 and never says what will happen. Later fates go in later parts behind their flags.
At most two quoted lines per entry, attributed, and only lines from the vault.

## Secrecy (spec sections 6 and 12.4, binding; a build check enforces it)

- Text whose condition does not imply `rev | hub` never contains: Afrit, Hidden Council, Kingdom Behind the Throne, Sevrin, Ring of Doors, Crown of Witnesses, Bracelet of the First Seal; never "demon" in the same sentence as Deliverer or Aurevan; never "false god" in the same paragraph as Deliverer or Aurevan; never "murder" in the same sentence as Deliverer, Aurevan or Council. Before `rev`, nothing doubts the Deliverer.
- Text whose condition does not imply `heir` never contains "Eindil" or "son of Ein" (for the stranger). Before that he is "the Man from the Ice" or "the stranger".
- Text whose condition does not imply `F:zin_horos_dead, S>=8` never calls Glo a heart; Glo is "a crystal of old and holy power" kept by Horos and said to hold part of Glernaen's power.
- Text whose condition is `start` never contains: the Man from the Ice, Eindil, War of the Last Crowns, Western Crossing, King of the East, Thirty Days, the Four Camps, Black Compact, or any name of a late-age battle or death.
- Fallen-realm names (Muzerar, Ozelkak, Tarkia, Qadurum, Rhabtarkia, Barzoth, Gromatrak, Tromahrim, Margorodai, Halgohavnai, Heulufaenn, Heulfaenn, Faenn-Cheulu, Heulofaennos, Tawrhalwe) appear only in text behind that realm's `D:<loop>` gate. No count of years before Aen ("3,000 years before Aen", "BA").

## When you finish

Run `node tools/content/chronicle.mjs check --file tools/content/data/chronicle/entries/<category>.json` if that command exists (the lane owner is writing it; it measures pages and runs the secrecy and word checks); fix what it reports.
Then report: the entries written (ids), any entry you added or dropped and why, every place the vault was unclear or contradicted the spec and what you did, and any vault section of your notes that no paragraph cites (with a one-line reason).
