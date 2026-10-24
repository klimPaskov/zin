// The three windows of the power mechanics (docs/specs/07_interface/01_interface.md sections 7 and 9): the Southern Dominion
// (Volgan), the Watch on the Passes (Mirolon) and the Narrow Strait (Lerendor). The elves' spec writes no window.
//
//   const r = await buildPowersUi(staged, { countries })
//
// Each window is one containerWindowType in interface/zin_mech_powers.gui with a scripted GUI in
// common/scripted_guis/zin_mech_powers.txt (names, flags and windows as the interface spec lists them: zin_panel_dominion /
// zin_dominion_window / zin_ui_dominion_open, zin_watch / zin_watch_window / zin_ui_watch_open, zin_strait / zin_strait_window /
// zin_ui_strait_open). A launcher button sits beside the Realm button until the interface module's Aoaz bar takes its place. The
// windows show; they decide nothing. Gauge positions are country variables that the mechanics' pulses compute
// (zin_dominion_ui_refresh_volgan, zin_dominion_ui_refresh_mirolon, zin_leren_ui_refresh). Every picture is an existing ZIN sprite or
// a catalog icon registered as a sprite in interface/zz_zin_mech_powers.gfx.
import { Loc, loadCatalogKeys } from '../lib/inst_util.mjs';
import { Panel, definedText } from '../lib/mp_gui.mjs';
import { HEADER, fmt, ge, le, lt, gt } from '../lib/mp_kit.mjs';

export async function buildPowersUi(staged, ctx) {
  const { countries } = ctx;
  const tag = n => { const c = countries.find(x => x.name === n); if (!c) throw new Error(`Powers UI: country ${n} is not in the roster`); return c.tag; };
  const catalog = new Set(await loadCatalogKeys());
  const loc = new Loc();
  const sprites = new Map();
  const reg = (name, art) => { if (!catalog.has(art)) throw new Error(`Powers UI: icon ${art} is not in the catalog`); sprites.set(name, art); return name; };
  const scriptedLoc = [];
  const words = (name, cases) => scriptedLoc.push(definedText(name, cases, loc));

  // ============================================================================================ the Southern Dominion
  const VOL = tag('Volgan'), MIR = tag('Mirolon'), LER = tag('Lerendor');
  const members = [['Demon', 'demon'], ['Dolon', 'dolon'], ['Nezer', 'nezer']].map(([n, k]) => [tag(n), n, k]);
  words('zin_dominion_hosts_word', [
    [ge('zin_dominion_strength', 85), 'ZIN_DOM_HOSTS_85', 'A host greater than the First Age saw.'],
    [ge('zin_dominion_strength', 70), 'ZIN_DOM_HOSTS_70', 'The Great Host: the march north may begin.'],
    [ge('zin_dominion_strength', 50), 'ZIN_DOM_HOSTS_50', 'The hosts are ready for war with Mirolon.'],
    [ge('zin_dominion_strength', 30), 'ZIN_DOM_HOSTS_30', 'The hosts stir; the second grave musters are open.'],
    [null, 'ZIN_DOM_HOSTS_0', 'The hosts are few and still sleeping.']], loc);
  words('zin_dominion_veil_word', [
    [ge('zin_volgan_veil', 70), 'ZIN_DOM_VEIL_0', 'Hidden: the storms keep the secret.'],
    [ge('zin_volgan_veil', 50), 'ZIN_DOM_VEIL_1', 'Rumoured: Mirolon, Herez and the free realms of the south have heard something.'],
    [ge('zin_volgan_veil', 30), 'ZIN_DOM_VEIL_2', 'Suspected: Mirolon\'s proof grows twice as fast.'],
    [null, 'ZIN_DOM_VEIL_3', 'Seen: every court knows the Ember Lands are arming.']], loc);
  words('zin_dominion_muster_word', [
    ['has_country_flag = zin_volgan_mustered', 'ZIN_DOM_MUSTER_YES', 'A muster was held within the month, and the veil will not mend yet.'],
    [null, 'ZIN_DOM_MUSTER_NO', 'No muster this month; the veil mends while the peace holds.']], loc);
  const oathWord = ([t, , k]) => words(`zin_dominion_oath_${k}`, [
    [`${t} = { ${lt('zin_dominion_oath', 25)} }`, `ZIN_DOM_OATH_${k.toUpperCase()}_LOW`, `§R[?${t}.zin_dominion_oath|0]§! (the oath falters)`],
    [`${t} = { ${lt('zin_dominion_oath', 45)} }`, `ZIN_DOM_OATH_${k.toUpperCase()}_WARN`, `§O[?${t}.zin_dominion_oath|0]§! (uneasy)`],
    [null, `ZIN_DOM_OATH_${k.toUpperCase()}_OK`, `§Y[?${t}.zin_dominion_oath|0]§!`]], loc);
  members.forEach(oathWord);
  const dom = new Panel({ prefix: 'zin_dominion', gui: 'zin_panel_dominion', window: 'zin_dominion_window', flag: 'zin_ui_dominion_open', title: 'The Southern Dominion', titleKey: 'ZIN_DOM_TITLE', launcher: 'The Dominion', launcherKey: 'ZIN_DOM_BUTTON',
    launcherTip: 'Open the hosts, the veil, the Nether and the oaths of the Southern Dominion.', visible: 'zin_is_volgan = yes', launcherVisible: 'zin_is_volgan = yes', refresh: 'zin_dominion_ui_refresh_volgan', w: 620, h: 520,
    tabs: [{ key: 'ZIN_DOM_TAB1', label: 'The Hosts' }, { key: 'ZIN_DOM_TAB2', label: 'The Sworn' }], markerSprite: reg('GFX_zin_dominion_marker', 'grave_host') });
  dom.text('hosts', 1, 40, 118, 540, 24, 'ZIN_DOM_T1_HOSTS', 'The Hosts: §Y[?ROOT.zin_dominion_strength|0]§! of 100. [ROOT.zin_dominion_hosts_word]');
  dom.gauge('hosts', 1, 156, 'zin_ui_hosts_x');
  dom.text('hostmarks', 1, 40, 164, 540, 20, 'ZIN_DOM_T1_HOSTMARKS', 'Marks at 30 (Stirring), 50 (Ready), 70 (the Great Host) and 85.', { font: 'small' });
  dom.text('veil', 1, 40, 200, 540, 24, 'ZIN_DOM_T1_VEIL', 'The Veil of Storms: §Y[?ROOT.zin_volgan_veil|0]§! of 100. [ROOT.zin_dominion_veil_word]');
  dom.gauge('veil', 1, 238, 'zin_ui_veil_x');
  dom.text('veilmarks', 1, 40, 246, 540, 20, 'ZIN_DOM_T1_VEILMARKS', 'Marks at 70, 50 and 30: each fall is told once to the world.', { font: 'small' });
  dom.text('nether', 1, 40, 282, 540, 24, 'ZIN_DOM_T1_NETHER', 'The Nether pact: §Y[?ROOT.zin_nether_pact|0]§! of 100.');
  dom.gauge('nether', 1, 320, 'zin_ui_nether_x');
  dom.text('nethermarks', 1, 40, 328, 540, 20, 'ZIN_DOM_T1_NETHERMARKS', 'At 40 the Netherborn come to your companies. At 70 the gate may be opened in war.', { font: 'small' });
  dom.text('musters', 1, 40, 366, 540, 48, 'ZIN_DOM_T1_MUSTERS', 'Grave musters held: §Y[?ROOT.zin_volgan_musters|0]§!. [ROOT.zin_dominion_muster_word]');
  dom.text('closed', 1, 40, 440, 540, 48, 'ZIN_DOM_T1_BROKEN', 'What remains of the Lord of the Ember Lands is not known.', { font: 'small', when: 'has_global_flag = zin_volgan_body_destroyed' });
  dom.text('sworn_head', 2, 40, 118, 540, 24, 'ZIN_DOM_T2_HEAD', 'The sworn realms and the strength of their oaths (0 to 100):');
  members.forEach(([t, n, k], i) => dom.text(`oath_${k}`, 2, 60, 156 + i * 34, 500, 24, `ZIN_DOM_T2_${k.toUpperCase()}`, `${n}: [ROOT.zin_dominion_oath_${k}]`));
  dom.text('oath_note', 2, 40, 262, 540, 40, 'ZIN_DOM_T2_NOTE', 'Below 25 a realm may seek its own road. Summon the Dominion to steady the oaths.', { font: 'small' });
  dom.text('dark_head', 2, 40, 314, 540, 24, 'ZIN_DOM_T2_DARK', 'The free holds of the Dark Lands and their pacts with Nafeher:');
  dom.text('dark_1', 2, 60, 352, 500, 24, 'ZIN_DOM_T2_DARK1', 'Envoys received: §Y[?ROOT.zin_ui_dark_1|0]§!');
  dom.text('dark_2', 2, 60, 384, 500, 24, 'ZIN_DOM_T2_DARK2', 'Pact of Spoils: §Y[?ROOT.zin_ui_dark_2|0]§!');
  dom.text('dark_3', 2, 60, 416, 500, 24, 'ZIN_DOM_T2_DARK3', 'Sworn to Nafeher: §Y[?ROOT.zin_ui_dark_3|0]§! (at most three)');

  // ============================================================================================ the Watch on the Passes
  words('zin_watch_south_word', [
    ['check_variable = { global.zin_volgan_veil_band = 3 }', 'ZIN_WATCH_SOUTH_3', 'Seen: the Ember Lands are plainly arming.'],
    ['check_variable = { global.zin_volgan_veil_band = 2 }', 'ZIN_WATCH_SOUTH_2', 'Suspected: signs are everywhere, though not yet proof for all.'],
    ['check_variable = { global.zin_volgan_veil_band = 1 }', 'ZIN_WATCH_SOUTH_1', 'Rumoured: whispers have crossed the passes.'],
    [null, 'ZIN_WATCH_SOUTH_0', 'Hidden: the south is quiet, or seems it.']], loc);
  for (const [k, flagName, label] of [['scout', 'zin_dominion_cd_scout', 'Send Scouts South'], ['word', 'zin_dominion_cd_word', 'Send Word to Parim'], ['forts', 'zin_dominion_cd_forts', 'Raise the Pass Forts']]) {
    words(`zin_watch_cd_${k}`, [[`has_country_flag = ${flagName}`, `ZIN_WATCH_CD_${k.toUpperCase()}_WAIT`, `${label}: §Owaiting§!`], [null, `ZIN_WATCH_CD_${k.toUpperCase()}_READY`, `${label}: §Gready§!`]], loc);
  }
  const watch = new Panel({ prefix: 'zin_watch', gui: 'zin_watch', window: 'zin_watch_window', flag: 'zin_ui_watch_open', title: 'The Watch on the Passes', titleKey: 'ZIN_WATCH_TITLE', launcher: 'The Watch', launcherKey: 'ZIN_WATCH_BUTTON',
    launcherTip: 'Open the scouts\' reports and the forts of the passes.', visible: 'zin_is_mirolon = yes', launcherVisible: 'zin_is_mirolon = yes', refresh: 'zin_dominion_ui_refresh_mirolon', w: 620, h: 500,
    tabs: [{ key: 'ZIN_WATCH_TAB1', label: 'The Passes' }], markerSprite: reg('GFX_zin_watch_marker', 'scout_lantern') });
  watch.text('proof', 1, 40, 118, 540, 24, 'ZIN_WATCH_PROOF', 'Proof: §Y[?ROOT.zin_mirolon_proof|0]§! of 100. Evidence that no court can laugh away.');
  watch.gauge('proof', 1, 156, 'zin_ui_proof_x');
  watch.text('proofmarks', 1, 40, 164, 540, 36, 'ZIN_WATCH_PROOFMARKS', 'At 25 the free realms hear of it. At 50 Parim\'s heeding grows likelier. At 75 the world cannot look away.', { font: 'small' });
  watch.text('passes', 1, 40, 214, 540, 24, 'ZIN_WATCH_PASSES', 'The passes: §Y[?ROOT.zin_mirolon_passes|0]§! of 100. Fort level §Y[?ROOT.zin_mirolon_fort_level|0]§! of 6.');
  watch.gauge('passes', 1, 252, 'zin_ui_passes_x');
  watch.text('passmarks', 1, 40, 260, 540, 36, 'ZIN_WATCH_PASSMARKS', 'Every twenty points raises one more level of stone in each pass. At 60 Mirolon cannot be caught unready; at 80, with proof, it holds.', { font: 'small' });
  watch.text('south', 1, 40, 312, 540, 24, 'ZIN_WATCH_SOUTH', 'The South: [ROOT.zin_watch_south_word]');
  watch.text('cd_head', 1, 40, 356, 540, 24, 'ZIN_WATCH_CDHEAD', 'The three orders of the Watch:');
  for (const [i, k] of ['scout', 'word', 'forts'].entries()) watch.text(`cd_${k}`, 1, 60, 388 + i * 30, 500, 24, `ZIN_WATCH_CD_${k.toUpperCase()}`, `[ROOT.zin_watch_cd_${k}]`);

  // ============================================================================================ the Narrow Strait
  words('zin_strait_band_word', [
    [ge('zin_strait_standing', 40), 'ZIN_STRAIT_BAND_TRUSTED', 'Trusted: the treaty is kept in good faith on both sides.'],
    [le('zin_strait_standing', -40), 'ZIN_STRAIT_BAND_BROKEN', 'Broken faith: the North feels bound by a treaty that serves only Parim.'],
    [null, 'ZIN_STRAIT_BAND_STRAINED', 'Strained: the usual state of the old alliance.']], loc);
  words('zin_strait_treaty_word', [
    ['has_global_flag = zin_leren_withdrawal', 'ZIN_STRAIT_TREATY_ENDED', 'Treaty ended: Lerendor withdrew in the year §Y[?global.zin_leren_withdrawal_year|0]§!. The standing is frozen.'],
    [null, 'ZIN_STRAIT_TREATY_FORCE', 'The Treaty of the Narrow Strait is in force.']], loc);
  words('zin_strait_route_word', [
    ['has_country_flag = zin_leren_route_honour', 'ZIN_STRAIT_ROUTE_HONOUR', 'Road chosen: Honour the Treaty.'],
    ['has_country_flag = zin_leren_route_break', 'ZIN_STRAIT_ROUTE_BREAK', 'Road chosen: The North Stands Apart.'],
    ['has_country_flag = zin_leren_route_supremacy', 'ZIN_STRAIT_ROUTE_SUPREMACY', 'Road chosen: Mastery of the Strait.'],
    [null, 'ZIN_STRAIT_ROUTE_NONE', 'No road chosen yet.']], loc);
  const dues = [['Free Passage', 'standing +0.3 a month'], ['The Treaty Toll', 'standing steady'], ['Leren Dues', 'standing -0.2 a month'], ['Full Strait Dues', 'standing -0.4 a month'], ['The Iron Toll', 'standing -0.6 a month; every northern crown loses lean']];
  dues.forEach(([n, d], i) => words(`zin_strait_due_${i}`, [[`check_variable = { zin_leren_toll_level = ${i} }`, `ZIN_STRAIT_DUE_${i}_ON`, `§Y> ${i}  ${n}§! (${d})`], [null, `ZIN_STRAIT_DUE_${i}_OFF`, `${i}  ${n} (${d})`]], loc));
  const leans = [['Eekedor', 'eekedor'], ['Sensai', 'sensai'], ['Molot', 'molot'], ["R'en", 'ren'], ['Mina', 'mina'], ['The Hold', 'hold']];
  leans.forEach(([n, k]) => { const t = tag(n); words(`zin_strait_lean_${k}`, [
    [`${t} = { ${ge('zin_leren_lean', 50)} }`, `ZIN_STRAIT_LEAN_${k.toUpperCase()}_1`, '§Gwith Sonargur§!'], [`${t} = { ${ge('zin_leren_lean', 15)} }`, `ZIN_STRAIT_LEAN_${k.toUpperCase()}_2`, 'leaning to Sonargur'],
    [`${t} = { ${gt('zin_leren_lean', -15)} }`, `ZIN_STRAIT_LEAN_${k.toUpperCase()}_3`, 'neither'], [`${t} = { ${gt('zin_leren_lean', -50)} }`, `ZIN_STRAIT_LEAN_${k.toUpperCase()}_4`, '§Oleaning to Parim§!'], [null, `ZIN_STRAIT_LEAN_${k.toUpperCase()}_5`, '§Rwith Parim§!']], loc); });
  const strait = new Panel({ prefix: 'zin_strait', gui: 'zin_strait', window: 'zin_strait_window', flag: 'zin_ui_strait_open', title: 'The Narrow Strait', titleKey: 'ZIN_STRAIT_TITLE', launcher: 'The Strait', launcherKey: 'ZIN_STRAIT_BUTTON',
    launcherTip: 'Open the treaty, the dues and the lead of Sonargur over the North.', visible: 'zin_is_lerendor = yes', launcherVisible: 'zin_is_lerendor = yes', refresh: 'zin_leren_ui_refresh', w: 620, h: 520,
    tabs: [{ key: 'ZIN_STRAIT_TAB1', label: 'The Treaty' }, { key: 'ZIN_STRAIT_TAB2', label: 'The Dues' }, { key: 'ZIN_STRAIT_TAB3', label: 'The North' }], markerSprite: reg('GFX_zin_strait_marker', 'strait_chain') });
  strait.text('standing', 1, 40, 118, 540, 24, 'ZIN_STRAIT_T1_STANDING', 'Strait standing: §Y[?ROOT.zin_strait_standing|0]§! (from -100, bitter, to 100, trusted).');
  strait.gauge('standing', 1, 156, 'zin_ui_standing_x');
  strait.text('standmarks', 1, 40, 164, 540, 20, 'ZIN_STRAIT_T1_MARKS', 'Marks at -40 (broken faith) and 40 (trusted).', { font: 'small' });
  strait.text('band', 1, 40, 200, 540, 40, 'ZIN_STRAIT_T1_BAND', '[ROOT.zin_strait_band_word]');
  strait.text('treaty', 1, 40, 252, 540, 40, 'ZIN_STRAIT_T1_TREATY', '[ROOT.zin_strait_treaty_word]');
  strait.text('route', 1, 40, 304, 540, 24, 'ZIN_STRAIT_T1_ROUTE', '[ROOT.zin_strait_route_word]');
  strait.text('torn', 1, 40, 350, 540, 48, 'ZIN_STRAIT_T1_QUESTION', 'The Question of the Strait may be asked after the Golden King dies, or from 4A 1751, or when the standing is at either extreme.', { font: 'small' });
  strait.text('dues_head', 2, 40, 118, 540, 24, 'ZIN_STRAIT_T2_HEAD', 'The dues at Sonargur (the current level is marked):');
  dues.forEach((_, i) => strait.text(`due_${i}`, 2, 60, 156 + i * 38, 500, 28, `ZIN_STRAIT_T2_DUE${i}`, `[ROOT.zin_strait_due_${i}]`));
  strait.text('dues_note', 2, 40, 360, 540, 60, 'ZIN_STRAIT_T2_NOTE', 'Level 3 needs Full Strait Dues, level 4 the Iron Toll. The higher dues fill the treasury and cost the treaty and the Compact.', { font: 'small' });
  strait.text('cohesion', 3, 40, 118, 540, 24, 'ZIN_STRAIT_T3_COHESION', 'Union of the two crowns: §Y[?ROOT.zin_leren_union_cohesion|0]§! of 100 (the Lerenwaith Question may rise at 25).');
  strait.gauge('cohesion', 3, 156, 'zin_ui_cohesion_x');
  strait.text('hegemony', 3, 40, 190, 540, 24, 'ZIN_STRAIT_T3_HEGEMONY', 'Lead over the North: §Y[?ROOT.zin_leren_hegemony|0]§! of 100. Northern crowns in the Compact: §Y[?ROOT.zin_ui_compact_members|0]§!.');
  strait.gauge('hegemony', 3, 228, 'zin_ui_hegemony_x');
  strait.text('hegmarks', 3, 40, 236, 540, 36, 'ZIN_STRAIT_T3_HEGMARKS', 'At 20 the Compact levies are full; at 40 mastery may be chosen; at 60 protection may be offered; at 80 the Leren Hegemony.', { font: 'small' });
  leans.forEach(([n, k], i) => strait.text(`lean_${k}`, 3, 60 + (i % 2) * 270, 290 + Math.floor(i / 2) * 36, 260, 28, `ZIN_STRAIT_T3_${k.toUpperCase()}`, `${n}: [ROOT.zin_strait_lean_${k}]`));

  // ============================================================================================ files
  const out = [dom, watch, strait].map(p => p.render());
  staged.text('interface/zin_mech_powers.gui', `${fmt(`guiTypes = {\n${out.map(o => o.gui).join('\n')}\n}`)}\n`);
  staged.text('common/scripted_guis/zin_mech_powers.txt', `${HEADER}\n${fmt(`scripted_gui = {\n${out.map(o => o.scripted).join('\n')}\n}`)}\n`);
  staged.text('common/scripted_localisation/zin_mech_powers.txt', `${HEADER}\n${scriptedLoc.join('\n\n')}\n`);
  for (const p of [dom, watch, strait]) for (const [k, v] of p.loc) loc.set(k, v);
  for (const [name, art] of [...dom.sprites, ...watch.sprites, ...strait.sprites]) sprites.set(name, art);
  staged.text('interface/zz_zin_mech_powers.gfx', `${HEADER}\n# Marker sprites of the three windows: each shows a picture of the icon catalog until the art pass draws its own.\nspriteTypes = {\n${[...sprites].sort(([a], [b]) => a.localeCompare(b, 'en')).map(([n, a]) => `\tspriteType = {\n\t\tname = "${n}"\n\t\ttexturefile = "gfx/interface/ideas/zin/${a}.dds"\n\t}`).join('\n')}\n}\n`);
  staged.add('localisation/english/zin_mech_powers_l_english.yml', loc.bytes());
  return { windows: out.length, locKeys: loc.size, sprites: sprites.size, tags: { VOL, MIR, LER } };
}
