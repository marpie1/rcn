"""Split wa-health-as-network.json into the sub-networks its source names.

The SVG this came from overlaid seven sub-network diagrams on one canvas and
listed them in its own top-left key. Edge colour said which one an edge belonged
to, and that became a legend row. So the decomposition is not invented here --
it is the author's own, run backwards.

Each subgraph gets the edges of one family plus every node those edges touch.
A node touched by more than one family appears in more than one file; the
Composer merges them on schemaLabel + label (+ props.name), which is why every
node carries all three.

    python3 tools/split-wa-health-aspects.py
"""
import json, os, re, collections

SRC = 'tools/wa-health-as-network.json'
DIR = 'tools/wa-health-aspects'

# row id -> (filename, Beam title, the relation verb shown on every edge)
ASPECTS = [
    ('lg_e_core',    'triple-play-spine',        'Navigator Coach — the Triple Play spine',       'works directly with'),
    ('lg_e_person',  'person-family-network',    'Person & Family network',                       'is part of a good life for'),
    ('lg_e_medical', 'medical-sector-network',   'Medical Sector — specialists & hospital',       'refers or treats with'),
    ('lg_e_social',  'social-services-network',  'Social Services network',                       'coordinates services with'),
    ('lg_e_payer',   'government-payer-network', 'Government & Payer network',                    'pays or governs'),
    ('lg_e_ach',     'ach-system-governance',    'ACH / system governance',                       'convenes with'),
    ('lg_e_ace',     'adverse-childhood-events', 'Adverse Childhood Events',                      'is harmed by'),
    ('lg_e_group',   'infrastructure-clusters',  'Infrastructure clusters (INFERRED, not drawn)', 'is part of'),
]

g = json.load(open(SRC))
nodes = {n['id']: n for n in g['nodes']}
rows = {r['id']: r for r in g['legendEntries']}

os.makedirs(DIR, exist_ok=True)
written, appearances = [], collections.Counter()

for row_id, fname, title, relation in ASPECTS:
    edges = [e for e in g['edges'] if e.get('type') == row_id]
    if not edges:
        raise SystemExit(f'no edges for {row_id}')
    keep = []
    for e in edges:
        keep += [e['src'], e['tgt']]
    keep = sorted(set(keep), key=lambda i: (nodes[i]['y'], nodes[i]['x']))
    for i in keep:
        appearances[i] += 1

    sub_nodes = []
    for i in keep:
        n = dict(nodes[i])
        n['props'] = dict(n.get('props', {}))
        n['props']['_aspect'] = fname
        sub_nodes.append(n)

    # the legend rows this subgraph actually uses, so it opens correctly on its
    # own in the Graph Tool. The Composer ignores authored fills entirely.
    used_rows = {n['type'] for n in sub_nodes if n.get('type')} | {row_id}
    legend = [rows[r] for r in rows if r in used_rows]

    doc = {
        'version': '1.0',
        'modelName': f'WA Health — {title}',
        'modelNote': (f'One of eight sub-networks split out of {os.path.basename(SRC)} for the '
                      f'RCN Graph Composer. Contains every "{rows[row_id]["label"]}" relationship '
                      f'and the actors it touches. Nodes shared with other sub-networks merge in '
                      f'the Composer on schemaLabel + label. Edges are undirected and unsigned — '
                      f'this is an actor map, not a causal model.'),
        'canvasBg': '#ffffff',
        'legendVisible': True,
        'legendCollapsed': True,
        'legendEntries': legend,
        'nodes': sub_nodes,
        # Give the edges a readable relation name. The main map leaves them
        # unlabelled on purpose -- 156 labels on a dense actor map is noise --
        # but the Composer shows the edge label as the relation between
        # concepts, and "lg_e_person" is not a relation anyone can say aloud.
        'edges': [dict(e, label=relation) for e in edges],
        'lines': [],
        'metaEdges': [],
    }
    path = f'{DIR}/{fname}.json'
    json.dump(doc, open(path, 'w'), indent=2, ensure_ascii=False)
    open(path, 'a').write('\n')
    written.append((fname, len(sub_nodes), len(edges)))

total_slots = sum(n for _, n, _ in written)
distinct = len({i for i in appearances})
print(f'{len(written)} subgraphs -> {DIR}/')
for f, n, e in written:
    print(f'  {f:28} {n:3} nodes  {e:3} edges')
print(f'\n{total_slots} node slots across {distinct} distinct actors '
      f'-- the Composer merges {total_slots - distinct} of them away')
multi = {i: c for i, c in appearances.items() if c > 1}
print(f'{len(multi)} actors bridge two or more sub-networks; the widest:')
for i, c in sorted(multi.items(), key=lambda kv: -kv[1])[:5]:
    print(f'  {c}x  {nodes[i]["label"][:58]}')
dropped = [n['label'][:40] for n in g['nodes'] if n['id'] not in appearances]
if dropped:
    print(f'\nnot in any subgraph (no edges): {dropped}')
