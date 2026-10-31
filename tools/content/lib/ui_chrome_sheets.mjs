// The themed chrome sheets of the UI overhaul (lane C1, docs/plans/ui_overhaul/02_plan.md phase 1), cut by the reskin
// (modules/ui_reskin.mjs) for every vanilla chrome texture. They replace the single-material sheets of spec 02 section 5
// (ui-chrome-panels, ui-chrome-small, ui-buttons, ui-buttons-tall, ui-bars, ui-bars-2 and the old ui-controls-small).
//
// Design system docs/specs/07_interface/07_design_system.md: three area themes (Banner Hall, Chancery, Chronicle, §1.2 to
// §1.4) and the neutral family (§1.5) of buttons, tooltips, dialogs and small controls. Every theme sheet carries the same
// cell keys in the same order, so the plan picks a role and the theme only changes the sheet id (CHROME_THEMES).
//
// Every plate is generated low-noise and evenly lit (design system §5.2): the fit `frame_tile` (lib/fit.mjs) shrinks the cell
// until its painted rim is the design frame width and tiles the body and edges from a seam-matched span, so no cell is
// ever enlarged and an engine-tiled body joins without a visible seam. `border` is the painted rim as a fraction of the
// cell's shorter side; `lum` the design luminance class the plan starts from before the cell is measured.

const c = (key, subject, lum = 'dark', extra = {}) => ({ key, subject, lum, ...extra });

// The area themes, as the window-theme table (design_system.json windowThemes) names them.
export const CHROME_THEMES = ['banner_hall', 'chancery', 'chronicle', 'neutral'];
export const THEME_SHEET = { banner_hall: 'ui-chrome-banner-hall', chancery: 'ui-chrome-chancery', chronicle: 'ui-chrome-chronicle', neutral: 'ui-chrome-neutral' };
export const BUTTON_SHEET = 'ui-buttons-neutral';
export const CONTROL_SHEET = 'ui-controls-small';
// The accepted direction images used as references. Jobs read byte-identical copies from the art store (raw/ui/directions/), because a
// generation may not reference a file inside the mod folder (asset check PROV_REF_FOREIGN).
export const DIRECTION_REFS = {
  banner_hall: 'docs/plans/ui_overhaul/directions/direction_b_components.png',
  chancery: 'docs/plans/ui_overhaul/directions/direction_a_components.png',
  chronicle: 'docs/plans/ui_overhaul/directions/direction_c_components.png',
};

// Shared prompt lines: calm, low-noise, evenly lit plates (design system principle 5 and §5.2). Never the dramatic painted style
// of the content art: the chrome is quiet.
const STYLE = 'Clean, quiet game-interface texture art for a fantasy grand-strategy game, painted but restrained: matte surfaces, very fine and low-contrast material texture visible only at close view, flat even diffuse light, every plate lit uniformly from edge to edge with no vignette, no gradient, no glare, no darker or lighter corners, no wear marks, no stains.';
const TAIL = 'No cast shadows outside the plates, no text, no letters, no numbers, no runes, no figures, no faces, no animal heads, no crosses, no sun discs, no skulls, no crowns, no modern objects. No signature or maker\'s mark. The corners and the bottom edge of the image hold only the plain black ground.';
const GRID_GROUND = 'on a solid flat pure black (#000000) background with black gutters between the cells: no glow, no blur, no gradient in the background';
const PLATES = 'Every cell is one flat rectangular plate seen straight on, filling its own cell edge to edge as a full-bleed square swatch, all cells the same size, separated by narrow black gutters. Any rim or frame of a plate runs straight along its four sides at an even width, with its corner ornament kept inside the rim width; the body inside the rim is one plain, uniform, seamless surface with no motif, so it can be tiled.';

export const THEME_MATERIALS = {
  banner_hall: 'The Banner Hall: hand-made cloth like a realm banner. Dyed wool in woad-black (#141E25), woad blue (#13283F) and madder red (#811F14, deep #6B0C0D); undyed linen (#CEBCA6) as the reading cloth; couched gold cord (#B28339, lit edge #FAEC98) on every hem and frame. Very fine, tight weave, almost smooth at normal view. No metal.',
  chancery: 'The Chancery: the old, calm court. Dark oiled walnut (#2D1D13) with a very fine straight grain of low contrast, one cast-bronze moulding (#634027, lit edge #E0AB6D) with tiny gilt corner leaves and small green inset stones, cream vellum (#E4D7C2) reading surfaces.',
  chronicle: 'The Chronicle: the illuminated record of the age. Smooth carved blue-grey slate (#2D353A) with a very fine even grain, an inlaid bronze line (#78664C, lit edge #CAB289) with small diamond studs at the corners, vellum leaves (#E2D1B5), rubric red cloth (#5C1714).',
  neutral: 'The neutral family used in every window: blackened iron plate (#282B2C) with a thin muted-bronze rim (#CAB289) and four tiny corner studs, smooth and matte.',
};

// One theme sheet: the same 16 roles in every area theme. [key, lum, border, subject per theme].
const ROLES = [
  ['window', 'dark', 0.11, {
    banner_hall: 'a window plate: woad-black dyed wool body with a border of thick couched gold cord along all four sides and a small knotted cord diamond at each corner inside the border',
    chancery: 'a window plate: dark walnut body inside a cast-bronze moulding along all four sides with a tiny gilt leaf and a small green inset stone at each corner inside the moulding',
    chronicle: 'a window plate: carved blue-grey slate body inside a slate frame with an inlaid bronze line along all four sides and a small bronze diamond stud at each corner',
  }],
  ['section', 'dark', 0.06, {
    banner_hall: 'a section plate: deep woad blue wool with one thin couched gold cord line along its edge',
    chancery: 'a section plate: walnut a little lighter than the window body, with one thin bronze line along its edge',
    chronicle: 'a section plate: slate a little lighter than the window body, with one thin inlaid bronze line along its edge',
  }],
  ['inset', 'dark', 0.05, {
    banner_hall: 'an inset well: very dark woad wool set slightly lower, with a thin dark stitched hem along its edge',
    chancery: 'an inset well: very dark walnut set slightly lower, with a thin dark recessed edge',
    chronicle: 'an inset well: very dark slate set slightly lower, with a thin dark recessed edge',
  }],
  ['body', 'dark', 0.03, {
    banner_hall: 'a plain swatch of woad-black dyed wool, uniform, with no border and no hem at all',
    chancery: 'a plain swatch of dark walnut, uniform fine grain, with no border and no moulding at all',
    chronicle: 'a plain swatch of dark blue-grey slate, uniform, with no border and no line at all',
  }],
  ['title', 'dark', 0.08, {
    banner_hall: 'a title cloth: madder red wool with a couched gold cord hem along its top and bottom edges and a thinner cord along its sides',
    chancery: 'a title band: walnut with a thin bronze rule along its top and bottom edges and along its sides',
    chronicle: 'a title cloth: rubric red cloth with an inlaid bronze line along its top and bottom edges and along its sides',
  }],
  ['entry_selected', 'dark', 0.06, {
    banner_hall: 'a selected row plate: woad-black wool with a bright, doubled gold cord edge all around',
    chancery: 'a selected row plate: walnut with a bright polished gilt-bronze edge all around',
    chronicle: 'a selected row plate: slate with a bright polished bronze line all around',
  }],
  ['tab', 'dark', 0.07, {
    banner_hall: 'a tab plate: woad blue wool with a thin gold cord edge all around',
    chancery: 'a tab plate: walnut with a thin bronze edge all around',
    chronicle: 'a tab plate: slate with a thin bronze line all around',
  }],
  ['tab_selected', 'dark', 0.07, {
    banner_hall: 'a selected tab plate: deep madder red wool with a bright gold cord edge all around',
    chancery: 'a selected tab plate: raised walnut a step lighter, with a bright gilt-bronze edge all around',
    chronicle: 'a selected tab plate: deep rubric red cloth with a bright bronze line all around',
  }],
  ['reading', 'light', 0.05, {
    banner_hall: 'a reading plate: pale undyed linen, very fine even weave, with a thin gold cord edge',
    chancery: 'a reading plate: cream vellum, smooth and clean, with a thin bronze edge',
    chronicle: 'a reading plate: pale vellum leaf, smooth and clean, with a thin inlaid bronze line edge',
  }],
  ['reading_selected', 'light', 0.06, {
    banner_hall: 'a selected reading plate: pale undyed linen with a bright doubled gold cord edge',
    chancery: 'a selected reading plate: cream vellum with a bright gilt edge',
    chronicle: 'a selected reading plate: pale vellum with a bright bronze edge',
  }],
  ['reading_plain', 'light', 0.03, {
    banner_hall: 'a plain swatch of pale undyed linen, uniform, with no edge at all',
    chancery: 'a plain swatch of cream vellum, uniform, with no edge at all',
    chronicle: 'a plain swatch of pale vellum, uniform, with no edge at all',
  }],
  ['plate_mid', 'mid', 0.07, {
    banner_hall: 'a mid-tone plate: ochre-dyed wool (#9A7B4A) with a thin gold cord edge',
    chancery: 'a mid-tone plate: matte cast bronze (#8A6A40), plain centre, with a slightly darker rim',
    chronicle: 'a mid-tone plate: pale blue-grey slate (#76838A) with a thin inlaid bronze line edge',
  }],
  ['plate_mid_lit', 'mid', 0.07, {
    banner_hall: 'a lighter mid-tone plate: light ochre wool (#B39462) with a bright gold cord edge',
    chancery: 'a lighter mid-tone plate: matte light bronze (#A8814A), plain centre, with a bright gilt rim',
    chronicle: 'a lighter mid-tone plate: light grey slate (#939EA3) with a bright bronze line edge',
  }],
  ['groove', 'dark', 0.08, {
    banner_hall: 'an empty meter groove: a dark woad wool channel inside a thin gold cord hem',
    chancery: 'an empty meter groove: a dark walnut channel inside a thin bronze casing',
    chronicle: 'an empty meter groove: a dark slate channel with a thin bronze edge',
  }],
  ['fill_mid', 'mid', 0.03, {
    banner_hall: 'a meter fill: bright madder-scarlet wool (#C04A30), plain, with a fine gold cord along its top edge',
    chancery: 'a meter fill: bright verdigris enamel (#4F8A5A), plain, smooth',
    chronicle: 'a meter fill: bright verdigris enamel (#4F8A6E), plain, smooth',
  }],
  ['fill_dark', 'dark', 0.03, {
    banner_hall: 'a meter fill: deep madder red wool (#760A0C), plain',
    chancery: 'a meter fill: deep verdigris enamel (#2F5A38), plain, smooth',
    chronicle: 'a meter fill: deep verdigris enamel (#2F5A46), plain, smooth',
  }],
];
export const ROLE_KEYS = ROLES.map(r => r[0]);

const themeSheet = theme => ({
  id: THEME_SHEET[theme], family: 'chrome_panels', theme, kind: 'grid', aspect: '1:1', grid: [4, 4], ground: 'black', matte: 'none', cellBorder: 0.06,
  references: [DIRECTION_REFS[theme]],
  preamble: `${STYLE} ${THEME_MATERIALS[theme]}`, tail: TAIL, layoutNote: PLATES,
  cells: ROLES.map(([key, lum, border, subjects]) => c(key, subjects[theme], lum, { border })),
});

// Neutral plates: tooltips, dialogs, bezels, glows and the neutral bands (design system §1.5, §6.3).
const neutralSheet = {
  id: THEME_SHEET.neutral, family: 'chrome_panels', theme: 'neutral', kind: 'grid', aspect: '1:1', grid: [4, 4], ground: 'black', matte: 'none', cellBorder: 0.06,
  references: [DIRECTION_REFS.chancery, DIRECTION_REFS.chronicle],
  preamble: `${STYLE} ${THEME_MATERIALS.neutral}`, tail: TAIL, layoutNote: PLATES.replace('Every cell is one flat rectangular plate', 'Cells 1 to 4, 14, 15 and 16 are flat rectangular plates; cells 5 to 13 are as described. Every plate'),
  cells: [
    c('tooltip', 'a tooltip plate: smooth dark iron-grey plate (#242422) with a one-pixel-thin muted bronze rim (#CAB289) along all four sides', 'dark', { border: 0.03 }),
    c('dialog', 'a dialog window plate: blackened iron (#282B2C) with a thin muted-bronze rim along all four sides and a tiny round stud at each corner inside the rim', 'dark', { border: 0.08 }),
    c('mini_dialog', 'a small panel plate: blackened iron a step lighter (#323434) with a thin bronze line along its edge', 'dark', { border: 0.06 }),
    c('mini_dialog_grey', 'a small panel plate: dull dark grey iron (#3E3C3A), matte, with a thin darker edge', 'dark', { border: 0.06 }),
    c('selection_line', 'a thin bright gilt rectangular outline line on the black ground, one clean line of even width with a small diamond at each corner, the inside left black', 'mid', { border: 0.1 }),
    c('flag_bezel', 'a rectangular bezel of blackened iron with a thin bronze rim and a plain flat dark centre, the frame about one eighth of the width', 'dark', { border: 0.14 }),
    c('flag_bezel_gilt', 'a rectangular gilt-bronze bezel with a plain flat dark centre, the frame about one eighth of the width', 'mid', { border: 0.14 }),
    c('separator', 'a horizontal bronze rule across the whole cell: a thin muted bronze bar with a small diamond in the middle, on black', 'mid', { border: 0.1 }),
    c('glow_red', 'a soft horizontal glow of cinnabar red light (#DE5240) on black, brightest in the middle, fading evenly to black', 'mid'),
    c('glow_amber', 'a soft horizontal glow of amber light (#E28C34) on black, brightest in the middle, fading evenly to black', 'mid'),
    c('glow_green', 'a soft horizontal glow of verdigris green light (#76B262) on black, brightest in the middle, fading evenly to black', 'mid'),
    c('glow_gold', 'a soft horizontal glow of warm gold light (#EBCA80) on black, brightest in the middle, fading evenly to black', 'mid'),
    c('shine', 'a soft diagonal glint of pale light on black, brightest along one thin band', 'light'),
    c('plate_light', 'a pale plate: smooth pale stone-grey enamel (#D3CCC0) with a thin muted bronze rim', 'light', { border: 0.06 }),
    c('plate_mid', 'a mid-tone plate: matte muted bronze (#8C7A5C) with a thin darker rim', 'mid', { border: 0.06 }),
    c('body', 'a plain swatch of blackened iron (#282B2C), smooth and uniform, with no rim at all', 'dark', { border: 0.03 }),
  ],
};

// Neutral buttons (design system §6.1, §6.2): three luminance classes, five states each, in the vanilla frame order.
export const BUTTON_STATES = ['normal', 'hover', 'pressed', 'disabled', 'selected'];
const BUTTON_ROWS = {
  iron: ['dark', 'blackened iron (#282B2C) with a thin muted-bronze rim (#CAB289) and four tiny corner studs'],
  bronze: ['mid', 'matte muted bronze (#8C7A5C) with a thin darker bronze rim and four tiny corner studs'],
  pale: ['light', 'pale stone-grey enamel (#D3CCC0) with a thin muted-bronze rim and four tiny corner studs'],
};
const STATE_TEXT = {
  normal: 'at rest',
  hover: 'the face clearly brighter (about one step lighter) and the rim catching more light',
  pressed: 'the face clearly darker (about one step darker) with a soft inner shadow along its top edge, as if pressed in',
  disabled: 'disabled: the face flat dull grey with no colour at all, the rim plain dull grey with no gilt, matte and lifeless',
  selected: 'selected: the face as at rest, framed by a bright two-pixel gilt rim (#EBCA80)',
};
const buttonSheet = {
  id: BUTTON_SHEET, family: 'chrome_controls', theme: 'neutral', kind: 'grid', aspect: '3:2', grid: [5, 3], ground: 'black', matte: 'none', cellBorder: 0.14,
  references: [DIRECTION_REFS.chancery, DIRECTION_REFS.chronicle],
  preamble: `${STYLE} ${THEME_MATERIALS.neutral}`, tail: TAIL,
  layoutNote: 'Every cell holds one empty wide rectangular button plate about three times as wide as tall, centred in its cell with black around it, all plates the same size and shape; each row shows the same button in five states left to right, so the states differ only as described. No label on any button.',
  cells: Object.entries(BUTTON_ROWS).flatMap(([row, [lum, material]]) => BUTTON_STATES.map(st => c(`${row}_${st}`, `a button of ${material}, ${STATE_TEXT[st]}`, lum, { border: 0.16 }))),
};

// Small neutral controls: isolated objects on black whose own outline is the alpha (decision A3). Every pressable control has
// normal, hover and pressed cells (check 17).
const control = (key, subject) => c(key, subject, 'dark');
const controlSheet = {
  id: CONTROL_SHEET, family: 'chrome_controls', theme: 'neutral', kind: 'grid', aspect: '1:1', grid: [6, 6], ground: 'black', matte: 'outline',
  references: [DIRECTION_REFS.chancery, DIRECTION_REFS.chronicle],
  preamble: `${STYLE} Small controls of blackened iron (#282B2C) with thin muted-bronze rims (#CAB289); gilt (#EBCA80) only where named.`, tail: TAIL,
  layoutNote: 'Each item is one isolated object of about the same size, centred in its own cell, with wide black gutters between items, flat front view. Where a row names the same control in several states, the objects are identical in shape and size and differ only as described.',
  cells: [
    control('check_off', 'an empty square iron checkbox socket with a bronze rim and a dark recess'), control('check_off_hover', 'the same empty checkbox socket with a brighter rim and a lighter recess'),
    control('check_on', 'the same square checkbox socket holding a bold gilt tick stroke'), control('check_on_hover', 'the same checked socket, brighter, the tick and rim catching more light'),
    control('radio_off', 'an empty round iron socket with a bronze rim'), control('radio_on', 'the same round socket holding a gilt dot'),
    control('close', 'a square iron button with a bronze rim carrying two crossed bronze bars (a saltire of two bars, not a letter)'), control('close_hover', 'the same close button, brighter, the bars catching more light'),
    control('close_pressed', 'the same close button, darker and pressed in'), control('arrow', 'a small square iron button with a bronze arrowhead pointing up'),
    control('arrow_hover', 'the same arrow button, brighter'), control('arrow_pressed', 'the same arrow button, darker and pressed in'),
    control('plus', 'a round iron stud with a bronze rim carrying a gilt plus shape of two crossed bars'), control('plus_hover', 'the same plus stud, brighter'),
    control('plus_pressed', 'the same plus stud, darker and pressed in'), control('minus', 'a round iron stud with a bronze rim carrying one gilt bar'),
    control('minus_hover', 'the same minus stud, brighter'), control('minus_pressed', 'the same minus stud, darker and pressed in'),
    control('knob', 'a round bronze drag knob'), control('knob_hover', 'the same drag knob, brighter'),
    control('track', 'a short vertical iron rail with a thin bronze edge, plain'), control('slider_knob', 'a bronze slider knob wider than tall with a gilt line across it'),
    control('slider_track', 'a thin horizontal iron rail with a bronze edge'), control('expand', 'a small iron stud with a bronze triangle pointing right'),
    control('expand_hover', 'the same expand stud, brighter'), control('lamp_off', 'an unlit dark enamel lamp in a bronze ring'),
    control('lamp_green', 'a lit verdigris green enamel lamp in a bronze ring'), control('lamp_amber', 'a lit amber enamel lamp in a bronze ring'),
    control('lamp_red', 'a lit cinnabar red enamel lamp in a bronze ring'), control('lock', 'a closed bronze padlock on a small iron plate'),
    control('unlock', 'an open bronze padlock on a small iron plate'), control('pips_two', 'an iron stud carrying two bronze dots'),
    control('pips_three', 'an iron stud carrying three bronze dots'), control('stud_round', 'a plain round iron stud with a bronze rim'),
    control('stud_square', 'a plain square iron stud with a bronze rim'), control('check_disabled', 'an empty square checkbox socket in flat dull grey, no colour, no gilt'),
  ],
};

export const CHROME_SHEETS = [themeSheet('banner_hall'), themeSheet('chancery'), themeSheet('chronicle'), neutralSheet, buttonSheet, controlSheet];

// The prompt of a chrome sheet (art/ui-reskin-jobs.mjs uses it for sheets that carry a preamble).
export function chromePrompt(sheet) {
  const [cols, rows] = sheet.grid, n = sheet.cells.length, lines = [];
  for (let r = 0; r < rows; r++) {
    const items = sheet.cells.slice(r * cols, (r + 1) * cols).map((x, i) => `${r * cols + i + 1}. ${x.subject}`);
    if (items.length) lines.push(`Row ${r + 1}, left to right: ${items.join('; ')}.`);
  }
  const intro = `An asset sheet of ${n} items, arranged in an exact grid of ${cols} columns and ${rows} rows in reading order, ${GRID_GROUND}. ${sheet.layoutNote}`;
  const ref = sheet.references?.length ? ' The attached picture shows the intended material and colour of this family only; do not copy its layout, its labels or its emblems.' : '';
  return [sheet.preamble + ref, intro, ...lines, sheet.tail].join(' ');
}
