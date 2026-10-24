import json, re, sys, collections, hashlib, os
sys.path.insert(0, os.path.dirname(__file__))
from her_data1 import LINES, DIVISIONS, CLASSES, FAMILIES, PEOPLES
from her_data5 import C

ZIN = 'C:/Users/klimp/OneDrive/Documents/Paradox Interactive/Hearts of Iron IV/mod/zin'
countries = json.load(open(f'{ZIN}/tools/content/data/countries.json', encoding='utf-8-sig'))['countries']
cc = {r['tag']: r for r in json.load(open(f'{ZIN}/tools/content/data/world/country_cultures.json', encoding='utf-8-sig'))['countries']}
cult_src = json.load(open(f'{ZIN}/tools/content/data/world/cultures.json', encoding='utf-8-sig'))['cultures']
CT = {c['id']: c for c in C}
FAM_OF = {m: k for k, f in FAMILIES.items() for m in f['members']}

def lum(h):
    h = h.lstrip('#'); rgb = [int(h[i:i+2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4 for c in rgb]
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]
def ratio(a, b):
    la, lb = lum(a), lum(b); return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)
def tclass(h): return 'metal' if lum(h) > 0.30 else 'colour'

errors, warnings = [], []
def err(m): errors.append(m)

# palette and charge indexes
PAL = {cid: {n: h for n, h in c['palette']} for cid, c in CT.items()}
CH = {cid: {x[0]: x for x in c['charges']} for cid, c in CT.items()}
for p in PEOPLES:
    if p['palette']: PAL['people:' + p['id']] = {n: h for n, h in p['palette']}
    if p['charges']: CH['people:' + p['id']] = {x[0]: x for x in p['charges']}
allids = collections.Counter(cid for c in CH.values() for cid in c)
for k, v in allids.items():
    if v > 1: err(f'charge id {k} defined {v} times')

def resolve_t(cid, name, borrow):
    if name in PAL[cid]: return {'name': name, 'hex': PAL[cid][name], 'source': cid}
    for b in borrow:
        bc, bn = b.split(':')
        if bn == name and bn in PAL.get(bc, {}): return {'name': name, 'hex': PAL[bc][bn], 'source': bc, 'borrowed': True}
    err(f'{cid}: tincture {name} not in palette'); return {'name': name, 'hex': '#ff00ff', 'source': '?'}
def resolve_c(cid, chid, borrow):
    if chid in CH[cid]: return CH[cid][chid], cid
    for b in borrow:
        bc, bn = b.split(':')
        if bn == chid and chid in CH.get(bc, {}): return CH[bc][chid], bc
    err(f'{cid}: charge {chid} unknown'); return (chid, chid, '', 'token'), '?'

def best(cid, against, prefer=None):
    """palette tincture of culture cid with the best contrast against hex list"""
    cands = [(min(ratio(h, a) for a in against), n, h) for n, h in PAL[cid].items()]
    cands.sort(reverse=True); return {'name': cands[0][1], 'hex': cands[0][2], 'source': cid}

def overlap(div, field):
    if div in ('plain', 'chief', 'base', 'bordure', 'flaunches'): return [field[0]]
    if div in ('pile', 'pile_reversed'): return [field[1]]
    return field[:2]
def top_of(div, field):
    if div in ('chief', 'pile'): return field[1]
    if div == 'quarterly': return None
    return field[0]

SILVER = {'forest_council_elves': 'elven silver', 'hill_kingdom_elves': 'elven silver', 'lake_elves': 'water silver', 'pass_wardens': 'dawn silver', 'rift_coast_elves': 'quay silver'}
DIV_PLACE = {'chief': 'large in the field below the chief', 'base': 'large, standing on the base', 'pile': 'on the pile', 'pile_reversed': 'on the reversed pile', 'bordure': 'large within the border'}
NAME = {r['tag']: r for r in countries}

out_countries, out_c = [], {}
for c in C:
    cid = c['id']; fam = FAM_OF.get(cid); line = FAMILIES[fam]['line'] if fam else None
    src = cult_src.get(cid, {})
    ppl = src.get('people')
    if cid in ('hill_giants', 'ice_giants'): line = 'arched'
    if cid == 'troll_tribes': line = 'urdy'
    if cid == 'yeti_clans': line = 'dancetty'
    if cid == 'kilinti_ents': line = 'rooted'
    if cid in ('grave_hosts', 'zols_dead'): line = 'straight'
    if cid == 'netherborn': line = 'rent'
    pal = [{'name': n, 'hex': h, 'class': tclass(h)} for n, h in c['palette']]
    out_c[cid] = {
        'id': cid, 'name': src.get('name', cid), 'people': 'goblins' if cid == 'goblin_warrens' else ppl, 'family': fam,
        'language': src.get('language'), 'faith': src.get('faith'), 'tier': src.get('tier'),
        'line': line, 'palette': pal, 'divisions': c['divisions'],
        'charges': [{'id': x[0], 'name': x[1], 'meaning': x[2], 'class': x[3]} for x in c['charges']],
        'ornament': c['ornament'], 'crown': c['crown'], 'forms': c['forms'],
        'difference': {'dissent_tincture': c['dissent'], 'breakaway_mark': c['difference'], 'restoration_charge': c['restoration']},
        'source_flag_note': src.get('heraldry_and_look', {}).get('flag'),
    }
    if c['dissent'] not in PAL[cid]: err(f'{cid}: dissent tincture missing')
    if c['restoration'] not in CH[cid]: err(f'{cid}: restoration charge missing')
    for row in c['rows']:
        tag, form, div, field, prim, ptin, sec, stin, meaning, opts = row
        borrow = opts.get('borrow', [])
        base = NAME[tag]; cul = cc[tag]
        if cul['culture'] != cid: err(f'{tag}: culture {cul["culture"]} != {cid}')
        if div not in DIVISIONS: err(f'{tag}: division {div}')
        if div not in c['divisions'] and not (cid == 'buldor_companies'): warnings.append(f'{tag}: division {div} not in culture list')
        F = [resolve_t(cid, t, borrow) for t in field]
        if div != 'plain' and len(F) < 2: err(f'{tag}: division needs two tinctures')
        if div == 'plain' and len(F) != 1: err(f'{tag}: plain needs one tincture')
        pc, pcs = resolve_c(cid, prim, borrow)
        P = {'id': pc[0], 'name': pc[1], 'meaning': pc[2], 'class': pc[3], 'culture': pcs, 'tincture': resolve_t(cid, ptin, borrow) if ptin else None, 'count': opts.get('count', 1)}
        S = None
        if sec:
            sc, scs = resolve_c(cid, sec, borrow)
            S = {'id': sc[0], 'name': sc[1], 'meaning': sc[2], 'class': sc[3], 'culture': scs, 'tincture': resolve_t(cid, stin, borrow)}
            if scs != cid and f'{scs}:{sec}' not in borrow: err(f'{tag}: borrowed secondary not declared')
        marks = []
        overlord = base.get('overlord')
        if fam == 'ainic_men' and tag != 'Y0L' and form != 'theocracy':
            top = top_of(div, [f['hex'] for f in F])
            t = best(cid, [top] if top else [f['hex'] for f in F])
            marks.append({'mark': 'label', 'text': "Aen's label of three points in chief", 'tincture': t})
        if form in ('kingdom', 'high_kingdom') and c['crown']:
            top = top_of(div, [f['hex'] for f in F]) or F[0]['hex']
            if cid == 'steppe_rider':
                ct = resolve_t(cid, 'felt white', [])
            elif cid == 'free_crowns_north':
                ct = best(cid, [P['tincture']['hex']])
            elif ratio(P['tincture']['hex'], top) >= 2.2:
                ct = P['tincture']
            else:
                ct = best(cid, [top])
            marks.append({'mark': 'crown', 'text': c['crown'], 'tincture': ct})
        if form in ('council',) and cid in SILVER:
            marks.append({'mark': 'council_border', 'text': 'a border engrailed', 'tincture': resolve_t(cid, SILVER[cid], [])})
        if cid == 'goodin_sunfolk':
            marks.append({'mark': 'patron_chief', 'text': 'a chief rayonny (the Sunhot patrons)', 'tincture': resolve_t(cid, 'sun yellow', [])})
        if cid == 'river_kings':
            t = best(cid, [f['hex'] for f in F]); marks.append({'mark': 'river_bendlet', 'text': "a narrow wavy bendlet: the king's river", 'tincture': t})
        if form == 'horde' and cid == 'steppe_rider':
            marks.append({'mark': 'host_marks', 'text': 'three small hoof-marks in base: the host', 'tincture': P['tincture']})
        if overlord == 'Aenor':
            marks.append({'mark': 'charter_border', 'text': 'the charter border: a plain border of lamp gold', 'tincture': {'name': 'lamp gold', 'hex': PAL['lake_aenoran']['lamp gold'], 'source': 'lake_aenoran', 'overlord_mark': True}})
        if overlord == 'Volgan':
            marks.append({'mark': 'grave_base', 'text': 'a base of grave black: sworn to the Dominion', 'tincture': {'name': 'grave black', 'hex': PAL['grave_hosts']['grave black'], 'source': 'grave_hosts', 'overlord_mark': True}})
        if opts.get('bordure_style'):
            marks.append({'mark': 'bordure_compony', 'text': 'a border compony: ' + opts['bordure_style'], 'tincture': F[1]})
        n_el = len(marks) + 1 + (1 if S else 0)
        if n_el > 5: err(f'{tag}: {n_el} elements')
        if n_el > 4: warnings.append(f'{tag}: {n_el} elements (legibility review)')
        # contrast
        fim = None
        if P['tincture']:
            ov = [F[1]['hex']] if opts.get('on_base') else overlap(div, [f['hex'] for f in F])
            r = min(ratio(P['tincture']['hex'], h) for h in ov)
            if r < 2.2:
                if len(ov) == 1 and r < 1.6: err(f'{tag}: primary contrast {r:.2f} on single field')
                light = lum(P['tincture']['hex']) > 0.3
                fp = sorted(PAL[cid].items(), key=lambda kv: lum(kv[1]))
                fn, fh = (fp[0] if light else fp[-1])
                fim = {'name': fn, 'hex': fh, 'source': cid}
            P['contrast'] = round(r, 2)
        if fim: P['fimbriated'] = fim
        if S:
            ov = overlap(div, [f['hex'] for f in F])
            S['contrast'] = round(min(ratio(S['tincture']['hex'], h) for h in ov), 2)
            if S['contrast'] < 1.6: warnings.append(f'{tag}: secondary contrast {S["contrast"]}')
        if opts.get('on_base'): rec_place = 'set in the base'
        else: rec_place = None
        rec = {
            'tag': tag, 'name': base['name'], 'region': cul['region'], 'culture': cid, 'culture_secondary': cul.get('culture_secondary'),
            'people': 'goblins' if cid == 'goblin_warrens' else cul['people'], 'family': fam, 'form': form, 'subject_of': overlord,
            'field': {'division': div, 'line': line if div not in ('plain',) else None, 'tinctures': F},
            'primary_charge': P, 'secondary_charge': S, 'marks': marks,
            'meaning': meaning, 'provisional': True,
        }
        if rec_place: rec['placement'] = rec_place
        if opts.get('canon_note'): rec['canon_note'] = opts['canon_note']
        out_countries.append(rec)

# blazon / prompt text
def tn(t): return t['name']
CROWN_BLAZON = {
    'lake_aenoran': 'Above the charge a circlet of five flame-shaped points in {t}.',
    'steppe_rider': 'The charge rests on a spread felt cloth in {t}.',
    'isle_houses': 'Above the charge a circlet of five oar-blades in {t}.',
    'leren_sea_kings': 'Above the charge a circlet whose points are raised ship prows, in {t}.',
    'dondor_brutes': 'Above the charge a plain iron band without points, in {t}.',
    'winter_crown': 'Above the charge a circlet of short icicle points in {t}.',
    'gunwaith_clans': 'Above the charge an open torc worn as a crown, in {t}.',
    'corsair_lords': 'The charge is set within a plain heavy ring of {t}.',
    'noris_riders': 'Above the charge a circlet set with small cups, in {t}.',
    'river_kings': 'Above the charge a low collar-crown in {t}.',
    'lake_road_cities': 'Above the charge a circlet of small lantern points in {t}.',
    'hill_kingdom_elves': 'Above the charge a circlet of upright leaves in {t}.',
    'gala_court': 'Above the charge a plain circlet with no points, in {t}.',
    'volcano_clans': 'Above the charge a circlet of upturned tusks in {t}.',
}
def crown_blazon(r, m):
    cid = r['culture']; t = m['tincture']['name']
    if cid == 'free_crowns_north':
        cl = r['primary_charge']['class']
        if cl == 'tree': return f'A small plain crown of {t} hangs in the branches.'
        if cl in ('building', 'tool'): return f'A small plain crown of {t} sits above it.'
        return f'The beast wears a small plain crown of {t} about its neck.'
    return CROWN_BLAZON[cid].format(t=t)
def blazon(r):
    d = r['field']['division']; F = r['field']['tinctures']; line = r['field']['line'] or 'straight'
    s = DIVISIONS[d].format(*[tn(f) for f in F] + [''] * 2, line=LINES.get(line, line))
    parts = [s[0].upper() + s[1:] + '.']
    for m in r['marks']:
        if m['mark'] == 'label': parts.append(f"In chief a narrow label of three short square points in {tn(m['tincture'])}.")
    P = r['primary_charge']; cnt = P['count']
    pn = P['name'] if cnt == 1 else f"three of {P['name'].replace('a ', '', 1)}, two above one"
    place = r.get('placement') or DIV_PLACE.get(d, 'large in the centre')
    fim = f", outlined in {tn(P['fimbriated'])}" if P.get('fimbriated') else ''
    parts.append(f"{pn[0].upper() + pn[1:]} in {tn(P['tincture'])}{fim}, {place}.")
    S = r['secondary_charge']
    if S: parts.append(f"{S['name'][0].upper() + S['name'][1:]} in {tn(S['tincture'])}, " + ('encircling it.' if S['id'] == 'ring_of_names' else 'small, beneath it.'))
    for m in r['marks']:
        k = m['mark']
        if k == 'crown': parts.append(crown_blazon(r, m))
        elif k == 'bordure_compony': parts.append('The border is compony: alternating blocks of livery red and buff.')
        elif k == 'council_border': parts.append(f"A narrow border engrailed of {tn(m['tincture'])}.")
        elif k == 'patron_chief': parts.append(f"A chief rayonny of {tn(m['tincture'])}.")
        elif k == 'river_bendlet': parts.append(f"Behind the charge a narrow wavy diagonal band of {tn(m['tincture'])}.")
        elif k == 'host_marks': parts.append(f"In base three small hoof-marks in {tn(m['tincture'])}.")
        elif k == 'charter_border': parts.append("A plain narrow border of lamp gold.")
        elif k == 'grave_base': parts.append("A narrow plain base of grave black.")
    return ' '.join(parts)
for r in out_countries: r['blazon'] = blazon(r)

BANNED = r'\b(palm|crescent|cross|crosses|saltire|eagle|eagles|swastika|pentagram|sickle|crossbones|lotus|maple|shamrock|clover|rainbow|fleur|trident|ankh|hexagram|tartan|thistle|heather|stars?|battlements?|crenell\w*|merlons?|walls?|brick courses|snowflakes?|camels?|scimitar|sabre|cutlass)\b'
camel_ok = {'Y5K'}
for r in out_countries:
    for w in re.findall(BANNED, r['blazon'], flags=re.I):
        if w.lower().startswith('camel') and r['tag'] in camel_ok: continue
        err(f"{r['tag']}: banned word '{w}' in blazon")

# uniqueness
key = collections.Counter(); sig = collections.defaultdict(list); prim_c = collections.Counter(); prim_r = collections.Counter()
cls_r = collections.defaultdict(collections.Counter)
for r in out_countries:
    F = tuple(t['hex'] for t in r['field']['tinctures'])
    k = (r['field']['division'], r['field']['line'], F, r['primary_charge']['id'], (r['secondary_charge'] or {}).get('id'), tuple(sorted(m['mark'] for m in r['marks'])))
    key[k] += 1
    sig[(r['region'], r['field']['division'], F)].append(r['tag'])
    prim_c[(r['culture'], r['primary_charge']['id'])] += 1
    prim_r[(r['region'], r['primary_charge']['id'])] += 1
    cls_r[r['region']][r['primary_charge']['class']] += 1
    r['design_hash'] = hashlib.sha256(json.dumps(k).encode()).hexdigest()[:16]
for k, v in key.items():
    if v > 1: err(f'duplicate design {k}')
for k, v in sig.items():
    if len(v) > 1: err(f'10x7 signature shared in region {k}: {v}')
for k, v in prim_c.items():
    if v > 1: err(f'primary {k} repeated in culture')
for k, v in prim_r.items():
    if v > 2: err(f'primary {k} over regional cap')
region_n = collections.Counter(r['region'] for r in out_countries)
for reg, cnt in cls_r.items():
    n = region_n[reg]
    for cl, v in cnt.items():
        if n >= 10 and v / n > 0.4: err(f'class {cl} {v}/{n} in {reg}')

tags = {r['tag'] for r in out_countries}
missing = [c['tag'] for c in countries if c['tag'] not in tags]
if missing: err(f'missing tags {missing}')
if len(out_countries) != len(countries): err(f'count {len(out_countries)} vs {len(countries)}')

print('countries', len(out_countries), 'errors', len(errors), 'warnings', len(warnings))
for e in errors: print('E', e)
for w in warnings: print('W', w)
print({reg: dict(cls_r[reg].most_common(3)) for reg in cls_r})
json.dump({'countries': out_countries, 'cultures': out_c}, open(os.path.join(os.path.dirname(__file__), 'stage.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
