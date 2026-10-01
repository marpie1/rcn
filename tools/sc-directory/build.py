#!/usr/bin/env python3
"""Build the RCN Map layer for Sustainable Connections' Local Business Directory.

Re-runnable. Reads the live directory from sustainableconnections.org's
WordPress REST API (each business is a post in the "directory" category tree),
parses address / phone / email / website / ownership / neighbourhood, and
places every listing:

  1. the street address the directory itself publishes, or
  2. a hand-checked address from addresses.json (business's own site, Eat Local
     First, Esri listing, WA SOS record — the source is kept per address), or
  3. if neither exists, the neighbourhood or town the directory gives. Those
     are home-based service businesses; we do not hunt for home addresses.

Geocoding: US Census geocoder first, then Esri World geocoder, then
OpenStreetMap Nominatim. Results are cached in geocache.json, so a re-run only
asks about new addresses.

Writes:
  tools/issue-data/whatcom-wa--sustainable-connections-directory.json  (map issue)
  tools/sc-directory/sc-directory.csv                                   (every listing, one row per location)

Usage:  python3 tools/sc-directory/build.py
"""
import csv, html, json, os, re, sys, time, urllib.parse, urllib.request
from datetime import date

HERE  = os.path.dirname(os.path.abspath(__file__))
ROOT  = os.path.dirname(os.path.dirname(HERE))
OUT   = os.path.join(ROOT, 'tools', 'issue-data', 'whatcom-wa--sustainable-connections-directory.json')
CSV   = os.path.join(HERE, 'sc-directory.csv')
CACHE = os.path.join(HERE, 'geocache.json')
MANUAL = json.load(open(os.path.join(HERE, 'addresses.json')))
API   = 'https://sustainableconnections.org/wp-json/wp/v2/'
UA    = {'User-Agent': 'RCN-map-research/1.0 (Marc Pierson, Bellingham WA)'}

# Their nine top-level directory sections, in their order, with a colour each.
TYPES = {
    'eat-and-drink':           ('Eat and drink',           '#c0392b'),
    'home-office-and-garden':  ('Home, office and garden', '#1a7a4a'),
    'get-healthy-and-relax':   ('Get healthy and relax',   '#2563eb'),
    'have-fun':                ('Have fun',                '#d4a017'),
    'community':               ('Community',               '#8e5cc4'),
    'take-care-of-business':   ('Take care of business',   '#475569'),
    'your-local-life':         ('Your local life',         '#0e9aa7'),
    'shop-locally':            ('Shop locally',            '#d4549a'),
    'learn':                   ('Learn',                   '#ea7c1e'),
}

# Where to put a listing that has no street address: the directory's own
# neighbourhood names, as a point a geocoder can find.
AREA_QUERY = {
    'Bellingham: Samish':        'Samish Way & Byron Ave, Bellingham WA',
    'Bellingham: Birchwood':     'Birchwood Ave & Northwest Ave, Bellingham WA',
    'Bellingham: Silver Beach':  'Silver Beach, Bellingham WA',
    'Bellingham: Cornwall Park': 'Cornwall Park, Bellingham WA',
    'Bellingham: Barkley':       'Barkley Village, Bellingham WA',
    'Bellingham: Meridian':      'Meridian St & W Bakerview Rd, Bellingham WA',
    'Bellingham: South Hill':    'South Hill, Bellingham WA',
    'Bellingham: Columbia':      'Columbia, Bellingham WA',
    'Sedro-Woolley':             'Sedro-Woolley WA',
    'Mt. Vernon':                'Mount Vernon WA',
    'Blaine':                    'Blaine WA',
    'No Storefront':             'Bellingham WA',
    '':                          'Bellingham WA',
}

def get_json(url):
    for tries in range(3):
        try:
            return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40))
        except urllib.error.HTTPError as e:
            if e.code == 400: return None          # past the last page
            time.sleep(2)
        except Exception:
            time.sleep(2)
    raise RuntimeError('failed: ' + url)

# ── 1. Fetch ────────────────────────────────────────────────────────────────
def fetch():
    cats = []
    for p in range(1, 5):
        b = get_json(API + f'categories?per_page=100&page={p}&_fields=id,name,slug,parent')
        if not b: break
        cats += b
    byid = {c['id']: c for c in cats}
    root = next(c for c in cats if c['slug'] == 'directory')['id']
    top  = {c['id'] for c in cats if c['parent'] == root}
    ids  = {root} | top | {c['id'] for c in cats if c['parent'] in top}
    posts = {}
    for p in range(1, 20):
        b = get_json(API + f"posts?categories={','.join(map(str, ids))}&per_page=100&page={p}")
        if not b: break
        for x in b: posts[x['id']] = x
    return list(posts.values()), byid, top

# ── 2. Parse ────────────────────────────────────────────────────────────────
def text(s):
    return html.unescape(re.sub(r'<br\s*/?>', '\n', re.sub(r'<(?!br)[^>]+>', '', s))).strip()

def street_lines(lines):
    """The directory's map link holds one or more locations, sometimes with a
    label ("Downtown:", "Sunnyland -") and the city on its own line."""
    out = []
    for i, raw in enumerate(lines):
        l = re.sub(r'^[^:\d]{0,40}:\s*(?=\d)', '', raw)
        l = re.sub(r'^.{0,30}? - (?=\d)', '', l)
        if not re.match(r'\s*\d', l): continue
        if not re.search(r'\bWA\b', l):
            for nxt in lines[i + 1:]:
                if re.match(r'\s*\d', nxt) or re.search(r' - \d|:\s*\d', nxt): break
                if re.search(r'\bWA\b', nxt): l += ' ' + nxt; break
        out.append(re.sub(r'\s+', ' ', l).strip())
    return out

def parse(p, byid, top):
    c = p['content']['rendered']
    m = re.search(r"maps\.google\.com/\?q=([^'\"]+)", c)
    q = urllib.parse.unquote(m.group(1)) if m else ''
    paras = [text(x) for x in re.findall(r'<p>(.*?)</p>', c, re.S)]
    flat  = html.unescape(re.sub(r'<[^>]+>', ' ', c))
    phone = re.search(r'\(?\d{3}\)?[ .-]?\d{3}-\d{4}', flat)
    email = re.search(r'[\w.+-]+@[\w-]+\.[a-z]{2,}', html.unescape(c), re.I)
    links = [html.unescape(h) for h in re.findall(r'href=["\'](https?://[^"\']+)["\']', c)]
    web = next((l for l in links if not re.search(
        r'sustainableconnections|facebook|instagram|maps\.google|twitter|linkedin|youtube|x\.com|tiktok|pinterest', l, re.I)), '')
    field = {}
    for x in paras:
        mm = re.match(r'^(Sustainable Practices|Sales Methods|Neighborhood)\s*:\s*(.*)$', x, re.S)
        if mm: field[mm.group(1)] = mm.group(2).strip()
    own = next((x for x in paras if re.search(r'(-| )owned', x, re.I) and len(x) < 160 and ':' not in x), '')
    contact_bits = [s for s in (phone and phone.group(0), email and email.group(0)) if s]
    sustaining = any('Sustaining Member' in x for x in paras)
    # Drop the paragraphs that are not the description: the address block, the
    # phone/email/web block, the labelled fields, the sustaining-member blurb.
    keep = [x for x in paras if x and x != own and 'Return to Main' not in x
            and 'Sustaining Member' not in x and 'Sustaining Business Member' not in x
            and not any(b in x for b in contact_bits)
            and not (q and re.sub(r'[,\s]+', ' ', x.split('\n')[0]).strip() in re.sub(r'[,\s]+', ' ', q))
            and not re.match(r'^(Sustainable Practices|Sales Methods|Neighborhood)', x)]
    desc = re.sub(r'\s+', ' ', ' '.join(keep)).strip()
    cs   = p['categories']
    tops = [byid[i]['slug'] for i in cs if i in top] or \
           [byid[byid[i]['parent']]['slug'] for i in cs if i in byid and byid[i]['parent'] in top]
    subs = [byid[i]['name'] for i in cs if i in byid and byid[i]['parent'] in top]
    return dict(
        wpid=p['id'], name=html.unescape(p['title']['rendered']).strip(), link=p['link'],
        type=tops[0] if tops else '', sub=[html.unescape(s) for s in subs],
        streets=street_lines([l.strip() for l in q.split('\n') if l.strip()]),
        phone=phone.group(0) if phone else '', email=email.group(0) if email else '', web=web,
        own=re.sub(r'\s*\n\s*', '; ', own), practices=field.get('Sustainable Practices', ''),
        sales=field.get('Sales Methods', ''), hood=field.get('Neighborhood', '').strip('+ '),
        desc=desc, sustaining=sustaining, modified=p['modified'][:10])

# ── 3. Geocode ──────────────────────────────────────────────────────────────
cache = json.load(open(CACHE)) if os.path.exists(CACHE) else {}

def clean(a):
    a = re.sub(r'(\b(Suite|Ste\.?|Unit)\s+|#\s*)[\w-]+,?', '', a, flags=re.I)
    a = re.sub(r'\b(\w+) \1\b', r'\1', a)       # "Bellingham Bellingham"
    return re.sub(r'\s+', ' ', a).replace(' ,', ',').strip()

def census(a):
    u = 'https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?' + urllib.parse.urlencode(
        {'address': a, 'benchmark': 'Public_AR_Current', 'format': 'json'})
    try:
        m = get_json(u)['result']['addressMatches']
        if m: return [m[0]['coordinates']['y'], m[0]['coordinates']['x'], m[0]['matchedAddress'], 'US Census geocoder']
    except Exception: pass

def esri(a, street=True):
    u = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?' + urllib.parse.urlencode(
        {'f': 'json', 'maxLocations': 1, 'outFields': 'Addr_type,Place_addr', 'SingleLine': a})
    try:
        c = get_json(u)['candidates']
        if c and c[0]['score'] >= 90 and (not street or c[0]['attributes']['Addr_type'] in
                ('PointAddress', 'Subaddress', 'StreetAddress', 'StreetAddressExt', 'StreetInt')):
            return [c[0]['location']['y'], c[0]['location']['x'], c[0]['attributes']['Place_addr'], 'Esri World geocoder']
    except Exception: pass

def nominatim(a):
    time.sleep(1.1)
    u = 'https://nominatim.openstreetmap.org/search?' + urllib.parse.urlencode({'q': a, 'format': 'json', 'limit': 1, 'countrycodes': 'us'})
    try:
        d = get_json(u)
        if d: return [float(d[0]['lat']), float(d[0]['lon']), d[0]['display_name'], 'OpenStreetMap Nominatim']
    except Exception: pass

def geocode(a, street=True):
    key = ('S|' if street else 'A|') + a
    if key not in cache:
        g = (census(clean(a)) or esri(clean(a))) if street else None
        g = g or (nominatim(clean(a)) if street else (esri(a, False) or nominatim(a)))
        if not g and street:            # last resort: the road itself, not the door
            g = esri(clean(a), False)
            if g: g[3] += ' (street-level match only)'
        if not g: return None           # don't cache a miss; a rerun tries again
        cache[key] = g
    return cache[key]

# ── 4. Location group for the picker ────────────────────────────────────────
# The directory's own neighbourhood name wins. Where it gives none, a Bellingham
# point gets the City's neighbourhood it sits in (bellingham-neighborhoods.geojson,
# City of Bellingham COB_Neighborhood_Web layer), and anywhere else gets its town.
HOODS = [(f['properties']['NEIGHBORHOOD_NAME'].title().replace('Western Washington University', 'WWU'),
          f['geometry']['coordinates'] if f['geometry']['type'] == 'MultiPolygon' else [f['geometry']['coordinates']])
         for f in json.load(open(os.path.join(HERE, 'bellingham-neighborhoods.geojson')))['features']]
TOWN_GROUP = {'Mt. Vernon': 'Mount Vernon', 'Bow': 'Bow-Edison', 'Edison': 'Bow-Edison',
              'Deming': 'Mt. Baker Hwy – Deming, Maple Falls, Glacier',
              'Maple Falls': 'Mt. Baker Hwy – Deming, Maple Falls, Glacier',
              'Glacier': 'Mt. Baker Hwy – Deming, Maple Falls, Glacier',
              'Acme': 'Hwy 9-Acme, Van Zandt, Saxon, Wickersham'}

def in_ring(x, y, ring):
    inside, j = False, len(ring) - 1
    for i in range(len(ring)):
        xi, yi = ring[i][:2]; xj, yj = ring[j][:2]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi: inside = not inside
        j = i
    return inside

def bellingham_hood(lat, lng):
    for name, polys in HOODS:
        for poly in polys:
            if in_ring(lng, lat, poly[0]) and not any(in_ring(lng, lat, h) for h in poly[1:]):
                return name

def area_of(r, matched, lat, lng):
    # A street address inside the city is grouped by the City's own neighbourhood
    # boundaries: businesses' self-chosen names often disagree with their address
    # (and the directory's "Downtown:" and "City Center" overlap). Their own pick
    # stays in the CSV as directory_neighbourhood.
    h = r['hood']
    in_bham = h.startswith(('Bellingham', 'Downtown')) or h in ('Marina/Marine Dr/Squalicum', 'James/Iowa', 'No Storefront', '')
    if matched:
        hood = bellingham_hood(lat, lng)
        if hood: return 'Bellingham: ' + hood
        if not in_bham: return TOWN_GROUP.get(h, h)
    else:
        if h.startswith('Downtown:'): return 'Bellingham: City Center'
        if h in ('Marina/Marine Dr/Squalicum', 'James/Iowa'): return 'Bellingham: ' + h
        if h and h != 'No Storefront': return TOWN_GROUP.get(h, h)
    m = re.search(r',\s*([A-Z][A-Z .\-]+),\s*WA', (matched or '').upper()) or \
        re.search(r'([A-Za-z .\-]+?),?\s+(?:WA|Washington)\b', matched or '')
    city = m.group(1).strip().title() if m else 'Bellingham'
    return 'Bellingham: outside city limits' if city == 'Bellingham' and matched else \
           'Bellingham: no storefront' if city == 'Bellingham' else TOWN_GROUP.get(city, city)

def slug(s): return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')[:40]

# ── 5. Build ────────────────────────────────────────────────────────────────
def main():
    posts, byid, top = fetch()
    rows = [parse(p, byid, top) for p in posts]
    # A news post or two carries a directory category; real listings have contact details.
    rows = [r for r in rows if r['type'] in TYPES and (r['phone'] or r['web'] or r['streets'] or r['hood'] or r['name'] in MANUAL)]
    rows.sort(key=lambda r: r['name'].lower())
    parcels, table, unplaced, seen = [], [], [], set()
    for r in rows:
        places = []
        if r['name'] in MANUAL and MANUAL[r['name']]:
            places = [(a, src, 'street') for a, src in MANUAL[r['name']]]
        elif r['streets']:
            places = [(a, 'Sustainable Connections directory', 'street') for a in r['streets']]
        if places:
            located = [(a, src, geocode(a)) for a, src, _ in places]
            located = [x for x in located if x[2]]
        else:
            located = []
        precision = 'street'
        if not located:
            q = AREA_QUERY.get(r['hood']) or (r['hood'].replace('Bellingham: ', '') + ', Bellingham WA'
                                             if r['hood'].startswith('Bellingham') else r['hood'] + ' WA')
            g = geocode(q, street=False)
            if not g: unplaced.append(r['name']); continue
            located = [('', 'neighbourhood given in the directory', g)]
            precision = 'area'
        base = slug(r['name']) or str(r['wpid'])
        for i, (addr, src, g) in enumerate(located):
            pid = base if i == 0 else f'{base}-{i + 1}'
            while pid in seen: pid += 'x'
            seen.add(pid)
            lat, lng = round(g[0], 6), round(g[1], 6)
            # the directory's neighbourhood names the first location; the rest are placed by where they are
            area = area_of(r if i == 0 else {**r, 'hood': ''}, g[2] if precision == 'street' else '', lat, lng)
            far  = not (48.35 < lat < 49.1 and -123.1 < lng < -121.4)
            label = r['name'] + (f' ({i + 1} of {len(located)})' if len(located) > 1 else '')
            notes = [', '.join(r['sub'])]
            if precision == 'area':
                notes.append('📍 No street address published — placed at ' +
                             (r['hood'] if r['hood'] and r['hood'] != 'No Storefront' else 'Bellingham') +
                             ('. No storefront.' if r['hood'] in ('No Storefront', '') else ', the neighbourhood the directory gives.'))
            if r['sustaining']: notes.append('⭐ Sustaining member of Sustainable Connections')
            if r['own']:       notes.append(r['own'])
            if r['practices']: notes.append('Practices: ' + r['practices'])
            if r['sales']:     notes.append('Sells: ' + r['sales'])
            if r['desc']:      notes.append(r['desc'][:280] + ('…' if len(r['desc']) > 280 else ''))
            notes.append(f'<a href="{r["link"]}" target="_blank" rel="noopener">Directory listing ↗</a>')
            p = {
                'id': pid, 'label': label, 'type': r['type'], 'area': area,
                'latLng': [lat, lng], 'stance': 'unknown',
                'notes': ' · '.join(n for n in notes if n),
                'contact': {k: v for k, v in {
                    'website': r['web'], 'phone': r['phone'], 'email': r['email'],
                    'address': addr if precision == 'street' else '',
                    'checked': 'Oct 2026',
                    'source': ('Address: ' + src + ' · geocoded by ' + g[3]) if precision == 'street'
                              else 'Neighbourhood from the directory; no street address published',
                }.items() if v},
            }
            if far: p['inFrame'] = False
            parcels.append(p)
            table.append({
                'id': pid, 'name': r['name'], 'section': TYPES[r['type']][0], 'categories': '; '.join(r['sub']),
                'location_group': area, 'directory_neighbourhood': r['hood'],
                'address': addr, 'matched_address': g[2] if precision == 'street' else '',
                'lat': lat, 'lng': lng, 'precision': precision,
                'address_source': src, 'geocoder': g[3],
                'phone': r['phone'], 'email': r['email'], 'website': r['web'],
                'ownership': r['own'], 'sustaining_member': 'yes' if r['sustaining'] else '', 'sustainable_practices': r['practices'], 'sales_methods': r['sales'],
                'directory_url': r['link'], 'listing_updated': r['modified'],
            })
    json.dump(cache, open(CACHE, 'w'), indent=1, sort_keys=True)

    n_list   = len(rows)
    n_street = len({t['name'] for t in table if t['precision'] == 'street'})
    n_area   = len({t['name'] for t in table if t['precision'] == 'area'})
    today    = date.today().isoformat()
    issue = {
        'meta': {
            'id': 'whatcom-wa--sustainable-connections-directory',
            'title': 'Sustainable Connections — local businesses',
            'community': 'Whatcom and Skagit counties, WA',
            'ndc': 'East Whatcom RRC', 'coordinator': '', 'date': today, 'status': 'active',
            'fitPoints': True,
            'description': (
                f"Every listing in Sustainable Connections' Local Business Directory ({n_list} businesses and organisations, "
                f"{len(parcels)} locations), coloured by the directory's own nine sections. "
                f"{n_street} are placed at a street address: the one the directory publishes, or, where it gives none, the one "
                "the business publishes itself (own website, Eat Local First, state business record or map listing). Every popup "
                f"names its source. {n_area} home-based service businesses publish no address and sit at the neighbourhood the "
                "directory gives them; their popups say so. Businesses with several locations get one point each. "
                "Pick what to show groups by kind or by location. Inside Bellingham, a location is the City of Bellingham neighbourhood the address falls in (the business's own pick, which often differs, is kept in the CSV); elsewhere it is the directory's area name or the town. "
                "Being listed means being a member of Sustainable Connections, not an endorsement by RCN. "
                f"Source: sustainableconnections.org/local-business-directory, read {today}; rebuild with tools/sc-directory/build.py. "
                "Compiled Oct 2026 by Marc Pierson with Claude Opus 5.5."),
            'apn_prefix': 'SC-',
        },
        'issue': {'centroid': [48.78, -122.45]},
        'types': {k: {'label': v[0], 'color': v[1]} for k, v in TYPES.items()},
        'facets': {'area': {'label': 'Location'}},
        'parcels': parcels,
    }
    json.dump(issue, open(OUT, 'w'), indent=1, ensure_ascii=False)
    with open(CSV, 'w', newline='') as f:
        w = csv.DictWriter(f, fieldnames=list(table[0].keys()))
        w.writeheader(); w.writerows(table)
        f.write(f'# Sustainable Connections Local Business Directory, read {today}. Compiled Oct 2026 by Marc Pierson with Claude Opus 5.5.\n')
    print(f'{n_list} listings → {len(parcels)} points ({n_street} at street, {n_area} at neighbourhood); unplaced: {unplaced}')
    print('wrote', os.path.relpath(OUT, ROOT), 'and', os.path.relpath(CSV, ROOT))

if __name__ == '__main__':
    main()
