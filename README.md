# Erdae

Permanent local Hearts of Iron IV map mod. This repository is local only and must not be pushed or published.

## Current status

The initial repository contains only the map-mod folder skeleton and descriptors. Generated map data, countries, states, and offline validation evidence are pending. This skeleton is not yet a game-loadable map.

Geography follows the supplied source reference. East Earth is a naming correction; it does not move or reshape the source geography.

## Reproduction

The map generation seed, source-art provenance, exact generator call, dimensions, and validation results will be recorded here when the generated map is installed. No generator run or seed is claimed by this initial skeleton.

Reviewed names will be recorded in [docs/name_table.md](docs/name_table.md). Reference assets and their provenance belong under `docs/reference/`; private original art is ignored by default. Generated mod assets remain trackable.

## Local development

Use the standard `map/`, `history/`, `common/`, and `localisation/english/` directories. Do not add events, focus trees, or decisions as part of the map-only scaffold.

The adjacent launcher descriptor is `../erdae.mod`. Creation of these descriptors does not enable the mod in the launcher or change game settings. Offline generation does not launch the game. User-authorized live acceptance uses the isolated Linux test game only; the Windows launcher playset and settings remain untouched.

## Agentic setup

The checked HOI4 Mod Setup build has no supported headless project-install command. Its headless end-to-end harness uses synthetic fixtures and does not perform a native installation. Run the setup app on this folder next to install its development workflow; no desktop application or global client settings were changed during map preparation.
