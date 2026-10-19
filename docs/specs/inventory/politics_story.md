# Politics and story inventory (area PS)

191 rows in `politics_story.csv`, measured on game 1.19.3 and the working tree of 19 October 2026 (uncommitted calendar, defines and history changes count as `partial`).

**Dispositions:** replace 113, reskin 31, override 23, keep-hidden 14, engine 8, remove 2.
**Status:** todo 98, partial 56, done 37. **GAP:** 21 rows.

## Top 10 gaps

1. PS-189: the generic AI strategies (`default.txt`, `doctrines.txt`) vanish with the replaced folder.
2. PS-185: `common/generation` names vanilla theorist traits that stage 2 removes.
3. PS-022, 023, 025: military staff, theorist and officer corps slots stay empty for about 300 courts.
4. Interface wording has no owner: PS-013, 095, 101, 174, 180, 182, 184.
5. PS-113 to 115: ribbons, medals and unit medals use real-world honours.
6. PS-100: modern diplomatic actions (Lend-Lease, License Production).
7. PS-057, 178: career profile, playthrough statistics.
8. PS-191: non-English localisation.
9. PS-045, 166: rank and weekday names.
10. PS-098, 014: war goal names, government in exile.

Largest owned work: 2,440 party-name keys, about 700 events, flag variants, 95 focus trees.

## Risks (crash or log if emptied)

- `national_focus` and `continuous_focus` need a default definition (crash at `cosmetic.txt`); a missing shared focus crashes the menu.
- Dynamic tags: keep the 75; total tags below 439.
- AI templates, a capital per country, `tutorial = { }`.
- Kept names: idea slots, law keys, `received_attache`, 29 opinion modifiers, engine-called triggers, peace category keys.
- Vanilla `portraits/00_portraits.txt` merges with ZIN's until stage 2.

## Owner questions (proceed on yes)

1. Hide career profile, achievements, ribbons and medals with the online buttons?
2. Hide the officer corps view?
3. Keep Lend-Lease style actions with Erdae names?
4. Rename the seven weekdays?
5. English only, copied into the other language folders?
