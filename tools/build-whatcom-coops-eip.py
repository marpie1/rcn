import json
from urllib.parse import quote

OUT = '/Users/marcpierson/rcn/tools/whatcom-coops-eip.json'
# Relative links: the deployed form is one flat asset folder holding the map, the
# tool, this sketch and its areas file. The Graph Tool rewrites them to /maps/ on localhost.
MAP = 'rcn_map.html'
coops = json.load(open('/Users/marcpierson/rcn/tools/issue-data/whatcom-wa--cooperatives.json'))
P = {p['id']: p for p in coops['parcels']}
KIND_BORDER = {t: v['color'] for t, v in coops['types'].items()}

EIP_URL = 'whatcom-coops-eip.json'
def view(lat, lng, z, id=None):
    # Opens the RCN Map's EIP layer on this area (its polygon id equals the node id).
    return f'{MAP}?eip={EIP_URL}&sel={id}' if id else f'{MAP}?lat={lat}&lng={lng}&zoom={z}&openissue=whatcom-wa--cooperatives'

# Where the institutions that are not co-ops stand (US Census geocoder, Sep 2026, unless marked approximate).
INST_GEO = {
  'wleg':  (47.0359, -122.9049, 'Legislative Building, Olympia — approximate (Capitol campus)'),
  'ecy':   (47.04503, -122.81310, '300 Desmond Dr SE, Lacey'),
  'doh':   (46.98535, -122.90691, '111 Israel Rd SE, Tumwater'),
  'bcc':   (48.75496, -122.47832, 'Bellingham City Hall, 210 Lottie St'),
  'lyn':   (48.94510, -122.45309, 'Lynden City Hall, 300 4th St'),
  'usfs':  (47.97883, -122.20731, 'Mt. Baker-Snoqualmie NF supervisor, 2930 Wetmore Ave, Everett'),
  'nps':   (48.51054, -122.22821, 'North Cascades NP Service Complex, 810 State Route 20, Sedro-Woolley'),
  'usda':  (38.88752, -77.03205, 'USDA, 1400 Independence Ave SW, Washington DC'),
  'fuj':   (48.4757, -122.3254, 'Burlington, WA — approximate (no published office address)'),
}

nodes, edges = [], []
def node(id, label, x, y, eip, color, border, note='', mapURL=None, props=None, w=160, h=56):
    n = {'id': id, 'label': label, 'x': x, 'y': y, 'w': w, 'h': h, 'shape': 'rounded',
         'color': color, 'borderColor': border, 'borderWidth': 2.5, 'borderDash': 'solid',
         'fontSize': 12, 'fontColor': '#0f172a', 'extraLabels': [], 'note': note,
         'props': props or {}, 'eipType': eip,
         'eipCol': {'EcoZone': 'E', 'Jurisdiction': 'P'}.get(eip, 'I')}
    if mapURL: n['mapURL'] = mapURL
    nodes.append(n)

KINDS = {
  'member':  ('Member of the network',            '#d4549a', 1.5, 'dotted'),
  'money':   ('Money — grant or loan fund',        '#d4a017', 3.5, 'solid'),
  'trade':   ('Trade — supplies goods',            '#1a7a4a', 3.5, 'solid'),
  'develop': ('Built or helped build',             '#8e5cc4', 3.5, 'dashed'),
  'rule':    ('Makes or applies a rule',           '#64748b', 2,   'dashed'),
  'governs': ('Governs this area (P)',             '#1d4ed8', 2,   'solid'),
  'actsP':   ('Acts in or serves this area (P)',   '#60a5fa', 2,   'dashed'),
  'actsE':   ('Uses or changes this area (E)',     '#15803d', 2.5, 'solid'),
}
def edge(src, tgt, kind, label, note):
    k = KINDS[kind]
    edges.append({'id': f'e{len(edges)+1}', 'src': src, 'tgt': tgt, 'label': label,
                  'type': 'lg_l_' + kind, 'color': k[1], 'width': k[2], 'dash': k[3],
                  'fontSize': 10, 'fontColor': k[1], 'curved': True, 'polarity': 'none',
                  'note': note, 'props': {'kind': k[0]}, 'delay': False, 'traces': []})

# ── E: areas (polygons) ─────────────────────────────────────────────
GREEN_E = '#bbf7d0'; EB = '#15803d'
node('nooksack', 'Nooksack River (WRIA 1 watershed)', 0, 160, 'EcoZone', GREEN_E, EB,
     'Darigold Lynden is the only direct industrial discharger to the Nooksack River (Ecology bacteria TMDL report).',
     view(48.85, -122.3, 10, 'nooksack'))
node('ejido', 'Ejido farm — 65 acres, Central Rd, Everson', 0, 470, 'EcoZone', GREEN_E, EB,
     'Former raspberry monocrop being converted to an organic, diverse farm by Cooperativa Tierra y Libertad (CAGJ farm visit 2022; PCC Sound Consumer 2023).',
     view(0, 0, 0, 'ejido'))
node('farmland', 'Whatcom & Skagit farmland', 0, 760, 'EcoZone', GREEN_E, EB,
     'The farms the Farm Fund, the Food Hub and the meat co-op serve.',
     view(0, 0, 0, 'farmland'))
node('ncascades', 'North Cascades (mountains)', 0, 1060, 'EcoZone', GREEN_E, EB,
     'Where Cascade Mountain Ascents guides.',
     view(0, 0, 0, 'ncascades'))

# ── P: jurisdictions (polygons) ─────────────────────────────────────
BLUE_P = '#dbeafe'; PB = '#1d4ed8'
for id, label, y, ll, note in [
  ('wa',      'Washington State',                    120, (47.4, -120.5, 6), ''),
  ('whatcom', 'Whatcom County',                      330, (48.83, -121.9, 9), ''),
  ('skagit',  'Skagit County',                       520, (48.48, -121.8, 9), ''),
  ('bham',    'City of Bellingham',                  700, (48.75, -122.48, 12), ''),
  ('lynden',  'City of Lynden',                      870, (48.946, -122.452, 13), ''),
  ('mbsnf',   'Mt Baker-Snoqualmie National Forest', 1040, (48.3, -121.6, 8), 'A federal land unit: the area within which the Forest Service permits commercial guiding.'),
  ('ncnp',    'North Cascades National Park',        1210, (48.7, -121.2, 9), 'A federal land unit: the area within which the Park Service permits guiding.'),
  ('usa',     'United States',                       1380, (39.8, -98.6, 4), ''),
]:
    node(id, label, 2400, y, 'Jurisdiction', BLUE_P, PB,
         note, view(*ll, id))

# ── I: blue institutions (govern a P area) ──────────────────────────
for id, label, y, shade in [
  ('wleg',   'WA State Legislature',              100, '#93c5fd'),
  ('ecy',    'WA Dept of Ecology',                 260, '#93c5fd'),
  ('doh',    'WA Dept of Health',                  420, '#93c5fd'),
  ('bcc',    'Bellingham City Council',            700, '#bfdbfe'),
  ('lyn',    'City of Lynden (Council & Public Works)', 870, '#bfdbfe'),
  ('usfs',   'US Forest Service',                 1040, '#60a5fa'),
  ('nps',    'National Park Service',             1210, '#60a5fa'),
  ('usda',   'USDA (Rural Development; FSIS meat inspection)', 1380, '#60a5fa'),
]:
    node(id, label, 1410, y, 'InstitutionP', shade, '#1d4ed8', w=160)

# ── I: rules made by institutions ───────────────────────────────────
LAW = '#f5f3ff'; LB = '#64748b'
node('capbud', '2022 state capital budget', 1230, 60, 'Law', LAW, LB,
     'Funded the Ejido Cooperative Farm at Everson: $250,000, plus a further $200,000 for the Ejido Farm project (WA House Democrats, Mar 2022).')
node('coopLaw', 'Washington cooperative corporation law', 1230, 200, 'Law', LAW, LB,
     'North Cascades Meat Producers formed as a Washington State cooperative corporation in July 2011 (NABC).')
node('permit', 'State discharge permit — Darigold Lynden', 1230, 340, 'Law', LAW, LB,
     'Condensate water is discharged to the Nooksack under Darigold’s permit from the state Department of Ecology (Lynden Tribune; Ecology TMDL report).')
node('bmc654', 'BMC 6.54 Taxicabs & for-hire vehicles', 1230, 760, 'Law', LAW, LB,
     'Bellingham Municipal Code chapter licensing taxicab businesses, vehicles and drivers; driver rules amended by Ordinance 2023-12-039.')

# ── I: co-ops and co-op support (ordinary I colour, border = co-op kind) ─
I_FILL = '#ede9fe'
coop_pos = {   # every co-op on the co-op map — none left out
  'c2c': (870, 330), 'tyl': (870, 500), 'a1': (870, 650), 'ncm': (870, 800), 'psfh': (870, 1000),
  'bbb': (870, 1120), 'cma': (870, 1250), 'cmc': (870, 1400), 'cdn': (870, 1550),
  'cc': (1050, 60), 'dari': (1050, 260), 'chs': (1050, 360), 'icu': (1050, 470), 'cfc': (1050, 640),
  'cab': (1050, 820), 'nabc': (1050, 980), 'nwcdc': (1050, 1150), 'col': (1050, 1320),
  'nccu': (1230, 920), 'wecu': (1230, 1060), 'wecu2': (1230, 1200), 'rei': (1230, 1340),
}
short = {'nwcdc': 'NW Cooperative Development Center', 'nabc': 'NW Agriculture Business Center',
         'psfh': 'Puget Sound Food Hub Co-op', 'dari': 'Darigold — Lynden plant',
         'ncm': 'North Cascades Meat Producers Co-op', 'col': 'Circle of Life Caregiver Co-op'}
for id, (x, y) in coop_pos.items():
    p = P[id]
    node(id, short.get(id, p['label']), x, y, 'Institution', I_FILL, KIND_BORDER[p['type']],
         p.get('notes', ''), props={'mapId': id, 'kind': coops['types'][p['type']]['label'],
                                    'lat': str(p['latLng'][0]), 'lng': str(p['latLng'][1])})
node('fuj', 'Familias Unidas por la Justicia (farmworker union)', 870, 160, 'Institution', I_FILL, '#94a3b8',
     'Independent farmworker union; Cooperativa Tierra y Libertad was formed by four of its members (USSEN 2018; Just Transition Alliance 2023).')

# ── I↔I ties, from the co-op issue file (sources ride along) ────────
# Every tie between the co-ops stays — all of them, membership lines included.
assert set(P) <= set(coop_pos), set(P) - set(coop_pos)
for l in coops['links']:
    edge(l['from'], l['to'], l['kind'], l.get('label') or '', l.get('notes') or '')
edge('fuj', 'tyl', 'develop', 'its members formed the co-op',
     'Cooperativa Tierra y Libertad was formed by four members of Familias Unidas por la Justicia. Source: USSEN 2018; Just Transition Alliance 2023.')

# ── Rules ───────────────────────────────────────────────────────────
edge('wleg', 'capbud', 'rule', 'passed', 'WA House Democrats, 2022 capital budget release.')
edge('capbud', 'c2c', 'money', '$250,000 for the Ejido farm', 'Community to Community received $250,000 for the Ejido Cooperative Farm at Everson, plus $200,000 for the Ejido Farm project. Source: WA House Democrats, Mar 8 2022.')
edge('wleg', 'coopLaw', 'rule', 'enacted', 'State cooperative law.')
edge('coopLaw', 'ncm', 'rule', 'incorporated under (2011)', 'Formed as a Washington State cooperative corporation, July 2011. Source: NW Agriculture Business Center.')
edge('ecy', 'permit', 'rule', 'issues', 'Source: Lynden Tribune; Ecology Nooksack bacteria TMDL report.')
edge('permit', 'dari', 'rule', 'permits discharge', 'Darigold discharges condensate under its Ecology permit. Source: Lynden Tribune.')
edge('bcc', 'bmc654', 'rule', 'made', 'BMC chapter 6.54; amended by Ordinance 2023-12-039.')
edge('bmc654', 'cab', 'rule', 'licenses taxicab businesses', 'Taxicab businesses need a business licence under BMC 6.54.030. Source: bellingham.municipal.codes.')
edge('doh', 'col', 'rule', 'licenses in-home care', 'Circle of Life is licensed by the Washington State Department of Health to provide in-home care. Source: circleoflife.coop.')
edge('usfs', 'cma', 'rule', 'guiding permit', 'CMA is an authorized transitional permittee of the US Forest Service in Mount Baker-Snoqualmie National Forest. Source: cascademountainascents.com/about.')
edge('nps', 'cma', 'rule', 'guiding permit', 'CMA is an authorized permittee or concessionaire of the National Park Service in North Cascades National Park (also Olympic and Rocky Mountain). Source: cascademountainascents.com/about.')
edge('usda', 'nabc', 'money', 'Rural Cooperative Development Grant', 'NABC helped North Cascades Meat Producers under a USDA Rural Cooperative Development Grant. Source: agbizcenter.org.')
edge('usda', 'ncm', 'rule', 'FSIS-inspected establishment', 'Listed as an FSIS-inspected establishment. Source: fsis.usda.gov.')

# ── Blue institutions govern their P areas ──────────────────────────
for i, p in [('wleg', 'wa'), ('ecy', 'wa'), ('doh', 'wa'), ('bcc', 'bham'), ('lyn', 'lynden'),
             ('usfs', 'mbsnf'), ('nps', 'ncnp'), ('usda', 'usa')]:
    edge(i, p, 'governs', '', '')

# ── Co-ops act in P areas ───────────────────────────────────────────
edge('icu', 'wa', 'actsP', 'membership: anyone living or working in WA', 'In 2000 ICU broadened its charter to serve anyone who lives or works in Washington State. Source: industrialcu.com.')
edge('cab', 'whatcom', 'actsP', 'serves all of Whatcom', 'Employee-owned since August 2023; serves all of Whatcom, limited service to Skagit. Source: yellowcabcoop.com.')
edge('col', 'whatcom', 'actsP', 'in-home care in Bellingham & Whatcom', 'Source: circleoflife.coop.')
edge('ncm', 'whatcom', 'actsP', 'member ranchers', 'Farmer-owned by Whatcom and Skagit ranchers; USDA slaughter and processing for Skagit, Whatcom, Island and Snohomish. Source: goskagit.com; agbizcenter.org.')
edge('ncm', 'skagit', 'actsP', 'member ranchers', 'Source: goskagit.com; agbizcenter.org.')
edge('psfh', 'skagit', 'actsP', 'based in Mount Vernon', 'Source: pugetsoundfoodhub.com.')
edge('psfh', 'whatcom', 'actsP', 'aggregation site, Cloud Mountain Farm Center, Everson', 'Cloud Mountain Farm Center is the Food Hub’s northernmost aggregation site. Source: Grow Northwest 2014; goskagit.com.')
edge('nabc', 'skagit', 'actsP', 'based in Mount Vernon', 'Source: agbizcenter.org.')
edge('cfc', 'whatcom', 'actsP', '2026 Farm Fund flood-response grants', 'Grants up to $5,000 for Whatcom County farms after the recent major flooding. Source: communityfood.coop.')
edge('cma', 'mbsnf', 'actsP', 'guides here', 'Source: cascademountainascents.com/about.')
edge('cma', 'ncnp', 'actsP', 'guides here', 'Source: cascademountainascents.com/about.')
edge('dari', 'lyn', 'trade', '“COW water” deal', 'Ecology accepted the plant’s condensate-of-whey water as foreign water, adding about 400–425 acre-feet to Lynden’s water rights (about 1,800 before). Source: Lynden Tribune.')
edge('lyn', 'nooksack', 'actsE', 'pipeline to the river at Hannegan Rd', 'Lynden won a $1.95 million state grant for a three-quarter-mile pipeline moving where Darigold’s water enters the Nooksack. Source: Lynden Tribune.')

# ── Co-ops act on E areas ───────────────────────────────────────────
edge('dari', 'nooksack', 'actsE', 'discharges condensate water', 'The only direct industrial discharger to the Nooksack River. Source: Ecology Lower Nooksack bacteria TMDL evaluation; Lynden Tribune.')
edge('tyl', 'ejido', 'actsE', 'farms it; converting to organic', 'A former raspberry monocrop being converted to an organic farm with diverse crops and animals. Source: CAGJ farm visit 2022.')
edge('c2c', 'ejido', 'actsE', 'holds 7-year lease-to-purchase', 'C2C holds a seven-year lease-to-purchase agreement with the property owner; C2C and TyL are buying the farm. Source: CAGJ 2022; PCC Sound Consumer 2023.')
edge('cfc', 'farmland', 'actsE', 'Farm Fund grants to farms', 'In 2024 the Farm Fund gave $84,670 in grants to 28 small-to-midsize farms and markets in Whatcom and Skagit counties, plus one $12,000 loan. Source: Community Food Co-op 2025 Annual Report.')
edge('psfh', 'farmland', 'actsE', 'aggregates its farms’ produce', 'Source: Grow Northwest 2014.')
edge('ncm', 'farmland', 'actsE', 'member ranches', 'Source: goskagit.com.')
edge('cma', 'ncascades', 'actsE', 'guides in', 'Source: cascademountainascents.com.')

for n in nodes:
    if n['id'] in INST_GEO:
        lat, lng, where = INST_GEO[n['id']]
        n['props'].update({'lat': str(lat), 'lng': str(lng), 'located': where})

legend = [
  {'id': 'lg_t_coop', 'kind': 'node', 'label': 'Co-op (border = kind, as on the co-op map)', 'color': I_FILL, 'borderColor': '#c0392b', 'borderWidth': 2.5, 'icon': ''},
  {'id': 'lg_t_instP', 'kind': 'node', 'label': 'Institution that governs a P area', 'color': '#93c5fd', 'borderColor': '#1d4ed8', 'borderWidth': 2.5, 'icon': ''},
  {'id': 'lg_t_law', 'kind': 'node', 'label': 'Rule made by an institution', 'color': LAW, 'borderColor': LB, 'borderWidth': 2.5, 'icon': ''},
  {'id': 'lg_t_eco', 'kind': 'node', 'label': 'E area (polygon)', 'color': GREEN_E, 'borderColor': EB, 'borderWidth': 2.5, 'icon': ''},
  {'id': 'lg_t_jur', 'kind': 'node', 'label': 'P jurisdiction (polygon)', 'color': BLUE_P, 'borderColor': PB, 'borderWidth': 2.5, 'icon': ''},
] + [{'id': 'lg_l_' + k, 'kind': 'edge', 'label': v[0], 'color': v[1], 'width': v[2], 'dash': v[3]} for k, v in KINDS.items()]

note = ('EIP Stage Sketch of the Whatcom co-ops. E and P hold only areas a map can draw; everything that acts is an institution in I. '
        'Co-ops keep the I colour, with their border showing their kind as on the co-op map. Blue institutions govern a P area; rules are what institutions make. '
        'Only areas with a sourced tie to a co-op are drawn: relevance, not completeness. Every line’s note says where the tie came from. '
        'Every co-op on the co-op map is here, with every tie between them. Some co-ops have no E or P tie yet because none was found with a source: A1DesignBuild, Bellingham Bay Builders, Community Media Co-op, Cascadia Deaf Nation, North Coast CU, WECU, WestEdge CU, REI Bellingham, CHS Northwest. '
        'No green (E-stewarding) institution has a sourced tie to these co-ops yet. Every E and P area has its real boundary in whatcom-coops-eip-areas.geojson, and every institution with an address has a point; the RCN Map draws both (🗺 Show on map). Laws have no place, so they appear in their maker’s popup. '
        'Marc Pierson with Claude Opus 5.5, Sep 2026.')

state = {'version': '1.0', 'mode': 'eip', 'modelName': 'Co-ops of Whatcom County — EIP Stage Sketch',
         'modelNote': note, 'canvasBg': '#ffffff', 'graphAttrs': {}, 'cldLoopNames': {},
         'legendEntries': legend, 'legendVisible': True, 'legendCollapsed': True,
         'eipGeo': {'areas': 'whatcom-coops-eip-areas.geojson'},
         'nodes': nodes, 'edges': edges, 'lines': [], 'metaEdges': []}
json.dump(state, open(OUT, 'w'), indent=1, ensure_ascii=False)
ids = {n['id'] for n in nodes}
bad = [e for e in edges if e['src'] not in ids or e['tgt'] not in ids]
print(len(nodes), 'nodes', len(edges), 'edges', 'bad', bad)
