# ZIN

A total-conversion Hearts of Iron IV mod set in **Erdae**, the world of ZIN, during the Fourth Age and the reign of the Golden King.

ZIN is in early development. The world, countries, peoples, ideologies and interface are in place; the content overhaul (mechanics, events, focus trees, units and technologies) is planned in [docs/design/overhaul.md](docs/design/overhaul.md) and not yet written.

## What is in the current build

- **Map.** A 5120 × 2560 Erdae map built from the owner's hand-drawn sheets, with a widened central sea: 275 strategic regions and 1,332 states. Layout and every generation decision are in [docs/generation/assumptions.md](docs/generation/assumptions.md).
- **Countries.** 305 regional countries, among them Aenor (the Middle Kingdom) with its puppets, Volgan's Dead Lands, Zol's Mistake, the Worshipdom of Afrit, Horos's Castle of Yeldenne and the elven realms. The Great Wall of Aenor is a hard border between the Middle Lands and the Magical Lands.
- **Peoples.** Men, elves, Sunhot elves, giants, ents, yeti, trolls, orcs, grave hosts and demons, each as a national spirit. Every country's people, ideology and stance come from the editable table [docs/design/countries.csv](docs/design/countries.csv).
- **Ideologies.** Light, Dominion, Shadow and the Wild replace the four vanilla ideologies, each with its own stances.
- **Interface.** A Realm panel for each country's people and standing.
- **Art.** Every picture is image-generated for ZIN: flags, emblems, portraits and interface art. The prompts, model and hashes of each source sheet are recorded in [art/source/provenance.jsonl](art/source/provenance.jsonl). No assets are taken from other mods.
- **Lore.** The lore vault in [docs/lore/vault](docs/lore/vault/) is canon; its Canon Policy separates established facts from proposals. The owner's original drawings are not published.

## Installing

1. Clone this repository into `Documents/Paradox Interactive/Hearts of Iron IV/mod/zin`.
2. Next to it, create `mod/zin.mod` with the contents of [descriptor.mod](descriptor.mod) plus a `path` line, for example `path="C:/Users/<you>/Documents/Paradox Interactive/Hearts of Iron IV/mod/zin"`.
3. Enable ZIN in the launcher and start a new campaign.

## Known issues

- Starting a campaign as **Aenor** currently crashes the game. Its neighbours (Lerendor, Zol, Selen) start normally. The cause is still under investigation.
- Generated settlement and ruler names are placeholders until the lore names them.
- Startup warnings from unused vanilla definitions remain.

## Development

The map, states and countries are generated with [HOI4 Agent Tools](https://github.com/klimPaskov/hoi4-agent-tools). The repository also carries the [Agentic HOI4 Modding](https://github.com/klimPaskov/Agentic-HOI4-Modding) kit for coding agents; see [AGENTS.md](AGENTS.md). Game testing happens only in an isolated Linux install.

## License

No license is granted. All code, art and lore are © Klim Pashkov, all rights reserved. You may download and play the mod; ask before reusing any part of it.
