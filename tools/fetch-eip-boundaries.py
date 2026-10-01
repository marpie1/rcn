#!/usr/bin/env python3
"""
fetch-eip-boundaries.py — fetch the real boundaries of an EIP Stage Sketch's
E and P areas from public map services, and write them as one GeoJSON file
the RCN Map draws.

    python3 tools/fetch-eip-boundaries.py tools/whatcom-coops-eip-areas.recipe.json
    python3 tools/fetch-eip-boundaries.py <recipe> --check     # fetch and compare, write nothing

WHAT IT READS — a recipe (JSON) beside the sketch. For each area it names:
  id        the area's node id in the sketch (polygon id = node id, so the map
            and the sketch can point at the same thing)
  eipCol    E or P
  outline   true to draw it as an outline only (state, nation)
  source    a plain sentence saying where the boundary comes from
  service   an ArcGIS map service layer, and `where`, the query that picks the
            one area out of it (e.g. WRIA_NR=1). Every US public agency that
            publishes boundaries — Census, Ecology, USFS, NPS, EPA, WSDA,
            county assessors — speaks this same protocol.
  simplify  how much detail the service may drop, in degrees (0.002 ≈ 200 m);
            keeps the file small enough for a wiki
  smooth    optional: merge many small pieces (crop fields) into a few blocks —
            closes gaps, drops specks, then simplifies. Needs shapely.
  allowMany true when the area comes back in several pieces that belong
            together (farmland in two counties); they are merged into one
  geojsonUrl + match   instead of a service: a plain GeoJSON file and the
            properties that pick one feature from it (used for the US outline)

WHAT IT DOES
  1. Asks each service for its area, already reprojected to latitude/longitude
     and thinned to the `simplify` setting.
  2. Checks it got exactly one area back. None or several means the `where`
     is wrong, or the service changed — it says so and keeps the old boundary
     for that area rather than writing a wrong one.
  3. Smooths the areas that ask for it.
  4. Compares each new boundary with the one already in the output file and
     reports: new, unchanged, or changed (and by how many points).
  5. Checks the sketch: every E or P polygon in the sketch should have an area,
     and every area should have a node. Mismatches are listed, not fixed.
  6. Writes the output file (unless --check).

A service that is down does not break the run: that area keeps the boundary
it already had, and the report names it. Run it again later.

Marc Pierson with Claude Opus 5.5, Sep 2026.
"""

import json
import os
import sys
import urllib.parse
import urllib.request

UA = {'User-Agent': 'RCN fetch-eip-boundaries (relocalizecreativity.net)'}


def get_json(url, params=None, timeout=180):
    if params:
        url = url + '?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.load(r)


def query_service(area):
    """One area from an ArcGIS layer, as GeoJSON in lat/lng."""
    d = get_json(area['service'].rstrip('/') + '/query', {
        'where': area['where'],
        'outFields': '*',
        'outSR': '4326',
        'maxAllowableOffset': area.get('simplify', 0) or '',
        'geometryPrecision': 6 if area.get('simplify', 0) == 0 else 5,
        'f': 'geojson',
    })
    if 'error' in d:
        raise RuntimeError('service said: %s' % d['error'].get('message', d['error']))
    return d.get('features', [])


def query_geojson(area):
    d = get_json(area['geojsonUrl'])
    m = area.get('match', {})
    return [f for f in d['features'] if all(f['properties'].get(k) == v for k, v in m.items())]


def smooth(geometry, s):
    """Merge many small pieces into a few readable blocks."""
    try:
        from shapely.geometry import Polygon, MultiPolygon, mapping
        from shapely.validation import make_valid
        from shapely.ops import unary_union
    except ImportError:
        raise RuntimeError('smoothing needs shapely — run: pip3 install shapely')
    # Some services return one "polygon" holding thousands of separate fields as
    # rings. Treat every ring as its own shape; holes don't matter at this scale.
    polys = geometry['coordinates'] if geometry['type'] == 'MultiPolygon' else [geometry['coordinates']]
    pieces = [make_valid(Polygon(ring)) for p in polys for ring in p if len(ring) >= 4]
    g = unary_union(pieces)
    g = g.buffer(s['closeGaps']).buffer(-s['closeGaps'])
    parts = [p for p in getattr(g, 'geoms', [g]) if p.geom_type == 'Polygon' and p.area > s['dropSmallerThan']]
    g = MultiPolygon(parts).simplify(s['simplify'], preserve_topology=True)
    return mapping(g)


def rounded(c):
    return [rounded(x) for x in c] if isinstance(c[0], (list, tuple)) else [round(c[0], 5), round(c[1], 5)]


def points(geometry):
    def n(c):
        return sum(n(x) for x in c) if isinstance(c[0], (list, tuple)) else 1
    return n(geometry['coordinates'])


def merge(features):
    """Several features for one area (a county split in pieces) → one MultiPolygon."""
    if len(features) == 1:
        return features[0]['geometry']
    polys = []
    for f in features:
        g = f['geometry']
        polys += g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
    return {'type': 'MultiPolygon', 'coordinates': polys}


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    check = '--check' in sys.argv
    if len(args) != 1:
        print(__doc__.split('WHAT IT READS')[0].strip())
        sys.exit(2)
    recipe_path = os.path.abspath(args[0])
    here = os.path.dirname(recipe_path)
    recipe = json.load(open(recipe_path))
    out_path = os.path.join(here, recipe['output'])

    old = {}
    if os.path.exists(out_path):
        for f in json.load(open(out_path)).get('features', []):
            old[f['id']] = f

    features, problems = [], []
    for a in recipe['areas']:
        aid = a['id']
        try:
            found = query_geojson(a) if 'geojsonUrl' in a else query_service(a)
            if len(found) == 0:
                raise RuntimeError('no area matched — check the "where" in the recipe')
            if len(found) > 1 and not a.get('allowMany'):
                raise RuntimeError('%d areas matched, expected 1 — narrow the "where"' % len(found))
            geom = merge(found)
            if a.get('smooth'):
                geom = smooth(geom, a['smooth'])
            geom = {'type': geom['type'], 'coordinates': rounded(geom['coordinates'])}
            if aid not in old:
                status = 'new'
            elif rounded(old[aid]['geometry']['coordinates']) == geom['coordinates']:
                status = 'unchanged'
            else:
                status = 'CHANGED (%d → %d points)' % (points(old[aid]['geometry']), points(geom))
        except Exception as e:
            if aid in old:
                geom, status = old[aid]['geometry'], 'KEPT OLD — fetch failed: %s' % e
            else:
                problems.append('%s: fetch failed and there is no old boundary: %s' % (aid, e))
                print('  %-10s MISSING — %s' % (aid, e))
                continue
            problems.append('%s: %s' % (aid, status))
        print('  %-10s %s' % (aid, status))
        features.append({'type': 'Feature', 'id': aid, 'properties': {
            'id': aid, 'eipCol': a['eipCol'], 'outline': bool(a.get('outline')),
            'source': a['source'], 'sourceUrl': a.get('sourceUrl') or a.get('service') or a.get('geojsonUrl'),
        }, 'geometry': geom})

    # The sketch and the areas must name the same polygons.
    if recipe.get('sketch'):
        sk = json.load(open(os.path.join(here, recipe['sketch'])))
        polygon_types = ('EcoZone', 'Jurisdiction')
        want = {n['id'] for n in sk.get('nodes', []) if n.get('eipType') in polygon_types}
        have = {f['id'] for f in features}
        for i in sorted(want - have):
            problems.append('%s: an E/P polygon in the sketch with no boundary in the recipe' % i)
        for i in sorted(have - want):
            problems.append('%s: a boundary with no E/P polygon of that id in the sketch' % i)

    fc = {'type': 'FeatureCollection', 'note': recipe.get('note', ''), 'features': features}
    if check:
        print('\n--check: nothing written.')
    else:
        with open(out_path, 'w') as fh:
            json.dump(fc, fh)
        print('\nwrote %s  (%d areas, %d KB)' % (os.path.relpath(out_path), len(features), os.path.getsize(out_path) // 1024))
    if problems:
        print('\nLook at these:')
        for p in problems:
            print('  - ' + p)
        sys.exit(1)


if __name__ == '__main__':
    main()
