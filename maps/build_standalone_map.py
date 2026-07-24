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
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC  = os.path.join(HERE, 'rcn_map.html')
DATA = os.path.join(HERE, 'rcn_static_data.js')
OUT  = os.path.join(HERE, 'rcn_map_standalone.html')

TAG = '<script src="rcn_static_data.js"></script>'

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

    with open(OUT, 'w', encoding='utf-8') as f:
        f.write(out)

    print('Wrote ' + OUT)
    print('  source html:  {:,} bytes'.format(len(html)))
    print('  inlined data: {:,} bytes'.format(len(data)))
    print('  output:       {:,} bytes'.format(len(out)))
    print('Upload rcn_map_standalone.html on its own — no rcn_static_data.js needed.')

if __name__ == '__main__':
    main()
