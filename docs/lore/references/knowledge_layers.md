# Knowledge layers of Aoaz

**Status:** Draft. **Date:** 24 October 2026. **Requirement:** R-33 (knowledge layers), acceptance A-33: the text check finds no Erdu, Dunda or creator facts in public text, and every hidden fact carries its layer in data.
**Companion:** [magic_and_wizards.md](magic_and_wizards.md) (R-34, R-35), whose hidden rows point here.
**Sources read:** the lore vault (`docs/lore/vault/`, Canon Policy first), the owner's corrections and wider-world notes of 24 October 2026 (`docs/zin-handoff/01-CONTEXT-AND-CANON.md`, sections 2 and 3), the names spec's reveal table and planned checks T1 to T6 (`docs/specs/02_lore/03_names_and_terms.md`), the shared contract flags (`docs/specs/04_mechanics/00_shared_contract.md`), the text scan (`tools/content/checks/text_scan.mjs`), the banned-word data and matcher (`tools/content/data/banned_words.json`, `tools/content/lib/banned.mjs`), and the existing secrecy checks (`tools/content/lib/mech_court_lib.mjs` `secrecyLeaks`, `tools/content/checks/focus_checks.mjs` `checkSecrets`).

This file is a design document. It states hidden truths so that the builder can keep them out of player text; nothing here may be copied into localisation.

## 1. The four layers

Every fact about Aoaz and the world beyond it sits in exactly one layer. The layer decides what player text may say about it.

| Layer | Code | What it is | What player text may do |
| --- | --- | --- | --- |
| **Authorial truth, sealed** | `sealed` | True in the world, and never known to the people of Aoaz in any form the game shows. | Nothing. Never named, never described, never hinted at as fact, under any gate, in any voice. |
| **Authorial truth, gated** | `gated` | True, and learned in play when a story flag is set; one country may see it earlier. | Only through keys provably behind the gate, or through a `zin_loc_<concept>` scripted label that switches at the gate. |
| **Local belief** | `belief` | What a people, faith or tradition holds. It may be true, false or undecided; the believer may be wrong. | State it only as someone's belief: the sentence names or implies a believer ("pilgrims say", "the Gala hold", "an old song"). |
| **Disputed information** | `disputed` | Accounts that conflict in the world: rumours, travellers' tales, rival histories. | State it only as a claim or rumour, with its uncertainty visible ("fishermen tell", "some say", "travellers claim"). The text never settles it. |
| **Deliberate mystery** | `mystery` | What nobody in the world knows and the author keeps unknown, either because the owner has not decided (`mystery-open`) or has decided that it stays unknown (`mystery-kept`). | Name the question if the vault names it; never give an answer, never imply one, never invent a name. |

A fact can be **sealed in its depth and public at its surface**: people may know that travellers come from a land called Haven (`disputed`) while its true size and conditions stay `sealed`.
The register in section 3 then lists the fact twice, once per layer.

### 1.1 Who may know

The register's "who may know" column uses these categories.

| Category | Meaning |
| --- | --- |
| **Nobody** | No being in Aoaz knows it. The author knows it. |
| **Beings** | Only named immortals who could plausibly know it (for example Zol, his servants, Horos, Lorien); they never say it in text. |
| **Insiders** | A named group inside the world (the Hidden Council and the Worshipdom's rulers; Mirolon's wardens; a cord-mother's line). Text shown to that country may carry it before the gate. |
| **Scholars** | Learned people hold it as a theory or an old manuscript says it; text may give it only as a scholar's view, attributed. |
| **Everyone** | Common knowledge in the regions concerned. |

### 1.2 Rules of writing

1. **The narrator knows only what the viewer's world knows.** Event text, tooltips, descriptions and the codex speak from inside Aoaz. No line is written from the author's seat.
2. **Belief needs a believer.** A belief is never stated in the narrator's voice as fact; it carries a speaker, a people or a tradition in the same sentence.
3. **A dispute stays a dispute.** Rumour is written as rumour, and no single text contains the confirmation.
4. **A mystery is a question, not an answer.** Text may say "nobody knows why the black north is called a Mistake"; it may not offer a reason, even as a likely one, unless the owner turns that reason into a belief of a named people.
5. **Gated truths switch at their flag.** A text that must change uses the `zin_loc_<concept>` labels of the names spec; a text that carries the truth outright is shown only behind the flag.
6. **Sealed truths never leak through proxies.** No hint, riddle, prophecy, dream, map label, achievement, loading tip, file name shown to players, portrait or icon gives them. The check in section 4 enforces the words; the art rules (`docs/specs/08_art_and_assets/03_full_asset_inventory.md`) enforce the pictures.
7. **Zol's creator is never named, and its continuing influence is never explained.** No text, and no design document beyond this register, explains it by a resurrection, a surviving body, a return or any other definitive answer. The register itself says only what the owner said.
8. **Other continents are not copies of Aoaz.** They may have their own gods, dark lords, peoples and magic, and none of Aoaz's societies or conflicts is mirrored onto them.
9. **No being's exact age is stated** (owner, 24 October 2026): not for gods, spirits, elves or men, in any layer of player text.
10. **Zol's servant is never identified.** The owner has named it (C25), and that name stays hidden knowledge in every gate.

## 2. The wider world, layer by layer

| Place | Authorial truth (sealed unless marked) | What the people of Aoaz may know or believe |
| --- | --- | --- |
| **Aoaz** | A small continent near the middle of a far larger world (owner's world map). | Everyone knows the map's far north, west, east and south run off into unknown country (E, `Aoaz and Its Regions.md`); the world's true size is unknown. |
| **Erdae** | The small neighbouring continent, formerly called Aoaz in the sources, with its own magic, history and identity (owner). | Travellers occasionally arrive from it (`disputed`: what they say is partial and attributed). The name may appear in text only with an allowance (rule `bw_setting_names_001`). |
| **Haven** | A much larger land whose population and conditions are largely unknown (owner). The map writes it twice; whether that is one land or two is open. | Travellers occasionally come from it (`disputed`). Its size is not known as fact. |
| **Cerio** | A much larger land, largely unknown (owner). | Some may have heard of it; knowledge is uncertain (`disputed`). |
| **Lao** | A legendary land on the owner's map. What is truly there is not given (`mystery-kept`). | Traditions place the gods' dwelling and the destination of souls there, and interpretations differ (`belief`). |
| **Erdu** | The largest continent; gods are born and trained there; divine magic works more freely there (owner). | **Unknown** to the people of Aoaz. |
| **Dunda** | Much larger and mostly empty; it retains the presence of Zol's creator, one of the Holy Seven, destroyed long ago; the darkness and suffering associated with that being remain; Zol serves that being (owner). | Unknown, or at most dark rumour without a name. |

## 3. The register of hidden facts

Every fact the builder must keep out of public text, or let through only under a rule, is listed here with its layer, who may know it, what text may say and the gate or rule that guards it.
Ids are stable: the check data (section 4) refers to them.
**84 entries:** W 15, C 27, A 12, E 7, V 23.

### 3.1 The wider world (W)

| Id | Fact | Layer | Who may know | What text may say | Gate or rule |
| --- | --- | --- | --- | --- | --- |
| W1 | Aoaz is a small part of a far larger world. | sealed | Beings | That the charts end and unknown lands lie beyond. | Never stated as size or proportion. |
| W2 | Erdae is a small neighbouring continent with its own magic, history and identity. | sealed (depth) | Beings; travellers know their own home | Nothing about its magic, history or identity in the narrator's voice. | Sealed depth; the surface is W3. |
| W3 | Travellers occasionally arrive from Erdae. | disputed | Everyone in ports that receive them | That a traveller says he comes from Erdae, and what he claims, attributed. | Allowance required for "Erdae" (`bw_setting_names_001`); attribution required. |
| W4 | Haven is much larger than Aoaz; its population and conditions are largely unknown. | sealed (depth) | Beings | Nothing about its size or conditions as fact. | Sealed depth; the surface is W5. |
| W5 | Travellers occasionally come from Haven. | disputed | Ports that receive them | As W3. | Allowance required; attribution required. |
| W6 | Erdu is the largest continent; gods are born and trained there; divine magic works more freely there. | sealed | Beings (gods) | Nothing, in any form. | Term and phrase rules, section 4.6. |
| W7 | Dunda is much larger and mostly empty. | sealed | Beings | Nothing; at most an unnamed dark rumour in an allowed key. | Term rules; only `kl_rumour_*` allowances. |
| W8 | Dunda retains the presence of Zol's creator, one of the Holy Seven, destroyed long ago; its darkness and suffering remain. | sealed | Beings | Nothing. | Phrase rules, section 4.6. |
| W9 | Zol serves his creator. | sealed | Beings | Nothing; Zol is never shown as a servant of anyone. | Phrase rules, section 4.6. |
| W10 | Zol's creator has a name and a nature. | mystery-kept | Nobody in Aoaz | Nothing; no name is ever invented. | Phrase rules; never named in any file. |
| W11 | Cerio is a much larger land, largely unknown. | disputed (surface), sealed (size) | Some may have heard of it | That some have heard of a land called Cerio, attributed and uncertain. | Attribution required; size words forbidden. |
| W12 | Lao is the dwelling of the gods and the destination of souls. | belief | Everyone, in differing forms | As a tradition's belief. | Attribution required. |
| W13 | What Lao truly is. | mystery-kept | Nobody | Nothing. | Answer rules. |
| W14 | Divine magic works more freely somewhere than in Aoaz. | sealed | Beings | Nothing; scholars may wonder why the gods seldom act, without an answer. | Phrase rules (W6 family). |
| W15 | Other continents have their own gods, dark lords, peoples and magic. | sealed | Beings | Nothing. | Writing rule 8. |

### 3.2 Cosmology and the gods (C)

| Id | Fact | Layer | Who may know | What text may say | Gate or rule |
| --- | --- | --- | --- | --- | --- |
| C1 | He Who Was, Is and Will Be exists and made all gods. | mystery-kept | Beings; beyond ordinary religious knowledge (E) | Nothing in ordinary text; a rare manuscript only by allowance, attributed. | Term rule, allowance only. |
| C2 | The Holy Seven existed and made the Old and New Gods. | belief (public), truth (authorial) | Most people do not believe they existed (E) | Only as the oldest myth, attributed, preferably with a sceptic's voice. | Attribution required; no names, deeds or appearances. |
| C3 | One of the Seven was destroyed. | sealed | Beings | Nothing. | Phrase rule (Seven with destruction words). |
| C4 | The Fading limits the Old Gods. | belief (effect), truth (authorial) | Scholars, as a theory; the word itself is an authorial term | That the old gods are said to sleep, be dead, be hostile or be hidden (E: accounts conflict), attributed. | Attribution required for the word "Fading". |
| C5 | The cause of the Fading. | mystery-open | Nobody | Nothing. | Answer rule. |
| C6 | Zol gains power every day, very slowly. | sealed | Zol's servants (Beings) | Signs only: still seas, quiet graves, fishermen's tales (`disputed`). | Phrase rule. |
| C7 | Zol needs servants to feed his presence, and without them could fade from Aoaz. | sealed | Zol's servants | Nothing. | Phrase rule. |
| C8 | What feeding is. | mystery-open | Nobody | Nothing. | Answer rule. |
| C9 | Some New Gods serve Zol. | sealed | Beings | Nothing. | Phrase rule. |
| C10 | Which New Gods serve Zol. | mystery-open | Nobody | Nothing. | Answer rule. |
| C11 | Volgan once served a New God and overcame it. | sealed | Beings; perhaps the oldest elves | Nothing in public text before the owner rules otherwise. | Phrase rule. |
| C12 | Which New God Volgan served, and its fate. | mystery-open | Nobody | Nothing. | Answer rule. |
| C13 | The names and domains of the twelve main New Gods, and so of the months. | mystery-open (names not yet written) | Everyone, in the world; undecided by the owner | Months by number; no god named except Glernaen. | Answer rule (naming slot). |
| C14 | The twelve main New Gods answer the twelve needs of mortals (owner, 24 October 2026). What the twelve needs are is not yet written. | truth (purpose); mystery-open (the needs) | Everyone, as the faith of their gods | That each of the twelve answers a need of mortals; no list of needs until the owner writes it. | Answer rule (naming slot). |
| C15 | Afrit's true divine order, before and after the reveal. Afrit's cult keeps a feast, not a month (owner, 24 October 2026). | mystery-open (order); truth (feast) | Nobody (order); everyone (feast) | Belief (the faithful hold him a New God) and doubt, attributed; never a verdict; never a month named for him. | Answer rule, gate-independent. |
| C16 | Mortals mistake powerful Lesser Spirits for gods. | disputed | Scholars | As a scholar's or sceptic's view. | Attribution required. |
| C17 | Devils are corrupted Lesser Spirits who formerly served an Old God and escaped to Aoaz. | sealed (origin), belief (surface) | Beings; perhaps elves | That devils are ancient and terrible; their service and escape only as belief of a named people, never which Old God. | Phrase rule. |
| C18 | The Old God the devils served who was not Zol. | sealed | Beings | Nothing; it implies Old Gods beyond Aoaz (W15). | Phrase rule. |
| C19 | Demons are corrupted angels. | belief | Elves, scholars | Attributed. | Attribution required. |
| C20 | Whether devils are immortal and revivable; the demon king's name. | mystery-open (Q-07) | Nobody | The card's rite of skull and lava only as belief; no name for the king. | Answer rule; "Satan" forbidden. |
| C21 | The angels' history. | mystery-open | Nobody | Nothing beyond what the vault states. | Answer rule. |
| C22 | Whether necromancy binds souls or only bodies. | mystery-open | Nobody | Fear of it, attributed. | Answer rule. |
| C23 | What remains of Volgan after his body is destroyed. | mystery-open | Nobody | Fear and hope, attributed; never a verdict. | Answer rule after `zin_volgan_body_destroyed`. |
| C24 | Zol's most loyal servant, a Great Spirit, appears in the last war. | gated | Beings | Nothing before its appearance; after it, the servant as "a Great Spirit of the black north" or similar, without identity. | Gate: the servant-appearance flag (the shared contract's `zin_zol_manifested`, to be renamed under the correction of 24 October 2026). |
| C25 | That servant is **Edvoid (name to be replaced)** (owner, 24 October 2026). | sealed | Beings (Zol and his servants) | Nothing: the servant is never identified, before or after it appears; the new name, when the owner gives it (Q-10), joins this rule. | `kl_sealed_021`; "Edvoid" is also banned (`bw_superseded_names_002`). |
| C27 | Lesser New Gods exist besides the twelve, and they are stronger than most Great Spirits (owner, 24 October 2026). | truth (existence), sealed (their strength relative to spirits) | Everyone may know of lesser gods; their rank against spirits is known to Beings | Lesser gods of shrines and places, unnamed, as worshippers see them; no ranking against spirits. | Answer rule (naming slot); writing rule. |
| C26 | Zol does not appear in person in the War of the Last Crowns. | truth | Everyone who fights there | That the black north's host came under a terrible servant; never that Zol took the field. | Answer rule against "Zol" with bodily-appearance words. |

### 3.3 Afrit, the Deliverer and the Worshipdom (A)

| Id | Fact | Layer | Who may know | What text may say | Gate or rule |
| --- | --- | --- | --- | --- | --- |
| A1 | The Deliverer is Afrit, son of Ein. | gated | Insiders: the Hidden Council, the Worshipdom's rulers | The public label, Aurevan the Deliverer (P), through `zin_loc_deliverer`. | `zin_afrit_revealed`; the Worshipdom earlier. |
| A2 | The Hidden Council exists and governs Aenor behind the throne. | gated | Insiders | "The Royal Council" through `zin_loc_council`. | `zin_afrit_revealed`. |
| A3 | The Houses of the First Light, their birth rolls and their licences answer to Afrit. | gated | Insiders | "Houses of the First Light" as a trusted institution. | `zin_afrit_revealed`, or Aenor's `zin_aenor_hidden_hand_seen`. |
| A4 | The plot against the Golden King. | gated | Insiders | "A sudden death" through `zin_loc_kings_death`. | `zin_afrit_revealed`. |
| A5 | Afrit's demonic form and his demon allies since Dardan. | gated | Insiders | Nothing that calls the Deliverer a demon. | `zin_afrit_revealed`. |
| A6 | The theft of the Necklace of the Abyss and the thief's unending life. | gated | Insiders | Nothing. | The Afrit mechanic's thief event. |
| A7 | The names of the lesser artifacts (proposed Ring of Doors, Crown of Witnesses, Bracelet of the First Seal). | gated | Insiders | "Graces of the Deliverer" through `zin_loc_artifacts`. | `zin_afrit_revealed`. |
| A8 | The Deliverer's blessings flow from Afrit's power, the necklace and his prepared centre. | gated | Insiders | That the blessings are real, as the faithful see them. | `zin_afrit_revealed`. |
| A9 | Afrit and Eindil are brothers; Afrit betrayed him. | gated | Beings (Horos, Lorien); Insiders | Nothing before Yeldenne. | `zin_horos_dead` for the brotherhood; `zin_afrit_revealed` for public text in Aenor. |
| A10 | Afrit's eastern reserve of courts. | gated | Insiders | Nothing. | `zin_afrit_revealed` or `zin_afrit_king_of_east`. |
| A11 | Afrit's private dimension. | gated | Insiders, then Eindil | Nothing before Yeldenne. | `zin_horos_dead`. |
| A12 | Afrit's true faces (the gated portraits and their names). | gated | Insiders | Nothing. | `zin_afrit_revealed`; Worshipdom earlier. |

### 3.4 Eindil, Glo and the wizard (E)

| Id | Fact | Layer | Who may know | What text may say | Gate or rule |
| --- | --- | --- | --- | --- | --- |
| E1 | The man from the ice is Eindil, son of Ein, grandson of Aen. | gated | Beings (Lorien, Horos, Afrit) | "The Man from the Ice" (P) through `zin_loc_eindil`. | `zin_eindil_named`. |
| E2 | How, where and why Eindil was put to sleep, and why he lost his memory. | mystery-open | Nobody | Nothing. | Answer rule. |
| E3 | Glo is Horos's own heart and holds part of Glernaen's power. | gated | Beings (Horos) | "A crystal of old and holy power" through `zin_loc_glo`. | `zin_horos_dead`; Yeldenne earlier. |
| E4 | Where Varner is before he appears. | gated (authorial place in [magic_and_wizards.md](magic_and_wizards.md), 4.1) | Beings | Legend only; no place. | `zin_eindil_returned`, or the Magical Forest's `zin_eindil.87` chain. |
| E5 | Golbran survives Varner's last wards. | gated | Nobody until the palace | Doubt: "nobody has seen him" (journey spec). | The palace battle event, then `zin_golbran_dead`. |
| E6 | Golbran's species and origin. | mystery-open | Nobody | Nothing beyond small and purple. | Answer rule. |
| E7 | What the Necklace of the Abyss can do, and what it will do to Eindil. | mystery-open | Nobody | Nothing. | Answer rule. |

### 3.5 Other secrets and open questions of the vault (V)

| Id | Fact | Layer | Who may know | What text may say | Gate or rule |
| --- | --- | --- | --- | --- | --- |
| V1 | Where Dardan was fought. | mystery-open | Nobody (the place is never named) | The battle, without a place. | Place and answer rules. |
| V2 | Why the black north is called Zol's Mistake. | mystery-open | Nobody | The name, and that nobody knows why. | Answer rule. |
| V3 | Who administers Zol's Mistake for Zol. | mystery-open | Nobody | Nothing; the realm has an emblem, not a ruler. | Answer rule. |
| V4 | The name of Roka's people. | mystery-open | Nobody | "Roka's people" or "the rhinoceros-headed folk of the Abyss". | Answer rule. |
| V5 | Roka's fate. | mystery-open | Nobody | Nothing. | Answer rule. |
| V6 | Whether the Void, the Nether, the Abyss and Afrit's realm connect. | mystery-open | Nobody | Each by its own name. | Answer rule. |
| V7 | How Elzon obtained Zol's magic, and whether Zol willed it. | mystery-open | Nobody | That the Necromancer used a terrible old magic, attributed. | Answer rule. |
| V8 | That Zol consumed Elzon at his end. | disputed (owner-favoured working explanation) | Scholars may suspect | That the Necromancer fell; how is disputed and attributed. | Answer rule. |
| V9 | Volgan's arming in the Ember Lands at the start. | disputed (outside Mirolon) | Insiders: Mirolon's wardens and scouts | Mirolon states it plainly; elsewhere it is a rumour the courts laugh at. | Viewer-dependent until `zin_volgan_marches`. |
| V10 | Black ships among the islands of the Kusmeel (4A 1744). | disputed | Island fishermen | Fishermen's tales that no court believes. | Attribution required until `zin_zol_rising`. |
| V11 | The dwarves' homeland. | mystery-open | Nobody | Nothing; no dwarf appears. | Answer rule. |
| V12 | What "Ainu" means. | mystery-open | Nobody | "The First Men". | Answer rule. |
| V13 | Whether Aenor is named for Aen. | mystery-open | Nobody | Both readings as belief, or neither. | Answer rule. |
| V14 | Bastian is a living human wizard of the Fourth Age, famous in the Middle Lands, a contemporary of Varner (owner, 24 October 2026). | truth, public | Everyone in the Middle Lands | That he is the famous wizard of men and lives; his biography in [magic_and_wizards.md](magic_and_wizards.md) is proposed; never his age. | Age rule `kl_mystery_027`; his meeting with Varner is under E4. |
| V15 | Where the Zhen Hills are, and what the arcanists are. | mystery-open | Nobody | The name of the people, as a rumour. | Answer rule. |
| V16 | Whether the Gala and Sunhot elves are kin. | mystery-open | Nobody | Each people on its own. | Answer rule. |
| V17 | The hearth-names of men. | custom | Each household | That hearth-names exist; never one printed. | Writing rule (names spec); no rule needed in the scan beyond review. |
| V18 | What the Mirror of First Rain shows. | belief | The Gala | As the Keepers' or the asker's interpretation. | Attribution required. |
| V19 | The cause of Eindil's and Afrit's long lives. | mystery-open | Nobody | Nothing beyond "the First Men lived long". | Answer rule. |
| V20 | Gektor is a sorcerer-chief who traps and bleeds lesser spirits; his claim to kill Great Spirits is a boast; Gorbatik is Golbran (owner, 24 October 2026). Gektor's kind is still open. | truth (deeds), disputed (the boast), mystery-open (his kind) | The West Lands know his trade; the boast is his own | His trade and his boast, the boast always as his claim; never his kind or age. | Attribution for the boast; age rule. |
| V21 | The Holy Seven's proposed in-world labels (Seven Before Names, Seven Who Never Were, and the rest). | belief (unselected proposals) | Scholars, sceptics | Only if the owner selects one; then attributed. | Term rule, allowance only. |
| V22 | Whether Volgan's storms are his working. | mystery-open | Nobody | The storms, and fear of them. | Answer rule. |
| V23 | The exact age of any being. Old Gods are millions of years old and Great Spirits can be very old, but no figure is ever given (owner, 24 October 2026). | mystery-kept | Nobody in text | "Ancient", "older than the charts", "of a great age"; never a number of years for any being, man or god. | `kl_mystery_027`. |

Register size: **84 entries**. A builder test asserts that `secret_terms.json` names every id, as acceptance item 4 of section 4.9 requires.

## 4. The text check (X18, knowledge layers)

This is a specification for an engineer. It adds one check, **X18**, to `tools/content/checks/text_scan.mjs`, and is the whole-tree implementation of the names spec's planned check T2 (gated terms).
The module-level checks stay as early warnings: `secrecyLeaks` in `tools/content/lib/mech_court_lib.mjs` and `checkSecrets` in `tools/content/checks/focus_checks.mjs` read their words from the same data file instead of their inline lists (`SECRET_WORDS`, `SECRET`), so that there is one source.

### 4.1 Data file

**Path:** `tools/content/data/secret_terms.json`, the path the names spec already reserves for gated terms.
**Owner:** this file. The rule text, ids and fact ids below are normative; the JSON is written from them.

```json
{
  "schema": 1,
  "owner": "docs/lore/references/knowledge_layers.md",
  "note": "Data for check X18 of tools/content/checks/text_scan.mjs. Patterns are regular expressions without delimiters, matched with the banned-word matcher's rules (whole words, NFKC, displayed text only). A sentence is a run of displayed text ended by . ! ? ; or a line break.",
  "layers": ["sealed", "gated", "belief", "disputed", "mystery"],
  "gates": {
    "zin_afrit_revealed": { "earlyViewers": ["Worshipdom"], "keySuffixes": ["_revealed", "_true", "_private", "_hub"], "implies": [] },
    "zin_afrit_dead": { "implies": ["zin_afrit_revealed"] },
    "zin_eindil_named": { "earlyViewers": [], "keySuffixes": ["_named"], "implies": [] },
    "zin_horos_dead": { "earlyViewers": ["Yeldenne"], "keySuffixes": ["_heart"], "implies": [] },
    "zin_eindil_returned": { "earlyViewers": [], "keySuffixes": [], "implies": [] },
    "zin_varner_dead": { "implies": ["zin_eindil_returned"] },
    "zin_golbran_dead": { "implies": ["zin_varner_dead"] },
    "zin_zol_servant_appeared": { "aliases": ["zin_zol_manifested"], "implies": [] },
    "zin_volgan_marches": { "earlyViewers": ["Mirolon"], "implies": [] },
    "zin_zol_rising": { "implies": [] },
    "zin_volgan_body_destroyed": { "implies": [] }
  },
  "markers": {
    "attribution": "say|says|said|tell|tells|told|tale|tales|story|stories|song|songs|sing|sings|believe|believes|believed|belief|hold that|holds that|held that|teach|teaches|taught|legend|legends|myth|myths|claim|claims|claimed|swear|swears|pray|prays|it is said|according to|in the old books|the faithful|pilgrims|priests|confessors|elders|old wives|scholars|sceptics",
    "dispute": "rumour|rumours|whisper|whispers|some say|others say|nobody knows|no one knows|uncertain|doubt|doubts|denies|deny|perhaps|may have|it may be|travellers claim|fishermen tell|nobody believes|none can say"
  },
  "rules": [],
  "allowances": []
}
```

`zin_zol_servant_appeared` is a proposed name for the shared contract's `zin_zol_manifested`, which the correction of 24 October 2026 makes wrong in meaning; until the contract renames it, the alias lets either flag open the gate.
The `_named` and `_heart` key suffixes are proposed here; `_revealed`, `_true`, `_private` and `_hub` already exist in `secrecyLeaks`.

A rule has the fields below. The `rules` array is filled from the tables of section 4.6.

| Field | Meaning |
| --- | --- |
| `id` | `kl_<layer>_<nnn>`, stable. |
| `fact` | One or more register ids (W6, A1 ...). |
| `layer` | One of the five codes; `mystery-open` and `mystery-kept` both use `mystery`. |
| `kind` | `term` (a whole-word pattern), `phrase` (two patterns in one sentence), `answer` (a pattern that states an answer to an open question), `place` (a subject with a staged place name in one sentence) or `attributed` (a pattern that must share its sentence with an attribution or dispute marker). |
| `pattern` | For `term`, `answer`, `attributed`: the pattern. For `phrase`: `a` and `b`. For `place`: `subject`. |
| `caseSensitive` | As in `banned_words.json`. |
| `gate` | For `gated` rules: the flag that lets the text through. |
| `marker` | For `attributed` rules: `attribution`, `dispute` or `either`. |
| `severity` | `error` for every rule except those marked `review` in the tables. |
| `why` | One line with the register id and the reason. |

### 4.2 Inputs

1. **Displayed text.** The same table the scan already builds: every English ZIN key (`zin`), expanded with nested keys through `expandNested(value, eff, MAX_NEST)` and reduced with `displayText`. Colour codes, icons, `$VARIABLES$` and `[calls]` are removed before matching, as for X5.
2. **The gate manifest.** `docs/design/validation/text_gates.json` in the staged tree, written by every module that emits gated text: `[{ "key": "...", "gate": "zin_afrit_revealed", "viewers": ["Worshipdom"] | null, "owner": "event zin_afrit.40" }]`. The focus builder already proves `text_gate` for focus items (`checkSecrets`); it writes its proven keys into this manifest. The terms module writes the true-label keys of every `zin_loc_<concept>` defined_text (for example `zin_loc_deliverer_true`).
3. **Key-suffix gates.** A key that ends in one of a gate's `keySuffixes` (optionally followed by `_desc`, `_tt` or `_long`) is gated by that gate, as `secrecyLeaks` already assumes for Afrit.
4. **Place names.** Every displayed value of the staged keys `STATE_<n>`, `VICTORY_POINTS_<n>` and `STRATEGICREGION_<n>`, plus the region names of `docs/lore/vault/05 - Geography/Aoaz and Its Regions.md` held in the data as `places.regions`. Names of fewer than four letters are dropped.
5. **Viewer of a key.** From the manifest's `viewers`; otherwise unknown, which means any country.

### 4.3 Algorithm

For every English ZIN key, in sorted order:

1. Build the displayed text `t` and split it into sentences.
2. Run every rule of the data on `t` (`term`, `answer`, `attributed`) or on each sentence (`phrase`, `place`, and the marker test of `attributed`).
3. For each hit, find **where the words came from**: if the hit is absent from the key's own value expanded with ZIN keys only, it came through a nested key; the finding then names that nested key, which must itself pass.
4. Decide whether the hit is allowed:
   - **sealed:** never. An allowance that names a sealed rule is itself an error ("a sealed fact admits no allowance").
   - **gated:** allowed when the key (or the nested key that carries the words) is gated by the rule's gate or by a gate that `implies` it, or when the key's viewers are a subset of the gate's `earlyViewers`.
   - **belief, disputed (`attributed` rules):** allowed when the same sentence holds a marker of the required kind, or an allowance covers the key.
   - **mystery (`answer` and `place` rules):** never allowed by a gate, because a gate does not answer an open question. An allowance may cover it only when the owner has answered the question and the allowance cites the answer's record in the vault.
5. A hit that is not allowed becomes a finding: `{ check: 'X18', severity, family, key, file, rule, fact, layer, detail }`, with the detail cut at 80 characters as the scan does.
6. After all keys: every allowance of `secret_terms.json` that matched nothing is an error, as for the banned-word allowances.

X18 findings with severity `error` are always failing, whatever the family's gate: add `'X18'` to the list `['X1', 'X11', 'X12', 'X14']` in the `failing` filter of `runTextScan`.
The scan result gains `knowledge: { byLayer: { sealed, gated, belief, disputed, mystery }, byFact: { W6: n, ... } }` so that the report shows where the leaks are.
The command line is unchanged.

### 4.4 Which keys may carry gated text

| Gate | Keys that may carry the truth before it | Keys that may carry it after it |
| --- | --- | --- |
| `zin_afrit_revealed` | Keys whose manifest viewers are only the Worshipdom; keys ending `_hub`; the Afrit mechanic's private events | Keys ending `_revealed`, `_true` or `_private`; keys in the manifest under this gate or `zin_afrit_dead` (for example Afrit's true faces, the council's true name, the artifacts' true names, the king's murder) |
| `zin_eindil_named` | None | Keys ending `_named`; `zin_loc_eindil_true`, `zin_loc_camp_host_true`; journey events from Lorien's naming onward |
| `zin_horos_dead` | Yeldenne's own keys | Keys ending `_heart`; `zin_loc_glo_true`; the Yeldenne events from the guardian's death |
| `zin_eindil_returned` | The Magical Forest's `zin_eindil.87` chain, through the manifest | Varner's character keys and the war events that show him |
| the servant-appearance flag | None | The war events of the servant's appearance; never with an identity |
| `zin_volgan_marches` | Mirolon's keys (manifest viewer Mirolon) | Every key |

### 4.5 Normalisation and sentence splitting

- Text is normalised exactly as `findBanned` expects: NFKC, whole words, a hyphen separates words, the possessive *'s* ends a word.
- A sentence ends at `.`, `!`, `?`, `;` or a line break, after the engine's markup is removed; a quotation keeps its own sentences.
- `phrase` and `place` rules match only inside one sentence, so that a paragraph that mentions Zol in one sentence and servants in another passes.

### 4.6 Forbidden terms and phrases, by layer

A pattern that contains a capitalised name (Zol, the Seven, Fading, Glo, Lao, Haven and the like) is case-sensitive, so that "the fading light", "seven days" and "a safe haven" pass; every other pattern is case-insensitive unless its notes say otherwise.
Where `phrase` lists `a` and `b`, both must occur in one sentence.

#### Sealed (no gate, no allowance)

| Rule id | Fact | Kind | Pattern | Notes |
| --- | --- | --- | --- | --- |
| `kl_sealed_001` | W6 | term | `erdu` | Case-insensitive, whole word. |
| `kl_sealed_002` | W7, W8 | term | `dunda` | Case-insensitive, whole word. |
| `kl_sealed_003` | W6, W14 | phrase | a: `gods?` b: `(?:born\|made\|trained\|taught\|raised\|schooled\|nursed)\s+(?:in\|on\|at\|across\|beyond)\b` | The gods' birthplace, under any name. |
| `kl_sealed_004` | W6, W14 | answer | `(?:birthplace\|cradle\|school\|nursery)\s+of\s+(?:the\s+)?gods` | |
| `kl_sealed_005` | W14 | answer | `(?:divine\|the gods'?)\s+(?:magic\|power)\s+(?:works\|flows\|runs\|answers)\s+(?:more\s+)?(?:freely\|easily\|better)` | |
| `kl_sealed_006` | W9, W10 | answer | `Zol(?:'s)?\s+(?:own\s+)?(?:maker\|creator\|master\|lord\|liege\|father\|mother\|sire)` | Case-sensitive on Zol. |
| `kl_sealed_007` | W9, W10 | answer | `(?:made\|created\|fashioned\|begot\|bore\|shaped)\s+Zol\b` | |
| `kl_sealed_008` | W9 | answer | `Zol\s+(?:serves\|served\|obeys\|obeyed\|bows\|kneels\|answers\s+to\|is\s+(?:a\|the)\s+servant)` | "Zol's servants" stays allowed. |
| `kl_sealed_009` | W9 | phrase | a: `Zol` b: `(?:greater\|older\|darker\|elder)\s+than\s+(?:Zol\|him)\|(?:a\|the)\s+(?:power\|god\|darkness)\s+(?:above\|behind\|beyond)\s+(?:Zol\|him)` | A greater darkness behind Zol. |
| `kl_sealed_010` | C3, W8 | phrase | a: `(?:Holy\s+Seven\|the\s+Seven(?!\s+[A-Z][a-z])\|Seven\s+Before\s+Names\|Seven\s+Who\s+Never\s+Were\|Unremembered\s+Seven\|First\s+Hands\|Nameless\s+Seven\|Seven\s+Beyond\s+Time\|Forgotten\s+Makers)` b: `destroy\w*\|slain\|slew\|killed\|died\|dead\|fell\|fallen\|broken\|murder\w*\|perished\|ended` | Any of the Seven destroyed. The lookahead lets "the Seven Wells" of Noris pass. |
| `kl_sealed_011` | W8, W10 | answer | `(?:dead\|slain\|destroyed\|fallen\|murdered\|broken)\s+(?:god\|maker\|creator\|one)\s+of\s+the\s+Seven` | |
| `kl_sealed_012` | W8, W10 | phrase | a: `(?:Seven\|maker\|creator\|Zol)` b: `resurrect\w*\|rose\s+again\|rise\s+again\|reborn\|returns?\s+from\s+death\|(?:its\|his\|her)\s+(?:body\|corpse\|bones)\s+(?:lies\|lie\|remains\|rest)\|bones\s+of\s+(?:a\|the)\s+god\|corpse\s+of\s+(?:a\|the)\s+god` | Never an explanation of the continuing influence. |
| `kl_sealed_013` | W8 | answer | `(?:land\|realm\|continent\|country)\s+(?:where\|in\s+which)\s+(?:a\|the)\s+(?:dead\|slain\|destroyed\|fallen)\s+(?:god\|maker)` | |
| `kl_sealed_014` | C6 | answer | `Zol\s+(?:grows\|gains\|gathers)\s+(?:stronger\|in\s+strength\|power)\s+(?:every\|each)\s+day` | Signs are allowed, the rule is not. |
| `kl_sealed_015` | C7 | answer | `(?:feed\|feeds\|fed\|sustain\|sustains\|sustained)\s+(?:Zol\|his\s+presence)\|Zol\s+(?:could\|would\|might\|will)\s+fade` | |
| `kl_sealed_016` | C9, C10 | answer | `New\s+Gods?\s+(?:who\s+)?(?:serve\|serves\|served\|obey\|kneel\s+to)\s+Zol\|Zol's\s+(?:divine\|godly)\s+servants?` | |
| `kl_sealed_017` | C11, C12 | answer | `Volgan\s+(?:once\s+)?(?:served\|overcame\|overthrew\|betrayed)\s+(?:a\|the\|his)\s+(?:New\s+)?God` | |
| `kl_sealed_018` | C17, C18 | phrase | a: `devils?` b: `(?:served\|serve\|escaped\|fled)\s+(?:an?\s+)?(?:Old\s+God\|old\s+god\|another\s+god)\|other\s+Old\s+Gods?` | Devils' origin and other Old Gods. |
| `kl_sealed_019` | W1, W15 | answer | `(?:Aoaz\|our\s+land\|this\s+continent)\s+is\s+(?:small\|a\s+small\|but\s+a\s+small\|one\s+of\s+many)` | |
| `kl_sealed_021` | C25 | answer | `Zol's\s+(?:most\s+loyal\|greatest\|chief\|first\|mightiest)\s+servant,?\s+(?:is\|was\|named\|called\|whose\s+name)\|(?:servant\|Great\s+Spirit)\s+(?:of\s+Zol\s+)?(?:named\|called)\s+[A-Z]` | The servant's identity (Edvoid, name to be replaced) is hidden; "Edvoid" itself is also caught by `bw_superseded_names_002`, and the replacement name joins this rule when the owner gives it (Q-10). |
| `kl_sealed_020` | W2, W4, W11 | phrase | a: `Erdae\|Haven\|Cerio` b: `(?:far\s+)?(?:larger\|greater\|vaster\|bigger\|smaller)\s+than\|(?:its\|their)\s+(?:gods\|magic\|history\|kings\|peoples)\s+(?:are\|is\|were)` | Size and depth stated as fact; travellers' claims go through attribution. Severity error unless the sentence holds an attribution marker, then review. |

#### Gated

| Rule id | Fact | Kind | Pattern | Gate |
| --- | --- | --- | --- | --- |
| `kl_gated_001` | A1 | term | `Afrit(?:'s)?` | `zin_afrit_revealed` |
| `kl_gated_002` | A2 | term | `Hidden\s+Council` | `zin_afrit_revealed` |
| `kl_gated_003` | A1, A9 | phrase | a: `Deliverer\|Aurevan` b: `son\s+of\s+Ein\|grandson\s+of\s+Aen\|brother\|First\s+Men` | `zin_afrit_revealed` |
| `kl_gated_004` | A5 | phrase | a: `Deliverer\|Aurevan` b: `demon\w*\|devil\w*\|horned\|corrupt\w*\|false\s+god\|impostor\|pact` | `zin_afrit_revealed` |
| `kl_gated_005` | A4 | phrase | a: `Golden\s+King` b: `murder\w*\|poison\w*\|plot\w*\|assassin\w*\|killed\s+by` | `zin_afrit_revealed` |
| `kl_gated_006` | A3 | phrase | a: `Houses?\s+of\s+the\s+First\s+Light\|birth\s+rolls?\|Lantern\s+Roll` b: `spy\|spies\|agents?\|informers?\|secret\s+master\|hidden\s+master\|answer\s+to\|report\s+to` | `zin_afrit_revealed` |
| `kl_gated_007` | A7 | term | `Ring\s+of\s+Doors\|Crown\s+of\s+Witnesses\|Bracelet\s+of\s+the\s+First\s+Seal` | `zin_afrit_revealed` |
| `kl_gated_008` | A6 | term | `Sevrin\|unending\s+life\|the\s+immortal\s+thief` | the thief event (manifest) |
| `kl_gated_009` | A8 | phrase | a: `blessings?\|miracles?\|healing` b: `necklace\|Abyss\|stolen\s+power\|borrowed\s+power` | `zin_afrit_revealed` |
| `kl_gated_010` | A11 | phrase | a: `Deliverer\|Aurevan\|Afrit` b: `(?:own\|private\|hidden)\s+(?:realm\|dimension\|world)` | `zin_horos_dead` |
| `kl_gated_011` | E1 | term | `Eindil(?:'s)?` | `zin_eindil_named` |
| `kl_gated_012` | E1 | term | `son\s+of\s+Ein\|grandson\s+of\s+Aen` | `zin_eindil_named` |
| `kl_gated_013` | E3 | term | `Glo` (case-sensitive) | `zin_horos_dead` |
| `kl_gated_014` | E3 | answer | `Horos(?:'s)?\s+(?:own\s+)?heart\|heart\s+of\s+Horos` | `zin_horos_dead` |
| `kl_gated_015` | E3 | phrase | a: `Glernaen` b: `crystal\|Glo\|heart\|stone` | `zin_horos_dead` |
| `kl_gated_016` | E4 | place | subject: `Varner\|the\s+wizard\s+of\s+the\s+Unbinding\|Golbran` | `zin_eindil_returned` |
| `kl_gated_017` | E5 | answer | `Golbran\s+(?:lives\|survived\|survives\|is\s+alive\|still\s+lives\|did\s+not\s+die)` | the palace event (manifest) |
| `kl_gated_018` | C24 | answer | `Zol's\s+(?:most\s+loyal\|greatest\|chief\|first\|mightiest)\s+servant` | the servant-appearance flag |
| `kl_gated_019` | V9 | phrase | a: `Volgan\|Dead\s+Lands\|Dominion` b: `arming\|arms\|musters?\|rebuild\w*\|marches\|will\s+march` | `zin_volgan_marches`; Mirolon early; severity review elsewhere when an attribution or dispute marker is present |

#### Belief and dispute (the sentence must carry a marker)

| Rule id | Fact | Kind | Pattern | Marker |
| --- | --- | --- | --- | --- |
| `kl_belief_001` | W12, W13 | attributed | `Lao` (case-sensitive) | attribution |
| `kl_belief_002` | C2, V21 | attributed | `Holy\s+Seven\|Seven\s+Before\s+Names\|Seven\s+Who\s+Never\s+Were\|Unremembered\s+Seven\|First\s+Hands\|Nameless\s+Seven\|Seven\s+Beyond\s+Time\|Forgotten\s+Makers` | attribution; and an allowance, until the owner selects a label (V21) |
| `kl_belief_003` | C1 | attributed | `He\s+Who\s+Was,?\s+Is,?\s+and\s+Will\s+Be` | attribution and an allowance |
| `kl_belief_004` | C4 | attributed | `the\s+Fading` | attribution (a scholar's word) |
| `kl_belief_005` | C4 | attributed | `Old\s+Gods?\s+(?:are\|is\|were\|lie)\s+(?:dead\|asleep\|sleeping\|hostile\|hidden\|gone\|lost)` | attribution |
| `kl_belief_006` | C16 | attributed | `(?:mistaken\|taken)\s+for\s+(?:a\s+)?gods?\|not\s+(?:truly\|really)\s+a\s+god` | attribution |
| `kl_belief_007` | C19 | attributed | `demons?\s+(?:are\|were)\s+(?:fallen\|corrupted\|corrupt)\s+angels?` | attribution |
| `kl_belief_008` | V18 | attributed | `(?:the\s+)?Mirror\s+(?:shows\|showed\|foretells\|foretold\|sees\|saw)` | attribution |
| `kl_dispute_001` | W3, W5 | attributed | `Erdae\|Haven` (case-sensitive; "Haven" not after "a", "the" or "safe") | dispute or attribution; and an allowance for the key (the travellers' family) |
| `kl_dispute_002` | W11 | attributed | `Cerio` | dispute or attribution |
| `kl_dispute_003` | V10 | attributed | `black\s+ships?` | dispute, until `zin_zol_rising` |
| `kl_dispute_004` | V8 | attributed | `(?:Zol\|the\s+(?:Old\s+)?God\s+of\s+Death)\s+(?:consumed\|devoured\|swallowed\|took\|ate)\s+(?:Elzon\|the\s+(?:Great\s+)?Necromancer)\|(?:Elzon\|the\s+(?:Great\s+)?Necromancer)\s+was\s+(?:consumed\|devoured\|swallowed)` | dispute |

#### Mystery (answers forbidden; no gate opens them)

| Rule id | Fact | Kind | Pattern | Notes |
| --- | --- | --- | --- | --- |
| `kl_mystery_001` | C13, C14 | answer | `(?:the\s+)?(?:New\s+)?God(?:dess)?\s+(?!Glernaen\b)[A-Z][a-z]+` | Case-sensitive; Glernaen is the only named New God. |
| `kl_mystery_002` | C13 | answer | `(?!Glernaen\b\|Aurevan\b)[A-Z][a-z]+,?\s+(?:a\|the)\s+New\s+God(?:dess)?` | Aurevan is the Deliverer's public name (P). |
| `kl_mystery_003` | C13 | answer | `month\s+of\s+[A-Z][a-z]+\|(?:Deepwinter\|Ironfrost\|Thaw\|Rainwake\|Sowing\|Highsun\|Goldfield\|Harvest\|Fallowing\|Emberleaf\|Mistfall\|Longnight)\b` | Case-sensitive. The superseded month names; "harvest" in lower case stays allowed, and a hit on Harvest, Sowing or Thaw as the first word of a sentence is review, not error. Keep this rule until the calendar keys are renamed (Q-01). |
| `kl_mystery_004` | C15 | answer | `(?:Afrit\|Aurevan\|the\s+Deliverer)\s+(?:is\|was)\s+(?:truly\|really\|in\s+truth\|no\|not\|never\|a\s+false\|a\s+true\|only\s+a\s+man\s+and\s+no)\s+(?:a\s+)?(?:New\s+)?god` | Gate-independent; an attribution marker lowers it to review. |
| `kl_mystery_005` | C20 | answer | `King\s+of\s+(?:the\s+)?Demons,?\s+(?:named\|called\|is\|was\|whose\s+name)\|[A-Z][a-z]+,?\s+(?:the\s+)?King\s+of\s+(?:the\s+)?Demons` | |
| `kl_mystery_006` | C20 | term | `Satan` | Q-07: a real-world religious name. |
| `kl_mystery_007` | (retired) | — | — | Moved to `kl_sealed_021` when the owner named the servant on 24 October 2026; the id is not reused. |
| `kl_mystery_008` | C26 | phrase | a: `Zol(?!['’]s)\b` b: `(?:took\|takes)\s+(?:the\s+)?field\|(?:appeared\|appears\|manifested\|walked\|strode\|stood)\s+(?:on\|upon\|before\|among\|in\s+(?:a\|his)\s+body)\|in\s+the\s+flesh` | Zol does not appear in the war. |
| `kl_mystery_009` | V1 | place | subject: `Dardan` | Any staged place name in the same sentence. |
| `kl_mystery_010` | V1 | answer | `Dardan\s+(?:lies\|lay\|stands\|stood\|is\|was)\s+(?:in\|near\|beside\|on\|under\|by\|below\|above\|south\|north\|east\|west)` | |
| `kl_mystery_011` | C5 | phrase | a: `Fading` b: `because\|caused\|cause\s+of\|comes\s+from\|result\s+of\|born\s+of\|began\s+when` | |
| `kl_mystery_012` | V2 | phrase | a: `Mistake` b: `(?:called\|named)\s+(?:so\s+)?(?:because\|after\|for)\|the\s+mistake\s+(?:was\|of\s+Zol\s+was)` | |
| `kl_mystery_013` | V3 | answer | `(?:rules\|governs\|keeps\|holds)\s+(?:Zol's\s+Mistake\|Furviatlon)\s+for\s+Zol` | |
| `kl_mystery_014` | V4 | answer | `Roka's\s+(?:people\|kin\|kind\|folk),?\s+(?:the\|called\|named)\s+[A-Z]` | |
| `kl_mystery_015` | C23 | answer | `Volgan(?:'s\s+spirit)?\s+(?:is\|was)\s+(?:gone\|dead\|destroyed\|ended\|no\s+more)\s+for\s+ever\|Volgan\s+(?:will\|shall)\s+return\|Volgan\s+(?:lives\|survives\|lives\s+on)` | Active after `zin_volgan_body_destroyed`; an attribution marker lowers it to review. |
| `kl_mystery_016` | E6 | answer | `Golbran\s+(?:is\|was)\s+(?:a\|an\|one\s+of\s+the)\s+\w+\s+(?:spirit\|elf\|demon\|goblin\|gnome\|devil\|kind\|folk\|people\|race)` | |
| `kl_mystery_017` | V16 | phrase | a: `Gala` b: `Sunhot` and `kin\|kindred\|cousins\|same\s+people\|one\s+people\|related\|descended` | Three-way: all in one sentence. |
| `kl_mystery_018` | V11 | answer | `dwar(?:f\|ves\|ven)\s+(?:of\|from)\s+[A-Z]\|dwar(?:f\|ven)\s+(?:home\|homeland\|halls\|kingdom)` | |
| `kl_mystery_019` | E2 | phrase | a: `Eindil\|the\s+Man\s+from\s+the\s+Ice` b: `(?:put\|placed\|laid\|cast)\s+(?:to\|into)\s+(?:sleep\|the\s+ice)\s+by\|slept\s+because` | |
| `kl_mystery_020` | V14 | phrase | a: `Bastian` b: `Lesser\s+Spirit\|Great\s+Spirit\|First\s+Men\|died\s+(?:long\|centuries)\s+ago\|(?:First\|Second\|Third)\s+Age` | Bastian is a living man of the Fourth Age (owner); text that makes him a spirit, a First Man or a figure of an earlier age contradicts canon. |
| `kl_mystery_021` | V15 | answer | `Zhen\s+Hills\s+(?:lie\|lay\|are\|stand)\s+(?:in\|near\|beside\|south\|north\|east\|west)\|arcanists?\s+(?:are\|were)\s+(?:men\|elves\|spirits\|giants\|a\s+people\|an\s+order)` | |
| `kl_mystery_022` | V6 | phrase | a: `Void\|Nether\|Abyss` b: `(?:connect\|connects\|joined\|same\s+(?:place\|realm)\|one\s+realm\|leads?\s+(?:to\|into)\|opens?\s+(?:on\|into))` | Only when two of the three names share the sentence. |
| `kl_mystery_023` | V13 | answer | `Aenor\s+(?:is\|was)\s+named\s+(?:for\|after)\s+Aen` | |
| `kl_mystery_024` | V7 | answer | `Elzon\s+(?:stole\|was\s+given\|bargained\s+for\|received\|took)\s+(?:the\s+\|Zol's\s+)?(?:old\s+)?(?:magic\|power)` | |
| `kl_mystery_025` | C22 | answer | `souls?\s+(?:are\|is\|were\|was)\s+(?:bound\|chained\|trapped\|enslaved\|caged)` | An attribution marker lowers it to review. |
| `kl_mystery_027` | V23 | answer | `\b(?:\d[\d,.]*\|\w+ty(?:-\w+)?\|one\|two\|three\|four\|five\|six\|seven\|eight\|nine\|ten\|eleven\|twelve\|hundreds?\|thousands?\|millions?)\s+(?:years?\|winters\|summers\|centuries\|ages)\s+(?:old\|of\s+age)\b\|\b(?:aged\|at\s+the\s+age\s+of\|in\s+(?:his\|her\|its)\s+\w+(?:th\|st\|nd\|rd)\s+year)\b` | Owner rule of 24 October 2026: no being's exact age is stated anywhere. A reign's year ("in the nineteenth year of his reign") is not an age and passes, because it names a reign, not a being's years. |
| `kl_mystery_026` | V22 | answer | `Volgan(?:'s)?\s+(?:raised\|made\|sends\|sent\|calls?\|called)\s+(?:the\s+)?storms?\|storms?\s+(?:of\|made\s+by\|raised\s+by)\s+Volgan` | Review severity; the world bible's "Volgan's storms" is a proposal. |

### 4.7 Allowances

An allowance in `secret_terms.json` has the shape of a banned-word allowance: `{ "id", "rules": [ids or kl_<layer>_*], "keys": [...], "files": [...], "fact": "W3", "reason": "..." }`.
Allowances may never name a `kl_sealed_*` rule; the scan fails on one that does.
An allowance for a `kl_mystery_*` rule must cite, in its reason, the vault page that records the owner's answer.
The travellers' family of keys (events of travellers from Erdae and Haven, when they are written) gets one allowance for `kl_dispute_001` and `bw_setting_names_001` together, with fact W3 or W5.

### 4.8 Positive and negative examples

Each row is a test case for `tools/content/tests/` (a planted value run through `runTextScan` with `ctx` overrides for the manifest and the data).

| Key (and gate, if any) | Displayed value | Expected | Rule |
| --- | --- | --- | --- |
| `zin_lore_codex_old_gods_desc` | "Some say the old gods sleep; others say they died before Aen." | pass | `kl_belief_005` has its marker |
| `zin_lore_codex_old_gods_desc` | "The old gods are asleep beneath the world." | fail | `kl_belief_005` |
| `zin_lore_codex_seven_desc` (allowed) | "The oldest books speak of seven makers before all names, and scholars call them a tale." | pass | marker present, allowance present |
| `zin_lore_codex_seven_desc` (allowed) | "One of the Seven was slain long ago, and its darkness lingers." | fail | `kl_sealed_010` (no allowance can cover it) |
| `zin_world_event_ship_desc` | "The fishermen tell of black ships among the islands, and nobody at court believes them." | pass | `kl_dispute_003` has its marker |
| `zin_world_event_ship_desc` | "Black ships sail among the islands of the Kusmeel." | fail before `zin_zol_rising` | `kl_dispute_003` |
| `zin_zol_desc` | "The dead of the black north are sustained by an old and terrible magic." | pass | no rule |
| `zin_zol_desc` | "Zol bows to a darker power than his own." | fail | `kl_sealed_008`, `kl_sealed_009` |
| `zin_zol_desc` | "Far to the west lies Dunda, where a dead god's shadow still rests." | fail | `kl_sealed_002`, `kl_sealed_013` |
| `zin_lore_pilgrim_desc` | "Pilgrims hold that the souls of the dead sail to Lao, where the gods dwell." | pass | `kl_belief_001` has its marker |
| `zin_lore_pilgrim_desc` | "The souls of the dead sail to Lao." | fail | `kl_belief_001` |
| `zin_lore_scholar_desc` | "The magister wonders why the gods so seldom answer, and finds no reason." | pass | no answer given |
| `zin_lore_scholar_desc` | "Divine magic works more freely in other lands than here." | fail | `kl_sealed_005` |
| `zin_aenor_temple_desc` | "The Deliverer's house in Parim feeds the poor." | pass | no rule |
| `zin_aenor_temple_desc` | "The Deliverer is Afrit, a demon in a man's shape." | fail | `kl_gated_001`, `kl_gated_004` |
| `zin_afrit_reveal_desc_revealed` (suffix gate) | "The Deliverer is Afrit, a demon in a man's shape." | pass | gated key |
| `zin_worshipdom_council_hub` (viewer Worshipdom) | "The Hidden Council meets at the third bell." | pass | early viewer |
| `zin_aenor_event_council_desc` (viewer any) | "[zin_loc_council] meets at the third bell." | pass | the call is removed before matching; the label switches at the gate |
| `zin_aenor_event_rumour_desc` | "$zin_loc_council_true$ meets tonight." | fail | nested gated key in a public key |
| `zin_eindil_stranger_desc` | "The Man from the Ice asks the way to the coast." | pass | no rule |
| `zin_eindil_stranger_desc` | "Eindil asks the way to the coast." | fail before `zin_eindil_named` | `kl_gated_011` |
| `zin_yeldenne_desc` | "In the hall lies a crystal of old and holy power." | pass | no rule |
| `zin_yeldenne_desc` | "Glo, the heart of Horos, burns green in the hall." | fail before `zin_horos_dead` | `kl_gated_013`, `kl_gated_014` |
| `zin_elves_wizard_desc` | "The elders tell of the wizard of the Unbinding and his small purple servant." | pass | no place named |
| `zin_elves_wizard_desc` | "The wizard of the Unbinding lives quietly in the Magic Mountains." | fail before `zin_eindil_returned` | `kl_gated_016` (a staged place name) |
| `zin_lore_dardan_desc` | "Millions died at Dardan, and the Gala still read their names." | pass | no place, no answer |
| `zin_lore_dardan_desc` | "Dardan lies south of the Great Lake." | fail | `kl_mystery_010` |
| `zin_lore_bastian_desc` | "Bastian, the famous wizard of men, still walks the roads of the Middle Lands." | pass | canon, no age |
| `zin_lore_bastian_desc` | "Bastian, who died centuries ago, was the last of the First Men's wizards." | fail | `kl_mystery_020` |
| `zin_lore_bastian_desc` | "Bastian, seventy years old, still walks the Lake Road." | fail | `kl_mystery_027` |
| `zin_aenor_king_desc` | "In the nineteenth year of his reign the king sold the last offices." | pass | a reign's year, not an age |
| `zin_lore_horos_desc` | "Horos is older than the charts of Aenor." | pass | no figure |
| `zin_lastwar_servant_desc` (after the servant flag) | "The Great Spirit named Edvoid led the dead of the north." | fail | `kl_sealed_021`, `bw_superseded_names_002` |
| `zin_lastwar_servant_desc` (after the servant flag) | "A Great Spirit of the black north took the field, and the blue blade broke against it." | pass | no identity |
| `zin_lastwar_servant_desc` (after the servant flag) | "Zol himself took the field in the flesh." | fail | `kl_mystery_008` |
| `zin_lastwar_servant_desc` (before the servant flag) | "Zol's most loyal servant stirs in the north." | fail | `kl_gated_018` |
| `zin_calendar_month_3` | "Third Month" | pass | no name |
| `zin_lore_harvest_desc` | "The harvest was good." | pass | lower case |
| `zin_lore_feast_desc` | "In Thaw the lamps are lit." | fail | `kl_mystery_003` |
| `zin_gods_codex_desc` | "Glernaen, a New God of power and wisdom, is the mightiest of the twelve." | pass | Glernaen excepted |
| `zin_gods_codex_desc` | "Plantedname, the New God of harvests, gives his name to the eighth month." (a deliberately meaningless test name; no god is named) | fail | `kl_mystery_002` |
| `zin_traveller_desc` (allowance W3) | "The sailor claims he comes from Erdae, a land of strange lamps." | pass | allowance and marker |
| `zin_traveller_desc` (no allowance) | "Erdae lies beyond the sea, smaller than Aoaz and full of its own magic." | fail | `bw_setting_names_001`, `kl_dispute_001`, `kl_sealed_020` |

### 4.9 Acceptance (A-33)

1. X18 runs in every build; a staged tree with any `kl_sealed_*` hit fails, whatever the family's gate.
2. A test build with "Erdu", "Dunda", "Zol's maker" or "one of the Seven was slain" planted in a state name, an event description and a tooltip fails three times each.
3. Every gated term planted in a public key fails, and the same text in a key under its gate (manifest or suffix) passes.
4. Every hidden fact of section 3 has a row in `secret_terms.json` with its register id, or a note in the data that no rule is needed (V17).
5. The report lists findings by layer and by fact.
6. `secrecyLeaks` and `checkSecrets` read their words from `secret_terms.json`, and their inline lists are removed.

## Questions for the owner

1. **Dunda as rumour.** May Dunda ever appear as a nameless dark rumour, and if so, who in Aoaz would whisper of it? This file allows it only in keys with an explicit allowance, never with the name.
2. **Haven.** The world map writes Haven twice, on both sides of Aoaz. Is it one land or two?
3. **Travellers.** When travellers from Erdae and Haven appear, what do they know of their own lands that they may say? Should they ever be playable or recruitable?
4. **Lao.** Lao is drawn on your map. Is it a real place in authorial truth, and is the belief that the gods dwell there true, false or undecided?
5. **Who knows the Holy Seven truly existed?** Do any beings in Aoaz (Horos, Lorien, Zol's servant) know, and may any text ever carry that knowledge, even behind a gate?
6. **Zol's servitude.** Must the fact that Zol serves his creator stay sealed for ever, even in an ending, or may one being ever reveal it?
7. **"The Fading."** Is "the Fading" a word the people of Aoaz use, or only an authorial term?
8. **The devils' Old God.** Devils served an Old God who was not necessarily Zol. May devils ever speak of their former master, given that it would reveal Old Gods beyond Aoaz?
9. **The Holy Seven's in-world labels.** Should one of the vault's candidate labels (Seven Before Names, Seven Who Never Were, and the others) be selected for text, or should the Seven stay unnamed in game text?
10. **Zol's servant after its appearance.** Once the servant has taken the field, may any text ever give its new name (Q-10), for example in an ending or the codex, or must it stay unnamed for ever, as this file assumes?
11. **Lesser New Gods.** May shrines of lesser New Gods appear in text with names of their own, or do all New God names wait for the pantheon decision?
