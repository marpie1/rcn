import requests
import psycopg2
import json

conn = psycopg2.connect(
    host="localhost", port=5432,
    dbname="rcn_geo", user="postgres", password="rcn"
)
cur = conn.cursor()

# ── 1. Lansing city boundary from Nominatim ───────────────────────────
r = requests.get(
    "https://nominatim.openstreetmap.org/search"
    "?city=Lansing&state=Michigan&country=USA"
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
          'Lansing', 'admin_boundary', 'Lansing', 'MI', '48912',
          ST_SetSRID(ST_MakePoint(-84.5555, 42.7325), 4326),
          ST_GeomFromGeoJSON(%s),
          'openstreetmap_nominatim', CURRENT_DATE
        )
    """, (geom,))
    print(f"Lansing: inserted ({len(features[0]['geometry']['coordinates'][0])} vertices)")
else:
    print("Lansing: no features returned")

# ── 2. The Fledge NDC point ───────────────────────────────────────────
cur.execute("""
    INSERT INTO place_geo
      (name, place_type, street_address, city, state, postal_code,
       location, boundary_source)
    VALUES (
      'The Fledge', 'ndc_zone', '1300 Eureka St', 'Lansing', 'MI', '48912',
      ST_SetSRID(ST_MakePoint(-84.5389, 42.7411), 4326),
      'authored'
    )
""")
print("The Fledge: inserted")

# ── 3. Upper Grand River watershed (HUC8: 04050004) ──────────────────
r = requests.get(
    "https://hydro.nationalmap.gov/arcgis/rest/services/"
    "wbd/MapServer/4/query"
    "?where=huc8%3D%2704050004%27"
    "&outFields=huc8,name&outSR=4326&f=geojson",
    timeout=30
