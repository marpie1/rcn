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
import json, os, sys, posixpath
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from db import run, BASE, DATABASE
import aspect_file
aspect_file.configure(BASE)

PORT = int(os.environ.get('PORT', 8768))

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

_NODE_PREAMBLE = """
MATCH (n:Concept)
WITH n ORDER BY n.id
WITH collect(n) AS ns, count(*) AS total
UNWIND range(0, total - 1) AS i
WITH ns[i] AS n, i, total
OPTIONAL MATCH (n)-[:IN_FAMILY]->(f:Family)
"""

CAUSAL_NODES = _NODE_PREAMBLE + f"""
RETURN n.id AS id, n.variableLabel AS label,
       {RING[0]} AS x, {RING[1]} AS y,
       n.w AS w, n.h AS h, n.shape AS shape,
       f.fill AS color, f.color AS borderColor,
       {{schemaLabel:n.schemaLabel, family:f.name, mode:n.mode,
         gold: size(n.sources) > 1}} AS props
ORDER BY id
"""

CAUSAL_EDGES = """
MATCH (s:Concept)-[r:REL]->(t:Concept)
RETURN r.id AS id, s.id AS src, t.id AS tgt,
       r.label AS label, r.polarity AS polarity,
       {linkFamily:r.linkFamily, magnitude:r.magnitude, rel:r.rel,
        mode:r.mode, gold: size(r.sources) > 1} AS props
ORDER BY id
"""

# Provenance. The federation lens: who drew what, and where two hands met.
GOLD_NODES = _NODE_PREAMBLE + f"""
RETURN n.id AS id, n.variableLabel AS label,
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
MATCH (n:Concept) WHERE $aspect IN n.sources
WITH n ORDER BY n.id
WITH collect(n) AS ns, count(*) AS total
UNWIND range(0, total - 1) AS i
WITH ns[i] AS n, i, total
OPTIONAL MATCH (n)-[:IN_FAMILY]->(f:Family)
RETURN n.id AS id, n.variableLabel AS label,
       round(460 + 300 * cos(6.28318530718 * i / total)) AS x,
       round(330 + 235 * sin(6.28318530718 * i / total)) AS y,
       n.w AS w, n.h AS h, n.shape AS shape,
       f.fill AS color, f.color AS borderColor, n.schemaLabel AS schemaLabel,
       {family:f.name, mode:n.mode, sources:n.sources,
        gold: size(n.sources) > 1, shared: size(n.sources) > 1} AS props
ORDER BY id
"""

SUBGRAPH_EDGES = """
MATCH (s:Concept)-[r:REL]->(t:Concept) WHERE $aspect IN r.sources
RETURN r.id AS id, s.id AS src, t.id AS tgt,
       r.label AS label, r.polarity AS polarity,
       {linkFamily:r.linkFamily, rel:r.rel, mode:r.mode, sources:r.sources,
        gold: size(r.sources) > 1} AS props
ORDER BY id
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
    'causal':    (CAUSAL_NODES, CAUSAL_EDGES),
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
SCHEMA_KINDS = ['Concept', 'Family', 'LinkFamily', 'Aspect', 'Instance']
SCHEMA_PLACE = {                       # hand-placed: five boxes read better than a ring
    'Concept':    (440, 300), 'Family':  (110, 150), 'LinkFamily': (110, 450),
    'Aspect':     (780, 150), 'Instance': (780, 450),
}
SCHEMA_COLOR = {
    'Concept':    ('#dbeafe', '#1d4ed8'), 'Family':   ('#dcfce7', '#15803d'),
    'LinkFamily': ('#fef3c7', '#b45309'), 'Aspect':   ('#f3e8ff', '#7c3aed'),
    'Instance':   ('#ffe4e6', '#be123c'),
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


def subgraph(aspect, database=ASPECT_DB):
    nodes = run(SUBGRAPH_NODES, {'aspect': aspect}, database=database)
    edges = run(SUBGRAPH_EDGES, {'aspect': aspect}, database=database)
    # LAYOUT COMES FROM THE FILE, NOT THE RING. The substrate stores no
    # coordinates by design, but a drawing opened from it should still be the
    # arrangement its author made. The synthetic ring is the fallback for a
    # concept the file has never placed.
    lay = aspect_file.layout_of(aspect)
    for n in nodes:
        for k in [k for k, v in n.items() if v is None]:
            del n[k]
        xy = lay.get(n.get('schemaLabel'))
        if xy:
            n['x'], n['y'] = xy
    return {'version': '1.0', 'modelName': aspect, 'subgraph': aspect,
            'nodes': nodes, 'edges': edges, 'lines': []}


def put_subgraph(aspect, payload, database=ASPECT_DB):
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
    orphaned_e = run("MATCH ()-[r:REL]->() WHERE size(r.sources) = 0 "
                     "DELETE r RETURN count(r) AS c", database=database)[0]['c']
    orphaned_n = run("MATCH (c:Concept) WHERE size(c.sources) = 0 "
                     "DETACH DELETE c RETURN count(c) AS c", database=database)[0]['c']

    for n in payload.get('nodes', []):
        schema = n.get('schemaLabel') or (n.get('props') or {}).get('schemaLabel') \
                 or n.get('label') or n.get('id')
        nid = ''.join(str(schema).split()).lower()
        run("""MERGE (c:Concept {id:$id})
               ON CREATE SET c.schemaLabel=$sl, c.variableLabel=$vl, c.mode='EIP',
                             c.sources=[], c.w=$w, c.h=$h, c.shape=$sh
               SET c.variableLabel = coalesce($vl, c.variableLabel),
                   c.sources = CASE WHEN $a IN c.sources THEN c.sources
                               ELSE c.sources + $a END""",
            dict(id=nid, sl=''.join(str(schema).split()),
                 vl=n.get('label'), w=n.get('w', 110), h=n.get('h', 60),
                 sh=n.get('shape', 'ellipse'), a=aspect), database=database)

    for e in payload.get('edges', []):
        run("""MATCH (s:Concept {id:$src}), (t:Concept {id:$tgt})
               MERGE (s)-[r:REL {label:$label}]->(t)
               ON CREATE SET r.id=$id, r.mode='EIP', r.rel='before', r.sources=[]
               SET r.polarity=$pol,
                   r.linkFamily = coalesce($lf, r.linkFamily),
                   r.sources = CASE WHEN $a IN r.sources THEN r.sources
                               ELSE r.sources + $a END""",
            dict(src=str(e.get('src', '')).lower(), tgt=str(e.get('tgt', '')).lower(),
                 label=e.get('label', ''), id=e.get('id') or f"w_{aspect}_{e.get('src')}_{e.get('tgt')}",
                 pol=e.get('polarity', 'none'),
                 lf=(e.get('props') or {}).get('linkFamily'), a=aspect),
            database=database)

    after = run("MATCH (c:Concept) WHERE $a IN c.sources RETURN count(c) AS c",
                kw, database=database)[0]['c']
    return {'subgraph': aspect, 'conceptsBefore': before, 'conceptsAfter': after,
            'nodesWritten': len(payload.get('nodes', [])),
            'edgesWritten': len(payload.get('edges', [])),
            'deletedLastWitnessNodes': orphaned_n,
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
    ThreadingHTTPServer(('127.0.0.1', PORT), Handler).serve_forever()
