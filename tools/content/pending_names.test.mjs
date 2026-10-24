// Tests for the declared pending names (modules/pending_names.mjs, data/pending_names.json; docs/design/stage2/integration_r3.md).
// The build itself runs the register against the finished tree (build.mjs, final C3 pass); these tests hold the register's shape and the
// resolver's three refusals with synthetic scans. Run: node --test tools/content/pending_names.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Staged } from './lib/core.mjs';
import { parse, scriptText } from './lib/clausewitz.mjs';
import { loadPending, resolvePending, writePendingStandIns } from './modules/pending_names.mjs';

const pending = await loadPending();
const g = (cat, name, via) => ({ cat, name, via, modFiles: new Set(['common/test.txt']), gameFiles: new Set() });
const none = () => false;
const tmpRegister = async data => { const dir = await mkdtemp(path.join(tmpdir(), 'zin-pending-')); const f = path.join(dir, 'p.json'); await writeFile(f, JSON.stringify(data)); return pathToFileURL(f); };

test('The register: every owner has an id, an owner and a spec; every name is declared once, with a known kind and the ZIN prefix', () => {
  assert(pending.entries.length > 0);
  for (const o of pending.data.owners) { assert(o.id && o.owner && o.spec, o.id); assert(!/UNCLASSIFIED/.test(o.owner), o.id); }
  for (const r of pending.entries) assert.match(r.name, /^zin_[a-z0-9_]+(\.\d+)?$/, r.name);
  assert.equal(new Set(pending.entries.map(r => r.name)).size, pending.entries.length);
});

test('The register holds no name a builder module of this round defines (they were wired, not stubbed)', () => {
  const names = new Set(pending.entries.map(r => r.name));
  for (const n of ['zin_rules_is_historical', 'zin_rule_dark_powers', 'zin_cb_broken_truce', 'zin_people_is_giants', 'zin_afrit_opinion_famine_stores', 'zin_aenor.10', 'zin_cold.30', 'zin_west.10']) assert(!names.has(n), n);
});

test('resolvePending: a declared name that dangles gets a stand-in; an undeclared one, a landed one and an unused one are refused', () => {
  const [a, b] = pending.entries;
  const dangling = [g(a.cat === 'scripted' ? 'scripted' : a.cat, a.name), g('event', 'zin_nobody.1')];
  const r = resolvePending(pending, dangling, (cat, name) => name === b.name);
  assert.deepEqual(r.undeclared.map(x => x.name), ['zin_nobody.1']);
  assert.deepEqual(r.landed.map(x => x.name), [b.name]);
  assert(r.used.some(x => x.name === a.name));
  assert(r.unused.length === pending.entries.length - 2, 'every other row is unused in this scan');
});

test('resolvePending: a scripted call matches a declared trigger or effect; a name a vanilla file uses is never a pending name', () => {
  const trig = pending.entries.find(r => r.cat === 'trigger');
  const r = resolvePending(pending, [g('scripted', trig.name)], none);
  assert(r.used.some(x => x.name === trig.name) && !r.undeclared.length);
  const v = { ...g('trigger', trig.name), gameFiles: new Set(['common/vanilla.txt']) };
  assert.equal(resolvePending(pending, [v], none).undeclared.length, 1);
});

test('Stand-ins: triggers are false, effects empty, events hidden and triggered only, ideas never allowed, characters named', () => {
  const staged = new Staged();
  const used = ['trigger', 'effect', 'event', 'idea', 'character', 'opinion_modifier'].map(cat => pending.entries.find(r => r.cat === cat)).filter(Boolean).map(r => ({ ...r, via: r.cat === 'event' ? 'news_event' : undefined }));
  writePendingStandIns(staged, used, pending);
  const t = rel => scriptText(staged.files.get(rel));
  for (const [rel, b] of staged.files) if (rel.endsWith('.txt')) { assert.doesNotThrow(() => parse(scriptText(b))); assert.match(scriptText(b), /# pending: /, rel); }
  if (used.find(r => r.cat === 'trigger')) assert.match(t('common/scripted_triggers/zz_zin_pending_triggers.txt'), /always = no/);
  const ev = used.find(r => r.cat === 'event');
  if (ev) { const e = t('events/zz_zin_pending_events.txt'); assert.match(e, new RegExp(`news_event = \\{[^}]*\\n\\tid = ${ev.name.replace('.', '\\.')}`)); assert.match(e, /hidden = yes/); assert.match(e, /is_triggered_only = yes/); assert.match(e, new RegExp(`add_namespace = ${ev.name.split('.')[0]}`)); }
  if (used.find(r => r.cat === 'idea')) assert.match(t('common/ideas/zz_zin_pending_ideas.txt'), /allowed = \{ always = no \}/);
  if (used.find(r => r.cat === 'character')) assert.match(staged.files.get('localisation/english/zin_pending_l_english.yml').toString('utf8'), /ZIN_PENDING_CHARACTER/);
});

test('Negative: the loader refuses a name declared twice, an unknown kind and an owner row without a spec', async () => {
  await assert.rejects(loadPending(await tmpRegister({ owners: [{ id: 'a', owner: 'A', spec: 's', names: { trigger: ['zin_x'] } }, { id: 'b', owner: 'B', spec: 's', names: { effect: ['zin_x'] } }] })), /declared twice/);
  await assert.rejects(loadPending(await tmpRegister({ owners: [{ id: 'a', owner: 'A', spec: 's', names: { focus: ['zin_x'] } }] })), /unknown kind focus/);
  await assert.rejects(loadPending(await tmpRegister({ owners: [{ id: 'a', owner: 'A', names: { trigger: ['zin_x'] } }] })), /lacks id, owner or spec/);
});
