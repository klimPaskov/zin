# ZIN project instructions

This is a permanent, local-only Hearts of Iron IV overhaul set in Erdae. Never push or publish this repository.

## Scope

- On 17 October 2026 the owner authorized a full content overhaul: mechanics, interface, events, focus trees, decisions, ideologies, units and technologies. The plan is in `docs/design/overhaul.md`.
- The geography is the owner-approved layout of 17 October 2026 with the central sea widened on 18 October, recorded in `docs/generation/assumptions.md`. Change it only on the owner's request.
- Mechanics, interface, countries and states come first. The owner's lore vault (`docs/lore/vault/`) is canon: follow its Canon Policy, never present proposed material as established, and use Eindil (not Einendil).
- Never copy assets, text or scripts from other mods, including the Lord of the Rings mods. Study them for design only. All art is new and image-generated; code may only slice, resize and convert generated images. Record every generation in `art/source/provenance.jsonl`.

## Engineering

- Generate content deterministically from scripts in this repository and write it through the shared atomic rewrite engine.
- The MCP product performs offline generation and validation only. The author explicitly authorizes isolated Linux live acceptance under the shared WSL game lock. Never control the Windows game or modify its launcher playset or settings. Keep the production mod disabled in Windows until the author enables it.
- Keep generated assets trackable. Keep original private reference art under `docs/reference/originals/`, which is ignored. Record source provenance, seeds, exact generator invocations, unsupported constructs and validation limitations honestly.
- Install development tooling only inside this project when supported and authorized. Do not change desktop or global coding-client settings.
