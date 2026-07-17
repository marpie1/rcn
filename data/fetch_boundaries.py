import requests
import psycopg2
import json

conn = psycopg2.connect(
    host="localhost", port=5432,
    dbname="rcn_geo", user="postgres", password="rcn"
)
cur = conn.cursor()

# ── 1. Superior, AZ city boundary from Census TIGER ──────────────────
tiger_url = (
    "https://tigerweb.geo.census.gov/arcgis/rest/services/"
    "TIGERweb/Places_CouSub_ConCity_SubMCD/MapServer/4/query"
    "?where=STATE%3D%2704%27+AND+NAME%3D%27Superior%27"
    "&outFields=NAME,GEOID"
    "&outSR=4326&f=geojson"
)
r = requests.get(tiger_url, timeout=30)
features = r.json().get("features", [])
if features:
    geom = json.dumps(features[0]["geometry"])
    cur.execute("""
        UPDATE place_geo
        SET boundary = ST_GeomFromGeoJSON(%s),
            boundary_source = 'census_tiger',
            boundary_updated = CURRENT_DATE
        WHERE name = 'Superior'
    """, (geom,))
    print(f"Superior: updated ({len(features[0]['geometry']['coordinates'][0])} vertices)")
else:
    print("Superior: no features returned")

# ── 2. Queen Creek Watershed from USGS WBD (HUC8: 15050100) ──────────
wbd_url = (
    "https://hydro.nationalmap.gov/arcgis/rest/services/"
    "wbd/MapServer/4/query"
    "?where=huc8%3D%2715050100%27"
    "&outFields=huc8,name"
    "&outSR=4326&f=geojson"
)
r = requests.get(wbd_url, timeout=30)
features = r.json().get("features", [])
if features:
    geom = json.dumps(features[0]["geometry"])
    name = features[0]["properties"].get("name", "Queen Creek")
    cur.execute("""
        UPDATE place_geo
        SET boundary = ST_GeomFromGeoJSON(%s),
            boundary_source = 'usgs_wbd',
            boundary_updated = CURRENT_DATE
        WHERE name = 'Queen Creek Watershed'
    """, (geom,))
    print(f"Queen Creek ({name}): updated")
else:
    print("Queen Creek: no features returned")

conn.commit()
cur.close()
conn.close()
print("Done.")
