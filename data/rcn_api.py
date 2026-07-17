from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg2, json, os

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

def get_conn():
    return psycopg2.connect(host="localhost", port=5432, dbname="rcn_geo", user="postgres", password="rcn")

def build_features(rows):
    """Convert DB rows to GeoJSON features, expanding mineral_deposit sites into individual points."""
    features = []
    for row in rows:
        name, place_type, state, area_mi2, boundary_source, geometry, site_data = row
        if site_data and "sites" in site_data:
            for site in site_data["sites"]:
                features.append({
                    "type": "Feature",
                    "geometry": {"type": "Point", "coordinates": [site["lon"], site["lat"]]},
                    "properties": {
                        "name": site["name"],
                        "dev_stat": site.get("dev_stat", site.get("subtitle", "")),
                        "place_type": place_type,
                        "state": state,
                        "area_mi2": None,
                        "boundary_source": boundary_source
                    }
                })
        else:
            features.append({
                "type": "Feature",
                "geometry": geometry,
                "properties": {
                    "name": name,
                    "place_type": place_type,
                    "state": state,
                    "area_mi2": float(area_mi2) if area_mi2 else None,
                    "boundary_source": boundary_source
                }
            })
    return features

@app.get("/places")
def all_places():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("""
        SELECT name, place_type, state,
               ROUND((ST_Area(boundary::geography)/2589988.11)::numeric, 2) AS area_mi2,
               boundary_source,
               ST_AsGeoJSON(boundary)::json AS geometry,
               site_data
        FROM place_geo
        WHERE boundary IS NOT NULL
    """)
    features = build_features(cur.fetchall())
    cur.close()
    conn.close()
    return {"type": "FeatureCollection", "features": features}

@app.get("/ndc/{name}")
def ndc_boundaries(name: str):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("""
        SELECT p.name, p.place_type, p.state,
               ROUND((ST_Area(p.boundary::geography)/1e6)::numeric, 2) AS area_mi2,
               p.boundary_source,
               ST_AsGeoJSON(p.boundary)::json AS geometry,
               p.site_data
        FROM place_geo p
        WHERE p.state = (SELECT state FROM place_geo WHERE name = %s)
          AND p.boundary IS NOT NULL
    """, (name,))
    rows = cur.fetchall()
    # Mark the NDC itself for special styling
    features = []
    for row in rows:
        pname, place_type, state, area_mi2, boundary_source, geometry, site_data = row
        if site_data and "sites" in site_data:
            for site in site_data["sites"]:
                features.append({
                    "type": "Feature",
                    "geometry": {"type": "Point", "coordinates": [site["lon"], site["lat"]]},
                    "properties": {
                        "name": site["name"],
                        "dev_stat": site.get("dev_stat", site.get("subtitle", "")),
                        "place_type": place_type,
                        "state": state,
                        "area_mi2": None,
                        "boundary_source": boundary_source,
                        "is_ndc": False
                    }
                })
        else:
            features.append({
                "type": "Feature",
                "geometry": geometry,
                "properties": {
                    "name": pname,
                    "place_type": place_type,
                    "state": state,
                    "area_mi2": float(area_mi2) if area_mi2 else None,
                    "boundary_source": boundary_source,
                    "is_ndc": pname == name
                }
            })
    cur.close()
    conn.close()
    return {"type": "FeatureCollection", "features": features}

@app.get("/ndcs")
def ndc_points():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("""
        SELECT name, place_type, state, street_address, city, postal_code,
               ST_AsGeoJSON(location)::json AS point
        FROM place_geo
        WHERE place_type = 'ndc_zone'
    """)
    features = []
    for row in cur.fetchall():
        name, place_type, state, street, city, postal, point = row
        features.append({
            "type": "Feature",
            "geometry": point,
            "properties": {
                "name": name,
                "state": state,
                "address": f"{street}, {city}, {state} {postal}"
            }
        })
    cur.close()
    conn.close()
    return {"type": "FeatureCollection", "features": features}

@app.get("/issue-data/{key}")
def issue_data(key: str):
    """Serve issue-polygon JSON data files from tools/issue-data/."""
    tools_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "tools", "issue-data")
    path = os.path.join(tools_dir, f"{key}.json")
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail=f"Issue '{key}' not found")
    with open(path) as f:
        return json.load(f)
