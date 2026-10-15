# ZIN

Local-only Hearts of Iron IV map mod for **Erdae**. Never push or publish this repository.

## Current build

The cleaned source has been converted into a 4096×3072 map with **13 provisional countries, 7,406 provinces, 814 states, 359 strategic regions, 817 victory-point settlements, 292 ports, 814 supply hubs and 64 rivers**. Terrain, relief, water, forests, city footprints, buildings, flags, localisation, recruitment templates, starting divisions and stockpiles are generated.

The isolated Linux HOI4 1.19.3.0c01a test entered a campaign, moved two divisions, verified supply, advanced from 1 January to 7 February 1936, saved and reloaded. Native and offline evidence are separate under [docs/generation](docs/generation/). This does not claim long-term balance or an authored campaign. Startup warnings from unused vanilla definitions remain.

## Reference and reproduction

[Cleaned reference](docs/reference/cleaned/Erdae-clean-v1.png) · [Terrain preview](docs/generation/terrain.png) · [Political preview](docs/generation/political.png)

The original is unchanged and ignored under docs/reference/originals. Handwritten names, lines and paper seams were removed in a separate reference before the accepted rebuild. Names are retained as localisation, not burned into terrain pixels. Small coastlines are approximate.

[Exact MCP request](docs/generation/request.json) · [Hashes and measured evidence](docs/generation/provenance.json) · [Assumptions](docs/generation/assumptions.md) · [Name assignments](docs/generation/name_assignments.json)

Use the request with hoi4.map_rewrite. Set preview to true first to inspect the proposed world. Generation is deterministic with seed 73. Keep .hoi4-agent-world.json: it protects edited generated files and safely removes obsolete outputs on rebuild.

## Local use

The adjacent zin.mod descriptor is synchronized. The Windows launcher playset and game settings were not changed; enable ZIN yourself when ready. Use a new campaign for a regenerated world.

The political setup is provisional under the owner's instruction. East Earth is a naming correction, not a relocation. The project remains map-only: no new authored events, focus trees or decisions. See the existing [name table](docs/name_table.md) for uncertain readings.
