#!/usr/bin/env python3
"""
export.py — dump a database's projections to a folder of static JSON.

    python3 substrate/export.py whatcom                 # -> substrate/export/whatcom/
    python3 substrate/export.py whatcom /some/folder    # -> there
    python3 substrate/export.py --all                   # every database api.py lists
    python3 substrate/export.py --bundle whatcom rcngeo # the whole assets folder, ready to upload
    python3 substrate/export.py whatcomcoops --prefix whatcom-coops-export
                                                        # whatcom-coops-export-index.json, … — for a flat folder

WHY THIS EXISTS. A projection is a pure function of the source files (decision
17: files are the truth, Neo4j is derived), so it does not have to be computed
per request by a server the reader can reach. At RCN scale — whatcom is 409
concepts and 770 links — a database's whole table set is under a megabyte.
Export it once, drop the folder into a FedWiki site's assets, and the table,
the map and the neighbourhood all work for a reader with no account, no key
and no Neo4j. That is Layer 1 in substrate/layer1-static-projections.rcn.json:
Neo4j stays on the steward's machine as a workbench; only this folder travels.

WHAT IT WRITES. The same shapes api.py serves, produced by the same functions,
so rcn-table.html's ?src= mode is a change of fetch and nothing else:

    index.json        {database, exported, kinds:[{kind,rows}], files:{...}}
                       — stands in for /projection and /projection/tables
    table-<kind>.json  table_projection(kind)  — /projection/table/<kind>
    geo.json           geo_projection(db), unfiltered — /projection/geo; the
                       map filters by kind and names itself
    graph.json         {nodes:[{key,name,kind}], edges:[{src,tgt,label}]} —
                       the whole graph, keyed by schemaLabel, from which the
                       table computes /projection/neighbours in the browser

File names slug the kind the way the tools slug everything (asSlug in
wiki-client lib/page.js): spaces to dashes, non-alphanumerics dropped, lower
case. So kind "Entity" is table-entity.json, and a reader of index.json need
never guess — `files` lists every path written.

--bundle writes substrate/export/rcn-table/: the three tool files (the table,
the map, and the graph tool, which carries its icon lists inside it) beside one exported
folder per database named. That folder, dropped whole into a FedWiki site's
assets, is the deployment — wiki-plugin-rcntable's popup expects exactly this
layout at /assets/rcn-table/. Run tools/build-deploy-tool.js first if the
graph tool has changed; this copies, it does not build.

Nothing here is a new query. If api.py changes a projection, this exports the
changed one; the two cannot drift apart because there is only one function.
"""
import json
import os
import re
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import api  # noqa: E402  — the projections, not the server; api.py only serves under __main__
from db import run  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))


def as_slug(name):
    """MUST match asSlug in rcn-table.html / wiki-client lib/page.js."""
    return re.sub(r'[^A-Za-z0-9-]', '', re.sub(r'\s', '-', str(name))).lower()


def graph_projection(database):
    """The whole graph, small enough to hand to a browser.

    Keyed by schemaLabel because that is what every other projection joins on;
    `name` is the variableLabel the tables show. Edges are distinct (src, tgt,
    label) triples, direction preserved, so the browser can walk them either
    way exactly as neighbours_projection's undirected `-[:REL*0..d]-` does.
    """
    nodes = run('MATCH (c:Concept) WHERE c.schemaLabel IS NOT NULL '
                'RETURN c.schemaLabel AS key, c.variableLabel AS name, c.kind AS kind '
                'ORDER BY name', database=database)
    edges = run('MATCH (a:Concept)-[r:REL]->(b:Concept) '
                'RETURN DISTINCT a.schemaLabel AS src, b.schemaLabel AS tgt, '
                '       r.label AS label ORDER BY src, tgt, label',
                database=database)
    return {'database': database,
            'nodes': [{'key': n['key'], 'name': n['name'] or n['key'],
                       'kind': n['kind'] or ''} for n in nodes],
            'edges': [{'src': e['src'], 'tgt': e['tgt'], 'label': e['label'] or ''}
                      for e in edges]}


def write(path, obj):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(obj, f, ensure_ascii=False, indent=1)
    return os.path.getsize(path)


# --prefix NAME puts NAME- in front of every file written, so several databases
# can share one flat FedWiki asset folder (it cannot hold sub-folders) without
# one's index.json overwriting another's. The names listed inside index.json
# stay unprefixed: they are relative to the location, and the table reads a
# location ending in '-' as a prefix ("…/NDC/whatcom-coops-export-"), so the same
# index works either way. seal.js takes the same location.
def export(database, outdir=None, prefix=''):
    outdir = outdir or os.path.join(HERE, 'export', database)
    os.makedirs(outdir, exist_ok=True)
    files, sizes = {}, {}
    pre = (prefix.rstrip('-') + '-') if prefix else ''
    out = lambda name: os.path.join(outdir, pre + name)

    kinds = api.table_kinds(database)['kinds']
    for k in kinds:
        name = 'table-%s.json' % as_slug(k['kind'])
        sizes[name] = write(out(name),
                            api.table_projection(k['kind'], database))
        files[k['kind']] = name

    sizes['geo.json'] = write(out('geo.json'),
                              api.geo_projection(database))
    graph = graph_projection(database)
    sizes['graph.json'] = write(out('graph.json'), graph)

    index = {'database': database,
             'exported': time.strftime('%Y-%m-%dT%H:%M:%S%z'),
             'kinds': kinds,
             'files': {'tables': files, 'geo': 'geo.json', 'graph': 'graph.json'},
             'counts': {'concepts': len(graph['nodes']), 'links': len(graph['edges'])}}
    if pre:
        index['prefix'] = pre
    sizes['index.json'] = write(out('index.json'), index)

    total = sum(sizes.values())
    print('%s -> %s' % (database, os.path.join(outdir, pre) if pre else outdir))
    for name in ['index.json'] + sorted(n for n in sizes if n != 'index.json'):
        print('  %-28s %7.1f KB' % (pre + name, sizes[name] / 1024))
    print('  %-28s %7.1f KB   %d concepts, %d links, %d kinds'
          % ('total', total / 1024, len(graph['nodes']), len(graph['edges']), len(kinds)))
    return outdir


TOOLS = os.path.join(os.path.dirname(HERE), 'tools')
BUNDLE_FILES = [('rcn-table.html', 'rcn-table.html'),
                ('rcn-table-map.html', 'rcn-table-map.html'),
                ('graph-tool-v22.html', 'graph-tool-v22.html')]


def bundle(databases):
    import shutil
    out = os.path.join(HERE, 'export', 'rcn-table')
    os.makedirs(out, exist_ok=True)
    for src, dst in BUNDLE_FILES:
        path = os.path.join(TOOLS, src)
        if not os.path.exists(path):
            sys.exit('missing %s — run node tools/build-deploy-tool.js first' % path)
        shutil.copyfile(path, os.path.join(out, dst))
        print('  %-28s copied' % dst)
    for d in databases:
        export(d, os.path.join(out, d))
    print('bundle -> %s   upload this folder as /assets/rcn-table/' % out)


def main(argv):
    if not argv or argv[0] in ('-h', '--help'):
        print(__doc__.strip().split('\n\n')[0])
        return 0
    if argv[0] == '--all':
        dbs = [r['name'] for r in run(
            "SHOW DATABASES YIELD name WHERE name <> 'system' RETURN name",
            database='system')]
        for d in sorted(dbs):
            export(d)
        return 0
    if argv[0] == '--bundle':
        if len(argv) < 2:
            sys.exit('--bundle needs at least one database name')
        bundle(argv[1:])
        return 0
    prefix = ''
    if '--prefix' in argv:
        i = argv.index('--prefix')
        if i + 1 >= len(argv):
            sys.exit('--prefix needs a name, e.g. --prefix whatcom-coops')
        prefix = argv[i + 1]
        argv = argv[:i] + argv[i + 2:]
    export(argv[0], argv[1] if len(argv) > 1 else None, prefix)
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
