"""
Generate tools/rcn-table-intro.pptx — the RCN Table deck (15 slides).

FOR NDC MEMBERS AND ORDINARY USERS. Not the architecture talk: no substrate, no
slugs, no comparison with other products. What the table is, how to use it, and
how it hands you to a drawing. Anyone who has used a spreadsheet should be able
to follow every slide.

Companion to tools/rcn-table-intro.html and rcn-table-manual.html, same argument
in deck shape. Regenerate after editing:  python3 docs/make_rcn_table_pptx.py
Requires: pip install python-pptx

Primitives, palette and slide geometry are lifted from
docs/make_graph_tool_intro_pptx.py so the two decks read as one family. Every
slide is drawn from shapes — no layout placeholders, so nothing inherits a size
or colour from a master.

python-pptx does NOT tell you when text overflows its box; it just renders past
the edge. The row cards hold two lines of 13pt across 11.8in and no more. After
any edit, render the deck and look at it — Keynote will export a PDF from the
command line. Do not call this deck done from the generator alone.
"""

import os

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

# ── Palette ──────────────────────────────────────────────────────────────────
TEAL   = RGBColor(0x0F, 0x76, 0x6E)   # the tool itself
TEAL_LT= RGBColor(0xF0, 0xFD, 0xFA)
SLATE  = RGBColor(0x0F, 0x17, 0x2A)
OFF    = RGBColor(0xF8, 0xFA, 0xFC)
WHITE  = RGBColor(0xFF, 0xFF, 0xFF)
BODY   = RGBColor(0x33, 0x41, 0x55)
MUTED  = RGBColor(0x47, 0x55, 0x69)
PURPLE = RGBColor(0x6B, 0x21, 0xA8)   # the drawing it hands you to
BLUE   = RGBColor(0x1D, 0x4E, 0xD8)   # the wiki page
ORANGE = RGBColor(0xC2, 0x41, 0x0C)   # comparison, the standout idea
GREEN  = RGBColor(0x16, 0x6A, 0x34)
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
    s = prs.slides.add_slide(BLANK)
    rect(s, 0, 0, 13.33, 7.5, OFF)
    rect(s, 0, 0, 13.33, 1.1, accent)
    txt(s, title, 0.5, title_top, 12.3, title_h, title_size, WHITE, bold=True)
    return s


def card(slide, x, y, w, h, color=WHITE):
    return rect(slide, x, y, w, h, color)


def rows(slide, items, accent, top=2.1, step=1.25, head_w=3.5):
    for i, (head, body) in enumerate(items):
        y = top + i * step
        card(slide, 0.5, y, 12.3, 1.1)
        txt(slide, head, 0.7, y + 0.06, head_w, 0.5, 14, accent, bold=True)
        txt(slide, body, 0.7, y + 0.5, 11.8, 0.55, 13, BODY)


def grid(slide, items, accent, top=2.0, cols=2, cw=6.0, ch=2.1, gap=0.3):
    """Cards in a grid: (heading, body). Body is two lines at 13pt in 6in."""
    for i, (head, body) in enumerate(items):
        r, c = divmod(i, cols)
        x = 0.5 + c * (cw + gap)
        y = top + r * (ch + gap)
        card(slide, x, y, cw, ch)
        txt(slide, head, x + 0.25, y + 0.15, cw - 0.5, 0.45, 15, accent, bold=True)
        block(slide, [body], x + 0.25, y + 0.68, cw - 0.5, ch - 0.85, 13, BODY)


def step_card(slide, n, head, body, x, y, w=2.95, h=2.5, accent=TEAL):
    card(slide, x, y, w, h)
    sh = rect(slide, x + 0.25, y + 0.22, 0.5, 0.5, accent)
    tf = sh.text_frame
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = str(n)
    r.font.size = Pt(15)
    r.font.bold = True
    r.font.color.rgb = WHITE
    txt(slide, head, x + 0.25, y + 0.85, w - 0.5, 0.4, 15, accent, bold=True)
    block(slide, [body], x + 0.25, y + 1.32, w - 0.5, 1.0, 12.5, BODY)


# ── 1. Title ─────────────────────────────────────────────────────────────────
s = prs.slides.add_slide(BLANK)
rect(s, 0, 0, 13.33, 7.5, TEAL)
rect(s, 0, 5.8, 13.33, 0.08, WHITE)
txt(s, 'RCN Table', 0.7, 1.5, 11.9, 1.2, 52, WHITE, bold=True, align=PP_ALIGN.CENTER)
txt(s, 'Finding the one thing that matters', 0.7, 2.9, 11.9, 0.8, 26, TEAL_LT,
    align=PP_ALIGN.CENTER)
txt(s, 'Look at hundreds of things at once. Pick one. See what it is connected to.',
    0.7, 3.8, 11.9, 0.6, 17, TEAL_LT, align=PP_ALIGN.CENTER)
txt(s, 'RCN Toolset  ·  open source, CC BY 4.0', 0.7, 6.1, 11.9, 0.5, 14, TEAL_LT,
    align=PP_ALIGN.CENTER)

# ── 2. The problem ───────────────────────────────────────────────────────────
s = slide_base('Four hundred things is a picture of nothing', SLATE)
txt(s, 'The 2017 Whatcom survey holds 189 organisations, 127 programmes, '
       '46 themes and 28 people.', 0.5, 1.5, 12.3, 0.6, 18, BODY)
card(s, 0.5, 2.4, 6.0, 3.4)
txt(s, 'Drawn all at once', 0.75, 2.6, 5.5, 0.5, 16, RGBColor(0x99, 0x1B, 0x1B), bold=True)
block(s, ['409 things joined by 770 lines.',
          'Every line crosses every other one.',
          'No amount of zooming helps.',
          'You cannot find anything in it.'],
      0.75, 3.2, 5.5, 2.4, 14, BODY, space_after=8)
card(s, 6.8, 2.4, 6.0, 3.4)
txt(s, 'Read as a list', 7.05, 2.6, 5.5, 0.5, 16, GREEN, bold=True)
block(s, ['Sort by whatever you care about.',
          'Type a word to narrow it down.',
          'Notice one funder beside 32 rows.',
          'You find the thing in seconds.'],
      7.05, 3.2, 5.5, 2.4, 14, BODY, space_after=8)
txt(s, 'The table is how you find it. The drawing is what happens next.',
    0.5, 6.1, 12.3, 0.6, 17, TEAL, bold=True, align=PP_ALIGN.CENTER)

# ── 3. Two questions ─────────────────────────────────────────────────────────
s = slide_base('Two different questions', SLATE)
grid(s, [
    ('A table answers:  which one?',
     'Scan, sort, filter, compare. Hundreds of rows at a glance, so you can pick '
     'the row that matters.'),
    ('A drawing answers:  connected to what?',
     'One thing in the middle, everything it touches around it, every line saying '
     'what the relationship is.'),
], TEAL, top=1.6, ch=2.3)
card(s, 0.5, 4.5, 12.3, 1.9)
txt(s, 'You almost always need them in that order', 0.75, 4.7, 11.8, 0.5, 16, ORANGE, bold=True)
block(s, ['Asking "connected to what?" before you have answered "which one?" is '
          'exactly what produces the unreadable picture on the last slide.'],
      0.75, 5.25, 11.8, 1.0, 14, BODY)

# ── 4. The loop ──────────────────────────────────────────────────────────────
s = slide_base('The whole thing is four steps', TEAL)
step_card(s, 1, 'Scan', 'Open the table. Sort it. Hide the columns that are '
                        'mostly empty. Type a word to filter.', 0.5, 1.6)
step_card(s, 2, 'Select', 'Click a row. Everything known about it appears on the '
                          'right.', 3.7, 1.6)
step_card(s, 3, 'Follow', 'Press Neighbourhood. That row becomes a drawing of '
                          'what it touches.', 6.9, 1.6, accent=PURPLE)
step_card(s, 4, 'Or place it', 'Press Map instead and the same rows appear on the '
                              'ground.', 10.1, 1.6, accent=GREEN)
card(s, 0.5, 4.5, 12.3, 1.9)
txt(s, 'You never draw the whole graph', 0.75, 4.7, 11.8, 0.5, 16, TEAL, bold=True)
block(s, ['You arrive at a small, specific picture because you asked for it — '
          'starting from a row you chose out of a list.'],
      0.75, 5.25, 11.8, 1.0, 14, BODY)

# ── 5. The screen ────────────────────────────────────────────────────────────
s = slide_base('Where everything is', SLATE)
rows(s, [
    ('Top bar', 'Two dropdowns choose which records and which kind of thing. Then a '
                'filter box, the row count, and the buttons.'),
    ('Main area', 'The rows. The first column is the name, and it is a link you can click.'),
    ('Right, top', 'The Inspector — everything known about whatever you have selected.'),
    ('Right, bottom', 'The Columns list, with a tick box and a fullness percentage for each.'),
    ('Bottom strip', 'Which records, how many columns are showing, how many rows selected.'),
], TEAL, top=1.5, step=1.1, head_w=2.6)

# ── 6. Finding a row ─────────────────────────────────────────────────────────
s = slide_base('Finding a row', TEAL)
grid(s, [
    ('Filter', 'Type in the box. It matches anywhere in any column you can see. The '
               'count becomes "24 of 189" so you know you are looking at a subset.'),
    ('Sort', 'Click a heading to sort, click again to reverse. Numbers sort as numbers, '
             'text alphabetically. You do not have to say which is which.'),
    ('Fullness', 'Hover a heading: "category — 28% filled". Real records are patchy, '
                 'and it is better to know it than to guess.'),
    ('Careful', 'Hiding a column also removes it from the filter. If a search is not '
                'finding something you know is there, check the column is showing.'),
], TEAL, top=1.6, ch=2.35)

# ── 7. One row selected ──────────────────────────────────────────────────────
s = slide_base('Select one row: what is this?', TEAL)
txt(s, 'Click any row. The panel on the right fills with everything known about it.',
    0.5, 1.5, 12.3, 0.6, 18, BODY)
card(s, 0.5, 2.3, 12.3, 3.4)
txt(s, 'Inspector', 0.8, 2.5, 4.0, 0.5, 15, TEAL, bold=True)
block(s, [('Name', 'head'), 'whatcom community foundation',
          ('sources', 'head'), 'ENTITY, PROGRAM',
          ('sector', 'head'), 'NGO',
          ('website', 'head'), 'http://www.whatcomcf.org/'],
      0.8, 3.05, 11.7, 2.5, 13, BODY, accent=MUTED, space_after=2)
txt(s, 'Attributes that are empty for this row are simply not shown.',
    0.5, 6.0, 12.3, 0.5, 15, MUTED, italic=True)

# ── 8. Several rows: the comparison ──────────────────────────────────────────
s = slide_base('Select several: what do they have in common?', ORANGE)
txt(s, 'Hold Cmd (or Ctrl) and click more rows. The panel keeps the same attributes '
       'and changes what it shows.', 0.5, 1.45, 12.3, 0.7, 17, BODY)
card(s, 0.5, 2.4, 6.0, 3.2)
txt(s, 'Where they agree', 0.75, 2.6, 5.5, 0.5, 15, GREEN, bold=True)
block(s, [('sources', 'head'), 'ENTITY, PERSON',
          ('sector', 'head'), 'Civil Society'],
      0.75, 3.15, 5.5, 2.2, 14, BODY, accent=MUTED, space_after=3)
card(s, 6.8, 2.4, 6.0, 3.2)
txt(s, 'Where they differ', 7.05, 2.6, 5.5, 0.5, 15, RGBColor(0x99, 0x1B, 0x1B), bold=True)
block(s, [('Name', 'head'), '[...] 2 values',
          ('website', 'head'), '[...] 2 values'],
      7.05, 3.15, 5.5, 2.2, 14, BODY, accent=MUTED, space_after=3)
txt(s, 'Thirty-four columns collapse to the four that carry the answer.',
    0.5, 6.0, 12.3, 0.6, 17, ORANGE, bold=True, align=PP_ALIGN.CENTER)

# ── 9. Columns ───────────────────────────────────────────────────────────────
s = slide_base('Patchy records, shown honestly', SLATE)
rows(s, [
    ('Every column is listed', 'With a tick box and how full it is. Untick to hide, '
                               'tick to bring it back.'),
    ('Thin ones start hidden', 'A column filled for fewer than one row in ten is out of '
                               'the way — but still listed, never dropped.'),
    ('Nothing is invented', 'An empty cell stays empty. The table does not guess, average '
                            'or fill anything in for you.'),
    ('Empty can still matter', 'A column empty for most rows may be exactly the one that '
                               'matters for the row you care about. So you can always show it.'),
], TEAL, top=1.7, step=1.25, head_w=3.4)

# ── 10. In a wiki page ───────────────────────────────────────────────────────
s = slide_base('The table inside a page', BLUE)
txt(s, 'A wiki page is far too narrow for 189 rows, so the page shows the shape of the '
       'table instead.', 0.5, 1.45, 12.3, 0.7, 17, BODY)
card(s, 0.5, 2.3, 5.4, 3.3)
txt(s, 'whatcom · Entity', 0.8, 2.55, 3.4, 0.4, 13, SLATE, bold=True)
txt(s, '189×6', 4.05, 2.45, 1.6, 0.6, 26, TEAL, bold=True, align=PP_ALIGN.RIGHT)
txt(s, 'Name   sources   address   category', 0.8, 3.1, 4.8, 0.4, 11, MUTED)
block(s, ['Bellingham Neighborhood Association', 'Bellingham School District',
          'Family Care Network'],
      0.8, 3.6, 4.8, 1.2, 12, BLUE, space_after=2)
rect(s, 2.1, 4.95, 2.2, 0.42, TEAL)
txt(s, 'Open Table', 2.1, 5.02, 2.2, 0.35, 12, WHITE, bold=True, align=PP_ALIGN.CENTER)
for i, (head, body) in enumerate([
    ('The dimensions, not the grid', 'Big type says how much there is. The column names '
                                     'are chips, the first rows are links.'),
    ('Hover a column name', 'Any chart on the same page responds to it. Nothing had to be '
                            'wired up for that to work.'),
]):
    y = 2.3 + i * 1.75
    card(s, 6.9, y, 5.9, 1.55)
    txt(s, head, 7.15, y + 0.15, 5.4, 0.4, 15, BLUE, bold=True)
    block(s, [body], 7.15, y + 0.62, 5.4, 0.8, 13, BODY)
txt(s, 'Open Table gives you the whole thing, full width, still tied to the page.',
    0.5, 5.85, 12.3, 0.5, 13, MUTED, italic=True)

# ── 11. Names are links ──────────────────────────────────────────────────────
s = slide_base('Every name is a link', BLUE)
rows(s, [
    ('Click a name', 'That subject opens beside the table — its own page, with whatever '
                     'anyone has written there.'),
    ('Often the page is empty', 'You get an invitation to write one. This is normal, and it '
                                'is useful: it records that the thing was referred to.'),
    ('In the Whatcom records', '55 organisations, themes and people are named by some table '
                              'without ever having a row of their own.'),
    ('Everything agrees', 'A row here, a shape in a drawing, and a name typed in a sentence '
                          'all lead to the same page, because they name the same thing.'),
], BLUE, top=1.7, step=1.25, head_w=3.8)

# ── 12. Neighbourhood ────────────────────────────────────────────────────────
s = slide_base('Follow a row into a picture', PURPLE)
txt(s, 'Select exactly one row and press Neighbourhood. The drawing opens with:',
    0.5, 1.45, 12.3, 0.6, 17, BODY)
grid(s, [
    ('Your row in the middle', 'Drawn with a thick border, so you always know where you '
                               'started from.'),
    ('What it touches, around it', 'One ring of everything directly connected. Colour says '
                                   'what kind of thing each one is.'),
    ('Every line says what it is', 'funded by. part of. addresses. No unlabelled arrows to '
                                   'guess at.'),
    ('One foundation, 32 grants', 'Whatcom Community Foundation and everything it funded — '
                                  'clear, where the whole graph was not.'),
], PURPLE, top=2.15, ch=2.0)
txt(s, 'The button is greyed out unless exactly one row is selected — a neighbourhood '
       'is a picture of one thing.', 0.5, 6.5, 12.3, 0.5, 14, MUTED, italic=True)

# ── 13. Expand and collapse ──────────────────────────────────────────────────
s = slide_base('The picture grows, it is not replaced', PURPLE)
rows(s, [
    ('Expand', 'Click any shape in the drawing and press Expand. Its own connections arrive '
               'and attach to what is already on screen.'),
    ('Nothing is drawn twice', 'If something arriving is already there, the new line goes to '
                               'the shape already on the canvas.'),
    ('So two paths can meet', 'Expand two organisations and a shared funder appears once, '
                              'joined to both. That is the point of growing in place.'),
    ('Collapse', 'Takes back exactly what that expansion brought in, and nothing that was '
                 'there before you pressed Expand.'),
], PURPLE, top=1.7, step=1.25, head_w=3.4)


# ── 13b. The map ─────────────────────────────────────────────────────────────
s = slide_base('The same rows, on the ground', GREEN)
txt(s, 'Select rows and press Map. Unlike Neighbourhood this does not need exactly '
       'one row — a map of many things is the normal case.',
    0.5, 1.45, 12.3, 0.7, 17, BODY)
grid(s, [
    ('Points stay points', 'A person, a building, an NDC. Selected rows are larger and '
                           'amber so you can see what you brought.'),
    ('Areas are drawn as areas', 'A watershed is a shape. Shrinking it to a dot throws '
                                 'away the only thing that made it a place.'),
    ('The links come too', 'A dashed line between two located things, labelled with what '
                           'it is. A map of pins is a picture of coordinates.'),
    ('Nothing is hidden', 'The header says how many rows had no location, rather than '
                          'quietly showing you a smaller world.'),
], GREEN, top=2.25, ch=1.9)
# The second card row ends at 6.45; start the caption below that, not on it.
txt(s, "Leo's NDC draws with lines to the four named areas that contain it — the town, "
       'the county, two watersheds. Nobody typed that in; it was worked out from the shapes.',
    0.5, 6.6, 12.3, 0.6, 14, MUTED, italic=True)

# ── 13c. Where a point came from ─────────────────────────────────────────────
s = slide_base('Where a point on the map came from', SLATE)
rows(s, [
    ('Some were surveyed', 'The location was recorded with the rest of the information. '
                           'That is the strongest kind.'),
    ('Some came from an address', 'Worked out from the street address afterwards. The map '
                                  'records the address it asked about and what was found.'),
    ('Some have none at all', 'Of 42 organisations with an address, 27 were found and 15 '
                              'were not — mostly clinics inside larger buildings.'),
    ('The 15 are left empty', 'No coordinate at all, rather than an approximate one. A '
                              'point you cannot trust is worse than a gap you can see.'),
], GREEN, top=1.7, step=1.25, head_w=4.0)

# ── 14. Getting things out ───────────────────────────────────────────────────
s = slide_base('Taking it with you', TEAL)
grid(s, [
    ('CSV', 'Downloads what you can currently see — after filtering, in the order you '
            'sorted, with only the columns showing. Opens in any spreadsheet.'),
    ('Send to the page', 'Puts the current view back on the wiki page as something others '
                         'can read and follow. Carries up to 200 rows, and says the true total.'),
    ('The address bar', 'Every step you take is in the page address. Paste it to someone and '
                        'they arrive exactly where you are.'),
    ('Nothing is locked in', 'Open source, CC BY 4.0. Your records stay yours, in files you '
                             'can read, on machines you control.'),
], TEAL, top=1.6, ch=2.35)

# ── 15. What it will not do ──────────────────────────────────────────────────
s = slide_base('What it will not do', SLATE)
grid(s, [
    ('It does not change your records', 'Sort, filter, select, follow. Nothing you do in the '
                                        'table can alter the underlying data.'),
    ('It is not a spreadsheet', 'Typing new information in is a different job, with different '
                                'risks, kept deliberately somewhere else.'),
    ('It will not guess', 'Empty stays empty. Two names that might be the same thing are '
                          'reported to you, never quietly merged.'),
    ('It will not hide trouble', 'If the records cannot be reached you get a message, not a '
                                 'blank screen pretending everything is fine.'),
], SLATE, top=1.5, ch=1.95)
card(s, 0.5, 5.95, 12.3, 1.0)
txt(s, 'Start here:  open the table, sort a column, click a row — then Neighbourhood, or Map.',
    0.75, 6.2, 11.8, 0.5, 17, TEAL, bold=True, align=PP_ALIGN.CENTER)

# ── Save ─────────────────────────────────────────────────────────────────────
out = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                   'tools', 'rcn-table-intro.pptx')
prs.save(out)
print('wrote', out, '—', len(prs.slides.__iter__.__self__._sldIdLst), 'slides')
