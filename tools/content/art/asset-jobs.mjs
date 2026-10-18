// Image-generation jobs for every non-flag asset: people emblems, character portraits and interface art.
// Sheets keep the call count down; slicing code only cuts and resizes what the image model painted.
//   node tools/content/art/asset-jobs.mjs [outDir]   (default: <ZIN_ART>/jobs)
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { PEOPLES } from '../modules/peoples.mjs';
import { ART } from '../lib/paths.mjs';

const outDir = path.resolve(process.argv[1]?.endsWith('asset-jobs.mjs') && process.argv[2] ? process.argv[2] : `${ART}/jobs`);
const raw = sub => path.join(outDir, '../raw', sub).split(path.sep).join('/');
const STYLE = 'Painted dark-fantasy strategy-game art in a consistent style: rich oil-paint texture, dramatic soft lighting, muted earthy palette with gold accents.';

const LOOKS = {
  men: 'human men and women of a medieval realm: weathered faces, wool and leather clothing, simple jewellery',
  elves: 'forest elves: slender, ageless, pointed ears, long hair, green and silver robes with leaf brooches',
  sun_elves: 'towering sun elves over three metres tall: bronze skin, golden eyes, sun-disc diadems, white and gold robes',
  giants: 'giants: huge craggy faces, heavy brows, braided beards or hair, fur mantles and stone ornaments',
  ents: 'ents: tree-folk with bark skin, mossy beards, leafy crowns and amber eyes',
  yeti: 'yeti: shaggy white fur, pale blue eyes, icy grey skin around the face, bone necklaces',
  trolls: 'trolls: grey-green hide, heavy jaws with small tusks, crude iron rings and hides',
  orcs: 'orcs and goblins: green and brown skin, tusks, scarred faces, spiked leather armour',
  the_dead: 'the undead: gaunt pale skull-like faces, glowing pale-blue eyes, tattered dark hoods and rusted crowns',
  demons: 'demons, corrupted angels: crimson skin, black horns, ember-red eyes, scorched dark armour',
};

export function assetJobs() {
  const jobs = [];
  // People emblems: one sheet of 10 round emblems (5 x 2) on black.
  const keys = Object.keys(PEOPLES);
  jobs.push({ id: 'emblems-peoples', size: '1536x1024', quality: 'high', out: raw('emblems/emblems-peoples.png'), check: { expected: keys.length, cols: 5, rows: 2, aspect: [0.75, 1.33], minAreaFraction: 0.25 },
    prompt: `${STYLE} An asset sheet of ${keys.length} circular heraldic emblems for a fantasy strategy game, arranged in an exact grid of 5 columns and 2 rows, on a solid flat pure black (#000000) background with wide black gutters: no glow, no blur, no gradient in the background. Each emblem is a perfectly round medallion of the same size with a thin gold rim and a dark inner disc, showing one bold symbol, flat front view, no text, no letters. Row 1, left to right: ${keys.slice(0, 5).map((k, i) => `${i + 1}. ${PEOPLES[k].name}: ${emblemSymbol(k)}`).join('; ')}. Row 2, left to right: ${keys.slice(5).map((k, i) => `${i + 6}. ${PEOPLES[k].name}: ${emblemSymbol(k)}`).join('; ')}.` });
  // Portraits: per people, one sheet of 4 bust portraits (2 x 2): two men, two women (or male/female forms).
  for (const k of keys) jobs.push({ id: `portraits-${k}`, size: '1024x1536', quality: 'high', out: raw(`portraits/portraits-${k}.png`), check: { expected: 4, cols: 2, rows: 2, aspect: [0.45, 1.0], minAreaFraction: 0.3 },
    prompt: `${STYLE} An asset sheet of 4 character portraits for a fantasy grand-strategy game, arranged in an exact grid of 2 columns and 2 rows on a solid flat pure black (#000000) background with wide black gutters: no glow, no blur in the background. Each portrait is a rectangular head-and-shoulders bust, the same size, facing the viewer slightly turned, set against its own dark painted backdrop, no frame, no text, no letters. The subjects are ${LOOKS[k]}. Top left: a stern male ruler. Top right: a wise female ruler. Bottom left: a scarred male war captain. Bottom right: a cunning female counsellor. Distinct faces, ages and clothing for each.` });
  // Interface art.
  jobs.push({ id: 'ui-frame', size: '1024x1024', quality: 'high', out: raw('ui/ui-frame.png'),
    prompt: `${STYLE} A square user-interface panel texture for a fantasy strategy game, viewed perfectly flat and front-on, filling the whole image edge to edge: a dark charcoal-brown leather and iron panel with a double gold filigree border running evenly around all four edges about 7% of the width thick, small ornate gold corner pieces, and a plain, evenly lit, softly textured dark centre with no symbols. Symmetric, no text, no perspective, no drop shadow outside the panel.` });
  jobs.push({ id: 'ui-button', size: '1536x1024', quality: 'high', out: raw('ui/ui-button.png'), check: { expected: 3, cols: 1, rows: 3, aspect: [2.5, 8], minAreaFraction: 0.15 },
    prompt: `${STYLE} An asset sheet of 3 identical wide rectangular game buttons stacked vertically in 3 rows on a solid flat pure black (#000000) background with wide black gutters, each button about 4.4 times wider than tall, flat front view: dark bronze and leather with a thin gold border and empty centre, no text. Top: normal state. Middle: hover state, slightly brighter with a warm glow inside the border. Bottom: pressed state, darker and slightly inset. No glow in the background.` });
  jobs.push({ id: 'ui-rule', size: '1536x1024', quality: 'high', out: raw('ui/ui-rule.png'), check: { expected: 1, cols: 1, rows: 1, aspect: [8, 400], minAreaFraction: 0 },
    prompt: `${STYLE} A single thin horizontal ornamental divider line for a fantasy game interface, centred on a solid flat pure black (#000000) background: a fine gold line spanning almost the full width with a small gold diamond ornament in the middle and tapering ends, flat front view, no text, no background glow.` });
  return jobs;
}
function emblemSymbol(k) {
  return { men: 'a gold crown', elves: 'a silver leaf', sun_elves: 'a radiant sun', giants: 'a snow-capped mountain', ents: 'an ancient tree', yeti: 'a white clawed paw', trolls: 'a spiked club', orcs: 'a tusked face', the_dead: 'a skull', demons: 'a horned burning eye' }[k];
}

if (process.argv[1]?.endsWith('asset-jobs.mjs')) {
  await mkdir(outDir, { recursive: true });
  const jobs = assetJobs();
  await writeFile(path.join(outDir, 'assets-jobs.json'), JSON.stringify(jobs, null, 1));
  console.log(JSON.stringify({ jobs: jobs.length }));
}
