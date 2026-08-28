"""
Generate sodoto-pitch.pptx — non-technical adopter deck
Requires: pip install python-pptx  (already in /tmp/docx-env)
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

# ── Palette ──────────────────────────────────────────────────────────────────
G      = RGBColor(0x2d, 0x6a, 0x4f)   # RCN green
G_LT   = RGBColor(0xd1, 0xfa, 0xe5)   # light green
G_BG   = RGBColor(0xf0, 0xf9, 0xf4)   # near-white green
G_DK   = RGBColor(0x1a, 0x3d, 0x2e)   # dark green
B      = RGBColor(0x1a, 0x56, 0xa4)   # blue
B_LT   = RGBColor(0xdb, 0xea, 0xfe)   # light blue
B_BG   = RGBColor(0xef, 0xf6, 0xff)   # near-white blue
AM     = RGBColor(0x92, 0x40, 0x0e)   # amber
AM_LT  = RGBColor(0xff, 0xf3, 0xcd)   # light amber
BLACK  = RGBColor(0x1a, 0x1a, 0x1a)
GREY   = RGBColor(0x47, 0x55, 0x69)
LGREY  = RGBColor(0x94, 0xa3, 0xb8)
WHITE  = RGBColor(0xff, 0xff, 0xff)
OFF    = RGBColor(0xfa, 0xfa, 0xf8)

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

def oval(sl, x, y, w, h, fill=G, line=None):
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
    """Multi-paragraph textbox. sizes/bolds/colors can be lists or scalars."""
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

def box_txt(sl, lines, x, y, w, h, fill=G_BG, line=G, lw=1.5,
            size=15, bold_first=True, text_color=BLACK,
            top_color=None, align=PP_ALIGN.CENTER):
    """Coloured box with text inside."""
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

def label(sl, text, color=G):
    """Small section label top-left."""
    txt(sl, text, 0.45, 0.18, 8, 0.3, size=9, bold=True, color=color)

def bar(sl, color=G, y=0.55, h=0.035):
    rect(sl, 0, y, 13.33, h, fill=color)

def title_txt(sl, text, color=BLACK, size=34, y=0.62):
    txt(sl, text, 0.45, y, 12.4, 1.3, size=size, bold=True, color=color)

def arrow_txt(sl, x, y, horiz=True):
    """Simple arrow character as text."""
    ch = '→' if horiz else '↓'
    txt(sl, ch, x, y, 0.4, 0.4, size=24, color=LGREY, align=PP_ALIGN.CENTER)

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 1 — TITLE
# ══════════════════════════════════════════════════════════════════════════════
s1 = slide()
bg(s1, G_DK)

# Large title
txt(s1, 'See One,  Do One,  Teach One',
    0.6, 1.4, 12.1, 1.6, size=44, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

# Green accent line
rect(s1, 3.5, 3.1, 6.3, 0.05, fill=G_LT)

# Subtitle
txt(s1, 'Practitioner Credentialing for Neighborhood Development Cooperatives',
    0.6, 3.3, 12.1, 0.8, size=22, color=G_LT, align=PP_ALIGN.CENTER)

# NDC label
txt(s1, 'ReLocalize Creativity Network  ·  2026',
    0.6, 6.6, 12.1, 0.5, size=13, color=RGBColor(0x7a, 0xb8, 0x9a),
    align=PP_ALIGN.CENTER)

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 2 — THE CHALLENGE
# ══════════════════════════════════════════════════════════════════════════════
s2 = slide()
bg(s2, WHITE)
label(s2, 'THE CHALLENGE', G)
bar(s2)
title_txt(s2, 'Skills and knowledge leave communities.')

problems = [
    '    Informal apprenticeship happens everywhere — but leaves no verifiable record.',
    '    Credentials come from distant institutions, not from the cooperatives doing the work.',
    '    Community economics don\'t fit conventional payment systems.',
    '    When experienced practitioners move on, what they knew goes with them.',
]
txlines(s2, problems,
        x=0.6, y=2.1, w=12.1, h=4.5,
        sizes=20, colors=BLACK, spacing=10)

# Bottom note
txt(s2, 'SODOTO addresses all three.', 0.6, 6.6, 12.1, 0.5,
    size=14, italic=True, color=G, align=PP_ALIGN.RIGHT)

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 3 — WHAT SODOTO IS
# ══════════════════════════════════════════════════════════════════════════════
s3 = slide()
bg(s3, WHITE)
label(s3, 'THE SOLUTION', G)
bar(s3)
title_txt(s3, 'What SODOTO Is')

txt(s3,
    'SODOTO is a credentialing system that documents how a practitioner '
    'learned a skill — who taught them, who witnessed their practice, '
    'and who they have since taught.',
    0.6, 1.9, 12.1, 1.6, size=22, color=BLACK)

txt(s3, 'The credential is issued by your NDC — not a university, not a corporation.',
    0.6, 3.5, 12.1, 0.7, size=18, italic=True, color=GREY)

# Three key words
for i, (word, x) in enumerate([('WITNESSED', 1.3), ('PRACTICED', 5.2), ('TAUGHT', 9.1)]):
    box_txt(s3, [word], x, 4.7, 2.6, 1.1,
            fill=[G_BG, B_BG, AM_LT][i],
            line=[G, B, AM][i], lw=2,
            size=18, bold_first=True,
            text_color=[G, B, AM][i],
            align=PP_ALIGN.CENTER)

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 4 — THE THREE GATES
# ══════════════════════════════════════════════════════════════════════════════
s4 = slide()
bg(s4, OFF)
label(s4, 'HOW IT WORKS', G)
bar(s4)
title_txt(s4, 'Three Gates — All Must Pass')

# Gate boxes
gates = [
    ('Gate 1', 'SEE ONE', ['Watch an expert do the skill', 'in a real working context.', '', 'Your mentor demonstrates.', 'You observe and attest.'], G_BG, G),
    ('Gate 2', 'DO ONE',  ['Do the skill yourself,', 'with your mentor watching.', '', 'Both of you attest.', 'You may try again if needed.'], B_BG, B),
    ('Gate 3', 'TEACH ONE', ['Teach someone new.', 'Your mentor watches the teaching.', '', 'Your student\'s practice session', 'is your evidence.'], AM_LT, AM),
]

for i, (gate_num, gate_name, lines, fill, lcolor) in enumerate(gates):
    gx = 0.5 + i * 4.15
    # Gate number label
    txt(s4, gate_num, gx + 0.1, 1.85, 3.7, 0.35, size=10, bold=True, color=lcolor)
    # Main box
    sh = rect(s4, gx, 2.2, 3.8, 4.4, fill=fill, line=lcolor, lw=2)
    tf = sh.text_frame
    tf.word_wrap = True
    tf.margin_left   = Inches(0.2)
    tf.margin_right  = Inches(0.2)
    tf.margin_top    = Inches(0.18)
    tf.margin_bottom = Inches(0.15)
    for j, line in enumerate(lines):
        p = tf.paragraphs[0] if j == 0 else tf.add_paragraph()
        p.alignment = PP_ALIGN.CENTER
        r = p.add_run()
        r.text = line
        r.font.size  = Pt(16 if j == 0 else 14)
        r.font.bold  = (j == 0)
        r.font.color.rgb = lcolor if j == 0 else BLACK
        r.font.name  = 'Calibri'
    # Arrow between gates
    if i < 2:
        txt(s4, '→', gx + 3.9, 3.9, 0.5, 0.6, size=28, color=LGREY, align=PP_ALIGN.CENTER)

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 5 — THE CREDENTIAL
# ══════════════════════════════════════════════════════════════════════════════
s5 = slide()
bg(s5, WHITE)
label(s5, 'WHAT YOU GET', G)
bar(s5)
title_txt(s5, 'A Verifiable Digital Badge')

# Left: description
desc = [
    'Each credential shows:',
    '',
    '  ·  The skill name and issuing NDC',
    '  ·  When each gate was completed',
    '  ·  Your mentor\'s name (clickable)',
    '  ·  The full attempt history',
    '  ·  A Verify button',
    '',
    'Anyone can click Verify.',
    'Confirmed instantly. No login required.',
]
txlines(s5, desc, x=0.5, y=1.9, w=5.8, h=5.0,
        sizes=[18,8,16,16,16,16,16,8,18,16],
        bolds=[True]+[False]*9,
        colors=[BLACK]+[BLACK]*9)

# Right: mock badge
rect(s5, 7.0, 1.7, 5.8, 5.1, fill=G_BG, line=G, lw=2)
# Badge header
rect(s5, 7.0, 1.7, 5.8, 0.75, fill=G)
txt(s5, 'ReLocalize Creativity Network', 7.1, 1.78, 5.6, 0.35,
    size=11, bold=True, color=WHITE)
txt(s5, 'Bellingham WA', 7.1, 2.1, 5.6, 0.3, size=10, color=G_LT)

txt(s5, 'Causal Loop Diagramming', 7.15, 2.65, 5.5, 0.55,
    size=17, bold=True, color=G)

badge_lines = [
    '✓  SEE ONE      Oct 15, 2025   Kerry Turner',
    '✓  DO ONE       Nov 20, 2025   Kerry Turner',
    '✓  TEACH ONE    Dec 10, 2025   Kerry Turner',
]
txlines(s5, badge_lines, x=7.15, y=3.25, w=5.5, h=1.4,
        sizes=12, colors=BLACK)

txt(s5, 'Issued by RCN · Dec 10, 2025', 7.15, 4.75, 5.5, 0.35,
    size=11, color=GREY)

# Verify button
rect(s5, 7.8, 5.3, 2.0, 0.55, fill=G, line=None)
txt(s5, '✓  Verify', 7.82, 5.38, 1.9, 0.4, size=14, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

txt(s5, 'Verified  ✓', 10.1, 5.38, 2.5, 0.4, size=14, color=G, bold=True)

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 6 — THE TEACHING CHAIN
# ══════════════════════════════════════════════════════════════════════════════
s6 = slide()
bg(s6, WHITE)
label(s6, 'HOW SKILLS SPREAD', G)
bar(s6)
title_txt(s6, 'Every Credential Records the Chain of Transmission')

# Kerry (founder)
oval(s6, 1.0, 2.0, 1.6, 1.6, fill=G)
txt(s6, 'Kerry', 1.05, 2.2, 1.5, 0.55, size=14, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
txt(s6, 'Turner', 1.05, 2.65, 1.5, 0.4, size=12, color=WHITE, align=PP_ALIGN.CENTER)
txt(s6, 'Founding mentor', 0.75, 3.7, 2.1, 0.4, size=10, italic=True, color=GREY, align=PP_ALIGN.CENTER)

txt(s6, '→', 2.65, 2.5, 0.7, 0.6, size=26, color=LGREY, align=PP_ALIGN.CENTER)

# Marc (learner → teacher)
oval(s6, 3.4, 2.0, 1.6, 1.6, fill=G)
txt(s6, 'Marc', 3.45, 2.2, 1.5, 0.55, size=14, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
txt(s6, 'Pierson', 3.45, 2.65, 1.5, 0.4, size=12, color=WHITE, align=PP_ALIGN.CENTER)
txt(s6, 'Credentialed · now teaches', 3.1, 3.7, 2.2, 0.4, size=10, italic=True, color=GREY, align=PP_ALIGN.CENTER)

txt(s6, '→', 5.0, 2.5, 0.7, 0.6, size=26, color=LGREY, align=PP_ALIGN.CENTER)

# Students row
students = ['Noah', 'Aisha', 'Carlos', 'Deb', 'Jerome']
for i, name in enumerate(students):
    sx = 5.8 + i * 1.45
    oval(s6, sx, 1.6, 1.2, 1.2, fill=B)
    txt(s6, name, sx + 0.03, 1.9, 1.15, 0.5, size=12, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

# Label for student group
txt(s6, 'Five students — each now on their own credentialing path',
    5.6, 3.1, 7.0, 0.5, size=13, italic=True, color=GREY, align=PP_ALIGN.CENTER)

# Bottom statement
rect(s6, 0.5, 4.1, 12.3, 1.0, fill=G_BG, line=G, lw=1.5)
txt(s6,
    'The skill doesn\'t just spread — the record of how it spread is permanently preserved in every credential.',
    0.7, 4.25, 11.9, 0.75, size=16, color=G, align=PP_ALIGN.CENTER)

txt(s6, 'Real example: Causal Loop Diagramming · RCN · Bellingham WA · 2025',
    0.5, 5.4, 12.3, 0.4, size=11, italic=True, color=LGREY, align=PP_ALIGN.CENTER)

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 7 — YOUR CREDENTIAL IS YOURS
# ══════════════════════════════════════════════════════════════════════════════
s7 = slide()
bg(s7, G_DK)

txt(s7, 'Your credential belongs to you.', 0.7, 0.8, 11.9, 1.0,
    size=36, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

rect(s7, 3.0, 1.9, 7.3, 0.04, fill=G_LT)

statements = [
    ('The key is yours, made on your own device —\nno one else ever holds it.', 1.0, 2.2),
    ('Your portfolio is your own site —\nnobody can edit your account of the work.', 1.0, 3.5),
    ('Anyone can verify it —\nno login, no server, no third party.', 1.0, 4.8),
]
for text, x, y in statements:
    txt(s7, text, x, y, 11.3, 1.1, size=24, color=G_LT, align=PP_ALIGN.CENTER)

txt(s7, 'No institution can revoke it.', 0.7, 6.4, 11.9, 0.6,
    size=16, italic=True, color=RGBColor(0x7a, 0xb8, 0x9a), align=PP_ALIGN.CENTER)

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 8 — SKILLS REGISTRY
# ══════════════════════════════════════════════════════════════════════════════
s8 = slide()
bg(s8, WHITE)
label(s8, 'SKILLS REGISTRY', G)
bar(s8)
title_txt(s8, '8 Active Credentials · 23+ Skills Planned')

issued = [
    'Causal Loop Diagramming',
    'e-VSM Basic',
    'e-VSM Intermediate',
    'e-VSM Site Manager',
    'EIP Basic',
    'EIP Intermediate',
    'EIP Expert',
    'Stock and Flow Diagramming',
]
planned = [
    'System Dynamics Modeling',
    'Viable Systems Model (VSM)',
    'Object Process Methodology',
    'Six Context Questions',
    'Vester Sensitivity Model',
    'A3 Problem Solving',
    'FedWiki',
    'Ganz Organizing Story Sequence',
    'Cynefin  · DSRP  · 15 Ps  · and more…',
]

# Issued column
rect(s8, 0.5, 1.85, 0.18, 0.18, fill=G)
txt(s8, 'Issued and verified', 0.75, 1.82, 5.5, 0.35, size=12, bold=True, color=G)
for i, sk in enumerate(issued):
    txt(s8, '✓  ' + sk, 0.55, 2.25 + i * 0.52, 5.6, 0.5, size=15, color=BLACK)

# Planned column
rect(s8, 7.0, 1.85, 0.18, 0.18, fill=LGREY)
txt(s8, 'Planned for the registry', 7.25, 1.82, 5.5, 0.35, size=12, bold=True, color=GREY)
for i, sk in enumerate(planned):
    txt(s8, '○  ' + sk, 7.05, 2.25 + i * 0.52, 5.9, 0.5, size=14, color=GREY)

# Divider
rect(s8, 6.55, 1.8, 0.03, 5.2, fill=RGBColor(0xe0, 0xe0, 0xda))

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 9 — BRIDGE: CREDENTIALS → CONTRACTS
# ══════════════════════════════════════════════════════════════════════════════
s9 = slide()
bg(s9, B)

txt(s9, '"A credential without an economy\nis just a piece of paper."',
    0.8, 1.0, 11.7, 2.2, size=34, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

rect(s9, 3.5, 3.4, 6.3, 0.05, fill=B_LT)

txt(s9,
    'SODOTO connects to a contract system designed for community economics — '
    'one that works in dollars, time, and gift.',
    0.8, 3.6, 11.7, 1.2, size=22, color=B_LT, align=PP_ALIGN.CENTER)

txt(s9, 'Conversations for Action · Dyadic Smart Contract',
    0.8, 6.5, 11.7, 0.55, size=14, italic=True,
    color=RGBColor(0x9e, 0xbb, 0xe8), align=PP_ALIGN.CENTER)

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 10 — THREE CURRENCIES
# ══════════════════════════════════════════════════════════════════════════════
s10 = slide()
bg(s10, WHITE)
label(s10, 'CfA-dSC  ·  FAIR CONTRACTS', B)
bar(s10, color=B)
title_txt(s10, 'Contracts Settled in Three Currencies', color=BLACK, size=30)

currencies = [
    ('DOLLARS', 'A minimum floor — always paid in cash. The fiat amount is agreed upfront and guaranteed regardless of how the rest settles.', 'CHW example:\n$50 floor on a $100 visit.', G_BG, G),
    ('TIME', 'Hours exchanged within the NDC time-dollar network at an agreed rate. Parties decide their own comfort level with time-dollar liquidity.', 'CHW example:\nUp to 1 hr @ $25/hr rate.', B_BG, B),
    ('GIFT', 'A voluntary contribution — unconditional or tied to an outcome. Can flow either direction: provider to client, or client to provider.', 'CHW example:\n$25 fee reduction, CHW → patient.', AM_LT, AM),
]

for i, (name, desc, example, fill, lcolor) in enumerate(currencies):
    cx = 0.4 + i * 4.28
    box_txt(s10, [name], cx, 2.0, 4.0, 0.65,
            fill=lcolor, line=None, size=16,
            bold_first=True, text_color=lcolor, align=PP_ALIGN.CENTER)
    rect(s10, cx, 2.65, 4.0, 3.1, fill=fill, line=lcolor, lw=1.5)
    tb = s10.shapes.add_textbox(Inches(cx+0.15), Inches(2.8), Inches(3.7), Inches(2.7))
    tf = tb.text_frame
    tf.word_wrap = True
    p1 = tf.paragraphs[0]
    r1 = p1.add_run()
    r1.text = desc
    r1.font.size = Pt(14)
    r1.font.color.rgb = BLACK
    r1.font.name = 'Calibri'
    p2 = tf.add_paragraph()
    p2.space_before = Pt(10)
    r2 = p2.add_run()
    r2.text = example
    r2.font.size = Pt(13)
    r2.font.italic = True
    r2.font.color.rgb = lcolor
    r2.font.name = 'Calibri'

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 11 — DAY IN THE LIFE
# ══════════════════════════════════════════════════════════════════════════════
s11 = slide()
bg(s11, WHITE)
label(s11, 'IN PRACTICE', GREY)
bar(s11, color=GREY)
title_txt(s11, 'A Day in the Life', color=BLACK, size=30)

txt(s11, 'Maria is a Community Health Worker in Superior AZ.',
    0.5, 1.85, 12.3, 0.5, size=16, italic=True, color=GREY)

steps = [
    (G,  '1',  'Maria earns her eVSM Site Manager credential.',
               'Three gates, witnessed by her mentor, signed by the Superior AZ NDC. The credential is on her FedWiki page.'),
    (B,  '2',  'The NDC contracts for Maria to run a neighborhood assessment.',
               'A fair contract — $400 total. $200 cash floor. Up to $100 in time-dollars. $100 gift to the community from the NDC.'),
    (AM, '3',  'Maria teaches her colleague Rosa.',
               'Rosa practices the skill. Rosa\'s practice session is the evidence. Maria\'s TeachOne credential is issued.'),
    (G,  '4',  'Rosa joins the network.',
               'Her credential path begins. The skill chain grows. The teaching relationship is recorded permanently.'),
]

for i, (color, num, heading, body) in enumerate(steps):
    ry = 2.55 + i * 1.15
    # Number circle
    oval(s11, 0.4, ry + 0.05, 0.55, 0.55, fill=color)
    txt(s11, num, 0.42, ry + 0.1, 0.52, 0.45, size=16, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    # Heading
    txt(s11, heading, 1.1, ry, 11.6, 0.45, size=15, bold=True, color=color)
    # Body
    txt(s11, body, 1.1, ry + 0.42, 11.6, 0.6, size=13, color=GREY)

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 12 — WHAT'S LIVE NOW
# ══════════════════════════════════════════════════════════════════════════════
s12 = slide()
bg(s12, WHITE)
label(s12, 'CURRENT STATE', G)
bar(s12)
title_txt(s12, 'What Exists Today')

live = [
    'Live on the public web over HTTPS — nothing runs on a personal machine',
    'Everyone holds their own key, made on their own device',
    'Everyone owns their own site — signed in by key, no password',
    'Browser-based issuance tool — gate recording, signing, FedWiki writes',
    'Verification works entirely in the browser — no server, no blockchain',
    '8 credentials issued and verified; 5 NDCs with signing identities',
]
in_progress = [
    'Onboarding made simple enough to do unaided',
    'Coordinatorless issuance — designed and tested, not yet switched on',
    'CfA-dSC contracts being connected to the credential system',
]

rect(s12, 0.4, 1.85, 7.8, 4.8, fill=G_BG, line=G, lw=1)
txt(s12, 'Working now', 0.55, 1.95, 5.0, 0.4, size=11, bold=True, color=G)
for i, item in enumerate(live):
    txt(s12, '✓  ' + item, 0.55, 2.45 + i * 0.57, 7.5, 0.52, size=13, color=BLACK)

rect(s12, 8.5, 1.85, 4.4, 4.8, fill=AM_LT, line=AM, lw=1)
txt(s12, 'In progress', 8.65, 1.95, 4.0, 0.4, size=11, bold=True, color=AM)
for i, item in enumerate(in_progress):
    txt(s12, '→  ' + item, 8.65, 2.45 + i * 1.1, 4.1, 1.0, size=13, color=BLACK)

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 13 — WHAT YOUR NDC GETS
# ══════════════════════════════════════════════════════════════════════════════
s13 = slide()
bg(s13, G_BG)
label(s13, 'FOR YOUR NDC', G)
bar(s13)
title_txt(s13, 'What Joining Gives Your Community')

benefits = [
    ('A skills registry', 'specific to your NDC — built from the shared RCN registry and extended with your community\'s skills.'),
    ('Portable credentials', 'for your practitioners that travel with them and mean something beyond your own organization.'),
    ('A fair contract system', 'that recognizes dollars, time-dollars, and gift — not just cash.'),
    ('A teaching chain', 'that grows with every credential issued. Knowledge doesn\'t leave when people do.'),
    ('Connection to the RCN network', 'of NDCs — credential holders recognized across the network, skills shared between communities.'),
]

for i, (bold_part, rest) in enumerate(benefits):
    ry = 1.9 + i * 1.02
    oval(s13, 0.45, ry + 0.1, 0.4, 0.4, fill=G)
    txt(s13, str(i+1), 0.47, ry + 0.13, 0.38, 0.35, size=12, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    tb = s13.shapes.add_textbox(Inches(1.05), Inches(ry), Inches(11.8), Inches(0.9))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    r1 = p.add_run()
    r1.text = bold_part + '  '
    r1.font.size = Pt(17)
    r1.font.bold = True
    r1.font.color.rgb = G
    r1.font.name = 'Calibri'
    r2 = p.add_run()
    r2.text = rest
    r2.font.size = Pt(16)
    r2.font.color.rgb = BLACK
    r2.font.name = 'Calibri'

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 14 — WHAT JOINING LOOKS LIKE
# ══════════════════════════════════════════════════════════════════════════════
s14 = slide()
bg(s14, WHITE)
label(s14, 'JOINING THE PILOT', G)
bar(s14)
title_txt(s14, 'Three Steps to Your First Credential')

joining_steps = [
    (G, 'One coordinator.',
     'Your NDC designates one coordinator — the person who will learn the issuance process. '
     'We set up your NDC\'s signing identity together. One session, one hour.'),
    (B, 'Two willing practitioners.',
     'Identify two practitioners to go through the gates for one skill. '
     'We guide you through the first three credentials. The process itself is the work — no extra paperwork.'),
    (AM, 'One skill to start with.',
     'Choose one skill from the shared registry or propose one specific to your NDC. '
     'We issue your first credential together, live.'),
]

for i, (color, heading, body) in enumerate(joining_steps):
    ry = 2.0 + i * 1.6
    rect(s14, 0.4, ry, 12.5, 1.4, fill={G:G_BG, B:B_BG, AM:AM_LT}[color], line=color, lw=2)
    txt(s14, heading, 0.7, ry + 0.15, 11.9, 0.55, size=18, bold=True, color=color)
    txt(s14, body, 0.7, ry + 0.65, 11.9, 0.65, size=14, color=BLACK)

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 15 — THE ASK
# ══════════════════════════════════════════════════════════════════════════════
s15 = slide()
bg(s15, G_DK)

txt(s15, 'Join the pilot.', 0.7, 1.2, 11.9, 1.4,
    size=48, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

rect(s15, 3.5, 2.8, 6.3, 0.05, fill=G_LT)

txt(s15,
    'One coordinator.  Two practitioners.  One skill.\n'
    'Your NDC in the registry. Your first credential issued.',
    0.7, 3.1, 11.9, 1.4, size=22, color=G_LT, align=PP_ALIGN.CENTER)

# Contact
txt(s15, 'Marc Pierson  ·  ReLocalize Creativity Network',
    0.7, 5.2, 11.9, 0.55, size=16, color=G_LT, align=PP_ALIGN.CENTER)
txt(s15, 'relocalizecreativity.net',
    0.7, 5.75, 11.9, 0.5, size=14,
    color=RGBColor(0x7a, 0xb8, 0x9a), align=PP_ALIGN.CENTER)

txt(s15, 'ReLocalize Creativity Network · Bellingham WA · 2026',
    0.7, 6.8, 11.9, 0.4, size=11,
    color=RGBColor(0x5a, 0x8a, 0x6a), align=PP_ALIGN.CENTER)

# ── Save ──────────────────────────────────────────────────────────────────────
out = '/Users/marcpierson/rcn/docs/sodoto-pitch.pptx'
prs.save(out)
print(f'Saved {prs.slides.__len__()} slides → {out}')
