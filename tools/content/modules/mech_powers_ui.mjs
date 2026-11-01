// The three windows of the power mechanics (docs/specs/07_interface/01_interface.md sections 7 and 9): the Southern Dominion
// (Volgan), the Watch on the Passes (Mirolon) and the Narrow Strait (Lerendor). The elves' spec writes no window.
//
//   const r = await buildPowersUi(staged, { countries })
//
// Each window is one containerWindowType in interface/zin_mech_powers.gui with a scripted GUI in
// common/scripted_guis/zin_mech_powers.txt (names, flags and windows as the interface spec lists them: zin_panel_dominion /
// zin_dominion_window / zin_ui_dominion_open, zin_watch / zin_watch_window / zin_ui_watch_open, zin_strait / zin_strait_window /
// zin_ui_strait_open). They are Chancery panels of the shared layout (lib/mech_court_gui.mjs, design system sections 3 and 6.4):
// header picture, accent strip, tabs, one primary value per tab, meters with the mechanics' marks, a tooltip on every value. A
// launcher button sits beside the Realm button until the Aoaz bar takes its place. The windows show; they decide nothing. Meter fills
// are country variables that the mechanics' pulses compute (zin_dominion_ui_refresh_volgan, zin_dominion_ui_refresh_mirolon,
// zin_leren_ui_refresh).
import { Loc } from '../lib/inst_util.mjs';
import { Panel, definedText, LAYOUT, FONT, sub } from '../lib/mech_court_gui.mjs';
import { format } from '../lib/mech_court_lib.mjs';
import { HEADER, ge, le, lt, gt } from '../lib/mp_kit.mjs';

// The marks of each meter: the band edges the mechanics' triggers use (volgan_southern_dominion.md, lerendor_narrow_strait.md).
const MARKS = { hosts: [30, 50, 70, 85], veil: [30, 50, 70], nether: [40, 70], proof: [25, 50, 75], passes: [20, 40, 60, 80], standing: [-40, 40], cohesion: [25], hegemony: [20, 40, 60, 80] };

// A second text in the row of a text the panel placed (two columns), with its tooltip and tab gate.
function textBoxAt(p, name, x, y, key, value, tip, tab) {
  const id = p.id(name);
  p.loc.set(key, value); p.loc.set(sub(key, '_tt'), tip); p.gate(id, tab);
  return ['instantTextBoxType = {', `name = "${id}"`, `position = { x = ${x} y = ${y} }`, `font = "${FONT.mid}"`, `text = "${key}"`, `maxWidth = ${LAYOUT.cw / 2 - 8}`, 'maxHeight = 24', 'format = left', 'fixedsize = yes', `pdx_tooltip = "${sub(key, '_tt')}"`, '}'].join('\n');
}

export async function buildPowersUi(staged, ctx) {
  const { countries } = ctx;
  const tag = n => { const c = countries.find(x => x.name === n); if (!c) throw new Error(`Powers UI: country ${n} is not in the roster`); return c.tag; };
  const loc = new Loc();
  const scriptedLoc = [];
  const words = (name, cases) => scriptedLoc.push(format(definedText(name, cases, loc)));

  // ============================================================================================ the Southern Dominion
  const VOL = tag('Puvulan'), MIR = tag('Mirolon'), LER = tag('Lerendor');
  const members = [['Khorvrath', 'demon'], ['Dolon', 'dolon'], ['Nezer', 'nezer']].map(([n, k]) => [tag(n), n, k]);
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
  // The header picture: the broken-host variant once the Lord of the Ember Lands has lost his body (spec 01 section 7). The scripted
  // localisation returns the sprite name; the window's property image reads it.
  scriptedLoc.push(format(['defined_text = {', 'name = zin_dominion_header', 'text = {', 'trigger = {', 'has_global_flag = zin_volgan_body_destroyed', '}', 'localization_key = GFX_zin_header_dominion_broken', '}', 'text = { localization_key = GFX_zin_header_dominion }', '}'].join('\n')));
  const dom = new Panel({ prefix: 'zin_dominion', gui: 'zin_panel_dominion', window: 'zin_dominion_window', flag: 'zin_ui_dominion_open', bar: 'dominion',title: 'The Southern Dominion', titleKey: 'ZIN_DOM_TITLE', launcher: 'The Dominion', launcherKey: 'ZIN_DOM_BUTTON',
    launcherTip: 'Open the hosts, the veil, the Nether and the oaths of the Southern Dominion.', visible: 'zin_is_volgan = yes', launcherVisible: 'zin_is_volgan = yes', refresh: 'zin_dominion_ui_refresh_volgan',
    accent: 'GFX_zin_accent_dominion', header: 'GFX_zin_header_dominion', headerImage: 'zin_dominion_header',
    tabs: [{ key: 'ZIN_DOM_TAB1', label: 'The Hosts', tip: 'The hosts, the Veil of Storms, the Nether pact and the musters.' }, { key: 'ZIN_DOM_TAB2', label: 'The Sworn', tip: 'The sworn realms and the free holds of the Dark Lands.' }] });
  dom.primary('hosts', 1, 'ZIN_DOM_T1_HOSTS', 'The Hosts: §Y[?ROOT.zin_dominion_strength|0]§! of 100. [ROOT.zin_dominion_hosts_word]', 'Marks at 30 (Stirring), 50 (Ready), 70 (the Great Host) and 85.', { fill: 'zin_ui_hosts_fill', marks: MARKS.hosts });
  dom.gauge('veil', 1, 'ZIN_DOM_T1_VEIL', 'The Veil of Storms: §Y[?ROOT.zin_volgan_veil|0]§! of 100. [ROOT.zin_dominion_veil_word]', 'Marks at 70, 50 and 30: each fall is told once to the world.', { fill: 'zin_ui_veil_fill', marks: MARKS.veil });
  dom.space(1, 4);
  dom.gauge('nether', 1, 'ZIN_DOM_T1_NETHER', 'The Nether pact: §Y[?ROOT.zin_nether_pact|0]§! of 100', 'At 40 the Netherborn come to your companies. At 70 the gate may be opened in war.', { fill: 'zin_ui_nether_fill', marks: MARKS.nether });
  dom.space(1, 4);
  dom.text('musters', 1, 'ZIN_DOM_T1_MUSTERS', 'Grave musters held: §Y[?ROOT.zin_volgan_musters|0]§!. [ROOT.zin_dominion_muster_word]', { lines: 2, tip: 'A grave muster raises the hosts and keeps the Veil of Storms from mending for a month.', gap: LAYOUT.gap });
  dom.text('closed', 1, 'ZIN_DOM_T1_BROKEN', 'What remains of the Lord of the Ember Lands is not known.', { font: 'small', when: 'has_global_flag = zin_volgan_body_destroyed' });
  dom.primary('sworn_head', 2, 'ZIN_DOM_T2_HEAD', 'The sworn realms', 'The strength of each oath, from 0 to 100. Below 25 a realm may seek its own road. Summon the Dominion to steady the oaths.');
  members.forEach(([, n, k]) => dom.text(`oath_${k}`, 2, `ZIN_DOM_T2_${k.toUpperCase()}`, `${n}: [ROOT.zin_dominion_oath_${k}]`, { tip: `The strength of ${n}'s oath to the Dominion.` }));
  dom.space(2, 8);
  dom.text('oath_note', 2, 'ZIN_DOM_T2_NOTE', 'Below 25 a realm may seek its own road. Summon the Dominion to steady the oaths.', { font: 'small', lines: 2, gap: LAYOUT.gap });
  dom.text('dark_head', 2, 'ZIN_DOM_T2_DARK', 'The free holds of the Dark Lands and their pacts with Nafeher', { font: 'small', gap: 4 });
  dom.text('dark_1', 2, 'ZIN_DOM_T2_DARK1', 'Envoys received: §Y[?ROOT.zin_ui_dark_1|0]§!', { tip: 'Holds of the Dark Lands that have received the envoys of Nafeher.' });
  dom.text('dark_2', 2, 'ZIN_DOM_T2_DARK2', 'Pact of Spoils: §Y[?ROOT.zin_ui_dark_2|0]§!', { tip: 'Holds bound by the Pact of Spoils.' });
  dom.text('dark_3', 2, 'ZIN_DOM_T2_DARK3', 'Sworn to Nafeher: §Y[?ROOT.zin_ui_dark_3|0]§! (at most three)', { tip: 'Holds sworn to Nafeher. No more than three may swear.' });

  // ============================================================================================ the Watch on the Passes
  words('zin_watch_south_word', [
    ['check_variable = { global.zin_volgan_veil_band = 3 }', 'ZIN_WATCH_SOUTH_3', 'Seen: the Ember Lands are plainly arming.'],
    ['check_variable = { global.zin_volgan_veil_band = 2 }', 'ZIN_WATCH_SOUTH_2', 'Suspected: signs are everywhere, though not yet proof for all.'],
    ['check_variable = { global.zin_volgan_veil_band = 1 }', 'ZIN_WATCH_SOUTH_1', 'Rumoured: whispers have crossed the passes.'],
    [null, 'ZIN_WATCH_SOUTH_0', 'Hidden: the south is quiet, or seems it.']], loc);
  for (const [k, flagName, label] of [['scout', 'zin_dominion_cd_scout', 'Send Scouts South'], ['word', 'zin_dominion_cd_word', 'Send Word to Parim'], ['forts', 'zin_dominion_cd_forts', 'Raise the Pass Forts']]) {
    words(`zin_watch_cd_${k}`, [[`has_country_flag = ${flagName}`, `ZIN_WATCH_CD_${k.toUpperCase()}_WAIT`, `${label}: §Owaiting§!`], [null, `ZIN_WATCH_CD_${k.toUpperCase()}_READY`, `${label}: §Gready§!`]], loc);
  }
  const watch = new Panel({ prefix: 'zin_watch', gui: 'zin_watch', window: 'zin_watch_window', flag: 'zin_ui_watch_open', bar: 'watch',title: 'The Watch on the Passes', titleKey: 'ZIN_WATCH_TITLE', launcher: 'The Watch', launcherKey: 'ZIN_WATCH_BUTTON',
    launcherTip: 'Open the scouts\' reports and the forts of the passes.', visible: 'zin_is_mirolon = yes', launcherVisible: 'zin_is_mirolon = yes', refresh: 'zin_dominion_ui_refresh_mirolon',
    accent: 'GFX_zin_accent_watch', header: 'GFX_zin_header_watch', tabs: [{ key: 'ZIN_WATCH_TAB1', label: 'The Passes' }] });
  watch.primary('proof', 1, 'ZIN_WATCH_PROOF', 'Proof: §Y[?ROOT.zin_mirolon_proof|0]§! of 100. Evidence that no court can laugh away.', 'At 25 the free realms hear of it. At 50 Parim\'s heeding grows likelier. At 75 the world cannot look away.', { fill: 'zin_ui_proof_fill', marks: MARKS.proof });
  watch.gauge('passes', 1, 'ZIN_WATCH_PASSES', 'The passes: §Y[?ROOT.zin_mirolon_passes|0]§! of 100. Fort level §Y[?ROOT.zin_mirolon_fort_level|0]§! of 6.', 'Every twenty points raises one more level of stone in each pass. At 60 Mirolon cannot be caught unready; at 80, with proof, it holds.', { fill: 'zin_ui_passes_fill', marks: MARKS.passes });
  watch.space(1, 4);
  watch.text('south', 1, 'ZIN_WATCH_SOUTH', 'The South: [ROOT.zin_watch_south_word]', { lines: 2, tip: 'What the scouts can tell of the Ember Lands beyond the passes.', gap: LAYOUT.gap });
  watch.text('cd_head', 1, 'ZIN_WATCH_CDHEAD', 'The three orders of the Watch', { font: 'small', gap: 4 });
  for (const k of ['scout', 'word', 'forts']) watch.text(`cd_${k}`, 1, `ZIN_WATCH_CD_${k.toUpperCase()}`, `[ROOT.zin_watch_cd_${k}]`, { tip: 'An order of the Watch is ready, or waits until its last use has passed.' });

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
  dues.forEach(([n, d], i) => words(`zin_strait_due_${i}`, [[`check_variable = { zin_leren_toll_level = ${i} }`, `ZIN_STRAIT_DUE_${i}_ON`, `§Y> ${i}  ${n}§! (${d})`], [null, `ZIN_STRAIT_DUE_${i}_OFF`, `§g${i}  ${n} (${d})§!`]], loc));
  const leans = [['Eekedor', 'eekedor'], ['Tolvael', 'tolvael'], ['Molot', 'molot'], ["R'en", 'ren'], ['Mina', 'mina'], ['Dolpar', 'hold']];
  leans.forEach(([n, k]) => { const t = tag(n); words(`zin_strait_lean_${k}`, [
    [`${t} = { ${ge('zin_leren_lean', 50)} }`, `ZIN_STRAIT_LEAN_${k.toUpperCase()}_1`, '§Gwith Sonargur§!'], [`${t} = { ${ge('zin_leren_lean', 15)} }`, `ZIN_STRAIT_LEAN_${k.toUpperCase()}_2`, 'leaning to Sonargur'],
    [`${t} = { ${gt('zin_leren_lean', -15)} }`, `ZIN_STRAIT_LEAN_${k.toUpperCase()}_3`, 'neither'], [`${t} = { ${gt('zin_leren_lean', -50)} }`, `ZIN_STRAIT_LEAN_${k.toUpperCase()}_4`, '§Oleaning to Parim§!'], [null, `ZIN_STRAIT_LEAN_${k.toUpperCase()}_5`, '§Rwith Parim§!']], loc); });
  const strait = new Panel({ prefix: 'zin_strait', gui: 'zin_strait', window: 'zin_strait_window', flag: 'zin_ui_strait_open', bar: 'strait',title: 'The Narrow Strait', titleKey: 'ZIN_STRAIT_TITLE', launcher: 'The Strait', launcherKey: 'ZIN_STRAIT_BUTTON',
    launcherTip: 'Open the treaty, the dues and the lead of Sonargur over the North.', visible: 'zin_is_lerendor = yes', launcherVisible: 'zin_is_lerendor = yes', refresh: 'zin_leren_ui_refresh',
    accent: 'GFX_zin_accent_strait', header: 'GFX_zin_header_strait',
    tabs: [{ key: 'ZIN_STRAIT_TAB1', label: 'The Treaty', tip: 'The standing of the treaty and the road chosen.' }, { key: 'ZIN_STRAIT_TAB2', label: 'The Dues', tip: 'The dues taken at Sonargur.' }, { key: 'ZIN_STRAIT_TAB3', label: 'The North', tip: 'The union of the two crowns and the lead over the North.' }] });
  strait.primary('standing', 1, 'ZIN_STRAIT_T1_STANDING', 'Strait standing: §Y[?ROOT.zin_strait_standing|0]§!', 'From -100, bitter, to 100, trusted. Marks at -40 (broken faith) and 40 (trusted).', { fill: 'zin_ui_standing_fill', marks: MARKS.standing, scale: 'signed' });
  strait.text('band', 1, 'ZIN_STRAIT_T1_BAND', '[ROOT.zin_strait_band_word]', { lines: 2, tip: 'How each side of the strait reads the old alliance.', gap: LAYOUT.gap });
  strait.text('treaty', 1, 'ZIN_STRAIT_T1_TREATY', '[ROOT.zin_strait_treaty_word]', { lines: 2, tip: 'Whether the Treaty of the Narrow Strait is in force.', gap: LAYOUT.gap });
  strait.text('route', 1, 'ZIN_STRAIT_T1_ROUTE', '[ROOT.zin_strait_route_word]', { tip: 'The road Lerendor has chosen on the question of the strait.', gap: LAYOUT.gap });
  strait.text('torn', 1, 'ZIN_STRAIT_T1_QUESTION', 'The Question of the Strait may be asked after the Golden King dies, or from 4A 1751, or when the standing is at either extreme.', { font: 'small', lines: 3 });
  strait.primary('dues_head', 2, 'ZIN_STRAIT_T2_HEAD', 'The dues at Sonargur', 'The current level is marked. Higher dues fill the treasury and cost the treaty and the Compact.');
  dues.forEach((_, i) => strait.text(`due_${i}`, 2, `ZIN_STRAIT_T2_DUE${i}`, `[ROOT.zin_strait_due_${i}]`, { tip: 'One level of the dues and the monthly change to the standing it brings.', gap: 8 }));
  strait.space(2, 4);
  strait.text('dues_note', 2, 'ZIN_STRAIT_T2_NOTE', 'Level 3 needs Full Strait Dues, level 4 the Iron Toll. The higher dues fill the treasury and cost the treaty and the Compact.', { font: 'small', lines: 2 });
  strait.primary('cohesion', 3, 'ZIN_STRAIT_T3_COHESION', 'Union of the two crowns: §Y[?ROOT.zin_leren_union_cohesion|0]§! of 100', 'Lerendor\'s North Question may rise at 25.', { fill: 'zin_ui_cohesion_fill', marks: MARKS.cohesion });
  strait.gauge('hegemony', 3, 'ZIN_STRAIT_T3_HEGEMONY', 'Lead over the North: §Y[?ROOT.zin_leren_hegemony|0]§! of 100. Compact crowns: §Y[?ROOT.zin_ui_compact_members|0]§!', 'At 20 the Compact levies are full; at 40 mastery may be chosen; at 60 protection may be offered; at 80 the Leren Hegemony.', { fill: 'zin_ui_hegemony_fill', marks: MARKS.hegemony });
  strait.space(3, 4);
  strait.text('lean_head', 3, 'ZIN_STRAIT_T3_LEANS', 'Where the northern crowns lean', { font: 'small', gap: 4 });
  for (let r = 0; r < leans.length; r += 2) {
    const [n0, k0] = leans[r];
    const y = strait.text(`lean_${k0}`, 3, `ZIN_STRAIT_T3_${k0.toUpperCase()}`, `${n0}: [ROOT.zin_strait_lean_${k0}]`, { w: LAYOUT.cw / 2 - 8, tip: `Whether ${n0} leans to Sonargur or to Parim.`, gap: 4 });
    if (leans[r + 1]) { const [n, k] = leans[r + 1]; strait.els.push(textBoxAt(strait, `lean_${k}`, LAYOUT.x + LAYOUT.cw / 2, y, `ZIN_STRAIT_T3_${k.toUpperCase()}`, `${n}: [ROOT.zin_strait_lean_${k}]`, `Whether ${n} leans to Sonargur or to Parim.`, 3)); }
  }

  // ============================================================================================ files
  const out = [dom, watch, strait].map(p => p.render());
  staged.text('interface/zin_mech_powers.gui', `guiTypes = {\n${out.map(o => o.gui).join('\n')}\n}\n`);
  staged.text('common/scripted_guis/zin_mech_powers.txt', `${HEADER}\n${format(`scripted_gui = {\n${out.map(o => o.scripted).join('\n')}\n}`)}\n`);
  staged.text('common/scripted_localisation/zin_mech_powers.txt', `${HEADER}\n${scriptedLoc.join('\n\n')}\n`);
  for (const p of [dom, watch, strait]) for (const [k, v] of p.loc) loc.set(k, v);
  staged.add('localisation/english/zin_mech_powers_l_english.yml', loc.bytes());
  return { windows: out.length, locKeys: loc.size, sprites: 0, tags: { VOL, MIR, LER } };
}
