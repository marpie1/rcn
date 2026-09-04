#!/usr/bin/env python3
"""
project_iad.py — the IAD lens. A projection over the substrate, not a copy of it.

    python3 substrate/project_iad.py

Formerly load_iad.py, which read tools/*.json and wrote its own `iad` database.
That made the IAD view a parallel copy standing beside the substrate, so the
architecture claim — tools become lenses on one graph — was aspirational for
this layer and true only for the older ones. It now reads database `vna`
(populated by load_vna.py) with Cypher and WRITES NOTHING. If a drawing changes,
reload the substrate; the lens has no state of its own to go stale.

Ostrom 2005:188 is the schema being projected onto: "Participants ... are
assigned to positions. In these positions, they choose among actions in light of
their information, the control they have over action-outcome linkages, and the
benefits and costs assigned to actions and outcomes."

Seven working components; IAD's seven rule types configure them one to one. A
value network populates two. All seven are reported for every situation with
`specified` or `unspecified` against them, so the gap is visible rather than
silent and an absence in our data never reads as an absence in the world.
"""
import argparse
from db import run

DB = 'vna'

COMPONENTS = [
    ('participants',   'Who may take part',                    'boundary'),
    ('positions',      'The seats they are assigned to',       'position'),
    ('actions',        'What a seat may choose to do',         'choice'),
    ('information',    'What a seat knows when it chooses',    'information'),
    ('control',        'How choices combine into a decision',  'aggregation'),
    ('costs_benefits', 'What a seat pays and receives',        'payoff'),
    ('outcomes',       'What the situation can produce',       'scope'),
]

def q(cypher, params=None):
    return run(cypher, params, database=DB)

def bar(ch='-'):
    return ch * 74

def main(brief=False):
    sits = q('MATCH (a:Aspect {kind:"drawing"}) '
             'RETURN a.name AS slug, a.iadLevel AS level, a.method AS method, '
             '       a.spansLevels AS spans, a.levelsPresent AS lv '
             'ORDER BY a.iadLevel, a.name')
    if not sits:
        print('substrate database "%s" is empty — run load_vna.py first' % DB)
        return

    print('\n' + bar('='))
    print('IAD LENS   projection over substrate database "%s"   (reads only)' % DB)
    print(bar('='))

    print('\n--- action situations ---')
    for s in sits:
        n = q('MATCH (c:Concept) WHERE $s IN c.sources RETURN count(c) AS n',
              {'s': s['slug']})[0]['n']
        print('  %-34s %-18s %2d elements%s'
              % (s['slug'], s['level'], n, '   (spans levels)' if s['spans'] else ''))

    if brief:
        return

    print('\n--- the seven working components, per situation ---')
    print('    (the question an IAD reviewer asks first)')
    for s in sits:
        slug = s['slug']
        have = {r['e'] for r in q(
            'MATCH (c:Concept) WHERE $s IN c.sources RETURN DISTINCT c.iadElement AS e',
            {'s': slug})}
        ndel = q('MATCH ()-[r:REL]->() WHERE $s IN r.sources RETURN count(r) AS n',
                 {'s': slug})[0]['n']
        spec = set()
        if 'position' in have:    spec.add('positions')
        if 'participant' in have: spec.add('participants')
        if 'outcome' in have:     spec.add('outcomes')
        if ndel:                  spec.add('costs_benefits')
        got = [k for k, _, _ in COMPONENTS if k in spec]
        gap = [k for k, _, _ in COMPONENTS if k not in spec]
        print('  ' + slug)
        print('      specified   ' + (', '.join(got) or '(none)'))
        print('      unspecified ' + ', '.join(gap))

    print('\n--- the seven rule types ---')
    print('    nothing in a value network states a rule, so all seven are unspecified')
    print('    everywhere. That is the honest reading and the reason to say it out loud.')
    for _, _, rt in COMPONENTS:
        print('      %-14s unspecified  (configures %s)'
              % (rt, [c for c, _, r in COMPONENTS if r == rt][0]))

    print('\n--- payoff asymmetry, positions and participants only ---')
    print('    (Ostrom payoff rules; Allee exchange analysis. One query.)')
    print('    VNA drawings only — an undrawn arena in a NAS sketch has no payoff to be')
    print('    asymmetric about, which this query happily reported until it was told.')
    for r in q('MATCH (p:Concept) WHERE (p:Position OR p:Participant) AND p.mode = "VNA" '
               'OPTIONAL MATCH (p)-[o:REL]->() '
               'OPTIONAL MATCH ()-[i:REL]->(p) '
               'WITH p, count(DISTINCT o) AS out, count(DISTINCT i) AS inn '
               'WHERE out - inn >= 2 '
               'RETURN p.schemaLabel AS name, p.sources AS src, out, inn '
               'ORDER BY out - inn DESC LIMIT 8'):
        print('  %-26s delivers %d, receives %d   [%s]'
              % (r['name'], r['out'], r['inn'], r['src'][0]))

    print('\n--- adjacency: situations that are really more than one ---')
    rows = [s for s in sits if s['spans']]
    if not rows:
        print('  none')
    for s in rows:
        print('  %-34s spans %s' % (s['slug'], ' + '.join(s['lv'])))

    print('\n--- evidence base ---')
    for r in q('MATCH ()-[d:REL]->() '
               'RETURN coalesce(d.evidence,"(unset)") AS e, count(*) AS n ORDER BY n DESC'):
        print('  %-12s %d deliverable(s)' % (r['e'], r['n']))

    print('\n--- gold: concepts two drawings agree on ---')
    for r in q('MATCH (c:Concept) WHERE size(c.sources) > 1 '
               'RETURN c.schemaLabel AS l, c.sources AS s ORDER BY l'):
        print('  %-24s %s' % (r['l'], ', '.join(r['s'])))
    print(bar() + '\n')


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--brief', action='store_true')
    ap.add_argument('--verify', action='store_true', help='accepted for compatibility; the lens always verifies')
    main(ap.parse_args().brief)
