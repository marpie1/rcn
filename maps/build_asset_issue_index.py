#!/usr/bin/env python3
"""
Build the issue files for the live site's flat FedWiki asset folder.

tools/issue-data/issue-index.json points every issue at localhost:8765 — right
for the local proxy, dead for anyone opening the live map. This writes an
upload-ready copy where each "url" is the bare file name, which rcn_map.html
resolves against its own folder, plus a copy of each issue file beside it.

"map" (the full Issue Polygon Map link) is set to null: issue-polygon-map.html
is not in the asset folder, and the RCN map greys the link out when it is null.

Run:    python3 maps/build_asset_issue_index.py
Output: maps/dist-assets/  (gitignored) — upload every file in it to
        https://ndcgroup.relocalizecreativity.net/assets/NDC/
"""
import json
import os
import shutil
import sys

HERE      = os.path.dirname(os.path.abspath(__file__))
ISSUE_DIR = os.path.normpath(os.path.join(HERE, '..', 'tools', 'issue-data'))
OUT_DIR   = os.path.join(HERE, 'dist-assets')


def main():
    with open(os.path.join(ISSUE_DIR, 'issue-index.json'), encoding='utf-8') as f:
        index = json.load(f)

    if os.path.isdir(OUT_DIR):
        shutil.rmtree(OUT_DIR)
    os.makedirs(OUT_DIR)

    out = []
    for e in index:
        key = e.get('key')
        src = os.path.join(ISSUE_DIR, '{}.json'.format(key))
        if not key or not os.path.isfile(src):
            print('  skipped — no data file: {}'.format(key))
            continue
        name = key + '.json'
        with open(src, encoding='utf-8') as f:
            json.load(f)  # refuse to ship a file that won't parse
        shutil.copyfile(src, os.path.join(OUT_DIR, name))
        out.append({'key': key, 'label': e.get('label'), 'ndc': e.get('ndc'), 'url': name, 'map': None})
        print('  {}'.format(name))

    if not out:
        sys.exit('ERROR: no issues to write')

    # Same aligned shape as the hand-kept index, so the two diff cleanly.
    rows = ',\n'.join(
        '  {{\n    "key":   {},\n    "label": {},\n    "ndc":   {},\n    "url":   {},\n    "map":   null\n  }}'.format(
            *(json.dumps(r[k], ensure_ascii=False) for k in ('key', 'label', 'ndc', 'url')))
        for r in out)
    with open(os.path.join(OUT_DIR, 'issue-index.json'), 'w', encoding='utf-8') as f:
        f.write('[\n' + rows + '\n]\n')

    print('  issue-index.json ({} issues)'.format(len(out)))
    print('Upload every file in {} to the NDC asset folder.'.format(os.path.relpath(OUT_DIR)))


if __name__ == '__main__':
    main()
