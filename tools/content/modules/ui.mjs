// The Realm panel: a themed window opened from a button under the top bar. It shows the country's people,
// alignment and stance now, and is the frame later mechanic panels (Aenor's court, Afrit's footholds, Volgan's
// dominion) are built in. All art is image-generated (modules/art.mjs); code only arranges it.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dds, fromRaw } from '../lib/raster.mjs';
import { strip } from '../lib/fit.mjs';   // strip assembly (copies generated pixels side by side) lives in lib/fit.mjs
import { PEOPLES } from './peoples.mjs';
import { IDEOLOGIES } from './ideologies.mjs';
import { rawFile, provenanceFile } from '../lib/paths.mjs';
import { runFit } from '../lib/fit.mjs';
import { acceptance } from './presentation.mjs';
import { readSheetCells } from './ui_reskin.mjs';
import { Panel, LAYOUT, missingBarOpenings } from '../lib/mech_court_gui.mjs';
import { format } from '../lib/mech_court_lib.mjs';

export const PEOPLE_ORDER = Object.keys(PEOPLES);

const sprite = (name, file, extra = '') => `\tspriteType = {\n\t\tname = "${name}"\n\t\ttexturefile = "${file}"${extra}\n\t}`;

export function buildUi(staged, art) {
  staged.add('gfx/interface/zin/people_strip.dds', dds(strip(PEOPLE_ORDER.map(k => art.emblems.get(k)))));
  staged.text('interface/zin_ui.gfx', `spriteTypes = {
${chromeSprites(staged, art.chrome)}
${sprite('GFX_zin_people_strip', 'gfx/interface/zin/people_strip.dds', `\n\t\tnoOfFrames = ${PEOPLE_ORDER.length}`)}
}
`);
  staged.text('interface/zz_zin_textcolors.gfx', textColoursGfx());
  // The Realm panel (W7, design system sections 3 and 6.4): a Chancery panel of the shared layout (lib/mech_court_gui.mjs). The Aoaz bar
  // carries the Realm button once it is built (spec 01 section 2); until then the old button window stays (launcher zin_realm_button).
  const realm = realmPanel();
  const realmOut = realm.render();
  // The mechanic panels write no launcher of their own (option `bar`): the built Aoaz bar must open every one of them.
  const unreachable = missingBarOpenings(staged.files.get('common/scripted_guis/zin_aoaz_bar.txt')?.toString('utf8'));
  if (unreachable.length) throw new Error(`ZIN panels with no way to open them (the Aoaz bar is not built or has no button for them): ${unreachable.join(', ')}`);
  staged.text('interface/zin_realm.gui', `guiTypes = {
${realmOut.gui}
}
`);
  staged.text('common/scripted_guis/zin_realm.txt', `scripted_gui = {
${format(realmOut.scripted)}
}
`);
  // Scripted localisation: people and stance text follow the country's flags and ruling stance.
  const people = PEOPLE_ORDER.map(k => `\t\ttext = { trigger = { has_country_flag = zin_people_${k} } localization_key = zin_people_${k} }`).join('\n');
  const peopleDesc = PEOPLE_ORDER.map(k => `\t\ttext = { trigger = { has_country_flag = zin_people_${k} } localization_key = zin_people_${k}_desc }`).join('\n');
  const stances = Object.values(IDEOLOGIES).flatMap(d => Object.keys(d.stances));
  const stance = stances.map(s => `\t\ttext = { trigger = { has_country_leader_ideology = ${s} } localization_key = ${s} }`).join('\n');
  const stanceDesc = stances.map(s => `\t\ttext = { trigger = { has_country_leader_ideology = ${s} } localization_key = ${s}_desc }`).join('\n');
  const align = Object.keys(IDEOLOGIES).map(id => `\t\ttext = { trigger = { has_government = ${id} } localization_key = ZIN_ALIGNMENT_${id} }`).join('\n');
  staged.text('common/scripted_localisation/zin_realm.txt', [['zin_people_name', people, 'zin_people_men'], ['zin_people_text', peopleDesc, 'zin_people_men_desc'], ['zin_stance_name', stance, 'ZIN_UNKNOWN'], ['zin_stance_text', stanceDesc, 'ZIN_UNKNOWN'], ['zin_alignment_name', align, 'ZIN_UNKNOWN']]
    .map(([name, body, fallback]) => `defined_text = {\n\tname = ${name}\n${body.replace(/^\t\t/gm, '\t')}\n\ttext = { localization_key = ${fallback} }\n}`).join('\n'));
  const loc = { ...Object.fromEntries(realm.loc), ZIN_UNKNOWN: 'Unknown' };
  for (const [id, d] of Object.entries(IDEOLOGIES)) loc[`ZIN_ALIGNMENT_${id}`] = d.name;
  staged.loc('zin_ui', loc);
  // Startup sets each country's emblem frame (1-based) to match its people, and fills the Aoaz bar's counts for the human players.
  return [...PEOPLE_ORDER.map((k, i) => `\t\t\tevery_country = { limit = { has_country_flag = zin_people_${k} } set_variable = { zin_people_frame = ${i + 1} } }`), ...(AOAZ_STARTUP ? [AOAZ_STARTUP] : [])].join('\n');
}

// ---------------------------------------------------------------------------------------------------- the Realm panel (lane W7)
// Every country's own overview (spec 01 section 3): its people and their emblem, alignment and rule, and the age. The window keeps its
// names (zin_realm_window, scripted GUI zin_realm, flag zin_realm_open); the button window zin_realm_button_window and its scripted GUI
// zin_realm_button stay until the Aoaz bar is built (AOAZ_BUILT), which then carries the Realm button.
function realmPanel() {
  const p = new Panel({ prefix: 'zin_realm', gui: 'zin_realm', window: 'zin_realm_window', flag: 'zin_realm_open', title: 'The Realm of [ROOT.GetName]', titleKey: 'ZIN_REALM_TITLE', header: 'GFX_zin_header_realm', h: 504,
    launcher: 'Realm', launcherKey: 'ZIN_REALM_BUTTON', launcherTipKey: 'ZIN_REALM_BUTTON_TT', launcherTip: 'Open or close the overview of your realm.', launcherGui: 'zin_realm_button', launcherWindow: 'zin_realm_button_window', launcherButton: 'zin_realm_toggle', launcherPos: [8, 88], toggle: true, noLauncher: AOAZ_BUILT,
    visible: 'always = yes', launcherVisible: 'always = yes', tabs: [{ key: 'ZIN_REALM_TAB', label: 'The Realm' }] });
  const EMBLEM = 64, tx = LAYOUT.x + EMBLEM + 16;
  const y = p.text('people', 1, 'ZIN_REALM_PEOPLE', 'People: §Y[ROOT.zin_people_name]§!', { font: 'section', x: tx, w: LAYOUT.cw - EMBLEM - 16, tip: 'The people of this realm. Every people of Aoaz has its own ways, strengths and old quarrels.', gap: 4 });
  p.icon('people_icon', 1, LAYOUT.x, y, 'GFX_zin_people_strip', { tip: 'The emblem of the people of this realm.' });
  p.props.set('zin_realm_people_icon', { frame: 'zin_people_frame' });
  p.text('people_desc', 1, 'ZIN_REALM_PEOPLE_DESC', '[ROOT.zin_people_text]', { font: 'small', lines: 3, x: tx, w: LAYOUT.cw - EMBLEM - 16, gap: LAYOUT.gap * 2 });
  p.text('alignment', 1, 'ZIN_REALM_ALIGNMENT', 'Alignment: §Y[ROOT.zin_alignment_name]§!', { tip: 'The side of the old struggle this realm stands on: the Light, the Dominion, the Shadow or the Wild.' });
  p.text('stance', 1, 'ZIN_REALM_STANCE', 'Rule: §Y[ROOT.zin_stance_name]§! under [ROOT.GetLeader]', { tip: 'How the realm is ruled, and by whom.' });
  p.text('stance_desc', 1, 'ZIN_REALM_STANCE_DESC', '[ROOT.zin_stance_text]', { font: 'small', lines: 3, gap: LAYOUT.gap * 2 });
  p.text('footer', 1, 'ZIN_REALM_FOOTER', 'Fourth Age of Aoaz, in the reign of the Golden King.', { font: 'small', fmt: 'centre' });
  return p;
}

// ---------------------------------------------------------------------------------------------------- ZIN frame sprites (lane C3)
// The design-system cells of ZIN's own windows (lib/zin_chrome.mjs, data/ui/zin_chrome.json): a window frame per theme (GFX_zin_frame is
// the Chancery one), the neutral button, a divider per theme, three-frame tabs per theme, the two-frame list row, the meter family per
// theme (groove, fill, threshold mark), the 4 px accent strips of the mechanics, and one designed "unknown" icon per family. The unknown
// icons are placeholders listed in design_system.json placeholderTextures: check 11 reports every sprite that still draws one.
function chromeSprites(staged, chrome) {
  const out = [], written = new Set();
  for (const s of chrome.sprites) {
    if (!written.has(s.texture)) { staged.add(s.texture, dds(fromRaw(s.img.data, s.img.w, s.img.h))); written.add(s.texture); }
    if (s.kind === 'frame') out.push(`\tcorneredTileSpriteType = {\n\t\tname = "${s.name}"\n\t\tsize = { x = ${s.size[0]} y = ${s.size[1]} }\n\t\ttexturefile = "${s.texture}"\n\t\tborderSize = { x = ${s.border} y = ${s.border} }\n\t\ttilingCenter = no\n\t}`);
    else out.push(sprite(s.name, s.texture, `${s.frames > 1 ? `\n\t\tnoOfFrames = ${s.frames}` : ''}${s.button ? '\n\t\teffectFile = "gfx/FX/buttonstate.lua"' : ''}`));
  }
  return out.join('\n');
}

// ---------------------------------------------------------------------------------------------------- text colours (lane C2)
// interface/zz_zin_textcolors.gfx (design system §1.6 and §2.1, spec 02 §3.4 and §3.7), from data/ui/textcolors.json: an additive
// bitmapfonts block with the global text colours mapped to the design-system tokens, the light-on-dark faces redefined with the same
// tokens in their own textcolors blocks (a face's own block overrides the global one), and the typewriter faces drawing Garamond glyphs.
// Additive because the owner declined a patched core.gfx (spec 02 §3.4); the engine evidence and precedents are in
// docs/plans/ui_overhaul/handoffs/C2.md (several vanilla interface/*.gfx files open their own bitmapfonts block).
const TEXTCOLORS = JSON.parse(readFileSync(fileURLToPath(new URL('../data/ui/textcolors.json', import.meta.url)), 'utf8'));
const DESIGN = JSON.parse(readFileSync(fileURLToPath(new URL('../data/ui/design_system.json', import.meta.url)), 'utf8'));
export function tokenRgb(ref, design = DESIGN) {
  if (ref && typeof ref === 'object' && Array.isArray(ref.vanilla)) return ref.vanilla;
  const m = /^([a-z_]+)\.(.+)$/.exec(String(ref));
  const hexOf = m && (m[1] === 'semantic' ? design.semantic?.[m[2]] : design.themes?.[m[1]]?.tokens?.[m[2]]?.hex);
  if (!/^#[0-9a-f]{6}$/i.test(hexOf ?? '')) throw new Error(`textcolors.json: ${JSON.stringify(ref)} names no colour token of design_system.json`);
  return [1, 3, 5].map(i => parseInt(hexOf.slice(i, i + 2), 16));
}
export function textColoursGfx(tc = TEXTCOLORS, design = DESIGN) {
  const block = (codes, indent) => Object.entries(codes).map(([k, ref]) => `${indent}${k} = { ${tokenRgb(ref, design).join(' ')} }`).join('\n');
  const font = f => {
    const codes = f.textcolors ?? Object.fromEntries(f.codes.map(c => [c, tc.fontColours.codes[c]]));
    const files = f.path ? `\t\tpath = "${f.path}"` : `\t\tfontfiles = {\n${f.fontfiles.map(p => `\t\t\t"${p}"`).join('\n')}\n\t\t}`;
    // a plain white face draws in the body token (text.primary); any other installed colour stays
    const base = f.color.toLowerCase() === '0xffffffff' && tc.fontColours.baseColour ? `0xff${tokenRgb(tc.fontColours.baseColour, design).map(v => v.toString(16).padStart(2, '0')).join('')}` : f.color;
    return `\tbitmapfont = {\n\t\tname = "${f.name}"\n${files}\n${f.cursor_offset ? `\t\tcursor_offset = { ${f.cursor_offset.join(' ')} }\n` : ''}\t\tcolor = ${base}\n\t\ttextcolors = {\n${block(codes, '\t\t\t')}\n\t\t}\n\t}`;
  };
  return ['# Generated by the ZIN content builder (tools/content/modules/ui.mjs, data/ui/textcolors.json). Do not edit by hand.',
    '# Text colours of the interface design system (docs/specs/07_interface/07_design_system.md §1.6) and the typewriter faces drawn in Garamond (§2.1).',
    'bitmapfonts = {', '\ttextcolors = {', block(tc.global.codes, '\t\t'), '\t}',
    '\t# Light-on-dark faces: their own textcolors blocks override the global block, so they carry the same tokens.',
    ...tc.fontColours.fonts.map(font),
    '\t# The typewriter faces draw the installed Garamond glyphs of the nearest size.',
    ...tc.aliases.fonts.map(font), '}', ''].join('\n');
}

// ---------------------------------------------------------------------------------------------------- the Aoaz bar (lane W1)
// The strip under the flag (docs/specs/07_interface/01_interface.md section 2; design system section 6.4, Banner Hall): the Realm
// button, the age, the Gathering Dark and up to three meters of the viewing country, and a sigil button that opens that country's
// mechanic panel. Each country shows the meters of the first row of AOAZ_ROWS whose trigger it meets; a row, a meter or a panel whose
// scripted trigger, effect or text no built module defines is left out (and named in the build log), so nothing undefined is loaded.
// Art: three Banner Hall sheets and the map-mode cells of data/ui/sheets/icons-topbar-values.json (art/aoaz-bar-jobs.mjs, gpt-6-luna),
// the bar frame cut from the accepted Banner Hall chrome sheet. Writes interface/zin_aoaz_bar.gui and .gfx, interface/zin_mapmodes.gfx,
// common/scripted_guis/zin_aoaz_bar.txt, common/scripted_triggers/zin_aoaz_bar.txt, common/scripted_effects/zin_aoaz_bar.txt,
// common/scripted_localisation/zin_aoaz_bar.txt and localisation/english/zin_aoaz_bar_l_english.yml. It runs before the story module, so
// the monthly interface refresh (data/story_ai.json uiRefresh) finds zin_aoaz_bar_refresh; on_startup runs it for every human player.
const AOAZ_FILE = fileURLToPath(new URL('../data/ui/aoaz_bar.json', import.meta.url));
const readData = rel => JSON.parse(readFileSync(fileURLToPath(new URL(`../data/${rel}`, import.meta.url)), 'utf8'));
let AOAZ_STARTUP = '', AOAZ_BUILT = false;

// The thresholds come from the mechanics' own data, so the bar's colours move with them.
function aoazNumbers() {
  const A = readData('mech_aenor.json').rates, Dk = readData('mech_regions_dark.json').numbers, W = readData('world_tension.json');
  return { gilded: A.gildedAt, honest: A.honestAt, dominant: A.dominantAt, courted: Dk.sway_band_courted, pressed: Dk.sway_band_pressed,
    loyalty: { steadfast: 75, loyal: 50, restless: 25 }, tiers: W.tiers, sources: W.sources };
}

const ge = (v, n) => `NOT = { check_variable = { ${v} < ${n} } }`;
const gflag = f => `has_global_flag = ${f}`;
const nogflag = f => `NOT = { has_global_flag = ${f} }`;
// A value text: cases [trigger, colour code]; the last case has no trigger.
const coloured = (expr, cases) => cases.map(([t, c]) => [t, `§${c}${expr}§!`]);

/** The meters: id, icon cell, label, the scripted-loc cases of the value, the tooltip, and the triggers, effects and texts it needs. */
export function aoazMeters(n = aoazNumbers()) {
  const L = n.loyalty;
  const v = (scope, name) => `[?${scope}.${name}|0]`;
  return {
    court_gold: { icon: 'm_court_gold', label: 'The Golden Court', needs: { triggers: ['zin_aenor_court_gilded'] },
      value: coloured(v('ROOT', 'zin_court_corruption'), [['zin_aenor_court_gilded = yes', 'R'], [null, 'Y']]),
      tip: `How much of the court's business is bought: §Y${v('ROOT', 'zin_court_corruption')}§! of 100.\nFrom ${n.gilded} the court is the Gilded Rot; at ${n.honest} or less it is an honest court.` },
    temple_favour: { icon: 'm_temple_favour', label: 'Temple Favour', when: 'NOT = { has_country_flag = zin_aenor_hidden_hand_seen }',
      value: coloured(v('ROOT', 'zin_council_influence'), [[ge('zin_council_influence', n.dominant), 'O'], [null, 'Y']]),
      tip: `How many offices are held by friends of the temples: §Y${v('ROOT', 'zin_council_influence')}§! of 100.\nFrom ${n.dominant} the temples hold the offices.` },
    hidden_hand: { icon: 'm_hidden_hand', label: 'The Hidden Hand', when: 'has_country_flag = zin_aenor_hidden_hand_seen',
      value: coloured(v('ROOT', 'zin_council_influence'), [[ge('zin_council_influence', n.dominant), 'R'], [null, 'O']]),
      tip: `The offices held by one will behind the temples: §Y${v('ROOT', 'zin_council_influence')}§! of 100.\nFrom ${n.dominant} that will holds the offices.` },
    concord: { icon: 'm_concord', label: 'The Concord', needs: { effects: ['zin_aenor_ui_refresh'] },
      value: [[ge('zin_aenor_concord_avg', L.steadfast), '§YSteadfast§!'], [ge('zin_aenor_concord_avg', L.loyal), '§YLoyal§!'], [ge('zin_aenor_concord_avg', L.restless), '§ORestless§!'], [null, '§RDefiant§!']],
      tip: `The mean loyalty of the dominions: §Y${v('ROOT', 'zin_aenor_concord_avg')}§!.\nSteadfast from ${L.steadfast}, loyal from ${L.loyal}, restless from ${L.restless}, defiant below.` },
    ruling_camp: { icon: 'm_ruling_camp', label: 'The Seals', needs: { triggers: ['zin_aenor_ruled_by_court', 'zin_aenor_ruled_by_faithful', 'zin_aenor_ruled_by_dominions', 'zin_aenor_ruled_by_host'] },
      value: [['zin_aenor_ruled_by_court = yes', '§YThe Regency§!'], ['zin_aenor_ruled_by_faithful = yes', '§YThe Temples§!'], ['zin_aenor_ruled_by_dominions = yes', '§YThe Concord§!'], ['zin_aenor_ruled_by_host = yes', '§YThe Host§!'], [null, '§OContested§!']],
      tip: 'The camp that holds the seals of the realm since the Golden King died. A camp that reaches 30 rises in arms if it does not hold them.' },
    veil: { icon: 'm_veil', label: 'The Veil', hub: true, when: nogflag('zin_afrit_revealed'),
      value: coloured(v('global', 'zin_afrit_veil'), [['check_variable = { global.zin_afrit_veil < 30 }', 'O'], [null, 'Y']]),
      tip: `How well the Houses keep their master hidden: §Y${v('global', 'zin_afrit_veil')}§! of 100. Last month: ${v('global', 'zin_afrit_veil_last_change')}.\nBelow 30 the courts of the Light begin to watch the Houses. At 0 the name is spoken.` },
    faithful: { icon: 'm_faithful', label: 'The Faithful', hub: true, when: gflag('zin_afrit_revealed'),
      value: [[null, `§Y${v('ROOT', 'zin_aoaz_faithful')}§!`]],
      tip: `Realms where the Houses stand at their full depth: §Y${v('ROOT', 'zin_aoaz_faithful')}§!.` },
    plot: { icon: 'm_plot', label: 'The Plot', hub: true, when: nogflag('zin_golden_king_dead'),
      value: coloured(v('global', 'zin_afrit_regicide_plot'), [[null, 'Y']]),
      tip: `How far the King's end is prepared: §Y${v('global', 'zin_afrit_regicide_plot')}§! of 100.` },
    artifacts: { icon: 'm_artifacts', label: 'The Relics', hub: true, when: gflag('zin_golden_king_dead'),
      value: [[null, `§Y${v('global', 'zin_afrit_artifacts')}§!/4`]],
      tip: `Relics held by the Council: §Y${v('global', 'zin_afrit_artifacts')}§! of 4.` },
    houses: { icon: 'm_houses', label: 'The Houses', hub: true,
      value: [[null, `§Y${v('ROOT', 'zin_aoaz_houses')}§!`]],
      tip: `Realms where a House of the First Light serves at depth two or more: §Y${v('ROOT', 'zin_aoaz_houses')}§!.\nThe map mode "Houses of the First Light" shows every house by depth.` },
    hosts: { icon: 'm_hosts', label: 'The Hosts', value: coloured(v('ROOT', 'zin_dominion_strength'), [[null, 'Y']]),
      tip: `The strength of the hosts of the Southern Dominion: §Y${v('ROOT', 'zin_dominion_strength')}§! of 100.` },
    storm_veil: { icon: 'm_storm_veil', label: 'The Veil of Storms',
      value: coloured(v('ROOT', 'zin_volgan_veil'), [['check_variable = { global.zin_volgan_veil_band > 2 }', 'R'], ['check_variable = { global.zin_volgan_veil_band > 1 }', 'O'], [null, 'Y']]),
      tip: `How well the storms hide the South from its neighbours: §Y${v('ROOT', 'zin_volgan_veil')}§! of 100.\nThe North sees it as [ROOT.zin_aoaz_south_band].` },
    nether_pact: { icon: 'm_nether_pact', label: 'The Nether Pact', value: coloured(v('ROOT', 'zin_nether_pact'), [[null, 'Y']]),
      tip: `How deep the pact with the Nether runs: §Y${v('ROOT', 'zin_nether_pact')}§! of 100.` },
    proof: { icon: 'm_proof', label: 'Proof', value: coloured(v('ROOT', 'zin_mirolon_proof'), [[null, 'Y']]),
      tip: `How much of the South's danger Mirolon can prove to the other courts: §Y${v('ROOT', 'zin_mirolon_proof')}§! of 100.` },
    passes: { icon: 'm_passes', label: 'The Passes', value: coloured(v('ROOT', 'zin_mirolon_passes'), [[null, 'Y']]),
      tip: `How well the forts and scouts hold the passes: §Y${v('ROOT', 'zin_mirolon_passes')}§! of 100.` },
    the_south: { icon: 'm_the_south', label: 'The South', value: [[null, '[ROOT.zin_aoaz_south_band]']],
      tip: 'What the scouts can see of the South beyond the storms: [ROOT.zin_aoaz_south_band].\nHidden, Rumoured, Suspected, Seen.' },
    presence: { icon: 'm_presence', label: 'The Presence',
      value: [['check_variable = { zin_mistake_power < 25 }', '§YFaint§!'], ['check_variable = { zin_mistake_power < 50 }', '§YStirring§!'], ['check_variable = { zin_mistake_power < 75 }', '§OWaking§!'], [null, '§RGathered§!']],
      tip: `How much of his presence can act in Aoaz: §Y${v('ROOT', 'zin_mistake_power')}§!.\nFaint below 25, stirring below 50, waking below 75, then gathered.` },
    service: { icon: 'm_service', label: 'Service', value: [[null, `§Y${v('ROOT', 'zin_aoaz_service')}§!/15`]],
      tip: `The bonds of those who serve, together: §Y${v('ROOT', 'zin_aoaz_service')}§! of 15.` },
    isles: { icon: 'm_isles', label: 'The Isles', when: nogflag('zin_zol_rising'), value: coloured(v('ROOT', 'zin_zol_islands_stirring'), [[null, 'Y']]),
      tip: `The isles that stir: §Y${v('ROOT', 'zin_zol_islands_stirring')}§!.` },
    convergence: { icon: 'm_convergence', label: 'The Convergence', when: gflag('zin_zol_rising'), value: coloured(v('ROOT', 'zin_zol_convergence'), [[null, 'Y']]),
      tip: `How near the Convergence is: §Y${v('ROOT', 'zin_zol_convergence')}§! of 100.` },
    strait: { icon: 'm_strait', label: 'The Strait',
      value: coloured(v('ROOT', 'zin_strait_standing'), [[ge('zin_strait_standing', 40), 'Y'], ['check_variable = { zin_strait_standing < -39 }', 'R'], [null, 'O']]),
      tip: `The standing of the Treaty of the Narrow Strait: §Y${v('ROOT', 'zin_strait_standing')}§!, from -100 to 100.\nTrusted from 40, broken faith at -40 or below, strained between.` },
    dues: { icon: 'm_dues', label: 'The Dues',
      value: [[ 'check_variable = { zin_leren_toll_level = 0 }', '§YFree§!'], ['check_variable = { zin_leren_toll_level = 1 }', '§YTreaty Toll§!'], ['check_variable = { zin_leren_toll_level = 2 }', '§OLeren Dues§!'], ['check_variable = { zin_leren_toll_level = 3 }', '§OFull Dues§!'], [null, '§RIron Toll§!']],
      tip: `The dues Lerendor takes at the Strait (level §Y${v('ROOT', 'zin_leren_toll_level')}§! of 4). Higher dues fill the treasury and cost the treaty its standing.` },
    hegemony: { icon: 'm_hegemony', label: 'Hegemony', value: coloured(v('ROOT', 'zin_leren_hegemony'), [[null, 'Y']]),
      tip: `The lead of Sonargur over the North: §Y${v('ROOT', 'zin_leren_hegemony')}§! of 100.` },
    stranger: { icon: 'm_stranger', label: 'The Stranger', when: nogflag('zin_eindil_named'), value: [[null, '§Y[ROOT.zin_aoaz_stage_name]§!']],
      tip: 'The road of the man from the ice, as far as it has come: [ROOT.zin_aoaz_stage_name].' },
    eindil: { icon: 'm_stranger', label: 'Eindil', when: gflag('zin_eindil_named'), value: [[null, '§Y[ROOT.zin_aoaz_stage_name]§!']],
      tip: 'The road of Eindil, as far as it has come: [ROOT.zin_aoaz_stage_name].' },
    renown: { icon: 'm_renown', label: 'Renown', value: coloured(v('global', 'zin_eindil_renown'), [[null, 'Y']]),
      tip: `How widely his deeds are told: §Y${v('global', 'zin_eindil_renown')}§! of 100.` },
    glo: { icon: 'm_glo', label: 'Glo', when: gflag('zin_glo_with_eindil'), value: coloured(v('global', 'zin_glo_power'), [[null, 'Y']]),
      tip: `The power of Glo in the hands that carry it: §Y${v('global', 'zin_glo_power')}§! of 100.` },
    temper: { icon: 'm_temper', label: 'Temper', value: coloured(v('ROOT', 'zin_goldoroth_temper'), [[null, 'Y']]),
      tip: `The temper of the clans of the Horde: §Y${v('ROOT', 'zin_goldoroth_temper')}§! of 100.` },
    unity: { icon: 'm_unity', label: 'Unity', value: coloured(v('ROOT', 'zin_goldoroth_unity'), [[null, 'Y']]),
      tip: `How firmly the clans hold together: §Y${v('ROOT', 'zin_goldoroth_unity')}§! of 100.` },
    border: { icon: 'm_border', label: 'The Border', needs: { triggers: ['zin_dark_tension_band_quiet', 'zin_dark_tension_band_uneasy', 'zin_dark_tension_band_bloody'] },
      value: [['zin_dark_tension_band_quiet = yes', '§YQuiet§!'], ['zin_dark_tension_band_uneasy = yes', '§YUneasy§!'], ['zin_dark_tension_band_bloody = yes', '§OBloody§!'], [null, '§RBrink§!']],
      tip: `The tension on the border of the Dark Lands: §Y${v('global', 'zin_dark_border_tension')}§! of 100.\nQuiet, uneasy, bloody, then the brink of war.` },
    resolve: { icon: 'm_resolve', label: 'Resolve', value: coloured(v('global', 'zin_dark_accord_resolve'), [[null, 'Y']]),
      tip: `The resolve of the Dark Sea Accord: §Y${v('global', 'zin_dark_accord_resolve')}§! of 100.` },
    members: { icon: 'm_members', label: 'Members', value: [[null, `§Y${v('ROOT', 'zin_aoaz_members')}§!`]],
      tip: `Realms of the Dark Sea Accord: §Y${v('ROOT', 'zin_aoaz_members')}§!.` },
    sway: { icon: 'm_sway', label: 'Sway', needs: { triggers: ['zin_dark_is_tributary'] },
      value: [['zin_dark_is_tributary = yes', '§RYoked§!'], [ge('zin_goldoroth_sway', n.pressed), '§OPressed§!'], [ge('zin_goldoroth_sway', n.courted), '§YCourted§!'], [null, '§YFree§!']],
      tip: `How hard the Horde of Goldoroth leans on this hold. Free below ${n.courted}, courted below ${n.pressed}, then pressed; a tributary is under the yoke.` },
    loyalty: { icon: 'm_loyalty', label: 'Loyalty', needs: { triggers: ['zin_aenor_dominion_steadfast', 'zin_aenor_dominion_loyal', 'zin_aenor_dominion_restless'] },
      value: [['zin_aenor_dominion_steadfast = yes', '§YSteadfast§!'], ['zin_aenor_dominion_loyal = yes', '§YLoyal§!'], ['zin_aenor_dominion_restless = yes', '§ORestless§!'], [null, '§RDefiant§!']],
      tip: `This dominion's loyalty to the Concord: §Y${v('ROOT', 'zin_concord_loyalty')}§! of 100.\nSteadfast from ${L.steadfast}, loyal from ${L.loyal}, restless from ${L.restless}, defiant below.` },
    charter: { icon: 'm_charter', label: 'The Charter', needs: { texts: ['zin_court_charter_word'] }, value: [[null, '§Y[ROOT.zin_court_charter_word]§!']],
      tip: 'The charter under which this dominion keeps the Concord: [ROOT.zin_court_charter_word].' },
    leaning: { icon: 'm_leaning', label: 'Leaning',
      value: [[ge('zin_leren_lean', 15), '§YSonargur§!'], ['check_variable = { zin_leren_lean > -15 }', '§YNeither§!'], [null, '§YParim§!']],
      tip: `Whether this crown leans to Sonargur or to Parim: §Y${v('ROOT', 'zin_leren_lean')}§!, from -100 (Parim) to 100 (Sonargur).` },
  };
}

/** The panels the sigil button opens: flag, refresh effect (optional) and sigil cell. */
export const AOAZ_PANELS = {
  court: { flag: 'zin_ui_court_open', refresh: 'zin_aenor_ui_refresh', label: 'The Golden Court' },
  council: { flag: 'zin_ui_council_open', refresh: 'zin_afrit_ui_refresh', label: 'The Hermitage', hub: true },
  dominion: { flag: 'zin_ui_dominion_open', refresh: 'zin_dominion_ui_refresh_volgan', label: 'The Southern Dominion' },
  watch: { flag: 'zin_ui_watch_open', refresh: 'zin_dominion_ui_refresh_mirolon', label: 'The Watch on the Passes' },
  mistake: { flag: 'zin_ui_mistake_open', refresh: 'zin_zol_ui_refresh', label: 'The Presence' },
  strait: { flag: 'zin_ui_strait_open', refresh: 'zin_leren_ui_refresh', label: 'The Narrow Strait' },
  horde: { flag: 'zin_ui_horde_open', refresh: 'zin_dark_refresh_panel_rows', label: 'The Horde' },
  accord: { flag: 'zin_ui_accord_open', refresh: 'zin_dark_refresh_panel_rows', label: 'The Dark Sea Accord' },
};

/** The rows, first match wins: id, trigger, three meter slots (each a list of meter ids whose own `when` picks one), panel. */
export function aoazRows(gol) {
  return [
    { id: 'aenor_court', trigger: `zin_aenor_is_realm = yes\n${nogflag('zin_golden_king_dead')}`, slots: [['court_gold'], ['temple_favour', 'hidden_hand'], ['concord']], panel: 'court' },
    { id: 'aenor_throne', trigger: `zin_aenor_is_realm = yes\n${gflag('zin_golden_king_dead')}`, slots: [['ruling_camp'], ['temple_favour', 'hidden_hand'], ['concord']], panel: 'court' },
    { id: 'hub', trigger: `zin_afrit_is_hub = yes\n${nogflag('zin_afrit_dead')}`, slots: [['veil', 'faithful'], ['plot', 'artifacts'], ['houses']], panel: 'council', hub: true },
    { id: 'volgan', trigger: 'zin_is_volgan = yes', slots: [['hosts'], ['storm_veil'], ['nether_pact']], panel: 'dominion' },
    { id: 'mirolon', trigger: 'zin_is_mirolon = yes', slots: [['proof'], ['passes'], ['the_south']], panel: 'watch' },
    { id: 'zol', trigger: 'zin_is_zol = yes', slots: [['presence'], ['service'], ['isles', 'convergence']], panel: 'mistake' },
    { id: 'lerendor', trigger: 'zin_is_lerendor = yes', slots: [['strait'], ['dues'], ['hegemony']], panel: 'strait' },
    { id: 'eindil_host', trigger: 'zin_eindil_is_host = yes', slots: [['stranger', 'eindil'], ['renown'], ['glo']] },
    ...(gol ? [{ id: 'goldoroth', trigger: `original_tag = ${gol}`, slots: [['temper'], ['unity'], ['border']], panel: 'horde' }] : []),
    { id: 'accord', trigger: 'zin_dark_is_accord_member = yes\nis_faction_leader = yes', slots: [['resolve'], ['border'], ['members']], panel: 'accord' },
    { id: 'hold', trigger: 'zin_dark_is_hold = yes', slots: [['sway']] },
    { id: 'dominion', trigger: 'is_subject = yes\nOVERLORD = { zin_aenor_is_realm = yes }\nhas_variable = zin_concord_loyalty', slots: [['loyalty'], ['charter']] },
    { id: 'north_crown', trigger: 'zin_leren_is_north_crown = yes', slots: [['leaning']] },
  ];
}

// Scripted triggers, effects and defined texts the staged tree defines (top-level names of their files).
function stagedNames(staged) {
  const out = { triggers: new Set(), effects: new Set(), texts: new Set() };
  for (const [rel, bytes] of staged.files) {
    if (!rel.endsWith('.txt')) continue;
    const kind = rel.startsWith('common/scripted_triggers/') ? 'triggers' : rel.startsWith('common/scripted_effects/') ? 'effects' : rel.startsWith('common/scripted_localisation/') ? 'texts' : null;
    if (!kind) continue;
    const t = bytes.toString('utf8');
    if (kind === 'texts') { for (const m of t.matchAll(/^\s*name\s*=\s*([A-Za-z0-9_]+)/gm)) out.texts.add(m[1]); continue; }
    let depth = 0;
    for (const line of t.split('\n')) {
      const s = line.replace(/#.*/, '');
      if (depth === 0) { const m = /^\s*([A-Za-z0-9_]+)\s*=\s*\{/.exec(s); if (m) out[kind].add(m[1]); }
      for (const ch of s) { if (ch === '{') depth++; else if (ch === '}') depth--; }
    }
  }
  return out;
}
const triggerNames = text => [...text.matchAll(/\b([a-z][a-z0-9_]*)\s*=\s*yes\b/g)].map(m => m[1]).filter(n => n.startsWith('zin_'));

/** Resolves the rows against what the tree defines: drops what cannot load, returns the rows and the reasons. */
export function resolveAoaz(defs, { meters = aoazMeters(), gol = null, panels = AOAZ_PANELS } = {}) {
  const dropped = [];
  const meterOk = id => {
    const m = meters[id], need = m.needs ?? {};
    const trig = [...triggerNames(m.when ?? ''), ...m.value.flatMap(([t]) => triggerNames(t ?? '')), ...(need.triggers ?? [])].filter(t => !defs.triggers.has(t));
    const eff = (need.effects ?? []).filter(e => !defs.effects.has(e)), txt = (need.texts ?? []).filter(t => !defs.texts.has(t));
    if (trig.length || eff.length || txt.length) { dropped.push(`meter ${id}: ${[...new Set([...trig, ...eff, ...txt])].join(', ')} not defined`); return false; }
    return true;
  };
  const rows = [];
  for (const r of aoazRows(gol)) {
    const missing = triggerNames(r.trigger).filter(t => !defs.triggers.has(t));
    if (missing.length) { dropped.push(`row ${r.id}: ${missing.join(', ')} not defined`); continue; }
    const slots = r.slots.map(s => s.filter(meterOk));   // a slot keeps its place even when its meter is left out
    let panel = r.panel && panels[r.panel];
    if (panel && panel.refresh && !defs.effects.has(panel.refresh)) { dropped.push(`panel ${r.panel}: ${panel.refresh} not defined`); panel = null; }
    rows.push({ ...r, slots, panel: panel ? r.panel : null });
  }
  return { rows, dropped };
}

const AOAZ_ICON = 24, AOAZ_BTN = 28, AOAZ_SIGIL = 20, MAPMODE = [20, 18];
// Layout (design system section 3: 4 px grid; row.standard 32; icon.s 24; hoi_16mbs values): the realm button, the age, the
// Gathering Dark, three meter slots of 120, the panel button.
export const AOAZ_LAYOUT = { w: 600, h: 32, realm: 4, age: [36, 76], gd: [116, 80], meters: [200, 320, 440], meterW: 120, panel: 568 };

export async function buildAoazBar(staged, { provenance, rawPath = rawFile, log = s => process.stderr.write(`${s}\n`) } = {}) {
  const data = JSON.parse(readFileSync(AOAZ_FILE, 'utf8')), n = aoazNumbers(), meters = aoazMeters(n);
  // Art: the three Banner Hall sheets, the map-mode cells and the Banner Hall section cell. Every sheet must have an accepted review line.
  const lines = provenance ?? (existsSync(provenanceFile()) ? readFileSync(provenanceFile(), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)) : []);
  const sheetOf = async (sheet, rel) => {
    const file = rawPath(rel);
    if (!file || !existsSync(file)) return { why: `no raw sheet ${rel}` };
    const bytes = readFileSync(file), acc = acceptance(lines, rel, bytes);
    if (!acc.ok) return { why: `${rel}: ${acc.why}` };
    return { rel, bytes, cells: await readSheetCells(sheet, file) };
  };
  const topbar = JSON.parse(readFileSync(fileURLToPath(new URL('../data/ui/sheets/icons-topbar-values.json', import.meta.url)), 'utf8'));
  const banner = JSON.parse(readFileSync(fileURLToPath(new URL('../data/ui/sheets/ui-chrome-banner-hall.json', import.meta.url)), 'utf8'));
  const sheets = await Promise.all([...data.sheets.map(s => sheetOf(s, `ui/aoaz/${s.id}.png`)), sheetOf(topbar, 'ui/reskin/icons-topbar-values.png'), sheetOf(banner, 'ui/reskin/ui-chrome-banner-hall.png')]);
  const missing = sheets.filter(s => s.why);
  if (missing.length) { log(`Aoaz bar: not built, art pending (${missing.map(s => s.why).join('; ')})`); return { built: false, pending: missing.map(s => s.why) }; }
  const cell = key => { for (const s of sheets) if (s.cells.has(key)) return s.cells.get(key); throw new Error(`Aoaz bar: no cell ${key}`); };
  for (const s of sheets) if (!staged.files.has(`art/source/${s.rel}`)) staged.add(`art/source/${s.rel}`, s.bytes);

  // Which rows, meters and panels this tree can load.
  const defs = stagedNames(staged);
  // The Horde's scripted GUI is written by the Dark Lands panels (modules/mech_dark_panels.mjs), which build before the bar.
  const gol = /zin_horde\s*=\s*\{[\s\S]*?original_tag = ([A-Z0-9]{3})/.exec(staged.files.get('common/scripted_guis/zin_dark_panels.txt')?.toString('utf8') ?? '')?.[1] ?? null;
  const { rows, dropped } = resolveAoaz(defs, { meters, gol });
  for (const d of dropped) log(`Aoaz bar: left out ${d}`);

  // Sprites. The meters of each sheet are one strip; frame k of the strip is the k-th cell of the sheet.
  const tex = (rel, img) => { staged.add(`gfx/interface/zin/${rel}`, dds(fromRaw(img.data, img.w, img.h))); return `gfx/interface/zin/${rel}`; };
  const gfx = [], iconOf = new Map();
  for (const [i, s] of data.sheets.entries()) {
    const keys = s.cells.map(c => c.key).filter(k => k.startsWith('m_'));
    if (!keys.length) continue;
    const r = await runFit('strip', keys.map(cell), { width: AOAZ_ICON * keys.length, height: AOAZ_ICON, frames: keys.length }, { frameFit: 'contain' });
    const name = `GFX_zin_aoaz_meters_${i + 1}`;
    gfx.push(sprite(name, tex(`aoaz/meters_${i + 1}.dds`, r.img), `\n\t\tnoOfFrames = ${keys.length}`));
    keys.forEach((k, j) => iconOf.set(k, { sprite: name, frame: j + 1 }));
  }
  const sigils = data.sheets.flatMap(s => s.cells.map(c => c.key)).filter(k => k.startsWith('s_'));
  for (const k of sigils) gfx.push(sprite(`GFX_zin_aoaz_sigil_${k.slice(2)}`, tex(`aoaz/sigil_${k.slice(2)}.dds`, (await runFit('contain', [cell(k)], { width: AOAZ_SIGIL, height: AOAZ_SIGIL })).img)));
  const btn = await runFit('strip', ['b_normal', 'b_hover', 'b_pressed'].map(cell), { width: AOAZ_BTN * 3, height: AOAZ_BTN, frames: 3 }, { frameFit: 'contain' });
  gfx.push(sprite('GFX_zin_aoaz_button', tex('aoaz/button.dds', btn.img), '\n\t\tnoOfFrames = 3\n\t\teffectFile = "gfx/FX/buttonstate.lua"'));
  const sec = cell('section'), frameBorder = 8;
  const frame = await runFit('nine_slice', [sec], { width: 160, height: AOAZ_LAYOUT.h, borderSize: [frameBorder, frameBorder] }, { cellBorder: Math.round(sec.h * banner.cellBorder) });
  gfx.push(`\tcorneredTileSpriteType = {\n\t\tname = "GFX_zin_bar_frame"\n\t\tsize = { x = 160 y = ${AOAZ_LAYOUT.h} }\n\t\ttexturefile = "${tex('aoaz/bar_frame.dds', frame.img)}"\n\t\tborderSize = { x = ${frameBorder} y = ${frameBorder} }\n\t\ttilingCenter = no\n\t}`);
  staged.text('interface/zin_aoaz_bar.gfx', `# Generated by the ZIN content builder (tools/content/modules/ui.mjs, the Aoaz bar). Do not edit by hand.\nspriteTypes = {\n${gfx.join('\n')}\n}\n`);
  // The footholds map mode's own buttons (spec 01 section 11), 20 x 18 like the engine's small map-mode buttons.
  const mm = [];
  for (const [state, key] of [['deselected', 'mm_footholds_off'], ['selected', 'mm_footholds_on']])
    mm.push(sprite(`GFX_mapmode_buttons_${state}_small_zin_footholds_map_mode`, tex(`mapmodes/footholds_${state}.dds`, (await runFit('contain', [cell(key)], { width: MAPMODE[0], height: MAPMODE[1] })).img)));
  staged.text('interface/zin_mapmodes.gfx', `# Generated by the ZIN content builder (tools/content/modules/ui.mjs, the Aoaz bar). Do not edit by hand.\nspriteTypes = {\n${mm.join('\n')}\n}\n`);

  // Triggers: one per row (its own trigger and none of the rows above it), one for the panel button.
  const rowTrig = r => `zin_aoaz_row_${r.id}`;
  const trig = ['# Every player sees the Aoaz bar (the monthly interface refresh of data/story_ai.json reads this).\nzin_aoaz_bar_shown = {\n\talways = yes\n}'];
  trig.push(...rows.map((r, i) => `# The Aoaz bar shows the ${r.id.replace(/_/g, ' ')} meters.\n${rowTrig(r)} = {\n${r.trigger.split('\n').map(l => `\t${l}`).join('\n')}${i ? `\n\tNOT = {\n\t\tOR = {\n${rows.slice(0, i).map(p => `\t\t\tAND = {\n${p.trigger.split('\n').map(l => `\t\t\t\t${l}`).join('\n')}\n\t\t\t}`).join('\n')}\n\t\t}\n\t}` : ''}\n}`));
  staged.text('common/scripted_triggers/zin_aoaz_bar.txt', `# Generated by the ZIN content builder (tools/content/modules/ui.mjs, the Aoaz bar). Do not edit by hand.\n# Which row of meters the Aoaz bar shows for the scope country: the first row it meets (docs/specs/07_interface/01_interface.md section 2).\n${trig.join('\n')}\n`);

  // Effects: the counts the bar shows, and the panel refreshes the meters read. Pure formatting: no mechanic variable changes.
  const has = id => rows.some(r => r.id === id);
  const refreshCalls = [...new Set(rows.filter(r => r.panel).map(r => [rowTrig(r), AOAZ_PANELS[r.panel].refresh]).map(JSON.stringify))].map(s => JSON.parse(s));
  const eff = [
    'zin_aoaz_bar_refresh = {', '\t# Scope: a human player. Counts what the Aoaz bar shows and refreshes the panel its meters read. Pure formatting.',
    ...(has('hub') ? ['\tif = {', `\t\tlimit = { ${rowTrig({ id: 'hub' })} = yes }`, '\t\tset_variable = { zin_aoaz_houses = 0 }', '\t\tset_variable = { zin_aoaz_faithful = 0 }',
      '\t\tevery_country = {', `\t\t\tlimit = { ${ge('zin_footholds', 2)} }`, '\t\t\tPREV = { add_to_variable = { zin_aoaz_houses = 1 } }', `\t\t\tif = { limit = { ${ge('zin_footholds', 5)} } PREV = { add_to_variable = { zin_aoaz_faithful = 1 } } }`, '\t\t}', '\t}'] : []),
    ...(has('zol') ? ['\tif = {', `\t\tlimit = { ${rowTrig({ id: 'zol' })} = yes }`, '\t\tset_variable = { zin_aoaz_service = zin_zol_bond_lesser }', '\t\tadd_to_variable = { zin_aoaz_service = zin_zol_bond_great }', '\t\tadd_to_variable = { zin_aoaz_service = zin_zol_bond_divine }', '\t}'] : []),
    ...(has('accord') ? ['\tif = {', `\t\tlimit = { ${rowTrig({ id: 'accord' })} = yes }`, '\t\tset_variable = { zin_aoaz_members = 0 }', '\t\tevery_country = {', '\t\t\tlimit = { zin_dark_is_accord_member = yes }', '\t\t\tPREV = { add_to_variable = { zin_aoaz_members = 1 } }', '\t\t}', '\t}'] : []),
    ...refreshCalls.map(([t, e]) => `\tif = { limit = { ${t} = yes } ${e} = yes }`),
    '\tadd_to_variable = { zin_ui_tick = 1 }', '}'];
  staged.text('common/scripted_effects/zin_aoaz_bar.txt', `# Generated by the ZIN content builder (tools/content/modules/ui.mjs, the Aoaz bar). Do not edit by hand.\n${eff.join('\n')}\n`);
  AOAZ_BUILT = true;
  AOAZ_STARTUP = '\t\t\tevery_country = { limit = { is_ai = no } zin_aoaz_bar_refresh = yes }';

  // Localisation and scripted localisation.
  const loc = {}, dts = [];
  const dt = (name, cases) => { dts.push(`defined_text = {\n\tname = ${name}\n${cases.map(([t, k]) => `\ttext = {\n${t ? `\t\ttrigger = {\n${t.split('\n').map(l => `\t\t\t${l}`).join('\n')}\n\t\t}\n` : ''}\t\tlocalization_key = ${k}\n\t}`).join('\n')}\n}`); };
  const hubKey = (m, k) => (m.hub ? `${k}_hub` : k);
  const used = new Set(rows.flatMap(r => r.slots.flat()));
  for (const id of used) {
    const m = meters[id], up = id.toUpperCase();
    dt(`zin_aoaz_v_${id}`, m.value.map(([t, text], i) => { const k = hubKey(m, `ZIN_AOAZ_V_${up}_${i}`); loc[k] = text; return [t, k]; }));
    loc[hubKey(m, `ZIN_AOAZ_${up}`)] = `[ROOT.zin_aoaz_v_${id}]`;
    loc[hubKey(m, `ZIN_AOAZ_${up}_TT`)] = `§H${m.label}§!\n${m.tip}`;
  }
  const bands = ['Hidden', 'Rumoured', 'Suspected', 'Seen'];
  dt('zin_aoaz_south_band', bands.map((b, i) => { loc[`ZIN_AOAZ_SOUTH_${i}`] = i > 1 ? `§O${b}§!` : `§Y${b}§!`; return [i < bands.length - 1 ? `check_variable = { global.zin_volgan_veil_band < ${i + 1} }` : null, `ZIN_AOAZ_SOUTH_${i}`]; }));
  const stages = readData('mech_journey_eindil.json').stages;
  dt('zin_aoaz_stage_name', stages.map((s, i) => [i < stages.length - 1 ? `check_variable = { global.zin_eindil_stage < ${s.n + 1} }` : null, `zin_eindil_stage_${s.n}`]));
  // The Gathering Dark: value coloured by tier, tooltip with tier, last change and the active sources (secret-aware labels).
  const tiers = n.tiers, warnTier = tiers.length - 1;
  dt('zin_aoaz_gd_value', tiers.slice().reverse().map((t, i) => { const k = `ZIN_AOAZ_GD_V_${t.n}`; loc[k] = `§${t.n > warnTier ? 'R' : t.n === warnTier ? 'O' : 'Y'}[?global.zin_gathering_dark|0]§!`; return [i < tiers.length - 1 ? ge('global.zin_gathering_dark', t.from) : null, k]; }));
  const srcLines = Object.entries(n.sources).map(([k, s]) => {
    const label = s.labelRevealed ? `[ROOT.zin_world_gd_src_${k}_label]` : `$zin_world_gd_src_${k}$`;
    loc[`ZIN_AOAZ_GD_SRC_${k.toUpperCase()}`] = `\n  ${label}: [?global.zin_gd_src_${k}|2] a month`;
    // a source at 0 writes nothing: no branch of the text matches
    dt(`zin_aoaz_gd_src_${k}`, [[`NOT = { check_variable = { global.zin_gd_src_${k} = 0 } }`, `ZIN_AOAZ_GD_SRC_${k.toUpperCase()}`]]);
    return `[ROOT.zin_aoaz_gd_src_${k}]`;
  });
  loc.ZIN_AOAZ_GD = '[ROOT.zin_aoaz_gd_value]';
  loc.ZIN_AOAZ_GD_TT = `§HThe Gathering Dark§!: [ROOT.zin_world_gd_tier_name]\nHow near the age is to its last war: §Y[?global.zin_gathering_dark|0]§! of 100. Last change: [?global.zin_gd_last_change|2].\nWhat moves it each month:${srcLines.join('')}`;
  loc.ZIN_AOAZ_AGE = '§Y4A [?global.year|0]§!';
  loc.ZIN_AOAZ_AGE_TT = '§HThe Fourth Age of Aoaz§!\nYears are counted from the first restored king.';
  loc.ZIN_AOAZ_REALM_TT = '§HThe Realm§!\nOpen or close the overview of your realm.';
  for (const [k, p] of Object.entries(AOAZ_PANELS)) loc[p.hub ? `ZIN_AOAZ_PANEL_${k.toUpperCase()}_TT_hub` : `ZIN_AOAZ_PANEL_${k.toUpperCase()}_TT`] = `§H${p.label}§!\nOpen or close the panel.`;
  staged.text('common/scripted_localisation/zin_aoaz_bar.txt', `# Generated by the ZIN content builder (tools/content/modules/ui.mjs, the Aoaz bar). Do not edit by hand.\n${dts.join('\n')}\n`);
  staged.loc('zin_aoaz_bar', loc);

  // The window. Each meter slot holds one icon and one value per meter that can show there; triggers keep exactly one visible.
  const Lw = AOAZ_LAYOUT, els = [], vis = new Map();
  const text = (name, x, w, key, tip, font = 'hoi_16mbs', format = 'left') => `\t\tinstantTextBoxType = {\n\t\t\tname = "${name}"\n\t\t\tposition = { x = ${x} y = 8 }\n\t\t\tfont = "${font}"\n\t\t\ttext = "${key}"\n\t\t\tmaxWidth = ${w}\n\t\t\tmaxHeight = 16\n\t\t\tformat = ${format}\n\t\t\tfixedsize = yes\n\t\t\tpdx_tooltip = "${tip}"\n\t\t}`;
  const icon = (name, x, y, spr, frame, tip, extra = '') => `\t\ticonType = {\n\t\t\tname = "${name}"\n\t\t\tspriteType = "${spr}"\n\t\t\tposition = { x = ${x} y = ${y} }${frame ? `\n\t\t\tframe = ${frame}` : ''}${tip ? `\n\t\t\tpdx_tooltip = "${tip}"` : ''}${extra}\n\t\t}`;
  const button = (name, x, tip) => `\t\tbuttonType = {\n\t\t\tname = "${name}"\n\t\t\tspriteType = "GFX_zin_aoaz_button"\n\t\t\tposition = { x = ${x} y = 4 }\n\t\t\tpdx_tooltip = "${tip}"\n\t\t}`;
  els.push(button('zin_aoaz_realm', Lw.realm, 'ZIN_AOAZ_REALM_TT'), icon('zin_aoaz_realm_sigil', Lw.realm + 4, 8, 'GFX_zin_aoaz_sigil_realm', 0, '', '\n\t\t\talwaystransparent = yes'));
  els.push(text('zin_aoaz_age', Lw.age[0], Lw.age[1], 'ZIN_AOAZ_AGE', 'ZIN_AOAZ_AGE_TT', 'hoi_16mbs', 'centre'));
  // The Gathering Dark icon: the ten frames of the engine's tension strip (the same concept), one per tenth of the meter.
  for (let f = 1; f <= 10; f++) {
    els.push(icon(`zin_aoaz_gd_${f}`, Lw.gd[0] + 4, 4, 'GFX_world_tension_icon_big_strip', f, 'ZIN_AOAZ_GD_TT', '\n\t\t\tscale = 0.5'));
    vis.set(`zin_aoaz_gd_${f}_visible`, [f > 1 ? ge('global.zin_gathering_dark', (f - 1) * 10) : '', f < 10 ? `check_variable = { global.zin_gathering_dark < ${f * 10} }` : ''].filter(Boolean).join('\n'));
  }
  els.push(text('zin_aoaz_gd_text', Lw.gd[0] + 32, Lw.gd[1] - 36, 'ZIN_AOAZ_GD', 'ZIN_AOAZ_GD_TT'));
  const slotMeters = Lw.meters.map((_, s) => new Map());
  for (const r of rows) r.slots.forEach((ids, s) => { for (const id of ids) { if (!slotMeters[s].has(id)) slotMeters[s].set(id, []); slotMeters[s].get(id).push(r); } });
  slotMeters.forEach((map, s) => {
    for (const [id, rs] of map) {
      const m = meters[id], up = id.toUpperCase(), x = Lw.meters[s], ic = iconOf.get(m.icon), tip = hubKey(m, `ZIN_AOAZ_${up}_TT`);
      els.push(icon(`zin_aoaz_m${s + 1}_${id}_icon`, x + 4, 4, ic.sprite, ic.frame, tip), text(`zin_aoaz_m${s + 1}_${id}`, x + 32, Lw.meterW - 36, hubKey(m, `ZIN_AOAZ_${up}`), tip));
      const when = `OR = {\n${rs.map(r => `\t${rowTrig(r)} = yes`).join('\n')}\n}${m.when ? `\n${m.when}` : ''}`;
      vis.set(`zin_aoaz_m${s + 1}_${id}_icon_visible`, when); vis.set(`zin_aoaz_m${s + 1}_${id}_visible`, when);
    }
  });
  const effects = new Map();
  const allFlags = ['zin_realm_open', ...Object.values(AOAZ_PANELS).map(p => p.flag)];
  const closeAll = skip => allFlags.filter(f => f !== skip).map(f => `clr_country_flag = ${f}`).join('\n');
  vis.set('zin_aoaz_realm_click_enabled', 'always = yes');
  effects.set('zin_aoaz_realm_click', `if = {\n\tlimit = { has_country_flag = zin_realm_open }\n\tclr_country_flag = zin_realm_open\n}\nelse = {\n${closeAll('zin_realm_open')}\n\tset_country_flag = zin_realm_open\n}`);
  for (const k of [...new Set(rows.map(r => r.panel).filter(Boolean))]) {
    const p = AOAZ_PANELS[k], name = `zin_aoaz_panel_${k}`;
    els.push(button(name, Lw.panel, p.hub ? `ZIN_AOAZ_PANEL_${k.toUpperCase()}_TT_hub` : `ZIN_AOAZ_PANEL_${k.toUpperCase()}_TT`), icon(`${name}_sigil`, Lw.panel + 4, 8, `GFX_zin_aoaz_sigil_${k}`, 0, '', '\n\t\t\talwaystransparent = yes'));
    const when = `OR = {\n${rows.filter(r => r.panel === k).map(r => `\t${rowTrig(r)} = yes`).join('\n')}\n}`;
    vis.set(`${name}_visible`, when); vis.set(`${name}_sigil_visible`, when);
    vis.set(`${name}_click_enabled`, 'always = yes');
    effects.set(`${name}_click`, `if = {\n\tlimit = { has_country_flag = ${p.flag} }\n\tclr_country_flag = ${p.flag}\n}\nelse = {\n${closeAll(p.flag)}\n\tset_country_flag = ${p.flag}\n\tset_variable = { zin_ui_tab = 1 }\n\tset_variable = { zin_ui_page = 0 }\n\tzin_aoaz_bar_refresh = yes\n}`);
  }
  staged.text('interface/zin_aoaz_bar.gui', `# Generated by the ZIN content builder (tools/content/modules/ui.mjs, the Aoaz bar). Do not edit by hand.\nguiTypes = {\n\tcontainerWindowType = {\n\t\tname = "zin_aoaz_bar_window"\n\t\tposition = { x = ${data.window.x} y = ${data.window.y} }\n\t\tsize = { width = ${Lw.w} height = ${Lw.h} }\n\t\torientation = upper_left\n\t\tbackground = {\n\t\t\tname = "zin_aoaz_bar_bg"\n\t\t\tspriteType = "GFX_zin_bar_frame"\n\t\t}\n${els.join('\n')}\n\t}\n}\n`);
  const ind = (s, k) => s.split('\n').map(l => `${'\t'.repeat(k)}${l}`).join('\n');
  staged.text('common/scripted_guis/zin_aoaz_bar.txt', `# Generated by the ZIN content builder (tools/content/modules/ui.mjs, the Aoaz bar). Do not edit by hand.\n# The Aoaz bar (docs/specs/07_interface/01_interface.md section 2). Its buttons only open and close windows; the AI never uses it.\nscripted_gui = {\n\tzin_aoaz_bar = {\n\t\tcontext_type = player_context\n\t\twindow_name = "zin_aoaz_bar_window"\n\t\tparent_window_token = top_bar\n\t\tdirty = zin_ui_tick\n\t\tai_enabled = { always = no }\n\t\tvisible = { always = yes }\n\t\teffects = {\n${[...effects].map(([k, b]) => `\t\t\t${k} = {\n${ind(b, 4)}\n\t\t\t}`).join('\n')}\n\t\t}\n\t\ttriggers = {\n${[...vis].map(([k, b]) => `\t\t\t${k} = {\n${ind(b, 4)}\n\t\t\t}`).join('\n')}\n\t\t}\n\t}\n}\n`);
  return { built: true, rows: rows.map(r => r.id), dropped, elements: els.length, sprites: gfx.length + mm.length };
}
export const aoazStartup = () => AOAZ_STARTUP;
