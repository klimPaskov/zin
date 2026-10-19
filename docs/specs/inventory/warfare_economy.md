# Warfare and economy inventory (WE)

203 rows. Disposition: replace 102, reskin 48, remove 26, override 20, keep-hidden 4, engine 3. Status: todo 180, partial 19, done 4. Owner GAP: 27.

## Top 10 gaps

1. About 40 industry and electronics technologies: no list, names or years (WE-013 to 018).
2. 16 naval and air subdoctrines unnamed (WE-034, 035).
3. Workshops and special projects are on in the economy spec, yet the interface spec treats their 550 icons as unreachable (WE-150, 152).
4. Army HQ, officer corps, ranks, command power, experience pools (WE-040, 048, 141, 143).
5. Intelligence upgrades and cryptography keep modern wording and art (WE-174, 178).
6. International Market, licences, lend-lease (WE-106 to 108).
7. 2,268 unit voice files and battle plan names (WE-083, 066).
8. Unplanned art: 100 template icons, 57 tactic pictures, 33 medals, combat and building effects, trains (WE-055, 067, 080, 132, 145, 194).
9. Energy strings, consumer goods name (WE-113, 127).
10. Empty design-company and staff slots (WE-144).

## Risks

- Replacing `common/units`: every equipment needs a sub-unit; keep `convoy`, `train_equipment`, `motorized_equipment`.
- A missing AI template or taskforce entry crashes the AI.
- Never `replace_path` `common/unit_leader`; `rocket_site` stays defined.
- Emptied doctrine, special-project or technology folders error.
- 305 histories still name vanilla technologies and equipment.
- Wrong `supply_nodes`, `railways`, `buildings` entries crash.
- Non-modular dragon equipment untested in 1.19.3.
- A sub-unit without a ZIN entity shows a vanilla soldier.

## Owner questions (proceeding on proposals)

1. Keep the ship designer with fixed modules and rename the market "Great Fairs"? Proposal: yes.
2. Erdae rank titles and "Orders" for command power? Proposal: yes.
3. Unit voices? Proposal: none.
4. Army HQ as a War Camp? Proposal: yes.
5. Cryptography as Seals and Codes? Proposal: yes.
