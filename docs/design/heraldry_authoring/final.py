import json, os, sys, collections
sys.path.insert(0, os.path.dirname(__file__))
from her_data1 import LINES, DIVISIONS, CLASSES, FAMILIES, PEOPLES
here = os.path.dirname(__file__)
ZIN = 'C:/Users/klimp/OneDrive/Documents/Paradox Interactive/Hearts of Iron IV/mod/zin'
st = json.load(open(os.path.join(here, 'stage.json'), encoding='utf-8'))
countries, cultures = st['countries'], st['cultures']

for r in countries:
    if r['tag'] == 'Y0U':
        r['display_name'] = "Zol's Mistake"
        r['canon_note'] = r.get('canon_note', '') + " Displayed as Zol's Mistake (rule F3; the roster row still reads Zol)."

def lum(h):
    h = h.lstrip('#'); rgb = [int(h[i:i+2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4 for c in rgb]
    return round(0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2], 4)

peoples = []
for p in PEOPLES:
    q = dict(p)
    q['palette'] = [{'name': n, 'hex': h, 'class': 'metal' if lum(h) > 0.30 else 'colour'} for n, h in p['palette']]
    q['charges'] = [{'id': x[0], 'name': x[1], 'meaning': x[2], 'class': x[3]} for x in p['charges']]
    q['cultures'] = [cid for cid, c in cultures.items() if (c['people'] == p['id'])]
    peoples.append(q)

PAL = {cid: {t['name']: t['hex'] for t in c['palette']} for cid, c in cultures.items()}
def T(cid, n): return {'name': n, 'hex': PAL[cid][n], 'source': cid}

story = [
    {'cosmetic_tag': 'zin_cosmetic_aenor_golden_court', 'name': 'The Golden Court', 'parent': 'Y0L', 'kind': 'breakaway', 'culture': 'lake_aenoran',
     'gate': 'Aenor succession war, court camp (aenor_court_and_succession section 7)',
     'field': {'division': 'per_fess', 'line': 'straight', 'tinctures': [T('lake_aenoran', 'lamp gold'), T('lake_aenoran', 'lake blue')]},
     'primary_charge': {'id': 'bowl_lamp', 'tincture': T('lake_aenoran', 'deep lake')}, 'secondary_charge': None,
     'marks': [{'mark': 'crown', 'tincture': T('lake_aenoran', 'deep lake')}, {'mark': 'difference_border', 'tincture': T('lake_aenoran', 'bell bronze')}],
     'blazon': 'A field divided across, lamp gold above and lake blue below. A bowl-lamp with one flame in deep lake, large in the centre, under a circlet of five flame-shaped points in deep lake. A plain narrow border of bell bronze.',
     'meaning': "The court's gold laid over the realm's blue, with the lamp darkened and a bronze border of difference: the party of the gilded halls that sells offices and still claims the crown."},
    {'cosmetic_tag': 'zin_cosmetic_aenor_faithful', 'name': 'Aenor of the Faithful', 'parent': 'Y0L', 'kind': 'breakaway', 'culture': 'lake_aenoran',
     'gate': 'Aenor succession war, Faithful camp, before zin_afrit_revealed',
     'field': {'division': 'base', 'line': 'straight', 'tinctures': [T('lake_aenoran', 'Parim white'), T('lake_aenoran', 'lake blue')]},
     'primary_charge': {'id': 'bowl_lamp', 'tincture': T('lake_aenoran', 'lamp gold')}, 'secondary_charge': {'id': 'guest_loaf', 'tincture': T('lake_aenoran', 'bell bronze')},
     'marks': [{'mark': 'difference_border', 'tincture': T('lake_aenoran', 'slate')}],
     'blazon': 'A field of Parim white with a base of lake blue. A bowl-lamp with one flame in lamp gold, outlined in deep lake, large in the centre; a round loaf in bell bronze, small, beneath it. A plain narrow border of slate.',
     'meaning': "The lamp and the loaf of the Deliverer's public charity on white: the camp that puts the faith before the crown. Nothing on it shows who leads the faith.",
     'canon_note': 'Public arms before the reveal: the deny-list of the Worshipdom applies (no eye, chain, ash, mask, veil, serpent, horns, fire-bird, hidden face).'},
    {'cosmetic_tag': 'zin_cosmetic_aenor_ashen', 'name': 'Aenor of Afrit (the Ashen Throne)', 'parent': 'Y0L', 'kind': 'story', 'culture': 'lake_aenoran',
     'gate': 'zin_afrit_revealed',
     'field': {'division': 'per_bend', 'line': 'straight', 'tinctures': [T('lake_aenoran', 'slate'), T('lake_aenoran', 'deep lake')]},
     'primary_charge': {'id': 'bowl_lamp', 'tincture': T('lake_aenoran', 'Parim white')}, 'secondary_charge': None,
     'marks': [{'mark': 'crown', 'tincture': T('lake_aenoran', 'lamp gold')}],
     'blazon': 'A field divided diagonally, slate above and deep lake below. A bowl-lamp in Parim white whose flame is a plume of grey ash, large in the centre, under a circlet of five flame-shaped points in lamp gold.',
     'meaning': "After the reveal the lamp of the traveller burns ash: the crown of Aenor held by the god-king the realm worshipped."},
    {'cosmetic_tag': 'zin_cosmetic_aenor_strangers_host', 'name': "The Stranger's Host", 'parent': 'Y0L', 'kind': 'breakaway', 'culture': 'lake_aenoran',
     'gate': 'Aenor succession war, host camp, before zin_eindil_named',
     'field': {'division': 'per_bend', 'line': 'straight', 'tinctures': [T('lake_aenoran', 'Parim white'), T('lake_aenoran', 'lake blue')]},
     'primary_charge': {'id': 'wayfarer_staff', 'name': 'a wayfarer\'s staff with a small lamp hung from its head', 'tincture': T('lake_aenoran', 'bell bronze')}, 'secondary_charge': None,
     'marks': [],
     'blazon': "A field divided diagonally from the upper hoist corner, Parim white above and lake blue below. A wayfarer's staff bendwise in bell bronze with a small lamp in lamp gold hung from its head.",
     'meaning': "A traveller's staff carrying the lamp: the host gathered by a stranger from the north whose name is not yet known; nothing shows his blood."},
    {'cosmetic_tag': 'zin_host_of_eindil', 'name': 'The Host of Eindil', 'parent': 'host realm (Selen in the historical path)', 'kind': 'story', 'culture': 'lake_aenoran',
     'gate': 'zin_eindil_named',
     'field': {'division': 'plain', 'line': None, 'tinctures': [T('lake_aenoran', 'lake blue')]},
     'primary_charge': {'id': 'label_of_aen', 'name': "Aen's label, large, as the whole charge", 'tincture': T('lake_aenoran', 'Parim white')}, 'secondary_charge': {'id': 'wayfarer_staff', 'tincture': T('lake_aenoran', 'bell bronze')},
     'marks': [],
     'blazon': "A plain field of lake blue. Across the upper half a broad label of three square points in Parim white, large. Beneath it a wayfarer's staff in bell bronze with a small lamp in lamp gold, upright.",
     'meaning': "The label, every Ainic realm's small mark of descent, becomes the whole charge: the host of the son of Ein, son of Aen, whose claim is the line itself; uncrowned until the realm crowns him."},
    {'cosmetic_tag': 'zin_cosmetic_aenor_free_dominions', 'name': 'The Free Dominions', 'parent': 'Concord dominions (formed)', 'kind': 'formed', 'culture': 'lake_aenoran',
     'gate': 'Aenor succession war, Free Dominions',
     'field': {'division': 'plain', 'line': None, 'tinctures': [T('lake_aenoran', 'lake blue')]},
     'primary_charge': {'id': 'statute_book', 'tincture': T('lake_aenoran', 'Parim white')}, 'secondary_charge': None,
     'marks': [{'mark': 'label', 'tincture': T('lake_aenoran', 'lamp gold')}, {'mark': 'charter_border_broken', 'tincture': T('lake_aenoran', 'lamp gold')}],
     'blazon': 'A plain field of lake blue. In chief a narrow label of three short square points in lamp gold. A closed book with clasps in Parim white, large in the centre. A plain narrow border of lamp gold, broken open at the top.',
     'meaning': "The Charters of Parim held by the dominions themselves: the charter border broken open at the top where the crown once sealed it, and no crown."},
    {'cosmetic_tag': 'zin_cosmetic_aenor_restored', 'name': 'Aenor (the crowned heir of Aen)', 'parent': 'Y0L', 'kind': 'story', 'culture': 'lake_aenoran',
     'gate': 'zin_eindil_crowned',
     'field': {'division': 'plain', 'line': None, 'tinctures': [T('lake_aenoran', 'lake blue')]},
     'primary_charge': {'id': 'bowl_lamp', 'tincture': T('lake_aenoran', 'lamp gold')}, 'secondary_charge': None,
     'marks': [{'mark': 'crown_of_aen', 'tincture': T('lake_aenoran', 'pale gold')}],
     'blazon': 'A plain field of lake blue. A bowl-lamp with one flame in lamp gold, large in the centre, under an ancient plain circlet of pale gold set with one white stone.',
     'meaning': "Aenor's own arms under the ancient crown of Aen instead of the lamp-crown: the realm restored to the line it was founded by. Glo and the blue sword are not shown (reserved charges)."},
    {'cosmetic_tag': 'zin_cosmetic_worshipdom_east', 'name': 'The Dominion of the East', 'parent': 'Y8G', 'kind': 'story', 'culture': 'zilin_pilgrims',
     'gate': 'zin_afrit_king_of_east',
     'field': {'division': 'chief', 'line': 'straight', 'tinctures': [T('zilin_pilgrims', 'hostel white'), T('zilin_pilgrims', 'pilgrim gold')]},
     'primary_charge': {'id': 'hostel_lamp', 'tincture': T('zilin_pilgrims', 'sky blue')}, 'secondary_charge': {'id': 'offered_loaf', 'tincture': T('zilin_pilgrims', 'bread brown')},
     'marks': [{'mark': 'crown', 'tincture': T('zilin_pilgrims', 'bread brown')}],
     'blazon': 'A field of hostel white with a chief of pilgrim gold. A standing lamp in sky blue, large, under a tall plain crown of bread brown; beneath it a hand offering a round loaf in bread brown, small.',
     'meaning': "The hostel lamp crowned: the pilgrims' realm proclaimed a kingdom of the East; the arms still show only the public faith."},
    {'cosmetic_tag': 'zin_cosmetic_goldoroth_great', 'name': 'Great Goldoroth', 'parent': 'Y1A', 'kind': 'formed', 'culture': 'volcano_clans',
     'gate': 'zin_goldoroth_one_kingdom',
     'field': {'division': 'plain', 'line': None, 'tinctures': [T('volcano_clans', 'obsidian')]},
     'primary_charge': {'id': 'fire_mountain', 'tincture': T('volcano_clans', 'lava red')}, 'secondary_charge': None,
     'marks': [{'mark': 'crown', 'tincture': T('volcano_clans', 'bone')}, {'mark': 'challenge_ring_around', 'tincture': T('volcano_clans', 'ash grey')}],
     'blazon': 'A plain field of obsidian. A fire-mountain with a plume of flame in lava red within a ring of upright stakes in ash grey, large in the centre, under a circlet of upturned tusks in bone.',
     'meaning': "The Fire-Mountain inside one challenge ring: every hold that bent to the Warking now stands in his ring."},
]

FALL_PAL = [('undyed linen', '#ddd5c2'), ('smoke grey', '#6e6e6a'), ('dun', '#9a8466'), ('faded red', '#8e4a40'), ('faded blue', '#4e6478'), ('soot', '#2c2c2a')]
FALL_DIV = ['plain', 'per_fess', 'per_pale', 'per_bend', 'per_bend_sinister', 'per_chevron', 'chief', 'base', 'bordure', 'quarterly', 'pile', 'pile_reversed', 'flaunches', 'chief', 'plain']
FALL_CH = [('annulet', 'a plain ring', 'an oath not yet sealed'), ('bare_stake', 'a bare stake', 'a claim staked and not yet held'),
           ('broken_rod', 'a broken rod of office', 'an office thrown down'), ('unlit_brand', 'an unlit torch', 'a fire not yet lit'), ('empty_bowl', 'an empty bowl', 'a hall with no feast yet')]
pairs = [(a, b) for a in range(6) for b in range(6) if a != b and abs(lum(FALL_PAL[a][1]) - lum(FALL_PAL[b][1])) > 0.08]
fallback = []
seen = set()
for i in range(75):
    n = i + 1
    div = FALL_DIV[i % 15]; ch = FALL_CH[i // 15]
    a, b = pairs[(i * 7) % len(pairs)]
    f = [FALL_PAL[a]] if div == 'plain' else [FALL_PAL[a], FALL_PAL[b]]
    if div == 'plain' and i >= 15: f = [FALL_PAL[(i // 15 + (i % 2) * 3) % 6]]
    ftone = [x[1] for x in f]
    cands = sorted(FALL_PAL, key=lambda kv: -min(abs(lum(kv[1]) - lum(h)) for h in ftone))
    chtin = cands[0]
    k = (div, tuple(ftone), ch[0])
    j = 0
    while k in seen:
        j += 1; a2, b2 = pairs[(i * 7 + j) % len(pairs)]
        f = [FALL_PAL[a2]] if div == 'plain' else [FALL_PAL[a2], FALL_PAL[b2]]; ftone = [x[1] for x in f]; k = (div, tuple(ftone), ch[0])
    seen.add(k)
    fallback.append({'tag': f'D{n:02d}', 'kind': 'fallback', 'field': {'division': div, 'line': 'straight' if div != 'plain' else None, 'tinctures': [{'name': x[0], 'hex': x[1]} for x in f]},
                     'primary_charge': {'id': ch[0], 'name': ch[1], 'meaning': ch[2], 'tincture': {'name': chtin[0], 'hex': chtin[1]}},
                     'meaning': f'An unsettled banner: {ch[1]} for {ch[2]}. Shown only if a script created this dynamic country without a cosmetic tag, which the build check forbids.',
                     'provisional': True})

dynamic = {
    'engine_facts': [
        'Dynamic tags D01 to D75 are a shared pool (zz_zin_dynamic_countries.txt, dynamic_tags = yes); the installed game ships no flag file for them.',
        'start_civil_war and create_dynamic_country both run an effect block on the new country (effects_documentation.md), so every creation site can set_cosmetic_tag there.',
        'A dynamic country keeps original_tag = its parent; ZIN ships no ideology flag variants (asset manifest section 6), so without a cosmetic tag a breakaway would show its parent\'s flag or the D-tag fallback (probe AP5).',
    ],
    'rule': 'Every script that creates a dynamic country sets a cosmetic tag in the same effect block. A story creation uses its named cosmetic tag (story list). Any other creation uses zin_dyn_<PARENT>_<kind> whose design is derived from the parent record and its culture grammar by the algorithm below. The D-tag base files are a fallback the build forbids reaching.',
    'kinds': {
        'breakaway': {
            'when': 'A civil war breakaway (start_civil_war) or a rebel realm splitting from a parent.',
            'steps': [
                'Start from the parent\'s record.',
                'Counterchange the field: swap the order of the two field tinctures; a plain field takes the primary charge\'s tincture and the charge takes the field\'s.',
                'Keep the primary charge: the breakaway claims the same realm. Drop the secondary charge.',
                'Add the culture\'s breakaway mark (difference.breakaway_mark): a border in the culture\'s line, tinctured with difference.dissent_tincture. A Concord dominion instead shows the charter border broken open at the top; a Free Crown shows its crown torn from the beast.',
                'Keep the family mark (Aen\'s label, the family line). Never add or remove a people mark.',
                'Apply the ideology overlay of the breakaway\'s ruling ideology.',
                'Re-run contrast, palette and near-duplicate checks; the derived flag must be at least 10 of 64 from its parent.',
            ]},
        'released': {
            'when': 'A land given its own realm (create_dynamic_country for a people or province with no tag of its own).',
            'steps': [
                'Take the grammar of the released land\'s majority culture, not the releaser\'s.',
                'Division: the first entry of the culture\'s divisions list whose (division, field tinctures) signature is unused in the region.',
                'Field: the first pair of culture tinctures (one metal, one colour) unused with that division in the region.',
                'Primary charge: the first culture charge not used as a primary charge in the region.',
                'Secondary charge: the culture\'s restoration charge (difference.restoration_charge), small in base: the realm restored.',
                'If the releaser keeps it as a subject, add the releaser\'s subject mark (charter border, grave base or the releaser\'s dissent tincture as a narrow border).',
            ]},
        'formed': {
            'when': 'A union of two or more founders (a formable that is created as a dynamic country).',
            'steps': [
                'Impale: divide per pale in the family line of the senior founder; the hoist half carries the senior founder\'s first field tincture and primary charge, the fly half the junior founder\'s.',
                'With three or more founders, the fly half is the senior culture\'s darkest colour charged with the junior founders\' primary charges small, two above one.',
                'If the formed realm is a kingdom, the senior culture\'s crown is placed over the line of impalement.',
                'Never quarter more than four pieces and never tierce in three equal upright bands (a real-world tricolour).',
            ]},
    },
    'ideology_overlay': {
        'democratic': {'zin_name': 'Light', 'rule': 'The metal part of the field becomes the culture\'s lightest metal; no crown is added.'},
        'fascism': {'zin_name': 'Dominion', 'rule': 'The culture\'s crown is added over the charge; a culture without a crown uses a plain circlet in its lightest metal.'},
        'communism': {'zin_name': 'Shadow', 'rule': 'The colour part of the field becomes the culture\'s darkest tincture and the charge its palest; nothing else changes (no new symbols of the dark powers on a mortal realm).'},
        'neutrality': {'zin_name': 'Wild', 'rule': 'Any crown is removed; the counterchanged field stands alone.'},
    },
    'story': story,
    'fallback': fallback,
}

forbidden = {
    'regional_cliches': [
        {'id': 'palm_tree', 'rule': 'banned everywhere (the rejected 19 October sheets put palms across the East)'},
        {'id': 'one_motif_per_region', 'rule': 'no primary charge more than twice in a region and never twice in a culture; no charge class above 40 percent of a region with ten or more flags'},
        {'id': 'camel', 'rule': 'once in all the East Lands (The Moco)'},
        {'id': 'skull', 'rule': 'once per region at most (Gord in the Dark Lands); never for corsairs, never for the dead'},
        {'id': 'snowflake', 'rule': 'banned (the Cold Lands cliché)'},
        {'id': 'sun_disc', 'rule': 'at most one per culture (the Lands of Light noon-door, the Land of the Sun\'s sun court)'},
        {'id': 'igloo_scimitar_genie_lamp_pyramid', 'rule': 'banned'},
        {'id': 'wall_motifs', 'rule': 'no masonry, battlements, crenellation, brick courses or wall towers for the Great Wall of Aenor, which is a mountain range'},
    ],
    'real_world_flags_and_arms': [
        'tricolours: any field of three equal upright or horizontal bands, with or without a charge',
        'an unadorned two-band field',
        'stars and stripes: alternating stripes with a canton; stars in a canton or in rows; a ring of stars (including twelve)',
        'crescent and star, a crescent alone',
        'any cross throughout: Nordic (offset), St George, St Andrew saltire, Greek or Latin cross charges, cross pattee, Maltese cross',
        'hammer and sickle, hammer and compasses, crossed tools, cogwheels',
        'eagles in national poses: displayed, double-headed, on a cactus, with a snake',
        'a lion rampant of national type, three lions passant, a rose of the Tudor kind, a fleur-de-lis, a maple leaf, a cedar of the Lebanese kind, a harp of the Irish kind, a red dragon on green and white, a dragon on a diagonal bicolour',
        'a red disc on white; a rising sun with rays to the edges; a sun with a face; a sun over waves; a canoe over a sun over waves; a frigate bird over a sun',
        'a large plain disc or lozenge on a plain field (Japan, Bangladesh, Brazil types)',
        'a yurt roof-wheel, a spoked wheel of eight or twenty-four spokes',
        'a skull and crossbones, a fouled anchor, a compass rose of four points',
        'chequy red and white, lozengy blue and white, gold with red pales, gyronny gold and black (Croatian, Bavarian, Aragonese, Campbell arms)',
        'tartan, thistle, heather, shamrock, rainbow',
    ],
    'real_religious_symbols': ['crosses of every form', 'crescent', 'star of David or any hexagram', 'pentagram and inverted pentagram', 'inverted cross', 'ankh', 'Om', 'dharma wheel', 'yin and yang', 'swastika of any form', 'khanda', 'torii', 'lotus', 'hand with an eye (hamsa)', 'triquetra and the endless knot', 'valknut, sun cross, Celtic cross', 'ichthys, chalice, dove with olive branch, lamb with banner', 'eye of Horus, winged sun disc'],
    'other_fiction': ['a white tree with stars and crown', 'a lidless or flaming eye', 'a white hand', 'a black tower on black', 'a white horse on green', 'a direwolf, kraken, three-headed dragon, sun pierced by a spear, golden rose on green', 'a round door'],
    'lettering': 'No letters, numerals, runes, monograms, mottoes, signatures or maker\'s marks anywhere on a flag.',
    'owner_emblem': 'Never the owner\'s ZIN emblem: a square frame with its two diagonals crossed and an upright staff through the centre; no square frame with crossed diagonals in any arms.',
    'names_and_canon': ['no named New God charge; no figure of Zol, Volgan, Afrit, Elzon, Horos or any named person', 'no Afrit or Hidden Council sign on the Worshipdom or Aenor public arms (deny-list in the Worshipdom record)', 'Glo, Horos\'s blue sword and its shards are reserved charges: owner approval and a story gate are required', 'no device of Elzon\'s Order (the Pale Regency) on any living realm', 'nothing of the wider world (Erdu, Dunda, Haven, Cerio, Lao and the small neighbouring continent)'],
}

checks = {
    'coverage': 'every tag in common/country_tags (305 roster tags and D01-D75) and every cosmetic tag in common/countries/cosmetic.txt has a design record and gfx/flags/<TAG>.tga, medium/<TAG>.tga and small/<TAG>.tga; no flag file without a tag',
    'headers': {'large': {'size': [82, 52], 'tga_type': 2, 'bpp': 32, 'descriptor': '0x08', 'origin': 'bottom-left'}, 'medium': {'size': [41, 26], 'tga_type': 2, 'bpp': 32, 'descriptor': '0x08', 'origin': 'bottom-left'}, 'small': {'size': [10, 7], 'tga_type': 2, 'bpp': 32, 'descriptor': '0x00', 'origin': 'bottom-left'}, 'measured_from': 'installed game gfx/flags/FRA_democratic.tga, medium/FRA_democratic.tga, small/GER.tga and small/FRA.tga (24 October 2026)'},
    'palette_fit': 'k-means on the 82x52 image with k = declared tinctures + 1; every cluster above 6 percent of pixels lies within Delta E 2000 of 12 of a declared tincture of the record (culture palette, declared borrowings, overlord marks)',
    'contrast': 'primary charge tincture against each field tincture it overlaps: luminance ratio at least 2.2, or the record declares fimbriation',
    'element_budget': 'marks plus charges at most 4 (5 is a hard failure)',
    'primary_caps': {'per_culture': 1, 'per_region': 2},
    'class_share': {'max_share': 0.4, 'min_region_size': 10},
    'small_signature': '(division, field tinctures) unique within a region; at 10x7 the mean Delta E 2000 between any two flags of a region at least 10',
    'unique_design': 'design_hash (division, line, field, primary, secondary, marks) unique across all records',
    'near_duplicate': {'hash': '64-bit difference hash (grey 9x8) and 64-bit average hash; distance = larger Hamming distance', 'zin_min': 10, 'sibling_min': 6, 'real_world_min': 12, 'real_world_reference': 'computed at build time, read-only, from every flag of the installed game gfx/flags (a corpus of real national flags of the 1930s); nothing is copied or stored', 'colour_grid': '3x2 mean colour grid; a pair closer than 10 hashes is also compared by grid, mean Delta E 2000 under 18 fails'},
    'forbidden_text': 'record blazons and prompts are scanned for the forbidden vocabulary; the generated large sheet gets an OCR pass that must find no glyphs',
    'canon_gates': 'reserved charges only in gated records; the Worshipdom and Aenor public arms pass the hidden-identity deny-list',
    'provenance': 'each sheet has one line in art/source/provenance.jsonl (id, prompt, prompt sha256, record design_hash list, reference images, output, output sha256, review); each flag file has a line in art/source/flags_manifest.json (source sheet, cell, crop box, operations, output sha256)',
}

pipeline = {
    'sheet': {'columns': 4, 'rows': 3, 'per_sheet': 12, 'canvas': '1536x1024', 'background': '#000000', 'flag_aspect': '41:26', 'gutter_px_min': 24},
    'grouping': 'sheets are filled in order family, culture, region, tag, so one sheet carries one family\'s grammar; a sheet never mixes the dead or demons with living cultures',
    'prompt_frame': ("A flat asset sheet of {n} distinct heraldic flags for a medieval-fantasy strategy game, arranged in an exact {cols} columns by {rows} rows grid. "
                     "The background is solid flat pure black (#000000) everywhere between and around the flags: no glow, no blur, no gradient, no texture. "
                     "Every flag is a perfectly flat, front-facing rectangle with an aspect ratio of 41 to 26, all the same size, evenly spaced with identical black gutters; no perspective, no waving, no folds, no shadows, no frames, no poles. "
                     "Painted heraldic style: flat tinctures exactly as named, bold silhouettes with a thin dark outline, a faint woven-cloth texture inside each flag, no gradients, no fine detail smaller than one fortieth of the flag's height. "
                     "No lettering, no letters, numbers or runes anywhere; no signature or maker's mark; corners and bottom edge hold only plain ground; no real-world religious symbol; no real national flag or coat of arms; no crosses, stars, crescents or eagles; no masonry or battlements. "
                     "{family_style}\n{rows_text}"),
    'family_style': 'Family style: {family.mark_text}. Shared palette of this sheet: {palette names}.',
    'row_text': 'Row {r}, left to right: {k}. {blazon} ...',
    'reference': 'after the first accepted sheet, the job passes that sheet as a layout-only reference ("copy its black background, grid, flag size and spacing exactly; copy none of its designs")',
    'slicing': [
        'Find the 12 flag rectangles by the black-gutter layout check (existing flag-jobs check: expected count, columns, rows, aspect 1.4 to 1.75).',
        'Inset each rectangle by 2 percent on every side to drop edge fringe.',
        'Large: Lanczos-3 resize to 82x52.',
        'Medium: Lanczos-3 resize of the inset source to 41x26.',
        'Small: box-filter (area) downscale of the inset source to 10x7; this squeezes the 41:26 artwork horizontally as the game\'s own small flags do.',
        'Write uncompressed 32-bit TGA, bottom-left origin, alpha 255, descriptor as measured (0x08 large and medium, 0x00 small).',
        'No recolouring, palette snapping or redrawing: if a size fails a check, the sheet is regenerated.',
    ],
}

out = {
    'schema': 'zin-heraldry/1',
    'status': 'Draft: every country design is provisional until the roster redesign (R-21 to R-27) settles tags and realms',
    'updated': '2026-10-24',
    'spec': 'docs/specs/08_art_and_assets/06_heraldry.md',
    'requirement': 'R-92, rule F4',
    'note': 'Grammars per culture and people, family marks, a design record per current roster row (305, debug tags such as Y01 kept until the tag migration), the dynamic-tag derivation and fallback designs, the forbidden register and the build checks. Hex values are the design tinctures; the palette-fit check measures generated images against them.',
    'flag_sizes': {'large': [82, 52], 'medium': [41, 26], 'small': [10, 7]},
    'lines': LINES, 'divisions': DIVISIONS, 'charge_classes': CLASSES,
    'tincture_rule': 'A tincture is a metal when its relative luminance exceeds 0.30, otherwise a colour. Charges sit metal on colour or colour on metal (luminance ratio at least 2.2), or are fimbriated.',
    'families': FAMILIES,
    'peoples': peoples,
    'cultures': cultures,
    'countries': countries,
    'dynamic': dynamic,
    'forbidden': forbidden,
    'checks': checks,
    'pipeline': pipeline,
}
path = f'{ZIN}/tools/content/data/world/heraldry.json'
with open(path, 'w', encoding='utf-8', newline='\n') as fh:
    json.dump(out, fh, ensure_ascii=False, indent=1); fh.write('\n')
print('written', path, os.path.getsize(path))
print(len(cultures), 'cultures', len(peoples), 'peoples', len(countries), 'countries', len(story), 'story', len(fallback), 'fallback')
print(len({(f['field']['division'], tuple(t['hex'] for t in f['field']['tinctures']), f['primary_charge']['id']) for f in fallback}))
