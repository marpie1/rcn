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

## Known round-trip loss

`exportData()` writes the main issue polygon as `type: "IssuePolygon"`.
`loadFromGeoJSON()` handles only `Parcel` and `CustomIssuePolygon` — so **the
issue polygon does not survive an export→import cycle.** Export, re-import, and
the boundary that defines the issue is gone; parcels and any custom drawn
polygon come back.

This is the same class of bug as the Graph Tool's dropped `meta`: structurally
valid, no error, silent loss. Until it is fixed, treat the exported GeoJSON as a
**parcel** file, and keep the issue polygon definition somewhere else. If you
need a boundary to round-trip today, author it as `CustomIssuePolygon`, which
does import — it also takes a `label`, which becomes the polygon's name.

## Deep links

The tool supports URL parameters, useful for handing someone a specific view:

- `?parcel=<id>` — open with that parcel's popup
- `?lat=<n>&lng=<n>&zoom=<n>` — open at a location

Every popup has a **Copy link** control that builds these.

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
