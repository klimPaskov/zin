// ZIN's own panels as scripted GUIs (docs/specs/07_interface/01_interface.md sections 3 to 9; design system
// docs/specs/07_interface/07_design_system.md sections 3, 5, 6.2 and 6.4; UI overhaul lane W7). This file holds the shared panel
// layout (class Panel) and three of the panels: the Golden Court (Aenor), the Hidden Council (the Worshipdom; its launcher reads
// "The Hermitage") and the Presence (Zol). modules/mech_powers_ui.mjs, modules/mech_dark_panels.mjs and the Realm part of
// modules/ui.mjs build the other panels with the same class.
//
// Every panel is a Chancery level-0 window (design system section 7): the Chancery frame (GFX_zin_frame), a 40 px title band, the
// mechanic's 4 px accent strip (GFX_zin_accent_<mechanic>), its 600 x 96 header picture (GFX_zin_header_<panel>,
// modules/zin_panel_art.mjs), up to four three-frame tabs (GFX_zin_tab_chancery; the selected tab is drawn as its third frame with
// ink lettering), then a body laid out top to bottom on the 4 px grid, and a footer row for pages. Each tab opens with one primary
// value (section face); every value line carries a tooltip. A meter is the theme's groove (GFX_zin_meter_groove_chancery), a fill
// (GFX_zin_meter_fill_chancery) that slides into a clipping well by the scripted GUI property x, and threshold marks
// (GFX_zin_meter_mark_chancery) at the mechanic's band edges; the exact value is always written on the line above it. Lists are
// fixed rows (ROWS slots per page, country variables zin_ui_row_<n>) with page buttons, so every row is a plain element.
// The panels open from launcher buttons beside the Realm button until the Aoaz bar (lane W1) takes their place.
import { list, blk, format } from './mech_court_lib.mjs';

export const FONT = { small: 'hoi_16mbs', mid: 'hoi_18mbs', section: 'hoi_20bs', head: 'hoi_24header' };
const LINE = { small: 20, mid: 24, section: 28, head: 32 };
// Design system section 3: frame 16, padding 16, title band 40, close 28 inset 8, tabs 32, rows 24, gaps of 4, 8 and 12.
export const LAYOUT = { w: 632, h: 600, frame: 16, x: 32, cw: 568, titleY: 20, accentY: 56, headerY: 60, headerW: 600, headerH: 96, tabsY: 164, tabW: 128, tabH: 32, tabGap: 8, gap: 12, foot: 32 };
// The meter family of C3 (interface/zin_ui.gfx): groove 256 x 16 with a 12 x 4 casing, so the well is 232 x 8; marks 16 x 16.
export const METER = { groove: 'GFX_zin_meter_groove_chancery', fill: 'GFX_zin_meter_fill_chancery', mark: 'GFX_zin_meter_mark_chancery', w: 256, h: 16, inX: 12, inY: 4, inW: 232, inH: 8, markW: 16, row: 16 };
// A fully transparent vanilla texture (gfx/interface/inner_circle/blank_leader_portrait.dds, max alpha 0): the clipping well needs a
// background to clip, and this one draws nothing.
export const CLIP_SPRITE = 'GFX_blank_leader_portrait';
export const ROWS = 10;
export const TAB_SPRITE = 'GFX_zin_tab_chancery', BUTTON_SPRITE = 'GFX_zin_button';
const SELECTED_FRAME = 3;
const g4 = v => Math.round(v / 4) * 4;
// A key derived from another: hub-private keys keep _hub last, so the secrecy scan still reads them as private.
export const sub = (key, s) => (key.endsWith('_hub') ? `${key.slice(0, -4)}${s}_hub` : `${key}${s}`);
const GE = (v, n) => `check_variable = { var = ${v} value = ${n} compare = greater_than_or_equals }`;
// Every panel's open flag, so that opening one closes the others (zin_ui_close_panels of spec 01, until the Aoaz bar owns it).
const ACCENT_TILE = 128;   // width of the accent strips GFX_zin_accent_<mechanic> (gfx/interface/zin/chrome/accent_*.dds, lane C3)
export const PANEL_FLAGS = ['zin_realm_open', 'zin_ui_court_open', 'zin_ui_council_open', 'zin_ui_mistake_open', 'zin_ui_dominion_open', 'zin_ui_watch_open', 'zin_ui_strait_open', 'zin_ui_horde_open', 'zin_ui_accord_open'];
const closeOthers = flag => PANEL_FLAGS.filter(f => f !== flag).map(f => `clr_country_flag = ${f}`).join('\n');
// Panels opened from the Aoaz bar (option `bar`: the panel's key in AOAZ_PANELS of modules/ui.mjs): they write no launcher window of their
// own (spec 01 section 2), so the bar must carry their button. missingBarOpenings(bar) lists every such panel whose button the built bar
// lacks (no click effect zin_aoaz_panel_<key>_click setting the panel's flag); the Realm part of modules/ui.mjs runs it after the bar.
export const BAR_PANELS = new Map();
export function missingBarOpenings(barScriptedGui) {
  const text = barScriptedGui ?? '';
  return [...BAR_PANELS].filter(([key, { flag }]) => {
    const at = text.indexOf(`zin_aoaz_panel_${key}_click = {`);
    if (at < 0) return true;
    const next = text.indexOf('zin_aoaz_panel_', at + 1);
    return !text.slice(at, next < 0 ? undefined : next).includes(`set_country_flag = ${flag}`);
  }).map(([key, { window }]) => `${window} (Aoaz bar panel ${key})`);
}

// The effect that sets a meter's fill offset from its value: the fill strip sits at x = -232 in the well, and this offset moves it
// right, so an unset offset shows an empty meter. scale: 'pct' (0 to 100), 'signed' (-100 to 100) or a number (0 to n).
export function meterFill(value, fillVar, scale = 'pct') {
  const per = scale === 'signed' ? METER.inW / 200 : METER.inW / (scale === 'pct' ? 100 : scale);
  return list(`set_variable = { ${fillVar} = ${value} }`, scale === 'signed' ? `add_to_variable = { ${fillVar} = 100 }` : '', `multiply_variable = { ${fillVar} = ${+per.toFixed(4)} }`, `clamp_variable = { var = ${fillVar} min = 0 max = ${METER.inW} }`);
}
// Fills the fixed rows zin_ui_row_1 .. zin_ui_row_<per> from an array for page zin_ui_page, and the page counters the footer shows:
// zin_ui_rows_shown (rows on this page), zin_ui_pages, zin_ui_page_shown (1-based). The array holds countries.
export function fillRows(array, per = ROWS) {
  return list(
    `set_variable = { zin_ui_rows_total = ${array}^num }`,
    'set_variable = { zin_ui_pages = 0 }', 'set_temp_variable = { zin_ui_left = zin_ui_rows_total }',
    'while_loop_effect = {', 'limit = { check_variable = { zin_ui_left > 0 } }', 'add_to_variable = { zin_ui_pages = 1 }', `subtract_from_temp_variable = { zin_ui_left = ${per} }`, '}',
    'if = {', 'limit = { check_variable = { zin_ui_page > zin_ui_pages } }', 'set_variable = { zin_ui_page = zin_ui_pages }', 'subtract_from_variable = { zin_ui_page = 1 }', '}',
    'clamp_variable = { var = zin_ui_page min = 0 }',
    'set_variable = { zin_ui_page_shown = zin_ui_page }', 'add_to_variable = { zin_ui_page_shown = 1 }',
    'set_temp_variable = { zin_ui_first = zin_ui_page }', `multiply_temp_variable = { zin_ui_first = ${per} }`,
    'set_variable = { zin_ui_rows_shown = zin_ui_rows_total }', 'subtract_from_variable = { zin_ui_rows_shown = zin_ui_first }', `clamp_variable = { var = zin_ui_rows_shown min = 0 max = ${per} }`,
    Array.from({ length: per }, (_, i) => list('set_temp_variable = { zin_ui_at = zin_ui_first }', `add_to_temp_variable = { zin_ui_at = ${i} }`,
      'if = {', 'limit = { check_variable = { zin_ui_at < zin_ui_rows_total } }', `set_variable = { zin_ui_row_${i + 1} = ${array}^zin_ui_at }`, '}')));
}

// defined_text with a fallback: cases are [trigger, key, text]; the last case may have no trigger.
export function definedText(name, cases, loc) {
  const body = cases.map(([trig, key, text]) => { loc.set(key, text); return trig ? `text = {\ntrigger = {\n${trig}\n}\nlocalization_key = ${key}\n}` : `text = { localization_key = ${key} }`; });
  return blk('defined_text', `name = ${name}\n${body.join('\n')}`);
}

const textBox = (id, x, y, w, h, key, font, fmt = 'left', tip) => list('instantTextBoxType = {', `name = "${id}"`, `position = { x = ${x} y = ${y} }`, `font = "${FONT[font]}"`, `text = "${key}"`, `maxWidth = ${w}`, `maxHeight = ${h}`, `format = ${fmt}`, 'fixedsize = yes', tip ? `pdx_tooltip = "${tip}"` : '', '}');

/**
 * One panel. o: { prefix, gui, window, flag, title, titleKey, accent?, header (sprite) | headerImage (scripted localisation name),
 * tabs: [{ key, label, visible? }], refresh?, visible, launcher, launcherKey, launcherTip, launcherVisible, launcherPos?, launcherGui?,
 * launcherWindow?, launcherButton?, toggle?, noLauncher?, bar? (opened from the Aoaz bar: no launcher), launcherTipKey?, h? }. Elements are placed per tab from the top of the body down; `when` adds a visibility
 * trigger. Two texts never share a slot: a line whose wording depends on the state is one element over a defined_text.
 */
export class Panel {
  constructor(o) {
    this.o = { w: LAYOUT.w, h: LAYOUT.h, ...o, ...(o.bar ? { noLauncher: true } : {}) }; this.els = [];
    if (o.bar) BAR_PANELS.set(o.bar, { flag: o.flag, window: o.window }); this.loc = new Map(); this.triggers = new Map(); this.props = new Map(); this.effects = new Map(); this.sprites = new Map(); this.cursor = new Map(); this.pagers = new Set();
    this.bodyY = this.o.tabs.length > 1 ? LAYOUT.tabsY + LAYOUT.tabH + LAYOUT.gap : LAYOUT.tabsY;
    this.bodyEnd = this.o.h - LAYOUT.frame - LAYOUT.gap - LAYOUT.foot - LAYOUT.gap / 3;
  }
  id(name) { return `${this.o.prefix}_${name}`; }
  sprite(name, art) { this.sprites.set(name, art); return name; }
  gate(id, tab, when) {
    const parts = [];
    if (tab && this.o.tabs.length > 1) parts.push(`check_variable = { zin_ui_tab = ${tab} }`);
    if (when) parts.push(when);
    if (parts.length) this.triggers.set(`${id}_visible`, parts.join('\n'));
  }
  // The next free row of a tab (or of the whole body for a one-page panel), and the cursor moved past h plus a gap.
  take(tab, h, gap = 4) {
    const k = this.o.tabs.length > 1 ? tab : 0, y = this.cursor.get(k) ?? this.bodyY;
    if (y + h > this.bodyEnd) throw new Error(`${this.o.window}: tab ${tab} runs past the body (${y + h} > ${this.bodyEnd})`);
    this.cursor.set(k, g4(y + h + gap));
    return y;
  }
  space(tab, h = LAYOUT.gap) { const k = this.o.tabs.length > 1 ? tab : 0; this.cursor.set(k, g4((this.cursor.get(k) ?? this.bodyY) + h)); }
  // A text line. lines: how many lines it may wrap to. tip: the tooltip text (required for a line that shows a value).
  text(name, tab, key, value, { font = 'mid', lines = 1, x = LAYOUT.x, w = LAYOUT.cw, when, tip, fmt = 'left', gap } = {}) {
    const id = this.id(name), h = LINE[font] * lines;
    const y = this.take(tab, h, gap);
    this.loc.set(key, value);
    if (tip) this.loc.set(sub(key, '_tt'), tip);
    this.els.push(textBox(id, x, y, w, h, key, font, fmt, tip ? sub(key, '_tt') : null));
    this.gate(id, tab, when);
    return y;
  }
  // The tab's primary value: one line in the section face, and its meter when it has one.
  primary(name, tab, key, value, tip, meter) {
    if (!tip) throw new Error(`${this.o.window}: the primary value ${name} needs a tooltip`);
    this.text(name, tab, key, value, { font: 'section', tip, gap: meter ? 4 : LAYOUT.gap });
    if (meter) this.meter(name, tab, meter);
  }
  // A labelled value with its meter under it: value line (body face, tooltip) and meter row.
  gauge(name, tab, key, value, tip, meter) {
    if (!tip) throw new Error(`${this.o.window}: the value ${name} needs a tooltip`);
    this.text(name, tab, key, value, { tip, when: meter.when, gap: 4 });
    this.meter(name, tab, meter);
  }
  // A meter row: groove, a clipping well with the fill, threshold marks. m: { fill (variable), marks: [values], scale, when }.
  meter(name, tab, m = {}) {
    this.meterAt(name, tab, m.x ?? LAYOUT.x, this.take(tab, METER.row, LAYOUT.gap) + (METER.row - METER.h) / 2, m);
  }
  // A value and its meter in one 24 px row: the text on the left, the meter at the right edge (short lists such as the blocs).
  rowGauge(name, tab, key, value, tip, meter, { w = LAYOUT.cw - METER.w - 16 } = {}) {
    if (!tip) throw new Error(`${this.o.window}: the value ${name} needs a tooltip`);
    const y = this.text(name, tab, key, value, { tip, w, when: meter.when, gap: 8 });
    this.meterAt(name, tab, LAYOUT.x + LAYOUT.cw - METER.w, y + 4, meter);
    return y;
  }
  meterAt(name, tab, x, gy, { fill, marks = [], scale = 'pct', when } = {}) {
    if (!fill) throw new Error(`${this.o.window}: meter ${name} has no fill variable`);
    const id = this.id(`${name}_meter`);
    const at = v => { const f = scale === 'signed' ? (v + 100) / 200 : v / (scale === 'pct' ? 100 : scale); return g4(METER.inX + f * METER.inW - METER.markW / 2); };
    this.els.push(list('containerWindowType = {', `name = "${id}"`, `position = { x = ${x} y = ${gy} }`, `size = { width = ${METER.w} height = ${METER.h} }`,
      'iconType = {', `name = "${id}_groove"`, `spriteType = "${METER.groove}"`, 'position = { x = 0 y = 0 }', '}',
      'containerWindowType = {', `name = "${id}_well"`, `position = { x = ${METER.inX} y = ${METER.inY} }`, `size = { width = ${METER.inW} height = ${METER.inH} }`, 'clipping = yes',
      'background = {', `name = "${id}_well_bg"`, `spriteType = "${CLIP_SPRITE}"`, '}',
      'containerWindowType = {', `name = "${id}_strip"`, `position = { x = -${METER.inW} y = 0 }`, `size = { width = ${METER.inW * 2} height = ${METER.inH} }`, 'clipping = no',
      'iconType = {', `name = "${id}_fill"`, `spriteType = "${METER.fill}"`, `position = { x = 0 y = 0 }`, '}', '}', '}',
      marks.map((v, i) => list('iconType = {', `name = "${id}_mark_${i + 1}"`, `spriteType = "${METER.mark}"`, `position = { x = ${at(v)} y = 0 }`, '}')), '}'));
    this.props.set(`${id}_fill`, { x: fill });
    this.gate(id, tab, when);
  }
  icon(name, tab, x, y, sprite, { scale = 1, when, tip } = {}) {
    const id = this.id(name);
    if (tip) this.loc.set(`${id}_tt`, tip);
    this.els.push(list('iconType = {', `name = "${id}"`, `spriteType = "${sprite}"`, `position = { x = ${x} y = ${y} }`, scale !== 1 ? `scale = ${scale}` : '', tip ? `pdx_tooltip = "${id}_tt"` : '', '}'));
    this.gate(id, tab, when);
    return id;
  }
  // Fixed rows of a list: a heading row in the label face, then ROWS slots; each slot shows when the page holds that many rows.
  // cols: [{ head, w, text: n => loc text of slot n }]; the row country is ROOT.zin_ui_row_<n>.
  rows(name, tab, { cols, tip, per = ROWS, key }) {
    const head = this.take(tab, LINE.small, 4);
    let x = LAYOUT.x;
    cols.forEach((c, j) => { const k = c.headKey ?? sub(key, `_HEAD_${j + 1}`); this.loc.set(k, c.headKey ? c.head : `§g${c.head}§!`); this.els.push(textBox(this.id(`${name}_head_${j + 1}`), x, head, c.w, LINE.small, k, 'small')); this.gate(this.id(`${name}_head_${j + 1}`), tab); x += c.w + 8; });
    const top = this.take(tab, per * LINE.mid, LAYOUT.gap);
    if (tip) this.loc.set(sub(key, '_tt'), tip);
    for (let n = 1; n <= per; n++) {
      let cx = LAYOUT.x;
      cols.forEach((c, j) => {
        const id = this.id(`${name}_${n}_${j + 1}`), k = sub(key, `_${n}_${j + 1}`);
        this.loc.set(k, c.text(n));
        this.els.push(textBox(id, cx, top + (n - 1) * LINE.mid, c.w, LINE.mid, k, j ? 'small' : 'mid', 'left', tip ? sub(key, '_tt') : null));
        this.gate(id, tab, `check_variable = { zin_ui_rows_shown > ${n - 1} }`);
        cx += c.w + 8;
      });
    }
    this.pagers.add(tab);
  }
  button(name, x, y, key, value, effect, { tab, when, tip } = {}) {
    const id = this.id(name);
    this.loc.set(key, value);
    if (tip) this.loc.set(sub(key, '_tt'), tip);
    this.els.push(list('buttonType = {', `name = "${id}"`, `position = { x = ${x} y = ${y} }`, `spriteType = "${BUTTON_SPRITE}"`, `buttonText = "${key}"`, `buttonFont = "${FONT.small}"`, tip ? `pdx_tooltip = "${sub(key, '_tt')}"` : '', '}'));
    this.effects.set(`${id}_click`, effect);
    this.gate(id, tab, when);
  }
  // The footer of a tab with rows: "Page n of m" and the two page buttons, right-aligned (design system section 3 rule 2).
  footer() {
    const o = this.o, P = o.prefix, y = o.h - LAYOUT.frame - LAYOUT.gap - LAYOUT.foot, refresh = o.refresh ? `\n${o.refresh} = yes` : '';
    for (const tab of this.pagers) {
      const sfx = this.pagers.size > 1 ? `_${tab}` : '', more = 'check_variable = { zin_ui_pages > 1 }';
      this.loc.set(sub(o.titleKey, '_PAGE'), 'Page §Y[?ROOT.zin_ui_page_shown|0]§! of §Y[?ROOT.zin_ui_pages|0]§!');
      this.loc.set(`${sub(o.titleKey, '_PAGE_tt')}`, 'The list is longer than one page. The buttons turn the pages.');
      this.els.push(textBox(this.id(`page${sfx}`), LAYOUT.x, y + 8, 240, LINE.small, sub(o.titleKey, '_PAGE'), 'small', 'left', sub(o.titleKey, '_PAGE_tt')));
      this.gate(this.id(`page${sfx}`), tab, more);
      const nx = o.w - LAYOUT.x - 132, px = nx - 8 - 132;
      this.button(`page_prev${sfx}`, px, y, sub(o.titleKey, '_PREV'), 'Previous', `if = {\nlimit = { check_variable = { zin_ui_page > 0 } }\nsubtract_from_variable = { zin_ui_page = 1 }\n}${refresh}`, { tab, when: more });
      this.button(`page_next${sfx}`, nx, y, sub(o.titleKey, '_NEXT'), 'Next', `set_temp_variable = { zin_ui_last = zin_ui_pages }\nsubtract_from_temp_variable = { zin_ui_last = 1 }\nif = {\nlimit = { check_variable = { zin_ui_page < zin_ui_last } }\nadd_to_variable = { zin_ui_page = 1 }\n}${refresh}`, { tab, when: more });
      this.triggers.set(`${this.id(`page_prev${sfx}`)}_click_enabled`, 'check_variable = { zin_ui_page > 0 }');
      this.triggers.set(`${this.id(`page_next${sfx}`)}_click_enabled`, 'set_temp_variable = { zin_ui_last = zin_ui_pages }\nsubtract_from_temp_variable = { zin_ui_last = 1 }\ncheck_variable = { zin_ui_page < zin_ui_last }');
    }
  }
  render() {
    const o = this.o, P = o.prefix, L = LAYOUT;
    this.footer();
    this.loc.set(o.titleKey, o.title);
    if (!o.noLauncher) {
      this.loc.set(o.launcherKey, o.launcher);
      this.loc.set((o.launcherTipKey ?? sub(o.launcherKey, '_tt')), o.launcherTip);
    }
    const refresh = o.refresh ? `\n${o.refresh} = yes` : '';
    const tabs = o.tabs.length > 1 ? o.tabs.map((t, i) => {
      const id = `${P}_tab_${i + 1}`, x = L.x + i * (L.tabW + L.tabGap), on = `check_variable = { zin_ui_tab = ${i + 1} }`;
      this.loc.set(t.key, t.label);
      this.loc.set(sub(t.key, '_ON'), `§b${t.label}§!`);
      this.loc.set(sub(t.key, '_tt'), t.tip ?? `Show ${t.label.replace(/^The /, 'the ')}.`);
      this.effects.set(`${id}_click`, `set_variable = { zin_ui_tab = ${i + 1} }\nset_variable = { zin_ui_page = 0 }${refresh}`);
      this.triggers.set(`${id}_visible`, list(`NOT = { ${on} }`, t.visible));
      this.triggers.set(`${id}_on_visible`, list(on, t.visible));
      this.triggers.set(`${id}_on_text_visible`, list(on, t.visible));
      return list('buttonType = {', `name = "${id}"`, `position = { x = ${x} y = ${L.tabsY} }`, `spriteType = "${TAB_SPRITE}"`, `buttonText = "${t.key}"`, `buttonFont = "${FONT.small}"`, `pdx_tooltip = "${sub(t.key, '_tt')}"`, '}',
        'iconType = {', `name = "${id}_on"`, `spriteType = "${TAB_SPRITE}"`, `frame = ${SELECTED_FRAME}`, `position = { x = ${x} y = ${L.tabsY} }`, '}',
        textBox(`${id}_on_text`, x, L.tabsY + 8, L.tabW, LINE.small, sub(t.key, '_ON'), 'small', 'centre'));
    }) : [];
    const header = list('iconType = {', `name = "${P}_header"`, `spriteType = "${o.header}"`, `position = { x = ${L.frame} y = ${L.headerY} }`, '}');
    if (o.headerImage) this.props.set(`${P}_header`, { image: `"[${o.headerImage}]"` });
    // The accent texture is a 128 x 4 strip, and a plain sprite is drawn at its own size, never stretched: tiled across the header
    // width in a container that clips the last tile.
    const tiles = Array.from({ length: Math.ceil(L.headerW / ACCENT_TILE) }, (_, i) => list('iconType = {', `name = "${P}_accent_${i + 1}"`, `spriteType = "${o.accent}"`, `position = { x = ${i * ACCENT_TILE} y = 0 }`, 'alwaystransparent = yes', '}'));
    const accent = o.accent ? list('containerWindowType = {', `name = "${P}_accent"`, `position = { x = ${L.frame} y = ${L.accentY} }`, `size = { width = ${L.headerW} height = 4 }`, 'clipping = yes', 'background = {', `name = "${P}_accent_bg"`, `spriteType = "${CLIP_SPRITE}"`, '}', tiles, '}') : '';
    const lp = o.launcherPos ?? [148, 88], lw = o.launcherWindow ?? `${P}_button_window`, lb = o.launcherButton ?? `${P}_open`;
    const gui = list(
      'containerWindowType = {', `name = "${o.window}"`, `position = { x = ${-o.w / 2} y = ${-o.h / 2} }`, `size = { width = ${o.w} height = ${o.h} }`, 'orientation = center', 'moveable = yes',
      'background = {', `name = "${P}_bg"`, 'spriteType = "GFX_zin_frame"', '}',
      textBox(`${P}_title`, L.x + 16, L.titleY, L.cw - 32, LINE.head, o.titleKey, 'head', 'centre'),
      'buttonType = {', `name = "${P}_close"`, `position = { x = ${o.w - 36} y = 8 }`, 'quadTextureSprite = "GFX_closebutton"', 'shortcut = "ESCAPE"', `pdx_tooltip = "${sub(o.titleKey, '_CLOSE_tt')}"`, '}',
      accent, header, tabs, this.els, '}',
      o.noLauncher ? '' : list('containerWindowType = {', `name = "${lw}"`, `position = { x = ${lp[0]} y = ${lp[1]} }`, 'size = { width = 132 height = 32 }', 'orientation = upper_left',
        'buttonType = {', `name = "${lb}"`, 'position = { x = 0 y = 0 }', `spriteType = "${BUTTON_SPRITE}"`, `buttonText = "${o.launcherKey}"`, `buttonFont = "${FONT.mid}"`, `pdx_tooltip = "${(o.launcherTipKey ?? sub(o.launcherKey, '_tt'))}"`, '}', '}'));
    this.loc.set(sub(o.titleKey, '_CLOSE_tt'), 'Close this window.');
    this.effects.set(`${P}_close_click`, `clr_country_flag = ${o.flag}`);
    const open = list(closeOthers(o.flag), `set_country_flag = ${o.flag}`, 'set_variable = { zin_ui_tab = 1 }', 'set_variable = { zin_ui_page = 0 }', o.refresh ? `${o.refresh} = yes` : '');
    const launch = o.toggle ? `if = {\nlimit = { has_country_flag = ${o.flag} }\nclr_country_flag = ${o.flag}\n}\nelse = {\n${open}\n}` : open;
    const effects = [...this.effects].map(([n, b]) => blk(n, b)).join('\n');
    const triggers = [...this.triggers].map(([n, b]) => blk(n, b)).join('\n');
    const props = [...this.props].map(([n, p]) => blk(n, Object.entries(p).map(([a, v]) => `${a} = ${v}`).join('\n'))).join('\n');
    const window = blk(o.gui, list('context_type = player_context', `window_name = "${o.window}"`, 'dirty = zin_ui_tick', 'ai_enabled = { always = no }',
      blk('visible', `${o.visible}\nhas_country_flag = ${o.flag}`), blk('effects', effects), triggers ? blk('triggers', triggers) : '', props ? blk('properties', props) : ''));
    const launcher = blk(o.launcherGui ?? `${o.gui}_launcher`, list('context_type = player_context', `window_name = "${lw}"`, 'dirty = zin_ui_tick', 'ai_enabled = { always = no }',
      blk('visible', o.launcherVisible), blk('effects', blk(`${lb}_click`, launch))));
    return { gui: format(gui), scripted: o.noLauncher ? window : `${window}\n${launcher}` };
  }
}

// The sprites a panel may draw besides those it registers itself: the ZIN chrome of interface/zin_ui.gfx (lane C3), the header pictures
// of interface/zin_panels.gfx, the people emblems, the vanilla close button and the transparent clipping sprite.
export const isPanelChrome = s => /^GFX_zin_(frame|button|tab_chancery|meter_(groove|fill|mark)_chancery|accent_[a-z]+|header_[a-z_]+|people_strip)$/.test(s) || s === 'GFX_closebutton' || s === CLIP_SPRITE;
// The layout grid of a rendered panel: every number a .gui file of this class writes for position and size is a multiple of 4.
export const onGrid = gui => !/\b(?:x|y|width|height) = (?:NaN|undefined)\b/.test(gui) && [...gui.matchAll(/\b(?:x|y|width|height) = (-?\d+)/g)].every(m => Number(m[1]) % 4 === 0);

// =========================================================================================================== Aenor
const D_CHARTERS = [['golden', 'Golden Charter'], ['shield', 'Shield Charter'], ['free', 'Free Charter'], ['wall', 'Wall Charter'], ['old', 'Old Charter']];
function courtPanel(D) {
  const R = D?.rates ?? {};
  const p = new Panel({ prefix: 'zin_court', gui: 'zin_court', window: 'zin_court_window', flag: 'zin_ui_court_open', bar: 'court',title: 'The Golden Court', titleKey: 'ZIN_COURT_TITLE', accent: 'GFX_zin_accent_court', header: 'GFX_zin_header_court',
    launcher: 'Golden Court', launcherKey: 'ZIN_COURT_BUTTON', launcherTip: 'Open the account of the court, the Concord and the succession.',
    visible: 'zin_aenor_is_realm = yes', launcherVisible: 'zin_aenor_is_realm = yes', refresh: 'zin_aenor_ui_refresh',
    tabs: [{ key: 'ZIN_COURT_TAB1', label: 'The Court', tip: 'The court, the temples and the Lost Cause.' }, { key: 'ZIN_COURT_TAB2', label: 'The Concord', tip: 'The dominions of the Concord, their charters and their loyalty.' },
      { key: 'ZIN_COURT_TAB3', label: 'The Empty Throne', visible: 'has_global_flag = zin_golden_king_dead', tip: 'The camps that contend for the seals.' }, { key: 'ZIN_COURT_TAB4', label: 'The Crown', visible: 'has_global_flag = zin_eindil_returned', tip: 'What the crowning of a chosen king still waits for.' }] });
  // 1: the court
  p.primary('corr', 1, 'ZIN_COURT_T1_CORR', 'The Golden Court: §Y[?ROOT.zin_court_corruption|0]§! of 100. [ROOT.zin_court_corr_word]',
    `How far offices, titles and charters are for sale. Below ${R.honestAt ?? 30} the court is honest; from ${R.gildedAt ?? 80} it is Gilded Rot.`, { fill: 'zin_ui_corr_fill', marks: [R.honestAt ?? 30, R.gildedAt ?? 80] });
  p.gauge('temple', 1, 'ZIN_COURT_T1_TEMPLE', '[ROOT.zin_court_temple_line]', 'How many offices are held by friends of the temples. The marks show where their hold on the court grows.', { fill: 'zin_ui_temple_fill', marks: [R.brokenAt ?? 15, R.falteringAt ?? 35, R.dominantAt ?? 70] });
  p.space(1, 8);
  p.gauge('cause', 1, 'ZIN_COURT_T1_CAUSE', 'The Lost Cause: §Y[?ROOT.zin_aenor_lost_cause|0]§! of 100. [ROOT.zin_court_cause_path]', 'The strength of the King\'s army of the Lost Cause, and what it serves.', { fill: 'zin_ui_cause_fill' });
  p.space(1, 8);
  p.text('health', 1, 'ZIN_COURT_T1_HEALTH', 'The King\'s health: §Y[ROOT.zin_court_health_word]§!', { when: 'has_country_flag = zin_aenor_royal_physicians\nzin_aenor_king_alive = yes', tip: 'The royal physicians report on the Golden King.', gap: LAYOUT.gap });
  p.text('note', 1, 'ZIN_COURT_T1_NOTE', 'Offices, titles and charters are bought in the palace district of Parim. The temples help, and the court takes what it can. The kingdom runs on the habits of seventeen centuries.', { font: 'small', lines: 3 });
  // 2: the Concord
  p.primary('avg', 2, 'ZIN_COURT_T2_AVG', 'The Concord: §Y[?ROOT.zin_aenor_concord_avg|0]§! mean loyalty',
    'Dominions by loyalty: steadfast §Y[?ROOT.zin_ui_n_steadfast|0]§!, loyal §Y[?ROOT.zin_ui_n_loyal|0]§!, restless §Y[?ROOT.zin_ui_n_restless|0]§!, defiant §Y[?ROOT.zin_ui_n_defiant|0]§!.');
  p.rows('dominions', 2, { key: 'ZIN_COURT_ROW', tip: 'A dominion of the Concord: its charter and its loyalty to the crown.', cols: [
    { head: 'Dominion', w: 248, text: n => `§Y[ROOT.zin_ui_row_${n}.GetNameDef]§!` },
    { head: 'Charter', w: 148, text: n => `[ROOT.zin_ui_row_${n}.zin_court_charter_word]` },
    { head: 'Loyalty', w: 156, text: n => `[ROOT.zin_ui_row_${n}.zin_court_loyalty_word]` }] });
  // 3: the Empty Throne
  p.primary('ruling', 3, 'ZIN_COURT_T3_RULING', 'The seals are held by [ROOT.zin_court_ruling_word].', 'Who rules in Parim while the throne is empty.');
  const camps = [['court', 'The Golden Court'], ['faithful', '[ROOT.zin_court_faithful_name]'], ['dominions', 'The Free Dominions'], ['host', '[ROOT.zin_court_host_name]']];
  for (const [c, label] of camps) {
    const when = c === 'host' ? 'zin_aenor_host_available = yes' : undefined;
    p.gauge(`c_${c}`, 3, `ZIN_COURT_T3_${c.toUpperCase()}`, `${label}: §Y[?ROOT.zin_aenor_camp_${c}|0]§! of 100`, `A camp's strength. At ${R.campRise ?? 30} it rises in arms unless it holds the seals; at ${R.campRival ?? 50} it can contend for them.`, { fill: `zin_ui_${c}_fill`, marks: [R.campRise ?? 30, R.campRival ?? 50], when });
  }
  p.text('thirty', 3, 'ZIN_COURT_T3_THIRTY', `A camp that reaches ${R.campRise ?? 30} rises in arms if it does not hold the seals. Below ${R.campRise ?? 30} it is silenced.`, { font: 'small', lines: 2, when: 'has_country_flag = zin_aenor_thirty_days' });
  // 4: the Crown
  p.primary('crown_head', 4, 'ZIN_COURT_T4_HEAD', 'The Crown of Aen waits for a king the people choose.', 'Every line below must read "yes" before the crowning.');
  const ticks = { afrit_dead: 'The false god is dead', named: 'The stranger has a name', returned: 'He has come back from the West', parim: 'This realm holds Parim', date: 'The day of the crowning has come' };
  for (const [k, t] of Object.entries(ticks)) p.text(`crown_${k}`, 4, `ZIN_COURT_T4_${k.toUpperCase()}`, `${t}: §Y[ROOT.zin_court_tick_${k}]§!`, { tip: `${t}: one condition of the crowning.` });
  return p;
}

function courtLoc(loc) {
  const words = [
    definedText('zin_court_corr_word', [['zin_aenor_court_gilded = yes', 'ZIN_COURT_CORR_GILDED', 'Gilded Rot'], ['zin_aenor_court_honest = yes', 'ZIN_COURT_CORR_HONEST', 'An honest court'], [null, 'ZIN_COURT_CORR_MID', 'The ordinary rot']], loc),
    // One line, two wordings: the temples' favour until the hand behind them is known (never two texts in one place).
    definedText('zin_court_temple_line', [['zin_aenor_hand_known = yes', 'ZIN_COURT_T1_HAND', 'The Hidden Hand: §Y[?ROOT.zin_council_influence|0]§! of 100. The offices held by one will behind the temples.'], [null, 'ZIN_COURT_T1_TEMPLE_FAVOUR', 'Temple Favour: §Y[?ROOT.zin_council_influence|0]§! of 100. How many offices are held by friends of the temples.']], loc),
    definedText('zin_court_cause_path', [['has_global_flag = zin_lost_cause_with_eindil', 'ZIN_COURT_PATH_EINDIL', 'It follows the stranger.'], ['has_global_flag = zin_lost_cause_shield', 'ZIN_COURT_PATH_SHIELD', 'It is the shield of the Concord.'], [null, 'ZIN_COURT_PATH_ORNAMENT', 'It is the King\'s ornament.']], loc),
    definedText('zin_court_health_word', [['check_variable = { zin_aenor_king_health = 2 }', 'ZIN_COURT_HEALTH_2', 'failing'], ['check_variable = { zin_aenor_king_health = 1 }', 'ZIN_COURT_HEALTH_1', 'tired'], [null, 'ZIN_COURT_HEALTH_0', 'sound']], loc),
    definedText('zin_court_ruling_word', [['zin_aenor_ruled_by_court = yes', 'ZIN_COURT_RULE_1', 'the Regency of the Golden Court'], ['zin_aenor_ruled_by_faithful = yes', 'ZIN_COURT_RULE_2', 'the temples and the throne they chose'], ['zin_aenor_ruled_by_dominions = yes', 'ZIN_COURT_RULE_3', 'the Speaker of the Concord'], ['zin_aenor_ruled_by_host = yes', 'ZIN_COURT_RULE_4', 'the king the host hailed'], ['zin_aenor_ruled_by_captains = yes', 'ZIN_COURT_RULE_5', 'the Captains\' Regency'], [null, 'ZIN_COURT_RULE_0', 'the Golden King']], loc),
    definedText('zin_court_faithful_name', [['has_global_flag = zin_afrit_revealed', 'ZIN_COURT_FAITHFUL_REVEALED_hub', 'Afrit\'s Supporters'], [null, 'ZIN_COURT_FAITHFUL', 'The Deliverer\'s Faithful']], loc),
    definedText('zin_court_host_name', [['has_global_flag = zin_eindil_named', 'ZIN_COURT_HOST_NAMED', 'Eindil\'s Host'], [null, 'ZIN_COURT_HOST', 'The Stranger\'s Host']], loc),
    definedText('zin_court_charter_word', D_CHARTERS.map(([k, n], i) => [i < D_CHARTERS.length - 1 ? `has_idea = zin_concord_charter_${k}` : null, `ZIN_COURT_CHARTER_${k.toUpperCase()}`, n]), loc),
    definedText('zin_court_loyalty_word', [['has_country_flag = zin_aenor_free_dominion', 'ZIN_COURT_LOY_FREE', '§ga free dominion§!'], ['OVERLORD = { has_country_flag = zin_aenor_envoys }\ncheck_variable = { zin_concord_loyalty > 0 }', 'ZIN_COURT_LOY_EXACT', 'loyalty §Y[?This.zin_concord_loyalty|0]§!'], ['zin_aenor_dominion_steadfast = yes', 'ZIN_COURT_LOY_STEADFAST', 'steadfast'], ['zin_aenor_dominion_loyal = yes', 'ZIN_COURT_LOY_LOYAL', 'loyal'], ['zin_aenor_dominion_restless = yes', 'ZIN_COURT_LOY_RESTLESS', '§Orestless§!'], [null, 'ZIN_COURT_LOY_DEFIANT', '§Rdefiant§!']], loc),
  ];
  const yesNo = (name, trig) => definedText(`zin_court_tick_${name}`, [[trig, `ZIN_COURT_TICK_${name.toUpperCase()}_Y`, 'yes'], [null, `ZIN_COURT_TICK_${name.toUpperCase()}_N`, 'not yet']], loc);
  words.push(yesNo('afrit_dead', 'has_global_flag = zin_afrit_dead'), yesNo('named', 'has_global_flag = zin_eindil_named'), yesNo('returned', 'has_global_flag = zin_eindil_returned'), yesNo('parim', 'any_controlled_state = { zin_is_site_parim = yes }'), yesNo('date', 'zin_aenor_date_coronation = yes'));
  return words.join('\n');
}

function courtRefresh() {
  const meters = [['zin_court_corruption', 'zin_ui_corr_fill'], ['zin_council_influence', 'zin_ui_temple_fill'], ['zin_aenor_lost_cause', 'zin_ui_cause_fill'], ['zin_aenor_camp_court', 'zin_ui_court_fill'], ['zin_aenor_camp_faithful', 'zin_ui_faithful_fill'], ['zin_aenor_camp_dominions', 'zin_ui_dominions_fill'], ['zin_aenor_camp_host', 'zin_ui_host_fill']];
  return list(
    '# Recomputes what the Golden Court panel shows for a realm. Pure formatting: it never changes a mechanic variable.',
    'add_to_variable = { zin_ui_tick = 1 }',
    'if = {', 'limit = { zin_aenor_is_realm = yes }', meters.map(([v, x]) => meterFill(v, x)),
    'clear_array = zin_aenor_dominion_list', ['steadfast', 'loyal', 'restless', 'defiant'].map(b => `set_variable = { zin_ui_n_${b} = 0 }`),
    'every_subject_country = {', 'limit = { zin_aenor_is_concord_dominion = yes }',
    'if = {', 'limit = { zin_aenor_dominion_steadfast = yes }', 'PREV = { add_to_variable = { zin_ui_n_steadfast = 1 } }', '}',
    'else_if = {', 'limit = { zin_aenor_dominion_loyal = yes }', 'PREV = { add_to_variable = { zin_ui_n_loyal = 1 } }', '}',
    'else_if = {', 'limit = { zin_aenor_dominion_restless = yes }', 'PREV = { add_to_variable = { zin_ui_n_restless = 1 } }', '}',
    'else = {', 'PREV = { add_to_variable = { zin_ui_n_defiant = 1 } }', '}',
    'PREV = { add_to_array = { zin_aenor_dominion_list = PREV } }', '}',
    fillRows('zin_aenor_dominion_list'), '}');
}

// =========================================================================================================== Afrit
const SEATS = [['seals', 'Seals', 'Merovan keeps the seals of Aenor.'], ['censers', 'Censers', 'Ilvane keeps the temples and the public face.'], ['whispers', 'Whispers', 'Corvel keeps the couriers and the foreign agents.'], ['relics', 'Relics', 'The Reliquary keeps the artifacts.']];
const SEAT_MAX = 5, VEIL_THINS = 30;
function councilPanel() {
  const p = new Panel({ prefix: 'zin_council', gui: 'zin_council', window: 'zin_council_window', flag: 'zin_ui_council_open', bar: 'council',title: 'The Hidden Council', titleKey: 'ZIN_COUNCIL_TITLE_hub', accent: 'GFX_zin_accent_council', header: 'GFX_zin_header_council',
    launcher: 'The Hermitage', launcherKey: 'ZIN_COUNCIL_BUTTON', launcherTip: 'Open the ledgers of the hermitage.',
    visible: 'zin_afrit_is_hub = yes\nNOT = { has_global_flag = zin_afrit_dead }', launcherVisible: 'zin_afrit_is_hub = yes\nNOT = { has_global_flag = zin_afrit_dead }', refresh: 'zin_afrit_ui_refresh',
    tabs: [{ key: 'ZIN_COUNCIL_TAB1_hub', label: 'The Veil', tip: 'The secret and the King\'s end.' }, { key: 'ZIN_COUNCIL_TAB2_hub', label: 'The Four Seats', tip: 'The four seats of the Council and their levels.' }, { key: 'ZIN_COUNCIL_TAB3_hub', label: 'The Relics', tip: 'The four artifacts of the hermitage.' }, { key: 'ZIN_COUNCIL_TAB4_hub', label: 'The Houses', tip: 'The Houses of the First Light and how deep they reach.' }] });
  p.primary('veil', 1, 'ZIN_COUNCIL_T1_VEIL_hub', '[ROOT.zin_council_veil_line]', `Charity and discretion raise the Veil; risky work lowers it. Below ${VEIL_THINS} the courts of the Light begin to watch the Houses. At 0 the name is spoken.`, { fill: 'zin_ui_veil_fill', marks: [VEIL_THINS], when: 'zin_afrit_secret_kept = yes' });
  p.gauge('plot', 1, 'ZIN_COUNCIL_T1_PLOT_hub', 'The King\'s end is prepared to §Y[?global.zin_afrit_regicide_plot|0]§! of 100.', 'How far the preparations for the Golden King\'s death have come.', { fill: 'zin_ui_plot_fill', when: 'NOT = { has_global_flag = zin_golden_king_dead }' });
  p.space(1, 8);
  p.text('veil_note', 1, 'ZIN_COUNCIL_T1_NOTE_hub', `Below ${VEIL_THINS} the Veil thins and the courts of the Light begin to watch the Houses. At 0 the name is spoken. The Council plays a patient game: charity and discretion raise the Veil, risky work lowers it.`, { font: 'small', lines: 3 });
  p.primary('seats', 2, 'ZIN_COUNCIL_T2_TOTAL_hub', 'The Four Seats: §Y[?ROOT.zin_ui_seats_total|0]§! of 20 levels', 'The sum of the levels of the four seats. Each seat rises to level 5.');
  for (const [s, name, line] of SEATS) {
    p.gauge(`seat_${s}`, 2, `ZIN_COUNCIL_T2_${s.toUpperCase()}_hub`, `The Seat of ${name}: level §Y[?global.zin_afrit_seat_${s}|0]§! of ${SEAT_MAX}`, `${line} Each level adds the effect the seat gives.`, { fill: `zin_ui_seat_${s}_fill`, scale: SEAT_MAX });
    p.space(2, 4);
  }
  p.primary('graces', 3, 'ZIN_COUNCIL_T3_GRACES_hub', 'Artifacts held: §Y[?global.zin_afrit_artifacts|0]§! of 4', 'An artifact is held, held and attuned, or lost. A lost artifact does not come back.');
  [['necklace', 'The Necklace of the Abyss', 'necklace_deep'], ['ring', 'The Ring of Doors', 'ring_doors'], ['crown', 'The Crown of Witnesses', 'crown_witnesses'], ['bracelet', 'The Bracelet of the First Seal', 'bracelet_seal']].forEach(([a, name, art]) => {
    p.sprite(`GFX_zin_council_${a}`, art);
    const y = p.text(`art_${a}_t`, 3, `ZIN_COUNCIL_T3_${a.toUpperCase()}_hub`, `${name}: §Y[ROOT.zin_council_artifact_${a}]§!`, { x: LAYOUT.x + 44, w: LAYOUT.cw - 44, tip: `${name}: whether the hermitage holds it.`, gap: 16 });
    p.icon(`art_${a}`, 3, LAYOUT.x, y - 4, `GFX_zin_council_${a}`, { scale: 0.5, when: `NOT = { has_global_flag = zin_afrit_lost_${a} }` });
  });
  p.primary('houses_n', 4, 'ZIN_COUNCIL_T4_COUNT_hub', 'The Houses: §Y[?ROOT.zin_ui_houses|0]§! realms', 'Houses by depth: one §Y[?ROOT.zin_ui_h1|0]§!, two §Y[?ROOT.zin_ui_h2|0]§!, three §Y[?ROOT.zin_ui_h3|0]§!, four §Y[?ROOT.zin_ui_h4|0]§!, five §Y[?ROOT.zin_ui_h5|0]§!. The map mode "Houses of the First Light" shows every house by depth.');
  p.rows('houses', 4, { key: 'ZIN_COUNCIL_ROW_hub', tip: 'One of the deepest houses: its depth (1 to 5) and whether the realm watches it.', cols: [
    { head: 'Realm', w: 300, text: n => `§Y[ROOT.zin_ui_row_${n}.GetNameDef]§!` },
    { head: 'Depth', w: 100, text: n => `§Y[?ROOT.zin_ui_row_${n}.zin_footholds|0]§!` },
    { head: 'Watched', w: 152, text: n => `[ROOT.zin_ui_row_${n}.zin_council_suspicion_word]` }] });
  return p;
}
function councilLoc(loc) {
  const art = a => definedText(`zin_council_artifact_${a}`, [[`has_global_flag = zin_afrit_lost_${a}`, `ZIN_COUNCIL_ART_${a.toUpperCase()}_LOST_hub`, 'lost'], [`has_global_flag = zin_afrit_attuned_${a}`, `ZIN_COUNCIL_ART_${a.toUpperCase()}_ATTUNED_hub`, 'held and attuned'], [null, `ZIN_COUNCIL_ART_${a.toUpperCase()}_HELD_hub`, 'held']], loc);
  return [...['necklace', 'ring', 'crown', 'bracelet'].map(art),
    definedText('zin_council_veil_line', [['has_global_flag = zin_afrit_revealed', 'ZIN_COUNCIL_T1_KNOWN_hub', 'The name is known. The Veil is gone.'], [null, 'ZIN_COUNCIL_T1_VEILED_hub', 'The Veil: §Y[?global.zin_afrit_veil|0]§! of 100. Last month: §Y[?global.zin_afrit_veil_last_change|0]§!.']], loc),
    definedText('zin_council_suspicion_word', [['has_country_flag = zin_afrit_suspicious', 'ZIN_COUNCIL_SUSPECT_hub', '§Owatched§!'], [null, 'ZIN_COUNCIL_NOSUSPECT_hub', 'unwatched']], loc)].join('\n');
}
function afritRefresh() {
  const hs = [1, 2, 3, 4].map(n => `else_if = {\nlimit = { check_variable = { zin_footholds = ${n + 1} } }\nPREV = { add_to_variable = { zin_ui_h${n + 1} = 1 } }\n}`);
  return list(
    '# Recomputes what the Hidden Council panel shows for the hub. Pure formatting: it never changes a mechanic variable.',
    'add_to_variable = { zin_ui_tick = 1 }', meterFill('global.zin_afrit_veil', 'zin_ui_veil_fill'), meterFill('global.zin_afrit_regicide_plot', 'zin_ui_plot_fill'),
    'set_variable = { zin_ui_seats_total = 0 }', SEATS.map(([s]) => list(meterFill(`global.zin_afrit_seat_${s}`, `zin_ui_seat_${s}_fill`, SEAT_MAX), `add_to_variable = { zin_ui_seats_total = global.zin_afrit_seat_${s} }`)),
    'if = {', 'limit = { has_country_flag = zin_ui_council_open }',
    [1, 2, 3, 4, 5].map(n => `set_variable = { zin_ui_h${n} = 0 }`), 'set_variable = { zin_ui_houses = 0 }', 'clear_array = zin_afrit_houses_list', 'set_temp_variable = { zin_nl = 0 }',
    'every_country = {', 'limit = { check_variable = { zin_footholds > 0 } }', 'PREV = { add_to_variable = { zin_ui_houses = 1 } }',
    'if = {', 'limit = { check_variable = { zin_footholds = 1 } }', 'PREV = { add_to_variable = { zin_ui_h1 = 1 } }', '}', hs.slice(0, 3).join('\n'),
    'else = {', 'PREV = { add_to_variable = { zin_ui_h5 = 1 } }', '}',
    'if = {', `limit = {\ncheck_variable = { zin_footholds > 3 }\ncheck_variable = { zin_nl < ${ROWS} }\n}`, 'PREV = { add_to_array = { zin_afrit_houses_list = PREV } }', 'add_to_temp_variable = { zin_nl = 1 }', '}', '}',
    fillRows('zin_afrit_houses_list'), '}');
}

// =========================================================================================================== Zol
const ORDERS = [['great', 'The Great Spirits', 'order_great'], ['lesser', 'The Lesser Spirits', 'order_lesser'], ['divine', 'The New Gods', 'order_divine']];
const BOND_MAX = 5, PRESENCE_MARKS = [15, 25, 50, 75];
function presencePanel() {
  const p = new Panel({ prefix: 'zin_mistake', gui: 'zin_panel_mistake', window: 'zin_mistake_window', flag: 'zin_ui_mistake_open', bar: 'mistake',title: 'The Presence', titleKey: 'ZIN_MISTAKE_TITLE', accent: 'GFX_zin_accent_presence', header: 'GFX_zin_header_mistake',
    launcher: 'The Presence', launcherKey: 'ZIN_MISTAKE_BUTTON', launcherTip: 'Open the account of the Presence.',
    visible: 'zin_is_zol = yes', launcherVisible: 'zin_is_zol = yes', refresh: 'zin_zol_ui_refresh', tabs: [{ key: 'ZIN_MISTAKE_TAB1', label: 'The Presence' }] });
  p.primary('power', 1, 'ZIN_MISTAKE_POWER', '[ROOT.zin_mistake_power_line]', 'How much of his presence can act in Aoaz. Not his whole power, which no one has measured.', { fill: 'zin_ui_power_fill', marks: PRESENCE_MARKS, when: 'NOT = { has_country_flag = zin_zol_presence_lapsed }' });
  p.text('serve', 1, 'ZIN_MISTAKE_SERVE', 'Those who serve', { font: 'small', gap: 4 });
  for (const [o, name, art] of ORDERS) {
    p.sprite(`GFX_zin_mistake_${o}`, art);
    p.gauge(`bond_${o}`, 1, `ZIN_MISTAKE_BOND_${o.toUpperCase()}`, `${name}: bond §Y[?ROOT.zin_zol_bond_${o}|0]§! of ${BOND_MAX}`, `How closely ${name.replace(/^The /, 'the ')} are bound to the Presence.`, { fill: `zin_ui_bond_${o}_fill`, scale: BOND_MAX });
  }
  p.space(1, 4);
  p.text('isles', 1, 'ZIN_MISTAKE_ISLES', 'The black isles that stir: §Y[?ROOT.zin_zol_islands_stirring|0]§!. Hosts raised: §Y[?ROOT.zin_zol_hosts|0]§! of §Y[?ROOT.zin_zol_host_cap|0]§!.', { tip: 'The isles of the Kusmeel where the dead stir, and the hosts that walk against the number the Presence can hold.', gap: LAYOUT.gap });
  p.gauge('conv', 1, 'ZIN_MISTAKE_CONV', 'The Convergence: §Y[?ROOT.zin_zol_convergence|0]§! of 100', 'The gathering of the dead toward one end. At 100 it is complete.', { fill: 'zin_ui_conv_fill', marks: [100], when: 'has_global_flag = zin_zol_rising' });
  p.text('seat', 1, 'ZIN_MISTAKE_SEAT', 'Furviatlon, seat of the Mistake.', { font: 'small' });
  return p;
}
function presenceLoc(loc) {
  return [definedText('zin_mistake_band_word', [['check_variable = { zin_mistake_power < 25 }', 'ZIN_MISTAKE_BAND_FAINT', 'Faint'], ['check_variable = { zin_mistake_power < 50 }', 'ZIN_MISTAKE_BAND_STIRRING', 'Stirring'], ['check_variable = { zin_mistake_power < 75 }', 'ZIN_MISTAKE_BAND_WAKING', 'Waking'], [null, 'ZIN_MISTAKE_BAND_GATHERED', 'Gathered']], loc),
    definedText('zin_mistake_power_line', [['has_country_flag = zin_zol_presence_lapsed', 'ZIN_MISTAKE_LAPSED', 'Whether he returns is not for us to know. The servants keep faith.'], [null, 'ZIN_MISTAKE_POWER_BAND', 'His presence in Aoaz: [ROOT.zin_mistake_band_word] (§Y[?ROOT.zin_mistake_power|0]§!)']], loc)].join('\n');
}
function zolRefresh() {
  return list('# Recomputes what the Presence panel shows. Pure formatting: it never changes a mechanic variable.', 'add_to_variable = { zin_ui_tick = 1 }',
    meterFill('zin_mistake_power', 'zin_ui_power_fill'), meterFill('zin_zol_convergence', 'zin_ui_conv_fill'), ORDERS.map(([o]) => meterFill(`zin_zol_bond_${o}`, `zin_ui_bond_${o}_fill`, BOND_MAX)),
    'set_variable = { zin_zol_host_cap = zin_mistake_power }', 'divide_variable = { zin_zol_host_cap = 4 }', 'round_variable = zin_zol_host_cap', 'add_to_variable = { zin_zol_host_cap = zin_zol_host_cap_bonus }',
    'if = {', 'limit = { NOT = { has_global_flag = zin_zol_rising } }', 'clamp_variable = { var = zin_zol_host_cap max = 4 }', '}');
}

// =========================================================================================================== the three APIs
function api(name, makePanel, makeLoc, refresh, refreshName) {
  return {
    effects: () => blk(refreshName, refresh()),
    effectNames: () => [refreshName],
    scriptedLoc: (D, loc) => makeLoc(loc),
    panelNames: () => [name],
    build(staged, { D, loc, sprites, file }) {
      const p = makePanel(D), r = p.render();
      for (const [k, v] of p.loc) loc.set(k, v);
      for (const [n, art] of p.sprites) sprites.use(n, art);
      staged.text(`interface/zin_${file}.gui`, `guiTypes = {\n${r.gui}\n}\n`);
      staged.text(`common/scripted_guis/zin_${file}.txt`, `scripted_gui = {\n${format(r.scripted)}\n}\n`);
      return { windows: [p.o.window, `${p.o.prefix}_button_window`], scriptedGuis: [p.o.gui, `${p.o.gui}_launcher`], elements: p.els.length, effects: p.effects.size, triggers: p.triggers.size, sprites: [...p.sprites.keys()] };
    },
  };
}
export const aenorGui = api('court', courtPanel, loc => courtLoc(loc), courtRefresh, 'zin_aenor_ui_refresh');
export const afritGui = api('council', () => councilPanel(), councilLoc, afritRefresh, 'zin_afrit_ui_refresh');
export const zolGui = api('mistake', () => presencePanel(), presenceLoc, zolRefresh, 'zin_zol_ui_refresh');
// Used by the other panel builders and the tests.
export { GE };
