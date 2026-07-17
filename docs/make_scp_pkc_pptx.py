"""
Generate scp-pkc-experiment.pptx — SCP + PKC Integration Experiment overview deck
Target audience: care team, health system partners, project collaborators.

Requires: pip install python-pptx
Run:      python3 docs/make_scp_pkc_pptx.py
Output:   docs/scp-pkc-experiment.pptx
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'scp-pkc-experiment.pptx')

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
    txt(sl, 'SCP + PKC Integration Experiment · RCN · 2026' + (f' · {note}' if note else ''),
        Inches(.6), Inches(7.1), Inches(12), Inches(.3),
        size=9, color=MUTED)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 1 — Title
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, NAVY)

rect(sl, 0, Inches(2.4), W, Inches(2.9), RGBColor(0x16, 0x2d, 0x50))

txt(sl, 'SCP + PKC Integration Experiment',
    Inches(.7), Inches(2.6), Inches(11.9), Inches(1.1),
    size=44, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

txt(sl, 'Connecting the Shared Care Plan to the Problem-Knowledge Coupler via FedWiki',
    Inches(.7), Inches(3.65), Inches(11.9), Inches(.6),
    size=18, color=RGBColor(0xb0, 0xc8, 0xe8), align=PP_ALIGN.CENTER)

txt(sl, 'RCN · Superior AZ · July 2026',
    Inches(.7), Inches(6.8), Inches(11.9), Inches(.4),
    size=12, color=RGBColor(0x6a, 0x8f, 0xb0), align=PP_ALIGN.CENTER)

# Three taglines
for i, line in enumerate([
    'PKC reads from the SCP',
    'PKC writes back to the SCP',
    'The wiki embeds the coupler',
]):
    rect(sl, Inches(1.2 + i*3.9), Inches(4.6), Inches(3.5), Inches(.55),
         RGBColor(0x2a, 0x4f, 0x7c))
    txt(sl, line, Inches(1.28 + i*3.9), Inches(4.65), Inches(3.34), Inches(.45),
        size=12, color=RGBColor(0xd0, 0xe4, 0xff), align=PP_ALIGN.CENTER)

footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 2 — The Gap
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, BG)
header_bar(sl, 'Two systems existed — neither knew about the other',
           'The gap between a living record and a complete workup frame')

# Left: SCP
rect(sl, Inches(.55), Inches(1.4), Inches(4.8), Inches(5.3), SURFACE)
rect(sl, Inches(.55), Inches(1.4), Inches(4.8), Inches(.48), NAVY)
txt(sl, 'Shared Care Plan', Inches(.72), Inches(1.46), Inches(4.44), Inches(.38),
    size=15, bold=True, color=WHITE)

bullet_list(sl, [
    'FedWiki-based health record',
    'Holds vitals, visits, medications, diagnoses',
    'Written by person, CHW, and care team',
    'Lives on scp-experiment.localhost',
    'Knows what IS recorded',
    'No mechanism to ask what is MISSING',
], Inches(.72), Inches(2.0), Inches(4.44), size=12, color=BLACK)

# Right: PKC
rect(sl, Inches(7.98), Inches(1.4), Inches(4.8), Inches(5.3), SURFACE)
rect(sl, Inches(7.98), Inches(1.4), Inches(4.8), Inches(.48), NAVY_LT)
txt(sl, 'Problem-Knowledge Coupler', Inches(8.15), Inches(1.46), Inches(4.44), Inches(.38),
    size=15, bold=True, color=WHITE)

bullet_list(sl, [
    'AI-assisted diagnostic frame generator',
    'Shows every finding worth gathering (SOAP)',
    'Ranks candidates by probability + severity',
    'Generates plain-language narratives',
    'Knows what SHOULD be gathered',
    'No access to what the SCP already holds',
], Inches(8.15), Inches(2.0), Inches(4.44), size=12, color=BLACK)

# Gap arrow in middle
rect(sl, Inches(5.5), Inches(3.4), Inches(2.33), Inches(.55), RGBColor(0xde, 0xe2, 0xe6))
txt(sl, 'GAP', Inches(5.5), Inches(3.42), Inches(2.33), Inches(.5),
    size=14, bold=True, color=MUTED, align=PP_ALIGN.CENTER)
txt(sl, 'Neither system\nknew the other\nexisted',
    Inches(5.6), Inches(4.05), Inches(2.13), Inches(.9),
    size=10, color=MUTED, align=PP_ALIGN.CENTER)

footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 3 — Three Integration Steps
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, BG)
header_bar(sl, 'Three integration steps',
           'Each step adds one direction of information flow')

steps = [
    (GREEN,  '1', 'PKC pushes frames to wiki',
     'After generating a coupler frame, the "Push to Wiki" button writes the full assessment as a FedWiki page on scp-experiment.localhost with five collapsible SOAP sections. The page opens in the lineup via doInternalLink.'),
    (BLUE,   '2', 'PKC reads SCP context',
     'Before Claude generates a frame, coupler-proxy.py fetches health-log, visits, and about-me from scp-experiment.localhost and injects those entries into the prompt. Findings from the SCP pre-fill the frame.'),
    (ORANGE, '3', 'Wiki embeds the PKC',
     'A page called problem-knowledge-coupler on the experiment site embeds the coupler UI via FedWiki\'s frame plugin at 800px height. The coupler detects the ?embed parameter and switches to a compact layout.'),
]

for i, (color, num, title, body) in enumerate(steps):
    y = Inches(1.4) + i * Inches(1.9)
    rect(sl, Inches(.55), y, Inches(12.23), Inches(1.68), SURFACE)
    rect(sl, Inches(.55), y, Inches(.55), Inches(1.68), color)
    txt(sl, num, Inches(.55), y + Inches(.5), Inches(.55), Inches(.65),
        size=26, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    txt(sl, title, Inches(1.25), y + Inches(.1), Inches(10.8), Inches(.48),
        size=16, bold=True, color=NAVY)
    txt(sl, body, Inches(1.25), y + Inches(.58), Inches(10.8), Inches(.9),
        size=12, color=BLACK)

footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 4 — Step 1: Frame → Wiki
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, BG)
header_bar(sl, 'Step 1: Frame to Wiki',
           'The coupler assessment becomes a collapsible FedWiki page')

# Left: description
txt(sl, 'How it works', Inches(.6), Inches(1.3), Inches(6), Inches(.38),
    size=14, bold=True, color=NAVY)

txt(sl, 'After generating a frame, the CHW clicks "Push to Wiki" (embed mode) or "FedWiki" (full-window mode). The coupler proxy writes a new page to scp-experiment.localhost via the FedWiki filesystem write API.',
    Inches(.6), Inches(1.72), Inches(6), Inches(1.0),
    size=12, color=BLACK)

txt(sl, 'The page title is derived from the problem title. For example, a problem titled "Uncontrolled hypertension" produces a page called pkc-uncontrolled-hypertension.',
    Inches(.6), Inches(2.82), Inches(6), Inches(.85),
    size=12, color=BLACK)

txt(sl, 'FedWiki opens the new page to the right in the lineup automatically via the doInternalLink postMessage. The CHW can read the assessment in FedWiki without leaving the wiki environment.',
    Inches(.6), Inches(3.77), Inches(6), Inches(.85),
    size=12, color=BLACK)

txt(sl, 'Re-pushing for the same problem creates a new dated page. Previous push versions remain in the lineup history.',
    Inches(.6), Inches(4.72), Inches(6), Inches(.7),
    size=12, color=MUTED, italic=True)

# Right: five sections
txt(sl, 'Five collapsible sections on the wiki page',
    Inches(7.0), Inches(1.3), Inches(5.7), Inches(.38),
    size=14, bold=True, color=NAVY)

sections = [
    (NAVY,   'SUBJECTIVE',        'Filled/partial findings; absent findings as gaps'),
    (NAVY_LT,'OBJECTIVE',         'Measurements and lab values; gaps named explicitly'),
    (GREEN,  'ASSESSMENT',        'Ranked candidates with probability, attention codes, evidence'),
    (ORANGE, 'PLAN',              'Plan considerations with current status'),
    (MUTED,  'NOT YET GATHERED',  'All absent findings collected in one place'),
]

for i, (color, label, desc) in enumerate(sections):
    y = Inches(1.78) + i * Inches(.95)
    rect(sl, Inches(7.0), y, Inches(5.7), Inches(.78), SURFACE)
    rect(sl, Inches(7.0), y, Inches(.06), Inches(.78), color)
    txt(sl, label, Inches(7.15), y + Inches(.08), Inches(5.4), Inches(.28),
        size=11, bold=True, color=NAVY)
    txt(sl, desc, Inches(7.15), y + Inches(.36), Inches(5.4), Inches(.32),
        size=10, color=MUTED)

txt(sl, 'Each section uses <details><summary> — collapsed by default',
    Inches(7.0), Inches(6.65), Inches(5.7), Inches(.28),
    size=9, italic=True, color=MUTED)

footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 5 — Step 2: SCP Context → Frame
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, BG)
header_bar(sl, 'Step 2: SCP Context to Frame',
           'Before Claude generates a frame, the proxy reads what the SCP already knows')

# Left: flow diagram
txt(sl, 'Data flow', Inches(.6), Inches(1.3), Inches(5.8), Inches(.38),
    size=14, bold=True, color=NAVY)

flow_steps = [
    (NAVY,    'SCP pages',    'health-log · visits · about-me\non scp-experiment.localhost:3000'),
    (NAVY_LT, 'coupler-proxy.py', 'Fetches page JSON · extracts item text\nConverts to plain text · appends to prompt'),
    (BLUE,    'Claude',       'Reads problem title + SCP context together\nMaps existing data onto frame slots'),
    (GREEN,   'Frame',        'Pre-filled findings from SCP show as filled\nGaps that remain show as absent'),
]

for i, (color, label, desc) in enumerate(flow_steps):
    y = Inches(1.82) + i * Inches(1.18)
    rect(sl, Inches(.6), y, Inches(5.5), Inches(.95), SURFACE)
    rect(sl, Inches(.6), y, Inches(.08), Inches(.95), color)
    txt(sl, label, Inches(.78), y + Inches(.08), Inches(5.12), Inches(.32),
        size=13, bold=True, color=NAVY)
    txt(sl, desc, Inches(.78), y + Inches(.42), Inches(5.12), Inches(.44),
        size=10, color=MUTED)
    if i < 3:
        txt(sl, '|', Inches(3.2), y + Inches(.95), Inches(.3), Inches(.22),
            size=12, color=MUTED, align=PP_ALIGN.CENTER)

# Right: what gets pulled
txt(sl, 'What gets pulled from the SCP',
    Inches(7.0), Inches(1.3), Inches(5.7), Inches(.38),
    size=14, bold=True, color=NAVY)

pulled = [
    ('Vitals', 'Blood pressure, heart rate, weight, temperature — from scp-vital items on health-log'),
    ('Diagnoses', 'Active diagnoses with dates — from scp-diagnosis items'),
    ('Medications', 'Current medications with doses — from scp-medication items'),
    ('Symptoms', 'Reported symptoms with onset and severity — from scp-symptom items'),
    ('Visit notes', 'Encounter summaries and CHW observations — from scp-visit items'),
    ('Background', 'Age, stated conditions, goals — from scp-about items on about-me'),
]

for i, (label, desc) in enumerate(pulled):
    y = Inches(1.82) + i * Inches(.82)
    rect(sl, Inches(7.0), y, Inches(5.7), Inches(.68), SURFACE)
    txt(sl, label, Inches(7.15), y + Inches(.06), Inches(5.4), Inches(.26),
        size=11, bold=True, color=NAVY)
    txt(sl, desc, Inches(7.15), y + Inches(.32), Inches(5.4), Inches(.28),
        size=9, color=MUTED)

txt(sl, 'Preview: http://localhost:8766/api/scp-context',
    Inches(7.0), Inches(6.8), Inches(5.7), Inches(.28),
    size=9, italic=True, color=MUTED)

footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 6 — Step 3: Wiki Embeds PKC
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, BG)
header_bar(sl, 'Step 3: Wiki Embeds the PKC',
           'problem-knowledge-coupler page on scp-experiment embeds the coupler via the frame plugin')

# Left: description
txt(sl, 'The landing page', Inches(.6), Inches(1.3), Inches(5.8), Inches(.38),
    size=14, bold=True, color=NAVY)

txt(sl, 'A FedWiki page called problem-knowledge-coupler on scp-experiment.localhost contains a single frame plugin item pointing to http://localhost:8766/?embed at 800px height.',
    Inches(.6), Inches(1.72), Inches(5.8), Inches(.9),
    size=12, color=BLACK)

txt(sl, 'Compact embed layout', Inches(.6), Inches(2.72), Inches(5.8), Inches(.32),
    size=13, bold=True, color=NAVY_LT)

bullet_list(sl, [
    'No page header — wiki header takes its place',
    '180px sidebar — problem list visible immediately',
    '"Push to Wiki" button in toolbar (not "FedWiki")',
    'Internal scrolling fits within 800px frame height',
    'All SCP context injection still active',
], Inches(.6), Inches(3.08), Inches(5.8), size=11, color=BLACK)

txt(sl, 'doInternalLink pattern', Inches(.6), Inches(4.9), Inches(5.8), Inches(.32),
    size=13, bold=True, color=NAVY_LT)

txt(sl, 'When a frame or narrative is pushed, the coupler sends a postMessage to the parent FedWiki window:',
    Inches(.6), Inches(5.26), Inches(5.8), Inches(.55),
    size=11, color=BLACK)

rect(sl, Inches(.6), Inches(5.9), Inches(5.8), Inches(.75), NAVY)
txt(sl, 'window.parent.postMessage(\n  { action: "doInternalLink", title: "pkc-..." },\n  "*"\n)',
    Inches(.72), Inches(5.96), Inches(5.56), Inches(.62),
    size=9, color=RGBColor(0xd0, 0xe8, 0xff))

# Right: access paths
txt(sl, 'Two ways to open the coupler',
    Inches(7.0), Inches(1.3), Inches(5.7), Inches(.38),
    size=14, bold=True, color=NAVY)

for color, label, url, desc in [
    (GREEN,  'Via FedWiki (embed mode)',
     'http://scp-experiment.localhost:3000/\nproblem-knowledge-coupler',
     'Compact layout inside wiki lineup.\nPush to Wiki button. doInternalLink opens pushed pages.'),
    (BLUE,   'Direct full window',
     'http://localhost:8766',
     'Full layout. Standard FedWiki button.\nSame proxy, same database, same SCP context.'),
]:
    y = Inches(1.78) if color == GREEN else Inches(4.0)
    rect(sl, Inches(7.0), y, Inches(5.7), Inches(1.9), SURFACE)
    rect(sl, Inches(7.0), y, Inches(5.7), Inches(.4), color)
    txt(sl, label, Inches(7.15), y + Inches(.07), Inches(5.4), Inches(.28),
        size=12, bold=True, color=WHITE)
    txt(sl, url, Inches(7.15), y + Inches(.52), Inches(5.4), Inches(.5),
        size=9, color=NAVY, italic=True)
    txt(sl, desc, Inches(7.15), y + Inches(1.1), Inches(5.4), Inches(.65),
        size=10, color=MUTED)

footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 7 — Narrate → Pre-Visit Summary
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, BG)
header_bar(sl, 'Narrate to Pre-Visit Summary',
           'Plain-language paragraphs land in the SCP as collapsible entries')

# Left: the flow
txt(sl, 'The workflow', Inches(.6), Inches(1.3), Inches(5.8), Inches(.38),
    size=14, bold=True, color=NAVY)

narrate_steps = [
    (NAVY,    '1. Generate narrative',
     'Click Narrate. Claude reads current record entries and assessment, returns a plain-language paragraph.'),
    (NAVY_LT, '2. Edit if needed',
     'The paragraph is editable in the coupler. Revise wording or add context before pushing.'),
    (GREEN,   '3. Push to SCP',
     'Click "Push to SCP". The proxy writes the narrative to pre-visit-summary on scp-experiment.localhost.'),
    (BLUE,    '4. Lineup opens',
     'FedWiki opens pre-visit-summary to the right via doInternalLink. Confirm the entry was written.'),
]

for i, (color, label, desc) in enumerate(narrate_steps):
    y = Inches(1.78) + i * Inches(1.18)
    rect(sl, Inches(.6), y, Inches(5.8), Inches(.95), SURFACE)
    rect(sl, Inches(.6), y, Inches(.08), Inches(.95), color)
    txt(sl, label, Inches(.78), y + Inches(.08), Inches(5.42), Inches(.32),
        size=12, bold=True, color=NAVY)
    txt(sl, desc, Inches(.78), y + Inches(.44), Inches(5.42), Inches(.4),
        size=10, color=MUTED)

# Right: what the page looks like
txt(sl, 'What pre-visit-summary looks like',
    Inches(7.0), Inches(1.3), Inches(5.7), Inches(.38),
    size=14, bold=True, color=NAVY)

txt(sl, 'Each problem\'s narrative lands as a labeled collapsible block, collapsed by default:',
    Inches(7.0), Inches(1.72), Inches(5.7), Inches(.55),
    size=11, color=BLACK)

# Mock block
rect(sl, Inches(7.0), Inches(2.38), Inches(5.7), Inches(1.65), SURFACE)
rect(sl, Inches(7.0), Inches(2.38), Inches(5.7), Inches(.42), NAVY_LT)
txt(sl, 'PROBLEM 1: Uncontrolled hypertension — 2026-07-04',
    Inches(7.12), Inches(2.45), Inches(5.44), Inches(.28),
    size=10, bold=True, color=WHITE)
txt(sl, '(collapsed — click to expand)',
    Inches(7.12), Inches(2.88), Inches(5.44), Inches(.24),
    size=9, italic=True, color=MUTED)
txt(sl, 'Blood pressure has been running high over the past three visits...',
    Inches(7.12), Inches(3.14), Inches(5.44), Inches(.75),
    size=10, color=MUTED)

rect(sl, Inches(7.0), Inches(4.18), Inches(5.7), Inches(1.65), SURFACE)
rect(sl, Inches(7.0), Inches(4.18), Inches(5.7), Inches(.42), NAVY_LT)
txt(sl, 'PROBLEM 2: New-onset fatigue — 2026-07-04',
    Inches(7.12), Inches(4.25), Inches(5.44), Inches(.28),
    size=10, bold=True, color=WHITE)
txt(sl, '(collapsed — click to expand)',
    Inches(7.12), Inches(4.68), Inches(5.44), Inches(.24),
    size=9, italic=True, color=MUTED)
txt(sl, 'Fatigue began approximately six weeks ago...',
    Inches(7.12), Inches(4.94), Inches(5.44), Inches(.75),
    size=10, color=MUTED)

txt(sl, 'Re-push updates in place — no duplicate entries',
    Inches(7.0), Inches(6.05), Inches(5.7), Inches(.3),
    size=10, bold=True, color=GREEN)

txt(sl, 'Page grows as visits accumulate across all active problems',
    Inches(7.0), Inches(6.42), Inches(5.7), Inches(.28),
    size=9, italic=True, color=MUTED)

footer(sl)

# ═══════════════════════════════════════════════════════════════════════════════
# Slide 8 — What's Next
# ═══════════════════════════════════════════════════════════════════════════════
sl = slide()
bg(sl, BG)
header_bar(sl, "What's next",
           'Four directions the experiment points toward')

next_items = [
    (GREEN,   'Real SCP data in scp-experiment',
     'Seed the experiment site with actual health record data from the Superior AZ pilot. Test whether SCP context injection improves frame quality on real problem sets.'),
    (BLUE,    'Findings back to health-log',
     'After a coupler session, write filled findings back into the SCP health-log page as structured scp-vital or scp-symptom items — closing the loop in both directions.'),
    (ORANGE,  'Multi-problem visit brief',
     'Aggregate narratives across all active problems into a single pre-visit document that a physician can read in two minutes before seeing the person.'),
    (NAVY_LT, 'Person to wiki site mapping',
     'Each person in the coupler database maps to their own FedWiki site. Frames and narratives push to person-specific sites, not a shared experiment site.'),
]

for i, (color, title, body) in enumerate(next_items):
    col = i % 2
    row = i // 2
    x = Inches(.55) + col * Inches(6.4)
    y = Inches(1.4) + row * Inches(2.5)
    rect(sl, x, y, Inches(6.1), Inches(2.2), SURFACE)
    rect(sl, x, y, Inches(6.1), Inches(.48), color)
    txt(sl, title, x + Inches(.18), y + Inches(.1), Inches(5.74), Inches(.3),
        size=14, bold=True, color=WHITE)
    txt(sl, body, x + Inches(.18), y + Inches(.65), Inches(5.74), Inches(1.4),
        size=12, color=BLACK)

footer(sl, 'scp-experiment.localhost · localhost:8766')

# ── Save ─────────────────────────────────────────────────────────────────────
prs.save(OUT)
print(f'Saved: {OUT}')
print(f'Slides: {len(prs.slides)}')
