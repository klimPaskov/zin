// A small panel builder for the power mechanics' windows (docs/specs/07_interface/01_interface.md sections 7 and 9): one themed
// window with tabs, text, gauges and a launcher button, written as a .gui file and its scripted GUI. Every picture is an existing ZIN
// sprite (GFX_zin_frame, GFX_zin_button, GFX_zin_rule) or a catalog icon registered as a sprite; no texture is made here. A gauge is
// a marker icon that slides along GFX_zin_rule; its x is a country variable that the panel's refresh effect computes.
import { fmt } from './mp_kit.mjs';

const FONT = { small: 'hoi_16mbs', mid: 'hoi_18mbs', head: 'hoi_24header' };
const blk = (name, body) => `${name} = {\n${body}\n}`;

// defined_text with a fallback: cases are [trigger, key, text]; the last case may have no trigger.
export function definedText(name, cases, loc) {
  const body = cases.map(([trig, key, text]) => { loc.set(key, text); return trig ? `text = {\ntrigger = {\n${trig}\n}\nlocalization_key = ${key}\n}` : `text = { localization_key = ${key} }`; });
  return fmt(blk('defined_text', `name = ${name}\n${body.join('\n')}`), 0);
}

export class Panel {
  // o: { prefix, gui, window, flag, title, titleKey, launcher, launcherKey, launcherTip, visible, launcherVisible, refresh, w, h, tabs:[{key,label,visible?}], markerSprite }
  constructor(o) { this.o = o; this.els = []; this.loc = new Map(); this.triggers = new Map(); this.props = new Map(); this.effects = new Map(); this.sprites = new Map(); }
  id(name) { return `${this.o.prefix}_${name}`; }
  gate(id, tab, when) {
    const parts = [];
    if (tab) parts.push(`check_variable = { zin_ui_tab = ${tab} }`);
    if (when) parts.push(when);
    if (parts.length) this.triggers.set(`${id}_visible`, parts.join('\n'));
  }
  text(name, tab, x, y, w, h, key, value, { font = 'mid', fmt: align = 'left', when } = {}) {
    const id = this.id(name);
    this.loc.set(key, value);
    this.els.push(`instantTextBoxType = {\nname = "${id}"\nposition = { x = ${x} y = ${y} }\nfont = "${FONT[font]}"\ntext = "${key}"\nmaxWidth = ${w}\nmaxHeight = ${h}\nformat = ${align}\nfixedsize = yes\n}`);
    this.gate(id, tab, when);
  }
  icon(name, tab, x, y, sprite, { scale = 1, when } = {}) {
    const id = this.id(name);
    this.els.push(`iconType = {\nname = "${id}"\nspriteType = "${sprite}"\nposition = { x = ${x} y = ${y} }${scale !== 1 ? `\nscale = ${scale}` : ''}\n}`);
    this.gate(id, tab, when);
    return id;
  }
  sprite(name, art) { this.sprites.set(name, art); return name; }
  // A gauge: the rule line and a marker that slides along it; `xvar` is the country variable holding the marker's x.
  gauge(name, tab, y, xvar, { when } = {}) {
    this.icon(`${name}_rule`, tab, 40, y, 'GFX_zin_rule', { when });
    const id = this.icon(`${name}_mark`, tab, 40, y - 12, this.o.markerSprite, { scale: 0.4, when });
    this.props.set(id, { x: xvar });
  }
  render() {
    const o = this.o, P = o.prefix;
    this.loc.set(o.titleKey, o.title);
    this.loc.set(o.launcherKey, o.launcher);
    this.loc.set(`${o.launcherKey}_tt`, o.launcherTip);
    const tabs = o.tabs.map((t, i) => {
      const id = `${P}_tab_${i + 1}`, x = 30 + i * 148;
      this.loc.set(t.key, t.label);
      this.effects.set(`${id}_click`, `set_variable = { zin_ui_tab = ${i + 1} }\n${o.refresh} = yes`);
      this.triggers.set(`${id}_on_visible`, `check_variable = { zin_ui_tab = ${i + 1} }`);
      return `buttonType = {\nname = "${id}"\nposition = { x = ${x} y = 62 }\nspriteType = "GFX_zin_button"\nbuttonText = "${t.key}"\nbuttonFont = "${FONT.small}"\n}\niconType = {\nname = "${id}_on"\nspriteType = "GFX_zin_rule"\nposition = { x = ${x} y = 92 }\n}`;
    });
    const gui = fmt([
      'containerWindowType = {', `name = "${o.window}"`, `position = { x = ${-o.w / 2} y = ${-o.h / 2} }`, `size = { width = ${o.w} height = ${o.h} }`, 'orientation = center', 'moveable = yes',
      'background = {', `name = "${P}_bg"`, 'spriteType = "GFX_zin_frame"', '}',
      'instantTextBoxType = {', `name = "${P}_title"`, 'position = { x = 40 y = 20 }', `font = "${FONT.head}"`, `text = "${o.titleKey}"`, `maxWidth = ${o.w - 80}`, 'maxHeight = 32', 'format = centre', 'fixedsize = yes', '}',
      'buttonType = {', `name = "${P}_close"`, `position = { x = ${o.w - 44} y = 14 }`, 'quadTextureSprite = "GFX_closebutton"', 'shortcut = "ESCAPE"', '}',
      ...tabs, ...this.els, '}',
      'containerWindowType = {', `name = "${P}_button_window"`, 'position = { x = 148 y = 86 }', 'size = { width = 132 height = 30 }', 'orientation = upper_left',
      'buttonType = {', `name = "${P}_open"`, 'position = { x = 0 y = 0 }', 'spriteType = "GFX_zin_button"', `buttonText = "${o.launcherKey}"`, `buttonFont = "${FONT.mid}"`, `pdx_tooltip = "${o.launcherKey}_tt"`, '}', '}',
    ].join('\n'), 0);
    this.effects.set(`${P}_close_click`, `clr_country_flag = ${o.flag}`);
    const open = `clr_country_flag = zin_realm_open\nset_country_flag = ${o.flag}\nset_variable = { zin_ui_tab = 1 }\n${o.refresh} = yes`;
    const effects = [...this.effects].map(([n, b]) => blk(n, b)).join('\n');
    const triggers = [...this.triggers].map(([n, b]) => blk(n, b)).join('\n');
    const props = [...this.props].map(([n, p]) => blk(n, Object.entries(p).map(([a, v]) => `${a} = ${v}`).join('\n'))).join('\n');
    const window = blk(o.gui, ['context_type = player_context', `window_name = "${o.window}"`, 'dirty = zin_ui_tick', 'ai_enabled = { always = no }',
      blk('visible', `${o.visible}\nhas_country_flag = ${o.flag}`), blk('effects', effects), triggers ? blk('triggers', triggers) : '', props ? blk('properties', props) : ''].filter(Boolean).join('\n'));
    const launcher = blk(`${o.gui}_launcher`, ['context_type = player_context', `window_name = "${P}_button_window"`, 'dirty = zin_ui_tick', 'ai_enabled = { always = no }',
      blk('visible', o.launcherVisible), blk('effects', blk(`${P}_open_click`, open))].join('\n'));
    return { gui, scripted: fmt(`${window}\n${launcher}`, 0) };
  }
}
