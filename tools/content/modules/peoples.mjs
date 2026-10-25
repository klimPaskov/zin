// Peoples of Aoaz: one per country, applied as a permanent national spirit plus a country flag at startup.
// The assignment lives in the owner-editable country table (modules/countries.mjs); defaults come from the
// drawings and canon (giants of Hiloron, ents of Kilinti, Sunhot elves, the dead of Zol and Volgan...).
import { cw, assertModifiers, raw } from '../lib/core.mjs';
import { dds } from '../lib/raster.mjs';

export const PEOPLES = {
  men: { name: 'Men', desc: 'Mortal folk: numerous, adaptable and short-lived.', colour: '#b08a4a', modifier: { recruitable_population_factor: 0.1, production_speed_buildings_factor: 0.05 } },
  elves: { name: 'Elves', desc: 'Immortal Great Folk of the forests: few, patient and long-sighted.', colour: '#4f9a5a', modifier: { research_speed_factor: 0.1, army_org_factor: 0.1, experience_gain_army_factor: 0.1, recruitable_population_factor: -0.35 } },
  sun_elves: { name: 'Sunhot Elves', desc: 'Elves of the Lands of the Sun, over three metres tall: among the strongest and most peaceful folk of Aoaz.', colour: '#e0b23a', modifier: { army_attack_factor: 0.15, army_defence_factor: 0.15, war_support_factor: -0.1, recruitable_population_factor: -0.5 } },
  giants: { name: 'Giants', desc: 'Few and enormous; a single giant is worth a company of men.', colour: '#7c6a58', modifier: { army_attack_factor: 0.2, army_speed_factor: -0.05, recruitable_population_factor: -0.5 } },
  ents: { name: 'Ents', desc: 'Ancient tree-folk: slow to rouse, nearly impossible to break.', colour: '#3f6b2e', modifier: { army_defence_factor: 0.25, army_speed_factor: -0.2, recruitable_population_factor: -0.6 } },
  yeti: { name: 'Yeti', desc: 'Furred folk of the frozen north, at home in the coldest winters.', colour: '#c9d6e3', modifier: { winter_attrition: -0.5, acclimatization_cold_climate_gain_factor: 0.5, heat_attrition: 0.25, recruitable_population_factor: -0.25 } },
  trolls: { name: 'Trolls', desc: 'Brutal, hardy and hungry; difficult to command.', colour: '#6d7a5a', modifier: { army_attack_factor: 0.15, army_org_factor: -0.1, recruitable_population_factor: -0.2 } },
  orcs: { name: 'Orcs and Goblins', desc: 'Many, fierce and quarrelsome, bound to no crown.', colour: '#7a3b2a', modifier: { recruitable_population_factor: 0.25, army_org_factor: -0.1, stability_factor: -0.1, army_attack_factor: 0.05 } },
  the_dead: { name: 'Grave Hosts', desc: 'The restless dead, raised and sustained by dark power: they never tire, never starve and never forget.', colour: '#5b5566', modifier: { recruitable_population_factor: 0.4, attrition: -0.25, stability_factor: 0.2, research_speed_factor: -0.2 } },
  demons: { name: 'Demons', desc: 'Corrupted angels: terrible in battle and few in number.', colour: '#9b2a2a', modifier: { army_attack_factor: 0.2, recruitable_population_factor: -0.4, stability_factor: -0.05 } },
};

// A realm of the roster carries its game people (lib/roster.mjs, gamePeople); these defaults serve a country row without one (a
// synthetic test row), from the drawings and canon. Every other country is men; the owner's CSV overrides all of this.
const BY_NAME = { Hirolon: 'giants', Nivaros: 'giants', Kilinti: 'ents', 'Yeti Lands': 'yeti', 'Troll Forest': 'trolls', "Zol's Mistake": 'the_dead', Puvulan: 'the_dead', Khorvrath: 'demons', Dolon: 'demons', Nezer: 'demons', Gala: 'elves', Goodin: 'men', 'Cursed Lands': 'men', Dondor: 'men', Blackton: 'men', Worshipdom: 'men', Yeldenne: 'men' };
const BY_SCAN = { 'Magical Lands': 'elves', Sunhot: 'sun_elves', 'Dark Lands': 'orcs' };
export const defaultPeople = c => c.gamePeople ?? BY_NAME[c.name] ?? BY_SCAN[c.scan] ?? 'men';

// Starting minor peoples (03_peoples.md section 4, proposed): a flag zin_people_minor_<key> only, no spirit, at most three per realm.
// The defaults of the spec by realm name (Volgan's realm Puvulan: demons and orcs, ogres once the key exists; Goldoroth: trolls; Kilinti:
// men), and goblins, which are not one of the ten peoples (section 3, proposed: a minor people of the orc holds), for every realm whose
// roster peoples count goblins while its game people is another. A people no realm holds as minor is read through its primary flag only.
export const MINOR_PEOPLES = { Puvulan: ['demons', 'orcs'], Goldoroth: ['trolls'], Kilinti: ['men'] };
export const MINOR_FLAG_ONLY = ['goblins'];
export const MINOR_CAP = 3;
export function minorPeoples(c, primary) {
  const out = (MINOR_PEOPLES[c.name] ?? []).filter(k => k !== primary);
  for (const k of MINOR_FLAG_ONLY) if (c.peoples?.[k] > 0 && primary !== k && !out.includes(k)) out.push(k);
  if (out.length > MINOR_CAP) throw new Error(`peoples: ${c.name} has ${out.length} minor peoples (the cap is ${MINOR_CAP})`);
  return out;
}
// Regional traditions of men (03_peoples.md section 5, proposed): a country flag zin_tradition_<key>, set beside the people flag. Only the
// traditions something reads are written: the Middle Kingdom (Aenor, the Concord dominions whose people is men, and Fotan).
export function traditions(c, primary) {
  const out = [];
  // The roster's own people decides (Kunhrim's dwarves play as men and are no Middle Kingdom folk).
  if (primary === 'men' && (c.people ?? primary) === 'men' && (c.name === 'Aenor' || c.name === 'Fotan' || (c.overlordKey === 'aenor' && c.subjectType === 'chartered dominion'))) out.push('middle_kingdom');
  return out;
}

export async function buildPeoples(staged, countries, assignment, art) {
  const ideas = {}, loc = {}, sprites = [];
  for (const [key, p] of Object.entries(PEOPLES)) {
    await assertModifiers(`people ${key}`, p.modifier);
    ideas[`zin_people_${key}`] = { picture: `zin_people_${key}`, allowed: raw('{ always = no }'), removal_cost: -1, modifier: p.modifier };
    loc[`zin_people_${key}`] = p.name; loc[`zin_people_${key}_desc`] = p.desc;
    staged.add(`gfx/interface/ideas/zin_people_${key}.dds`, dds(art.emblems.get(key)));
    // The interim focus icon GFX_focus_zin_<people> (modules/vanilla_removal.mjs) is 100 x 88 with a transparent ground, like every focus icon.
    staged.add(`gfx/interface/goals/zin/people_${key}.dds`, dds(art.focusEmblems.get(key)));
    sprites.push(`\tspriteType = {\n\t\tname = "GFX_idea_zin_people_${key}"\n\t\ttexturefile = "gfx/interface/ideas/zin_people_${key}.dds"\n\t}`);
  }
  staged.text('common/ideas/zin_peoples.txt', `# Generated by the ZIN content builder: peoples of Aoaz.\nideas = {\n\tcountry = {\n${cw(ideas, 2)}\t}\n}\n`);
  staged.text('interface/zin_peoples.gfx', `spriteTypes = {\n${sprites.join('\n')}\n}\n`);
  staged.loc('zin_peoples', loc);
  // The people triggers of 03_peoples.md ("Implementation"): zin_people_is_<key> is the primary people (its flag), zin_people_includes_<key>
  // the primary or a minor people (flag zin_people_minor_<key>), and the two folk classes. Mechanics and trees read these, never the flags.
  const GREAT_FOLK = ['elves', 'sun_elves', 'demons'], COMMON_FOLK = ['men'];
  const flagTest = keys => (keys.length === 1 ? `has_country_flag = zin_people_${keys[0]}` : `OR = {\n${keys.map(k => `\t\thas_country_flag = zin_people_${k}`).join('\n')}\n\t}`);
  const minors = new Map(countries.map(c => [c.tag, minorPeoples(c, assignment.get(c.tag))]));
  const heldMinor = new Set([...minors.values()].flat());
  const triggers = Object.keys(PEOPLES).flatMap(key => [
    `zin_people_is_${key} = {\n\thas_country_flag = zin_people_${key}\n}`,
    heldMinor.has(key)
      ? `zin_people_includes_${key} = {\n\tOR = {\n\t\thas_country_flag = zin_people_${key}\n\t\thas_country_flag = zin_people_minor_${key}\n\t}\n}`
      : `# No realm holds ${key} as a minor people at the start.\nzin_people_includes_${key} = {\n\thas_country_flag = zin_people_${key}\n}`,
  ]);
  triggers.push(`# Great Folk: elves, Sunhot elves and demons; nothing else.\nzin_people_is_great_folk = {\n\t${flagTest(GREAT_FOLK)}\n}`, `# Common Folk: men; nothing else.\nzin_people_is_common_folk = {\n\t${flagTest(COMMON_FOLK)}\n}`);
  staged.text('common/scripted_triggers/zin_peoples.txt', `# Generated by the ZIN content builder: the people triggers (docs/specs/00_foundation/03_peoples.md).\n${triggers.join('\n')}\n`);
  return countries.map(c => {
    const p = assignment.get(c.tag);
    const extra = [...minors.get(c.tag).map(k => `set_country_flag = zin_people_minor_${k}`), ...traditions(c, p).map(k => `set_country_flag = zin_tradition_${k}`)];
    return `\t\t\t${c.tag} = { add_ideas = zin_people_${p} set_country_flag = zin_people_${p}${extra.length ? ` ${extra.join(' ')}` : ''} }`;
  }).join('\n');
}
