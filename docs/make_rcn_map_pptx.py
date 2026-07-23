"""
Generate rcn-ndc-map.pptx — Intro/overview deck for the RCN NDC Map tool.
Audience: RCN staff & researchers, NDC organizers, funders & partners.
Tone: clear, grounded, direct — matches rcn-map-intro.html.

Content mirrors maps/rcn-map-intro.html and rcn-map-manual.html.

Requires: pip install python-pptx  (installed: 1.0.2)
Run:      python3 docs/make_rcn_map_pptx.py
Output:   maps/rcn-ndc-map.pptx
"""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT  = os.path.join(ROOT, 'maps', 'rcn-ndc-map.pptx')

# ── Palette ──────────────────────────────────────────────────────────────────
# Base = slate/navy; accents = the map's own layer colors.
NAVY      = RGBColor(0x0f, 0x17, 0x2a)   # deep slate (cover/section bg)
NAVY_MID  = RGBColor(0x1e, 0x29, 0x3b)   # panel on navy
NAVY_LT   = RGBColor(0x33, 0x41, 0x55)   # lighter panel on navy
SURFACE   = RGBColor(0xff, 0xff, 0xff)
GREY_BG   = RGBColor(0xf8, 0xfa, 0xfc)

# Map layer accent colors (match rcn_map.html legend)
RED       = RGBColor(0xE8, 0x59, 0x3C)   # NDC markers / NDC zone
BLUE      = RGBColor(0x37, 0x8A, 0xDD)   # admin boundary
PURPLE    = RGBColor(0x93, 0x33, 0xEA)   # ecological zone
BROWN     = RGBColor(0x8B, 0x5A, 0x2B)   # mineral deposits
VIOLET    = RGBColor(0x7C, 0x3A, 0xED)   # churches
SKY       = RGBColor(0x38, 0xBD, 0xF8)   # custom pins

# Tints for cards
RED_LT    = RGBColor(0xff, 0xf1, 0xed)
BLUE_LT   = RGBColor(0xef, 0xf6, 0xff)
BLUE_BD   = RGBColor(0x93, 0xc5, 0xfd)
PURPLE_LT = RGBColor(0xfa, 0xf5, 0xff)
PURPLE_BD = RGBColor(0xc4, 0xb5, 0xfd)
GREEN_LT  = RGBColor(0xf0, 0xfd, 0xf4)
GREEN_BD  = RGBColor(0x86, 0xef, 0xac)
GREEN_DK  = RGBColor(0x16, 0x65, 0x34)
AMBER_LT  = RGBColor(0xff, 0xfb, 0xeb)
AMBER_BD  = RGBColor(0xfc, 0xd3, 0x4d)
AMBER_DK  = RGBColor(0x92, 0x40, 0x07)

WHITE     = RGBColor(0xff, 0xff, 0xff)
BLACK     = RGBColor(0x1a, 0x1a, 0x1a)
TEXT_MED  = RGBColor(0x33, 0x41, 0x55)
TEXT_MUTED= RGBColor(0x55, 0x5f, 0x6d)
TEXT_GREY = RGBColor(0x94, 0xa3, 0xb8)
BORDER    = RGBColor(0xdd, 0xe3, 0xed)
LEAD_BLUE = RGBColor(0xb0, 0xc8, 0xe8)

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

def txt(sl, text, x, y, w, h, size=16, bold=False, color=BLACK,
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

def footer(sl, note='RCN NDC Map · ReLocalize Creativity Network · Open source · Free by design · 2026'):
    txt(sl, note, Inches(0.6), Inches(7.12), Inches(12.1), Inches(0.3),
        size=9, color=TEXT_GREY)

def card(sl, x, y, w, h, fill, border):
    shp = sl.shapes.add_shape(1, x, y, w, h)
    shp.fill.solid()
    shp.fill.fore_color.rgb = fill
    shp.line.color.rgb = border
    shp.line.width = Pt(1.5)
    return shp

def label(sl, text, x=Inches(0.6), y=Inches(0.3), w=Inches(12), color=TEXT_GREY):
    txt(sl, text, x, y, w, Inches(0.3), size=9, bold=True, color=color)

def h2(sl, text, x=Inches(0.6), y=Inches(0.6), w=Inches(12.1), h=Inches(0.95),
       color=NAVY, size=26):
    txt(sl, text, x, y, w, h, size=size, bold=True, color=color)

def bullets(sl, items, x, y, w, size=12, color=BLACK, gap=6):
    tb = sl.shapes.add_textbox(x, y, w, Inches(5))
    tf = tb.text_frame
    tf.word_wrap = True
    for i, item in enumerate(items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.space_before = Pt(gap)
        run = p.add_run()
        run.text = '•  ' + item
        run.font.size = Pt(size)
        run.font.color.rgb = color

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 1 — Cover
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, NAVY)
rect(sl, 0, Inches(2.05), W, Inches(3.05), RGBColor(0x0b, 0x11, 0x20))

# Layer-color accent dots row
dot_colors = [RED, BLUE, PURPLE, BROWN, VIOLET, SKY]
dx0 = Inches(5.42)
for i, c in enumerate(dot_colors):
    d = sl.shapes.add_shape(9, dx0 + i * Inches(0.42), Inches(1.55), Inches(0.22), Inches(0.22))
    d.fill.solid(); d.fill.fore_color.rgb = c; d.line.fill.background()

txt(sl, 'ReLocalize Creativity Network  ·  Open source  ·  Free by design',
    Inches(0.7), Inches(2.25), Inches(11.9), Inches(0.4),
    size=12, color=TEXT_GREY, align=PP_ALIGN.CENTER)
txt(sl, 'RCN NDC Map',
    Inches(0.7), Inches(2.75), Inches(11.9), Inches(1.2),
    size=58, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
txt(sl, 'Every Neighborhood Development Center on one interactive map —\n'
        'with its geographic context, community issues, and parcel-level data.',
    Inches(1.2), Inches(4.15), Inches(10.9), Inches(0.9),
    size=16, color=LEAD_BLUE, align=PP_ALIGN.CENTER)
txt(sl, 'One HTML file  ·  no server  ·  no account  ·  no install',
    Inches(0.7), Inches(6.7), Inches(11.9), Inches(0.35),
    size=12, color=TEXT_GREY, align=PP_ALIGN.CENTER)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 2 — What it is
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, SURFACE)
label(sl, 'WHAT IT IS')
h2(sl, 'The network’s geographic intelligence,\nin a single file.')

txt(sl, 'The RCN NDC Map puts all of the network’s Neighborhood Development Centers on one '
        'interactive map — with their geographic context, community issues, and parcel-level '
        'data — in a tool that runs entirely in the browser. It is the network’s '
        'front-facing spatial record and the operating context for every NDC’s community work.',
    Inches(0.6), Inches(1.75), Inches(12.1), Inches(1.2),
    size=15, color=TEXT_MED)

facts = [
    ('One HTML file', 'The map and its data can be hosted anywhere, opened from disk, or emailed. '
     'No server-side code, no framework, no database connection.'),
    ('No account, no install', 'Nothing to sign up for. Open the file and it works — as a dev '
     'tool, a live presentation, and a deployed public artifact, all the same file.'),
    ('Offline-capable', 'All NDC and geographic data is bundled locally. Once loaded, the geographic '
     'layers work with no internet connection.'),
]
cw = Inches(3.95); ch = Inches(2.5); gap = Inches(0.19); x0 = Inches(0.6); cy = Inches(3.35)
accents = [BLUE, RED, PURPLE]
for i, (t, d) in enumerate(facts):
    cx = x0 + i * (cw + gap)
    card(sl, cx, cy, cw, ch, GREY_BG, BORDER)
    rect(sl, cx, cy, cw, Inches(0.07), accents[i])
    txt(sl, t, cx + Inches(0.22), cy + Inches(0.25), cw - Inches(0.44), Inches(0.4),
        size=15, bold=True, color=NAVY)
    txt(sl, d, cx + Inches(0.22), cy + Inches(0.8), cw - Inches(0.44), Inches(1.6),
        size=12, color=TEXT_MED)
footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 3 — Who it is for
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, GREY_BG)
label(sl, 'WHO IT IS FOR')
h2(sl, 'Three audiences, one map.')

audiences = [
    ('Staff & researchers', BLUE, BLUE_LT, BLUE_BD,
     'Understand the geographic, ecological, and institutional context of each NDC. See all seven '
     'at once, zoom into any one, and compare the surrounding administrative boundaries and '
     'ecological zones.'),
    ('NDC organizers', RED, RED_LT, RGBColor(0xf3, 0xb0, 0xa0),
     'Track and communicate about specific community issues — zoning decisions, land-use '
     'questions, neighborhood campaigns — with parcel-level specificity and a clear record of '
     'who holds what position.'),
    ('Funders & partners', PURPLE, PURPLE_LT, PURPLE_BD,
     'Get a clear answer to “where are these communities and what are they working on?” — '
     'in one link, on a phone, with no explanation required.'),
]
cw = Inches(3.95); ch = Inches(4.15); gap = Inches(0.19); x0 = Inches(0.6); cy = Inches(1.65)
for i, (t, accent, fill, border, d) in enumerate(audiences):
    cx = x0 + i * (cw + gap)
    card(sl, cx, cy, cw, ch, fill, border)
    rect(sl, cx, cy, cw, Inches(0.08), accent)
    txt(sl, t, cx + Inches(0.24), cy + Inches(0.35), cw - Inches(0.48), Inches(0.5),
        size=18, bold=True, color=accent)
    txt(sl, d, cx + Inches(0.24), cy + Inches(1.15), cw - Inches(0.48), Inches(2.8),
        size=13, color=TEXT_MED)
footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 4 — The seven NDCs
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, SURFACE)
label(sl, 'THE NETWORK')
h2(sl, 'Seven Neighborhood Development Centers.')

txt(sl, 'Each NDC has its own geographic context layer — administrative boundaries, ecological '
        'zones, NDC zone polygons, mineral deposits, and points of interest — ready to explore '
        'without any GIS expertise.',
    Inches(0.6), Inches(1.7), Inches(12.1), Inches(0.8), size=14, color=TEXT_MED)

ndcs = [
    ('Leo’s NDC', 'Superior, AZ'),
    ('The Fledge', 'Lansing, MI'),
    ('East Whatcom RRC', 'Maple Falls, WA'),
    ('Green Gate Farms', 'Austin, TX'),
    ('Green Gate Farms Bastrop', 'Bastrop, TX'),
    ('Carter Center Library', 'Atlanta, GA'),
    ('Porthmadog', 'Gwynedd, Wales'),
]
cw = Inches(3.85); ch = Inches(1.35); gx = Inches(0.35); gy = Inches(0.28)
x0 = Inches(0.6); y0 = Inches(2.7)
for i, (name, loc) in enumerate(ndcs):
    col = i % 3; row = i // 3
    cx = x0 + col * (cw + gx); cy = y0 + row * (ch + gy)
    card(sl, cx, cy, cw, ch, GREY_BG, BORDER)
    m = sl.shapes.add_shape(9, cx + Inches(0.22), cy + Inches(0.28), Inches(0.26), Inches(0.26))
    m.fill.solid(); m.fill.fore_color.rgb = RED; m.line.fill.background()
    txt(sl, name, cx + Inches(0.62), cy + Inches(0.22), cw - Inches(0.8), Inches(0.4),
        size=14, bold=True, color=NAVY)
    txt(sl, loc, cx + Inches(0.62), cy + Inches(0.66), cw - Inches(0.8), Inches(0.35),
        size=12, color=TEXT_MUTED)
# 8th cell: note
cx = x0 + 1 * (cw + gx); cy = y0 + 2 * (ch + gy)
footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 5 — What it does (capabilities)
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, GREY_BG)
label(sl, 'WHAT IT DOES')
h2(sl, 'Built for exploring, not configuring.')

caps = [
    ('Network overview', 'All 7 NDCs as markers at once. One-click return to overview from any NDC view. Legend organized by state.'),
    ('Per-NDC context', 'Click an NDC to zoom in and load its layers: admin boundaries, ecological zones, NDC zones, minerals, churches.'),
    ('Legend highlighting', 'Click a legend item to spotlight one feature and dim the rest. Shift-click to multi-select. Map zooms to fit.'),
    ('Issue overlay', 'Community issues load parcel-level markers color-coded by stance: green (pro), red (con), grey (unknown).'),
    ('OSM geocoder search', 'Search any address, place, or landmark worldwide. Click a result to fly there and drop a marker.'),
    ('Basemap switcher', 'Seven basemaps: Light, OpenStreetMap Voyager, Satellite, Topo, CyclOSM, Transport, and Dark.'),
    ('Custom location pins', '+ Add location drops a named pin anywhere. Saved in your browser, shown in the legend, survives reloads.'),
    ('Boundary layer builder', 'Search OSM for any jurisdiction polygon, or generate one via the Claude prompt bridge. Persists locally.'),
    ('“New issue” panel', 'Describe an issue, build a Claude prompt, paste the JSON back — the issue appears on the map, no file editing.'),
]
cw = Inches(3.95); ch = Inches(1.55); gx = Inches(0.19); gy = Inches(0.16)
x0 = Inches(0.6); y0 = Inches(1.6)
for i, (t, d) in enumerate(caps):
    col = i % 3; row = i // 3
    cx = x0 + col * (cw + gx); cy = y0 + row * (ch + gy)
    card(sl, cx, cy, cw, ch, SURFACE, BORDER)
    txt(sl, t, cx + Inches(0.18), cy + Inches(0.13), cw - Inches(0.36), Inches(0.35),
        size=13, bold=True, color=NAVY)
    txt(sl, d, cx + Inches(0.18), cy + Inches(0.52), cw - Inches(0.36), Inches(0.95),
        size=10.5, color=TEXT_MED)
footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 6 — The layer system
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, SURFACE)
label(sl, 'THE LAYER SYSTEM')
h2(sl, 'Six layer types. Drawn largest-first\nso nothing hides.')

txt(sl, 'Every NDC’s context is built from typed layers, each with its own color and popup '
        '(name, type, area, and boundary source). Click any polygon or marker to open it.',
    Inches(0.6), Inches(1.75), Inches(12.1), Inches(0.75), size=14, color=TEXT_MED)

layers = [
    ('Admin boundary', BLUE, 'County, city, or district polygon — the institutional geography.'),
    ('Ecological zone', PURPLE, 'Watersheds and ecological regions — the natural geography.'),
    ('NDC zone', RED, 'The NDC’s own operational or site boundary (thicker outline).'),
    ('Mineral deposits', BROWN, 'Copper and other deposits — relevant to land-use pressure.'),
    ('Churches', VIOLET, 'Points of interest and community institutions.'),
    ('Custom pins & boundaries', SKY, 'Your own named locations and jurisdiction polygons, saved locally.'),
]
cw = Inches(5.95); ch = Inches(1.28); gx = Inches(0.25); gy = Inches(0.18)
x0 = Inches(0.6); y0 = Inches(2.65)
for i, (t, accent, d) in enumerate(layers):
    col = i % 2; row = i // 2
    cx = x0 + col * (cw + gx); cy = y0 + row * (ch + gy)
    card(sl, cx, cy, cw, ch, GREY_BG, BORDER)
    rect(sl, cx, cy, Inches(0.09), ch, accent)
    sw = sl.shapes.add_shape(9, cx + Inches(0.28), cy + Inches(0.42), Inches(0.32), Inches(0.32))
    sw.fill.solid(); sw.fill.fore_color.rgb = accent; sw.line.fill.background()
    txt(sl, t, cx + Inches(0.78), cy + Inches(0.2), cw - Inches(0.95), Inches(0.4),
        size=14, bold=True, color=NAVY)
    txt(sl, d, cx + Inches(0.78), cy + Inches(0.62), cw - Inches(0.95), Inches(0.6),
        size=11, color=TEXT_MED)
footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 7 — Issue → parcel pipeline
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, NAVY)
label(sl, 'THE PIPELINE', color=TEXT_GREY)
txt(sl, 'From a community issue to a parcel-level record.',
    Inches(0.6), Inches(0.6), Inches(12.1), Inches(0.6), size=26, bold=True, color=WHITE)

# Two panels: viewer + editor
pw = Inches(5.9); ph = Inches(2.75); py = Inches(1.7)
# Viewer
card(sl, Inches(0.6), py, pw, ph, NAVY_MID, NAVY_LT)
rect(sl, Inches(0.6), py, pw, Inches(0.08), RED)
txt(sl, 'RCN NDC Map — the hub', Inches(0.85), py + Inches(0.22), pw - Inches(0.5), Inches(0.4),
    size=16, bold=True, color=WHITE)
bullets(sl, [
    'Add locations, boundaries, NDCs, and new issues',
    'Shows every issue across all NDCs in context',
    'Parcels color-coded by stance: pro / con / unknown',
    'Views issue parcels; links out to the editor to change them',
], Inches(0.85), py + Inches(0.75), pw - Inches(0.5), size=12, color=LEAD_BLUE)

# Editor
ex = Inches(6.83)
card(sl, ex, py, pw, ph, NAVY_MID, NAVY_LT)
rect(sl, ex, py, pw, Inches(0.08), BLUE)
txt(sl, 'issue-polygon-map — the editor', ex + Inches(0.25), py + Inches(0.22), pw - Inches(0.5), Inches(0.4),
    size=16, bold=True, color=WHITE)
bullets(sl, [
    'Draw and edit parcel polygons',
    'Draw, name, and rename custom boundaries  ← new',
    'Record stances and notes; import / export GeoJSON',
    'Publish the JSON — it appears on the NDC map',
], ex + Inches(0.25), py + Inches(0.75), pw - Inches(0.5), size=12, color=LEAD_BLUE)

# Arrow / caption strip
rect(sl, Inches(0.6), Inches(4.75), Inches(12.13), Inches(1.35), RGBColor(0x0b, 0x11, 0x20))
txt(sl, 'Edit an issue’s parcels in the editor  →  publish to the hub.',
    Inches(0.85), Inches(4.95), Inches(11.6), Inches(0.45), size=16, bold=True, color=WHITE)
txt(sl, 'The connection between a community campaign and its geographic specifics — which '
        'properties are affected, who holds what stance — does not exist in any general-purpose '
        'mapping tool. This is the pipeline that makes it real.',
    Inches(0.85), Inches(5.45), Inches(11.6), Inches(0.65), size=12, italic=True, color=LEAD_BLUE)
footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 8 — How it differs
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, GREY_BG)
label(sl, 'HOW IT DIFFERS')
h2(sl, 'Not another map app.')

comps = [
    ('Google / Apple Maps', 'Different purpose', AMBER_LT, AMBER_DK,
     'General navigation maps. They know nothing about NDCs, community issues, or context layers. '
     'The RCN map is the inverse: it knows exactly where every NDC is and what it’s working on '
     '— but it’s not for finding a coffee shop.'),
    ('ArcGIS / QGIS', 'Powerful, wrong floor', AMBER_LT, AMBER_DK,
     'Professional GIS that can do all this and more — but requires a subscription or a desktop '
     'install and a learning curve. Neither produces a shareable single file an organizer can open '
     'on a phone or email to a council member.'),
    ('Google My Maps', 'Easy to start, hard to own', AMBER_LT, AMBER_DK,
     'Easy custom pins — but the data lives in Google’s infrastructure, not yours. No '
     'issue-specific parcel data, no stance tracking, no self-contained export. The RCN map is fully '
     'owned and lives in the RCN repository.'),
]
cw = Inches(3.95); ch = Inches(4.35); gap = Inches(0.19); x0 = Inches(0.6); cy = Inches(1.6)
for i, (name, verdict, fill, vcolor, body) in enumerate(comps):
    cx = x0 + i * (cw + gap)
    card(sl, cx, cy, cw, ch, SURFACE, BORDER)
    txt(sl, name, cx + Inches(0.22), cy + Inches(0.25), cw - Inches(0.44), Inches(0.4),
        size=15, bold=True, color=NAVY)
    v = card(sl, cx + Inches(0.22), cy + Inches(0.78), cw - Inches(0.44), Inches(0.42), fill, AMBER_BD)
    txt(sl, verdict, cx + Inches(0.22), cy + Inches(0.82), cw - Inches(0.44), Inches(0.35),
        size=11, bold=True, color=vcolor, align=PP_ALIGN.CENTER)
    txt(sl, body, cx + Inches(0.22), cy + Inches(1.4), cw - Inches(0.44), Inches(2.85),
        size=12, color=TEXT_MED)
footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 9 — Potential uses  (emphasized)
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, SURFACE)
label(sl, 'POTENTIAL USES')
h2(sl, 'What organizers and staff can do with it.')

uses = [
    ('Run a zoning or land-use campaign', RED,
     'Map every affected parcel, track pro / con / unknown stances, and brief neighbors block by block.'),
    ('Brief an official in the field', BLUE,
     'Open it on a phone in a council meeting or on a doorstep — show exactly which parcels and boundaries are involved.'),
    ('Orient a funder or partner', PURPLE,
     'One link answers “where are these communities and what are they working on?” — no deck, no login.'),
    ('Compare natural vs. institutional lines', PURPLE,
     'See where a watershed crosses a county line, or where an NDC zone sits relative to mineral deposits.'),
    ('Work offline in the field', SKY,
     'Geographic layers keep working with no connection once loaded — useful on-site and in low-signal areas.'),
    ('Build a shared boundary record', BROWN,
     'Search or draw a jurisdiction polygon, name it, save it locally, and export JSON for a permanent backup.'),
]
cw = Inches(5.95); ch = Inches(1.55); gx = Inches(0.25); gy = Inches(0.2)
x0 = Inches(0.6); y0 = Inches(1.65)
for i, (t, accent, d) in enumerate(uses):
    col = i % 2; row = i // 2
    cx = x0 + col * (cw + gx); cy = y0 + row * (ch + gy)
    card(sl, cx, cy, cw, ch, GREY_BG, BORDER)
    rect(sl, cx, cy, Inches(0.09), ch, accent)
    txt(sl, t, cx + Inches(0.28), cy + Inches(0.2), cw - Inches(0.45), Inches(0.5),
        size=14, bold=True, color=NAVY)
    txt(sl, d, cx + Inches(0.28), cy + Inches(0.72), cw - Inches(0.45), Inches(0.75),
        size=11.5, color=TEXT_MED)
footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 10 — Data ownership
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, NAVY)
label(sl, 'WHY IT MATTERS', color=TEXT_GREY)
txt(sl, 'A commitment to data ownership.',
    Inches(0.6), Inches(0.6), Inches(12.1), Inches(0.6), size=28, bold=True, color=WHITE)

txt(sl, 'The map requires no Google account, no ArcGIS subscription, and no cloud service. The data '
        'belongs to the RCN and lives in the RCN’s repository — it can be deployed to any '
        'server, archived, forked, or handed off without dependency on any platform that could change '
        'its terms, pricing, or availability.',
    Inches(0.6), Inches(1.5), Inches(12.1), Inches(1.1), size=15, color=LEAD_BLUE)

owns = [
    ('User-owned spatial data', 'Custom pins, added NDCs, corrected positions, and boundaries are saved in your browser. Nothing is sent to a server; one top-level “Export my data” button downloads all of it as one JSON file.'),
    ('Single file, fully deployable', 'The same file works as a dev tool, a live presentation, and a deployed public artifact. Host it anywhere or open it from disk.'),
    ('Open source, free by design', 'Part of the RCN toolset — built to be used, adapted, and deployed without asking anyone’s permission.'),
]
cw = Inches(3.95); ch = Inches(2.7); gap = Inches(0.19); x0 = Inches(0.6); cy = Inches(3.1)
accents = [SKY, BLUE, GREEN_BD]
for i, (t, d) in enumerate(owns):
    cx = x0 + i * (cw + gap)
    card(sl, cx, cy, cw, ch, NAVY_MID, NAVY_LT)
    rect(sl, cx, cy, cw, Inches(0.07), accents[i])
    txt(sl, t, cx + Inches(0.22), cy + Inches(0.25), cw - Inches(0.44), Inches(0.7),
        size=15, bold=True, color=WHITE)
    txt(sl, d, cx + Inches(0.22), cy + Inches(1.0), cw - Inches(0.44), Inches(1.6),
        size=12, color=LEAD_BLUE)
footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 11 — Getting started / close
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, NAVY)
rect(sl, Inches(3.5), Inches(1.3), Inches(6.33), Pt(2), RGBColor(0x4a, 0x7a, 0xb0))
txt(sl, 'Open the file. It works.',
    Inches(0.6), Inches(1.55), Inches(12.13), Inches(0.7),
    size=32, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
rect(sl, Inches(3.5), Inches(2.5), Inches(6.33), Pt(2), RGBColor(0x4a, 0x7a, 0xb0))

steps = [
    ('Open', 'rcn_map.html — all 7 NDCs load on the overview map.'),
    ('Explore', 'Click an NDC to load its context layers; click legend items to spotlight features.'),
    ('Act', 'Load an issue, open its full Issue Map to edit parcels, or add your own pins and boundaries.'),
]
cw = Inches(3.7); ch = Inches(1.9); gap = Inches(0.35); total = 3*cw + 2*gap
x0 = (W - total) / 2; cy = Inches(3.15)
for i, (t, d) in enumerate(steps):
    cx = x0 + i * (cw + gap)
    card(sl, cx, cy, cw, ch, NAVY_MID, NAVY_LT)
    txt(sl, str(i+1), cx + Inches(0.25), cy + Inches(0.2), Inches(0.9), Inches(0.7),
        size=30, bold=True, color=RGBColor(0x4a, 0x7a, 0xb0))
    txt(sl, t, cx + Inches(0.25), cy + Inches(0.85), cw - Inches(0.5), Inches(0.4),
        size=16, bold=True, color=WHITE)
    txt(sl, d, cx + Inches(0.25), cy + Inches(1.28), cw - Inches(0.5), Inches(0.55),
        size=11, color=LEAD_BLUE)

txt(sl, 'Full documentation: rcn-map-intro.html  ·  rcn-map-manual.html',
    Inches(0.6), Inches(5.5), Inches(12.13), Inches(0.4),
    size=13, color=LEAD_BLUE, align=PP_ALIGN.CENTER)
txt(sl, 'RCN NDC Map  ·  ReLocalize Creativity Network  ·  Open source · Free by design  ·  2026',
    Inches(0.6), Inches(6.9), Inches(12.13), Inches(0.35),
    size=11, color=TEXT_GREY, align=PP_ALIGN.CENTER)

# ── Save ──────────────────────────────────────────────────────────────────────
prs.save(OUT)
print(f'Saved: {OUT}')
print(f'Slides: {len(prs.slides)}')
