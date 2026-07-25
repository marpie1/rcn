#!/usr/bin/env python3
"""
Build a self-contained rcn_map.html with rcn_static_data.js inlined, so the whole
tool + baseline data is ONE file you can drop into a static/asset folder (e.g. a
FedWiki assets directory) with no separate dependency to upload.

Leaflet stays on its CDN (it loads fine and inlining it breaks default marker
icons). Map tiles always need the network — no web map can bundle those.

Run:    python3 maps/build_standalone_map.py
Output: maps/rcn_map_standalone.html
"""
import json
import os
import sys

HERE      = os.path.dirname(os.path.abspath(__file__))
SRC       = os.path.join(HERE, 'rcn_map.html')
DATA      = os.path.join(HERE, 'rcn_static_data.js')
OUT       = os.path.join(HERE, 'rcn_map_standalone.html')
ISSUE_DIR = os.path.normpath(os.path.join(HERE, '..', 'tools', 'issue-data'))

TAG          = '<script src="rcn_static_data.js"></script>'
ISSUE_TAG    = 'var BUNDLED_ISSUES = null;'   # sentinel in rcn_map.html


def build_bundled_issues():
    """Read tools/issue-data/issue-index.json + each issue file into a JS object
    the map loads at startup, so bundled issues show with no host."""
    index_path = os.path.join(ISSUE_DIR, 'issue-index.json')
    if not os.path.isfile(index_path):
        return None
    with open(index_path, encoding='utf-8') as f:
        index = json.load(f)
    out_index, out_data = [], {}
    for e in index:
        key = e.get('key')
        if not key:
            continue
        data_path = os.path.join(ISSUE_DIR, key + '.json')
        if not os.path.isfile(data_path):
            print('  (skipped — no data file: {})'.format(key))
            continue
        with open(data_path, encoding='utf-8') as f:
            out_data[key] = json.load(f)
        out_index.append({'key': key, 'label': e.get('label'), 'ndc': e.get('ndc'), 'map': None})
    if not out_index:
        return None
    return {'index': out_index, 'data': out_data}

def main():
    with open(SRC, encoding='utf-8') as f:
        html = f.read()
    with open(DATA, encoding='utf-8') as f:
        data = f.read()

    if TAG not in html:
        sys.exit('ERROR: could not find the rcn_static_data.js <script src> tag in rcn_map.html')

    # A literal "</script" inside the inlined data would close the tag early in the
    # HTML parser. In a JS/JSON data file any such text lives inside a string, where
    # "<\/script" is equivalent — so escape it to be safe.
    if '</script' in data.lower():
        data = data.replace('</script', '<\\/script').replace('</SCRIPT', '<\\/SCRIPT')

    inline = ('<script>\n'
              '/* rcn_static_data.js inlined by build_standalone_map.py for single-file deploy */\n'
              + data +
              '\n</script>')
    out = html.replace(TAG, inline)

    # Bake in the repo's issues so they display with no hosted index.
    bundled = build_bundled_issues()
    n_issues = 0
    if bundled:
        if ISSUE_TAG not in out:
            sys.exit('ERROR: could not find the BUNDLED_ISSUES sentinel in rcn_map.html')
        js = json.dumps(bundled).replace('</script', '<\\/script').replace('</SCRIPT', '<\\/SCRIPT')
        out = out.replace(ISSUE_TAG, 'var BUNDLED_ISSUES = ' + js + ';')
        n_issues = len(bundled['index'])

    with open(OUT, 'w', encoding='utf-8') as f:
        f.write(out)

    print('Wrote ' + OUT)
    print('  source html:  {:,} bytes'.format(len(html)))
    print('  inlined data: {:,} bytes'.format(len(data)))
    print('  bundled issues: {}'.format(n_issues))
    print('  output:       {:,} bytes'.format(len(out)))
    print('Upload rcn_map_standalone.html on its own — no rcn_static_data.js needed.')

if __name__ == '__main__':
    main()
