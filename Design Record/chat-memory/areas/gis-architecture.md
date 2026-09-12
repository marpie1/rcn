---
name: gis-architecture
description: Neo4j / PostGIS GIS architecture — hybrid spatial+graph stack; read for schema, loaded boundaries, and servers
sources: [backfill]
aliases: [Neo4j, PostGIS, GIS architecture]
---
- [stated] Hybrid: Neo4j for graph relationships, PostGIS (Docker) for authoritative spatial operations
- [stated] `place_geo` table with geography(Point) and geometry(Geometry) columns
- [stated] NDC boundaries loaded (Superior AZ, Lansing MI, Maple Falls WA)
- [stated] FastAPI server (`rcn_api.py`) and Leaflet map (`rcn_map.html`) built
- [stated] CONTAINS/OVERLAPS relationships mirrored to Neo4j
