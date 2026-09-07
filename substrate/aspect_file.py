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
BASE_DIR = None

# WHICH FILES BACK WHICH DATABASE. The file leg used to be hardcoded to the
# aspects directory while the database leg honoured ?db=, so a write-back of a
# `vna` drawing put its file into tools/eip-aspects-variabilized/ — where
# load_aspects.py globs it and would ingest it as a 17th aspect. The two legs
# have to agree on where a drawing came from, or "both stores move together"
# moves the wrong store. A database with no entry here has no file leg: the
# write is refused rather than guessed at.
# The suffix matters as much as the directory: the vna drawings are named
# `<slug>.rcn.json`, and load_vna.py strips that whole tail to get the slug. A
# path built as `<slug>.json` would create a SECOND file beside the real one —
# and since load_vna globs tools/*.json, which matches .rcn.json too, the same
# drawing would then load twice.
SRC_DIRS = {
    'aspects16': (('tools', 'eip-aspects-variabilized'), '.json'),
    'vna':       (('tools',),                            '.rcn.json'),
}


def configure(base):
    global ASPECT_DIR, BASE_DIR
    BASE_DIR = base
    ASPECT_DIR = os.path.join(base, 'tools', 'eip-aspects-variabilized')


# HOW A FILE NODE IS MATCHED TO A CONCEPT — and it is not one rule.
#
# aspects16 keys concepts spacelessly, because families.js says so: "sources
# disagree about the spaces", and one aspect writes `Active Goal` where another
# writes `ActiveGoal`. load_vna.py keys on the label with its whitespace merely
# normalised, spaces intact — `MEMBER HOUSEHOLD` stays two words. The two
# loaders made different, defensible choices, so a single key function here can
# only be right for one of them.
#
# It was right for aspects16. For vna every file node carries schemaLabel:null
# and its identity is the label, so every node missed, every concept was
# re-synthesised with a fresh `n0…` id, and the edges — matched by a different
# route — kept the file's own ids. Nodes and edges then named their endpoints
# in two different namespaces, and a write-back asserted zero edges.
#
# So the key function belongs beside the source directory: one entry per
# database, naming the convention its loader actually used.
def _key_spaceless(node):
    return ''.join((node.get('schemaLabel') or '').split())


def _key_label(node):
    raw = node.get('schemaLabel') or node.get('label') or ''
    return ' '.join(str(raw).split())


KEY_FNS = {'aspects16': _key_spaceless, 'vna': _key_label}

# Whether a file node the substrate does not know is a RETRACTION or an
# ANNOTATION. In aspects16 every node is a concept, so a node with no concept
# behind it has been retracted and should go. A vna drawing also carries
# headers and notes the substrate was never told about — dropping those on
# write-back deletes the author's commentary, so they are kept.
KEEP_UNMATCHED = {'vna'}


def key_fn(database):
    return KEY_FNS.get(database, _key_spaceless)


def dir_for(database):
    entry = SRC_DIRS.get(database)
    return os.path.join(BASE_DIR, *entry[0]) if entry else None


def path_for(aspect, database='aspects16'):
    entry = SRC_DIRS.get(database)
    if not entry:
        return None
    return os.path.join(BASE_DIR, *entry[0], f'{aspect}{entry[1]}')


def layout_of(aspect, database='aspects16'):
    """schemaLabel -> (x, y) from the source file: the FIRST placement of each.

    The substrate stores no coordinates on purpose — where a node sits is a
    fact about a drawing, not about a concept. But then a drawing opened from
    the substrate came back in a synthetic ring, not the arrangement its author
    made, and any rearrangement was discarded on save. Layout has an owner: the
    file. So the projection reads it from there, and a save writes it back.
    Layout goes file -> tool -> file and never passes through Neo4j.
    """
    p = path_for(aspect, database)
    if not p or not os.path.exists(p):
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
    p = path_for(aspect, database)
    original = {}
    if p and os.path.exists(p):
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
    key = key_fn(database)
    by_schema = {}                       # schemaLabel -> [original nodes], in file order
    for n in original.get('nodes', []):
        sl = key(n)
        if sl:
            by_schema.setdefault(sl, []).append(n)
    used = {n.get('id') for n in original.get('nodes', [])}

    rows = run("""MATCH (c:Concept) WHERE $a IN c.sources
                  OPTIONAL MATCH (c)-[:HAS_STATE]->(v:Variable)
                  RETURN c.schemaLabel AS sl, c.variableLabel AS label,
                         collect(v.label) AS states,
                         c.w AS w, c.h AS h, c.shape AS shape, c.id AS cid
                  ORDER BY cid""", {'a': aspect}, database=database)
    db_by_schema = {r['sl']: r for r in rows}

    # ORDER IS PART OF THE DIFF. The database has no opinion about the order of
    # a set, so returning rows in Cypher's order rewrites the whole file every
    # save — 44 insertions for a one-character change, and a diff nobody reads.
    nodes, ids_of, next_n, first_seen = [], {}, 0, {}
    for n in original.get('nodes', []):          # every original placement, in order
        sl = key(n)
        r = db_by_schema.get(sl)
        if not r:
            if database in KEEP_UNMATCHED:
                # Downstream code indexes every node by schemaLabel, and an
                # annotation has none — carry an empty one so it is present
                # in the file and matches no concept.
                keep = dict(n)
                keep.setdefault('schemaLabel', None)
                if keep['schemaLabel'] is None:
                    keep['schemaLabel'] = ''
                # MARKED, with the house convention for a machine-owned prop:
                # a leading underscore. isDisplayKey() in graph-tool-v22.html
                # treats those as not-data — dataPropKeys() keeps them out of
                # Cypher and CSV export, and the tooltip renders them faded.
                # load_aspects.py already reads props._schemaLabel this way.
                #
                # A flag is needed because nothing else survives the trip. The
                # absence of a schemaLabel would be the honest signal — these
                # nodes have none — but the tool derives what it sends as
                # `schemaLabel || props.schemaLabel || label`, so a header
                # arrives at put_subgraph wearing its own caption as a key and
                # is indistinguishable from a role. Deriving it server-side
                # fails too: put_subgraph retracts before it re-asserts, so a
                # match-only write finds nothing to match.
                keep['props'] = dict(keep.get('props') or {})
                keep['props']['_annotation'] = 'true'
                nodes.append(keep)               # annotation, not a retraction
            continue                             # the concept was retracted
        node = dict(n)                           # keep id, x, y, colour, props
        # THE SUBSTRATE OWNS THE LABEL — BUT A CONCEPT HAS SEVERAL.
        # Blindly assigning c.variableLabel is what turned "Negative AFFECT"
        # into "Positive AFFECT". If this node's own wording is still one of
        # the concept's states, it stays. If the concept has exactly one state,
        # that is a rename and it is applied. Otherwise the file's wording is
        # left alone, because nothing here can tell which state was meant.
        states = [x for x in (r.get('states') or []) if x]
        mine = (n.get('label') or '').strip()
        if mine in states:
            node['label'] = mine
        elif len(states) == 1:
            node['label'] = states[0]
        elif not states and r['label']:
            node['label'] = r['label']
        # If the substrate has no label either — vna concepts carry no
        # variableLabel — the file's wording stands. Assigning None here is
        # what emptied every node caption on a vna read.
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
    # state -> a file node carrying it, so a NEW edge attaches to the right
    # placement rather than to whichever node shares the schema label.
    by_state = {}
    for n in nodes:
        by_state.setdefault((n.get('label') or '').strip(), n['id'])

    id_schema = {n['id']: n['schemaLabel'] for n in nodes}
    id_state = {n['id']: (n.get('label') or '').strip() for n in nodes}
    used_e = {e.get('id') for e in original.get('edges', [])}

    # Causal edges attach to :Variable, structural ones to :Concept. A drawing
    # contains both, so both come back — and each reports the STATES it runs
    # between, which is what routes an edge to the right one of two placements.
    erows = run("""MATCH (sv:Variable)-[r:REL]->(tv:Variable) WHERE $a IN r.sources
                   MATCH (sc:Concept)-[:HAS_STATE]->(sv)
                   MATCH (tc:Concept)-[:HAS_STATE]->(tv)
                   RETURN sc.schemaLabel AS src, tc.schemaLabel AS tgt,
                          sv.label AS srcState, tv.label AS tgtState,
                          r.label AS label, r.polarity AS polarity,
                          r.linkFamily AS linkFamily, r.id AS rid
                   UNION
                   MATCH (s:Concept)-[r:REL]->(t:Concept) WHERE $a IN r.sources
                   RETURN s.schemaLabel AS src, t.schemaLabel AS tgt,
                          coalesce(r.srcState, s.variableLabel, s.schemaLabel) AS srcState,
                          coalesce(r.tgtState, t.variableLabel, t.schemaLabel) AS tgtState,
                          r.label AS label, r.polarity AS polarity,
                          r.linkFamily AS linkFamily, r.id AS rid
                   """, {'a': aspect}, database=database)
    erows.sort(key=lambda r: r['rid'] or '')

    # Which ORIGINAL edge does each substrate edge correspond to? Keyed on the
    # schema pair plus the verb, because that is all the substrate knows. When
    # a drawing has several placements, several original edges can share that
    # key — so keep them as a queue and hand them out in file order. That is
    # what routes `Org -> Org` back to `n0 --> n1` rather than to a self-loop.
    from collections import defaultdict, deque
    pending = defaultdict(deque)
    for i, e in enumerate(original.get('edges', [])):
        k = (id_state.get(e.get('src')), id_state.get(e.get('tgt')), e.get('label', ''))
        pending[k].append((i, e))

    ordered = []
    for r in erows:
        k = (r['srcState'], r['tgtState'], r['label'] or '')
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
        s = prev['src'] if prev else (by_state.get(r['srcState']) or first_of.get(r['src']))
        t = prev['tgt'] if prev else (by_state.get(r['tgtState']) or first_of.get(r['tgt']))
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
    # DO NOT INVENT A schemaLabel THE FILE NEVER HAD. It is set above so every
    # node can be indexed by one while this runs, and for aspects16 it is also
    # the author's data. A vna drawing carries none — its identity is the label,
    # and load_vna.py derives the key at load time — so writing one back changed
    # all nine nodes on a round trip that changed nothing.
    had = {n.get('id') for n in original.get('nodes', []) if n.get('schemaLabel')}
    out['nodes'] = [{k: v for k, v in n.items()
                     if not (k == 'schemaLabel' and not v)
                     and not (k == 'schemaLabel' and n.get('id') not in had
                              and database in KEEP_UNMATCHED)}
                    for n in nodes]
    out['edges'] = edges
    return out


def write_file(aspect, database='aspects16', positions=None):
    """Write it, and report what actually changed."""
    p = path_for(aspect, database)
    if not p:
        return {'aspect': aspect, 'changed': False, 'skipped': True,
                'reason': f'database {database!r} has no source directory '
                          f'(see SRC_DIRS) — database written, file leg skipped'}
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
        'path': os.path.relpath(p, BASE_DIR),
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
