# Issue Polygon Map — GeoJSON schema

Verified against `tools/issue-polygon-map.html` at commit `5d1c70c`,
2026-07-25. Derived from `loadFromGeoJSON()` (line ~1091) and `exportData()`
(line ~1017).

`tools/issue-polygon-map.html` is the only copy of this tool. There is an
abandoned version in `~/Downloads` — never edit that one.

## Format

A standard GeoJSON `FeatureCollection`. Features are discriminated by
`properties.type`, not by geometry:

| `properties.type` | Geometry | Import | Export |
|---|---|---|---|
| `Parcel` | `Point` | **yes** | yes |
| `CustomIssuePolygon` | `Polygon` | **yes** | yes |
| `IssuePolygon` | `Polygon` | **NO — silently ignored** | yes |

Anything else in `features` is skipped without comment.

```json
{
  "type": "FeatureCollection",
  "features": [
    { "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-92.374, 30.214] },
      "properties": {
        "type": "Parcel",
        "id": "APN-12345",
        "label": "512 Railroad Ave",
        "stance": "pro",
        "lot_size_acres": 0.18,
        "zoning": "R-1",
        "hoa": false,
        "qualifies_hb2325": true,
        "desired_flock": 6,
        "notes": "",
        "ndc": false
      }
    }
  ]
}
```

## Coordinate order — the classic trap

GeoJSON is **`[longitude, latitude]`**. Leaflet is `[lat, lng]`. The tool
converts on both sides (`const [lng, lat] = f.geometry.coordinates`). Write
GeoJSON order. Getting this backwards puts Louisiana in Somalia and produces no
error.

Polygon `coordinates` is an **array of rings**; the outer ring is
`coordinates[0]`. The tool reads only the outer ring.

## Parcel properties

| Property | Type | Default on import | Notes |
|---|---|---|---|
| `id` | string | auto `…IMP-N` | Supply real APNs where you have them |
| `label` | string | `"Imported Parcel"` | |
| `stance` | `pro` \| `con` \| `unknown` | `"unknown"` | See below |
| `lot_size_acres` | number \| null | `null` | Read into the internal field `lot_size` |
| `zoning` | string | `"R-1"` | Free string, not an enum |
| `hoa` | boolean | `false` | |
| `qualifies_hb2325` | boolean \| null | `null` | |
| `desired_flock` | number \| null | `null` | |
| `notes` | string | `""` | |
| `ndc` | boolean | `false` | Whether the parcel is an NDC |

### `stance` is `pro` / `con` / `unknown`

From `stanceColor = { pro: '#1a7a4a', con: '#c0392b', unknown: '#8090b0' }`.
Not `support`/`oppose`, not `for`/`against`. An unrecognised value falls through
to the `unknown` colour and looks like a deliberate "unknown" — silent, and
wrong in a way that misrepresents someone's position. **Default to `unknown`
rather than guessing a stance from indirect evidence.**

## Round trip — all three feature types survive (fixed 2026-07-26)

`loadFromGeoJSON()` handles `Parcel`, `CustomIssuePolygon` **and**
`IssuePolygon`. All three survive an export→import cycle.

This section used to warn that the issue boundary was silently dropped, which
was true until 2026-07-26. The fix holds the incoming `IssuePolygon` in a
`pendingIssue` variable and applies it after the feature loop, so it can't be
overwritten by whatever order the features arrive in. If you read an older copy
of this doc, ignore the warning.

`CustomIssuePolygon` still takes a `label`, which becomes the polygon's name.

## Deep links

The tool supports URL parameters, useful for handing someone a specific view:

- `?issue=<key>` — load `issue-data/<key>.json`, resolved **relative to the
  page**, so the same link works under sofi-proxy (`/tools/`), on a static
  host, and from `file://`
- `?data=<base>` — override that base, e.g. a published FedWiki asset folder
- `?parcel=<id>` — open with that parcel's popup
- `?lat=<n>&lng=<n>&zoom=<n>` — open at a location

Every popup has a **Copy link** control that builds these.

`?issue=` was broken until 2026-07-26 — it fetched a hardcoded
`http://127.0.0.1:8000/issue-data/<key>` (wrong port, missing `/tools/`, no
`.json`), so it always threw and fell through to the landing page. If you are
told "the deep link doesn't work", check the tool's date before believing it.

## Editing a drawn polygon

A `CustomIssuePolygon` can be reshaped after it is closed: its popup has
**✎ Edit shape** — drag a corner, click a hollow midpoint dot to insert one,
right-click a corner to remove it (minimum 3). Each change is undoable
separately. Before 2026-07-26 the only options were rename and delete, so
fixing one corner meant redrawing the whole shape.

## Choosing this tool

Use it when the unit of analysis is a **property** and the question is spatial —
who is next to whom, what falls inside a boundary, how a proposed rule lands
parcel by parcel. It is one of the no-consent-needed instruments: everything in
it is public record, so it can be pre-populated before anyone has agreed to
anything.

Stance is the exception. Public record gives you parcels, zoning, and lot size.
It does not give you what a household thinks. Leave `stance: "unknown"` unless
someone has actually said, and put the source in `notes`.

## Pre-flight

No validator yet. Check by hand:

- `[lng, lat]` order, not `[lat, lng]`
- every feature has `properties.type`
- `stance` is one of `pro` / `con` / `unknown`
- polygon `coordinates` is an array of rings, and the ring closes (first point
  repeated as last)
