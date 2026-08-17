"""
Generate tools/rcn-graph-tool-intro.pptx — the RCN Graph Tool intro deck (15 slides).

Companion to tools/graph-tool-intro.html; same argument, deck shape.
Regenerate after editing:  python3 docs/make_graph_tool_intro_pptx.py
Requires: pip install python-pptx

PROVENANCE. This script was reconstructed on 2026-08-12 from the .pptx itself,
which until then had no generator in the repo — every earlier change was made by
hand or by a one-off patch script that read the binary, guessed the pattern, and
hoped the text fit. The reconstruction reproduces the deck as it stood after the
presentation-view slide landed. From here the script is the source of truth: edit
it, re-run it, and let it overwrite the .pptx. Do not hand-edit the .pptx, or the
next run silently discards the edit.

The reconstruction was verified by comparing all 223 shapes of the regenerated
deck against the original: slide, shape type, fill, geometry, and every run's
text, size, bold, italic, colour and alignment. Five shapes on slide 10 differ
in one respect — the original carried a 6pt space-after on single-paragraph
boxes (the title, two headings, two intro lines), which adds trailing space
below the last line inside a top-anchored auto-fit box and so renders
identically. That artifact is not reproduced here.

DESIGN. Every slide is drawn from primitives — there are no layout placeholders,
so nothing inherits a size or colour from a master. Two patterns carry most of
the deck: `rows()` (one full-width white card per point, slides 5 and 12) and a
2x2 or 3x2 grid of cards (slides 7, 11, 13, 14). Header bar colour is the slide's
subject: teal is the tool itself, purple CLD, orange NRM/legend, blue Wardley and
neighborhoods, slate for the neutral ones.

The theme is python-pptx's default (Calibri, Office Theme) — the original was
built that way, and no run in the deck names a font, so every size below is a
point size against Calibri. Check line counts if you lengthen body text: the row
cards on slides 5 and 12 hold two lines of 13pt across 11.8in, and no more.
"""

import os

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

# ── Palette ──────────────────────────────────────────────────────────────────
TEAL   = RGBColor(0x0F, 0x76, 0x6E)   # the tool itself
TEAL_LT= RGBColor(0xF0, 0xFD, 0xFA)   # text on teal or on slate
SLATE  = RGBColor(0x0F, 0x17, 0x2A)   # near-black, and the dark panels
OFF    = RGBColor(0xF8, 0xFA, 0xFC)   # slide background
WHITE  = RGBColor(0xFF, 0xFF, 0xFF)
BODY   = RGBColor(0x33, 0x41, 0x55)   # body copy
MUTED  = RGBColor(0x47, 0x55, 0x69)   # labels, captions
PURPLE = RGBColor(0x6B, 0x21, 0xA8)   # CLD
GREEN  = RGBColor(0x16, 0x6A, 0x34)   # EIP
RED    = RGBColor(0x99, 0x1B, 0x1B)   # NRM
BLUE   = RGBColor(0x1D, 0x4E, 0xD8)   # Trace, Wardley, neighborhoods
ORANGE = RGBColor(0xC2, 0x41, 0x0C)   # NRM slide, legend slide
LGREY  = RGBColor(0x94, 0xA3, 0xB8)
CBGREY = RGBColor(0xCB, 0xD5, 0xE1)

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
BLANK = prs.slide_layouts[6]


# ── Primitives ───────────────────────────────────────────────────────────────
def rect(slide, x, y, w, h, color):
    sh = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x), Inches(y),
                                Inches(w), Inches(h))
    sh.fill.solid()
    sh.fill.fore_color.rgb = color
    sh.line.fill.background()
    return sh


def txt(slide, text, x, y, w, h, size, color,
        bold=False, italic=False, align=PP_ALIGN.LEFT):
    """One paragraph. Newlines inside `text` are line breaks, not paragraphs."""
    tb = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
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
    return tb


def block(slide, lines, x, y, w, h, size, color,
          space_before=None, space_after=None, accent=None):
    """A stack of paragraphs. A line given as (text, 'head') is bold in `accent`."""
    tb = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = True
    for i, line in enumerate(lines):
        head = isinstance(line, tuple)
        text = line[0] if head else line
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        if space_before is not None:
            p.space_before = Pt(space_before)
        if space_after is not None:
            p.space_after = Pt(space_after)
        r = p.add_run()
        r.text = text
        r.font.size = Pt(size)
        r.font.bold = bool(head)
        r.font.color.rgb = accent if head else color
    return tb


def slide_base(title, accent, title_size=28, title_top=0.15, title_h=0.8):
    """Background, coloured header bar, slide title. Every interior slide."""
    s = prs.slides.add_slide(BLANK)
    rect(s, 0, 0, 13.33, 7.5, OFF)
    rect(s, 0, 0, 13.33, 1.1, accent)
    txt(s, title, 0.5, title_top, 12.3, title_h, title_size, WHITE, bold=True)
    return s


def card(slide, x, y, w, h, color=WHITE):
    return rect(slide, x, y, w, h, color)


def rows(slide, items, accent, top=2.1, step=1.25, head_w=3.5):
    """Full-width white cards, one per point: heading + one body paragraph.
    Body holds two lines of 13pt across 11.8in — check before lengthening.
    `head_w` only has to clear the longest heading; widen it rather than let
    a heading wrap onto the body line."""
    for i, (head, body) in enumerate(items):
        y = top + i * step
        card(slide, 0.5, y, 12.3, 1.1)
        txt(slide, head, 0.7, y + 0.06, head_w, 0.5, 14, accent, bold=True)
        txt(slide, body, 0.7, y + 0.5, 11.8, 0.55, 13, BODY)


def badge(slide, n, x, y):
    """Numbered square for the Getting started steps."""
    sh = rect(slide, x, y, 0.55, 0.55, TEAL)
    tf = sh.text_frame
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = str(n)
    r.font.size = Pt(16)
    r.font.bold = True
    r.font.color.rgb = WHITE


# ── 1. Title ─────────────────────────────────────────────────────────────────
s = prs.slides.add_slide(BLANK)
rect(s, 0, 0, 13.33, 7.5, TEAL)
rect(s, 0, 5.8, 13.33, 0.08, WHITE)
txt(s, 'RCN Graph Diagramming Tool', 0.7, 1.4, 11.9, 1.2, 46, WHITE,
    bold=True, align=PP_ALIGN.CENTER)
txt(s, 'Thinking Clearly About Neighborhoods', 0.7, 2.75, 11.9, 0.8, 26,
    TEAL_LT, align=PP_ALIGN.CENTER)
txt(s, 'A free, browser-based tool for community systems mapping',
    0.7, 3.55, 11.9, 0.6, 18, TEAL_LT, align=PP_ALIGN.CENTER)
txt(s, 'ReLocalize Creativity Network  ·  Open source  ·  Free by design  ·  June 2026',
    0.7, 6.1, 11.9, 0.5, 13, TEAL_LT, align=PP_ALIGN.CENTER)

# ── 2. The problem ───────────────────────────────────────────────────────────
s = slide_base('Most neighborhood diagrams are just decorated boxes', SLATE)
txt(s, 'The Problem', 0.5, 1.3, 4.0, 0.4, 13, MUTED, bold=True)
block(s, [
    'A PowerPoint arrow between "Community" and "Health Outcome" has no meaning.\n'
    'It could mean causes, contains, funds, measures, or a dozen other things.',
    'Two people look at the same diagram and walk away with different understandings.',
    'The diagram looks like analysis but is actually ambiguous decoration.',
    'Moving one node means manually re-routing every connected arrow.',
    'You cannot query it, export it to a database, or detect feedback loops.',
], 0.7, 1.85, 12.0, 5.0, 19, SLATE, space_before=4)

# ── 3. What it does differently ──────────────────────────────────────────────
s = slide_base('What the RCN Graph Tool does differently', TEAL)
PILLARS = [
    (0.4, 0.6, 'Structured data\nfrom the first click',
     'Every node and edge is data. Nodes carry labels, properties, and notes. '
     'Edges know their source and target. Nothing is a decoration.'),
    (4.7, 4.9, 'Multiple analytical\nlenses on one diagram',
     'Causal loops, OPM relationships, risk factors, EIP domains, Wardley evolution '
     '— all applied to the same graph without re-drawing it.'),
    (9.0, 9.2, 'No install.\nNo account.\nNo server.',
     'One HTML file. Open it in any browser. Run it offline, on a USB drive, in a '
     'community meeting room with no internet. Use Snapshot export to share a diagram '
     'as a single HTML file — the recipient opens it directly, no JSON companion needed.'),
]
for cx, tx, head, body in PILLARS:
    card(s, cx, 1.3, 4.0, 5.6)
    txt(s, head, tx, 1.5, 3.6, 1.0, 17, TEAL, bold=True)
    txt(s, body, tx, 2.6, 3.6, 4.0, 15, BODY)

# ── 4. Eight modes ───────────────────────────────────────────────────────────
s = slide_base('Analytical modes — one graph', SLATE)
MODES = [
    ('Basic', MUTED, 'General drawing, driver trees, node/edge properties'),
    ('CLD', PURPLE, 'Causal Loop Diagrams — loop detection, polarity propagation, animated causal chains'),
    ('OPM', TEAL, 'Object Process Methodology — typed relationships, OPL sentence export (ISO 19450)'),
    ('EIP', GREEN, 'Ecology · Institutions · Politics column overlay'),
    ('NRM', RED, 'Neighborhood Risk Management — Tripod Beta causal analysis'),
    ('Trace', BLUE, 'Pathway animation — walk an audience through a causal chain step by step'),
    ('Wardley', BLUE, 'Wardley Map grid — evolution axis and value chain positioning'),
    ('LOP', TEAL, 'Linkage of Processes — Deming\'s organization-as-a-system, four labelled bands'),
    ('Layers', MUTED, 'Named layer visibility — show/hide domains without separate diagrams'),
]
for i, (name, color, desc) in enumerate(MODES):
    cx, tx = (0.5, 0.68) if i % 2 == 0 else (6.9, 7.08)
    y = 1.25 + (i // 2) * 1.22
    card(s, cx, y, 6.0, 1.08)
    txt(s, name, tx, y + 0.04, 1.5, 0.45, 14, color, bold=True)
    txt(s, desc, tx, y + 0.44, 5.6, 0.6, 12, BODY)

# ── 5. CLD mode ──────────────────────────────────────────────────────────────
s = slide_base('CLD Mode — Seeing Feedback Loops', PURPLE)
txt(s, 'Neighborhood systems are full of feedback. CLD mode makes loops visible and analyzable.',
    0.6, 1.25, 12.1, 0.6, 17, BODY)
rows(s, [
    ('Automatic loop detection',
     'Every feedback loop is traced and classified as Reinforcing (R) or Balancing (B) '
     'based on the product of edge polarities. Labeled badges appear on the canvas.'),
    ('Animated polarity propagation',
     'Long-press any node, choose ↑ or ↓. The causal effect ripples outward hop by hop '
     '— green for reinforcing, red for balancing. Pause, replay, control speed.'),
    ('Driver trees',
     'Select any variable and open an Effects Tree (what does this affect?) or Causes Tree '
     '(what drives this?) — radial layout to any depth. Unique to this tool.'),
    ('Polarity and delay marks',
     'Edges carry + or − polarity and a delay mark (double bar). These export to Vensim MDL '
     'and XMILE — the diagram becomes the starting point for simulation.'),
], PURPLE)

# ── 6. OPM mode ──────────────────────────────────────────────────────────────
s = slide_base('OPM Mode — Precise Relationships', TEAL)
txt(s, 'Object Process Methodology (ISO 19450 / Dov Dori). Every edge must declare what kind of relationship it is.',
    0.6, 1.2, 12.1, 0.55, 16, BODY)
card(s, 0.4, 1.9, 5.8, 5.1)
txt(s, '10 typed relationships — auto-suggested by the picker',
    0.6, 1.95, 5.4, 0.5, 13, TEAL, bold=True)
block(s, [
    ('Structural (Object → Object)', 'head'),
    '  is part of',
    '  is a type of',
    '  characterizes',
    '  is an instance of  ← new',
    ('Procedural (Object ↔ Process)', 'head'),
    '  handles  ·  required by  ·  consumed by',
    '  yields  ·  affects',
    ('Process → Process', 'head'),
    '  invokes',
], 0.6, 2.55, 5.4, 4.2, 13, BODY, space_before=3, accent=TEAL)

card(s, 6.5, 1.9, 6.4, 5.1, SLATE)
txt(s, 'OPL output — auto-generated from the diagram',
    6.7, 1.98, 6.0, 0.5, 13, TEAL_LT, bold=True)
block(s, [
    'City of Bellingham is an Object.',
    'On Street Business is an Object.',
    'Restaurant is an Object.',
    'Bantam Restaurant is an Object.',
    'Ordering is a Process.',
    'Cooking is a Process.',
    '',
    'City of Bellingham consists of On Street',
    'Business and Waterfront Businesses.',
    'Restaurant is a type of On Street Business.',
    'Bantam Restaurant is an instance of Restaurant.',
    'Bantam Restaurant handles Ordering,',
    'Cooking, and Serving.',
], 6.7, 2.55, 6.0, 4.3, 12.5, TEAL_LT)

# ── 7. The four structural relations ─────────────────────────────────────────
s = slide_base('The four structural relations — being forced to choose clarifies thinking',
                TEAL, title_size=26)
RELATIONS = [
    (0.4, 0.6, 1.25, 'is part of', 'Aggregation-Participation', 'Composition. Part → Whole.',
     '"Engine is part of Car."\n"Ordering is part of Restaurant Operations."'),
    (6.85, 7.05, 1.25, 'is a type of', 'Generalization-Specialization', 'Class hierarchy. Specific → General.',
     '"Restaurant is a type of On Street Business."\n"Failed Barrier is a type of Barrier."'),
    (0.4, 0.6, 4.15, 'characterizes', 'Exhibition-Characterization', 'Feature → Exhibitor.',
     '"Seating Capacity characterizes Restaurant."\nOPL: "Restaurant exhibits Seating Capacity."'),
    (6.85, 7.05, 4.15, 'is an instance of', 'Classification-Instantiation', 'Individual → Class.',
     '"Bantam Restaurant is an instance of Restaurant."\n"This incident is an instance of Theft."'),
]
for cx, tx, y, verb, formal, gloss, example in RELATIONS:
    card(s, cx, y, 6.1, 2.65)
    txt(s, verb, tx, y + 0.1, 5.7, 0.55, 20, TEAL, bold=True)
    txt(s, formal, tx, y + 0.65, 5.7, 0.4, 13, MUTED, bold=True)
    txt(s, gloss, tx, y + 1.0, 5.7, 0.4, 13, BODY)
    txt(s, example, tx, y + 1.42, 5.7, 1.0, 12, SLATE, italic=True)

# ── 8. OPD → OPL ─────────────────────────────────────────────────────────────
s = slide_base('OPD → OPL  The diagram speaks in plain English', TEAL,
               title_top=0.12, title_h=0.85)
txt(s, 'The OPD (Object Process Diagram) and the OPL (Object Process Language) are mirrors. '
       'They are generated from the same data and cannot drift apart.',
    0.6, 1.2, 12.1, 0.6, 16, BODY)
card(s, 0.4, 1.95, 5.9, 5.0, SLATE)
txt(s, 'What you draw in the diagram…', 0.6, 2.02, 5.5, 0.45, 14, TEAL_LT, bold=True)
block(s, [
    'City of Bellingham  —[consists of]→  On Street Business',
    'City of Bellingham  —[consists of]→  Waterfront Businesses',
    'Restaurant  —[is a type of]→  On Street Business',
    'Bantam Restaurant  —[is an instance of]→  Restaurant',
    'Bantam Restaurant  —[handles]→  Ordering',
    'Bantam Restaurant  —[handles]→  Cooking',
    'Bantam Restaurant  —[handles]→  Serving',
], 0.6, 2.6, 5.5, 4.1, 12, TEAL_LT, space_before=5)

card(s, 6.6, 1.95, 6.3, 5.0)
txt(s, '…becomes this OPL text file:', 6.8, 2.02, 5.9, 0.45, 14, TEAL, bold=True)
block(s, [
    'City of Bellingham is an Object.',
    'On Street Business is an Object.',
    'Restaurant is an Object.',
    'Bantam Restaurant is an Object.',
    '',
    'City of Bellingham consists of On Street',
    '  Business and Waterfront Businesses.',
    'Restaurant is a type of On Street Business.',
    'Bantam Restaurant is an instance of Restaurant.',
    'Bantam Restaurant handles Ordering,',
    '  Cooking, and Serving.',
], 6.8, 2.6, 5.9, 4.1, 12.5, SLATE, space_before=5)
txt(s, 'Compound sentences form automatically when the same subject has multiple relations of the same type.',
    0.6, 7.0, 12.1, 0.38, 12, MUTED, italic=True)

# ── 9. NRM & EIP ─────────────────────────────────────────────────────────────
s = slide_base('NRM & EIP — Understanding Risk and Context', ORANGE)
card(s, 0.4, 1.25, 6.0, 5.75)
txt(s, 'NRM Mode — Neighborhood Risk Management', 0.6, 1.35, 5.6, 0.55, 16, ORANGE, bold=True)
txt(s, 'Implements the Tripod Beta accident causation model for community risk analysis.',
    0.6, 1.98, 5.6, 0.5, 13, BODY)
block(s, [
    '• Underlying Causes (dark red) — systemic root factors',
    '• Preconditions (orange) — enabling conditions',
    '• Immediate Causes (salmon) — direct triggers',
    '• Incident Trio — Agent · Object · Event',
    '• Barriers — Failed · Missing · Intact',
    '• Combines with CLD mode for feedback analysis',
    '• Export as NRM→Cypher for Neo4j integration',
], 0.6, 2.6, 5.6, 4.1, 13, SLATE, space_before=4)

card(s, 6.7, 1.25, 6.2, 5.75)
txt(s, 'EIP Mode — Ecology · Institutions · Politics', 6.9, 1.35, 5.8, 0.55, 16, GREEN, bold=True)
txt(s, 'A three-domain overlay for policy and governance analysis.',
    6.9, 1.98, 5.8, 0.5, 13, BODY)
block(s, [
    '• Three labeled columns: Ecology (green), Institutions (purple), Politics (blue)',
    '• Node placement becomes positionally meaningful — drag nodes into their domain',
    '• Pre-assigned color palettes per domain',
    '• Scales and pans with the diagram',
    '• Export to SVG/PNG for presentation and reports',
    '• Useful for: policy mapping, governance design, stakeholder analysis',
], 6.9, 2.6, 5.8, 4.1, 13, SLATE, space_before=4)

# ── 9b. Wardley mode and Rent Band Analysis ──────────────────────────────────
s = slide_base('Wardley mode — where things are, and what is held back', BLUE)
txt(s, 'A Wardley map says where each component sits. Rent Band Analysis adds where it lands '
       'once someone stops paying to hold it there.',
    0.6, 1.25, 12.1, 0.6, 17, BODY)
rows(s, [
    ('Evolution and value chain',
     'Genesis to Commodity across the bottom, visible to buried down the side. Position carries '
     'meaning here, so auto-layout is switched off and dragging is the edit.'),
    ('The shadow and the band',
     'A dashed node marks the forecast position when the pinning stops. The translucent band '
     'between the two is the excess rent, drawn as an object you can point at and measure.'),
    ('The pin and the pressure arrow',
     'A pin names the causal loop holding the component left. The arrow lists the forces pushing '
     'right and the mechanisms resisting, each with what it costs the resistor every year.'),
    ('It survives leaving the tool',
     'Every hover annotation exports into the SVG, so a printed or federated map still answers '
     'the question a rent figure always attracts: says who, and when.'),
], BLUE)

# ── 9c. Maps written by Claude Chat ──────────────────────────────────────────
s = slide_base('Wardley maps written by Claude Chat', BLUE)
txt(s, 'Chat writes the map, the tool draws it, you correct it. Correcting the positions is the analysis.',
    0.6, 1.2, 12.1, 0.5, 17, BODY)
CHAT_STEPS = [
    ('Hand Chat the card',
     'Paste wardley-chat-card.md into a new conversation,\n'
     'then say what you want mapped.'),
    ('Save what comes back',
     'One JSON block. A node needs four fields — id, label,\n'
     'evolution, visibility — so there is little to get wrong.'),
    ('Check it before you open it',
     'node validate-rcn-graph.js yourmap.json\n'
     'Fix anything it calls an ERROR. Warnings are advice.'),
    ('Drag it in, then drag the nodes',
     'IMPORT → JSON. The map opens in Wardley mode itself.\n'
     'Your corrections are written back into the file on export.'),
]
for i, (head, body) in enumerate(CHAT_STEPS):
    cx, bx, tx = (0.4, 0.55, 1.22) if i % 2 == 0 else (6.85, 7.0, 7.67)
    y = 1.85 + (i // 2) * 1.75
    card(s, cx, y, 6.1, 1.6)
    badge(s, i + 1, bx, y + 0.15)
    txt(s, head, tx, y + 0.12, 5.1, 0.45, 15, SLATE, bold=True)
    txt(s, body, tx, y + 0.58, 5.1, 0.9, 13, BODY)
card(s, 0.4, 5.5, 12.55, 1.35, SLATE)
txt(s, 'The one thing that goes badly wrong: which way the evolution axis runs',
    0.7, 5.62, 12.0, 0.4, 15, TEAL_LT, bold=True)
txt(s, 'Two conventions are in circulation and they run opposite ways. RCN and standard Wardley put Commodity on the right; '
       'the Wardley Map Generator\'s own format puts Genesis there. Get it backwards and every commodity renders in Genesis, '
       'looking entirely deliberate. The tool refuses to guess — a file that does not say will not load.',
    0.7, 6.02, 12.0, 0.8, 13, CBGREY)

# ── 10. The legend is the registry ───────────────────────────────────────────
s = slide_base('The legend is the registry', ORANGE)
card(s, 0.4, 1.25, 6.0, 5.75)
txt(s, 'Style by kind, not by element', 0.6, 1.35, 5.6, 0.55, 16, ORANGE, bold=True)
txt(s, 'In most tools the legend is a picture of the colour scheme — kept in sync by hand, '
       'and the first thing to go stale.', 0.6, 1.98, 5.6, 0.5, 13, BODY)
block(s, [
    '• A legend row DEFINES a kind — its fill, border, width, dash',
    '• Nodes and edges follow a row instead of carrying their own styling',
    '• Change the row and every element following it changes at once',
    '• Assign selection puts a selection on a row',
    '• Override one element and it diverges on that property only — still following the row for everything else',
    '• Clear overrides snaps every follower back to the row',
    '• 6–8 kinds is what a group can read; the panel warns above 8, and says how many elements follow no row at all',
], 0.6, 2.7, 5.6, 4.0, 13, SLATE, space_after=6)

card(s, 6.7, 1.25, 6.2, 5.75)
txt(s, 'Exports that describe themselves', 6.9, 1.35, 5.8, 0.55, 16, GREEN, bold=True)
txt(s, 'Styling by registry creates a trap, and the tool closes it on the way out.',
    6.9, 1.98, 5.8, 0.5, 13, BODY)
block(s, [
    '• An element following a row needs no colour of its own to draw correctly',
    '• So a saved file can be perfectly right on screen and look entirely unstyled to anything '
    'that is not this tool — a database projection, a converter, an AI assistant reading it, '
    'a person scanning the JSON',
    '• On export the tool stamps each element’s resolved appearance alongside the row it follows, '
    'so the file says what you saw',
    '• It also settles a contradiction: loading writes dash = solid onto every edge, so a dashed '
    'row drew dashed while the file claimed solid',
    '• The row still wins on reload — the legend stays the single place to restyle',
], 6.9, 2.7, 5.8, 4.0, 13, SLATE, space_after=6)

# ── 11. Export ───────────────────────────────────────────────────────────────
s = slide_base('Export — your diagram lives beyond the tool', SLATE)
EXPORTS = [
    ('Presentation', 'SVG · PNG (2×) · Copy to clipboard · Print',
     'Paste directly into PowerPoint or Google Slides.\n'
     'Export SVG for documents that need to scale.\n'
     'Or show it live: press P for presentation view.'),
    ('Share', 'URL encode · JSON · Snapshot',
     'URL export encodes the full diagram in a link — share it, no file needed.\n'
     'Snapshot downloads one HTML file with the diagram baked in — open in any browser, no companion file.\n'
     'JSON is the lossless save format.'),
    ('Neo4j', 'Cypher CREATE · MATCH import · OPM→Cypher · NRM→Cypher',
     'Design schemas here, paste into Neo4j Browser.\n'
     'Bring live graph data back with MATCH import.'),
    ('OPM text', 'OPM→OPL · OPM→CSV',
     'Plain-text OPL for documentation, CSV triples for\nspreadsheets or other tools.'),
    ('Vensim', 'Export .mdl · Export XMILE · Import .mdl · Import XMILE',
     'Sketch causal structure here, move to Vensim\nfor simulation when ready.'),
    ('Graphviz', 'Export .dot · Import .dot',
     'Full round-trip with the Graphviz / Gephi ecosystem.\nColors, shapes, edge weights all preserved.'),
]
for i, (head, formats, body) in enumerate(EXPORTS):
    cx, tx = (0.4, 0.6) if i % 2 == 0 else (6.85, 7.05)
    y = 1.25 + (i // 2) * 2.0
    card(s, cx, y, 6.1, 1.85)
    txt(s, head, tx, y + 0.1, 2.5, 0.45, 15, TEAL, bold=True)
    txt(s, formats, tx, y + 0.52, 5.7, 0.45, 12, MUTED)
    txt(s, body, tx, y + 1.0, 5.7, 0.75, 12, BODY)

# ── 12. Presentation view ────────────────────────────────────────────────────
s = slide_base('Presenting — hand the whole screen to the graph', TEAL)
txt(s, 'The goal is a picture a group can read together. Presentation view takes away '
       'everything that is not the picture.', 0.6, 1.25, 12.1, 0.6, 17, BODY)
rows(s, [
    ('One key, no chrome',
     'Press P, or click Present. Toolbar, sidebar, search box, mode banners and hint strip '
     'all disappear, the browser goes fullscreen, and the graph is refitted to the whole '
     'window. Escape brings it back at the pan and zoom you left.'),
    ('What stays is the picture',
     'The legend, the EIP columns and the CLD loop labels stay on screen. They belong to the '
     'diagram, not to the tool — so nothing the room needs to read the graph goes away with '
     'the controls.'),
    ('Still live, not a slide',
     'Nothing is read-only: nodes drag, edges draw, labels edit. Run polarity propagation or '
     'a Trace animation in front of the room — those controls are among the few kept on '
     'screen, because a presenter uses them.'),
    ('Hover still answers the question',
     'Notes, properties and source links appear on hover, so a challenge from the room is '
     'answered from the diagram itself rather than from a separate document.'),
], TEAL, head_w=4.2)   # "Hover still answers the question" needs the extra width

# ── 13. What you can map ─────────────────────────────────────────────────────
s = slide_base('What you can map for a neighborhood', BLUE)
USES = [
    ('Commercial district\nsystems',
     'Map businesses by type (OPM: Classification-Instantiation), ownership structure '
     '(Aggregation-Participation), and governance relationships (EIP). Export OPL as documentation.'),
    ('Causal chains in\ncommunity risk',
     'Use NRM mode to trace from Underlying Causes through Preconditions to Incident. '
     'Identify missing or failed barriers. Switch to CLD to find reinforcing loops.'),
    ('Health systems\nmapping',
     'Map service providers (Objects), care processes (Processes), and the relationships between '
     'them. Generate OPL for shared care plan documentation. Export Cypher for database integration.'),
    ('Policy and\ngovernance',
     'Use EIP columns to position stakeholders, institutions, and ecological factors. Use Triples '
     'to attach agreements or interventions to specific causal links. Animate pathways with Trace '
     'mode for presentations.'),
]
for i, (head, body) in enumerate(USES):
    cx, tx = (0.4, 0.6) if i % 2 == 0 else (6.85, 7.05)
    y = 1.25 + (i // 2) * 2.9
    card(s, cx, y, 6.1, 2.65)
    txt(s, head, tx, y + 0.1, 5.7, 0.8, 18, BLUE, bold=True)
    txt(s, body, tx, y + 0.95, 5.7, 1.6, 13, BODY)

# ── 14. Getting started ──────────────────────────────────────────────────────
s = slide_base('Getting started — in under 5 minutes', TEAL)
STEPS = [
    ('Open the file',
     'Open graph-tool-v22.html in any modern browser.\n'
     'No install. No account. No internet required after loading.'),
    ('Set a model name',
     'Type a name in the Model Name field at the top of the sidebar.\n'
     'This becomes the filename for all exports.'),
    ('Place nodes',
     'Click + Node, then click the canvas to place it.\n'
     'Double-tap to type a label. Press n for sticky Node mode.'),
    ('Draw edges',
     'Click + Edge, then drag from source to target.\n'
     'Press e for sticky Edge mode to chain many edges quickly.'),
    ('Choose a mode',
     'Click CLD for feedback loop analysis, OPM for typed relationships,\n'
     'NRM for risk mapping, or EIP for domain overlay.'),
    ('Export',
     'Export JSON to save. SVG/PNG for presentation.\n'
     'Press P to present the graph itself, full screen.\n'
     'URL to share as a link. Snapshot to share as a single file.\n'
     'OPM→OPL for plain-text documentation.'),
]
for i, (head, body) in enumerate(STEPS):
    cx, bx, tx = (0.4, 0.55, 1.22) if i % 2 == 0 else (6.85, 7.0, 7.67)
    y = 1.3 + (i // 2) * 1.95
    card(s, cx, y, 6.1, 1.8)
    badge(s, i + 1, bx, y + 0.15)
    txt(s, head, tx, y + 0.12, 5.1, 0.45, 15, SLATE, bold=True)
    txt(s, body, tx, y + 0.6, 5.1, 1.0, 13, BODY)

# ── 15. Close ────────────────────────────────────────────────────────────────
s = prs.slides.add_slide(BLANK)
rect(s, 0, 0, 13.33, 7.5, SLATE)
rect(s, 0, 5.8, 13.33, 0.08, TEAL)
txt(s, 'Free. Open source. One file.', 0.7, 1.5, 11.9, 0.9, 42, WHITE,
    bold=True, align=PP_ALIGN.CENTER)
txt(s, 'The RCN Graph Tool is the only free, browser-based tool that combines\n'
       'Neo4j data modeling · Causal Loop Diagrams · OPM typed relationships · OPL export\n'
       'Tripod Beta risk analysis · EIP overlay · Wardley mapping and rent bands · Pathway animation\n'
       '— all in a single HTML file, on the same graph.',
    0.7, 2.65, 11.9, 1.8, 17, CBGREY, align=PP_ALIGN.CENTER)
txt(s, 'graph-tool-v22.html  ·  Introduction: graph-tool-intro.html  ·  Manual: graph-tool-manual.html',
    0.7, 4.75, 11.9, 0.5, 14, TEAL, align=PP_ALIGN.CENTER)
txt(s, 'ReLocalize Creativity Network  ·  Open source  ·  Free by design',
    0.7, 6.1, 11.9, 0.5, 13, LGREY, align=PP_ALIGN.CENTER)


here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(here, '..', 'tools', 'rcn-graph-tool-intro.pptx')
prs.save(out)
print('Wrote', os.path.normpath(out), '—', len(prs.slides._sldIdLst), 'slides')
