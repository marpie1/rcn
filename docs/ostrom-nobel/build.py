#!/usr/bin/env python3
"""Build the Ostrom Nobel-lecture figures as RCN Graph Tool JSON files."""
import json, os

OUT = '/Users/marcpierson/rcn/docs/ostrom-nobel'
ATTR = 'Marc Pierson and Claude Opus 5.5 · October 2026'
LECTURE = 'Ostrom, E. (2010). Beyond Markets and States: Polycentric Governance of Complex Economic Systems. American Economic Review 100(3): 641–672 (the 2009 Nobel lecture)'

# Colours from Marc's SVG
LIME, ORANGE, BLUE, GREEN, RED, PURPLE, GREY = '#b5f500', '#f5a623', '#4aa3f0', '#00e010', '#ff2818', '#a77bdc', '#b4b4b4'
CLEAR = '#ffffff00'
MARC = '#15803d'

LEGEND = {
    'lg_marc': {"id": "lg_marc", "kind": "node", "label": "Marc's annotation (not in Ostrom's figure)",
                "color": CLEAR, "borderColor": MARC, "borderWidth": 1, "borderDash": "dotted", "icon": ""},
    'lg_added': {"id": "lg_added", "kind": "node", "label": "Added in this rebuild (not in Ostrom's figure)",
                 "color": "#ffffff", "borderColor": "#64748b", "borderWidth": 2, "borderDash": "dashed", "icon": ""},
    'lg_causal': {"id": "lg_causal", "kind": "edge", "label": "Direct causal link", "color": "#181818", "width": 2, "dash": "solid"},
    'lg_feedback': {"id": "lg_feedback", "kind": "edge", "label": "Feedback", "color": "#181818", "width": 2, "dash": "dashed"},
    'lg_rule': {"id": "lg_rule", "kind": "edge", "label": "Rule type acts on this part", "color": RED, "width": 2, "dash": "solid"},
    'lg_link': {"id": "lg_link", "kind": "edge", "label": "Relation inside the action situation", "color": "#334155", "width": 1.5, "dash": "solid"},
    'lg_added_edge': {"id": "lg_added_edge", "kind": "edge", "label": "Added in this rebuild", "color": "#64748b", "width": 2, "dash": "dashed"},
}


class G:
    def __init__(self, name, note):
        self.name, self.note = name, note
        self.nodes, self.edges, self.used = [], [], set()
        self.n = 0

    def node(self, id, label, x, y, w, h, color='#ffffff', shape='rounded', border='#000000', bw=1.5,
             dash='solid', fs=16, fc='#000000', note='', extra=None, type=None):
        nd = {"id": id, "label": label, "x": x, "y": y, "w": w, "h": h, "shape": shape, "color": color,
              "fontColor": fc, "fontSize": fs, "borderColor": border, "borderWidth": bw, "borderDash": dash,
              "note": note, "extraLabels": extra or [], "props": {}}
        if type:
            nd["type"] = type
            self.used.add(type)
        self.nodes.append(nd)
        return id

    def box(self, id, x, y, w, h, color, dash='solid', bw=1.5, border='#000000', note=''):
        # a container: see-through fill so arrows inside it stay visible, label carried by a header node
        return self.node(id, '', x, y, w, h, color=color, shape='rect', border=border, bw=bw, dash=dash, note=note)

    def text(self, id, label, x, y, w, h=34, fs=17, fc='#000000', note='', bold_type=None):
        return self.node(id, label, x, y, w, h, color=CLEAR, shape='rect', border=CLEAR, bw=0, fs=fs, fc=fc,
                         note=note, type=bold_type)

    def marc(self, id, label, x, y, w, h=30, fs=14, note=''):
        n = "Marc's annotation, from his redrawing of the lecture figures. Not in Ostrom's figure."
        return self.node(id, label, x, y, w, h, color=CLEAR, shape='rect', border=MARC, bw=1, dash='dotted',
                         fs=fs, fc=MARC, note=n + ('\n\n' + note if note else ''), type='lg_marc')

    def added(self, id, label, x, y, w, h, note='', color='#ffffff', fs=15, shape='rounded'):
        return self.node(id, label, x, y, w, h, color=color, border='#64748b', bw=2, dash='dashed', fs=fs,
                         note=note, type='lg_added', shape=shape)

    def edge(self, src, tgt, label='', type='lg_causal', note='', curved=False, width=None, fs=14):
        lg = LEGEND[type]
        self.used.add(type)
        self.n += 1
        self.edges.append({"id": f"e{self.n}", "src": src, "tgt": tgt, "label": label, "type": type,
                           "color": lg['color'], "width": width or lg['width'], "dash": lg['dash'],
                           "fontSize": fs, "curved": curved, "polarity": "none", "delay": False,
                           "props": {}, "note": note, "traces": []})

    def footer(self, x, y, source):
        self.text('footer', f'{source}\n{ATTR}', x, y, 900, 52, fs=13, fc='#475569',
                  note=f'Source: {source}. Lecture: {LECTURE}.\n\nRebuilt as an editable RCN Graph Tool drawing by {ATTR}.')

    def save(self, fname):
        legend = [LEGEND[k] for k in LEGEND if k in self.used]
        d = {"version": "1.0", "mode": "select", "modelName": self.name,
             "modelNote": self.note + f'\n\nLecture: {LECTURE}.\n\n{ATTR}.',
             "canvasBg": "#ffffff", "graphAttrs": {"set": "Ostrom Nobel lecture figures"},
             "cldLoopNames": {}, "legendEntries": legend, "legendVisible": bool(legend), "legendCollapsed": False,
             "customSymbols": [], "nodes": self.nodes, "edges": self.edges, "lines": [], "metaEdges": []}
        with open(os.path.join(OUT, fname), 'w') as f:
            json.dump(d, f, indent=2, ensure_ascii=False)
        print(fname, len(self.nodes), 'nodes', len(self.edges), 'edges')


# ─────────────────────────────── Figure 1 ───────────────────────────────
g = G('Ostrom Figure 1 · Four types of goods',
      "Figure 1 of Ostrom's Nobel lecture, adapted there from Ostrom 2005: 24. Not in Marc's original SVG; added so the set starts where the lecture starts. The type of good decides which dilemma a group faces, and so which design principles carry the weight. Hover each quadrant for Ostrom's examples and neighborhood ones (ours).")
g.text('title', 'Figure 1 · Four types of goods', 520, 0, 700, 40, fs=22)
g.text('sub_h', 'SUBTRACTABILITY OF USE', 620, 70, 600, 30, fs=16,
       note="Ostrom replaced Samuelson's 'rivalry of consumption' with 'subtractability of use': how far one person's use leaves less for others.")
g.text('sub_hi', 'High', 420, 110, 200, 28, fs=16)
g.text('sub_lo', 'Low', 820, 110, 200, 28, fs=16)
g.text('exc_h', 'DIFFICULTY OF EXCLUDING\nPOTENTIAL BENEFICIARIES', 60, 300, 230, 70, fs=15,
       note="How hard it is to keep people who did not pay or contribute from benefiting.")
g.text('exc_hi', 'High', 190, 230, 80, 28, fs=16)
g.text('exc_lo', 'Low', 190, 450, 80, 28, fs=16)
g.node('cpr', 'Common-pool resources', 420, 240, 380, 190, color='#fde68a', shape='rect', fs=18,
       note="Ostrom: shares subtractability with private goods and difficulty of exclusion with public goods. Her 'very important fourth type', added in V. and E. Ostrom 1977. The design principles were found for this quadrant.\n\nIn a neighborhood (our examples): the garden's water, a shared fund that can be drawn down, volunteer hours, a community health worker's time, street parking.\n\nTwo dilemmas at once: appropriation (taking too much) and provision (not putting enough back). Principle 2B, costs in proportion to benefits, is about exactly that pair.")
g.node('pub', 'Public goods', 820, 240, 380, 190, color='#bfdbfe', shape='rect', fs=18,
       note="Hard to exclude, and one person's use takes little from another's. The dilemma is provision: everyone benefits whether or not they contribute, so contribution is the problem.\n\nIn a neighborhood (our examples): local safety, a shared body of knowledge such as a FedWiki site, a clean creek.\n\nKnowledge sits here in Ostrom's figure. Hess and Ostrom (2007) later showed knowledge commons can behave like common-pool resources too: congestion, pollution by bad information, enclosure.")
g.node('priv', 'Private goods', 420, 450, 380, 190, color='#e5e7eb', shape='rect', fs=18,
       note="Easy to exclude, and use subtracts. Markets handle these well.\n\nIn a neighborhood (our example): the vegetables from your own plot.")
g.node('toll', 'Toll goods', 820, 450, 380, 190, color='#ddd6fe', shape='rect', fs=18,
       note="Easy to exclude, little subtraction until crowding. Ostrom renamed Buchanan's 'club goods' to 'toll goods', because small public as well as private associations provide them.\n\nIn a neighborhood (our examples): a tool library, a co-op's member services, a meeting hall, a daycare.\n\nBoundary rules (who is a member) do most of the work here.")
g.text('cpr_ex', 'groundwater basins, lakes, irrigation systems, fisheries, forests', 420, 290, 330, 50, fs=13, fc='#334155', note='Ostrom\'s examples, from Figure 1.')
g.text('pub_ex', 'peace and security of a community, national defense, knowledge, fire protection, weather forecasts', 820, 290, 330, 50, fs=13, fc='#334155', note='Ostrom\'s examples, from Figure 1.')
g.text('priv_ex', 'food, clothing, automobiles', 420, 500, 330, 50, fs=13, fc='#334155', note='Ostrom\'s examples, from Figure 1.')
g.text('toll_ex', 'theaters, private clubs, daycare centers', 820, 500, 330, 50, fs=13, fc='#334155', note='Ostrom\'s examples, from Figure 1.')
g.added('vary', 'Both dimensions vary from low to high: these are regions, not boxes', 620, 600, 760, 44, fs=14,
        note="Ostrom's own modification (ii): subtractability and excludability are each a matter of degree, not present or absent. A garden's water is barely subtractable in a wet spring and fiercely so in a drought. Placing a neighborhood resource means asking where it sits now, and where it moves under stress.")
g.footer(620, 680, 'Ostrom 2010, Figure 1, adapted from Ostrom 2005: 24')
g.save('fig1-four-types-of-goods.json')


# ─────────────────────────────── Figure 2 ───────────────────────────────
g = G('Ostrom Figure 2 · A framework for institutional analysis',
      "Figure 2 of Ostrom's Nobel lecture (adapted from Ostrom 2005: 15). The overview of the IAD framework: three kinds of external variables shape an action situation, which generates interactions and outcomes that participants judge and that feed back. Marc's title for the whole set is kept at the top.")
g.marc('marc_title', 'Building Trust in One Another\nDeveloping Institutional rules matched to the ecological system', 560, -40, 760, 64, fs=19,
       note="The two halves of the lecture: trust is Figure 5; rules matched to the ecological system are Figures 4 and 6.")
g.text('title', 'Figure 2 · A framework for institutional analysis', 560, 40, 760, 36, fs=20)
g.box('ext', 140, 250, 220, 300, GREY + '66',
      note="Ostrom: the broadest categories of external factors affecting an action situation at a particular time. Some of them can be self-consciously revised over time. That revision is the dashed feedback, and it is where the levels of action live (see the Levels of action drawing).")
g.text('ext_h', 'External variables', 140, 125, 200, 28, fs=14)
g.node('bio', 'Biophysical Conditions', 140, 180, 170, 60, color=LIME,
       note="Ostrom: may be simplified in some analyses to one of the four types of goods in Figure 1.\n\nIn a neighborhood: the resource itself. The water, the land, the fund, the care hours. Figure 6 unpacks this as Resource System and Resource Units.")
g.node('com', 'Attributes of Community', 140, 255, 170, 60, color=ORANGE,
       note="Ostrom: the history of prior interactions, internal homogeneity or heterogeneity of key attributes, and the knowledge and social capital of those who may participate or be affected by others.\n\nFigure 6 unpacks this as Users. Figure 5 is about how these attributes become trust.")
g.node('rules', 'Rules-in-Use', 140, 335, 170, 44, color=BLUE,
       note="Ostrom: the common understanding of those involved about who must, must not, or may take which actions affecting others, subject to sanctions (citing Crawford and Ostrom). That definition is the Institutional Grammar.\n\nThey evolve as people interact, or are changed on purpose in a collective-choice or constitutional-choice setting.\n\nRules-in-use, not rules on paper. Coding a bylaw gives a first draft of this box; only observation confirms it.")
g.node('as', 'Action Situations', 440, 250, 170, 56, color=GREEN,
       note="The core of the IAD framework. Figure 3 opens it up; Figure 4 shows the rules acting on each of its parts.")
g.node('int', 'Interactions', 680, 210, 150, 44, color=RED,
       note="Patterns of interaction the situation generates: who takes, who contributes, who talks, who monitors, who fights.")
g.node('out', 'Outcomes', 680, 320, 150, 44, color=PURPLE,
       note="What results. Ostrom: interactions and outcomes are evaluated by participants (and potentially by scholars) and feed back on both the external variables and the action situation.")
g.node('eval', 'Evaluative Criteria', 900, 265, 160, 64, color=PURPLE,
       note="The yardsticks used to judge interactions and outcomes. In Ostrom 2005 these include economic efficiency, equity, accountability, conformance to values, and sustainability.\n\nOur tools that work here: SPC charts kept over time, the protection survey, the commons viability profile.")
g.edge('ext', 'as', type='lg_causal')
g.edge('as', 'int', type='lg_causal')
g.edge('int', 'out', type='lg_causal')
g.edge('eval', 'int', type='lg_causal')
g.edge('eval', 'out', 'Judges', type='lg_causal', note="'Judges' is Marc's label, from his Figure 4 redrawing.")
g.edge('int', 'as', type='lg_feedback', curved=True)
g.edge('out', 'as', type='lg_feedback', curved=True,
       note="Outcomes feed back into the next round of the same situation.")
g.edge('out', 'ext', 'changes the rules', type='lg_added_edge', curved=True,
       note="Added here from Ostrom's text, which says outcomes feed back on the external variables as well as the action situation. Marc's redrawing shows only the feedback to the action situation.\n\nThis arrow is where collective choice and constitutional choice live: people see the outcomes and change the rules-in-use. The Levels of action drawing opens it up.")
g.footer(560, 470, 'Ostrom 2010, Figure 2, adapted from Ostrom 2005: 15')
g.save('fig2-iad-framework.json')


# ─────────────────────────────── Figure 3 ───────────────────────────────
g = G('Ostrom Figure 3 · The internal structure of an action situation',
      "Figure 3 of Ostrom's Nobel lecture (adapted from Ostrom 2005: 33). The seven working parts of an action situation. Ostrom built them, with Reinhard Selten, to match the parts of a formal game, so that game models and field coding share one vocabulary. In her figure, Information and Control point at the link between actions and outcomes; a graph cannot point at an arrow, so that link is drawn here as a small 'linked to' node.")
g.text('title', 'Figure 3 · The internal structure of an action situation', 470, -40, 800, 36, fs=20)
g.box('ext', 470, 270, 860, 560, GREY + '55')
g.text('ext_h', 'External Variables', 470, 20, 300, 34, fs=20)
g.box('asb', 470, 300, 760, 440, GREEN + '55',
      note="Ostrom 2005, p. 188: participants are assigned to positions, and in those positions choose among actions in light of their information, the control they have over action-outcome links, and the benefits and costs assigned to actions and outcomes. That sentence names all seven parts.")
g.text('as_h', 'Action Situation', 470, 105, 300, 34, fs=20)
NOTE3 = {
    'actors': "Ostrom's game element (i): the characteristics of the actors involved, including the model of human choice adopted.\n\nSet by boundary rules: who may enter or leave. Plain question: who is in, who is out, how do you get in and out?",
    'pos': "Game element (ii): the positions they hold (first mover, row player; in the field, irrigator, monitor, chair).\n\nSet by position rules. Plain question: what roles exist here? Roles outlive the people in them.",
    'acts': "Game element (iii): the set of actions actors can take at specific points.\n\nSet by choice rules. Plain question: what is each role allowed, required, or forbidden to do?",
    'info': "Game element (iv): the amount of information available at each decision point.\n\nSet by information rules. Plain question: what has to be shared, with whom, and when? What may be kept quiet?",
    'ctrl': "Game element (vi): the functions that map actors and actions into outcomes. How choices combine.\n\nSet by aggregation rules. Plain question: how do we decide? Who has to agree for it to count?",
    'pot': "Game element (v): the outcomes actors jointly affect.\n\nSet by scope rules. Plain question: what outcomes are we allowed to affect? What is off limits?",
    'ncb': "Game element (vii): the benefits and costs assigned to the link between actions chosen and outcomes obtained.\n\nSet by payoff rules. Plain question: who bears the cost, who gets the benefit, and what happens if you break the rule?",
}
g.node('actors', 'Actors', 200, 180, 160, 44, note=NOTE3['actors'])
g.node('pos', 'Positions', 200, 300, 160, 44, note=NOTE3['pos'])
g.node('acts', 'Actions', 200, 420, 160, 44, note=NOTE3['acts'])
g.node('info', 'INFORMATION\nabout', 430, 200, 160, 60, note=NOTE3['info'])
g.node('ctrl', 'CONTROL\nover', 640, 200, 160, 60, note=NOTE3['ctrl'])
g.node('link', 'linked to', 520, 420, 110, 36, shape='ellipse', fs=14,
       note="In Ostrom's figure this is the arrow 'linked to' from Actions to Potential Outcomes, with Information and Control pointing at it. Drawn as a node here because an arrow cannot point at an arrow.")
g.node('pot', 'POTENTIAL\nOUTCOMES', 740, 420, 160, 60, note=NOTE3['pot'])
g.node('ncb', 'NET COSTS AND\nBENEFITS', 740, 500, 160, 56, note=NOTE3['ncb'])
g.edge('actors', 'pos', 'assigned to', type='lg_link')
g.edge('pos', 'acts', 'assigned to', type='lg_link')
g.edge('acts', 'link', type='lg_link')
g.edge('link', 'pot', type='lg_link')
g.edge('info', 'link', type='lg_link')
g.edge('ctrl', 'link', type='lg_link')
g.edge('ncb', 'pot', 'assigned to', type='lg_link')
g.footer(470, 600, 'Ostrom 2010, Figure 3, adapted from Ostrom 2005: 33')
g.save('fig3-action-situation.json')


# ─────────────────────────────── Figure 4 ───────────────────────────────
g = G("Ostrom Figure 4 · Rules acting on the action situation, with Marc's questions",
      "Figure 4 of Ostrom's Nobel lecture (adapted from Ostrom 2005: 189): rules as exogenous variables directly affecting the elements of an action situation. Each of the seven rule types acts on one of the seven working parts. Marc's redrawing adds the context arrows from Biophysical Conditions and Attributes of Community, the outcome loop from Figure 2, and his own margin questions (green, dotted): WHO? WHAT? HOW? WHY?, For whom, By whom, Am I allowed?, Data & Information, Knowledge & Understanding, parameterizes, models, Judges, and Is it worth the effort and risk?\n\nNote on vocabulary: Marc's HOW? (payoff) and WHY? (scope) use the same words as the Agreement Checker's plain questions, where HOW? means the manner of an action. One vocabulary should be settled across this drawing, Seven Questions and the checker.")
g.text('title', 'Figure 4 · Rules as exogenous variables directly affecting the elements of an action situation', 640, -60, 1100, 36, fs=19)
g.box('ext', 640, 450, 1160, 960, GREY + '55')
g.text('ext_h', 'External Variables', 640, 10, 300, 34, fs=22)
g.node('bio', 'Biophysical\nConditions', 260, 70, 150, 64, color=LIME,
       note="Sets context for the action situation: what the resource is and how it behaves. Figure 6 unpacks it.")
g.node('com', 'Attributes of\nCommunity', 1050, 70, 150, 64, color=ORANGE,
       note="Sets context for the action situation: history, heterogeneity, knowledge, social capital. Figure 5 is about how these become trust.")
g.box('rules', 640, 525, 900, 710, BLUE + '55',
      note="Rules-in-use: the seven rule types, each acting on one working part of the situation. Ostrom found many variants of each; 27 different boundary rules in common-pool resource cases alone (Ostrom 1999: 510). The design principles describe patterns across these rules.")
g.text('rules_h', 'Rules-In-Use', 330, 200, 220, 34, fs=22)
g.box('asb', 680, 540, 700, 480, GREEN + '55')
g.text('as_h', 'Action Situation', 680, 750, 300, 34, fs=22)
g.node('actors', 'Actors', 450, 340, 150, 40, note=NOTE3['actors'])
g.node('pos', 'Positions', 450, 470, 150, 40, note=NOTE3['pos'])
g.node('acts', 'Actions', 650, 640, 150, 40, note=NOTE3['acts'])
g.node('info', 'INFORMATION\nabout', 650, 360, 150, 56, note=NOTE3['info'])
g.node('ctrl', 'CONTROL\nover', 850, 360, 150, 56, note=NOTE3['ctrl'])
g.node('pot', 'POTENTIAL\nOUTCOMES', 880, 640, 150, 56, note=NOTE3['pot'])
g.node('ncb', 'NET COSTS AND\nBENEFITS', 880, 720, 150, 56, note=NOTE3['ncb'])
g.edge('actors', 'pos', 'assigned to', type='lg_link')
g.edge('pos', 'acts', 'assigned to', type='lg_link')
g.edge('acts', 'pot', 'linked to', type='lg_link')
g.edge('info', 'acts', 'parameterizes', type='lg_link', note="'parameterizes' is Marc's label: information sets the parameters an actor chooses within.")
g.edge('ctrl', 'acts', 'models', type='lg_link', note="'models' is Marc's label: control is the model of how choices become outcomes.")
g.edge('ncb', 'pot', 'assigned to', type='lg_link')

RULE = {
    'r_bound': ("Boundary Rules", 260, 340, 'actors',
                "Ostrom: how actors are chosen to enter or leave positions.\n\nDesign principles that rest on it: 1A user boundaries (who is in); 3 collective choice (are the people affected seated?); 6 conflict resolution (who may bring a dispute).\n\nIn the grammar: DO WHAT? is join, enter, leave, admit, expel; or a creating agreement's FORMED? and OUT OF WHAT?\n\nMicrosituational condition it shapes: low-cost entry and exit (Figure 5)."),
    'r_pos': ("Position Rules", 260, 470, 'pos',
              "Ostrom: a set of positions and how many actors hold each one.\n\nDesign principles: 3 (is there a seat for those affected?); 4A (a monitor role); 6 (a venue for disputes).\n\nIn the grammar: mostly creating agreements. WHAT ARE WE CREATING? the water keeper.\n\nThe health worker who is never at the table is a missing position rule, set at the constitutional level."),
    'r_choice': ("Authority/\nChoice Rules", 260, 640, 'acts',
                 "Ostrom: which actions are assigned to an actor in a position. Called authority rules in earlier work, choice rules in 2005 and the lecture.\n\nDesign principles: 2B (a duty matched to each benefit); 4A (a duty to watch).\n\nIn the grammar: the MUST, MAY, or MUST NOT, and the DO WHAT?"),
    'r_info': ("Information\nRules", 650, 250, 'info',
               "Ostrom: channels of communication among actors, and what information must, may, or must not be shared.\n\nDesign principles: 4A and 4B monitoring (reports back to the users); 3 (do the affected see proposals in time?).\n\nIn the grammar: DO WHAT? is report, record, notify, publish.\n\nMicrosituational conditions it shapes: communication among all participants; reputations known (Figure 5)."),
    'r_agg': ("Aggregation\nRules", 850, 250, 'ctrl',
              "Ostrom: how the decisions of actors are mapped to intermediate or final outcomes. Majority, unanimity, and so on.\n\nThe rule type no design principle names. Principles 3 and 6 assume decisions get made without saying how choices combine. Ask: who has to agree for this to count?\n\nIn the grammar: DO WHAT? is vote, decide, approve, consent."),
    'r_scope': ("Scope\nRules", 1050, 640, 'pot',
                "Ostrom: the outcomes that could be affected.\n\nDesign principles: 1B resource boundaries (what the shared thing is); 7 recognition of rights (scope set by an outside body).\n\nIn the grammar: TO WHAT? points at a defined resource, or a rule limits what may be changed."),
    'r_pay': ("Payoff\nRules", 880, 815, 'ncb',
              "Ostrom: how benefits and costs are distributed to actors in positions.\n\nDesign principles: 2B costs in proportion to benefits; 5 graduated sanctions (the OR ELSE).\n\nIn the grammar: the OR ELSE, and sentences giving a benefit or a duty to pay.\n\nMicrosituational conditions it shapes: each contribution visibly matters; sanctions the group agreed to (Figure 5)."),
}
for rid, (lab, x, y, tgt, note) in RULE.items():
    g.node(rid, lab, x, y, 120, 48, color='#dbeafe', fs=13, note=note)
    g.edge(rid, tgt, type='lg_rule')

g.edge('bio', 'asb', 'Set Context for', type='lg_causal')
g.edge('com', 'asb', 'Set Context for', type='lg_causal')

g.marc('m_who_b', 'WHO?', 260, 300, 70, fs=15)
g.marc('m_who_i', 'WHO?', 560, 230, 70, fs=15)
g.marc('m_who_a', 'WHO?', 960, 230, 70, fs=15)
g.marc('m_what', 'WHAT?', 260, 690, 80, fs=15)
g.marc('m_how', 'HOW?', 790, 815, 70, fs=15, note="Marc's HOW? marks payoff rules. The Agreement Checker's HOW? means the manner of an action; settle one vocabulary.")
g.marc('m_why', 'WHY?', 1050, 690, 70, fs=15, note="Marc's WHY? marks scope rules: what outcomes are we here for.")
g.marc('m_data', 'Data &\nInformation', 650, 175, 150, 50, fs=15)
g.marc('m_know', 'Knowledge &\nUnderstanding', 850, 175, 160, 50, fs=15)
g.marc('m_forwhom', 'For Whom\n(by roles)', 120, 340, 130, 50, fs=15)
g.marc('m_bywhom', 'By Whom\n(by roles)', 120, 470, 130, 50, fs=15)
g.marc('m_allowed', 'Am I allowed?\n(derived authority)', 115, 640, 150, 50, fs=15,
       note="The person-in-the-seat question for choice rules. Ostrom draws the situation from outside, as an analyst; these margin questions draw it from inside the seat.")

g.node('int', 'Interactions', 1330, 470, 140, 44, color=RED)
g.node('out', 'Outcomes', 1330, 640, 140, 44, color=PURPLE)
g.node('eval', 'Evaluative\nCriteria', 1540, 560, 150, 60, color=PURPLE)
g.edge('asb', 'int', type='lg_causal', width=4)
g.edge('int', 'out', type='lg_causal', width=4)
g.edge('eval', 'int', type='lg_causal')
g.edge('eval', 'out', 'Judges', type='lg_causal', note="'Judges' is Marc's label.")
g.edge('int', 'rules', type='lg_feedback', curved=True, width=3)
g.edge('out', 'rules', type='lg_feedback', curved=True, width=3)
g.marc('m_judge', 'Judgement\nIs it worth the effort and risk?', 1460, 760, 300, 54, fs=15,
       note="The question each person answers before cooperating. Figure 5 says where the answer comes from: trust that the others will reciprocate.")
g.footer(640, 975, 'Ostrom 2010, Figure 4, adapted from Ostrom 2005: 189')
g.save('fig4-rules-acting-on-the-situation.json')


# ─────────────────────────── Levels of action (added) ───────────────────────────
g = G('Levels of action · where the rules come from (added panel)',
      "Not a figure in the lecture, which mentions the levels in one sentence: rules-in-use may be self-consciously changed in a collective-choice or constitutional-choice setting. Added here after Kiser and Ostrom (1982) and Ostrom (2005, chapter 2). Each level is itself an action situation. Its outcomes are the rules-in-use of the situation below. That makes the dashed 'changes the rules' feedback in Figure 2 visible. Everything in this panel is an addition, so it uses the dashed 'added' style throughout.")
g.text('title', 'Levels of action · each level is an action situation whose outcomes are the rules below', 520, -30, 1000, 36, fs=19)
LV = [
    ('meta', 'METACONSTITUTIONAL', "What people believe is even thinkable. Culture, identity, what counts as fair.",
     "Beneath (or above) all written rules: the shared sense of what a rule may be, who counts as a person with standing, what fairness means. Unwritten, which is why it is the strongest. The Institutional Grammar reaches it only as shared habits, recorded when seen.\n\nGarden example: whether anyone thinks newcomers deserve a plot at all."),
    ('const', 'CONSTITUTIONAL', "Who may make the rules, and how they decide.",
     "The one-question test: does it change who may change the rules? The most leverage (Meadows 1 to 4).\n\nRule types here create the seats. Position rules make roles; boundary rules say who is a member; aggregation rules say how the rule-makers decide.\n\nGarden example: who counts as a garden member, and how the spring meeting votes.\n\nThe health worker who is never at the table: there is no seat for them. Only a constitutional decision fixes it."),
    ('coll', 'COLLECTIVE CHOICE', "Making and changing the operational rules.",
     "The one-question test: does it change a rule? (Meadows 5 and 6.) Design principle 3 lives here: the people affected help make and change the rules.\n\nGarden example: the spring meeting amends the watering days.\n\nA commons with operational rules and nothing above them can follow its rules but cannot change them."),
    ('oper', 'OPERATIONAL', "Doing the work: taking, giving, watching, sanctioning.",
     "The one-question test: does it change a number? The least leverage (Meadows 7 to 12), and where nearly all the effort goes.\n\nGarden example: watering on your assigned day; the keeper suspends a gardener who breaks the rule.\n\nA complaint that keeps recurring here is usually a rule problem one level up."),
]
y = 60
prev = None
for i, (k, name, sub, note) in enumerate(LV):
    g.added(k, name, 260, y + 50, 300, 64, note=note, color=GREEN + '55', fs=17)
    g.text(k + '_s', sub, 900, y + 50, 520, 50, fs=15, note=note)
    if prev:
        rid = prev + '_out'
        g.added(rid, 'rules-in-use for the level below', 260, y - 30, 300, 40, color=BLUE + '66', fs=14,
                note="The outcome of the situation above becomes a rule here. McGinnis calls such situations adjacent: outcomes in one determine a working part or a rule of the other.")
        g.edge(prev, rid, type='lg_added_edge')
        g.edge(rid, k, type='lg_added_edge')
    prev = k
    y += 170
g.added('world', 'Outcomes in the world', 600, y - 40, 260, 50, color=PURPLE + '66', fs=16,
        note="Water used, plots tended, care given, money moved. What Figure 2 calls interactions and outcomes.")
g.edge('oper', 'world', type='lg_added_edge')
g.edge('world', 'coll', 'seen and judged', type='lg_feedback', curved=True,
       note="The feedback in Figure 2. People see outcomes, judge them, and take them to the level that can change the rule. Monitoring (principles 4A and 4B) and evaluative criteria feed this arrow.")
g.edge('world', 'const', 'a rule problem that keeps recurring', type='lg_feedback', curved=True,
       note="A rule problem that keeps recurring is usually a constitutional one.")
g.footer(520, y + 60, 'After Kiser and Ostrom 1982 and Ostrom 2005, ch. 2; not a figure in the lecture')
g.save('levels-of-action.json')


# ─────────────────────────────── Figure 5 ───────────────────────────────
SIX = ("Ostrom's six conditions that raise cooperation (lecture pp. 661–662), each with the design principles that tend to produce it. The pairing is ours, not Ostrom's.\n\n"
       "1. Everyone can talk to everyone, ideally face to face.\n→ 3 collective choice, 6 conflict resolution\n\n"
       "2. People's past behaviour is known.\n→ 4A monitoring users\n\n"
       "3. Each contribution clearly makes a difference.\n→ 2B costs in proportion to benefits\n\n"
       "4. People can enter or leave at low cost.\n→ 1A user boundaries\n\n"
       "5. A long time horizon.\n→ 7 recognition of rights (secure tenure)\n\n"
       "6. Sanctions the group agreed to itself.\n→ 5 graduated sanctions, 3 collective choice")
TOOLS = ("Where our tools touch Ostrom's six conditions (hover Micro situational variables for the list):\n\n"
         "1 talk: Groove, FedWiki, face-to-face meetings\n"
         "2 reputations: SODOTO badges, the Relationship Record, under 'nothing about me without me'\n"
         "3 contribution matters: SPC charts, a ledger\n"
         "4 cheap exit: an owned SODOTO site, forking a FedWiki page\n"
         "6 agreed sanctions: the Agreement Checker asking who wrote the OR ELSE")
g = G('Ostrom Figure 5 · Context, trust and cooperation',
      "Figure 5 of Ostrom's Nobel lecture (from Poteete, Janssen and Ostrom 2010): microsituational and broader context of social dilemmas affect levels of trust and cooperation. Rules alone do not explain cooperation; confidence that others will reciprocate does, and the structure of the situation is what makes that confidence possible. Marc's redrawing coloured the words contextual, situational, individuals, trust and cooperation red; a graph label has one colour, so those words are not highlighted here. Hover Micro situational variables for Ostrom's six conditions and their design-principle pairs.")
g.text('title', 'Figure 5 · Microsituational and broader context of social dilemmas affect levels of trust and cooperation', 620, -40, 1150, 36, fs=18)
g.node('broad', 'Broader contextual variables', 160, 60, 240, 56, color='#ffffff',
       note="Ostrom: the broader context of the social-ecological system in which groups make decisions. Figure 6 shows its top tier.\n\nShe names ten field variables that make self-organizing more likely (Ostrom 2009): the size, productivity and predictability of the resource system; the mobility of resource units; collective-choice rules the users can use to change their own rules; and the users' number, leadership, norms and social capital, knowledge of the system, and how much the resource matters to them.")
g.node('micro', 'Micro situational variables', 380, 200, 240, 56, color='#fef3c7', border='#b45309', bw=2.5, note=SIX)
g.node('learn', 'Learning and norm-adopting individuals', 380, 360, 250, 64,
       note="Ostrom's updated model of the individual: people learn from experience and adopt norms, rather than the narrowly self-interested actor of older collective-action theory. Context shapes what they learn about the situation and about each other.")
g.node('trust', 'Levels of trust that other participants are reciprocators', 680, 360, 260, 70,
       note="The centre of the figure. Ostrom: the structure of the situation generates enough information about others' likely behaviour for people to trust they will bear their share of the costs.\n\nMarc's question in Figure 4, 'Is it worth the effort and risk?', is answered here.")
g.node('coop', 'Levels of cooperation', 960, 360, 200, 56, note=TOOLS)
g.node('net', 'Net Benefits', 1180, 360, 150, 56,
       note="Higher cooperation, higher benefits. The dashed feedback reinforces learning, positive or negative: a group can learn to cooperate, or learn not to.")
g.edge('broad', 'micro', type='lg_causal')
g.edge('broad', 'learn', type='lg_causal', curved=True)
g.edge('micro', 'learn', type='lg_causal')
g.edge('learn', 'trust', type='lg_causal')
g.edge('trust', 'coop', type='lg_causal')
g.edge('coop', 'net', type='lg_causal')
g.edge('net', 'learn', type='lg_feedback', curved=True)
g.footer(620, 520, 'Ostrom 2010, Figure 5, from Poteete, Janssen and Ostrom 2010')
g.save('fig5-trust-and-cooperation.json')


# ─────────────────────────────── Figure 6 ───────────────────────────────
g = G('Ostrom Figure 6 · Action situations embedded in broader social-ecological systems',
      "Figure 6 of Ostrom's Nobel lecture (adapted from Ostrom 2007: 15182): the top tier of the social-ecological systems (SES) framework. Every field setting has these. Each can be unpacked into second-tier variables (Ostrom 2009, Science 325: 419–422, Table 1); hover a component for its list. Marc's redrawing coloured Resource, Governance, Users and Action red; those words are not highlighted here.")
g.text('title', 'Figure 6 · Action situations embedded in broader social-ecological systems', 520, -40, 950, 36, fs=19)
g.node('S', 'Social, Economic, and Political Settings (S)', 520, 30, 460, 44, color='#ffffff', bw=0, border='#ffffff', fs=18,
       note="Second tier (Ostrom 2009): S1 economic development; S2 demographic trends; S3 political stability; S4 government settlement policies; S5 market incentives; S6 media organization.")
g.node('focal', '', 520, 270, 720, 330, color=CLEAR, shape='rect', dash='dashed', bw=1.5,
       note="The focal social-ecological system: the commons being studied, inside its broader settings.")
g.node('RS', 'Resource System (RS)', 270, 160, 170, 60, color='#ecfccb',
       note="Second tier: RS1 sector; RS2 clarity of system boundaries; RS3 size*; RS4 human-constructed facilities; RS5 productivity*; RS6 equilibrium properties; RS7 predictability of system dynamics*; RS8 storage characteristics; RS9 location.\n(* among the ten variables that make self-organizing more likely.)\n\nIn a neighborhood: the garden, the aquifer, the care network, the fund. Figure 1 asks what type of good it is; the RCN Map can hold where it is.")
g.node('GS', 'Governance System (GS)', 770, 160, 170, 60, color='#dbeafe',
       note="Second tier: GS1 government organizations; GS2 nongovernment organizations; GS3 network structure; GS4 property-rights systems; GS5 operational rules; GS6 collective-choice rules*; GS7 constitutional rules; GS8 monitoring and sanctioning processes.\n\nThe levels of action are written into this list as GS5, GS6 and GS7. The design principles mostly describe the governance system and the users. The Agreement Checker codes GS5 to GS8.")
g.node('RU', 'Resource Units (RU)', 270, 390, 170, 60, color='#ecfccb',
       note="Second tier: RU1 resource unit mobility*; RU2 growth or replacement rate; RU3 interaction among resource units; RU4 economic value; RU5 number of units; RU6 distinctive markings; RU7 spatial and temporal distribution.\n\nIn a neighborhood: gallons, plots, hours, dollars.")
g.node('U', 'Users (U)', 770, 390, 170, 60, color='#fed7aa',
       note="Second tier: U1 number of users*; U2 socioeconomic attributes; U3 history of use; U4 location; U5 leadership/entrepreneurship*; U6 norms/social capital*; U7 knowledge of the SES/mental models*; U8 importance of the resource*; U9 technology used.\n\nThe Relationship Record and SODOTO badges describe users. U6 is where Figure 5's trust is carried from one situation to the next.")
g.node('ASit', 'Action Situation\nInteractions (I) → Outcomes (O)', 520, 275, 300, 80, color=GREEN + '33', dash='dashed',
       note="Interactions, second tier: I1 harvesting levels; I2 information sharing; I3 deliberation processes; I4 conflicts; I5 investment activities; I6 lobbying activities.\nOutcomes: O1 social performance (efficiency, equity, accountability, sustainability); O2 ecological performance (overharvest, resilience, biodiversity, sustainability); O3 externalities.\n\nFigures 2 to 4 open this box up.")
g.node('ECO', 'Related Ecosystems (ECO)', 520, 500, 320, 44, color='#ffffff', bw=0, border='#ffffff', fs=18,
       note="Second tier: ECO1 climate patterns; ECO2 pollution patterns; ECO3 flows into and out of the focal SES.")
for a in ('RS', 'GS', 'RU', 'U'):
    g.edge(a, 'ASit', type='lg_causal')
    g.edge('ASit', a, type='lg_feedback', curved=True)
g.edge('RS', 'RU', type='lg_causal')
g.edge('RU', 'RS', type='lg_causal')
g.edge('GS', 'U', type='lg_causal')
g.edge('U', 'GS', type='lg_causal')
g.edge('S', 'focal', type='lg_causal')
g.edge('focal', 'S', type='lg_causal')
g.edge('ECO', 'focal', type='lg_causal')
g.edge('focal', 'ECO', type='lg_causal')
g.footer(520, 600, 'Ostrom 2010, Figure 6, adapted from Ostrom 2007: 15182')
g.save('fig6-social-ecological-system.json')
