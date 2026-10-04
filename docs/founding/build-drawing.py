#!/usr/bin/env python3
"""Build the founding-process drawing as RCN Graph Tool JSON.

Nine steps from first conversation to working rules, laid out as a staircase down
the layers of deciding, with two gates before the work starts, the ethical check
(Mick Ashby's Ethical Regulator Theorem, as the RCN Constitution makes it
operational) alongside, and the loops back up. Box labels are FedWiki page titles,
so the exported picture links each box to its page.

Marc Pierson and Claude Opus 5.5 · October 2026
"""
import json, os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'founding-process.rcn.json')
ATTR = 'Marc Pierson and Claude Opus 5.5 · October 2026'
CLEAR = '#ffffff00'

LEGEND = [
    {"id": "lg_step", "kind": "node", "label": "A step", "color": "#ffffff", "borderColor": "#1F3D2B", "borderWidth": 2, "borderDash": "solid", "icon": ""},
    {"id": "lg_gate", "kind": "node", "label": "A gate: the whole agreement passes through it before the work starts", "color": "#ffffff", "borderColor": "#C9822A", "borderWidth": 3, "borderDash": "solid", "icon": ""},
    {"id": "lg_ethics", "kind": "node", "label": "The ethical check (Ethical Regulator Theorem)", "color": "#FDF0EB", "borderColor": "#B5532D", "borderWidth": 3, "borderDash": "solid", "icon": ""},
    {"id": "lg_next", "kind": "edge", "label": "Next step", "color": "#1F3D2B", "width": 2.5, "dash": "solid"},
    {"id": "lg_back", "kind": "edge", "label": "Back up a layer when something is not working", "color": "#1F3D2B", "width": 2, "dash": "dashed"},
    {"id": "lg_warn", "kind": "edge", "label": "Warning first, veto if needed", "color": "#B5532D", "width": 2, "dash": "dashed"},
]
LG = {l['id']: l for l in LEGEND}

nodes, edges, lines = [], [], []

def node(id, label, x, y, w, h, color='#ffffff', type=None, fs=17, shape='rounded', note='', border=None, bw=None, dash='solid', fc='#000000'):
    lg = LG.get(type, {})
    nodes.append({"id": id, "label": label, "x": x, "y": y, "w": w, "h": h, "shape": shape,
                  "color": color, "fontColor": fc, "fontSize": fs,
                  "borderColor": border or lg.get('borderColor', '#ffffff'), "borderWidth": bw if bw is not None else lg.get('borderWidth', 0),
                  "borderDash": dash, "note": note, "extraLabels": [], "props": {}, **({"type": type} if type else {})})

def text(id, label, x, y, w, h=34, fs=16, fc='#1F3D2B', note=''):
    node(id, label, x, y, w, h, color=CLEAR, shape='rect', fs=fs, fc=fc, note=note, border=CLEAR, bw=0)

def edge(s, t, label='', type='lg_next', curved=False, note=''):
    l = LG[type]
    edges.append({"id": f"e{len(edges)+1}", "src": s, "tgt": t, "label": label, "type": type, "color": l['color'],
                  "width": l['width'], "dash": l['dash'], "fontSize": 14, "curved": curved, "polarity": "none",
                  "delay": False, "props": {}, "note": note, "traces": []})

# ── bands: the layers of deciding ────────────────────────────────────────
BANDS = [  # (id, label, y_top, y_bottom, tint, note)
    ('b0', 'Before anything is written', 0, 160, '#F2F3F1', "Nothing is decided yet. People notice something they share and find each other."),
    ('b1', 'What we all take for granted', 160, 330, '#ECE8F4', "The unwritten layer: what feels fair, who counts, what the group is for. Writing it down as a preamble makes it something people can point at and argue with.\n\nOstrom's word: metaconstitutional."),
    ('b2', 'Deciding who sets the rules', 330, 520, '#F8E9E3', "Who is in, what seats exist, how the group decides, how these rules can change, and who watches the whole thing ethically.\n\nOstrom's word: constitutional."),
    ('b3', 'Setting the house rules', 520, 700, '#FBF3DE', "The everyday rules, made and changed by the group: taking and giving, keeping an eye out, what happens first and then, where arguments go.\n\nOstrom's word: collective choice."),
    ('b4', 'Doing the work', 700, 870, '#E6F1E3', "Living by the rules, and watching how things really work.\n\nOstrom's word: operational."),
]
X0, X1 = -330, 2720
for i, (bid, lab, y0, y1, tint, note) in enumerate(BANDS):
    text(bid, lab, -200, (y0 + y1) / 2, 240, 60, fs=16, note=note)
    if i:
        lines.append({"id": f"l{i}", "x1": X0, "y1": y0, "x2": X1, "y2": y0, "color": "#C9D3CC", "width": 1, "dash": "dashed", "arrowhead": False, "label": ""})

text('title', 'Founding a commons, step by step', 1200, -90, 900, 44, fs=26,
     note="A process view of creating an organization with well-formed founding rules and house rules. Read left to right: founding steps down through the layers of deciding, passes two gates, and then the work begins. Dashed arrows climb back up when something is not working. Each box opens its own FedWiki page.")
text('sub', 'Two examples all the way through: the Elm Street garden, and the RCN Constitution (written with the Constitution Builder)', 1200, -45, 1300, 30, fs=15, fc='#5B6B60')

S = {}
def step(id, label, x, band, note, w=250, h=78, type='lg_step', color='#ffffff', y=None):
    y0, y1 = [(b[2], b[3]) for b in BANDS if b[0] == band][0]
    node(id, label, x, y if y is not None else (y0 + y1) / 2, w, h, color=color, type=type, note=note)
    S[id] = label

step('s1', 'Name what we share', 140, 'b0',
     "1. What is the shared thing, what do people take from it, who uses it, and what goes wrong?\n\nElm Street: one rain-fed tank, 30 plots, and not enough water in August.\nRCN: know-how and tools for neighborhoods (open to all, so the trouble is getting people to contribute), plus time and server costs that Marc carries.")
step('s2', 'Gather the founders', 460, 'b0',
     "2. Who is at the first table? Before any rule exists, this decides whose voice shapes all the others. Ask who is missing.\n\nElm Street: the neighbors who asked the city for the lot.\nRCN: self-declared, 'at present we are seven' (Article II), in groups of 5 to 15.")
step('s3', 'Say what we take for granted', 780, 'b1',
     "3. What do we believe is fair? What are we for? Write the unwritten down, so it can be pointed at and argued with.\n\nElm Street: everyone who wants to grow food should be able to.\nRCN: the Preamble's seven beliefs (the primacy of the local, working together, ...) and 'fairness is our superordinate condition for action'.")
step('s4', 'Write the founding rules', 1000, 'b2',
     "4. Who is in? What seats are there? How do we decide? How can these rules change? Who outside has to recognize us?\n\nElm Street: members are plot holders; the spring meeting decides by two-thirds; the city lease.\nRCN: one class of member, every voice equal (III §1); amended by consensus, reviewed yearly (V §3); an unincorporated network (II §1).")
step('s5', 'Build in the ethical check', 1320, 'b2',
     "5. Who watches the whole thing for fairness, with real power to warn and to stop? Ethics beyond the personal needs standing, and only founding rules can give it.\n\nElm Street: a few gardeners speak each season for the watershed, the neighbors, and the newcomers on the waiting list.\nRCN: the Preamble's ethical regulation and the Ethical Oversight Framework: seven points of view, warnings first, vetoes when needed.")
step('s6', 'Start the house rules small', 1560, 'b3',
     "6. Write only the house rules you need now. Add the rest as real problems show up, each one checked as it goes in.\n\nElm Street: watering days; the keeper; a word first, then a week without water.\nRCN: Article III §2 to §5 and Article IV: share innovations, lightweight facilitation on Thursdays, 'our operating norms are largely implicit'.")
step('s7', 'Check every sentence', 1880, 'b3', type='lg_gate',
     note="7. A gate. Gaps go back to whichever step wrote the sentence. Run every sentence through the Agreement Checker. Look for things nobody created, rules with no 'or else', and triggers nobody reads. Then read the profile of what long-lasting groups do.\n\nElm Street: who reads the tank?\nRCN: a first reading finds 'Decisions are made ad hoc' (III §3), no stated way of deciding, and mostly expectations rather than rules.")
step('s8', 'Agree to it together', 2200, 'b3', type='lg_gate',
     note="8. A gate. Everyone at the founding table agrees, and the record says how they agreed. The founding agreement can't be made by a vote, because no voting rule exists yet.\n\nElm Street: everyone at the first meeting says yes, and their names are written down.\nRCN: the Ratification line on the Constitution page still has a blank date and no signatures.")
step('s9', 'Live it, watch it, change it', 2280, 'b4',
     "9. Do the work. Keep track of how things really work against what was written. Take problems up to the layer that can fix them.\n\nElm Street: a tank chart by the gate; the spring meeting changes what is not working.\nRCN: weekly Thursday calls, yearly review (V §3), the eVSM for the health of the whole (V §2), and the ethical check's regular convergence.")
node('pov', 'Seven points of view', 2560, 245, 280, 90, color='#FDF0EB', type='lg_ethics',
     note="The ethical check, made operational in the RCN Ethical Oversight Framework, after Mick Ashby's Ethical Regulator Theorem.\n\nFuture Generations, Adjacent Communities, The Living Environment, The Marginalized Insider, The Informed Outsider, The Historical Record, The Systemic View.\n\nAbout five people per point of view, each person in at least two, so the whole stays visible in each part. Outputs: warnings (the system working), vetoes (rare, real), and dated assessments, all posted publicly on FedWiki.")
text('start', 'Start here', 140, 20, 140, 26, fs=14, fc='#C9822A')

for a, b in [('s1', 's2'), ('s2', 's3'), ('s3', 's4'), ('s4', 's5'), ('s5', 's6'), ('s6', 's7'), ('s7', 's8'), ('s8', 's9')]:
    edge(a, b)
edge('s5', 'pov', 'creates', note="The founding rules create the ethical check and give it standing to halt action.")
edge('pov', 's6', 'warning, then veto', 'lg_warn', note="Warnings come before a line is crossed; a veto stops action and says what would lift it.")
edge('pov', 's9', 'warning, then veto', 'lg_warn')
edge('s9', 's6', 'a house rule is not working', 'lg_back',
     note="Most problems are fixed one layer up, by the group changing a house rule.")
edge('s6', 's4', 'the problem keeps coming back', 'lg_back',
     note="A rule problem that keeps coming back is usually a founding-rule problem: someone without a seat, or no agreed way of deciding.")

text('footer', f"Ostrom's layers of deciding; Meadows-Ostrom Constitution Builder; RCN Constitution and Ethical Oversight Framework (Ashby's Ethical Regulator Theorem).  {ATTR}", 1200, 930, 1700, 30, fs=12, fc='#5B6B60')

d = {"version": "1.0", "mode": "select", "modelName": "Founding a commons, step by step",
     "modelNote": "A process view of founding an organization with well-formed founding rules and house rules, following the Elm Street garden and the RCN Constitution. Bands are the layers of deciding; founding steps down them, passes two gates, and then the work begins; dashed arrows climb back up. Each box label is the title of its FedWiki page.\n\n" + ATTR,
     "canvasBg": "#ffffff", "graphAttrs": {"method": "process"}, "cldLoopNames": {}, "legendEntries": LEGEND,
     "legendVisible": True, "legendCollapsed": False, "customSymbols": [], "nodes": nodes, "edges": edges, "lines": lines, "metaEdges": []}
json.dump(d, open(OUT, 'w'), indent=2, ensure_ascii=False)
print(OUT, len(nodes), 'nodes', len(edges), 'edges')
