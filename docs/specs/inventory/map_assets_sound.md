# Map, world art and sound inventory (area map-assets-sound)

168 rows in `map_assets_sound.csv`, measured on the installed 1.19.3.0 and the ZIN repo, 19 October 2026.

**Counts.** Disposition: replace 72, override 31, keep-hidden 26, engine 18, reskin 12, remove 9. Status: todo 83, partial 46, done 39. GAP: 49.

**Top 10 gaps**
1. Textures: vanilla `fow_rgb_waterspec_a` is stretched over Erdae, the tile atlas is Earth's, the colour map is a flat tint (MA-026 to 029).
2. Relief: ZIN land spans grey 96 to 142; vanilla reaches 239 (MA-005).
3. Terrain: 8 palette indices, 100 disjoint rivers, thin trees (MA-004, 006, 007, 035).
4. Land touches both edges; borders ignore nature (MA-130, 133).
5. No straits: adjacencies and rules empty (MA-012, 013).
6. Empty ambient objects: no sea or wind sound, no Great Wall (MA-022).
7. Colour-grading boxes at Earth coordinates (MA-054, 055).
8. Placeholder names: 941 districts, 257 regions, 527 unnamed victory points (MA-043 to 045).
9. Nothing audible is ZIN's yet (MA-100 to 117).
10. Vanilla 3D, aces, scientists, nine languages of vanilla text (MA-062 to 066, 080 to 099, 137 to 146).

**Risks.** Emptying breaks the game: `definition.csv` row 0, the `-1` row of `adjacencies.csv`, `continent.txt` indexes, terrain categories `unknown`, `ocean`, `lakes`, a replaced folder without a ZIN file, the song `maintheme`, sound categories, more than 438 tags, an invalid `tutorial.txt`.

**Owner questions (proceeding on the proposal)**
1. Colour map, normals and water as tool-computed data? Yes; terrain tiles and border sheets are image-generated and sliced.
2. Rivers, lakes and ranges have no native label: name them through states, regions, victory points and the Chronicle.
3. Meshy credits (40): first a Great Wall segment and four houses.
4. Copy ZIN English text into the nine other languages.
5. Hide the career profile.
6. No spoken voices.
