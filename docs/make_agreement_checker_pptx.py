"""
Generate tools/rcn-agreement-checker-intro.pptx — the Agreement Checker intro deck.

Companion to tools/agreement-checker-intro.html and agreement-checker-manual.html;
same argument, deck shape. Regenerate after editing:
    python3 docs/make_agreement_checker_pptx.py
Requires: pip install python-pptx

AUDIENCE: a garden group, co-op board, or NDC council about to write or revise
its own rules, and the facilitator who will run the session. Leads with the
three ways agreements fail, shows Ostrom's grammar as seven plain questions,
and spends its weight on what the checker asks and why a consequence needs
someone named to carry it out.

Light background and pure black text throughout (Marc's standing rule). The
screenshots come from tools/agreement-checker-shots/, headless captures of the
checker's two built-in garden examples; retake them if the page changes.
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_CONNECTOR, MSO_SHAPE
from pptx.enum.dml import MSO_LINE_DASH_STYLE
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
TOOLS = os.path.join(HERE, '..', 'tools')
SHOTS = os.path.join(TOOLS, 'agreement-checker-shots')

# ── Palette — the checker's own colours ─────────────────────────────────────
INK    = RGBColor(0x00, 0x00, 0x00)
BLUE   = RGBColor(0x1d, 0x4e, 0xd8)   # a question
GREEN  = RGBColor(0x15, 0x80, 0x3d)   # an answer; an agreed rule
AMBER  = RGBColor(0xb4, 0x53, 0x09)   # needs an answer; shared expectation
AMB_LT = RGBColor(0xff, 0xfb, 0xeb)
RED    = RGBColor(0xb9, 0x1c, 0x1c)   # backed by; loose consequence
PURPLE = RGBColor(0x7c, 0x3a, 0xed)   # creating agreement
GREY   = RGBColor(0x6b, 0x72, 0x80)   # shared habit
LINE   = RGBColor(0xd4, 0xd4, 0xd4)
BG     = RGBColor(0xff, 0xff, 0xff)
TINT   = RGBColor(0xf4, 0xf6, 0xfb)
WHITE  = RGBColor(0xff, 0xff, 0xff)

ATTRIB = 'Marc Pierson and Claude Opus 5.5 · September 2026'

prs = Presentation()
prs.slide_width = Inches(13.33)
prs.slide_height = Inches(7.5)
BLANK = prs.slide_layouts[6]
N = [0]


def slide(bgc=BG):
    sl = prs.slides.add_slide(BLANK)
    f = sl.background.fill
    f.solid()
    f.fore_color.rgb = bgc
    N[0] += 1
    return sl


def shape(sl, kind, x, y, w, h, fill=WHITE, line=None, lw=1.5, dash=None):
    sh = sl.shapes.add_shape(kind, Inches(x), Inches(y), Inches(w), Inches(h))
    if fill is None:
        sh.fill.background()
    else:
        sh.fill.solid()
        sh.fill.fore_color.rgb = fill
    if line is not None:
        sh.line.color.rgb = line
        sh.line.width = Pt(lw)
        if dash:
            sh.line.dash_style = dash
    else:
        sh.line.fill.background()
    sh.shadow.inherit = False
    return sh


def box(sl, x, y, w, h, **kw):
    return shape(sl, MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h, **kw)


def conn(sl, x1, y1, x2, y2, color=INK, lw=1.5, dash=None, arrow=False):
    c = sl.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(x1), Inches(y1), Inches(x2), Inches(y2))
    c.line.color.rgb = color
    c.line.width = Pt(lw)
    if dash:
        c.line.dash_style = dash
    if arrow:
        ln = c.line._get_or_add_ln()
        from pptx.oxml.ns import qn
        from lxml import etree
        tail = etree.SubElement(ln, qn('a:tailEnd'))
        tail.set('type', 'triangle')
        tail.set('w', 'med')
        tail.set('h', 'med')
    return c


def txt(sl, text, x, y, w, h, size=18, bold=False, italic=False, color=INK,
        align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP, spacing=1.05, margin=None):
    tb = sl.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    if margin is not None:
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = Inches(margin)
    for i, line in enumerate(text.split('\n')):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        p.line_spacing = spacing
        r = p.add_run()
        r.text = line
        r.font.size = Pt(size)
        r.font.bold = bold
        r.font.italic = italic
        r.font.color.rgb = color
        r.font.name = 'Calibri'
    return tb


def boxtext(sl, x, y, w, h, text, size=14, bold=True, line=INK, fill=WHITE, lw=2, dash=None, color=INK):
    box(sl, x, y, w, h, fill=fill, line=line, lw=lw, dash=dash)
    txt(sl, text, x, y, w, h, size=size, bold=bold, color=color, align=PP_ALIGN.CENTER,
        anchor=MSO_ANCHOR.MIDDLE, margin=0.06)


def kicker(sl, text, color=BLUE):
    txt(sl, text.upper(), 0.7, 0.45, 11.5, 0.35, size=12, bold=True, color=color)


def title(sl, text, y=0.8, size=34):
    txt(sl, text, 0.7, y, 12, 1.0, size=size, bold=True)


def footer(sl):
    txt(sl, 'RCN · Agreement Checker', 0.7, 7.0, 6, 0.3, size=10, color=GREY)
    txt(sl, str(N[0]), 12.0, 7.0, 0.6, 0.3, size=10, color=GREY, align=PP_ALIGN.RIGHT)


# PowerPoint does not shrink text to fit; measure prose before placing it.
CHAR_EM = 0.505


def text_h(text, w_in, size_pt, spacing=1.1):
    cpl = max(8, int(w_in * 72 / (size_pt * CHAR_EM)))
    lines = sum(max(1, -(-len(p) // cpl)) for p in text.split('\n'))
    return lines * size_pt * spacing * 1.05 / 72


def card(sl, x, y, w, h, head, body, edge=AMBER, headsize=17, bodysize=14):
    tw = w - 0.4
    hh = text_h(head, tw - 0.2, headsize) + 0.08          # a heading may take two lines
    top = 0.12 + hh + 0.06
    while bodysize > 10 and top + text_h(body, tw - 0.2, bodysize) + 0.1 > h:
        bodysize -= 0.5
    box(sl, x, y, w, h, fill=WHITE, line=edge, lw=2.25)
    txt(sl, head, x + 0.2, y + 0.12, tw, hh, size=headsize, bold=True)
    txt(sl, body, x + 0.2, y + top, tw, h - top - 0.05, size=bodysize, spacing=1.08)


def picture(sl, path, x, y, max_w, max_h, border=True):
    im = Image.open(path)
    ar = im.width / im.height
    w, h = max_w, max_w / ar
    if h > max_h:
        h, w = max_h, max_h * ar
    x0 = x + (max_w - w) / 2
    if border:
        shape(sl, MSO_SHAPE.RECTANGLE, x0 - 0.03, y - 0.03, w + 0.06, h + 0.06, fill=WHITE, line=LINE, lw=1)
    sl.shapes.add_picture(path, Inches(x0), Inches(y), Inches(w), Inches(h))
    return x0, w, h


def notes(sl, text):
    sl.notes_slide.notes_text_frame.text = text


# ── 1 · Title ───────────────────────────────────────────────────────────────
sl = slide(TINT)
txt(sl, 'RCN TOOLS', 0.9, 1.35, 8, 0.4, size=14, bold=True, color=BLUE)
txt(sl, 'Agreement Checker', 0.9, 1.8, 11, 1.2, size=56, bold=True)
txt(sl, "Elinor Ostrom's grammar of rules, as plain questions\na group can ask of any agreement it writes.", 0.9, 3.05, 11, 1.2, size=24)
qs = ['WHEN?', 'WHO?', 'MUST, MAY,\nOR MUST NOT?', 'DO WHAT?', 'TO WHAT?', 'HOW?', 'OR ELSE?']
for i, q in enumerate(qs):
    boxtext(sl, 0.9 + i * 1.66, 4.55, 1.5, 0.85, q, size=13, line=BLUE, color=BLUE)
txt(sl, ATTRIB, 0.9, 6.35, 11, 0.4, size=16, bold=True)
notes(sl, 'The Agreement Checker turns Ostrom\'s Institutional Grammar into seven plain questions. Marc Pierson and Claude Opus 5.5, September 2026.')

# ── 2 · Agreements fail in the same few ways ────────────────────────────────
sl = slide()
kicker(sl, 'The problem')
title(sl, 'Agreements fail in the same few ways')
card(sl, 0.7, 2.05, 3.8, 3.1, 'Two rules in one sentence',
     '"Gardeners must water only on assigned days and must not use sprinklers, but may hand-water seedlings any day."\n\nThree rules, tangled. You can\'t change one without touching the others.')
card(sl, 4.77, 2.05, 3.8, 3.1, 'A permission that clashes',
     '"Water only on assigned days" and "hand-water seedlings any day" pull against each other. Which one wins?')
card(sl, 8.84, 2.05, 3.8, 3.1, 'A penalty nobody carries out',
     '"Violators lose watering privileges for a week."\n\nWho takes them away? If nobody is named, nobody does.')
txt(sl, 'None of these shows up when a group reads a paragraph and nods. Each one shows up when you ask the same few questions of every sentence.',
    0.7, 5.55, 11.9, 1.0, size=18)
footer(sl)
notes(sl, 'Three failures, all from one real-looking garden bylaw. They are invisible to a group reading the paragraph together; they become visible only sentence by sentence.')

# ── 3 · Ostrom found the questions; the symbols hid them ────────────────────
sl = slide()
kicker(sl, 'Why it exists')
title(sl, 'Ostrom found the questions. The symbols hid them.')
txt(sl, 'Elinor Ostrom showed how communities govern shared resources without a boss or a market. With Sue Crawford she wrote a grammar for the rules those communities make. It is powerful, and almost nobody outside a university uses it.',
    0.7, 1.85, 6.1, 2.2, size=17)
rows = [('Ostrom\'s words', 'Plain question'), ('Attributes', 'WHO?'), ('Deontic', 'MUST, MAY, OR MUST NOT?'),
        ('Aim', 'DO WHAT?'), ('Object', 'TO WHAT?'), ('Activation Condition', 'WHEN?'),
        ('Execution Constraint', 'HOW?'), ('Or else', 'OR ELSE?')]
y = 1.9
for i, (a, b) in enumerate(rows):
    head = i == 0
    txt(sl, a, 7.3, y, 2.6, 0.4, size=13 if head else 15, bold=head, color=GREY if not head else INK, anchor=MSO_ANCHOR.MIDDLE)
    txt(sl, b, 9.9, y, 3.0, 0.4, size=13 if head else 15, bold=True, color=INK if head else BLUE, anchor=MSO_ANCHOR.MIDDLE)
    y += 0.44
    conn(sl, 7.3, y, 12.6, y, INK if head else LINE, 1 if head else 0.75)
box(sl, 0.7, 4.35, 6.1, 1.95, fill=TINT, line=None)
txt(sl, '"I have never thought that math, logic, or programming has to be for the initiated only. It would just be much more verbose and illustrated, but then democratic."',
    0.95, 4.5, 5.6, 1.35, size=16, italic=True)
txt(sl, '— Marc Pierson', 0.95, 5.85, 5.6, 0.35, size=14, bold=True)
footer(sl)
notes(sl, 'The checker keeps all of Ostrom\'s logic and shows none of her symbols unless asked. The quote is the design brief.')

# ── 4 · Seven questions, one garden rule ────────────────────────────────────
sl = slide()
kicker(sl, 'The grammar in plain words')
title(sl, 'Every rule answers seven questions')
ans = ['when the tank\nis below half', 'gardeners', 'must not', 'water', 'their plots', 'with\nsprinklers', 'the keeper\nsuspends watering']
qx = 0.7
for i, (q, a) in enumerate(zip(qs, ans)):
    x = qx + i * 1.72
    boxtext(sl, x, 2.05, 1.55, 0.95, q, size=13, line=BLUE, color=BLUE, lw=2.25)
    conn(sl, x + 0.775, 3.0, x + 0.775, 3.35, GREEN, 1.25, MSO_LINE_DASH_STYLE.ROUND_DOT, arrow=True)
    boxtext(sl, x, 3.4, 1.55, 0.95, a, size=13, bold=False, line=GREEN, lw=2)
txt(sl, 'Read the green row left to right and you hear the rule:', 0.7, 4.75, 12, 0.4, size=16)
txt(sl, '"When the tank is below half, gardeners must not water their plots with sprinklers, or else the water keeper suspends their watering for a week."',
    0.7, 5.15, 12, 0.9, size=19, bold=True)
txt(sl, 'WHO?, MUST / MAY / MUST NOT, and DO WHAT? always need an answer. WHEN?, TO WHAT?, and HOW? are often blank, and that is fine.',
    0.7, 6.15, 12, 0.6, size=15, color=GREY)
footer(sl)
notes(sl, 'Questions in blue, answers in green, the same colours as the checker and the drawing. Exactly one MUST, MAY, or MUST NOT per sentence.')

# ── 5 · One MUST per sentence ───────────────────────────────────────────────
sl = slide()
kicker(sl, 'The first move')
title(sl, 'One MUST, MAY, or MUST NOT per sentence')
box(sl, 0.7, 2.0, 4.4, 3.6, fill=TINT, line=None)
txt(sl, 'AS WRITTEN', 0.95, 2.15, 4, 0.35, size=12, bold=True, color=GREY)
txt(sl, '"Gardeners must water only on assigned days and must not use sprinklers, but may hand-water seedlings any day. Violators lose watering privileges for a week."',
    0.95, 2.55, 3.95, 2.9, size=17)
split = [('1', 'Gardeners must water only on assigned days.', AMBER),
         ('2', 'Gardeners must not use sprinklers.', AMBER),
         ('3', 'Gardeners may hand-water seedlings any day.', AMBER),
         ('4', 'Violators lose watering privileges for a week.', RED)]
for i, (n, s, edge) in enumerate(split):
    y = 2.0 + i * 0.92
    conn(sl, 5.15, 3.8, 5.95, y + 0.36, INK, 1.25, arrow=True)
    box(sl, 6.0, y, 6.6, 0.72, fill=WHITE, line=edge, lw=2)
    txt(sl, n, 6.15, y, 0.4, 0.72, size=20, bold=True, anchor=MSO_ANCHOR.MIDDLE)
    txt(sl, s, 6.6, y, 5.9, 0.72, size=16, anchor=MSO_ANCHOR.MIDDLE)
txt(sl, 'Split apart, each sentence can be read, argued about, and changed by itself. Now the questions have something to hold on to: is 1 really a MUST NOT? Is 3 an exception to 1? Who carries out 4?',
    0.7, 5.95, 12, 0.9, size=16)
footer(sl)
notes(sl, 'The checker does this split automatically and says so. Sentence 4 is drawn in red because it is a loose consequence: nobody is named to carry it out.')

# ── 6 · What the checker asks ───────────────────────────────────────────────
sl = slide()
kicker(sl, 'What it catches')
title(sl, 'The checker asks, in plain words')
items = [
    ('A MUST NOT in disguise', '"Must water only on assigned days" means "must not water on other days". Which do you mean?'),
    ('A clash', 'One sentence limits watering, another allows hand-watering. Is it an exception? Add "unless …".'),
    ('A penalty nobody carries out', 'Name who does it: "The ___ must see that rule breakers lose watering."'),
    ('No OR ELSE', 'It holds only as long as goodwill holds. Is there an agreed consequence?'),
    ('A role nobody created', 'The keeper enforces the rules, but nothing says how the keeper is chosen.'),
    ('Words people read differently', '"Promptly", "reasonable", "as needed". How much, how often, by when?'),
    ('Soft words', '"Should" is softer than MUST. Which do you mean?'),
    ('Missing people', '"Fees must be paid": who pays? "They": who are they?'),
]
for i, (h, b) in enumerate(items):
    c, r = i % 4, i // 4
    card(sl, 0.7 + c * 3.03, 1.95 + r * 2.35, 2.85, 2.15, h, b, headsize=15, bodysize=13.5)
footer(sl)
notes(sl, 'Every question comes with a "Leave as is" button. The checker asks; the group decides.')

# ── 7 · Screenshot: questions to settle ─────────────────────────────────────
sl = slide()
kicker(sl, 'On screen')
title(sl, 'Questions to settle, one sentence at a time')
picture(sl, os.path.join(SHOTS, '01-check-and-questions.png'), 0.7, 1.85, 7.2, 4.9)
bl = [('Paste the agreement', 'Write it the way you\'d say it. Press Check.'),
      ('Read each question aloud', 'Orange items need settling. Blue items are notes.'),
      ('Settle it or leave it', '"Leave as is" once the group has talked it over.')]
for i, (h, b) in enumerate(bl):
    y = 1.95 + i * 1.6
    shape(sl, MSO_SHAPE.OVAL, 8.35, y, 0.55, 0.55, fill=BLUE, line=None)
    txt(sl, str(i + 1), 8.35, y, 0.55, 0.55, size=18, bold=True, color=WHITE, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, margin=0)
    txt(sl, h, 9.1, y - 0.05, 3.6, 0.45, size=18, bold=True)
    txt(sl, b, 9.1, y + 0.4, 3.6, 0.9, size=15)
footer(sl)
notes(sl, 'The garden bylaw as written: one note (the split) and three questions.')

# ── 8 · Screenshot: a sentence card ─────────────────────────────────────────
sl = slide()
kicker(sl, 'On screen')
title(sl, 'Every guess is a box you can change')
picture(sl, os.path.join(SHOTS, '03-agreed-rule-card.png'), 0.7, 1.85, 7.6, 4.9)
leg = [(GREEN, None, WHITE, 'Answered'), (AMBER, MSO_LINE_DASH_STYLE.DASH, AMB_LT, 'Needs an answer'),
       (GREY, MSO_LINE_DASH_STYLE.DASH, WHITE, 'Optional: fine blank')]
for i, (c, d, f, t) in enumerate(leg):
    y = 2.0 + i * 0.75
    box(sl, 8.75, y, 1.0, 0.45, fill=f, line=c, lw=2.25, dash=d)
    txt(sl, t, 9.95, y - 0.02, 3.0, 0.5, size=17, bold=True, anchor=MSO_ANCHOR.MIDDLE)
txt(sl, 'The checker guesses from word patterns, and it will sometimes be wrong. Type over any guess. The questions, the label, and the rewritten agreement update as you type.',
    8.75, 4.4, 3.95, 2.2, size=15)
footer(sl)
notes(sl, 'Sentence 1 of the fixed bylaw. OR ELSE says "carried by sentence 4" because the keeper\'s duty backs it.')

# ── 9 · An OR ELSE needs someone ────────────────────────────────────────────
sl = slide()
kicker(sl, 'What makes a consequence agreed', RED)
title(sl, 'An OR ELSE needs someone to carry it out')
chain = [('NO SPRINKLERS', 'Gardeners must not water their plots with sprinklers when the tank is below half.', GREEN, 'AGREED RULE'),
         ("KEEPER'S DUTY", 'The water keeper must suspend watering for one week for any gardener who breaks these rules.', AMBER, 'SHARED EXPECTATION'),
         ('CHOOSING THE KEEPER', 'Each spring, a water keeper must be chosen from the garden members.', PURPLE, 'CREATING AGREEMENT')]
for i, (h, b, c, lab) in enumerate(chain):
    x = 0.7 + i * 4.2
    box(sl, x, 2.1, 3.2, 2.6, fill=WHITE, line=INK, lw=2.5)
    txt(sl, h, x + 0.2, 2.25, 2.8, 0.45, size=17, bold=True)
    txt(sl, b, x + 0.2, 2.75, 2.8, 1.3, size=14)
    box(sl, x + 0.2, 4.12, 2.8, 0.4, fill=WHITE, line=c, lw=2)
    txt(sl, lab, x + 0.2, 4.12, 2.8, 0.4, size=11.5, bold=True, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, margin=0)
    if i < 2:
        conn(sl, x + 3.3, 3.4, x + 4.1, 3.4, RED, 3, MSO_LINE_DASH_STYLE.DASH, arrow=True)
        txt(sl, 'backed by', x + 3.22, 2.95, 0.96, 0.35, size=11.5, bold=True, color=RED, align=PP_ALIGN.CENTER, margin=0)
txt(sl, 'A rule is agreed only when another sentence names who applies the consequence, and that role is itself created by the group. The keeper\'s duty has no OR ELSE of its own: at some point a group trusts someone. The checker points this out once, and lets the group decide.',
    0.7, 5.1, 12, 1.4, size=16)
footer(sl)
notes(sl, 'Ostrom calls this vertical nesting: the Or else of one statement is itself a statement. In plain words, "backed by".')

# ── 10 · How strong is each sentence ────────────────────────────────────────
sl = slide()
kicker(sl, 'The labels')
title(sl, 'Leave a question blank and the agreement weakens', size=32)
rungs = [('AGREED RULE', GREEN, 'MUST or MUST NOT, with an OR ELSE, and someone named to carry it out.', 'Ostrom: rule'),
         ('SHARED EXPECTATION', AMBER, 'MUST, MAY, or MUST NOT, with nothing backing it. Holds as long as goodwill does.', 'Ostrom: norm'),
         ('SHARED HABIT', GREY, 'No MUST, MAY, or MUST NOT. Just who does what, and when.', 'Ostrom: shared strategy')]
for i, (h, c, b, o) in enumerate(rungs):
    x = 0.7 + i * 4.2
    box(sl, x, 2.1, 3.3, 2.7, fill=WHITE, line=c, lw=3.5)
    txt(sl, h, x + 0.25, 2.3, 2.85, 0.45, size=19, bold=True)
    txt(sl, b, x + 0.25, 2.85, 2.85, 1.4, size=15)
    txt(sl, o, x + 0.25, 4.25, 2.85, 0.4, size=13, italic=True, color=GREY)
    if i < 2:
        conn(sl, x + 3.4, 3.45, x + 4.1, 3.45, GREY, 2.5, arrow=True)
        txt(sl, 'no OR ELSE' if i == 0 else 'no MUST', x + 3.3, 3.55, 0.9, 0.5, size=10.5, bold=True, color=GREY, align=PP_ALIGN.CENTER, margin=0)
box(sl, 0.7, 5.15, 11.9, 1.25, fill=TINT, line=None)
txt(sl, 'None of these is wrong. Plenty of good agreements are shared expectations. The label shows the group what it has actually agreed to, so nobody is surprised later. A fourth label, CREATING AGREEMENT, marks sentences that set up a role, group, or thing.',
    0.95, 5.25, 11.4, 1.05, size=15)
footer(sl)
notes(sl, 'A permission is always a shared expectation: it cannot be broken, so it needs no OR ELSE.')

# ── 11 · The drawing ────────────────────────────────────────────────────────
sl = slide()
kicker(sl, 'Take it with you')
title(sl, 'Rewritten, drawn, and shared')
picture(sl, os.path.join(SHOTS, '07-graph-export.png'), 0.7, 1.85, 7.6, 4.9)
out = [('Rewritten', 'The agreement rebuilt from your answers, one MUST per sentence, ready to read aloud.'),
       ('Drawn', 'Opens in the RCN Graph Tool: each sentence with its answers, red arrows for what backs what.'),
       ('Shared', 'Copy a link that carries the text, or save the drawing as a file.'),
       ("Ostrom's coding", 'One click away on every sentence, for anyone who wants to check the translation.')]
for i, (h, b) in enumerate(out):
    y = 1.95 + i * 1.2
    txt(sl, h, 8.75, y, 3.9, 0.4, size=17, bold=True)
    txt(sl, b, 8.75, y + 0.38, 3.9, 0.8, size=14)
footer(sl)
notes(sl, 'The fixed garden bylaw as the Graph Tool draws it.')

# ── 12 · Running a session, and honest limits ───────────────────────────────
sl = slide()
kicker(sl, 'Using it well')
title(sl, 'Run it with the group, not for them')
steps = ['Put it on a screen everyone can see. One person types.',
         'Paste the agreement as it stands, warts and all.',
         'Work down the questions one at a time. Read each aloud.',
         'When the group disagrees, the question has found something.',
         'Read the rewritten agreement aloud before anyone agrees.']
for i, s in enumerate(steps):
    y = 2.0 + i * 0.78
    shape(sl, MSO_SHAPE.OVAL, 0.7, y, 0.5, 0.5, fill=BLUE, line=None)
    txt(sl, str(i + 1), 0.7, y, 0.5, 0.5, size=16, bold=True, color=WHITE, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, margin=0)
    txt(sl, s, 1.4, y - 0.02, 5.6, 0.6, size=16, anchor=MSO_ANCHOR.MIDDLE)
box(sl, 7.5, 2.0, 5.1, 4.1, fill=TINT, line=None)
txt(sl, 'WHAT IT DOES NOT DO', 7.8, 2.15, 4.6, 0.35, size=12, bold=True, color=GREY)
lim = ['It reads English word patterns, not meaning. Check every guess.',
       'It sees only the text you give it: not older bylaws or state law.',
       'It checks whether an agreement is complete and clear, not whether it is fair.',
       'It never rewrites your agreement for you. The rewrite is built from your answers.']
for i, s in enumerate(lim):
    txt(sl, '—  ' + s, 7.8, 2.6 + i * 0.85, 4.6, 0.8, size=14.5)
footer(sl)
notes(sl, 'The checker asks; the people decide.')

# ── 13 · Close ──────────────────────────────────────────────────────────────
sl = slide(TINT)
txt(sl, 'Open it, paste your agreement,\nand read the first question aloud.', 0.9, 1.7, 11.5, 1.8, size=38, bold=True)
txt(sl, 'tools/agreement-checker.html\nIntroduction: tools/agreement-checker-intro.html\nUser Manual: tools/agreement-checker-manual.html',
    0.9, 3.75, 11.5, 1.4, size=18)
txt(sl, 'Built on Crawford and Ostrom, "A Grammar of Institutions" (1995), and Frantz and Siddiki, Institutional Grammar 2.0 (2021).',
    0.9, 5.35, 11.5, 0.5, size=14, color=GREY)
txt(sl, ATTRIB, 0.9, 6.3, 11.5, 0.4, size=16, bold=True)
notes(sl, 'Marc Pierson and Claude Opus 5.5, September 2026.')

out = os.path.join(TOOLS, 'rcn-agreement-checker-intro.pptx')
prs.save(out)
print('wrote', os.path.normpath(out), N[0], 'slides')
