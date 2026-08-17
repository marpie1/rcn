#!/usr/bin/env python3
"""Convert a TheBrain export folder into RCN Graph Tool v22 JSON.

TheBrain's export is a directory: JSONL sidecar files (thoughts, links,
attachments) plus one folder per thought holding its notes and attachments.
Every file carries a UTF-8 BOM and is newline-delimited JSON, NOT a JSON array.

The Plex never shows a whole Brain -- it shows the neighborhood of whatever you
clicked. This script works the same way on purpose. A whole-brain dump is a
hairball; the graph tool is a surface a group points at. So the default unit of
export is a root thought plus a depth.

    python3 tools/brain-to-graph.py BRAINDIR --list-roots
    python3 tools/brain-to-graph.py BRAINDIR --directed-only -o schema.json
    python3 tools/brain-to-graph.py BRAINDIR --root "Columbia Valley Community" --depth 2

Enums below were decoded empirically from Carl's March Brain (ExchangeFormat 5),
not from documentation. Unknown values degrade to "normal" rather than raising.
"""
import argparse, collections, html, json, os, re, sys, unicodedata

# ── TheBrain enums ───────────────────────────────────────────────────────────
# Thought.Kind
K_NORMAL, K_TYPE, K_TAG, K_SYSTEM = 1, 2, 4, 5
# Link.Relation
R_CHILD, R_JUMP = 1, 3
# Link.Meaning -- what the link is FOR. Only M_NORMAL is a real graph edge; the
# rest are how TheBrain stores typing and tagging, and traversing them would
# route depth-2 through a type hub and reach the whole brain.
M_NORMAL, M_INSTANCE, M_SUBTYPE, M_TAG, M_SYSTEM, M_SUBTAG = 1, 2, 3, 5, 6, 7
# Link.Direction: -1 means unspecified. Anything else is an authored direction,
# and in practice those are the only links whose Name is a relation verb.
D_NONE = -1
# Attachment.Type
A_URL = 3

# Tag families that classify a thought on an axis of their own rather than
# saying what it is. These become layers, which the tool can hide.
LAYER_TAG_PARENTS = {'Scales', 'VSM tags', 'VSM Types'}

PALETTE = ['#dbeafe', '#dcfce7', '#fef3c7', '#fae8ff', '#ffe4e6',
           '#e0e7ff', '#ccfbf1', '#fed7aa']
BORDERS = ['#2563eb', '#16a34a', '#d97706', '#a21caf', '#e11d48',
           '#4f46e5', '#0d9488', '#ea580c']


# ── loading ──────────────────────────────────────────────────────────────────
def load_jsonl(path):
    """TheBrain writes newline-delimited JSON with a BOM. json.load() fails twice."""
    if not os.path.exists(path):
        return []
    out = []
    with open(path, encoding='utf-8-sig') as fh:
        for line in fh:
            line = line.strip()
            if line:
                out.append(json.loads(line))
    return out


def argb_to_hex(v):
    """TheBrain stores colour as a signed 32-bit ARGB int. -65281 is #FF00FF."""
    if v is None:
        return None
    return '#%02X%02X%02X' % ((v >> 16) & 255, (v >> 8) & 255, v & 255)


def contrast_for(bg):
    """Carl coloured some thoughts navy. Black caption on navy is unreadable, and
    the importer has no business shipping a node nobody can read."""
    try:
        r, g, b = (int(bg[i:i + 2], 16) for i in (1, 3, 5))
    except (ValueError, IndexError):
        return '#000000'
    return '#000000' if (0.299 * r + 0.587 * g + 0.114 * b) > 140 else '#ffffff'


def html_to_text(s):
    s = re.sub(r'(?is)<(script|style).*?</\1>', '', s)
    s = re.sub(r'(?i)<br\s*/?>', '\n', s)
    s = re.sub(r'(?i)</(p|div|li|h[1-6]|tr)>', '\n', s)
    s = re.sub(r'(?i)<li[^>]*>', '- ', s)
    s = re.sub(r'<[^>]+>', '', s)
    s = html.unescape(s)
    # House style: one line per paragraph, no hard wrapping.
    paras = [re.sub(r'[ \t]+', ' ', p).strip() for p in s.split('\n')]
    return '\n'.join(p for p in paras if p)


def read_note(braindir, tid, limit):
    """Notes come in two vintages: newer Notes.md, older Notes/notes.html."""
    md = os.path.join(braindir, tid, 'Notes.md')
    ht = os.path.join(braindir, tid, 'Notes', 'notes.html')
    text = None
    if os.path.exists(md):
        text = open(md, encoding='utf-8-sig', errors='replace').read().strip()
    elif os.path.exists(ht):
        text = html_to_text(open(ht, encoding='utf-8-sig', errors='replace').read())
    if not text:
        return None
    if limit and len(text) > limit:
        text = text[:limit].rstrip() + '…'
    return text


def slug(s, n=28):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    s = re.sub(r'[^a-zA-Z0-9]+', '_', s).strip('_').lower()
    return (s or 'x')[:n]


# ── the brain, indexed ───────────────────────────────────────────────────────
class Brain:
    def __init__(self, braindir, include_forgotten=False):
        self.dir = braindir
        self.thoughts = load_jsonl(os.path.join(braindir, 'thoughts.json'))
        self.links = load_jsonl(os.path.join(braindir, 'links.json'))
        self.attachments = load_jsonl(os.path.join(braindir, 'attachments.json'))
        if not self.thoughts:
            sys.exit(f'no thoughts.json in {braindir!r} -- is this a TheBrain export folder?')

        self.by_id = {t['Id']: t for t in self.thoughts}
        self.forgotten = {t['Id'] for t in self.thoughts if t.get('ForgottenDateTime')}
        self.include_forgotten = include_forgotten

        # Links whose endpoints are gone are link-type definitions, not links.
        self.links = [l for l in self.links
                      if l['ThoughtIdA'] in self.by_id and l['ThoughtIdB'] in self.by_id]

        self.structural = [l for l in self.links
                           if l.get('Meaning') == M_NORMAL
                           and l.get('Relation') in (R_CHILD, R_JUMP)
                           and self.alive(l['ThoughtIdA']) and self.alive(l['ThoughtIdB'])]

        # What a thought IS. TypeId is authoritative; a type->instance link is the
        # fallback. Only for ordinary thoughts: on a Type thought TypeId means its
        # SUPERtype, which is a different claim and must not become a schemaLabel.
        self.type_of, self.supertype_of = {}, {}
        for l in self.links:
            if l.get('Meaning') == M_INSTANCE:
                self.type_of.setdefault(l['ThoughtIdB'], l['ThoughtIdA'])
        for t in self.thoughts:
            ty = t.get('TypeId')
            if ty and ty in self.by_id:
                if t['Kind'] == K_NORMAL:
                    self.type_of[t['Id']] = ty
                else:
                    self.supertype_of[t['Id']] = ty
        self.type_of = {k: v for k, v in self.type_of.items()
                        if self.by_id[k]['Kind'] == K_NORMAL}

        # Tags, and which tag family each tag belongs to.
        self.tags_of = collections.defaultdict(list)
        for l in self.links:
            if l.get('Meaning') == M_TAG:
                self.tags_of[l['ThoughtIdB']].append(l['ThoughtIdA'])
        self.tag_parent = {}
        for l in self.links:
            if l.get('Meaning') == M_SUBTAG:
                self.tag_parent[l['ThoughtIdB']] = l['ThoughtIdA']

        # Only Type 3 attachments are real URLs. Type 2 is a dead Windows path.
        self.urls_of = collections.defaultdict(list)
        for a in self.attachments:
            if a.get('Type') == A_URL and a.get('Location'):
                self.urls_of[a['SourceId']].append((a.get('Name') or '', a['Location']))

        self.adj = collections.defaultdict(set)
        for l in self.structural:
            self.adj[l['ThoughtIdA']].add(l['ThoughtIdB'])
            self.adj[l['ThoughtIdB']].add(l['ThoughtIdA'])

    def alive(self, tid):
        return self.include_forgotten or tid not in self.forgotten

    def name(self, tid):
        t = self.by_id.get(tid)
        return t['Name'] if t else '?'

    def resolve(self, needle):
        """Accept a GUID, an exact name, or a unique case-insensitive substring."""
        if needle in self.by_id:
            return needle
        cands = [t for t in self.thoughts if t['Name'] == needle]
        if not cands:
            cands = [t for t in self.thoughts if needle.lower() in t['Name'].lower()]
        if not cands:
            sys.exit(f'no thought matches {needle!r} -- try --list-roots')
        if len(cands) > 1:
            # A name is often shared by an ordinary thought and the Type of the
            # same name. The one with neighbours is the one you meant.
            ranked = sorted(cands, key=lambda t: (t['Kind'] != K_NORMAL,
                                                  -len(self.adj[t['Id']])))
            best, runner = ranked[0], ranked[1]
            if (best['Kind'] != K_NORMAL) == (runner['Kind'] != K_NORMAL) \
                    and len(self.adj[best['Id']]) == len(self.adj[runner['Id']]):
                sys.exit(f'{needle!r} is ambiguous:\n' + '\n'.join(
                    f"  {t['Id']}  Kind {t['Kind']}  {t['Name']}" for t in ranked[:12]))
            sys.stderr.write(
                f"  {needle!r} matched {len(cands)}; using Kind {best['Kind']} "
                f"{best['Name']!r} ({len(self.adj[best['Id']])} links)\n")
            return best['Id']
        return cands[0]['Id']

    def tag_names(self, tid):
        """Split a thought's tags into layer-ish axes and plain tags."""
        layers, plain = [], []
        for g in self.tags_of.get(tid, []):
            nm = self.name(g)
            parent = self.tag_parent.get(g)
            if parent and self.name(parent) in LAYER_TAG_PARENTS:
                layers.append((self.name(parent), nm))
            else:
                plain.append(nm)
        return layers, plain


# ── selection ────────────────────────────────────────────────────────────────
def select_neighborhood(brain, roots, depth):
    seen, frontier = set(roots), set(roots)
    dist = {r: 0 for r in roots}
    for d in range(1, depth + 1):
        nxt = set()
        for tid in frontier:
            for other in brain.adj[tid]:
                if other not in seen and brain.alive(other):
                    seen.add(other)
                    dist[other] = d
                    nxt.add(other)
        frontier = nxt
        if not frontier:
            break
    return seen, dist


def select_directed(brain):
    """The links Carl actually authored a direction and a verb for."""
    ls = [l for l in brain.structural if l.get('Direction') != D_NONE]
    ids = {l['ThoughtIdA'] for l in ls} | {l['ThoughtIdB'] for l in ls}
    return ids, ls


# ── layout ───────────────────────────────────────────────────────────────────
def wrap_len(label, per_line=20):
    words, lines, cur = label.split(), [], ''
    for w in words:
        if cur and len(cur) + 1 + len(w) > per_line:
            lines.append(cur)
            cur = w
        else:
            cur = (cur + ' ' + w).strip()
    if cur:
        lines.append(cur)
    lines = lines or ['']
    return max(len(x) for x in lines), len(lines)


def size_for(label):
    longest, nlines = wrap_len(label)
    w = min(230, max(100, int(longest * 7.4) + 22))
    h = max(46, 22 + 20 * nlines)
    return w, h


def layered_layout(nodes, dist, rankdir='LR'):
    """Rank by hop distance from the root. Parent/child is already a rank
    relation, so this lands close to what Dagre would do -- and the file opens
    readable instead of as a pile at the origin."""
    ranks = collections.defaultdict(list)
    for n in nodes:
        ranks[dist.get(n['id'], 0)].append(n)
    GAP_RANK, GAP_WITHIN, MAX_PER_BAND = 130, 28, 12
    across, along = ('w', 'h') if rankdir == 'LR' else ('h', 'w')
    cursor = 0.0
    for r in sorted(ranks):
        members = sorted(ranks[r], key=lambda n: n['label'].lower())
        # A hub with 30 children would otherwise be one 2000px column. Wrap the
        # rank into sub-bands so the drawing opens at a shape you can look at.
        nbands = max(1, -(-len(members) // MAX_PER_BAND))
        per = -(-len(members) // nbands)
        for b in range(nbands):
            col = members[b * per:(b + 1) * per]
            if not col:
                continue
            band = max(n[across] for n in col)
            run = sum(n[along] for n in col) + GAP_WITHIN * (len(col) - 1)
            pos = -run / 2
            for n in col:
                centre, offset = cursor + band / 2, pos + n[along] / 2
                n['x'], n['y'] = (centre, offset) if rankdir == 'LR' else (offset, centre)
                pos += n[along] + GAP_WITHIN
            cursor += band + GAP_RANK


# ── build ────────────────────────────────────────────────────────────────────
def build(brain, keep, edges, dist, args):
    type_freq = collections.Counter()
    for tid in keep:
        ty = brain.type_of.get(tid)
        if ty:
            type_freq[ty] += 1

    legend, row_for_type = [], {}
    for i, (ty, _) in enumerate(type_freq.most_common(args.max_legend)):
        rid = 'lg_t_' + slug(brain.name(ty))
        row_for_type[ty] = rid
        legend.append({'id': rid, 'kind': 'node', 'label': brain.name(ty),
                       'color': PALETTE[i % len(PALETTE)],
                       'borderColor': BORDERS[i % len(BORDERS)], 'borderWidth': 2.5})

    nodes = []
    for tid in sorted(keep, key=lambda x: (dist.get(x, 0), brain.name(x).lower())):
        t = brain.by_id[tid]
        label = t['Name']
        w, h = size_for(label)
        props = {'brainId': tid}
        if t.get('Label'):
            props['_label'] = t['Label']          # a gloss, not an alias
        layers, plain = brain.tag_names(tid)
        if plain:
            props['tags'] = ', '.join(sorted(set(plain)))
        for fam, val in layers:
            props['_' + slug(fam, 12)] = val
        for j, (nm, url) in enumerate(brain.urls_of.get(tid, [])[:3]):
            props['_url' + ('' if j == 0 else str(j + 1))] = url
        if tid in brain.supertype_of:
            props['supertype'] = brain.name(brain.supertype_of[tid])
        if tid in brain.forgotten:
            props['forgotten'] = 'true'

        n = {'id': tid, 'label': label, 'x': 0, 'y': 0, 'w': w, 'h': h,
             'shape': 'rounded', 'props': props}
        ty = brain.type_of.get(tid)
        if ty:
            n['schemaLabel'] = brain.name(ty)
            if ty in row_for_type:
                n['type'] = row_for_type[ty]
        if layers:
            n['layer'] = layers[0][1]
        note = read_note(brain.dir, tid, args.max_note)
        if note:
            n['note'] = note
        own_bg = argb_to_hex(t.get('BackgroundColor'))
        if own_bg and not n.get('type'):
            n['color'] = own_bg
            n['fontColor'] = argb_to_hex(t.get('ForegroundColor')) or contrast_for(own_bg)
        nodes.append(n)

    # Edge legend. A verb gets its own row; plain containment and unlabelled
    # jumps get one row each.
    verb_rows, verb_color, edge_rows = {}, {}, []
    verbs = collections.Counter(
        l['Name'] for l in edges if l.get('Direction') != D_NONE and l.get('Name'))
    for i, (verb, _) in enumerate(verbs.most_common()):
        # One verb can carry several colours -- Carl's two "Power" edges are
        # yellow and red. The row takes the commonest; the odd ones out keep
        # their own colour in `ovr` rather than being quietly flattened.
        cols = collections.Counter(argb_to_hex(l['Color']) for l in edges
                                   if l.get('Name') == verb and l.get('Color'))
        col = cols.most_common(1)[0][0] if cols else BORDERS[i % len(BORDERS)]
        rid = 'lg_r_' + slug(verb)
        verb_rows[verb] = rid
        verb_color[verb] = col
        edge_rows.append({'id': rid, 'kind': 'edge', 'label': verb,
                          'color': col, 'width': 2.5, 'dash': 'solid'})
    has_child = any(l['Relation'] == R_CHILD and l.get('Direction') == D_NONE for l in edges)
    has_jump = any(l['Relation'] == R_JUMP and not (
        l.get('Direction') != D_NONE and l.get('Name')) for l in edges)
    if has_child:
        edge_rows.append({'id': 'lg_child', 'kind': 'edge', 'label': 'contains',
                          'color': '#64748b', 'width': 1.5, 'dash': 'solid'})
    if has_jump:
        edge_rows.append({'id': 'lg_jump', 'kind': 'edge', 'label': 'related to',
                          'color': '#94a3b8', 'width': 1.5, 'dash': 'dashed'})
    legend += edge_rows

    out_edges = []
    for l in edges:
        directed = l.get('Direction') != D_NONE
        name = l.get('Name')
        e = {'id': l['Id'], 'src': l['ThoughtIdA'], 'tgt': l['ThoughtIdB'],
             'label': name if (directed and name) else '',
             'polarity': 'none', 'curved': True, 'width': 1.5, 'fontSize': 10,
             'props': {}}
        if directed and name:
            e['type'] = verb_rows[name]
            own = argb_to_hex(l.get('Color'))
            if own and own != verb_color[name]:
                e['ovr'] = {'color': own}
        elif l['Relation'] == R_JUMP:
            e['type'] = 'lg_jump'
            e['arrowDir'] = 'none'   # a jump is associative; an arrow would lie
        else:
            e['type'] = 'lg_child'
        if name and not directed:
            # 38 of 47 named links in Carl's brain are meeting schedules. That is
            # a property of the relationship, not the verb on it.
            e['props']['schedule'] = name
        out_edges.append(e)

    stamp(nodes, out_edges, legend)
    layered_layout(nodes, dist, args.rankdir)
    return nodes, out_edges, legend


def stamp(nodes, edges, legend):
    """Write each element's resolved style as a bare field. A file where style
    lives only in the legend renders here and is invisible to everything else."""
    rows = {r['id']: r for r in legend}

    def resolved(el, field, fallback):
        # The tool's own order: element.ovr -> legend row -> element's own field.
        if field in el.get('ovr', {}):
            return el['ovr'][field]
        row = rows.get(el.get('type'), {})
        if field in row:
            return row[field]
        return el.get(field, fallback)

    for n in nodes:
        n['color'] = resolved(n, 'color', '#ffffff')
        n['borderColor'] = resolved(n, 'borderColor', '#000000')
        n['borderWidth'] = resolved(n, 'borderWidth', 1.5)
        n['borderDash'] = resolved(n, 'borderDash', 'solid')
        n['fontColor'] = resolved(n, 'fontColor', '#000000')
        n['fontSize'] = resolved(n, 'fontSize', 12)
    for e in edges:
        e['color'] = resolved(e, 'color', '#000000')
        e['width'] = resolved(e, 'width', 1.5)
        e['dash'] = resolved(e, 'dash', 'solid')
        e['fontSize'] = resolved(e, 'fontSize', 10)
        e['fontColor'] = resolved(e, 'fontColor', e['color'])


# ── main ─────────────────────────────────────────────────────────────────────
def main():
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument('braindir')
    p.add_argument('-o', '--out')
    p.add_argument('--root', action='append', default=[],
                   help='root thought: GUID, exact name, or unique substring')
    p.add_argument('--depth', type=int, default=2)
    p.add_argument('--directed-only', action='store_true',
                   help='just the links carrying an authored direction and verb')
    p.add_argument('--no-jumps', action='store_true')
    p.add_argument('--include-forgotten', action='store_true')
    p.add_argument('--max-nodes', type=int, default=80)
    p.add_argument('--max-legend', type=int, default=6)
    p.add_argument('--max-note', type=int, default=1000)
    p.add_argument('--rankdir', choices=['LR', 'TB'], default='LR')
    p.add_argument('--name')
    p.add_argument('--list-roots', action='store_true')
    p.add_argument('--list-types', action='store_true')
    args = p.parse_args()

    brain = Brain(args.braindir, args.include_forgotten)
    sys.stderr.write(f'{len(brain.thoughts)} thoughts, {len(brain.links)} links, '
                     f'{len(brain.structural)} structural, '
                     f'{len(brain.forgotten)} forgotten\n')

    if args.list_roots:
        deg = collections.Counter()
        for l in brain.structural:
            deg[l['ThoughtIdA']] += 1
            deg[l['ThoughtIdB']] += 1
        print('degree  thought')
        for tid, d in deg.most_common(30):
            if brain.by_id[tid]['Kind'] == K_NORMAL:
                print(f'{d:6d}  {brain.name(tid)}')
        return
    if args.list_types:
        freq = collections.Counter(brain.type_of.values())
        print('instances  type')
        for tid, c in freq.most_common():
            print(f'{c:9d}  {brain.name(tid)}')
        return

    if args.directed_only:
        keep, edges = select_directed(brain)
        dist = {}
        seeds = {l['ThoughtIdA'] for l in edges} - {l['ThoughtIdB'] for l in edges}
        frontier, d = seeds or set(list(keep)[:1]), 0
        while frontier:
            for t in frontier:
                dist.setdefault(t, d)
            d += 1
            frontier = {l['ThoughtIdB'] for l in edges
                        if l['ThoughtIdA'] in frontier and l['ThoughtIdB'] not in dist}
        for t in keep:
            dist.setdefault(t, 0)
        title = args.name or 'Brain — authored relations'
    else:
        if not args.root:
            sys.exit('need --root (try --list-roots), or --directed-only')
        roots = [brain.resolve(r) for r in args.root]
        keep, dist = select_neighborhood(brain, roots, args.depth)
        edges = [l for l in brain.structural
                 if l['ThoughtIdA'] in keep and l['ThoughtIdB'] in keep]
        title = args.name or f'{brain.name(roots[0])} — depth {args.depth}'

    if args.no_jumps:
        edges = [l for l in edges if l['Relation'] != R_JUMP]
        touched = {l['ThoughtIdA'] for l in edges} | {l['ThoughtIdB'] for l in edges}
        keep = {k for k in keep if k in touched or dist.get(k, 1) == 0}

    if len(keep) > args.max_nodes:
        sys.exit(f'{len(keep)} nodes exceeds --max-nodes {args.max_nodes}. '
                 f'A drawing a group can read is smaller than this. '
                 f'Lower --depth, or raise the cap deliberately.')

    nodes, out_edges, legend = build(brain, keep, edges, dist, args)

    graph = {'version': '1.0', 'modelName': title, 'legendVisible': True,
             'legendEntries': legend, 'nodes': nodes, 'edges': out_edges}

    text = json.dumps(graph, indent=2, ensure_ascii=False)
    if args.out:
        with open(args.out, 'w', encoding='utf-8') as fh:
            fh.write(text + '\n')
        sys.stderr.write(f'wrote {args.out}: {len(nodes)} nodes, {len(out_edges)} edges, '
                         f'{len(legend)} legend rows\n')
        untyped = sum(1 for n in nodes if not n.get('schemaLabel'))
        if untyped:
            sys.stderr.write(f'  {untyped}/{len(nodes)} nodes carry no schemaLabel '
                             f'-- those will not merge in the Composer\n')
        if len(legend) > 8:
            sys.stderr.write(f'  {len(legend)} legend rows is over budget (8)\n')
    else:
        print(text)


if __name__ == '__main__':
    main()
