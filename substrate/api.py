#!/usr/bin/env python3
"""
api.py — the projection layer. Port 8768.

Each endpoint is ONE named Cypher query returning ONE lens, in the contract
shape below. The renderers stay dumb: they draw shapes from data and know
nothing about the domain. If a lens seems to need a custom renderer, the
projection is probably wrong — fix the query, not the renderer.

    python3 substrate/api.py
    open http://localhost:8768/

Stdlib only, matching sofi-proxy.py (8765) and coupler-proxy.py (8766). It also
SERVES the tools and the harness, so everything is one origin and CORS never
arises. CORS headers are set anyway, for a tool opened from somewhere else.

THE CONTRACT — every projection returns this envelope, no exceptions:

    { "nodes": [ {id, label, props:{...}, w, h, shape} ],
      "edges": [ {id, src, tgt, label, polarity, props:{...}} ] }

It is graph-tool's native schema, declared canonical so renderers read it with
zero translation. Note edges use src/tgt — never from/to. A projection returns
only the fields its lens needs, but always in this envelope. No adapters.
"""
import json, math, os, sys, posixpath
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs, unquote

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from db import run, BASE, DATABASE
import aspect_file
aspect_file.configure(BASE)

PORT = int(os.environ.get('PORT', 8768))
# 127.0.0.1 on a laptop. Inside a container it must be 0.0.0.0 so docker's
# port publish can reach it; the network boundary is then the publish spec in
# deploy/steward/docker-compose.yml (127.0.0.1:8768), not this bind address.
HOST = os.environ.get('HOST', '127.0.0.1')

# ── the projections ───────────────────────────────────────────────────────
# One query each. Kept as literals here, not built from strings, so what runs
# is what you read.

# LAYOUT IS NOT STORED, AND MUST STILL BE EMITTED.
#
# x/y are a rendering concern — the substrate has no business holding where a
# node sits on someone's canvas. But graph-tool REQUIRES them: a node without
# x/y gets a NaN centre and paints nothing, and the file still "loads
# successfully". That is a silent failure, and it caught this build once
# already. (The brief's §5 contract omits x/y; tools/schemas/graph-tool-v22.md
# is the authority and lists them as required. Trust the schema doc.)
#
# So every projection emits a deterministic ring: same graph, same positions,
# every time. The renderer's own Dagre/Force buttons take it from there.
RING = ("round(460 + 300 * cos(6.28318530718 * i / total))",
        "round(330 + 235 * sin(6.28318530718 * i / total))")

# A concept with ONE state is named by that state — "Seriousness of PROBLEM".
# A concept with SEVERAL has no single name, so it is named by the concept:
# "Affect", not an arbitrary pick between Positive and Negative. The old
# `primary` flag chose by string length, which is the same rule that lost
# Negative AFFECT in the first place; it is gone rather than re-decorated.
LABEL = "CASE WHEN nstates > 1 THEN n.schemaLabel ELSE n.variableLabel END"

_NODE_PREAMBLE = """
MATCH (n:Concept)
WITH n ORDER BY n.id
WITH collect(n) AS ns, count(*) AS total
UNWIND range(0, total - 1) AS i
WITH ns[i] AS n, i, total
OPTIONAL MATCH (n)-[:IN_FAMILY]->(f:Family)
OPTIONAL MATCH (n)-[:HAS_STATE]->(_v:Variable)
WITH n, i, total, f, count(_v) AS nstates
"""

CAUSAL_NODES = _NODE_PREAMBLE + f"""
RETURN n.id AS id, {LABEL} AS label,
       {RING[0]} AS x, {RING[1]} AS y,
       n.w AS w, n.h AS h, n.shape AS shape,
       f.fill AS color, f.color AS borderColor,
       {{schemaLabel:n.schemaLabel, family:f.name, mode:n.mode,
         gold: size(n.sources) > 1}} AS props
ORDER BY id
"""

# THE CAUSAL LENS NOW READS STATES. A causal claim is about measured
# quantities — "Positive AFFECT raises MOTIVATION" — so its nodes are the
# variables, not the concepts they belong to. The STRUCTURE lens keeps reading
# concepts, because "an Org exists for a Purpose" is a claim about the concepts
# however they are measured. Two lenses, two levels, both true.
VAR_NODES = """
MATCH (v:Variable)<-[:HAS_STATE]-(n:Concept)
WITH v, n ORDER BY v.id
WITH collect({v:v, n:n}) AS rows, count(*) AS total
UNWIND range(0, total - 1) AS i
WITH rows[i].v AS v, rows[i].n AS n, i, total
OPTIONAL MATCH (n)-[:IN_FAMILY]->(f:Family)
RETURN v.id AS id, v.label AS label,
       round(460 + 300 * cos(6.28318530718 * i / total)) AS x,
       round(330 + 235 * sin(6.28318530718 * i / total)) AS y,
       n.w AS w, n.h AS h, n.shape AS shape,
       f.fill AS color, f.color AS borderColor,
       {schemaLabel:n.schemaLabel, family:f.name, mode:n.mode,
        opmType:n.opmType, concept:n.id, state:v.label,
        gold: size(n.sources) > 1} AS props
ORDER BY id
"""

CAUSAL_EDGES = """
MATCH (s:Variable)-[r:REL]->(t:Variable)
RETURN r.id AS id, s.id AS src, t.id AS tgt,
       r.label AS label, r.polarity AS polarity,
       {linkFamily:r.linkFamily, magnitude:r.magnitude, rel:r.rel,
        mode:r.mode, gold: size(r.sources) > 1} AS props
ORDER BY id
"""

# Provenance. The federation lens: who drew what, and where two hands met.
GOLD_NODES = _NODE_PREAMBLE + f"""
RETURN n.id AS id, {LABEL} AS label,
       {RING[0]} AS x, {RING[1]} AS y,
       n.w AS w, n.h AS h, n.shape AS shape,
       {{sources:n.sources, gold: size(n.sources) > 1,
         family:f.name, schemaLabel:n.schemaLabel}} AS props
ORDER BY id
"""

# ── one contributor's drawing, as a filter ────────────────────────────────
# A subgraph is not stored. `WHERE $a IN c.sources` IS the subgraph. The 16
# drawings and their union are the same rows read two ways — which is the
# payoff of keeping sources as a list rather than a scalar.
SUBGRAPH_NODES = """
MATCH (v:Variable)<-[:HAS_STATE]-(n:Concept) WHERE $aspect IN v.sources
WITH v, n ORDER BY n.id, v.id
WITH collect({v:v, n:n}) AS rows, count(*) AS total
UNWIND range(0, total - 1) AS i
WITH rows[i].v AS v, rows[i].n AS n, i, total
OPTIONAL MATCH (n)-[:IN_FAMILY]->(f:Family)
RETURN v.id AS id, v.label AS label,
       round(460 + 300 * cos(6.28318530718 * i / total)) AS x,
       round(330 + 235 * sin(6.28318530718 * i / total)) AS y,
       n.w AS w, n.h AS h, n.shape AS shape,
       f.fill AS color, f.color AS borderColor, n.schemaLabel AS schemaLabel,
       {family:f.name, mode:n.mode, sources:n.sources, state:v.label,
        opmType:n.opmType, concept:n.id,
        gold: size(n.sources) > 1, shared: size(n.sources) > 1} AS props
ORDER BY id
"""

SUBGRAPH_EDGES = """
// A drawing is drawn between STATES, so both kinds of edge are returned
// between states. Causal edges already attach there. Structural edges attach to
// the concepts — that is the claim they make — but each carries the states the
// author actually drew it between, so reopening the drawing gives back the
// author\'s own strokes rather than a reconstruction.
MATCH (a:Variable)-[r:REL]->(b:Variable) WHERE $aspect IN r.sources
RETURN r.id AS id, a.id AS src, b.id AS tgt,
       r.label AS label, r.polarity AS polarity,
       {linkFamily:r.linkFamily, rel:r.rel, mode:r.mode, sources:r.sources,
        level:'state', gold: size(r.sources) > 1} AS props
UNION
MATCH (sc:Concept)-[r:REL]->(tc:Concept) WHERE $aspect IN r.sources
MATCH (sc)-[:HAS_STATE]->(a:Variable) WHERE a.label = r.srcState
MATCH (tc)-[:HAS_STATE]->(b:Variable) WHERE b.label = r.tgtState
RETURN r.id AS id, a.id AS src, b.id AS tgt,
       r.label AS label, r.polarity AS polarity,
       {linkFamily:r.linkFamily, rel:r.rel, mode:r.mode, sources:r.sources,
        level:'concept', gold: size(r.sources) > 1} AS props
"""

# Every edge label already in use, with how widely. Feeds the authoring
# suggester in graph-tool: the drift (constitute/constitutes, create/creates)
# is cheapest to stop at the moment somebody types the second spelling.
EDGE_VOCAB = """
MATCH ()-[r:REL]->() WHERE r.label <> ''
WITH r.label AS label, count(*) AS uses,
     reduce(acc = [], s IN collect(r.sources) | acc + s) AS srcs,
     collect(DISTINCT r.linkFamily) AS fams
RETURN label, uses, size([x IN srcs WHERE true]) AS witnesses,
       [f IN fams WHERE f IS NOT NULL][0] AS linkFamily
ORDER BY uses DESC, label
"""

SUBGRAPH_LIST = """
MATCH (a:Aspect)
OPTIONAL MATCH (c:Concept) WHERE a.name IN c.sources
WITH a, count(DISTINCT c) AS concepts
OPTIONAL MATCH ()-[r:REL]->() WHERE a.name IN r.sources
RETURN a.name AS name, concepts, count(r) AS edges ORDER BY name
"""

# ── the STRUCTURE lens ────────────────────────────────────────────────────
# These drawings began as entity-relationship diagrams and were variabilized
# into CLDs. The two readings often run in OPPOSITE directions, and both are
# true: an org *exists for* a purpose (structural), while coherence of purpose
# *raises* effectiveness of org (causal).
#
# The evidence that this is a rule and not an anomaly: across the 16 drawings
# an edge carries a sign IF AND ONLY IF its ERD direction and its causal
# direction agree — 46 signed and agreeing, 0 signed and disagreeing (the one
# exception was introduced by Claude Code and reverted). The unsigned edges are
# not gaps. They are the author marking a conflict rather than forcing a false
# choice.
#
# So the ERD is not lost to the CLD; it is a second lens on the same nodes.
# Polarity is deliberately emitted as 'none' here — a structural relation is
# not the kind of statement that has a sign, and drawing one would be a claim
# nobody made.
CAUSAL_FAMILIES = ['Influence', 'Transformation']

STRUCTURE_EDGES = """
MATCH (s:Concept)-[r:REL]->(t:Concept)
WHERE r.linkFamily IS NULL OR NOT r.linkFamily IN $causal
RETURN r.id AS id, s.id AS src, t.id AS tgt,
       r.label AS label, 'none' AS polarity,
       {linkFamily:r.linkFamily, unassigned: r.linkFamily IS NULL,
        rel:r.rel, mode:r.mode, gold: size(r.sources) > 1,
        alsoCausal: r.polarity <> 'none'} AS props
ORDER BY id
"""

PROJECTIONS = {
    'causal':    (VAR_NODES,    CAUSAL_EDGES),
    'structure': (CAUSAL_NODES, STRUCTURE_EDGES),
    'gold':      (GOLD_NODES,   None),
}


# ── the SCHEMA lens — the substrate describing itself ─────────────────────
# Derived from the live database rather than drawn, so it cannot go stale. It
# answers "what have we actually put in here" in the one medium this project
# trusts for that question: a picture a group can point at.
#
# Per-concept labels (:Action, :Motivation, …) are deliberately folded away.
# They are the SECOND label on a :Concept, present so the Neo4j Browser reads
# well — showing 24 of them as node types would drown the five that are real.
SCHEMA_KINDS = ['Concept', 'Variable', 'Family', 'LinkFamily', 'Aspect', 'Instance']
SCHEMA_PLACE = {                       # hand-placed: boxes read better than a ring
    'Concept':    (440, 300), 'Family':  (110, 150), 'LinkFamily': (110, 450),
    'Aspect':     (780, 150), 'Instance': (780, 450), 'Variable': (440, 560),
}
SCHEMA_COLOR = {
    'Concept':    ('#dbeafe', '#1d4ed8'), 'Family':   ('#dcfce7', '#15803d'),
    'LinkFamily': ('#fef3c7', '#b45309'), 'Aspect':   ('#f3e8ff', '#7c3aed'),
    'Instance':   ('#ffe4e6', '#be123c'), 'Variable': ('#e0e7ff', '#4338ca'),
}


def _wrap(keys, width):
    """Property names, wrapped — one long line makes the node a letterbox."""
    out, line = [], ''
    for k in keys:
        if line and len(line) + len(k) + 3 > width:
            out.append(line); line = k
        else:
            line = f"{line} · {k}" if line else k
    if line:
        out.append(line)
    return out or ['—']


def schema_projection(database=None):
    present = run("CALL db.labels() YIELD label RETURN collect(label) AS l",
                  database=database)[0]['l']
    nodes, edges = [], []
    for kind in SCHEMA_KINDS:
        if kind not in present:
            continue
        n = run(f"MATCH (x:{kind}) RETURN count(x) AS c", database=database)[0]['c']
        if not n:
            continue
        keys = run(f"MATCH (x:{kind}) UNWIND keys(x) AS k "
                   f"RETURN collect(DISTINCT k) AS ks", database=database)[0]['ks']
        keys = [k for k in sorted(keys)]
        fill, border = SCHEMA_COLOR[kind]
        x, y = SCHEMA_PLACE[kind]
        nodes.append({
            'id': kind.lower(),
            'label': f":{kind}  ×{n}\n" + "\n".join(_wrap(keys, 34)),
            'x': x, 'y': y, 'w': 260,
            'h': 46 + 15 * len(_wrap(keys, 34)),
            'shape': 'rounded', 'color': fill, 'borderColor': border,
            'borderWidth': 2.5, 'fontSize': 11, 'fontColor': '#1a1a1a',
            'props': {'count': n, 'properties': keys}})
    ids = {n['id'] for n in nodes}
    pats = run("""MATCH (a)-[r]->(b)
                  RETURN labels(a) AS al, type(r) AS rel, labels(b) AS bl,
                         count(*) AS n, collect(DISTINCT keys(r))[0] AS rkeys
                  ORDER BY n DESC""", database=database)
    # SUM per pattern. Grouping on labels(a) makes [Concept,Org] and
    # [Concept,Person] different rows, so taking the first gave ":REL (3)"
    # for 69 relationships — a count that looks plausible and is wrong.
    agg = {}
    for p in pats:
        a = next((k for k in SCHEMA_KINDS if k in p['al']), None)
        b = next((k for k in SCHEMA_KINDS if k in p['bl']), None)
        if not a or not b or a.lower() not in ids or b.lower() not in ids:
            continue
        e = agg.setdefault((a, p['rel'], b), {'n': 0, 'keys': set()})
        e['n'] += p['n']
        e['keys'].update(p['rkeys'] or [])
    for (a, rel, b), v in sorted(agg.items(), key=lambda kv: -kv[1]['n']):
        rk = " · ".join(sorted(v['keys']))
        edges.append({
            'id': f"s_{a}_{rel}_{b}".lower(),
            'src': a.lower(), 'tgt': b.lower(),
            'label': f":{rel}  ({v['n']})" + (f"\n{rk}" if rk else ''),
            'polarity': 'none', 'width': 2, 'fontSize': 10,
            'curved': a == b,
            'props': {'relType': rel, 'count': v['n'], 'properties': sorted(v['keys'])}})

    # An Aspect is NOT joined by a relationship — a drawing is named as a string
    # inside c.sources, which is what makes a subgraph a filter rather than a
    # stored thing. Drawing it as a dashed line says that out loud; leaving
    # Aspect as an unconnected island would look like an oversight.
    for kind, prop, colour, note in [
            ('aspect', 'c.sources', '#7c3aed',
             'WHERE $aspect IN c.sources IS the subgraph — no relationship needed'),
            ('linkfamily', 'r.linkFamily', '#b45309',
             'the shared relation vocabulary, generated from tools/edge-families.js')]:
        if kind in ids and 'concept' in ids:
            edges.append({
                'id': f's_{kind}_by_name', 'src': kind, 'tgt': 'concept',
                'label': f'named in {prop}\n(a string, not a relationship)',
                'polarity': 'none', 'width': 1.5, 'fontSize': 10, 'dash': 'dashed',
                'color': colour, 'fontColor': colour, 'curved': True,
                'props': {'note': note}})
    return {'version': '1.0',
            'modelName': f"RCN Substrate schema — {database or DATABASE}",
            'modelNote': 'Generated from the live database by /projection/schema. '
                         'Per-concept labels (:Action, :Motivation …) are the second '
                         'label on :Concept and are folded away here.',
            'nodes': nodes, 'edges': edges, 'lines': []}


# ── the VOCABULARY lens — the schema as a strict tree ─────────────────────
# The Composer's family / schema / variable levels are a strict contraction:
# "zooming out merges; zooming in never invents" (graph-composer.html:1100).
# That makes them the one part of this schema that is genuinely a TREE, and a
# tree is what a sunburst requires. The causal REL edges are deliberately
# absent — a ring diagram has nowhere to draw a cycle, so asking it to carry
# fixes-that-fail would produce a picture that lies. That reading stays in
# /projection/causal, where it belongs.
#
# `weight` is the SOURCE COUNT — in how many of this graph's source drawings the
# concept appears. What a source IS differs per graph and the projection must not
# pretend otherwise: in `neo4j` they are people ('merchant', 'organizer'); in
# `aspects16` they are the 16 TOPIC drawings, so a high count means the concept is
# cross-cutting, NOT that many people agreed on it.
# A family's weight is the sum of its children, never stored.
VOCABULARY = """
MATCH (c:Concept)
OPTIONAL MATCH (c)-[:IN_FAMILY]->(f:Family)
OPTIONAL MATCH (c)-[:HAS_STATE]->(v:Variable)
WITH c, f, collect(v.label) AS states
RETURN coalesce(f.name, 'Unfiled')  AS family,
       coalesce(f.color, '#6b7280') AS color,
       coalesce(f.fill,  '#e5e7eb') AS fill,
       coalesce(f.ord, 99)          AS ord,
       c.schemaLabel                AS schema,
       c.opmType                    AS opmType,
       CASE WHEN size(states) = 0
            THEN [coalesce(c.variableLabel, c.schemaLabel)]
            ELSE states END AS states,
       coalesce(c.sources, [])      AS srcs,
       size(coalesce(c.sources, [])) AS sources
ORDER BY ord, family, schema
"""


# ── the DRIVER lens — causality unrolled into a tree ──────────────────────
# The vocabulary wheel cannot hold edges: its rings partition by NAMING, and
# influence laid over that would assert relationships the geometry cannot
# represent. This is a different wheel. Root it on one state, put that state's
# direct causes in ring 1 and theirs in ring 2, and the result IS a tree —
# the same unrolling graph-tool already does in its Effects / Causes views.
#
# The same concept can appear in several places. That is the accepted price of
# a driver tree, not a defect, and it is why this is a separate projection
# rather than a layer on the vocabulary one.
#
# It is worth more since causal edges moved to :Variable: a tree rooted on
# "Positive AFFECT" and one rooted on "Negative AFFECT" are now genuinely
# different trees. While edges hung off the concept both inherited the same
# claim and these two wheels would have been identical.

def _resolve_root(root, database):
    """Accept a :Variable id, a state label, or a schemaLabel."""
    for q in ("MATCH (v:Variable) WHERE v.id = $r RETURN v.id AS id, v.label AS label",
              "MATCH (v:Variable) WHERE toLower(v.label) = toLower($r) "
              "RETURN v.id AS id, v.label AS label",
              "MATCH (c:Concept)-[:HAS_STATE]->(v:Variable) "
              "WHERE toLower(c.schemaLabel) = toLower($r) "
              "RETURN v.id AS id, v.label AS label ORDER BY v.id"):
        hit = run(q, {'r': root}, database=database)
        if hit:
            return hit[0]
    return None


def drivers_projection(root, direction='causes', depth=3, database=None):
    import math
    if direction not in ('causes', 'effects'):
        raise ValueError("direction must be 'causes' or 'effects'")
    depth = max(1, min(int(depth), 6))
    r0 = _resolve_root(root, database)
    if not r0:
        raise ValueError(f"no concept or state matching {root!r}")

    step = ("MATCH (n:Variable)-[r:REL]->(v:Variable {id:$id})"
            if direction == 'causes' else
            "MATCH (v:Variable {id:$id})-[r:REL]->(n:Variable)")
    step += """
        MATCH (c:Concept)-[:HAS_STATE]->(n)
        OPTIONAL MATCH (c)-[:IN_FAMILY]->(f:Family)
        RETURN n.id AS id, n.label AS label, c.schemaLabel AS schema,
               c.opmType AS opmType, coalesce(f.name,'Unfiled') AS family,
               coalesce(f.color,'#6b7280') AS color, coalesce(f.fill,'#e5e7eb') AS fill,
               r.label AS via, coalesce(r.polarity,'none') AS polarity,
               r.linkFamily AS linkFamily
        ORDER BY n.id"""

    meta = run("""MATCH (c:Concept)-[:HAS_STATE]->(v:Variable {id:$id})
                  OPTIONAL MATCH (c)-[:IN_FAMILY]->(f:Family)
                  RETURN c.schemaLabel AS schema, c.opmType AS opmType,
                         coalesce(f.name,'Unfiled') AS family,
                         coalesce(f.color,'#6b7280') AS color,
                         coalesce(f.fill,'#e5e7eb') AS fill""",
               {'id': r0['id']}, database=database)
    m = meta[0] if meta else {'schema': r0['label'], 'opmType': None,
                              'family': 'Unfiled', 'color': '#6b7280', 'fill': '#e5e7eb'}

    def grow(vid, level, seen, sign):
        """Unroll one level. `seen` is the path, so a loop is SHOWN and not
        followed — a CLD is full of cycles and a driver tree that chased them
        would never terminate."""
        node = {'vid': vid, 'level': level, 'kids': []}
        if level >= depth:
            return node
        for row in run(step, {'id': vid}, database=database):
            pol = row['polarity']
            # Net sign along the path. Two negatives in series are reinforcing,
            # which is the thing a driver tree exists to make visible.
            nxt = sign if pol != '-' else ('-' if sign == '+' else '+')
            kid = {'row': row, 'polarity': pol, 'net': nxt,
                   'loop': row['id'] in seen}
            kid.update(grow(row['id'], level + 1, seen | {row['id']}, nxt)
                       if not kid['loop'] else
                       {'vid': row['id'], 'level': level + 1, 'kids': []})
            node['kids'].append(kid)
        return node

    tree = grow(r0['id'], 0, {r0['id']}, '+')

    def weigh(n):
        n['weight'] = sum(weigh(k) for k in n['kids']) if n['kids'] else 1
        return n['weight']
    weigh(tree)

    cx, cy, hub = 470, 340, 96
    band = (452 - hub) / depth
    nodes, edges = [], []

    def place(level, mid):
        rr = hub + band * (level - 0.5)
        a = 2 * math.pi * mid - math.pi / 2
        return round(cx + rr * math.cos(a)), round(cy + rr * math.sin(a))

    nodes.append({'id': 'root', 'label': r0['label'], 'x': cx, 'y': cy,
                  'w': 150, 'h': 60, 'shape': 'ellipse', 'color': m['fill'],
                  'borderColor': m['color'], 'borderWidth': 3, 'fontSize': 13,
                  'fontColor': '#1a1a1a',
                  'props': {'level': 0, 'weight': tree['weight'],
                            'root': r0['label'], 'direction': direction,
                            'depth': depth, 'schemaLabel': m['schema'],
                            'family': m['family'], 'opmType': m['opmType'],
                            'color': m['color'], 'fill': m['fill']}})

    counter = [0]

    def emit(node, start, span, parent_id):
        for kid in node['kids']:
            ks = span * kid['weight'] / max(node['weight'], 1)
            row = kid['row']
            counter[0] += 1
            nid = f"d{counter[0]}"
            x, y = place(kid['level'], start + ks / 2)
            nodes.append({'id': nid, 'label': row['label'], 'x': x, 'y': y,
                          'w': 170, 'h': 40, 'shape': 'rounded',
                          'color': row['fill'], 'borderColor': row['color'],
                          'borderWidth': 2, 'fontSize': 10, 'fontColor': '#1a1a1a',
                          'props': {'level': kid['level'], 'start': start,
                                    'span': ks, 'weight': kid['weight'],
                                    'schemaLabel': row['schema'],
                                    'family': row['family'],
                                    'opmType': row['opmType'],
                                    'via': row['via'], 'polarity': kid['polarity'],
                                    'net': kid['net'], 'loop': kid['loop'],
                                    'linkFamily': row['linkFamily'],
                                    'color': row['color'], 'fill': row['fill']}})
            edges.append({'id': f"de{counter[0]}", 'src': parent_id, 'tgt': nid,
                          'label': row['via'] or '', 'polarity': kid['polarity'],
                          'width': 2, 'fontSize': 10, 'color': row['color'],
                          'curved': False,
                          'props': {'rel': direction, 'net': kid['net'],
                                    'loop': kid['loop']}})
            emit(kid, start, ks, nid)
            start += ks

    emit(tree, 0.0, 1.0, 'root')
    return {'version': '1.0',
            'modelName': f"{r0['label']} — {direction} ({database or DATABASE})",
            'modelNote': 'Causality unrolled into a tree from one state. A concept '
                         'may appear in several places; that is what a driver tree '
                         'is. `net` is the sign accumulated along the path — two '
                         'negatives in series are reinforcing. A node already on '
                         'its own path is marked loop:true and not expanded.',
            'nodes': nodes, 'edges': edges, 'lines': []}


def vocabulary_projection(database=None):
    """Root → family → schemaLabel → variableLabel, in the standard envelope.

    A concept with no :IN_FAMILY edge lands under 'Unfiled' rather than being
    dropped. A missing family is a real finding about the data and has to be
    visible; a query that quietly returns 23 of 24 rows is the exact failure
    this substrate exists to end.
    """
    import math
    rows = run(VOCABULARY, database=database)
    cx, cy, radius = 470, 340, {1: 150, 2: 300, 3: 450}

    fams, order = {}, []
    for r in rows:
        f = fams.get(r['family'])
        if f is None:
            f = fams[r['family']] = {'color': r['color'], 'fill': r['fill'],
                                     'weight': 0, 'kids': []}
            order.append(r['family'])
        r['states'] = sorted(r['states'])
        f['weight'] += max(r['sources'], 1)
        f['kids'].append(r)

    # WHAT IS A SOURCE HERE? Declared by the loader on the :Aspect registry.
    # A lens must not infer it: nothing in a list of strings separates
    # 'merchant' from 'action'. Unknown is a real answer and is reported as one.
    kinds = run("MATCH (a:Aspect) RETURN DISTINCT a.kind AS k", database=database)
    ks = {r['k'] for r in kinds if r['k']}
    source_kind = ks.pop() if len(ks) == 1 else ('mixed' if ks else 'unknown')

    total = sum(f['weight'] for f in fams.values()) or 1
    nodes = [{'id': 'root', 'label': f"RCN Substrate\n{database or DATABASE}",
              'x': cx, 'y': cy, 'w': 150, 'h': 60, 'shape': 'ellipse',
              'color': '#93c5fd', 'borderColor': '#1d4ed8', 'borderWidth': 2.5,
              'fontSize': 13, 'fontColor': '#1a1a1a',
              'props': {'level': 0, 'weight': total, 'sourceKind': source_kind,
                        'concepts': len(rows), 'families': len(fams)}}]
    edges = []

    def place(level, mid):                     # mid = fraction round the wheel
        a = 2 * math.pi * mid - math.pi / 2
        return (round(cx + radius[level] * math.cos(a)),
                round(cy + radius[level] * math.sin(a)))

    cursor = 0.0
    for name in order:
        f = fams[name]
        span = f['weight'] / total
        fid = 'fam_' + name.lower()
        x, y = place(1, cursor + span / 2)
        nodes.append({'id': fid, 'label': name, 'x': x, 'y': y,
                      'w': 120, 'h': 44, 'shape': 'rounded',
                      'color': f['fill'], 'borderColor': f['color'],
                      'borderWidth': 3, 'fontSize': 12, 'fontColor': '#1a1a1a',
                      'props': {'level': 1, 'family': name, 'weight': f['weight'],
                                'start': cursor, 'span': span,
                                'color': f['color'], 'fill': f['fill']}})
        edges.append({'id': f'v_root_{fid}', 'src': 'root', 'tgt': fid,
                      'label': '', 'polarity': 'none', 'width': 2,
                      'fontSize': 10, 'color': f['color'], 'curved': False,
                      'props': {'rel': 'CONTAINS'}})

        inner = cursor
        for r in f['kids']:
            w = max(r['sources'], 1)
            kspan = span * w / f['weight']
            sid = 'sch_' + r['schema']
            x, y = place(2, inner + kspan / 2)
            base = {'level': 2, 'family': name, 'schemaLabel': r['schema'],
                    'opmType': r['opmType'],
                    'weight': w, 'sources': r['sources'], 'sourceList': r['srcs'],
                    'states': r['states'],
                    'start': inner, 'span': kspan,
                    'color': f['color'], 'fill': f['fill']}
            nodes.append({'id': sid, 'label': r['schema'], 'x': x, 'y': y,
                          'w': 140, 'h': 40, 'shape': 'rounded',
                          'color': f['fill'], 'borderColor': f['color'],
                          'borderWidth': 2, 'fontSize': 11, 'fontColor': '#1a1a1a',
                          'props': base})
            edges.append({'id': f'v_{fid}_{sid}', 'src': fid, 'tgt': sid,
                          'label': '', 'polarity': 'none', 'width': 1.5,
                          'fontSize': 10, 'color': f['color'], 'curved': False,
                          'props': {'rel': 'CONTAINS'}})

            # RING 3 BRANCHES. A concept has as many states as it has ways of
            # being measured, and they SPLIT their parent's arc — they do not
            # each inherit it. One state therefore looks exactly as it did
            # before, and four states look like four.
            vspan = kspan / len(r['states'])
            for j, label in enumerate(r['states']):
                vid = f"var_{r['schema']}_{j}"
                vstart = inner + j * vspan
                x, y = place(3, vstart + vspan / 2)
                nodes.append({'id': vid, 'label': label, 'x': x, 'y': y,
                              'w': 190, 'h': 40, 'shape': 'rounded',
                              'color': f['fill'], 'borderColor': f['color'],
                              'borderWidth': 1.5, 'fontSize': 10,
                              'fontColor': '#1a1a1a',
                              'props': dict(base, level=3, variableLabel=label,
                                            stateOf=r['schema'],
                                            stateCount=len(r['states']),
                                            start=vstart, span=vspan)})
                edges.append({'id': f'v_{sid}_{vid}', 'src': sid, 'tgt': vid,
                              'label': '', 'polarity': 'none', 'width': 1.5,
                              'fontSize': 10, 'color': f['color'], 'curved': False,
                              'props': {'rel': 'HAS_STATE'}})
            inner += kspan
        cursor += span

    return {'version': '1.0',
            'modelName': f"RCN Substrate vocabulary — {database or DATABASE}",
            'modelNote': 'family → schemaLabel → state, generated from the live '
                         'database. Arc weight is the SOURCE COUNT: in how many of the '
                         'graph\u2019s source drawings the concept appears. Ring 3 branches '
                         'when a concept has several states. Causal REL edges are not in '
                         'this lens — a tree cannot hold a loop. See /projection/causal.',
            'nodes': nodes, 'edges': edges, 'lines': []}


def project(name, database=None):
    """`database` selects WHICH graph, never WHICH query. The n=6 reference and
    the 26-node composite are read by byte-identical Cypher — that is the Stage
    2 claim, and if it ever stops being true the architecture was not proven."""
    node_q, edge_q = PROJECTIONS[name]
    params = {'causal': CAUSAL_FAMILIES}
    nodes = run(node_q, params, database=database)
    edges = run(edge_q, params, database=database) if edge_q else []
    for n in nodes:                       # drop nulls so the JSON stays clean
        for k in [k for k, v in n.items() if v is None]:
            del n[k]
    return {'nodes': nodes, 'edges': edges}


ASPECT_DB = 'aspects16'   # where the 16 drawings live, with exact provenance


# Reserved names carry the substrate's own bookkeeping, not the row's content.
TABLE_HIDDEN = {'schemaLabel', 'kind'}


def table_projection(kind, database=ASPECT_DB):
    """One kind of concept as ROWS, in the shape wiki-plugin-data already uses.

    `{columns: [...], data: [{...}]}` is Ward's tabular contract — item.columns
    plus an array of row objects — so a table item built from this can be read
    by chart, rollup, reduce and method with no adapter. Reusing his shape costs
    nothing and buys the whole downstream ecosystem.

    `subject` names the column holding the row's identity. That column is what a
    click navigates on: the row is a thing with a page, and the slug is the
    join between this table, a drawing, and a wiki page. A table whose rows are
    observations rather than subjects returns subject=None and does not link.

    Columns are gathered from the rows actually returned, not declared up front,
    because these sheets are ragged — most columns are filled for a minority of
    rows, and a fixed column list would be mostly empty.
    """
    rows = run('MATCH (c:Concept {kind:$k}) RETURN c AS c '
               'ORDER BY c.variableLabel', {'k': kind}, database=database)
    out, cols = [], []
    for r in rows:
        props = (r['c'] or {}).get('properties', r['c']) or {}
        row = {'Name': props.get('variableLabel') or props.get('schemaLabel')}
        for key, val in props.items():
            if key in TABLE_HIDDEN or key == 'variableLabel':
                continue
            if key == 'sources':
                val = ', '.join(val or [])
            row[key] = val
        for key in row:
            if key not in cols:
                cols.append(key)
        out.append(row)
    # Name first, then the substrate's provenance, then the sheet's own columns.
    order = ([c for c in ('Name', 'sources') if c in cols]
             + sorted(c for c in cols if c not in ('Name', 'sources')))
    return {'kind': kind, 'subject': 'Name', 'columns': order,
            'data': [{c: r.get(c, '') for c in order} for r in out],
            'total': len(out), 'database': database}


def table_kinds(database=ASPECT_DB):
    """What kinds exist, with row counts — the list a table picker offers."""
    return {'database': database, 'kinds': run(
        'MATCH (c:Concept) WHERE c.kind IS NOT NULL '
        'RETURN c.kind AS kind, count(*) AS rows ORDER BY rows DESC',
        database=database)}


# Colour is the contract between the data and the picture, so it is declared in
# one place and shown in the legend rather than being chosen at each call site.
KIND_FILL = {'Entity': '#dbeafe', 'Person': '#dcfce7', 'Program': '#fef3c7',
             'Theme': '#ede9fe', 'Promise': '#ffe4e6', 'Result': '#ccfbf1',
             'Scrum': '#f1f5f9'}
KIND_EDGE = {'Entity': '#2563eb', 'Person': '#16a34a', 'Program': '#d97706',
             'Theme': '#7c3aed', 'Promise': '#e11d48', 'Result': '#0d9488',
             'Scrum': '#64748b'}


def geo_projection(database=ASPECT_DB, kinds=None, names=None):
    """Everything with a location, and the relationships among those things.

    A map that only drops pins is a picture of some coordinates. What makes it a
    VIEW of the model — Perspectives' Geographical View beside its Logical View —
    is that the edges come too, drawn between geographic positions. So this
    returns nodes and edges together, and the edge list is restricted to pairs
    that are both on the map, because an edge to something with no location has
    nowhere to land.

    A node carries `boundary` when it has one: a list of rings in Leaflet's
    [lat, lng] order, already simplified by load_rcn_geo.py. Everything else
    gets a point. `anchor` is where an edge should meet the shape — the stored
    lat/long, which for an area is its bounding-box centre.
    """
    where, params = ['c.lat IS NOT NULL', 'trim(toString(c.lat)) <> ""'], {}
    if kinds:
        where.append('c.kind IN $kinds')
        params['kinds'] = kinds
    if names:
        where.append('c.variableLabel IN $names OR c.schemaLabel IN $names')
        params['names'] = names
    rows = run('MATCH (c:Concept) WHERE %s RETURN c AS c ORDER BY c.variableLabel'
               % ' AND '.join('(%s)' % w for w in where), params, database=database)

    nodes, keys = [], set()
    for r in rows:
        props = (r['c'] or {}).get('properties', r['c']) or {}
        try:
            lat = float(str(props.get('lat', '')).strip())
            lng = float(str(props.get('long', '')).strip())
        except (TypeError, ValueError):
            continue
        if not (-90 <= lat <= 90 and -180 <= lng <= 180) or (lat == 0 and lng == 0):
            continue
        key = props.get('schemaLabel')
        keys.add(key)
        bnd = props.get('boundary') or ''
        node = {'key': key, 'name': props.get('variableLabel') or key,
                'kind': props.get('kind') or '', 'anchor': [lat, lng]}
        if bnd:
            try:
                rings_ = json.loads(bnd)
                if rings_:
                    node['boundary'] = rings_
            except ValueError:
                pass
        for k, v in props.items():
            if k in ('lat', 'long', 'boundary', 'schemaLabel', 'variableLabel', 'kind'):
                continue
            if k == 'sources':
                v = ', '.join(v or [])
            node[k] = v
        nodes.append(node)

    erows = run('MATCH (a:Concept)-[r:REL]->(b:Concept) '
                'WHERE a.schemaLabel IN $ks AND b.schemaLabel IN $ks '
                'RETURN DISTINCT a.schemaLabel AS src, b.schemaLabel AS tgt, '
                '       r.label AS label',
                {'ks': sorted(keys)}, database=database) if keys else []

    return {'database': database, 'nodes': nodes,
            'edges': [{'src': e['src'], 'tgt': e['tgt'], 'label': e['label'] or ''}
                      for e in erows],
            'total': len(nodes)}


def neighbours_projection(root, depth=1, database=ASPECT_DB):
    """One row's neighbourhood — the only sane way to look at a large graph.

    whatcom holds 409 concepts and 770 links. Drawn at once that is a hairball
    no layout algorithm rescues, which is exactly why Perspectives opens its
    Supply Chain canvas EMPTY and tells you to right-click a product and run
    "Display Chain". You never look at the graph; you look at the neighbourhood
    of one row you picked out of a table.

    Their "clickable query" is a stored, parameterised query surfaced as a named
    action on an element. /projection/<name> already IS that shape — this simply
    gives it the parameter that makes it an action rather than a view.

    Structural only: it walks (:Concept)-[:REL]->(:Concept), which is what the
    label-keyed databases hold. /projection/drivers is the causal counterpart
    and needs the :Variable layer, which vna and whatcom do not have.
    """
    depth = max(1, min(int(depth), 3))
    rows = run("""MATCH (r:Concept)
                  WHERE toLower(r.schemaLabel) = toLower($root)
                     OR toLower(r.variableLabel) = toLower($root)
                  WITH r LIMIT 1
                  MATCH p = (r)-[:REL*0..%d]-(n:Concept)
                  RETURN n.schemaLabel AS sl, n.variableLabel AS label,
                         n.kind AS kind, min(length(p)) AS hop
                  ORDER BY hop, label""" % depth,
               {'root': root}, database=database)
    if not rows:
        raise ValueError(f'no concept matching {root!r} in {database}')

    ids, nodes, by_hop = {}, [], {}
    for r in rows:
        by_hop.setdefault(r['hop'], []).append(r)
    for hop, group in sorted(by_hop.items()):
        for i, r in enumerate(group):
            nid = 'n%d' % len(ids)
            ids[r['sl']] = nid
            if hop == 0:
                x, y = 620, 400
            else:
                # A ring per hop, so distance from the root is legible as
                # distance on the page. The substrate stores no coordinates.
                #
                # The radius has to follow the crowd: whatcom community
                # foundation funds 32 programmes, and 32 nodes 150 wide on a
                # fixed 250 ring overlap into an unreadable rosette. Give each
                # node its own arc length and the ring sizes itself.
                ang = 2 * math.pi * i / max(1, len(group))
                rad = hop * max(250, len(group) * 175 / (2 * math.pi))
                x = round(620 + rad * math.cos(ang))
                y = round(400 + rad * math.sin(ang) * 0.78)
            kind = r['kind'] or 'Entity'
            nodes.append({
                'id': nid, 'label': r['label'] or r['sl'],
                'x': x, 'y': y, 'w': 150, 'h': 56, 'shape': 'roundrect',
                'color': KIND_FILL.get(kind, '#f1f5f9'),
                'borderColor': KIND_EDGE.get(kind, '#64748b'),
                'borderWidth': 3 if hop == 0 else 1.5,
                'fontColor': '#16233b', 'fontSize': 12,
                'props': {'kind': kind, 'schemaLabel': r['sl'], 'hop': str(hop)}})

    erows = run("""MATCH (r:Concept)
                   WHERE toLower(r.schemaLabel) = toLower($root)
                      OR toLower(r.variableLabel) = toLower($root)
                   WITH r LIMIT 1
                   MATCH (r)-[:REL*0..%d]-(a:Concept)
                   WITH collect(DISTINCT a) AS ns
                   UNWIND ns AS a
                   MATCH (a)-[e:REL]->(b:Concept) WHERE b IN ns
                   RETURN DISTINCT a.schemaLabel AS src, b.schemaLabel AS tgt,
                          e.label AS label""" % depth,
                {'root': root}, database=database)
    edges = []
    for i, e in enumerate(erows):
        sv, tv = ids.get(e['src']), ids.get(e['tgt'])
        if not sv or not tv:
            continue
        edges.append({'id': 'e%d' % i, 'src': sv, 'tgt': tv,
                      'label': e['label'] or '', 'polarity': 'none',
                      'color': '#64748b', 'width': 1.5, 'fontSize': 10,
                      'curved': True, 'dash': 'solid', 'props': {}})

    kinds = sorted({n['props']['kind'] for n in nodes})
    return {
        'version': '1.0',
        'modelName': '%s — neighbourhood, %d hop%s'
                     % (rows[0]['label'] or root, depth, '' if depth == 1 else 's'),
        'modelNote': 'Read from the %s substrate by /projection/neighbours. '
                     'The thick border is the row you came from; each ring is '
                     'one more hop away.' % database,
        'canvasBg': '#ffffff',
        'legendVisible': True,
        'legendEntries': [{'id': 'lg_%s' % k.lower(), 'kind': 'node', 'label': k,
                           'color': KIND_FILL.get(k, '#f1f5f9'),
                           'borderColor': KIND_EDGE.get(k, '#64748b'),
                           'borderWidth': 1.5} for k in kinds],
        'nodes': nodes, 'edges': edges,
    }


def subgraph(aspect, database=ASPECT_DB):
    """One drawing, as its author drew it, carrying the substrate's content.

    WHAT YOU OPEN IS WHAT A SAVE WOULD WRITE. These used to be two different
    reconstructions and they disagreed: the projection returned one node per
    (concept, state), but `org` PLACES `Effectiveness of ORG` twice so its
    edges do not cross, and `commitment` places `PERSON Participation` twice.
    Opening org therefore gave 6 nodes where the file holds 8 — and worse, the
    merge INVENTED two self-loops, because `n0 --relate_with--> n1` runs
    between two different nodes that share a label. Nobody drew a self-loop.

    Layout was already taken from the file rather than the substrate, on the
    principle that the substrate has no business storing where a node sits.
    Placement and duplication are the same kind of fact, so they come from the
    same place. The substrate owns what a node MEANS; the file owns how many
    times it appears and where.

    build_file() already merges substrate content onto file structure and is
    the verified write path, so read and write are now one code path and
    cannot drift apart again.
    """
    out = aspect_file.build_file(aspect, database)
    out['subgraph'] = aspect
    out.setdefault('lines', [])
    return out


def put_subgraph(aspect, payload, database=ASPECT_DB):
    """Replace one drawing, without a failure path that can destroy it.

    THE WINDOW THIS CLOSES. The write used to retract and then re-assert, and
    the retract DELETED anything left with no witness. Every concept in a small
    drawing is witnessed only by that drawing, so between the two halves the
    drawing did not exist. Any error in the second half — and there were two in
    one afternoon, a NameError and a merge that matched nothing — left it
    deleted with nothing put back. Recovery depended on the files being in git.

    Two changes. The deletion now runs LAST, after the re-assert, so nothing is
    removed until its replacement is already in place; an exception simply
    means the deletion never happens. And the witnesses are captured before
    anything is touched, so if the re-assert raises, every drawing that carried
    this aspect gets it back before the error propagates.

    What remains is not atomic — /query/v2 is one statement per transaction, so
    genuine atomicity means rewriting this as a single UNWIND, which is a much
    larger change to the most delicate code here. But no ordering of failures
    now loses data: the worst case is a drawing briefly missing from the
    listings, which the next successful save repairs.
    """
    kw = {'a': aspect}
    # elementId is stable for as long as the node lives, and with the deletion
    # moved to the end nothing dies before the rollback could need it.
    had_c = [r['k'] for r in run(
        "MATCH (c:Concept) WHERE $a IN c.sources RETURN elementId(c) AS k",
        kw, database=database)]
    had_v = [r['k'] for r in run(
        "MATCH (v:Variable) WHERE $a IN v.sources RETURN elementId(v) AS k",
        kw, database=database)]
    had_r = [r['k'] for r in run(
        "MATCH ()-[r:REL]->() WHERE $a IN r.sources RETURN elementId(r) AS k",
        kw, database=database)]
    try:
        return _put_subgraph_write(aspect, payload, database)
    except Exception:
        for match, var, ks in (
                ("MATCH (c:Concept)", 'c', had_c),
                ("MATCH (v:Variable)", 'v', had_v),
                ("MATCH ()-[r:REL]->()", 'r', had_r)):
            if not ks:
                continue
            try:
                run(f"{match} WHERE elementId({var}) IN $ks "
                    f"AND NOT $a IN {var}.sources "
                    f"SET {var}.sources = {var}.sources + $a",
                    {'ks': ks, 'a': aspect}, database=database)
            except Exception:
                pass          # the original error is the one worth raising
        raise


def _put_subgraph_write(aspect, payload, database=ASPECT_DB):
    """Replace one contributor's drawing. NON-DESTRUCTIVE TO OTHERS.

    Retract, then re-assert:
      1. drop `aspect` from every sources list
      2. delete only what is left with NO witness at all
      3. upsert the incoming content, carrying `aspect`

    A concept another drawing also contains keeps its other witnesses and
    survives step 2. That is the whole reason sources is a list: one
    contributor cannot delete another's work, even by submitting an empty
    drawing. The gold flag recomputes for free, because it was never stored.
    """
    kw = {'a': aspect}
    before = run("MATCH (c:Concept) WHERE $a IN c.sources RETURN count(c) AS c",
                 kw, database=database)[0]['c']
    # Register the drawing itself, so a NEW one appears in /projection/subgraphs
    # and therefore in Composer's beam. Without this a first save writes real
    # content that nothing ever lists — present in the data, invisible in every
    # tool, which is the worst of both.
    run("MERGE (a:Aspect {name:$a})", kw, database=database)

    run("MATCH (c:Concept) WHERE $a IN c.sources "
        "SET c.sources = [s IN c.sources WHERE s <> $a]", kw, database=database)
    run("MATCH ()-[r:REL]->() WHERE $a IN r.sources "
        "SET r.sources = [s IN r.sources WHERE s <> $a]", kw, database=database)
    run("MATCH (v:Variable) WHERE $a IN v.sources "
        "SET v.sources = [s IN v.sources WHERE s <> $a]", kw, database=database)
    # A CANVAS NODE IS A STATE. Two nodes can share a schema label and be
    # different states of it — that is the whole point of Affect — so the
    # concept is MERGEd once and a :Variable is MERGEd per distinct wording.
    # Setting c.variableLabel from every node in turn is what let the last one
    # read win and erased the others.
    vid_of = {}                      # canvas node id -> :Variable id
    label_keyed = aspect_file.KEY_FNS.get(database) is aspect_file._key_label
    cid_of = {}                        # node id -> concept key, label-keyed dbs
    for n in payload.get('nodes', []):
        schema = n.get('schemaLabel') or (n.get('props') or {}).get('schemaLabel') \
                 or n.get('label') or n.get('id')
        # THE WRITE MUST KEY THE WAY THE READ DOES. This merged on c.id with a
        # spaceless schemaLabel — the aspects16 convention, from families.js.
        # A vna concept has no `id` at all and is keyed on schemaLabel WITH its
        # spaces, so the merge matched nothing, created `MEMBERHOUSEHOLD` beside
        # the real `MEMBER HOUSEHOLD`, and the original then had no witness left
        # and was deleted. One saved drawing, one concept silently renamed.
        # aspect_file already knows each database's convention; use it.
        sl = aspect_file.key_fn(database)({'schemaLabel': schema})
        if label_keyed:
            # NO schemaLabel MEANS NOT A CONCEPT. A vna drawing carries headers
            # and captions beside its roles; the roles come back from the
            # projection carrying a schemaLabel and the annotations do not, so
            # the absence IS the signal and nothing needs flagging in the file.
            #
            # This was briefly written as MATCH-only — update, never create — on
            # the reasoning that load_vna.py rebuilds the database from files
            # anyway. That cannot work: put_subgraph RETRACTS first, deleting
            # concepts left with no witness, and every concept in a small drawing
            # is witnessed only by that drawing. The retraction removes exactly
            # what the update would have matched, so all six were deleted and
            # none re-asserted. Re-assertion has to be able to create.
            if str(((n.get('props') or {}).get('_annotation') or '')).lower() == 'true':
                continue
            run("""MERGE (c:Concept {schemaLabel:$sl})
                   ON CREATE SET c.variableLabel=$vl, c.sources=[],
                                 c.w=$w, c.h=$h, c.shape=$sh
                   SET c.variableLabel = coalesce($vl, c.variableLabel),
                       c.sources = CASE WHEN $a IN c.sources THEN c.sources
                               ELSE c.sources + $a END""",
                dict(sl=sl, vl=n.get('label'), w=n.get('w', 110), h=n.get('h', 60),
                     sh=n.get('shape', 'ellipse'), a=aspect), database=database)
        else:
            run("""MERGE (c:Concept {id:$id})
                   ON CREATE SET c.schemaLabel=$sl, c.variableLabel=$vl, c.mode='EIP',
                                 c.sources=[], c.w=$w, c.h=$h, c.shape=$sh
                   SET c.variableLabel = coalesce($vl, c.variableLabel),
                       c.sources = CASE WHEN $a IN c.sources THEN c.sources
                                   ELSE c.sources + $a END""",
                dict(id=sl.lower(), sl=sl,
                     vl=n.get('label'), w=n.get('w', 110), h=n.get('h', 60),
                     sh=n.get('shape', 'ellipse'), a=aspect), database=database)

        if label_keyed:
            # A vna concept has no :Variable layer — load_vna.py creates none,
            # because a role does not have measured states the way an EIP
            # concept does. Creating them here would invent a layer the model
            # does not have, so edges are written concept-to-concept below.
            cid_of[str(n.get('id'))] = sl
            continue

        nid = sl.lower()
        state = (n.get('label') or '').strip() or ''.join(str(schema).split())
        found = run("""MATCH (c:Concept {id:$cid})-[:HAS_STATE]->(v:Variable)
                       WHERE v.label = $st RETURN v.id AS id""",
                    dict(cid=nid, st=state), database=database)
        if found:
            vid = found[0]['id']
        else:
            taken = {r['id'] for r in run(
                "MATCH (c:Concept {id:$cid})-[:HAS_STATE]->(v) RETURN v.id AS id",
                dict(cid=nid), database=database)}
            j = 0
            while f'{nid}_v{j}' in taken:
                j += 1
            vid = f'{nid}_v{j}'
            run("""MATCH (c:Concept {id:$cid})
                   CREATE (v:Variable {id:$vid, label:$st, schemaLabel:$sl,
                                       mode:'EIP', sources:[]})
                   CREATE (c)-[:HAS_STATE]->(v)""",
                dict(cid=nid, vid=vid, st=state,
                     sl=''.join(str(schema).split())), database=database)
        run("""MATCH (v:Variable {id:$vid})
               SET v.sources = CASE WHEN $a IN v.sources THEN v.sources
                               ELSE v.sources + $a END""",
            dict(vid=vid, a=aspect), database=database)
        vid_of[str(n.get('id'))] = vid

    for e in payload.get('edges', []):
        if label_keyed:
            # Straight concept to concept, matching how load_vna.py wrote them.
            sc, tc = cid_of.get(str(e.get('src'))), cid_of.get(str(e.get('tgt')))
            if not sc or not tc:
                continue                   # an edge to a node that was not sent
            run("""MATCH (s:Concept {schemaLabel:$sc}), (t:Concept {schemaLabel:$tc})
                   MERGE (s)-[r:REL {label:$label}]->(t)
                   ON CREATE SET r.id=$id, r.sources=[]
                   SET r.sources = CASE WHEN $a IN r.sources THEN r.sources
                                   ELSE r.sources + $a END""",
                dict(sc=sc, tc=tc, label=e.get('label', ''),
                     id=e.get('id') or f"w_{aspect}_{e.get('src')}_{e.get('tgt')}",
                     a=aspect), database=database)
            continue

        sv, tv = vid_of.get(str(e.get('src'))), vid_of.get(str(e.get('tgt')))
        if not sv or not tv:
            continue                       # an edge to a node that was not sent
        lf = (e.get('props') or {}).get('linkFamily')
        args = dict(label=e.get('label', ''),
                    id=e.get('id') or f"w_{aspect}_{e.get('src')}_{e.get('tgt')}",
                    pol=e.get('polarity', 'none'), lf=lf, a=aspect, sv=sv, tv=tv)
        if lf in CAUSAL_FAMILIES:
            run("""MATCH (s:Variable {id:$sv}), (t:Variable {id:$tv})
                   MERGE (s)-[r:REL {label:$label}]->(t)
                   ON CREATE SET r.id=$id, r.mode='EIP', r.rel='before', r.sources=[]
                   SET r.polarity=$pol,
                       r.linkFamily = coalesce($lf, r.linkFamily),
                       r.sources = CASE WHEN $a IN r.sources THEN r.sources
                                   ELSE r.sources + $a END""", args, database=database)
        else:
            # Structural: the claim is about the concepts, but remember which
            # states the author drew it between so the drawing reopens as drawn.
            run("""MATCH (sc:Concept)-[:HAS_STATE]->(sv:Variable {id:$sv})
                   MATCH (tc:Concept)-[:HAS_STATE]->(tv:Variable {id:$tv})
                   MERGE (sc)-[r:REL {label:$label}]->(tc)
                   ON CREATE SET r.id=$id, r.mode='EIP', r.rel='before', r.sources=[]
                   SET r.polarity=$pol,
                       r.linkFamily = coalesce($lf, r.linkFamily),
                       r.srcState = sv.label, r.tgtState = tv.label,
                       r.sources = CASE WHEN $a IN r.sources THEN r.sources
                                   ELSE r.sources + $a END""", args, database=database)

    # DELETE LAST. Everything above only ADDED — the aspect was stripped from
    # each sources list at the top, and the re-assert put it back on whatever
    # the drawing still contains. So what is witness-less now is genuinely
    # retired, and nothing was at risk while the drawing was being rebuilt.
    orphaned_e = run("MATCH ()-[r:REL]->() WHERE size(r.sources) = 0 "
                     "DELETE r RETURN count(r) AS c", database=database)[0]['c']
    orphaned_v = run("MATCH (v:Variable) WHERE size(v.sources) = 0 "
                     "DETACH DELETE v RETURN count(v) AS c", database=database)[0]['c']
    orphaned_n = run("MATCH (c:Concept) WHERE size(c.sources) = 0 "
                     "DETACH DELETE c RETURN count(c) AS c", database=database)[0]['c']

    after = run("MATCH (c:Concept) WHERE $a IN c.sources RETURN count(c) AS c",
                kw, database=database)[0]['c']
    return {'subgraph': aspect, 'conceptsBefore': before, 'conceptsAfter': after,
            'nodesWritten': len(payload.get('nodes', [])),
            'edgesWritten': len(payload.get('edges', [])),
            'deletedLastWitnessNodes': orphaned_n,
            'deletedLastWitnessStates': orphaned_v,
            'deletedLastWitnessEdges': orphaned_e}


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=BASE, **kw)

    def end_headers(self):
        # No caching, for STATIC files too — not just the projections.
        # Without this the browser holds an old graph-sets.js or an old
        # graph-tool-v22.html and you debug a file you already fixed. That
        # failure wastes more time than any other in this kind of work,
        # because the evidence looks exactly like a broken change.
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        super().end_headers()

    def _send(self, code, payload, ctype='application/json'):
        body = json.dumps(payload, indent=1).encode() if ctype.startswith('application/json') else payload
        self.send_response(code)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS')
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        qs = parse_qs(parsed.query)
        db = (qs.get('db') or [None])[0]
        if path == '/':
            return self._send(200, INDEX.encode(), 'text/html; charset=utf-8')
        if path == '/projection':
            try:
                dbs = [r['name'] for r in run(
                    "SHOW DATABASES YIELD name WHERE name <> 'system' RETURN name",
                    database='system')]
            except Exception:
                dbs = [DATABASE]
            return self._send(200, {'available': sorted(PROJECTIONS),
                                    'default': DATABASE, 'databases': sorted(dbs)})
        if path == '/vocabulary/edge-labels':
            try:
                return self._send(200, {'database': db or ASPECT_DB,
                    'labels': run(EDGE_VOCAB, database=db or ASPECT_DB)})
            except Exception as e:
                return self._send(503, {'error': str(e)})
        if path == '/projection/schema':
            try:
                return self._send(200, schema_projection(db or ASPECT_DB))
            except Exception as e:
                return self._send(503, {'error': str(e)})
        if path == '/projection/vocabulary':
            try:
                return self._send(200, vocabulary_projection(db or ASPECT_DB))
            except Exception as e:
                return self._send(503, {'error': str(e)})
        if path == '/projection/drivers':
            try:
                return self._send(200, drivers_projection(
                    (qs.get('root') or [''])[0], (qs.get('dir') or ['causes'])[0],
                    (qs.get('depth') or ['3'])[0], db or ASPECT_DB))
            except Exception as e:
                return self._send(400, {'error': str(e)})
        if path == '/projection/subgraphs':
            try:
                return self._send(200, {'database': db or ASPECT_DB,
                    'subgraphs': run(SUBGRAPH_LIST, database=db or ASPECT_DB)})
            except Exception as e:
                return self._send(503, {'error': str(e)})
        if path.startswith('/subgraph/') and path.endswith('/file'):
            name = path[len('/subgraph/'):-len('/file')]
            try:
                return self._send(200, aspect_file.build_file(name, db or ASPECT_DB))
            except Exception as e:
                return self._send(503, {'error': str(e)})
        if path == '/projection/geo':
            q = parse_qs(parsed.query)
            kinds = [k for k in (q.get('kind') or [''])[0].split(',') if k]
            names = [n for n in (q.get('names') or [''])[0].split('|') if n]
            return self._send(200, geo_projection(db or ASPECT_DB,
                                                  kinds or None, names or None))
        if path.startswith('/projection/neighbours/'):
            name = unquote(path[len('/projection/neighbours/'):])
            q = parse_qs(parsed.query)
            try:
                return self._send(200, neighbours_projection(
                    name, int((q.get('depth') or ['1'])[0]), db or ASPECT_DB))
            except ValueError as e:
                return self._send(404, {'error': str(e)})
        if path == '/projection/tables':
            return self._send(200, table_kinds(db or ASPECT_DB))
        if path.startswith('/projection/table/'):
            kind = unquote(path[len('/projection/table/'):])
            return self._send(200, table_projection(kind, db or ASPECT_DB))
        if path.startswith('/projection/subgraph/'):
            name = posixpath.basename(path)
            try:
                sg = subgraph(name, db or ASPECT_DB)
            except Exception as e:
                return self._send(503, {'error': str(e)})
            if not sg['nodes']:
                return self._send(404, {'error': f'no subgraph {name!r}'})
            return self._send(200, sg)
        if path.startswith('/projection/'):
            name = posixpath.basename(path)
            if name not in PROJECTIONS:
                return self._send(404, {'error': f'no projection {name!r}',
                                        'available': sorted(PROJECTIONS)})
            try:
                return self._send(200, project(name, db))
            except Exception as e:
                # Say what actually went wrong. A renderer that silently draws
                # nothing is the failure mode this whole build is guarding
                # against, so never return an empty graph on error.
                return self._send(503, {'error': str(e),
                                        'hint': 'is the DBMS running in Neo4j Desktop?'})
        return super().do_GET()

    def do_PUT(self):
        parsed = urlparse(self.path)
        path = parsed.path
        db = (parse_qs(parsed.query).get('db') or [None])[0]
        if not path.startswith('/subgraph/'):
            return self._send(404, {'error': 'PUT only to /subgraph/<name>'})
        name = posixpath.basename(path)
        try:
            n = int(self.headers.get('Content-Length') or 0)
            payload = json.loads(self.rfile.read(n) or b'{}')
        except Exception as e:
            return self._send(400, {'error': f'bad JSON: {e}'})
        if not isinstance(payload.get('nodes'), list):
            return self._send(400, {'error': 'need {"nodes":[...],"edges":[...]}'})
        try:
            return self._send(200, put_subgraph(name, payload, db or ASPECT_DB))
        except Exception as e:
            return self._send(503, {'error': str(e)})

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        db = (parse_qs(parsed.query).get('db') or [None])[0]
        # Writing to disk is a POST, not a GET. A GET that changes the world is
        # a GET something will eventually prefetch.
        if path.startswith('/subgraph/') and path.endswith('/file'):
            name = path[len('/subgraph/'):-len('/file')]
            try:
                n = int(self.headers.get('Content-Length') or 0)
                body = json.loads(self.rfile.read(n) or b'{}') if n else {}
                return self._send(200, aspect_file.write_file(
                    name, db or ASPECT_DB, body.get('positions')))
            except Exception as e:
                return self._send(503, {'error': str(e)})
        return self._send(404, {'error': 'POST only to /subgraph/<name>/file'})

    def log_message(self, fmt, *args):
        if '/projection' in (args[0] if args else ''):
            sys.stderr.write("  %s\n" % (fmt % args))


INDEX = """<!doctype html><meta charset=utf-8><title>RCN Substrate — projections</title>
<style>body{font:16px/1.6 system-ui;max-width:44rem;margin:3rem auto;padding:0 1.5rem;color:#16233b}
code{background:#f1f5f9;padding:.1em .35em;border-radius:4px;font-size:.9em}
a{color:#0f766e}h1{font-size:1.5rem}li{margin:.5rem 0}</style>
<h1>RCN Substrate — projections</h1>
<p>One graph, read several ways. Each link is one named Cypher query returning one
lens, in graph-tool's native schema.</p>
<ul>
<li><a href="/projection/causal">/projection/causal</a> — polarity, magnitude, relation family</li>
<li><a href="/projection/schema">/projection/schema</a> &mdash; <b>the substrate describing itself</b>: node kinds, their properties, the relationships between them, with live counts</li>
<li><a href="/projection/structure">/projection/structure</a> — the entity-relationship reading: part-of, is-a, acts-in, depends-on. No signs, because a structural relation does not have one</li>
<li><a href="/projection/gold">/projection/gold</a> — provenance: who drew what, and where two hands met</li>
<li><a href="/projection">/projection</a> — what is available, and which databases exist</li>
</ul>
<p>Add <code>?db=composite26</code> to read the 26-node signed EIP CLD instead of the
six-node reference. <b>Same query, same renderer — only the data grows.</b></p>
<h1>Rendered</h1>
<ul>
<li><a href="/substrate/substrate-intro.html"><b>Substrate — Introduction</b></a> · <a href="/substrate/substrate-manual.html">User Manual</a> — what this is, what it refuses to do, and how to run it</li>
<li><a href="/tools/graph-tool-v22.html?url=%2Fprojection%2Fschema"><b>graph-tool ← the schema itself</b></a> — what is actually in the database, drawn from the database</li>
<li><a href="/tools/schema-sunburst.html?db=aspects16"><b>sunburst ← the vocabulary</b></a> — family → schema → variable as rings, arc width = witness count. No causal edges: a tree cannot hold a loop</li>
<li><a href="/tools/graph-tool-v22.html?url=%2Fprojection%2Fstructure%3Fdb%3Daspects16">graph-tool ← structure</a> — the ERD reading of the 16 drawings</li>
<li><a href="/tools/graph-tool-v22.html?url=%2Fprojection%2Fcausal%3Fdb%3Daspects16">graph-tool ← causal</a> — the CLD reading of the 16 drawings</li>
<li><a href="/tools/graph-tool-v22.html?url=/projection/causal">graph-tool ← causal</a> — n=6 reference</li>
<li><a href="/tools/graph-tool-v22.html?url=%2Fprojection%2Fcausal%3Fdb%3Dcomposite26">graph-tool ← causal</a> — 26-node composite</li>
<li><a href="/one-thing-many-views.html">the harness ← gold</a></li>
</ul>
"""

if __name__ == '__main__':
    try:
        n = run("MATCH (n:Concept) RETURN count(n) AS c")[0]['c']
    except Exception as e:
        sys.exit(f"cannot reach Neo4j — {e}")
    print(f"substrate api  http://localhost:{PORT}/   db={DATABASE}  concepts={n}")
    print(f"  /projection/causal   /projection/gold")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
