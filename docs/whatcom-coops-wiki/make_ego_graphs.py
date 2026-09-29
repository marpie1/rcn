"""
make_ego_graphs.py — one nearest-neighbour graph per co-op, cut from Marc's
hand-made layout (tools/whatcom-coops-graph.json).

Each model is the co-op plus every co-op it has a documented tie to, with the
ties among that set. Positions are Marc's, not a new layout, so each small
graph reads as a window onto the big one. Written to diagrams/<mapId>.rcn.json;
the SVG for each is rendered by the Graph Tool itself (see README.md).
"""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
g = json.load(open(os.path.join(REPO, 'tools', 'whatcom-coops-graph.json'), encoding='utf-8'))
byid = {n['id']: n for n in g['nodes']}
out = os.path.join(HERE, 'diagrams')
for n in g['nodes']:
    ego = {n['id']}
    for e in g['edges']:
        if e['src'] == n['id']: ego.add(e['tgt'])
        if e['tgt'] == n['id']: ego.add(e['src'])
    m = {k: v for k, v in g.items() if k not in ('nodes', 'edges')}
    m['modelName'] = n['label'] + ' — nearest neighbours'
    m['modelNote'] = ('%s and every co-op it has a documented tie to, cut from the Co-ops of Whatcom County graph '
                      '(Marc Pierson’s layout). Ties are sourced; see each edge note.' % n['label'])
    m['nodes'] = [dict(byid[i]) for i in byid if i in ego]
    m['edges'] = [e for e in g['edges'] if e['src'] in ego and e['tgt'] in ego]
    m['legendVisible'] = False
    for x in m['nodes']:
        if x['id'] == n['id']:
            x['borderWidth'] = 5
    json.dump(m, open(os.path.join(out, n['props']['mapId'] + '.rcn.json'), 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)
    print('%-6s %2d nodes %2d edges' % (n['props']['mapId'], len(m['nodes']), len(m['edges'])))
