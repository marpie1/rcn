#!/usr/bin/env python3
"""
build_pages.py — one FedWiki page per Whatcom co-op, plus an index page.

    python3 docs/whatcom-coops-wiki/build_pages.py [--map rcnmap|native]

Writes whatcom-coops-wiki.json, a flat {slug: page} drop file: drag it onto a
lineup, click each slug, fork. Each co-op page carries

  - the record: kind, founding year, notes, contact block (from the RCN Map
    issue file, tools/issue-data/whatcom-wa--cooperatives.json)
  - its ties, as [[links]] to the other co-op pages, with sources
  - an rcngraph item: nearest neighbours, cut from Marc's layout, editable in
    the Graph Tool; node names in the picture open the co-op pages
  - a map: an rcnmap item (wiki-plugin-rcnmap) drawing this co-op, its
    neighbours and the ties between them, each point opening its page; or with
    --map native, FedWiki's own Map plugin (points only, each a [[link]])
  - a frame item with the co-op's own website, when the site allows framing —
    the only thing framed

The index page carries the rcntable item (the whole table, whose Map button
draws the ties on the RCN Map), the full graph, a map of all 22, and the two
Assets items the table reads from. Only the table needs /assets/rcn-table/ on
the site; the pages themselves work on any wiki.

Pipeline, in the house FedWiki Format: markdown per page -> md-to-fedwiki-page.js
--map -> marker paragraphs swapped for plugin items -> fedwiki-attribution.js
last. SVGs in diagrams/ are rendered by the Graph Tool itself (README.md).
"""
import json, os, re, subprocess, sys, tempfile, secrets

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
SCRIPTS = os.path.join(REPO, '.claude', 'skills', 'fedwiki-page', 'scripts')
OUT = os.path.join(HERE, 'whatcom-coops-wiki.json')
# Which plugin draws the maps: 'rcnmap' (points and ties; needs
# wiki-plugin-rcnmap on the wiki) or 'native' (FedWiki's own Map plugin: points
# only, but on every wiki).
MAPS = sys.argv[sys.argv.index('--map') + 1] if '--map' in sys.argv else 'rcnmap'
assert MAPS in ('rcnmap', 'native'), '--map rcnmap|native'

issue = json.load(open(os.path.join(REPO, 'tools', 'issue-data', 'whatcom-wa--cooperatives.json'), encoding='utf-8'))
types, kinds = issue['types'], issue['linkKinds']
P = {p['id']: p for p in issue['parcels']}

# Page titles live in the issue file (parcel.wikiTitle), the one place both
# these pages and the Neo4j load read them, so the table's links and the pages
# cannot drift apart. Each is already what sanitizeTitle() would produce.
TITLE = {i: p.get('wikiTitle') or p['label'] for i, p in P.items()}
INDEX = 'Co-ops of Whatcom County'
FOUNDED = {'cc': '2014', 'c2c': '2003', 'a1': '2017', 'bbb': '2004', 'cma': '2023', 'col': '2009',
           'cmc': '2023', 'tyl': '2017', 'cab': '2023', 'cdn': '2016', 'cfc': '1970', 'icu': '1941',
           'nccu': '1939', 'wecu': '1936', 'wecu2': '1952', 'rei': '1938', 'ncm': '2016',
           'dari': '1918', 'psfh': '2016'}
# Sites that will not show in a Frame item, found by loading every site in an
# iframe with the frame plugin's own sandbox (Sep 2026): they refuse framing, put
# up a bot check, are dead, or are http-only (mixed content on an https wiki).
NO_FRAME = {'a1': 'refuses to be shown inside another page',
            'nccu': 'refuses to be shown inside another page',
            'psfh': 'refuses to be shown inside another page',
            'tyl': 'is an Instagram profile, which refuses to be shown inside another page',
            'cmc': 'no longer resolves (Sep 2026)',
            'cc': 'is http-only with a broken https certificate, so an https wiki will not show it',
            'icu': 'refuses to be shown inside another page',
            'rei': 'refuses to be shown inside another page',
            'bbb': 'puts up a bot check that cannot finish inside another page',
            'ncm': 'did not respond (Sep 2026)',
            'cdn': 'answers “Payment Required” (Sep 2026) and may have lapsed'}


def slug(t):
    return re.sub(r'[^A-Za-z0-9-]', '', re.sub(r'\s', '-', t)).lower()


def link(i):
    return '[[%s]]' % TITLE[i]


def neighbours(i):
    out = []
    for l in issue['links']:
        if l['from'] == i: out.append((l, l['to'], 'out'))
        elif l['to'] == i: out.append((l, l['from'], 'in'))
    return out


def co_op_md(i):
    p, c = P[i], P[i]['contact']
    kind = types[p['type']]['label']
    head = ['**%s**' % kind]
    if FOUNDED.get(i): head.append('founded %s' % FOUNDED[i])
    if p.get('inFrame') is False: head.append('outside Whatcom County')
    head.append('one of the %s' % link_index())
    md = ['# ' + TITLE[i], ' · '.join(head) + '.', p['notes'], '## Contact']
    rows = []
    if c.get('website'): rows.append('- Website: [%s](%s)' % (re.sub(r'^https?://(www\.)?', '', c['website']).rstrip('/'), c['website']))
    if c.get('phone'): rows.append('- Phone: ' + c['phone'])
    if c.get('email'): rows.append('- Email: ' + c['email'])
    if c.get('address'): rows.append('- Address: ' + c['address'])
    for person in c.get('people', []): rows.append('- ' + person)
    md.append('\n'.join(rows))
    if c.get('caveat'): md.append('⚠ ' + c['caveat'] + '.')
    md.append('*Checked %s · %s.*' % (c.get('checked', ''), c.get('source', '')))

    md.append('## Ties')
    ns = neighbours(i)
    if ns:
        lines, sources = [], []
        for l, other, way in ns:
            k = kinds[l['kind']]['label']
            what = l.get('label') or k
            lines.append('- %s %s — %s' % ('To' if way == 'out' else 'From', link(other), what if l.get('label') else k))
            if l.get('notes'): sources.append('%s: %s' % (TITLE[other], l['notes']))
        md.append('\n'.join(lines))
        for s in sources: md.append('*Source — %s*' % s)
    else:
        md.append('No documented tie to another co-op on this list yet. That is a finding, not a gap in the drawing: add a tie in the RCN Map issue file only with a public source.')

    md += ['## Nearest neighbours', '@@GRAPH ' + i,
           'This co-op and every co-op it has a documented tie to, cut from the whole Co-ops of Whatcom County graph. Click a name to open that page. Double-click the diagram to edit it in the RCN Graph Tool; hover a box for its contact details.']
    md += ['## On the map', '@@MAP ' + i]
    md += ['## Website']
    if c.get('website') and i not in NO_FRAME:
        md.append('@@SITE ' + i)
    elif c.get('website'):
        md.append('The site [%s](%s) %s, so it opens in a new tab instead.' % (c['website'], c['website'], NO_FRAME[i]))
    else:
        md.append('No website found.')
    return '\n\n'.join(md) + '\n'


def link_index():
    return '[[%s]]' % INDEX


def index_md():
    md = ['# ' + INDEX,
          'Every co-op we could verify in Whatcom County, Washington, plus two Skagit organisations (NW Agriculture Business Center and Puget Sound Food Hub, Mount Vernon) that built Whatcom-serving co-ops. Each has its own page with its contact details, its documented ties, a nearest-neighbour graph, a map, and its own website where the site allows it.',
          'A tie appears only where a public source says so, and each one names its source. No line means no tie was found, not that none exists.',
          '## All the co-ops, as a table', '@@TABLE',
          'Open Table shows every row: sort, filter, pick columns, select rows and put them on the map, or follow one row into its neighbourhood. Every name opens that co-op’s page beside the table.',
          '## The network', '@@GRAPH all',
          'Marc Pierson’s layout: Cascade Cooperatives at the centre of its members, the Community Food Co-op at the centre of money and trade. WECU, REI, Darigold and CHS have no documented tie to the rest.',
          '## On the map', '@@MAP all', '## The co-ops']
    by = {}
    for i, p in P.items(): by.setdefault(p['type'], []).append(i)
    for t in types:
        if t in by:
            md.append('**%s**' % types[t]['label'])
            md.append('\n'.join('- ' + link(i) for i in sorted(by[t], key=lambda i: TITLE[i])))
    md += ['## The files behind these pages',
           'The table reads /assets/rcn-table/ on this site: the tool pages, and the whatcomcoops folder of records exported from Neo4j. Upload them into the two folders below.',
           '@@ASSETS rcn-table', '@@ASSETS rcn-table/whatcomcoops',
           'The records come from the RCN Map issue file tools/issue-data/whatcom-wa--cooperatives.json in the rcn repository, loaded into Neo4j by substrate/load_coops.py and exported by substrate/export.py. Contacts were checked in September 2026; each page says when and where.']
    return '\n\n'.join(md) + '\n'


def rid():
    return secrets.token_hex(8)


def svg_for(name):
    """The Graph Tool's own export, linked in the render step (README.md).

    Each co-op box carries one transparent rect inside <a class="internal"
    data-page-name=slug title="view">. wiki-client's link handler reads the page
    name from the clicked element: with the Graph Tool's plain enrichment that
    element is one <tspan> line of a wrapped label, which has no title attribute,
    so the handler threw and nothing opened.
    """
    return open(os.path.join(HERE, 'diagrams', name + '.svg'), encoding='utf-8').read()


def item_for(marker):
    kind, _, arg = marker.partition(' ')
    if kind == '@@GRAPH':
        model = json.load(open(os.path.join(HERE, 'diagrams', arg + '.rcn.json'), encoding='utf-8'))
        return {'type': 'rcngraph', 'id': rid(),
                'text': model.get('modelName', 'Co-ops of Whatcom County'),
                'graphJSON': model, 'svgString': svg_for(arg)}
    if kind == '@@MAP':
        # FedWiki's own Map plugin: one "lat, lon label" line per point, editable
        # in place, and each label a [[link]] to that co-op's page. It draws
        # points, not the ties between them — the graph above carries those.
        ids = list(P) if arg == 'all' else [arg] + [o for _, o, _ in neighbours(arg)]
        lines = ['%.5f, %.5f [[%s]] — %s' % (P[i]['latLng'][0], P[i]['latLng'][1], TITLE[i],
                                           types[P[i]['type']]['label']) for i in dict.fromkeys(ids)]
        if arg == 'all':
            cap = 'All 22 co-ops. Click a point for its page; the ties are in the graph above.'
        elif len(ids) > 1:
            cap = '%s and the %d co-op%s it is tied to. Click a point for its page; the ties are in the graph above.' % (
                TITLE[arg], len(ids) - 1, '' if len(ids) == 2 else 's')
        else:
            cap = '%s — no documented ties, so it stands alone.' % TITLE[arg]
        if MAPS == 'native':
            return {'type': 'map', 'id': rid(), 'text': '\n'.join(lines + [cap])}
        # rcnmap: the subject in issue-file shape, ties included, and a text that
        # reads on its own (caption, then the points and the ties in words).
        ids = list(dict.fromkeys(ids))
        keep = set(ids)
        links = [l for l in issue['links'] if l['from'] in keep and l['to'] in keep]
        parcels = [{'id': i, 'label': P[i]['label'], 'wikiTitle': TITLE[i], 'type': P[i]['type'],
                    'latLng': P[i]['latLng'],
                    'contact': {k: v for k, v in P[i]['contact'].items() if k in ('website', 'phone')}}
                   for i in ids]
        used_t = {p['type'] for p in parcels}; used_k = {l['kind'] for l in links}
        cap = cap.replace('Click a point for its page; the ties are in the graph above.',
                          'Click a point for its page.')
        words = [cap] + ['%s — %s' % (TITLE[i], types[P[i]['type']]['label']) for i in ids] + \
                ['%s → %s: %s' % (TITLE[l['from']], TITLE[l['to']], l.get('label') or kinds[l['kind']]['label'])
                 for l in links]
        return {'type': 'rcnmap', 'id': rid(), 'text': '\n'.join(words),
                'map': {'types': {k: v for k, v in types.items() if k in used_t},
                        'linkKinds': {k: v for k, v in kinds.items() if k in used_k},
                        'parcels': parcels,
                        'links': [{k: l[k] for k in ('from', 'to', 'kind', 'label') if k in l} for l in links]}}
    if kind == '@@SITE':
        return {'type': 'frame', 'id': rid(),
                'text': P[arg]['contact']['website'] + '\nHEIGHT 520\nThe co-op’s own website, live.'}
    if kind == '@@TABLE':
        return {'type': 'rcntable', 'id': rid(), 'text': 'database: whatcomcoops\nkind: Coop',
                'database': 'whatcomcoops', 'kind': 'Coop'}
    if kind == '@@ASSETS':
        return {'type': 'assets', 'id': rid(), 'text': arg}
    raise ValueError(marker)


def main():
    tmp = tempfile.mkdtemp()
    mds = []
    for i in P:
        f = os.path.join(tmp, i + '.md'); open(f, 'w', encoding='utf-8').write(co_op_md(i)); mds.append(f)
    f = os.path.join(tmp, 'index.md'); open(f, 'w', encoding='utf-8').write(index_md()); mds.append(f)
    subprocess.run(['node', os.path.join(SCRIPTS, 'md-to-fedwiki-page.js'), *mds, '--map', OUT], check=True)

    drop = json.load(open(OUT, encoding='utf-8'))
    swapped = 0
    for page in drop.values():
        for n, it in enumerate(page['story']):
            if it['type'] in ('paragraph', 'markdown') and it.get('text', '').startswith('@@'):
                new = item_for(it['text'].strip())
                new['id'] = it['id']
                page['story'][n] = new
                for act in page['journal']:
                    if act.get('type') == 'add' and act.get('id') == it['id']:
                        act['item'] = new
                swapped += 1
    # sanitizeTitle() title-cases every word ("Co-ops Of …"); the slug is the
    # same either way, so restore the natural title on the page and its create.
    for t in list(TITLE.values()) + [INDEX]:
        page = drop.get(slug(t))
        if page:
            page['title'] = t
            for act in page['journal']:
                if act.get('type') == 'create': act['item']['title'] = t
    json.dump(drop, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    subprocess.run(['node', os.path.join(SCRIPTS, 'fedwiki-attribution.js'), OUT,
                    '--model', 'Claude Opus 5.5', '--date', 'September 2026'], check=True)
    missing = [t for t in list(TITLE.values()) + [INDEX] if slug(t) not in drop]
    print('%d pages, %d plugin items -> %s%s' % (len(drop), swapped, OUT,
          ('   MISSING: %s' % missing) if missing else ''))


if __name__ == '__main__':
    main()
