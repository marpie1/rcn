#!/usr/bin/env python3
"""
load_whatcom.py — the 2017 MBKF tables into the substrate, as one graph.

WHY THIS EXISTS. These eight CSVs are the Whatcom County survey the current
schema descends from: Marc derived the schema by running a Cypher query against
this data in 2017-18. Loading them back in closes the loop, and gives the table
work a real subject instead of a fixture.

THE THING WORTH NOTICING. Every table already joins by *name* — entity_name,
theme_name, program_name, promise_name — not by a surrogate id, even though an
`id` column exists in every file and is never referenced by another file. That
is the same decision FedWiki makes with a slug: identity is public, readable and
shared, so two tables agree because they name the same thing. No join table, no
foreign key, no bus. This loader therefore does the obvious thing and merges on
the name, exactly as load_aspects.py merges concepts on schemaLabel.

THE MODEL. Option-C vocabulary, same as everywhere else in the substrate:
  - every row becomes a `:Concept` merged on canon(name), carrying a second
    label for its kind (`:Concept:Entity`, `:Concept:Theme`, …) — the pattern
    load_vna.py uses for `:Concept:<IADElement>`
  - every relationship is a structural `[:REL {label:…}]` between concepts,
    because "this program is funded by that entity" is true regardless of any
    measured quantity, and structural edges carry no polarity
  - one `:Aspect {kind:'table'}` per CSV, and a `sources` list on every concept,
    so provenance works and gold (`size(sources) > 1`) computes for free
  - a VSM row is an `:Instance`, not a Concept: a survey response is a thing
    that happened, with a date and a respondent, which is what decision #5
    reserves :Instance for

WHAT IS NOT NORMALISED. Names are preserved verbatim in `variableLabel`; only
the merge key is canonicalised, and only by removing whitespace. Decision #11:
labels are never rewritten, only reported. So `whatcom chw network` and
`whatcom chw network*` stay two concepts, and the run prints them as a
near-collision for a human to judge. Same for the misspellings the sheets carry
(`afilliation`, `Belingham`, a survey dated 1/1/1017).

PII STAYS LOCAL. These sheets hold real people's emails, phones and home
addresses. They are read from wherever --src points and loaded into the local
Neo4j; nothing is copied into the repository. Do not add them to git.

    python3 substrate/load_whatcom.py --src "/path/to/CVS files on 010918"
"""
import csv, os, sys, glob, argparse
from collections import defaultdict
from db import run, BASE

DB = 'whatcom'

# Names the substrate itself uses. A CSV column of the same name would overwrite
# the merge key or the provenance, so those cells are dropped rather than
# silently winning. `id` is included: every sheet has one and no sheet ever
# references another sheet's id, so it carries no information the name does not.
RESERVED = {'schemaLabel', 'variableLabel', 'kind', 'sources', 'id'}

# table -> (kind label, the column holding this row's name)
TABLES = {
    'ENTITY':  ('Entity',  'entity_name'),
    'PERSON':  ('Person',  'full_name'),
    'PROGRAM': ('Program', 'program_name'),
    'THEME':   ('Theme',   'theme_name'),
    'PROMISE': ('Promise', 'promise_name'),
    'RESULT':  ('Result',  'result_name'),
    'SCRUM':   ('Scrum',   'scrum_name'),
}

# (table, column) -> (edge label, kind of the target)
# Columns absent from this map become properties on the concept instead.
LINKS = {
    ('ENTITY',  'theme_name'):                     ('addresses',          'Theme'),
    ('ENTITY',  'group_name'):                     ('part of',            'Entity'),
    ('PERSON',  'entity_name'):                    ('affiliated with',    'Entity'),
    ('PERSON',  'theme_name'):                     ('attends to',         'Theme'),
    ('PROGRAM', 'entity_name'):                    ('implemented by',     'Entity'),
    ('PROGRAM', 'other_implementing_entity'):      ('also implemented by','Entity'),
    ('PROGRAM', 'granting_entity_name'):           ('funded by',          'Entity'),
    ('PROGRAM', 'creating_entity_name'):           ('created by',         'Entity'),
    ('PROGRAM', 'potential_recipient_entity_name'):('may benefit',        'Entity'),
    ('PROGRAM', 'theme_name'):                     ('addresses',          'Theme'),
    ('PROGRAM', 'person_working_on_program'):      ('worked on by',       'Person'),
    ('THEME',   'super_theme'):                    ('part of',            'Theme'),
    ('PROMISE', 'program_name'):                   ('within',             'Program'),
    ('PROMISE', 'requestor_person'):               ('requested by',       'Person'),
    ('PROMISE', 'promisor_name'):                  ('promised by',        'Person'),
    ('PROMISE', 'result_name'):                    ('yields',             'Result'),
    ('RESULT',  'program_name'):                   ('within',             'Program'),
    ('RESULT',  'promise_name'):                   ('fulfils',            'Promise'),
    ('RESULT',  'scrum_name'):                     ('tracked by',         'Scrum'),
    ('SCRUM',   'promise_name'):                   ('delivers',           'Promise'),
    ('SCRUM',   'managing_program'):               ('managed by',         'Program'),
}


def canon(name):
    """The merge key: whitespace removed, case folded. Nothing else.

    families.js keys concepts spacelessly because sources disagree about the
    spaces; the same is true across these sheets, where one row writes
    `Mount Baker Kidney Foundation` and another `mount baker kidney foundation`.
    """
    return ''.join(str(name).split()).lower()


def cells(raw):
    """A cell may hold several values, pipe-separated. `a|b|c` is three links."""
    return [v.strip() for v in str(raw or '').split('|') if v.strip()]


def read(src):
    out = {}
    for path in sorted(glob.glob(os.path.join(src, '*.csv'))):
        base = os.path.basename(path)
        table = base.replace('MBKF ', '').replace(' CSV - Sheet1.csv', '').strip()
        with open(path, encoding='utf-8-sig') as fh:
            out[table] = [r for r in csv.DictReader(fh)]
    return out


def build(src):
    data = read(src)
    missing = [t for t in TABLES if t not in data]
    if missing:
        sys.exit(f'missing tables in {src}: {", ".join(missing)}')

    names = {}                      # key -> verbatim name, first spelling wins
    kinds = defaultdict(set)        # key -> {kind, ...}
    props = defaultdict(dict)       # key -> {col: value}
    sources = defaultdict(set)      # key -> {table, ...}
    edges = []                      # (src key, label, tgt key, table)
    counts = {}

    def concept(name, kind, table):
        k = canon(name)
        if not k:
            return None
        names.setdefault(k, str(name).strip())
        kinds[k].add(kind)
        sources[k].add(table)
        return k

    for table, (kind, name_col) in TABLES.items():
        rows = data[table]
        n_rows = n_edges = 0
        for r in rows:
            key = concept(r.get(name_col), kind, table)
            if not key:
                continue
            n_rows += 1
            for col, raw in r.items():
                val = (raw or '').strip()
                if not val or col == name_col:
                    continue
                link = LINKS.get((table, col))
                if link:
                    label, tgt_kind = link
                    for v in cells(val):
                        tk = concept(v, tgt_kind, table)
                        if tk and tk != key:
                            edges.append((key, label, tk, table))
                            n_edges += 1
                else:
                    props[key].setdefault(col, val)
        counts[table] = (n_rows, n_edges)

    return data, names, kinds, props, sources, edges, counts


def ensure_db():
    names = {r['name'] for r in run('SHOW DATABASES YIELD name RETURN name',
                                    database='system')}
    if DB not in names:
        run(f'CREATE DATABASE {DB} WAIT', database='system')
        print(f'created database "{DB}"')


def write(names, kinds, props, sources, edges, vsm):
    ensure_db()
    run('MATCH (n) DETACH DELETE n', database=DB)
    run('CREATE CONSTRAINT whatcom_concept IF NOT EXISTS FOR (c:Concept) '
        'REQUIRE c.schemaLabel IS UNIQUE', database=DB)

    for k, label in names.items():
        # Kind arrives as a second label so a projection can filter on it, and
        # as a property so a table can show it in a column.
        #
        # EVERY CSV COLUMN BECOMES ITS OWN PROPERTY. The first cut joined them
        # into one string, which reads fine and is useless: a table cannot make
        # columns out of it, and the values themselves contain '=' and ';' so it
        # cannot be parsed back. A column in the sheet is a column in the table.
        extra = ':'.join(sorted(kinds[k]))
        cols = {c: v for c, v in props[k].items()
                if c not in RESERVED and c.strip()}
        run(f'MERGE (c:Concept:{extra} {{schemaLabel:$k}}) '
            'SET c.variableLabel=$l, c.kind=$kind, c.sources=$src, c += $p',
            {'k': k, 'l': label, 'kind': sorted(kinds[k])[0],
             'src': sorted(sources[k]), 'p': cols},
            database=DB)

    for s, label, t, table in edges:
        run('MATCH (a:Concept {schemaLabel:$s}), (b:Concept {schemaLabel:$t}) '
            'MERGE (a)-[r:REL {label:$l}]->(b) '
            'SET r.sources = CASE WHEN r.sources IS NULL THEN [$src] '
            '     WHEN $src IN r.sources THEN r.sources ELSE r.sources + $src END',
            {'s': s, 't': t, 'l': label, 'src': table}, database=DB)

    for table in sorted({e[3] for e in edges} | set(TABLES)):
        run('MERGE (a:Aspect {name:$n}) SET a.kind="table"',
            {'n': table}, database=DB)

    for i, row in enumerate(vsm):
        run('MERGE (v:Instance:VsmResponse {id:$id}) '
            'SET v.name=$name, v.respondent=$resp, v.surveyDate=$date, '
            '    v.scores=$scores, v.sources=["VSM"]',
            row, database=DB)
        if row['entity_key']:
            run('MATCH (v:Instance {id:$id}), (e:Concept {schemaLabel:$e}) '
                'MERGE (v)-[:REL {label:"surveys"}]->(e)',
                {'id': row['id'], 'e': row['entity_key']}, database=DB)


VSM_ITEMS = ('customer', 'operation', 'collaboration', 'coordination',
             'cooperation', 'audit', 'codesign', 'coidentify')


def vsm_rows(data):
    """One :Instance per survey response, carrying its eight VSM scores.

    A response is a thing that happened — it has a respondent and a date — so
    it is an Instance, not vocabulary. The scores are kept together as one
    string rather than eight properties because what a Rasch reading wants is
    the response pattern, and splitting it now would only have to be rejoined.
    """
    out = []
    for r in data.get('VSM', []):
        scores = {k: (r.get(k) or '').strip() for k in VSM_ITEMS}
        scores = {k: v for k, v in scores.items() if v}
        if not scores:
            continue
        ent = (r.get('entity_name') or '').strip()
        out.append({'id': (r.get('id') or '').strip() or f'V{len(out)+1}',
                    'name': (r.get('vsm_survey_name') or '').strip(),
                    'resp': (r.get('vsm_respondent_name') or '').strip(),
                    'date': (r.get('survey_date') or '').strip(),
                    'scores': '; '.join(f'{k}={v}' for k, v in sorted(scores.items())),
                    'entity_key': canon(ent) if ent else None})
    return out


def report(counts, names, kinds, sources, edges):
    for table in TABLES:
        n, e = counts[table]
        print('loaded %-9s %4d rows  %4d links' % (table, n, e))

    cross = {k: v for k, v in kinds.items() if len(v) > 1}
    print('\nONE NAME, TWO KINDS — each is a claim that the same thing plays two roles.')
    if not cross:
        print('  none')
    for k, v in sorted(cross.items()):
        print('  %-42s %s' % (names[k][:42], ' + '.join(sorted(v))))

    # Names differing only by trailing punctuation are almost certainly the same
    # thing, but decision #11 says report, never rewrite.
    stripped = defaultdict(list)
    for k in names:
        stripped[k.rstrip('*.,;:-')].append(k)
    near = {b: v for b, v in stripped.items() if len(v) > 1}
    print('\nNEAR-COLLISIONS — same name but for trailing punctuation. Not merged.')
    if not near:
        print('  none')
    for b, v in sorted(near.items()):
        print('  %s' % '  |  '.join(names[x] for x in sorted(v)))


def verify(vsm):
    print('\n--- what the substrate now holds ---')
    for r in run('MATCH (c:Concept) RETURN c.kind AS k, count(*) AS n '
                 'ORDER BY n DESC', database=DB):
        print('  %-12s %d' % (r['k'], r['n']))
    e = run('MATCH ()-[r:REL]->() RETURN count(r) AS n', database=DB)[0]['n']
    g = run('MATCH (c:Concept) WHERE size(c.sources) > 1 RETURN count(c) AS n',
            database=DB)[0]['n']
    print('  %-12s %d' % ('links', e))
    print('  %-12s %d  (named by more than one table)' % ('gold', g))
    print('  %-12s %d' % ('vsm responses', len(vsm)))


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--src', required=True, help='directory holding the MBKF CSVs')
    a = ap.parse_args()
    data, names, kinds, props, sources, edges, counts = build(a.src)
    vsm = vsm_rows(data)
    write(names, kinds, props, sources, edges, vsm)
    report(counts, names, kinds, sources, edges)
    verify(vsm)
