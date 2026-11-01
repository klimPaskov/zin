// Event, news, pause-menu, options and Gathering Dark windows (UI overhaul lane W5, docs/plans/ui_overhaul/02_plan.md phase 2;
// design system docs/specs/07_interface/07_design_system.md §1.3 to §1.5, §2, §3, §5, §6.1 to §6.3, §7; K69, K70).
//
//   buildDialogs(staged, { rawPath, provenance, game })  -> { sprites, overrides, manifest, counts }
//
// Sprites: every texture of data/ui/dialogs.json is cut from an accepted lane C1 chrome sheet (art/source/ui/reskin/<sheet>.png): code
// crops, reduces, repeats and places generated pixels (lib/fit.mjs) and clears the inside of a picture frame; nothing is painted. The
// sprites go to interface/zin_dialogs.gfx and their lineage to art/source/dialogs_manifest.json.
//
// Overrides (closed list of lib/ui_plan.mjs OVERRIDE_FILES): each file is the installed vanilla file with some top-level windows
// replaced by the ZIN layouts below and, for the options, sprite names swapped. Every element name of the vanilla file is kept (builder
// check 8), so the engine finds each control it binds by name. A window draws only its own textures, so it takes its own theme even
// where vanilla shares a texture across areas (lane C1 handoff, renders/C1/theme_conflicts.json).
//   interface/eventwindow.gui            EventWindow, EventWindow_leader, EventWindow_News, event_option_entry (Chancery; options neutral)
//   interface/ingamemenu.gui             ingamemenu re-flowed and neutral; ingamemenu_load and ingamemenu_save drawn by neutral pieces
//   interface/worldtensionwindowpopup.gui  world_tension_popup (Chronicle)
//   interface/settings.gui               sprite swap only (neutral options panel and rows)
// EventWindow_Operative stays as vanilla: ZIN has no operative events (reskin reason operative_event).
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { GAME, rawFile, provenanceFile } from '../lib/paths.mjs';
import { runFit, crop, makeImg } from '../lib/fit.mjs';
import { dds, fromRaw } from '../lib/raster.mjs';
import { acceptance } from './presentation.mjs';
import { readSheetCells, loadSheets, SHEET_RAW_DIR } from './ui_reskin.mjs';

export const DIALOGS_FILE = fileURLToPath(new URL('../data/ui/dialogs.json', import.meta.url));
export const DIALOGS_GFX = 'interface/zin_dialogs.gfx';
export const DIALOGS_MANIFEST = 'art/source/dialogs_manifest.json';
export const loadDialogs = (file = DIALOGS_FILE) => JSON.parse(readFileSync(file, 'utf8'));
const sha256 = b => createHash('sha256').update(b).digest('hex');
const ord = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const pair = v => (Array.isArray(v) ? v : [v, v]);

// ==================================================================================================== sprites
// Clears the inside of a frame (inside `rim` pixels from every edge): the picture drawn under it shows through.
export function hollow(img, rim) {
  const out = makeImg(img.w, img.h, Buffer.from(img.data));
  for (let y = rim; y < img.h - rim; y++) for (let x = rim; x < img.w - rim; x++) out.data[(y * img.w + x) * 4 + 3] = 0;
  return out;
}

async function fitSprite(s, cellOf, sheets) {
  const sheet = sheets.get(s.sheet);
  const border = key => { const def = sheet.cells.find(c => c.key === key); return def?.border ?? sheet.cellBorder ?? 0.06; };
  const cells = s.cells.map(k => cellOf(s.sheet, k));
  const frames = cells.length, [w, h] = s.size;
  const cellBorder = c => Math.max(1, Math.round(border(s.cells[cells.indexOf(c)]) * Math.min(c.w, c.h)));
  const target = { width: w * frames, height: h, frames, ...(s.kind === 'cornered' ? { borderSize: pair(s.border) } : {}) };
  const opts = { frame: s.frame, cellBorder, padding: s.padding, seed: `${s.texture}`, alpha: s.kind === 'button' && s.fit === 'contain' ? 'cell' : 'opaque' };
  const r = frames > 1 ? await runFit('strip', cells, target, { ...opts, frameFit: s.fit }) : await runFit(s.fit, cells, target, opts);
  let img = r.img;
  const ops = [...r.ops];
  if (s.hollow) { img = hollow(img, s.frame); ops.push(`hollow inside ${s.frame} px`); }
  return { img, ops };
}

export async function buildDialogSprites({ spec = loadDialogs(), sheets = loadSheets(), provenance, rawPath = rawFile } = {}) {
  const lines = provenance ?? (existsSync(provenanceFile()) ? readFileSync(provenanceFile(), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)) : []);
  const state = new Map();
  for (const id of spec.sheets) {
    const rel = `${SHEET_RAW_DIR}/${id}.png`, file = rawPath(rel);
    if (!file || !existsSync(file)) throw new Error(`dialogs: no raw sheet ${rel}`);
    const bytes = readFileSync(file), acc = acceptance(lines, rel, bytes);
    if (!acc.ok) throw new Error(`dialogs: ${rel} is not accepted (${acc.why})`);
    state.set(id, { rel, sha: acc.sha, cells: await readSheetCells(sheets.get(id), file) });
  }
  const cellOf = (id, key) => { const c = state.get(id)?.cells.get(key); if (!c) throw new Error(`dialogs: no cell ${id}.${key}`); return c; };
  const plates = new Map();
  for (const [k, p] of Object.entries(spec.plates ?? {})) plates.set(k, { p, ...(await fitSprite({ ...p, kind: 'sprite', texture: `plate_${k}` }, cellOf, sheets)) });
  const out = [];
  for (const s of spec.sprites) {
    let img, ops, src;
    if (s.kind === 'slice') {
      const pl = plates.get(s.plate);
      if (!pl) throw new Error(`dialogs: ${s.name} names no plate ${s.plate}`);
      const [x, y, w, h] = s.crop;
      if (x + w > pl.img.w || y + h > pl.img.h) throw new Error(`dialogs: ${s.name} crop ${s.crop} leaves the ${pl.img.w}x${pl.img.h} plate`);
      img = crop(pl.img, x, y, w, h); ops = [...pl.ops, `crop ${w}x${h} at ${x},${y} of the ${s.plate} plate`]; src = pl.p;
    } else ({ img, ops } = await fitSprite(s, cellOf, sheets), src = s);
    const st = state.get(src.sheet);
    out.push({ ...s, texture: `${spec.dir}/${s.texture}`, img, ops, source: `art/source/${st.rel}`, sourceSha256: st.sha, sheetId: src.sheet, cellKeys: src.cells, frames: s.kind === 'button' ? s.cells.length : 1 });
  }
  return { sprites: out, sources: [...state.values()].map(s => s.rel) };
}

export function dialogsGfx(sprites) {
  const blocks = sprites.map(s => {
    if (s.kind === 'cornered') { const [bx, by] = pair(s.border); return `\tcorneredTileSpriteType = {\n\t\tname = "${s.name}"\n\t\tsize = { x = ${s.size[0]} y = ${s.size[1]} }\n\t\ttexturefile = "${s.texture}"\n\t\tborderSize = { x = ${bx} y = ${by} }\n\t\ttilingCenter = yes\n\t}`; }
    const extra = s.kind === 'button' ? `\n\t\tnoOfFrames = ${s.frames}\n\t\teffectFile = "gfx/FX/buttonstate.lua"` : '';
    return `\tspriteType = {\n\t\tname = "${s.name}"\n\t\ttexturefile = "${s.texture}"${extra}\n\t}`;
  });
  return `# Generated by the ZIN content builder (modules/ui_dialogs.mjs, UI overhaul lane W5): sprites of the event, news, pause-menu, options and\n# Gathering Dark windows, cut from the accepted chrome sheets (data/ui/dialogs.json).\nspriteTypes = {\n${blocks.join('\n')}\n}\n`;
}

// ==================================================================================================== .gui text
// Top-level windows of a .gui file: [{ name, start, end }] for every block opened at depth 1 (inside guiTypes). Comments are skipped.
export function topWindows(text) {
  const out = [];
  let depth = 0, lineStart = 0, blockStart = -1;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '\n') { lineStart = i + 1; continue; }
    if (c === '#') { while (i < text.length && text[i] !== '\n') i++; lineStart = i + 1; continue; }
    if (c === '"') { i++; while (i < text.length && text[i] !== '"') i++; continue; }
    if (c === '{') { if (depth === 1) blockStart = lineStart; depth++; }
    else if (c === '}') {
      depth--;
      if (depth === 1 && blockStart >= 0) {
        const block = text.slice(blockStart, i + 1), m = /name\s*=\s*"?([A-Za-z0-9_]+)"?/.exec(block.replace(/#[^\n]*/g, ''));
        out.push({ name: m?.[1] ?? null, start: blockStart, end: i + 1 });
        blockStart = -1;
      }
    }
  }
  return out;
}
// Replaces the named top-level windows; every name must exist exactly once.
export function replaceWindows(text, blocks) {
  const wins = topWindows(text);
  let out = text;
  for (const [name, block] of Object.entries(blocks).sort(([a], [b]) => wins.findIndex(w => w.name === b) - wins.findIndex(w => w.name === a))) {
    const hits = wins.filter(w => w.name === name);
    if (hits.length !== 1) throw new Error(`dialogs: ${hits.length} top-level windows named ${name}`);
    out = out.slice(0, hits[0].start) + block.replace(/^\n+|\n+$/g, '') + out.slice(hits[0].end);
  }
  return out;
}
const HEAD = file => `# ${file}: generated by the ZIN content builder (modules/ui_dialogs.mjs, UI overhaul lane W5) from the installed vanilla file.\n# The windows named in the module are ZIN layouts; every vanilla element name is kept so the engine binds each control.\n`;

// ---------------------------------------------------------------------------------------------------- the event windows
// Grid 4 px (design system §3); frame 16, title band 40, gutter 8. Faces (design system §2.1, lane C2 aliases): event titles in Garamond 24
// light (hoi4_typewriter22_inverted, title case, narrow enough for the longest ZIN title of 45 characters), bodies in Garamond 16 ink
// (hoi4_typewriter16) on the vellum; 1.19.4.1 has no bitmap font named garamond_16, only these aliases of its glyph files. Engine-sized: the engine grows `midsection` to its Description
// (position plus text height) and moves `bottom_Window` under it; the options grid grows downwards. Description pads its text by its
// own borderSize, so the reading plate keeps its margin whatever the engine sets.
const titleBand = (w, { titleFont = 'hoi4_typewriter22_inverted' } = {}) => `
		containerWindowType = {
			name = "top_Window"
			position = { x = 16 y = 16 }
			size = { width = ${w} height = 40 }
			moveable = yes
			clipping = no
			Orientation = UPPER_LEFT

			background = {
				name = "Background"
				quadTextureSprite = "GFX_zin_event_title"
			}
			instantTextBoxType = {
				name = "Title"
				position = { x = 44 y = 8 }
				font = "${titleFont}"
				borderSize = { x = 0 y = 0 }
				text = "Title text here!"
				maxWidth = ${w - 88}
				maxHeight = 24
				fixedsize = yes
				format = centre
			}
			buttonType = {
				name = "btn_minimize"
				position = { x = 4 y = 4 }
				spriteType = "GFX_zin_event_minimize"
				clicksound = click_default
				pdx_tooltip = "MINIMIZE_EVENT"
			}
__EXTRA__
		}`;

export const EVENT_WINDOW = `
	containerWindowType = {
		name = "EventWindow"
		position = { x = -300 y = -312 }
		size = { width = 600 height = 388 }
		moveable = yes
		Orientation = CENTER

		show_sound = event_popup
		hide_sound = menu_close_window

		background = {
			name = "Background"
			spriteType = "GFX_zin_event_window"
		}
${titleBand(568).replace('__EXTRA__\n', '')}

		containerWindowType = {
			name = "midsection"
			position = { x = 16 y = 64 }
			size = { width = 568 height = 100 }
			moveable = yes
			clipping = no
			Orientation = UPPER_LEFT

			background = {
				name = "Background"
				quadTextureSprite = "GFX_zin_event_reading"
			}
			instantTextBoxType = {
				name = "Description"
				position = { x = 24 y = 16 }
				font = "hoi4_typewriter16"
				text_color_code = "b"
				borderSize = { x = 0 y = 0 }
				text = "Long text here!"
				maxWidth = 520
				maxHeight = 352
				format = left
			}
		}

		containerWindowType = {
			name = "bottom_Window"
			position = { x = 16 y = 172 }
			size = { width = 568 height = 200 }
			moveable = yes
			clipping = no
			Orientation = UPPER_LEFT

			iconType = {
				name = "event_picture"
				spriteType = "GFX_report_event_001"
				position = { x = 8 y = 8 }
				Orientation = "UPPER_LEFT"
				alwaystransparent = yes
			}
			iconType = {
				name = "event_pic_clip"
				spriteType = "GFX_zin_event_picture_frame"
				position = { x = 0 y = 0 }
				Orientation = "UPPER_LEFT"
				alwaystransparent = yes
			}
			gridBoxType = {
				name = "options_grid"
				position = { x = 248 y = 4 }
				size = { width = 312 height = 40 }
				slotsize = { width = 312 height = 44 }
				max_slots_horizontal = 1
				format = "UPPER_LEFT"
			}
		}
	}`;

export const EVENT_WINDOW_LEADER = `
	containerWindowType = {
		name = "EventWindow_leader"
		position = { x = -300 y = -312 }
		size = { width = 600 height = 392 }
		moveable = yes
		Orientation = CENTER

		show_sound = event_popup
		hide_sound = menu_close_window

		background = {
			name = "Background"
			spriteType = "GFX_zin_event_window"
		}
${titleBand(568).replace('__EXTRA__\n', '')}

		containerWindowType = {
			name = "midsection"
			position = { x = 16 y = 64 }
			size = { width = 568 height = 244 }
			moveable = yes
			clipping = no
			Orientation = UPPER_LEFT

			background = {
				name = "Background"
				quadTextureSprite = "GFX_zin_event_reading"
			}
			containerWindowType = {
				name = "leader_picture_container"
				position = { x = 12 y = 12 }
				size = { width = 100% height = 100% }

				iconType = {
					name = "leader"
					position = { x = 8 y = 8 }
					spriteType = "GFX_leader_unknown"
					Orientation = "UPPER_LEFT"
					alwaystransparent = yes
				}
				iconType = {
					name = "leader_frame"
					spriteType = "GFX_zin_leader_picture_frame"
					position = { x = 0 y = 0 }
					Orientation = "UPPER_LEFT"
					alwaystransparent = yes
				}
			}
			instantTextBoxType = {
				name = "Description"
				position = { x = 200 y = 16 }
				font = "hoi4_typewriter16"
				text_color_code = "b"
				borderSize = { x = 0 y = 0 }
				text = "Long text here!"
				maxWidth = 344
				maxHeight = 352
				format = left
			}
		}

		containerWindowType = {
			name = "bottom_Window"
			position = { x = 16 y = 316 }
			size = { width = 568 height = 60 }
			moveable = yes
			clipping = no
			Orientation = UPPER_LEFT

			gridBoxType = {
				name = "options_grid"
				position = { x = 128 y = 4 }
				size = { width = 312 height = 40 }
				slotsize = { width = 312 height = 44 }
				max_slots_horizontal = 1
				format = "UPPER_LEFT"
			}
		}

		containerWindowType = {
			name = "bottom_window_end"
			position = { x = 16 y = 376 }
			size = { width = 568 height = 0 }
			moveable = yes
			Orientation = UPPER_LEFT
		}
	}`;

// News: one vellum page under the title band, the picture in its bronze moulding at the head of the page and the text below it. The
// page (midsection) is defined before top_Window so that the picture, which vanilla keeps in top_Window, is drawn over the page.
export const EVENT_WINDOW_NEWS = `
	containerWindowType = {
		name = "EventWindow_News"
		position = { x = -280 y = -304 }
		size = { width = 560 height = 444 }
		moveable = yes
		Orientation = CENTER

		show_sound = event_popup
		hide_sound = menu_close_window

		background = {
			name = "Background"
			spriteType = "GFX_zin_event_window"
		}

		containerWindowType = {
			name = "midsection"
			position = { x = 16 y = 64 }
			size = { width = 528 height = 300 }
			moveable = yes
			clipping = no
			Orientation = UPPER_LEFT

			background = {
				name = "Background"
				quadTextureSprite = "GFX_zin_event_reading"
			}
			instantTextBoxType = {
				name = "Description"
				position = { x = 24 y = 196 }
				font = "hoi4_typewriter16"
				text_color_code = "b"
				borderSize = { x = 0 y = 0 }
				text = "Long text here!"
				maxWidth = 480
				maxHeight = 304
				format = left
			}
		}
${titleBand(528).replace('__EXTRA__', `
			iconType = {
				name = "event_picture"
				spriteType = "GFX_news_event_001"
				position = { x = 64 y = 68 }
				Orientation = "UPPER_LEFT"
				alwaystransparent = yes
			}
			iconType = {
				name = "event_picture_overlay"
				spriteType = "GFX_zin_news_picture_frame"
				position = { x = 56 y = 60 }
				Orientation = "UPPER_LEFT"
				alwaystransparent = yes
			}`)}

		containerWindowType = {
			name = "bottom_Window"
			position = { x = 16 y = 372 }
			size = { width = 528 height = 56 }
			moveable = yes
			clipping = no
			Orientation = UPPER_LEFT

			gridBoxType = {
				name = "options_grid"
				position = { x = 108 y = 4 }
				size = { width = 312 height = 40 }
				slotsize = { width = 312 height = 44 }
				max_slots_horizontal = 1
				format = "UPPER_LEFT"
			}
		}
	}`;

// An option: a neutral iron plate (design system §6.1); the label in the label face, two lines at most.
export const EVENT_OPTION_ENTRY = `
	containerWindowType = {
		name = "event_option_entry"
		size = { width = 312 height = 40 }
		clipping = no

		background = {
			name = "event_option_background"
			spriteType = "GFX_zin_event_option"
		}
		instantTextBoxType = {
			name = "Name"
			position = { x = 12 y = 0 }
			font = "hoi_16mbs"
			maxWidth = 288
			maxHeight = 40
			format = center
			vertical_alignment = center
			alwaystransparent = yes
		}
	}`;

// ---------------------------------------------------------------------------------------------------- the pause menu
// Spec 06 §5: Load, Save, Options, Resign, Quit and Close; the playthrough statistics, the wiki, the achievements and the seven community
// and marketing links are hidden; the homepage and the privacy policy stay. A hidden control keeps its name and its vanilla parent (the
// engine may look a control up through its row), carries `hide = yes` and sits below the window, whose clipping cuts it even if the engine
// shows it again.
const HIDDEN_Y = 2000;
const menuButton = (name, y, text, extra = '') => `
		buttonType = {
			name = "${name}"
			position = { x = 16 y = ${y} }
			spriteType = "GFX_zin_menu_button"
			buttonText = "${text}"
			buttonFont = "hoi_20bs"
			clicksound = click_default
			oversound = ui_menu_over${extra}
		}`;
const link = (name, x, sprite, tooltip, extra = '') => `
				buttonType = {
					name = "${name}"
					position = { x = ${x} y = 0 }
					quadTextureSprite = "${sprite}"
					pdx_tooltip = "${tooltip}"${extra}
					scale = 0.9
				}`;
export const INGAME_MENU = `
	containerWindowType = {
		name = "ingamemenu"
		position = { x = 0 y = 0 }
		size = { width = 320 height = 332 }
		Orientation = center
		Origo = center
		fade_time = 500
		fade_type = linear
		show_sound = click_expand

		background = {
			name = "Background"
			quadTextureSprite = "GFX_zin_dialog_window"
		}
${menuButton('menu_load_button', 24, 'MENU_BAR_LOAD_GAME')}
${menuButton('menu_save_button', 64, 'MENU_BAR_SAVE_GAME')}
${menuButton('menu_gamesettings_button', 104, 'MENU_BAR_GAME_OPTIONS')}
${menuButton('menu_resign_button', 144, 'MENU_BAR_GAME_RESIGN')}
${menuButton('menu_quit_button', 184, 'MENU_BAR_QUIT')}
${menuButton('menu_close_button', 236, 'CLOSE', '\n\t\t\tshortcut = "ESCAPE"')}

		containerWindowType = {
			name = "first_row"
			position = { x = 120 y = 284 }
			size = { width = 80 height = 40 }
${link('homepage_button', 0, 'homepage', 'MENU_HOMEPAGE', '\n\t\t\t\t\tclicksound = click_default')}
${link('privacy_policy_button', 40, 'privacy', 'MENU_PRIVACY_POLICY')}
${link('forum_button', 0, 'forum', 'MENU_FORUM', `\n\t\t\t\t\tclicksound = click_default\n\t\t\t\t\tweb_link = ""\n\t\t\t\t\thide = yes`).replace('y = 0 }', `y = ${HIDDEN_Y} }`)}
${link('discord_button', 0, 'discord', 'MENU_DISCORD', `\n\t\t\t\t\tweb_link = ""\n\t\t\t\t\thide = yes`).replace('y = 0 }', `y = ${HIDDEN_Y} }`)}
		}

		containerWindowType = {
			name = "second_row"
			position = { x = 0 y = ${HIDDEN_Y} }
			hide = yes
${link('bluesky_button', 0, 'bluesky', 'MENU_BLUESKY', '\n\t\t\t\t\tweb_link = ""')}
${link('twitter_button', 0, 'x', 'MENU_X', '\n\t\t\t\t\tweb_link = ""')}
${link('facebook_button', 0, 'facebook', 'MENU_FACEBOOK', '\n\t\t\t\t\tclicksound = click_default\n\t\t\t\t\tweb_link = ""')}
${link('instagram_button', 0, 'instagram', 'MENU_INSTAGRAM', '\n\t\t\t\t\tweb_link = ""')}
${link('youtube_button', 0, 'youtube', 'MENU_YOUTUBE', '\n\t\t\t\t\tweb_link = ""')}
		}
${menuButton('menu_playthrough_stats_button', HIDDEN_Y, 'MENU_BAR_PLAYTHROUGH_STATS', '\n\t\t\thide = yes')}
		iconType = {
			name = "menu_playthrough_stats_button_star"
			position = { x = 16 y = ${HIDDEN_Y} }
			spriteType = "GFX_icon_best_in_career"
			alwaysTransparent = yes
			hide = yes
		}
${menuButton('menu_wiki_button', HIDDEN_Y, 'MENU_BAR_GAME_WIKI', '\n\t\t\tweb_link = ""\n\t\t\thide = yes')}
		ButtonType = {
			name = "achievements_button"
			position = { x = 16 y = ${HIDDEN_Y} }
			quadTextureSprite = "achievements"
			pdx_tooltip = "MENU_ACHIEVEMENTS"
			hide = yes
		}
	}`;
// The load and save panels keep the vanilla layout; their pieces are cut from one neutral dialog plate each (data/ui/dialogs.json plates).
export const MENU_SPRITE_SWAPS = {
  ingamemenu_load: { GFX_load_save_top_screen: 'GFX_zin_menu_list_load_top', GFX_load_save_bottom: 'GFX_zin_menu_list_load_bottom', GFX_no_frame_special_bg: 'GFX_zin_menu_list_load' },
  ingamemenu_save: { GFX_load_save_top_screen: 'GFX_zin_menu_list_save_top', GFX_load_save_bottom_screen: 'GFX_zin_menu_list_save_bottom', GFX_no_frame_special_bg: 'GFX_zin_menu_list_save' },
};
export const SETTINGS_SPRITE_SWAPS = { GFX_settings_tabs_bottom: 'GFX_zin_settings_panel', GFX_generic_bg_417: 'GFX_zin_settings_row' };

// ---------------------------------------------------------------------------------------------------- the Gathering Dark history
const sortButton = (name, x, text, tooltip) => `
		buttonType = {
			name = "${name}"
			spriteType = "GFX_sort_button_100x29_2"
			buttonFont = "hoi_16mbs"
			clicksound = click_default
			position = { x = ${x} y = 68 }
			text = ${text}
			pdx_tooltip = ${tooltip}
		}`;
export const TENSION_POPUP = `
	containerWindowType = {
		name = "world_tension_popup"
		position = { x = -264 y = -264 }
		size = { width = 528 height = 528 }
		orientation = center
		moveable = yes
		fade_time = 200
		fade_type = linear
		click_to_front = yes

		background = {
			name = "Background"
			quadTextureSprite = "GFX_zin_tension_window"
		}
		iconType = {
			name = "zin_tension_title_band"
			spriteType = "GFX_zin_tension_title"
			position = { x = 16 y = 16 }
			alwaystransparent = yes
		}
		instantTextboxType = {
			name = "window_name"
			position = { x = 16 y = 24 }
			font = "hoi_24header"
			text = THREAT_WINDOW_NAME
			maxWidth = 496
			maxHeight = 24
			fixedsize = yes
			format = center
		}
		buttonType = {
			name = "close_button"
			position = { x = 204 y = 472 }
			quadTextureSprite = "GFX_button_123x34"
			buttonFont = "hoi_16mbs"
			shortcut = "ESCAPE"
			Orientation = "UPPER_LEFT"
			buttonText = "DIPLOMACY_CLOSE"
			pdx_tooltip = "CLOSE"
			clicksound = click_close
		}
${sortButton('sort_date_button', 52, 'DATE_NAME', 'SORT_BY_DATE')}
${sortButton('sort_country_button', 160, 'country', 'SORT_BY_COUNTRY')}
${sortButton('sort_value_button', 268, 'WORLD_TENSION_NAME', 'SORT_BY_TENSION')}
${sortButton('show_wars_button', 376, 'WORLD_TENSION_WARS', 'SHOW_WARS')}

		containerWindowType = {
			name = "tension_entries_wnd"
			position = { x = 16 y = 108 }
			orientation = upper_left
			size = { width = 496 height = 352 }
			margin = { top = 8 left = 0 bottom = 8 right = 16 }
			verticalScrollbar = "right_vertical_slider"
			scroll_wheel_factor = 44
			smooth_scrolling = yes

			background = {
				name = "Background"
				quadTextureSprite = "GFX_zin_tension_list"
			}
			gridBoxType = {
				name = "list"
				position = { x = 16 y = 4 }
				size = { width = 464 height = 100%% }
				max_slots_horizontal = 1
				slotsize = { width = 464 height = 44 }
			}
			instantTextboxType = {
				name = "no_surces_info"
				position = { x = 0 y = 48 }
				font = "hoi_18mbs"
				text = NO_THREAT_SOURCES_WINDOW
				maxWidth = 496
				maxHeight = 100
				format = center
			}
		}
	}`;

// Swaps sprite references (`spriteType = "X"` or `quadTextureSprite = "X"`) inside the named top-level windows (or the whole file).
export function swapSprites(text, swaps, windows) {
  const re = new RegExp(`((?:spriteType|quadTextureSprite)\\s*=\\s*"?)(${Object.keys(swaps).join('|')})("?)`, 'g');
  let n = 0;
  const sub = s => s.replace(re, (_, a, name, b) => { n++; return `${a}${swaps[name]}${b}`; });
  if (!windows) return { text: sub(text), n };
  const wins = topWindows(text).filter(w => windows.includes(w.name)).sort((a, b) => b.start - a.start);
  let out = text;
  for (const w of wins) out = out.slice(0, w.start) + sub(out.slice(w.start, w.end)) + out.slice(w.end);
  return { text: out, n };
}

export function dialogOverrides(read = f => readFileSync(`${GAME}/${f}`, 'latin1')) {
  const files = new Map();
  const ev = replaceWindows(read('interface/eventwindow.gui'), { EventWindow: EVENT_WINDOW, EventWindow_leader: EVENT_WINDOW_LEADER, EventWindow_News: EVENT_WINDOW_NEWS, event_option_entry: EVENT_OPTION_ENTRY });
  files.set('interface/eventwindow.gui', HEAD('interface/eventwindow.gui') + ev);
  let menu = replaceWindows(read('interface/ingamemenu.gui'), { ingamemenu: INGAME_MENU });
  for (const [win, swaps] of Object.entries(MENU_SPRITE_SWAPS)) {
    const r = swapSprites(menu, swaps, [win]);
    if (r.n !== Object.keys(swaps).length) throw new Error(`dialogs: ${win} swapped ${r.n} sprites, expected ${Object.keys(swaps).length}`);
    menu = r.text;
  }
  files.set('interface/ingamemenu.gui', HEAD('interface/ingamemenu.gui') + menu);
  files.set('interface/worldtensionwindowpopup.gui', HEAD('interface/worldtensionwindowpopup.gui') + replaceWindows(read('interface/worldtensionwindowpopup.gui'), { world_tension_popup: TENSION_POPUP }));
  const st = swapSprites(read('interface/settings.gui'), SETTINGS_SPRITE_SWAPS);
  if (st.n < 2) throw new Error(`dialogs: settings.gui swapped ${st.n} sprites`);
  files.set('interface/settings.gui', HEAD('interface/settings.gui') + st.text);
  return files;
}

// ==================================================================================================== build
export async function buildDialogs(staged, opts = {}) {
  const { sprites, sources } = await buildDialogSprites(opts);
  const manifest = [];
  const written = new Set();
  for (const s of sprites) {
    if (written.has(s.texture)) continue;
    written.add(s.texture);
    const bytes = dds(fromRaw(s.img.data, s.img.w, s.img.h));
    staged.add(s.texture, bytes);
    manifest.push({ out: s.texture, source: s.source, sourceSha256: s.sourceSha256, cells: [...new Set(s.cellKeys)].sort(ord), sheets: [s.sheetId], ops: [...s.ops, 'dds a8r8g8b8'], sha256: sha256(bytes) });
  }
  staged.add(DIALOGS_GFX, Buffer.from(dialogsGfx(sprites)));
  const overrides = dialogOverrides(opts.read);
  for (const [rel, text] of overrides) staged.add(rel, Buffer.from(text, 'latin1'));
  staged.add(DIALOGS_MANIFEST, Buffer.from(JSON.stringify({ generator: 'tools/content/modules/ui_dialogs.mjs', files: manifest.sort((a, b) => ord(a.out, b.out)) }, null, 1) + '\n'));
  return { sprites, sources, overrides: [...overrides.keys()], manifest, counts: { sprites: sprites.length, textures: manifest.length, overrides: overrides.size } };
}
