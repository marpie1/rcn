"""
Generate tools/rcn-lean-healthcare-intro.pptx — the joint VSM + A3 intro deck.

Companion to tools/a3-intro.html / a3-manual.html and the VSM sections of
tools/graph-tool-intro.html / graph-tool-manual.html. Regenerate after editing:
    python3 docs/make_lean_healthcare_pptx.py
Requires: pip install python-pptx

WHY ONE DECK AND NOT TWO: in Cindy Jimmerson's method these are not two tools,
they are one loop — map the stream, find the storm bursts, A3 the worst one,
measure whether it moved. A deck per tool would cut the loop in exactly the
place where the method lives. The handoff gets its own slide because it is the
part that makes the pair worth having.

AUDIENCE: Whatcom Wealth and Health — CHWs, clinic staff, and the people who
have to agree to change how a referral moves. Not Lean consultants. So: no
Japanese vocabulary that is not earned, no belt levels, and the arithmetic is
kept concrete and small.

The numbers on the case slides are REAL OUTPUT from tools/vsm-chw-referral.rcn.json,
verified against the tool. If that file changes, rerun and change these to match.

Text fitting: the primitives are lifted from docs/make_rcn_spc_pptx.py so the
two decks look identical and the overflow-measuring logic is not reimplemented.
PowerPoint does not shrink text to fit — it spills invisibly — so card() and
banner() measure prose before drawing it.
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_CONNECTOR
from pptx.enum.dml import MSO_LINE_DASH_STYLE

# ── Palette — steel blue and signal red, matching the tool itself ────────────
ACC    = RGBColor(0xa2, 0x1c, 0xaf)   # fuchsia — VSM mode / the patient lane
ACC_LT = RGBColor(0xfa, 0xe8, 0xff)
ACC_DK = RGBColor(0x4a, 0x04, 0x4e)
SIG    = RGBColor(0xb9, 0x1c, 0x1c)   # red — waiting, waste, the burst
SIG_LT = RGBColor(0xfe, 0xf2, 0xf2)
BTW    = RGBColor(0xb4, 0x53, 0x09)   # storm-burst amber
AMB_LT = RGBColor(0xfe, 0xf9, 0xc3)
GRN    = RGBColor(0x15, 0x80, 0x3d)   # green — value-added
GRN_LT = RGBColor(0xf0, 0xfd, 0xf4)
CHG    = RGBColor(0x03, 0x69, 0xa1)   # blue — process steps
CHG_LT = RGBColor(0xe0, 0xf2, 0xfe)
INK    = RGBColor(0x0f, 0x17, 0x2a)
INK2   = RGBColor(0x47, 0x55, 0x69)
INK3   = RGBColor(0x94, 0xa3, 0xb8)
SURF   = RGBColor(0xf8, 0xfa, 0xfc)
SURF2  = RGBColor(0xee, 0xf2, 0xf6)
BORDER = RGBColor(0xe2, 0xe8, 0xf0)
WHITE  = RGBColor(0xff, 0xff, 0xff)

prs = Presentation()
prs.slide_width  = Inches(13.33)
prs.slide_height = Inches(7.5)
BLANK = prs.slide_layouts[6]


# ── Primitives ──────────────────────────────────────────────────────────────

def slide(bgc=SURF):
    sl = prs.slides.add_slide(BLANK)
    f = sl.background.fill
    f.solid()
    f.fore_color.rgb = bgc
    return sl


def rect(sl, x, y, w, h, fill=WHITE, line=None, lw=1.25):
    sh = sl.shapes.add_shape(1, Inches(x), Inches(y), Inches(w), Inches(h))
    sh.fill.solid()
    sh.fill.fore_color.rgb = fill
    if line:
        sh.line.color.rgb = line
        sh.line.width = Pt(lw)
    else:
        sh.line.fill.background()
    sh.shadow.inherit = False
    return sh


def oval(sl, cx, cy, d, fill, line=None, lw=1.2):
    sh = sl.shapes.add_shape(9, Inches(cx - d/2), Inches(cy - d/2), Inches(d), Inches(d))
    sh.fill.solid()
    sh.fill.fore_color.rgb = fill
    if line:
        sh.line.color.rgb = line
        sh.line.width = Pt(lw)
    else:
        sh.line.fill.background()
    sh.shadow.inherit = False
    return sh


def conn(sl, x1, y1, x2, y2, color, lw=1.2, dash=None):
    c = sl.shapes.add_connector(MSO_CONNECTOR.STRAIGHT,
                                Inches(x1), Inches(y1), Inches(x2), Inches(y2))
    c.line.color.rgb = color
    c.line.width = Pt(lw)
    if dash:
        c.line.dash_style = dash
    return c


def txt(sl, text, x, y, w, h, size=20, bold=False, italic=False,
        color=INK, align=PP_ALIGN.LEFT, spacing=1.0, anchor=MSO_ANCHOR.TOP):
    tb = sl.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    p = tf.paragraphs[0]
    p.alignment = align
    p.line_spacing = spacing
    r = p.add_run()
    r.text = text
    r.font.size = Pt(size)
    r.font.bold = bold
    r.font.italic = italic
    r.font.color.rgb = color
    r.font.name = 'Calibri'
    return tb


def bullets(sl, items, x, y, w, h, size=17, color=INK2, gap=10, bullet='—'):
    tb = sl.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = True
    for i, it in enumerate(items):
        bold = False
        if isinstance(it, tuple):
            it, bold = it
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.line_spacing = 1.15
        p.space_after = Pt(gap)
        r = p.add_run()
        r.text = (bullet + '  ' if bullet else '') + it
        r.font.size = Pt(size)
        r.font.bold = bold
        r.font.color.rgb = INK if bold else color
        r.font.name = 'Calibri'
    return tb


def kicker(sl, text, color=ACC):
    txt(sl, text.upper(), 0.85, 0.55, 11, 0.32, size=11, bold=True, color=color)


def title(sl, text, y=0.95, size=34, color=INK, w=11.6):
    txt(sl, text, 0.85, y, w, 1.3, size=size, bold=True, color=color, spacing=0.95)


def footer(sl, n):
    txt(sl, 'RCN · Lean in Healthcare — VSM + A3', 0.85, 6.95, 6, 0.3, size=9, color=INK3)
    txt(sl, str(n), 12.1, 6.95, 0.4, 0.3, size=9, color=INK3, align=PP_ALIGN.RIGHT)


# ── Text fitting ────────────────────────────────────────────────────────────
# PowerPoint does not shrink text to fit a shape; it simply spills past the
# bottom edge, and the spill is invisible in the XML. So every box that holds
# variable-length prose measures it first. Calibri averages very close to
# 0.505 em per character over mixed-case English, which is accurate enough to
# predict the wrapped line count within one line at these widths.

CHAR_EM = 0.505
BOTTOM  = 6.75          # keep shapes clear of the footer at 6.95


def _lines(text, w_in, size_pt):
    cpl = max(8, int(w_in * 72 / (size_pt * CHAR_EM)))
    return sum(max(1, -(-len(p) // cpl)) for p in text.split('\n'))


def _text_h(text, w_in, size_pt, spacing=1.12):
    """Height in inches that this text will actually occupy."""
    return _lines(text, w_in, size_pt) * size_pt * spacing * 1.02 / 72


def card(sl, x, y, w, h, head, body, accent=ACC, headsize=15, bodysize=12.5):
    # Cards sit in aligned rows, so the box height is fixed and the type gives.
    tw = w - 0.5
    while bodysize > 9.0 and 0.72 + _text_h(body, tw, bodysize) + 0.12 > h:
        bodysize -= 0.5
    rect(sl, x, y, w, h, WHITE, BORDER)
    rect(sl, x, y, 0.055, h, accent)
    txt(sl, head, x + 0.28, y + 0.2, w - 0.5, 0.4, size=headsize, bold=True, color=INK)
    txt(sl, body, x + 0.28, y + 0.72, tw, h - 0.9, size=bodysize, color=INK2, spacing=1.1)


def banner(sl, x, y, w, h, head, body, fill, edge, headcolor, size=12.5):
    # Banners stand alone, so grow the box into whatever room is left below,
    # and only shrink the type if even the full height is not enough.
    tw = w - 0.6
    need = lambda s: 0.58 + _text_h(body, tw, s) + 0.12
    room = max(h, BOTTOM - y)
    while size > 9.0 and need(size) > room:
        size -= 0.5
    h = max(h, min(need(size), room))
    rect(sl, x, y, w, h, fill, edge)
    txt(sl, head, x + 0.3, y + 0.15, tw, 0.36, size=15, bold=True, color=headcolor)
    txt(sl, body, x + 0.3, y + 0.58, tw, h - 0.72, size=size, color=INK2, spacing=1.12)
    return h


def chartlabel(sl, text, x, y, w, size, color, align=PP_ALIGN.LEFT):
    """Tight label for chart annotation — default textbox insets would push the
    text off the line it is meant to sit on, so all four are zeroed."""
    tb = sl.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(0.2))
    tf = tb.text_frame
    tf.word_wrap = False
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    p = tf.paragraphs[0]
    p.alignment = align
    r = p.add_run()
    r.text = text
    r.font.size = Pt(size)
    r.font.bold = True
    r.font.color.rgb = color
    r.font.name = 'Calibri'
    return tb




# ── Storm burst ─────────────────────────────────────────────────────────────

def burst(sl, cx, cy, d, fill=RGBColor(0xfe, 0xf0, 0x8a), line=BTW, lw=1.5):
    """The signature mark. MSO autoshape 12 is the 16-point explosion."""
    sh = sl.shapes.add_shape(12, Inches(cx - d/2), Inches(cy - d/2), Inches(d), Inches(d))
    sh.fill.solid()
    sh.fill.fore_color.rgb = fill
    sh.line.color.rgb = line
    sh.line.width = Pt(lw)
    sh.shadow.inherit = False
    return sh


# ── Sawtooth ────────────────────────────────────────────────────────────────

def sawtooth(sl, x, y, w, h, segs, minw=0.30):
    """Draw the VA/wait sawtooth the way the tool draws it: a minimum width per
    segment with the surplus shared out in proportion, because strictly
    proportional ledges vanish at any ratio worth showing."""
    total = sum(s[1] for s in segs)
    floor = min(minw, w / max(1, len(segs)))
    surplus = max(0.0, w - floor * len(segs))
    ytop, ybot = y + 0.18, y + h - 0.42
    px = x
    prev = None
    for kind, t in segs:
        sw = floor + surplus * (t / total if total else 0)
        yy = ytop if kind == 'va' else ybot
        if prev is not None and prev != yy:
            conn(sl, px, prev, px, yy, INK2, 1.6)
        conn(sl, px, yy, px + sw, yy, INK2, 1.6)
        if kind == 'va':
            rect(sl, px, ytop, sw, ybot - ytop, GRN_LT)
            conn(sl, px, yy, px + sw, yy, GRN, 2.2)
        px += sw
        prev = yy
    chartlabel(sl, 'VA', x - 0.32, ytop - 0.09, 0.3, 9, GRN, PP_ALIGN.RIGHT)
    chartlabel(sl, 'WAIT', x - 0.42, ybot - 0.09, 0.4, 9, SIG, PP_ALIGN.RIGHT)


# ════════════════════════════════════════════════════════════════════════════
#  1 · TITLE
# ════════════════════════════════════════════════════════════════════════════
sl = slide(ACC_DK)
txt(sl, 'RELOCALIZE CREATIVITY NETWORK', 0.85, 1.5, 11, 0.32, size=11, bold=True,
    color=RGBColor(0xd9, 0x8f, 0xe0))
txt(sl, 'Seeing the work as it actually is', 0.85, 2.0, 11.5, 1.2, size=42, bold=True,
    color=WHITE, spacing=0.95)
txt(sl, 'Value Stream Mapping and A3 Problem Solving, in Cindy Jimmerson\'s healthcare version',
    0.85, 3.3, 10.5, 0.8, size=19, color=RGBColor(0xe9, 0xc5, 0xef), spacing=1.2)
conn(sl, 0.85, 4.35, 4.2, 4.35, BTW, 2.5)
txt(sl, 'Two tools, one loop:  map the stream  →  find the storm bursts  →  A3 the worst one  →  measure whether it moved',
    0.85, 4.7, 11.2, 0.9, size=15, color=RGBColor(0xc9, 0xa5, 0xd5), spacing=1.3)
txt(sl, 'Whatcom Wealth and Health', 0.85, 6.5, 6, 0.35, size=13, color=RGBColor(0x9a, 0x6f, 0xa8))

# ════════════════════════════════════════════════════════════════════════════
#  2 · THE PROBLEM THIS ADDRESSES
# ════════════════════════════════════════════════════════════════════════════
sl = slide()
kicker(sl, 'Why bother')
title(sl, 'Everyone knows the process. Nobody has watched it.', size=32)  # fits one line at 32pt
bullets(sl, [
    'Ask five people how a referral moves and you get five answers, all sincere, none complete.',
    'Each person can see their own step clearly and the handoffs on either side not at all.',
    'So improvement gets aimed at the steps — which are usually fine — instead of the gaps between them, which are not.',
    'And "we already fixed that" is impossible to check, because nobody wrote down what it was before.',
], 0.85, 2.15, 11.4, 2.6, size=17)
banner(sl, 0.85, 5.0, 11.4, 1.3, 'The move that changes this',
       'Follow one patient, one condition, one time, from end to end, and write down the clock. '
       'Not an average. Not a policy. One real episode, watched.',
       ACC_LT, RGBColor(0xf0, 0xab, 0xfc), ACC_DK, size=14.5)
footer(sl, 2)

# ════════════════════════════════════════════════════════════════════════════
#  3 · WHOSE VERSION
# ════════════════════════════════════════════════════════════════════════════
sl = slide()
kicker(sl, 'Provenance')
title(sl, 'Jimmerson\'s version, not the factory one')
txt(sl, 'Cindy Jimmerson learned Toyota Production System methods through the engagement at '
        'Community Medical Center in Missoula, and spent the years since adapting them for care. '
        'The adaptations are the whole point — a generic Lean template drops exactly the parts '
        'that make it work in a clinic.',
    0.85, 2.05, 11.4, 1.1, size=15.5, color=INK2, spacing=1.25)
cards = [
    ('One episode, not an average',
     'Manufacturing maps a product family over a month. She maps one patient, one condition, one pass — because the variation between episodes is the thing you are trying to see, not noise to average away.'),
    ('Four flows, not one',
     'In a factory the product is inert. In a clinic the patient is present and waiting while the provider, the information and the supplies each arrive — or fail to. All four must converge at the point of care.'),
    ('Storm bursts',
     'Every problem you witness gets a jagged star on the map, named. Each is a candidate A3. This is how what you saw survives the walk back to the desk.'),
    ('Drawn in pencil, by the worker',
     'Not by a consultant, not in a modelling package. The map and the A3 are conversation pieces that get marked up by the people who do the work.'),
]
for i, (h, b) in enumerate(cards):
    card(sl, 0.85 + (i % 2) * 5.85, 3.35 + (i // 2) * 1.65, 5.55, 1.5, h, b, ACC)
footer(sl, 3)

# ════════════════════════════════════════════════════════════════════════════
#  4 · THE FOUR FLOWS
# ════════════════════════════════════════════════════════════════════════════
sl = slide()
kicker(sl, 'Part one · the map')
title(sl, 'Four flows, four lanes, and a timeline underneath')
lanes = [
    ('PATIENT', 'the person moving through', RGBColor(0xfd, 0xf4, 0xff), RGBColor(0xf5, 0xd0, 0xfe), ACC),
    ('PROVIDER', 'who does the work — plus the waits, handoffs and decisions that break it', SURF, BORDER, INK2),
    ('INFORMATION', 'orders, results, records — the one people forget', RGBColor(0xf0, 0xfd, 0xfa), RGBColor(0xcc, 0xfb, 0xf1), RGBColor(0x0f, 0x76, 0x6e)),
    ('SUPPLIES', 'equipment, meds, materials', RGBColor(0xff, 0xfb, 0xeb), RGBColor(0xfd, 0xe6, 0x8a), BTW),
]
for i, (nm, sub, fill, edge, ink) in enumerate(lanes):
    y = 2.15 + i * 0.82
    rect(sl, 0.85, y, 11.4, 0.72, fill, edge)
    txt(sl, nm, 1.1, y + 0.09, 2.4, 0.3, size=12.5, bold=True, color=ink)
    txt(sl, sub, 3.4, y + 0.11, 8.6, 0.35, size=12.5, color=INK2)
rect(sl, 0.85, 5.5, 11.4, 0.72, RGBColor(0xfa, 0xfa, 0xfa), RGBColor(0xe5, 0xe5, 0xe5))
txt(sl, 'TIMELINE', 1.1, 5.59, 2.4, 0.3, size=12.5, bold=True, color=INK2)
txt(sl, 'value-added above, waiting below — computed, never drawn by hand', 3.4, 5.61, 8.6, 0.35,
    size=12.5, italic=True, color=INK2)
txt(sl, 'The lanes are a guide, not a cage. Storm bursts have no lane — a burst goes wherever you saw the problem.',
    0.85, 6.42, 11.4, 0.35, size=12.5, italic=True, color=INK3)
footer(sl, 4)

# ════════════════════════════════════════════════════════════════════════════
#  5 · THE CASE — the sawtooth
# ════════════════════════════════════════════════════════════════════════════
sl = slide()
kicker(sl, 'A real stream')
title(sl, 'Clinic referral to first CHW contact')
txt(sl, 'One referral, followed from the exam room to the first phone call.',
    0.85, 2.0, 11.4, 0.4, size=15, color=INK2)
sawtooth(sl, 1.35, 2.55, 10.6, 1.75,
         [('va', 12), ('va', 3), ('va', 2), ('wait', 30), ('va', 1), ('wait', 10080), ('va', 6), ('va', 15)])
chartlabel(sl, '7 days sitting in a shared inbox', 6.0, 4.05, 4.0, 11, SIG)
stats = [('Lead time', '7 days', SIG), ('Value-added', '39 min', GRN),
         ('Worth paying for', '0.38%', ACC), ('Handoffs', '1', INK2), ('Storm bursts', '3', BTW)]
for i, (lab, val, col) in enumerate(stats):
    x = 0.85 + i * 2.31
    rect(sl, x, 4.55, 2.16, 1.0, WHITE, BORDER)
    txt(sl, val, x + 0.18, 4.68, 1.85, 0.42, size=21, bold=True, color=col)
    txt(sl, lab, x + 0.18, 5.14, 1.85, 0.3, size=10.5, color=INK3)
banner(sl, 0.85, 5.78, 11.4, 0.85, 'This is the number that stops the room',
       'Thirty-nine minutes of work inside a seven-day wait. Nobody was lazy and nothing broke — '
       'the referral simply had no owner while it was in transit between two organizations.',
       SIG_LT, RGBColor(0xfe, 0xca, 0xca), RGBColor(0x99, 0x1b, 0x1b), size=13.5)
footer(sl, 5)

# ════════════════════════════════════════════════════════════════════════════
#  6 · WHAT THE MAP CATCHES
# ════════════════════════════════════════════════════════════════════════════
sl = slide()
kicker(sl, 'Check observation')
title(sl, 'The tool checks the observation, not the drawing')
txt(sl, 'A tidy diagram can still be a reconstruction from policy. These are the questions it asks you:',
    0.85, 2.05, 11.4, 0.4, size=15, color=INK2)
checks = [
    ('Nothing in the patient lane', 'Then it is a process map, not a value stream.'),
    ('No times recorded', 'The ratio is the whole argument. Without it this is a flowchart.'),
    ('All value-added, no waiting', 'That almost never survives real watching. Did you reconstruct this?'),
    ('A ratio over 50%', 'Check the units — times are minutes.'),
    ('An unnamed storm burst', 'Say what went wrong, or it is not a finding.'),
    ('No information flow at all', 'One of the four flows is missing, and it is usually this one.'),
]
for i, (h, b) in enumerate(checks):
    y = 2.6 + i * 0.66
    rect(sl, 0.85, y, 0.055, 0.56, SIG if i < 3 else BTW)
    txt(sl, h, 1.15, y + 0.02, 4.3, 0.35, size=14, bold=True, color=INK)
    txt(sl, b, 5.5, y + 0.03, 6.75, 0.4, size=13, color=INK2)
footer(sl, 6)

# ════════════════════════════════════════════════════════════════════════════
#  7 · THE HANDOFF
# ════════════════════════════════════════════════════════════════════════════
sl = slide(ACC_DK)
txt(sl, 'THE PART THAT MAKES IT A METHOD', 0.85, 0.75, 11, 0.32, size=11, bold=True,
    color=RGBColor(0xd9, 0x8f, 0xe0))
txt(sl, 'A storm burst becomes an A3', 0.85, 1.2, 11.4, 0.8, size=34, bold=True, color=WHITE)
steps = [
    ('1', 'Map the stream', 'One patient, one pass, times as you saw them.'),
    ('2', 'Mark the bursts', 'Every problem witnessed. Name each one.'),
    ('3', 'Choose one', 'Exactly one burst gets the A3. The rest stay as candidates.'),
    ('4', 'VSM→A3', 'The A3 opens already holding the bursts, the times, and the baseline.'),
]
for i, (n, h, b) in enumerate(steps):
    x = 0.85 + i * 2.95
    oval(sl, x + 0.32, 2.65, 0.64, BTW)
    txt(sl, n, x + 0.02, 2.44, 0.6, 0.4, size=17, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    txt(sl, h, x, 3.15, 2.7, 0.4, size=16, bold=True, color=WHITE)
    txt(sl, b, x, 3.62, 2.7, 1.3, size=12.5, color=RGBColor(0xc9, 0xa5, 0xd5), spacing=1.2)
    if i < 3:
        conn(sl, x + 2.6, 2.65, x + 2.95, 2.65, RGBColor(0x7a, 0x4f, 0x82), 1.5)
rect(sl, 0.85, 5.15, 11.4, 1.35, RGBColor(0x36, 0x0a, 0x3a), RGBColor(0x6b, 0x21, 0x6f))
txt(sl, 'What the A3 does NOT arrive with', 1.15, 5.3, 10.8, 0.35, size=14, bold=True, color=RGBColor(0xf0, 0xab, 0xfc))
txt(sl, 'What was supposed to happen, the gap, and the five whys are left deliberately empty. '
        'Those are the parts only a person who watched the work can supply — and handing them to a '
        'machine is how an A3 stops being an investigation.',
    1.15, 5.72, 10.8, 0.7, size=13, color=RGBColor(0xc9, 0xa5, 0xd5), spacing=1.2)

# ════════════════════════════════════════════════════════════════════════════
#  8 · THE A3 SHEET
# ════════════════════════════════════════════════════════════════════════════
sl = slide()
kicker(sl, 'Part two · the A3')
title(sl, 'One page. Left is what is, right is what should be.')
left = [('1', 'Background'), ('2', 'Current Condition'), ('3', 'Problem Statement'), ('4', 'Root Cause')]
right = [('5', 'Target Condition'), ('6', 'Countermeasures'), ('7', 'Implementation Plan'), ('8', 'Test & Follow-up')]
rect(sl, 0.85, 2.1, 5.55, 0.34, SURF2)
txt(sl, 'LEFT — WHAT IS HAPPENING', 1.0, 2.13, 5.2, 0.3, size=10.5, bold=True, color=INK2)
rect(sl, 6.7, 2.1, 5.55, 0.34, SURF2)
txt(sl, 'RIGHT — WHAT SHOULD BE HAPPENING', 6.85, 2.13, 5.2, 0.3, size=10.5, bold=True, color=INK2)
for col, items, x in ((0, left, 0.85), (1, right, 6.7)):
    for i, (n, nm) in enumerate(items):
        y = 2.6 + i * 0.72
        rect(sl, x, y, 5.55, 0.62, WHITE, BORDER)
        oval(sl, x + 0.32, y + 0.31, 0.36, INK if col == 0 else ACC)
        txt(sl, n, x + 0.14, y + 0.17, 0.36, 0.3, size=11, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
        txt(sl, nm, x + 0.65, y + 0.15, 4.7, 0.35, size=14.5, bold=True, color=INK)
banner(sl, 0.85, 5.62, 11.4, 1.0, 'It has to fit — and the sheet holds you to it',
       'Paper clips silently, so every field measures itself as you type and flags text that would be '
       'lost on the page. Saying it shorter is most of what the A3 format is for.',
       AMB_LT, RGBColor(0xfd, 0xe6, 0x8a), RGBColor(0x71, 0x3f, 0x12), size=13.5)
footer(sl, 8)

# ════════════════════════════════════════════════════════════════════════════
#  9 · THE THREE RULES
# ════════════════════════════════════════════════════════════════════════════
sl = slide()
kicker(sl, 'What makes it hers')
title(sl, 'Three rules, built into the page')
rules = [
    ('A problem is a gap', ACC,
     'The difference between what is supposed to happen and what actually happens. So the box is three '
     'fields, not one. If you cannot fill the first two, you have a complaint, not a problem.'),
    ('Root cause is a process, never a person', SIG,
     'Type "the nurse forgot" and the row turns red: what about the work made that the easy thing to do? '
     'That moment is where most healthcare A3s stop improving and start blaming.'),
    ('Countermeasures, not solutions', GRN,
     'A change to the work, tried and measured, kept or dropped. Each one names the why it answers, so the '
     'right side of the page cannot drift free of the left.'),
]
y = 2.3
for h, c, b in rules:
    hh = banner(sl, 0.85, y, 11.4, 1.25, h, b, WHITE, BORDER, c, size=13.5)
    rect(sl, 0.85, y, 0.055, hh, c)
    y += hh + 0.22
footer(sl, 9)

# ════════════════════════════════════════════════════════════════════════════
#  10 · CLOSING THE LOOP
# ════════════════════════════════════════════════════════════════════════════
sl = slide()
kicker(sl, 'And then')
title(sl, 'How you know it worked')
txt(sl, 'The last box of the A3 asks for one measure, a baseline, a target and a date. That is where the '
        'method hands off again — this time to a run chart.',
    0.85, 2.05, 11.4, 0.8, size=15.5, color=INK2, spacing=1.25)
cards2 = [
    ('The trap', 'Two numbers before and after. Almost any change looks like an improvement if you pick the two numbers.'),
    ('The fix', 'Chart the measure over time and look for a signal. Days-to-contact on a run chart tells you whether the shift held.'),
    ('The tool', 'The A3 sheet says so on its face, and points at the SPC tool. The measure travels; you do not retype it.'),
]
for i, (h, b) in enumerate(cards2):
    card(sl, 0.85 + i * 3.9, 3.15, 3.6, 1.7, h, b, CHG)
banner(sl, 0.85, 5.25, 11.4, 1.15, 'Then the loop starts again',
       'When the A3 closes, the next problem is already named — it is one of the storm bursts you did not '
       'choose, still sitting on the map. That is why the bursts get written down even when they are not '
       'the one you are working on.',
       GRN_LT, RGBColor(0xbb, 0xf7, 0xd0), RGBColor(0x14, 0x53, 0x2d), size=13.5)
footer(sl, 10)

# ════════════════════════════════════════════════════════════════════════════
#  11 · WHERE THINGS ARE
# ════════════════════════════════════════════════════════════════════════════
sl = slide(ACC_DK)
txt(sl, 'READY TO TRY', 0.85, 0.9, 11, 0.32, size=11, bold=True, color=RGBColor(0xd9, 0x8f, 0xe0))
txt(sl, 'Both tools are built, documented, and open', 0.85, 1.35, 11.4, 0.9, size=32, bold=True, color=WHITE)
rows = [
    ('Value Stream Mapping', 'VSM mode in the RCN Graph Tool — lanes, storm bursts, computed sawtooth, CSV / Markdown / A3 export.'),
    ('A3 Problem Solving', 'A single-page tool that prints to 11x17, carries its drawings, and enforces the three rules.'),
    ('The handoff', 'VSM to A3 in one click, pre-seeded with the bursts and the observed times.'),
    ('The measure', 'Hand it to the SPC tool and watch whether the change actually held.'),
]
for i, (h, b) in enumerate(rows):
    y = 2.6 + i * 1.0
    rect(sl, 0.85, y, 0.055, 0.9, BTW)
    txt(sl, h, 1.15, y + 0.02, 4.1, 0.45, size=16, bold=True, color=WHITE)
    txt(sl, b, 5.4, y, 6.9, 0.9, size=13, color=RGBColor(0xc9, 0xa5, 0xd5), spacing=1.15)
txt(sl, 'Single HTML files. No install, no account, no data leaving the machine.',
    0.85, 6.85, 11, 0.35, size=13, italic=True, color=RGBColor(0x9a, 0x6f, 0xa8))

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools', 'rcn-lean-healthcare-intro.pptx')
out = os.path.normpath(out)
prs.save(out)
print('Wrote', out, '·', len(prs.slides.__iter__.__self__._sldIdLst), 'slides')
