// The Horde panel (Goldoroth) and the Accord panel (the Dark Sea Accord's leader) of docs/specs/04_mechanics/dark_lands.md,
// "Interface", and 07_interface/01_interface.md section 7a. Both are read-only windows opened by a small button under the Realm
// button: they show the mechanic's values and change nothing but their own open flag. They use only existing ZIN sprites
// (GFX_zin_frame, GFX_zin_button, GFX_zin_rule, GFX_closebutton) and the vanilla fonts. The interface module's themed
// `zin_horde` / `zin_accord` panels (storm and sea frames, gauges, headers) may replace these: pass `panels: false` to the builder.
// Art needs (not generated here): GFX_zin_header_horde and GFX_zin_header_accord headers, gauge sprites, a button icon.
import { fmt, ind } from '../lib/mech_kit.mjs';

const text = (name, x, y, w, h, key, font = 'hoi_18mbs', format = 'left') => `\t\tinstantTextBoxType = {\n\t\t\tname = "${name}"\n\t\t\tposition = { x = ${x} y = ${y} }\n\t\t\tfont = "${font}"\n\t\t\ttext = "${key}"\n\t\t\tmaxWidth = ${w}\n\t\t\tmaxHeight = ${h}\n\t\t\tformat = ${format}\n\t\t\tfixedsize = yes\n\t\t}`;
const rule = (name, y) => `\t\ticonType = {\n\t\t\tname = "${name}"\n\t\t\tspriteType = "GFX_zin_rule"\n\t\t\tposition = { x = 40 y = ${y} }\n\t\t}`;

function windowGui(prefix, y, rows, T) {
  const lines = [];
  let cursor = 70;
  rows.forEach((r, i) => {
    lines.push(text(`${prefix}_row_${i + 1}`, 44, cursor, 520, r.h ?? 26, T.use(r.key), r.font ?? 'hoi_18mbs'));
    cursor += (r.h ?? 26) + 6;
    if (r.rule) { lines.push(rule(`${prefix}_rule_${i + 1}`, cursor)); cursor += 10; }
  });
  const height = cursor + 56;
  return `\tcontainerWindowType = {
\t\tname = "${prefix}_button_window"
\t\tposition = { x = 8 y = ${y} }
\t\tsize = { width = 132 height = 30 }
\t\torientation = upper_left
\t\tbuttonType = {
\t\t\tname = "${prefix}_toggle"
\t\t\tposition = { x = 0 y = 0 }
\t\t\tspriteType = "GFX_zin_button"
\t\t\tbuttonText = "${T.use(`${prefix}_button`)}"
\t\t\tbuttonFont = "hoi_18mbs"
\t\t\tpdx_tooltip = "${T.use(`${prefix}_button_tt`)}"
\t\t}
\t}
\tcontainerWindowType = {
\t\tname = "${prefix}_window"
\t\tposition = { x = -300 y = -${Math.round(height / 2)} }
\t\tsize = { width = 600 height = ${height} }
\t\torientation = center
\t\tmoveable = yes
\t\tbackground = {
\t\t\tname = "${prefix}_bg"
\t\t\tspriteType = "GFX_zin_frame"
\t\t}
${text(`${prefix}_title`, 40, 22, 520, 32, T.use(`${prefix}_title`), 'hoi_24header', 'centre')}
\t\tbuttonType = {
\t\t\tname = "${prefix}_close"
\t\t\tposition = { x = 556 y = 14 }
\t\t\tquadTextureSprite = "GFX_closebutton"
\t\t\tshortcut = "ESCAPE"
\t\t}
${rule(`${prefix}_rule_top`, 58)}
${lines.join('\n')}
\t}`;
}

/** Returns { files: Map, scriptedGuis: [] }; the keys it needs are read from T. */
export async function buildDarkPanels(c) {
  const { T, tags, BLOCS } = c;
  const GOL = tags.GOL;
  const horde = [
    { key: 'zin_dark_horde_temper', h: 26 },
    ...BLOCS.map(b => ({ key: `zin_dark_horde_bloc_${b.key}`, h: 24, font: 'hoi_16mbs' })),
    { key: 'zin_dark_horde_unity', h: 26, rule: true },
    { key: 'zin_dark_horde_border', h: 26 },
    { key: 'zin_dark_horde_holds', h: 26 },
    { key: 'zin_dark_horde_foot', h: 48, font: 'hoi_16mbs' },
  ];
  const accord = [
    { key: 'zin_dark_accord_resolve', h: 26 },
    { key: 'zin_dark_accord_border', h: 26 },
    { key: 'zin_dark_accord_members', h: 26, rule: true },
    { key: 'zin_dark_accord_foot', h: 70, font: 'hoi_16mbs' },
  ];
  const gui = `guiTypes = {\n${windowGui('zin_dark_horde', 116, horde, T)}\n${windowGui('zin_dark_accord', 150, accord, T)}\n}\n`;
  const sg = (id, flagName, visible) => `\t${id} = {
\t\tcontext_type = player_context
\t\twindow_name = "${id}_button_window"
\t\tvisible = { ${visible} }
\t\teffects = {
\t\t\t${id}_toggle_click = {
\t\t\t\tif = { limit = { has_country_flag = ${flagName} } clr_country_flag = ${flagName} }
\t\t\t\telse = { set_country_flag = ${flagName} }
\t\t\t}
\t\t}
\t}
\t${id}_panel = {
\t\tcontext_type = player_context
\t\twindow_name = "${id}_window"
\t\tvisible = { has_country_flag = ${flagName} ${visible} }
\t\teffects = {
\t\t\t${id}_close_click = { clr_country_flag = ${flagName} }
\t\t}
\t}`;
  const scripted = `scripted_gui = {\n${sg('zin_dark_horde', 'zin_dark_horde_open', `original_tag = ${GOL}`)}\n${sg('zin_dark_accord', 'zin_dark_accord_open', 'zin_dark_is_accord_member = yes\n\t\t\tis_faction_leader = yes')}\n}\n`;
  const band = (id, key) => `defined_text = {\n\tname = ${id}\n${[['quiet', 'zin_dark_tension_band_quiet'], ['uneasy', 'zin_dark_tension_band_uneasy'], ['bloody', 'zin_dark_tension_band_bloody'], ['brink', 'zin_dark_tension_band_brink']].map(([k, trig]) => `\ttext = {\n\t\ttrigger = { ${trig} = yes }\n\t\tlocalization_key = ${T.use(`zin_dark_band_${k}`)}\n\t}`).join('\n')}\n}`;
  const files = new Map([
    ['interface/zin_dark_panels.gui', gui],
    ['common/scripted_guis/zin_dark_panels.txt', scripted],
    ['common/scripted_localisation/zin_dark.txt', band('zin_dark_band_name')],
  ]);
  return { files, scriptedGuis: ['zin_dark_horde', 'zin_dark_horde_panel', 'zin_dark_accord', 'zin_dark_accord_panel'] };
}
