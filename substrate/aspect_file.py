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


def layout_of(aspect):
    """schemaLabel -> (x, y) from the source file: the FIRST placement of each.

    The substrate stores no coordinates on purpose — where a node sits is a
    fact about a drawing, not about a concept. But then a drawing opened from
    the substrate came back in a synthetic ring, not the arrangement its author
    made, and any rearrangement was discarded on save. Layout has an owner: the
    file. So the projection reads it from there, and a save writes it back.
    Layout goes file -> tool -> file and never passes through Neo4j.
    """
    p = path_for(aspect)
    if not os.path.exists(p):
        return {}
    out = {}
    for n in json.load(open(p)).get('nodes', []):
        sl = ''.join((n.get('schemaLabel') or '').split())
        if sl and sl not in out and 'x' in n and 'y' in n:
            out[sl] = (n['x'], n['y'])       # first placement wins; see duplicates
    return out


def build_file(aspect, database='aspects16', positions=None):
    """The JSON this aspect's file WOULD become. Pure — writes nothing.

    `positions` maps schemaLabel -> {x, y} and comes from a canvas the person
    has just arranged. When present it overrides the stored coordinates; every
    other placement of the same concept keeps its own offset from the first, so
    a duplicate does not collapse onto its twin.
    """
    p = path_for(aspect)
    original = {}
    if os.path.exists(p):
        original = json.load(open(p))

    # schemaLabel -> the original node dict, so ids and positions survive.
    # DUPLICATION BELONGS TO THE DRAWING, NOT THE CONCEPT.
    #
    # `org` places `Effectiveness of ORG` twice and `Achievability of GOALS &
    # OBJECTIVES` twice — a layout decision, so that edges do not cross. The
    # substrate merges them by schemaLabel, which is right: it is one concept.
    # But the file owns the placement, exactly as it owns x/y and colour, so
    # writing back must restore every placement it had.
    #
    # Collapsing them silently cost `org` 8 nodes -> 6. It is also where the
    # two "self-loops" in eip-cld-subgraph-mismatches.md came from: in the file
    # `n0 --relate_with--> n1` runs between two DIFFERENT nodes that share a
    # label. Nobody drew a self-loop; merging invented it.
    by_schema = {}                       # schemaLabel -> [original nodes], in file order
    for n in original.get('nodes', []):
        sl = n.get('schemaLabel')
        if sl:
            by_schema.setdefault(''.join(sl.split()), []).append(n)
    used = {n.get('id') for n in original.get('nodes', [])}

    rows = run("""MATCH (c:Concept) WHERE $a IN c.sources
                  RETURN c.schemaLabel AS sl, c.variableLabel AS label,
                         c.w AS w, c.h AS h, c.shape AS shape
                  ORDER BY c.id""", {'a': aspect}, database=database)
    db_by_schema = {r['sl']: r for r in rows}

    # ORDER IS PART OF THE DIFF. The database has no opinion about the order of
    # a set, so returning rows in Cypher's order rewrites the whole file every
    # save — 44 insertions for a one-character change, and a diff nobody reads.
    nodes, ids_of, next_n, first_seen = [], {}, 0, {}
    for n in original.get('nodes', []):          # every original placement, in order
        sl = ''.join((n.get('schemaLabel') or '').split())
        r = db_by_schema.get(sl)
        if not r:
            continue                             # the concept was retracted
        node = dict(n)                           # keep id, x, y, colour, props
        node['label'] = r['label']               # the substrate owns the label
        node['schemaLabel'] = sl
        if positions and sl in positions:
            # The canvas moved this concept. Shift every placement of it by the
            # same delta, so a duplicate keeps its own offset instead of
            # stacking on top of its twin.
            base = first_seen.get(sl)
            if base is None:
                first_seen[sl] = (n.get('x', 0), n.get('y', 0))
                base = first_seen[sl]
            dx = n.get('x', 0) - base[0]
            dy = n.get('y', 0) - base[1]
            node['x'] = round(positions[sl].get('x', n.get('x', 0)) + dx)
            node['y'] = round(positions[sl].get('y', n.get('y', 0)) + dy)
        ids_of.setdefault(sl, []).append(node['id'])
        nodes.append(node)
    for r in rows:                               # concepts the file did not have
        if r['sl'] in ids_of:
            continue
        while f'n{next_n}' in used:
            next_n += 1
        nid = f'n{next_n}'
        used.add(nid)
        nodes.append({'id': nid, 'label': r['label'], 'x': 200, 'y': 200,
                      'w': r['w'] or 110, 'h': r['h'] or 60,
                      'shape': r['shape'] or 'ellipse', 'color': '#93c5fd',
                      'fontColor': '#000000', 'props': {}, 'fontSize': 12,
                      'extraLabels': [r['sl']], 'schemaLabel': r['sl']})
        ids_of[r['sl']] = [nid]
    first_of = {sl: v[0] for sl, v in ids_of.items()}

    id_schema = {n['id']: n['schemaLabel'] for n in nodes}
    used_e = {e.get('id') for e in original.get('edges', [])}

    erows = run("""MATCH (s:Concept)-[r:REL]->(t:Concept) WHERE $a IN r.sources
                   RETURN s.schemaLabel AS src, t.schemaLabel AS tgt,
                          r.label AS label, r.polarity AS polarity,
                          r.linkFamily AS linkFamily
                   ORDER BY r.id""", {'a': aspect}, database=database)

    # Which ORIGINAL edge does each substrate edge correspond to? Keyed on the
    # schema pair plus the verb, because that is all the substrate knows. When
    # a drawing has several placements, several original edges can share that
    # key — so keep them as a queue and hand them out in file order. That is
    # what routes `Org -> Org` back to `n0 --> n1` rather than to a self-loop.
    from collections import defaultdict, deque
    pending = defaultdict(deque)
    for i, e in enumerate(original.get('edges', [])):
        k = (id_schema.get(e.get('src')), id_schema.get(e.get('tgt')), e.get('label', ''))
        pending[k].append((i, e))

    ordered = []
    for r in erows:
        k = (r['src'], r['tgt'], r['label'] or '')
        while pending[k]:
            ordered.append((pending[k].popleft(), r))      # one per original edge
            if not pending[k]:
                break
        else:
            ordered.append((None, r))                       # newly added in the tool
    ordered.sort(key=lambda p: p[0][0] if p[0] else 10 ** 6)

    edges, next_e = [], 0
    for prev_pair, r in ordered:
        prev = prev_pair[1] if prev_pair else None
        s = prev['src'] if prev else first_of.get(r['src'])
        t = prev['tgt'] if prev else first_of.get(r['tgt'])
        if not s or not t:
            continue
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


def write_file(aspect, database='aspects16', positions=None):
    """Write it, and report what actually changed."""
    p = path_for(aspect)
    before = open(p).read() if os.path.exists(p) else ''
    data = build_file(aspect, database, positions)
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
