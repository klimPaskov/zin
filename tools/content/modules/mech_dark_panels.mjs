// The Horde panel (Goldoroth) and the Accord panel (the Dark Sea Accord's leader) of docs/specs/04_mechanics/dark_lands.md,
// "Interface", under the names of docs/specs/07_interface/01_interface.md section 7a: windows zin_horde_window and zin_accord_window,
// scripted GUIs zin_horde and zin_accord, open flags zin_ui_horde_open and zin_ui_accord_open. Both are read-only: they show the
// mechanic's values and change nothing but their own open flag and page. They are Chancery panels of the shared layout
// (lib/mech_court_gui.mjs; design system sections 3 and 6.4): header picture, accent strip, one primary value per tab, meters with the
// mechanic's thresholds as marks, fixed rows with pages for the halls and the members, a tooltip on every value. Every player-visible
// text is in data/mech_regions_dark.json (keys zin_horde_* and zin_accord_*); the panel adds only the generated row, tab and page keys.
// Each opens from a small launcher button until the Aoaz bar (lane W1) takes that place.
//
// Script: common/scripted_effects/zin_dark_panels.txt holds zin_dark_ui_meters, the meter fills and the page of rows of an open
// window; zin_dark_refresh_panel_rows (mech_dark_content.mjs) rebuilds the arrays and calls it for every country with a window open,
// on the monthly pulse and on every click of a window.
import { HEADER } from '../lib/mech_kit.mjs';
import { Panel, LAYOUT, FONT, sub, meterFill, fillRows } from '../lib/mech_court_gui.mjs';
import { format } from '../lib/mech_court_lib.mjs';

const SPEC = 'docs/specs/04_mechanics/dark_lands.md';
// Script text is indented from its braces (one tab per open brace), inside the file's top-level block.
const indent = text => format(text).split('\n').map(l => (l ? `\t${l}` : l)).join('\n');
const REFRESH = 'zin_dark_refresh_panel_rows';

// Registers the generated keys of a panel with the text table: data keys are marked used, the rest (row slots, the selected tab label,
// the page line) are added with the panel's own text.
function adopt(T, p) {
  for (const [k, v] of p.loc) { if (!T.has(k)) T.map.set(k, v); T.use(k); }
}

/** Returns { files: Map, scriptedGuis: [], windows: [] }; the keys it needs are read from T. */
export async function buildDarkPanels(c) {
  const { T, tags, BLOCS, N } = c;
  const { GOL } = tags;
  const t = k => T.get(k), tip = k => T.get(sub(k, '_tt'));
  const marks = { temper: [N.temper_settled, N.temper_restless, N.temper_blood], favour: [N.challenge_favour, N.sulk_favour, N.boon_favour], resolve: [N.resolve_fray, N.resolve_holds] };

  // ============================================================================================ the Horde of Cocanoor
  const horde = new Panel({ prefix: 'zin_horde', gui: 'zin_horde', window: 'zin_horde_window', flag: 'zin_ui_horde_open', bar: 'horde', title: t('zin_horde_title'), titleKey: 'zin_horde_title', accent: 'GFX_zin_accent_horde', header: 'GFX_zin_header_horde',
    launcher: t('zin_horde_button'), launcherKey: 'zin_horde_button', launcherTip: tip('zin_horde_button'), launcherPos: [8, 124], toggle: true,
    visible: `original_tag = ${GOL}`, launcherVisible: `original_tag = ${GOL}`, refresh: REFRESH,
    tabs: [1, 2].map(i => ({ key: `zin_horde_tab_${i}`, label: t(`zin_horde_tab_${i}`), tip: tip(`zin_horde_tab_${i}`) })) });
  horde.primary('temper', 1, 'zin_horde_temper', t('zin_horde_temper'), tip('zin_horde_temper'), { fill: 'zin_ui_temper_fill', marks: marks.temper });
  horde.text('blocs', 1, 'zin_horde_blocs', t('zin_horde_blocs'), { font: 'small', gap: 4 });
  for (const b of BLOCS) {
    const k = `zin_horde_bloc_${b.key}`;
    const y = horde.rowGauge(`bloc_${b.key}`, 1, k, t(k), tip(k), { fill: `zin_ui_favour_${b.key}_fill`, marks: marks.favour }, { w: 196 });
    // the heir's mark sits between the name and the meter, in the bloc's own row
    horde.els.push(['instantTextBoxType = {', `name = "zin_horde_bloc_${b.key}_mark"`, `position = { x = ${LAYOUT.x + 200} y = ${y + 4} }`, `font = "${FONT.small}"`, 'text = "zin_horde_heir"', 'maxWidth = 92', 'maxHeight = 20', 'format = left', 'fixedsize = yes', 'pdx_tooltip = "zin_horde_heir_tt"', '}'].join('\n'));
    horde.gate(`zin_horde_bloc_${b.key}_mark`, 1, `has_country_flag = zin_goldoroth_heir_${b.key}`);
  }
  horde.loc.set('zin_horde_heir', t('zin_horde_heir')); horde.loc.set('zin_horde_heir_tt', tip('zin_horde_heir'));
  horde.space(1, 4);
  horde.gauge('unity', 1, 'zin_horde_unity', t('zin_horde_unity'), tip('zin_horde_unity'), { fill: 'zin_ui_unity_fill' });
  horde.text('border', 1, 'zin_horde_border', t('zin_horde_border'), { tip: tip('zin_horde_border') });
  horde.primary('sway', 2, 'zin_horde_sway_head', t('zin_horde_sway_head'), tip('zin_horde_sway_head'));
  horde.rows('sway', 2, { key: 'zin_horde_sway_row', tip: tip('zin_horde_sway_row'), cols: [
    { head: 'Hall', w: 280, text: n => `§Y[ROOT.zin_ui_row_${n}.GetNameDef]§!` },
    { head: 'Sway', w: 80, text: n => `§Y[?ROOT.zin_ui_row_${n}.zin_goldoroth_sway|0]§!` },
    { head: 'Band', w: 192, text: n => `[ROOT.zin_ui_row_${n}.zin_dark_sway_band_name]` }] });

  // ============================================================================================ the Dark Sea Accord
  const accord = new Panel({ prefix: 'zin_accord', gui: 'zin_accord', window: 'zin_accord_window', flag: 'zin_ui_accord_open', bar: 'accord',title: t('zin_accord_title'), titleKey: 'zin_accord_title', accent: 'GFX_zin_accent_accord', header: 'GFX_zin_header_accord',
    launcher: t('zin_accord_button'), launcherKey: 'zin_accord_button', launcherTip: tip('zin_accord_button'), launcherPos: [8, 152], toggle: true,
    visible: 'zin_dark_is_accord_member = yes\nis_faction_leader = yes', launcherVisible: 'zin_dark_is_accord_member = yes\nis_faction_leader = yes', refresh: REFRESH,
    tabs: [{ key: 'zin_accord_tab_1', label: t('zin_accord_title') }] });
  accord.primary('resolve', 1, 'zin_accord_resolve', t('zin_accord_resolve'), tip('zin_accord_resolve'), { fill: 'zin_ui_resolve_fill', marks: marks.resolve });
  accord.text('border', 1, 'zin_accord_border', t('zin_accord_border'), { tip: tip('zin_accord_border'), gap: LAYOUT.gap });
  accord.rows('members', 1, { key: 'zin_accord_member_row', tip: tip('zin_accord_member_row'), cols: [{ head: t('zin_accord_members'), headKey: 'zin_accord_members', w: LAYOUT.cw, text: n => `§Y[ROOT.zin_ui_row_${n}.GetNameDef]§!` }] });

  const out = [horde, accord].map(p => { const r = p.render(); adopt(T, p); return r; });
  const files = new Map([
    ['interface/zin_dark_panels.gui', `${HEADER('mech_dark_panels', SPEC)}\nguiTypes = {\n${indent(out.map(o => o.gui).join('\n'))}\n}\n`],
    ['common/scripted_guis/zin_dark_panels.txt', `${HEADER('mech_dark_panels', SPEC)}\nscripted_gui = {\n${indent(out.map(o => o.scripted).join('\n'))}\n}\n`],
  ]);
  return { files, scriptedGuis: ['zin_horde', 'zin_horde_launcher', 'zin_accord', 'zin_accord_launcher'], windows: [horde, accord].map(p => ({ window: p.o.window, gui: p.o.gui, flag: p.o.flag, launcher: `${p.o.prefix}_button_window` })) };
}

/**
 * The scripted effect zin_dark_ui_meters (common/scripted_effects/zin_dark_panels.txt), written with or without the windows because
 * zin_dark_refresh_panel_rows calls it: the meter fills and the page of rows of an open Horde or Accord window.
 */
export function darkPanelEffects(c) {
  const { BLOCS } = c;
  const meters = [
    'zin_dark_ui_meters = {',
    `# Scope: a country with the Horde or the Accord window open. Pure formatting: it never changes a mechanic variable.`,
    'add_to_variable = { global.zin_ui_tick = 1 }',
    'if = {', 'limit = { has_country_flag = zin_ui_horde_open }',
    meterFill('zin_goldoroth_temper', 'zin_ui_temper_fill'), ...BLOCS.map(b => meterFill(`zin_goldoroth_favour_${b.key}`, `zin_ui_favour_${b.key}_fill`)), meterFill('zin_goldoroth_unity', 'zin_ui_unity_fill'),
    fillRows('global.zin_dark_sway_rows'), '}',
    'if = {', 'limit = { has_country_flag = zin_ui_accord_open }', meterFill('global.zin_dark_accord_resolve', 'zin_ui_resolve_fill'), fillRows('global.zin_dark_accord_rows'), '}',
    '}'].join('\n');
  return `${HEADER('mech_dark_panels', SPEC)}\n${format(meters)}\n`;
}

/**
 * The scripted localisation of the mechanic, written with or without the windows (common/scripted_localisation/zin_dark.txt): the
 * border band word, a country's sway band, and the line of the Free Holds category.
 */
export function darkScriptedLocalisation(c) {
  const { T, tags, N } = c;
  const { GOL } = tags;
  const blk = (name, body) => `${name} = {\n${body.split('\n').map(l => (l ? `\t${l}` : l)).join('\n')}\n}`;
  const definedText = (name, cases) => blk('defined_text', [`name = ${name}`, ...cases.map(([trigger, key]) => blk('text', `${trigger ? `${blk('trigger', trigger)}\n` : ''}localization_key = ${T.use(key)}`))].join('\n'));
  const scriptedLoc = [
    // The border band word: the tension band triggers of the mechanic.
    definedText('zin_dark_band_name', ['quiet', 'uneasy', 'bloody', 'brink'].map(k => [`zin_dark_tension_band_${k} = yes`, `zin_dark_band_${k}`])),
    // A country's sway band (the Horde rows, and the only sway a hold sees of itself): Free, Courted, Pressed, Under the Yoke.
    definedText('zin_dark_sway_band_name', [
      ['zin_dark_is_tributary = yes', 'zin_dark_sway_yoked'],
      [`check_variable = { zin_goldoroth_sway > ${N.sway_band_pressed - 0.01} }`, 'zin_dark_sway_pressed'],
      [`check_variable = { zin_goldoroth_sway > ${N.sway_band_courted - 0.01} }`, 'zin_dark_sway_courted'],
      [null, 'zin_dark_sway_free'],
    ]),
    // The line of the Free Holds category: Cocanoor's own, or the reader's band.
    definedText('zin_dark_sway_line', [
      [`original_tag = ${GOL}`, 'zin_dark_sway_line_cocanoor'],
      ['zin_dark_is_tributary = yes', 'zin_dark_sway_line_yoked'],
      [`check_variable = { zin_goldoroth_sway > ${N.sway_band_pressed - 0.01} }`, 'zin_dark_sway_line_pressed'],
      [`check_variable = { zin_goldoroth_sway > ${N.sway_band_courted - 0.01} }`, 'zin_dark_sway_line_courted'],
      [null, 'zin_dark_sway_line_free'],
    ]),
  ].join('\n');
  return `${HEADER('mech_dark_panels', SPEC)}\n${scriptedLoc}\n`;
}
