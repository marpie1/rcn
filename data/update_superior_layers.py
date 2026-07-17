#!/usr/bin/env python3
"""
Updates for Leo's NDC (Superior, AZ):
  1. Add site_data JSONB column to place_geo
  2. Rename "Gila River Watershed" → "Middle Gila Watershed" (HUC6 150501, local to Superior)
  3. Add "Lower Gila Watershed" (HUC4 1507 — extends from the Florence/Coolidge area to Yuma)
  4. Store individual copper deposit names in site_data (for per-point popups)
"""
import requests, json, psycopg2
from xml.etree import ElementTree as ET

conn = psycopg2.connect(host="localhost", port=5432, dbname="rcn_geo", user="postgres", password="rcn")
cur = conn.cursor()

# ── 1. Add site_data JSONB column if missing ──────────────────────────
cur.execute("""
    ALTER TABLE place_geo
    ADD COLUMN IF NOT EXISTS site_data JSONB
""")
print("site_data column: ready")

# ── 2. Rename Middle Gila to clarify it's the local watershed ─────────
cur.execute("""
    UPDATE place_geo SET name = 'Middle Gila Watershed'
    WHERE name = 'Gila River Watershed' AND state = 'AZ'
""")
print(f"Renamed Gila River Watershed → Middle Gila Watershed ({cur.rowcount} row)")

# ── 3. Lower Gila Watershed (HUC4 1507, reaches Yuma) ─────────────────
cur.execute("SELECT 1 FROM place_geo WHERE name='Lower Gila Watershed' AND state='AZ'")
if not cur.fetchone():
    cur.execute("INSERT INTO place_geo (name, place_type, state) VALUES ('Lower Gila Watershed','ecological_zone','AZ')")
    print("Inserted: Lower Gila Watershed")
else:
    print("Already exists: Lower Gila Watershed")

url_lower = (
    "https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer/2/query"
    "?where=huc4%3D%271507%27&outFields=huc4,name&outSR=4326&f=geojson"
)
r = requests.get(url_lower, timeout=30)
feats = r.json().get("features", [])
if feats:
    geom = json.dumps(feats[0]["geometry"])
    cur.execute("""
        UPDATE place_geo
        SET boundary = ST_GeomFromGeoJSON(%s),
            boundary_source = 'usgs_wbd',
            boundary_updated = CURRENT_DATE
        WHERE name = 'Lower Gila Watershed' AND state = 'AZ'
    """, (geom,))
    print(f"  Boundary set: Lower Gila Watershed ({feats[0]['properties']['name']})")
else:
    print("  ERROR: Lower Gila HUC4 1507 not returned")

# ── 4. Copper deposit names → site_data ───────────────────────────────
# Re-fetch deposits in ~30mi radius of Superior, filter Cu, store names
print("\n── Copper deposit names ──")
BBOX = "-111.63,32.84,-110.55,33.74"
mrds_url = (
    f"https://mrdata.usgs.gov/services/wfs/mrds"
    f"?service=WFS&version=1.0.0&request=GetFeature&typeName=mrds&BBOX={BBOX}"
)
r = requests.get(mrds_url, timeout=60)
root = ET.fromstring(r.content)
ns = {"ms": "http://mapserver.gis.umn.edu/mapserver", "gml": "http://www.opengis.net/gml"}

sites = []
for fm in root.findall("gml:featureMember", ns):
    rec = fm.find("ms:mrds", ns)
    if rec is None:
        continue
    codes = rec.findtext("ms:code_list", "", ns)
    if "CU" not in codes.upper():
        continue
    name = rec.findtext("ms:site_name", "", ns)
    dev_stat = rec.findtext("ms:dev_stat", "", ns)
    pt = rec.find(".//gml:Point/gml:coordinates", ns)
    if pt is None:
        continue
    lon, lat = map(float, pt.text.strip().split(","))
    sites.append({"name": name, "dev_stat": dev_stat, "lon": lon, "lat": lat})

print(f"  {len(sites)} copper sites found")
site_data_json = json.dumps({"sites": sites})
cur.execute("""
    UPDATE place_geo
    SET site_data = %s
    WHERE name = 'Copper Deposits' AND state = 'AZ'
""", (site_data_json,))
print(f"  site_data stored ({cur.rowcount} row updated)")

conn.commit()
cur.close()
conn.close()
print("\nDone.")
