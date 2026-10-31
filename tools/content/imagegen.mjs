// Batch image generation for ZIN through the owner's gptimage library (ChatGPT plan, Codex backend).
//   GPTIMAGE_MODEL=<model> IMAGEGEN_CONCURRENCY=<n> node tools/content/imagegen.mjs <jobs.json>   (library: GPTIMAGE_LIB, lib/paths.mjs)
// jobs.json: [{ "id", "prompt", "out", "size"?, "quality"?, "references"?, "check"? }].
// A job whose output exists is skipped unless its `check` fails. `check` ({ expected, cols, rows, aspect,
// minAreaFraction }) requires the sheet to yield exactly `expected` items on its black background; a failing
// sheet moves to raw/rejected/ and is regenerated, up to three attempts. Every generated image is recorded
// (prompt, model, size, references, sha256, accepted) in <dir of jobs.json>/provenance.jsonl.
// IMAGEGEN_CONCURRENCY (default 1, at most 5) runs that many jobs at once inside this one process. The login's
// refresh token rotates on every refresh, and two processes refreshing the same token get the login revoked, so
// concurrency lives in one process with a single shared refresh, and a lock file keeps a second process out.
import { readFile, writeFile, appendFile, access, mkdir, rename, open, unlink } from 'node:fs/promises';
import { unlinkSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { findRegionsAdaptive } from './lib/sheets.mjs';
import { GPTIMAGE_LIB } from './lib/paths.mjs';
const LIB = pathToFileURL(GPTIMAGE_LIB + '/').href;
// Owner rule (24 October 2026): every picture is generated with gpt-6-luna; gpt-6-astra is never used.
process.env.GPTIMAGE_MODEL ??= 'gpt-6-luna';
if (/astra/iu.test(process.env.GPTIMAGE_MODEL)) throw new Error(`GPTIMAGE_MODEL ${process.env.GPTIMAGE_MODEL} is not allowed: the owner's image model is gpt-6-luna`);
const { getValidCredentials } = await import(LIB + 'auth.js');
const { generateImage } = await import(LIB + 'codex.js');
const { readReferenceImages } = await import(LIB + 'images.js');
const MAX_CONCURRENCY = 5;
const concurrency = Math.max(1, Math.min(MAX_CONCURRENCY, Number(process.env.IMAGEGEN_CONCURRENCY ?? 1) || 1));

// One imagegen process at a time on the route: a second process would refresh the same token and revoke the login.
const LOCK = path.join(GPTIMAGE_LIB, '..', '.imagegen.lock');
let lock;
try { lock = await open(LOCK, 'wx'); await lock.write(String(process.pid)); }
catch (e) {
  if (e.code !== 'EEXIST') throw e;
  const holder = Number(await readFile(LOCK, 'utf8').catch(() => '')) || 0;
  let alive = false; try { process.kill(holder, 0); alive = true; } catch {}
  if (alive) { console.log(JSON.stringify({ ok: false, error: `another imagegen process (pid ${holder}) holds the image route; run one at a time` })); process.exit(1); }
  await unlink(LOCK); lock = await open(LOCK, 'wx'); await lock.write(String(process.pid));
}
process.on('exit', () => { try { unlinkSync(LOCK); } catch {} });
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(130));

// Concurrent jobs share one credential lookup, so the token is refreshed once, never in parallel.
let pendingCreds = null;
const credentials = () => (pendingCreds ??= getValidCredentials().finally(() => { pendingCreds = null; }));

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

let done = 0, skipped = 0, rejected = 0, stoppedAt = null;
async function runJob(job) {
  if (await exists(job.out)) { if (await passes(job)) { skipped++; return; } await reject(job, 1); rejected++; }
  let attempt = 0, tries = 0;
  while (!stoppedAt) {
    try {
      const creds = await credentials();
      const referenceDataUrls = job.references?.length ? await readReferenceImages(job.references, path.dirname(jobsPath)) : [];
      const t0 = Date.now();
      const b64 = await generateImage(creds, { prompt: job.prompt, quality: job.quality ?? 'high', size: job.size ?? '1024x1024', referenceDataUrls });
      const bytes = Buffer.from(b64, 'base64');
      await mkdir(path.dirname(job.out), { recursive: true });
      await writeFile(job.out + '.partial', bytes); await rename(job.out + '.partial', job.out);
      const sha256 = createHash('sha256').update(bytes).digest('hex'), accepted = await passes(job);
      await appendFile(provenance, JSON.stringify({ id: job.id, out: path.relative(path.dirname(jobsPath), job.out).split(path.sep).join('/'), model: process.env.GPTIMAGE_MODEL, size: job.size ?? '1024x1024', quality: job.quality ?? 'high', references: job.references ?? [], prompt: job.prompt, sha256, accepted, seconds: Math.round((Date.now() - t0) / 1000), at: new Date().toISOString() }) + '\n');
      tries++;
      if (!accepted) { await reject(job, tries); rejected++; console.log(JSON.stringify({ id: job.id, rejected: tries })); if (tries < 3) continue; console.log(JSON.stringify({ id: job.id, ok: false, error: 'layout check failed 3 times' })); process.exitCode = 1; return; }
      done++; console.log(JSON.stringify({ id: job.id, ok: true, sha256: sha256.slice(0, 12) }));
      return;
    } catch (e) {
      const msg = String(e.message ?? e);
      if (/429|rate limited/i.test(msg) && attempt < 8) { const wait = 30000 * 2 ** attempt; console.log(JSON.stringify({ id: job.id, retryInSeconds: wait / 1000 })); await sleep(wait); attempt++; continue; }
      if (/ECONNRESET|fetch failed|ETIMEDOUT|terminated| 5\d\d /.test(msg) && attempt < 3) { await sleep(10000); attempt++; continue; }
      // Anything else (a revoked login, a refused prompt) stops the whole batch: the other workers finish nothing new.
      console.log(JSON.stringify({ id: job.id, ok: false, error: msg.slice(0, 300) })); process.exitCode = 1;
      stoppedAt ??= job.id;
      return;
    }
  }
}

let next = 0;
await Promise.all(Array.from({ length: concurrency }, async () => {
  while (!stoppedAt && next < jobs.length) await runJob(jobs[next++]);
}));
if (stoppedAt) { console.log(JSON.stringify({ done, skipped, rejected, stoppedAt })); process.exit(1); }
console.log(JSON.stringify({ done, skipped, rejected, total: jobs.length, concurrency }));
