#!/usr/bin/env python3
"""
aspect_file.py — write a drawing from the substrate back to its source file.

Closes the loop. `tools/eip-aspects-variabilized/*.json` stays canonical, so
git keeps the history of a governance-grade artifact, while the tool round trip
stays real:

    graph-tool ← /projection/subgraph/role → edit → "→ Substrate"
                                                      ├─ PUT   the database
                                                      └─ POST  the file

Without this, a fix made in the tool lives only in Neo4j and the next
`load_aspects.py` silently reverts it — two answers to one question, which is
the failure this whole substrate exists to end, not to introduce.

MINIMAL DIFFS ARE THE POINT. The file is read before it is written, and the
original node ids, coordinates, colours and untouched props are preserved for
every concept still present. A save that only changed one polarity produces a
one-line diff. If every save churned x/y, `git diff` would stop being readable
and nobody would review these files — which would cost more than the round trip
is worth.
"""
import json, os, glob
from db import run

ASPECT_DIR = None   # set by api.py / callers via configure()


def configure(base):
    global ASPECT_DIR
    ASPECT_DIR = os.path.join(base, 'tools', 'eip-aspects-variabilized')


def path_for(aspect):
    return os.path.join(ASPECT_DIR, f'{aspect}.json')


def build_file(aspect, database='aspects16'):
    """The JSON this aspect's file WOULD become. Pure — writes nothing."""
    p = path_for(aspect)
    original = {}
    if os.path.exists(p):
        original = json.load(open(p))

    # schemaLabel -> the original node dict, so ids and positions survive.
    by_schema = {}
    for n in original.get('nodes', []):
        sl = n.get('schemaLabel')
        if sl:
            by_schema[''.join(sl.split())] = n
    used = {n.get('id') for n in original.get('nodes', [])}

    rows = run("""MATCH (c:Concept) WHERE $a IN c.sources
                  RETURN c.schemaLabel AS sl, c.variableLabel AS label,
                         c.w AS w, c.h AS h, c.shape AS shape
                  ORDER BY c.id""", {'a': aspect}, database=database)

    # ORDER IS PART OF THE DIFF. The database has no opinion about the order of
    # a set, so returning rows in Cypher's order rewrites the whole file every
    # save — 44 insertions for a one-character change, and a diff nobody reads.
    # Keep the file's own order for concepts it already had; append the rest.
    order = {sl: i for i, sl in enumerate(by_schema)}
    rows.sort(key=lambda r: (order.get(r['sl'], len(order)), r['sl']))

    nodes, id_of, next_n = [], {}, 0
    for r in rows:
        sl = r['sl']
        prev = by_schema.get(sl)
        if prev:
            node = dict(prev)                    # keep id, x, y, colour, props
            node['label'] = r['label']           # the substrate owns the label
        else:
            while f'n{next_n}' in used:
                next_n += 1
            nid = f'n{next_n}'
            used.add(nid)
            node = {'id': nid, 'label': r['label'], 'x': 200, 'y': 200,
                    'w': r['w'] or 110, 'h': r['h'] or 60,
                    'shape': r['shape'] or 'ellipse', 'color': '#93c5fd',
                    'fontColor': '#000000', 'props': {}, 'fontSize': 12,
                    'extraLabels': [sl], 'schemaLabel': sl}
        node['schemaLabel'] = sl
        id_of[sl] = node['id']
        nodes.append(node)

    prev_edges = {}
    for e in original.get('edges', []):
        prev_edges[(e.get('src'), e.get('tgt'), e.get('label', ''))] = e
    used_e = {e.get('id') for e in original.get('edges', [])}

    erows = run("""MATCH (s:Concept)-[r:REL]->(t:Concept) WHERE $a IN r.sources
                   RETURN s.schemaLabel AS src, t.schemaLabel AS tgt,
                          r.label AS label, r.polarity AS polarity,
                          r.linkFamily AS linkFamily
                   ORDER BY r.id""", {'a': aspect}, database=database)

    eorder = {k: i for i, k in enumerate(prev_edges)}
    erows.sort(key=lambda r: (eorder.get(
        (id_of.get(r['src']), id_of.get(r['tgt']), r['label'] or ''),
        len(eorder)), r['label'] or ''))

    edges, next_e = [], 0
    for r in erows:
        s, t = id_of.get(r['src']), id_of.get(r['tgt'])
        if not s or not t:
            continue
        prev = prev_edges.get((s, t, r['label'] or ''))
        if prev:
            edge = dict(prev)
        else:
            while f'e{next_e}' in used_e:
                next_e += 1
            eid = f'e{next_e}'
            used_e.add(eid)
            edge = {'id': eid, 'src': s, 'tgt': t, 'label': r['label'] or '',
                    'props': {}, 'color': '#444444', 'width': 1.5,
                    'fontSize': 10, 'curved': False, 'delay': False}
        edge['src'], edge['tgt'] = s, t
        edge['label'] = r['label'] or ''
        edge['polarity'] = r['polarity'] or 'none'
        # linkFamily is a substrate concept; carry it in props so a file
        # round-tripped through the tools does not lose it.
        if r['linkFamily']:
            edge.setdefault('props', {})['linkFamily'] = r['linkFamily']
        edges.append(edge)

    out = dict(original) if original else {}
    out.setdefault('version', '1.0')
    out.setdefault('modelName', aspect.replace('-', ' ').title())
    out.setdefault('canvasBg', '#f9f9f7')
    out.setdefault('graphAttrs', {})
    out['nodes'] = nodes
    out['edges'] = edges
    return out


def write_file(aspect, database='aspects16'):
    """Write it, and report what actually changed."""
    p = path_for(aspect)
    before = open(p).read() if os.path.exists(p) else ''
    data = build_file(aspect, database)
    after = json.dumps(data, indent=2, ensure_ascii=False) + '\n'
    changed = before != after
    if changed:
        with open(p, 'w') as fh:
            fh.write(after)
    ob = json.loads(before) if before.strip() else {'nodes': [], 'edges': []}
    return {
        'aspect': aspect,
        'path': os.path.relpath(p, os.path.dirname(ASPECT_DIR).rsplit('/tools', 1)[0]),
        'changed': changed,
        'nodes': len(data['nodes']), 'edges': len(data['edges']),
        'nodesBefore': len(ob.get('nodes', [])), 'edgesBefore': len(ob.get('edges', [])),
        'polarityChanges': _polarity_delta(ob, data),
    }


def _polarity_delta(before, after):
    """The change most worth naming back to a person: which signs moved."""
    prev = {(e.get('src'), e.get('tgt'), e.get('label', '')): e.get('polarity', 'none')
            for e in before.get('edges', [])}
    out = []
    for e in after.get('edges', []):
        k = (e.get('src'), e.get('tgt'), e.get('label', ''))
        old = prev.get(k)
        if old is not None and old != e.get('polarity'):
            out.append({'edge': e.get('label') or e.get('id'),
                        'from': old, 'to': e.get('polarity')})
    return out
