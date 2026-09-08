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

# NOT EVERY POINT IN RCN_NDCS IS AN NDC.
#
# The map file's NDC layer is "places the network has a pin in", which is not
# the same list as "neighbourhood development cooperatives". The Carter Center
# Library is a presidential library in Atlanta — a venue the network has a
# relationship with, not a cooperative — and leaving it typed as an NDC makes
# the count wrong in every table, legend and map that asks how many NDCs there
# are.
#
# It stays in the data and keeps its participates-with edges, because being in
# the network file is itself the record that it is part of the network. Only the
# claim about what KIND of thing it is changes. Add a line here when the next
# venue turns up; do not edit the map file, which is somebody else's source.
RECLASSIFY = {
    'Carter Center Library': 'Partner',
}


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


def _perp(p, a, b):
    """Perpendicular distance from p to the segment ab, in degrees. Good enough:
    over a county the distortion from treating lon/lat as a plane is far smaller
    than the tolerance we are simplifying at."""
    (px, py), (ax, ay), (bx, by) = p, a, b
    dx, dy = bx - ax, by - ay
    if dx == 0 and dy == 0:
        return ((px - ax) ** 2 + (py - ay) ** 2) ** 0.5
    t = max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
    return ((px - (ax + t * dx)) ** 2 + (py - (ay + t * dy)) ** 2) ** 0.5


def simplify(ring, tol):
    """Douglas-Peucker, iterative so a 65,000-point watershed cannot blow the stack."""
    if len(ring) < 3:
        return ring
    keep = [False] * len(ring)
    keep[0] = keep[-1] = True
    stack = [(0, len(ring) - 1)]
    while stack:
        i, j = stack.pop()
        worst, idx = 0.0, -1
        for k in range(i + 1, j):
            d = _perp(ring[k], ring[i], ring[j])
            if d > worst:
                worst, idx = d, k
        if idx != -1 and worst > tol:
            keep[idx] = True
            stack.append((i, idx))
            stack.append((idx, j))
    return [pt for pt, k in zip(ring, keep) if k]


# A BOUNDARY FOR DRAWING IS NOT A BOUNDARY FOR DECIDING.
#
# The ten watersheds carry 150,000 vertices between them — one has 65,000 on its
# own — which is several megabytes of coordinates to hold in the database and
# push to a browser to draw a shape a few hundred pixels across. So what gets
# stored is simplified until each ring is under MAX_RING points.
#
# Which means the stored boundary must never be used to decide anything. The
# "sits in" links below are computed from the FULL geometry, before any of this
# runs, and the order matters: simplify first and an NDC near an edge would be
# ruled inside or outside by an artifact of the drawing budget. The exact
# boundary stays in maps/rcn_static_data.js for anything that needs to measure.
MAX_RING = 400


def boundary_of(geom):
    """Rings as [[lat, lng], ...] — Leaflet's order, so the map does no work."""
    out = []
    for ring in rings(geom):
        if len(ring) < 4:
            continue
        tol = 0.0002
        simple = simplify(ring, tol)
        while len(simple) > MAX_RING and tol < 0.5:
            tol *= 2
            simple = simplify(ring, tol)
        out.append([[round(p[1], 5), round(p[0], 5)] for p in simple])
    return out


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
        kind = RECLASSIFY.get(p['name'], 'NDC')
        run(f'MERGE (c:Concept:{kind} {{schemaLabel:$k}}) '
            'SET c.variableLabel=$n, c.kind=$kind, c.sources=["RCN_NDCS"], '
            '    c.lat=$lat, c.long=$lon, c.state=$st, c.address=$addr',
            {'k': key, 'n': p['name'], 'kind': kind,
             'lat': str(pt[0]), 'lon': str(pt[1]),
             'st': p.get('state', ''), 'addr': p.get('address', '')}, database=DB)

    raw_v = simple_v = 0
    for key, p, pt, geom in places:
        bounds = boundary_of(geom)
        raw_v += sum(len(r) for r in rings(geom))
        simple_v += sum(len(r) for r in bounds)
        run('MERGE (c:Concept:Place {schemaLabel:$k}) '
            'SET c.variableLabel=$n, c.kind="Place", c.sources=["RCN_PLACES"], '
            '    c.lat=$lat, c.long=$lon, c.state=$st, c.place_type=$pt, '
            '    c.area_mi2=$area, c.boundary_source=$src, c.dev_stat=$dev, '
            '    c.boundary=$bnd',
            {'k': key, 'n': p['name'], 'lat': str(pt[0]), 'lon': str(pt[1]),
             'st': p.get('state', ''), 'pt': p.get('place_type', ''),
             'area': str(p.get('area_mi2', '')), 'src': p.get('boundary_source', ''),
             'dev': str(p.get('dev_stat', '')),
             'bnd': json.dumps(bounds) if bounds else ''}, database=DB)

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

    # THE NETWORK ITSELF. "sits in" is computed from geometry and is therefore a
    # fact; this is not. Every NDC is a member of the same network, so each pair
    # is joined by `participates with` — but that is an ASSERTION of shared
    # membership, not an observation of two of them having worked together, and
    # it is marked `evidence: asserted` so nobody later reads it as evidence of
    # collaboration. Decision 15: observed needs a source, asserted says so.
    #
    # Symmetric, so one edge per unordered pair rather than two. Ordering the
    # endpoints alphabetically is what keeps a re-run from adding the mirror.
    #
    # When we know which NDCs actually work with which, the honest fix is to
    # delete the pairs that are not real rather than add a weight to them.
    pairs = 0
    keys = sorted(k for k, _, _, _ in ndcs)
    for i, a_ in enumerate(keys):
        for b_ in keys[i + 1:]:
            run('MATCH (a:Concept {schemaLabel:$a}), (b:Concept {schemaLabel:$b}) '
                'MERGE (a)-[r:REL {label:"participates with"}]->(b) '
                'SET r.sources=["asserted"], r.evidence="asserted", r.symmetric="true"',
                {'a': a_, 'b': b_}, database=DB)
            pairs += 1

    for name in ('RCN_NDCS', 'RCN_PLACES'):
        run('MERGE (a:Aspect {name:$n}) SET a.kind="table"', {'n': name}, database=DB)

    print('simplified boundaries: %d vertices -> %d (%.1f%%), max ring %d'
          % (raw_v, simple_v, 100.0 * simple_v / max(1, raw_v), MAX_RING))
    reclassed = [(n, RECLASSIFY[n]) for _, p_, _, _ in ndcs for n in [p_['name']]
                 if n in RECLASSIFY]
    print('loaded  %3d from RCN_NDCS — %d NDCs, %d reclassified'
          % (len(ndcs), len(ndcs) - len(reclassed), len(reclassed)))
    for n, k in reclassed:
        print('           %s is a %s, not an NDC' % (n, k))
    print('loaded  %3d places' % len(places))
    print('computed %3d "sits in" links by point-in-polygon' % links)
    print('asserted %3d "participates with" pairs among the NDCs '
          '(membership, not observed collaboration)' % pairs)
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
