"""
Generate sensimod-overview.pptx — Vester Influence Analysis overview deck
Requires: pip install python-pptx  (already in /tmp/docx-env)
Run: /tmp/docx-env/bin/python /Users/marcpierson/rcn/docs/make_sensimod_pptx.py
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

# ── Palette ───────────────────────────────────────────────────────────────────
B_DK  = RGBColor(0x1e, 0x3a, 0x5f)   # dark navy
B     = RGBColor(0x1d, 0x4e, 0xd8)   # blue
B_MED = RGBColor(0x3b, 0x82, 0xf6)   # medium blue
B_LT  = RGBColor(0xdb, 0xea, 0xfe)   # light blue
B_BG  = RGBColor(0xef, 0xf6, 0xff)   # near-white blue
T     = RGBColor(0x0d, 0x94, 0x88)   # teal
T_LT  = RGBColor(0xcc, 0xfb, 0xf1)   # light teal
T_BG  = RGBColor(0xf0, 0xfd, 0xfa)   # near-white teal
AM    = RGBColor(0x92, 0x40, 0x0e)   # amber (planned)
AM_LT = RGBColor(0xff, 0xf3, 0xcd)   # light amber
BLACK = RGBColor(0x1a, 0x1a, 0x1a)
GREY  = RGBColor(0x47, 0x55, 0x69)
LGREY = RGBColor(0x94, 0xa3, 0xb8)
WHITE = RGBColor(0xff, 0xff, 0xff)
OFF   = RGBColor(0xfa, 0xfa, 0xf8)
RED_LT = RGBColor(0xfe, 0xe2, 0xe2)
RED   = RGBColor(0xdc, 0x26, 0x26)
GRN_LT = RGBColor(0xdc, 0xfc, 0xe7)
GRN   = RGBColor(0x16, 0x65, 0x34)

prs = Presentation()
prs.slide_width  = Inches(13.33)
prs.slide_height = Inches(7.5)
BLANK = prs.slide_layouts[6]

# ── Primitives ────────────────────────────────────────────────────────────────
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

def oval(sl, x, y, w, h, fill=B, line=None):
    sh = sl.shapes.add_shape(9, Inches(x), Inches(y), Inches(w), Inches(h))
    sh.fill.solid()
    sh.fill.fore_color.rgb = fill
    if line:
        sh.line.color.rgb = line
    else:
        sh.line.fill.background()
    return sh

def txt(sl, text, x, y, w, h, size=20, bold=False, italic=False,
        color=BLACK, align=PP_ALIGN.LEFT, font='Calibri'):
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
    r.font.name = font
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
        r.font.size    = Pt(sizes[i]  if isinstance(sizes,  list) else (sizes  or 18))
        r.font.bold    = bolds[i]     if isinstance(bolds,  list) else (bolds  or False)
        r.font.color.rgb = colors[i]  if isinstance(colors, list) else (colors or BLACK)
        r.font.name    = 'Calibri'
    return tb

def box_txt(sl, lines, x, y, w, h, fill=B_BG, line=B, lw=1.5,
            size=15, bold_first=True, text_color=BLACK,
            top_color=None, align=PP_ALIGN.LEFT):
    sh = rect(sl, x, y, w, h, fill=fill, line=line, lw=lw)
    tf = sh.text_frame
    tf.word_wrap = True
    tf.margin_left  = Inches(0.14)
    tf.margin_right = Inches(0.14)
    tf.margin_top   = Inches(0.1)
    tf.margin_bottom= Inches(0.1)
    for i, line_text in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        r = p.add_run()
        r.text = line_text
        r.font.size  = Pt(size if i > 0 else size + 1)
        r.font.bold  = (bold_first and i == 0)
        r.font.color.rgb = (top_color or text_color) if i == 0 else text_color
        r.font.name  = 'Calibri'
    return sh

def label(sl, text, color=B):
    txt(sl, text, 0.45, 0.18, 12, 0.3, size=9, bold=True, color=color)

def bar(sl, color=B, y=0.55, h=0.035):
    rect(sl, 0, y, 13.33, h, fill=color)

def title_txt(sl, text, color=BLACK, size=32, y=0.62):
    txt(sl, text, 0.45, y, 12.4, 1.3, size=size, bold=True, color=color)


# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 1 — TITLE
# ══════════════════════════════════════════════════════════════════════════════
s1 = slide()
bg(s1, B_DK)

txt(s1, 'Vester Sensitivity Model',
    0.6, 1.3, 12.1, 1.4, size=44, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

rect(s1, 3.2, 3.05, 6.9, 0.05, fill=B_MED)

txt(s1, 'A nine-step toolkit for understanding complex systems',
    0.6, 3.2, 12.1, 0.8, size=22, color=B_LT, align=PP_ALIGN.CENTER)

txt(s1, 'ReLocalize Creativity Network  ·  2026',
    0.6, 6.6, 12.1, 0.5, size=13,
    color=RGBColor(0x7a, 0xaa, 0xd8), align=PP_ALIGN.CENTER)

txt(s1, 'Based on Frederic Vester  ·  The Art of Interconnected Thinking',
    0.6, 7.1, 12.1, 0.35, size=11, italic=True,
    color=RGBColor(0x5a, 0x80, 0xa8), align=PP_ALIGN.CENTER)


# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 2 — THE PROBLEM WITH LINEAR THINKING
# ══════════════════════════════════════════════════════════════════════════════
s2 = slide()
bg(s2, WHITE)
label(s2, 'WHY THIS METHOD')
bar(s2)
title_txt(s2, 'Complex systems don\'t respond to linear intervention.')

problems = [
    '  Fixing one part breaks another — unintended consequences compound.',
    '  Optimizing individual variables destroys systemic balance.',
    '  Expert knowledge stays siloed — no shared picture of the whole.',
    '  Plans look rational on paper and fail when they meet the real system.',
]
txlines(s2, problems, x=0.6, y=2.1, w=12.1, h=3.8,
        sizes=20, colors=BLACK, spacing=10)

rect(s2, 0.5, 5.6, 12.3, 1.0, fill=B_BG, line=B, lw=1.5)
txt(s2,
    'Vester\'s method makes the whole visible — so interventions can work '
    'with the system, not against it.',
    0.7, 5.72, 11.9, 0.8, size=16, italic=True, color=B_DK, align=PP_ALIGN.CENTER)


# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 3 — WHAT THE METHOD DOES
# ══════════════════════════════════════════════════════════════════════════════
s3 = slide()
bg(s3, WHITE)
label(s3, 'THE APPROACH')
bar(s3)
title_txt(s3, 'Map influence. Classify roles. Model behavior.')

txlines(s3,
    ['The Sensitivity Model is a structured group process that:',
     '  ·  Identifies 20–30 key variables in a system',
     '  ·  Maps how each variable influences every other',
     '  ·  Classifies variables by their systemic role',
     '  ·  Builds a structural model for simulation',
     '  ·  Tests interventions before committing to them'],
    x=0.5, y=1.95, w=6.8, h=4.5,
    sizes=[18,16,16,16,16,16],
    bolds=[True,False,False,False,False,False],
    colors=[BLACK]+[GREY]*5)

rect(s3, 7.7, 1.85, 5.1, 4.6, fill=B_BG, line=B, lw=1.5)
txt(s3, 'The guiding principle:', 7.9, 2.05, 4.7, 0.45,
    size=13, bold=True, color=B)
txt(s3,
    'A system cannot be understood by analyzing its parts in isolation. '
    'Only by tracing influence relationships across the whole can leverage '
    'points, instabilities, and safe intervention strategies be identified.',
    7.9, 2.6, 4.7, 3.5, size=15, color=BLACK)


# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 4 — THE NINE STEPS
# ══════════════════════════════════════════════════════════════════════════════
s4 = slide()
bg(s4, OFF)
label(s4, 'THE METHOD')
bar(s4)
title_txt(s4, 'Nine Steps — Analytical  →  Structural  →  Dynamic', size=28)

# Three phases, three steps each
phases = [
    ('Analysis', T,    ['1  System\nDescription', '2  Variable\nSet', '3  System\nCriteria']),
    ('Structural', B,  ['4  Cross-Impact\nMatrix', '5  System\nRoles', '6  Partial\nScenario']),
    ('Dynamic',  B_DK, ['7  Stock & Flow\nDiagram', '8  Lookup\nTable Curves', '9  Simulation']),
]

phase_y = 1.75
step_h  = 1.55
box_w   = 3.6
box_h   = 1.2

for col, (phase_label, color, steps) in enumerate(phases):
    px = 0.45 + col * 4.28
    # Phase label
    rect(s4, px, phase_y, box_w * 3 / 3, 0.32, fill=color)
    txt(s4, phase_label.upper() + ' PHASE', px + 0.1, phase_y + 0.05,
        box_w - 0.2, 0.25, size=9, bold=True, color=WHITE)

    for row, step_label in enumerate(steps):
        sx = px + row * (box_w / 3 + 0.03)
        sy = phase_y + 0.38
        sw = box_w / 3 - 0.03
        box_txt(s4, [step_label], sx, sy, sw, box_h,
                fill=B_BG if color == B else (T_BG if color == T else B_DK),
                line=color, lw=2, size=11,
                top_color=color if color != B_DK else B_LT,
                text_color=BLACK if color != B_DK else WHITE,
                align=PP_ALIGN.CENTER)
        # Arrow between steps within a phase
        if row < 2:
            txt(s4, '→', sx + sw + 0.0, sy + 0.38, 0.08, 0.4,
                size=10, color=LGREY, align=PP_ALIGN.CENTER)

    # Arrow between phases
    if col < 2:
        txt(s4, '▶', px + box_w + 0.06, phase_y + 0.72, 0.18, 0.5,
            size=14, color=LGREY, align=PP_ALIGN.CENTER)

txt(s4, 'Vester app  (vester.relocalizecreativity.net)',
    0.45, 6.4, 5.5, 0.4, size=11, color=T, bold=True)
txt(s4, 'RCN Graph Tool — SFD mode  (graph-tool-v22.html)',
    8.1, 6.4, 5.1, 0.4, size=11, color=B_DK, bold=True)
rect(s4, 0.45, 6.85, 5.5, 0.04, fill=T)
rect(s4, 8.1, 6.85, 5.1, 0.04, fill=B_DK)


# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 5 — STEPS 1–3: ANALYSIS PHASE
# ══════════════════════════════════════════════════════════════════════════════
s5 = slide()
bg(s5, WHITE)
label(s5, 'STEPS 1–3  ·  ANALYSIS PHASE', T)
bar(s5, color=T)
title_txt(s5, 'Define the system. Identify variables. Classify them.')

step_data = [
    ('1  System Description',
     'Define the boundary, purpose, and problem in plain language. Who is affected? What is inside vs. outside the system?',
     'Budget 30–60 min in workshop.'),
    ('2  Variable Set',
     '20–30 key variables. Each has a name, description, and 0–30 scale with observable anchor points and an optional optimum.',
     'Short names (2–4 words) for matrix legibility.'),
    ('3  System Criteria',
     'Assess each variable against 24 criteria in 5 groups: Spheres of Life, Physical, Dynamical, System Relationships, CPC.',
     'Labels and definitions are editable for your context.'),
]
for i, (title, body, tip) in enumerate(step_data):
    bx = 0.4 + i * 4.28
    sh = rect(s5, bx, 1.85, 4.0, 4.5, fill=T_BG, line=T, lw=2)
    tf = sh.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = Inches(0.15)
    tf.margin_top  = Inches(0.12)
    for j, line in enumerate([title, '', body, '', 'Tip: ' + tip]):
        p = tf.paragraphs[0] if j == 0 else tf.add_paragraph()
        p.alignment = PP_ALIGN.LEFT
        r = p.add_run()
        r.text = line
        r.font.size  = Pt(15 if j == 0 else (12 if j == 4 else 13))
        r.font.bold  = (j == 0)
        r.font.italic = (j == 4)
        r.font.color.rgb = T if j == 0 else (GREY if j == 4 else BLACK)
        r.font.name  = 'Calibri'

rect(s5, 0.4, 6.55, 12.5, 0.55, fill=T_BG, line=T, lw=1)
txt(s5, 'Built and working  ✓  ·  Vester app  ·  vester.relocalizecreativity.net',
    0.6, 6.65, 12.1, 0.38, size=12, bold=True, color=T)


# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 6 — STEPS 4–6: STRUCTURAL PHASE
# ══════════════════════════════════════════════════════════════════════════════
s6 = slide()
bg(s6, WHITE)
label(s6, 'STEPS 4–6  ·  STRUCTURAL PHASE', B)
bar(s6, color=B)
title_txt(s6, 'Score influence. Classify roles. Build scenarios.')

step_data2 = [
    ('4  Cross-Impact Matrix', B, '✓ Built',
     'N×N grid. Click to score how strongly each variable influences every other (0–3). Active Sum = driver score. Passive Sum = receiver score.',
     'Score row by row as a group — 2–3 hrs for 20 variables.'),
    ('5  System Roles', B, '✓ Built',
     'Plot variables on the Active × Passive quadrant. Classify as: Active (drivers), Passive (indicators), Critical (both high), Buffering (both low). Q-isolines show systemic relevance.',
     'Reveals where to intervene — and where not to.'),
    ('6  Partial Scenario', B, '✓ Built',
     'Select 2–4 leverage variables. Define alternative states. Trace first-order consequences through the matrix.',
     'Setup for SFD initial conditions.'),
]
for i, (title, color, badge, body, tip) in enumerate(step_data2):
    bx = 0.4 + i * 4.28
    fill = B_BG if color == B else RGBColor(0xf8, 0xfa, 0xfc)
    line_col = color if color != LGREY else RGBColor(0xcc, 0xd5, 0xe0)
    sh = rect(s6, bx, 1.85, 4.0, 4.5, fill=fill, line=line_col, lw=2)
    tf = sh.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = Inches(0.15)
    tf.margin_top  = Inches(0.12)
    for j, line in enumerate([title, badge, '', body, '', 'Tip: ' + tip]):
        p = tf.paragraphs[0] if j == 0 else tf.add_paragraph()
        r = p.add_run()
        r.text = line
        r.font.size  = Pt(15 if j == 0 else (11 if j == 1 else (12 if j == 5 else 13)))
        r.font.bold  = (j == 0)
        r.font.italic = (j == 5)
        r.font.color.rgb = (color if j == 0 else
                            (GRN if badge.startswith('✓') and j == 1 else
                             (LGREY if j == 1 else
                              (GREY if j == 5 else BLACK))))
        r.font.name  = 'Calibri'

rect(s6, 0.4, 6.55, 12.5, 0.55, fill=B_BG, line=B, lw=1)
txt(s6, 'Steps 4–6 built ✓  ·  Vester app',
    0.6, 6.65, 12.1, 0.38, size=12, bold=True, color=B)


# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 7 — THE AS×PS QUADRANT
# ══════════════════════════════════════════════════════════════════════════════
s7 = slide()
bg(s7, WHITE)
label(s7, 'STEP 5  ·  SYSTEM ROLES', B)
bar(s7, color=B)
title_txt(s7, 'Every variable has a role in the system.')

# Quadrant diagram
qx, qy, qw, qh = 0.5, 1.7, 6.0, 5.1
hw, hh = qw / 2, qh / 2

# Background quadrants
rect(s7, qx,      qy,      hw, hh, fill=B_BG,  line=None)   # upper-left: Active
rect(s7, qx+hw,   qy,      hw, hh, fill=RED_LT, line=None)  # upper-right: Critical
rect(s7, qx,      qy+hh,   hw, hh, fill=GRN_LT, line=None)  # lower-left: Buffer
rect(s7, qx+hw,   qy+hh,   hw, hh, fill=OFF,    line=None)  # lower-right: Passive

# Border
rect(s7, qx, qy, qw, qh, fill=RGBColor(0xff,0xff,0xff), line=LGREY, lw=1)
# Crosshairs
rect(s7, qx+hw-0.01, qy, 0.02, qh, fill=LGREY, line=None)
rect(s7, qx, qy+hh-0.01, qw, 0.02, fill=LGREY, line=None)

# Quadrant labels and descriptions
quads = [
    (qx+0.1,    qy+0.1,  B,   'ACTIVE',    'High AS · Low PS',   'Strong drivers.\nFew feedbacks.\nGood levers.'),
    (qx+hw+0.1, qy+0.1,  RED, 'CRITICAL',  'High AS · High PS',  'High leverage.\nUnpredictable.\nHandle carefully.'),
    (qx+0.1,    qy+hh+0.1, GRN, 'BUFFERING', 'Low AS · Low PS',  'Stable dampers.\nAbsorb shocks.\nPreserve these.'),
    (qx+hw+0.1, qy+hh+0.1, GREY,'PASSIVE',  'Low AS · High PS',  'Result variables.\nReflect system\nstate. Measure here.'),
]
for (lx, ly, col, name, sub, desc) in quads:
    txt(s7, name, lx, ly, 2.7, 0.4, size=13, bold=True, color=col)
    txt(s7, sub,  lx, ly+0.38, 2.7, 0.3, size=10, color=col)
    txt(s7, desc, lx, ly+0.65, 2.7, 0.95, size=12, color=BLACK)

# Axis labels
txt(s7, '▲  Active Sum (AS)  —  how much this variable drives others',
    qx-0.05, qy-0.38, qw+0.1, 0.3, size=10, color=GREY)
txt(s7, 'Passive Sum (PS)  —  how much others drive this variable  ▶',
    qx, qy+qh+0.05, qw, 0.3, size=10, color=GREY)

# Right panel — explanation
txlines(s7,
    ['Why roles matter',
     '',
     'Intervening on a Critical variable amplifies disturbances through the whole system. A small push creates large, hard-to-predict effects.',
     '',
     'Buffering variables seem unimportant — low scores in both directions. But they are the system\'s shock absorbers. Destroying them increases volatility everywhere.',
     '',
     'Active variables are the cleanest levers: they drive others but aren\'t strongly driven back. They respond predictably to intervention.',
     '',
     'Passive variables are the best measurement points — they reflect overall system state without feeding back noise into the model.'],
    x=6.9, y=1.7, w=6.0, h=5.2,
    sizes=[15,8,13,8,13,8,13,8,13],
    bolds=[True]+[False]*9,
    colors=[B]+[BLACK]*9,
    spacing=2)


# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 8 — STEPS 7–9: DYNAMIC PHASE
# ══════════════════════════════════════════════════════════════════════════════
s8 = slide()
bg(s8, WHITE)
label(s8, 'STEPS 7–9  ·  DYNAMIC PHASE', B_DK)
bar(s8, color=B_DK)
title_txt(s8, 'Formalize structure. Build curves. Simulate.')

step_data3 = [
    ('7  Stock & Flow\nDiagram', B_DK, '✓ Built',
     'Translate variable relationships into stocks, flows, auxiliaries, and clouds. Built in RCN Graph Tool SFD mode. XMILE export to Vensim / Insightmaker.',
     'Auto-valve insertion on stock→stock connections.'),
    ('8  Lookup Table\nCurves', AM, '· Planned',
     'Group-constructed graphical functions replace equations. Each curve maps an input variable to an output effect. Expert knowledge captured in the curve shape, not a formula.',
     'The key Vester insight — debate the curve, own the model.'),
    ('9  Simulation', AM, '· Planned',
     'Euler integration reads from lookup tables. What-if scenario runs. Results evaluated against Vester\'s 8 biocybernetic basic rules as a diagnostic layer.',
     'XMILE export is the bridge to Vensim/Insightmaker while this is built.'),
]
for i, (title, color, badge, body, tip) in enumerate(step_data3):
    bx = 0.4 + i * 4.28
    fill = B_BG if color == B_DK else AM_LT
    line_col = color
    sh = rect(s8, bx, 1.85, 4.0, 4.5, fill=fill, line=line_col, lw=2)
    tf = sh.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = Inches(0.15)
    tf.margin_top = Inches(0.12)
    for j, line in enumerate([title, badge, '', body, '', 'Note: ' + tip]):
        p = tf.paragraphs[0] if j == 0 else tf.add_paragraph()
        r = p.add_run()
        r.text = line
        r.font.size  = Pt(14 if j == 0 else (11 if j == 1 else (12 if j == 5 else 13)))
        r.font.bold  = (j == 0)
        r.font.italic = (j == 5)
        r.font.color.rgb = (color if j == 0 else
                            (GRN if badge.startswith('✓') and j == 1 else
                             (AM if j == 1 else
                              (GREY if j == 5 else BLACK))))
        r.font.name  = 'Calibri'

rect(s8, 0.4, 6.55, 12.5, 0.55, fill=B_BG, line=B_DK, lw=1)
txt(s8, 'Step 7 built ✓  ·  Steps 8–9 planned  ·  RCN Graph Tool  (graph-tool-v22.html)',
    0.6, 6.65, 12.1, 0.38, size=12, bold=True, color=B_DK)


# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 9 — GROUP CONSTRUCTION PRINCIPLE
# ══════════════════════════════════════════════════════════════════════════════
s9 = slide()
bg(s9, WHITE)
label(s9, 'GROUP PROCESS', T)
bar(s9, color=T)
title_txt(s9, 'The answers come from the system — not from an analyst.')

principles = [
    (T,    T_BG,  'The group owns the model.',
     'Every scoring decision is visible to everyone. Disagreements surface in the matrix and get resolved in the room — not in a report that no one reads. When the model is finished, everyone has seen it built.'),
    (B,    B_BG,  'Variables are scored together.',
     'Going row by row ("How much does X influence Y?") produces faster consensus than solo scoring. The debate about each cell is the work — it surfaces hidden assumptions and boundary disagreements.'),
    (B_DK, OFF,   'Lookup table curves are constructed in workshops.',
     'The curve shape is debated. A nurse knows something an economist doesn\'t; an elder knows something a planner doesn\'t. Integrating that knowledge directly into the model structure is the point.'),
]
for i, (col, fill, heading, body) in enumerate(principles):
    ry = 1.85 + i * 1.7
    rect(s9, 0.4, ry, 12.5, 1.5, fill=fill, line=col, lw=2)
    txt(s9, heading, 0.65, ry + 0.12, 12.0, 0.45, size=16, bold=True, color=col)
    txt(s9, body,    0.65, ry + 0.58, 12.0, 0.82, size=13, color=BLACK)

rect(s9, 0.4, 7.0, 12.5, 0.38, fill=T_BG, line=None)
txt(s9, 'This is not a consultant\'s tool. It is a shared modeling process.',
    0.6, 7.06, 12.1, 0.3, size=13, italic=True, color=T, align=PP_ALIGN.CENTER)


# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 10 — CURRENT STATE
# ══════════════════════════════════════════════════════════════════════════════
s10 = slide()
bg(s10, WHITE)
label(s10, 'CURRENT STATE  ·  JULY 2026', B)
bar(s10, color=B)
title_txt(s10, 'What\'s Built and What\'s Planned')

built = [
    '✓  Step 1: System Description',
    '✓  Step 2: Variable Set  (with 0–30 scales)',
    '✓  Step 3: System Criteria  (24 criteria × 5 groups)',
    '✓  Step 4: Cross-Impact Matrix  (with live AS/PS totals)',
    '✓  Step 5: System Roles  (AS × PS quadrant, Q-isolines)',
    '✓  Step 6: Partial Scenario',
    '✓  Step 7: SFD mode in RCN Graph Tool',
    '✓  XMILE export  (Vensim / Insightmaker)',
    '✓  Save / Load JSON',
]
planned = [
    '→  Variable bridge: Vester app → SFD  (shared IDs)',
    '→  Step 8: Lookup Table curve editor',
    '→  Step 9: Simulation engine  (Euler)',
    '→  Biocybernetic evaluation layer',
]

rect(s10, 0.4, 1.85, 7.4, 5.3, fill=GRN_LT, line=GRN, lw=1.5)
txt(s10, 'Working now', 0.6, 1.95, 5.0, 0.38, size=11, bold=True, color=GRN)
for i, item in enumerate(built):
    txt(s10, item, 0.6, 2.45 + i * 0.6, 7.1, 0.55, size=14, color=BLACK)

rect(s10, 8.0, 1.85, 5.0, 5.3, fill=AM_LT, line=AM, lw=1.5)
txt(s10, 'Planned', 8.2, 1.95, 4.5, 0.38, size=11, bold=True, color=AM)
for i, item in enumerate(planned):
    txt(s10, item, 8.2, 2.45 + i * 0.72, 4.7, 0.65, size=13, color=BLACK)


# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 11 — TWO-TOOL PIPELINE
# ══════════════════════════════════════════════════════════════════════════════
s11 = slide()
bg(s11, OFF)
label(s11, 'THE PIPELINE', B)
bar(s11, color=B)
title_txt(s11, 'Two tools. One shared variable set.')

# SensiMod box
rect(s11, 0.4, 1.7, 5.9, 5.0, fill=T_BG, line=T, lw=2.5)
txt(s11, 'Vester app', 0.6, 1.82, 5.5, 0.45, size=15, bold=True, color=T)
txt(s11, 'vester.relocalizecreativity.net', 0.6, 2.25, 5.5, 0.32, size=10,
    color=LGREY, italic=True)
steps_sm = ['Step 1 — System Description  ✓',
            'Step 2 — Variable Set  ✓',
            'Step 3 — System Criteria  ✓',
            'Step 4 — Cross-Impact Matrix  ✓',
            'Step 5 — System Roles  ✓',
            'Step 6 — Partial Scenario  ✓']
for i, s in enumerate(steps_sm):
    c = GRN if '✓' in s else LGREY
    txt(s11, s, 0.65, 2.65 + i * 0.52, 5.5, 0.48, size=12, color=c)

# Arrow
txt(s11, '→\nJSON', 6.45, 3.45, 0.9, 1.0, size=20, bold=True,
    color=LGREY, align=PP_ALIGN.CENTER)

# Graph Tool box
rect(s11, 7.4, 1.7, 5.5, 5.0, fill=B_BG, line=B_DK, lw=2.5)
txt(s11, 'RCN Graph Tool — SFD mode', 7.6, 1.82, 5.1, 0.45, size=15, bold=True, color=B_DK)
txt(s11, 'graph-tool-v22.html', 7.6, 2.25, 5.1, 0.32, size=10, color=LGREY, italic=True)
steps_gt = ['Step 7 — Stock & Flow Diagram  ✓',
            'Step 7 — XMILE export  ✓',
            'Step 8 — Lookup Table Curves  · planned',
            'Step 9 — Simulation  · planned',
            'Step 9 — Biocybernetic Eval  · planned']
for i, s in enumerate(steps_gt):
    c = GRN if '✓' in s else LGREY
    txt(s11, s, 7.65, 2.65 + i * 0.62, 5.1, 0.56, size=12, color=c)

txt(s11,
    'Variables defined in the Vester app become the shared objects in the SFD. '
    'Changing a variable name or scale in the Vester app will update it everywhere — '
    'the "control the whole space" requirement.',
    0.4, 6.9, 12.5, 0.5, size=12, italic=True, color=GREY)


# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 12 — CLOSING
# ══════════════════════════════════════════════════════════════════════════════
s12 = slide()
bg(s12, B_DK)

txt(s12,
    '"The most important thing a systemic model\ngives you is not the answer —\nit is a shared picture of the question."',
    0.8, 0.9, 11.7, 3.2, size=32, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

rect(s12, 3.2, 4.2, 6.9, 0.05, fill=B_MED)

txt(s12,
    'Variables you can see. Relationships you can debate.\nInterventions you can test — before committing.',
    0.8, 4.4, 11.7, 1.4, size=22, color=B_LT, align=PP_ALIGN.CENTER)

txt(s12, 'Vester Sensitivity Model  ·  RCN Implementation  ·  2026',
    0.8, 6.6, 11.7, 0.5, size=13,
    color=RGBColor(0x7a, 0xaa, 0xd8), align=PP_ALIGN.CENTER)


# ── Save ──────────────────────────────────────────────────────────────────────
out = '/Users/marcpierson/rcn/docs/sensimod-overview.pptx'
prs.save(out)
print(f'Saved {prs.slides.__len__()} slides → {out}')
