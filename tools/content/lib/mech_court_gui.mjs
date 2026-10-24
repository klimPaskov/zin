// The three mechanic panels of this slice as scripted GUIs: the Golden Court (Aenor), the Hidden Council (the Worshipdom; its launcher
// reads "The Hermitage") and the Presence (Zol). See docs/specs/07_interface/01_interface.md sections 5, 6 and 8.
// Every picture is an existing ZIN sprite (GFX_zin_frame, GFX_zin_button, GFX_zin_rule) or a catalog icon registered through the sprite
// registry; no texture is made here. A gauge is a catalog icon that slides along GFX_zin_rule (scripted GUI property x, a variable).
// The panels open from a launcher button beside the Realm button until the Erdae bar of the interface module takes that place.
import { list, blk, format } from './mech_court_lib.mjs';

const FONT = { small: 'hoi_16mbs', mid: 'hoi_18mbs', head: 'hoi_24header' };
const GE = (v, n) => `check_variable = { var = ${v} value = ${n} compare = greater_than_or_equals }`;
const CLOSE_ALL = 'clr_country_flag = zin_ui_court_open\nclr_country_flag = zin_ui_council_open\nclr_country_flag = zin_ui_mistake_open\nclr_country_flag = zin_realm_open';
const sliderX = (v, x) => `set_variable = { ${x} = ${v} }\nmultiply_variable = { ${x} = 5.2 }\nadd_to_variable = { ${x} = 27 }`;

// defined_text with a fallback: cases are [trigger, key, text]; the last case may have no trigger.
export function definedText(name, cases, loc) {
  const body = cases.map(([trig, key, text]) => { loc.set(key, text); return trig ? `text = {\ntrigger = {\n${trig}\n}\nlocalization_key = ${key}\n}` : `text = { localization_key = ${key} }`; });
  return blk('defined_text', `name = ${name}\n${body.join('\n')}`);
}

export class Panel {
  constructor(o) { this.o = o; this.els = []; this.loc = new Map(); this.triggers = new Map(); this.props = new Map(); this.effects = new Map(); this.lists = []; this.extraWindows = []; this.sprites = new Map(); }
  id(name) { return `${this.o.prefix}_${name}`; }
  gate(id, tab, when) {
    const parts = [];
    if (tab) parts.push(`check_variable = { zin_ui_tab = ${tab} }`);
    if (when) parts.push(when);
    if (parts.length) this.triggers.set(`${id}_visible`, parts.join('\n'));
  }
  text(name, tab, x, y, w, h, key, value, { font = 'mid', fmt = 'left', when } = {}) {
    const id = this.id(name);
    this.loc.set(key, value);
    this.els.push(`instantTextBoxType = {\nname = "${id}"\nposition = { x = ${x} y = ${y} }\nfont = "${FONT[font]}"\ntext = "${key}"\nmaxWidth = ${w}\nmaxHeight = ${h}\nformat = ${fmt}\nfixedsize = yes\n}`);
    this.gate(id, tab, when);
  }
  icon(name, tab, x, y, sprite, { scale = 1, when } = {}) {
    const id = this.id(name);
    this.els.push(`iconType = {\nname = "${id}"\nspriteType = "${sprite}"\nposition = { x = ${x} y = ${y} }${scale !== 1 ? `\nscale = ${scale}` : ''}\n}`);
    this.gate(id, tab, when);
    return id;
  }
  sprite(name, art) { this.sprites.set(name, art); return name; }
  // A gauge: the rule line and a marker that slides along it; `xvar` holds the marker's x.
  gauge(name, tab, y, xvar, { when } = {}) {
    this.icon(`${name}_rule`, tab, 40, y, 'GFX_zin_rule', { when });
    const id = this.icon(`${name}_mark`, tab, 40, y - 12, this.markerSprite, { scale: 0.4, when });
    this.props.set(id, { x: xvar });
  }
  button(name, x, y, key, value, effect, { tab, when } = {}) {
    const id = this.id(name);
    this.loc.set(key, value);
    this.els.push(`buttonType = {\nname = "${id}"\nposition = { x = ${x} y = ${y} }\nspriteType = "GFX_zin_button"\nbuttonText = "${key}"\nbuttonFont = "${FONT.mid}"\n}`);
    this.effects.set(`${id}_click`, effect);
    this.gate(id, tab, when);
  }
  grid(name, tab, y, h, array, entry, rowGui) {
    const id = this.id(name);
    this.els.push(list('containerWindowType = {', `name = "${id}_scroll"`, `position = { x = 40 y = ${y} }`, `size = { width = 540 height = ${h} }`, 'Orientation = upper_left', 'scroll_wheel_factor = 40', 'smooth_scrolling = yes',
      'gridBoxType = {', `name = "${id}"`, 'position = { x = 0 y = 0 }', `size = { width = 540 height = ${h} }`, 'Orientation = upper_left', 'slotsize = { width = 540 height = 22 }', 'format = "UPPER_LEFT"', 'max_slots_horizontal = 1', '}', '}'));
    this.gate(`${id}_scroll`, tab);
    this.lists.push({ name: id, array, entry });
    this.extraWindows.push(rowGui);
  }
  render() {
    const o = this.o, P = o.prefix;
    this.loc.set(o.titleKey, o.title);
    this.loc.set(o.launcherKey, o.launcher);
    this.loc.set(`${o.launcherKey}_tt`, o.launcherTip);
    const tabs = o.tabs.map((t, i) => {
      const id = `${P}_tab_${i + 1}`, x = 30 + i * 148;
      this.loc.set(t.key, t.label);
      this.effects.set(`${id}_click`, `set_variable = { zin_ui_tab = ${i + 1} }\nset_variable = { zin_ui_page = 0 }\n${o.refresh} = yes`);
      if (t.visible) this.triggers.set(`${id}_visible`, t.visible);
      this.triggers.set(`${id}_on_visible`, `check_variable = { zin_ui_tab = ${i + 1} }`);
      return `buttonType = {\nname = "${id}"\nposition = { x = ${x} y = 62 }\nspriteType = "GFX_zin_button"\nbuttonText = "${t.key}"\nbuttonFont = "${FONT.small}"\n}\niconType = {\nname = "${id}_on"\nspriteType = "GFX_zin_rule"\nposition = { x = ${x - 4} y = 96 }\n}`;
    });
    const gui = list(
      'containerWindowType = {', `name = "${o.window}"`, `position = { x = ${-o.w / 2} y = ${-o.h / 2} }`, `size = { width = ${o.w} height = ${o.h} }`, 'orientation = center', 'moveable = yes',
      'background = {', `name = "${P}_bg"`, 'spriteType = "GFX_zin_frame"', '}',
      'instantTextBoxType = {', `name = "${P}_title"`, 'position = { x = 40 y = 20 }', `font = "${FONT.head}"`, `text = "${o.titleKey}"`, `maxWidth = ${o.w - 80}`, 'maxHeight = 32', 'format = centre', 'fixedsize = yes', '}',
      'buttonType = {', `name = "${P}_close"`, `position = { x = ${o.w - 44} y = 14 }`, 'quadTextureSprite = "GFX_closebutton"', 'shortcut = "ESCAPE"', '}',
      tabs, this.els, '}',
      'containerWindowType = {', `name = "${P}_button_window"`, 'position = { x = 148 y = 86 }', 'size = { width = 132 height = 30 }', 'orientation = upper_left',
      'buttonType = {', `name = "${P}_open"`, 'position = { x = 0 y = 0 }', 'spriteType = "GFX_zin_button"', `buttonText = "${o.launcherKey}"`, `buttonFont = "${FONT.mid}"`, `pdx_tooltip = "${o.launcherKey}_tt"`, '}', '}',
      this.extraWindows);
    this.effects.set(`${P}_close_click`, `clr_country_flag = ${o.flag}`);
    const open = `${CLOSE_ALL}\nset_country_flag = ${o.flag}\nset_variable = { zin_ui_tab = 1 }\nset_variable = { zin_ui_page = 0 }\n${o.refresh} = yes`;
    const effects = [...this.effects].map(([n, b]) => blk(n, b)).join('\n');
    const triggers = [...this.triggers].map(([n, b]) => blk(n, b)).join('\n');
    const props = [...this.props].map(([n, p]) => blk(n, Object.entries(p).map(([a, v]) => `${a} = ${v}`).join('\n'))).join('\n');
    const lists = this.lists.map(l => blk(l.name, `array = ${l.array}\nvalue = v\nindex = i\nchange_scope = yes\nentry_container = "${l.entry}"`)).join('\n');
    const window = blk(o.gui, list('context_type = player_context', `window_name = "${o.window}"`, 'dirty = zin_ui_tick', 'ai_enabled = { always = no }',
      blk('visible', `${o.visible}\nhas_country_flag = ${o.flag}`), blk('effects', effects), triggers ? blk('triggers', triggers) : '', props ? blk('properties', props) : '', lists ? blk('dynamic_lists', lists) : ''));
    const launcher = blk(`${o.gui}_launcher`, list('context_type = player_context', `window_name = "${P}_button_window"`, 'dirty = zin_ui_tick', 'ai_enabled = { always = no }',
      blk('visible', o.launcherVisible), blk('effects', blk(`${P}_open_click`, open))));
    return { gui: format(gui), scripted: `${window}\n${launcher}` };
  }
}

const rowWindow = (name, textName, key, font = 'small') => `containerWindowType = {\nname = "${name}"\nposition = { x = 0 y = 0 }\nsize = { width = 540 height = 22 }\ninstantTextBoxType = {\nname = "${textName}"\nposition = { x = 0 y = 0 }\nfont = "${FONT[font]}"\ntext = "${key}"\nmaxWidth = 540\nmaxHeight = 22\nformat = left\nfixedsize = yes\n}\n}`;

// =========================================================================================================== Aenor
function courtPanel(loc) {
  const p = new Panel({ prefix: 'zin_court', gui: 'zin_court', window: 'zin_court_window', flag: 'zin_ui_court_open', title: 'The Golden Court', titleKey: 'ZIN_COURT_TITLE', launcher: 'Golden Court', launcherKey: 'ZIN_COURT_BUTTON', launcherTip: 'Open the account of the court, the Concord and the succession.',
    visible: 'zin_aenor_is_realm = yes', launcherVisible: 'zin_aenor_is_realm = yes', refresh: 'zin_aenor_ui_refresh', w: 620, h: 500,
    tabs: [{ key: 'ZIN_COURT_TAB1', label: 'The Court' }, { key: 'ZIN_COURT_TAB2', label: 'The Concord' }, { key: 'ZIN_COURT_TAB3', label: 'The Empty Throne', visible: 'has_global_flag = zin_golden_king_dead' }, { key: 'ZIN_COURT_TAB4', label: 'The Crown', visible: 'has_global_flag = zin_eindil_returned' }] });
  p.markerSprite = p.sprite('GFX_zin_court_marker', 'seal_royal');
  p.text('corr', 1, 40, 118, 540, 24, 'ZIN_COURT_T1_CORR', 'The Golden Court: §Y[?ROOT.zin_court_corruption|0]§! of 100. [ROOT.zin_court_corr_word]');
  p.gauge('corr', 1, 156, 'zin_ui_corr_x');
  p.text('temple', 1, 40, 186, 540, 24, 'ZIN_COURT_T1_TEMPLE', 'Temple Favour: §Y[?ROOT.zin_council_influence|0]§! of 100. How many offices are held by friends of the temples.', { when: 'NOT = { zin_aenor_hand_known = yes }' });
  p.text('hand', 1, 40, 186, 540, 24, 'ZIN_COURT_T1_HAND', 'The Hidden Hand: §Y[?ROOT.zin_council_influence|0]§! of 100. The offices held by one will behind the temples.', { when: 'zin_aenor_hand_known = yes' });
  p.gauge('temple', 1, 224, 'zin_ui_temple_x');
  p.text('cause', 1, 40, 254, 540, 24, 'ZIN_COURT_T1_CAUSE', 'The Lost Cause: §Y[?ROOT.zin_aenor_lost_cause|0]§! of 100. [ROOT.zin_court_cause_path]');
  p.gauge('cause', 1, 292, 'zin_ui_cause_x');
  p.text('health', 1, 40, 320, 540, 24, 'ZIN_COURT_T1_HEALTH', 'The King\'s health: [ROOT.zin_court_health_word]', { when: 'has_country_flag = zin_aenor_royal_physicians\nzin_aenor_king_alive = yes' });
  p.text('note', 1, 40, 372, 540, 80, 'ZIN_COURT_T1_NOTE', 'Offices, titles and charters are bought in the palace district of Parim. The temples help, and the court takes what it can. The kingdom runs on the habits of seventeen centuries.', { font: 'small' });
  p.text('avg', 2, 40, 118, 540, 24, 'ZIN_COURT_T2_AVG', 'The Concord: §Y[?ROOT.zin_aenor_concord_avg|0]§! mean loyalty. Steadfast [?ROOT.zin_ui_n_steadfast|0], loyal [?ROOT.zin_ui_n_loyal|0], restless [?ROOT.zin_ui_n_restless|0], defiant [?ROOT.zin_ui_n_defiant|0].', { font: 'small' });
  p.grid('dominions', 2, 150, 300, 'zin_aenor_dominion_list', 'zin_court_dominion_row', rowWindow('zin_court_dominion_row', 'zin_court_row_text', 'ZIN_COURT_ROW'));
  p.loc.set('ZIN_COURT_ROW', '§Y[This.GetNameDef]§!   [This.zin_court_charter_word]   [This.zin_court_loyalty_word]');
  p.text('scroll', 2, 40, 456, 540, 24, 'ZIN_COURT_T2_SCROLL', 'Turn the wheel to read on.', { font: 'small' });
  p.text('ruling', 3, 40, 118, 540, 24, 'ZIN_COURT_T3_RULING', 'The seals are held by [ROOT.zin_court_ruling_word].');
  const camps = [['court', 'The Golden Court'], ['faithful', '[ROOT.zin_court_faithful_name]'], ['dominions', 'The Free Dominions'], ['host', '[ROOT.zin_court_host_name]']];
  camps.forEach(([c, label], i) => {
    const y = 156 + i * 58, when = c === 'host' ? 'zin_aenor_host_available = yes' : undefined;
    p.text(`c_${c}`, 3, 40, y, 540, 24, `ZIN_COURT_T3_${c.toUpperCase()}`, `${label}: §Y[?ROOT.zin_aenor_camp_${c}|0]§! of 100`, { when });
    p.gauge(`c_${c}`, 3, y + 38, `zin_ui_${c}_x`, { when });
  });
  p.text('thirty', 3, 40, 392, 540, 48, 'ZIN_COURT_T3_THIRTY', 'A camp that reaches 30 rises in arms if it does not hold the seals. Below 30 it is silenced.', { font: 'small', when: 'has_country_flag = zin_aenor_thirty_days' });
  p.text('crown_head', 4, 40, 118, 540, 24, 'ZIN_COURT_T4_HEAD', 'The Crown of Aen waits for a king the people choose.');
  const ticks = { afrit_dead: 'The false god is dead: ', named: 'The stranger has a name: ', returned: 'He has come back from the West: ', parim: 'This realm holds Parim: ', date: 'The day of the crowning has come: ' };
  Object.entries(ticks).forEach(([k, t], i) => p.text(`crown_${k}`, 4, 60, 160 + i * 34, 500, 24, `ZIN_COURT_T4_${k.toUpperCase()}`, `${t}[ROOT.zin_court_tick_${k}]`));
  void loc;
  return p;
}

function courtLoc(loc) {
  const words = [
    definedText('zin_court_corr_word', [['zin_aenor_court_gilded = yes', 'ZIN_COURT_CORR_GILDED', 'Gilded Rot'], ['zin_aenor_court_honest = yes', 'ZIN_COURT_CORR_HONEST', 'An honest court'], [null, 'ZIN_COURT_CORR_MID', 'The ordinary rot']], loc),
    definedText('zin_court_cause_path', [['has_global_flag = zin_lost_cause_with_eindil', 'ZIN_COURT_PATH_EINDIL', 'It follows the stranger.'], ['has_global_flag = zin_lost_cause_shield', 'ZIN_COURT_PATH_SHIELD', 'It is the shield of the Concord.'], [null, 'ZIN_COURT_PATH_ORNAMENT', 'It is the King\'s ornament.']], loc),
    definedText('zin_court_health_word', [['check_variable = { zin_aenor_king_health = 2 }', 'ZIN_COURT_HEALTH_2', 'failing'], ['check_variable = { zin_aenor_king_health = 1 }', 'ZIN_COURT_HEALTH_1', 'tired'], [null, 'ZIN_COURT_HEALTH_0', 'sound']], loc),
    definedText('zin_court_ruling_word', [['zin_aenor_ruled_by_court = yes', 'ZIN_COURT_RULE_1', 'the Regency of the Golden Court'], ['zin_aenor_ruled_by_faithful = yes', 'ZIN_COURT_RULE_2', 'the temples and the throne they chose'], ['zin_aenor_ruled_by_dominions = yes', 'ZIN_COURT_RULE_3', 'the Speaker of the Concord'], ['zin_aenor_ruled_by_host = yes', 'ZIN_COURT_RULE_4', 'the king the host hailed'], ['zin_aenor_ruled_by_captains = yes', 'ZIN_COURT_RULE_5', 'the Captains\' Regency'], [null, 'ZIN_COURT_RULE_0', 'the Golden King']], loc),
    definedText('zin_court_faithful_name', [['has_global_flag = zin_afrit_revealed', 'ZIN_COURT_FAITHFUL_REVEALED_hub', 'Afrit\'s Supporters'], [null, 'ZIN_COURT_FAITHFUL', 'The Deliverer\'s Faithful']], loc),
    definedText('zin_court_host_name', [['has_global_flag = zin_eindil_named', 'ZIN_COURT_HOST_NAMED', 'Eindil\'s Host'], [null, 'ZIN_COURT_HOST', 'The Stranger\'s Host']], loc),
    definedText('zin_court_charter_word', D_CHARTERS.map(([k, n], i) => [i < D_CHARTERS.length - 1 ? `has_idea = zin_concord_charter_${k}` : null, `ZIN_COURT_CHARTER_${k.toUpperCase()}`, n]), loc),
    definedText('zin_court_loyalty_word', [['has_country_flag = zin_aenor_free_dominion', 'ZIN_COURT_LOY_FREE', 'a free dominion'], ['OVERLORD = { has_country_flag = zin_aenor_envoys }\ncheck_variable = { zin_concord_loyalty > 0 }', 'ZIN_COURT_LOY_EXACT', 'loyalty [?This.zin_concord_loyalty|0]'], ['zin_aenor_dominion_steadfast = yes', 'ZIN_COURT_LOY_STEADFAST', 'steadfast'], ['zin_aenor_dominion_loyal = yes', 'ZIN_COURT_LOY_LOYAL', 'loyal'], ['zin_aenor_dominion_restless = yes', 'ZIN_COURT_LOY_RESTLESS', 'restless'], [null, 'ZIN_COURT_LOY_DEFIANT', 'defiant']], loc),
  ];
  const yesNo = (name, trig) => definedText(`zin_court_tick_${name}`, [[trig, `ZIN_COURT_TICK_${name.toUpperCase()}_Y`, 'yes'], [null, `ZIN_COURT_TICK_${name.toUpperCase()}_N`, 'not yet']], loc);
  words.push(yesNo('afrit_dead', 'has_global_flag = zin_afrit_dead'), yesNo('named', 'has_global_flag = zin_eindil_named'), yesNo('returned', 'has_global_flag = zin_eindil_returned'), yesNo('parim', 'any_controlled_state = { zin_is_site_parim = yes }'), yesNo('date', 'zin_aenor_date_coronation = yes'));
  return words.join('\n');
}
const D_CHARTERS = [['golden', 'Golden Charter'], ['shield', 'Shield Charter'], ['free', 'Free Charter'], ['wall', 'Wall Charter'], ['old', 'Old Charter']];

function courtRefresh() {
  const sliders = [['zin_court_corruption', 'zin_ui_corr_x'], ['zin_council_influence', 'zin_ui_temple_x'], ['zin_aenor_lost_cause', 'zin_ui_cause_x'], ['zin_aenor_camp_court', 'zin_ui_court_x'], ['zin_aenor_camp_faithful', 'zin_ui_faithful_x'], ['zin_aenor_camp_dominions', 'zin_ui_dominions_x'], ['zin_aenor_camp_host', 'zin_ui_host_x']];
  return list(
    '# Recomputes what the Golden Court panel shows for a realm. Pure formatting: it never changes a mechanic variable.',
    'add_to_variable = { zin_ui_tick = 1 }',
    'if = {', 'limit = { zin_aenor_is_realm = yes }', sliders.map(([v, x]) => sliderX(v, x)),
    'clear_array = zin_aenor_dominion_list',     ['steadfast', 'loyal', 'restless', 'defiant'].map(b => `set_variable = { zin_ui_n_${b} = 0 }`),
    'every_subject_country = {', 'limit = { zin_aenor_is_concord_dominion = yes }',
    'if = {', 'limit = { zin_aenor_dominion_steadfast = yes }', 'PREV = { add_to_variable = { zin_ui_n_steadfast = 1 } }', '}',
    'else_if = {', 'limit = { zin_aenor_dominion_loyal = yes }', 'PREV = { add_to_variable = { zin_ui_n_loyal = 1 } }', '}',
    'else_if = {', 'limit = { zin_aenor_dominion_restless = yes }', 'PREV = { add_to_variable = { zin_ui_n_restless = 1 } }', '}',
    'else = {', 'PREV = { add_to_variable = { zin_ui_n_defiant = 1 } }', '}',
    'PREV = { add_to_array = { zin_aenor_dominion_list = PREV } }', '}', '}');
}

// =========================================================================================================== Afrit
function councilPanel() {
  const p = new Panel({ prefix: 'zin_council', gui: 'zin_council', window: 'zin_council_window', flag: 'zin_ui_council_open', title: 'The Hidden Council', titleKey: 'ZIN_COUNCIL_TITLE_hub', launcher: 'The Hermitage', launcherKey: 'ZIN_COUNCIL_BUTTON', launcherTip: 'Open the ledgers of the hermitage.',
    visible: 'zin_afrit_is_hub = yes\nNOT = { has_global_flag = zin_afrit_dead }', launcherVisible: 'zin_afrit_is_hub = yes\nNOT = { has_global_flag = zin_afrit_dead }', refresh: 'zin_afrit_ui_refresh', w: 620, h: 500,
    tabs: [{ key: 'ZIN_COUNCIL_TAB1_hub', label: 'The Veil' }, { key: 'ZIN_COUNCIL_TAB2_hub', label: 'The Four Seats' }, { key: 'ZIN_COUNCIL_TAB3_hub', label: 'The Relics' }, { key: 'ZIN_COUNCIL_TAB4_hub', label: 'The Houses' }] });
  p.markerSprite = p.sprite('GFX_zin_council_marker', 'seal_chancellor');
  p.text('veil', 1, 40, 118, 540, 24, 'ZIN_COUNCIL_T1_VEIL_hub', 'The Veil: §Y[?global.zin_afrit_veil|0]§! of 100. Last month: [?global.zin_afrit_veil_last_change|0].', { when: 'zin_afrit_secret_kept = yes' });
  p.gauge('veil', 1, 156, 'zin_ui_veil_x', { when: 'zin_afrit_secret_kept = yes' });
  p.text('known', 1, 40, 118, 540, 48, 'ZIN_COUNCIL_T1_KNOWN_hub', 'The name is known. The Veil is gone, and the Houses answer to the open god.', { when: 'has_global_flag = zin_afrit_revealed' });
  p.text('plot', 1, 40, 190, 540, 24, 'ZIN_COUNCIL_T1_PLOT_hub', 'The King\'s end is prepared to §Y[?global.zin_afrit_regicide_plot|0]§! of 100.', { when: 'NOT = { has_global_flag = zin_golden_king_dead }' });
  p.gauge('plot', 1, 228, 'zin_ui_plot_x', { when: 'NOT = { has_global_flag = zin_golden_king_dead }' });
  p.text('veil_note', 1, 40, 290, 540, 120, 'ZIN_COUNCIL_T1_NOTE_hub', 'Below 30 the Veil thins and the courts of the Light begin to watch the Houses. At 0 the name is spoken. The Council plays a patient game: charity and discretion raise the Veil, risky work lowers it.', { font: 'small' });
  [['seals', 'Seals', 'Merovan keeps the seals of Aenor.'], ['censers', 'Censers', 'Ilvane keeps the temples and the public face.'], ['whispers', 'Whispers', 'Corvel keeps the couriers and the foreign agents.'], ['relics', 'Relics', 'The Reliquary keeps the artifacts.']].forEach(([s, name, line], i) => {
    const y = 122 + i * 84;
    p.text(`seat_${s}`, 2, 40, y, 540, 24, `ZIN_COUNCIL_T2_${s.toUpperCase()}_hub`, `The Seat of ${name}: level §Y[?global.zin_afrit_seat_${s}|0]§!. ${line}`);
    for (let k = 1; k <= 5; k++) p.icon(`seat_${s}_${k}`, 2, 40 + (k - 1) * 40, y + 28, 'GFX_zin_council_pip', { scale: 0.5, when: GE(`global.zin_afrit_seat_${s}`, k) });
  });
  p.sprite('GFX_zin_council_pip', 'sceptre');
  [['necklace', 'The Necklace of the Abyss', 'necklace_deep'], ['ring', 'The Ring of Doors', 'ring_doors'], ['crown', 'The Crown of Witnesses', 'crown_witnesses'], ['bracelet', 'The Bracelet of the First Seal', 'bracelet_seal']].forEach(([a, name, art], i) => {
    const y = 122 + i * 70;
    p.sprite(`GFX_zin_council_${a}`, art);
    p.icon(`art_${a}`, 3, 40, y, `GFX_zin_council_${a}`, { scale: 0.9, when: `NOT = { has_global_flag = zin_afrit_lost_${a} }` });
    p.text(`art_${a}_t`, 3, 116, y + 8, 440, 48, `ZIN_COUNCIL_T3_${a.toUpperCase()}_hub`, `${name}: [ROOT.zin_council_artifact_${a}]`);
  });
  p.text('graces', 3, 40, 410, 540, 40, 'ZIN_COUNCIL_T3_GRACES_hub', 'Artifacts held: §Y[?global.zin_afrit_artifacts|0]§! of 4.', { font: 'small' });
  p.text('houses_n', 4, 40, 118, 540, 24, 'ZIN_COUNCIL_T4_COUNT_hub', 'Houses by depth: one [?ROOT.zin_ui_h1|0], two [?ROOT.zin_ui_h2|0], three [?ROOT.zin_ui_h3|0], four [?ROOT.zin_ui_h4|0], five [?ROOT.zin_ui_h5|0].', { font: 'small' });
  p.grid('houses', 4, 156, 230, 'zin_afrit_houses_list', 'zin_council_house_row', rowWindow('zin_council_house_row', 'zin_council_row_text', 'ZIN_COUNCIL_ROW_hub'));
  p.loc.set('ZIN_COUNCIL_ROW_hub', '§Y[This.GetNameDef]§!   depth [?This.zin_footholds|0][This.zin_council_suspicion_word]');
  p.text('map_hint', 4, 40, 400, 540, 48, 'ZIN_COUNCIL_T4_MAP_hub', 'The map mode "Houses of the First Light" shows every house by depth.', { font: 'small' });
  return p;
}
function councilLoc(loc) {
  const art = a => definedText(`zin_council_artifact_${a}`, [[`has_global_flag = zin_afrit_lost_${a}`, `ZIN_COUNCIL_ART_${a.toUpperCase()}_LOST_hub`, 'lost'], [`has_global_flag = zin_afrit_attuned_${a}`, `ZIN_COUNCIL_ART_${a.toUpperCase()}_ATTUNED_hub`, 'held and attuned'], [null, `ZIN_COUNCIL_ART_${a.toUpperCase()}_HELD_hub`, 'held']], loc);
  return [...['necklace', 'ring', 'crown', 'bracelet'].map(art), definedText('zin_council_suspicion_word', [['has_country_flag = zin_afrit_suspicious', 'ZIN_COUNCIL_SUSPECT_hub', ', watched'], [null, 'ZIN_COUNCIL_NOSUSPECT_hub', ', unwatched']], loc)].join('\n');
}
function afritRefresh() {
  const hs = [1, 2, 3, 4].map(n => `else_if = {\nlimit = { check_variable = { zin_footholds = ${n + 1} } }\nPREV = { add_to_variable = { zin_ui_h${n + 1} = 1 } }\n}`);
  return list(
    '# Recomputes what the Hidden Council panel shows for the hub. Pure formatting: it never changes a mechanic variable.',
    'add_to_variable = { zin_ui_tick = 1 }', sliderX('global.zin_afrit_veil', 'zin_ui_veil_x'), sliderX('global.zin_afrit_regicide_plot', 'zin_ui_plot_x'),
    'if = {', 'limit = { has_country_flag = zin_ui_council_open }',
    [1, 2, 3, 4, 5].map(n => `set_variable = { zin_ui_h${n} = 0 }`), 'clear_array = zin_afrit_houses_list', 'set_temp_variable = { zin_nl = 0 }',
    'every_country = {', 'limit = { check_variable = { zin_footholds > 0 } }',
    'if = {', 'limit = { check_variable = { zin_footholds = 1 } }', 'PREV = { add_to_variable = { zin_ui_h1 = 1 } }', '}', hs.slice(0, 3).join('\n'),
    'else = {', 'PREV = { add_to_variable = { zin_ui_h5 = 1 } }', '}',
    'if = {', 'limit = {\ncheck_variable = { zin_footholds > 3 }\ncheck_variable = { zin_nl < 10 }\n}', 'PREV = { add_to_array = { zin_afrit_houses_list = PREV } }', 'add_to_temp_variable = { zin_nl = 1 }', '}', '}', '}');
}

// =========================================================================================================== Zol
function presencePanel() {
  const p = new Panel({ prefix: 'zin_mistake', gui: 'zin_panel_mistake', window: 'zin_mistake_window', flag: 'zin_ui_mistake_open', title: 'The Presence', titleKey: 'ZIN_MISTAKE_TITLE', launcher: 'The Presence', launcherKey: 'ZIN_MISTAKE_BUTTON', launcherTip: 'Open the account of the Presence.',
    visible: 'zin_is_zol = yes', launcherVisible: 'zin_is_zol = yes', refresh: 'zin_zol_ui_refresh', w: 620, h: 500, tabs: [{ key: 'ZIN_MISTAKE_TAB1', label: 'The Presence' }] });
  p.markerSprite = p.sprite('GFX_zin_mistake_marker', 'zol_sigil');
  p.text('power', 1, 40, 118, 540, 24, 'ZIN_MISTAKE_POWER', 'How much of his presence can act in Erdae: [ROOT.zin_mistake_band_word] (§Y[?ROOT.zin_mistake_power|0]§!).', { when: 'NOT = { has_country_flag = zin_zol_presence_lapsed }' });
  p.text('lapsed', 1, 40, 118, 540, 48, 'ZIN_MISTAKE_LAPSED', 'Whether he returns is not for us to know. The servants keep faith.', { when: 'has_country_flag = zin_zol_presence_lapsed' });
  p.gauge('power', 1, 156, 'zin_ui_power_x', { when: 'NOT = { has_country_flag = zin_zol_presence_lapsed }' });
  p.text('power_note', 1, 40, 172, 540, 24, 'ZIN_MISTAKE_POWER_NOTE', 'Not his whole power, which no one has measured.', { font: 'small' });
  p.text('serve', 1, 40, 214, 540, 24, 'ZIN_MISTAKE_SERVE', 'Those who serve:');
  [['great', 'The Great Spirits', 'order_great'], ['lesser', 'The Lesser Spirits', 'order_lesser'], ['divine', 'The New Gods', 'order_divine']].forEach(([o, name, art], i) => {
    const y = 244 + i * 36;
    p.sprite(`GFX_zin_mistake_${o}`, art);
    p.text(`bond_${o}`, 1, 60, y, 200, 24, `ZIN_MISTAKE_BOND_${o.toUpperCase()}`, name);
    for (let k = 1; k <= 5; k++) p.icon(`bond_${o}_${k}`, 1, 270 + (k - 1) * 40, y - 6, `GFX_zin_mistake_${o}`, { scale: 0.5, when: GE(`zin_zol_bond_${o}`, k) });
  });
  p.text('isles', 1, 40, 358, 540, 24, 'ZIN_MISTAKE_ISLES', 'The black isles that stir: §Y[?ROOT.zin_zol_islands_stirring|0]§!. Hosts raised: §Y[?ROOT.zin_zol_hosts|0]§! of §Y[?ROOT.zin_zol_host_cap|0]§!.');
  p.text('conv', 1, 40, 392, 540, 24, 'ZIN_MISTAKE_CONV', 'The Convergence: §Y[?ROOT.zin_zol_convergence|0]§! of 100.', { when: 'has_global_flag = zin_zol_rising' });
  p.gauge('conv', 1, 428, 'zin_ui_conv_x', { when: 'has_global_flag = zin_zol_rising' });
  p.text('seat', 1, 40, 448, 540, 24, 'ZIN_MISTAKE_SEAT', 'Furviatlon, seat of the Mistake.', { font: 'small' });
  return p;
}
function presenceLoc(loc) {
  return definedText('zin_mistake_band_word', [['check_variable = { zin_mistake_power < 25 }', 'ZIN_MISTAKE_BAND_FAINT', 'Faint'], ['check_variable = { zin_mistake_power < 50 }', 'ZIN_MISTAKE_BAND_STIRRING', 'Stirring'], ['check_variable = { zin_mistake_power < 75 }', 'ZIN_MISTAKE_BAND_WAKING', 'Waking'], [null, 'ZIN_MISTAKE_BAND_GATHERED', 'Gathered']], loc);
}
function zolRefresh() {
  return list('# Recomputes what the Presence panel shows. Pure formatting: it never changes a mechanic variable.', 'add_to_variable = { zin_ui_tick = 1 }',
    sliderX('zin_mistake_power', 'zin_ui_power_x'), sliderX('zin_zol_convergence', 'zin_ui_conv_x'),
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
    build(staged, { loc, sprites, file }) {
      const p = makePanel(loc), r = p.render();
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
