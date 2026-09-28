#!/usr/bin/env python3
"""
load_coops.py — the Whatcom co-ops map layer into the substrate, as one graph.

WHY THIS EXISTS. The co-ops were researched as an RCN Map issue file
(tools/issue-data/whatcom-wa--cooperatives.json): 22 organisations, each with a
kind, a location and a contact block, and 21 sourced ties between them. The Map
draws them, the Graph Tool lays them out, the Timeline dates them. Loading them
here gives the Table tool the same rows, so one dataset reads four ways.

THE MODEL. Same Option-C vocabulary as load_rcn_geo.py and load_whatcom.py:
  - each co-op is a `:Concept:Coop` merged on its name, `kind:'Coop'`, with
    `lat`/`long` as strings so geo_projection places it
  - the kind of co-op (worker, consumer, …) is a column, `type`, not a label —
    one table of 22 rows reads better than six tables of three
  - every tie is a structural `[:REL {label:…}]`; `label` is the link kind
    ("Member of the network"), `detail` the sentence, `notes` the source
  - `sources` is ['whatcom-coops-map'] so provenance works as elsewhere

Its own database, `whatcomcoops`, so it never mixes with the 2017 survey in
`whatcom`. The issue file is the source of truth: re-run this after editing it.

    python3 substrate/load_coops.py
"""
import json, os
from db import run, BASE

DB = 'whatcomcoops'
SRC = os.path.join(BASE, 'tools', 'issue-data', 'whatcom-wa--cooperatives.json')

# Year each organisation began (as a co-op, where it converted). From the notes.
FOUNDED = {'cc': '2014', 'c2c': '2003', 'a1': '2017', 'bbb': '2004', 'cma': '2023',
           'col': '2009', 'cmc': '2023', 'tyl': '2017', 'cab': '2023', 'cdn': '2016',
           'cfc': '1970', 'icu': '1941', 'nccu': '1939', 'wecu': '1936',
           'wecu2': '1952', 'rei': '1938', 'ncm': '2016', 'dari': '1918',
           'psfh': '2016'}


def canon(name):
    return ' '.join(str(name).split())


def ensure_db():
    names = {r['name'] for r in run('SHOW DATABASES YIELD name RETURN name',
                                    database='system')}
    if DB not in names:
        run(f'CREATE DATABASE {DB} WAIT', database='system')
        print(f'created database "{DB}"')


def build():
    data = json.load(open(SRC, encoding='utf-8'))
    types, kinds = data.get('types', {}), data.get('linkKinds', {})
    ensure_db()
    run('MATCH (n) DETACH DELETE n', database=DB)
    run('CREATE CONSTRAINT coops_concept IF NOT EXISTS FOR (c:Concept) '
        'REQUIRE c.schemaLabel IS UNIQUE', database=DB)

    key = {}
    for p in data['parcels']:
        c = p.get('contact') or {}
        key[p['id']] = canon(p['label'])
        run('MERGE (c:Concept:Coop {schemaLabel:$k}) '
            'SET c.variableLabel=$n, c.kind="Coop", c.sources=["whatcom-coops-map"], '
            '    c.type=$type, c.lat=$lat, c.long=$lng, c.mapId=$id, c.founded=$fd, '
            '    c.website=$web, c.phone=$ph, c.email=$em, c.address=$addr, '
            '    c.people=$ppl, c.contactCaveat=$cav, c.contactChecked=$chk, '
            '    c.contactSource=$csrc, c.inWhatcom=$inw, c.notes=$notes',
            {'k': key[p['id']], 'n': p['label'], 'id': p['id'],
             'type': (types.get(p.get('type')) or {}).get('label', ''),
             'lat': str(p['latLng'][0]), 'lng': str(p['latLng'][1]),
             'fd': FOUNDED.get(p['id'], ''),
             'web': c.get('website', ''), 'ph': c.get('phone', ''),
             'em': c.get('email', ''), 'addr': c.get('address', ''),
             'ppl': '; '.join(c.get('people', [])), 'cav': c.get('caveat', ''),
             'chk': c.get('checked', ''), 'csrc': c.get('source', ''),
             'inw': 'no' if p.get('inFrame') is False else 'yes',
             'notes': p.get('notes', '')}, database=DB)

    for l in data.get('links', []):
        run('MATCH (a:Concept {schemaLabel:$a}), (b:Concept {schemaLabel:$b}) '
            'CREATE (a)-[:REL {label:$label, kind:$kind, detail:$detail, '
            '                  notes:$notes, twoWay:$two}]->(b)',
            {'a': key[l['from']], 'b': key[l['to']],
             'label': (kinds.get(l['kind']) or {}).get('label', l['kind']),
             'kind': l['kind'], 'detail': l.get('label', ''),
             'notes': l.get('notes', ''), 'two': bool(l.get('twoWay'))}, database=DB)

    n = run('MATCH (c:Concept) RETURN count(c) AS n', database=DB)[0]['n']
    e = run('MATCH ()-[r:REL]->() RETURN count(r) AS n', database=DB)[0]['n']
    print(f'{DB}: {n} co-ops, {e} ties')


if __name__ == '__main__':
    build()
