"""Convert 'CHW Network.svg' (OmniGraffle, WA Health as Network) to RCN Graph Tool JSON.

Node fill and edge stroke both encode which sub-network an element belongs to;
the SVG's own top-left text block names those sub-networks, and those names
become the legend rows.
"""
import re, math, json, html

SVG = "/Users/marcpierson/Downloads/CHW Network.svg"
OUT = "/Users/marcpierson/rcn/tools/wa-health-as-network.json"

src = open(SVG).read()
groups = re.findall(r'<g id="([^"]+)">(.*?)</g>', src, re.S)


def clean(body):
    ts = re.findall(r'<tspan[^>]*>(.*?)</tspan>', body, re.S)
    s = ' '.join(t.strip() for t in ts)
    s = html.unescape(s)
    s = re.sub(r'(\w)-\s+(\w)', r'\1\2', s)      # rejoin "Associa- tions"
    s = s.replace('“', '"').replace('”', '"')
    return re.sub(r'\s+', ' ', s).strip()


# ── nodes ───────────────────────────────────────────────────────────────
nodes_raw = []
for gid, body in groups:
    m = re.search(r'<(circle|ellipse)([^/]*)fill="([^"]+)"', body)
    if not m:
        continue
    b = m.group(2)
    rr = re.search(r'\br="([-\d.]+)"', b) or re.search(r'rx="([-\d.]+)"', b)
    nodes_raw.append(dict(
        gid=gid,
        x=round(float(re.search(r'cx="([-\d.]+)"', b).group(1)), 1),
        y=round(float(re.search(r'cy="([-\d.]+)"', b).group(1)), 1),
        r=float(rr.group(1)), fill=m.group(3), label=clean(body)))

# ── edges ───────────────────────────────────────────────────────────────
lines = []
for gid, body in groups:
    for m in re.finditer(r'<line([^/]*)/>', body):
        a = m.group(1)
        g = lambda k: float(re.search(k + r'="([-\d.]+)"', a).group(1))
        st = re.search(r'stroke="([^"]+)"', a)
        w = re.search(r'stroke-width="([\d.]+)"', a)
        lines.append(dict(gid=gid, x1=g('x1'), y1=g('y1'), x2=g('x2'), y2=g('y2'),
                          stroke=st.group(1) if st else 'black',
                          w=float(w.group(1)) if w else 1.0,
                          dash='dasharray' in a))


def nearest(x, y):
    best, bd = None, 1e18
    for n in nodes_raw:
        d = math.hypot(n['x'] - x, n['y'] - y) - n['r']
        if d < bd:
            bd, best = d, n
    return best, bd


# ── sector of a node, from its fill ─────────────────────────────────────
SECTOR_BY_FILL = {
    '#00e310': 'person',
    '#00cb09': 'ace',
    '#ff2818': 'navigator',
    '#f0fec5': 'goodlife', '#eefecb': 'goodlife',
    '#b669b1': 'community',
    '#1d9ce1': 'clinical', '#329bff': 'clinical', '#ff9300': 'clinical',
    '#ffbc3b': 'clinical', '#00fdff': 'clinical', '#ffcdef': 'clinical',
    '#ffddcb': 'social', '#d8deff': 'social',
    '#8735ca': 'payer', '#a846fa': 'payer', '#cca5ff': 'payer', '#ff46b4': 'payer',
    'white': 'infra',
}
ROW = {s: 'lg_' + s for s in
       ['person', 'ace', 'navigator', 'goodlife', 'community', 'clinical', 'social', 'payer', 'infra']}
SCHEMA = {'person': 'Person', 'ace': 'RiskFactor', 'navigator': 'Role', 'goodlife': 'LifeDomain',
          'community': 'CommunityFunction', 'clinical': 'Service', 'social': 'Service',
          'payer': 'Org', 'infra': 'Infrastructure'}


def sector(fill):
    if fill.startswith('url('):
        return 'clinical'          # the orange→grey gradient = hospital / facility
    return SECTOR_BY_FILL.get(fill, 'infra')


# ── edge family, from stroke + dash ─────────────────────────────────────
def family(e):
    s, d = e['stroke'], e['dash']
    if s == '#00e310':                       return 'lg_e_person'
    if s == '#ff2818':                       return 'lg_e_ace'
    if s in ('#333dd0', '#353ece'):          return 'lg_e_social'
    if s in ('#fc54e8', '#a846fa'):          return 'lg_e_payer'
    if s in ('#dfdb3b', '#ccc835'):          return 'lg_e_ach'
    if s in ('#879072', '#927d72', '#71907c'): return 'lg_e_medical'
    if s == 'black':                         return 'lg_e_medical' if d else 'lg_e_core'
    return 'lg_e_medical'


slug_seen = {}
def slug(n):
    base = re.sub(r'[^a-z0-9]+', '_', n['label'].lower()).strip('_')[:38] or 'unlabeled'
    if base in slug_seen:
        slug_seen[base] += 1
        base = f'{base}_{slug_seen[base]}'
    else:
        slug_seen[base] = 1
    return base


ids = {}
nodes = []
for n in nodes_raw:
    sec = sector(n['fill'])
    nid = slug(n)
    ids[n['gid']] = nid
    size = max(70, round(n['r'] * 2))
    props = {'_sector': sec, '_svgFill': n['fill'], '_svgId': n['gid']}
    label = n['label']
    if not label:
        label = '(unlabeled)'
        props['_note'] = 'Unlabeled placeholder circle in the source drawing'
    # the composition key: two "Friends, Neighborhood & Associations" nodes exist,
    # one in each sub-network. props.name lets the Composer merge them.
    props['name'] = label
    nodes.append(dict(id=nid, type=ROW[sec], schemaLabel=SCHEMA[sec], label=label,
                      shape='ellipse', x=n['x'], y=n['y'], w=size, h=size,
                      fontSize=9, fontColor='#000000', props=props))

edges = []
for i, l in enumerate(lines, 1):
    a, da = nearest(l['x1'], l['y1'])
    b, db = nearest(l['x2'], l['y2'])
    if a is None or b is None or a is b:
        raise SystemExit(f'unmatched line {l["gid"]}')
    edges.append(dict(id=f'e{i:03}', type=family(l), src=ids[a['gid']], tgt=ids[b['gid']],
                      polarity='none', arrowDir='none',
                      props={'_svgId': l['gid'], '_svgStroke': l['stroke']}))

# ── inferred grouping ───────────────────────────────────────────────────
# 19 nodes carry no line at all. They are drawn as rings of touching circles
# around a hub (gaps of 1-20px), which is how the source says "part of" without
# drawing it. Those relations are real but INFERRED, so they get their own
# legend row, a dotted grey style, and a basis on every edge -- select the row
# and delete to get back to strictly-what-was-drawn.
# Keyed by (label, approximate x) so a duplicated label still resolves uniquely.
CLUSTERS = {
    'Information Technology': ['EMRs', 'HIE', 'Claims', 'Analytics', 'Reporting Notifying',
                               'PHR', 'Self-care Support & Coordination Platform'],
    'System Level Governance & Development': ['Strategic Investment', 'HIE', 'Claims Data',
                                              'Analytics', 'Reporting Notifying',
                                              'Develop & Improve System(s)', 'Insurance Risk'],
    'Community COACHNAVIGATORs connected to "no barrier" services On SCP Platform': [
        'CHWs as Navigator / Coaches', 'Shared Care Plan Platform', 'Supported Patient Activation'],
    'Diagnostic and Medical Treatment Services': ['Nonalopathic services',
                                                  'OTC and unregulated substances'],
}
by_label = {}
for n in nodes:
    by_label.setdefault(n['label'], []).append(n)


def pick(label, near):
    """Resolve a label to the instance closest to `near` (labels repeat across clusters)."""
    cands = by_label.get(label)
    if not cands:
        raise SystemExit(f'no node labelled {label!r}')
    return min(cands, key=lambda n: math.hypot(n['x'] - near['x'], n['y'] - near['y']))


i = len(edges)
inferred = 0
for hub_label, members in CLUSTERS.items():
    hubs = by_label.get(hub_label)
    if not hubs:
        raise SystemExit(f'no hub labelled {hub_label!r}')
    hub = hubs[0]
    for mem_label in members:
        mem = pick(mem_label, hub)
        i += 1
        inferred += 1
        edges.append(dict(id=f'e{i:03}', type='lg_e_group', src=mem['id'], tgt=hub['id'],
                          polarity='none', arrowDir='none',
                          props={'basis': 'INFERRED from the drawing, not drawn as a line: '
                                          'this circle touches the hub circle in a ring of siblings'}))
print('inferred grouping edges:', inferred)

# ── the McKnight & Block annotation that sits beside the seven functions ─
quote = clean(dict(groups)['Graphic_40'])
nodes.append(dict(id='mcknight_block_note', type='lg_note', schemaLabel='Annotation',
                  label=quote, shape='hexagon', x=210, y=560, w=380, h=250,
                  fontSize=9, fontColor='#000000',
                  props={'_source': 'Quoted in the source drawing, with attribution'}))

legend = [
    {'id': 'lg_person',    'kind': 'node', 'label': 'Person & family at home', 'color': '#00e310', 'borderColor': '#0f172a', 'borderWidth': 3},
    {'id': 'lg_navigator', 'kind': 'node', 'label': 'Coach / navigator (the Triple Play)', 'color': '#ff2818', 'borderColor': '#0f172a', 'borderWidth': 3},
    {'id': 'lg_goodlife',  'kind': 'node', 'label': '"A good life" domains — neighborhood system', 'color': '#f0fec5', 'borderColor': '#65a30d', 'borderWidth': 1.5},
    {'id': 'lg_community', 'kind': 'node', 'label': 'The seven community functions', 'color': '#b669b1', 'borderColor': '#701a75', 'borderWidth': 1.5},
    {'id': 'lg_clinical',  'kind': 'node', 'label': 'Medical sector — primary care, specialists, hospital, diagnostics, BH', 'color': '#1d9ce1', 'borderColor': '#0c4a6e', 'borderWidth': 1.5},
    {'id': 'lg_social',    'kind': 'node', 'label': 'Social services, justice & NGO sector', 'color': '#ffddcb', 'borderColor': '#c2410c', 'borderWidth': 1.5},
    {'id': 'lg_payer',     'kind': 'node', 'label': 'Payers, purchasers & government', 'color': '#a846fa', 'borderColor': '#5b21b6', 'borderWidth': 1.5},
    {'id': 'lg_infra',     'kind': 'node', 'label': 'Infrastructure, IT & system governance', 'color': '#ffffff', 'borderColor': '#353ece', 'borderWidth': 1.5},
    {'id': 'lg_ace',       'kind': 'node', 'label': 'Adverse Childhood Events', 'color': '#00cb09', 'borderColor': '#b91c1c', 'borderWidth': 3},
    {'id': 'lg_note',      'kind': 'node', 'label': "Author's annotation", 'color': '#fffbeb', 'borderColor': '#d97706', 'borderWidth': 1.5},

    {'id': 'lg_e_core',    'kind': 'edge', 'label': 'The Triple Play spine', 'color': '#000000', 'width': 5, 'dash': 'solid', 'linkFamily': 'Agency'},
    {'id': 'lg_e_person',  'kind': 'edge', 'label': 'Person & family network', 'color': '#00e310', 'width': 4, 'dash': 'solid', 'linkFamily': 'Provision'},
    {'id': 'lg_e_medical', 'kind': 'edge', 'label': 'Medical sector network', 'color': '#879072', 'width': 1.5, 'dash': 'dashed', 'linkFamily': 'Provision'},
    {'id': 'lg_e_social',  'kind': 'edge', 'label': 'Social services network', 'color': '#333dd0', 'width': 3, 'dash': 'solid', 'linkFamily': 'Provision'},
    {'id': 'lg_e_payer',   'kind': 'edge', 'label': 'Government & payer network', 'color': '#fc54e8', 'width': 3, 'dash': 'solid', 'linkFamily': 'Provision'},
    {'id': 'lg_e_ach',     'kind': 'edge', 'label': 'ACH / system governance', 'color': '#dfdb3b', 'width': 3, 'dash': 'solid', 'linkFamily': 'Composition'},
    {'id': 'lg_e_ace',     'kind': 'edge', 'label': 'Adverse Childhood Events', 'color': '#ff2818', 'width': 4, 'dash': 'solid', 'linkFamily': 'Influence'},
    {'id': 'lg_e_group',   'kind': 'edge', 'label': 'grouped by proximity — INFERRED, not drawn', 'color': '#94a3b8', 'width': 1.5, 'dash': 'dotted', 'linkFamily': 'Composition'},
]

doc = {
    'version': '1.0',
    'modelName': 'NETWORKS: Communities, Sectors & Systems — WA Health as Network',
    'modelNote': ('Actor map converted from an OmniGraffle SVG ("CHW Network.svg", titled "WA Health as Network"). '
                  '97 actors, 137 undirected relationships, plus one quoted annotation. '
                  'The source overlays seven sub-network diagrams on one canvas, named in its own top-left key: '
                  'Person and Family, Neighborhood System, Medical Sector (specialists & hospital), Navigator Coach, '
                  'Social Services, Government Sector, and NGO Sector. Node fill and edge stroke both encoded which '
                  'sub-network an element belonged to, so those became the legend rows. '
                  'The subtitle calls it "An artifact for exploratory conversations." '
                  'The lines carry no arrowheads, so every edge is undirected (arrowDir "none") and unsigned — this is an '
                  'actor map, not a causal model. Do not read direction into it. '
                  '"Friends, Neighborhood & Associations" appears twice, once in the Person & Family network and once in '
                  'the community-functions cluster; both are kept, sharing a props.name so the Graph Composer can merge them. '
                  'Two amber circles in the diagnostics cluster are unlabeled in the source and are kept as placeholders. '
                  '19 circles carry no line at all; the source groups them as rings of touching circles around a hub '
                  '(Information Technology, System Level Governance, the Triple Play trio, and the diagnostics cluster). '
                  'Those 19 relations are recorded as a separate legend row, dotted grey, labelled INFERRED and carrying a '
                  'props.basis — select that row and delete it to get back to strictly what was drawn. '
                  'Coordinates are the original drawing\'s.'),
    'canvasBg': '#ffffff',
    'legendVisible': True,
    # 18 rows is well over the 6-8 the panel advises: the source overlays seven
    # sub-networks and ten sectors, and an expanded legend covers the drawing.
    # Open collapsed to a LEGEND (n) bar; the chevron expands it.
    'legendCollapsed': True,
    'legendEntries': legend,
    'nodes': nodes,
    'edges': edges,
    'lines': [],
    'metaEdges': [],
}

json.dump(doc, open(OUT, 'w'), indent=2, ensure_ascii=False)
open(OUT, 'a').write('\n')
print(f'wrote {OUT}: {len(nodes)} nodes, {len(edges)} edges, {len(legend)} legend rows')
from collections import Counter
print('node rows :', Counter(n["type"] for n in nodes).most_common())
print('edge rows :', Counter(e["type"] for e in edges).most_common())
