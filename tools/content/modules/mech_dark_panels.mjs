// The Horde panel (Goldoroth) and the Accord panel (the Dark Sea Accord's leader) of docs/specs/04_mechanics/dark_lands.md,
// "Interface", under the names of docs/specs/07_interface/01_interface.md section 7a: windows zin_horde_window and zin_accord_window,
// scripted GUIs zin_horde and zin_accord, open flags zin_ui_horde_open and zin_ui_accord_open. Both are read-only: they show the
// mechanic's values and change nothing but their own open flag. Each opens from a small launcher button until the interface module's
// Realm panel takes that place. They use only existing ZIN sprites (GFX_zin_frame, GFX_zin_button, GFX_zin_rule, GFX_closebutton)
// and the vanilla fonts; the sway and member rows are dynamic lists over the arrays zin_dark_refresh_panel_rows keeps.
// The interface module's themed panels (storm and sea frames, gauges, headers) replace these: pass `panels: false` to the builder.
// Art needs (not generated here): GFX_zin_header_horde and GFX_zin_header_accord headers, gauge sprites, a launcher icon.
import { HEADER } from '../lib/mech_kit.mjs';

const SPEC = 'docs/specs/04_mechanics/dark_lands.md';
const FONT = { small: 'hoi_16mbs', mid: 'hoi_18mbs', head: 'hoi_24header' };
const WIDTH = 600, ROW = 22, LIST_W = 520;
const blk = (name, body) => `${name} = {\n${body.split('\n').map(l => (l ? `\t${l}` : l)).join('\n')}\n}`;
const textBox = (name, x, y, w, h, key, font = 'mid', format = 'left') => blk('instantTextBoxType', `name = "${name}"\nposition = { x = ${x} y = ${y} }\nfont = "${FONT[font]}"\ntext = "${key}"\nmaxWidth = ${w}\nmaxHeight = ${h}\nformat = ${format}\nfixedsize = yes`);
const rule = (name, y) => blk('iconType', `name = "${name}"\nspriteType = "GFX_zin_rule"\nposition = { x = 40 y = ${y} }`);

/**
 * One panel: rows of text (with optional elements shown under a trigger), an optional dynamic list, a title, a close button and a
 * launcher. Returns the gui text, the scripted GUI text and the element names it defines.
 */
function panel(o, T) {
  const P = o.prefix, els = [], triggers = [], extra = [];
  let y = 70;
  for (const r of o.rows) {
    if (r.list) {
      const h = r.list.rows * ROW;
      els.push(textBox(`${P}_${r.name}_head`, 44, y, LIST_W, 24, T.use(r.key), 'mid'));
      y += 28;
      els.push(blk('containerWindowType', `name = "${P}_${r.name}_scroll"\nposition = { x = 44 y = ${y} }\nsize = { width = ${LIST_W} height = ${h} }\norientation = upper_left\nscroll_wheel_factor = 40\nsmooth_scrolling = yes\n${blk('gridBoxType', `name = "${P}_${r.name}"\nposition = { x = 0 y = 0 }\nsize = { width = ${LIST_W} height = ${h} }\norientation = upper_left\nslotsize = { width = ${LIST_W} height = ${ROW} }\nformat = "UPPER_LEFT"\nmax_slots_horizontal = 1`)}`));
      extra.push(blk('containerWindowType', `name = "${P}_${r.name}_entry"\nposition = { x = 0 y = 0 }\nsize = { width = ${LIST_W} height = ${ROW} }\n${textBox(`${P}_${r.name}_entry_text`, 0, 0, LIST_W, ROW, T.use(r.list.key), 'small')}`));
      r.list.id = `${P}_${r.name}`;
      y += h + 8;
      continue;
    }
    const h = r.h ?? 26;
    els.push(textBox(`${P}_${r.name}`, 44, y, r.mark ? 400 : LIST_W, h, T.use(r.key), r.font ?? 'mid'));
    if (r.mark) { els.push(textBox(`${P}_${r.name}_mark`, 450, y, 110, h, T.use(r.mark.key), 'small', 'right')); triggers.push(blk(`${P}_${r.name}_mark_visible`, r.mark.when)); }
    y += h + 6;
    if (r.rule) { els.push(rule(`${P}_${r.name}_rule`, y)); y += 10; }
  }
  const height = y + 40;
  const gui = [
    blk('containerWindowType', [`name = "${o.window}"`, `position = { x = ${-WIDTH / 2} y = ${-Math.round(height / 2)} }`, `size = { width = ${WIDTH} height = ${height} }`, 'orientation = center', 'moveable = yes',
      blk('background', `name = "${P}_bg"\nspriteType = "GFX_zin_frame"`),
      textBox(`${P}_title`, 40, 22, WIDTH - 80, 32, T.use(`${P}_title`), 'head', 'centre'),
      blk('buttonType', `name = "${P}_close"\nposition = { x = ${WIDTH - 44} y = 14 }\nquadTextureSprite = "GFX_closebutton"\nshortcut = "ESCAPE"`),
      rule(`${P}_rule_top`, 58), ...els].join('\n')),
    blk('containerWindowType', `name = "${P}_button_window"\nposition = { x = 8 y = ${o.launcherY} }\nsize = { width = 132 height = 30 }\norientation = upper_left\n${blk('buttonType', `name = "${P}_open"\nposition = { x = 0 y = 0 }\nspriteType = "GFX_zin_button"\nbuttonText = "${T.use(`${P}_button`)}"\nbuttonFont = "${FONT.mid}"\npdx_tooltip = "${T.use(`${P}_button_tt`)}"`)}`),
    ...extra,
  ].join('\n');
  const lists = o.rows.filter(r => r.list).map(r => blk(r.list.id, `array = ${r.list.array}\nvalue = v\nindex = i\nchange_scope = yes\nentry_container = "${P}_${r.name}_entry"`));
  const scripted = [
    blk(o.gui, ['context_type = player_context', `window_name = "${o.window}"`, blk('ai_enabled', 'always = no'), blk('visible', `${o.visible}\nhas_country_flag = ${o.flag}`),
      blk('effects', blk(`${P}_close_click`, `clr_country_flag = ${o.flag}`)), triggers.length ? blk('triggers', triggers.join('\n')) : '', lists.length ? blk('dynamic_lists', lists.join('\n')) : ''].filter(Boolean).join('\n')),
    blk(`${o.gui}_launcher`, ['context_type = player_context', `window_name = "${P}_button_window"`, blk('ai_enabled', 'always = no'), blk('visible', o.visible),
      blk('effects', blk(`${P}_open_click`, `if = {\n\tlimit = { has_country_flag = ${o.flag} }\n\tclr_country_flag = ${o.flag}\n}\nelse = {\n${o.closeOthers.map(f => `\tclr_country_flag = ${f}`).join('\n')}\n\tzin_dark_refresh_panel_rows = yes\n\tset_country_flag = ${o.flag}\n}`))].join('\n')),
  ].join('\n');
  return { gui, scripted, window: { window: o.window, gui: o.gui, flag: o.flag, launcher: `${P}_button_window` } };
}

/** Returns { files: Map, scriptedGuis: [], windows: [] }; the keys it needs are read from T. */
export async function buildDarkPanels(c) {
  const { T, tags, BLOCS, N } = c;
  const { GOL } = tags;
  const horde = panel({ prefix: 'zin_horde', gui: 'zin_horde', window: 'zin_horde_window', flag: 'zin_ui_horde_open', closeOthers: ['zin_ui_accord_open'], launcherY: 116, visible: `original_tag = ${GOL}`,
    rows: [
      { name: 'temper', key: 'zin_horde_temper' },
      ...BLOCS.map(b => ({ name: `bloc_${b.key}`, key: `zin_horde_bloc_${b.key}`, h: 24, font: 'small', mark: { key: 'zin_horde_heir', when: `has_country_flag = zin_goldoroth_heir_${b.key}` } })),
      { name: 'unity', key: 'zin_horde_unity', rule: true },
      { name: 'border', key: 'zin_horde_border', rule: true },
      { name: 'sway', key: 'zin_horde_sway_head', list: { array: 'global.zin_dark_sway_rows', key: 'zin_horde_sway_row', rows: N.panel_sway_rows } },
      { name: 'foot', key: 'zin_horde_foot', h: 48, font: 'small' },
    ] }, T);
  const accord = panel({ prefix: 'zin_accord', gui: 'zin_accord', window: 'zin_accord_window', flag: 'zin_ui_accord_open', closeOthers: ['zin_ui_horde_open'], launcherY: 150, visible: 'zin_dark_is_accord_member = yes\nis_faction_leader = yes',
    rows: [
      { name: 'resolve', key: 'zin_accord_resolve' },
      { name: 'border', key: 'zin_accord_border', rule: true },
      { name: 'members', key: 'zin_accord_members', list: { array: 'global.zin_dark_accord_rows', key: 'zin_accord_member_row', rows: N.panel_member_rows } },
      { name: 'foot', key: 'zin_accord_foot', h: 70, font: 'small' },
    ] }, T);
  const indentAll = t => t.split('\n').map(l => (l ? `\t${l}` : l)).join('\n');
  const files = new Map([
    ['interface/zin_dark_panels.gui', `${HEADER('mech_dark_panels', SPEC)}\nguiTypes = {\n${indentAll([horde.gui, accord.gui].join('\n'))}\n}\n`],
    ['common/scripted_guis/zin_dark_panels.txt', `${HEADER('mech_dark_panels', SPEC)}\nscripted_gui = {\n${indentAll([horde.scripted, accord.scripted].join('\n'))}\n}\n`],
  ]);
  return { files, scriptedGuis: ['zin_horde', 'zin_horde_launcher', 'zin_accord', 'zin_accord_launcher'], windows: [horde.window, accord.window] };
}

/**
 * The scripted localisation of the mechanic, written with or without the windows (common/scripted_localisation/zin_dark.txt): the
 * border band word, a country's sway band, and the line of the Free Holds category.
 */
export function darkScriptedLocalisation(c) {
  const { T, tags, N } = c;
  const { GOL } = tags;
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
