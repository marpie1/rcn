"""
Generate docs/whatcom-coops-four-lenses.pptx — the Whatcom co-ops seen through
four RCN tools: Map, Graph Tool, Timeline and Table.

Regenerate after editing:
    python3 docs/make_whatcom_coops_pptx.py
Requires: pip install python-pptx

EVERY PICTURE IS A SCREENSHOT of the real tool running on the real data
(docs/assets/whatcom-coops-deck/), taken Sep 28 2026:
  01-03  RCN Map, issue tools/issue-data/whatcom-wa--cooperatives.json
  04     Graph Tool, Marc's own layout (Co-ops-of-Whatcom-County (1).json)
  05-06  RCN Timeline, tools/whatcom-coops-timeline.json
  07-08  RCN Table and its map, reading Neo4j database `whatcomcoops`
         (loaded by substrate/load_coops.py from the same issue file)
Retake the screenshots if the data changes; the captions quote the data.
"""

import os
from PIL import Image
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR

HERE = os.path.dirname(os.path.abspath(__file__))
SHOTS = os.path.join(HERE, 'assets', 'whatcom-coops-deck')
ATTRIB = 'Marc Pierson with Claude Opus 5.5 · September 2026'

# Palette — the co-op kinds' own colours, so the deck matches the pictures.
WORKER = RGBColor(0xc0, 0x39, 0x2b)
CONSUM = RGBColor(0x25, 0x63, 0xeb)
PRODUC = RGBColor(0x8e, 0x5c, 0xc4)
SOCIAL = RGBColor(0xd4, 0xa0, 0x17)
SUPPRT = RGBColor(0x1a, 0x7a, 0x4a)
NETWRK = RGBColor(0xd4, 0x54, 0x9a)
INK    = RGBColor(0x0f, 0x17, 0x2a)
INK2   = RGBColor(0x47, 0x55, 0x69)
INK3   = RGBColor(0x94, 0xa3, 0xb8)
SURF   = RGBColor(0xf8, 0xfa, 0xfc)
BORDER = RGBColor(0xe2, 0xe8, 0xf0)
WHITE  = RGBColor(0xff, 0xff, 0xff)
AMB_LT = RGBColor(0xfe, 0xf3, 0xc7)
AMB_TX = RGBColor(0x85, 0x4d, 0x0e)
DARK   = RGBColor(0x1e, 0x29, 0x3b)

prs = Presentation()
prs.slide_width = Inches(13.33)
prs.slide_height = Inches(7.5)
BLANK = prs.slide_layouts[6]


def slide(bg=SURF):
    sl = prs.slides.add_slide(BLANK)
    sl.background.fill.solid()
    sl.background.fill.fore_color.rgb = bg
    return sl


def rect(sl, x, y, w, h, fill=WHITE, line=None, lw=1.0):
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


def txt(sl, text, x, y, w, h, size=18, bold=False, italic=False, color=INK,
        align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP, spacing=1.05):
    tb = sl.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
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


def bullets(sl, items, x, y, w, h, size=15, color=INK2, gap=8):
    tb = sl.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = True
    for i, it in enumerate(items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.line_spacing = 1.1
        p.space_after = Pt(gap)
        r = p.add_run()
        r.text = '—  ' + it
        r.font.size = Pt(size)
        r.font.color.rgb = color
        r.font.name = 'Calibri'
    return tb


def kicker(sl, text, color):
    rect(sl, 0.6, 0.42, 0.09, 0.3, fill=color)
    txt(sl, text.upper(), 0.8, 0.4, 8, 0.35, size=12, bold=True, color=color)


def heading(sl, text):
    txt(sl, text, 0.6, 0.78, 12.2, 0.7, size=28, bold=True, color=INK)


def footer(sl, n=None):
    """Numbered by position, so inserting a slide renumbers the rest."""
    n = len(prs.slides._sldIdLst)
    txt(sl, 'Co-ops of Whatcom County · RCN', 0.6, 7.05, 6, 0.3, size=9, color=INK3)
    txt(sl, str(n), 12.3, 7.05, 0.4, 0.3, size=9, color=INK3, align=PP_ALIGN.RIGHT)


def shot(sl, name, x, y, w, maxh=5.05):
    """Screenshot with a hairline frame, at its own aspect, no taller than maxh."""
    iw, ih = Image.open(os.path.join(SHOTS, name)).size
    h = w * ih / iw
    if h > maxh:
        h, w = maxh, maxh * iw / ih
    rect(sl, x - 0.03, y - 0.03, w + 0.06, h + 0.06, fill=BORDER)
    sl.shapes.add_picture(os.path.join(SHOTS, name), Inches(x), Inches(y), Inches(w), Inches(h))
    return h


def shot_slide(n, tool, color, head, name, points, source):
    """The workhorse: kicker + headline, screenshot left, what-to-see right."""
    sl = slide()
    kicker(sl, tool, color)
    heading(sl, head)
    h = shot(sl, name, 0.6, 1.62, 8.75)
    txt(sl, 'WHAT YOU ARE SEEING', 9.7, 1.62, 3.2, 0.3, size=11, bold=True, color=color)
    bullets(sl, points, 9.7, 1.98, 3.1, 4.6, size=14)
    txt(sl, source, 0.6, 1.62 + h + 0.1, 8.75, 0.3, size=10, italic=True, color=INK3)
    footer(sl, n)
    return sl


# 1 — Title ────────────────────────────────────────────────────────────────
sl = slide(DARK)
sl.shapes.add_picture(os.path.join(SHOTS, '04-graph.jpg'), Inches(6.2), Inches((7.5 - 7.13 * 690 / 1179) / 2), Inches(7.13), Inches(7.13 * 690 / 1179))
rect(sl, 0, 0, 6.6, 7.5, fill=DARK)
for i, c in enumerate([WORKER, CONSUM, PRODUC, SOCIAL, SUPPRT, NETWRK]):
    rect(sl, 0.7 + i * 0.42, 1.25, 0.32, 0.32, fill=c)
txt(sl, 'Co-ops of\nWhatcom County', 0.7, 1.85, 5.6, 2.0, size=44, bold=True, color=WHITE, spacing=0.95)
txt(sl, 'One dataset, four RCN lenses —\nMap · Graph · Timeline · Table —\nand a FedWiki page for every co-op', 0.7, 3.95, 5.6, 1.0, size=20, color=RGBColor(0xcb, 0xd5, 0xe1))
txt(sl, '22 organisations · 21 sourced ties · contacts checked Sep 2026', 0.7, 5.4, 5.6, 0.4, size=13, color=INK3)
txt(sl, ATTRIB, 0.7, 6.6, 5.6, 0.4, size=12, color=RGBColor(0xcb, 0xd5, 0xe1))

# 2 — What the data is ─────────────────────────────────────────────────────
sl = slide()
kicker(sl, 'The data', NETWRK)
heading(sl, 'One file of co-ops, read four ways')
cards = [
    (WORKER, '22', 'organisations', 'Every co-op we could verify in Whatcom, plus two Skagit bodies that built Whatcom-serving co-ops.'),
    (SUPPRT, '21', 'sourced ties', 'Membership, money, trade, and “built or helped build”. A line only where a public source says so.'),
    (CONSUM, '6', 'kinds of co-op', 'Worker, consumer / credit union, producer, social, development support, network.'),
    (SOCIAL, '20', 'reachable by phone or name', 'Websites, phones and named leaders, each checked against the organisation’s own site where it could be read.'),
]
for i, (c, big, label, body) in enumerate(cards):
    x = 0.6 + i * 3.1
    rect(sl, x, 1.75, 2.9, 2.75, fill=WHITE, line=BORDER)
    rect(sl, x, 1.75, 2.9, 0.08, fill=c)
    txt(sl, big, x + 0.25, 1.95, 2.5, 0.8, size=40, bold=True, color=c)
    txt(sl, label, x + 0.25, 2.75, 2.5, 0.4, size=14, bold=True, color=INK)
    txt(sl, body, x + 0.25, 3.4, 2.45, 1.2, size=12, color=INK2)
txt(sl, 'WHERE EACH LENS GETS IT', 0.6, 4.8, 6, 0.3, size=11, bold=True, color=NETWRK)
bullets(sl, [
    'Map — the issue file tools/issue-data/whatcom-wa--cooperatives.json: points, ties, kinds, contact block.',
    'Graph Tool — the Map’s “Open in Graph Tool” button, then laid out by hand (the layout shown is Marc’s).',
    'Timeline — tools/whatcom-coops-timeline.json: when each co-op began, converted or merged.',
    'Table — Neo4j database whatcomcoops, loaded from the same issue file by substrate/load_coops.py.',
    'FedWiki — one page per co-op: its record, its graph, its map with ties, its timeline, its website; the table plugin on the index page.',
], 0.6, 5.15, 12.1, 1.8, size=13, gap=2)
footer(sl, 2)

# 3–5 — Map ────────────────────────────────────────────────────────────────
shot_slide(3, 'RCN Map', CONSUM, 'Where the co-ops are, and who is tied to whom',
           '01-map-county.jpg', [
               'Each dot is a co-op, coloured by kind — the legend is top left.',
               'Lines are ties with a public source: dotted pink for network membership, gold for money, green for trade, dashed purple for “built or helped build”.',
               'Most co-ops sit in Bellingham; the farm co-ops run out to Lynden, Everson and Acme, and two ties reach south to Mount Vernon.',
           ], 'Screenshot · RCN Map, issue “Co-ops of Whatcom County”, light basemap')

shot_slide(4, 'RCN Map — hover', CONSUM, 'Hover a co-op: its website, phone and lead person',
           '02-map-hover.jpg', [
               'Downtown Bellingham, zoomed in: the Food Co-op is the hub for money and trade; the pink dotted lines fan out from Cascade Cooperatives to its members.',
               'Hovering shows the short form — site, phone, first named person.',
               'Where a contact is doubtful, the hover says so in amber before anyone relies on it.',
           ], 'Screenshot · hover on Community Food Co-op')

shot_slide(5, 'RCN Map — popup', CONSUM, 'Click for the full record, with where it came from',
           '03-map-popup.jpg', [
               'Website, phone, address and named people, then the research notes.',
               '“Checked Sep 2026 · communityfood.coop /contact” — every contact says when and from which page it was read.',
               'The same fields travel to the Graph Tool as node properties and to Neo4j as columns.',
           ], 'Screenshot · popup on Community Food Co-op')

# 6 — Graph ────────────────────────────────────────────────────────────────
shot_slide(6, 'RCN Graph Tool', PRODUC, 'The same ties as a diagram, laid out by the person who reads it',
           '04-graph.jpg', [
               'Marc’s layout: Cascade Cooperatives at the centre of its members, the Food Co-op at the centre of money and trade.',
               'Four large organisations — WECU, REI, Darigold, CHS — have no documented tie to the rest. That empty corner is a finding, not a gap in the drawing.',
               'Colours and line styles come from the legend, so the diagram and the map say the same thing.',
           ], 'Screenshot · Graph Tool v22, file Co-ops-of-Whatcom-County (1).json')

# 7–8 — Timeline ───────────────────────────────────────────────────────────
shot_slide(7, 'RCN Timeline', WORKER, 'A century of co-ops, from the 1918 dairymen to the 2023 worker co-ops',
           '05-timeline-fit.jpg', [
               'The three credit unions — WECU (1936), North Coast (1939), Industrial (1941) — head the list; only Darigold’s Lynden roots (1918), further down, are older.',
               'Grey bars are what a co-op was before: A-1 Builders ran as a conventional firm from 1955 until its worker buyout in 2017.',
               'Swipe up and down to scroll the 29 rows; the date axis stays pinned.',
           ], 'Screenshot · RCN Timeline, Fit, top rows')

shot_slide(8, 'RCN Timeline — since 2000', WORKER, 'The recent wave: development bodies, then the co-ops they built',
           '06-timeline-recent.jpg', [
               'NWCDC, C2C and NABC were working before the co-ops they helped start.',
               'Purple links show a tie running during both lives: NABC’s USDA-grant help sits inside the meat co-op’s organising years.',
               'Cascade Cooperatives began in 2014 as the Co-op Education Project and was renamed in 2019.',
           ], 'Screenshot · RCN Timeline zoomed to 2000–2028, scrolled to the lower rows')

# 9–10 — Table ─────────────────────────────────────────────────────────────
shot_slide(9, 'RCN Table', SUPPRT, 'In Neo4j: 22 rows, one per co-op, live from the database',
           '07-table.jpg', [
               'Database whatcomcoops, kind Coop — the footer says “live records”.',
               'Pick the columns: here founded, people and phone.',
               'The inspector shows the whole row, warnings included: Cascadia Deaf Nation’s website currently answers “Payment Required”.',
           ], 'Screenshot · RCN Table, ?db=whatcomcoops&kind=Coop')

shot_slide(10, 'RCN Table — map', SUPPRT, 'The database draws its own map: 22 points, 21 links',
           '08-table-map.jpg', [
               'The Table’s Map button reads location and ties straight from Neo4j, with no issue file.',
               'Same network, plainer picture: the database holds the facts, and colour belongs to each lens.',
               'This is the check that the load lost nothing: 22 located, 21 links.',
           ], 'Screenshot · rcn-table-map.html?db=whatcomcoops')

# FedWiki ──────────────────────────────────────────────────────────────────
FW = RGBColor(0xb4, 0x53, 0x09)
shot_slide(0, 'FedWiki', FW, 'A FedWiki page for every co-op',
           '09-wiki-lineup.jpg', [
               '23 pages — an index and one per co-op — in one drop file. Drag it onto any lineup, click a page, fork it.',
               'Each page holds the record, the contact block with when and where it was checked, and the ties as wiki links, each with its source.',
               'The index sits on the left; clicking a co-op opens its page beside it, the ordinary FedWiki way.',
           ], 'Screenshot · local wiki coops.localhost, index and Community Food Co-op')

shot_slide(0, 'FedWiki — RCN Graph Tool', FW, 'Click a co-op in its graph and its page opens beside it',
           '10-wiki-graph-click.jpg', [
               'Every page carries an rcngraph item: the co-op and its nearest neighbours, cut from Marc’s layout.',
               'Every box is a wiki link. Here Cascade Cooperatives was clicked in the Food Co-op’s graph and opened on the right.',
               '“Edit in Graph Tool” reopens the model; hover a box for its contact details, which travel in the model.',
           ], 'Screenshot · click on Cascade Cooperatives in the Food Co-op’s graph')

sl = slide()
kicker(sl, 'FedWiki — RCN Map and RCN Timeline plugins', FW)
heading(sl, 'Its map, with the ties, and its history, with its neighbours')
h = shot(sl, '13-wiki-map-timeline.jpg', 0.6, 1.62, 3.2)
txt(sl, 'WHAT YOU ARE SEEING', 4.4, 1.62, 8, 0.3, size=11, bold=True, color=FW)
bullets(sl, [
    'An RCN Map item draws this co-op and the co-ops it is tied to, with the ties in their colours and line styles. Click a point and its page opens beside this one.',
    'An RCN Timeline item draws the co-op’s own history first, then the history of each co-op it is tied to: the same neighbours as the graph and the map, now in time.',
    'Hover a bar for its dates, how uncertain they are, who says so and how sure. Click it and that co-op’s page opens.',
    '“Open in RCN Timeline ↗” opens the full tool with this timeline in it.',
    'A Frame item, used only for this, shows the co-op’s own website below: 11 of the 22 sites allow it; the rest link out and say why.',
], 4.4, 1.98, 8.3, 4.6, size=15)
txt(sl, 'Screenshot · North Cascades Meat Producers Cooperative, scrolled to its map and timeline', 0.6, 1.62 + h + 0.1, 8, 0.3, size=10, italic=True, color=INK3)
footer(sl)

sl = slide()
kicker(sl, 'FedWiki — RCN Timeline plugin', FW)
heading(sl, 'A timeline on 19 co-op pages, and the whole history on the index')
h1 = shot(sl, '14-wiki-timeline-coop.jpg', 0.6, 1.62, 5.4, maxh=3.15)
txt(sl, 'Community Food Co-op: its own history, then the five co-ops it is tied to', 0.6, 1.62 + h1 + 0.08, 5.6, 0.3, size=10, italic=True, color=INK3)
bullets(sl, [
    'Each interval names the co-op it belongs to, so a page draws the co-op’s own bars and its neighbours’ without a second list to keep in step.',
    'Grey bars are what a co-op was before: A-1 Builders before A1DesignBuild, the Co-op Education Project before Cascade Cooperatives.',
    'Only WECU, REI and Darigold have a single bar and no ties; their pages point to the whole timeline instead.',
], 0.6, 1.62 + h1 + 0.45, 6.4, 2.0, size=12, gap=3)
h2 = shot(sl, '16-wiki-timeline-index.jpg', 7.6, 1.62, 5.1, maxh=5.3)
txt(sl, 'The index page: 35 bars, 1918 to today', 7.6, 1.62 + h2 + 0.08, 5.1, 0.3, size=10, italic=True, color=INK3)
footer(sl)

shot_slide(0, 'FedWiki — Open in RCN Timeline', FW, 'One click from the page to the full Timeline tool',
           '15-timeline-tool-opened.jpg', [
               '“Open in RCN Timeline ↗” under any timeline opens the full tool in its own tab, with that timeline loaded: the North Cascades Meat co-op’s 8 intervals here.',
               'Nothing is lost on the way: the bar’s page and co-op links ride along, so the tool can hand them back.',
               'Open a second timeline from another page and the same tab switches to it, as one undo step.',
               'Edits made in the tool do not come back to the page yet — saving back is the next step.',
           ], 'Screenshot · RCN Timeline, opened from the North Cascades Meat Producers Cooperative page')

sl = slide()
kicker(sl, 'FedWiki — table plugin', FW)
heading(sl, 'The FedWiki table plugin: all 22 co-ops on the index page')
h1 = shot(sl, '12-wiki-table-item.jpg', 0.6, 1.62, 3.5)
txt(sl, 'The rcntable item on the index page', 0.6, 1.62 + h1 + 0.08, 4.2, 0.3, size=10, italic=True, color=INK3)
bullets(sl, [
    'The item names the records: database whatcomcoops, kind Coop.',
    'Open Table ↗ opens the RCN Table beside the wiki — the same table as slide 9.',
    'At home it reads Neo4j live through substrate/api.py. On a hosted wiki it reads the exported folder in the site’s own assets, so each site is its own database.',
    'Every name in the table opens that co-op’s page in the lineup.',
], 0.6, 1.62 + h1 + 0.45, 4.3, 2.9, size=12, gap=3)
h2 = shot(sl, '07-table.jpg', 5.2, 1.62, 7.5)
txt(sl, 'What Open Table shows', 5.2, 1.62 + h2 + 0.08, 7.5, 0.3, size=10, italic=True, color=INK3)
footer(sl)

sl = slide()
kicker(sl, 'FedWiki — how it went', FW)
heading(sl, 'Making it work: what broke, and what it cannot do')
rect(sl, 0.6, 1.7, 6.0, 3.75, fill=WHITE, line=BORDER)
txt(sl, 'FIXED', 0.85, 1.85, 5.5, 0.3, size=11, bold=True, color=SUPPRT)
bullets(sl, [
    'Clicking a two-line name in a graph did nothing, or reloaded the wiki. Each co-op box is now one link. The real fix belongs in the Graph Tool, for every diagram.',
    'Maps first ran inside Frame items, which tied pages to one wiki. Two plugins of our own replaced them — RCN Map and RCN Timeline — and Frame is kept for websites only.',
    'Timeline labels ran over each other in a narrow column. They now stop where the next begins, in the page and in the full tool.',
    'The Timeline tool dropped fields it did not know, so a co-op link vanished on save; and a second “Open” left it on the first timeline. Both fixed.',
], 0.85, 2.2, 5.5, 2.7, size=13, gap=6)
rect(sl, 6.85, 1.7, 5.9, 3.75, fill=AMB_LT, line=RGBColor(0xfd, 0xe0, 0x47))
txt(sl, 'LIMITS', 7.1, 1.85, 5.4, 0.3, size=11, bold=True, color=AMB_TX)
bullets(sl, [
    'The RCN Map and RCN Timeline plugins run on the local wiki. On Wiki Café they need an npm publish and an image rebuild first; until then, build pages with --map native.',
    'Edits in the full Timeline tool do not save back to the page yet.',
    'Half the co-op websites cannot be shown in a page — ICU, REI, North Coast CU, A1DesignBuild and the Food Hub refuse; Bellingham Bay Builders’ bot check never finishes. Those pages link out.',
], 7.1, 2.2, 5.4, 2.7, size=13, color=AMB_TX, gap=6)
txt(sl, 'Checked in a real FedWiki (coops.localhost) with real clicks: a graph box, a map point and a timeline bar each open their page beside; Open in RCN Timeline loads the page’s timeline; the websites were tested in the frame plugin’s own sandbox or by their headers — 11 show.', 0.6, 5.7, 12.1, 0.8, size=15, italic=True, color=INK2)
footer(sl)

# Contacts: what we found and what to watch ───────────────────────────
sl = slide()
kicker(sl, 'Contacts', SOCIAL)
heading(sl, 'What the contact check found — and what to verify before calling')
rect(sl, 0.6, 1.7, 6.0, 3.4, fill=WHITE, line=BORDER)
txt(sl, 'CORRECTED IN THE DATA', 0.85, 1.85, 5.5, 0.3, size=11, bold=True, color=SUPPRT)
bullets(sl, [
    'Community to Community has moved: 1319 Cornwall Ave, Suite 101 (the map pin is moved).',
    'Cascade Cooperatives incorporated in January 2022, not 2019; it began in 2014 as the Co-op Education Project.',
    'CHS Northwest in Lynden is at 402 Main St.',
    'Industrial Credit Union’s website is industrialcu.com.',
    'Yellow Cab Co-op has its own site, yellowcabcoop.com.',
], 0.85, 2.2, 5.5, 2.8, size=13, gap=6)
rect(sl, 6.85, 1.7, 5.9, 3.4, fill=AMB_LT, line=RGBColor(0xfd, 0xe0, 0x47))
txt(sl, 'VERIFY BEFORE RELYING ON IT', 7.1, 1.85, 5.4, 0.3, size=11, bold=True, color=AMB_TX)
bullets(sl, [
    'Community Media Cooperative — media-coop.com no longer resolves; it may have closed.',
    'Cascadia Deaf Nation — website answers “Payment Required”; it may have lapsed.',
    'Bellingham Bay Builders — only the 2004 founders are published, not the current owner-members.',
    'WestEdge CU, Yellow Cab Co-op, Circle of Life, CHS — no leader named on their own sites.',
    'Tierra y Libertad — no website of its own; reach it through C2C.',
], 7.1, 2.2, 5.4, 2.8, size=13, color=AMB_TX, gap=6)
txt(sl, 'Every contact carries “Checked Sep 2026” and the page it was read from. Phones and names change; the date says how far to trust them.', 0.6, 5.45, 12.1, 0.8, size=15, italic=True, color=INK2)
footer(sl, 11)

# 12 — Close ───────────────────────────────────────────────────────────────
sl = slide(DARK)
txt(sl, 'One dataset, four lenses', 0.7, 0.9, 12, 0.8, size=36, bold=True, color=WHITE)
bullets(sl, [
    'Map: open the RCN Map and choose the “Co-ops of Whatcom County” issue — hover any dot for its contact.',
    'Graph: “Open in Graph Tool” from the map legend, or load tools/whatcom-coops-graph.json (Marc’s layout, with contacts).',
    'Timeline: import tools/whatcom-coops-timeline.json into the RCN Timeline.',
    'Table: rcn-table.html?db=whatcomcoops&kind=Coop, with substrate/api.py running.',
    'FedWiki: drag docs/whatcom-coops-wiki/whatcom-coops-wiki.json onto a lineup on a wiki with the RCN Map and RCN Timeline plugins; “Open in RCN Timeline” opens any page’s timeline in the full tool.',
    'To change the data, edit the issue file, then re-run substrate/load_coops.py and build_pages.py so Neo4j and the wiki match.',
], 0.7, 1.9, 11.8, 3.6, size=16, color=RGBColor(0xcb, 0xd5, 0xe1), gap=8)
txt(sl, 'A line means a public source was found. No line means no tie was found, not that none exists.',
    0.7, 5.5, 11.8, 0.5, size=14, italic=True, color=INK3)
txt(sl, ATTRIB, 0.7, 6.6, 11, 0.4, size=12, color=RGBColor(0xcb, 0xd5, 0xe1))

out = os.path.join(HERE, 'whatcom-coops-four-lenses.pptx')
prs.save(out)
print('Wrote', out, '·', len(prs.slides._sldIdLst), 'slides')
