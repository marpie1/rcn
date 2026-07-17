import requests
import psycopg2
import json

conn = psycopg2.connect(
    host="localhost", port=5432,
    dbname="rcn_geo", user="postgres", password="rcn"
)
cur = conn.cursor()

url = (
    "https://nominatim.openstreetmap.org/search"
    "?city=Superior&state=Arizona&country=USA"
    "&format=geojson&polygon_geojson=1&limit=1"
)
r = requests.get(url, timeout=30, headers={"User-Agent": "RCN-GIS/1.0"})
features = r.json().get("features", [])

if features:
    geom = json.dumps(features[0]["geometry"])
    cur.execute("""
        UPDATE place_geo
        SET boundary = ST_GeomFromGeoJSON(%s),
            boundary_source = 'openstreetmap_nominatim',
            boundary_updated = CURRENT_DATE
        WHERE name = 'Superior'
    """, (geom,))
    conn.commit()
    coords = features[0]["geometry"]["coordinates"][0]
    print(f"Superior: updated ({len(coords)} vertices)")
else:
    print("Superior: no features returned")

cur.close()
conn.close()
