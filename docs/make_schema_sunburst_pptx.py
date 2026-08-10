"""
Generate tools/rcn-schema-sunburst-intro.pptx — the Schema Sunburst intro deck.

Companion to tools/schema-sunburst-intro.html; same argument, deck shape.
Regenerate after editing:  python3 docs/make_schema_sunburst_pptx.py
Requires: pip install python-pptx

The wheel on slide 6 is drawn with FREEFORM shapes, not an imported picture, so
it stays vector and editable in PowerPoint. Its geometry is the real thing: the
family and concept weights below are the SOURCE counts from `aspects16`, copied
out of /projection/vocabulary. If the substrate's vocabulary changes materially,
re-run that projection and update FAMILIES rather than nudging the picture.
"""

import os
from math import cos, sin, pi
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

# ── Palette — indigo for the substrate lens, matching the intro page ─────────
IN     = RGBColor(0x43, 0x38, 0xca)   # indigo — this tool
IN_LT  = RGBColor(0xe0, 0xe7, 0xff)
IN_BG  = RGBColor(0xee, 0xf2, 0xff)
IN_DK  = RGBColor(0x31, 0x2e, 0x81)
GRN    = RGBColor(0x16, 0x65, 0x34)
GRN_LT = RGBColor(0xdc, 0xfc, 0xe7)
RD     = RGBColor(0x99, 0x1b, 0x1b)
RD_LT  = RGBColor(0xfe, 0xe2, 0xe2)
AMB    = RGBColor(0x92, 0x40, 0x0e)
AMB_LT = RGBColor(0xff, 0xfb, 0xeb)
BLACK  = RGBColor(0x0f, 0x17, 0x2a)
GREY   = RGBColor(0x47, 0x55, 0x69)
LGREY  = RGBColor(0x94, 0xa3, 0xb8)
SLATE  = RGBColor(0xe2, 0xe8, 0xf0)
WHITE  = RGBColor(0xff, 0xff, 0xff)
OFF    = RGBColor(0xf8, 0xfa, 0xfc)
INK    = RGBColor(0x1a, 0x1a, 0x1a)

# ── The real data, from /projection/vocabulary?db=aspects16 ──────────────────
# (family, ring colour, fill, [(concept, source count), …])
FAMILIES = [
    ('Setting',     '#009e73', '#9edaca', [('Culture', 4), ('Ecology', 1), ('Place', 2)]),
    ('Institution', '#0072b2', '#b8d8e9', [('Government', 1), ('Org', 9), ('Role', 3)]),
    ('Aim',         '#6a3d9a', '#d5c9e3', [('ActiveGoal', 3), ('Ideal', 3), ('Purpose', 2), ('Value', 4)]),
    ('Doing',       '#e69f00', '#f6db9e', [('Action', 6), ('Commitment', 2), ('Conversation', 1),
                                           ('Possibility', 1), ('Trust', 1)]),
    ('Outcome',     '#56b4e9', '#bfe2f7', [('Result', 5), ('Solution', 1)]),
    ('Issue',       '#96203f', '#e2c1c9', [('Problem', 5), ('SideEffect', 1)]),
    ('Resource',    '#cc79a7', '#ecccde', [('Asset', 1), ('Power', 1)]),
    ('Person',      '#d55e00', '#efc29e', [('Affect', 1), ('Motivation', 5), ('Person', 8)]),
]

prs = Presentation()
prs.slide_width  = Inches(13.33)
prs.slide_height = Inches(7.5)
BLANK = prs.slide_layouts[6]


# ── Primitives ───────────────────────────────────────────────────────────────

def rgb(hexstr):
    n = int(hexstr.lstrip('#'), 16)
    return RGBColor(n >> 16 & 255, n >> 8 & 255, n & 255)


def slide():
    return prs.slides.add_slide(BLANK)


def bg(sl, color):
    f = sl.background.fill
    f.solid()
    f.fore_color.rgb = color


def rect(sl, x, y, w, h, fill=WHITE, line=None, lw=1.5):
    sh = sl.shapes.add_shape(1, Inches(x), Inches(y), Inches(w), Inches(h))
    sh.fill.solid()
    sh.fill.fore_color.rgb = fill
    if line:
        sh.line.color.rgb = line
        sh.line.width = Pt(lw)
    else:
        sh.line.fill.background()
    return sh


def txt(sl, text, x, y, w, h, size=20, bold=False, italic=False,
        color=BLACK, align=PP_ALIGN.LEFT):
    tb = sl.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = align
    r = p.add_run()
    r.text = text
    r.font.size = Pt(size)
    r.font.bold = bold
    r.font.italic = italic
    r.font.color.rgb = color
    r.font.name = 'Calibri'
    return tb


def txlines(sl, lines, x, y, w, h, sizes=None, bolds=None, colors=None,
            align=PP_ALIGN.LEFT, spacing=None):
    tb = sl.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = True
    for i, line in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        if spacing:
            p.space_after = Pt(spacing)
        r = p.add_run()
        r.text = line
        r.font.size = Pt(sizes[i] if isinstance(sizes, list) else (sizes or 18))
        r.font.bold = bolds[i] if isinstance(bolds, list) else (bolds or False)
        r.font.color.rgb = colors[i] if isinstance(colors, list) else (colors or BLACK)
        r.font.name = 'Calibri'
    return tb


def box_txt(sl, lines, x, y, w, h, fill=IN_BG, line=IN, lw=1.5,
            size=15, bold_first=True, text_color=BLACK,
            top_color=None, align=PP_ALIGN.CENTER):
    sh = rect(sl, x, y, w, h, fill=fill, line=line, lw=lw)
    tf = sh.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.14)
    tf.margin_right = Inches(0.14)
    tf.margin_top = Inches(0.1)
    tf.margin_bottom = Inches(0.1)
    for i, line_text in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        r = p.add_run()
        r.text = line_text
        r.font.size = Pt(size if i > 0 else size + 1)
        r.font.bold = (bold_first and i == 0)
        r.font.color.rgb = (top_color or text_color) if i == 0 else text_color
        r.font.name = 'Calibri'
    return sh


def label(sl, text, color=IN_DK):
    txt(sl, text, 0.45, 0.18, 8, 0.3, size=9, bold=True, color=color)


def bar(sl, color=IN, y=0.55, h=0.035):
    rect(sl, 0, y, 13.33, h, fill=color)


def title_txt(sl, text, color=BLACK, size=34, y=0.62):
    txt(sl, text, 0.45, y, 12.4, 1.3, size=size, bold=True, color=color)


def foot(sl, text):
    txt(sl, text, 0.45, 6.95, 12.4, 0.35, size=10, color=LGREY)


# ── The wheel, drawn as freeform ring segments ───────────────────────────────
# Polyline-approximated arcs rather than PIE autoshapes: the adjustment values
# on a pie are awkward to get right, and a freeform is exactly the geometry we
# computed. Editable vector either way.

def ring_seg(sl, cx, cy, r0, r1, f0, f1, fill, line, lw=0.75):
    steps = max(8, int((f1 - f0) * 300))
    pts = []
    for i in range(steps + 1):
        a = 2 * pi * (f0 + (f1 - f0) * i / steps) - pi / 2
        pts.append((cx + r1 * cos(a), cy + r1 * sin(a)))
    for i in range(steps, -1, -1):
        a = 2 * pi * (f0 + (f1 - f0) * i / steps) - pi / 2
        pts.append((cx + r0 * cos(a), cy + r0 * sin(a)))
    b = sl.shapes.build_freeform(Inches(pts[0][0]), Inches(pts[0][1]))
    b.add_line_segments([(Inches(x), Inches(y)) for x, y in pts[1:]], close=True)
    sh = b.convert_to_shape()
    sh.fill.solid()
    sh.fill.fore_color.rgb = fill
    sh.line.color.rgb = line
    sh.line.width = Pt(lw)
    return sh


def wheel(sl, cx, cy, hub_r, bands, weighted=True, hub_lines=None, ring_labels=True):
    """Draw the sunburst. `bands` is [(r0,r1) family, (r0,r1) concept]."""
    fams = []
    for name, col, fil, kids in FAMILIES:
        w = sum((k[1] if weighted else 1) for k in kids)
        fams.append((name, col, fil, kids, w))
    total = sum(f[4] for f in fams)
    cur = 0.0
    for name, col, fil, kids, fw in fams:
        span = fw / total
        ring_seg(sl, cx, cy, bands[0][0], bands[0][1], cur, cur + span,
                 rgb(fil), INK, 0.75)
        inner = cur
        for kname, kw in kids:
            w = kw if weighted else 1
            ks = span * w / fw
            # a paler tint of the same hue for the outer ring
            n = int(fil.lstrip('#'), 16)
            pale = RGBColor(*[min(255, int(c + (255 - c) * .45))
                              for c in (n >> 16 & 255, n >> 8 & 255, n & 255)])
            ring_seg(sl, cx, cy, bands[1][0], bands[1][1], inner, inner + ks,
                     pale, INK, 0.5)
            inner += ks
        # the family divider, in the family's own hue
        a = 2 * pi * cur - pi / 2
        ln = sl.shapes.add_connector(
            1, Inches(cx + bands[0][0] * cos(a)), Inches(cy + bands[0][0] * sin(a)),
            Inches(cx + bands[1][1] * cos(a)), Inches(cy + bands[1][1] * sin(a)))
        ln.line.color.rgb = rgb(col)
        ln.line.width = Pt(1.6)
        # family name, on the ring, where the wedge is wide enough to hold it
        if ring_labels and span > 0.07:
            mid = cur + span / 2
            am = 2 * pi * mid - pi / 2
            rl = (bands[0][0] + bands[0][1]) / 2
            tb = txt(sl, name, cx + rl * cos(am) - 0.6, cy + rl * sin(am) - 0.13,
                     1.2, 0.28, size=10, bold=True, color=INK, align=PP_ALIGN.CENTER)
            tb.text_frame.word_wrap = False
        cur += span

    hub = sl.shapes.add_shape(9, Inches(cx - hub_r), Inches(cy - hub_r),
                              Inches(hub_r * 2), Inches(hub_r * 2))
    hub.fill.solid()
    hub.fill.fore_color.rgb = RGBColor(0x93, 0xc5, 0xfd)
    hub.line.color.rgb = INK
    hub.line.width = Pt(1.25)
    tf = hub.text_frame
    tf.word_wrap = True
    for i, line in enumerate(hub_lines or ['RCN', 'Substrate']):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = PP_ALIGN.CENTER
        r = p.add_run()
        r.text = line
        r.font.size = Pt(11 if i == 0 else 9)
        r.font.bold = (i == 0)
        r.font.color.rgb = INK
        r.font.name = 'Calibri'


# ── 1 · Title ────────────────────────────────────────────────────────────────
s = slide()
bg(s, BLACK)
rect(s, 0, 0, 13.33, 0.14, fill=IN)
txt(s, "RCN TOOLSET  ·  SUBSTRATE LENS", 0.9, 1.7, 11, 0.4, size=13, bold=True, color=IN_LT)
txt(s, "Schema Sunburst", 0.9, 2.2, 11.5, 1.25, size=54, bold=True, color=WHITE)
txlines(s, [
    "Every concept the neighborhood uses, in one circle.",
    "The family it belongs to, and the words a person reads.",
    "Sized by how widely each one is actually used.",
], 0.9, 3.65, 11, 1.6, sizes=22, colors=SLATE, spacing=8)
txt(s, "The fourth lens, alongside the Graph Tool (cause), the Timeline (time) and the Map (space)",
    0.9, 6.3, 11.5, 0.4, size=13, italic=True, color=LGREY)

# ── 2 · The problem ──────────────────────────────────────────────────────────
s = slide()
bg(s, OFF)
label(s, "THE PROBLEM")
bar(s)
title_txt(s, "A group cannot see its own vocabulary")
txlines(s, [
    "Sixteen drawings decompose one schema, one topic at a time.",
    "Between them they used twenty-four concepts, in eight families.",
    "The only way to see that was to read a table.",
], 0.55, 2.1, 12.2, 1.8, sizes=24, colors=GREY, spacing=12)
box_txt(s, [
    "And nobody argues with a table.",
    "Disagreement about words stays invisible until it surfaces as disagreement about something else — "
    "usually much later, and about causes instead.",
], 0.55, 4.35, 12.2, 1.55, fill=IN_BG, line=IN, size=17, top_color=IN_DK)
foot(s, "Agreeing on causes requires agreeing on words first.")

# ── 3 · Where it fits ────────────────────────────────────────────────────────
s = slide()
bg(s, OFF)
label(s, "WHERE IT FITS")
bar(s)
title_txt(s, "Four lenses, one substrate")
for i, (ic, name, sub, tool) in enumerate([
        ("🔗", "CAUSE", "Nodes + causal edges", "Graph Tool"),
        ("⏳", "TIME", "Intervals + before / meets", "Timeline"),
        ("🗺️", "SPACE", "Parcels + jurisdictions", "Polygon Map"),
        ("🌀", "VOCABULARY", "Families + concepts", "This tool")]):
    here = (i == 3)
    box_txt(s, [f"{ic}  {name}", sub, tool], 0.55 + i * 3.13, 2.35, 2.93, 2.05,
            fill=IN_BG if here else WHITE, line=IN if here else SLATE,
            lw=2.5 if here else 1.5, size=14, top_color=IN_DK if here else GREY)
txt(s, "Each reads the same Neo4j graph and answers a different question. This one answers the question "
       "that has to be settled before the others mean anything: what are we calling things, and who agrees?",
    0.55, 4.8, 12.2, 1.1, size=18, color=GREY)
foot(s, "Same substrate underneath. Different question.")

# ── 4 · Why a sunburst ───────────────────────────────────────────────────────
s = slide()
bg(s, OFF)
label(s, "WHY THIS SHAPE")
bar(s)
title_txt(s, "Half the schema was already a tree")
txt(s, "A node-link diagram is the right picture for a network and the wrong picture for a hierarchy — "
       "draw a strict tree as arrows and you get the layout engine's opinion, not the data's.",
    0.55, 1.95, 12.2, 0.9, size=18, color=GREY)
box_txt(s, [
    "Zooming out merges; zooming in never invents.",
    "Family, schema label and variable label are progressively longer names for the same idea. "
    "So every concept has exactly one parent — which is precisely the precondition a sunburst requires.",
], 0.55, 3.0, 12.2, 1.5, fill=IN_BG, line=IN, size=17, top_color=IN_DK)
txt(s, "That was true of our data before anyone thought to draw it this way. Nothing was restructured to fit the picture.",
    0.55, 4.75, 12.2, 0.6, size=17, italic=True, color=GREY)
foot(s, "The Composer's contraction, borrowed as geometry.")

# ── 5 · The rings ────────────────────────────────────────────────────────────
s = slide()
bg(s, OFF)
label(s, "HOW TO READ IT")
bar(s)
title_txt(s, "Ring = level")
rows = [
    ("HUB",    "The substrate", "Which graph you are reading, and how much is in it"),
    ("RING 1", "Family",        "The eight — Setting, Institution, Aim, Doing, Outcome, Issue, Resource, Person"),
    ("RING 2", "Concept",      "The merge key two drawings agree on — Org, Problem, Action"),
    ("RING 3", "States",        "The ways a concept can be measured. Several states split the arc"),
]
for i, (r, what, desc) in enumerate(rows):
    y = 2.05 + i * 1.08
    rect(s, 0.55, y, 1.5, 0.85, fill=IN_LT, line=IN, lw=1.2)
    txt(s, r, 0.55, y + 0.22, 1.5, 0.4, size=13, bold=True, color=IN_DK, align=PP_ALIGN.CENTER)
    txt(s, what, 2.25, y + 0.03, 3.0, 0.4, size=17, bold=True, color=BLACK)
    txt(s, desc, 2.25, y + 0.42, 10.4, 0.5, size=14, color=GREY)
foot(s, "Every ring is the same concept, named at a different level of detail.")

# ── 6 · The picture ──────────────────────────────────────────────────────────
s = slide()
bg(s, WHITE)
label(s, "THE 16 DRAWINGS, AS ONE WHEEL")
bar(s)
wheel(s, cx=4.55, cy=4.05, hub_r=0.72, bands=[(0.72, 1.42), (1.42, 2.30)],
      weighted=True, hub_lines=['aspects16', '24 concepts'])
txt(s, "Wide means far-reaching", 8.15, 1.35, 4.6, 0.5, size=24, bold=True, color=IN_DK)
txlines(s, [
    "Org — in nine of the sixteen drawings",
    "Person — eight",
    "Action — six",
    "Problem, Result — five each",
], 8.15, 2.0, 4.7, 1.7, sizes=16, colors=GREY, spacing=6)
txt(s, "Thin means one corner only", 8.15, 3.95, 4.7, 0.5, size=20, bold=True, color=AMB)
txlines(s, [
    "Asset, Power — the whole Resource family",
    "Ecology · Government · Solution · Trust",
], 8.15, 4.5, 4.7, 1.0, sizes=16, colors=GREY, spacing=6)
box_txt(s, [
    "Nobody designed this shape. It is what sixteen topic drawings needed, added up.",
], 8.15, 5.6, 4.7, 0.85, fill=IN_BG, line=IN, size=14, top_color=IN_DK)
foot(s, "Drawn from /projection/vocabulary — families, colours and counts all derived from the live database.")

# ── 7 · Arc width is evidence ────────────────────────────────────────────────
s = slide()
bg(s, OFF)
label(s, "THE PART THAT IS OURS")
bar(s)
title_txt(s, "Arc width is evidence, not size")
txt(s, "Every sunburst you have seen sizes its arcs by a quantity — bytes, dollars, headcount. "
       "This one sizes them by how many separate source drawings contain the concept.",
    0.55, 1.9, 12.2, 0.85, size=18, color=GREY)
wheel(s, cx=3.35, cy=4.6, hub_r=0.42, bands=[(0.42, 0.85), (0.85, 1.42)],
      weighted=True, hub_lines=['by source'], ring_labels=False)
wheel(s, cx=9.95, cy=4.6, hub_r=0.42, bands=[(0.42, 0.85), (0.85, 1.42)],
      weighted=False, hub_lines=['equal'], ring_labels=False)
txt(s, "WEIGHTED BY SOURCES", 1.75, 6.25, 3.2, 0.4, size=13, bold=True,
    color=IN_DK, align=PP_ALIGN.CENTER)
txt(s, "Resource barely appears. You ask why.", 1.35, 6.6, 4.0, 0.4, size=13,
    color=GREY, align=PP_ALIGN.CENTER)
txt(s, "EQUAL SLICES", 8.35, 6.25, 3.2, 0.4, size=13, bold=True,
    color=GREY, align=PP_ALIGN.CENTER)
txt(s, "Resource looks as central as Person.", 7.95, 6.6, 4.0, 0.4, size=13,
    color=GREY, align=PP_ALIGN.CENTER)
box_txt(s, [
    "Read the width against the right graph.",
    "In aspects16 the sixteen sources are TOPIC drawings, so width means cross-cutting: needed in most "
    "aspects of one schema. In the n=6 reference the sources are PEOPLE, and width there means "
    "agreement — the gold test. Same mechanism, two readings.",
], 5.05, 2.95, 3.2, 2.6, fill=GRN_LT, line=GRN, size=13, top_color=GRN)
foot(s, "Flip the toggle once in a meeting. Somebody always asks about Resource.")

# ── 8 · The variable ring can branch ─────────────────────────────────────────
s = slide()
bg(s, OFF)
label(s, "WHAT THE PICTURE MAKES OBVIOUS")
bar(s)
title_txt(s, "One concept, many variables")
txt(s, "Ring 3 is not a rename. It is the level at which a single concept can be measured several "
       "different ways — and the geometry already has room for it.",
    0.55, 1.9, 12.2, 0.9, size=18, color=GREY)
box_txt(s, ["PROBLEM", "one concept", "Ring 2"], 0.55, 3.05, 2.9, 1.5,
        fill=WHITE, line=SLATE, size=15, top_color=GREY)
txt(s, "→", 3.6, 3.5, 0.6, 0.6, size=30, color=IN, align=PP_ALIGN.CENTER)
for i, v in enumerate(["Seriousness of PROBLEM", "Frequency of PROBLEM", "Cost of PROBLEM"]):
    box_txt(s, [v], 4.35 + i * 3.0, 3.05 + 0, 2.8, 0.72,
            fill=IN_BG, line=IN, size=13, top_color=IN_DK)
txt(s, "Ring 3 — several variables, one parent, arcs that subdivide automatically",
    4.35, 3.95, 8.4, 0.5, size=14, italic=True, color=GREY)
box_txt(s, [
    "There is exactly one example today — and it is being lost.",
    "affect.json draws BOTH “Positive AFFECT” and “Negative AFFECT” as the concept Affect. "
    "Because the substrate merges on schema label, only one survives into the database. "
    "The wheel shows one wedge where the file has two.",
], 0.55, 5.0, 12.23, 1.55, fill=AMB_LT, line=AMB, size=14, top_color=AMB)
foot(s, "The shape was ready for this before the data was. That is the useful direction for a schema to be wrong in.")

# ── 9 · The honest limit ─────────────────────────────────────────────────────
s = slide()
bg(s, OFF)
label(s, "WHAT IT CANNOT DO", color=RD)
bar(s, color=RD)
title_txt(s, "There are no causal edges here, and there never can be")
txt(s, "A sunburst partitions a disc. Every child sits inside exactly one parent, and the geometry "
       "offers nowhere to put an arrow that returns to where it started.",
    0.55, 1.95, 12.2, 0.9, size=19, color=GREY)
box_txt(s, [
    "The Fixes-that-Fail loop has no representation in this shape.",
    "Problem raises Motivation raises Action — and address and resolve close negatively back onto Problem. "
    "That loop is the most important thing in the substrate, and this picture cannot hold it.",
], 0.55, 3.0, 12.23, 1.65, fill=RD_LT, line=RD, size=16, top_color=RD)
txlines(s, [
    "This is the price of the clarity, not a gap to fill later.",
    "Add edges to THIS wheel and the geometry will accept them while the picture lies.",
    "But a different wheel could carry causality: root it on one concept, put its causes in ring 1, "
    "theirs in ring 2. That is a tree — and the same concept appearing twice is the accepted price, "
    "exactly as it already is in the Graph Tool's driver trees.",
    "The rule is not \u201ca sunburst cannot show influence.\u201d It is that the rings must be the "
    "hierarchy you are actually claiming.",
], 0.55, 4.8, 12.2, 2.0, sizes=[18, 15, 15, 15], bolds=[True, False, False, False],
    colors=[BLACK, GREY, GREY, BLACK], spacing=5)
foot(s, "Also absent, for the same reason: instances, which source drawing contributed what, and link families.")

# ── 10 · How it is built ─────────────────────────────────────────────────────
s = slide()
bg(s, OFF)
label(s, "HOW IT IS BUILT")
bar(s)
title_txt(s, "Derived, dumb, and portable")
cols = [
    ("NOTHING IS STORED", "Families, colours, labels and source counts all come out of the live "
     "database. There is no second copy to drift from, so the picture cannot go stale while the data moves.", IN_BG, IN_DK, IN),
    ("THE RENDERER KNOWS NO DOMAIN", "The projection emits start and span as fractions; the tool turns "
     "fractions into arcs. Point it at a different tree and it draws that, with no code change.", WHITE, GREY, SLATE),
    ("IT WORKS WITH THE SERVER OFF", "A snapshot of all three graphs is baked into the file, so it opens "
     "from a thumb drive — and says so in red, rather than pretending to be live.", WHITE, GREY, SLATE),
]
for i, (h, body, fill, tc, ln) in enumerate(cols):
    box_txt(s, [h, body], 0.55 + i * 4.16, 2.15, 3.95, 2.35,
            fill=fill, line=ln, size=13, top_color=tc, align=PP_ALIGN.LEFT)
box_txt(s, [
    "The label that will not fit goes to hover.",
    "Each label is capped by the room its own wedge has. What does not fit is shortened; what cannot fit "
    "at all becomes a faint ellipsis — and every segment carries its full text, its source list and its ring name, on hover. "
    "Click to pin it, because a touch screen has no hover. Search dims rather than filters, so "
    "proportions never shift underfoot, and a colour toggle swaps the family reading for OPM "
    "Object / Process.",
], 0.55, 4.85, 12.23, 1.65, fill=WHITE, line=SLATE, size=14, top_color=BLACK)
foot(s, "Stress-tested at 64 concepts with deliberately punishing labels: no overflow, every label still reachable.")

# ── 11 · Close ───────────────────────────────────────────────────────────────
s = slide()
bg(s, BLACK)
rect(s, 0, 0, 13.33, 0.14, fill=IN)
txt(s, "THE BET UNDERNEATH", 0.9, 1.45, 11, 0.4, size=13, bold=True, color=IN_LT)
txlines(s, [
    "A group cannot agree on causes",
    "until it agrees on words —",
    "and cannot notice it disagrees about words",
    "while the words are in a table.",
], 0.9, 2.1, 11.5, 2.8, sizes=30, bolds=True, colors=WHITE, spacing=8)
txt(s, "A cave drawing of our own language.", 0.9, 5.0, 11.5, 0.5, size=19, italic=True, color=IN_LT)
txt(s, "tools/schema-sunburst.html", 0.9, 5.75, 11, 0.5, size=18, color=IN_LT)
txt(s, "Introduction · User Manual · projection at substrate/api.py → /projection/vocabulary",
    0.9, 6.25, 11.5, 0.4, size=13, color=LGREY)

# ── Save ─────────────────────────────────────────────────────────────────────
here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(here, '..', 'tools', 'rcn-schema-sunburst-intro.pptx')
prs.save(out)
print('Wrote', os.path.normpath(out), '—', len(prs.slides._sldIdLst), 'slides')
