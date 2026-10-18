// Private: stage the owner-approved pilot unit references into the kit's deterministic job roots
// (docs/assets/hoi4_3d_model_jobs/models_3d/<slug>/refs/...). Exactly one Meshy input per job.
//   node tools/content/art/stage-unit-jobs.mjs   (reads <ZIN_ART>/models/refs)
import { readFile, writeFile, mkdir, copyFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { UNITS } from './unit-ref-jobs.mjs';
import { ZIN, ART } from '../lib/paths.mjs';
const REFS = `${ART}/models/refs`;
const sha = b => createHash('sha256').update(b).digest('hex');
const prov = (await readFile(`${REFS}/provenance.jsonl`, 'utf8')).trim().split('\n').map(l => JSON.parse(l));
const jobs = JSON.parse(await readFile(`${REFS}/jobs.json`, 'utf8'));
for (const u of UNITS) {
  const root = `${ZIN}/docs/assets/hoi4_3d_model_jobs/models_3d/${u.id}`;
  await mkdir(`${root}/refs/original`, { recursive: true }); await mkdir(`${root}/refs/source`, { recursive: true });
  const bytes = await readFile(`${REFS}/${u.id}.png`), digest = sha(bytes);
  const gen = prov.filter(p => p.id === u.id && p.sha256 === digest).at(-1);
  if (!gen) throw new Error(`${u.id}: no provenance record for the current image`);
  const others = (await readdir(`${root}/refs/original`)).filter(f => f !== 'meshy_input.png');
  if (others.length) throw new Error(`${u.id}: refs/original must hold exactly one image, found ${others}`);
  await copyFile(`${REFS}/${u.id}.png`, `${root}/refs/original/meshy_input.png`);
  await writeFile(`${root}/refs/source/provenance.json`, JSON.stringify({
    asset_id: u.id, people: u.people,
    mode: 'source_free_owner_rule',
    rationale: "ZIN rule (owner, 17 October 2026): all art is new and image-generated; never copy assets from other mods. This overrides the kit's third-party source search, so no external source exists for this reference.",
    owner_approval: { at: '2026-10-18', quote: 'Approved all five unit references.' },
    generator: { route: 'gptimage library (owner ChatGPT plan)', model: gen.model, size: gen.size, quality: gen.quality, generated_at: gen.at, prompt: jobs.find(j => j.id === u.id).prompt },
    meshy_input: { path: 'refs/original/meshy_input.png', sha256: digest, bytes: bytes.length },
    rejected_attempts: prov.filter(p => p.id === u.id && p.rejectedManually).map(p => p.rejectedManually),
  }, null, 2) + '\n');
  console.log(u.id, digest.slice(0, 12));
}
