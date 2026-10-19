// Prompt vocabulary of the interface reskin: the shared preamble, the forbidden motifs and the word lists the sheet
// jobs draw from (spec docs/specs/07_interface/02_full_ui_reskin.md, sections 3 and 5). Everything here is a
// proposed design target; none of it names a vanilla asset to copy. Vanilla file names are used only as meaning labels.

// Section 3.1 and 3.6: the chancery materials and the ornament vocabulary.
export const STYLE_LINE = 'Painted dark-fantasy strategy-game art in a consistent style: rich oil-paint texture, dramatic soft lighting, muted earthy palette with gold accents.';
export const MATERIALS = {
  walnut: 'dark oiled walnut panel, fine straight grain, soft satin sheen, faint wear at the edges',
  bronze: 'cast bronze edging, warm brown-gold, darker in the recesses, small rivets',
  gilded_iron: 'blackened iron with gold-leaf highlights on raised edges, slightly worn to dark metal',
  parchment: 'warm cream vellum with faint fibres, slight foxing at the edges, no writing',
  slate: 'smooth dark grey-blue stone with a very fine speckle',
  enamel: 'deep red wax, verdigris and lapis enamel insets',
};
// Section 3.2 palette tokens, repeated in every prompt so the sheets of a family match.
export const PALETTE = 'palette: walnut #1E1610 #2E2219 #4A3626, bronze #7A5A30 #A8814A, gilt #D9B562 #F1DFA6, iron #2C2C2E #55565A, parchment #F2E7CF #DCC9A0, ink #2A1F17, verdigris #5F8F63, amber #D49A33, cinnabar #A8372C, lapis #3F6496, slate #22272D';
export const LIGHTING = 'flat even lighting from the upper left, no cast shadows outside the object, no text, no letters, no numbers, no runes, no figures, no faces';
// Integration decision A4 plus section 3.6.
export const CLAUSE_A4 = 'no signature or maker\'s mark; corners and bottom edge hold only plain ground; no lettering; no real-world religious symbol';
export const FORBIDDEN_MOTIFS = 'never draw a sun disc or veiled sun, a demon, horns, a skull, bones, a black island, a crown as ornament, a figure, a face, an animal head, a letter, a number or a rune, and never a modern object such as a gear, steel plating, a telephone, a rifle, a tank or a typewriter';
export const GROUND = {
  black: 'on a solid flat pure black (#000000) background with wide black gutters: no glow, no blur, no gradient in the background',
  magenta: 'on a solid flat pure magenta (#FF00FF) background: no glow, no shadow on the ground',
};

export const humanize = s => String(s).replace(/\.[a-z0-9]+$/i, '').replace(/^(gfx_|relation_|icon_|button_)/i, '').replace(/[_\-]+/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();

// Heraldic charges for badge and template emblems: beasts, tools, weapons, plants, heavens, ships and buildings.
// No letters, no figures, no faces; animals are shown whole (never a head); no griffin until the owner adopts griffins.
export const CHARGES = [
  'standing lion', 'running stag', 'wild boar', 'perched hawk', 'coiled serpent', 'rearing horse', 'standing bear', 'prowling wolf', 'swimming salmon', 'resting hound', 'crouching cat', 'flying heron',
  'ram', 'bull', 'swan', 'raven', 'fox', 'otter', 'owl', 'eagle with spread wings', 'hare', 'crane', 'dolphin', 'tortoise',
  'oak tree', 'oak leaf and acorn', 'laurel wreath', 'ash tree', 'thistle', 'wheat sheaf', 'rose', 'vine and grapes', 'pine', 'willow', 'holly sprig', 'reeds',
  'plain tower', 'castle gate', 'bridge', 'lighthouse', 'city wall', 'mill', 'bell tower', 'watchtower on a hill', 'harbour chain', 'arched gate', 'beacon', 'milestone',
  'longsword', 'crossed swords', 'spear', 'battle axe', 'war hammer', 'longbow and arrow', 'round shield', 'kite shield', 'mace', 'lance with pennon', 'dagger', 'helm without crest',
  'anvil', 'hammer and tongs', 'plough', 'sickle', 'scythe', 'key', 'crossed keys', 'balance scales', 'quill', 'open book', 'horn', 'lute',
  'plain star', 'eight-pointed star', 'crescent moon', 'comet', 'rising sun on the horizon', 'three stars in a row', 'seven stars in a ring', 'storm cloud', 'wave', 'rainbow', 'mountain', 'flame',
  'galley with oars', 'sailing ship', 'anchor', 'ship\'s wheel', 'fishing net', 'sea shell', 'compass rose', 'rope knot', 'trident', 'oar and paddle', 'cog under sail', 'harbour crane',
  'wagon wheel', 'saddle', 'horseshoe', 'banner on a spear', 'drum', 'camp tent', 'campfire', 'barrel', 'chest', 'crown-less circlet', 'ring', 'chain',
  'diamond lozenge', 'chevron', 'cross of four arrows', 'interlaced knot', 'chequered shield', 'three roundels', 'bend sinister', 'saltire',
  'hand holding a torch', 'bridle', 'stirrup', 'cauldron', 'hourglass', 'spindle', 'lantern', 'hooked staff',
];

export const FOLDER_EMBLEMS = ['arms (sword and spear)', 'armour (mail shirt)', 'siege (ram and ladder)', 'mounts (horse and saddle)', 'ships (galley prow)', 'beasts (great wing feather)', 'magic (vial of pale light)', 'industry (anvil and hammer)', 'doctrine (open book)', 'engineering (mason\'s square)', 'sea lanes (compass rose)', 'scholarship (astrolabe)'];
export const RESOURCE_EMBLEMS = ['Essence: a vial of pale light', 'Timber: a stack of logs', 'Horses: a pair of horseshoes', 'Stone: a quarried block', 'Iron: an ingot', 'Gold: a coin stack', 'Grain: a wheat sheaf'];
export const GATHERING_TIERS = ['a storm lantern with a bright steady flame and clear glass', 'the same lantern, flame slightly lower, glass faintly misted', 'flame lower, glass misted at the edges', 'flame small, glass clouding', 'flame small and wavering, glass half clouded', 'flame low, glass mostly clouded', 'flame a thin ember, glass dark with cloud', 'flame an ember, glass nearly black', 'a last spark behind black glass', 'the lantern dark, glass black, one thread of smoke'];

// Cursor glyphs (section 4.10): gilded-iron pointers and tools. Meaning labels come from the cursor's own name.
export const CURSOR_GLYPHS = {
  normal: 'a gilded-iron pointer arrow', selected: 'a gauntlet pointing', attack_move: 'a sword with a forward arrow', attack: 'a sword', move: 'a boot print', cant_move: 'a boot print barred with a cross-bar',
  busy: 'an hourglass', build: 'a trowel', brush: 'a painter\'s brush', diplomacy: 'a quill', add: 'a plus stud', assign: 'a pointing hand with a ribbon', attach: 'a clasp', merge: 'two joined rings', split: 'a rope cut in two',
  paradrop: 'a bundle with a falling cord', naval: 'a galley prow', air: 'a great wing feather', operative: 'a hooded dark-lantern', cancel: 'a bar-and-cross stud', zoom: 'a spyglass', drag: 'an open gauntlet', text: 'a vertical bar with serifs without a letter',
};
export function cursorGlyph(name) {
  const key = Object.keys(CURSOR_GLYPHS).find(k => name.includes(k));
  return key ? CURSOR_GLYPHS[key] : `a gilded-iron tool glyph meaning "${humanize(name)}"`;
}

// Window titles of section 8 are text, never art; this list only keeps toolbar emblems in one place (section 4.3).
export const TOOLBAR_EMBLEMS = {
  diplomacy: 'a sealed letter and ribbon', production: 'an anvil', science: 'an open book and astrolabe', construction: 'a mason\'s square and trowel', trade: 'balance scales',
  deployment: 'a banner on a spear', ledger: 'a bound ledger', intelligence: 'a hooded dark-lantern', staff_office: 'map table pins', decisionview: 'a wax seal', international_market: 'a coin purse',
  army: 'a sword', navy: 'a galley prow', air: 'a great wing feather',
};
export const VALUE_EMBLEMS = {
  pol_power: 'a quill and seal', stability: 'a keystone', war_support: 'a war horn', manpower: 'three spear heads', unity: 'two clasped hands bound with cord',
  command_power: 'a signet ring', industrial_capacity: 'a hammer on an anvil and a crossed armoury hammer', convoys: 'a cog under sail', ships: 'a galley prow', equipment: 'a shield and sword', fuel: 'a vial of pale light',
};
