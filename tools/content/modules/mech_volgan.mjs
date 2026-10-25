// Volgan and the Southern Dominion, with Mirolon's watch (docs/specs/04_mechanics/volgan_southern_dominion.md): the hidden
// rebuilding measured by dominion strength, the Veil of Storms, grave musters, the Dominion's oaths, the Nether and the Abyss,
// envoys to the independent Dark Lands, Mirolon's proof and passes, the reconquest, the march north, the clash and the Black
// Compact with Zol, the broken body and the Children of Volgan.
//
//   const r = await buildVolgan(staged, { countries, warfareIds?, defineVolgan? })
//     warfareIds     the id list of data/warfare_ids.json (sub-units, host groups); read from the file by default
//     defineVolgan   true to define the character zin_volgan here (default false: the characters module owns him; the focus compiler's
//                    F3 check refuses a character whose id equals a tree id, and the tree is `volgan`)
//   returns { kit, counts }; throws on a text, id, picture or reference error.
//
// Data: data/mech_powers_volgan.json (numbers, names, externals), data/mech_powers_volgan_text.json (all text).
// Events .10 to .19, .23, .24 and .29 are written by modules/events_mech_war.mjs (data/events_mech_dominion.json, docs/specs/06_events);
// this module fires them and provides
// the effects their options call: zin_dominion_champion_falls, zin_dominion_member_breaks_free, zin_dominion_let_mirolon_go,
// zin_dominion_hold_mirolon, zin_dominion_end_compact and zin_volgan_strike_zol.
// Code: lib/mp_volgan_core.mjs (triggers, effects), mp_volgan_pulse.mjs (start, pulses, on_actions, AI), mp_volgan_content.mjs
// (ideas, characters, decisions, events, rules).
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { loadCatalogKeys } from '../lib/inst_util.mjs';
import { Kit, loadMech, DATA, call } from '../lib/mp_kit.mjs';
import { writeTriggers, writeEffects } from '../lib/mp_volgan_core.mjs';
import { writePulse } from '../lib/mp_volgan_pulse.mjs';
import { writeContent } from '../lib/mp_volgan_content.mjs';

export async function buildVolgan(staged, ctx) {
  const { countries } = ctx;
  const D = await loadMech('mech_powers_volgan.json'), T = await loadMech('mech_powers_volgan_text.json');
  const warfare = ctx.warfareIds ?? JSON.parse(await readFile(path.join(DATA, 'warfare_ids.json'), 'utf8'));
  const byName = new Map(countries.map(c => [c.name, c]));
  const tag = name => { const c = byName.get(name); if (!c) throw new Error(`Volgan: country ${name} is not in the roster`); return c.tag; };
  const R = D.realms;
  const V = { D, T, countries, staged };
  Object.assign(V, { VOL: tag(R.volgan), MIR: tag(R.mirolon), HEREZ: tag(R.herez), ZOL: tag(R.zol), AEN: tag(R.aenor), GOLD: tag(R.goldoroth), DON: tag(R.dondor), GALA: tag(R.gala) });
  V.members = R.members.map(tag);
  V.dead = countries.filter(c => c.scan === R.dead_scan);
  V.dark = countries.filter(c => c.scan === R.dark_scan);
  V.middle = countries.filter(c => R.middle_scans.includes(c.scan));
  if (!warfare.subUnits.includes('zin_abyss_folk')) throw new Error('Volgan: the warfare data defines no zin_abyss_folk');
  V.grave = warfare.subUnits.includes('zin_the_dead_revenant') ? 'zin_the_dead_revenant' : 'infantry';
  V.abyss = 'zin_abyss_folk';
  V.hostGroup = warfare.hostGroupByCountry?.[R.volgan] ?? 'ZIN_HOSTS_GRAVE_HOSTS';
  V.defineVolgan = ctx.defineVolgan ?? false;
  const catalog = new Set(await loadCatalogKeys());
  V.K = new Kit('dominion', D, T);
  V.N = k => V.K.N(k);
  V.art = key => { if (!catalog.has(key)) throw new Error(`Volgan: icon ${key} is not in the catalog`); return key; };
  Object.assign(V, { ST: 'zin_dominion_strength', VL: 'zin_volgan_veil', NP: 'zin_nether_pact', PF: 'zin_mirolon_proof', PS: 'zin_mirolon_passes' });
  V.exists = t => `country_exists = ${t}`;
  V.gd = v => call('zin_world_add_gathering_dark', { value: v });
  V.ownerOr = list => `OR = {\n${list.map(t => `original_tag = ${t}`).join('\n')}\n}`;
  V.inVol = body => `if = {\nlimit = { country_exists = ${V.VOL} }\n${V.VOL} = {\n${body}\n}\n}`;
  V.inMir = body => `if = {\nlimit = { country_exists = ${V.MIR} }\n${V.MIR} = {\n${body}\n}\n}`;
  V.newsAll = id => `every_country = {\nlimit = { is_ai = no }\nnews_event = { id = ${id} }\n}`;
  V.volHeld = `OR = {\noriginal_tag = ${V.VOL}\nis_subject_of = ${V.VOL}\n}`;

  writeTriggers(V);
  writeEffects(V);
  writePulse(V);
  writeContent(V);

  const K = V.K;
  K.stage(staged);
  staged.add('localisation/english/zin_dominion_l_english.yml', K.loc.bytes());
  staged.text('interface/zz_zin_dominion.gfx', K.spriteText('Decision and category pictures of the Volgan and Mirolon mechanic: each shows a picture of the icon catalog until the art pass draws its own. Loaded after the vanilla files (zz_).'));
  const kinds = k => K.defs.get(k)?.size ?? 0;
  return { kit: K, counts: { effects: kinds('effect'), triggers: kinds('trigger'), decisions: kinds('decision'), categories: kinds('category'), ideas: kinds('idea'), events: kinds('event'), dynamic: kinds('dynamic'), opinions: kinds('opinion'), characters: kinds('character'), rules: kinds('rule'), locKeys: K.loc.size }, tags: { VOL: V.VOL, MIR: V.MIR, HEREZ: V.HEREZ, ZOL: V.ZOL, AEN: V.AEN, GOLD: V.GOLD, DON: V.DON, GALA: V.GALA }, members: V.members, dead: V.dead.map(c => c.tag), dark: V.dark.map(c => c.tag), middle: V.middle.map(c => c.tag), defineVolgan: V.defineVolgan };
}
