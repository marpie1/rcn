"""
load_rcn_geo.py — the RCN map's own geography into the substrate.

WHY. The Whatcom survey has almost no coordinates: no organisation carries a
lat/long and only 22 people do, so it cannot demonstrate a map. The RCN map
already ships geocoded data of our own — six NDCs as points, and 509 places as
polygons with a type, a state and an area. That is a real table that is also a
real map, which is exactly what the table/map pair needs to be shown on.

Source: maps/rcn_static_data.js, itself generated from the original rcn_geo
store. This loader only reads it; the file stays the source of truth, per
decision 17.

    python3 substrate/load_rcn_geo.py

WHAT A PLACE'S COORDINATE MEANS. Places are polygons, so their marker is the
centre of the bounding box — NOT a centroid. For a crescent or a river valley
the bounding-box centre can fall outside the shape itself. It is honest as "one
point that stands for this area" and dishonest as "where this thing is", and no
measurement should ever be taken from it. The polygon remains in the map file
for anything that needs the real boundary.

WHAT LINKS TO WHAT. An NDC is joined to every place whose polygon contains it,
by ray casting. That is the claim worth having in a graph — this neighbourhood
development cooperative sits inside this watershed, this city, this county —
and it is computed here rather than stored anywhere, because it is derivable
from the geometry and would otherwise become a second answer that can drift.
"""

import json, os, re, sys
from collections import defaultdict
from db import run, BASE

DB = 'rcngeo'
SRC = os.path.join(BASE, 'maps', 'rcn_static_data.js')


def read_collections():
    """Pull the two GeoJSON collections out of the JS file without a JS engine."""
    text = open(SRC, encoding='utf-8').read()
    out = {}
    for name in ('RCN_NDCS', 'RCN_PLACES'):
        m = re.search(r'^const\s+%s\s*=\s*' % name, text, re.M)
        if not m:
            sys.exit('%s not found in %s' % (name, SRC))
        start = text.index('{', m.end())
        depth, i, instr, esc = 0, start, False, False
        while i < len(text):
            c = text[i]
            if instr:
                if esc: esc = False
                elif c == '\\': esc = True
                elif c == '"': instr = False
            elif c == '"': instr = True
            elif c == '{': depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    break
            i += 1
        out[name] = json.loads(text[start:i + 1])
    return out


def rings(geom):
    if not geom:
        return []
    if geom['type'] == 'Polygon':
        return [geom['coordinates'][0]]
    if geom['type'] == 'MultiPolygon':
        return [p[0] for p in geom['coordinates']]
    return []


def point_of(geom):
    """A point for a marker. Points give themselves; areas give a bbox centre."""
    if not geom:
        return None
    if geom['type'] == 'Point':
        lon, lat = geom['coordinates'][:2]
        return (lat, lon)
    pts = [p for r in rings(geom) for p in r]
    if not pts:
        return None
    lons = [p[0] for p in pts]
    lats = [p[1] for p in pts]
    return ((min(lats) + max(lats)) / 2.0, (min(lons) + max(lons)) / 2.0)


def contains(geom, lat, lon):
    """Ray casting, per ring. Holes are ignored — the outer ring is the claim."""
    inside = False
    for ring in rings(geom):
        n = len(ring)
        j = n - 1
        for i in range(n):
            xi, yi = ring[i][0], ring[i][1]
            xj, yj = ring[j][0], ring[j][1]
            if (yi > lat) != (yj > lat):
                x = (xj - xi) * (lat - yi) / ((yj - yi) or 1e-12) + xi
                if lon < x:
                    inside = not inside
            j = i
    return inside


def ensure_db():
    names = {r['name'] for r in run('SHOW DATABASES YIELD name RETURN name',
                                    database='system')}
    if DB not in names:
        run(f'CREATE DATABASE {DB} WAIT', database='system')
        print(f'created database "{DB}"')


def canon(name):
    return ' '.join(str(name).split())


def build():
    data = read_collections()
    ensure_db()
    run('MATCH (n) DETACH DELETE n', database=DB)
    run('CREATE CONSTRAINT rcngeo_concept IF NOT EXISTS FOR (c:Concept) '
        'REQUIRE c.schemaLabel IS UNIQUE', database=DB)

    ndcs, places, dupes = [], [], defaultdict(int)

    for f in data['RCN_NDCS']['features']:
        p = f.get('properties') or {}
        pt = point_of(f.get('geometry'))
        if not p.get('name') or not pt:
            continue
        ndcs.append((canon(p['name']), p, pt, f.get('geometry')))

    for f in data['RCN_PLACES']['features']:
        p = f.get('properties') or {}
        pt = point_of(f.get('geometry'))
        if not p.get('name') or not pt:
            continue
        key = canon(p['name'])
        dupes[key] += 1
        # Two places can share a name in different states — Superior AZ and any
        # other Superior — so the state disambiguates rather than one silently
        # overwriting the other.
        if p.get('state'):
            key = '%s, %s' % (key, p['state'])
        places.append((key, p, pt, f.get('geometry')))

    for key, p, pt, _ in ndcs:
        run('MERGE (c:Concept:NDC {schemaLabel:$k}) '
            'SET c.variableLabel=$n, c.kind="NDC", c.sources=["RCN_NDCS"], '
            '    c.lat=$lat, c.long=$lon, c.state=$st, c.address=$addr',
            {'k': key, 'n': p['name'], 'lat': str(pt[0]), 'lon': str(pt[1]),
             'st': p.get('state', ''), 'addr': p.get('address', '')}, database=DB)

    for key, p, pt, _ in places:
        run('MERGE (c:Concept:Place {schemaLabel:$k}) '
            'SET c.variableLabel=$n, c.kind="Place", c.sources=["RCN_PLACES"], '
            '    c.lat=$lat, c.long=$lon, c.state=$st, c.place_type=$pt, '
            '    c.area_mi2=$area, c.boundary_source=$src, c.dev_stat=$dev',
            {'k': key, 'n': p['name'], 'lat': str(pt[0]), 'lon': str(pt[1]),
             'st': p.get('state', ''), 'pt': p.get('place_type', ''),
             'area': str(p.get('area_mi2', '')), 'src': p.get('boundary_source', ''),
             'dev': str(p.get('dev_stat', ''))}, database=DB)

    links = 0
    for nkey, np_, npt, _ in ndcs:
        for pkey, pp, ppt, pgeom in places:
            if pgeom and pgeom['type'] in ('Polygon', 'MultiPolygon') \
               and contains(pgeom, npt[0], npt[1]):
                run('MATCH (n:Concept {schemaLabel:$n}), (p:Concept {schemaLabel:$p}) '
                    'MERGE (n)-[r:REL {label:"sits in"}]->(p) '
                    'SET r.sources=["computed"]',
                    {'n': nkey, 'p': pkey}, database=DB)
                links += 1

    for name in ('RCN_NDCS', 'RCN_PLACES'):
        run('MERGE (a:Aspect {name:$n}) SET a.kind="table"', {'n': name}, database=DB)

    print('loaded  %3d NDCs' % len(ndcs))
    print('loaded  %3d places' % len(places))
    print('computed %3d "sits in" links by point-in-polygon' % links)
    shared = {k: v for k, v in dupes.items() if v > 1}
    print('\nNAMES USED MORE THAN ONCE — disambiguated by state, not merged:')
    print('  ' + (', '.join(sorted(shared)) if shared else 'none'))
    print('\n--- what the substrate now holds ---')
    for r in run('MATCH (c:Concept) RETURN c.kind AS k, count(*) AS n ORDER BY n DESC',
                 database=DB):
        print('  %-8s %d' % (r['k'], r['n']))
    for r in run('MATCH (c:Concept {kind:"Place"}) RETURN c.place_type AS t, count(*) AS n '
                 'ORDER BY n DESC', database=DB):
        print('    %-22s %d' % (r['t'] or '(none)', r['n']))


if __name__ == '__main__':
    build()
