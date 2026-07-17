import requests
import psycopg2
import json

conn = psycopg2.connect(
    host="localhost", port=5432,
    dbname="rcn_geo", user="postgres", password="rcn"
)
cur = conn.cursor()

# ── 1. Austin city boundary from Nominatim ────────────────────────────
print("Loading Austin city boundary...")
r = requests.get(
    "https://nominatim.openstreetmap.org/search"
    "?city=Austin&state=Texas&country=USA"
    "&format=geojson&polygon_geojson=1&limit=1",
    timeout=30, headers={"User-Agent": "RCN-GIS/1.0"}
)
features = r.json().get("features", [])
if features:
    geom = json.dumps(features[0]["geometry"])
    cur.execute("""
        INSERT INTO place_geo
          (name, place_type, city, state, postal_code,
           location, boundary, boundary_source, boundary_updated)
        VALUES (
          'Austin', 'admin_boundary', 'Austin', 'TX', '78724',
          ST_SetSRID(ST_MakePoint(-97.7431, 30.2672), 4326),
          ST_GeomFromGeoJSON(%s),
          'openstreetmap_nominatim', CURRENT_DATE
        )
        ON CONFLICT DO NOTHING
    """, (geom,))
    print(f"  Austin: inserted ({len(str(geom))} chars of geometry)")
else:
    print("  Austin: no features returned")

# ── 2. Bastrop city boundary from Nominatim ───────────────────────────
print("Loading Bastrop city boundary...")
r = requests.get(
    "https://nominatim.openstreetmap.org/search"
    "?city=Bastrop&state=Texas&country=USA"
    "&format=geojson&polygon_geojson=1&limit=1",
    timeout=30, headers={"User-Agent": "RCN-GIS/1.0"}
)
features = r.json().get("features", [])
if features:
    geom = json.dumps(features[0]["geometry"])
    cur.execute("""
        INSERT INTO place_geo
          (name, place_type, city, state, postal_code,
           location, boundary, boundary_source, boundary_updated)
        VALUES (
          'Bastrop', 'admin_boundary', 'Bastrop', 'TX', '78602',
          ST_SetSRID(ST_MakePoint(-97.3148, 30.1107), 4326),
          ST_GeomFromGeoJSON(%s),
          'openstreetmap_nominatim', CURRENT_DATE
        )
        ON CONFLICT DO NOTHING
    """, (geom,))
    print(f"  Bastrop: inserted")
else:
    print("  Bastrop: no features returned")

# ── 3. Green Gate Farms NDC — East Austin location ────────────────────
print("Loading Green Gate Farms (East Austin)...")
cur.execute("""
    INSERT INTO place_geo
      (name, place_type, street_address, city, state, postal_code,
       location, boundary_source)
    VALUES (
      'Green Gate Farms', 'ndc_zone',
      '8254 Canoga Ave', 'Austin', 'TX', '78724',
      ST_SetSRID(ST_MakePoint(-97.6502, 30.3215), 4326),
      'authored'
    )
    ON CONFLICT DO NOTHING
""")
print("  Green Gate Farms (East Austin): inserted")

# ── 4. Green Gate Farms — Bastrop location ────────────────────────────
print("Loading Green Gate Farms (Bastrop)...")
cur.execute("""
    INSERT INTO place_geo
      (name, place_type, street_address, city, state, postal_code,
       location, boundary_source)
    VALUES (
      'Green Gate Farms Bastrop', 'ndc_zone',
      '156 Howard Lane', 'Bastrop', 'TX', '78602',
      ST_SetSRID(ST_MakePoint(-97.3148, 30.1107), 4326),
      'authored'
    )
    ON CONFLICT DO NOTHING
""")
print("  Green Gate Farms (Bastrop): inserted")

# ── 5. Lower Colorado watershed (HUC8: 12090205) ─────────────────────
print("Loading Lower Colorado watershed...")
r = requests.get(
    "https://hydro.nationalmap.gov/arcgis/rest/services/"
    "wbd/MapServer/4/query"
    "?where=huc8%3D%2712090205%27"
    "&outFields=huc8,name&outSR=4326&f=geojson",
    timeout=30
)
data = r.json()
features = data.get("features", [])
if features:
    geom = json.dumps(features[0]["geometry"])
    name = features[0].get("properties", {}).get("name", "Lower Colorado Watershed")
    cur.execute("""
        INSERT INTO place_geo
          (name, place_type, state,
           location, boundary, boundary_source, boundary_updated)
        VALUES (
          %s, 'ecological_zone', 'TX',
          ST_SetSRID(ST_MakePoint(-97.7, 30.2), 4326),
          ST_GeomFromGeoJSON(%s),
          'usgs_wbd_huc8', CURRENT_DATE
        )
        ON CONFLICT DO NOTHING
    """, (name, geom))
    print(f"  Lower Colorado watershed: inserted ({name})")
else:
    print("  Lower Colorado watershed: no features — trying alternate HUC...")
    # Try adjacent HUC if first fails
    r2 = requests.get(
        "https://hydro.nationalmap.gov/arcgis/rest/services/"
        "wbd/MapServer/4/query"
        "?where=huc8+LIKE+%271209020%25%27"
        "&outFields=huc8,name&outSR=4326&f=geojson",
        timeout=30
    )
    data2 = r2.json()
    features2 = data2.get("features", [])
    print(f"  Alternate query returned {len(features2)} features:")
    for f in features2[:5]:
        print(f"    {f['properties'].get('huc8')} — {f['properties'].get('name')}")

# ── 6. Bastrop County boundary ────────────────────────────────────────
print("Loading Bastrop County boundary...")
r = requests.get(
    "https://nominatim.openstreetmap.org/search"
    "?county=Bastrop&state=Texas&country=USA"
    "&format=geojson&polygon_geojson=1&limit=1",
    timeout=30, headers={"User-Agent": "RCN-GIS/1.0"}
)
features = r.json().get("features", [])
if features:
    geom = json.dumps(features[0]["geometry"])
    cur.execute("""
        INSERT INTO place_geo
          (name, place_type, state,
           location, boundary, boundary_source, boundary_updated)
        VALUES (
          'Bastrop County', 'admin_boundary', 'TX',
          ST_SetSRID(ST_MakePoint(-97.3148, 30.1107), 4326),
          ST_GeomFromGeoJSON(%s),
          'openstreetmap_nominatim', CURRENT_DATE
        )
        ON CONFLICT DO NOTHING
    """, (geom,))
    print("  Bastrop County: inserted")
else:
    print("  Bastrop County: no features returned")

conn.commit()
cur.close()
conn.close()
print("\nDone. Run the dump commands to export updated GeoJSON.")
