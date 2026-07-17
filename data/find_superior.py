import requests

# Search across layers 0-6 for Superior, AZ
for layer in range(7):
    url = (
        f"https://tigerweb.geo.census.gov/arcgis/rest/services/"
        f"TIGERweb/Places_CouSub_ConCity_SubMCD/MapServer/{layer}/query"
        f"?where=NAME+LIKE+%27Superior%27+AND+STATE%3D%2704%27"
        f"&outFields=NAME,GEOID,STATE&returnGeometry=false&f=json"
    )
    r = requests.get(url, timeout=30)
    data = r.json()
    count = len(data.get("features", []))
    if count > 0:
        print(f"Layer {layer}: {count} feature(s) found")
        for f in data["features"]:
            print(f"  {f['attributes']}")
    else:
        print(f"Layer {layer}: 0")
