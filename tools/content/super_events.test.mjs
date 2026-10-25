// Tests for the super events of K52 (docs/specs/06_events/06_super_events.md): modules/super_events.mjs and data/super_events.json.
// Run: node --test tools/content/super_events.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { Staged } from './lib/core.mjs';
import { parse, scriptText } from './lib/clausewitz.mjs';
import { ZIN, stagingDir } from './lib/paths.mjs';
import { buildSuperEvents, hookSuperEvents, replaceNews, loadSuperEvents, validate, layout, FILES, sprite, song, effect, doneFlag, pictureFile, locEntries } from './modules/super_events.mjs';

const data = await loadSuperEvents();
const staged = new Staged();
const built = await buildSuperEvents(staged, { data });
const text = rel => { assert(staged.files.has(rel), `${rel} is staged`); return staged.files.get(rel).toString('utf8'); };
const block = (t, name) => { const i = t.indexOf(`\n${name} = {`); assert(i >= 0, name); let d = 0; for (let k = t.indexOf('{', i); k < t.length; k++) { if (t[k] === '{') d++; else if (t[k] === '}') { d--; if (!d) return t.slice(i, k + 1); } } return ''; };
const EV = data.events;
const read = rel => readFileSync(path.join(ZIN, rel), 'utf8');

test('The data registers the great moments with stable ids (live and retired together 1..n), unique keys and unique hook flags', () => {
  assert(EV.length >= 15 && EV.length <= 40, `${EV.length} super events`);
  assert(EV.some(e => e.hook === 'zin_volgan_withdrawn_south'), 'K59: the annexation of Volgan\'s realm with his body intact is a super event');
  for (const h of ['zin_horos_dead', 'zin_mirolon_fallen', 'zin_eastern_invasion', 'zin_black_compact', 'zin_eindil_cast_down', 'zin_eindil_lost']) assert(EV.some(e => e.hook === h), `K60: ${h} is a super event`);
  assert(!EV.some(e => e.hook === 'zin_eindil_awake') && data.retired.some(r => r.id === 1), 'K60, K61: the waking is not a super event, and its id stays retired');
  const all = [...EV.map(e => e.id), ...data.retired.map(r => r.id)].sort((a, b) => a - b);
  assert.deepEqual(all, all.map((_, i) => i + 1));
  assert.equal(new Set(EV.map(e => e.key)).size, EV.length);
  assert.equal(new Set(EV.map(e => e.hook)).size, EV.length);
  assert.doesNotThrow(() => validate(data));
  const bad = structuredClone(data); bad.events[1].id = 7;
  assert.throws(() => validate(bad), /ids/);
  const noAudience = structuredClone(data); noAudience.events[0].audience = 'nowhere';
  assert.throws(() => validate(noAudience), /audience nowhere/);
  const quoted = structuredClone(data); quoted.events[0].quote = 'He said "no".';
  assert.throws(() => validate(quoted), /quotation mark/);
  assert.equal(built.counts.superEvents, EV.length);
});

test('The module writes every file of the package; scripts parse, have balanced braces and no <= or >=; the text has its BOM', () => {
  for (const rel of Object.values(FILES)) assert(staged.files.has(rel), rel);
  for (const [rel, bytes] of staged.files) {
    if (rel.endsWith('.yml')) { assert.deepEqual([...bytes.subarray(0, 3)], [0xef, 0xbb, 0xbf], rel); continue; }
    const t = bytes.toString('utf8').replace(/#.*$/gm, '').replace(/"[^"]*"/g, '""');
    assert.equal((t.match(/\{/g) ?? []).length, (t.match(/\}/g) ?? []).length, `${rel}: braces`);
    assert(!/<=|>=/.test(t), `${rel}: <= or >=`);
    if (rel.endsWith('.txt') || rel.endsWith('.gfx') || rel.endsWith('.asset')) assert.doesNotThrow(() => parse(scriptText(bytes)), rel);
  }
});

test('Each super event is shown once per game to the human players of its audience (K61), with minor reports for their neighbours, and is queued while another is open', () => {
  const t = text(FILES.effects), tr = text(FILES.triggers), ev = text(FILES.events);
  const WORLD = ['golden_king_dead', 'deliverer_crowned', 'last_crowns', 'volgan_marches', 'name_of_the_deliverer', 'king_of_the_east', 'parim_taken', 'volgan_broken', 'kusven_forth', 'lorien_falls', 'afrit_dead', 'nafeher_falls'];
  for (const k of WORLD) assert.equal(EV.find(e => e.key === k).audience, 'world', `${k} is world news`);
  for (const e of EV.filter(x => x.key.startsWith('ending_'))) assert.equal(e.audience, 'world', `${e.key}: the endings are world news`);
  assert.equal(EV.find(e => e.hook === 'zin_eindil_named').audience, 'heir_named', 'K61: the naming is told only to the realm that holds the heir and to Lorien\'s');
  assert.match(data.audiences.heir_named.trigger, /zin_eindil_is_host = yes/);
  assert.match(data.audiences.heir_named.trigger, /original_tag = GAA/);
  for (const e of EV) {
    const b = block(t, effect(e));
    assert(b.includes(`NOT = { has_global_flag = ${doneFlag(e)} }`) && b.includes(`set_global_flag = ${doneFlag(e)}`), `${e.key}: once per game`);
    assert(b.includes(`is_ai = no\n\t\t\t\tzin_se_audience_${e.audience} = yes`) && b.includes(`set_temp_variable = { zin_arg_super_event = ${e.id} }`) && b.includes('zin_super_event_open = yes'), `${e.key}: its own id to its own audience`);
    assert(tr.includes(`zin_se_audience_${e.audience} = {`), `${e.key}: audience trigger`);
    if (e.report) {
      assert(b.includes(`any_neighbor_country = { zin_se_audience_${e.audience} = yes }`) && b.includes(`country_event = { id = zin_super_event.${100 + e.id} }`), `${e.key}: report to the neighbours`);
      assert(ev.includes(`id = zin_super_event.${100 + e.id}`) && ev.includes(`picture = ${e.report.picture}`), `${e.key}: report event`);
    }
    for (const n of e.news ?? []) assert(b.includes(`set_country_flag = zin_se_saw_${e.key}`) && b.includes(`zin_se_news_${n.replace('.', '_')} = yes`), `${e.key}: replaces ${n}`);
  }
  assert(!t.includes('zin_super_event_fire'), 'no audience-blind fire');
  const open = block(t, 'zin_super_event_open');
  assert(open.includes('has_country_flag = zin_se_open') && open.includes('add_to_array = { array = zin_se_queue'), 'queued while open');
  const close = block(t, 'zin_super_event_close');
  assert(close.includes('clr_country_flag = zin_se_open') && close.includes('zin_se_queue^0') && close.includes('remove_from_array = { array = zin_se_queue index = 0 }'), 'the next queued id follows');
});

test('Every id has its title, description, quote, button and picture in the scripted localisation, its sprite and its song', () => {
  const sl = text(FILES.sloc), gfx = text(FILES.gfx), music = text(FILES.music), play = block(text(FILES.effects), 'zin_super_event_play');
  const loc = locEntries(data);
  for (const name of ['title', 'desc', 'quote', 'button', 'picture']) {
    const b = sl.slice(sl.indexOf(`name = zin_loc_super_event_${name}`));
    for (const e of EV) assert(b.includes(`check_variable = { zin_se_id = ${e.id} }`), `${name} ${e.id}`);
  }
  for (const e of EV) {
    for (const f of ['t', 'd', 'q', 'a']) assert(loc[`zin_se_${e.key}_${f}`], `${e.key}_${f}`);
    assert(loc[`zin_se_${e.key}_q`].endsWith(`\n- ${e.attribution}`), `${e.key}: attribution line`);
    assert(sl.includes(`localization_key = "${sprite(e)}"`), `${e.key}: picture key`);
    assert(gfx.includes(`name = "${sprite(e)}"`) && gfx.includes(`texturefile = "${pictureFile(data, e)}"`), `${e.key}: sprite`);
    assert(!/GFX_zin_frame|placeholder|fallback/i.test(gfx.slice(gfx.indexOf(sprite(e)), gfx.indexOf(sprite(e)) + 200)), `${e.key}: no frame fallback`);
    assert(music.includes(`name = "${song(e)}"`) && music.includes(`file = "zin_se_${e.key}.ogg"`), `${e.key}: song`);
    assert(play.includes(`check_variable = { zin_se_id = ${e.id} }`) && play.includes(`scoped_play_song = "${song(e)}"`), `${e.key}: played`);
  }
  assert(play.includes('NOT = { has_country_flag = zin_se_music_off }'), 'the player can silence the music');
});

test('The window is wired to its scripted GUI: visibility, dynamic picture, continue and music buttons with exclusive states', () => {
  const gui = text(FILES.gui), sg = text(FILES.sgui);
  assert(gui.includes('name = "zin_super_event_window"') && sg.includes('window_name = "zin_super_event_window"'));
  assert(sg.includes('context_type = player_context') && sg.includes('has_country_flag = zin_se_open') && sg.includes('dirty = zin_se_dirty'));
  assert(sg.includes('image = "[zin_loc_super_event_picture]"') && gui.includes('name = "zin_se_picture"'));
  for (const b of ['zin_se_close', 'zin_se_music_on', 'zin_se_music_off']) { assert(gui.includes(`name = "${b}"`), b); assert(sg.includes(`${b}_click = {`), `${b} click`); }
  assert(sg.includes('zin_se_music_on_visible = {\n\t\t\t\tNOT = { has_country_flag = zin_se_music_off }') && sg.includes('zin_se_music_off_visible = {\n\t\t\t\thas_country_flag = zin_se_music_off'), 'exclusive music buttons');
  assert(gui.includes('size = { width = 100%% height = 100%% }'), 'full-screen backdrop');
  const L = layout(data), P = data.window.panel;
  for (const [k, b] of Object.entries(L)) if (b && typeof b.x === 'number' && k !== 'panel') {
    assert(b.x >= 0 && b.y >= 0, `${k} inside the panel`);
    if (b.w) assert(b.x + b.w <= P.width, `${k} right edge`);
    if (b.h) assert(b.y + b.h <= P.height, `${k} bottom edge`);
  }
  assert(L.close.y + 34 <= P.height - 12 && L.music.y + 30 <= P.height - 8, 'buttons clear the bottom border');
  assert(L.quote.y > L.ruleMid.y && L.ruleMid.y > L.desc.y + L.desc.h - 1 - 12, 'description, rule and quote in order');
  assert(P.height <= 700 && P.width <= 1240, 'the panel fits a 1280 x 720 screen');
});

test('The voice and the knowledge layers: no sealed name, no ungated secret, no quoted forbidden voice', () => {
  const all = e => [e.title, ...e.desc, e.quote, e.attribution, e.button].join('\n');
  const revealAt = EV.find(e => e.hook === 'zin_afrit_revealed').id, namedAt = EV.find(e => e.hook === 'zin_eindil_named').id;
  const forthAt = EV.find(e => e.hook === 'zin_kusven_forth').id;
  for (const e of EV) {
    const t = all(e);
    assert(!/\b(Edvoid|Einendil|Erdu|Dunda|Holy Seven|Vez'?nan|Erdae)\b/i.test(t), `${e.key}: sealed or retired name`);
    // Kusven is a known legend from the start (K55, Q-70); the super events name him only once he has come forth, as the war events do.
    if (e.id < forthAt) assert(!/\bKusven\b/.test(t), `${e.key}: Kusven before he comes forth`);
    assert(!/\bZol\b(?! ?'s Mistake)/.test(t.replace(/Old God of Death/g, '')), `${e.key}: Zol is named only in Zol's Mistake`);
    // Before the reveal the Deliverer's true name is gated (A1): only the label zin_loc_deliverer may carry it.
    if (e.id < revealAt && e.hook !== 'zin_ending_ashen_throne') assert(!/\bAfrit\b|\bHidden Council\b/.test(t), `${e.key}: Afrit before the reveal`);
    // Before Lorien names him the heir is only the Man from the Ice (D4, E1).
    if (e.id < namedAt) assert(!/\bEindil\b/.test(t), `${e.key}: Eindil before the naming`);
    assert(!/^\s*(Zol|Kusven|the Deliverer|Horos|Eindil|Volgan)\b/i.test(e.attribution) || /song of the wardens|last song of the wardens/i.test(e.attribution), `${e.key}: a forbidden voice is quoted`);
    assert(!/\b(thee|thou|thy|hath|doth|forsooth|verily)\b/i.test(t), `${e.key}: archaic grammar`);
    assert(!/\b\d{2,}\s+(years|winters)\s+(old|of age)\b/i.test(t), `${e.key}: an exact age`);
    assert(!/\bOcean\b/.test(t), `${e.key}: no Ocean names`);
  }
  // Volgan is heard only through Mirolon's songs.
  for (const e of EV.filter(x => /Volgan/.test(x.attribution))) assert.fail(`${e.key}: Volgan quoted directly`);
});

test('The spec, the pending-art list, the baseline and the art and audio briefs name every super event', () => {
  const spec = read('docs/specs/06_events/06_super_events.md');
  for (const e of EV) for (const s of [e.title, e.button, e.quote, e.hook, `${e.id}`]) assert(spec.includes(s), `spec: ${e.key} ${s.slice(0, 40)}`);
  const pending = read('docs/plans/zin-art/pending_from_integration.md');
  const baseline = JSON.parse(read('docs/design/validation/asset_baseline.json')).findings.map(f => f.key);
  for (const e of EV) {
    assert(pending.includes(sprite(e)) && pending.includes(pictureFile(data, e)), `pending art: ${e.key}`);
    assert(pending.includes(`music/zin_se_${e.key}.ogg`), `pending audio: ${e.key}`);
    assert(baseline.includes(`SPRITE_TEXTURE_MISSING|${FILES.gfx}|${sprite(e)}:${pictureFile(data, e)}`), `baseline picture: ${e.key}`);
    // The asset check does not read the mod's own music/*.asset files, so a pending song is recorded only in the pending list (row SA<id>).
    assert(pending.includes(`| SA${String(e.id).padStart(2, '0')} | Song ${song(e)}:`), `pending song row: ${e.key}`);
    assert(pending.includes(`| SE${String(e.id).padStart(2, '0')} | ${sprite(e)}:`), `pending picture row: ${e.key}`);
  }
  const art = JSON.parse(read('docs/plans/super_events/art_briefs.json')), audio = JSON.parse(read('docs/plans/super_events/audio_briefs.json'));
  assert.deepEqual(art.briefs.map(b => b.key), EV.map(e => e.key));
  assert.deepEqual(audio.briefs.map(b => b.key), EV.map(e => e.key));
  for (const b of art.briefs) assert(b.size === `${data.window.picture.width}x${data.window.picture.height}` && b.brief.length > 80 && b.sprite && b.file, `art brief ${b.key}`);
  for (const b of audio.briefs) assert(b.mood && b.length && b.instruments && /licen[cs]e/i.test(b.licence) && b.song && b.file, `audio brief ${b.key}`);
});

test('The hook pass calls the super event right after the flag is set, ignores other flags and stops on a flag nothing sets', () => {
  const s = new Staged();
  const files = Object.fromEntries(EV.map((e, i) => [`common/scripted_effects/test_${i}.txt`, `test_${i} = {\n\tif = {\n\t\tset_global_flag = ${e.hook}\n\t\tset_global_flag = ${e.hook}_other\n\t}\n}\n`]));
  for (const [rel, t] of Object.entries(files)) s.text(rel, t);
  const noNews = structuredClone(data); for (const e of noNews.events) delete e.news;
  s.text(FILES.effects, '# effects\n');
  const sites = hookSuperEvents(s, noNews);
  for (const [i, e] of EV.entries()) {
    const t = s.files.get(`common/scripted_effects/test_${i}.txt`).toString('utf8');
    assert(t.includes(`\t\tset_global_flag = ${e.hook}\n\t\t${effect(e)} = yes`), `${e.key}: call after the setter`);
    assert.equal((t.match(new RegExp(`${effect(e)} = yes`, 'g')) ?? []).length, 1, `${e.key}: once`);
    assert.equal(sites[e.key].length, 1);
  }
  const lone = new Staged(); lone.text('common/scripted_effects/x.txt', 'x = { set_global_flag = something_else }\n');
  assert.throws(() => hookSuperEvents(lone, noNews), /no staged file sets/);
});

test('A replaced news event keeps its logic: hidden from the players who saw the super event, its immediate block and first visible option run for them (K60)', () => {
  const e = EV.find(x => (x.news ?? []).length), id = e.news[0];
  const news = `add_namespace = test\nnews_event = {\n\tid = ${id}\n\ttitle = ${id}.t\n\tmajor = yes\n\tis_triggered_only = yes\n\ttimeout_days = 30\n\timmediate = {\n\t\tset_global_flag = test_once\n\t}\n\toption = {\n\t\tname = ${id}.a\n\t\ttrigger = { tag = AEN }\n\t\tai_chance = { base = 1 }\n\t\tadd_stability = 0.05\n\t}\n\toption = {\n\t\tname = ${id}.b\n\t\tadd_war_support = 0.02\n\t}\n}\n`;
  const one = { ...data, events: [{ ...e, news: [id] }] };
  const s = new Staged(); s.text('events/test.txt', news); s.text(FILES.effects, '# effects\n');
  assert.equal(replaceNews(s, one), 1);
  const ev = s.files.get('events/test.txt').toString('utf8'), eff = s.files.get(FILES.effects).toString('utf8');
  assert(ev.includes(`is_triggered_only = yes\n\ttrigger = { NOT = { has_country_flag = zin_se_saw_${e.key} } }`), 'the news event skips the players who saw the super event');
  const b = block(eff, `zin_se_news_${id.replace('.', '_')}`);
  assert(b.includes('set_global_flag = test_once') && b.includes('limit = { tag = AEN }') && b.includes('add_stability = 0.05') && b.includes('else = {') && b.includes('add_war_support = 0.02'), b);
  assert(!/ai_chance|name =/.test(b), 'only effects are copied');
  assert.doesNotThrow(() => parse(scriptText(Buffer.from(eff))));
  const bad = new Staged(); bad.text('events/test.txt', news.replace('add_war_support = 0.02', 'FROM = { add_war_support = 0.02 }')); bad.text(FILES.effects, '');
  assert.throws(() => replaceNews(bad, one), /ROOT or FROM/);
});

const STAGED = stagingDir(process.env.ZIN_STAGED);
test('In the built tree every hook flag is set and followed by its super event, and nothing else calls it', { skip: existsSync(path.join(STAGED, FILES.effects)) ? false : 'no staged tree (run the build first)' }, () => {
  const files = [];
  const walk = (d, rel = '') => { for (const n of readdirSync(d)) { const f = path.join(d, n), r = rel ? `${rel}/${n}` : n; if (statSync(f).isDirectory()) walk(f, r); else if (/\.txt$/.test(n)) files.push([r, readFileSync(f, 'utf8')]); } };
  for (const top of ['common', 'events']) walk(path.join(STAGED, top), top);
  for (const e of EV) {
    const calls = files.flatMap(([r, t]) => [...t.matchAll(new RegExp(`^([ \\t]*)${effect(e)} = yes`, 'gm'))].map(m => ({ r, i: m.index, t })));
    assert(calls.length >= 1, `${e.key}: called`);
    for (const c of calls) {
      const before = c.t.slice(0, c.i).trimEnd().split('\n').pop();
      assert.match(before, new RegExp(`set_global_flag = ${e.hook}\\b`), `${e.key}: the call in ${c.r} follows its hook flag`);
    }
  }
});
