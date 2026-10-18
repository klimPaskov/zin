// The Realm panel: a themed window opened from a button under the top bar. It shows the country's people,
// alignment and stance now, and is the frame later mechanic panels (Aenor's court, Afrit's footholds, Volgan's
// dominion) are built in. All art is image-generated (modules/art.mjs); code only arranges it.
import { Canvas, dds } from '../lib/raster.mjs';
import { PEOPLES } from './peoples.mjs';
import { IDEOLOGIES } from './ideologies.mjs';

export const PEOPLE_ORDER = Object.keys(PEOPLES);
// Strip assembly only copies generated pixels side by side (sprite frames); it paints nothing.
function strip(canvases) { const w = canvases[0].w, h = canvases[0].h, s = new Canvas(w * canvases.length, h); canvases.forEach((cv, i) => { for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const a = (y * w + x) * 4, b = (y * s.w + i * w + x) * 4; for (let k = 0; k < 4; k++) s.px[b + k] = cv.px[a + k]; } }); return s; }

const sprite = (name, file, extra = '') => `\tspriteType = {\n\t\tname = "${name}"\n\t\ttexturefile = "${file}"${extra}\n\t}`;

export function buildUi(staged, art) {
  staged.add('gfx/interface/zin/frame.dds', dds(art.frame));
  staged.add('gfx/interface/zin/button.dds', dds(strip(art.buttons)));
  staged.add('gfx/interface/zin/rule.dds', dds(art.rule));
  staged.add('gfx/interface/zin/people_strip.dds', dds(strip(PEOPLE_ORDER.map(k => art.emblems.get(k)))));
  staged.text('interface/zin_ui.gfx', `spriteTypes = {
\tcorneredTileSpriteType = {
\t\tname = "GFX_zin_frame"
\t\tsize = { x = 128 y = 128 }
\t\ttexturefile = "gfx/interface/zin/frame.dds"
\t\tborderSize = { x = 32 y = 32 }
\t\ttilingCenter = yes
\t}
${sprite('GFX_zin_button', 'gfx/interface/zin/button.dds', '\n\t\tnoOfFrames = 3\n\t\teffectFile = "gfx/FX/buttonstate.lua"')}
${sprite('GFX_zin_rule', 'gfx/interface/zin/rule.dds')}
${sprite('GFX_zin_people_strip', 'gfx/interface/zin/people_strip.dds', `\n\t\tnoOfFrames = ${PEOPLE_ORDER.length}`)}
}
`);
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
    ZIN_REALM_FOOTER: 'Fourth Age of Erdae, in the reign of the Golden King.', ZIN_UNKNOWN: 'Unknown',
  };
  for (const [id, d] of Object.entries(IDEOLOGIES)) loc[`ZIN_ALIGNMENT_${id}`] = d.name;
  staged.loc('zin_ui', loc);
  // Startup sets each country's emblem frame (1-based) to match its people.
  return PEOPLE_ORDER.map((k, i) => `\t\t\tevery_country = { limit = { has_country_flag = zin_people_${k} } set_variable = { zin_people_frame = ${i + 1} } }`).join('\n');
}
