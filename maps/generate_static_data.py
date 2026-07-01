#!/usr/bin/env python3
"""
Generate rcn_static_data.js from the rcn_geo PostgreSQL database.
Run this whenever NDC/places data changes in the DB.

Usage:
    python3 generate_static_data.py
"""
import psycopg2, json, os

DB = dict(host='localhost', port=5432, dbname='rcn_geo', user='postgres', password='rcn')
OUT = os.path.join(os.path.dirname(__file__), 'rcn_static_data.js')

conn = psycopg2.connect(**DB)
cur  = conn.cursor()

# ── /places equivalent ────────────────────────────────────────────────
cur.execute("""
    SELECT name, place_type, state,
           ROUND((ST_Area(boundary::geography)/2589988.11)::numeric, 2) AS area_mi2,
           boundary_source,
           ST_AsGeoJSON(boundary)::json AS geometry,
           site_data
    FROM place_geo
    WHERE boundary IS NOT NULL
""")

features = []
for name, place_type, state, area_mi2, boundary_source, geometry, site_data in cur.fetchall():
    if site_data and 'sites' in site_data:
        for site in site_data['sites']:
            features.append({
                'type': 'Feature',
                'geometry': {'type': 'Point', 'coordinates': [site['lon'], site['lat']]},
                'properties': {
                    'name':            site['name'],
                    'dev_stat':        site.get('dev_stat', site.get('subtitle', '')),
                    'place_type':      place_type,
                    'state':           state,
                    'area_mi2':        None,
                    'boundary_source': boundary_source
                }
            })
    else:
        features.append({
            'type': 'Feature',
            'geometry': geometry,
            'properties': {
                'name':            name,
                'place_type':      place_type,
                'state':           state,
                'area_mi2':        float(area_mi2) if area_mi2 else None,
                'boundary_source': boundary_source
            }
        })

places_data = {'type': 'FeatureCollection', 'features': features}

# ── /ndcs equivalent ──────────────────────────────────────────────────
cur.execute("""
    SELECT name, place_type, state, street_address, city, postal_code,
           ST_AsGeoJSON(location)::json AS point
    FROM place_geo
    WHERE place_type = 'ndc_zone'
""")

ndc_features = []
for name, place_type, state, street, city, postal, point in cur.fetchall():
    ndc_features.append({
        'type': 'Feature',
        'geometry': point,
        'properties': {
            'name':    name,
            'state':   state,
            'address': f'{street}, {city}, {state} {postal}'
        }
    })

ndcs_data = {'type': 'FeatureCollection', 'features': ndc_features}

cur.close()
conn.close()

with open(OUT, 'w') as f:
    f.write('// Auto-generated from rcn_geo DB — do not edit by hand.\n')
    f.write('// Re-run generate_static_data.py to update.\n')
    f.write('const RCN_PLACES = ' + json.dumps(places_data, separators=(',', ':')) + ';\n')
    f.write('const RCN_NDCS   = ' + json.dumps(ndcs_data,   separators=(',', ':')) + ';\n')

size_kb = os.path.getsize(OUT) // 1024
print(f'Written {OUT}')
print(f'  {len(features)} place features, {len(ndc_features)} NDCs — {size_kb} KB')
