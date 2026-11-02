// UI overhaul lane W9: the Chronicle of Aoaz (docs/specs/07_interface/04_chronicle_codex.md sections 6, 12 and Acceptance 1 to 13).
// The data checks, the secrecy checks with a negative test per rule, the unlock language, and the structure of the emitted window.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { loadChronicle, chronicleProblems, emitChronicle, chronicleGui, indexVault, vaultFilesFrom, secrecyFindings, knowledgeRules, CHR_LAYOUT, LIMITS } from './modules/chronicle.mjs';
import { parseCond, condTrigger, implies, compileAxioms } from './lib/condlang.mjs';

const clone = o => JSON.parse(JSON.stringify(o));
const vault = indexVault(vaultFilesFrom(null));
const base = loadChronicle();
const NAMES = { hubTrigger: 'zin_afrit_is_hub', hostTrigger: 'zin_eindil_is_host', panelFlags: ['zin_realm_open'] };
const GATES = { low_country: 'has_country_flag = x', two_shores: 'always = no', kalioth: 'always = no', sea_doors: 'always = no', sea_roads: 'always = no', ice: 'always = no' };
const read = rel => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8');

// A planted entry in a copy of the data, checked alone.
async function planted(entry, extra = {}) {
  const d = clone(base);
  d.entries.push({ id: 199, key: 'planted', title: 'A Planted Entry', short: null, title_after: null, subtitle: 'Before the Ages · Test', plate: null, unlock: 'start', related: [], secrets: [], category: 'order', file: 'test', ...entry });
  Object.assign(d, extra);
  return chronicleProblems(d, { vault, only: e => e.key === 'planted' });
}
const para = (text, src = [{ note: '01 - Cosmology/The Fading.md', section: 'Established effect' }]) => ({ text, status: 'established', sources: src });

test('Chronicle: the data holds every category with at least five entries, unique ids and keys, and passes every builder check', async () => {
  const { errors, warnings } = await chronicleProblems(clone(base), { vault });
  assert.deepEqual(errors, []);
  const authored = base.entries.filter(e => !e.generated);
  assert.ok(authored.length >= 120 && authored.length <= 200, `${authored.length} authored entries`);
  assert.equal(base.categories.length, 13);
  for (const c of base.categories) assert.ok(base.entries.filter(e => e.category === c.key).length >= 5, c.key);
  assert.equal(new Set(base.entries.map(e => e.id)).size, base.entries.length);
  assert.equal(new Set(base.entries.map(e => e.key)).size, base.entries.length);
  // every realm of the regional histories has its Roots and Signs entry
  assert.equal(base.entries.filter(e => e.category === 'realms').length, 155);
  assert.deepEqual(base.realmMissing, []);
  // the End of the Age has nothing open at the start, the open categories have
  assert.equal(base.entries.filter(e => e.category === 'last_crowns' && e.unlock === 'start').length, 0);
  // every in-scope vault section is cited or excluded with a reason
  assert.equal(warnings.filter(w => w.startsWith('coverage:')).length, 0);
});

test('Chronicle: every flag an entry reads is a shared-contract flag', () => {
  const contract = read('../../docs/specs/04_mechanics/00_shared_contract.md') + read('../../docs/specs/04_mechanics/00_contract_additions.md');
  const flags = new Set();
  for (const e of base.entries) for (const c of [e.unlock, ...e.parts.map(p => p.when), e.title_after?.when, ...(e.plate_after ?? []).map(p => p.when)].filter(Boolean)) for (const m of c.matchAll(/F:([a-z0-9_]+)/g)) flags.add(m[1]);
  const unknown = [...flags].filter(f => !contract.includes(`\`${f}\``));
  assert.deepEqual(unknown, []);
});

test('Chronicle: the unlock language parses, compiles and decides implication with the axioms', () => {
  const ax = compileAxioms(base.axioms);
  assert.equal(condTrigger(parseCond('rev')), 'has_global_flag = zin_afrit_revealed');
  assert.match(condTrigger(parseCond('F:zin_horos_dead, S>=8')), /AND = \{\n\thas_global_flag = zin_horos_dead\n\tcheck_variable = \{ global\.zin_eindil_stage > 7 \}\n\}/);
  assert.match(condTrigger(parseCond('rev | hub')), /OR = \{\n\thas_global_flag = zin_afrit_revealed\n\tzin_chr_viewer_is_hub = yes\n\}/);
  assert.ok(implies(parseCond('rev, F:zin_afrit_dead'), parseCond('rev | hub'), ax));
  assert.ok(!implies(parseCond('F:zin_eindil_awake'), parseCond('heir'), ax));
  assert.ok(implies(parseCond('F:zin_eindil_returned'), parseCond('heir'), ax), 'stage 9 implies the heir is known');
  assert.ok(implies(parseCond('S>=8'), parseCond('S>=5'), ax));
  assert.ok(!implies(parseCond('S>=5'), parseCond('S>=8'), ax));
  assert.throws(() => parseCond('F:zin_x, '));
  assert.throws(() => parseCond('Q:zin_x'));
});

test('Chronicle: each secrecy rule fails a planted entry (spec section 12, negative tests)', async () => {
  const one = async (entry, pattern) => { const { errors } = await planted(entry); assert.ok(errors.some(e => pattern.test(e)), `${pattern}: ${errors.join(' | ')}`); };
  await one({ parts: [{ when: 'start', paragraphs: [para('The temples say Afrit kept the grain rolls.')] }] }, /"Afrit" needs rev \| hub/);
  await one({ unlock: 'F:zin_eindil_awake', parts: [{ when: 'F:zin_eindil_awake', paragraphs: [para('Eindil walked south from the ice.')] }] }, /"Eindil" needs heir/);
  await one({ parts: [{ when: 'start', paragraphs: [para('Glo, the heart of the castle, glows green.')] }] }, /Glo called a heart/);
  await one({ parts: [{ when: 'start', paragraphs: [para('The tale of the War of the Last Crowns is told in every hall.')] }] }, /open at the start/);
  await one({ parts: [{ when: 'start', paragraphs: [para('Muzerar sank beneath the sea.')] }] }, /"Muzerar" needs D:low_country/);
  await one({ parts: [{ when: 'start', paragraphs: [para('The Deliverer is a demon who wears a mask.')] }] }, /"demon" beside the Deliverer/);
  await one({ parts: [{ when: 'start', paragraphs: [para('Servants sustain Zol in the black north.')] }] }, /kl_sealed_015/);
  await one({ parts: [{ when: 'start', paragraphs: [para('Šodolōro lies in the north.')] }] }, /not a Windows-1252 character/);
  await one({ parts: [{ when: 'start', paragraphs: [para('The game remembers this.')] }] }, /meta word/);
  await one({ parts: [{ when: 'start', paragraphs: [para('Merchants bought rifles in the market.')] }] }, /banned word/);
  await one({ parts: [{ when: 'start', paragraphs: [para('It was said, "they came".')] }] }, /forbidden character/);
  await one({ parts: [{ when: 'start', paragraphs: [para('A people stood 3,000 years before Aen.')] }] }, /years before Aen/);
});

test('Chronicle: structure failures of a planted entry (page fit, links, conditions, sources, hashes)', async () => {
  const long = Array.from({ length: 40 }, (_, i) => `The ${i + 1}th sentence of an overlong paragraph runs on.`).join(' ');
  const errorsOf = async e => (await planted(e)).errors.join(' | ');
  assert.match(await errorsOf({ parts: [{ when: 'start', paragraphs: [para(long)] }] }), /a paragraph of \d+ lines/);
  assert.match(await errorsOf({ related: ['no_such_entry'], parts: [{ when: 'start', paragraphs: [para('A plain line.')] }] }), /related no_such_entry does not exist/);
  assert.match(await errorsOf({ parts: [{ when: 'start', paragraphs: [para('A plain line.')] }, { when: 'Q:bad', paragraphs: [para('More.')] }] }), /unknown atom kind/);
  assert.match(await errorsOf({ unlock: 'rev', parts: [{ when: 'rev', paragraphs: [para('A plain line.')] }, { when: 'heir', paragraphs: [para('More.')] }] }), /does not imply the unlock/);
  assert.match(await errorsOf({ parts: [{ when: 'start', paragraphs: [para('A plain line.', [{ note: '01 - Cosmology/Nowhere.md', section: 'X' }])] }] }), /the vault has no note/);
  const { warnings } = await planted({ parts: [{ when: 'start', paragraphs: [para('A plain line.', [{ note: '01 - Cosmology/The Fading.md', section: 'Established effect', sha256: '0'.repeat(64) }])] }] });
  assert.ok(warnings.some(w => /stale/.test(w)), 'a stale hash is reported');
  assert.match(await errorsOf({ title: 'An Extraordinarily Long Title That Cannot Fit The Page Box At All', parts: [{ when: 'start', paragraphs: [para('A plain line.')] }] }), /the title is \d+ px wide/);
});

test('Chronicle: the knowledge-layer register lets open questions and attributed claims pass, and still catches answers', () => {
  const kl = knowledgeRules(), ctx = { axioms: compileAxioms(base.axioms), futureTerms: base.futureTerms, kl };
  assert.deepEqual(secrecyFindings('Whether the Gala are kin to the Sunhot elves, no chronicle of men can say.', parseCond('start'), ctx), []);
  assert.ok(secrecyFindings('The Gala are kin to the Sunhot elves.', parseCond('start'), ctx).some(f => /kl_mystery_017/.test(f)));
  assert.deepEqual(secrecyFindings('The King of Demons rules the Nether.', parseCond('start'), ctx), []);
  assert.ok(secrecyFindings('Xalgor, King of Demons, rules the Nether.', parseCond('start'), ctx).some(f => /kl_mystery_005/.test(f)));
});

test('Chronicle: the open text at the start names no secret, and the hub reads its own record without the heir', async () => {
  const d = clone(base); await chronicleProblems(d, { vault });
  const open = d.entries.filter(e => e.unlock === 'start');
  const text = open.flatMap(e => [e.title, e.short ?? '', e.subtitle, ...e.parts.filter(p => p.when === 'start').flatMap(p => p.paragraphs.map(q => q.text))]).join('\n');
  for (const re of [/\bAfrit\b/, /Hidden Council/, /Kingdom Behind the Throne/, /\bEindil\b/, /Man from the Ice/, /\bSevrin\b/, /Ring of Doors/]) assert.ok(!re.test(text), `${re} in open text`);
  for (const s of text.split(/(?<=[.!?])\s+/)) assert.ok(!(/\bGlo\b/.test(s) && /\bheart\b/.test(s)), `Glo and heart: ${s}`);
  const hub = d.entries.filter(e => e.unlock === 'rev | hub');
  assert.ok(hub.length >= 10, `${hub.length} hub entries`);
  for (const e of hub) for (const p of e.parts.filter(p => p.when === 'rev | hub')) for (const q of p.paragraphs) assert.ok(!/\bEindil\b/.test(q.text), `${e.key} names Eindil`);
});

test('Chronicle: the emitted window wires every control, every text key and every trigger, the AI never uses it, and two emits are identical', async () => {
  const d = clone(base); await chronicleProblems(d, { vault });
  const a = await emitChronicle(d, { names: NAMES, deepGates: GATES, plateOf: () => null });
  const b = await emitChronicle(clone(d), { names: NAMES, deepGates: GATES, plateOf: () => null });
  for (const k of ['triggers', 'effects', 'sloc', 'sgui']) assert.equal(a[k], b[k], `${k} is not deterministic`);
  assert.deepEqual(a.loc, b.loc);
  const gui = chronicleGui(d);
  assert.equal(gui, chronicleGui(clone(d)));
  const elements = new Set([...gui.matchAll(/name = "([a-z0-9_]+)"/g)].map(m => m[1]));
  assert.ok(elements.has('zin_chronicle_window'));
  for (let i = 1; i <= d.categories.length; i++) assert.ok(elements.has(`zin_chr_cat_${i}`));
  for (let k = 1; k <= CHR_LAYOUT.slots; k++) assert.ok(elements.has(`zin_chr_slot_${k}`) && elements.has(`zin_chr_slot_${k}_new`));
  for (let k = 1; k <= LIMITS.links; k++) assert.ok(elements.has(`zin_chr_link_${k}`));
  assert.match(gui, /shortcut = "ESCAPE"/);
  assert.match(a.sgui, /ai_enabled = \{ always = no \}/);
  assert.match(a.sgui, /context_type = player_context/);
  assert.match(a.sgui, /dirty = zin_ui_tick/);
  // every click and visibility key names an element of the window
  for (const m of a.sgui.matchAll(/^\t{3}([a-z0-9_]+?)(_click|_click_enabled|_visible) = \{/gm)) assert.ok(elements.has(m[1]), `${m[1]}${m[2]} has no element`);
  // every click effect calls only Chronicle effects (the window shows, it never decides)
  const effects = new Set([...a.effects.matchAll(/^([a-z0-9_]+) = \{/gm)].map(m => m[1]));
  for (const m of a.sgui.matchAll(/_click = \{\n([\s\S]*?)\n\t{3}\}/g)) for (const call of m[1].matchAll(/([a-z0-9_]+) = yes/g)) assert.ok(effects.has(call[1]), `${call[1]} is not a Chronicle effect`);
  assert.ok(!/add_political_power|add_stability|set_global_flag|country_event|news_event|add_ideas/.test(a.effects), 'the Chronicle changes no mechanic');
  // every localisation key a scripted text can return exists
  // The engine reads localization_key (vanilla spelling); localisation_key is an unexpected token and the line is lost.
  assert.ok(!/localisation_key/.test(a.sloc), 'scripted localisation uses localization_key');
  for (const m of a.sloc.matchAll(/localization_key = ([A-Za-z0-9_]+)/g)) assert.ok(a.loc[m[1]] !== undefined, `${m[1]} has no text`);
  for (const m of gui.matchAll(/text = "([A-Za-z0-9_]+)"/g)) assert.ok(a.loc[m[1]] !== undefined, `${m[1]} has no text`);
  // every trigger the scripts read is written
  const trig = new Set([...a.triggers.matchAll(/^([a-z0-9_]+) = \{/gm)].map(m => m[1]));
  for (const m of [...a.effects.matchAll(/\b(zin_chr_(?:unlocked|unread|part|cat|deep)_[a-z0-9_]+) = yes/g), ...a.sgui.matchAll(/\b(zin_chr_(?:unlocked|unread|part|cat|deep)_[a-z0-9_]+) = yes/g)]) assert.ok(trig.has(m[1]), `${m[1]} is not written`);
  // the open entries' first pages hold no secret word (the compiled text, not only the data)
  for (const e of d.entries.filter(x => x.unlock === 'start')) {
    const keys = [`zin_chr_${e.id}_title`, `zin_chr_${e.id}_short`, `zin_chr_${e.id}_sub`, ...Object.keys(a.loc).filter(k => k.startsWith(`zin_chr_${e.id}_p`))];
    for (const k of keys) assert.ok(!/\b(Afrit|Eindil|Hidden Council|Sevrin)\b|Man from the Ice/.test(a.loc[k]), `${k}`);
  }
  // script files are ASCII
  for (const k of ['triggers', 'effects', 'sloc', 'sgui']) assert.ok(!/[^\x00-\x7f]/.test(a[k]), `${k} has a non-ASCII character`);
});
