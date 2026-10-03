#!/usr/bin/env python3
"""
load_sc_directory.py — Sustainable Connections' local businesses into the substrate.

WHY THIS EXISTS. The Local Business Directory was built as an RCN Map issue
(tools/issue-data/whatcom-wa--sustainable-connections-directory.json) by
tools/sc-directory/build.py: 266 businesses at 282 map points, each with a kind,
a location, contacts, and — where one was found — the year it began. Loading it
here gives the Table tool the same rows, so the Map, Timeline and Table read one
dataset (tools/sc-directory.set.json).

THE MODEL. Same vocabulary as load_coops.py:
  - each map point is a `:Concept:Business` merged on its label, `kind:'Business'`,
    `mapId` = the map point id (the shared id the ⇄ switcher carries)
  - section, category and location are columns, not labels: one table of 282
    rows reads better than nine tables
  - `started` / `startedYear` / `startedSource` come from the CSV the build writes
  - no ties: a directory has none

Its own database, `scdirectory`. The build's CSV is the source: re-run this
after rebuilding, then export:

    python3 substrate/load_sc_directory.py
    python3 substrate/export.py scdirectory --prefix sc-directory-export
"""
import csv, os
from db import run, BASE

DB = 'scdirectory'
SRC = os.path.join(BASE, 'tools', 'sc-directory', 'sc-directory.csv')


def ensure_db():
    names = {r['name'] for r in run('SHOW DATABASES YIELD name RETURN name', database='system')}
    if DB not in names:
        run(f'CREATE DATABASE {DB} WAIT', database='system')
        print(f'created database "{DB}"')


def build():
    rows = list(csv.DictReader(l for l in open(SRC, encoding='utf-8') if not l.startswith('#')))
    ensure_db()
    run('MATCH (n) DETACH DELETE n', database=DB)
    run('CREATE CONSTRAINT scdir_concept IF NOT EXISTS FOR (c:Concept) '
        'REQUIRE c.schemaLabel IS UNIQUE', database=DB)
    multi = {}
    for r in rows: multi[r['name']] = multi.get(r['name'], 0) + 1
    seen = {}
    for r in rows:
        seen[r['name']] = seen.get(r['name'], 0) + 1
        label = r['name'] + (f" ({seen[r['name']]} of {multi[r['name']]})" if multi[r['name']] > 1 else '')
        run('MERGE (c:Concept:Business {schemaLabel:$k}) '
            'SET c.variableLabel=$k, c.business=$name, c.kind="Business", '
            '    c.sources=["sustainable-connections-directory"], c.mapId=$id, '
            '    c.section=$section, c.category=$cat, c.location=$loc, '
            '    c.directoryNeighbourhood=$hood, c.address=$addr, c.placedBy=$prec, '
            '    c.lat=$lat, c.long=$lng, c.started=$st, c.startedYear=$sty, '
            '    c.startedPrecision=$stp, c.startedSource=$sts, c.startedNote=$stn, '
            '    c.website=$web, c.phone=$ph, c.email=$em, c.ownership=$own, '
            '    c.sustainingMember=$sus, c.practices=$prac, c.salesMethods=$sales, '
            '    c.directoryUrl=$url, c.addressSource=$asrc',
            {'k': label, 'name': r['name'], 'id': r['id'], 'section': r['section'],
             'cat': r['categories'], 'loc': r['location_group'],
             'hood': r['directory_neighbourhood'], 'addr': r['address'],
             'prec': 'street address' if r['precision'] == 'street' else 'neighbourhood only',
             'lat': r['lat'], 'lng': r['lng'], 'st': r['started'],
             'sty': int(r['started_year']) if r['started_year'] else None,
             'stp': r['started_precision'], 'sts': r['started_source'], 'stn': r['started_note'],
             'web': r['website'], 'ph': r['phone'], 'em': r['email'], 'own': r['ownership'],
             'sus': r['sustaining_member'], 'prac': r['sustainable_practices'],
             'sales': r['sales_methods'], 'url': r['directory_url'],
             'asrc': r['address_source']}, database=DB)
    n = run('MATCH (c:Concept) RETURN count(c) AS n', database=DB)[0]['n']
    print(f'{DB}: {n} business locations')


if __name__ == '__main__':
    build()
