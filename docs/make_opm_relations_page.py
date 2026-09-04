#!/usr/bin/env python3
"""docs/opm-relationships.md -> docs/opm-relationships.fedwiki.json

The one thing md-to-fedwiki-page.js cannot do for us: the chart is a separate
SVG file, and it belongs immediately after the "# The chart" heading.

(It used to do a second job — turning **bold** inside html table cells into
tags, because a FedWiki html item renders raw. That is fixed in the converter
itself now, so this script no longer touches inline markup.)
"""
import json, re, secrets, subprocess, sys

REPO = '/Users/marcpierson/rcn'
SP = '/private/tmp/claude-501/-Users-marcpierson-rcn/8b04aed0-0c58-432a-bec5-d8f063c21331/scratchpad'

subprocess.run(['node', REPO + '/.claude/skills/fedwiki-page/scripts/md-to-fedwiki-page.js',
                REPO + '/docs/opm-relationships.md', '--title', 'OPM Relations',
                '--tables', 'html', '--out', SP], check=True, capture_output=True)

page = json.load(open(SP + '/opm-relations.json'))

svg = re.sub(r'^<svg([^>]*?)>', r'<svg\1 style="width:100%;height:auto;display:block">',
             open(REPO + '/tools/opm-relationships.svg').read(), count=1)
at = next(i for i, it in enumerate(page['story']) if it.get('text', '').strip() == '# The chart') + 1
page['story'].insert(at, {'type': 'html', 'id': secrets.token_hex(8), 'text': svg})

json.dump(page, open(REPO + '/docs/opm-relationships.fedwiki.json', 'w'), indent=2, ensure_ascii=False)
left = sum(t.count('**') for t in (i.get('text','') for i in page['story'] if i.get('type')=='html'))
print('items:', len(page['story']), '| stray ** in html items:', left)
