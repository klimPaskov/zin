// The Realm panel: a themed window opened from a button under the top bar. It shows the country's people,
// alignment and stance now, and is the frame later mechanic panels (Aenor's court, Afrit's footholds, Volgan's
// dominion) are built in. All art is image-generated (modules/art.mjs); code only arranges it.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dds, fromRaw } from '../lib/raster.mjs';
import { strip } from '../lib/fit.mjs';   // strip assembly (copies generated pixels side by side) lives in lib/fit.mjs
import { PEOPLES } from './peoples.mjs';
import { IDEOLOGIES } from './ideologies.mjs';

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
  const text = (name, x, y, w, h, key, font = 'hoi_18mbs', format = 'left') => `\t\tinstantTextBoxType = {\n\t\t\tname = "${name}"\n\t\t\tposition = { x = ${x} y = ${y} }\n\t\t\tfont = "${font}"\n\t\t\ttext = "${key}"\n\t\t\tmaxWidth = ${w}\n\t\t\tmaxHeight = ${h}\n\t\t\tformat = ${format}\n\t\t\tfixedsize = yes\n\t\t}`;
  staged.text('interface/zin_realm.gui', `guiTypes = {
\tcontainerWindowType = {
\t\tname = "zin_realm_button_window"
\t\tposition = { x = 8 y = 86 }
\t\tsize = { width = 132 height = 30 }
\t\torientation = upper_left
\t\tbuttonType = {
\t\t\tname = "zin_realm_toggle"
\t\t\tposition = { x = 0 y = 0 }
\t\t\tspriteType = "GFX_zin_button"
\t\t\tbuttonText = "ZIN_REALM_BUTTON"
\t\t\tbuttonFont = "hoi_18mbs"
\t\t\tpdx_tooltip = "ZIN_REALM_BUTTON_TT"
\t\t}
\t}
\tcontainerWindowType = {
\t\tname = "zin_realm_window"
\t\tposition = { x = -300 y = -230 }
\t\tsize = { width = 600 height = 460 }
\t\torientation = center
\t\tmoveable = yes
\t\tbackground = {
\t\t\tname = "zin_realm_bg"
\t\t\tspriteType = "GFX_zin_frame"
\t\t}
${text('zin_realm_title', 40, 22, 520, 32, 'ZIN_REALM_TITLE', 'hoi_24header', 'centre')}
\t\tbuttonType = {
\t\t\tname = "zin_realm_close"
\t\t\tposition = { x = 556 y = 14 }
\t\t\tquadTextureSprite = "GFX_closebutton"
\t\t\tshortcut = "ESCAPE"
\t\t}
\t\ticonType = {
\t\t\tname = "zin_realm_rule_top"
\t\t\tspriteType = "GFX_zin_rule"
\t\t\tposition = { x = 40 y = 60 }
\t\t}
\t\ticonType = {
\t\t\tname = "zin_realm_people_icon"
\t\t\tspriteType = "GFX_zin_people_strip"
\t\t\tposition = { x = 44 y = 88 }
\t\t\tscale = 1.5
\t\t}
${text('zin_realm_people', 160, 92, 400, 26, 'ZIN_REALM_PEOPLE')}
${text('zin_realm_people_desc', 160, 120, 400, 60, 'ZIN_REALM_PEOPLE_DESC', 'hoi_16mbs')}
\t\ticonType = {
\t\t\tname = "zin_realm_rule_mid"
\t\t\tspriteType = "GFX_zin_rule"
\t\t\tposition = { x = 40 y = 200 }
\t\t}
${text('zin_realm_alignment', 44, 222, 520, 26, 'ZIN_REALM_ALIGNMENT')}
${text('zin_realm_stance', 44, 252, 520, 26, 'ZIN_REALM_STANCE')}
${text('zin_realm_stance_desc', 44, 282, 520, 60, 'ZIN_REALM_STANCE_DESC', 'hoi_16mbs')}
\t\ticonType = {
\t\t\tname = "zin_realm_rule_low"
\t\t\tspriteType = "GFX_zin_rule"
\t\t\tposition = { x = 40 y = 360 }
\t\t}
${text('zin_realm_footer', 44, 382, 520, 50, 'ZIN_REALM_FOOTER', 'hoi_16mbs', 'centre')}
\t}
}
`);
  staged.text('common/scripted_guis/zin_realm.txt', `scripted_gui = {
\tzin_realm_button = {
\t\tcontext_type = player_context
\t\twindow_name = "zin_realm_button_window"
\t\tvisible = { always = yes }
\t\teffects = {
\t\t\tzin_realm_toggle_click = {
\t\t\t\tif = { limit = { has_country_flag = zin_realm_open } clr_country_flag = zin_realm_open }
\t\t\t\telse = { set_country_flag = zin_realm_open }
\t\t\t}
\t\t}
\t}
\tzin_realm = {
\t\tcontext_type = player_context
\t\twindow_name = "zin_realm_window"
\t\tvisible = { has_country_flag = zin_realm_open }
\t\tproperties = {
\t\t\tzin_realm_people_icon = { frame = zin_people_frame }
\t\t}
\t\teffects = {
\t\t\tzin_realm_close_click = { clr_country_flag = zin_realm_open }
\t\t}
\t}
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
  const loc = {
    ZIN_REALM_BUTTON: 'Realm', ZIN_REALM_BUTTON_TT: 'Open or close the overview of your realm.',
    ZIN_REALM_TITLE: 'The Realm of [ROOT.GetName]',
    ZIN_REALM_PEOPLE: 'People: §Y[ROOT.zin_people_name]§!', ZIN_REALM_PEOPLE_DESC: '[ROOT.zin_people_text]',
    ZIN_REALM_ALIGNMENT: 'Alignment: §Y[ROOT.zin_alignment_name]§!', ZIN_REALM_STANCE: 'Rule: §Y[ROOT.zin_stance_name]§! under [ROOT.GetLeader]', ZIN_REALM_STANCE_DESC: '[ROOT.zin_stance_text]',
    ZIN_REALM_FOOTER: 'Fourth Age of Aoaz, in the reign of the Golden King.', ZIN_UNKNOWN: 'Unknown',
  };
  for (const [id, d] of Object.entries(IDEOLOGIES)) loc[`ZIN_ALIGNMENT_${id}`] = d.name;
  staged.loc('zin_ui', loc);
  // Startup sets each country's emblem frame (1-based) to match its people.
  return PEOPLE_ORDER.map((k, i) => `\t\t\tevery_country = { limit = { has_country_flag = zin_people_${k} } set_variable = { zin_people_frame = ${i + 1} } }`).join('\n');
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
