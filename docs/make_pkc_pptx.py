"""
Generate pkc-overview.pptx — Problem-Knowledge Coupler overview deck
Target audience: physicians, CHWs, health system partners.

Requires: pip install python-pptx
Run:      python3 docs/make_pkc_pptx.py
Output:   docs/pkc-overview.pptx
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'pkc-overview.pptx')

# ── Palette ──────────────────────────────────────────────────────────────────
NAVY    = RGBColor(0x1e, 0x3a, 0x5f)
NAVY_LT = RGBColor(0x2a, 0x4f, 0x7c)
TEAL    = RGBColor(0x0d, 0x6e, 0xfd)
BG      = RGBColor(0xf8, 0xf9, 0xfa)
WHITE   = RGBColor(0xff, 0xff, 0xff)
BLACK   = RGBColor(0x1a, 0x1a, 0x2e)
MUTED   = RGBColor(0x6c, 0x75, 0x7d)
GREEN   = RGBColor(0x19, 0x87, 0x54)
ORANGE  = RGBColor(0xfd, 0x7e, 0x14)
YELLOW  = RGBColor(0xff, 0xc1, 0x07)
RED     = RGBColor(0xdc, 0x35, 0x45)
BLUE    = RGBColor(0x0d, 0x6e, 0xfd)
SURFACE = RGBColor(0xff, 0xff, 0xff)

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

def rect(sl, x, y, w, h, fill, alpha=None):
    shp = sl.shapes.add_shape(1, x, y, w, h)
    shp.fill.solid()
    shp.fill.fore_color.rgb = fill
    shp.line.fill.background()
    return shp

def txt(sl, text, x, y, w, h, size=24, bold=False, color=BLACK,
        align=PP_ALIGN.LEFT, wrap=True, italic=False):
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

def label_val(sl, label, value, x, y, w=Inches(5), lsize=11, vsize=13):
    txt(sl, label.upper(), x, y, w, Inches(.3), size=lsize, bold=True, color=MUTED)
    txt(sl, value, x, y + Inches(.28), w, Inches(.7), size=vsize, color=BLACK)

def divider(sl, y, color=RGBColor(0xde, 0xe2, 0xe6)):
    rect(sl, Inches(.6), y, Inches(12.13), Pt(1.5), color)

def bullet_list(sl, items, x, y, w, size=15, color=BLACK, indent='  '):
    tb = sl.shapes.add_textbox(x, y, w, Inches(4))
    tf = tb.text_frame
    tf.word_wrap = True
    for i, item in enumerate(items):
        if i == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
        p.space_before = Pt(4)
        run = p.add_run()
        run.text = indent + item
        run.font.size = Pt(size)
        run.font.color.rgb = color

def header_bar(sl, title, subtitle=None):
    rect(sl, 0, 0, W, Inches(1.15), NAVY)
    txt(sl, title, Inches(.6), Inches(.12), Inches(11), Inches(.55),
        size=28, bold=True, color=WHITE)
    if subtitle:
        txt(sl, subtitle, Inches(.6), Inches(.65), Inches(11), Inches(.4),
            size=14, color=RGBColor(0xb0, 0xc8, 0xe8))

def footer(sl, note=''):
    txt(sl, 'Problem-Knowledge Coupler · RCN · 2026' + (f' · {note}' if note else ''),
        Inches(.6), Inches(7.1), Inches(12), Inches(.3),
        size=9, color=MUTED)

def ac_badge(sl, code, label, color, x, y):
    rect(sl, x, y, Inches(1.5), Inches(.42), color)
    txt(sl, f'{code} — {label}', x + Inches(.08), y + Inches(.06),
        Inches(1.34), Inches(.32), size=12, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 1 — Title
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, NAVY)

rect(sl, 0, Inches(2.4), W, Inches(2.9), RGBColor(0x16, 0x2d, 0x50))

txt(sl, 'Problem-Knowledge Coupler',
    Inches(.7), Inches(2.6), Inches(11.9), Inches(1.1),
    size=48, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

txt(sl, 'Weed-standard problem-oriented records, assisted by AI',
    Inches(.7), Inches(3.65), Inches(11.9), Inches(.6),
    size=20, color=RGBColor(0xb0, 0xc8, 0xe8), align=PP_ALIGN.CENTER)

txt(sl, 'RCN · Superior AZ · July 2026',
    Inches(.7), Inches(6.8), Inches(11.9), Inches(.4),
    size=12, color=RGBColor(0x6a, 0x8f, 0xb0), align=PP_ALIGN.CENTER)

# Three taglines
for i, line in enumerate([
    'Every gap in the record is visible',
    'Diagnoses are probabilities, never certainties',
    'The record teaches whoever touches it'
]):
    rect(sl, Inches(1.2 + i*3.9), Inches(4.6), Inches(3.5), Inches(.55),
         RGBColor(0x2a, 0x4f, 0x7c))
    txt(sl, line, Inches(1.28 + i*3.9), Inches(4.65), Inches(3.34), Inches(.45),
        size=12, color=RGBColor(0xd0, 0xe4, 0xff), align=PP_ALIGN.CENTER)

footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 2 — The Weed Problem
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, BG)
header_bar(sl, "The problem Lawrence Weed named in 1968",
           "Still unsolved in most EHRs today")

txt(sl, '"The medical record, as kept in most hospitals today, is a '
        'shambles. It does not teach the physician what a complete workup '
        'looks like. Missing data is invisible."',
    Inches(.7), Inches(1.35), Inches(11.9), Inches(1.2),
    size=17, italic=True, color=NAVY, align=PP_ALIGN.CENTER)

txt(sl, '— Lawrence Weed, MD',
    Inches(.7), Inches(2.55), Inches(11.9), Inches(.4),
    size=12, color=MUTED, align=PP_ALIGN.CENTER)

divider(sl, Inches(3.1))

# Two columns
for x, title, items in [
    (Inches(.7), 'What conventional records do', [
        'Record what was gathered',
        'Leave gaps invisible',
        'Require physician to recall the full differential',
        'Present one diagnosis as the conclusion',
        'Lose the reasoning that led to it',
    ]),
    (Inches(7.1), 'What Weed\'s couplers do', [
        'Display every finding worth gathering',
        'Mark gaps as first-class visible elements',
        'Show all candidate explanations with evidence',
        'State probabilities — never conclusions',
        'Version the reasoning as evidence accrues',
    ]),
]:
    txt(sl, title, x, Inches(3.2), Inches(5.8), Inches(.4),
        size=14, bold=True, color=NAVY)
    bullet_list(sl, items, x, Inches(3.65), Inches(5.8), size=13)

footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 3 — What This Tool Does
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, BG)
header_bar(sl, "What the coupler does", "Four things, in order")

steps = [
    (RED,    '1', 'Generate the frame',
     'AI builds the full set of findings for the stated problem — Subjective questions, Objective measurements, candidate Assessments, Plan options. Exhaustive, not selective.'),
    (ORANGE, '2', 'Match the record',
     'Existing data is mapped onto frame slots. Every slot is marked filled, partial, or absent. Nothing is hidden. Partial is shown with what is still missing.'),
    (BLUE,   '3', 'Display with completeness',
     'Candidates are listed with probability estimates, severity classes, and an attention code computed from a fixed matrix. Low-probability but high-consequence candidates stay visible.'),
    (GREEN,  '4', 'Re-match as data arrives',
     'As findings are added, the AI re-estimates probabilities and appends to the history. The picture sharpens. Old estimates are never overwritten.'),
]
for i, (color, num, title, body) in enumerate(steps):
    row = Inches(1.35) + i * Inches(1.42)
    rect(sl, Inches(.55), row, Inches(.5), Inches(.5), color)
    txt(sl, num, Inches(.55), row + Inches(.04), Inches(.5), Inches(.45),
        size=22, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    txt(sl, title, Inches(1.2), row, Inches(4), Inches(.4), size=14, bold=True, color=NAVY)
    txt(sl, body, Inches(1.2), row + Inches(.38), Inches(11.4), Inches(.82),
        size=12, color=BLACK)

footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 4 — The SOAP View
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, BG)
header_bar(sl, "The SOAP view — gaps are first-class", "Example: Fatigue, subacute, etiology undetermined")

# Status legend
for x, color, label, desc in [
    (Inches(.7),  GREEN,  'FILLED',  'Value recorded + provenance'),
    (Inches(3.6), ORANGE, 'PARTIAL', 'Something present, something missing'),
    (Inches(6.5), MUTED,  'ABSENT',  '"Not yet gathered" — the question itself'),
]:
    rect(sl, x, Inches(1.3), Inches(.18), Inches(.18), color)
    txt(sl, label, x + Inches(.25), Inches(1.26), Inches(1.2), Inches(.28),
        size=11, bold=True, color=color)
    txt(sl, desc, x + Inches(.25), Inches(1.5), Inches(2.5), Inches(.28), size=10, color=MUTED)

divider(sl, Inches(1.9))

# Mock SOAP rows
rows = [
    # (status, color, section, term, vernacular, value_note)
    ('S', GREEN,  'SUBJECTIVE', 'Sleep quality',
     'How well and how long are you sleeping?',
     'Poor, waking 3–4x/night for 6 weeks · recorded by person · 2026-06-28'),
    ('P', ORANGE, 'SUBJECTIVE', 'Exertional tolerance',
     'Does activity make you more tired than it used to?',
     'Yes, stairs now cause shortness of breath · missing: baseline comparison'),
    ('A', MUTED,  'SUBJECTIVE', 'Mood and affect',
     'Have you been feeling low, hopeless, or lost interest in things?',
     'Not yet gathered'),
    ('F', GREEN,  'OBJECTIVE',  'Hemoglobin (CBC)',
     'Blood count — checks for anemia',
     '11.2 g/dL · Superior AZ Clinic Lab · 2026-05-14'),
    ('A', MUTED,  'OBJECTIVE',  'Ferritin',
     'Stored iron level — confirms or rules out iron deficiency',
     'Not yet gathered — needs lab order'),
]
colors = {'S': GREEN, 'P': ORANGE, 'A': MUTED, 'F': GREEN}
labels = {'S': 'FILLED', 'P': 'PARTIAL', 'A': 'ABSENT', 'F': 'FILLED'}
for i, (code, c, section, term, vern, val) in enumerate(rows):
    y = Inches(2.05) + i * Inches(.98)
    rect(sl, Inches(.55), y, Inches(12.23), Inches(.82), SURFACE)
    rect(sl, Inches(.55), y, Inches(.07), Inches(.82), c)
    rect(sl, Inches(.75), y + Inches(.32), Inches(.14), Inches(.14), c)
    txt(sl, term, Inches(1.0), y + Inches(.06), Inches(4), Inches(.32),
        size=12, bold=True, color=BLACK)
    txt(sl, vern, Inches(1.0), y + Inches(.35), Inches(4.5), Inches(.28),
        size=10, color=MUTED, italic=True)
    txt(sl, val, Inches(5.7), y + Inches(.18), Inches(6.8), Inches(.5),
        size=11, color=BLACK if code != 'A' else MUTED,
        italic=(code == 'A'))

footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 5 — Attention Matrix
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, BG)
header_bar(sl, "The Attention Matrix",
           '"How likely it is, crossed with how bad it would be to miss"')

txt(sl, 'Probability and danger are separate axes. Each candidate assessment carries both. The code is computed from a fixed table — never assigned by the AI.',
    Inches(.7), Inches(1.25), Inches(11.9), Inches(.5), size=13, color=BLACK)

# Matrix
col_headers = ['A — Likely\n≥60%', 'B — Possible\n30–59%', 'C — Less likely\n10–29%', 'D — Unlikely\n<10%']
row_headers = ['I — Life or\nirreversible', 'II — Serious\nharm', 'III — Trouble,\nrecoverable', 'IV — Small\ntrouble']
matrix = [
    [('1','Act Now',RED), ('1','Act Now',RED), ('2','Move Fast',ORANGE), ('3','Work On It',YELLOW)],
    [('1','Act Now',RED), ('2','Move Fast',ORANGE), ('3','Work On It',YELLOW), ('4','Watch It',BLUE)],
    [('2','Move Fast',ORANGE), ('3','Work On It',YELLOW), ('4','Watch It',BLUE), ('5','Let It Rest',GREEN)],
    [('3','Work On It',YELLOW), ('4','Watch It',BLUE), ('5','Let It Rest',GREEN), ('5','Let It Rest',GREEN)],
]

cx = Inches(2.8)
cy = Inches(2.0)
cw = Inches(2.2)
ch = Inches(.95)

for j, ch_label in enumerate(col_headers):
    txt(sl, ch_label, cx + j*cw, cy - Inches(.72), cw, Inches(.7),
        size=10, bold=True, color=NAVY, align=PP_ALIGN.CENTER)

for i, (rh, row) in enumerate(zip(row_headers, matrix)):
    txt(sl, rh, Inches(.55), cy + i*ch, Inches(2.1), ch,
        size=10, bold=True, color=NAVY)
    for j, (code, label, color) in enumerate(row):
        rect(sl, cx + j*cw + Pt(2), cy + i*ch + Pt(2),
             cw - Pt(4), ch - Pt(4), color)
        txt(sl, code, cx + j*cw, cy + i*ch + Pt(6), cw, Pt(26),
            size=20, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
        txt(sl, label, cx + j*cw, cy + i*ch + Pt(32), cw, Pt(22),
            size=9, color=WHITE, align=PP_ALIGN.CENTER)

# Note about yellow
txt(sl, '* Code 3 (yellow) text appears dark for readability',
    Inches(.7), Inches(6.7), Inches(8), Inches(.3), size=9, color=MUTED, italic=True)

txt(sl, 'Codes 1 and 2 always surface at the top of the\nproblem view regardless of probability rank.',
    Inches(11.6 - Inches(3.2)), Inches(5.6), Inches(3.4), Inches(.8),
    size=11, bold=True, color=NAVY)

footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 6 — Probabilities Are Estimates, Not Verdicts
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, BG)
header_bar(sl, "Probabilities are estimates, not verdicts",
           "The picture sharpens as evidence arrives")

txt(sl, 'The record shows a ranked list of candidate explanations — never a single conclusion.',
    Inches(.7), Inches(1.3), Inches(11.9), Inches(.4), size=14, color=BLACK)

# Example candidate
rect(sl, Inches(.7), Inches(1.85), Inches(11.93), Inches(2.05), SURFACE)
rect(sl, Inches(.7), Inches(1.85), Inches(.07), Inches(2.05), RED)

ac_badge(sl, 2, 'Move Fast', ORANGE, Inches(.9), Inches(1.95))
txt(sl, 'Iron-deficiency anemia', Inches(2.55), Inches(1.95), Inches(5), Inches(.42),
    size=16, bold=True, color=BLACK)
txt(sl, 'Low iron causing low blood count', Inches(2.55), Inches(2.35), Inches(5), Inches(.3),
    size=12, color=MUTED, italic=True)

# Probability bar
rect(sl, Inches(.9), Inches(2.72), Inches(4.5), Inches(.18), RGBColor(0xe9,0xec,0xef))
rect(sl, Inches(.9), Inches(2.72), Inches(4.5*0.40), Inches(.18), NAVY)
txt(sl, '40%  Band B  Class III',
    Inches(5.5), Inches(2.64), Inches(3), Inches(.3), size=11, color=MUTED)

# History
txt(sl, 'Probability history:',
    Inches(.9), Inches(3.03), Inches(4), Inches(.28), size=10, bold=True, color=MUTED)
for i, (date, pct, note) in enumerate([
    ('2026-06-20', '30%', 'Prior — no data'),
    ('2026-07-03', '40%', 'Moved by o-001 (Hgb 11.2 g/dL)'),
]):
    txt(sl, f'{date}  →  {pct}  —  {note}',
        Inches(.9), Inches(3.28) + i*Inches(.28), Inches(9), Inches(.28),
        size=10, color=MUTED, italic=True)

divider(sl, Inches(4.15))

for x, title, body in [
    (Inches(.7), 'The residual is always on the list',
     '"Something not on this list — the differential is never closed." Its probability is shown explicitly. This is Weed\'s discipline: the record admits what it does not know.'),
    (Inches(6.8), 'History is never overwritten',
     'Each Re-Match appends a new probability entry with the finding IDs that moved it. The trajectory from first guess to current estimate is always auditable.'),
]:
    txt(sl, title, x, Inches(4.3), Inches(5.7), Inches(.4), size=13, bold=True, color=NAVY)
    txt(sl, body, x, Inches(4.72), Inches(5.7), Inches(1.2), size=12, color=BLACK)

footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 7 — Three Roles
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, BG)
header_bar(sl, "Three roles, one record", "Person-controlled, provenance on every entry")

roles = [
    (RGBColor(0x0d,0x6e,0xfd), 'Person / Family',
     'Fills in subjective findings from lived experience. Sees the full frame — knows what is being asked and why. "Written by other" flag if a CHW or clinician records on their behalf.',
     ['Answers subjective questions', 'Reviews candidate assessments in plain language', 'Sees what is still missing and why it matters']),
    (RGBColor(0x19,0x87,0x54), 'Community Health Worker',
     'Facilitates data collection in the field. Records objective findings. Runs Re-Match after each visit to update the picture. Narrate produces a summary paragraph for handoff.',
     ['Records findings with date + provenance', 'Runs Re-Match to update probabilities', 'Uses Narrate for visit summary']),
    (RGBColor(0x1e,0x3a,0x5f), 'Physician',
     'Receives a Weed-standard record: every gap explicit, every candidate with evidence basis. The "not yet gathered" list is a teaching instrument. Gaps are not absences — they are assignments.',
     ['Reads a complete differential, not a conclusion', 'Sees what evidence supports or refutes each candidate', 'Acts on the attention code, not just probability rank']),
]

for i, (color, title, body, bullets) in enumerate(roles):
    x = Inches(.55) + i * Inches(4.26)
    rect(sl, x, Inches(1.3), Inches(3.96), Inches(5.8), SURFACE)
    rect(sl, x, Inches(1.3), Inches(3.96), Inches(.45), color)
    txt(sl, title, x + Inches(.15), Inches(1.35), Inches(3.66), Inches(.38),
        size=14, bold=True, color=WHITE)
    txt(sl, body, x + Inches(.15), Inches(1.85), Inches(3.66), Inches(1.4),
        size=11, color=BLACK)
    for j, b in enumerate(bullets):
        rect(sl, x + Inches(.2), Inches(3.42) + j*Inches(.55),
             Inches(.12), Inches(.12), color)
        txt(sl, b, x + Inches(.4), Inches(3.36) + j*Inches(.55),
            Inches(3.4), Inches(.52), size=11, color=BLACK)

footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 8 — AI's Role (and limits)
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, BG)
header_bar(sl, "AI's role — and its limits", "The LLM drafts frames. It does not decide.")

for i, (icon_color, title, body) in enumerate([
    (GREEN, 'What the AI does',
     'Generates the coupler frame — the exhaustive list of findings, candidate assessments, '
     'probability estimates, severity classes, and plan options. Calibrates estimates to the '
     'actual record data, not just textbook base rates. Writes vernacular explanations for every term.'),
    (RED,   'What the AI does not do',
     'Conclude. Diagnose. Assign attention codes (those are a deterministic table lookup). '
     'Overwrite prior probability estimates. Operate on data it has not been given. '
     'Make any entry the person of record has not reviewed.'),
    (NAVY,  'What humans control',
     'Every frame is stored as human-readable JSON. Any item can be read, questioned, edited, '
     'or versioned. The person controls all access. Provenance is on every entry. '
     'The differential is explicitly never closed.'),
]):
    y = Inches(1.35) + i * Inches(1.78)
    rect(sl, Inches(.55), y, Inches(.5), Inches(.5), icon_color)
    txt(sl, title, Inches(1.2), y, Inches(11), Inches(.42), size=15, bold=True, color=NAVY)
    txt(sl, body, Inches(1.2), y + Inches(.42), Inches(11.5), Inches(1.1), size=13, color=BLACK)

divider(sl, Inches(6.75))
txt(sl, 'Basis field on every assessment candidate and plan option. '
        'Confidence note on every candidate. Uncertainty is stated, not hidden.',
    Inches(.7), Inches(6.82), Inches(12), Inches(.38), size=11, italic=True, color=MUTED)

footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 9 — Activation Band
# ═══════════════════════════════════════════════════════════════════════════════
AMBER  = RGBColor(0xfd, 0x7e, 0x14)
AMBER_LT = RGBColor(0xff, 0xf3, 0xcd)
RED_LT = RGBColor(0xf8, 0xd7, 0xda)
GREEN_LT = RGBColor(0xd1, 0xe7, 0xdd)
BLUE_LT  = RGBColor(0xcf, 0xe2, 0xff)
RED_DK   = RGBColor(0x84, 0x20, 0x29)
AMBER_DK = RGBColor(0x66, 0x4d, 0x03)
GREEN_DK = RGBColor(0x0f, 0x51, 0x32)
BLUE_DK  = RGBColor(0x08, 0x42, 0x98)

sl = slide()
bg(sl, BG)
header_bar(sl, "Activation Band — pacing, not gatekeeping",
           "Hibbard PAM · Mahoney PANAS proxy · four levels · versioned alongside probability")

# Left column — instrument description
txt(sl, 'PANAS PA-10 Check-in',
    Inches(.6), Inches(1.3), Inches(5.8), Inches(.38),
    size=14, bold=True, color=NAVY)

txt(sl, 'Ten positive-affect adjectives rated 1–5 for the past week. '
        'Self-administered in about one minute. Raw score stored; band derived '
        'from a named crosswalk table — updating the table never touches stored scores.',
    Inches(.6), Inches(1.72), Inches(5.8), Inches(.9),
    size=11, color=BLACK)

# PA-10 words in two rows
words = ['active','alert','attentive','determined','enthusiastic',
         'excited','inspired','interested','proud','strong']
for i, w in enumerate(words):
    col = i % 5
    row = i // 5
    x = Inches(.6) + col * Inches(1.16)
    y = Inches(2.72) + row * Inches(.42)
    rect(sl, x, y, Inches(1.08), Inches(.34), NAVY_LT)
    txt(sl, w, x + Inches(.04), y + Inches(.05), Inches(1.0), Inches(.28),
        size=10, color=WHITE, align=PP_ALIGN.CENTER)

txt(sl, '1 = Very slightly or not at all  ·  5 = Extremely  ·  Past-week instructions',
    Inches(.6), Inches(3.65), Inches(5.8), Inches(.3),
    size=9, color=MUTED, italic=True)

divider(sl, Inches(4.1))

# Bottom-left: the research claim
txt(sl, 'A measurable hypothesis',
    Inches(.6), Inches(4.2), Inches(5.8), Inches(.35),
    size=12, bold=True, color=NAVY)
txt(sl, 'If Weed is right that the record teaches, activation should rise as '
        'a person uses the coupler over time. Band history is stored from the '
        'first check-in — the trajectory is auditable and publishable.',
    Inches(.6), Inches(4.58), Inches(5.8), Inches(.95),
    size=11, color=BLACK)

# Right column — 4 bands
band_data = [
    (1, '10 – 24', 'Learning the basics', RED_LT,   RED_DK),
    (2, '25 – 31', 'Building awareness',  AMBER_LT, AMBER_DK),
    (3, '32 – 38', 'Taking action',       GREEN_LT, GREEN_DK),
    (4, '39 – 50', 'Staying the course',  BLUE_LT,  BLUE_DK),
]
bx = Inches(6.8)
for i, (band, score, label, lt, dk) in enumerate(band_data):
    by = Inches(1.3) + i * Inches(.88)
    rect(sl, bx, by, Inches(6.1), Inches(.78), lt)
    rect(sl, bx, by, Inches(.52), Inches(.78), dk)
    txt(sl, str(band), bx + Inches(.05), by + Inches(.14), Inches(.42), Inches(.5),
        size=22, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    txt(sl, label, bx + Inches(.65), by + Inches(.06), Inches(3.2), Inches(.32),
        size=12, bold=True, color=dk)
    txt(sl, f'Score {score}', bx + Inches(.65), by + Inches(.38), Inches(2), Inches(.28),
        size=10, color=MUTED)

# Presentation rules
txt(sl, 'What changes by band (not what is withheld)',
    bx, Inches(4.88), Inches(6.1), Inches(.35), size=12, bold=True, color=NAVY)

for row_y, bcolor, rule in [
    (Inches(5.28), RGBColor(0x84,0x20,0x29),
     'Bands 1–2:  Urgent candidates only · top 3 absent findings · '
     'plan options as "ask your care team"'),
    (Inches(5.82), RGBColor(0x08,0x42,0x98),
     'Bands 3–4:  Full frame · all candidates · '
     'plan options as "what you can do"'),
]:
    rect(sl, bx, row_y, Inches(.18), Inches(.38), bcolor)
    txt(sl, rule, bx + Inches(.3), row_y, Inches(5.7), Inches(.42), size=11, color=BLACK)

txt(sl, '"Show full frame" button always overrides the filter — the record is never withheld.',
    bx, Inches(6.45), Inches(6.1), Inches(.35), size=10, italic=True, color=MUTED)

footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 10 — How to Start
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, BG)
header_bar(sl, "Getting started", "Six steps from install to first frame")

steps_start = [
    ('1', NAVY,   'Start the proxy',
     'export ANTHROPIC_API_KEY=sk-ant-...\npython3 coupler-proxy.py\n→ http://localhost:8766'),
    ('2', NAVY,   'Add a person and problem',
     'Click "+ Person", enter name and DOB.\nClick "+ Add problem", enter the plain-language and clinical problem statements.'),
    ('3', NAVY,   'Generate Frame',
     'Click Generate Frame. The AI builds the full workup frame (20–30 seconds). All slots start as "absent".'),
    ('4', NAVY,   'Take PANAS check-in',
     'Click "Take PANAS" in the sidebar. Rate 10 words (1–5, past week) to set the activation band. The frame view adapts — override anytime with "Show full frame".'),
    ('5', NAVY,   'Enter findings · Re-Match',
     'Click any finding row, enter the value. Click Re-Match after each visit. Probabilities update; history appends.'),
    ('6', GREEN,  'Save Bundle to take work elsewhere',
     'Save Bundle → .coupler.json. Load Bundle on any machine running the proxy to restore everything including activation history.'),
]

for i, (num, color, title, body) in enumerate(steps_start):
    col = i % 2
    row = i // 2
    x = Inches(.55) + col * Inches(6.5)
    y = Inches(1.35) + row * Inches(1.8)
    rect(sl, x, y, Inches(.5), Inches(.5), color)
    txt(sl, num, x, y + Inches(.04), Inches(.5), Inches(.44),
        size=22, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    txt(sl, title, x + Inches(.65), y, Inches(5.6), Inches(.4), size=13, bold=True, color=NAVY)
    txt(sl, body, x + Inches(.65), y + Inches(.4), Inches(5.6), Inches(1.1),
        size=11, color=BLACK)

footer(sl, 'localhost:8766 · coupler-proxy.py')

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 10 — What Comes Next
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, NAVY)

txt(sl, 'What comes next',
    Inches(.7), Inches(.8), Inches(11.9), Inches(.7),
    size=32, bold=True, color=WHITE)
txt(sl, 'Seams designed but not yet built',
    Inches(.7), Inches(1.45), Inches(11.9), Inches(.4),
    size=14, color=RGBColor(0xb0, 0xc8, 0xe8))

next_items = [
    ('Import from SCP',       'Pull existing problems and data from FedWiki Shared Care Plan pages'),
    ('Groove workspace',      'Share coupler pages into a Groove workspace for CHW field use'),
    ('Superior AZ pilot',     'Field test with Chris Casillas — real problem sets, real CHW workflow'),
    ('FHIR mapping',          'Condition, Observation, CarePlan once schemas stabilize'),
    ('Physician review loop', 'Structured feedback path from physician back into the frame'),
]

for i, (title, body) in enumerate(next_items):
    col = i % 2
    row = i // 2
    x = Inches(.7) + col * Inches(6.5)
    y = Inches(2.1) + row * Inches(1.55)
    rect(sl, x, y, Inches(5.9), Inches(1.3), RGBColor(0x2a, 0x4f, 0x7c))
    txt(sl, title, x + Inches(.2), y + Inches(.1), Inches(5.5), Inches(.42),
        size=14, bold=True, color=WHITE)
    txt(sl, body, x + Inches(.2), y + Inches(.52), Inches(5.5), Inches(.65),
        size=11, color=RGBColor(0xb0, 0xc8, 0xe8))

# bottom center - last item
x = Inches(.7) + Inches(3.25)
y = Inches(2.1) + 2 * Inches(1.55)
title, body = next_items[4]
rect(sl, x, y, Inches(5.9), Inches(1.3), RGBColor(0x2a, 0x4f, 0x7c))
txt(sl, title, x + Inches(.2), y + Inches(.1), Inches(5.5), Inches(.42),
    size=14, bold=True, color=WHITE)
txt(sl, body, x + Inches(.2), y + Inches(.52), Inches(5.5), Inches(.65),
    size=11, color=RGBColor(0xb0, 0xc8, 0xe8))

txt(sl, '"The record teaches whoever touches it what a complete workup looks like."  — L. Weed',
    Inches(.7), Inches(7.1), Inches(11.9), Inches(.3),
    size=10, italic=True, color=RGBColor(0x6a, 0x8f, 0xb0), align=PP_ALIGN.CENTER)

# ── Save ─────────────────────────────────────────────────────────────────────
prs.save(OUT)
print(f'Saved: {OUT}')
print(f'Slides: {len(prs.slides)}')
