// Pictures of the super events (owner decision K52; UI overhaul lane W8; docs/specs/06_events/06_super_events.md section 5) and the
// window's backdrop plate (design system section 5 rule 5: one generated plate behind each full-screen view), from
// tools/content/data/super_events.json. This script only composes the prompts and resizes the generated pictures; every picture is
// painted by the image model (gpt-6-luna).
//   node tools/content/art/super-event-jobs.mjs [jobs.json] [--only <regex>]   writes the jobs (default <ZIN_ART>/jobs/super-event-jobs.json)
//   node tools/content/imagegen.mjs <jobs.json>                                paints them into <ZIN_ART>/raw/events/super/
//   node tools/content/art/super-event-jobs.mjs --track [--only <regex>]       resizes each picture (Lanczos 3, cover, never enlarged) to
//                                                                              art/source/events/super/<key>.png at the window's picture size
// The build reads only the tracked pictures (deterministic on every machine) and ships those whose bytes carry an accepted review line.
// Design references are the owner-chosen generated redesigns (art/source/design_refs/design_refs.json, K37 to K45), passed from their
// byte-identical copies in the art store, never from inside the mod folder.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { ART, ART_SOURCE, ZIN } from '../lib/paths.mjs';

export const DATA_FILE = fileURLToPath(new URL('../data/super_events.json', import.meta.url));
const REFS_FILE = `${ZIN}/art/source/design_refs/design_refs.json`;
export const rawPicture = key => `${ART}/raw/events/super/zin_se_${key}.png`;
export const trackedPicture = key => `${ART_SOURCE}/events/super/zin_se_${key}.png`;
export const BACKDROP = 'backdrop';

// The parts of every prompt (the art briefs' common rules, docs/plans/super_events/art_briefs.json).
export const STYLE = 'Painted dark-fantasy strategy-game art in a consistent style: rich oil-paint texture, dramatic soft lighting, muted earthy palette with gold accents, fine detail, the finish of a great history painting.';
export const FRAME = 'A grand 3:2 landscape painting announcing one of the great moments of the age in a fantasy strategy game, filling the whole image edge to edge with no border. The main subject sits inside the central 90 percent of the picture; the corners and the bottom edge hold only plain ground, sky or wall, because a bronze moulding frames the picture.';
export const RULES = 'No text, no letters, no numbers, no runes, no signature, no maker\'s mark, no watermark, no frame, no label, no logo. No modern objects, no firearms, no gunpowder, no engines, no uniforms. No real-world religious symbol, no cross, no crescent, no star of David. An original world: no character, costume, creature design or place from any existing film, book or game. No gore and no blood.';
// Owner decision K54: leaders are men; women appear only as canon figures (Alleria) or in a crowd of townsfolk.
export const ROLES = 'Every lord, king, captain, officer, priest, keeper, envoy, clerk and soldier in the picture is a man; only a crowd of townsfolk or pilgrims may include some women.';
// Peoples that appear in the moments (docs/specs/08_art_and_assets/07_peoples_appearance.md, K54, K57): inhuman features first.
export const PEOPLES = [
  { re: /\belv(?:es|en)\b|\bGala\b/i, text: 'Elves are human-tall with long pointed ears, long narrow faces, large eyes and fine bones, pale to tan skin, ageless but lined when old; never dark-skinned, never a human with a point on the ear.' },
  { re: /\bdwar(?:f|ves)\b/i, text: 'Dwarves stand only 1.3 to 1.5 m tall, broad and stocky with short thick limbs, heavy brows, broad noses, deep-set eyes and very long thick beards, never a scaled-down human.' },
  { re: /\bgiants?\b/i, text: 'Giants are primeval beings over 10 m tall, craggy, with stone-like hide of cracked grey rock plates, moss and lichen on brow and shoulders, a massive lower jaw and small deep-set eyes; men stand around them no higher than their knees; never a tall human.' },
  { re: /\bogres?\b/i, text: 'Ogres are 3 m tall brutes in a half-crouch, with heavy sloping brows, large lower tusks, coarse skin and pot bellies, carrying clubs; never a human or an orc.' },
  { re: /walking dead|skeletal|grave-warriors|the dead\b/i, text: 'The dead are skeletal, armoured skeletons, mostly bone, with empty eye sockets and bared teeth under rusted or dark armour plates, mail and grave-cloth, broken crowns and crested helms; never rotting corpses, never spectral ghosts, never pale living people.' },
  { re: /\bdragons?\b/i, text: 'The dragon is a great four-legged winged dragon, huge against the men below, scaled and long-necked.' },
];

// Per moment: the design references the picture keeps (null = the art brief's own list) and the extra direction of this lane.
// golden_king_dead and ending_golden_court show no Golden King, so his portrait is not passed (it would draw him); kusven_forth shows no heir.
export const OVERRIDES = {
  golden_king_dead: { references: [], note: 'The Golden King does not appear anywhere in the picture, not even on the throne seen through the door.' },
  ending_golden_court: { references: [], note: 'No king sits at the feast; the courtiers are many and varied.' },
  kusven_forth: { references: ['art/source/design_refs/kusven_v2_a.png'] },
  black_compact: { note: 'Volgan\'s grave-warriors wear tattered purple and ember-red war-gear lit by green grave-light; the dead of the black north wear rusted grey mail under black rags; the two kinds stay recognisable as they merge.' },
  volgan_marches: { note: 'Volgan\'s grave-warriors are skeletal warriors in tattered purple and ember-red war-gear with green grave-light in their eye sockets.' },
  // Knowledge layers (rule 6): at id 10 the text never says what Afrit is, so his shadow is only wrong, never a demon.
  king_of_the_east: { references: ['art/source/design_refs/aurevan_a.png'], note: 'The shadow on the wall behind the throne is only a shadow: too long, and its outline subtly wrong, with shoulders a little too broad and something folded at its back, but no horns, no wings spread, no eyes and no face. Nothing else in the hall is unnatural.' },
  name_of_the_deliverer: { note: 'The Deliverer himself is not in the square. The confessor in white is an old, bald, grey-bearded priest who looks nothing like the Deliverer. On the wall the great painted face of the radiant Deliverer has its left half scraped away down to bare black darkness, as if the paint had been a mask.' },
  ending_eastern_king: { note: 'The new royal standard on the gate is a plain gold caravan-gate device on deep blue; no lion, no sun, no animal, no real-world emblem. Camels walk in the caravan beside the wagons.' },
  heir_of_aen: { note: 'The Keeper holding the bowl is an old male elf; every elf in the hall is male. The bowl of water shows only a faint golden glint of a crown on its surface, no face.' },
};

const subjectOf = (refs, file) => refs.find(r => r.file === file)?.subject ?? path.basename(file, '.png');
export function references(e, briefs, refs) {
  const list = OVERRIDES[e.key]?.references ?? briefs.find(b => b.key === e.key)?.references ?? [];
  return list.map(file => {
    const r = refs.find(x => x.file === file);
    if (!r) throw new Error(`super events: no design reference ${file}`);
    return { file, subject: r.subject, art: `${ART}/${r.src}` };
  });
}

// The briefs cite owner decisions (K57, K41) for the reader; the model gets only the picture.
export const plain = t => t.replace(/\s*\(K\d+(?:[^)]*)\)/g, '').replace(/,\s*K\d+\)/g, ')').replace(/\s*\(K\d+: [^)]*\)/g, '');
export function picturePrompt(e, refs) {
  const people = PEOPLES.filter(p => p.re.test(e.picture)).map(p => p.text);
  const names = refs.map(r => r.subject.replace(/ \((?:public face, )?gated\)/, '').replace(/ \(redesign of [^)]*\)/, ''));
  const refText = refs.length ? `The attached reference image${refs.length > 1 ? 's are, in order,' : ' is'} the binding design${refs.length > 1 ? 's' : ''} of ${names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names.at(-1)}` : names[0]}: keep ${refs.length > 1 ? "each one's" : 'its'} design, costume, colours and face exactly, changing only the scale, pose and finish to this painting.` : '';
  return [STYLE, FRAME, `The moment: ${e.title}.`, `The scene: ${plain(e.picture)}`, OVERRIDES[e.key]?.note ?? '', refText, ...people, ROLES, RULES].filter(Boolean).join('\n');
}

export const BACKDROP_PROMPT = [STYLE,
  'A very wide 16:9 painted background plate for a full-screen window, filling the whole image edge to edge with no border. The interior of an old royal chancery hall at night seen straight on: dark carved walnut panelling with gilt mouldings, a row of tall dark green and deep red wall hangings without any figures or patterns of figures, bronze candle sconces giving low warm light at the far left and far right edges, a polished dark floor. The whole middle of the picture is calm, plain and dark, because a large window covers it; detail only at the outer edges, very low contrast, deep shadow overall.',
  'No people, no figure, no face, no animal, no throne, no crown, no sun disc, no banner device, no furniture in the middle.',
  RULES].join('\n');

export function loadAll() {
  const data = JSON.parse(readFileSync(DATA_FILE, 'utf8'));
  const briefs = JSON.parse(readFileSync(`${ZIN}/docs/plans/super_events/art_briefs.json`, 'utf8')).briefs;
  const refs = JSON.parse(readFileSync(REFS_FILE, 'utf8')).refs;
  return { data, briefs, refs };
}

export function superEventJobs({ data, briefs, refs } = loadAll(), only) {
  const keep = only ? new RegExp(only) : null;
  const jobs = data.events.filter(e => !keep || keep.test(e.key)).map(e => {
    const rs = references(e, briefs, refs);
    for (const r of rs) if (!existsSync(r.art)) throw new Error(`super events: the art store has no copy of ${r.file} at ${r.art}`);
    return { id: `super-event-${e.key}`, prompt: picturePrompt(e, rs), out: rawPicture(e.key), size: '1536x1024', quality: 'high', references: rs.map(r => r.art) };
  });
  if (!keep || keep.test(BACKDROP)) jobs.push({ id: 'super-event-backdrop', prompt: BACKDROP_PROMPT, out: rawPicture(BACKDROP), size: '1536x1024', quality: 'high', references: [] });
  return jobs;
}

// Resize a generated picture to its tracked size: cover at the target aspect, Lanczos 3, never enlarged.
export async function track(key, w, h) {
  const src = rawPicture(key);
  if (!existsSync(src)) return `${key}: not generated yet`;
  const meta = await sharp(src).metadata();
  if (meta.width < w || meta.height < h) throw new Error(`${key}: ${meta.width}x${meta.height} is smaller than ${w}x${h}`);
  mkdirSync(path.dirname(trackedPicture(key)), { recursive: true });
  await sharp(src).resize(w, h, { fit: 'cover', position: 'centre', kernel: 'lanczos3' }).removeAlpha().png({ compressionLevel: 9 }).toFile(trackedPicture(key));
  return `${key}: ${meta.width}x${meta.height} -> ${w}x${h}`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const args = process.argv.slice(2), oi = args.indexOf('--only'), only = oi >= 0 ? args[oi + 1] : undefined;
  const all = loadAll();
  if (args.includes('--track')) {
    const pic = all.data.window.picture, bd = all.data.window.backdrop;
    for (const e of all.data.events) if (!only || new RegExp(only).test(e.key)) console.log(await track(e.key, pic.width, pic.height));
    if (!only || new RegExp(only).test(BACKDROP)) console.log(await track(BACKDROP, bd.width, bd.height));
  } else {
    const file = path.resolve(args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--only') ?? `${ART}/jobs/super-event-jobs.json`);
    mkdirSync(path.dirname(file), { recursive: true });
    mkdirSync(path.dirname(rawPicture('x')), { recursive: true });
    writeFileSync(file, JSON.stringify(superEventJobs(all, only), null, 2) + '\n');
    console.log(file);
  }
}
