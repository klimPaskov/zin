// UI overhaul lane W4: the intelligence window overrides (modules/ui_military.mjs) and the economy and military icon map (data/ui/w4_icons.json).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { GAME } from './lib/paths.mjs';
import { OVERRIDE_FILES } from './lib/ui_plan.mjs';
import { militaryOverrides, setElementKey, loadMilitaryUi } from './modules/ui_military.mjs';
import { loadChancery } from './modules/ui_chancery.mjs';

const W4_ICONS = JSON.parse(readFileSync(new URL('./data/ui/w4_icons.json', import.meta.url), 'utf8'));
const names = t => [...t.matchAll(/\bname\s*=\s*"([^"]+)"/g)].map(m => m[1]);

test('setElementKey adds a key to the named element only, and refuses a missing element or a key already set', () => {
  const t = 'a = {\n\t\tname = "x"\n\t\tfont = "f"\n\t}\n\tb = {\n\t\tname = "y"\n\t}\n';
  const out = setElementKey(t, 'x', 'text_color_code', 'H');
  assert.match(out, /name = "x"\n\t\ttext_color_code = "H"\n\t\tfont/);
  assert.equal(out.replace('\n\t\ttext_color_code = "H"', ''), t);
  assert.throws(() => setElementKey(t, 'z', 'k', 'v'), /no element z/);
  assert.throws(() => setElementKey(out, 'x', 'text_color_code', 'H'), /already sets/);
});

test('the intelligence overrides are on the closed list, keep every vanilla element name and draw only defined Chancery sprites', { skip: !existsSync(`${GAME}/interface/countryintelledger.gui`) }, () => {
  const spec = loadMilitaryUi(), { files } = militaryOverrides(spec);
  const chancery = loadChancery(), defined = new Set([...chancery.sprites.map(s => s.name), 'GFX_zin_faction_spare_1']);
  const targets = new Set([...Object.values(chancery.swaps), ...Object.values(spec.swaps)]);
  for (const [rel, text] of files) {
    assert.ok(OVERRIDE_FILES.includes(rel), `${rel} is on the closed list`);
    assert.deepEqual(names(text), names(readFileSync(`${GAME}/${rel}`, 'latin1')), `${rel} keeps every element name in order`);
    for (const s of targets) if (text.includes(`"${s}"`)) assert.ok(defined.has(s), `${s} is defined`);
    for (const k of [...Object.keys(chancery.swaps), ...Object.keys(spec.swaps)]) if (k !== 'GFX_faction_logo_generic_democratic') assert.ok(!new RegExp(`"${k}"`).test(text), `${rel} still draws ${k}`);
  }
  assert.match(files.get('interface/countryintelligenceagencyview.gui'), /name = "agency_agents_title"\n\t*text_color_code = "H"/);
});

test('the W4 icon map gives every texture one cell per vanilla frame, from a sheet that holds the cell', () => {
  const sheet = id => JSON.parse(readFileSync(new URL(`./data/ui/sheets/${id}.json`, import.meta.url), 'utf8'));
  const inv = JSON.parse(readFileSync(new URL('./data/ui/vanilla_inventory.json', import.meta.url), 'utf8')).sprites;
  const frames = new Map(); for (const s of inv) if (s.texture) { const k = s.texture.toLowerCase(); frames.set(k, [...(frames.get(k) ?? []), s.frames]); }
  const used = new Set();
  for (const [tex, r] of Object.entries(W4_ICONS.textures)) {
    assert.ok(frames.get(tex.toLowerCase())?.includes(r.cells.length), `${tex}: ${r.cells.length} cells, the sprites have ${frames.get(tex.toLowerCase())} frames`);
    const keys = new Set(sheet(r.sheet).cells.map(c => c.key));
    for (const c of r.cells) { assert.ok(keys.has(c), `${tex}: ${r.sheet} has ${c}`); if (r.sheet.startsWith('icons-w4-')) used.add(c); }
  }
  for (const id of ['icons-w4-pips', 'icons-w4-craft', 'icons-w4-host', 'icons-w4-war']) for (const c of sheet(id).cells) assert.ok(used.has(c.key), `${id}.${c.key} is used`);
});
