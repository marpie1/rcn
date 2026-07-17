#!/usr/bin/env python3
"""
Load churches (places of worship) in Superior, AZ from OpenStreetMap Overpass API
into the rcn_geo database as place_type='church', state='AZ'.
Individual church records stored in site_data for per-point popups.
"""
import requests, json, psycopg2

conn = psycopg2.connect(host="localhost", port=5432, dbname="rcn_geo", user="postgres", password="rcn")
cur = conn.cursor()

# ── Query Overpass for places of worship in Superior, AZ ──────────────────
# Superior, AZ bounding box (generous ~3 mi around town center)
print("Querying Overpass API for churches in Superior, AZ...")

overpass_url = "https://overpass-api.de/api/interpreter"
# Use a bounding box: south, west, north, east
overpass_query = """
[out:json][timeout:30];
(
  node["amenity"="place_of_worship"](33.22,-111.16,33.35,-110.99);
  way["amenity"="place_of_worship"](33.22,-111.16,33.35,-110.99);
  relation["amenity"="place_of_worship"](33.22,-111.16,33.35,-110.99);
);
out center;
"""

r = requests.post(overpass_url, data={"data": overpass_query},
                  headers={"User-Agent": "RCN-GIS/1.0"}, timeout=40)
r.raise_for_status()
elements = r.json().get("elements", [])
print(f"  Overpass returned {len(elements)} elements")

sites = []
for el in elements:
    tags = el.get("tags", {})
    name = tags.get("name", "Unnamed Church")

    # Get coordinates — nodes have lat/lon; ways/relations have center
    if el["type"] == "node":
        lat, lon = el["lat"], el["lon"]
    else:
        center = el.get("center", {})
        if not center:
            print(f"  Skipping {name} (no center point)")
            continue
        lat, lon = center["lat"], center["lon"]

    denomination = tags.get("denomination", tags.get("religion", ""))
    addr_parts = [
        tags.get("addr:housenumber", ""),
        tags.get("addr:street", ""),
    ]
    address = " ".join(p for p in addr_parts if p).strip()

    subtitle = denomination or address or ""

    sites.append({
        "name": name,
        "subtitle": subtitle,
        "denomination": denomination,
        "address": address,
        "lon": lon,
        "lat": lat,
    })
    print(f"  + {name}" + (f" ({subtitle})" if subtitle else ""))

if not sites:
    print("ERROR: No churches found. Check bounding box or Overpass query.")
    cur.close()
    conn.close()
    exit(1)

print(f"\n{len(sites)} churches found total")

# ── Upsert row in place_geo ───────────────────────────────────────────────
cur.execute("SELECT 1 FROM place_geo WHERE name='Churches' AND state='AZ'")
if not cur.fetchone():
    cur.execute(
        "INSERT INTO place_geo (name, place_type, state) VALUES ('Churches','church','AZ')"
    )
    print("Inserted: Churches row")
else:
    print("Already exists: Churches row — updating")

# Build MultiPoint boundary
multipoint = {
    "type": "MultiPoint",
    "coordinates": [[s["lon"], s["lat"]] for s in sites]
}
site_data = {"sites": sites}

cur.execute("""
    UPDATE place_geo
    SET boundary       = ST_GeomFromGeoJSON(%s),
        boundary_source = 'openstreetmap_overpass',
        boundary_updated = CURRENT_DATE,
        site_data      = %s
    WHERE name = 'Churches' AND state = 'AZ'
""", (json.dumps(multipoint), json.dumps(site_data)))
print(f"Boundary + site_data stored ({cur.rowcount} row updated)")

conn.commit()
cur.close()
conn.close()
print("\nDone. Run the API server and reload Leo's NDC view to see churches.")
