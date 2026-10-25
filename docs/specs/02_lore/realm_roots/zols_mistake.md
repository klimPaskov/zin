# Realm roots: Zol's Mistake

**Status:** Proposed (decision K67, 25 October 2026). Nothing here is canon until the owner adopts it; every root, sign and hook below is labelled **P** under the vault's Canon Policy, and the established facts it builds on are labelled **E**.
**Data:** the `roots` and `sign` fields of the realm in `tools/content/data/world/history/zols_mistake.json`, with the events, the custom and the divergence added beside them.
**Companions:** [the regional dossier](../../../lore/regions/zols_mistake.md) (section "Roots and signs"), the vault note [Roots of Zol's Mistake](../../../lore/vault/07%20-%20History/Roots%20of%20Zol's%20Mistake.md), [knowledge_layers.md](../../../lore/references/knowledge_layers.md) (rows V2, V3, V8, V10, C6, C7, C9, C24, C25, W8 to W10), [06_heraldry.md](../../08_art_and_assets/06_heraldry.md) section 1.5 (Zol's servant) and the focus tree `docs/design/focus/zol.json`.

## Purpose

The owner asked that every realm carry the ancient history that built its culture and that its sign come out of that history, as the Eye on Mordor's banners was Sauron's own sign (K67).
Zol's Mistake is the one realm of Aoaz whose roots may not be told from the inside.
The knowledge layers keep open why the land is a Mistake (V2) and who keeps Furviatlon (V3), seal what Zol needs and who serves him (C7, C9) and everything of his creator and the wider world (W8 to W10), and allow Kusven only as a legend of the winter tales until he takes the field (C24, C25).
So the roots are written from the sea, as the living of the north know them, and they hang on one established fact that answers nothing: the souls of the dead remain Zol's (E, owner decision of 24 October 2026, K15).

## The sign at a glance

| Realm | Sign (device) | Charge class | Root |
| --- | --- | --- | --- |
| Zol's Mistake | broken concentric rings in cold grey on void black, each ring open on the same side: the sigil of the Will of Zol (E as a device, heraldry spec 1.5; its story P) | rings | the open burial rings of the outer isles and the pilot's still-water mark of 1A 470 |

The device is unchanged: the heraldry spec fixes the broken-ring sigil for this realm and forbids Kusven, his isle and the Beasts on any flag.
What K67 adds is the sign's story, so that the flag designers draw the rings as rings left open (each break on the same side, as a burial ring is left open toward the north) rather than as an abstract pattern.

## Roots (P)

**Who came first.** Zol, the Old God of Death, came to the black north long before Aen and Volgan, and the land was already black rock, ash and black frost (E).
No people of men lived on the mainland in any memory (E for the chronicles, P as the roots' reading), so the realm has no founder, no first king, no oath and no tongue of its own.
The oldest sea-words of the north-west, older than any chart, have a word for the black coast that means only "the shore from which nothing comes back" (P); the word stays untranslated into any fallen realm's name.

**The open rings.** On the outer isles someone laid the dead inside rings of black stones and left every ring open on its northern side (P).
Whose hand that was nobody knows, and no text may guess.
The Leren fishers who began to winter there in 4A 230 (P, existing event) found the rings older than any record and took up the custom: the dead belong to the Old God of Death, they say, and a closed ring would be a theft from him (P, resting on E).

**What grew from it.** The first fish left on the black shore, the silence and low lamps of still nights, the name never spoken at sea, and the winter tale of Kusven the grave-wind (all P customs or E legend) are read as branches of the one belief that what dies is owed.
The pilot of the northern voyages who charted the coast in 1A 470 drew rings on flat water beside the name, broken where his pen lifted, as the mark of a sea that lay still (P, expanding the existing founding).

**In 4A 1748.** The rings are still laid on Peledor, Drolkot and Erinlor, the Strait Litany's one attempt to close them (Erinlor, 4A 1450) ended with a lost boat and a reopened ring, and the charts of the Rim still carry the broken rings beside the still sea (P).

**Added to the history data.** Events: The Open Rings (4A 230) and The Ring Closed at Erinlor (4A 1450). Custom: `open_rings`. Divergence: `the_rings_closed` (beat B24).

## Sign (P)

- **Device:** broken concentric rings in cold grey on a void-black field, each ring open on the same side.
- **Origin:** the pilot's still-water mark on the Aenoran chart of 1A 470 and the open burial rings that the fishers found on the outer isles in 4A 230; the charts and the courts give it to the Will of Zol, the emblem in whose name the realm is held.
- **Meaning:** to the living, the open ring of the dead, what dies is owed and not kept back; over the hosts of the black north, the threat that every grave in their path is open and what they take does not come back.
- **Weaving note:** three or four rings of one cold grey, cut-cloth on black, the gaps aligned; no figure, no eye, no isle, no beast, no lettering.

## Hooks for play (P)

### (a) Focus-branch ideas for `zol`

1. **The Open Rings** (a side branch under `let_them_talk` in the Black Islands column). Two mutually exclusive focuses: *Let the Living Fish* keeps the Leren fishers on the outer isles, so the black ships stay a fishermen's tale (V10 stays `disputed`) and the neighbours' chance to send a ship to look falls; *Empty the Outer Isles* drives them off, which hides nothing but leaves the Rim with no watchers, so the neighbours' first warning of the rising comes later and from farther south. Adds one spirit each and moves the divergence weights of `a_ship_sent_to_look` and `the_rings_closed`.
2. **What Dies Is Owed** (after `the_fallen_return` in the Dead of Zol column). After `zin_zol_rising`, a spirit that turns the dominion's land battles in coastal states into reinforcement: the dead of both sides are counted toward the hosts (a manpower gain scaled by the enemy's losses in those states, tuned from one script constant), and the text says only that "every grave in their path is open". It never claims that the dead can be recruited from the wandering dead, which stay outside any host.
3. **The Still Sea** (beside `keep_the_isles_dark`). The pilot's still-water mark made a naval doctrine: a spirit that slows and blinds enemy fleets in the Kusmeel's strategic regions (reduced enemy naval speed and spotting there, built as a dynamic modifier on the dominion that checks the fleet's region), plus a minor report event to the coastal neighbours on the first still month of each winter before the rising.
4. **The Shore From Which Nothing Comes Back** (in the Silence of the North column, after `older_than_kings`). Ships beyond the Rim do not return: a decision family that lets the dominion sink a neighbour's scouting ship once the neighbour has taken *Send a Ship to Look*, closing that divergence's forewarned outcome and opening its "they believe the fishermen anyway" outcome.
5. **The Winter Tale** (a two-focus branch from `let_them_talk`). The legend of Kusven spreads in the shore towns before he takes the field: the neighbours' war support falls a little and the Strait Litany's stability rises a little in the Leren realms, every text keeps to the legend (C24) and names nothing of his nature, and after `zin_kusven_forth` the branch's spirit swaps into a fear modifier on the coasts he has struck.

### (b) Formable or restorable identities

1. **The Wardens of the Open Rings** (for a living realm, P). *Entitlement:* the fishers of the outer isles kept the open rings and the first fish for fifteen centuries, and the realm that keeps faith with them after the black north is beaten inherits their watch on the Rim. *Who:* a Leren-speaking crown of the North Lands (Lerendor or the realm that holds Orato) after the War of the Last Crowns. *Requirements:* `zin_zol_withdrawn` set (the servant forced back) or the dominion's hosts broken; the crown controls Peledor, Drolkot and Erinlor; it has never taken *Close the Rings*; Strait Litany stability above a threshold constant. *What changes:* a cosmetic identity "the Wardens of the Open Rings", the Rim's ports as a coastal-watch state modifier (spotting and coastal fort speed), and a yearly event of the first fish that keeps the custom alive.
2. **No identity for the dominion itself** (deliberate). Any formable or cosmetic name for Zol's Mistake would have to say who keeps Furviatlon, what Kusven is, or why the land is a Mistake, which V2, V3 and C25 forbid. The realm keeps its one name and its one sigil.

### (c) Events and decisions

1. **A Ring on the Shore** (event, the Leren crown nearest the Rim, early in the campaign): a Litany priest reports an open ring laid on a Lerendor-held islet; options: tell the Litany (stability, sets the way to *Close the Rings*) or let the fishers keep it (no effect, keeps the custom).
2. **Close the Rings** (decision, a realm of the Strait Litany that holds an outer isle): stability and Litany standing now; sets `the_rings_closed`, so the outer-isle fishers leave and that realm and its neighbours lose the minor report that would otherwise warn them of the rising.
3. **Copy the Chart of 1A 470** (decision, Aenor or Lerendor, either of which keeps Aenoran charts): reveals the still-water marks; required before *Send a Ship to Look* gives its forewarned result; the event text describes the broken rings drawn beside the name.
4. **The First Fish Eaten** (event, a North Lands coastal realm, random once before the rising): a skipper keeps the first fish and his boat comes home without him; options: punish the crew (stability) or mock the custom (war support, and a later minor report that another boat was lost).
5. **The Still Month** (minor report event, the coastal neighbours of the Kusmeel, at the dominion's power thresholds before `zin_zol_rising`): the sea lies still round the black isles; the text keeps the tale `disputed` and never says what stirs.
6. **Every Grave Open** (country event, not news, for the realm whose coast the hosts first strike after the rising): the dead of the shore graves are gone from their rings; options are courage or flight, and both raise the coastal defence focus's AI weight.

**Counts:** 5 focus-branch ideas, 1 formable identity (plus one deliberate refusal), 6 events and decisions.

## Guards kept

- No text gives the reason for the name, the keeper of Furviatlon, the making or nature of Kusven, what Zol needs, which beings serve him, or anything of his creator and the wider world.
- The dead remain Zol's (E); the wandering dead are never recruited (existing rule), and the roots never say that every wanderer belongs to Zol.
- The flag shows only the broken rings; no realm is named after its leader and no flag shows a leader.
- Dates before Aen appear as "long before Aen" only; no age of any being is stated.
