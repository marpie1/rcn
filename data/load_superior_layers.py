#!/usr/bin/env python3
"""
Add to Leo's NDC (Superior, AZ):
  - Pinal County jurisdiction (Census TIGER)
  - Middle Gila Watershed / Gila River Watershed (USGS WBD HUC6 150501)
  - Copper deposits within ~30 mi of Superior (USGS MRDS, WFS GML2)
"""
import requests, json, psycopg2
from xml.etree import ElementTree as ET

conn = psycopg2.connect(host="localhost", port=5432, dbname="rcn_geo", user="postgres", password="rcn")
cur = conn.cursor()

# ── helpers ────────────────────────────────────────────────────────────
def upsert(name, place_type, state):
    cur.execute("SELECT 1 FROM place_geo WHERE name=%s AND state=%s", (name, state))
    if not cur.fetchone():
        cur.execute(
            "INSERT INTO place_geo (name, place_type, state) VALUES (%s,%s,%s)",
            (name, place_type, state)
        )
        print(f"  Inserted: {name}")
    else:
        print(f"  Already exists: {name}")

def set_boundary(name, state, geojson_str, source):
    cur.execute("""
        UPDATE place_geo
        SET boundary = ST_GeomFromGeoJSON(%s),
            boundary_source = %s,
            boundary_updated = CURRENT_DATE
        WHERE name=%s AND state=%s
    """, (geojson_str, source, name, state))
    print(f"  Boundary set: {name} ({source})")

# ── 1. Pinal County (Census TIGER) ─────────────────────────────────────
print("\n── Pinal County ──")
upsert("Pinal County", "admin_boundary", "AZ")

tiger_url = (
    "https://tigerweb.geo.census.gov/arcgis/rest/services/"
    "TIGERweb/State_County/MapServer/11/query"
    "?where=STATE%3D%2704%27+AND+COUNTY%3D%27021%27"
    "&outFields=NAME,GEOID&outSR=4326&f=geojson"
)
r = requests.get(tiger_url, timeout=30)
feats = r.json().get("features", [])
if feats:
    geom = json.dumps(feats[0]["geometry"])
    set_boundary("Pinal County", "AZ", geom, "census_tiger")
else:
    print("  ERROR: no features returned from TIGER")

# ── 2. Middle Gila Watershed (USGS WBD HUC6 150501) ───────────────────
print("\n── Gila River Watershed (Middle Gila, HUC6 150501) ──")
upsert("Gila River Watershed", "ecological_zone", "AZ")

wbd_url = (
    "https://hydro.nationalmap.gov/arcgis/rest/services/"
    "wbd/MapServer/3/query"
    "?where=huc6%3D%27150501%27"
    "&outFields=huc6,name&outSR=4326&f=geojson"
)
r = requests.get(wbd_url, timeout=30)
feats = r.json().get("features", [])
if feats:
    geom = json.dumps(feats[0]["geometry"])
    set_boundary("Gila River Watershed", "AZ", geom, "usgs_wbd")
else:
    print("  ERROR: no features returned from WBD")

# ── 3. Copper deposits ~30 mi around Superior, AZ (USGS MRDS WFS) ─────
# Superior, AZ: 33.2937 N, -111.0948 W
# ~30 mi ≈ 0.45° lat / 0.54° lon
print("\n── Copper Deposits near Superior, AZ (USGS MRDS) ──")
upsert("Copper Deposits", "mineral_deposit", "AZ")

BBOX = "-111.63,32.84,-110.55,33.74"  # ~30 mi radius around Superior
mrds_url = (
    f"https://mrdata.usgs.gov/services/wfs/mrds"
    f"?service=WFS&version=1.0.0&request=GetFeature&typeName=mrds&BBOX={BBOX}"
)
r = requests.get(mrds_url, timeout=60)
root = ET.fromstring(r.content)
ns = {"ms": "http://mapserver.gis.umn.edu/mapserver", "gml": "http://www.opengis.net/gml"}

points = []
names = []
for fm in root.findall("gml:featureMember", ns):
    rec = fm.find("ms:mrds", ns)
    if rec is None:
        continue
    codes = rec.findtext("ms:code_list", "", ns)
    if "CU" not in codes.upper():
        continue
    site = rec.findtext("ms:site_name", "", ns)
    pt = rec.find(".//gml:Point/gml:coordinates", ns)
    if pt is None:
        continue
    lon, lat = map(float, pt.text.strip().split(","))
    points.append([lon, lat])
    names.append(site)

print(f"  {len(points)} copper deposits found in bbox")

if points:
    multipoint = {"type": "MultiPoint", "coordinates": points}
    set_boundary("Copper Deposits", "AZ", json.dumps(multipoint), "usgs_mrds")
    print(f"  Deposit names sample: {names[:5]}")
else:
    print("  ERROR: no copper deposits found")

conn.commit()
cur.close()
conn.close()
print("\nDone.")
