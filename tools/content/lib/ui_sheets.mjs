// The theme sheets of the interface reskin (spec docs/specs/07_interface/02_full_ui_reskin.md, section 5): the fixed chrome
// sheets defined here, and the emblem sheets the plan packs from the emblem groups. A sheet is data
// (tools/content/data/ui/sheets/<id>.json): its grid, ground, matte, painted border and the key and subject of every cell.
//
// kind     'grid'  cells found on a flat black ground with findRegionsAdaptive and cropped with a small inset
//          'band'  one long band per job on black, ends darkening to black, cut by its rows (art pipeline A2)
// matte    'none'    opaque cells; alpha comes from the row (opaque, uniform or the vanilla outline)
//          'outline' every cell is one isolated object on black; its own outline is the alpha (decision A3)
// lum      the design luminance class of the cell (dark, mid, light), so a row picks a cell of its sprite's class
import { STYLE_LINE, MATERIALS, PALETTE, LIGHTING, CLAUSE_A4, FORBIDDEN_MOTIFS, GROUND } from './ui_vocab.mjs';

// The family preamble: every sheet of a family shares it, so they match (spec section 5).
export const PREAMBLES = {
  chrome_panels: `${STYLE_LINE} The interface of an Erdae chancery: ${MATERIALS.walnut}; ${MATERIALS.bronze}; ${MATERIALS.parchment}; ${MATERIALS.slate}. ${PALETTE}.`,
  chrome_controls: `${STYLE_LINE} Controls of an Erdae chancery: ${MATERIALS.gilded_iron}; ${MATERIALS.bronze}; ${MATERIALS.enamel}. ${PALETTE}.`,
  chrome_bars: `${STYLE_LINE} Bands of an Erdae chancery: ${MATERIALS.walnut}; ${MATERIALS.bronze}; ${MATERIALS.gilded_iron}. ${PALETTE}.`,
  topbar: `${STYLE_LINE} The top bar of an Erdae chancery: ${MATERIALS.walnut}; ${MATERIALS.gilded_iron}; ${MATERIALS.bronze}. ${PALETTE}.`,
  map_interface: `${STYLE_LINE} The map table of an Erdae chancery: ${MATERIALS.slate}; ${MATERIALS.bronze}; compass rose and chart lines allowed. ${PALETTE}.`,
  alerts: `${STYLE_LINE} Alert plates of an Erdae chancery: ${MATERIALS.gilded_iron} plate with a small bronze emblem, ${MATERIALS.enamel}. ${PALETTE}.`,
  events: `${STYLE_LINE} Writing boards of an Erdae chancery: ${MATERIALS.walnut}; ${MATERIALS.bronze}; ${MATERIALS.parchment}. ${PALETTE}.`,
  politics_diplomacy: `${STYLE_LINE} Seals and emblems of an Erdae chancery: ${MATERIALS.bronze}; ${MATERIALS.gilded_iron}; ${MATERIALS.enamel}. ${PALETTE}.`,
  focus: `${STYLE_LINE} The path board of an Erdae chancery: ${MATERIALS.walnut} with faint chart lines; ${MATERIALS.bronze}; ${MATERIALS.gilded_iron}. ${PALETTE}.`,
  research_production: `${STYLE_LINE} Ledgers and workshops of an Erdae chancery: ${MATERIALS.parchment}; ${MATERIALS.walnut}; ${MATERIALS.bronze}; ${MATERIALS.gilded_iron}. ${PALETTE}.`,
  military: `${STYLE_LINE} The war council of an Erdae chancery: ${MATERIALS.slate}; ${MATERIALS.bronze}; heraldic charges on bronze shields; counters in a muted vanilla-green palette with a thin bronze rim. ${PALETTE}.`,
  frontend: `${STYLE_LINE} The first screens of an Erdae chancery: ${MATERIALS.gilded_iron}; ${MATERIALS.bronze}; ${MATERIALS.parchment}; ${MATERIALS.walnut}. ${PALETTE}.`,
  cursors: `${STYLE_LINE} Pointer and tool glyphs in ${MATERIALS.gilded_iron}, each a single bold shape that reads at 32 by 32 pixels. ${PALETTE}.`,
  texticons: `${STYLE_LINE} Small inline glyphs in ${MATERIALS.bronze} and ${MATERIALS.gilded_iron}, each a single bold shape that reads at 18 by 18 pixels. ${PALETTE}.`,
};
export const PROMPT_TAIL = `${LIGHTING}. ${CLAUSE_A4}. ${FORBIDDEN_MOTIFS}.`;
export { GROUND };

// Section 6: the production step of each family (the order the art tranches run in).
export const FAMILY_TRANCHE = {
  frontend: 2, loading_frame: 2, chrome_panels: 3, chrome_controls: 3, chrome_bars: 3, topbar: 5, map_interface: 5, events: 6,
  politics_diplomacy: 7, focus: 7, research_production: 8, military: 9, alerts: 10, texticons: 10, cursors: 11,
};

const c = (key, subject, lum = 'dark', extra = {}) => ({ key, subject, lum, ...extra });

// Fixed chrome sheets. Panels: the cell's painted border is a fraction of the cell's shorter side.
export const FIXED_SHEETS = [
  { id: 'ui-chrome-panels', family: 'chrome_panels', kind: 'grid', aspect: '1:1', grid: [3, 3], ground: 'black', matte: 'none', cellBorder: 0.16, cells: [
    c('walnut_thick', 'a square window panel: dark walnut body with a thick cast-bronze border with rivets and mitred corners, border about one sixth of the width', 'dark', { border: 0.18 }),
    c('walnut_double', 'a square window panel: dark walnut body with a double bronze border, a thin inner line inside a thick outer band', 'dark', { border: 0.2 }),
    c('walnut_thin', 'a square window panel: dark walnut body with a thin bronze border line and plain mouldings', 'dark', { border: 0.1 }),
    c('walnut_plain', 'a square borderless walnut surface, fine straight grain, seamless and evenly lit, no frame at all', 'dark', { border: 0.06 }),
    c('parchment', 'a square parchment panel: cream vellum with faint fibres and a narrow bronze-edged margin, no writing', 'light', { border: 0.12 }),
    c('slate', 'a square slate panel: smooth dark grey-blue stone with a thin bronze edging', 'dark', { border: 0.12 }),
    c('bronze_plate', 'a square cast-bronze plate, warm brown-gold, darker in the recesses, small rivets at the corners, plain centre', 'mid', { border: 0.14 }),
    c('iron_plate', 'a square blackened-iron plate with gold-leaf highlights on the raised edges, plain centre', 'dark', { border: 0.14 }),
    c('enamel_plate', 'a square plate inlaid with deep red wax and verdigris enamel in a bronze frame, plain centre', 'mid', { border: 0.14 }),
  ] },
  { id: 'ui-chrome-small', family: 'chrome_panels', kind: 'grid', aspect: '1:1', grid: [4, 4], ground: 'black', matte: 'none', cellBorder: 0.2, cells: [
    c('mini_dialog', 'a small dialog box: walnut with a thin gilt line, rounded little corners', 'dark', { border: 0.22 }),
    c('mini_dialog_grey', 'a small dialog box in dull iron grey with a thin dark line', 'dark', { border: 0.22 }),
    c('tooltip', 'a tooltip panel: dark walnut with a thin gilt line and small bronze corner studs', 'dark', { border: 0.2 }),
    c('selection_line', 'a thin gilt rectangular outline on a black field, one clean line with a small eight-pointed star at each corner', 'mid', { border: 0.1 }),
    c('small_window', 'a small window panel: walnut with a medium bronze border', 'dark', { border: 0.2 }),
    c('window_transparent', 'a dark walnut surface with a faint bronze border, plain', 'dark', { border: 0.12 }),
    c('header_cap', 'a short bronze header plate with rounded cast ends, plain centre', 'mid', { border: 0.2 }),
    c('separator', 'a thin horizontal bronze rule with a small eight-pointed star in the middle', 'mid', { border: 0.1 }),
    c('glow_red', 'a soft horizontal glow of cinnabar red light on black, brightest in the middle', 'mid', {}),
    c('glow_amber', 'a soft horizontal glow of amber light on black, brightest in the middle', 'mid', {}),
    c('glow_green', 'a soft horizontal glow of verdigris green light on black, brightest in the middle', 'mid', {}),
    c('glow_gold', 'a soft horizontal glow of warm gold light on black, brightest in the middle', 'mid', {}),
    c('flag_bezel', 'a rectangular bronze bezel with a plain dark centre and small rivets, the frame about one eighth of the width', 'dark', { border: 0.14 }),
    c('flag_bezel_gilt', 'a rectangular gilt bezel with a plain dark centre, the frame about one eighth of the width', 'mid', { border: 0.14 }),
    c('shine', 'a soft diagonal white glint of light on black, brightest along a thin band', 'light', {}),
    c('spare', 'a plain walnut rectangle, spare cell', 'dark', {}),
  ] },
  { id: 'ui-buttons', family: 'chrome_controls', kind: 'grid', aspect: '4:1', grid: [3, 4], ground: 'black', matte: 'none', cells: [
    ...['standard', 'alternate', 'grey', 'light'].flatMap((row, r) => ['normal', 'hover', 'pressed'].map(st => c(`${row}_${st}`,
      `a wide rectangular menu button, ${{ standard: 'gilded iron with a bronze rim', alternate: 'blackened iron with a thin gilt rim', grey: 'dull iron grey with no gilt, matte', light: 'polished bronze with a gilt rim' }[row]}, empty centre, ${{ normal: 'at rest', hover: 'one step brighter, the gilt edge catching more light', pressed: 'one step darker, a gold edge around the control, face slightly inset' }[st]}`, row === 'light' ? 'light' : row === 'grey' ? 'mid' : 'dark'))),
  ] },
  { id: 'ui-buttons-tall', family: 'chrome_controls', kind: 'grid', aspect: '2:1', grid: [3, 3], ground: 'black', matte: 'none', cells: [
    ...['square', 'bar', 'tab'].flatMap(row => ['normal', 'hover', 'pressed'].map(st => c(`${row}_${st}`,
      `a ${{ square: 'nearly square', bar: 'small wide', tab: 'tab-shaped' }[row]} control plate, gilded iron with a bronze rim, empty centre, ${{ normal: 'at rest', hover: 'one step brighter', pressed: 'one step darker, gilt edge around it' }[st]}`, 'dark'))),
  ] },
  { id: 'ui-bars', family: 'chrome_bars', kind: 'grid', aspect: '3:1', grid: [1, 8], ground: 'black', matte: 'none', cells: [
    c('header_band', 'a long header band: bronze plate with a gilt line along the top edge and plain middle', 'mid'),
    c('list_entry', 'a long list entry strip: dark walnut with a thin bronze line along the bottom edge', 'dark'),
    c('entry_selected', 'a long list entry strip, selected: walnut with a gold edge all around, face one step darker', 'dark'),
    c('progress_groove', 'a long empty progress groove: a recessed iron channel with a bronze rim', 'dark'),
    c('progress_fill', 'a long progress fill: molten gold with a gilt highlight along the top, plain', 'mid'),
    c('tab_body', 'a long tab strip: walnut tab body with a bronze top edge', 'dark'),
    c('tab_selected', 'a long tab strip, selected: walnut with a gold edge around the control', 'dark'),
    c('text_plate', 'a long recessed text plate: dark walnut inset with a thin bronze rim', 'dark'),
  ] },
  { id: 'ui-bars-2', family: 'chrome_bars', kind: 'grid', aspect: '3:1', grid: [1, 8], ground: 'black', matte: 'none', cells: [
    c('header_band_dark', 'a long header band: dark blackened iron with a thin gilt line along the top edge and a plain middle', 'dark'),
    c('progress_fill_dark', 'a long progress fill: deep burnished bronze with a faint highlight along the top, plain', 'dark'),
    c('progress_groove_mid', 'a long empty progress groove: a recessed bronze channel with a lighter rim', 'mid'),
    c('list_entry_mid', 'a long list entry strip: mid-brown bronzed walnut with a thin gilt line along the bottom edge', 'mid'),
    c('list_entry_light', 'a long list entry strip: pale parchment with a thin bronze line along the bottom edge', 'light'),
    c('entry_selected_light', 'a long list entry strip, selected: pale parchment with a gold edge all around', 'light'),
    c('text_plate_mid', 'a long recessed text plate: mid-brown bronze inset with a thin darker rim', 'mid'),
    c('text_plate_light', 'a long recessed text plate: pale vellum inset with a thin bronze rim', 'light'),
  ] },
  { id: 'ui-controls-small', family: 'chrome_controls', kind: 'grid', aspect: '1:1', grid: [6, 6], ground: 'black', matte: 'outline', cells: [
    c('check_off', 'an empty bronze socket for a checkbox, square, with a dark recess'), c('check_on', 'the same bronze socket with a gilt tick-mark shape (a stroke, not a letter)'),
    c('radio_off', 'an empty round bronze socket for a radio button'), c('radio_on', 'the same round socket with a gilt dot'),
    c('close_stud', 'an iron stud with a bronze cross-bar (two crossed bars, not the letter X)'), c('close_stud_small', 'a smaller iron stud with a bronze cross-bar'),
    c('scroll_arrow', 'a small gilded-iron arrow pointing up on an iron square button'), c('scroll_knob', 'a bronze round drag knob on an iron rail piece'),
    c('scroll_track', 'a short vertical iron rail segment with a bronze edge, plain'), c('plus_stud', 'a raised iron stud with a gilt plus shape (two crossed bars)'),
    c('minus_stud', 'a sunken iron stud with a gilt minus shape (one bar)'), c('pips_two', 'an iron stud carrying two bronze dots'),
    c('pips_three', 'an iron stud carrying three bronze dots'), c('expand_arrow', 'a small bronze triangle pointing right on an iron stud'),
    c('tick_mark', 'a gilt tick-mark shape on a transparent-looking black ground'), c('cross_mark', 'a cinnabar cross-mark shape made of two crossed bars (not a letter)'),
    c('arrow_gold', 'a larger gilt arrow pointing right on an iron button'), c('stud_round', 'a plain round iron stud with a bronze rim'),
    c('stud_square', 'a plain square iron stud with a bronze rim'), c('slider_knob', 'a bronze slider knob with a gilt line, wider than tall'),
    c('slider_track', 'a thin horizontal iron slider rail with a bronze edge'), c('toggle_off', 'a small switch plate, the slider to the left, iron and bronze'),
    c('toggle_on', 'a small switch plate, the slider to the right, iron and gilt'), c('lamp_off', 'an unlit enamel lamp in a bronze ring'),
    c('lamp_green', 'a verdigris enamel lamp in a bronze ring'), c('lamp_amber', 'an amber enamel lamp in a bronze ring'), c('lamp_red', 'a cinnabar enamel lamp in a bronze ring'),
    c('lock_plate', 'a sealed padlock plate: a bronze padlock on an iron plate'), c('unlock_plate', 'an open bronze padlock on an iron plate'),
    c('bar_stud', 'a wide iron bar stud with a bronze rim'), c('corner_stud', 'a small bronze corner stud'),
    c('wax_seal', 'a plain red wax seal without any imprint'), c('wax_seal_green', 'a plain verdigris wax seal without any imprint'),
    c('wax_seal_amber', 'a plain amber wax seal without any imprint'), c('wax_seal_grey', 'a plain grey wax seal without any imprint'),
  ] },
  { id: 'ui-sockets', family: 'chrome_controls', kind: 'grid', aspect: '1:1', grid: [6, 6], ground: 'black', matte: 'outline', cells: [
    c('socket_round', 'an empty round bronze socket with a dark recess and a thin gilt ring'), c('socket_square', 'an empty square bronze socket with a dark recess'),
    c('socket_wide', 'an empty wide bronze socket, about twice as wide as tall'), c('socket_tall', 'an empty tall bronze socket, about twice as tall as wide'),
    c('chip_wide', 'a small wide bronze chip with a dark centre'), c('chip_tall', 'a small tall bronze chip with a dark centre'),
    c('badge_shield', 'an empty bronze heater shield with a dark field'), c('pip_round', 'a tiny round bronze stud'), c('pip_square', 'a tiny square bronze stud'),
    c('socket_round_lit', 'the round bronze socket with a gilt ring, brighter'), c('socket_square_lit', 'the square bronze socket with a gilt edge, brighter'),
    c('socket_round_dull', 'the round socket in dull iron, no gilt, matte'),
    c('socket_square_mid', 'an empty square cast-bronze socket, mid-brown, darker in the recess', 'mid'), c('socket_round_mid', 'an empty round cast-bronze socket, mid-brown', 'mid'),
    c('socket_wide_mid', 'an empty wide cast-bronze socket, mid-brown', 'mid'), c('socket_tall_mid', 'an empty tall cast-bronze socket, mid-brown', 'mid'),
    c('socket_round_light', 'an empty round socket in polished pale bronze, bright', 'light'), c('socket_square_light', 'an empty square socket in polished pale bronze, bright', 'light'),
    c('socket_wide_light', 'an empty wide socket in polished pale bronze, bright', 'light'), c('socket_tall_light', 'an empty tall socket in polished pale bronze, bright', 'light'),
  ] },
  { id: 'ui-topbar', family: 'topbar', kind: 'grid', aspect: '3:1', grid: [1, 8], ground: 'black', matte: 'none', cells: [
    c('band', 'a long top bar band: walnut with a gilt line along the lower edge, seamless along its length', 'dark'),
    c('band_extended', 'a long top bar band with a deeper walnut lower lip and a gilt line, seamless along its length', 'dark'),
    c('date_plate', 'a wide date plate: bronze cartouche with a dark inset, rounded ends', 'dark'),
    c('speed_1', 'a row of three small speed lamps in a bronze rail, the first lamp lit', 'dark'),
    c('speed_2', 'a row of three small speed lamps in a bronze rail, the first two lamps lit', 'dark'),
    c('speed_3', 'a row of three small speed lamps in a bronze rail, all three lamps lit', 'dark'),
    c('alert_plate', 'a narrow alert tray plate: iron with a bronze rim, empty', 'dark'),
    c('overview_tray', 'an overview tray: a wide shallow walnut tray with a bronze edge, empty', 'dark'),
  ] },
  { id: 'ui-map', family: 'map_interface', kind: 'grid', aspect: '3:2', grid: [3, 2], ground: 'black', matte: 'none', cells: [
    c('map_tray', 'a tall map mode tray: slate with a bronze edge, plain', 'dark'), c('minimap_frame', 'a wide minimap frame: bronze border around a plain dark slate centre with a small compass rose in one corner', 'dark', { border: 0.12 }),
    c('clock_plate', 'a clock plate: bronze cartouche with a dark inset', 'dark'), c('handle', 'a tall narrow gilded-iron view handle', 'dark'),
    c('ping_button', 'a wide ping button plate: gilded iron with a bronze rim, empty', 'dark'), c('toggle', 'a small toggle plate: slate with a bronze rim, empty', 'dark'),
  ] },
  { id: 'ui-events', family: 'events', kind: 'grid', aspect: '2:3', grid: [2, 3], ground: 'black', matte: 'none', cells: [
    c('board_top', 'the top of a writing board: walnut with a bronze rim, plain', 'light', { border: 0.12 }), c('board_mid', 'a seamless vertical tile of a parchment-faced writing board with bronze side rails', 'light'),
    c('board_bottom', 'the bottom of a writing board: parchment with a bronze lower rim', 'light', { border: 0.12 }), c('board_end', 'the lower end of a writing board: bronze rim and walnut lip', 'mid'),
    c('option_plate', 'a wide option plate: gilded iron with a bronze rim, empty centre', 'dark'), c('picture_clamp', 'a bronze picture clamp: two small bronze clasps with a short bar', 'mid'),
  ] },
  { id: 'ui-news', family: 'events', kind: 'grid', aspect: '2:3', grid: [1, 2], ground: 'black', matte: 'none', cells: [
    c('broadsheet', 'a parchment broadsheet on a walnut board, no masthead, no lettering, plain', 'light', { border: 0.1 }), c('inner_frame', 'a thin bronze inner frame with a plain dark centre', 'mid', { border: 0.1 }),
  ] },
  { id: 'ui-focus', family: 'focus', kind: 'grid', aspect: '1:1', grid: [3, 3], ground: 'black', matte: 'none', cells: [
    c('board_tile', 'a seamless walnut board tile with faint chart lines', 'dark'), c('title_unavailable', 'a title bar in dull iron, no gilt, matte', 'dark'),
    c('title_can_start', 'a title bar in bronze', 'mid'), c('title_completed', 'a title bar in gilt with a verdigris enamel inlay', 'mid'),
    c('ongoing_plate', 'a wide ongoing-focus plate: walnut with a gilt edge, empty', 'dark'), c('link_bronze', 'a short bronze wire, horizontal', 'dark'),
    c('link_gilt', 'a short gilt wire, horizontal', 'dark'), c('link_wax', 'a short red wax cord, horizontal', 'dark'), c('selection_plate', 'a walnut selection plate with a gold edge', 'dark'),
  ] },
  { id: 'ui-research', family: 'research_production', kind: 'grid', aspect: '1:1', grid: [3, 3], ground: 'black', matte: 'none', cells: [
    c('item_available', 'a technology item plate, available: walnut with a bronze rim, empty', 'dark'), c('item_researched', 'a technology item plate, researched: walnut with a gilt rim and a verdigris inlay', 'dark'),
    c('item_unavailable', 'a technology item plate, unavailable: dull iron, matte', 'dark'), c('folder_tab', 'a folder tab: bronze with a dark inset, empty', 'dark'),
    c('line_plate', 'a long research line plate: walnut with a thin bronze border', 'dark'), c('stripes', 'faint vertical walnut stripes on a plain ground', 'dark'),
    c('bonus_plate', 'a small bonus plate: parchment with a bronze rim', 'light'), c('queue_plate', 'a production queue plate: walnut with a bronze edge', 'dark'), c('slot_glow', 'a soft gold glow on black', 'light'),
  ] },
  { id: 'ui-military', family: 'military', kind: 'grid', aspect: '1:1', grid: [3, 3], ground: 'black', matte: 'none', cells: [
    c('counter_plate', 'a unit counter bar in a muted vanilla-green palette with a thin bronze rim, empty', 'mid'), c('counter_plate_selected', 'the same counter bar with a gold edge, brighter', 'mid'),
    c('group_plate', 'an army group plate: slate with a bronze rim', 'dark'), c('list_header', 'a unit list header: bronze plate with a slate inset', 'mid'),
    c('sort_cell', 'a small sort strip cell: iron with a bronze rim', 'dark'), c('level_pips', 'a row of five tiny bronze pips on iron', 'dark'),
    c('badge_plate', 'a bronze shield-shaped badge plate, empty', 'mid'), c('entry_plate', 'a unit entry plate: slate with a bronze edge', 'dark'), c('stat_plate', 'a stat plate: dark slate inset with a bronze rim', 'dark'),
  ] },
  { id: 'ui-frontend', family: 'frontend', kind: 'grid', aspect: '3:2', grid: [3, 3], ground: 'black', matte: 'none', cells: [
    c('menu_button_normal', 'a wide menu button: gilded iron with a bronze rim, empty, at rest', 'dark'), c('menu_button_hover', 'the same menu button one step brighter', 'dark'), c('menu_button_pressed', 'the same menu button one step darker with a gold edge', 'dark'),
    c('menu_divider', 'a thin bronze rule with a small eight-pointed star', 'mid'), c('entry_plate', 'a country entry plate: framed parchment with a bronze rim', 'light'), c('entry_plate_selected', 'the same country entry plate with a gold edge', 'light'),
    c('bookmark_frame', 'a bronze-framed parchment panel, wide, plain', 'light', { border: 0.1 }), c('play_button', 'a very wide play button: gilded iron with a bronze rim, empty', 'dark'), c('rule_icon', 'a plain round bronze seat for a rule icon', 'dark'),
  ] },
];

// Fixed sheets whose cells are the frames of one sprite are built by the plan from the inventory (frame counts).
export const SHEET_ASPECTS = { '1:1': [1024, 1024], '3:2': [1536, 1024], '2:3': [1024, 1536], '2:1': [2048, 1024], '3:1': [2304, 768], '4:1': [3072, 768], '4:3': [1536, 1152] };

// The layout check imagegen.mjs runs on a sheet (expected cell count, grid, cell aspect, minimum cell area).
export function layoutCheck(sheet) {
  const [w, h] = SHEET_ASPECTS[sheet.aspect], [cols, rows] = sheet.grid, a = (w / cols) / (h / rows);
  return { expected: sheet.cells.length, cols, rows, aspect: [Math.round(a * 0.3 * 100) / 100, Math.round(a * 2.8 * 100) / 100], minAreaFraction: 0.12 };
}

export function validateSheet(sheet) {
  const problems = [], keys = new Set();
  if (!/^[a-z0-9][a-z0-9-]*$/.test(sheet.id)) problems.push(`${sheet.id}: bad id`);
  if (!SHEET_ASPECTS[sheet.aspect]) problems.push(`${sheet.id}: unknown aspect ${sheet.aspect}`);
  if (!Array.isArray(sheet.grid) || sheet.grid.length !== 2 || sheet.grid.some(n => !Number.isInteger(n) || n < 1)) problems.push(`${sheet.id}: bad grid`);
  else if (sheet.cells.length > sheet.grid[0] * sheet.grid[1]) problems.push(`${sheet.id}: ${sheet.cells.length} cells in a ${sheet.grid[0]}x${sheet.grid[1]} grid`);
  if (!['grid', 'band'].includes(sheet.kind)) problems.push(`${sheet.id}: unknown kind ${sheet.kind}`);
  if (!['none', 'outline'].includes(sheet.matte)) problems.push(`${sheet.id}: unknown matte ${sheet.matte}`);
  if (!['black', 'magenta'].includes(sheet.ground)) problems.push(`${sheet.id}: unknown ground ${sheet.ground}`);
  for (const cell of sheet.cells) {
    if (keys.has(cell.key)) problems.push(`${sheet.id}: duplicate cell ${cell.key}`);
    keys.add(cell.key);
    if (!cell.subject) problems.push(`${sheet.id}.${cell.key}: no subject`);
    if (!['dark', 'mid', 'light'].includes(cell.lum)) problems.push(`${sheet.id}.${cell.key}: bad luminance class`);
  }
  return problems;
}
