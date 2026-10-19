// The disposition table of the interface reskin, derived by rules from the spec and the vanilla inventory
// (docs/specs/07_interface/02_full_ui_reskin.md, sections 2.1, 4, 5 and 7). Pure and deterministic:
//
//   buildPlan(inventory, { alertFrames }) -> { rows, sheets, header }
//
// `rows` is the content of data/ui/reskin.json (one row per inventory entry), `sheets` the content of
// data/ui/sheets/<id>.json. Rules run in a fixed order and the first one that matches decides; every ambiguity the
// spec leaves open is decided here and named in DECISIONS, which the integration note repeats.
//
// Dispositions (spec 2.1): R replace the texture at its vanilla path; Z ZIN sprite (ZIN's own GFX_zin_* rows are not
// inventory rows, so no vanilla row is Z); O re-authored override; D derived override (reserved, unused); E engine
// generic; H hidden by an override; U unreachable.
import { FIXED_SHEETS, FAMILY_TRANCHE, SHEET_ASPECTS, validateSheet } from './ui_sheets.mjs';
import { CHARGES, FOLDER_EMBLEMS, RESOURCE_EMBLEMS, GATHERING_TIERS, TOOLBAR_EMBLEMS, VALUE_EMBLEMS, cursorGlyph, humanize } from './ui_vocab.mjs';

export const DISPOSITIONS = ['R', 'Z', 'O', 'D', 'E', 'H', 'U'];
// Frames the fits may use: a sprite whose width the frame count does not divide is cut by the engine into uneven
// frames, which no texture can reproduce, so such a texture is treated as one frame (check 3 needs a divisible width).
export const framesOf = s => (s.frames > 1 && s.width % s.frames === 0 ? s.frames : 1);
export const REASON_REQUIRED = ['E', 'H', 'U'];

// ---------------------------------------------------------------------------------------------------- decisions
export const DECISIONS = [
  'Z rows describe ZIN-owned sprites (GFX_zin_*), which are not inventory rows; no vanilla sprite is classified Z. Vanilla content slots whose art a content spec owns are U, with the owning spec in the reason.',
  'D (derived override) is reserved and unused, as the spec says.',
  'A file with several frames is one row; its frame order and count come from the inventory only. A row with more than one frame uses fit strip, one cell per frame.',
  'Alpha policy per R row: opaque when the vanilla texture is opaque, or shaped with 97% or more solid pixels; uniform:<a> for a uniform vanilla alpha; shape (the vanilla outline as a binary mask) for other keyed or shaped panels and frames; cell (the cell\'s own outline) for emblems and sockets.',
  'exact falls back to cover when the cell and target aspect differ by more than 15%, as the spec says.',
  'MIO (Erdae workshops), raids (night raids) and the international market (Great Fairs) are kept by the economy, warfare and institutions specs, so their windows are reachable and skinned; their per-organisation, per-policy and per-raid icons are U content. This overrides the "unreachable" rows of spec 02 section 4.9.',
  'Special projects (one interim great work), equipment designers, carriers, vanilla country scripted GUIs and country-mechanic art are unreachable (U).',
  'Balance-of-power art is reachable (the foundation spec keeps common/bop for the Golden Court); country-specific BoP art is U.',
  'Sprites in an overridden .gfx (frontendmainviewbg, frontendmainviewbg_basic, small_background and the DLC small_background files) are O; the DLC small_background rows are U because replace_path removes their pictures.',
  'Selected variants of icon strips (army_selected_icons and the like) share the cells of their normal strips.',
  'Initiator and receiver variants of a relation icon share the cell of the relation kind; flipping and rotating are allowed operations, so scroll arrows come from one cell.',
  'Icons with no spec-named emblem use the neutral sockets of ui-sockets until their own emblem sheet exists; this is chrome-complete, not emblem-complete.',
  'The 18 small map-mode emblems and 70 alert emblems follow the frame order of the vanilla strip; the alert meanings come from alert_frames.json, read by an agent from the alert tooltip keys.',
  'Army badges need 81 cells: three sheets (6x6, 6x6, 3x3), because a 9x9 sheet is beyond what the generator holds.',
  'Texticons: the generic set (about 70 glyphs used by tooltips) is R; the rest are U until the localisation scan proves one reachable (check 4).',
  'Vanilla files that no sprite names (backups, bak folders, unreferenced art in gfx/interface) are U orphans; if a script names one the reachability check fails the build.',
  'The cursor, minimap and move-arrow files are R with their own writers (ui_cursors, ui_minimap); ui_reskin skips them and reports them as delegated.',
  'Luminance is classed dark below 96, mid below 160 and light from 160 (mean luma, alpha weighted); each R row picks a cell of its sprite\'s class where the sheet has one.',
];

// ---------------------------------------------------------------------------------------------------- reasons
export const REASONS = {
  missing_texture: 'The installed game has no file for this sprite, so there is nothing to replace; any reference is a vanilla defect already in the baseline.',
  engine_drawn: 'The engine draws this element without a texture.',
  transparent_placeholder: 'A fully transparent engine placeholder; nothing to replace.',
  publisher_mark: 'Publisher and engine logos (Paradox, Clausewitz) stay as published.',
  engine_fallback: 'The engine fallback texture for a missing sprite; it must stay a plain engine file.',
  debug_console: 'Developer console and error log art; not a player surface.',
  engine_utility: 'A utility texture the engine blends with (transparency fade, dim overlay).',
  keyboard_glyphs: 'Keyboard key glyphs shown in shortcut tooltips; neutral and engine-bound.',
  map_shader_mask: 'A map shader mask or pattern for army group lines; the engine reads its alpha as data.',
  account_social: 'Account, friends and Paradox social views; links to Paradox services stay as published.',
  link_published: 'A link to a Paradox service or the privacy page; stays as published.',
  online_assets: 'Paradox online service art outside the game folders.',
  hidden_dlc: 'DLC banners, store and subscription widgets are hidden by the main menu override.',
  hidden_achievements: 'ZIN has no achievements; the screen and its art are hidden.',
  hidden_tutorial: 'The vanilla tutorial is Germany 1936; its button is hidden.',
  hidden_career: 'The career profile is a record across campaigns; its windows are hidden and inert (spec 06).',
  hidden_social_links: 'Community and marketing links are hidden; the homepage and privacy links stay.',
  hidden_wiki: 'The Wiki buttons are hidden; the Chronicle of Erdae is the encyclopedia.',
  content_focus_icon: 'Vanilla focus icons; ZIN focus trees use GFX_focus_zin_* sprites.',
  content_idea_picture: 'Vanilla idea pictures; ZIN ideas use GFX_idea_zin_* sprites.',
  content_technology_picture: 'Vanilla technology and equipment pictures; the warfare spec supplies ZIN pictures.',
  content_doctrine_icon: 'Vanilla doctrine icons; the warfare spec supplies ZIN doctrine icons.',
  content_decision_picture: 'Vanilla decision pictures and category art; ZIN decisions use their own sprites.',
  content_designer: 'Equipment designer art; the warfare spec gives the designers no equipment.',
  content_archetype: 'Vanilla equipment archetype icons.',
  content_medal: 'Vanilla medals and ribbons; ZIN uses the Honours of the Field (spec 06).',
  content_trait: 'Vanilla trait icons; the warfare spec supplies ZIN trait icons.',
  content_state_modifier: 'Vanilla state modifier icons.',
  content_event_picture: 'Vanilla event and news pictures; ZIN events use GFX_zin_evt_* and GFX_zin_news_* sprites.',
  content_portrait: 'Vanilla leader portraits; ZIN portraits are its own sprites.',
  content_operation: 'Vanilla operation pictures; the diplomacy spec keeps only the generic operation keys.',
  content_unit_icon: 'Vanilla unit and ship counters; the warfare spec supplies ZIN unit icons.',
  content_faction_logo: 'Vanilla faction logos; the diplomacy spec supplies ZIN faction icons.',
  content_agency_logo: 'Vanilla intelligence agency logos; ZIN offers its own neutral seals.',
  content_organisation: 'Vanilla organisation, policy and trait icons; the economy spec supplies the Erdae workshops.',
  content_raid_icon: 'Vanilla raid art; the warfare spec supplies night raids.',
  content_country: 'Vanilla country content (the name carries a vanilla country tag); ZIN has no vanilla country tags.',
  content_filter: 'Focus filter for a vanilla mechanic or country.',
  content_ace: 'Vanilla air ace portraits; ZIN keeps five generic Riders of Note.',
  content_texticon: 'A text icon outside the generic set; the reachability check proves no ZIN text names it.',
  content_officer_spirit: 'Vanilla officer corps spirits; the warfare spec maps none of them.',
  content_ability: 'Vanilla leader abilities; the warfare spec supplies none of them.',
  content_terrain: 'Scenery strips for the engine terrain types; their pictures belong to a content spec (an open item in the integration note).',
  content_landmark: 'Vanilla landmark and famous-building pictures of the real world.',
  country_mechanic: 'Art of a vanilla country mechanic; ZIN has no vanilla country tags.',
  special_project: 'Special projects: ZIN has one interim great work and no project window.',
  carrier: 'Carriers do not exist in Erdae.',
  country_scripted_gui: 'A vanilla country scripted GUI; it never loads because ZIN has no vanilla country tags.',
  unreachable_window: 'Referenced only from windows ZIN cannot show.',
  orphan: 'No sprite and no window names this texture.',
  backup_copy: 'A backup copy of a texture in a bak folder.',
  dlc_background: 'A DLC background thumbnail; replace_path removes the backgrounds it belongs to.',
  techtree_board: 'Folder boards are drawn per ZIN folder in the overridden countrytechtreeview.gui (spec 02 section 4.7).',
  operative_event: 'Operative event art; ZIN gives no operative events (spec 02 section 4.5).',
  war_escalation: 'War escalation art belongs to a vanilla scripted GUI.',
  tank_modules: 'Tank, plane and ship module art for the unreachable designers.',
};

// ---------------------------------------------------------------------------------------------------- windows
// Which .gui files ZIN can show. State: reachable (default), unreachable, hidden or engine.
export const GUI_STATES = [
  [/^interface\/(?:ast|cze|ger|jap|raj|sia|aus|bul|gre|sov|swe|usa)_/i, 'unreachable', 'country_scripted_gui'],
  [/^interface\/(?:war_escalation_scripted_gui|eic_scripted_gui|taog_scripted_gui|insrevolutionwindow)/i, 'unreachable', 'country_scripted_gui'],
  [/^interface\/(?:equipmentdesigner\/|tank_designer_view|plane_designer_view|equipmentdesignerview|equipmentupgradedesignerwindow)/i, 'unreachable', 'content_designer'],
  [/^interface\/special_projects\//i, 'unreachable', 'special_project'],
  [/^interface\/carrierairwingcompositionwindow/i, 'unreachable', 'carrier'],
  [/^interface\/railway_gun\.gui$/i, 'unreachable', 'unreachable_window'],
  [/^interface\/(?:achievements|tutorialscreen|subscription_message_view)\.gui$/i, 'hidden', 'hidden_achievements'],
  [/^interface\/career_profile\/playthrough_overview_window\.gui$/i, 'reachable', null],
  [/^interface\/career_profile\//i, 'hidden', 'hidden_career'],
  [/^interface\/(?:pdx_online\/|pops_login|social_view|frontend_friends_view|browser\.gui|backend\.gui)/i, 'engine', 'account_social'],
  [/^interface\/(?:ai_trace|nudge)\.gui$|^interface\/integrity\//i, 'engine', 'debug_console'],
];
export function guiState(file) {
  const f = file.replace(/^(?:dlc|integrated_dlc)\/[^/]+\//, '');
  for (const [re, state, reason] of GUI_STATES) if (re.test(f)) return { state, reason };
  return { state: 'reachable', reason: null };
}
// Windows of frontendmainview.gui that the main menu override hides (spec 03 section 2.2).
// The inventory attributes a reference to its top-level window, so nested hidden elements (the subscription widgets,
// the tutorial button) are covered by name rules instead.
export const HIDDEN_WINDOWS = [
  { file: 'interface/frontendmainview.gui', windows: ['mainmenu_dlc_ownership', 'owned_dlc_item', 'unowned_dlc_item', 'mainmenu_achievement_button'], reason: 'hidden_dlc' },
];
// State of one reference: a window of a file.
export function windowState(file, window) {
  const g = guiState(file);
  if (g.state !== 'reachable') return g;
  const f = file.replace(/^(?:dlc|integrated_dlc)\/[^/]+\//, '');
  const h = HIDDEN_WINDOWS.find(x => x.file === f && x.windows.includes(window));
  return h ? { state: 'hidden', reason: h.reason } : g;
}

// Vanilla country tags that appear in sprite and texture names; ZIN has none of them.
const COUNTRY_TAGS = 'AFG AFA ALB ARG AST AUS BAY BEL BHU BLR BOL BRA BUL CAM CAN CHI CHL COG COL COS CRO CUB CZE DEN DNZ DOM DON ECU EGY ELS ENG EST ETH FIN FRA GDC GEO GER GGV GRE GUA GXC HOL HUN ICE INS IRE IRQ ISR ITA JAP KOR LAT LEB LIT LUX MAN MEX MON NEP NOR NZL PAK PER PHI POL POR PRC PRU RAJ ROM SAF SAR SAU SIA SIK SLO SOV SPA SPR SWE SWI SYR TAN THA TUR UKR URG USA VEN VIC WGR YEM YUG ABB'.split(' ');
const TAG_RE = new RegExp(`(?:^|[_/])(?:${COUNTRY_TAGS.join('|')})(?=[_./]|$)`);
const isCountry = (s, p) => TAG_RE.test(p.replace(/^gfx\/(?:interface\/)?/, '').replace(/\.[a-z0-9]+$/, '')) || TAG_RE.test(s.name.replace(/^GFX_/, ''));

// Engine defaults the game requests without a script (spec 7); they stay reachable and are skinned.
export const ENGINE_DEFAULTS = ['GFX_technology_medium', 'GFX_leader_unknown', 'GFX_leader_unknown_female', 'GFX_portrait_unknown', 'GFX_portrait_unknown_female', 'GFX_idea_unknown', 'GFX_goal_unknown', 'GFX_decision_generic_decision', 'GFX_decision_unknown', 'GFX_trait_unknown', 'GFX_rule_unknown', 'GFX_relation_unknown', 'GFX_autonomy_unknown_icon', 'GFX_ideology_unknown', 'GFX_ideology_democratic_group', 'GFX_ideology_fascism_group', 'GFX_ideology_communism_group', 'GFX_ideology_neutrality_group', 'GFX_locked_icon', 'GFX_placeholder', 'GFX_unit_category_unknown', 'GFX_navalcombat_ship_icon_unknown'];

// The closed list of overrides (spec 02 section 2.3 and the four rows of spec 06): the only vanilla .gui and .gfx names
// the mod may re-author. Builder check 8 fails any other file that shadows a vanilla one.
export const OVERRIDE_FILES = [
  'interface/frontendmainview.gui', 'interface/frontendmainviewbg.gfx', 'interface/frontendmainviewbg_basic.gfx', 'interface/frontendcreditview.gui',
  'interface/small_background.gfx', 'interface/countrytechtreeview.gui', 'interface/ingamemenu.gui', 'interface/armytraittreewindow.gui',
  'interface/navytraittreewindow.gui', 'interface/career_profile/playthrough_overview_window.gui',
];
export const WRITERS = ['reskin', 'presentation', 'cursors', 'minimap'];
export const MINIMAP_TEXTURES = new Set(['gfx/minimap/minimap.dds', 'gfx/interface/minimap.dds']);
// Textures modules/presentation.mjs already writes (spec 02 "Current state"); it keeps owning them.
export const PRESENTATION_TEXTURES = {
  'gfx/interface/loadingscreen_loadingtip.dds': 'loading_frame', 'gfx/interface/loadingscreen_loadingstatus.dds': 'loading_frame',
  'gfx/interface/loadingscreen_progress_1.dds': 'loading_frame', 'gfx/interface/loadingscreen_progress_2.dds': 'loading_frame',
  'gfx/interface/logo_game.dds': 'frontend', 'gfx/interface/select_date_1936.dds': 'frontend', 'gfx/interface/select_date_1939.dds': 'frontend',
};

// Files of the closed list of overrides (spec 2.3) whose sprites are O.
const OVERRIDDEN_GFX = /^interface\/(?:frontendmainviewbg|frontendmainviewbg_basic|small_background)\.gfx$/i;
const DLC_BACKGROUND_GFX = /_small_background\.gfx$/i;

// ---------------------------------------------------------------------------------------------------- content rules
// First match wins. [regex over the lowercase texture path, disposition, reason].
const PATH_RULES = [
  [/^pdx_online_assets\//, 'E', 'online_assets'],
  [/^gfx\/maparrows\//, 'E', 'map_shader_mask'],
  [/^gfx\/keyicons\//, 'E', 'keyboard_glyphs'],
  [/\/bak\//, 'U', 'backup_copy'],
  [/^gfx\/interface\/officer_corp\/spirit_idea_/, 'U', 'content_officer_spirit'],
  [/^gfx\/interface\/abilitylist\/ability_(?!.*(?:_bg|bg_))/, 'U', 'content_ability'],
  [/^gfx\/interface\/terrains\/terrain_/, 'U', 'content_terrain'],
  [/^gfx\/interface\/buildings\/(?!build_slot_bg|building_|facility|canal|dam)/, 'U', 'content_landmark'],
  [/^gfx\/interface\/(?:[a-z_]+\/)?(?:[a-z_]*dlc[a-z_]*|subscription[a-z_]*|show_subscription[a-z_]*)\.(?:dds|tga|png)$/, 'H', 'hidden_dlc'],
  [/^gfx\/achievements\//, 'H', 'hidden_achievements'],
  [/^gfx\/interface\/(?:dlc_banners|tutorial)\//, 'H', 'hidden_dlc'],
  [/^gfx\/event_pictures\//, 'U', 'content_event_picture'],
  [/^gfx\/leaders\//, 'U', 'content_portrait'],
  [/^gfx\/interface\/goals\//, 'U', 'content_focus_icon'],
  [/^gfx\/interface\/ideas\//, 'U', 'content_idea_picture'],
  [/^gfx\/interface\/technologies\//, 'U', 'content_technology_picture'],
  [/^gfx\/interface\/doctrines\/icons\//, 'U', 'content_doctrine_icon'],
  [/^gfx\/interface\/decisions\//, 'U', 'content_decision_picture'],
  [/^gfx\/interface\/equipmentdesigner\//, 'U', 'content_designer'],
  [/^gfx\/interface\/archetypes\//, 'U', 'content_archetype'],
  [/^gfx\/interface\/medals\//, 'U', 'content_medal'],
  [/^gfx\/interface\/traits\//, 'U', 'content_trait'],
  [/^gfx\/interface\/state_modifiers\//, 'U', 'content_state_modifier'],
  [/^gfx\/interface\/operations\//, 'U', 'content_operation'],
  [/^gfx\/interface\/special_project\//, 'U', 'special_project'],
  [/^gfx\/interface\/counters\/(?:divisions_large|divisions_small|ships_small|air_small)\//, 'U', 'content_unit_icon'],
  [/^gfx\/interface\/factions\/faction_logos\//, 'U', 'content_faction_logo'],
  [/^gfx\/interface\/operatives\/agencies\//, 'U', 'content_agency_logo'],
  [/^gfx\/interface\/(?:military_industrial_organization|military_raids)\/.*(?:organization|policy|trait|department|raid_type|raid_unit|raid_category|icons)/, 'U', 'content_organisation'],
  [/^gfx\/interface\/(?:crypto|inner_circle|imperial_influence|paranoia|propaganda|right_vs_left_campaign|cze_skoda|swe_rearnament|union_control|strategic_locations|integrity|sub)\//, 'U', 'country_mechanic'],
  [/^gfx\/interface\/events\/event_operative_bg/, 'U', 'operative_event'],
  [/^gfx\/interface\/events\/war_escalation/, 'U', 'war_escalation'],
  [/^gfx\/interface\/techtree\/.*(?:techtree_bg|tech_bg|folder_bg)/, 'U', 'techtree_board'],
  [/^gfx\/interface\/(?:social)\//, 'H', 'hidden_social_links'],
  [/^gfx\/interface\/career_profile\/(?:playthrough_stats_bg|career_profile_bg)(?:_default)?\.dds$/, 'R', null],
  [/^gfx\/interface\/career_profile\//, 'H', 'hidden_career'],
  [/^gfx\/interface\/(?:icon_(?:bluesky|discord|facebook|forum|instagram|twitter|x|youtube))\./, 'H', 'hidden_social_links'],
  [/^gfx\/interface\/(?:icon_(?:homepage|privacy))\./, 'E', 'link_published'],
  [/^gfx\/interface\/(?:pdx_dev_logo|pdx_dev_logo_s|pdx_int_logo|pdx_logo_credits|clausewitz_logo)\./, 'E', 'publisher_mark'],
  [/^gfx\/interface\/thisisdog\./, 'E', 'engine_fallback'],
  [/^gfx\/interface\/(?:console_win_bg|error_log_button)\./, 'E', 'debug_console'],
  [/^gfx\/interface\/(?:transp_white|transp_white_fade|in_game_menu_dark_overlay)\./, 'E', 'engine_utility'],
  [/^gfx\/interface\/(?:wiki_button|trait_wiki)\./, 'H', 'hidden_wiki'],
  [/^gfx\/interface\/(?:enabled_achievement_icons|achievement_entry_bg|achievements_bg|achievements_bottom_bar|achievements_top_bar|icon_achievements)\./, 'H', 'hidden_achievements'],
];

// ---------------------------------------------------------------------------------------------------- emblem groups
// An emblem group packs its keys into numbered sheets in registration order. `grid` is the sheet grid; a group that
// fits one sheet keeps the plain id.
export const GROUPS = {
  topbar_toolbar: { family: 'topbar', base: 'icons-topbar', grid: [6, 6], aspect: '1:1' },
  topbar_extra: { family: 'topbar', base: 'icons-topbar-extra', grid: [6, 6], aspect: '1:1' },
  gathering_tiers: { family: 'topbar', base: 'icons-gathering-dark', grid: [4, 3], aspect: '4:3' },
  gathering_flicker: { family: 'topbar', base: 'icons-gathering-flicker', grid: [6, 6], aspect: '1:1' },
  mapmodes: { family: 'map_interface', base: 'icons-mapmodes', grid: [6, 6], aspect: '1:1' },
  map_arrows: { family: 'map_interface', base: 'icons-map-arrows', grid: [3, 2], aspect: '3:2' },
  alerts: { family: 'alerts', base: 'icons-alerts', grid: [6, 6], aspect: '1:1', needs: ['alert_frames.json'] },
  alerts_bare: { family: 'alerts', base: 'icons-alerts-bare', grid: [6, 6], aspect: '1:1', needs: ['alert_frames.json'], ground: 'black' },
  diplo_requests: { family: 'alerts', base: 'icons-diplorequests', grid: [4, 5], aspect: '4:3', needs: ['alert_frames.json'] },
  relations: { family: 'politics_diplomacy', base: 'icons-relations', grid: [6, 6], aspect: '1:1' },
  autonomy: { family: 'politics_diplomacy', base: 'icons-autonomy', grid: [3, 2], aspect: '3:2' },
  ideologies: { family: 'politics_diplomacy', base: 'icons-ideologies', grid: [3, 2], aspect: '3:2' },
  focus_filters: { family: 'focus', base: 'icons-focus-filters', grid: [4, 3], aspect: '4:3' },
  folders: { family: 'research_production', base: 'icons-folders', grid: [4, 3], aspect: '4:3', needs: ['warfare_folders'] },
  resources: { family: 'research_production', base: 'icons-resources', grid: [4, 2], aspect: '2:1' },
  buildings: { family: 'research_production', base: 'icons-buildings', grid: [6, 6], aspect: '1:1', needs: ['economy_buildings'] },
  army_badges: { family: 'military', base: 'icons-army-badges', grid: [6, 6], aspect: '1:1' },
  roles: { family: 'military', base: 'icons-roles', grid: [6, 6], aspect: '1:1' },
  templates: { family: 'military', base: 'icons-templates', grid: [6, 6], aspect: '1:1' },
  air_missions: { family: 'military', base: 'icons-air-missions', grid: [6, 4], aspect: '3:2' },
  ships: { family: 'military', base: 'icons-ships', grid: [4, 2], aspect: '2:1' },
  weather: { family: 'military', base: 'icons-weather', grid: [3, 2], aspect: '3:2' },
  cursors: { family: 'cursors', base: 'icons-cursors', grid: [6, 6], aspect: '1:1' },
  texticons: { family: 'texticons', base: 'icons-text', grid: [6, 6], aspect: '1:1' },
};

// alert_frames.json (data/ui, written by an agent reading the alert tooltip keys) maps a cell key (alert_07,
// request_03) to the meaning of that frame; the bare layer reuses the meaning of its plated twin.
function alertSubject(frames, group, cell) {
  if (!frames || !['alerts', 'alerts_bare', 'diplo_requests'].includes(group)) return cell.subject;
  const meaning = frames[cell.key] ?? frames[cell.key.replace(/_bare$/, '')];
  return meaning ? cell.subject.replace(/: meaning per alert_frames\.json$/, `: ${meaning}`) : cell.subject;
}

class Emblems {
  constructor() { this.cells = Object.fromEntries(Object.keys(GROUPS).map(g => [g, new Map()])); }
  // Register a key (idempotent); the first subject wins. Returns the key.
  add(group, key, subject, lum = 'dark') {
    if (!GROUPS[group]) throw new Error(`unknown emblem group ${group}`);
    if (!this.cells[group].has(key)) this.cells[group].set(key, { key, subject, lum });
    return key;
  }
  // Sheets of every group, and a lookup (group, key) -> sheet id.
  pack(alertFrames) {
    const sheets = [], where = new Map();
    for (const [group, spec] of Object.entries(GROUPS)) {
      const cells = [...this.cells[group].values()];
      if (!cells.length) continue;
      const cap = spec.grid[0] * spec.grid[1], n = Math.ceil(cells.length / cap);
      for (let i = 0; i < n; i++) {
        const part = cells.slice(i * cap, (i + 1) * cap);
        // A last sheet that is small gets a tighter grid so the check can count its cells.
        const grid = n > 1 && i === n - 1 && part.length <= 9 ? [3, 3] : part.length < cap && n === 1 && spec.grid[0] * spec.grid[1] > 12 && part.length <= 9 ? [3, 3] : spec.grid;
        const id = n === 1 ? spec.base : `${spec.base}-${i + 1}`;
        sheets.push({
          id, family: spec.family, kind: 'grid', aspect: grid === spec.grid ? spec.aspect : '1:1', grid, ground: spec.ground ?? 'black', matte: 'outline', group,
          needs: spec.needs ?? [], cells: part.map(c2 => ({ ...c2, subject: alertSubject(alertFrames, group, c2) })),
        });
        for (const cell of part) where.set(`${group}:${cell.key}`, id);
      }
    }
    return { sheets, where };
  }
}

// ---------------------------------------------------------------------------------------------------- shape treatment
const lumOf = s => (['dark', 'mid', 'light'].includes(s.luminance) ? s.luminance : 'dark');
const CHROME_CELLS = new Map(); for (const sh of FIXED_SHEETS) for (const cell of sh.cells) CHROME_CELLS.set(`${sh.id}:${cell.key}`, cell);
// The cell of a sheet whose design class is nearest the sprite's class; `prefer` lists keys in order of preference.
function pick(sheet, prefer, lum) {
  const cells = prefer.map(k => CHROME_CELLS.get(`${sheet}:${k}`)).filter(Boolean);
  if (!cells.length) throw new Error(`no cell for ${sheet}: ${prefer.join(', ')}`);
  const rank = { dark: 0, mid: 1, light: 2 };
  return [...cells].sort((a, b) => Math.abs(rank[a.lum] - rank[lum]) - Math.abs(rank[b.lum] - rank[lum]))[0].key;
}
// A band cell of a role (header_band, list_entry ...) in the luminance class of the sprite: the bar sheets carry
// dark, mid and light variants of the roles that need them.
function barCell(role, lum) {
  const rank = { dark: 0, mid: 1, light: 2 };
  const found = ['ui-bars', 'ui-bars-2'].flatMap(sheet => ['', '_dark', '_mid', '_light'].map(suf => ({ sheet, cell: CHROME_CELLS.get(`${sheet}:${role}${suf}`) }))).filter(x => x.cell);
  if (!found.length) throw new Error(`no bar cell for ${role}`);
  found.sort((a, b) => Math.abs(rank[a.cell.lum] - rank[lum]) - Math.abs(rank[b.cell.lum] - rank[lum]));
  return { sheet: found[0].sheet, key: found[0].cell.key };
}
export function alphaPolicy(s) {
  const a = s.alpha ?? 'opaque';
  if (a === 'opaque' || a === 'unknown' || a === 'none') return 'opaque';
  if (a.startsWith('uniform:')) return a;
  if (a === 'empty') return 'opaque';
  if ((s.coverage ?? 0) >= 0.97) return 'opaque';
  return 'shape';
}
const FRAME_STATES = { 1: ['normal'], 2: ['normal', 'hover'], 3: ['normal', 'hover', 'pressed'], 4: ['normal', 'hover', 'pressed', 'disabled'] };
const frameLabels = n => FRAME_STATES[n] ?? Array.from({ length: n }, (_, i) => `frame_${i + 1}`);

// The family of a chrome sprite from where it lives and what it is called.
const FAMILY_RULES = [
  [/topbar|musicplayer|ingameclock|date_pause|speed|zoom|world_tension|wt_anim/, 'topbar'],
  [/mapmode|minimap|mapicon|onmap_|mapitems|find_|mapicons|counters_color|fog_of_war|radar/, 'map_interface'],
  [/alert|messageicon|message_|msg_|menubar/, 'alerts'],
  [/event_|eventwindow|events\//, 'events'],
  [/focus|goals?_|ongoing_|highlight_focus|search_current/, 'focus'],
  [/pol_|diplo|relation|autonomy|ideolog|government|idea_|decision|faction|leader_|autonomy|subject|wargoal|lend|occupation|peace|conference|intel_|capitulation|surrender|warscore|waroverview|tension|war_/, 'politics_diplomacy'],
  [/research|tech|production|prod_|construction|building|equipment_|tradeview|international_market|logistics|deployment|deploy_|resource|factory|stockpile|trade|supply|doctrine|fuel/, 'research_production'],
  [/unitcontrol|army|navy|naval|air_|airview|airwing|landcombat|land_|battle|combat|theat|divis|unit_|strategic|wing|task_force|fleet|carrier|marshal|operations|operative|ace|order|plan/, 'military'],
  [/country_selection|bookmark|select_date|play_button|load_save|lobby|main_lobby|difficulty|frontend|game_settings|hosting|matchmaking|playerlobby|hotjoin|credits|game_rules|settings|career/, 'frontend'],
];
function surfaceFamily(p, sheetFamily) {
  for (const [re, fam] of FAMILY_RULES) if (re.test(p)) return fam;
  return sheetFamily;
}

// Surfaces whose cell the spec names (sections 4.2 to 4.9): [texture path pattern, family, sheet, cells, fit, alpha?].
// `cells` is one key, a function of the match, or one key per frame; a single key is repeated over the frames.
// alpha defaults to the sprite's policy.
const SPECIFIC = [
  [/^gfx\/interface\/topbar\/background\.dds$/, 'topbar', 'ui-topbar', 'band', 'repeat_x'],
  [/^gfx\/interface\/topbar\/background_extended\.dds$/, 'topbar', 'ui-topbar', 'band_extended', 'repeat_x'],
  [/^gfx\/interface\/topbar\/topbar_date_overlay\.dds$/, 'topbar', 'ui-topbar', 'date_plate', 'cover'],
  [/^gfx\/interface\/topbar\/speed_step\.dds$/, 'topbar', 'ui-topbar', ['speed_1', 'speed_2', 'speed_3'], 'cover'],
  [/^gfx\/interface\/topbar\/toolbar\/topbar_alert_bg\.dds$/, 'topbar', 'ui-topbar', 'alert_plate', 'cover'],
  [/^gfx\/interface\/topbar\/armyoverview_buttons_bg\.dds$/, 'topbar', 'ui-topbar', 'overview_tray', 'cover'],
  [/^gfx\/interface\/ingameclock_bg\.dds$/, 'map_interface', 'ui-map', 'clock_plate', 'cover'],
  [/^gfx\/interface\/mapmode\/mapmode_(main|bottom)_bg\.dds$/, 'map_interface', 'ui-map', 'map_tray', 'cover'],
  [/^gfx\/minimap\/border\.dds$/, 'map_interface', 'ui-map', 'minimap_frame', 'same_shape', 'shape'],
  [/^gfx\/minimap\/handle_(default|pinged)\.dds$/, 'map_interface', 'ui-map', 'handle', 'cover'],
  [/^gfx\/minimap\/(offensive|defensive)_ping_btn\.dds$/, 'map_interface', 'ui-map', 'ping_button', 'cover'],
  [/^gfx\/interface\/mapmode\/[a-z_]+_(toggle|button)\.dds$/, 'map_interface', 'ui-map', 'toggle', 'cover'],
  [/^gfx\/interface\/event_report_top_win\.dds$/, 'events', 'ui-events', 'board_top', 'cover'],
  [/^gfx\/interface\/event_report_tileable_midsection\.dds$/, 'events', 'ui-events', 'board_mid', 'repeat_y'],
  [/^gfx\/interface\/event_report_bottom_win\.dds$/, 'events', 'ui-events', 'board_bottom', 'cover'],
  [/^gfx\/interface\/event_report_bottom_win_2\.dds$/, 'events', 'ui-events', 'board_end', 'cover'],
  [/^gfx\/interface\/event_option_entry\.dds$/, 'events', 'ui-events', 'option_plate', 'cover'],
  [/^gfx\/interface\/(?:event_pic_clip|clip)\.dds$|^gfx\/interface\/events\/clip\.dds$/, 'events', 'ui-events', 'picture_clamp', 'cover'],
  [/^gfx\/interface\/event_news_bg\.dds$/, 'events', 'ui-news', 'broadsheet', 'cover'],
  [/^gfx\/interface\/event_news_pic_overlay\.dds$/, 'events', 'ui-news', 'inner_frame', 'same_shape', 'shape'],
  [/^gfx\/interface\/tiles\/tiled_focus_bg\.dds$/, 'focus', 'ui-focus', 'board_tile', 'cover'],
  [/^gfx\/interface\/focusview\/titlebar\/focus_unavailable_bg\.dds$/, 'focus', 'ui-focus', 'title_unavailable', 'cover'],
  [/^gfx\/interface\/focusview\/titlebar\/focus_can_start_bg\.dds$/, 'focus', 'ui-focus', 'title_can_start', 'cover'],
  [/^gfx\/interface\/focusview\/titlebar\/focus_completed_bg\.dds$/, 'focus', 'ui-focus', 'title_completed', 'cover'],
  [/^gfx\/interface\/(?:ongoing_focus_goal|ongoing_focus_goal_polview|search_current_focus|ongoing_generic_glow_yellow)\.dds$/, 'focus', 'ui-focus', 'ongoing_plate', 'cover'],
  [/^gfx\/interface\/techtree\/technology_(available|researched|unavailable)_item_bg\.dds$/, 'research_production', 'ui-research', m => `item_${m[1]}`, 'cover'],
  [/^gfx\/interface\/techtree\/subtechnology_(available|researched|unavailable)_item_bg\.dds$/, 'research_production', 'ui-research', m => `item_${m[1]}`, 'cover'],
  [/^gfx\/interface\/techtree\/techtree_stripes\.dds$/, 'research_production', 'ui-research', 'stripes', 'cover'],
  [/^gfx\/interface\/research_line_bg\.dds$/, 'research_production', 'ui-research', 'line_plate', 'cover'],
  [/^gfx\/interface\/tech_bonus\.dds$/, 'research_production', 'ui-research', 'bonus_plate', 'cover'],
  [/^gfx\/interface\/empty_research_slot_glow\.dds$/, 'research_production', 'ui-research', 'slot_glow', 'cover'],
  [/^gfx\/interface\/onmap_unit_counter(_empty)?\.dds$/, 'military', 'ui-military', 'counter_plate', 'cover'],
  [/^gfx\/interface\/onmap_unit_counter_selected\.dds$/, 'military', 'ui-military', 'counter_plate_selected', 'cover'],
  [/^gfx\/interface\/unitcontrol\/army_group_group_bg\.dds$/, 'military', 'ui-military', 'group_plate', 'cover'],
  [/^gfx\/interface\/unitcontrol\/unit_list_header\.dds$/, 'military', 'ui-military', 'list_header', 'cover'],
  [/^gfx\/interface\/unitcontrol\/unitcontrol_sort_buttons_strip\.dds$/, 'military', 'ui-military', 'sort_cell', 'cover'],
  [/^gfx\/interface\/unit_level\.dds$/, 'military', 'ui-military', 'level_pips', 'cover'],
  [/^gfx\/interface\/main_lobby_button\.dds$/, 'frontend', 'ui-frontend', ['menu_button_normal', 'menu_button_hover', 'menu_button_pressed'], 'cover'],
  [/^gfx\/interface\/main_lobby_divider\.dds$/, 'frontend', 'ui-frontend', 'menu_divider', 'cover'],
  [/^gfx\/interface\/play_button\.dds$/, 'frontend', 'ui-frontend', 'play_button', 'cover'],
  [/^gfx\/game_rules\/[a-z_]+\.dds$/, 'frontend', 'ui-frontend', 'rule_icon', 'contain', 'cell'],
];

// Chrome treatment of one sprite by kind, geometry, frames, luminance and name: returns the row's R fields.
function chrome(s) {
  const p = s.texture.toLowerCase(), stem = p.replace(/^.*\//, '').replace(/\.[a-z0-9]+$/, ''), name = s.name.toLowerCase();
  const f = framesOf(s), fw = s.width / f, h = s.height, lum = lumOf(s), alpha = alphaPolicy(s), ar = fw / h;
  const tag = `${stem} ${name}`;
  const strip = (sheet, cellsPerFrame, frameFit, extra = {}) => ({ sheet, cells: cellsPerFrame, fit: f > 1 ? 'strip' : frameFit, ...(f > 1 ? { frames: frameLabels(f), frameFit } : {}), alpha: extra.alpha ?? alpha });
  const repeatFrames = (cell, n = f) => Array.from({ length: n }, () => cell);
  const iconSocket = () => {
    const shape = ar > 1.6 ? 'wide' : ar < 0.62 ? 'tall' : Math.abs(ar - 1) < 0.2 ? 'round' : 'square';
    const sock = lum === 'dark' ? `socket_${shape}` : `socket_${shape}_${lum}`;
    const cell = CHROME_CELLS.has(`ui-sockets:${sock}`) ? sock : pick('ui-sockets', [`socket_${shape}`, 'socket_square'], lum);
    return { family: surfaceFamily(p, 'chrome_controls'), ...strip('ui-sockets', repeatFrames(cell), 'contain', { alpha: 'cell' }) };
  };
  // Bands: one role per frame, each resolved to a cell of the sprite's luminance class (the cells may sit in two sheets).
  const bars = (roles, fit, extra) => { const r = roles.map(x => barCell(x, lum)), sheets = [...new Set(r.map(x => x.sheet))].sort(); return strip(sheets.length === 1 ? sheets[0] : sheets, r.map(x => x.key), fit, extra); };

  // Surfaces the spec names.
  for (const [re, fam, sheet, cellSpec, fit, a] of SPECIFIC) {
    const m = re.exec(p);
    if (!m) continue;
    const key = typeof cellSpec === 'function' ? cellSpec(m) : cellSpec;
    const cells = Array.isArray(key) ? key : repeatFrames(key);
    if (cells.length !== f) continue;   // the cells do not match this texture's frames: use the generic treatment
    return { family: fam, ...strip(sheet, cells, fit, { alpha: a ?? (fit === 'same_shape' ? 'shape' : alpha) }) };
  }
  // Cornered tiles: nine-slice of a panel cell (a tile with no border in its definition cannot be sliced).
  if (s.kind === 'cornered_tile' && s.borderSize && !/(^|_)(exlusive|exclusive)_link|techline|focus_link/.test(stem)) {
    const prefer = lum === 'light' ? ['parchment'] : /marble|map|minimap/.test(tag) ? ['slate'] : /tooltip|tiles_dialog|focus_tooltip/.test(tag) ? ['tooltip'] : /mini_dialog|tiled_window_small_small|tiled_decisions|small_tiles/.test(tag) ? ['mini_dialog', 'mini_dialog_grey'] : /2b|double/.test(tag) ? ['walnut_double'] : /thin|1b_thin/.test(tag) ? ['walnut_thin'] : /plain|bg|no_frame|generic|flat|black_bg/.test(tag) && !/window/.test(tag) ? ['walnut_plain'] : lum === 'mid' ? ['bronze_plate', 'enamel_plate'] : ['walnut_thick'];
    const isSmall = prefer[0] === 'mini_dialog' || prefer[0] === 'tooltip';
    const sheet = isSmall ? 'ui-chrome-small' : 'ui-chrome-panels';
    const cell = pick(sheet, prefer, lum);
    return { family: 'chrome_panels', ...strip(sheet, repeatFrames(cell), 'nine_slice', { alpha: alpha === 'shape' ? 'shape' : alpha }) };
  }
  // Progress bars and gauges.
  if (s.kind === 'progress_bar' || /progress|_bar$|bar_|fill|gauge/.test(stem) && ar >= 2 && h <= 40) {
    const frame = /frame|bg|track|groove/.test(stem);
    return { family: surfaceFamily(p, 'chrome_bars'), ...bars(repeatFrames(frame ? 'progress_groove' : 'progress_fill'), 'cover') };
  }
  // Masked shields and flag frames: bezels whose window stays exactly the vanilla shape.
  if (s.kind === 'masked_shield' || /flag.*(overlay|frame)|(overlay|frame).*flag|shield_(thin|medium|small)|golden_frame/.test(tag)) {
    return { family: 'chrome_panels', ...strip('ui-chrome-small', repeatFrames(/gold|gilt|golden/.test(tag) ? 'flag_bezel_gilt' : 'flag_bezel'), 'same_shape', { alpha: 'shape' }) };
  }
  // Connector lines of the focus and technology trees: bronze wire, gilt when completed, red wax when exclusive; the vanilla outline keeps the shape.
  if (/(^|_)(techline|focus_link|focuslink|exlusive_link|exclusive_link|link_line)/.test(stem)) {
    const cell = /exclusive|exlusive/.test(tag) ? 'link_wax' : /researched|completed|done/.test(tag) ? 'link_gilt' : 'link_bronze';
    return { family: 'focus', ...strip('ui-focus', repeatFrames(cell), 'same_shape', { alpha: 'shape' }) };
  }
  // Glows.
  if (/glow|highlight|flash|shine/.test(tag) && (s.alpha === 'shaped' || s.kind === 'frame_animated')) {
    const cell = /red/.test(tag) ? 'glow_red' : /green|good/.test(tag) ? 'glow_green' : /yellow|amber|warn/.test(tag) ? 'glow_amber' : 'glow_gold';
    return { family: surfaceFamily(p, 'chrome_panels'), ...strip('ui-chrome-small', repeatFrames(cell), 'cover', { alpha: 'shape' }) };
  }
  // Selection lines.
  if (/selection|selected_frame|circle_selected|marker/.test(stem) && Math.max(fw, h) <= 128) {
    return { family: 'chrome_panels', ...strip('ui-chrome-small', repeatFrames('selection_line'), 'same_shape', { alpha: 'shape' }) };
  }
  // Checkboxes and radios.
  if (lum === 'dark' && /check(box)?|radio|tick/.test(stem) && Math.max(fw, h) <= 110) {
    const cells = f === 1 ? ['check_off'] : f === 2 ? ['check_off', 'check_on'] : f === 3 ? ['check_off', 'check_on', 'check_off'] : Array.from({ length: f }, (_, i) => (i % 2 ? 'check_on' : 'check_off'));
    return { family: 'chrome_controls', ...strip('ui-controls-small', cells, 'contain', { alpha: 'cell' }), ...(f > 1 ? { frames: f === 2 ? ['off', 'on'] : frameLabels(f) } : {}) };
  }
  // Close, scroll, plus, minus, expand, arrows and other small controls.
  if (lum === 'dark' && Math.max(fw, h) <= 64 && /close|cross|cancel|exit/.test(stem)) return { family: 'chrome_controls', ...strip('ui-controls-small', repeatFrames('close_stud'), 'contain', { alpha: 'cell' }) };
  if (lum === 'dark' && Math.max(fw, h) <= 80 && /(^|_)(add|plus|increase|zoom_in|expand)(_|$)/.test(stem)) return { family: 'chrome_controls', ...strip('ui-controls-small', repeatFrames('plus_stud'), 'contain', { alpha: 'cell' }) };
  if (lum === 'dark' && Math.max(fw, h) <= 80 && /(^|_)(subtract|minus|remove|decrease|zoom_out|collapse)(_|$)/.test(stem)) return { family: 'chrome_controls', ...strip('ui-controls-small', repeatFrames('minus_stud'), 'contain', { alpha: 'cell' }) };
  if (lum === 'dark' && Math.max(fw, h) <= 80 && /scroll|arrow|slider|drag|knob/.test(stem)) {
    const cell = /track/.test(stem) ? 'scroll_track' : /drager|knob|slider/.test(stem) ? 'slider_knob' : 'scroll_arrow';
    const transform = /down/.test(stem) ? 'flipy' : /left/.test(stem) ? 'rot270' : /right/.test(stem) ? 'rot90' : 'none';
    return { family: 'chrome_controls', ...strip('ui-controls-small', repeatFrames(cell), 'contain', { alpha: 'cell' }), ...(transform !== 'none' ? { transform } : {}) };
  }
  // Buttons.
  if (/button|btn|_sort|sort_|(^|_)tabs?(_|$)|toggle|dropdown/.test(stem) || /button|btn/.test(name)) {
    const isTab = /(^|_)tabs?(_|\d|$)/.test(stem);
    if (isTab) return { family: 'chrome_controls', ...bars(f === 1 ? ['tab_body'] : Array.from({ length: f }, (_, i) => (i === 0 ? 'tab_body' : 'tab_selected')), 'cover') };
    if (ar < 2.4 && Math.max(fw, h) <= 80) return iconSocket();   // a small square button is a socket of its shape and class
    const row = lum === 'mid' ? 'grey' : /alt|2$/.test(stem) ? 'alternate' : /light/.test(stem) ? 'light' : /gray|grey|disabled/.test(stem) ? 'grey' : 'standard';
    const state = i => ['normal', 'hover', 'pressed'][Math.min(i, 2)];
    const cells = f === 1 ? [`${row}_normal`] : Array.from({ length: f }, (_, i) => `${row}_${state(i)}`);
    return { family: surfaceFamily(p, 'chrome_controls'), ...strip('ui-buttons', cells, 'cover', { alpha: alpha === 'shape' ? 'shape' : alpha }) };
  }
  // Headers, titles and list entries: bands.
  if (ar >= 3.2 && h <= 160) {
    const cell = /header|title|top_bar|upper_bar|banner|divider/.test(tag) ? 'header_band' : /select|active|current/.test(tag) ? 'entry_selected' : /entry|item|row|line|list|log/.test(tag) ? 'list_entry' : /text|box|field|input|edit|value|plate|bg/.test(tag) ? 'text_plate' : 'list_entry';
    const cells = f === 1 ? [cell] : Array.from({ length: f }, (_, i) => (i === 0 ? cell : cell === 'list_entry' ? 'entry_selected' : cell));
    return { family: surfaceFamily(p, 'chrome_bars'), ...bars(cells, 'cover') };
  }
  // Panels and windows: a panel cell of the sprite's class, cover-fitted.
  if (fw >= 100 && h >= 60) {
    const sheet = 'ui-chrome-panels';
    const prefer = lum === 'light' ? ['parchment'] : /map|minimap|combat|battle|naval|landcombat/.test(tag) ? ['slate'] : lum === 'mid' ? ['bronze_plate', 'enamel_plate'] : /popup|window|win_|_win/.test(tag) ? ['walnut_thick', 'walnut_double'] : ['walnut_thin', 'walnut_plain'];
    return { family: surfaceFamily(p, 'chrome_panels'), ...strip(sheet, repeatFrames(pick(sheet, prefer, lum)), 'cover', { alpha: alpha === 'shape' ? 'shape' : alpha }) };
  }
  // Everything small that is left is an icon: a neutral socket of the sprite's shape and class.
  return iconSocket();
}

// ---------------------------------------------------------------------------------------------------- specific emblem rules
const stemOf = p => p.replace(/^.*\//, '').replace(/\.[a-z0-9]+$/, '');
const pad2 = n => String(n).padStart(2, '0');
const TEXTICON_GENERIC = /^(?:pol_power|pol_idea|pol_violence|stability_texticon|manpower_texticon|national_unity_texticon|research_icon|industry_texticon|civ_factory|civ_factory_output|mil_factory|nav_dockyard_texticon|convoy_texticon|fuel_texticon|energy_texticon|supply_texticon|supply_hub_texticon|infrastructure_texticon|population_texticon|increase_texticon|decrease_texticon|increase_reversed_texticon|decrease_reversed_texticon|trigger_yes|trigger_no|right_arrow|divisions|locked|location_pointer|army_experience|navy_experience|air_experience|neutral_experience|daynight|state|infinity_icon|doctrine_mastery|doctrine_mod|tech_mod|production_cost|prod_eff|prod_eff_cap|organization_texticon|strenght_texticon|spotting|in_combat|going_to_combat|going_to_refit|going_to_repair|merging|repairing|refitting|legitimacy|capital_hub_texticon|decision_icon_small|consumer_goods_texticon|railways_texticon|train_texticon|hq_texticon|navprod_cost|occupation_costs|puppet_texticon|territory_icon|resources_to_market_icon|out_of_power_texticon|no_type|inspect_texticon|change_government|autonomy_texticon|counter_intelligence|crypto_defense|dismantle_industry_texticon|market_subsidy_small_texticon|influence_texticon|faction_influence_icon|faction_initiative_texticon|power_balance_texticon|bop_left_texticon|bop_right_texticon)$/i;

// Returns an emblem placement { group, keys[], subjects[], lum, fit, alpha, family } or null.
function emblemRule(s, em, reachable = false) {
  const p = s.texture.toLowerCase(), stem = stemOf(p), f = framesOf(s);
  const reg = (group, key, subject, lum = lumOf(s)) => em.add(group, key, subject, lum);
  const each = (group, mk) => Array.from({ length: f }, (_, i) => { const [key, subject] = mk(i); return reg(group, key, subject); });
  const base = { fit: 'contain', alpha: 'cell' };
  // Top bar.
  if (/^gfx\/interface\/topbar\/toolbar\/[a-z_]+_button\.dds$/.test(p) && f === 2) {
    const nm = stem.replace(/_button$/, '').replace(/^topbar_/, '');
    const key = nm === 'sience' ? 'science' : nm, what = TOOLBAR_EMBLEMS[key] ?? humanize(nm);
    return { ...base, family: 'topbar', group: 'topbar_toolbar', keys: each('topbar_toolbar', i => [`tb_${key}_${i ? 'hover' : 'normal'}`, `a toolbar button plate with an emblem of ${what}, ${i ? 'one step brighter' : 'at rest'}, no lettering`]) };
  }
  if (/^gfx\/interface\/topbar\/(army|navy|air)overview_button\.dds$/.test(p)) {
    const nm = stem.replace(/overview_button$/, '');
    return { ...base, family: 'topbar', group: 'topbar_toolbar', keys: each('topbar_toolbar', i => [`tb_${nm}_${i ? 'hover' : 'normal'}`, `an overview button plate with an emblem of ${TOOLBAR_EMBLEMS[nm]}, ${i ? 'one step brighter' : 'at rest'}`]) };
  }
  const value = { pol_power_icon: 'pol_power', stability_icon: 'stability', war_support_icon: 'war_support', manpower_icon: 'manpower', unity_icon: 'unity', command_power_icon: 'command_power', industrial_capacity_icon: 'industrial_capacity' }[stem];
  if (value && /^gfx\/interface\/[a-z_]+\.dds$/.test(p)) return { ...base, family: 'topbar', group: 'topbar_toolbar', keys: each('topbar_toolbar', i => [`val_${value}${f > 1 ? `_${i + 1}` : ''}`, `a top bar value icon: ${VALUE_EMBLEMS[value]}${f > 1 ? ` (state ${i + 1} of ${f})` : ''}`]) };
  const extra = /^gfx\/interface\/(topbar_convoys|ships_icon|equipment_icon|topbar\/fuel_icon|topbar\/fuel_state_icon|topbar\/zoom_in|topbar\/zoom_out|topbar\/musicplayer\/[a-z_]+|topbar\/musicplayer_[a-z_]+|topbar\/music_[a-z_]+|topbar\/playlist_button|button_speedup|button_speeddown|topbar\/button_help|topbar\/button_menu|topbar\/toggle_shuffle_buttons)\.(dds|tga|png)$/.exec(p);
  if (extra && Math.max(s.width / f, s.height) <= 80) {
    const nm = stem;
    return { ...base, family: 'topbar', group: 'topbar_extra', keys: each('topbar_extra', i => [`ex_${nm}${f > 1 ? `_${i + 1}` : ''}`, `a small top bar control or icon meaning "${humanize(nm)}"${f > 1 ? `, state ${i + 1} of ${f}` : ''}, gilded iron and bronze, no lettering`]) };
  }
  // Gathering Dark.
  if (stem === 'world_tension_icon') return { ...base, family: 'topbar', group: 'gathering_tiers', keys: each('gathering_tiers', () => ['tier_0', `a storm lantern icon: ${GATHERING_TIERS[0]}`]) };
  if (stem === 'world_tension_icon_big_strip') return { ...base, family: 'topbar', group: 'gathering_tiers', keys: each('gathering_tiers', i => [`tier_${i}`, `a storm lantern icon: ${GATHERING_TIERS[i] ?? GATHERING_TIERS.at(-1)}`]) };
  if (stem === 'wt_anim_strip') return { ...base, family: 'topbar', group: 'gathering_flicker', keys: each('gathering_flicker', i => [`flicker_${pad2(i + 1)}`, `frame ${i + 1} of 33 of the same storm lantern, the flame flickering, dim and misted`]) };
  // Map modes.
  if (stem === 'mapmode_buttons_selected_small' || stem === 'mapmode_buttons_deselected_small') {
    const sel = stem.includes('deselected') ? 'desel' : 'sel';
    return { ...base, family: 'map_interface', group: 'mapmodes', keys: each('mapmodes', i => [`mm_${sel}_${pad2(i + 1)}`, `map mode emblem ${i + 1} of ${f}, ${sel === 'sel' ? 'selected: gilt edge and brighter' : 'deselected: dull iron'}, bronze glyph, no lettering`]) };
  }
  // Move arrows keep the vanilla shape.
  if (/^gfx\/mapitems\/movearrow_/.test(p)) {
    const kind = /attack/.test(stem) ? 'attack' : /support/.test(stem) ? 'support' : /retreat|withdraw/.test(stem) ? 'retreat' : /naval/.test(stem) ? 'naval' : /spec/.test(stem) ? 'special' : 'move';
    const subject = { attack: 'a broad cinnabar arrow texture', support: 'a broad verdigris arrow texture', retreat: 'a broad dull iron arrow texture', naval: 'a broad lapis arrow texture', special: 'a broad gilt arrow texture', move: 'a broad bronze arrow texture' }[kind];
    return { fit: 'same_shape', alpha: 'shape', family: 'map_interface', group: 'map_arrows', keys: [reg('map_arrows', `arrow_${kind}`, `${subject}, flat with a darker edge, seamless along its length`, 'mid')] };
  }
  // Alerts.
  if (stem === 'global_alert_icons' || stem === 'global_alert_icons_no_backgrounds') {
    const bare = stem.includes('no_backgrounds');
    return { ...base, family: 'alerts', group: bare ? 'alerts_bare' : 'alerts', keys: each(bare ? 'alerts_bare' : 'alerts', i => [`alert_${pad2(i + 1)}${bare ? '_bare' : ''}`, `alert emblem ${i + 1} of ${f}${bare ? ' without a plate, on black' : ' on a gilded-iron plate'}: meaning per alert_frames.json`]) };
  }
  if (stem === 'global_diplorequest_icons') return { ...base, family: 'alerts', group: 'diplo_requests', keys: each('diplo_requests', i => [`request_${pad2(i + 1)}`, `diplomatic request emblem ${i + 1} of ${f} on a gilded-iron plate: meaning per alert_frames.json`]) };
  // Relations: initiator and receiver variants share the relation kind's cell.
  if (/^gfx\/interface\/relations\//.test(p)) {
    const kind = stem.replace(/_(initiator|receiver|giver)$/, '').replace(/^relation_/, '').replace(/_relation$/, '').replace(/^equipment_purchase_contract/, 'equipment_contract');
    const hint = { guarantee: 'a shield', military_access: 'an open gate', offer_military_access: 'an open gate', trade: 'balance scales', non_agression_pact: 'a sheathed sword', non_aggression_pact: 'a sheathed sword', puppet: 'a leash of gold chain', declare_war: 'crossed blades', join_faction: 'clasped gauntlets', master: 'a gauntlet over a ring' }[kind];
    return { ...base, family: 'politics_diplomacy', group: 'relations', keys: each('relations', () => [`rel_${kind}`, `a diplomatic relation emblem meaning "${humanize(kind)}"${hint ? `: ${hint}` : ''}, bronze on a dark ground, no lettering`]) };
  }
  // Autonomy levels: bronze seals of increasing size.
  if (/^gfx\/interface\/autonomy\/autonomy_[a-z_]+\.dds$/.test(p) && s.width === 35 && !isCountryName(stem)) {
    const rank = { annex: 1, integrated_puppet: 2, puppet: 3, colony: 3, protectorate: 3, satellite: 3, supervised: 3, dominion: 4, associated_dominion: 4, freedom: 5, unknown: 0 };
    const k = Object.keys(rank).find(r => stem.includes(r)) ?? 'puppet', n = rank[k];
    return { ...base, family: 'politics_diplomacy', group: 'autonomy', keys: [reg('autonomy', n ? `seal_${n}` : 'seal_unknown', n ? `a bronze seal without imprint, size step ${n} of 5 (larger is freer)` : 'a plain bronze disc with an empty socket')] };
  }
  // Ideologies: the emblem of section 3.5.
  if (/^gfx\/interface\/ideologies\/(democratic|fascism|communism|neutrality)_group\.dds$/.test(p) || p === 'gfx/interface/ideologies/unknown.dds') {
    const k = stem.replace('_group', '');
    const subject = { democratic: 'Light: a white stone lamp with a clear steady flame, not a sun and not a veil', fascism: 'Dominion: a bronze crown resting on a sword\'s crossguard', communism: 'Shadow: a black iron circlet set with one dark stone, no face, no skull, no sigil', neutrality: 'Wild: an antler and an oak sprig bound with cord', unknown: 'a plain bronze disc with an empty socket' }[k];
    return { ...base, family: 'politics_diplomacy', group: 'ideologies', keys: [reg('ideologies', `ideology_${k}`, `an ideology emblem, ${subject}`, 'mid')] };
  }
  // Focus filters (generic set only).
  if (/^gfx\/interface\/focusview\/filter\/[a-z_]+\.dds$/.test(p) && s.width === 27 && !isCountryName(stem)) {
    const generic = /^(pol_power_icon|research_icon|industry_icon|stability_icon|war_support_icon|manpower_icon|historical_focus_filter_icon|internal_affairs_icon|international_trade_icon|military_character_icon|political_character_icon|territory_icon)$/.test(stem);
    if (!generic && !reachable) return { unreachable: 'content_filter' };
    if (!generic) return null;
    return { ...base, family: 'focus', group: 'focus_filters', keys: [reg('focus_filters', `filter_${stem.replace(/_icon$/, '')}`, `a focus filter emblem meaning "${humanize(stem.replace(/_icon$/, ''))}", bronze on a dark disc, no lettering`)] };
  }
  // Technology folders and resources.
  if (stem === 'research_folder_strip') return { ...base, family: 'research_production', group: 'folders', keys: each('folders', i => [`folder_${pad2(i + 1)}`, `a technology folder tab emblem: ${FOLDER_EMBLEMS[i] ?? `folder ${i + 1}`} (provisional until the warfare spec fixes the folder order)`]) };
  if (stem === 'resources_strip') return { ...base, family: 'research_production', group: 'resources', keys: each('resources', i => [`res_${pad2(i + 1)}`, `a resource icon, ${RESOURCE_EMBLEMS[i] ?? `resource ${i + 1}`}`]) };
  if (stem === 'building_icon_strip') return { ...base, family: 'research_production', group: 'buildings', keys: each('buildings', i => [`building_${pad2(i + 1)}`, `building emblem ${i + 1} of ${f} in the engine building order: the economy spec's Erdae building for this slot (provisional); a capped plain socket when the slot is unused`]) };
  // Army badges and roles: heraldic charges on bronze shields.
  if (/^gfx\/army_icons\/army_(selected_)?icons\.dds$/.test(p)) return { ...base, family: 'military', group: 'army_badges', keys: each('army_badges', i => [`badge_${pad2(i + 1)}`, `a heraldic badge on a bronze shield: ${CHARGES[i % CHARGES.length]}, no letters`]) };
  if (/^gfx\/army_icons\/(air|navy|army_group)_(selected_)?icons\.dds$/.test(p) || /^gfx\/army_icons\/naval_equipment_role_icons(_selected)?\.dds$/.test(p)) {
    const kind = /^gfx\/army_icons\/(air|navy|army_group)/.exec(p)?.[1] ?? 'naval_role', what = { air: 'a wing, talon or flame', navy: 'a hull, oar or sail', army_group: 'a banner or tower', naval_role: 'an oar, sail or anchor' }[kind];
    return { ...base, family: 'military', group: 'roles', keys: each('roles', i => [`role_${kind}_${pad2(i + 1)}`, `a heraldic badge on a bronze shield: ${what}, variant ${i + 1} of ${f}, no letters`]) };
  }
  // Division template icons: 122 charges on 76 x 42 and 30 x 12, large and small share a cell.
  if (/^gfx\/interface\/counters\/division_templates_(large|small)\/custom_template_(\d+)\.dds$/.test(p)) {
    const n = Number(/custom_template_(\d+)/.exec(p)[1]), idx = n < 100 ? n : n - 100 + 1;
    return { ...base, family: 'military', group: 'templates', keys: [reg('templates', `tmpl_${String(n).padStart(3, '0')}`, `a heraldic charge for a division template: ${CHARGES[idx % CHARGES.length]}, bold and simple, no letters`)] };
  }
  // Air missions, wing types, ships and weather.
  if (stem === 'mission_types') return { ...base, family: 'military', group: 'air_missions', keys: each('air_missions', i => [`mission_${pad2(i + 1)}`, `an air mission emblem ${i + 1} of ${f}: a wing, talon or flame glyph (never an aircraft), bronze on a dark ground`]) };
  if (/^gfx\/interface\/strategicair\/wing_types_(own|enemy)\.dds$/.test(p)) return { ...base, family: 'military', group: 'air_missions', keys: each('air_missions', i => [`wingtype_${stem.endsWith('enemy') ? 'enemy' : 'own'}_${i + 1}`, `a wing type emblem ${i + 1} of ${f}, ${stem.endsWith('enemy') ? 'cinnabar' : 'bronze'}`]) };
  if (/^gfx\/interface\/navalcombat\/ships\//.test(p)) {
    const cls = /submarine|raider/.test(stem) ? 'raider' : /battleship|battlecruiser|carrier|heavy|super/.test(stem) ? 'great_warship' : /cruiser|destroyer|light/.test(stem) ? 'warship' : 'galley';
    const subject = { galley: 'a galley silhouette with oars, seen from the side', warship: 'a warship silhouette, one mast, seen from the side', great_warship: 'a great warship silhouette with three masts, seen from the side', raider: 'a low black raider hull silhouette, seen from the side' }[cls];
    return { ...base, family: 'military', group: 'ships', keys: each('ships', i => [`ship_${cls}${i ? '_lost' : ''}`, `${subject}${i ? ', broken and listing' : ''}, flat bronze on a dark band`]) };
  }
  if (/^gfx\/interface\/navalcombat\/bg_weather_/.test(p)) {
    const w = stem.replace('bg_weather_', ''), night = w.endsWith('_night'), kind = w.replace('_night', '');
    return { ...base, fit: 'cover', alpha: alphaPolicy(s), family: 'military', group: 'weather', keys: [reg('weather', `sea_${kind}${night ? '_night' : ''}`, `a sea strip with oared hulls on the horizon, ${night ? 'at night, ' : ''}${kind.replace('_', ' ')} weather`, night ? 'dark' : 'mid')] };
  }
  // Cursors: one cell per cursor name (spec 4.10).
  if (/^gfx\/cursors\//.test(p)) return { ...base, family: 'cursors', group: 'cursors', writer: 'cursors', keys: [reg('cursors', `cur_${stem}`, `${cursorGlyph(stem)}, a cursor named "${humanize(stem)}"`)] };
  // Text icons: the generic set.
  if (/^gfx\/texticons\//.test(p)) {
    const key = stem.replace(/_icon_small$/, '');
    if (!TEXTICON_GENERIC.test(stem) && !reachable) return { unreachable: 'content_texticon' };
    return { ...base, family: 'texticons', group: 'texticons', keys: each('texticons', i => [`tx_${stem}${f > 1 ? `_${i + 1}` : ''}`, `a small inline glyph meaning "${humanize(key)}"${f > 1 ? `, state ${i + 1} of ${f}` : ''}`]) };
  }
  return null;
}
const isCountryName = stem => TAG_RE.test(stem.replace(/\.[a-z0-9]+$/, '')) || /^(?:sea|gdc|gxc)_/.test(stem) || /(?:reichs|volks|austro|eu_member|imperial_|kemal|kurdis|spa_)/.test(stem);

// ---------------------------------------------------------------------------------------------------- the plan
export function buildPlan(inventory, { alertFrames } = {}) {
  const em = new Emblems(), pending = [], rows = [];
  const defaults = new Set(ENGINE_DEFAULTS);
  const names = new Set(inventory.sprites.map(s => s.name));

  // The state of a sprite's references: none, reachable (some window ZIN can show names it), or all in one other state.
  const refState = s => {
    const states = Object.entries(s.refs ?? {}).flatMap(([file, windows]) => windows.map(w => windowState(file, w)));
    if (!states.length) return { none: true };
    if (states.some(x => x.state === 'reachable')) return { reachable: true };
    const first = states[0];
    return { reachable: false, state: first.state, reason: first.reason };
  };

  for (const s of inventory.sprites) {
    const p = (s.texture ?? '').toLowerCase();
    const row = { name: s.name };
    const done = (d, extra = {}) => { rows.push({ ...row, disposition: d, ...extra }); };
    const reason = (d, r) => done(d, { reason: r });

    if (s.missing || !s.texture) {
      if (['pie_chart', 'line_chart', 'circular_progress_bar'].includes(s.kind) && !s.texture) { reason('E', 'engine_drawn'); continue; }
      reason('E', 'missing_texture'); continue;
    }
    if (s.alpha === 'empty' && s.kind !== 'file') { reason('E', 'transparent_placeholder'); continue; }
    // Overridden .gfx files: O (the DLC thumbnails are U).
    const gfx = s.gfx ?? '';
    if (OVERRIDDEN_GFX.test(gfx) && !s.root) { done('O', { override: gfx }); continue; }
    if (DLC_BACKGROUND_GFX.test(gfx) && s.root) { reason('U', 'dlc_background'); continue; }
    if (s.kind === 'linked' && /shine_overlay/.test(p)) { done('R', { family: 'focus', sheet: 'ui-chrome-small', cells: ['shine'], fit: 'cover', alpha: 'cell', tranche: FAMILY_TRANCHE.focus }); continue; }

    if (PRESENTATION_TEXTURES[p]) { done('R', { family: PRESENTATION_TEXTURES[p], writer: 'presentation', state: 'in_game', tranche: FAMILY_TRANCHE[PRESENTATION_TEXTURES[p]] }); continue; }
    // The minimap picture is the ZIN map itself (spec 4.10): ui_minimap resizes the generated colormap.
    if (MINIMAP_TEXTURES.has(p)) { done('R', { family: 'map_interface', writer: 'minimap', state: 'derived', tranche: FAMILY_TRANCHE.map_interface }); continue; }
    const isDefault = defaults.has(s.name);
    const rs = refState(s), reachable = rs.reachable === true;
    // The aces: five generic riders stay.
    if (/^gfx\/aces\//.test(p)) {
      if (/ace_none|ace_m_[01]\.|ace_f_[01]\./.test(p) && !isCountry(s, p)) { pending.push({ s, ...chrome({ ...s, kind: 'sprite' }) }); continue; }
      if (!reachable) { reason('U', 'content_ace'); continue; }
    }
    // A texture a reachable window names cannot be U or H (check 4): it falls through to the chrome rules below.
    if (!isDefault) {
      let hit = null;
      for (const [re, d, r] of PATH_RULES) if (re.test(p)) { hit = [d, r]; break; }
      if (hit && (hit[0] === 'E' || (!reachable && hit[0] !== 'R'))) { reason(hit[0], hit[1]); continue; }
      if (hit?.[0] === 'R') { pending.push({ s, ...chrome(s) }); continue; }
      if (!reachable && isCountry(s, p)) { reason('U', 'content_country'); continue; }
    }
    // Emblems named by the spec.
    const e = emblemRule(s, em, reachable);
    if (e?.unreachable) { reason('U', e.unreachable); continue; }
    if (e) { pending.push({ s, emblem: e }); continue; }
    // Windows: a sprite referenced only from windows ZIN cannot show.
    if (!isDefault && rs.reachable === false) {
      const d = rs.state === 'hidden' ? 'H' : rs.state === 'engine' ? 'E' : 'U';
      reason(d, rs.reason ?? 'unreachable_window'); continue;
    }
    // Unreferenced textures in the engine folders.
    if (s.kind === 'file' && !/^gfx\/(?:cursors|minimap|mapitems)\//.test(p)) {
      reason('U', 'orphan'); continue;
    }
    if (rs.none && !isDefault && /^gfx\/interface\/(?:military_raids|military_industrial_organization|bop|npc|modifiers)\//.test(p) && !/bg|header|frame|window|tab|button/.test(p)) { reason('U', 'unreachable_window'); continue; }
    pending.push({ s, ...chrome(s) });
  }

  // Pack the emblem sheets, then finish the rows.
  const { sheets: emblemSheets } = em.pack(alertFrames);
  const byKey = new Map(emblemSheets.flatMap(sh => sh.cells.map(cell => [`${sh.group}:${cell.key}`, sh.id])));
  const finished = new Map(rows.map(r => [r.name, r]));
  const sheetFamily = new Map([...FIXED_SHEETS, ...emblemSheets].map(sh => [sh.id, sh.family]));
  for (const item of pending) {
    const s = item.s;
    if (item.emblem) {
      const e = item.emblem, sheet = byKey.get(`${e.group}:${e.keys[0]}`), f = framesOf(s);
      const sheetsUsed = new Set(e.keys.map(k => byKey.get(`${e.group}:${k}`)));
      const strip = f > 1 && !e.writer;   // a delegated writer (cursors) assembles its own frames
      const row = { name: s.name, disposition: 'R', family: e.family, sheet: sheetsUsed.size === 1 ? sheet : [...sheetsUsed].sort(), cells: e.keys, fit: strip ? 'strip' : e.fit, ...(strip ? { frames: frameLabels(f), frameFit: e.fit } : {}), alpha: e.alpha };
      if (e.writer) row.writer = e.writer;
      if (/^gfx\/minimap\/minimap\.dds$/.test((s.texture ?? '').toLowerCase())) row.writer = 'minimap';
      row.tranche = Math.max(...[...sheetsUsed].map(id => FAMILY_TRANCHE[sheetFamily.get(id)] ?? 3));
      finished.set(s.name, row);
      continue;
    }
    const row = { name: s.name, disposition: 'R', family: item.family, sheet: item.sheet, cells: item.cells, fit: item.fit, ...(item.frames ? { frames: item.frames, frameFit: item.frameFit } : {}), alpha: item.alpha, ...(item.transform ? { transform: item.transform } : {}) };
    row.tranche = FAMILY_TRANCHE[sheetFamily.get(item.sheet)] ?? FAMILY_TRANCHE[item.family] ?? 3;
    finished.set(s.name, row);
  }

  // Minimap file: its writer is ui_minimap; the other minimap files are ordinary R.
  const out = inventory.sprites.map(s => finished.get(s.name));
  const missing = out.findIndex(r => !r);
  if (missing >= 0) throw new Error(`plan left ${inventory.sprites[missing].name} without a row`);

  // One file, one treatment: sprites that share a texture file share its treatment. If any of them is R, the file
  // ships, so the others that were U or H become R with the treatment of the sprite that cuts the file finest.
  const byTexture = new Map();
  inventory.sprites.forEach((s, i) => { if (s.texture) { const k = s.texture.toLowerCase(); if (!byTexture.has(k)) byTexture.set(k, []); byTexture.get(k).push(i); } });
  const TREAT = ['family', 'sheet', 'cells', 'fit', 'frames', 'frameFit', 'alpha', 'transform', 'writer', 'state', 'tranche'];
  for (const idxs of byTexture.values()) {
    if (idxs.length < 2) continue;
    const rRows = idxs.filter(i => out[i].disposition === 'R');
    if (!rRows.length) continue;
    const lead = [...rRows].sort((a, b) => framesOf(inventory.sprites[b]) - framesOf(inventory.sprites[a]) || (inventory.sprites[a].name < inventory.sprites[b].name ? -1 : 1))[0];
    const treat = Object.fromEntries(TREAT.filter(k => out[lead][k] !== undefined).map(k => [k, JSON.parse(JSON.stringify(out[lead][k]))]));
    for (const i of idxs) if (['R', 'U', 'H'].includes(out[i].disposition)) out[i] = { name: out[i].name, disposition: 'R', ...treat };
  }

  const sheets = [...FIXED_SHEETS, ...emblemSheets].map(sh => ({ ...sh, tranche: FAMILY_TRANCHE[sh.family] ?? 3 }));
  const used = new Set(out.filter(r => r.disposition === 'R').flatMap(r => [].concat(r.sheet)));
  const live = sheets.filter(sh => used.has(sh.id));
  const problems = live.flatMap(validateSheet);
  if (problems.length) throw new Error(`sheet definitions: ${problems.join('; ')}`);
  const counts = {}; for (const r of out) counts[r.disposition] = (counts[r.disposition] ?? 0) + 1;
  const usedReasons = Object.fromEntries([...new Set(out.map(r => r.reason).filter(Boolean))].sort().map(k => [k, REASONS[k]]));
  const header = {
    inventory: { game: inventory.header.game.version, sprites: inventory.sprites.length, textureDigest: inventory.header.textureDigest },
    counts: Object.fromEntries(Object.entries(counts).sort(([a], [b]) => (a < b ? -1 : 1))),
    reasons: usedReasons,
    windows: { states: GUI_STATES.map(([re, state, reason]) => ({ pattern: re.source, state, reason })), hidden: HIDDEN_WINDOWS },
    engineDefaults: ENGINE_DEFAULTS.filter(n => names.has(n)),
    decisions: DECISIONS,
  };
  return { rows: out, sheets: live, header };
}

// Serialise: the header pretty-printed, one row per line so a game patch gives a readable diff.
export function serializeReskin({ rows, header }) {
  return `{\n "format": 1,\n "header": ${JSON.stringify(header, null, 1).replace(/\n/g, '\n ')},\n "rows": [\n${rows.map(r => JSON.stringify(r)).join(',\n')}\n ]\n}\n`;
}
export const sheetJson = sheet => JSON.stringify(sheet, null, 1) + '\n';
export { SHEET_ASPECTS };
