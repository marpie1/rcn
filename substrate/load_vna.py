#!/usr/bin/env python3
"""
load_vna.py — the value-network and action-situation drawings, into the substrate.

    python3 substrate/load_vna.py --verify

WHY THIS EXISTS. `load_iad.py` used to read tools/*.json directly, which meant
the IAD "lens" was a parallel copy standing next to the substrate rather than a
view onto it. The claim "tools become lenses on one graph" was aspirational for
that layer. This loader closes the gap: the drawings land in the substrate in
the substrate's own vocabulary, and load_iad.py then queries them.

VOCABULARY. Straight Option C, no new shapes:
  (:Concept:<IADElement>)  a role, participant, resource or outcome.
                           schemaLabel is the merge key, exactly as elsewhere.
  [:REL]                   a deliverable moving between them. STRUCTURAL, so it
                           attaches to concepts and not to states — "the CHW
                           delivers trust to the household" is true however that
                           trust is measured, which is the existing test for
                           which end an edge hangs from.
  (:Aspect {kind:'drawing'})  one per drawing, carrying the action-situation
                           facts: iadLevel, whether it spans levels, method.

MERGING, AND WHY IT IS REPORTED. The substrate merges on schemaLabel and records
multiple sources as evidence rather than resolving them. That is right for
BADGE ISSUANCE, which really is one arena drawn in two files. It is wrong for the
teach chain's placeholder participants A, B and C, which are anonymous stand-ins
that happen to share a letter. Both cases are merged and then PRINTED, because a
merge nobody sees is the failure mode this whole design exists to avoid. Fix the
wrong ones by giving the placeholders distinct labels — a data question, not a
schema one.
"""
import json, os, sys, glob, argparse
from collections import defaultdict
from db import run, BASE

DB = 'vna'
SRC = os.path.join(BASE, 'tools', '*.json')
ELEMENTS = ('position', 'participant', 'resource', 'outcome')
LABEL = {'position': 'Position', 'participant': 'Participant',
         'resource': 'Resource', 'outcome': 'Outcome'}
LEVELS = ('operational', 'collective-choice', 'constitutional', 'unspecified')


def drawings():
    out = []
    for path in sorted(glob.glob(SRC)):
        try:
            g = json.load(open(path))
        except Exception:
            continue
        if not isinstance(g, dict) or not isinstance(g.get('nodes'), list):
            continue
        if (g.get('graphAttrs') or {}).get('method') in ('vna', 'nas'):
            out.append((path, g))
    return out


def ensure_db():
    names = {r['name'] for r in run('SHOW DATABASES YIELD name RETURN name',
                                    database='system')}
    if DB not in names:
        run(f'CREATE DATABASE {DB} WAIT', database='system')
        print(f'created database "{DB}"')


def norm(s):
    return ' '.join(str(s).split())


def build():
    ensure_db()
    run('MATCH (n) DETACH DELETE n', database=DB)
    run('CREATE CONSTRAINT vna_concept IF NOT EXISTS FOR (c:Concept) '
        'REQUIRE c.schemaLabel IS UNIQUE', database=DB)

    files = drawings()
    if not files:
        sys.exit('no drawing declares graphAttrs.method vna or nas')

    node_src = defaultdict(list)     # schemaLabel -> [slug]
    edge_src = defaultdict(list)     # (s,t,label) -> [slug]
    rows = []

    for path, g in files:
        slug = os.path.basename(path).replace('.rcn.json', '').replace('.json', '')
        method = (g.get('graphAttrs') or {}).get('method')
        level = (g.get('graphAttrs') or {}).get('iadLevel', 'unspecified')
        if level not in LEVELS:
            level = 'unspecified'

        elem_of, lvl_of = {}, {}
        for r in g.get('legendEntries', []):
            if r.get('kind') == 'edge':
                if r.get('iadLevel') in LEVELS:
                    lvl_of[r['id']] = r['iadLevel']
            else:
                e = r.get('iadElement', 'position')
                elem_of[r['id']] = e if e in ELEMENTS else 'position'

        nodes = [n for n in g.get('nodes', []) if n.get('type') and elem_of.get(n['type'])]
        byid = {}
        for n in nodes:
            sl = norm(n.get('label') or n['id'])
            elem = elem_of[n['type']]
            byid[n['id']] = sl
            node_src[sl].append(slug)
            run(f'MERGE (c:Concept {{schemaLabel:$sl}}) '
                f'SET c:{LABEL[elem]}, c.iadElement=$elem, c.mode=$mode, '
                f'    c.sources = coalesce(c.sources,[]) + $slug, '
                f'    c.w=112, c.h=54, c.shape="rect"',
                {'sl': sl, 'elem': elem, 'mode': method.upper(), 'slug': slug},
                database=DB)

        levels_seen, n_edges = set(), 0
        for e in g.get('edges', []):
            if e['src'] not in byid or e['tgt'] not in byid:
                continue
            props = e.get('props') or {}
            lv = lvl_of.get(e.get('type'))
            if lv:
                levels_seen.add(lv)
            lbl = norm(e.get('label') or '(unnamed)')
            edge_src[(byid[e['src']], byid[e['tgt']], lbl)].append(slug)
            run('MATCH (s:Concept {schemaLabel:$s}), (t:Concept {schemaLabel:$t}) '
                'MERGE (s)-[r:REL {label:$lbl}]->(t) '
                'SET r.mode=$mode, r.linkFamily="Provision", '
                '    r.valueKind=$vk, r.evidence=$ev, r.iadLevel=$lv, '
                '    r.drawing=$slug, '
                '    r.sources = coalesce(r.sources,[]) + $slug',
                {'s': byid[e['src']], 't': byid[e['tgt']], 'lbl': lbl,
                 'mode': method.upper(), 'vk': props.get('valueKind'),
                 'ev': props.get('evidence'), 'lv': lv or level, 'slug': slug},
                database=DB)
            n_edges += 1

        run('MERGE (a:Aspect {name:$slug}) '
            'SET a.kind="drawing", a.title=$title, a.method=$method, '
            '    a.iadLevel=$level, a.levelsPresent=$lv, a.spansLevels=$sp, '
            '    a.file=$file',
            {'slug': slug, 'title': g.get('modelName') or slug, 'method': method,
             'level': level, 'lv': sorted(levels_seen),
             'sp': len(levels_seen) > 1,
             'file': os.path.relpath(path, BASE)}, database=DB)
        rows.append((slug, method, level, len(nodes), n_edges))

    return rows, node_src, edge_src


def report(rows, node_src, edge_src):
    for slug, method, level, nn, ne in rows:
        print('loaded %-34s %-4s %-18s %2d elements, %2d deliverables'
              % (slug, method, level, nn, ne))

    merged_n = {k: v for k, v in node_src.items() if len(set(v)) > 1}
    merged_e = {k: v for k, v in edge_src.items() if len(set(v)) > 1}
    print('\nMERGES — every one of these is a claim that two drawings mean the same thing.')
    if not merged_n and not merged_e:
        print('  none')
    for k, v in sorted(merged_n.items()):
        flag = '   <-- placeholder? check this one' if len(k) <= 2 else ''
        print('  concept  %-24s %s%s' % (k, ' + '.join(sorted(set(v))), flag))
    for k, v in sorted(merged_e.items()):
        print('  edge     %-24s %s' % (k[0] + ' -> ' + k[1], ' + '.join(sorted(set(v)))))


def verify():
    print('\n--- what the substrate now holds ---')
    for r in run('MATCH (c:Concept) RETURN c.iadElement AS e, count(*) AS n '
                 'ORDER BY n DESC', database=DB):
        print('  %-14s %d' % (r['e'], r['n']))
    r = run('MATCH ()-[d:REL]->() RETURN count(d) AS n', database=DB)[0]
    a = run('MATCH (a:Aspect {kind:"drawing"}) RETURN count(a) AS n', database=DB)[0]
    print('  %-14s %d' % ('deliverables', r['n']))
    print('  %-14s %d' % ('drawings', a['n']))
    print('\n  gold concepts (drawn in more than one drawing):')
    for r in run('MATCH (c:Concept) WHERE size(c.sources) > 1 '
                 'RETURN c.schemaLabel AS l, c.sources AS s ORDER BY l', database=DB):
        print('    %-24s %s' % (r['l'], ', '.join(r['s'])))


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--verify', action='store_true')
    a = ap.parse_args()
    rows, ns, es = build()
    report(rows, ns, es)
    if a.verify:
        verify()
