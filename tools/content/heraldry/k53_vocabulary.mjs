// K53 vocabulary of the realm flags (owner decision, 25 October 2026): every realm bears an emblem, not an object, and every
// culture has its own hand (how its devices are drawn), hem (its border) and ground (its field pattern). This module holds the
// explicit style of each culture (K53_STYLE, one hand, one hem and one ground per culture, no two cultures alike) and the emblem
// charges that the realm designs of build_heraldry.mjs use (K53_CHARGES, added to each culture's grammar at build time).
// A charge keeps the class rules of the generator: beasts, trees, ships, landforms, waters, garments and birds are regional classes
// and need a regional_justification; the emblem vocabulary below uses the other classes wherever the realm allows it.

const ch = (id, cls, name, meaning) => ({ id, name, meaning, class: cls });

// culture id -> [hand, hem, ground] (keys of HANDS, HEMS and GROUNDS in build_heraldry.mjs).
export const K53_STYLE = {
  // Middle Lands
  lake_aenoran: ['armorial', 'chain', 'diapered'],
  isle_houses: ['radiant', 'vine', 'strewn'],
  selen_ranger: ['stippled', 'pearled', 'counter'],
  vale_folk: ['angular', 'scale', 'lozenged'],
  hill_giants: ['scrolled', 'scale', 'diapered'],
  hearth_folk: ['applique', 'tasselled', 'lozenged'],
  steppe_rider: ['elongated', 'cord', 'plain'],
  march_folk: ['stamped', 'vine', 'woven'],
  kilinti_ents: ['jointed', 'cord', 'diapered'],
  strait_folk: ['angular', 'chain', 'woven'],
  wall_delvers: ['applique', 'pearled', 'diapered'],
  king_warrens: ['jointed', 'dagged', 'woven'],
  holt_gnomes: ['interlaced', 'tasselled', 'counter'],
  north_delvers: [
    ch('pact_hammer', 'weapon', 'a war-hammer held upright', 'the Hill Pact of the dwarves and the hills'),
  ],
  forest_council_elves: [
    ch('living_tree', 'tree', 'a flat heraldic tree of seven leaves in a fan on one straight trunk', 'the tree of the Singing Grove'),
    ch('precedent_book', 'sigil', 'a ring of seven small rings', 'the elected council of the Magical Forest and its precedents'),
  ],
  kingdom_forest_elves: ['scrolled', 'chain', 'lozenged'],
  baelim: ['armorial', 'cord', 'plain'],
  veiled_folk: ['jointed', 'dagged', 'plain'],
  redbark_tribes: ['interlaced', 'vine', 'strewn'],
  // North Lands
  leren_sea_kings: ['applique', 'pearled', 'counter'],
  free_crowns_north: ['scrolled', 'cord', 'woven'],
  north_delvers: ['angular', 'notched', 'diapered'],
  road_warrens: ['stamped', 'tasselled', 'plain'],
  // Cold Lands
  winter_crown: ['stippled', 'cord', 'lozenged'],
  melkgard_warlords: ['stamped', 'scale', 'counter'],
  ice_clans: ['applique', 'notched', 'strewn'],
  spring_warrens: ['radiant', 'pearled', 'diapered'],
  reindeer_clans: ['angular', 'tasselled', 'plain'],
  ice_giants: ['scrolled', 'dagged', 'diapered'],
  yeti_clans: ['interlaced', 'notched', 'lozenged'],
  height_yeti: ['jointed', 'vine', 'woven'],
  vindael_seafarers: ['elongated', 'chain', 'strewn'],
  // West Lands
  gunwyn_clans: ['jointed', 'vine', 'strewn'],
  girdon_wardens: ['angular', 'notched', 'lozenged'],
  western_guilds: ['armorial', 'scale', 'woven'],
  buldor_companies: ['stamped', 'dagged', 'counter'],
  west_delvers: ['applique', 'notched', 'lozenged'],
  // Dark Lands
  volcano_clans: ['scrolled', 'notched', 'counter'],
  dondor_brutes: ['stamped', 'tasselled', 'diapered'],
  sea_orcs: ['radiant', 'chain', 'counter'],
  iron_clans: ['armorial', 'cord', 'diapered'],
  wild_holds: ['elongated', 'notched', 'plain'],
  troll_tribes: ['stippled', 'scale', 'strewn'],
  cairn_giants: ['jointed', 'pearled', 'lozenged'],
  goblin_warrens: ['interlaced', 'dagged', 'woven'],
  veshazel_court: ['angular', 'pearled', 'plain'],
  // Ember Lands and Zol's Mistake
  grave_hosts: ['stamped', 'notched', 'plain'],
  mirolon_wardens: ['stippled', 'vine', 'plain'],
  netherborn: ['angular', 'scale', 'strewn'],
  nether_houses: ['elongated', 'jointed', 'strewn'],
  ember_freeholds: ['applique', 'dagged', 'woven'],
  zols_dead: ['radiant', 'cord', 'counter'],
  // Magical Lands and Lands of the Sun
  zilin_pilgrims: ['elongated', 'notched', 'counter'],
  forest_council_elves: ['jointed', 'cord', 'strewn'],
  hill_kingdom_elves: ['scrolled', 'pearled', 'plain'],
  lake_elves: ['angular', 'chain', 'diapered'],
  pass_wardens: ['radiant', 'notched', 'lozenged'],
  rift_coast_elves: ['interlaced', 'pearled', 'woven'],
  roost_keepers: ['armorial', 'vine', 'lozenged'],
  teste_valley_folk: ['applique', 'cord', 'plain'],
  quay_folk: ['stamped', 'chain', 'lozenged'],
  mycid_rings: ['stippled', 'tasselled', 'diapered'],
  gala_court: ['elongated', 'vine', 'woven'],
  sunhot_light: ['scrolled', 'dagged', 'woven'],
  sunhot_western: ['angular', 'vine', 'diapered'],
  sunhot_isles: ['radiant', 'tasselled', 'lozenged'],
  goodin_sunfolk: ['jointed', 'dagged', 'strewn'],
  god_forest_keepers: ['applique', 'vine', 'counter'],
  // East Lands
  noris_riders: ['radiant', 'scale', 'plain'],
  naamis_sea_crown: ['scrolled', 'vine', 'counter'],
  woqood_sealers: ['jointed', 'pearled', 'woven'],
  orato_fishers: ['interlaced', 'chain', 'plain'],
  caravan_princes: ['armorial', 'notched', 'lozenged'],
  river_kings: ['angular', 'scale', 'diapered'],
  lake_road_cities: ['stippled', 'cord', 'diapered'],
  red_lands_tribunes: ['scrolled', 'pearled', 'lozenged'],
  // South Lands, Islands of the South and Tritons' Islands
  miaed_pass_lords: ['radiant', 'dagged', 'plain'],
  wahatud_oasis_folk: ['elongated', 'tasselled', 'strewn'],
  southern_islanders: ['stippled', 'scale', 'lozenged'],
  chart_islanders: ['angular', 'tasselled', 'woven'],
  corsair_lords: ['armorial', 'dagged', 'counter'],
};

// culture id -> the emblem charges added to its grammar (replacing a charge of the same id).
export const K53_CHARGES = {
  steppe_rider: [
    ch('horse_head', 'beast', "a flat horse's head silhouette in black felt, outlined in gold, with one curl of mane", "the riders kingdom and the ford of the Aenar"),
  ],
  // Middle Lands
  lake_aenoran: [
    ch('clasped_hands', 'body_part', 'two hands clasped at the wrist', 'the Concord of Aen\'s joined kingdoms, sworn hand to hand'),
    ch('rod_of_office', 'token', 'a long tapering sceptre with a flared head', 'the staff the Harbour-Master of Safeton holds over the ships of the charter'),
    ch('gold_disc', 'celestial', 'a plain gold disc ringed by a thin band', 'the hanging seal of the Golden Charter, drawn as a disc of the court'),
    ch('glass_drops', 'token', 'a ring of six glass drops round a bare centre', 'the glassmakers of Pazoma and their clear work for the Concord'),
  ],
  isle_houses: [
    ch('sea_fire', 'fire', 'three tongues of sea-fire rising from one base', 'the fire of the Borrak lighthouse-shrine, kept lit for every fleet from the West'),
  ],
  selen_ranger: [
    ch('longbow', 'weapon', 'a longbow strung upright', 'the arm of the Quiet Law, the bow of the woodland moots'),
  ],
  vale_folk: [
    ch('vigil_flame', 'fire', 'a tall vigil flame between two pale points', 'the fire of the pass that is never let out'),
    ch('pass_spear', 'weapon', 'a spear upright, its point crowned by a ring', 'the sworn pass companies and their watch on the South Pass'),
  ],
  march_folk: [
    ch('linked_rings', 'token', 'a row of three linked iron rings', 'the three leagues of free farmers, joined by their oath'),
  ],
  strait_folk: [
    ch('toll_ring', 'token', 'a heavy toll-ring with a bar through it', 'the toll-ring that stretches across the narrow strait'),
  ],
  wall_delvers: [
    ch('rock_arch', 'building', 'a round-headed arch cut into a rock face', 'the Western Gate cut into the Lunhrim massif'),
  ],
  king_warrens: [
    ch('truce_fire', 'fire', 'a small fire set in a plain circle', 'the Lamp Truce kept at the tunnel mouth of Burrikkrit'),
  ],
  holt_gnomes: [
    ch('gold_torc', 'token', 'a gold torc, a plain neck-ring with open ends', 'the gold of the holts, given freely and never taken'),
  ],
  north_delvers: [
    ch('pact_hammer', 'weapon', 'a war-hammer held upright', 'the Hill Pact of the dwarves and the hills'),
  ],
  forest_council_elves: [
    ch('living_tree', 'tree', 'a flat heraldic tree of seven leaves in a fan on one straight trunk', 'the tree of the Singing Grove'),
    ch('precedent_book', 'sigil', 'a ring of seven small rings', 'the elected council of the Magical Forest and its precedents'),
  ],
  kingdom_forest_elves: [
    ch('guide_flame', 'fire', 'a single flame standing on a plain base', 'the guide-lantern of the household that would not leave the forests'),
  ],
  // North Lands
  leren_sea_kings: [
    ch('salt_ring', 'token', 'a ring of six white salt-stones set round a bare centre', 'the salt shared at the table, which binds both sides of a quarrel in the Arbitration Court'),
    ch('refused_gate', 'building', 'a plain gateway of two posts and no lintel', 'the watch-house gate that the first prince of R\'en built on the strait cape and refused to pay for'),
    ch('twin_rings', 'token', 'two rings joined one through the other', 'the double crown of Keredor and Hellekton, whose court crowns every heir twice'),
  ],
  free_crowns_north: [
    ch('brown_bear', 'beast', 'a bear standing on its hind legs, forepaws raised', 'the bear of Tolvael, the first of the free crowns of the North'),
    ch('raised_wings', 'body_part', 'a pair of wings raised high', 'the crane that watches over the marsh of Molot, and the fortress line that took the raiders'),
    ch('three_arch_bridge', 'building', 'a bridge of three round arches', 'the toll-bridge at Sirtum, which keeps Tolhon at a distance from everyone else'),
    ch('hill_crown', 'crown', 'a small plain crown with a single point', 'the hill crown of Heodwa, Nuatax and Agniy under the Hill Pact'),
    ch('notched_crown', 'crown', 'a crown whose rim is cut with notches, like a mine stope', 'the crown that the king of Mina earns by working a season in the Delvings'),
    ch('lake_fires', 'fire', 'four fires set in a row', 'the four walled towns round the deep lake of Dolpar'),
  ],
  road_warrens: [
    ch('long_staff_ring', 'token', 'a long staff with an iron ring at its head', 'the packmen of Mustnom and the news they carry faster than any courier'),
  ],
  // Cold Lands
  winter_crown: [
    ch('rye_bundle', 'token', 'a bundle of rye-stalks bound with a white cord', 'the crown granaries whose bread holds the clans through the long winters'),
  ],
  ice_clans: [
    ch('gap_stones', 'token', 'three stones piled one on another in a gap', 'the cairn of the Neridor Gap road'),
    ch('harpoon_bundle', 'weapon', 'three harpoons bound together with one cord', 'the steadings that refused both Fannarn and Coldor and keep their own moot'),
    ch('turf_roof', 'building', 'a turf roof with a smoke-hole in its crown', 'the turf waystation of the Neck Road, smoking on the ridge'),
    ch('fair_pole', 'token', 'a tall pole with a crossbar, hung with three pelts', 'the fair-pole of Fentene, which keeps the snowline fair'),
    ch('wool_skein', 'token', 'a skein of pale wool wound on a bar', 'the wool-market valley of the north'),
    ch('clenched_fist', 'body_part', 'a clenched fist', 'the oath of the one clan that yields to nobody'),
    ch('ice_axe', 'weapon', 'an ice-axe upright', 'the sealers of the Frozen Sea and the last raider of their line'),
    ch('iron_bloom', 'token', 'a bloom of raw iron set on a ring', 'the iron the Orewell lowland digs and sells by the cartload'),
  ],
  spring_warrens: [
    ch('three_plumes', 'fire', 'three plumes of steam rising from one round spring', 'the steaming spring of Drikzig and its warm valleys'),
  ],
  reindeer_clans: [
    ch('moot_fire', 'fire', 'a moot-fire in a plain ring', 'the winter moot fire of the reindeer clans at Esrom'),
  ],
  ice_giants: [
    ch('ice_sun', 'celestial', 'a sun with rays cut in ice', 'the Frost-King and the glacier that keeps its own time'),
  ],
  yeti_clans: [
    ch('cave_arch', 'building', 'a round-headed cave-mouth, dark within', "the cave that answers the Eldest's song"),
  ],
  vindael_seafarers: [
    ch('wind_knots', 'token', 'three knots tied in one cord', "the sailors' knots of the shares, tied by captains who keep their council by them"),
    ch('fur_bale', 'token', 'a round bale of furs tied with cord', 'the fur the Fandan carries down to the free port at its mouth'),
  ],
  gunwyn_clans: [
    ch('feud_blade', 'weapon', 'a short broad blade with a ring at its hilt', 'the feud-clans of the old boar country, sworn to the Oath-Ring'),
    ch('peace_cup', 'sigil', 'a bar balanced level on a point', 'the peace the lowland kingdom of Thenon bought with cattle and olives'),
    ch('sea_watch_flame', 'fire', 'a tall watch-flame on a cape-point', 'the lantern King Oslin first set on the western capes'),
  ],
  girdon_wardens: [
    ch('ford_stones', 'token', 'three stepping stones in a row across a ford', 'the stepping stones of the ford of Arligon'),
    ch('ferry_ring', 'token', 'a ring hung on a rope', 'the ferry-wardens\' rope across the river'),
  ],
  western_guilds: [
    ch('league_rings', 'sigil', 'two rings linked on one cord', 'the league the towns of the Kulolo swore on their guild book'),
    ch('fuse_flame', 'fire', 'a flame at the end of a fuse-cord', 'the powder the workshops of Bolbin sell to any buyer'),
  ],
  buldor_companies: [
    ch('seal_ring', 'sigil', 'a signet ring set with a plain stone', 'the sealed contract-book of the companies'),
  ],
  hearth_folk: [
    ch('famine_bread', 'token', 'a ring of grain-ears set in a circle', 'the Famine Bread the small folk carried to starving clansmen'),
  ],
  volcano_clans: [
    ch('cleft_gate', 'building', 'a gate split down its middle by a narrow gap', 'the only pass from the Goldoroth arm to the south, which the gate-hold tolls'),
  ],
  dondor_brutes: [
    ch('iron_fist', 'body_part', 'a clenched iron fist', 'the Brute-Kings and the insult taken for a boast'),
    ch('sail_bar', 'token', 'a single square sail hung from a bar', 'the harbour towns of Blackton and their black sail'),
  ],
  iron_clans: [
    ch('reed_crown', 'crown', 'a low crown of three pointed reeds', 'the reeds of the fens, where the reed-council lives on eels and peat'),
    ch('smoulder', 'fire', 'a low smouldering fire', 'the charcoal clamps of the Fonoor Forest'),
    ch('forge_hammer', 'weapon', 'a war-hammer head upright, without its haft', 'the iron hills that Bredesk of the Brakgul made one hold'),
  ],
  wild_holds: [
    ch('casting_bones', 'sigil', 'three casting bones on a cord', 'the bones that decide whose winter it is on the moor'),
  ],
  troll_tribes: [
    ch('boulder', 'sigil', 'a great boulder', 'the great boulder of the troll king'),
  ],
  goblin_warrens: [
    ch('warren_fuse', 'fire', 'a flame at the end of a fuse-cord', 'the powder the best powder-makers of the Dark Lands sell to whoever pays'),
  ],
  netherborn: [
    ch('maw_fire', 'fire', 'a fire rising from the sulphur of the Maw', 'the sulphur of the Maw that makes the Dominion\'s black powder'),
    ch('burning_gate', 'building', 'a broken gate with fire through its arch', 'the broken Burning Gate on the coast of Nezer'),
  ],
  ember_freeholds: [
    ch('salt_stones', 'token', 'three white salt-stones in a row', 'the three salt-pans of the freeholds of the salt coast, paying one toll as one league'),
    ch('tolling_spear', 'weapon', 'a spear with a hooked head', 'the warlord who takes its tolls in the Nan Mountains'),
    ch('holy_breeze_flame', 'fire', 'a flame standing alone on a cliff-top', 'the lantern the Holy Breeze kept lit on the cliffs of Olen for a whole winter'),
  ],
  rift_coast_elves: [
    ch('silver_circlet', 'crown', 'a silver circlet of five points', 'the Archive of the loremasters, which keeps the names and songs of the elves who died in the Alliance\'s wars'),
  ],
  roost_keepers: [
    ch('roost_flame', 'fire', 'three flames rising in a row', 'the roosts of Dragon Mountain, where the keepers go up to listen'),
  ],
  teste_valley_folk: [
    ch('plough_furrow', 'token', 'a furrow of three lines ploughed across the field', 'the one fertile vale under the Herrodon rim'),
  ],
  quay_folk: [
    ch('rift_ferry', 'token', 'a ferry-rope stretched between two posts', 'the ferry crossing between the two shores of the Rift Narrows'),
  ],
  pass_wardens: [
    ch('mountain_pass', 'token', 'a pass between two snow-capped points', 'the Nolorim East Pass kept by the pass-wardens'),
  ],
  sunhot_isles: [
    ch('smoking_isle', 'fire', 'a plume of smoke rising from one cone', 'Hol, whose Great Volcano threw ash over every island at once'),
  ],
  sunhot_western: [
    ch('shallows_reeds', 'token', 'three reeds bound at the head', 'the shrine of the shallows on Sun Lake'),
    ch('spindle_skein', 'token', 'a skein of thread wound on a ring', 'the weavers of the cape sanctuary of Elvana'),
  ],
  noris_riders: [
    ch('well_head', 'celestial', 'a plain disc with seven rays fanning from its lower edge', 'the Seven Wells of Furvior'),
  ],
  orato_fishers: [
    ch('net_ring', 'token', 'a ring of net-floats strung on a cord', 'the cod the families of Orato sell to the Naamis ship-masters'),
  ],
  caravan_princes: [
    ch('powder_cask', 'fire', 'a spark in a ring of powder', 'the powder cask of Drak'),
    ch('furnace_cone', 'fire', 'a cone-shaped furnace with a flame at its mouth', 'the smoking mountain cone of Drak'),
    ch('nested_weights', 'sigil', 'three rings nested one within another', 'the weights of the market of Mostok'),
    ch('struck_coin', 'celestial', 'a bronze disc with a plain rim', 'the bronze of the caravan cities'),
    ch('tapped_trunk', 'token', 'a drop of resin on a bar', 'the tapping of the hardwood trunks of Obmi'),
    ch('tithe_bowl', 'token', 'a heaped ring of grain-ears', 'the tithe of the caravan princes'),
  ],
  river_kings: [
    ch('shut_pass', 'token', 'two mountains with a bar across the pass between them', 'the pass of Erco that the river kings shut'),
    ch('ash_sheaf', 'token', 'a sprout of grain rising from ash', 'the grain grown from black ash in the flood silt'),
    ch('fair_horse', 'sigil', 'a horsehair pennant on a pole', 'the fair of Delbiz'),
  ],
  lake_road_cities: [
    ch('quay_lantern', 'fire', 'a flame on a pole', 'the lantern of the lake quays'),
    ch('harvest_basket', 'token', 'a heap of grain in a ring', 'the harvests the fishers and farmers of Gonnois bought their rights with'),
  ],
  wahatud_oasis_folk: [
    ch('four_wells', 'building', 'four well-heads set in a ring', 'the Well-Moot that the clan-mothers swore at Biir-Raab'),
  ],
  southern_islanders: [
    ch('wave_tally', 'shell', 'a spiral conch shell', 'the tally the caves of the south keep for the dead'),
    ch('fish_trap', 'sigil', 'a weir of three stakes in a curve', 'the fish trap the villages lift only by day'),
    ch('shell_necklace', 'shell', 'a ring of carved shells', 'the shell the villages carve for the ring-council of the Yong lagoon'),
    ch('rice_terrace', 'building', 'three stepped terraces on a rising slope', 'the terrace council of Kea, Agla and the Rice Islands'),
    ch('storm_drum', 'sigil', 'three strokes of a slit drum, one above another', 'the drum that carries the first warning of every storm to the Great Isle'),
  ],
  chart_islanders: [
    ch('rolled_chart', 'sigil', 'a chart rolled and tied with a cord', 'the chart-houses that copy every chart in one house at Sanderz'),
    ch('reef_buoy', 'sigil', 'a ringed float on a pole', 'the buoy that marks the banks the broker-captains of Ese mediate'),
    ch('strongroom_key', 'sigil', 'a great ring with a single bit', 'the key of the strong-room where the chart-houses keep their treasury'),
    ch('reading_lens', 'celestial', 'a great round lens with rays', 'the great lens of the Lamp-House, which keeps the northern passages lit'),
  ],
  corsair_lords: [
    ch('black_sail', 'token', 'a black sail hung from a bar', 'the captain who took the strait-place harbour of Straton'),
    ch('mountain_cove', 'building', 'a cove-arch under a peak', 'the cove under the mountain that no fleet can find without a Benan pilot'),
  ],
  hill_kingdom_elves: [
    ch('hill_road', 'sigil', 'a silver bar across the field', 'the road west to the lost kin, which the hill queens still remember'),
  ],
};
