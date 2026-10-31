// Tests for the icon registry and concept extractor (modules/icon_registry.mjs, UI overhaul step D3): concept extraction per family on a
// synthetic staged tree (no game file is read: the vanilla sprite list is passed in), texture sharing statistics, the general-focus rule
// of K69, the share list and targets, and the committed registry and share files.
//   node --test tools/content/icon_registry.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  spriteIndex, extractConcepts, iconRegistry, generalFocusGroups, validateShares, targets, registryFile, auditDrift, loadShares,
  REGISTRY_FILE, SHARES_FILE, SHARE_KINDS, AUDIT_31_OCTOBER, FAMILIES,
} from './modules/icon_registry.mjs';

const B = s => Buffer.from(s, 'utf8');
const tree = () => new Map([
  ['interface/zin_test.gfx', B(`spriteTypes = {
	spriteType = { name = "GFX_focus_rally" texturefile = "gfx/interface/goals/zin/banner.dds" }
	spriteType = { name = "GFX_focus_walls" texturefile = "gfx/interface/goals/zin/banner.dds" }
	spriteType = { name = "GFX_focus_own" texturefile = "gfx/interface/goals/zin/own.dds" }
	spriteType = { name = "GFX_idea_zin_banner" texturefile = "gfx/interface/goals/zin/banner.dds" }
	spriteType = { name = "GFX_decision_zin_seal" texturefile = "gfx/interface/decisions/zin/seal.dds" }
	spriteType = { name = "GFX_decision_category_zin_cat" texturefile = "gfx/interface/decisions/zin/cat.dds" }
	spriteType = { name = "GFX_zin_cat_picture" texturefile = "gfx/interface/decisions/zin/cat_pic.dds" }
	spriteType = { name = "GFX_zin_tech_a_medium" texturefile = "gfx/interface/zin/frame.dds" }
	spriteType = { name = "GFX_zin_frame" texturefile = "gfx/interface/zin/frame.dds" }
	spriteType = { name = "GFX_zin_sp_ward" texturefile = "gfx/interface/sp/ward.dds" }
	spriteType = { name = "GFX_mapmode_buttons_deselected_small_zin_mm" texturefile = "gfx/interface/mm.dds" noOfFrames = 2 }
}`)],
  ['interface/zin_super_events.gfx', B('spriteTypes = { spriteType = { name = "GFX_zin_se_dawn" texturefile = "gfx/event_pictures/zin/se_dawn.dds" } }')],
  ['common/national_focus/zin_alpha.txt', B(`focus_tree = { id = zin_alpha_tree
	focus = { id = zin_alpha_rally icon = GFX_focus_rally }
	focus = { id = zin_alpha_walls icon = GFX_focus_walls }
	focus = { id = zin_alpha_own icon = GFX_focus_own }
	focus = { id = zin_alpha_bare }
}`)],
  ['common/national_focus/zin_beta.txt', B(`focus_tree = { id = zin_beta_tree
	focus = { id = zin_beta_rally icon = GFX_focus_rally }
	focus = { id = zin_beta_walls icon = GFX_focus_walls }
}`)],
  ['localisation/english/zin_test_l_english.yml', B('﻿l_english:\n zin_alpha_rally: "Rally the Banners"\n zin_beta_rally: "Rally the Banners"\n zin_alpha_walls: "Mend the Walls"\n zin_beta_walls: "Raise the Towers"\n zin_alpha_own: "Our Own Way"\n')],
  ['common/ideas/zin_test.txt', B(`ideas = {
	country = { zin_banner = { modifier = { stability_factor = 0.1 } } zin_plain = { picture = zin_banner } }
	economy = { zin_law = { picture = generic_law } }
	hidden_ideas = { zin_secret = { } }
}`)],
  ['common/decisions/categories/zin_test.txt', B('zin_cat = {\n\ticon = zin_cat\n\tpicture = GFX_zin_cat_picture\n}\n')],
  ['common/decisions/zin_test.txt', B('zin_cat = {\n\tzin_send = {\n\t\ticon = zin_seal\n\t}\n\tzin_hold = {\n\t\ticon = zin_seal\n\t\tdays_mission_timeout = 30\n\t}\n}\n')],
  ['events/zin_test.txt', B('country_event = { id = zin_test.1 picture = GFX_report_event_x }\ncountry_event = { id = zin_test.2 hidden = yes }\nnews_event = { id = zin_test.3 picture = GFX_news_x }\n')],
  ['common/technologies/zin_test.txt', B('technologies = {\n\tzin_tech_a = {\n\t\tresearch_cost = 1\n\t}\n\tzin_tech_b = {\n\t\tresearch_cost = 1\n\t}\n}\n')],
  ['common/special_projects/projects/zin_test.txt', B('sp_ward = {\n\ticon = GFX_zin_sp_ward\n}\n')],
  ['common/map_modes/zin_test.txt', B('scripted_map_modes = {\n\tzin_mm = {\n\t\ttop = { type = country }\n\t}\n}\n')],
]);
const VANILLA = [
  { name: 'GFX_report_event_x', texture: 'gfx/event_pictures/x.dds', frames: 1, origin: 'vanilla', file: 'interface/eventpictures.gfx' },
  { name: 'GFX_news_x', texture: 'gfx/event_pictures/x.dds', frames: 1, origin: 'vanilla', file: 'interface/eventpictures.gfx' },
  { name: 'GFX_idea_generic_law', texture: 'gfx/interface/ideas/law.dds', frames: 1, origin: 'vanilla', file: 'interface/ideas.gfx' },
  { name: 'GFX_technology_medium', texture: 'gfx/interface/technologies/blank.dds', frames: 1, origin: 'vanilla', file: 'interface/technologies.gfx' },
];
const DESIGN = { placeholderTextures: ['gfx/interface/zin/frame.dds'], placeholderOwners: ['GFX_zin_frame'] };
const reg = () => iconRegistry(tree(), { vanilla: VANILLA, design: DESIGN });

test('sprites: mod definitions override vanilla ones, with frames and origin', () => {
  const idx = spriteIndex(tree(), { vanilla: [...VANILLA, { name: 'GFX_focus_own', texture: 'gfx/vanilla.dds', frames: 1, origin: 'vanilla' }] });
  assert.equal(idx.get('gfx_focus_own').texture, 'gfx/interface/goals/zin/own.dds');
  assert.equal(idx.get('gfx_focus_own').origin, 'mod');
  assert.equal(idx.get('gfx_mapmode_buttons_deselected_small_zin_mm').frames, 2);
  assert.equal(idx.get('gfx_report_event_x').origin, 'vanilla');
});

test('concepts: every family reads its definitions and the engine naming conventions', () => {
  const by = new Map(extractConcepts(tree(), { sprites: spriteIndex(tree(), { vanilla: VANILLA }) }).map(c => [`${c.family}:${c.id}`, c]));
  assert.equal(by.get('focus:zin_alpha_rally').texture, 'gfx/interface/goals/zin/banner.dds');
  assert.equal(by.get('focus:zin_alpha_bare').sprite, null, 'a focus without icon is counted without one');
  assert.equal(by.get('spirit:zin_banner').sprite, 'GFX_idea_zin_banner', 'the engine name GFX_idea_<idea>');
  assert.equal(by.get('spirit:zin_plain').sprite, 'GFX_idea_zin_banner', 'picture = <name> becomes GFX_idea_<name>');
  assert.equal(by.get('law:zin_law').texture, 'gfx/interface/ideas/law.dds');
  assert.ok(!by.has('spirit:zin_secret') && !by.has('hidden_idea:zin_secret'), 'hidden ideas are not shown and not counted');
  assert.equal(by.get('decision:zin_hold').kind, 'mission');
  assert.equal(by.get('decision:zin_send').sprite, 'GFX_decision_zin_seal');
  assert.equal(by.get('decision_category:zin_cat').texture, 'gfx/interface/decisions/zin/cat.dds');
  assert.equal(by.get('decision_category_picture:zin_cat').texture, 'gfx/interface/decisions/zin/cat_pic.dds');
  assert.ok(by.has('event:zin_test.1') && !by.has('event:zin_test.2'), 'hidden events are left out');
  assert.equal(by.get('news_event:zin_test.3').texture, 'gfx/event_pictures/x.dds');
  assert.equal(by.get('technology:zin_tech_a').sprite, 'GFX_zin_tech_a_medium');
  assert.equal(by.get('technology:zin_tech_b').sprite, 'GFX_technology_medium', 'no own sprite: the engine fallback');
  assert.equal(by.get('special_project:sp_ward').texture, 'gfx/interface/sp/ward.dds');
  assert.equal(by.get('map_mode:zin_mm').texture, 'gfx/interface/mm.dds');
  assert.equal(by.get('super_event:dawn').texture, 'gfx/event_pictures/zin/se_dawn.dds');
});

test('registry: sharing statistics per family and across families; the placeholder count excludes the frame itself', () => {
  const r = reg();
  assert.deepEqual([r.families.focus.concepts, r.families.focus.withoutIcon, r.families.focus.textures, r.families.focus.onShared, r.families.focus.max], [6, 1, 2, 4, 4]);
  assert.equal(r.families.event.concepts, 1);
  assert.ok(r.crossFamily.some(x => x.texture === 'gfx/interface/goals/zin/banner.dds' && x.families.includes('focus') && x.families.includes('spirit')));
  assert.ok(r.crossFamily.some(x => x.texture === 'gfx/event_pictures/x.dds'), 'an event and a news event on one picture');
  assert.equal(r.frameSprites, 1, 'GFX_zin_tech_a_medium only; GFX_zin_frame is the frame itself');
  assert.deepEqual(r.textures.get('gfx/interface/decisions/zin/seal.dds'), ['decision:zin_send', 'decision:zin_hold']);
  assert.deepEqual(r.concepts.map(c => `${c.family}:${c.id}`), reg().concepts.map(c => `${c.family}:${c.id}`), 'deterministic order');
});

test('general focuses (K69): same name and same template slug in two or more trees; nothing else', () => {
  const g = generalFocusGroups(tree());
  assert.deepEqual(g, [{ name: 'Rally the Banners', slug: 'rally', count: 2, ids: ['zin_alpha_rally', 'zin_beta_rally'] }], 'walls has the same slug but two names, so it is not general');
});

test('shares: kinds, reasons, membership; targets subtract what a deliberate share lets go', () => {
  assert.deepEqual(validateShares({ shares: [{ id: 'a', kind: 'general_focus', reason: 'the same branch in two trees', concepts: ['focus:x', 'focus:y'] }] }), []);
  const bad = validateShares({ shares: [{ id: 'a', kind: 'looks_alike', reason: 'x', concepts: ['focus:x'] }, { id: 'b', kind: 'tiers', reason: 'marks one to three', concepts: ['focus:x', 'focus:z'] }] });
  assert.ok(bad.some(p => /unknown kind/.test(p)) && bad.some(p => /no reason/.test(p)) && bad.some(p => /two or more/.test(p)) && bad.some(p => /also in a/.test(p)));
  const t = targets(reg(), { shares: [{ id: 'g', kind: 'general_focus', reason: 'the same branch in two trees', concepts: ['focus:zin_alpha_rally', 'focus:zin_beta_rally'] }], targets: { focus: { rule: 'r' } } });
  assert.equal(t.focus.concepts, 6); assert.equal(t.focus.pictures, 5); assert.equal(t.focus.rule, 'r');
  assert.equal(t.decision.pictures, 2, 'one seal per decision and mission');
  assert.ok(SHARE_KINDS.includes('general_focus') && SHARE_KINDS.includes('same_concept'));
});

test('committed form: compact rows, summary, targets; drift is reported per field', () => {
  const r = reg(), f = registryFile(r, { shares: [], targets: {} });
  assert.equal(f.concepts.length, r.concepts.length);
  assert.deepEqual(f.concepts.find(row => row[1] === 'zin_alpha_rally'), ['focus', 'zin_alpha_rally', 'GFX_focus_rally', 'gfx/interface/goals/zin/banner.dds']);
  assert.ok(auditDrift(r).some(d => d.family === 'focus' && d.field === 'concepts' && d.audit === AUDIT_31_OCTOBER.focus.concepts));
});

// The committed registry was generated from the phase 0 build and reproduced the audit exactly (the build logs any drift). Icon lanes
// regenerate it as they ship pictures, so the lasting rule is that reuse never grows past the audit: no family has more concepts on
// shared textures or fewer distinct textures per concept than on 31 October, and the frame placeholder count only falls.
test('the committed registry and share list agree with each other, and reuse is no worse than the audit of 31 October', () => {
  const file = JSON.parse(readFileSync(REGISTRY_FILE, 'utf8')), shares = loadShares(SHARES_FILE);
  assert.deepEqual(validateShares(shares), []);
  const known = new Set(file.concepts.map(([fam, id]) => `${fam}:${id}`));
  const stale = shares.shares.flatMap(s => s.concepts).filter(c => !known.has(c));
  assert.deepEqual(stale, [], 'every share names concepts of the committed registry');
  for (const fam of ['focus', 'spirit', 'decision', 'event', 'news_event', 'technology', 'equipment', 'equipment_archetype', 'subunit', 'decision_category', 'decision_category_picture']) {
    const now = file.summary[fam], was = AUDIT_31_OCTOBER[fam];
    assert.ok(now.onShared / now.concepts <= was.onShared / was.concepts + 1e-9, `${fam}: share of concepts on shared textures ${now.onShared}/${now.concepts} is not above the audit's ${was.onShared}/${was.concepts}`);
    assert.ok(now.textures / now.concepts >= was.textures / was.concepts - 1e-9, `${fam}: textures per concept not below the audit`);
  }
  assert.ok(file.crossFamilyAudit <= AUDIT_31_OCTOBER.crossFamilyAudit);
  assert.ok(file.frameSprites <= AUDIT_31_OCTOBER.frameSprites);
  const general = shares.shares.filter(s => s.kind === 'general_focus');
  assert.equal(file.targets.focus.pictures, file.summary.focus.concepts - general.reduce((n, s) => n + s.concepts.length - 1, 0));
  assert.ok(general.length / file.summary.focus.concepts < 0.06, 'general focuses stay a small minority (K69)');
  for (const f of FAMILIES) assert.ok(shares.targets[f.id]?.rule, `a K69 target rule for ${f.id}`);
});
