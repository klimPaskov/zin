# Known map and stability issues

**Status:** In progress (sections 1 and 3 updated 19 October 2026). **Priority:** 1. **Phase:** 1.

## 1. Random crashes at the menu, at the start and in the running game (resolved 19 October 2026)

**Symptom.** From 17 October, Windows crashed with `EXCEPTION_INT_DIVIDE_BY_ZERO` at `hoi4.exe+0x1240ab6`: at the main menu, two seconds after a start, or seconds into a running game. Starts as Aenor in the Linux copy failed at random with a segmentation fault.

**Cause.** The engine places every country tag's flag in a texture sheet by tag index. In all three Windows minidumps the faulting instruction divides by the column count of sheet page 1, which was 0. ZIN defined 744 tags: 364 vanilla, then 75 dynamic, then its own 305 at indices 440-744, so loading a ZIN flag reached a page that was never laid out. Which flags load, and when, depends on timing; that is why the crash looked random.

**Wrong leads, recorded so they are not retried.** The 30,000 manpower floor for near-empty subject states (`STATE_MANPOWER_FLOOR`, still in the politics step) and the 19 October bisection of the inactive history files both changed which flags loaded first and seemed to help. Neither was the cause. None of those tests unpaused the clock.

**Fix.** ZIN defines only its 305 tags, first, and vanilla's 75 dynamic tags after them: 380 in all, below vanilla's own 439 (commit `ca01fa3`; [00_foundation/06_vanilla_removal_and_zero_errors.md](../00_foundation/06_vanilla_removal_and_zero_errors.md), stage 1 step 2). A politics test fails if the tag total exceeds 439.

**Acceptance.** Met on 19 October: four Linux runs of the build start as Aenor and run 10 to 15 minutes at top speed (four months of game time) without a crash. Still open: the Windows confirmation by the owner, and the every-country start test of phase 1.

## 2. Superseded names in internal files

Two strategic region files still carry "Edvoid" in their file names. Players don't see file names. Rename them on the next map rebuild.

## 3. Data defects found while writing the specs (18 October 2026)

These break the lore or the starting situation and are fixed in phase 1 or 2. Details are in the foundation specs.

| Defect | Fix | State |
| --- | --- | --- |
| **The secret leaks:** the Worshipdom's ruler is named "Afrit", its description names the Hidden Council, and its ideology shows Shadow on day one | [INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md) D1: Light Sanctuary, ruler Aurevan the Deliverer, safe description | fixed (19 October) |
| Zol has a human ruler with a portrait | An emblem leader, "The Will of Zol" (S4) | fixed (19 October) |
| Zol's Mistake holds 37 million manpower, 82 factories and almost half the world's steel, though the lore calls it a barely peopled wasteland | Population, industry and resources near zero outside Furviatlon | open |
| Volgan's realm holds the only megalopolis (state 299) | Reserve the largest city for Parim | open |
| Aenor is weak: 12.7 million manpower and 33 factories, behind Zol, Coldor and the Magical Forest | Raise Aenor to the strongest single realm | open |
| 941 of 1,332 states are named "<Country> District N" | Name states from the drawn labels ([00_foundation/04_countries_and_states.md](../00_foundation/04_countries_and_states.md)) | open |
| Aenor starts with 10% Shadow popularity | 0% (D5) | fixed (19 October) |
| Stale role texts with modern words, and Selen described as a counterweight to Aenor | Rewrite from the specs | open |
| Every country uses the western European graphical culture | Erdae cultures `zin_<people>_gfx` | fixed (19 October) |
| Election dates are 1932 (88 countries) | Fourth Age dates with the calendar | open (phase 2) |
| States carry air base levels (for example 2) | Remove air bases until dragons and the air layer exist (S6) | open |
