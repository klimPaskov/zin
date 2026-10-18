// Private: source-free, model-ready references for ZIN's pilot 3D land units (one Meshy input image each).
// ZIN's rule that all art is new and image-generated overrides the kit's third-party source search, so these are
// recorded as source-free references; each still needs the owner's approval before any Meshy call.
//   node tools/content/art/unit-ref-jobs.mjs > <ZIN_ART>/models/refs/jobs.json
import { ART } from '../lib/paths.mjs';
const OUT = `${ART}/models/refs`;
const COMMON = 'A single full-body character for a 3D model reference, for a dark painterly fantasy grand-strategy game. ' +
  'Straight front view, the whole figure from head to feet visible and centred with margin on every side, standing on nothing, ' +
  'relaxed A-pose with arms angled about 30 degrees away from the body and legs slightly apart, hands open and empty, fingers separated. ' +
  'He holds no weapon, no shield, no staff and no banner; nothing is attached to the hands. ' +
  'Plain flat uniform light grey (#c8c8c8) background, even soft studio lighting, no cast shadow, no ground, no scenery, no text, no frame. ' +
  'Clear readable silhouette, no loose cloth streamers, no thin floating parts, armour pieces solid and attached to the body. The figure is ';
export const UNITS = [
  { id: 'zin_men_infantry', people: 'men', look: 'a Middle Kingdom royal infantryman of the Golden King: a sturdy human soldier in a dark steel open-faced helmet with a short gold crest, a mail shirt under a deep blue tabard with a small gold sun emblem on the chest, steel shoulder plates, leather belt and pouches, steel greaves over sturdy boots. Weathered determined face.' },
  { id: 'zin_elves_warden', people: 'elves', look: 'a Magical Forest elf warden: a tall slender elf with long pale hair tied back and pointed ears, wearing layered leaf-shaped green and silver scale armour over a moss-green tunic, a short hooded mantle fastened at the chest, fitted bracers and soft tall boots. Calm, ageless face.' },
  { id: 'zin_orcs_warrior', people: 'orcs', look: 'an orc warrior: a broad, heavily muscled orc with dark green-grey skin, small tusks and a scarred face, wearing crude blackened iron plates strapped over hide and furs, a spiked iron pauldron on one shoulder, a heavy belt with bone trophies, wrapped forearms and iron-shod boots.' },
  { id: 'zin_the_dead_revenant', people: 'the_dead', look: 'a Grave Host revenant: an undead warrior with a gaunt grey skeletal face and faint pale-green glowing eyes, wearing ancient corroded bronze armour and a cracked crested helm over tattered dark burial wrappings that hang close to the body, exposed bony hands. Eerie but solid.' },
  { id: 'zin_trolls_brute', people: 'trolls', look: 'a hulking mountain troll: a massive hunched humanoid with grey stony mottled skin, long thick arms, huge hands, a heavy brow, wearing only a crude hide loincloth, rough iron bands on the wrists and a few chained stone plates on the shoulders. Bare large feet.' },
];
const jobs = UNITS.map(u => ({ id: u.id, size: '1024x1536', quality: 'high', out: `${OUT}/${u.id}.png`, prompt: COMMON + u.look }));
if (process.argv[1]?.endsWith('unit-ref-jobs.mjs')) console.log(JSON.stringify(jobs, null, 1));
