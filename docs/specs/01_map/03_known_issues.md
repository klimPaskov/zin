# Known map and stability issues

**Status:** In progress. **Priority:** 1. **Phase:** 1.

## 1. Starting as Aenor crashes the game (resolved 19 October 2026)

**Cause and fix.** Dariap, one of Aenor's subjects, had a single state with 4,492 people. Its recruitable manpower rounded to zero, and the game divides by it when the player is its overlord or faction leader (Windows: integer divide by zero; Linux: segmentation fault). Bisection in the Linux copy: Aenor started with a minimal history, with no subjects and no faction, and with everything except Dariap. The politics step now gives every state at least 30,000 people (`STATE_MANPOWER_FLOOR`), with a regression test; 19 countries had fewer than 25,000. Aenor starts in the Linux run.


**Symptom.** In the isolated Linux game, choosing Aenor and pressing Start crashes with a segmentation fault. The stack is the same every time: `(+0x266a46c) (+0x13cf698) (+0x13cef6b)…`. The binary is stripped.

**Ruled out so far** (each tested in the Linux copy and restored afterwards):

- Faction membership (Middle Kingdom Concord) and the 26 puppets.
- Starting divisions (6 instead of 14).
- The map widening.
- The building, portrait and name fixes of 18 October.
- Region: Lerendor, Zol and Selen, Aenor's neighbours, start normally.

**Remaining suspects,** in order:

1. Aenor's country name, definite name ("the Middle Kingdom") or adjective localisation.
2. Aenor's ruler character `<TAG>_zin_ruler` (the Golden King) or its portrait.
3. Aenor's states or capital state (a building, victory point or supply node the engine dereferences when the player takes over).
4. Country-specific history entries: ideas, technologies, starting OOB templates, the ruling party and popularities.

**Method.** Bisect in the Linux copy: replace one suspect at a time with a known-good value from a working country, start as Aenor, restore. Record each result here. When the cause is found, fix it in the generator, add a negative test, and rerun the start test for all five great powers.

**Acceptance.** Starting as Aenor reaches the map and runs 60 days.

## 2. Superseded names in internal files

Two strategic region files still carry "Edvoid" in their file names. Players don't see file names. Rename them on the next map rebuild.

## 3. Data defects found while writing the specs (18 October 2026)

These break the lore or the starting situation and are fixed in phase 1 or 2. Details are in the foundation specs.

| Defect | Fix |
| --- | --- |
| **The secret leaks:** the Worshipdom's ruler is named "Afrit", its description names the Hidden Council, and its ideology shows Shadow on day one | [INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md) D1: Light Sanctuary, ruler Aurevan the Deliverer, safe description |
| Zol has a human ruler with a portrait | An emblem leader, "The Will of Zol" (S4) |
| Zol's Mistake holds 37 million manpower, 82 factories and almost half the world's steel, though the lore calls it a barely peopled wasteland | Population, industry and resources near zero outside Furviatlon |
| Volgan's realm holds the only megalopolis | Reserve the largest city for Parim |
| Aenor is weak: 12.7 million manpower and 33 factories, behind Zol, Coldor and the Magical Forest | Raise Aenor to the strongest single realm |
| 941 of 1,332 states are named "District N" | Name states from the drawn labels ([00_foundation/04_countries_and_states.md](../00_foundation/04_countries_and_states.md)) |
| Aenor starts with 10% Shadow popularity | 0% (D5) |
| Stale role texts with modern words, and Selen described as a counterweight to Aenor | Rewrite from the specs |
| Every country uses the western European graphical culture; election dates are 1932; 26 air base levels | Erdae cultures; Fourth Age dates; remove air bases |
