#!/usr/bin/env python3
"""Builds tools/evsm-measures-items.json (loadable by evsm-svg-v3.html → Setup → Extra Items)
and docs/evsm-measures-spec.html from one item list, so the doc and the file cannot drift."""
import json, html, datetime, pathlib

RCN = pathlib.Path('/Users/marcpierson/rcn')
TODAY = datetime.date.today().isoformat()
SURVEY = 'e-VSM Measures'

SPHERES = {
 'S-1':'Coordination across the neighborhood','S-2':'Involvement','S-3':'Tools and workspaces',
 'S-4':'Awareness within the neighborhood','S-5':'Quality of learning and change','S-6':'Ability to get things done',
 'S-7':'Resources (finance)','S-8':'Quality of neighborhood planning','S-9':'Awareness beyond the neighborhood',
 'S-10':'Leadership in the neighborhood','S-11':'Culture'}

# ── Block F — environment couplings (the Latency channel) ─────────────────────
F_HELP = ("The ten couplings between the neighborhood and its environment, drawn on the e-VSM diagram but not "
          "previously asked. Each is an input a sphere depends on and the neighborhood cannot supply by itself. "
          "Answer for the last three months. Leave blank if you don't know — that is information too.")
F = [
 dict(id='F-1', env='Financiers', edge='F->7', nodes=['S-7'], route='Capital platform (WWHA, catalytic seed capital)',
      text="_Do the people and institutions with money — funders, lenders, dues-paying members — actually put resources into the neighborhood's work?_ **The funding and finance we need is available to us, on terms we can live with.**"),
 dict(id='F-2', env='Suppliers', edge='S->7', nodes=['S-7'], route='Platform (shared purchasing, peer neighborhoods)',
      text="_Can the neighborhood get the materials, services and skills it buys, when it needs them, at prices it can afford?_ **The suppliers we depend on come through for us.**"),
 dict(id='F-3', env='Regulators', edge='R->9', nodes=['S-9'], route='Geographic recursion (city, county); between-institution projects',
      text="_Do city, county and other rule-makers make it possible, rather than harder, for the neighborhood to do its work?_ **The rules and permits we operate under are workable, and the people who administer them are reachable.**"),
 dict(id='F-4', env='Partners', edge='P->9', nodes=['S-9'], route='RCN peer network',
      text="_Do allied organizations outside the neighborhood show up for us when it matters?_ **Our partners beyond the neighborhood keep their commitments to us.**"),
 dict(id='F-5', env='Ideal Futures', edge='I->9', nodes=['S-9'], route='RCN System 4 (field guide, Highlander 3.0, host neighborhoods)',
      text="_Does the neighborhood have live examples, from elsewhere, of what it is trying to become?_ **We know of other places that have done what we are trying to do, and we are in contact with them.**"),
 dict(id='F-6', env='Competitors', edge='Co->9', nodes=['S-9'], route='RCN System 4; geographic recursion',
      text="_Does the neighborhood know who else is after the same land, money, attention or people — and what they are doing?_ **We can name the extractors and competitors acting on our neighborhood, and we know what they are up to.**"),
 dict(id='F-7', env='Market Geographies', edge='G->4', nodes=['S-4'], route='RCN tools (NDC map); mostly local',
      text="_Does the neighborhood know the area it actually serves — the blocks, the buildings, where people come from?_ **We know the territory our work covers, where it stops, and why.**"),
 dict(id='F-8', env='Customers', edge='C->4', nodes=['S-4'], route='RCN methods (moods assessment); mostly local',
      text="_Do the people the neighborhood's work is for tell it what they need — and does that reach the people doing the work?_ **The people we serve tell us what they need, and we hear it.**"),
 dict(id='F-9', env='Suppliers (OU)', edge='Sou->OUH', nodes=['S-6','S-3'], route='Platform (shared purchasing)',
      text="_Can the neighborhood's working groups and small enterprises get what they need to operate — space, stock, subcontractors?_ **Our working groups get their inputs reliably.**"),
 dict(id='F-10', env='Customers (OU)', edge='Cou->OUH', nodes=['S-6','S-2'], route='Platform (demand aggregation); mostly local',
      text="_Do the neighborhood's working groups and small enterprises have people who want what they produce?_ **Our working groups have steady demand for what they do.**"),
]

# ── Block G — sociometric ─────────────────────────────────────────────────────
G_HELP = ("Two questions about who you actually work with. Names are used only to draw the network; the report shows "
          "counts and shapes, never who named whom. In anonymous mode the names are replaced by codes before anything is stored.")
G = [
 dict(id='G-1', nodes=['S-1','S-2'], derives='Density among active groups → S-1; your number of ties → S-2; components → fragmentation',
      text="**In the last three months, which neighborhood groups, projects or initiatives did you actually work with — not just hear about?** _List them, one per line, using the names on the roster where you can._",
      help="Working with means you did something together: a meeting you both attended for a purpose, a task you shared, a hand-off. Hearing about them or reading their posts does not count."),
 dict(id='G-2', nodes=['S-10','S-4','S-11'], derives='In-degree concentration → S-10 (who is turned to, and how many); share of respondents naming anyone → S-4 reach; reciprocity → S-11',
      text="**If something went wrong on your block tomorrow — a flood, an eviction notice, a fight — who would you go to first?** _Name up to three people or groups._",
      help="Answer with who you would really go to, not who you think you should. A group name is fine if that is how you would reach them."),
]

# ── Block H — the center's record (observed Actuality) ────────────────────────
H_HELP = ("Eleven counts, one per sphere, for the last three months, answered once per wave by the person who keeps "
          "the center's records — not by every resident. Each is the observed side of a sphere the survey otherwise "
          "measures only as belief. Enter whole numbers; where two numbers are asked for, enter both.")
H = [
 dict(id='H-1', nodes=['S-1'], text="**Joint activities.** _How many activities in the last three months were carried out by two or more neighborhood groups together?_", source='Calendar, minutes', gaming='Counting every meeting as joint; define joint as shared work, not shared attendance.'),
 dict(id='H-2', nodes=['S-2'], text="**Distinct people active.** _How many different people took part in at least one neighborhood activity in the last three months?_", source='Sign-in sheets, rosters', gaming='Inflated by one-off attendees; report also the number active on 2+ occasions.'),
 dict(id='H-3', nodes=['S-3'], text="**Uses of shared space and tools.** _How many bookings or uses of the neighborhood's shared spaces, vehicles and tools were there?_", source='Booking log', gaming='Low count may mean no log, not no use; note whether a log exists.'),
 dict(id='H-4', nodes=['S-4'], text="**Blocks with a contact.** _How many blocks (or buildings) have a named contact person the center can reach? Out of how many?_", source='Contact list, block map', gaming='Stale contacts; count only those reached in the last year.'),
 dict(id='H-5', nodes=['S-5'], text="**Changes after review.** _How many decisions or practices were changed because of a review, after-action or A3 in the last three months?_", source='A3s, after-action notes', gaming='Reviews with no change are not counted; that is the point.'),
 dict(id='H-6', nodes=['S-6'], text="**Commitments kept.** _How many commitments were made in the last three months, and how many were completed?_", source='Minutes, task board', gaming='Only recording commitments likely to be kept; record at the moment of commitment.'),
 dict(id='H-7', nodes=['S-7'], text="**Money and runway.** _Money in, money out, in the last three months — and months of runway at the current rate?_", source='Books', gaming='Restricted vs unrestricted; report unrestricted runway.'),
 dict(id='H-8', nodes=['S-8'], text="**Plans started.** _How many items in the current plan were due to start in the last three months, and how many actually started?_", source='The plan', gaming='Plans with no dates cannot be scored; that is a finding about S-8.'),
 dict(id='H-9', nodes=['S-9'], text="**Live outside contacts.** _How many organizations outside the neighborhood did the center have at least one real exchange with in the last three months?_", source='Correspondence, meeting notes', gaming='Newsletters received do not count; an exchange is two-way.'),
 dict(id='H-10', nodes=['S-10'], text="**First-time leads.** _How many people led or initiated something for the first time in the last three months?_", source='Project records', gaming='Depends on knowing who led; pair with G-2.'),
 dict(id='H-11', nodes=['S-11'], text="**Retention.** _Of the people active in the previous three months, how many are still active?_", source='Rosters, two periods', gaming='Needs H-2 from the previous wave; the first wave has no value.'),
]

def item(base, block, blockName, blockHelp, scale, extra):
    d = dict(id=base['id'], surveyName=SURVEY, block=block, blockName=blockName, text=base['text'], scale=scale,
             core=True, help=base.get('help', ''), blockHelp=blockHelp, nodes=base['nodes'], edges=[base['edge']] if base.get('edge') else [])
    d.update(extra)
    return d

items = []
for f in F:
    items.append(item(f, 'F', 'Beyond the boundary', F_HELP, 'agree4',
        dict(envType=f['env'], measure='belief', role='latency', route=f['route'], dichotomize='1,2 → disagree; 3,4 → agree; blank → unknown')))
for g in G:
    items.append(item(g, 'G', 'Who you work with', G_HELP, 'free',
        dict(proposedScale='pick', measure='observation', role='actuality', derives=g['derives'])))
for h in H:
    items.append(item(h, 'H', "The center's record", H_HELP, 'free',
        dict(proposedScale='count', measure='observation', role='actuality', source=h['source'], gaming=h['gaming'], respondentWorld='Center record-keeper')))

out = dict(surveyName=SURVEY, source='docs/evsm-measures-spec.html', builtAt=TODAY,
           worlds=['Center record-keeper (answers Block H once per wave)'],
           notes=["Blocks F, G, H load into evsm-svg-v3.html via Setup → Extra Items. Scales agree4 and free render today; "
                  "proposedScale 'pick' (roster) and 'count' (number) are tool additions and fall back to free text until added.",
                  "Block H is answered by one respondent per wave, tagged with the World 'Center record-keeper'.",
                  "Fields envType, measure, role, route, derives, source, gaming, respondentWorld are read by the analysis, not by the survey tool."],
           items=items)
(RCN/'tools'/'evsm-measures-items.json').write_text(json.dumps(out, indent=1, ensure_ascii=False) + '\n')
print('wrote', len(items), 'items')

# ── HTML ──────────────────────────────────────────────────────────────────────
def md(s):
    s = html.escape(s, quote=False)
    import re
    s = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', s)
    s = re.sub(r'_(.+?)_', r'<i>\1</i>', s)
    return s

def sph(ids): return ', '.join(f'{i} {SPHERES[i]}' for i in ids)

f_rows = ''.join(f"<tr><td class=mono>{f['id']}</td><td>{md(f['text'])}</td><td>{f['env']}<br><span class=mono>{f['edge']}</span></td><td>{sph(f['nodes'])}</td><td>{f['route']}</td></tr>" for f in F)
g_rows = ''.join(f"<tr><td class=mono>{g['id']}</td><td>{md(g['text'])}<div class=help>{html.escape(g['help'])}</div></td><td>{sph(g['nodes'])}</td><td>{g['derives']}</td></tr>" for g in G)
h_rows = ''.join(f"<tr><td class=mono>{h['id']}</td><td>{md(h['text'])}</td><td>{sph(h['nodes'])}</td><td>{h['source']}</td><td>{h['gaming']}</td></tr>" for h in H)

sample = json.dumps(items[0], indent=1, ensure_ascii=False)

DOC = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>e-VSM Measures — Item Specification</title>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
*, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{ font-family: 'IBM Plex Sans', system-ui, sans-serif; font-size: 14px; line-height: 1.65; color: #1a1a1a; background: #fafaf8; }}
.page {{ max-width: 860px; margin: 0 auto; padding: 48px 32px 80px; }}
.doc-header {{ margin-bottom: 40px; }}
.doc-header .suite {{ font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #888; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 8px; }}
h1 {{ font-size: 30px; font-weight: 600; line-height: 1.2; margin-bottom: 10px; }}
.doc-header .lead {{ font-size: 16px; color: #444; font-weight: 300; max-width: 680px; }}
.doc-header .meta {{ font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #888; margin-top: 12px; }}
h2 {{ font-size: 19px; font-weight: 600; margin: 40px 0 12px; padding-bottom: 6px; border-bottom: 1px solid #e8e8e4; }}
h3 {{ font-size: 15px; font-weight: 600; margin: 22px 0 8px; color: #2d6a4f; }}
p {{ margin-bottom: 12px; }}
ul, ol {{ padding-left: 22px; margin-bottom: 12px; }}
li {{ margin-bottom: 5px; }}
table {{ width: 100%; border-collapse: collapse; margin: 14px 0 22px; font-size: 12.5px; }}
th {{ text-align: left; padding: 7px 10px; background: #f0f0ec; font-weight: 600; font-size: 11.5px; border: 1px solid #ddd; }}
td {{ padding: 7px 10px; border: 1px solid #e0e0da; vertical-align: top; }}
tr:nth-child(even) td {{ background: #fafaf7; }}
td.mono, .mono {{ font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; white-space: nowrap; }}
.help {{ font-size: 11.5px; color: #666; margin-top: 4px; }}
code {{ font-family: 'IBM Plex Mono', monospace; font-size: 12px; background: #f0f0ec; padding: 1px 5px; border-radius: 3px; }}
pre {{ font-family: 'IBM Plex Mono', monospace; font-size: 11px; background: #f0f0ec; padding: 12px 14px; border-radius: 6px; overflow-x: auto; margin: 12px 0 20px; line-height: 1.5; }}
.note {{ background: #f0f9f4; border-left: 3px solid #2d6a4f; padding: 12px 16px; border-radius: 0 6px 6px 0; font-size: 13px; margin: 16px 0; }}
.warn {{ background: #fff8e1; border-left: 3px solid #b45309; padding: 12px 16px; border-radius: 0 6px 6px 0; font-size: 13px; margin: 16px 0; }}
.formula {{ font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; background: #fff; border: 1px solid #dde; border-radius: 6px; padding: 12px 16px; margin: 12px 0 18px; }}
.formula div {{ margin: 3px 0; }}
figure {{ margin: 18px 0 24px; }}
figcaption {{ font-size: 12px; color: #666; margin-top: 6px; }}
.two {{ display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }}
@media (max-width: 640px) {{ .two {{ grid-template-columns: 1fr; }} }}
@media print {{
  body {{ background: #fff; font-size: 11.5pt; }}
  .page {{ max-width: none; padding: 0; }}
  h2 {{ page-break-after: avoid; }}
  table, figure, .formula, .note, .warn {{ page-break-inside: avoid; }}
  .pb {{ page-break-before: always; }}
  a {{ color: inherit; text-decoration: none; }}
}}
</style>
</head>
<body>
<div class="page">

<div class="doc-header">
  <div class="suite">e-VSM · measurement</div>
  <h1>e-VSM Measures — Item Specification</h1>
  <p class="lead">Twenty-three added items that give the e-VSM survey what Stafford Beer's three indices need: an environment channel for Latency, an observed channel for Actuality, and a rule that separates what a neighborhood can fix from what must be fixed above it. For managing, and for making an investment case to grant makers that can be checked.</p>
  <div class="meta">v0.1 · {TODAY} · items file: <code>tools/evsm-measures-items.json</code> · loads via Setup → Extra Items in <code>evsm-svg-v3.html</code></div>
</div>

<h2>1. Purpose</h2>
<p>Two audiences, one instrument. A neighborhood center needs measures it can manage by: what is weak, whether it is getting better, whether a change worked. A grant maker needs the same numbers to answer a different question: is there latent performance here that money would release, and did it? The survey as it stands — eleven spheres, sixty-six relationships — measures how residents believe the neighborhood is functioning, corrected for how generous each resident is (the Rasch pass documented in <i>eVSM and Rasch</i>). That is a real measure of belief. It is not yet a measure of Latency, because it never asks about the environment, and it is not yet checkable against anything observed.</p>
<p>This specification adds three blocks:</p>
<ul>
<li><b>Block F — Beyond the boundary.</b> Ten environment couplings, already drawn on the e-VSM diagram, now asked. This is the Latency channel.</li>
<li><b>Block G — Who you work with.</b> Two sociometric questions. Observed coordination, reach and leadership, on a network rather than a rating.</li>
<li><b>Block H — The center's record.</b> Eleven counts, one per sphere, answered once per wave from the center's own records. Observed Actuality.</li>
</ul>
<p>With these, each sphere has a belief and an observation, a productivity gap and a latency gap, and a place on a chart wave by wave. Section 5 says what a funder should be shown and what they should refuse to accept.</p>

<h2>2. The measurement model</h2>
<p>Beer's three measures of capacity, in his own definitions, and their three ratios:</p>
<div class="formula">
<div><b>Actuality</b> — what we are managing to do now, with existing resources, under existing constraints.</div>
<div><b>Capability</b> — what we could be doing, still now, with existing resources under existing constraints, if we really worked at it.</div>
<div><b>Potentiality</b> — what we ought to be doing by developing resources and removing constraints, within what is known to be feasible.</div>
<div style="margin-top:8px">Productivity = Actuality / Capability &nbsp;·&nbsp; Latency = Capability / Potentiality &nbsp;·&nbsp; Performance = Actuality / Potentiality = Productivity × Latency</div>
</div>
<p>Three consequences follow from the definitions, and the items below are built on them.</p>
<h3>The split rule</h3>
<p>Capability is bounded by existing constraints; Potentiality requires removing them. So a sphere's shortfall divides into the part the neighborhood can close by working at it and the part that requires something the neighborhood does not control. On the e-VSM diagram those are two kinds of input: <b>internal edges</b> (sphere to sphere, the sixty-six already asked) and <b>environment couplings</b> (Financiers to Resources, Regulators to Awareness Beyond, and so on — Block F).</p>
<div class="formula">
<div>Productivity gap of sphere Y &nbsp;=&nbsp; blocked <i>internal</i> inputs to Y &nbsp;→&nbsp; the neighborhood's own work</div>
<div>Latency gap of sphere Y &nbsp;=&nbsp; blocked <i>environment</i> inputs to Y &nbsp;→&nbsp; work for the level above (Section 2, routing)</div>
</div>
<h3>Belief and observation</h3>
<p>Every existing item is a belief. Beer's Actuality was an observation — tons produced today — while his Capability and Potentiality were negotiated beliefs. Blocks G and H add one observation per sphere. When belief and observation move together, the measure is corroborated. When they diverge, that divergence is itself a finding: a neighborhood that rates its coordination <i>go</i> while its groups share no work has learned something.</p>
<h3>The chart</h3>
<p>Wave by wave, each sphere's rater-corrected measure goes on its own process behavior chart (<code>rcn-spc.html</code>). Beer's three quantities are then on the chart: Actuality is this wave's point; Capability is the center line, what the sphere demonstrably does when nothing special is happening; Potentiality is the ceiling. Variation inside the limits is the productivity band; the distance from center line to ceiling is the latency gap; a point below the limits that does not recover within an agreed number of waves is Beer's algedonic signal and goes up a level.</p>

<figure>
<svg viewBox="0 0 760 320" width="100%" style="max-width:760px;font-family:'IBM Plex Sans',system-ui,sans-serif;font-size:12px">
  <defs><marker id="ah" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#444"/></marker></defs>
  <!-- level above -->
  <rect x="40" y="18" width="680" height="54" rx="8" fill="#f0f0ec" stroke="#bbb"/>
  <text x="56" y="40" font-weight="600">Level above (platform / RCN) — its Actuality</text>
  <text x="56" y="58" fill="#555">reads the Latency gaps below and routes each to whoever can remove the constraint</text>
  <!-- sphere -->
  <rect x="290" y="150" width="180" height="70" rx="10" fill="#fff" stroke="#2d6a4f" stroke-width="2"/>
  <text x="380" y="180" text-anchor="middle" font-weight="600">Sphere Y</text>
  <text x="380" y="198" text-anchor="middle" fill="#555" font-size="11">belief (survey) · observed (G, H)</text>
  <!-- internal inputs -->
  <rect x="40" y="130" width="170" height="110" rx="8" fill="#e8f0fe" stroke="#1a56a4"/>
  <text x="125" y="152" text-anchor="middle" font-weight="600" fill="#1a56a4">Internal inputs</text>
  <text x="125" y="170" text-anchor="middle" fill="#333">other spheres → Y</text>
  <text x="125" y="188" text-anchor="middle" fill="#333">(the 66 edges)</text>
  <text x="125" y="214" text-anchor="middle" fill="#1a56a4">blocked = Productivity gap</text>
  <text x="125" y="230" text-anchor="middle" fill="#1a56a4">→ the neighborhood's work</text>
  <line x1="210" y1="185" x2="288" y2="185" stroke="#444" stroke-width="1.5" marker-end="url(#ah)"/>
  <!-- environment inputs -->
  <rect x="550" y="130" width="170" height="110" rx="8" fill="#e8f5e9" stroke="#2d6a4f"/>
  <text x="635" y="152" text-anchor="middle" font-weight="600" fill="#2d6a4f">Environment inputs</text>
  <text x="635" y="170" text-anchor="middle" fill="#333">financiers, regulators,</text>
  <text x="635" y="188" text-anchor="middle" fill="#333">partners … → Y (Block F)</text>
  <text x="635" y="214" text-anchor="middle" fill="#2d6a4f">blocked = Latency gap</text>
  <text x="635" y="230" text-anchor="middle" fill="#2d6a4f">→ work for the level above</text>
  <line x1="548" y1="185" x2="472" y2="185" stroke="#444" stroke-width="1.5" marker-end="url(#ah)"/>
  <!-- latency goes up -->
  <path d="M635,128 C635,100 500,100 420,74" fill="none" stroke="#2d6a4f" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#ah)"/>
  <text x="40" y="104" fill="#2d6a4f" font-size="11">↑ Latency at level n = Actuality at level n+1</text>
  <!-- chart strip -->
  <text x="40" y="272" fill="#555">On the chart, per wave:</text>
  <text x="200" y="272"><tspan font-weight="600">A</tspan> = this wave's point &nbsp;·&nbsp; <tspan font-weight="600">C</tspan> = center line &nbsp;·&nbsp; <tspan font-weight="600">P</tspan> = ceiling</text>
  <text x="200" y="292">inside the limits = productivity band &nbsp;·&nbsp; center line to ceiling = latency gap</text>
</svg>
<figcaption>Figure 1. The split rule. A sphere's blocked internal inputs are its productivity gap; its blocked environment inputs are its latency gap, which is the input the level above needs.</figcaption>
</figure>

<h3>Routing: which level above</h3>
<p>Several recursions apply at once (Pérez Ríos): a neighborhood sits in a geographic container, in a sectoral platform, and in a network of affiliation. The environment type on a blocked coupling says which one owns the constraint. That is what the <i>route</i> column in Block F records. A blocked <span class="mono">R->9</span> is the city's; a blocked <span class="mono">F->7</span> is the capital platform's; a blocked <span class="mono">I->9</span> is the RCN's own System 4.</p>
<div class="note"><b>The catalytic test, in this arithmetic.</b> The RCN's job is not to absorb a neighborhood's latency but to convert it: to move a constraint from the Potentiality side of the line to the Capability side, and then withdraw. Success is a latency gap that closes and stays closed for two waves after the support ends — the center line moves toward the ceiling and holds.</div>

<h2 class="pb">3. The items</h2>

<h3>Block F — Beyond the boundary (10 items, every respondent)</h3>
<p>{html.escape(F_HELP)}</p>
<p>Scale: <code>agree4</code> — Disagree · Somewhat disagree · Somewhat agree · Agree. Four categories carry more information than the internal edges' agree/disagree, and the Rasch thresholds will say whether residents use all four. For pooling with the internal edges: 1,2 → disagree; 3,4 → agree; blank → unknown.</p>
<table>
<tr><th>id</th><th>Item</th><th>Environment · edge</th><th>Grounds for</th><th>Route if blocked</th></tr>
{f_rows}
</table>

<h3>Block G — Who you work with (2 items, every respondent)</h3>
<p>{html.escape(G_HELP)}</p>
<p>Scale today: <code>free</code>, one name per line. Proposed: <code>pick</code> from a roster of groups held in the config, with a free line for names not on it. A roster keeps the network clean and lets G-1 be answered without naming individuals.</p>
<table>
<tr><th>id</th><th>Item</th><th>Grounds for</th><th>What is derived</th></tr>
{g_rows}
</table>
<div class="warn"><b>Consent and anonymity.</b> G-2 asks for people's names. The survey's anonymous mode must replace names with codes before storage; the aggregator reports degree distributions, components and reciprocity, never a named tie. Residents are told this in the block help. Where the neighborhood is small enough that a shape identifies a person, report only the summary numbers.</div>

<h3>Block H — The center's record (11 items, one respondent per wave)</h3>
<p>{html.escape(H_HELP)}</p>
<p>Scale today: <code>free</code>. Proposed: <code>count</code>, a whole-number input (two where the item asks for two). Answered by a respondent tagged with the World <i>Center record-keeper</i>, added to the Worlds list by the items file.</p>
<table>
<tr><th>id</th><th>Item</th><th>Grounds for</th><th>Source</th><th>Known failure</th></tr>
{h_rows}
</table>

<h2 class="pb">4. Computation</h2>
<p>Per sphere, per wave. Nothing here needs a new estimator; it needs the fixed core of relationships (every respondent answers the same set) and at least two waves.</p>
<table>
<tr><th>Quantity</th><th>How</th><th>Needs</th></tr>
<tr><td><b>Belief Actuality</b>, A<sub>b</sub></td><td>Rasch sphere measure, rater-corrected, in logits with its SE (<code>rcn-rasch.html</code>, rating-scale model on stop/caution/go). For a 0–1 reading: expected score for the typical rater over the maximum.</td><td>≥ 20 respondents per wave</td></tr>
<tr><td><b>Observed Actuality</b>, A<sub>o</sub></td><td>The Block H count (or ratio) as reported; the Block G network statistic as computed. Charted raw on its own XmR chart.</td><td>One record-keeper per wave; roster</td></tr>
<tr><td><b>Productivity input index</b></td><td>Share of the sphere's internal incoming edges rated agree, over those answered. Once the fixed core is in place, the edge Rasch measure replaces the share.</td><td>Fixed core of edges</td></tr>
<tr><td><b>Latency input index</b></td><td>Share of the sphere's Block F couplings rated 3 or 4, over those answered; the blank rate reported beside it.</td><td>Block F</td></tr>
<tr><td><b>Capability</b>, C</td><td>The sphere's chart center line after ≥ 6 waves; before that, the best in-control wave. Across neighborhoods, the best peer on a many-facet run.</td><td>Waves; later MFRM</td></tr>
<tr><td><b>Potentiality</b>, P</td><td>All go — the ceiling. Or the best neighborhood in the network, once measured on one ruler.</td><td>—</td></tr>
<tr><td><b>Productivity, Latency, Performance</b></td><td>On the logit chart as differences (C − A, P − C, P − A); for reading, as Beer's ratios in the expected-score metric. Chart the logit, report the ratio.</td><td>Waves</td></tr>
<tr><td><b>Prediction error</b></td><td>Direction of change in A<sub>b</sub> against direction of change in A<sub>o</sub>, wave to wave; and whether both charts signal. Disagreement is reported, not averaged away.</td><td>Both channels, 2+ waves</td></tr>
<tr><td><b>Algedonic signal</b></td><td>A Rule 1 or run below the lower limit on a sphere's chart that has not recovered after the neighborhood's agreed number of waves for that sphere. Escalates by route.</td><td>Agreed recovery windows</td></tr>
</table>
<p>Beer transformed his bounded, skewed ratios with an inverse sine before filtering, to get something Gaussian enough to test. The logit does that job properly, which is why the chart carries the logit and the ratio is for reading.</p>

<h2>5. What makes these valid, and what a funder should require</h2>
<p>Validity here is not a claim; it is a set of checks the data either pass or do not, each reported with the numbers.</p>
<table>
<tr><th>Check</th><th>What it shows</th><th>Pass</th></tr>
<tr><td>Content</td><td>Every item is a function or a coupling of the model. Nothing is asked that is not on the diagram.</td><td>By construction</td></tr>
<tr><td>Item fit (infit, outfit)</td><td>Whether an item measures the same thing as the rest. A misfitting sphere is contested, not middling — that is a finding to read, not a defect to hide.</td><td>0.7–1.5, or explained</td></tr>
<tr><td>Thresholds ordered</td><td>Whether stop/caution/go, and the four agree categories, are used in the order written.</td><td>Ordered; collapse if not</td></tr>
<tr><td>Separation</td><td>How many levels the instrument can tell apart. Below two strata, rank nothing.</td><td>≥ 2 strata</td></tr>
<tr><td>Invariance across Worlds</td><td>Whether the same item means the same thing to a funder, a renter, a lifelong resident. Differential functioning is the equity check.</td><td>Reported per item</td></tr>
<tr><td>Belief–observation agreement</td><td>Whether rater-corrected belief and the observed count move together over waves.</td><td>Direction agrees, or the divergence is reported</td></tr>
<tr><td>Stability</td><td>The chart: limits from ≥ 6 waves, signals by Wheeler's rules, not by eye.</td><td>Reported with SE</td></tr>
</table>
<h3>Minimum reporting standard</h3>
<ul>
<li>At least 20 respondents per wave; the number stated.</li>
<li>Rater-corrected sphere measures with standard errors; never summed statuses.</li>
<li>The fit table and thresholds, every wave.</li>
<li>Both channels for the sphere the investment targets: belief and the Block H count.</li>
<li>For an investment case: the sphere's latency input index and which couplings are blocked, with the route. That is the investable gap.</li>
<li>For a result: at least two waves before and two after, on the chart; released latency as the movement of the center line toward the ceiling, and the coupling that unblocked. Sustained two waves after support ends.</li>
<li>No claim from a single wave.</li>
</ul>
<div class="warn"><b>Limits, stated.</b> Belief items are self-report. Seven or ten respondents give conversation material, not numbers. JMLE spreads estimates 10–20% wider than the truth; read spacing as approximate, order as reliable. Many-facet Rasch, which puts neighborhoods on one ruler, is not in the tool yet and should wait for two neighborhoods with twenty respondents each. Counts can be gamed; that is why each is paired with a belief and why the known failure is written next to it.</div>

<h2>6. Tool changes</h2>
<p>The items file loads today. The following are small additions, in order of value.</p>
<ol>
<li><b>Survey — <code>count</code> scale.</b> An <code>ITEM_SCALES</code> entry rendering a whole-number input (two inputs where the item has two questions). Until then, Block H answers are free text and the aggregator parses the number.</li>
<li><b>Survey — <code>pick</code> scale with a <code>roster</code> in the config.</b> Multi-select of group names plus a free line. Until then, Block G answers are free text, one name per line.</li>
<li><b>Aggregator — per-sphere input indices.</b> The productivity input index (internal edges) and the latency input index (Block F) beside each sphere, with the blank rate; blocked couplings listed with their route.</li>
<li><b>Aggregator — Block G network.</b> Ties from G-1 and G-2, coded; density, components, in-degree distribution, reciprocity; never a named tie in the report.</li>
<li><b>SPC — ceiling line and the three indices.</b> A ceiling for the selected series and, for the selected point, Actuality, Capability (center line) and Potentiality with Beer's ratios read off.</li>
<li><b>Convention, no code.</b> One respondent per wave tagged <i>Center record-keeper</i> answers Block H; the aggregator treats that World as the record.</li>
</ol>

<h2>7. The items file</h2>
<p><code>tools/evsm-measures-items.json</code> follows the shape of <code>protection-survey-items.json</code>: the fields the survey tool reads (<code>id, block, blockName, text, scale, core, help, blockHelp, nodes, edges</code>) plus fields for the analysis (<code>envType, measure, role, route, derives, source, gaming, respondentWorld, proposedScale</code>), which the tool ignores. One item as it appears in the file:</p>
<pre>{html.escape(sample)}</pre>
<p>Built by <code>build-measures.py</code> from the same item list as this document, so the two cannot drift.</p>

<h2>Sources</h2>
<ul>
<li>Beer, S. <i>Brain of the Firm</i>, 2nd ed. (1981), Figure 28 and the definitions quoted in Section 2.</li>
<li>Beer, S. "Cybernetics of National Development" (Zaheer lecture) — the Chilean triple index, Cyberstride, and the algedonic clock.</li>
<li>Harrison, P. J. and Stevens, C. F. "A Bayesian Approach to Short-term Forecasting", <i>JORS</i> 22 (1971) — the filter Cyberstride used.</li>
<li>Wheeler, D. J. <i>Understanding Variation</i> — the XmR chart and rules in <code>rcn-spc.html</code>.</li>
<li>Linacre, J. M. — many-facet Rasch measurement, for the cross-neighborhood step.</li>
<li>Holland, P. W. and Leinhardt, S. (1981) — the p1 model, a Rasch-family model for the Block G network.</li>
<li>Pérez Ríos, J. <i>Design and Diagnosis for Sustainable Organizations</i> — multiple recursion criteria; the routing in Section 2.</li>
<li>RCN: <i>eVSM and Rasch</i> (docs/evsm-and-rasch.md, 13 Sept 2026); <i>RCN Rasch — input CSV and session JSON</i> (tools/schemas/rcn-rasch.md); Design Record Section 3 and Section 9.</li>
</ul>

</div>
</body>
</html>
"""
(RCN/'docs'/'evsm-measures-spec.html').write_text(DOC)
print('wrote docs/evsm-measures-spec.html')
