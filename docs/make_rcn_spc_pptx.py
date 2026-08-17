"""
Generate tools/rcn-spc-intro.pptx — the Process Behavior Charts intro deck.

Companion to tools/rcn-spc-intro.html and rcn-spc-manual.html; same argument,
deck shape. Regenerate after editing:
    python3 docs/make_rcn_spc_pptx.py
Requires: pip install python-pptx

AUDIENCE: Gil Lund and the engineers in the WWHA group. Assumes numeracy.
Leads with the signal/noise problem, shows the arithmetic honestly, and spends
its weight on rational subgrouping as a claim about cause rather than a display
option. The job of this deck is to convert a measurement-minded skeptic into an
ally, not to get a board vote.

The numbers on the case slides are REAL OUTPUT from the demo datasets in
tools/rcn-spc.html, verified numerically. If those datasets change, rerun the
check and change these to match.
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_CONNECTOR
from pptx.enum.dml import MSO_LINE_DASH_STYLE

# ── Palette — steel blue and signal red, matching the tool itself ────────────
ACC    = RGBColor(0x1e, 0x5f, 0x8c)   # steel blue — this tool
ACC_LT = RGBColor(0xdb, 0xea, 0xf6)
ACC_DK = RGBColor(0x0f, 0x2f, 0x47)
SIG    = RGBColor(0xc0, 0x39, 0x2b)   # signal red — out of limits
SIG_LT = RGBColor(0xfd, 0xf0, 0xee)
BTW    = RGBColor(0xd4, 0x62, 0x2f)   # between-group orange
AMB_LT = RGBColor(0xfe, 0xf9, 0xc3)
GRN    = RGBColor(0x2f, 0x6b, 0x45)
GRN_LT = RGBColor(0xee, 0xf7, 0xf0)
CHG    = RGBColor(0x7a, 0x4f, 0xa0)   # change point — matches the tool
CHG_LT = RGBColor(0xf3, 0xeb, 0xf8)
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
    txt(sl, 'RCN · Process Behavior Charts', 0.85, 6.95, 6, 0.3, size=9, color=INK3)
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


# ── Miniature control chart ─────────────────────────────────────────────────

def minichart(sl, x, y, w, h, values, cl, ucl, lcl, ymin=None, ymax=None,
              dot=0.075, series=ACC_DK, showlimits=True, label_ucl=None,
              label_lcl=None, label_cl=None, phases=None):
    """Draw a small control chart. Limits may be None to omit.

    `phases` = [(start, end, cl, ucl, lcl), ...] draws each phase with its own
    centre line and limits and a marker at every boundary — the same thing the
    tool does when a process change is marked."""
    rect(sl, x, y, w, h, WHITE, BORDER)
    vals = [v for v in values]
    cand = vals + [v for v in (cl, ucl, lcl) if v is not None]
    if phases:
        for _p in phases:                 # not `ph` — that is the plot height below
            cand += [v for v in _p[2:] if v is not None]
    lo = ymin if ymin is not None else min(cand)
    hi = ymax if ymax is not None else max(cand)
    if hi == lo:
        hi, lo = hi + 1, lo - 1
    pad = (hi - lo) * 0.10
    lo -= pad; hi += pad

    px, py = x + 0.30, y + 0.22
    pw, ph = w - 0.95, h - 0.5

    def Y(v):
        return py + ph - ((v - lo) / (hi - lo)) * ph

    def X(i):
        return px + (pw * i / (len(vals) - 1) if len(vals) > 1 else pw / 2)

    if phases:
        # Each phase carries its own centre line and limits, drawn only across
        # its own points — the boundary is where one set stops and the next starts.
        for pi, (s, e, pcl, pucl, plcl) in enumerate(phases):
            x0, x1 = X(s), X(e - 1)
            for v in (pucl, plcl):
                if v is not None:
                    conn(sl, x0, Y(v), x1, Y(v), SIG, 1.1, MSO_LINE_DASH_STYLE.DASH)
            if pcl is not None:
                conn(sl, x0, Y(pcl), x1, Y(pcl), ACC, 1.1)
            if pi:                                   # boundary marker
                bx = (X(s - 1) + X(s)) / 2
                conn(sl, bx, py, bx, py + ph, CHG, 1.4, MSO_LINE_DASH_STYLE.DASH)
                oval(sl, bx, py + 0.09, 0.17, CHG)
                txt(sl, str(pi), bx - 0.085, py + 0.005, 0.17, 0.17,
                    size=8, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

            # Every phase reports its own centre line and limits, as the tool does.
            last = (pi == len(phases) - 1)
            for v, name, col, dy in ((pucl, 'UNPL', SIG, -0.115),
                                     (plcl, 'LNPL', SIG,  0.015),
                                     (pcl,  'CL',   ACC, -0.115)):
                if v is None:
                    continue
                if last:
                    chartlabel(sl, f'{name} {v:g}', x1 + 0.05, Y(v) - 0.065, 0.85,
                               7.5, col)
                else:
                    bx = (X(e - 1) + X(e)) / 2
                    chartlabel(sl, f'{name} {v:g}', bx - 0.83, Y(v) + dy, 0.78,
                               7, col, PP_ALIGN.RIGHT)
    else:
        if showlimits:
            for v, lab, col in ((ucl, label_ucl, SIG), (lcl, label_lcl, SIG)):
                if v is None:
                    continue
                conn(sl, px, Y(v), px + pw, Y(v), col, 1.1, MSO_LINE_DASH_STYLE.DASH)
                if lab:
                    txt(sl, lab, px + pw + 0.06, Y(v) - 0.13, 0.95, 0.26,
                        size=8.5, bold=True, color=col)
        if cl is not None:
            conn(sl, px, Y(cl), px + pw, Y(cl), ACC, 1.1)
            if label_cl:
                txt(sl, label_cl, px + pw + 0.06, Y(cl) - 0.13, 0.95, 0.26,
                    size=8.5, bold=True, color=ACC)

    def limits_at(i):
        if not phases:
            return ucl, lcl
        for s, e, _c, u, l in phases:
            if s <= i < e:
                return u, l
        return None, None

    for i in range(len(vals) - 1):
        conn(sl, X(i), Y(vals[i]), X(i + 1), Y(vals[i + 1]), series, 0.9)
    for i, v in enumerate(vals):
        u, l = limits_at(i)
        out = (u is not None and v > u) or (l is not None and v < l)
        oval(sl, X(i), Y(v), dot * (1.5 if out else 1.0),
             SIG if out else WHITE, SIG if out else series, 1.1)


# ── The data behind the case slides (verified against the tool) ─────────────
NORTH = [4.1,3.8,4.5,4.2,3.9,4.6,4.0,4.3,3.7,4.4,4.1,4.8,
         3.9,4.2,4.5,4.0,3.8,4.3,4.6,4.1,3.9,4.4,4.2,4.0]
SOUTH = [10.9,11.3,10.5,11.8,10.2,11.1,10.7,11.5,10.9,11.2,10.4,11.6,
         10.8,11.0,10.6,11.4,10.3,11.7,10.9,11.2,10.5,11.3,10.8,11.1]
POOLED = [v for pair in zip(NORTH, SOUTH) for v in pair]

CHW = [41,44,39,43,45,40,38,44,42,46,39,41,43,40,45,42,38,44,
       53,56,52,58,55,57,54,59,53,56,55,58]

n = 0
def nxt():
    global n
    n += 1
    return n


# ═════════════════════════════════════════════════════════════════════════════
# 1 — Title
# ═════════════════════════════════════════════════════════════════════════════
sl = slide(ACC_DK)
rect(sl, 0, 0, 13.33, 7.5, ACC_DK)
rect(sl, 0.85, 2.15, 1.6, 0.055, BTW)
txt(sl, 'ReLocalize Creativity Network', 0.85, 1.55, 8, 0.35,
    size=12.5, bold=True, color=RGBColor(0x7b, 0xa7, 0xc7))
txt(sl, 'Process Behavior Charts', 0.85, 2.5, 11, 1.1, size=48, bold=True, color=WHITE)
txt(sl, 'Separating signal from noise in the Whatcom Wealth and Health work',
    0.85, 3.65, 10, 0.5, size=19, color=RGBColor(0xc6, 0xdb, 0xea))
txt(sl, 'Statistical process control · after Shewhart, Deming, and Hart & Hart',
    0.85, 4.25, 10, 0.4, size=13, italic=True, color=RGBColor(0x7b, 0xa7, 0xc7))
txt(sl, 'August 2026', 0.85, 6.6, 4, 0.3, size=11, color=RGBColor(0x5d, 0x82, 0xa0))

# ═════════════════════════════════════════════════════════════════════════════
# 2 — You are already measuring
# ═════════════════════════════════════════════════════════════════════════════
sl = slide()
kicker(sl, 'Where we are')
title(sl, 'You are already measuring')
txt(sl, 'The co-op will not have a data problem. It will have an interpretation problem.',
    0.85, 2.15, 11.6, 0.5, size=19, color=INK2)
xs = [0.85, 3.85, 6.85, 9.85]
labels = [
    ('Referral turnaround', 'days from referral to first contact'),
    ('CHW home visits', 'count per worker per week'),
    ('Care plan completion', 'share of enrolled members'),
    ('ED utilisation', 'visits per 1,000 member-months'),
]
for x, (h, b) in zip(xs, labels):
    card(sl, x, 2.95, 2.75, 1.5, h, b, ACC, headsize=14, bodysize=11.5)
banner(sl, 0.85, 4.85, 11.6, 1.35,
       'Every one of these moves every month whether or not anything happened',
       'A number that changed is not news. The question is never "what is the number" — it is '
       '"how much does this number move when nothing is going on". Only the second question can '
       'tell you whether this month is worth a meeting.',
       ACC_LT, ACC, ACC_DK)
footer(sl, nxt())

# ═════════════════════════════════════════════════════════════════════════════
# 3 — Measurement ≠ signal   (Marc's line)
# ═════════════════════════════════════════════════════════════════════════════
sl = slide(ACC_DK)
rect(sl, 0, 0, 13.33, 7.5, ACC_DK)
rect(sl, 0.85, 2.0, 1.6, 0.06, BTW)
txt(sl, 'Measurement gives you numbers.', 0.85, 2.45, 12.0, 0.8,
    size=38, bold=True, color=WHITE)
txt(sl, 'It does not, in any way, separate signal from noise.', 0.85, 3.35, 12.0, 0.8,
    size=38, bold=True, color=BTW)
txt(sl, 'These are two different jobs. Doing the first well does nothing for the second — '
        'more precision in measuring a noisy quantity gives you a more precise noisy quantity.',
    0.85, 4.55, 10.5, 1.0, size=16, color=RGBColor(0xc6, 0xdb, 0xea), spacing=1.2)
footer(sl, nxt())

# ═════════════════════════════════════════════════════════════════════════════
# 4 — The two mistakes
# ═════════════════════════════════════════════════════════════════════════════
sl = slide()
kicker(sl, 'The cost of getting it wrong')
title(sl, 'Two mistakes, both expensive')
banner(sl, 0.85, 2.3, 5.6, 2.5, 'Treating noise as signal',
       'Someone had a bad month, so you investigate, intervene, and reorganise. '
       'The measure returns to its usual range — it was always going to — and the intervention '
       'gets the credit. You have now learned something false and will do it again.\n\n'
       'Deming called this tampering. It reliably makes the process worse.',
       SIG_LT, SIG, SIG)
banner(sl, 6.85, 2.3, 5.6, 2.5, 'Treating signal as noise',
       'Something real changes and is dismissed as one of those months. '
       'By the time it is undeniable it has been running for a year, and the moment when '
       'you could have found the cause — while it was still a datable event — has passed.\n\n'
       'Less discussed, and usually more costly.',
       AMB_LT, RGBColor(0xfd, 0xe0, 0x47), RGBColor(0x85, 0x4d, 0x0e))
txt(sl, 'A chart is the only cheap way to stop doing either one. That is its entire purpose.',
    0.85, 5.3, 11.6, 0.6, size=19, bold=True, color=ACC_DK, align=PP_ALIGN.CENTER)
footer(sl, nxt())

# ═════════════════════════════════════════════════════════════════════════════
# 5 — What Shewhart did
# ═════════════════════════════════════════════════════════════════════════════
sl = slide()
kicker(sl, 'Bell Labs, 1924')
title(sl, 'The method is unreasonably simple')
steps = [
    ('1', 'Plot in time order', 'Not sorted, not ranked, not aggregated. Time order or nothing.'),
    ('2', 'Measure the wander', 'Use the point-to-point movement itself to estimate how far this measure '
          'travels when nothing has changed.'),
    ('3', 'Draw the bounds', 'Three sigma either side of the centre — chosen as an economic tradeoff '
          'between the two mistakes, not as a probability claim.'),
    ('4', 'Investigate what escapes', 'A point outside, or a pattern too orderly for chance. '
          'Everything else is the process being itself.'),
]
for i, (num, h, b) in enumerate(steps):
    y = 2.25 + i * 1.12
    rect(sl, 0.85, y, 0.62, 0.62, ACC)
    txt(sl, num, 0.85, y + 0.11, 0.62, 0.4, size=19, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    txt(sl, h, 1.68, y + 0.02, 3.2, 0.4, size=16, bold=True, color=INK)
    txt(sl, b, 5.0, y + 0.02, 7.4, 0.9, size=13, color=INK2, spacing=1.1)
txt(sl, 'Finished in 1924. Nothing since has replaced it for this job.',
    0.85, 6.35, 11.6, 0.4, size=13, italic=True, color=INK3)
footer(sl, nxt())

# ═════════════════════════════════════════════════════════════════════════════
# 6 — What a limit is and is not
# ═════════════════════════════════════════════════════════════════════════════
sl = slide()
kicker(sl, 'Definitions worth being strict about')
title(sl, 'A limit is not a target')
rows = [
    ('Not a target', 'Limits describe what the process does, not what anyone wants. A process can sit '
                     'entirely inside its limits and still be nowhere near acceptable — a specific and useful finding.'),
    ('Not a significance test', 'No null hypothesis, no p-value being defended. Three sigma is an economic choice.'),
    ('Not a ranking', 'League tables convert noise into a standing every quarter. The order reshuffles when '
                      'nothing has changed, and people work hard to move on it.'),
    ('Not a verdict on people', 'Most variation belongs to the system. Charting is how you find out which is '
                                'which before deciding whom to talk to.'),
]
for i, (h, b) in enumerate(rows):
    y = 2.25 + i * 1.08
    rect(sl, 0.85, y, 11.6, 0.94, WHITE, BORDER)
    rect(sl, 0.85, y, 0.055, 0.94, SIG)
    txt(sl, h, 1.15, y + 0.13, 3.0, 0.4, size=15, bold=True, color=INK)
    txt(sl, b, 4.25, y + 0.11, 8.0, 0.75, size=12.5, color=INK2, spacing=1.08)
txt(sl, 'The economic argument for three sigma: closer in and you tamper constantly; further out and you '
        'miss real change. Shewhart tried the alternatives.',
    0.85, 6.52, 11.6, 0.35, size=12, italic=True, color=INK3)
footer(sl, nxt())

# ═════════════════════════════════════════════════════════════════════════════
# 7 — THE CASE, part one: pooled
# ═════════════════════════════════════════════════════════════════════════════
sl = slide()
kicker(sl, 'A worked case · referral turnaround, 24 months, two clinics')
title(sl, 'Charted as collected: nothing to see', size=32)
minichart(sl, 0.85, 2.2, 8.3, 3.5, POOLED, 7.58, 25.68, -10.52,
          label_ucl='UNPL 25.7', label_lcl='LNPL −10.5', label_cl='CL 7.58')
banner(sl, 9.5, 2.2, 2.95, 3.5, 'The chart says',
       'Stable.\n\nPredictable.\n\nZero signals in 48 months of data.\n\n'
       'Limits run from −10.5 to +25.7 days — while the data never leaves 3.7 to 11.8.\n\n'
       'A negative number of days is not a possible turnaround.',
       GRN_LT, GRN, GRN)
txt(sl, 'Nothing is missing from this data and nothing is miscomputed. The arithmetic is correct.',
    0.85, 5.95, 11.6, 0.4, size=15, color=INK2)
footer(sl, nxt())

# ═════════════════════════════════════════════════════════════════════════════
# 8 — THE CASE, part two: subgrouped
# ═════════════════════════════════════════════════════════════════════════════
sl = slide()
kicker(sl, 'Same data · subgrouped by clinic')
title(sl, 'Two processes sharing a spreadsheet', size=32)
minichart(sl, 0.85, 2.15, 5.7, 1.75, NORTH, 4.18, 5.30, 3.06,
          ymin=2.5, ymax=12.5, label_cl='4.18')
txt(sl, 'North Clinic', 0.95, 2.22, 2.0, 0.3, size=12, bold=True, color=ACC_DK)
minichart(sl, 0.85, 4.05, 5.7, 1.75, SOUTH, 10.99, 12.30, 9.68,
          ymin=2.5, ymax=12.5, label_cl='10.99')
txt(sl, 'South Clinic', 0.95, 4.12, 2.0, 0.3, size=12, bold=True, color=ACC_DK)

rect(sl, 6.95, 2.15, 5.5, 0.5, WHITE, BORDER)
rect(sl, 6.95, 2.15, 5.5 * 0.994, 0.5, BTW)
txt(sl, 'between clinics  99.4%', 6.95, 2.26, 4.4, 0.3, size=13, bold=True,
    color=WHITE, align=PP_ALIGN.CENTER)
txt(sl, 'Share of all variation that lives BETWEEN the clinics rather than within them',
    6.95, 2.75, 5.5, 0.5, size=11.5, color=INK2)

for i, (k, v, note) in enumerate([
        ('F(1, 46)', '3957', 'p < 0.0001'),
        ('North', '4.18 d', 'sigma 0.31'),
        ('South', '10.99 d', 'sigma 0.44'),
        ('Gap', '6.8 days', 'invisible when pooled')]):
    x = 6.95 + (i % 2) * 2.8
    y = 3.42 + (i // 2) * 1.08
    rect(sl, x, y, 2.6, 0.95, WHITE, BORDER)
    txt(sl, k, x + 0.18, y + 0.1, 2.2, 0.25, size=10, bold=True, color=INK3)
    txt(sl, v, x + 0.18, y + 0.34, 2.2, 0.4, size=20, bold=True, color=ACC_DK)
    txt(sl, note, x + 0.18, y + 0.72, 2.3, 0.25, size=10, color=INK3)

banner(sl, 6.95, 5.62, 5.5, 1.1, 'Shewhart called this a mixture',
       'Alternating sources inflate the movement the limits are built from, so the chart goes '
       'quiet exactly when it should not.',
       SIG_LT, SIG, SIG)
footer(sl, nxt())

# ═════════════════════════════════════════════════════════════════════════════
# 9 — Subgrouping is a claim about cause
# ═════════════════════════════════════════════════════════════════════════════
sl = slide(ACC_DK)
rect(sl, 0, 0, 13.33, 7.5, ACC_DK)
txt(sl, 'RATIONAL SUBGROUPING', 0.85, 0.9, 11, 0.35, size=12, bold=True,
    color=RGBColor(0x7b, 0xa7, 0xc7))
txt(sl, 'Choosing a subgroup is a claim about cause,\nnot a display option',
    0.85, 1.5, 11.6, 1.6, size=34, bold=True, color=WHITE, spacing=1.05)
txt(sl, 'When you group observations you are declaring that the variation INSIDE a group is noise. '
        'That becomes the yardstick the limits are built from. Anything you want the chart to detect '
        'has to be forced to appear BETWEEN groups instead.',
    0.85, 3.4, 11.2, 1.1, size=17, color=RGBColor(0xc6, 0xdb, 0xea), spacing=1.25)
rect(sl, 0.85, 4.75, 11.6, 0.055, BTW)
txt(sl, 'Change the grouping and you change what the chart is capable of seeing.',
    0.85, 5.0, 11.6, 0.5, size=21, bold=True, color=BTW)
txt(sl, 'This is why the tool puts the subgrouping panel ABOVE the chart, states what fraction of the '
        'variation your choice has just reclassified as noise, and says so in words. Most software '
        'defaults to "subgroup size 5, consecutive rows" and never mentions it again.',
    0.85, 5.7, 11.2, 1.0, size=13.5, color=RGBColor(0x8f, 0xb4, 0xcd), spacing=1.2)
footer(sl, nxt())

# ═════════════════════════════════════════════════════════════════════════════
# 10 — Mixture and stratification
# ═════════════════════════════════════════════════════════════════════════════
sl = slide()
kicker(sl, 'Two failure modes worth recognising on sight')
title(sl, 'Both of these look like good news')
banner(sl, 0.85, 2.25, 5.6, 2.15, 'Mixture',
       'Two sources alternating in one series. Point-to-point movement is huge, so the limits are '
       'enormous and nothing ever signals.\n\n'
       'Symptom: points scattered widely inside limits that feel far too generous.\n'
       'Caught by: Nelson rule 8.',
       SIG_LT, SIG, SIG)
banner(sl, 6.85, 2.25, 5.6, 2.15, 'Stratification',
       'The subgroup straddles two sources in a way that inflates the WITHIN estimate. Limits come out '
       'too wide and points cling to the centre line.\n\n'
       'Symptom: everything in the middle third, nothing near a limit.\n'
       'Caught by: Nelson rule 7.',
       AMB_LT, RGBColor(0xfd, 0xe0, 0x47), RGBColor(0x85, 0x4d, 0x0e))
banner(sl, 0.85, 4.75, 11.6, 1.3, 'Which is why "no signals" is never enough on its own',
       'A quiet chart is either a stable process or a subgrouping failure, and the two are '
       'indistinguishable from the picture alone. Check the subgrouping panel before you believe it.',
       ACC_LT, ACC, ACC_DK)
footer(sl, nxt())

# ═════════════════════════════════════════════════════════════════════════════
# 11 — Overdispersion
# ═════════════════════════════════════════════════════════════════════════════
sl = slide()
kicker(sl, 'The trap specific to health care')
title(sl, 'Big denominators break the standard p chart', size=32)
txt(sl, 'Care plan completion across ~1,200 enrolled members, 18 months.',
    0.85, 2.1, 11.6, 0.35, size=15, color=INK2)
for i, (h, v, sub, col, bg) in enumerate([
        ('Classical p chart', '8 of 18', 'months flagged as special cause', SIG, SIG_LT),
        ('Sigma z', '2.37', 'months move 2.4× more than binomial allows', BTW, WHITE),
        ('Laney p′ corrected', '1 of 18', 'and that one is worth a phone call', GRN, GRN_LT)]):
    x = 0.85 + i * 3.95
    rect(sl, x, 2.6, 3.65, 1.75, bg, col)
    txt(sl, h, x + 0.25, 2.75, 3.2, 0.3, size=12, bold=True, color=col)
    txt(sl, v, x + 0.25, 3.08, 3.2, 0.6, size=32, bold=True, color=INK)
    txt(sl, sub, x + 0.25, 3.72, 3.2, 0.55, size=11.5, color=INK2, spacing=1.1)
banner(sl, 0.85, 4.65, 11.6, 1.5, 'Nothing was wrong with those clinics — the model was wrong',
       'The binomial assumption says a proportion built on 1,200 people can only wobble about 1.4 '
       'percentage points. Real months wobble five or ten, for entirely ordinary reasons: case mix, '
       'staffing, who was on holiday. When the assumption fails the limits are far too tight and the '
       'chart flags almost everything.\n'
       'The tool detects this automatically, names it, and offers the correction. If the data really '
       'were binomial, sigma z lands near 1 and the correction changes nothing.',
       ACC_LT, ACC, ACC_DK)
footer(sl, nxt())

# ═════════════════════════════════════════════════════════════════════════════
# 12 — Baseline window / CHW
# ═════════════════════════════════════════════════════════════════════════════
sl = slide()
kicker(sl, 'A second worked case · CHW home visits per week')
title(sl, 'When you change the process, say so', size=32)
minichart(sl, 0.85, 2.15, 5.75, 2.0, CHW, 47.3, 57.7, 37.0,
          ymin=33, ymax=62, dot=0.06, label_cl='CL 47.3')
txt(sl, 'Charted as one process  →  3 points flagged', 0.95, 4.25, 5.5, 0.3,
    size=13, bold=True, color=SIG)
minichart(sl, 6.75, 2.15, 5.75, 2.0, CHW, None, None, None,
          ymin=33, ymax=62, dot=0.06,
          phases=[(0, 18, 41.9, 52.1, 31.7), (18, 30, 55.5, 64.9, 46.1)])
txt(sl, 'Each phase reports its own centre line and limits, on the chart.',
    6.85, 4.52, 5.5, 0.28, size=11, italic=True, color=INK3)
txt(sl, 'Change marked at week 19  →  nothing flagged', 6.85, 4.25, 5.5, 0.3,
    size=13, bold=True, color=GRN)
banner(sl, 0.85, 4.8, 11.65, 1.35,
       'A second CHW joined at week 19. Both charts are arithmetically correct.',
       'Zero is the number to look at. Once the change is accounted for, each phase is stable on its '
       'own — predictable before, predictable after, and the jump between them was the thing you did.\n'
       'The single-process chart is worse than useless: its centre line of 47.3 describes a level the '
       'process never ran at, and it flags three weeks that were entirely ordinary for the period they '
       'belong to. Mark as many changes as the series really had.',
       ACC_LT, ACC, ACC_DK)
footer(sl, nxt())

# ═════════════════════════════════════════════════════════════════════════════
# 13 — The annotation travels with the chart
# ═════════════════════════════════════════════════════════════════════════════
sl = slide()
kicker(sl, 'And record why')
title(sl, 'A marked change with no reason attached is half a record')
txt(sl, 'Six months later nobody remembers what happened at week 19, and the boundary becomes an '
        'unexplainable kink in the data.',
    0.85, 2.15, 11.6, 0.5, size=16, color=INK2)
for i, (h, b) in enumerate([
        ('Click and type', 'Click the chart where the change happened. The note field takes focus '
                           'straight away, so the reason gets written while you still remember it.'),
        ('Attach the record', 'An optional link to the minutes, the ticket, the wiki page — whatever '
                              'documents the decision.'),
        ('It is drawn INTO the chart', 'Not in the page around it. A numbered block sits below the plot, '
                                       'so the note survives export to SVG, PNG, a slide, or paper.')]):
    x = 0.85 + i * 3.95
    rect(sl, x, 2.85, 3.65, 1.75, WHITE, BORDER)
    rect(sl, x, 2.85, 0.055, 1.75, CHG)
    txt(sl, h, x + 0.28, 3.0, 3.2, 0.4, size=15, bold=True, color=INK)
    txt(sl, b, x + 0.28, 3.5, 3.25, 1.0, size=11.5, color=INK2, spacing=1.12)

rect(sl, 0.85, 4.95, 11.65, 1.25, CHG_LT, CHG)
oval(sl, 1.25, 5.3, 0.24, CHG)
txt(sl, '1', 1.13, 5.19, 0.24, 0.24, size=10, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
txt(sl, 'Second CHW joined the team  ·  https://ndcgroup.relocalizecreativity.net/chw-staffing',
    1.5, 5.17, 10.6, 0.3, size=13, bold=True, color=ACC_DK)
txt(sl, 'What the exported chart carries. The link is printed as readable text as well as being '
        'clickable — a printed link that is not spelled out is no link at all.',
    1.5, 5.55, 10.6, 0.5, size=11.5, color=INK2)
footer(sl, nxt())

# ═════════════════════════════════════════════════════════════════════════════
# 13 — Four chart types on purpose
# ═════════════════════════════════════════════════════════════════════════════
sl = slide()
kicker(sl, 'Scope')
title(sl, 'Four chart types, and that is deliberate')
for i, (h, b) in enumerate([
        ('XmR', 'One number per period. The workhorse — use it unless there is a specific reason not to.'),
        ('p chart', 'A proportion whose denominator moves every period. Limits step to match.'),
        ('u chart', 'Counts over a varying area of opportunity — per 1,000 member-months.'),
        ('Run chart', 'Median line, no limits. Fewer assumptions, less power. Good for short series.')]):
    card(sl, 0.85 + i * 2.98, 2.25, 2.75, 1.6, h, b, ACC, headsize=16, bodysize=11.5)
txt(sl, 'Left out on purpose:  X̄–R and X̄–S · CUSUM · EWMA · Cp/Cpk capability · ANOM · funnel plots',
    0.85, 4.25, 11.6, 0.4, size=14, bold=True, color=INK2)
banner(sl, 0.85, 4.8, 11.6, 1.4, 'Every added chart type is vocabulary the co-op has to learn',
       'All of those are legitimate and some are excellent. They are absent because the first version '
       'of a tool should be the version a board will actually read, and unlearned vocabulary is how a '
       'tool ends up used by one person and trusted by none. The subgrouping panel already does the '
       'diagnostic work X̄–R and capability indices are usually reached for.\n'
       'When a real need appears — fourteen clinics compared at once genuinely wants a funnel plot — '
       'that is the moment to add one.',
       SURF2, BORDER, INK)
footer(sl, nxt())

# ═════════════════════════════════════════════════════════════════════════════
# 14 — Where WWHA numbers will lie to you
# ═════════════════════════════════════════════════════════════════════════════
sl = slide()
kicker(sl, 'What to expect')
title(sl, 'Where our numbers will lie to us')
items = [
    ('Any measure split by clinic, CHW, or provider',
     'Almost certainly a mixture. Check the share between before pooling anything.'),
    ('Any rate over a large population',
     'Overdispersed. A textbook p chart will flag most months and none of it will be real.'),
    ('Anything already averaged before it reaches us',
     'Underlying variation has been thrown away; limits come out far too tight.'),
    ('Anything with momentum — census, wait times, backlogs',
     'Autocorrelated. Today depends on yesterday, the independence assumption fails, limits are too '
     'tight. The tool does not catch this one; we have to.'),
    ('Any quarterly comparison of units against each other',
     'A league table. It will produce a stable-looking ranking that mostly reshuffles on noise.'),
]
for i, (h, b) in enumerate(items):
    y = 2.2 + i * 0.92
    rect(sl, 0.85, y, 11.6, 0.8, WHITE, BORDER)
    rect(sl, 0.85, y, 0.055, 0.8, BTW)
    txt(sl, h, 1.15, y + 0.09, 4.9, 0.6, size=13.5, bold=True, color=INK, spacing=1.0)
    txt(sl, b, 6.2, y + 0.09, 6.1, 0.65, size=12, color=INK2, spacing=1.05)
footer(sl, nxt())

# ═════════════════════════════════════════════════════════════════════════════
# 15 — The tool
# ═════════════════════════════════════════════════════════════════════════════
sl = slide()
kicker(sl, 'What exists today')
title(sl, 'One HTML file, no install, nothing leaves your machine')
for i, (h, b) in enumerate([
        ('Subgrouping panel', 'Renders above the chart. Reports sigma within, sigma overall, F, and the '
                              'share of variation between groups — in words, with a verdict.'),
        ('Correct varying limits', 'p and u limits recomputed at every point from that point\'s own '
                                   'denominator. Pooled centre line, not the mean of the rates.'),
        ('Overdispersion detection', 'Sigma z on every attribute chart, with the Laney p′/u′ correction '
                                     'one checkbox away.'),
        ('Change points', 'Mark where the process changed. Each phase gets its own centre line and '
                          'limits — reported on the chart, not buried in a table — run rules restart, and '
                          'the note and link you attach are drawn in alongside them.'),
        ('Nelson rules 1–8', 'Optional, with the false-alarm cost stated rather than hidden.'),
        ('SVG / PNG / JSON export', 'Charts for slides; full session state for reproducibility.')]):
    x = 0.85 + (i % 3) * 3.95
    y = 2.25 + (i // 3) * 1.75
    card(sl, x, y, 3.65, 1.55, h, b, ACC, headsize=14, bodysize=11)
txt(sl, 'tools/rcn-spc.html  ·  with an introduction and a full user manual beside it',
    0.85, 5.95, 11.6, 0.4, size=13, italic=True, color=INK3)
footer(sl, nxt())

# ═════════════════════════════════════════════════════════════════════════════
# 16 — Lineage
# ═════════════════════════════════════════════════════════════════════════════
sl = slide()
kicker(sl, 'Where the method comes from')
title(sl, 'This is not new here. It is coming back.')
line = [
    ('1924', 'Walter Shewhart', 'Bell Labs. Invents the control chart to tell chance causes from assignable ones.'),
    ('1950s', 'W. Edwards Deming', 'Carries it into management and into Japan. Names tampering as a management disease.'),
    ('2002', 'Marilyn K. Hart\nRobert F. Hart', 'Statistical Process Control for Health Care. Both mathematicians; '
             'they advised the major SPC software vendors on getting the arithmetic right.'),
    ('Then', 'Whatcom County', 'The Harts worked here for more than a year. Whatcom appears in the book.'),
]
for i, (yr, who, what) in enumerate(line):
    x = 0.85 + i * 3.0
    rect(sl, x, 2.4, 2.75, 2.5, WHITE, BORDER)
    rect(sl, x, 2.4, 2.75, 0.055, ACC if i < 3 else BTW)
    txt(sl, yr, x + 0.22, 2.6, 2.3, 0.3, size=12, bold=True, color=ACC if i < 3 else BTW)
    txt(sl, who, x + 0.22, 2.95, 2.35, 0.8, size=15, bold=True, color=INK, spacing=1.0)
    txt(sl, what, x + 0.22, 3.75, 2.35, 1.05, size=11, color=INK2, spacing=1.1)
    if i < 3:
        conn(sl, x + 2.78, 3.65, x + 2.97, 3.65, INK3, 1.2)
banner(sl, 0.85, 5.25, 11.6, 1.1, 'Why the Harts matter for our case specifically',
       'Their treatment of the varying denominator is unusually careful — which is what you would '
       'expect from people writing the spec a software vendor codes against, rather than teaching a '
       'seminar. Health care lives in the varying-denominator case; manufacturing textbooks treat it '
       'as an afterthought.',
       ACC_LT, ACC, ACC_DK)
footer(sl, nxt())

# ═════════════════════════════════════════════════════════════════════════════
# 17 — What to expect from adopting it
# ═════════════════════════════════════════════════════════════════════════════
sl = slide()
kicker(sl, 'Honest expectations')
title(sl, 'What adopting this actually feels like')
banner(sl, 0.85, 2.25, 11.6, 1.35, 'Most measures will come back stable and unsatisfactory',
       'No signals, and the average is nowhere near where anyone wants it. This is the most common '
       'finding and the most useful one: it moves the conversation from "who had a bad month" to '
       '"what would have to change about how we work". Nothing short of a system change will move a '
       'stable process.',
       GRN_LT, GRN, GRN)
banner(sl, 0.85, 3.85, 11.6, 1.2, 'The first honest chart will be unpopular',
       'It will retire a story someone is attached to — usually a quarterly improvement that was '
       'noise, or a problem clinic that turns out to be a subgrouping artifact. Plan for that '
       'conversation rather than being surprised by it.',
       AMB_LT, RGBColor(0xfd, 0xe0, 0x47), RGBColor(0x85, 0x4d, 0x0e))
banner(sl, 0.85, 5.3, 11.6, 1.2, 'And the charts will be readable by everyone in the room',
       'That is the design goal above all others: a picture a group can gather around, point at, and '
       'argue about with no training at all. A control chart may be the best one ever invented for '
       'that, and it was finished in 1924.',
       ACC_LT, ACC, ACC_DK)
footer(sl, nxt())

# ═════════════════════════════════════════════════════════════════════════════
# 18 — Next
# ═════════════════════════════════════════════════════════════════════════════
sl = slide(ACC_DK)
rect(sl, 0, 0, 13.33, 7.5, ACC_DK)
rect(sl, 0.85, 1.5, 1.6, 0.06, BTW)
txt(sl, 'What we would need from you', 0.85, 1.95, 11, 0.8, size=34, bold=True, color=WHITE)
for i, (h, b) in enumerate([
        ('Three real measures', 'Whichever three the co-op is most likely to be judged on. '
                                'Long format, one row per observation, denominators included.'),
        ('The grouping columns', 'Clinic, CHW, provider, shift — whatever the data can be split by. '
                                 'Without these the subgrouping panel has nothing to work with.'),
        ('What you changed, and when', 'Every deliberate change to those processes with its date — '
                                       'new staff, new forms, new locations. Without it we will read your '
                                       'improvements as instability.'),
        ('One thing you already believe', 'A conclusion someone has drawn from the numbers. '
                                          'Charting it is the fastest way to find out whether the method earns its keep.')]):
    y = 2.85 + i * 1.0
    rect(sl, 0.85, y, 0.055, 0.95, BTW)
    txt(sl, h, 1.15, y + 0.02, 4.0, 0.45, size=17, bold=True, color=WHITE)
    txt(sl, b, 5.3, y, 7.1, 0.95, size=13, color=RGBColor(0xc6, 0xdb, 0xea), spacing=1.15)
txt(sl, 'The tool, an introduction, and a full user manual are ready to try now.',
    0.85, 6.95, 11, 0.35, size=13, italic=True, color=RGBColor(0x7b, 0xa7, 0xc7))

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools', 'rcn-spc-intro.pptx')
out = os.path.normpath(out)
prs.save(out)
print('Wrote', out, '·', len(prs.slides.__iter__.__self__._sldIdLst), 'slides')
