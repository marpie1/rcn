#!/usr/bin/env python3
"""
Add Carter Center Library NDC and Atlanta GA layers:
  - Carter Center Library (ndc_zone)
  - Atlanta city boundary (Census TIGER)
  - Upper Chattahoochee Watershed (HUC8 03130001) — Lake Lanier, Atlanta's main water supply
  - Upper Ocmulgee Watershed (HUC8 03070103) — eastern Atlanta / Carter Center drainage basin
"""
import requests, psycopg2, json

conn = psycopg2.connect(host="localhost", port=5432, dbname="rcn_geo", user="postgres", password="rcn")
cur = conn.cursor()

def upsert(name, place_type, state, street=None, city=None, postal=None):
    cur.execute("SELECT 1 FROM place_geo WHERE name=%s AND state=%s", (name, state))
    if not cur.fetchone():
        cur.execute(
            "INSERT INTO place_geo (name, place_type, state, street_address, city, postal_code) VALUES (%s,%s,%s,%s,%s,%s)",
            (name, place_type, state, street, city, postal)
        )
        print(f"  Inserted: {name}")
    else:
        print(f"  Already exists: {name}")

def set_location(name, state, lon, lat):
    cur.execute("""
        UPDATE place_geo SET location = ST_SetSRID(ST_MakePoint(%s,%s),4326)
        WHERE name=%s AND state=%s
    """, (lon, lat, name, state))
    print(f"  Location set: {name} ({lat:.4f}, {lon:.4f})")

def set_boundary(name, state, geojson_str, source):
    cur.execute("""
        UPDATE place_geo
        SET boundary = ST_GeomFromGeoJSON(%s),
            boundary_source = %s,
            boundary_updated = CURRENT_DATE
        WHERE name=%s AND state=%s
    """, (geojson_str, source, name, state))
    print(f"  Boundary set: {name} ({source})")

# ── 1. Carter Center Library (NDC) ────────────────────────────────────
print("\n── Carter Center Library (NDC) ──")
upsert("Carter Center Library", "ndc_zone", "GA",
       street="453 Freedom Parkway NE", city="Atlanta", postal="30307")
set_location("Carter Center Library", "GA", -84.3587, 33.7678)

# ── 2. Atlanta city boundary (Census TIGER places, GA FIPS=13) ────────
print("\n── Atlanta city boundary ──")
upsert("Atlanta", "admin_boundary", "GA")

tiger_url = (
    "https://tigerweb.geo.census.gov/arcgis/rest/services/"
    "TIGERweb/Places_CouSub_ConCity_SubMCD/MapServer/4/query"
    "?where=STATE%3D%2713%27+AND+NAME%3D%27Atlanta%27"
    "&outFields=NAME,GEOID&outSR=4326&f=geojson"
)
r = requests.get(tiger_url, timeout=30)
feats = r.json().get("features", [])
if feats:
    geom = json.dumps(feats[0]["geometry"])
    set_boundary("Atlanta", "GA", geom, "census_tiger")
else:
    print("  ERROR: Atlanta not returned from TIGER")

# ── 3. Upper Chattahoochee Watershed (HUC8 03130001) ─────────────────
# Contains Lake Sidney Lanier — Atlanta's primary drinking water reservoir
print("\n── Upper Chattahoochee Watershed (HUC8 03130001) ──")
upsert("Upper Chattahoochee Watershed", "ecological_zone", "GA")

wbd_url = (
    "https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer/4/query"
    "?where=huc8%3D%2703130001%27&outFields=huc8,name&outSR=4326&f=geojson"
)
r = requests.get(wbd_url, timeout=30)
feats = r.json().get("features", [])
if feats:
    geom = json.dumps(feats[0]["geometry"])
    set_boundary("Upper Chattahoochee Watershed", "GA", geom, "usgs_wbd")
    print(f"  WBD name: {feats[0]['properties']['name']}")
else:
    print("  ERROR: Upper Chattahoochee not returned from WBD")

# ── 4. Upper Ocmulgee Watershed (HUC8 03070103) ───────────────────────
# Eastern Atlanta / Carter Center drainage basin
print("\n── Upper Ocmulgee Watershed (HUC8 03070103) ──")
upsert("Upper Ocmulgee Watershed", "ecological_zone", "GA")

wbd_url2 = (
    "https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer/4/query"
    "?where=huc8%3D%2703070103%27&outFields=huc8,name&outSR=4326&f=geojson"
)
r = requests.get(wbd_url2, timeout=30)
feats = r.json().get("features", [])
if feats:
    geom = json.dumps(feats[0]["geometry"])
    set_boundary("Upper Ocmulgee Watershed", "GA", geom, "usgs_wbd")
    print(f"  WBD name: {feats[0]['properties']['name']}")
else:
    print("  ERROR: Upper Ocmulgee not returned from WBD")

conn.commit()
cur.close()
conn.close()
print("\nDone.")
