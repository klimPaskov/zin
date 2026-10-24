# Heraldry data, part 5: orcs, goblins and the isolates.
from her_data4 import C

C.append(dict(id='volcano_clans', crown='the tusk crown: a circlet of upturned tusks',
  palette=[('ash black', '#2a2a2e'), ('lava red', '#a83a26'), ('ash grey', '#7a7a74'), ('ember orange', '#d2662a'), ('obsidian', '#161618'), ('sulphur', '#c9b04a'), ('bone', '#d8ccb0')],
  divisions=['plain', 'per_fess', 'per_bend', 'per_chevron', 'pile_reversed', 'chief'],
  ornament='Black, red and ash; one skull at most in all the Dark Lands; no eye, no burning eye.',
  forms={'kingdom': 'A Warking acclaimed by the chiefs and broken in the ring: the tusk crown.', 'clan': 'A clan chief: no crown.'},
  dissent='ash grey', difference='a border raguly of ash grey', restoration='undying_fire',
  charges=[('fire_mountain', 'a fire-mountain with a plume of flame', 'the Fire-Mountain above Cocanoor, whose nature the orcs do not speak of', 'landform'),
           ('undying_fire', 'a fire in a stone bowl', 'the clan fire that never goes out', 'fire'), ('skull_cairn', 'a skull on a cairn of stones', 'the cairn of skulls where the clan honours its dead', 'body_part'),
           ('challenge_ring', 'a ring of upright stakes', 'the ring where a Warking is broken by a stronger challenger', 'token'), ('war_horn_o', 'a curved war-horn', 'the muster of the clans', 'tool'),
           ('cleft_ridge', 'a black ridge split by a narrow gap', 'the dark gate in the ridge (canting on Dark Gate)', 'landform')],
  rows=[
    ('Y1A', 'kingdom', 'plain', ['obsidian'], 'fire_mountain', 'lava red', None, None, "Goldoroth, the high gold-land, bears the Fire-Mountain under the tusk crown of a Warking who holds the throne until a stronger orc breaks him in the ring.", {}),
    ('Y48', 'clan', 'per_fess', ['ash black', 'lava red'], 'undying_fire', 'sulphur', None, None, "Sungodor bears the clan fire that never goes out.", {}),
    ('Y49', 'clan', 'per_chevron', ['ember orange', 'ash black'], 'cleft_ridge', 'obsidian', None, None, "Dark Gate bears the black ridge split by its narrow gap, canting on its name.", {}),
    ('Y4A', 'clan', 'chief', ['ash grey', 'obsidian'], 'challenge_ring', 'bone', None, None, "Zuriath's ring of stakes is the challenge ring where its chiefs are made and broken.", {}),
    ('Y4B', 'clan', 'per_bend', ['lava red', 'obsidian'], 'war_horn_o', 'bone', None, None, "Bold bears the war-horn that musters the clans.", {}),
    ('Y4C', 'clan', 'plain', ['ash grey'], 'skull_cairn', 'ash black', None, None, "Gord bears the skull cairn where the clan honours its dead: the only skull in the arms of the Dark Lands.", {}),
  ]))

C.append(dict(id='iron_clans', crown=None,
  palette=[('iron', '#5a5a60'), ('rust', '#8a4a2a'), ('steel', '#b0b0a8'), ('coal', '#26262a'), ('forge orange', '#c8642a'), ('slag green', '#5a6a4a')],
  divisions=['plain', 'per_fess', 'per_pale', 'per_bend', 'chief', 'base', 'per_chevron', 'pile_reversed'],
  ornament='Single smithing tools; no hammer crossed with any blade or sickle, no cogwheel.',
  forms={'clan': 'A hold-chief who keeps the iron and the ring until challenged: no crown.', 'council': 'The Free Moot of the holds: the moot ring.'},
  dissent='rust', difference='a border raguly of rust', restoration='anvil',
  charges=[('anvil', 'an anvil', 'the forge in every gate', 'tool'), ('forge_tongs', 'forge tongs holding a glowing bar', 'iron worked for Dondor and for sale', 'tool'),
           ('ingot_stack', 'a stack of ingots', 'iron prices set at the Free Moot', 'token'), ('forge_hammer', 'a single forge hammer', 'the smith-chiefs', 'tool'),
           ('crucible', 'a crucible pouring', 'the smelters', 'vessel'), ('ore_pick', 'an ore pick', 'the iron hills', 'tool'),
           ('iron_chain', 'an iron chain', 'tolls and captives', 'token'), ('moot_ring', 'a ring of iron set with nine studs', 'the Free Moot of the holds', 'token'),
           ('toll_gate_bar', 'a toll bar', 'the iron road tolls', 'building')],
  rows=[
    ('Y43', 'clan', 'plain', ['coal'], 'anvil', 'steel', None, None, "Bordon bears the anvil: a hold kept separate by its own forge and its own ring.", {}),
    ('Y44', 'clan', 'per_fess', ['iron', 'rust'], 'forge_tongs', 'forge orange', None, None, "Dreson's tongs hold a glowing bar: iron worked for Dondor and sold to anyone else.", {}),
    ('Y4D', 'clan', 'chief', ['coal', 'rust'], 'ingot_stack', 'steel', None, None, "Beriath bears the ingots it brings to the Free Moot.", {}),
    ('Y4F', 'clan', 'per_bend', ['slag green', 'coal'], 'forge_hammer', 'steel', None, None, "Britadon bears the single hammer of its smith-chiefs.", {}),
    ('Y4H', 'council', 'plain', ['rust'], 'moot_ring', 'steel', None, None, "Dulundur bears the studded iron ring of the Free Moot of the holds, which meets there to settle tolls and iron prices.", {}),
    ('Y4J', 'clan', 'base', ['steel', 'coal'], 'crucible', 'rust', None, None, "Colost bears the pouring crucible of its smelters.", {}),
    ('Y4K', 'clan', 'per_pale', ['coal', 'iron'], 'ore_pick', 'forge orange', None, None, "The Darks bear the ore pick of the iron hills.", {}),
    ('Y4L', 'clan', 'per_chevron', ['iron', 'coal'], 'iron_chain', 'steel', None, None, "Dunbulinor bears an iron chain: tolls taken and captives held.", {}),
    ('Y8C', 'clan', 'pile_reversed', ['slag green', 'steel'], 'toll_gate_bar', 'coal', None, None, "Fondor bears the toll bar of the iron road it straddles.", {}),
  ]))

C.append(dict(id='wild_holds', crown=None,
  palette=[('hide brown', '#6a5a40'), ('peat', '#3a3a30'), ('lucky ochre', '#a8a070'), ('bone', '#d4c8a8'), ('moss', '#5a6a3a')],
  divisions=['plain', 'per_fess', 'base'],
  ornament='Charms and luck, never priests\' signs.',
  forms={'clan': 'A hold-chief by strength: no crown, no council.'},
  dissent='peat', difference='a border raguly of peat', restoration='holed_stone',
  charges=[('bone_charm', 'a bone charm on a cord', 'the luck of the hold', 'token'), ('holed_stone', 'a holed stone', 'the lucky stones of each hold', 'token'), ('casting_bones', 'three casting bones', 'the Bone-Casting', 'body_part')],
  rows=[
    ('Y1C', 'clan', 'plain', ['hide brown'], 'holed_stone', 'bone', None, None, "Dun bears the holed lucky stone of its hold.", {}),
    ('Y46', 'clan', 'per_fess', ['moss', 'peat'], 'bone_charm', 'bone', None, None, "The Doltu bear a bone charm: the luck of a hold that trusts no priest.", {}),
    ('Y47', 'clan', 'base', ['lucky ochre', 'peat'], 'casting_bones', 'peat', None, None, "The Wild Lands bear the three bones of the Bone-Casting.", {}),
  ]))

C.append(dict(id='sea_orcs', crown=None,
  palette=[('salt teal', '#3a5a62'), ('drift grey', '#8a8a82'), ('salt white', '#e0dccf'), ('tar', '#2a2c2e'), ('kelp', '#4a5a3a')],
  divisions=['per_fess', 'plain', 'chief'],
  ornament='Sea and salt; no skull (the Dark Lands\' one skull is Gord\'s).',
  forms={'clan': 'A Sea-Chief by voyages won: no crown.', 'council': 'A council of captains: the charge on a plain field.'},
  dissent='tar', difference='a border raguly of tar', restoration='salt_cone',
  charges=[('skerry_cairn', 'a cairn on a skerry', 'the skerry-cairns of the Salt Tithe', 'token'), ('sea_gull_o', 'a gull', 'the gull kingdom (canting)', 'bird'), ('salt_cone', 'a cone of salt', 'the tithe of salt paid to the sea', 'token')],
  rows=[
    ('Y1B', 'clan', 'per_fess', ['salt teal', 'tar'], 'skerry_cairn', 'salt white', None, None, "Belonton bears a skerry-cairn: the sea orcs who pay the sea its tithe and keep faith with Dondor.", {}),
    ('Y4E', 'clan', 'plain', ['drift grey'], 'sea_gull_o', 'tar', None, None, "The Gull Kingdom bears a gull, canting on its name.", {}),
    ('Y4G', 'council', 'chief', ['kelp', 'salt teal'], 'salt_cone', 'salt white', None, None, "The Lestern Isles bear the cone of salt their council of captains pays to the sea each season.", {}),
  ]))

C.append(dict(id='goblin_warrens', crown='the grown crown (hobgoblin): see the hobgoblin grammar',
  palette=[('warren green', '#5a6a3a'), ('cave black', '#2a2a22'), ('hoard gold', '#c8b050'), ('lamp yellow', '#e0c860'), ('rust', '#7e4a2c')],
  divisions=['base', 'per_fess', 'chief', 'pile_reversed'],
  ornament='Lamps and gold in the dark; never a whole wolf-rider.',
  forms={'kingdom': 'A goblin kingdom under a hobgoblin king: the grown crown over the lamp.', 'clan': 'A warren led by its cleverest goblin: no crown.'},
  dissent='rust', difference='a border potenty of rust', restoration='warren_lamp',
  charges=[('warren_lamp', 'a lamp in a cave mouth', 'a lamp gone out is a warren doomed', 'fire'), ('gold_hoard', 'a heap of gold', 'goblins love gold and jewellery', 'token'),
           ('warren_trap', 'a spring trap', 'the trap-rooms of the warren', 'tool'), ('wolf_mount_head', 'the head of a riding wolf', 'they ride wolves to move quickly on the surface (the card\'s word is under Q-14)', 'beast')],
  rows=[]))

C.append(dict(id='troll_tribes', crown=None,
  palette=[('troll moss', '#6d7a5a'), ('cave umber', '#4a4030'), ('stone grey', '#a09878'), ('bog black', '#2a2a24'), ('bone', '#cfc4a8')],
  divisions=['per_fess', 'base', 'plain'],
  ornament='Rough boulders and clubs; no metal tinctures.',
  forms={'clan': 'The oldest unbeaten troll leads: no crown; the boulder is the largest charge.'},
  dissent='bog black', difference='a border urdy of bog black', restoration='border_heap',
  charges=[('boulder', 'a great boulder', 'the stone that feeds them', 'landform'), ('troll_club', 'a knotted club', 'the challenge that decides who leads', 'weapon'),
           ('bog_pool', 'a bog pool', 'the bogs where they lay their dead', 'water'), ('border_heap', 'a heap of stones', 'the stone-heaps at the tribe borders', 'token')],
  rows=[
    ('Y45', 'clan', 'per_fess', ['troll moss', 'bog black'], 'boulder', 'stone grey', 'border_heap', 'bone', "The Troll Forest bears a great boulder over the border stone-heap: the stone that feeds the tribes, and the warning at their edge that the free holds heed.", {}),
  ]))

C.append(dict(id='hill_giants', crown=None,
  palette=[('cairn brown', '#7c6a58'), ('hill moss', '#4f5a40'), ('stone', '#b0a888'), ('deep earth', '#3e3e36'), ('chalk', '#e0dccb')],
  divisions=['base', 'per_fess', 'plain'],
  ornament='One great stone filling the flag.',
  forms={'council': 'A High Chief chosen by the cairn-keepers: the great cairn, no crown.', 'subject': 'If the realm is a Concord dominion (Q-05), the charter border.'},
  dissent='deep earth', difference='a border arched of deep earth', restoration='year_stones',
  charges=[('great_cairn', 'a great cairn', 'a stone for every year of a giant\'s life; the cairns are the giants\' memory', 'token'), ('year_stones', 'a row of standing stones of rising height', 'the counting of years by stones', 'token')],
  rows=[
    ('Y0Q', 'council', 'base', ['hill moss', 'cairn brown'], 'great_cairn', 'chalk', None, None, "Hiloron, the giants' hill, bears a great cairn on its hill: its High Chief is chosen by the cairn-keepers, and a dispute is won by naming the older cairn.", {'borrow': ['lake_aenoran:lamp gold'], 'canon_note': 'Q-05: spelling (Hirolon) and status. If sovereign, the charter border is removed.'}),
  ]))

C.append(dict(id='ice_giants', crown=None,
  palette=[('glacier blue', '#9fc4d8'), ('rime white', '#e8eef2'), ('deep ice', '#2f4a5a'), ('frost grey', '#8a9aa4')],
  divisions=['base', 'per_fess', 'plain'],
  ornament='Huge, simple ice shapes.',
  forms={'kingdom': 'A Frost-King chosen by the cairn-keepers: the ice throne is the crown.'},
  dissent='frost grey', difference='a border arched of frost grey', restoration='frost_cairn',
  charges=[('ice_throne', 'a throne of ice', 'the Ice-Throne of Titanos', 'building'), ('frost_cairn', 'a cairn of ice blocks', 'the cold honoured as an old spirit of ice', 'token')],
  rows=[
    ('Y1J', 'kingdom', 'base', ['deep ice', 'rime white'], 'ice_throne', 'glacier blue', None, None, "Titanos bears the Ice-Throne on its glacier: the Frost-King chosen by the cairn-keepers sits on it, and the cold itself is honoured as an old spirit of ice.", {}),
  ]))

C.append(dict(id='yeti_clans', crown=None,
  palette=[('yeti white', '#e6eef4'), ('hum blue', '#8a9cb2'), ('rock slate', '#3e4c5a'), ('dusk violet', '#5e5476')],
  divisions=['base', 'per_chevron'],
  ornament='Three peaks; the hum is drawn as a cave answering, never as radiating arcs.',
  forms={'clan': 'The clan follows the voice that carries furthest: no crown.'},
  dissent='rock slate', difference='a border dancetty of rock slate', restoration='hum_cave',
  charges=[('hum_cave', 'a dark cave mouth in a white peak', 'the Hum-Caves where the mountain\'s hum is answered at dusk', 'landform')],
  rows=[
    ('Y1X', 'clan', 'base', ['dusk violet', 'yeti white'], 'hum_cave', 'rock slate', None, None, "The Yeti Lands bear a dark hum-cave in the white peaks at dusk: the mountain hums and must be answered, and a clan with no hum is lost.", {'on_base': True}),
  ]))

C.append(dict(id='kilinti_ents', crown=None,
  palette=[('ent green', '#3f6b2e'), ('bark umber', '#5e4e32'), ('moss pale', '#a8b890'), ('deep grove', '#263a20'), ('sap amber', '#b89a4a')],
  divisions=['plain', 'base'],
  ornament='Trees always with roots.',
  forms={'forest_domain': 'The Eldest speaks last: a rooted tree, no crown.', 'subject': 'The Concord charter border.'},
  dissent='bark umber', difference='a border rooted of bark umber', restoration='growth_rings',
  charges=[('eldest_tree', 'an ancient tree with spreading roots', 'the Eldest, who speaks last', 'tree'), ('growth_rings', 'a cut trunk showing its rings', 'the Ent-Moot every seventh Thaw', 'token'), ('moot_grove', 'a ring of trees', 'the Moot-Grove', 'tree')],
  rows=[
    ('Y0O', 'forest_domain', 'plain', ['deep grove'], 'eldest_tree', 'moss pale', 'three_arrows', 'sap amber', "Kilinti bears the Eldest with its roots spread and the Selen rangers' arrows beneath: a forest whose moot takes years to say a sentence, while the men at its edge keep its accounts and its charter with Parim.", {'borrow': ['lake_aenoran:lamp gold', 'selen_ranger:three_arrows']}),
  ]))

C.append(dict(id='grave_hosts', crown=None,
  palette=[('grave black', '#1e1a24'), ('ash violet', '#5b5566'), ('ember red', '#a83a2a'), ('bone', '#cfc6b0'), ('pall grey', '#3c3844')],
  divisions=['plain'],
  ornament='No eye (another fiction\'s dark lord), no skull, no figure; the Gate and the Names.',
  forms={'kingdom': 'The Dominion: the Gate, no crown, because the crown is not a person\'s to wear in the arms.', 'overlord': 'Sworn realms carry a base of grave black.'},
  dissent='pall grey', difference='a border of pall grey', restoration='nafeher_gate',
  charges=[('nafeher_gate', 'an arched gate standing open, dark within, with ember light at its threshold', 'the Gate of Nafeher and the rite of Names and Gates', 'building'),
           ('ring_of_names', 'a ring of short notches', 'the names the necromantic orders keep', 'token')],
  rows=[
    ('Y8D', 'kingdom', 'plain', ['grave black'], 'nafeher_gate', 'bone', 'ring_of_names', 'ash violet', "The Dominion bears the open Gate of Nafeher ringed by notched names: the rite of Names and Gates kept by its necromantic orders; it shows no person, because the realm must not be its master's portrait.", {'canon_note': 'R-28: the country gets its own name; the arms never show Volgan, an eye or a crown of a person.'}),
  ]))

C.append(dict(id='zols_dead', crown=None,
  palette=[('void black', '#0a0a0c'), ('cold grey', '#6a6a72'), ('ash dark', '#2a2a30')],
  divisions=['plain'],
  ornament='Nothing but the sigil of the emblem that leads the realm.',
  forms={'emblem_realm': 'Led by an emblem, The Will of Zol: the field is void and the sigil is the whole achievement.'},
  dissent='ash dark', difference='none: a realm of the dead does not break away in heraldry', restoration='broken_rings_sigil',
  charges=[('broken_rings_sigil', 'a sigil of broken concentric rings', 'The Will of Zol, the emblem that leads the realm; nothing about who governs for Zol is said', 'sigil')],
  rows=[
    ('Y0U', 'emblem_realm', 'plain', ['void black'], 'broken_rings_sigil', 'cold grey', None, None, "Zol's Mistake bears only the cold grey sigil of broken concentric rings on void: the emblem called The Will of Zol, the same sigil its leader's portrait shows, and nothing more, because nothing more is known.", {'canon_note': 'No body, no figure, no servant\'s identity, no skull, no crown; the realm is never named after Zol on the flag.'}),
  ]))

C.append(dict(id='netherborn', crown=None,
  palette=[('nether red', '#9b2a2a'), ('ash black', '#2a1a1a'), ('ember gold', '#d8a060'), ('obsidian', '#120c0c'), ('sulphur', '#c8b04a'), ('ash white', '#d8cfc4')],
  divisions=['per_bend', 'per_fess', 'pile', 'plain'],
  ornament='Original pact sigils only: no pentagram, no inverted cross, no goat in a star (Q-24).',
  forms={'kingdom': 'A Lord or Queen of the pact: the pact-charge; sworn realms take the grave black base.'},
  dissent='obsidian', difference='a border rent of obsidian', restoration='pact_seal',
  charges=[('pact_horn', 'a single curved horn', 'the pact-horn of a lord of the Nether', 'body_part'), ('pact_seal', 'a blank wax seal with a thumb-print', 'the pact and the pact-name known only to the pact', 'token'),
           ('obsidian_blade', 'an obsidian blade', 'oaths of blood and ash', 'weapon')],
  rows=[
    ('Y10', 'kingdom', 'per_bend', ['nether red', 'ash black'], 'pact_horn', 'ember gold', None, None, "Nezer bears the pact-horn of its lord, sworn to the Dominion.", {'canon_note': 'Q-22 asks whether Nezer is the cards\' Nazerun.'}),
    ('Y7T', 'kingdom', 'pile', ['ash black', 'nether red'], 'obsidian_blade', 'ash white', None, None, "Demon bears an obsidian blade: oaths of blood and ash, sworn to the Dominion.", {}),
    ('Y7U', 'kingdom', 'per_fess', ['obsidian', 'nether red'], 'pact_seal', 'sulphur', None, None, "Dolon bears the blank pact-seal pressed with a thumb: its pact-name is known only to the pact.", {}),
  ]))
