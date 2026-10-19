// Batch image generation for ZIN through the owner's gptimage library (ChatGPT plan, Codex backend).
//   GPTIMAGE_MODEL=<model> node tools/content/imagegen.mjs <jobs.json>   (library: GPTIMAGE_LIB, lib/paths.mjs)
// jobs.json: [{ "id", "prompt", "out", "size"?, "quality"?, "references"?, "check"? }].
// A job whose output exists is skipped unless its `check` fails. `check` ({ expected, cols, rows, aspect,
// minAreaFraction }) requires the sheet to yield exactly `expected` items on its black background; a failing
// sheet moves to raw/rejected/ and is regenerated, up to three attempts. Every generated image is recorded
// (prompt, model, size, references, sha256, accepted) in <dir of jobs.json>/provenance.jsonl.
import { readFile, writeFile, appendFile, access, mkdir, rename } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { findRegionsAdaptive } from './lib/sheets.mjs';
import { GPTIMAGE_LIB } from './lib/paths.mjs';
const LIB = pathToFileURL(GPTIMAGE_LIB + '/').href;
process.env.GPTIMAGE_MODEL ??= 'gpt-6-astra';
const { getValidCredentials } = await import(LIB + 'auth.js');
const { generateImage } = await import(LIB + 'codex.js');
const { readReferenceImages } = await import(LIB + 'images.js');

const jobsPath = path.resolve(process.argv[2]);
const jobs = JSON.parse(await readFile(jobsPath, 'utf8'));
const provenance = path.join(path.dirname(jobsPath), 'provenance.jsonl');
const exists = async p => { try { await access(p); return true; } catch { return false; } };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const passes = async job => !job.check || (await findRegionsAdaptive(job.out, job.check.expected, job.check)).ok;
async function reject(job, attempt) {
  const dir = path.join(path.dirname(job.out), '..', 'rejected'); await mkdir(dir, { recursive: true });
  let n = attempt; while (await exists(path.join(dir, `${path.basename(job.out, '.png')}-try${n}.png`))) n++;
  const target = path.join(dir, `${path.basename(job.out, '.png')}-try${n}.png`);
  // Windows keeps a just-read file locked for a moment (scanners, the image reader): retry the move.
  for (let i = 0; ; i++) {
    try { await rename(job.out, target); return; } catch (e) { if (!/EBUSY|EPERM|EACCES/.test(String(e.code ?? e.message)) || i >= 8) throw e; await sleep(1500 * (i + 1)); }
  }
}

let done = 0, skipped = 0, rejected = 0;
for (const job of jobs) {
  if (await exists(job.out)) { if (await passes(job)) { skipped++; continue; } await reject(job, 1); rejected++; }
  let attempt = 0, tries = 0;
  while (true) {
    try {
      const creds = await getValidCredentials();
      const referenceDataUrls = job.references?.length ? await readReferenceImages(job.references, path.dirname(jobsPath)) : [];
      const t0 = Date.now();
      const b64 = await generateImage(creds, { prompt: job.prompt, quality: job.quality ?? 'high', size: job.size ?? '1024x1024', referenceDataUrls });
      const bytes = Buffer.from(b64, 'base64');
      await mkdir(path.dirname(job.out), { recursive: true });
      await writeFile(job.out + '.partial', bytes); await rename(job.out + '.partial', job.out);
      const sha256 = createHash('sha256').update(bytes).digest('hex'), accepted = await passes(job);
      await appendFile(provenance, JSON.stringify({ id: job.id, out: path.relative(path.dirname(jobsPath), job.out).split(path.sep).join('/'), model: process.env.GPTIMAGE_MODEL, size: job.size ?? '1024x1024', quality: job.quality ?? 'high', references: job.references ?? [], prompt: job.prompt, sha256, accepted, seconds: Math.round((Date.now() - t0) / 1000), at: new Date().toISOString() }) + '\n');
      tries++;
      if (!accepted) { await reject(job, tries); rejected++; console.log(JSON.stringify({ id: job.id, rejected: tries })); if (tries < 3) continue; console.log(JSON.stringify({ id: job.id, ok: false, error: 'layout check failed 3 times' })); process.exitCode = 1; break; }
      done++; console.log(JSON.stringify({ id: job.id, ok: true, sha256: sha256.slice(0, 12) }));
      break;
    } catch (e) {
      const msg = String(e.message ?? e);
      if (/429|rate limited/i.test(msg) && attempt < 8) { const wait = 30000 * 2 ** attempt; console.log(JSON.stringify({ id: job.id, retryInSeconds: wait / 1000 })); await sleep(wait); attempt++; continue; }
      if (/ECONNRESET|fetch failed|ETIMEDOUT|terminated| 5\d\d /.test(msg) && attempt < 3) { await sleep(10000); attempt++; continue; }
      console.log(JSON.stringify({ id: job.id, ok: false, error: msg.slice(0, 300) })); process.exitCode = 1;
      console.log(JSON.stringify({ done, skipped, rejected, stoppedAt: job.id })); process.exit(1);
    }
  }
}
console.log(JSON.stringify({ done, skipped, rejected, total: jobs.length }));
