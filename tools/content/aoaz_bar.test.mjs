// UI overhaul lane W1: the Aoaz bar (docs/specs/07_interface/01_interface.md section 2, acceptance 10 and 11).
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { Staged } from './lib/core.mjs';
import { ART_SOURCE, provenanceFile } from './lib/paths.mjs';
import { aoazMeters, aoazRows, resolveAoaz, buildAoazBar, AOAZ_LAYOUT, AOAZ_PANELS } from './modules/ui.mjs';

// Every scripted trigger, effect and text the rows name, so a fake tree can define all of them or all but one.
function allNames() {
  const meters = aoazMeters(), names = { triggers: new Set(), effects: new Set(), texts: new Set() };
  const trig = s => [...String(s ?? '').matchAll(/\b(zin_[a-z0-9_]+)\s*=\s*yes\b/g)].forEach(m => names.triggers.add(m[1]));
  for (const r of aoazRows('GOL')) trig(r.trigger);
  for (const m of Object.values(meters)) { trig(m.when); m.value.forEach(([t]) => trig(t)); (m.needs?.triggers ?? []).forEach(t => names.triggers.add(t)); (m.needs?.effects ?? []).forEach(e => names.effects.add(e)); (m.needs?.texts ?? []).forEach(t => names.texts.add(t)); }
  for (const p of Object.values(AOAZ_PANELS)) names.effects.add(p.refresh);
  return names;
}

test('Aoaz bar: a row, a meter or a panel that names something undefined is left out, and slots keep their places', () => {
  const all = allNames();
  const full = resolveAoaz(all, { gol: 'GOL' });
  assert.equal(full.dropped.length, 0, full.dropped.join('; '));
  assert.ok(full.rows.every(r => r.slots.length <= 3), 'at most three meters');
  const noVolgan = { ...all, triggers: new Set([...all.triggers].filter(t => t !== 'zin_is_volgan')) };
  const a = resolveAoaz(noVolgan, { gol: 'GOL' });
  assert.ok(!a.rows.some(r => r.id === 'volgan') && a.dropped.some(d => /row volgan/.test(d)), 'a row whose trigger is undefined is not emitted');
  const noRuling = { ...all, triggers: new Set([...all.triggers].filter(t => t !== 'zin_aenor_ruled_by_court')) };
  const b = resolveAoaz(noRuling, { gol: 'GOL' }), throne = b.rows.find(r => r.id === 'aenor_throne');
  assert.deepEqual(throne.slots.map(s => s.join('|')), ['', 'temple_favour|hidden_hand', 'concord'], 'the second and third meters keep their slots');
  const noRefresh = { ...all, effects: new Set([...all.effects].filter(e => e !== 'zin_leren_ui_refresh')) };
  assert.equal(resolveAoaz(noRefresh, { gol: 'GOL' }).rows.find(r => r.id === 'lerendor').panel, null, 'no panel button without its refresh');
  assert.ok(!resolveAoaz(all).rows.some(r => r.id === 'goldoroth'), 'no Goldoroth row without its tag');
});

test('Aoaz bar: hub-only meters and panels are only shown by the hub row', () => {
  const meters = aoazMeters();
  for (const r of aoazRows('GOL')) for (const id of r.slots.flat()) assert.equal(!!meters[id].hub, !!r.hub, `${id} in ${r.id}`);
  for (const [k, p] of Object.entries(AOAZ_PANELS)) if (p.hub) assert.ok(aoazRows('GOL').every(r => r.panel !== k || r.hub), k);
});

test('Aoaz bar: the built window, sprites, triggers and text', { skip: !existsSync(`${ART_SOURCE}/ui/aoaz/ui-aoaz-meters-1.png`) && 'no Aoaz art' }, async () => {
  const staged = new Staged(), names = allNames();
  // a tree that defines every name the rows use, and the Horde panel that carries Goldoroth's tag
  staged.text('common/scripted_triggers/fake.txt', [...names.triggers].map(t => `${t} = { always = yes }`).join('\n'));
  staged.text('common/scripted_effects/fake.txt', [...names.effects].map(e => `${e} = { }`).join('\n'));
  staged.text('common/scripted_localisation/fake.txt', [...names.texts].map(t => `defined_text = {\n\tname = ${t}\n\ttext = { localization_key = x }\n}`).join('\n'));
  staged.text('common/scripted_guis/zin_horde.txt', 'scripted_gui = { zin_horde = { visible = { original_tag = GOL } } }');
  const provenance = readFileSync(provenanceFile(), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
  const r = await buildAoazBar(staged, { provenance, rawPath: rel => `${ART_SOURCE}/${rel}`, log: () => {} });
  assert.equal(r.built, true, JSON.stringify(r.pending));
  assert.equal(r.dropped.length, 0);
  const file = rel => staged.files.get(rel)?.toString('utf8') ?? assert.fail(`${rel} not staged`);
  const gui = file('interface/zin_aoaz_bar.gui'), gfx = file('interface/zin_aoaz_bar.gfx'), sg = file('common/scripted_guis/zin_aoaz_bar.txt');
  // the window: under the flag (the Realm button's place, on the 4 px grid), 600 x 32 at most, every element inside it and on the grid
  assert.match(gui, /name = "zin_aoaz_bar_window"\n\t\tposition = \{ x = 8 y = 88 \}\n\t\tsize = \{ width = 600 height = 32 \}/);
  for (const m of gui.matchAll(/position = \{ x = (-?\d+) y = (-?\d+) \}/g)) { const [x, y] = [+m[1], +m[2]]; assert.ok(x % 4 === 0 && y % 4 === 0, `position ${x},${y}`); if (x !== 8) assert.ok(x >= 0 && x < AOAZ_LAYOUT.w, `x ${x} inside the bar`); }
  // every sprite the window names is defined by the bar's gfx, or is the engine tension strip (the same concept, the Gathering Dark)
  for (const m of gui.matchAll(/spriteType = "([^"]+)"/g)) assert.ok(gfx.includes(`name = "${m[1]}"`) || m[1] === 'GFX_world_tension_icon_big_strip', m[1]);
  // every element named in a visibility trigger exists, and every click effect belongs to a button
  for (const m of sg.matchAll(/\t\t\t([a-z0-9_]+)_visible = \{/g)) assert.ok(gui.includes(`name = "${m[1]}"`), m[1]);
  for (const m of sg.matchAll(/\t\t\t([a-z0-9_]+)_click = \{/g)) assert.match(gui, new RegExp(`buttonType = \\{\\n\\t\\t\\tname = "${m[1]}"`));
  assert.match(sg, /ai_enabled = \{ always = no \}/);
  assert.match(sg, /parent_window_token = top_bar/);
  // the map-mode buttons are the bar's own art, not an idea picture
  assert.match(file('interface/zin_mapmodes.gfx'), /GFX_mapmode_buttons_selected_small_zin_footholds_map_mode"\n\t\ttexturefile = "gfx\/interface\/zin\/mapmodes\//);
  // secrecy: no player text outside a _hub key names the hidden god or the Council (spec 01 acceptance 4)
  const yml = file('localisation/english/zin_aoaz_bar_l_english.yml');
  for (const line of yml.split('\n').slice(1)) {
    const m = /^ ([A-Za-z0-9_]+):0 "(.*)"$/.exec(line); if (!m) continue;
    if (!m[1].endsWith('_hub')) assert.doesNotMatch(m[2], /Afrit|demon|Hidden Council|Worshipdom/, m[1]);
  }
  // every key the window and the scripted texts name is written
  for (const m of gui.matchAll(/(?:text|pdx_tooltip) = "([A-Za-z0-9_]+)"/g)) assert.ok(yml.includes(` ${m[1]}:0 "`), m[1]);
  // a second build is identical
  const again = new Staged();
  for (const [k, v] of staged.files) if (/fake|zin_horde/.test(k)) again.add(k, v);
  await buildAoazBar(again, { provenance, rawPath: rel => `${ART_SOURCE}/${rel}`, log: () => {} });
  for (const [k, v] of staged.files) assert.ok(v.equals(again.files.get(k)), `${k} is byte-identical`);
});
