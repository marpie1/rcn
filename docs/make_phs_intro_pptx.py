"""
Generate my-phs-intro.pptx — Intro deck for the My Personal Health Supporter tool suite.
Audience: cooperative organizers, health system partners, funders, health partners.
Tone: clear, grounded, direct — not sales-y.

Requires: pip install python-pptx
Run:      python3 docs/make_phs_intro_pptx.py
Output:   docs/my-phs-intro.pptx
"""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
import os

OUT     = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'my-phs-intro.pptx')
SCREENS = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'screenshots')
VIDEOS  = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'videos')

# ── Palette ──────────────────────────────────────────────────────────────────
NAVY      = RGBColor(0x1e, 0x3a, 0x5f)
NAVY_LT   = RGBColor(0x2a, 0x4f, 0x7c)
TEAL      = RGBColor(0x0f, 0x76, 0x6e)
TEAL_LT   = RGBColor(0xf0, 0xfd, 0xfa)
TEAL_BD   = RGBColor(0x99, 0xf6, 0xe4)
BLUE_LT   = RGBColor(0xef, 0xf6, 0xff)
BLUE_BD   = RGBColor(0x93, 0xc5, 0xfd)
GREEN_LT  = RGBColor(0xf0, 0xfd, 0xf4)
GREEN_BD  = RGBColor(0x86, 0xef, 0xac)
GREEN_BOX = RGBColor(0xdc, 0xfc, 0xe7)
GREEN_BR  = RGBColor(0x22, 0xc5, 0x5e)
GREEN_DK  = RGBColor(0x16, 0x65, 0x34)
PURPLE_LT = RGBColor(0xfa, 0xf5, 0xff)
PURPLE_BD = RGBColor(0xc4, 0xb5, 0xfd)
AMBER_LT  = RGBColor(0xff, 0xfb, 0xeb)
AMBER_BD  = RGBColor(0xfc, 0xd3, 0x4d)
AMBER_DK  = RGBColor(0x92, 0x40, 0x07)
RED_LT    = RGBColor(0xff, 0xf1, 0xf2)
RED_DK    = RGBColor(0x9b, 0x1c, 0x1c)
WHITE     = RGBColor(0xff, 0xff, 0xff)
BLACK     = RGBColor(0x1a, 0x1a, 0x1a)
GREY_BG   = RGBColor(0xf8, 0xf9, 0xfa)
SURFACE   = RGBColor(0xff, 0xff, 0xff)
TEXT_MED  = RGBColor(0x33, 0x33, 0x33)
TEXT_MUTED= RGBColor(0x55, 0x55, 0x55)
TEXT_GREY = RGBColor(0x88, 0x88, 0x88)
BORDER    = RGBColor(0xdd, 0xe3, 0xed)

W = Inches(13.33)
H = Inches(7.5)

prs = Presentation()
prs.slide_width  = W
prs.slide_height = H
BLANK = prs.slide_layouts[6]

# ── Primitives ────────────────────────────────────────────────────────────────
def slide():
    return prs.slides.add_slide(BLANK)

def bg(sl, color):
    f = sl.background.fill
    f.solid()
    f.fore_color.rgb = color

def rect(sl, x, y, w, h, fill):
    shp = sl.shapes.add_shape(1, x, y, w, h)
    shp.fill.solid()
    shp.fill.fore_color.rgb = fill
    shp.line.fill.background()
    return shp

def txt(sl, text, x, y, w, h, size=16, bold=False, color=RGBColor(0x1a, 0x1a, 0x1a),
        align=PP_ALIGN.LEFT, italic=False, wrap=True):
    tb = sl.shapes.add_textbox(x, y, w, h)
    tf = tb.text_frame
    tf.word_wrap = wrap
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = color
    return tb

def footer(sl, note='My Personal Health Supporter · RCN · Open Source CC 4.0 · 2026'):
    txt(sl, note, Inches(0.6), Inches(7.1), Inches(12), Inches(0.3),
        size=9, color=TEXT_GREY)

def card(sl, x, y, w, h, fill, border):
    shp = sl.shapes.add_shape(1, x, y, w, h)
    shp.fill.solid()
    shp.fill.fore_color.rgb = fill
    shp.line.color.rgb = border
    shp.line.width = Pt(1.5)
    return shp

def bullet_list(sl, items, x, y, w, size=12, color=BLACK, gap=4):
    tb = sl.shapes.add_textbox(x, y, w, Inches(5))
    tf = tb.text_frame
    tf.word_wrap = True
    for i, item in enumerate(items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.space_before = Pt(gap)
        run = p.add_run()
        run.text = '\u2022  ' + item
        run.font.size = Pt(size)
        run.font.color.rgb = color

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 1 — Cover
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, NAVY)

# Accent bar
rect(sl, 0, Inches(2.1), W, Inches(3.0), RGBColor(0x16, 0x2d, 0x50))

# Eyebrow
txt(sl, 'My Personal Health Supporter  \u00b7  RCN  \u00b7  Open Source CC 4.0',
    Inches(0.7), Inches(1.5), Inches(11.9), Inches(0.4),
    size=11, color=TEXT_GREY, align=PP_ALIGN.CENTER)

# Title
txt(sl, 'My Personal\nHealth Supporter',
    Inches(0.7), Inches(2.2), Inches(11.9), Inches(1.6),
    size=52, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

# Subtitle
txt(sl, 'Five open-source tools for neighborhood health \u2014 giving people and communities\n'
        'everything they need to do what they were always already doing, and to do it far better.',
    Inches(1.2), Inches(3.85), Inches(10.9), Inches(0.9),
    size=16, color=RGBColor(0xb0, 0xc8, 0xe8), align=PP_ALIGN.CENTER)

# Tagline
txt(sl, 'Whatcom Wealth and Health  \u00b7  2026',
    Inches(0.7), Inches(6.85), Inches(11.9), Inches(0.35),
    size=11, color=TEXT_GREY, align=PP_ALIGN.CENTER)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 2 — The Premise
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, NAVY)

# Decorative rule
rect(sl, Inches(3.5), Inches(1.5), Inches(6.33), Pt(2), RGBColor(0x4a, 0x7a, 0xb0))

# Big quote
txt(sl, '\u201cMost of the choices and actions that create and preserve individual health occur in the home.\u201d',
    Inches(1.5), Inches(1.7), Inches(10.33), Inches(1.5),
    size=24, italic=True, color=WHITE, align=PP_ALIGN.CENTER)

rect(sl, Inches(3.5), Inches(3.3), Inches(6.33), Pt(2), RGBColor(0x4a, 0x7a, 0xb0))

txt(sl, 'This is not a new idea. It is the idea we have never fully organized around.',
    Inches(1.5), Inches(3.5), Inches(10.33), Inches(0.55),
    size=16, color=RGBColor(0xb0, 0xc8, 0xe8), align=PP_ALIGN.CENTER)

txt(sl, 'Neighborhoods are the true health system. The medical system responds to illness.\n'
        'It does not produce health. These tools do.',
    Inches(1.5), Inches(4.2), Inches(10.33), Inches(0.9),
    size=16, color=RGBColor(0x93, 0xc5, 0xfd), align=PP_ALIGN.CENTER)

footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 3 — Five Tools at a Glance
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, SURFACE)

# Label
txt(sl, 'THE SUITE', Inches(0.6), Inches(0.35), Inches(4), Inches(0.3),
    size=9, bold=True, color=TEXT_GREY)

# H2
txt(sl, 'Five tools. One complete system.',
    Inches(0.6), Inches(0.65), Inches(12), Inches(0.55),
    size=26, bold=True, color=NAVY)

# Five tool cards
tools = [
    ('MY SHARED\nCARE PLAN', 'Person-owned clinical record. No institution holds it.',
     PURPLE_LT, PURPLE_BD, RGBColor(0x6d, 0x28, 0xd9)),
    ('MY HEALTH\nPICTURE', 'The active problem view. Every problem at its level of certainty.',
     BLUE_LT, BLUE_BD, NAVY),
    ('PANAS\nPA-10', 'Positive affect score. Shapes which problems to surface today.',
     AMBER_LT, AMBER_BD, AMBER_DK),
    ('MY HEALTH\nCHOICES', 'AI-assisted option exploration. The evidence, in plain language.',
     TEAL_LT, TEAL_BD, TEAL),
    ('MY SUPPORT\nNETWORK', '27-role completeness view. Makes absence as visible as presence.',
     GREEN_LT, GREEN_BD, GREEN_DK),
]

card_w = Inches(2.32)
card_h = Inches(4.8)
gap    = Inches(0.17)
x0     = Inches(0.57)
cy     = Inches(1.4)

for i, (name, desc, fill, border, accent) in enumerate(tools):
    cx = x0 + i * (card_w + gap)
    card(sl, cx, cy, card_w, card_h, fill, border)
    # Accent top bar
    rect(sl, cx, cy, card_w, Inches(0.06), accent)
    # Tool label (mono style, small, colored)
    txt(sl, name,
        cx + Inches(0.15), cy + Inches(0.18), card_w - Inches(0.3), Inches(0.7),
        size=11, bold=True, color=accent)
    # Description
    txt(sl, desc,
        cx + Inches(0.15), cy + Inches(0.95), card_w - Inches(0.3), Inches(3.5),
        size=10, color=TEXT_MED)

# SODOTO note
txt(sl, 'SODOTO: skill credentialing for health partners \u2014 covered on slide 8',
    Inches(0.6), Inches(6.38), Inches(12), Inches(0.3),
    size=9, italic=True, color=TEXT_GREY)

footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 4 — My Shared Care Plan
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, GREY_BG)

# Label
txt(sl, 'TOOL 1  \u00b7  MY SHARED CARE PLAN',
    Inches(0.6), Inches(0.3), Inches(12), Inches(0.3),
    size=9, bold=True, color=TEXT_GREY)

# H2
txt(sl, 'One record. Person-owned.\nNo institution holds it.',
    Inches(0.6), Inches(0.6), Inches(7), Inches(0.95),
    size=26, bold=True, color=NAVY)

# Left column body
txt(sl, 'Every health record before this one was owned by a clinic or hospital. My Shared Care Plan '
        'is different at its foundation: a federated, decentralized record held by the person \u2014 '
        'readable by everyone they choose to include.',
    Inches(0.6), Inches(1.68), Inches(5.5), Inches(1.1),
    size=12, color=TEXT_MED)

bullet_list(sl, [
    '12 typed record sections: diagnoses, medications, vitals, visits, care team, directives, '
    'history, lab results, reactions, next steps, access log, about me',
    'Commit+fold pattern \u2014 every entry is dated and versioned',
    'Runs on FedWiki \u2014 decentralized, person-controlled',
    'Every entry searchable; item.text indexed automatically',
], Inches(0.6), Inches(2.88), Inches(5.5), size=11, color=BLACK)

# Right column — SCP screenshot (FedWiki medications page, live data)
sx = Inches(6.75)
sy = Inches(0.52)
sw = Inches(6.2)
sh = sw * (800 / 1280)
rect(sl, sx - Inches(0.04), sy - Inches(0.04), sw + Inches(0.08), sh + Inches(0.08), BORDER)
sl.shapes.add_picture(os.path.join(SCREENS, 'my-shared-care-plan.png'), sx, sy, sw, sh)

txt(sl, 'My Shared Care Plan · FedWiki · Medications plugin · live data',
    sx, sy + sh + Inches(0.1), sw, Inches(0.28),
    size=8, italic=True, color=TEXT_GREY, align=PP_ALIGN.CENTER)

# Two small concept cards below caption
cy2 = sy + sh + Inches(0.5)
hw = (sw - Inches(0.15)) / 2
card(sl, sx, cy2, hw, Inches(1.52), TEAL_LT, TEAL_BD)
txt(sl, 'Interfaced \u2014 not owned', sx + Inches(0.12), cy2 + Inches(0.1),
    hw - Inches(0.24), Inches(0.3), size=11, bold=True, color=TEAL)
txt(sl, 'Physician receives exactly what they need \u2014 and nothing more.',
    sx + Inches(0.12), cy2 + Inches(0.44), hw - Inches(0.24), Inches(0.95),
    size=10, color=TEXT_MED)

card(sl, sx + hw + Inches(0.15), cy2, hw, Inches(1.52), PURPLE_LT, PURPLE_BD)
txt(sl, 'Person-owned \u2014 always', sx + hw + Inches(0.27), cy2 + Inches(0.1),
    hw - Inches(0.24), Inches(0.3), size=11, bold=True, color=RGBColor(0x6d, 0x28, 0xd9))
txt(sl, 'No institution holds it. Follows the person into every relationship.',
    sx + hw + Inches(0.27), cy2 + Inches(0.44), hw - Inches(0.24), Inches(0.95),
    size=10, color=TEXT_MED)

footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 5 — My Health Picture
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, SURFACE)

txt(sl, 'TOOL 2  \u00b7  MY HEALTH PICTURE',
    Inches(0.6), Inches(0.3), Inches(12), Inches(0.3),
    size=9, bold=True, color=TEXT_GREY)

txt(sl, 'The active problem view.\nEvery problem at its level of certainty.',
    Inches(0.6), Inches(0.6), Inches(12), Inches(0.95),
    size=26, bold=True, color=NAVY)

# ── Left half: three flag cards ───────────────────────────────────────────────
flag_data = [
    ('CERTAINTY', 'Confirmed · Probable · Possible\nUnconfirmed · Not Pursuing',
     'Every diagnosis is a probability, not a conclusion.', BLUE_LT, BLUE_BD, NAVY),
    ('URGENCY', '1 Act Now · 2 Move Fast · 3 Work On It\n4 Watch It · 5 Routine',
     'Computed from probability × danger. Not assigned by AI.', AMBER_LT, AMBER_BD, AMBER_DK),
    ('NEXT BEST QUESTION', 'Most important missing evidence for this problem',
     'Surfaced automatically — tells the health partner what to gather next.', TEAL_LT, TEAL_BD, TEAL),
]

fw   = Inches(1.85)
fy   = Inches(1.55)
fx0  = Inches(0.57)
fgap = Inches(0.20)
fh   = Inches(3.6)

for i, (label, body, note, fill, border, accent) in enumerate(flag_data):
    fx = fx0 + i * (fw + fgap)
    card(sl, fx, fy, fw, fh, fill, border)
    rect(sl, fx, fy, fw, Inches(0.055), accent)
    txt(sl, label, fx + Inches(0.1), fy + Inches(0.12), fw - Inches(0.2), Inches(0.3),
        size=8, bold=True, color=accent)
    txt(sl, body, fx + Inches(0.1), fy + Inches(0.46), fw - Inches(0.2), Inches(0.75),
        size=10, bold=True, color=BLACK)
    txt(sl, note, fx + Inches(0.1), fy + Inches(1.28), fw - Inches(0.2), Inches(2.1),
        size=9, color=TEXT_MUTED, italic=True)

# ── Right half: embedded video (plays on click in PowerPoint) ─────────────────
# add_movie() works like add_picture() but embeds a video file.
# poster_frame_image = the screenshot shown before the presenter clicks play.
# mime_type must match the container — 'video/mp4' for .mp4 files.
sx = Inches(6.85)
sy = Inches(1.45)
sw = Inches(6.1)
sh = sw * (800 / 1280)
rect(sl, sx - Inches(0.04), sy - Inches(0.04), sw + Inches(0.08), sh + Inches(0.08), BORDER)
sl.shapes.add_movie(
    os.path.join(VIDEOS, 'my-health-picture.mp4'),
    sx, sy, sw, sh,
    poster_frame_image=os.path.join(SCREENS, 'my-health-picture.png'),
    mime_type='video/mp4',
)

# ── Full-width physician package box ──────────────────────────────────────────
card(sl, Inches(0.57), Inches(5.42), Inches(12.19), Inches(0.88), BLUE_LT, BLUE_BD)
txt(sl, 'When escalating: health partner sends problem + certainty level + evidence gathered + '
        'one clear question. The physician\u2019s response goes into the Shared Care Plan — '
        'written, dated, permanent.',
    Inches(0.78), Inches(5.58), Inches(11.78), Inches(0.6),
    size=11, color=NAVY, italic=True)

footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 6 — PANAS PA-10
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, GREY_BG)

txt(sl, 'BUILT INTO MY HEALTH PICTURE  \u00b7  PANAS PA-10',
    Inches(0.6), Inches(0.3), Inches(12), Inches(0.3),
    size=9, bold=True, color=TEXT_GREY)

txt(sl, 'Positive affect score.\nShapes which problems to focus on today.',
    Inches(0.6), Inches(0.6), Inches(7), Inches(0.95),
    size=26, bold=True, color=NAVY)

# Left body
txt(sl, 'At each visit the person rates 10 positive-affect words on a 1\u20135 scale for the past week. '
        'The total score maps to one of four activation bands \u2014 which determines how much of the '
        'problem list to surface.',
    Inches(0.6), Inches(1.72), Inches(5.9), Inches(1.0),
    size=12, color=TEXT_MED)

# 2×5 grid of PA words
words = ['active', 'alert', 'attentive', 'determined', 'enthusiastic',
         'excited', 'inspired', 'interested', 'proud', 'strong']
wbox_w = Inches(1.15)
wbox_h = Inches(0.34)
wgap_x = Inches(0.1)
wgap_y = Inches(0.08)
wx0    = Inches(0.6)
wy0    = Inches(2.88)

for i, word in enumerate(words):
    col = i % 5
    row = i // 5
    wx = wx0 + col * (wbox_w + wgap_x)
    wy = wy0 + row * (wbox_h + wgap_y)
    rect(sl, wx, wy, wbox_w, wbox_h, NAVY)
    txt(sl, word, wx, wy, wbox_w, wbox_h,
        size=9, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

# Right — four band cards
bands = [
    ('10\u201324', 'Learning the basics', 'Urgent problems only', RED_LT, RED_DK),
    ('25\u201331', 'Building awareness', 'Urgent + important problems', AMBER_LT, AMBER_DK),
    ('32\u201338', 'Taking action', 'Full problem list', GREEN_LT, GREEN_DK),
    ('39\u201350', 'Staying the course', 'Full list + deeper exploration', BLUE_LT, NAVY),
]

bw = Inches(6.3)
bh = Inches(0.82)
bx = Inches(6.6)
by0 = Inches(1.65)
bgap = Inches(0.1)

for i, (score, label, desc, fill, text_color) in enumerate(bands):
    by = by0 + i * (bh + bgap)
    card(sl, bx, by, bw, bh, fill, BORDER)
    txt(sl, score, bx + Inches(0.15), by + Inches(0.1), Inches(0.9), bh - Inches(0.1),
        size=14, bold=True, color=text_color)
    txt(sl, label, bx + Inches(1.1), by + Inches(0.1), Inches(2.5), Inches(0.38),
        size=12, bold=True, color=text_color)
    txt(sl, desc, bx + Inches(1.1), by + Inches(0.46), Inches(5.0), Inches(0.3),
        size=10, color=TEXT_MUTED)

# Note
txt(sl, '\u2018Show full frame\u2019 always overrides. The record is never withheld from the person.',
    Inches(0.6), Inches(6.35), Inches(12.13), Inches(0.35),
    size=10, italic=True, color=TEXT_MUTED)

footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 7 — My Health Choices
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, SURFACE)

txt(sl, 'TOOL 3  \u00b7  MY HEALTH CHOICES',
    Inches(0.6), Inches(0.3), Inches(12), Inches(0.3),
    size=9, bold=True, color=TEXT_GREY)

txt(sl, 'AI-assisted exploration.\nThe evidence, in plain language.',
    Inches(0.6), Inches(0.6), Inches(7), Inches(0.95),
    size=26, bold=True, color=NAVY)

# Left column
txt(sl, 'Opens pre-loaded with the person\u2019s full clinical record and focuses on a specific problem '
        'from My Health Picture. The health partner and person ask questions together in plain language. '
        'The AI responds from the medical literature.',
    Inches(0.6), Inches(1.68), Inches(5.8), Inches(1.0),
    size=12, color=TEXT_MED)

bullet_list(sl, [
    'Opens from \u201cExplore choices\u201d button in My Health Picture',
    'Full SCP context pre-loaded automatically',
    'Suggestion chips after each AI response',
    '\u201cDocument this choice\u201d writes back to the Shared Care Plan',
    'Three built fact boxes: AF anticoagulation, statin primary prevention, hypertension',
], Inches(0.6), Inches(2.82), Inches(5.8), size=11, color=BLACK)

# ── Right: embedded video (AF fact box with dot display) ─────────────────────
sx = Inches(6.95)
sy = Inches(1.42)
sw = Inches(6.0)
sh = sw * (800 / 1280)
rect(sl, sx - Inches(0.04), sy - Inches(0.04), sw + Inches(0.08), sh + Inches(0.08), BORDER)
sl.shapes.add_movie(
    os.path.join(VIDEOS, 'my-health-choices.mp4'),
    sx, sy, sw, sh,
    poster_frame_image=os.path.join(SCREENS, 'my-health-choices.png'),
    mime_type='video/mp4',
)

txt(sl, 'My Health Choices · Atrial fibrillation anticoagulation fact box with Option Box dot display',
    sx, sy + sh + Inches(0.1), sw, Inches(0.3),
    size=8, italic=True, color=TEXT_GREY, align=PP_ALIGN.CENTER)

footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 8 — My Support Network + SODOTO
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, GREY_BG)

# Left: My Support Network
txt(sl, 'TOOL 4  \u00b7  MY SUPPORT NETWORK',
    Inches(0.6), Inches(0.3), Inches(6.3), Inches(0.3),
    size=9, bold=True, color=TEXT_GREY)

txt(sl, '27-role completeness view',
    Inches(0.6), Inches(0.62), Inches(6.3), Inches(0.5),
    size=20, bold=True, color=NAVY)

txt(sl, 'Shows the person\u2019s care team against a maximal list of 27 roles across 5 categories: '
        'Medical, Therapy & Rehab, Community & Navigation, Informal Support, Practical Support. '
        'Empty roles appear as ghost nodes \u2014 absence is as visible as presence.',
    Inches(0.6), Inches(1.22), Inches(6.1), Inches(1.1),
    size=11, color=TEXT_MED)

card(sl, Inches(0.6), Inches(2.42), Inches(6.1), Inches(0.68), GREEN_LT, GREEN_BD)
txt(sl, 'Many health problems are support problems, not clinical problems. '
        'My Support Network makes this visible.',
    Inches(0.8), Inches(2.54), Inches(5.7), Inches(0.48),
    size=11, italic=True, color=GREEN_DK)

# Support Network screenshot
sx1 = Inches(0.6)
sy1 = Inches(3.28)
sw1 = Inches(5.9)
sh1 = sw1 * (800 / 1280)
rect(sl, sx1 - Inches(0.03), sy1 - Inches(0.03), sw1 + Inches(0.06), sh1 + Inches(0.06), BORDER)
sl.shapes.add_picture(os.path.join(SCREENS, 'my-support-network.png'), sx1, sy1, sw1, sh1)

# Divider
rect(sl, Inches(6.9), Inches(0.25), Pt(1.5), Inches(7.0), BORDER)

# Right: SODOTO
txt(sl, 'TOOL 5  \u00b7  SODOTO',
    Inches(7.1), Inches(0.3), Inches(6.0), Inches(0.3),
    size=9, bold=True, color=TEXT_GREY)

txt(sl, 'See One, Do One, Teach One',
    Inches(7.1), Inches(0.62), Inches(6.0), Inches(0.5),
    size=20, bold=True, color=NAVY)

txt(sl, 'Portable digital skill credentials for health partners. Every skill demonstrated earns a '
        'credential. Every skill taught earns a higher credential and a higher pay tier. '
        'The network teaches itself.',
    Inches(7.1), Inches(1.22), Inches(5.9), Inches(0.95),
    size=11, color=TEXT_MED)

# Three credential tier rows (condensed)
tiers = [
    (RGBColor(0xef, 0xf6, 0xff), NAVY, 'Observer', 'Witnessed the skill. Foundation credential.'),
    (TEAL_LT, TEAL, 'Practitioner', 'Performed independently. Standard pay tier.'),
    (GREEN_LT, GREEN_DK, 'Teacher', 'Taught a peer. Highest pay tier.'),
]
for i, (fill, accent, tier, desc) in enumerate(tiers):
    ty = Inches(2.28) + i * Inches(0.62)
    card(sl, Inches(7.1), ty, Inches(5.9), Inches(0.55), fill, BORDER)
    rect(sl, Inches(7.1), ty, Inches(0.07), Inches(0.55), accent)
    txt(sl, tier, Inches(7.26), ty + Inches(0.06), Inches(1.4), Inches(0.28),
        size=11, bold=True, color=accent)
    txt(sl, desc, Inches(8.75), ty + Inches(0.06), Inches(4.1), Inches(0.42),
        size=9, color=TEXT_MUTED)

# SODOTO screenshot
sx2 = Inches(7.1)
sy2 = Inches(4.18)
sw2 = Inches(5.9)
sh2 = sw2 * (800 / 1280)
rect(sl, sx2 - Inches(0.03), sy2 - Inches(0.03), sw2 + Inches(0.06), sh2 + Inches(0.06), BORDER)
sl.shapes.add_picture(os.path.join(SCREENS, 'sodoto-issuer.png'), sx2, sy2, sw2, sh2)

footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 9 — How They Connect
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, NAVY)

txt(sl, 'THE SYSTEM', Inches(0.6), Inches(0.35), Inches(12), Inches(0.3),
    size=9, bold=True, color=TEXT_GREY, align=PP_ALIGN.CENTER)

txt(sl, 'Five tools. One care relationship.',
    Inches(0.6), Inches(0.62), Inches(12.13), Inches(0.55),
    size=28, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

# Flow row
flow = [
    ('My Shared\nCare Plan', 'clinical record', PURPLE_BD, RGBColor(0x6d, 0x28, 0xd9)),
    ('My Health\nPicture', 'active problems', BLUE_BD, NAVY_LT),
    ('PANAS\nScore', 'shapes the view', AMBER_BD, AMBER_DK),
    ('My Health\nChoices', 'explore options', TEAL_BD, TEAL),
    ('My Support\nNetwork', 'who is around them', GREEN_BD, GREEN_DK),
]

fw = Inches(2.15)
fh = Inches(1.42)
fy = Inches(1.42)
fgap = Inches(0.16)
total_w = 5 * fw + 4 * fgap
fx_start = (Inches(13.33) - total_w) / 2

for i, (name, sub, border_c, fill_c) in enumerate(flow):
    fx = fx_start + i * (fw + fgap)
    card(sl, fx, fy, fw, fh, RGBColor(0x2a, 0x4f, 0x7c), border_c)
    txt(sl, name, fx + Inches(0.1), fy + Inches(0.12), fw - Inches(0.2), Inches(0.75),
        size=11, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    txt(sl, sub, fx + Inches(0.1), fy + Inches(0.92), fw - Inches(0.2), Inches(0.38),
        size=9, color=border_c, align=PP_ALIGN.CENTER)
    # Arrow between boxes
    if i < 4:
        ax = fx + fw + Inches(0.02)
        txt(sl, '\u2192', ax, fy + Inches(0.48), fgap - Inches(0.04), Inches(0.4),
            size=14, color=TEXT_GREY, align=PP_ALIGN.CENTER)

# Two columns of data flow bullets
col_y = Inches(3.12)
col_h = Inches(1.8)

# Left
rect(sl, Inches(0.8), col_y, Inches(5.7), col_h, NAVY_LT)
txt(sl, 'Data flows in:', Inches(1.0), col_y + Inches(0.1), Inches(5.3), Inches(0.32),
    size=11, bold=True, color=WHITE)
txt(sl, 'SCP \u2192 Health Picture\nPANAS score stored in SCP\nSupport Network reads SCP care team',
    Inches(1.0), col_y + Inches(0.42), Inches(5.3), col_h - Inches(0.42),
    size=11, color=RGBColor(0xb0, 0xc8, 0xe8))

# Right
rect(sl, Inches(6.83), col_y, Inches(5.7), col_h, NAVY_LT)
txt(sl, 'Data flows out:', Inches(7.03), col_y + Inches(0.1), Inches(5.3), Inches(0.32),
    size=11, bold=True, color=WHITE)
txt(sl, 'Health Choices writes shared-decision records \u2192 SCP\nPhysician response \u2192 SCP Plan\nSODOTO credentials: independent, portable',
    Inches(7.03), col_y + Inches(0.42), Inches(5.3), col_h - Inches(0.42),
    size=11, color=RGBColor(0xb0, 0xc8, 0xe8))

# Bottom dispatch box
rect(sl, Inches(0.8), Inches(5.1), Inches(11.73), Inches(1.15), RGBColor(0x16, 0x2d, 0x50))
txt(sl, 'The Shared Care Plan is the source of truth. Every tool draws from it. '
        'Every decision writes back to it. The record grows more complete with every visit.',
    Inches(1.05), Inches(5.25), Inches(11.23), Inches(0.85),
    size=12, italic=True, color=RGBColor(0xb0, 0xc8, 0xe8), align=PP_ALIGN.CENTER)

footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 10 — The Health Partner
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, SURFACE)

txt(sl, 'THE ROLE', Inches(0.6), Inches(0.3), Inches(12), Inches(0.3),
    size=9, bold=True, color=TEXT_GREY)

txt(sl, 'A neighborhood figure\nwith real tools.',
    Inches(0.6), Inches(0.6), Inches(6.5), Inches(0.95),
    size=26, bold=True, color=NAVY)

# Left: body text
txt(sl, 'The health partner is not a healthcare extender. They are a neighborhood figure \u2014 '
        'someone who knows the person, knows the street, and carries the full structured record '
        'into every encounter.',
    Inches(0.6), Inches(1.68), Inches(6.1), Inches(1.0),
    size=12, color=TEXT_MED)

txt(sl, 'The Southcentral Foundation proved what this looks like at scale: community health aides '
        'at the center of an Alaska Native-owned system. \u221236% ED visits. \u221240% specialist '
        'visits. Sustained over decades.',
    Inches(0.6), Inches(2.82), Inches(6.1), Inches(1.0),
    size=12, color=TEXT_MED)

txt(sl, 'Southcentral Foundation  \u00b7  Nuka System of Care',
    Inches(0.6), Inches(3.96), Inches(6.1), Inches(0.3),
    size=9, italic=True, color=TEXT_GREY)

# Right: escalation flow
escalation = [
    ('Health partner uses tools at home',
     'Full SCP in hand. PANAS score shapes the visit. Support Network reviewed.'),
    ('Structured package sent to physician',
     'Problem + certainty level + evidence gathered + one clear question.'),
    ('Physician responds to a precise question',
     'Not an open-ended chart request. A targeted, documented response.'),
    ('Response written into Shared Care Plan',
     'Permanent, dated, searchable. The record is richer after every escalation.'),
]

ARROW_COLOR = RGBColor(0x93, 0xc5, 0xfd)
ebox_w = Inches(6.0)
ebox_h = Inches(0.88)
ebox_x = Inches(7.0)
ebox_y0 = Inches(0.5)
ebox_gap = Inches(0.22)

for i, (label, desc) in enumerate(escalation):
    ey = ebox_y0 + i * (ebox_h + ebox_gap)
    card(sl, ebox_x, ey, ebox_w, ebox_h, BLUE_LT, BLUE_BD)
    rect(sl, ebox_x, ey, Inches(0.07), ebox_h, NAVY)
    txt(sl, label, ebox_x + Inches(0.18), ey + Inches(0.08), ebox_w - Inches(0.25), Inches(0.32),
        size=11, bold=True, color=NAVY)
    txt(sl, desc, ebox_x + Inches(0.18), ey + Inches(0.44), ebox_w - Inches(0.25), Inches(0.38),
        size=9, color=TEXT_MUTED)
    if i < 3:
        txt(sl, '\u2193', ebox_x + ebox_w / 2 - Inches(0.15), ey + ebox_h + Inches(0.02),
            Inches(0.3), Inches(0.2), size=11, color=ARROW_COLOR, align=PP_ALIGN.CENTER)

footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 11 — Open Source + Cooperative
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, GREY_BG)

# Divider
rect(sl, Inches(6.67), Inches(0.25), Pt(1.5), Inches(7.0), BORDER)

# Left: Open Source
txt(sl, 'OPEN SOURCE', Inches(0.6), Inches(0.3), Inches(5.8), Inches(0.3),
    size=9, bold=True, color=TEXT_GREY)

rect(sl, Inches(0.6), Inches(0.65), Inches(5.9), Inches(2.9), GREEN_BOX)
rect(sl, Inches(0.6), Inches(0.65), Inches(5.9), Inches(0.05), GREEN_BR)
txt(sl, 'PERMANENT COMMITMENT', Inches(0.8), Inches(0.78), Inches(5.5), Inches(0.3),
    size=9, bold=True, color=GREEN_DK)
txt(sl, 'Every tool in My Personal Health Supporter is open source CC Attribution 4.0. '
        'None are for sale. None ever will be. Anyone can use, adapt, or deploy them \u2014 '
        'without asking anyone\u2019s permission.',
    Inches(0.8), Inches(1.12), Inches(5.5), Inches(2.1),
    size=13, color=GREEN_DK)

txt(sl, 'This is the founding architecture, not a policy choice.',
    Inches(0.6), Inches(3.72), Inches(5.9), Inches(0.45),
    size=12, italic=True, color=TEXT_MUTED)

# Left: CC badge stand-in
rect(sl, Inches(0.6), Inches(4.3), Inches(5.9), Inches(0.05), GREEN_BR)

# Right: Cooperative economics
txt(sl, 'COOPERATIVE ECONOMICS', Inches(7.05), Inches(0.3), Inches(6.0), Inches(0.3),
    size=9, bold=True, color=TEXT_GREY)

txt(sl, 'The cooperative is the financial sustainability model. Health partner microenterprises '
        '\u2014 self-managing teams of 5\u201315 people \u2014 are paid for problems resolved, '
        'not visits logged.',
    Inches(7.05), Inches(0.65), Inches(5.9), Inches(1.3),
    size=12, color=TEXT_MED)

# Three small cards
coop_cards = [
    ('Tools + incentives align', 'The same record that guides care is what generates payment.'),
    ('Earn more as problems resolve', 'Payment tied to outcomes, not to volume.'),
    ('Network grows stronger as it grows larger', 'More partners, more coverage, more teaching.'),
]
for i, (label, desc) in enumerate(coop_cards):
    cy = Inches(2.1) + i * Inches(1.25)
    card(sl, Inches(7.05), cy, Inches(5.9), Inches(1.1), SURFACE, BORDER)
    txt(sl, label, Inches(7.25), cy + Inches(0.1), Inches(5.5), Inches(0.35),
        size=12, bold=True, color=NAVY)
    txt(sl, desc, Inches(7.25), cy + Inches(0.48), Inches(5.5), Inches(0.5),
        size=10, color=TEXT_MUTED)

footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 12 — Getting Started
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, NAVY)

txt(sl, 'Where to begin',
    Inches(0.6), Inches(0.4), Inches(12.13), Inches(0.65),
    size=32, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

steps = [
    ('1', 'Learn to read a Health Picture',
     'Start with a completed example. Understand certainty levels before doing your first live visit.'),
    ('2', 'Do your first review with someone you know well',
     'In their home. Use the Health Picture to guide what to gather. Take notes in the SCP.'),
    ('3', 'Write your first Shared Care Plan note right after the visit',
     'Date it. Use the structured sections. The habit builds the record.'),
    ('4', 'Complete your first SODOTO foundation credential',
     'Get it witnessed. Add it to your record. It belongs to you.'),
    ('5', 'Add My Health Choices when a decision is approaching',
     'Open it from the problem in the Health Picture. Let the AI carry the clinical knowledge.'),
    ('6', 'Map their Support Network',
     'Surface what\u2019s missing. A support gap is often a health gap in disguise.'),
]

grid_w = Inches(5.9)
grid_h = Inches(1.65)
grid_gap_x = Inches(0.35)
grid_gap_y = Inches(0.28)
gx0 = Inches(0.72)
gy0 = Inches(1.22)

for i, (num, label, desc) in enumerate(steps):
    col = i % 2
    row = i // 2
    gx = gx0 + col * (grid_w + grid_gap_x)
    gy = gy0 + row * (grid_h + grid_gap_y)
    rect(sl, gx, gy, grid_w, grid_h, NAVY_LT)
    rect(sl, gx, gy, Inches(0.55), grid_h, RGBColor(0x1a, 0x43, 0x70))
    txt(sl, num, gx, gy + Inches(0.45), Inches(0.55), Inches(0.65),
        size=22, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    txt(sl, label, gx + Inches(0.65), gy + Inches(0.1), grid_w - Inches(0.75), Inches(0.42),
        size=12, bold=True, color=WHITE)
    txt(sl, desc, gx + Inches(0.65), gy + Inches(0.55), grid_w - Inches(0.75), Inches(1.0),
        size=10, color=RGBColor(0xb0, 0xc8, 0xe8))

txt(sl, 'Detailed guides available for each tool.',
    Inches(0.6), Inches(7.1), Inches(12), Inches(0.3),
    size=9, color=TEXT_GREY)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 13 — Closing
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, NAVY)

rect(sl, Inches(3.5), Inches(1.8), Inches(6.33), Pt(2), RGBColor(0x4a, 0x7a, 0xb0))

txt(sl, '\u201cGive people and their communities everything they need and want \u2014\n'
        'the knowledge, the tools, the economic support \u2014\n'
        'and watch what human beings do with their own health.\u201d',
    Inches(1.2), Inches(2.05), Inches(10.93), Inches(2.2),
    size=24, italic=True, color=WHITE, align=PP_ALIGN.CENTER)

rect(sl, Inches(3.5), Inches(4.35), Inches(6.33), Pt(2), RGBColor(0x4a, 0x7a, 0xb0))

txt(sl, 'My Personal Health Supporter  \u00b7  RCN  \u00b7  Open Source CC 4.0  \u00b7  Marc Pierson MD  \u00b7  2026',
    Inches(0.6), Inches(4.65), Inches(12.13), Inches(0.38),
    size=12, color=TEXT_GREY, align=PP_ALIGN.CENTER)

# ── Save ──────────────────────────────────────────────────────────────────────
prs.save(OUT)
print(f'Saved: {OUT}')
print(f'Slides: {len(prs.slides)}')
