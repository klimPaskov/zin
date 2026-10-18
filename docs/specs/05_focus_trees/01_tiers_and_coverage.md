# Tiers and coverage

**Status:** Ready. **Priority:** 4 (tier A), 6 (tiers B and C). **Phase:** 4 and 6.

## Purpose

Every one of the 305 countries gets an Erdae focus tree. No country falls back to a vanilla tree. This spec assigns each country its tier and tree. The table is generated from the country roster; regenerate it when the roster changes.

## Tiers

| Tier | Who | Size | Content |
| --- | --- | --- | --- |
| **A: major** | 13 great powers and lore powers | 80 to 140 focuses | Own spec in [major/](major/); every route of its mechanic; unique spirits, events and art; AI routes |
| **B: regional** | 71 countries with lore weight, size or a role in the story | 30 to 50 focuses | Own spec section in [regional/](regional/); a unique core plus pieces of its region's shared tree |
| **C: shared** | Every other country | 40 to 70 focuses in one tree per region | One shared tree per region with branches by people, ideology, overlord and coast; text names the country |

A tier B tree may reuse branches of its region's shared tree by copying them into its own file with new keys; it never shares focus ids with another tree.

## Tier A

| Country | Region | States | People | Tree | Spec |
| --- | --- | ---: | --- | --- | --- |
| Aenor | Middle Lands | 18 | men | `aenor` | [major/aenor.md](major/aenor.md) |
| Lerendor | North Lands | 6 | men | `lerendor` | [major/lerendor.md](major/lerendor.md) |
| Volgan | Dead Lands | 9 | the_dead | `volgan` | [major/volgan.md](major/volgan.md) |
| Zol | Ocean of Zol | 104 | the_dead | `zol` | [major/zol.md](major/zol.md) |
| Worshipdom | Magical Lands | 3 | men | `worshipdom` | [major/worshipdom.md](major/worshipdom.md) |
| Magical Forest | Magical Lands | 17 | elves | `magical_forest` | [major/magical_forest.md](major/magical_forest.md) |
| Gala Elves | Lands of the Sun | 1 | elves | `gala` | [major/gala.md](major/gala.md) |
| Coldor | Cold Lands | 24 | men | `coldor` | [major/coldor.md](major/coldor.md) |
| Noris | East Lands | 24 | men | `noris` | [major/noris.md](major/noris.md) |
| Stabilo | East Lands | 14 | men | `stabilo` | [major/stabilo.md](major/stabilo.md) |
| Gunwaith | West Lands | 12 | men | `gunwaith` | [major/gunwaith.md](major/gunwaith.md) |
| Goldoroth | Dark Lands | 6 | orcs | `goldoroth` | [major/goldoroth.md](major/goldoroth.md) |
| Mirolon | Dead Lands | 6 | men | `mirolon` | [major/mirolon.md](major/mirolon.md) |

## Tiers B and C by region

### Middle Lands (29)

- **Tier A:** Aenor.
- **Tier B** (own tree `regional_<name>`): Noleksun (`regional_noleksun`), Selen (`regional_selen`), Herez (`regional_herez`), Konori (`regional_konori`), Kilinti (`regional_kilinti`), Kingson (`regional_kingson`), Bloody Forest (`regional_bloody_forest`), Hunhun (`regional_hunhun`), Hiloron (`regional_hiloron`), Cursed Lands (`regional_cursed_lands`).
- **Tier C** (shared tree `shared_concord_dominions`, 18 countries): Freshon, Pazoma, Kunhrim, Belurithon, Klungori Guard, Mondon, Noloreh, Olvinc-un, Safeton, Svenlor, Tieri, Vothrim, Dariap, Fotan, Hilofrim, Novez, Stendorler, Ulgus.

### Aenor Isle (1)

- **Tier B** (own tree `regional_<name>`): Asgard (`regional_asgard`).

### North Lands (28)

- **Tier A:** Lerendor.
- **Tier B** (own tree `regional_<name>`): Sensai (`regional_sensai`), Mina (`regional_mina`), R'en (`regional_r_en`), Molot (`regional_molot`), Eekedor (`regional_eekedor`).
- **Tier C** (shared tree `shared_north_lands`, 22 countries): Belg, Goran, Heodwa Lands, Pertawn, Solenkovi, The Hold, Allegro, Mine Din, Nuatax, Ashorn, Cinargo, Ferlinon, Filit, Gil'dul, Gul'dur, Keredor-Hellekton, Low-ness Islands, Mustnom, Oirt, Stork, Thowson, Tolhon.

### Cold Lands (31)

- **Tier A:** Coldor.
- **Tier B** (own tree `regional_<name>`): Fearno (`regional_fearno`), Yeti Lands (`regional_yeti_lands`), Horidor (`regional_horidor`), Isengard (`regional_isengard`), Windwaith (`regional_windwaith`), Titanos (`regional_titanos`), Yeldenne (`regional_yeldenne`).
- **Tier C** (shared tree `shared_cold_lands`, 23 countries): Worlond, Omar, Londor, Felkond, Orewele, Portogalor, Xison, Naepu, Poloto, Radeon, Wonderland, Celen, Neridor, Rion, Hendair, Hozoson, Holdon, Pertolor, Gaadon, Greenle, Agoron, Belor, Yeneldmore.

### West Lands (21)

- **Tier A:** Gunwaith.
- **Tier B** (own tree `regional_<name>`): Lambin (`regional_lambin`), Buldor (`regional_buldor`), Kradlon (`regional_kradlon`), Corogon (`regional_corogon`), Varnondor (`regional_varnondor`), Girdon (`regional_girdon`).
- **Tier C** (shared tree `shared_west_lands`, 14 countries): Werlendor, Hky, Thenon, Argo, Lothoro, Saopon, Sobre, Canako, Oslinod, Pernogon, Forbo, Sarudon, Toples, Trilino.

### Triton's Islands (34)

- **Tier B** (own tree `regional_<name>`): Halenor (`regional_halenor`), Seite Islands (`regional_seite_islands`), Adel (`regional_adel`), Nondondor (`regional_nondondor`), Pollos (`regional_pollos`), Raerby (`regional_raerby`).
- **Tier C** (shared tree `shared_tritons_islands`, 28 countries): Fineger, Hiohon, Tses - The Vestes, Ziza, Aatah, Amarelo, Anbei, Arpos, Beemste, Benan, Bono, Cheko, Dani, Hesos, Kile Islands, Kim, Kusu, Lemo, Li, Mondeluz, Previous Dark, Santon, Sondor, The Cursed Square, The Lens, Tined, Urbolon, Windy Lands.

### Dark Lands (24)

- **Tier A:** Goldoroth.
- **Tier B** (own tree `regional_<name>`): Blackton (`regional_blackton`), Dulundur (`regional_dulundur`), Bordon (`regional_bordon`), Dondor (`regional_dondor`), Dreson (`regional_dreson`), Troll Forest (`regional_troll_forest`).
- **Tier C** (shared tree `shared_dark_lands`, 17 countries): The Darks, Colost, Dunbulinor, Fondor, Bold, Dark Gate, Belonton, Beriath, Britadon, Dun, Gord, Gull Kingdom, Lestern Isles, Sungodor, The Doltu, Wild Lands, Zuriath.

### Magical Lands (22)

- **Tier A:** Magical Forest, Worshipdom.
- **Tier B** (own tree `regional_<name>`): Lccimio (`regional_lccimio`), The End (`regional_the_end`), Herrodon (`regional_herrodon`), Andos Enda (`regional_andos_enda`), Nolorim (`regional_nolorim`).
- **Tier C** (shared tree `shared_magical_lands`, 15 countries): Luv-zhise, Lengoli, Filion, Kingdom, Ossa, Heron, Nolivorak, Perloia, Endelond, Greenland, Teste, Dulo-Dulo, Sacomananos, Velakton, Lusteli.

### Ocean of Zol (1)

- **Tier A:** Zol.

### Dead Lands (13)

- **Tier A:** Volgan, Mirolon.
- **Tier B** (own tree `regional_<name>`): Olen (`regional_olen`), Nezer (`regional_nezer`), Demon (`regional_demon`), Dolon (`regional_dolon`), Nan (`regional_nan`).
- **Tier C** (shared tree `shared_dead_lands`, 6 countries): Mencnon, Bennen, Dra, Gelon, Luminor, Mirodor.

### East Lands (35)

- **Tier A:** Noris, Stabilo.
- **Tier B** (own tree `regional_<name>`): Alerhia (`regional_alerhia`), Miaed (`regional_miaed`), Erco (`regional_erco`), Plutondo (`regional_plutondo`), Drak (`regional_drak`), Ostoroth (`regional_ostoroth`), Gondolin (`regional_gondolin`), Mora (`regional_mora`), Avalon (`regional_avalon`).
- **Tier C** (shared tree `shared_east_lands`, 24 countries): Delbiz Grasslands, Mostok, Azano, The Moco, Cream, Ernois, Fosoco, Kersian, Eraver, Pornivior, Grova, Vigodor, Woqood, Arcon, Obmi, Furro, Hacsen, Oreton, Nethnu, Olor, Orato, Mylunur, Lorvens, Fladev.

### Islands of the South (19)

- **Tier B** (own tree `regional_<name>`): Enhis Is Rond (`regional_enhis_is_rond`), Howan (`regional_howan`), Nara (`regional_nara`), Verde (`regional_verde`).
- **Tier C** (shared tree `shared_islands_of_the_south`, 15 countries): Agla, Kea, Yumbo, Angsutz, Dunn, Finn, Jingar, Lua, Meng, Pon, Sidea Islands, Torsor, Yongrost, Yongyong, Yowi-yoor.

### Lands of the Sun (47)

- **Tier A:** Gala Elves.
- **Tier B** (own tree `regional_<name>`): The Lands of Light (`regional_the_lands_of_light`), Poyang (`regional_poyang`), Godland (`regional_godland`), Hengyang (`regional_hengyang`), Elvana (`regional_elvana`), Goodin (`regional_goodin`), Heaven (`regional_heaven`).
- **Tier C** (shared tree `shared_lands_of_the_sun`, 39 countries): Dein Lands, Godson, Godton, Helen, Sun God Land, Dreamland, Flame, Hel, Hol, Lovis, Sono, Armic, Beforelands of Gulia, Biggen, Gala, Godrela, Goodton, Guuden, Heilmon, Him, Igara, Land of the Sun, Loyol, Menga, North Gala, Ofos, Pinion, Rana, Sali, Sensun, Soyano, Sunny, Sunweli, Sus, Tangsie, Tei, Via, Wenyene, Yungin.

## Totals

| Tier | Countries |
| --- | ---: |
| A | 13 |
| B | 71 |
| C | 221 |
| **All** | **305** |

The Ocean of Zol region holds only Zol (tier A). Aenor Isle shares the Middle Lands' dominion tree.

## Acceptance

The compiler's coverage check passes: every roster country maps to exactly one tree.
