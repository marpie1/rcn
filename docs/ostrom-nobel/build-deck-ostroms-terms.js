#!/usr/bin/env node
// build-deck-ostroms-terms.js — "Governing What We Share", the version that leads with Ostrom's own terms
// and translates each into plain language. Companion: build-deck.js, which leads with everyday words.
// Uses the diagram PNGs in img/ (exported from the Graph Tool drawings in this folder, unmodified).
// Run: NODE_PATH=<dir with pptxgenjs> node build-deck.js   → governing-what-we-share-ostroms-terms.pptx
// Marc Pierson and Claude Opus 5.5 · October 2026
'use strict';
const path = require('path');
const pptxgen = require('pptxgenjs');
const { applyTheme } = require(process.env.PPTX_SKILL + '/scripts/apply_theme.js');

const HERE = __dirname;
const IMG = (f) => path.join(HERE, 'img', f);
const OUT = path.join(HERE, 'governing-what-we-share-ostroms-terms.pptx');
const ATTR = 'Marc Pierson and Claude Opus 5.5 · October 2026';

const THEME = {
  name: 'Commons', headFontFace: 'Cambria', bodyFontFace: 'Calibri',
  colors: { dk1: '1E2A22', lt1: 'FFFFFF', dk2: '1F3D2B', lt2: 'EEF3EA', accent1: '2E6B45', accent2: 'C9822A',
            accent3: '3E7CB1', accent4: 'B5532D', accent5: '7FA35B', accent6: '6B5B95', hlink: '3E7CB1', folHlink: '6B5B95' },
};
const SIZES = {
  'fig1-four-types-of-goods.png': [2298, 1553],
  'fig2-iad-framework.png': [2393, 1399],
  'fig3-action-situation.png': [1202, 1277],
  'fig4-closeup.png': [1163, 933],
  'fig4-rules-acting-on-the-situation.png': [1714, 1285],
  'fig5-trust-and-cooperation.png': [2466, 1200],
  'fig6-social-ecological-system.png': [1886, 1722],
  'levels-of-action.png': [2101, 1739],
};

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = 'Governing What We Share';
pres.author = 'Marc Pierson';
const C = pres.SchemeColor;

const RUNGS = [
  'The whole system', 'What we share', 'One situation in its setting', 'Layers of decision',
  'Inside one situation', 'The rules that shape it', 'What lasting rules share', 'One sentence of a rule', 'One person deciding',
];

// ── layouts ──────────────────────────────────────────────────────────────
pres.defineSlideMaster({
  title: 'TITLE', background: { color: C.text2 },
  objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: 0.8, y: 1.9, w: 11.7, h: 1.5, fontSize: 48, bold: true, color: C.background1, valign: 'bottom' }, text: '' } },
    { placeholder: { options: { name: 'body', type: 'body', x: 0.8, y: 3.6, w: 11.0, h: 1.3, fontSize: 22, color: C.background2, valign: 'top' }, text: '' } },
    { placeholder: { options: { name: 'attr', type: 'body', x: 0.8, y: 6.3, w: 11.0, h: 0.5, fontSize: 14, color: C.accent2 }, text: '' } },
  ],
});
pres.defineSlideMaster({
  title: 'SECTION', background: { color: C.text2 },
  objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: 0.8, y: 2.3, w: 6.4, h: 1.6, fontSize: 40, bold: true, color: C.background1, valign: 'bottom' }, text: '' } },
    { placeholder: { options: { name: 'body', type: 'body', x: 0.8, y: 4.05, w: 6.4, h: 2.2, fontSize: 18, color: C.background2, valign: 'top' }, text: '' } },
  ],
  slideNumber: { x: 12.4, y: 7.0, w: 0.6, h: 0.3, fontSize: 10, color: C.background2 },
});
pres.defineSlideMaster({
  title: 'CONTENT', background: { color: C.background1 },
  objects: [
    { placeholder: { options: { name: 'chip', type: 'body', x: 0.6, y: 0.25, w: 12.1, h: 0.35, fontSize: 12, bold: true, color: C.accent2, charSpacing: 1 }, text: '' } },
    { placeholder: { options: { name: 'title', type: 'title', x: 0.6, y: 0.6, w: 12.1, h: 0.8, fontSize: 32, bold: true, color: C.text2, valign: 'middle' }, text: '' } },
    { text: { text: 'Governing What We Share', options: { x: 0.6, y: 7.05, w: 6, h: 0.3, fontSize: 10, color: '6B7A70' } } },
  ],
  slideNumber: { x: 12.4, y: 7.05, w: 0.6, h: 0.3, fontSize: 10, color: '6B7A70' },
});

// ── helpers ──────────────────────────────────────────────────────────────
let section = null;
let phase = 'OPENING';
function sect(n, title, sub, notes) {
  section = `${n} · ${RUNGS[n - 1]}`;
  pres.addSection({ title: section });
  const s = pres.addSlide({ masterName: 'SECTION', sectionTitle: section });
  s.addText(title, { placeholder: 'title' });
  s.addText(sub, { placeholder: 'body' });
  ladder(s, n);
  s.addNotes(notes);
  return s;
}
function ladder(s, cur) {
  const x = 7.9, w = 4.7, h = 0.5, gap = 0.08, y0 = 1.0;
  s.addText('ZOOMING IN', { x, y: 0.45, w, h: 0.4, fontSize: 12, bold: true, color: C.accent2, charSpacing: 2, isTextBox: true, margin: 0 });
  RUNGS.forEach((r, i) => {
    const on = i + 1 === cur;
    s.addText(`${i + 1}   ${r}`, {
      shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.08, x: x + i * 0.12, y: y0 + i * (h + gap), w: w - i * 0.12, h,
      fill: { color: on ? C.accent2 : C.background1, transparency: on ? 0 : 88 },
      line: { color: on ? C.accent2 : C.background2, width: 0.75, transparency: on ? 0 : 60 },
      fontSize: 15, bold: on, color: on ? C.text2 : C.background2, margin: [0, 10, 0, 12], valign: 'middle', objectName: `rung ${i + 1}`,
    });
  });
  s.addText('largest scale', { x: x + 2.6, y: 0.62, w: 2.1, h: 0.3, fontSize: 11, italic: true, color: C.background2, align: 'right', isTextBox: true, margin: 0 });
  s.addText('smallest scale', { x: x + 2.6, y: y0 + 9 * (h + gap) - 0.02, w: 2.1, h: 0.3, fontSize: 11, italic: true, color: C.background2, align: 'right', isTextBox: true, margin: 0 });
}
function content(title, notes, chip) {
  const s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: section || 'Opening' });
  s.addText(chip || (section ? `SCALE ${section.toUpperCase()}` : phase), { placeholder: 'chip' });
  s.addText(title, { placeholder: 'title' });
  s.addNotes(notes);
  return s;
}
function para(s, text, o) {
  s.addText(text, Object.assign({ fontSize: 16, color: C.text1, valign: 'top', isTextBox: true, margin: 0, paraSpaceAfter: 6 }, o));
}
function bullets(s, items, o) {
  const runs = items.map((t, i) => {
    const r = Array.isArray(t) ? t : [{ text: t }];
    return r.map((x, j) => ({ text: x.text, options: Object.assign({ bullet: j === 0 ? { indent: 15 } : undefined, breakLine: j === r.length - 1 && i < items.length - 1 }, x.options || {}) }));
  }).flat();
  s.addText(runs, Object.assign({ fontSize: 16, color: C.text1, valign: 'top', isTextBox: true, margin: 0, paraSpaceAfter: 8 }, o));
}
function card(s, x, y, w, h, head, body, o = {}) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: o.fill || C.background2 }, line: { color: o.line || o.fill || C.background2, width: 1 }, objectName: `card ${head}` });
  const runs = [{ text: head, options: { bold: true, fontSize: o.headSize || 16, color: o.headColor || C.text2, breakLine: true } }];
  if (body) runs.push({ text: body, options: { fontSize: o.bodySize || 14, color: o.bodyColor || C.text1 } });
  s.addText(runs, { x: x + 0.15, y: y + 0.1, w: w - 0.3, h: h - 0.2, valign: o.valign || 'top', isTextBox: true, margin: 0, paraSpaceAfter: 4 });
}
function img(s, file, box) {
  const [pw, ph] = SIZES[file];
  const r = pw / ph;
  let w = box.w, h = w / r;
  if (h > box.h) { h = box.h; w = h * r; }
  const x = box.x + (box.w - w) / 2, y = box.y + (box.h - h) / 2;
  s.addImage({ path: IMG(file), x, y, w, h, altText: box.alt || file });
  return { x, y, w, h };
}
function caption(s, text, x, y, w) {
  s.addText(text, { x, y, w, h: 0.3, fontSize: 10, italic: true, color: '5B6B60', isTextBox: true, margin: 0 });
}
// Diagram slide: picture left, what-it-shows right
function diagram(title, file, src, shows, notes) {
  const s = content(title, notes);
  const b = img(s, file, { x: 0.5, y: 1.55, w: 8.3, h: 5.15, alt: title });
  caption(s, src, b.x, b.y + b.h + 0.05, b.w);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 9.1, y: 1.55, w: 3.75, h: 5.3, rectRadius: 0.08, fill: { color: C.background2 }, line: { color: C.background2 }, objectName: 'reading panel' });
  s.addText('HOW TO READ IT', { x: 9.3, y: 1.7, w: 3.4, h: 0.3, fontSize: 12, bold: true, color: C.accent1, charSpacing: 1, isTextBox: true, margin: 0 });
  bullets(s, shows, { x: 9.3, y: 2.1, w: 3.4, h: 4.65, fontSize: 14 });
  return s;
}
// Words slide: every technical word on a diagram, in plain language
function words(title, terms, intro, notes) {
  const s = content(title, notes || (intro + ' Read the terms aloud with the diagram on screen; each card is the plain-language meaning.'));
  let y0 = 1.55;
  if (intro) { para(s, intro, { x: 0.6, y: 1.5, w: 12.1, h: 0.45, fontSize: 15, italic: true, color: '3E4A42' }); y0 = 2.0; }
  const cols = 2, rows = Math.ceil(terms.length / cols), gap = 0.12;
  const W = (12.1 - gap) / cols, H = (6.85 - y0 - gap * (rows - 1)) / rows;
  terms.forEach(([t, d], i) => {
    const c = Math.floor(i / rows), r = i % rows;
    card(s, 0.6 + c * (W + gap), y0 + r * (H + gap), W, H, t, d, { headSize: 15, bodySize: 14, headColor: C.accent1 });
  });
  return s;
}

// ═════════════════════════════════════════════════════════════════════════
// OPENING
pres.addSection({ title: 'Opening' });
{
  const s = pres.addSlide({ masterName: 'TITLE', sectionTitle: 'Opening' });
  s.addText('Governing What We Share', { placeholder: 'title' });
  s.addText("Elinor Ostrom's way of seeing a commons, from the whole system down to one person deciding, for neighbors who want to organize", { placeholder: 'body' });
  s.addText(ATTR, { placeholder: 'attr' });
  s.addNotes("This deck is for people new to Elinor Ostrom and new to community organizing. It moves from the largest scale (the whole system a shared resource sits in) down to the smallest (one person deciding whether to trust the others). Every technical word on every diagram is translated on the slide that follows it, and there is a full glossary at the end. A companion deck, governing-what-we-share.pptx, tells the same story with everyday words first.\n\n" + ATTR);
}
{
  const s = content('The question Ostrom answered', "Garrett Hardin's 1968 essay 'The Tragedy of the Commons' told a simple story: anything shared will be used up, because each person gains by taking a bit more. The usual answers were: let the government control it, or divide it into private property. Elinor Ostrom spent decades looking at real places (fisheries, forests, irrigation systems, alpine meadows) and found that ordinary people often govern shared things well themselves, sometimes for centuries. The Swiss village of Torbel formally organized its shared alpine meadows in 1483. In 2009 she became the first woman to receive the Nobel Prize in Economics. Her lecture that year is the source of most diagrams in this deck.", 'OPENING');
  card(s, 0.6, 1.6, 5.9, 2.4, 'The old story', "Anything shared gets used up. Each person gains by taking a little more, so together they ruin it. The only fixes: the government takes control, or the shared thing is divided into private property.", { fill: 'F6E9E4', headColor: C.accent4 });
  card(s, 6.8, 1.6, 5.9, 2.4, 'What Ostrom found', "People who share a resource often make their own rules, watch each other, settle disputes, and keep it healthy for generations. Not always. But often enough to ask: what do the ones that last have in common?", { fill: C.background2, headColor: C.accent1 });
  s.addText([{ text: '1483', options: { fontSize: 54, bold: true, color: C.accent2, breakLine: true } }, { text: 'the year the Swiss village of Torbel formally organized the meadows it shares', options: { fontSize: 14, color: C.text1 } }], { x: 0.6, y: 4.35, w: 5.9, h: 2.3, isTextBox: true, margin: 0, valign: 'top' });
  s.addText([{ text: '2009', options: { fontSize: 54, bold: true, color: C.accent2, breakLine: true } }, { text: 'Ostrom becomes the first woman to receive the Nobel Prize in Economics. Her lecture is the source of this deck.', options: { fontSize: 14, color: C.text1 } }], { x: 6.8, y: 4.35, w: 5.9, h: 2.3, isTextBox: true, margin: 0, valign: 'top' });
}
{
  const s = content('How this deck moves: we zoom in, nine steps', "Think of a camera zooming in. We start with everything around a shared resource, and end with one person in one moment asking 'is it worth it to cooperate?'. Each step is a different question. Problems you see at one scale are often fixed at another, which is one of the main lessons.", 'OPENING');
  const qs = ['What surrounds a shared resource?', 'What kind of thing is being shared?', 'Where do people meet and choose?', 'Who decides the rules, and who decides who decides?', 'What are the working parts of one situation?', 'Which rule shapes which part?', 'What do the rules of long-lasting commons have in common?', 'How is one rule built?', 'Why does a person choose to cooperate?'];
  RUNGS.forEach((r, i) => {
    const y = 1.6 + i * 0.57;
    s.addText(String(i + 1), { shape: pres.shapes.OVAL, x: 0.6 + i * 0.25, y, w: 0.45, h: 0.45, fill: { color: i === 0 || i === 8 ? C.accent2 : C.accent1 }, color: C.background1, fontSize: 15, bold: true, align: 'center', valign: 'middle', margin: 0 });
    s.addText([{ text: r + '   ', options: { bold: true, color: C.text2 } }, { text: qs[i], options: { color: '3E4A42' } }], { x: 1.2 + i * 0.25, y, w: 9, h: 0.45, fontSize: 16, valign: 'middle', isTextBox: true, margin: 0 });
  });
  s.addText('largest', { x: 10.9, y: 1.6, w: 1.8, h: 0.45, fontSize: 13, italic: true, color: '5B6B60', align: 'right', isTextBox: true, margin: 0 });
  s.addText('smallest', { x: 10.9, y: 1.6 + 8 * 0.57, w: 1.8, h: 0.45, fontSize: 13, italic: true, color: '5B6B60', align: 'right', isTextBox: true, margin: 0 });
}
{
  const s = content('One example all the way down: the Elm Street garden', "An imagined community garden we will follow through every scale. Ostrom studied fisheries and irrigation systems, but the same ideas fit a garden, a tool library, a neighborhood fund, or a health co-op. A second example, a community health worker who is never at the table, appears in step 4.", 'OPENING');
  const items = [
    ['30 plots, one water tank', 'The garden shares a single rain-fed tank. In a dry summer there is not enough for everyone.'],
    ['A written bylaw', 'Watering days are assigned. No sprinklers when the tank is below half.'],
    ['A water keeper', 'A gardener chosen each spring to watch the tank and enforce the watering rules.'],
    ['A spring meeting', 'Where gardeners change the rules. The city leases them the land.'],
  ];
  items.forEach(([h, b], i) => card(s, 0.6 + (i % 2) * 6.15, 1.7 + Math.floor(i / 2) * 2.55, 5.95, 2.3, h, b, { headSize: 20, bodySize: 16 }));
}

// ═════════════════════════════════════════════════════════════════════════
// 1 · THE WHOLE SYSTEM
sect(1, 'The whole system', 'Everything around a shared resource: nature, people, rules, and the wider world they sit in.', "We start as wide as possible. Ostrom's last major framework, the social-ecological system, puts the commons inside its whole setting.");
diagram('Every commons sits inside a larger system', 'fig6-social-ecological-system.png', 'Ostrom 2010, Figure 6, adapted from Ostrom 2007', [
  'Four parts meet in the middle: the shared resource, the units taken from it, the people who use it, and the rules and bodies that govern it.',
  'Where they meet is an "action situation": people making choices that affect each other.',
  'Solid arrows: this affects that. Dashed arrows: results come back around and change things.',
  'Above and below: the wider world of money, law and politics, and neighboring ecosystems.',
], "Ostrom's Figure 6. Read it from the middle out. The centre box is where people actually act. The four corners shape what they do, and what they do changes the four corners (the dashed arrows). Around everything are the wider social, economic and political settings, and related ecosystems.");
words('Words on this diagram, in plain language', [
  ['Social-ecological system (SES)', 'People and nature tangled together, studied as one system rather than separately.'],
  ['Resource system (RS)', 'The shared thing as a whole: the garden, the lake, the forest, the fund.'],
  ['Resource units (RU)', 'The pieces people take or use from it: gallons of water, fish, plots, hours, dollars.'],
  ['Governance system (GS)', 'The rules, and whoever makes and enforces them: the bylaw, the spring meeting, the city, the water keeper.'],
  ['Users (U)', 'The people who use the resource. Ostrom later called them "actors".'],
  ['Action situation', 'Any setting where people meet and make choices that affect each other. Step 3 opens it up.'],
  ['Interactions (I) and outcomes (O)', 'What people do there (take, share news, argue, invest), and what results, for people and for nature.'],
  ['Social, economic and political settings (S)', 'The wider world: the economy, laws, politics, population change, markets, the news.'],
  ['Related ecosystems (ECO)', 'Natural systems next door that affect this one: weather, pollution, water flowing in and out.'],
  ['Direct causal link / feedback', 'Solid arrow: one thing affects another. Dashed arrow: results loop back and change what caused them.'],
], 'Every term on the Figure 6 diagram, translated.');
{
  const s = content('The four parts at Elm Street', 'Bring the diagram home. Each corner of Figure 6 has an Elm Street answer. Ask your own group to fill in the four corners for whatever you share.');
  const P = [
    ['Resource system', 'The garden and its rain-fed tank.', 'ECECD9'],
    ['Resource units', 'Gallons of water. Plots. The harvest.', 'ECECD9'],
    ['Governance system', 'The bylaw, the spring meeting, the water keeper, the city lease.', 'DCE8F4'],
    ['Users', '30 gardeners, their families, and newcomers on the waiting list.', 'F8E6CF'],
  ];
  P.forEach(([h, b, f], i) => card(s, 0.6 + (i % 2) * 6.15, 1.6 + Math.floor(i / 2) * 1.75, 5.95, 1.55, h, b, { fill: f, headSize: 18, bodySize: 16 }));
  card(s, 0.6, 5.2, 5.95, 1.6, 'Wider settings', 'City budget and drought policy. Rents. Who has time to garden.', { fill: 'FFFFFF', line: 'C9D3CC' });
  card(s, 6.75, 5.2, 5.95, 1.6, 'Related ecosystems', 'The watershed. Rainfall. Heat waves.', { fill: 'FFFFFF', line: 'C9D3CC' });
}
{
  const s = content('Ten things that make it more likely people organize at all', "From Ostrom's 2009 Science paper and the Nobel lecture. Across many field studies these ten made it more likely that users would organize themselves to protect a shared resource. They are not a recipe, but they are good questions to ask of your own situation.");
  const T = [
    ['Size of the resource', 'Not so big no one can see all of it.'], ['Productivity', 'Not so ruined it is hopeless, not so plentiful no one cares.'],
    ['Predictability', 'People can tell how it will behave.'], ['Mobility of the units', 'Water and fish move; plots stay put. Moving units are harder.'],
    ['Collective-choice rules', 'Users can change their own rules.'], ['Number of users', 'Enough to do the work, few enough to know each other.'],
    ['Leadership', 'Someone willing to start and organize.'], ['Norms and social capital', 'Shared expectations and trust already exist.'],
    ['Knowledge of the system', 'People understand how the resource works.'], ['Importance to users', 'It matters enough to their lives to be worth the effort.'],
  ];
  T.forEach(([h, b], i) => card(s, 0.6 + (i % 2) * 6.15, 1.55 + Math.floor(i / 2) * 1.07, 5.95, 0.95, h, b, { headSize: 15, bodySize: 14 }));
}

// ═════════════════════════════════════════════════════════════════════════
// 2 · WHAT WE SHARE
sect(2, 'What we share', 'Not every shared thing is the same kind of thing. The kind decides the problem.', "Before rules, ask what kind of thing is shared. Ostrom's Figure 1 sorts goods by two questions.");
diagram('Two questions sort everything people share', 'fig1-four-types-of-goods.png', 'Ostrom 2010, Figure 1, adapted from Ostrom 2005', [
  'Across the top: does one person using it leave less for others?',
  'Down the side: how hard is it to keep out people who did not pay or help?',
  'The answers give four kinds of good, each with its own problem.',
  'Ostrom found her design principles in the top-left box: common-pool resources.',
  'Both questions are matters of degree. Things move between boxes.',
], "Figure 1 is the first figure of the lecture. Ostrom took the old two-way split of goods (private and public) and showed there are at least four kinds, because two separate questions are involved. Her work was mostly about the common-pool box.");
words('Words on this diagram, in plain language', [
  ['Goods', 'Anything people value and use, not only things for sale. Water, safety, knowledge, a meeting hall.'],
  ['Subtractability of use', 'Does my use leave less for you? Economists also call this "rivalry".'],
  ['Difficulty of excluding potential beneficiaries', 'How hard it is to keep people who did not pay or help from benefiting anyway.'],
  ['Common-pool resource', 'Hard to keep people out AND use leaves less: groundwater, fisheries, forests, the garden tank in August.'],
  ['Public good', 'Hard to keep people out, but use leaves just as much: neighborhood safety, knowledge, weather forecasts.'],
  ['Toll good (also "club good")', 'Easy to keep people out, little is used up until it gets crowded: a theater, a club, a daycare.'],
  ['Private good', 'Easy to keep people out and use leaves less: food, clothing, a car.'],
  ['Free-riding', 'Enjoying the benefit without doing your share. The main problem with public goods.'],
], 'Every term on the Figure 1 diagram, translated.');
{
  const s = content('Neighborhood things, sorted', 'Ask the group to place the things it shares. The point is not the box; it is the problem each box brings. And note that drought moves the garden water from "plenty" toward "fiercely contested".');
  const Q = [
    ['Common-pool: the garden water, a shared fund, volunteer hours', 'Two problems at once: people taking too much, and not enough people putting back. Rules about both taking and contributing matter.', 'FBEFCB'],
    ['Public: neighborhood safety, a shared local-knowledge wiki', 'Everyone benefits whether or not they helped, so the problem is getting enough people to contribute.', 'DCE8F4'],
    ["Toll: a tool library, a co-op's member services, a meeting hall", 'Membership does most of the work: who is in, what they pay, what happens when it gets crowded.', 'E6E1F2'],
    ['Private: the vegetables from your own plot', 'Markets and personal choice handle these. Little to govern together.', 'ECEEEC'],
  ];
  Q.forEach(([h, b, f], i) => card(s, 0.6 + (i % 2) * 6.15, 1.6 + Math.floor(i / 2) * 2.1, 5.95, 1.95, h, b, { fill: f, headSize: 16, bodySize: 15 }));
  para(s, 'These are regions, not boxes. In a wet spring the garden water is hardly contested. In a drought, every gallon is.', { x: 0.6, y: 5.95, w: 12.1, h: 0.8, fontSize: 16, italic: true, color: C.accent1 });
}

// ═════════════════════════════════════════════════════════════════════════
// 3 · ONE SITUATION IN ITS SETTING
sect(3, 'One situation in its setting', 'Zoom in to one place where people meet and choose, and what shapes it from outside.', "Now we zoom in from the whole system to a single 'action situation' and the three kinds of thing outside it that shape it. This is the core picture of Ostrom's Institutional Analysis and Development framework.");
diagram('What shapes what people do together', 'fig2-iad-framework.png', "Ostrom 2010, Figure 2, adapted from Ostrom 2005. Green title: Marc's", [
  'Left box: three things set the scene. The physical world, who the people are, and the rules they actually follow.',
  'Middle: the action situation, where people meet and choose.',
  'Right: what they do (interactions), what results (outcomes), and the yardsticks used to judge both.',
  'Dashed arrows: results feed back. The long one is people changing their own rules.',
], "Ostrom's Figure 2. The green title at the top is Marc's: the two halves of the lecture, building trust, and making rules that fit the place. The dashed arrow labelled 'changes the rules' was added from Ostrom's text; it is where step 4 lives.");
words('Words on this diagram, in plain language', [
  ['IAD framework', "Institutional Analysis and Development framework: Ostrom's map for studying how rules shape what people do."],
  ['Institution', "In Ostrom's sense, not a building or an organization: the rules, norms and shared habits people live by."],
  ['External variables (also "exogenous")', 'Things outside the situation that shape it, which people in the moment cannot change.'],
  ['Biophysical conditions', 'The physical and natural facts: the water, the soil, the weather, the building.'],
  ['Attributes of community', 'Who the people are: their history together, how alike or different they are, what they know, how much they trust.'],
  ['Rules-in-use', 'The rules people actually follow, which may differ from what is written down.'],
  ['Action situation(s)', 'Any setting where people meet and choose things that affect each other: a meeting, watering day, a market.'],
  ['Interactions and outcomes', 'What people actually do, and what results from it.'],
  ['Evaluative criteria', 'The yardsticks for judging results: Is it fair? Efficient? Accountable? Will it last?'],
  ['Feedback (dashed arrows)', 'Results loop back and change the situation, and sometimes the rules themselves.'],
], 'Every term on the Figure 2 diagram, translated.');
{
  const s = content('Rules on paper and rules in use', "Ostrom insisted on 'rules-in-use': the rules people actually follow. A written bylaw is a first guess at them. You only find the real ones by watching and asking. This is why coding a document is never the whole story.");
  card(s, 0.6, 1.6, 5.95, 3.4, 'Rules on paper (the bylaw)', 'Water only on your assigned day.\n\nNo sprinklers when the tank is below half.\n\nThe water keeper suspends anyone who breaks the rules.', { fill: 'ECEEEC', headSize: 18, bodySize: 16 });
  card(s, 6.75, 1.6, 5.95, 3.4, 'Rules in use (what people do)', 'Early risers water any day; nobody minds.\n\nNobody reads the tank, so "below half" never triggers.\n\nThe keeper has never suspended anyone; a quiet word works.', { fill: C.background2, headSize: 18, bodySize: 16 });
  para(s, 'The gap between the two is the subject. A rule nobody follows has drifted. A habit everybody follows is a rule nobody wrote down. Both are found only by watching, asking, and keeping records over time.', { x: 0.6, y: 5.3, w: 12.1, h: 1.5, fontSize: 17 });
}

// ═════════════════════════════════════════════════════════════════════════
// 4 · LAYERS OF DECISION
sect(4, 'Layers of decision', 'Rules come from somewhere. Each layer decides the rules for the layer below it.', "The dashed 'changes the rules' arrow in Figure 2 hides a stack of decision layers. Ostrom called them levels of action. This drawing is an added panel: the lecture mentions the levels in one sentence and has no figure for them.");
diagram('Each level decides the rules for the level below', 'levels-of-action.png', 'Added panel, after Kiser and Ostrom 1982 and Ostrom 2005; not a lecture figure', [
  'Read down: what is decided at each level becomes the working rules of the next one.',
  'Read up: people see results in the world and take them to the level that can change the rule.',
  'The higher the level, the fewer the decisions, and the more each one changes.',
], "Four levels. Metaconstitutional: culture and what people think is even possible. Constitutional: who may make the rules and how. Collective choice: making and changing the everyday rules. Operational: doing the work. Each is itself an action situation. Its outcomes are the rules for the level below.");
words('Words on this diagram, in plain language', [
  ['Levels of action', 'Layers of decision making. Each layer decides the rules for the layer below it.'],
  ['Operational', 'Day-to-day doing: watering, harvesting, paying, watching, applying a penalty.'],
  ['Collective choice', 'Making and changing the everyday rules: a meeting votes to change the watering days.'],
  ['Constitutional', 'Deciding who gets to make the rules, and how they decide: who is a member, how the meeting votes.'],
  ['Metaconstitutional', 'The unwritten culture underneath: what people think is fair, who counts, what a rule can even be.'],
  ['Rules-in-use for the level below', 'What one layer decides becomes the working rules of the next one down.'],
  ['Seen and judged / a rule problem that keeps recurring', 'The upward arrows: results are noticed, judged, and taken to a level that can change things.'],
  ['Outcomes in the world', 'What actually happens: water used, plots tended, care given, money moved.'],
], 'Every term on the levels drawing, translated.');
{
  const s = content('The four levels at Elm Street', 'Same garden, four levels. Notice how much more each higher decision changes, and how rarely it is made.');
  const rows = [
    ['Metaconstitutional', 'Do we think newcomers deserve a plot at all?', 'Unwritten. Strongest.', '6B5B95'],
    ['Constitutional', 'Who counts as a member, and how does the spring meeting vote?', 'Most leverage', 'B5532D'],
    ['Collective choice', 'The spring meeting changes the watering days.', 'A rule changes', 'C9822A'],
    ['Operational', 'Watering on your day. The keeper speaks to someone who did not.', 'A number changes. Least leverage, most effort', '2E6B45'],
  ];
  rows.forEach(([lv, ex, lev, col], i) => {
    const y = 1.6 + i * 1.3;
    s.addText(lv, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.08, x: 0.6, y, w: 3.0, h: 1.1, fill: { color: col }, color: 'FFFFFF', fontSize: 17, bold: true, align: 'center', valign: 'middle', margin: 4 });
    para(s, ex, { x: 3.85, y: y + 0.08, w: 5.6, h: 1.0, fontSize: 17, valign: 'middle' });
    para(s, lev, { x: 9.6, y: y + 0.08, w: 3.1, h: 1.0, fontSize: 15, italic: true, color: '3E4A42', valign: 'middle' });
  });
}
{
  const s = content('A one-question test: which level am I standing on?', 'A quick test you can use in any meeting. When someone proposes a change, ask which of these three it is. The leverage rises as you go right.');
  const T = [['Does it change a number?', 'Operational', 'Least leverage. Where most effort goes.', '2E6B45'], ['Does it change a rule?', 'Collective choice', 'Real change, made by the group.', 'C9822A'], ['Does it change who may change the rule?', 'Constitutional', 'Most leverage. Rare, and lasting.', 'B5532D']];
  T.forEach(([q, l, d, col], i) => {
    const x = 0.6 + i * 4.1;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.8, w: 3.9, h: 4.2, rectRadius: 0.1, fill: { color: col }, line: { color: col } });
    s.addText([{ text: q, options: { fontSize: 22, bold: true, color: 'FFFFFF', breakLine: true } }, { text: ' ', options: { fontSize: 10, breakLine: true } }, { text: l, options: { fontSize: 20, color: 'FFFFFF', bold: true, breakLine: true } }, { text: d, options: { fontSize: 15, color: 'FFFFFF' } }], { x: x + 0.25, y: 2.0, w: 3.4, h: 3.8, valign: 'middle', isTextBox: true, margin: 0 });
  });
  para(s, "Donella Meadows found the same thing in systems: numbers are the weakest place to push, and the power to change a system's structure is among the strongest.", { x: 0.6, y: 6.2, w: 12.1, h: 0.7, fontSize: 15, italic: true, color: '3E4A42' });
}
{
  const s = content('One complaint, three levels: the missing seat', "Our second example. A neighborhood health co-op. Its community health worker (CHW) is never part of decisions. Read at each level, the same complaint means something different, and only the top reading points to the fix.");
  const steps = [
    ['Operational reading', '"Nobody asks the health worker." Sounds like a communication problem. Fix: ask more often. It does not hold.', '2E6B45'],
    ['Collective-choice reading', '"The health worker is not seated where rules are made." A membership problem. Fix: invite them. Still they have no vote.', 'C9822A'],
    ['Constitutional reading', '"There is no health-worker seat at all." You cannot seat someone in a role that does not exist. Only a constitutional decision, creating the role, fixes it.', 'B5532D'],
  ];
  steps.forEach(([h, b, col], i) => {
    const x = 0.6 + i * 4.1, y = 4.4 - i * 1.25;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 3.9, h: 2.45, rectRadius: 0.08, fill: { color: 'FFFFFF' }, line: { color: col, width: 2.5 } });
    s.addText([{ text: h, options: { bold: true, fontSize: 17, color: col, breakLine: true } }, { text: b, options: { fontSize: 15, color: C.text1 } }], { x: x + 0.18, y: y + 0.12, w: 3.55, h: 2.2, valign: 'top', isTextBox: true, margin: 0 });
  });
  para(s, 'The higher you read, the more leverage the fix has.', { x: 0.6, y: 1.6, w: 7.5, h: 0.5, fontSize: 18, bold: true, color: C.accent1 });
}

// ═════════════════════════════════════════════════════════════════════════
// 5 · INSIDE ONE SITUATION
sect(5, 'Inside one situation', 'Open up the action situation. Every one has the same seven working parts.', "Now we open the action situation box itself. Ostrom built these seven parts with the game theorist Reinhard Selten so that field studies, experiments and mathematical models could all use one vocabulary.");
diagram('The seven working parts of any situation', 'fig3-action-situation.png', 'Ostrom 2010, Figure 3, adapted from Ostrom 2005', [
  'People (actors) are put into roles (positions).',
  'Roles come with actions they can take.',
  'Actions lead to possible results, shaped by what people know (information) and how choices combine (control).',
  'Each result carries costs and benefits for each role.',
], "Ostrom's own one-sentence version: participants are assigned to positions; in those positions they choose among actions, in light of their information, the control they have over how actions lead to outcomes, and the costs and benefits assigned to actions and outcomes. That sentence names all seven parts. The small 'linked to' oval is a drawing convenience: in her figure, Information and Control point at the arrow between Actions and Potential Outcomes.");
words('Words on this diagram, in plain language', [
  ['Actors', 'The people or organizations taking part. At Elm Street: gardeners, the keeper, the city.'],
  ['Positions', 'Roles or seats: gardener, water keeper, chair. A role outlasts the person in it.'],
  ['Actions', 'What someone in a position can do: water, harvest, propose, vote, report.'],
  ['INFORMATION about', 'What each person knows when they choose: the tank level, who watered, what others did.'],
  ['CONTROL over', 'How individual choices combine into a result: one person decides, a vote, everyone must agree.'],
  ['Potential outcomes', 'The results that are possible here: a full tank, dead tomatoes, a fight.'],
  ['Net costs and benefits', 'What each role pays and gains. "Net" means gains minus costs.'],
  ['Assigned to / linked to', 'Who goes in which seat, and which actions lead to which results.'],
  ['External variables', 'The outside things from Figure 2 that set up the situation.'],
  ['Action situation', 'The setting where all seven parts come together.'],
], 'Every term on the Figure 3 diagram, translated.');

// ═════════════════════════════════════════════════════════════════════════
// 6 · THE RULES THAT SHAPE IT
sect(6, 'The rules that shape it', "Seven kinds of rule, one for each working part. Plus Marc's questions from inside the seat.", "Figure 4 wraps the seven parts in a blue box of rules. Each kind of rule shapes exactly one part. The green labels are Marc's additions: the questions a person asks from inside their seat.");
diagram('Each kind of rule shapes one part of the situation', 'fig4-rules-acting-on-the-situation.png', "Ostrom 2010, Figure 4, adapted from Ostrom 2005. Green dotted labels: Marc's", [
  'Blue box: the rules people actually follow. Green box: the situation from Figure 3.',
  'Each red arrow: one kind of rule shaping one working part.',
  "Green dotted labels are Marc's: the same rules seen from inside the seat.",
  'Outcomes are judged and loop back into the rules (dashed arrows).',
], "Ostrom's Figure 4: rules as outside variables directly affecting the elements of an action situation. Her advice was to ask of any rule: which part of the situation does it affect? That sorts every rule into one of seven kinds. Ostrom found many versions of each kind; 27 different boundary rules in common-pool resource cases alone.");
{
  const s = content("Close-up: the rules box, and Marc's questions", "The same Figure 4, enlarged. Point to each blue rule box and the red arrow leaving it: that is the part of the situation it shapes. Then read the green dotted label beside it: Marc's question from inside the seat. The next two slides translate every word.");
  const b = img(s, 'fig4-closeup.png', { x: 0.5, y: 1.5, w: 8.4, h: 5.3, alt: "Close-up of Figure 4: the seven rule types acting on the seven working parts, with Marc's margin questions" });
  caption(s, "Detail of Figure 4. Green dotted labels: Marc's", b.x, b.y + b.h + 0.05, b.w);
  const F = [['Blue boxes', 'the seven kinds of rule'], ['Red arrows', 'which part each rule shapes'], ['White boxes', 'the seven working parts from Figure 3'], ['Green dotted', "Marc's questions: WHO? WHAT? HOW? WHY?, For whom, By whom, Am I allowed?"]];
  F.forEach(([h, d], i) => card(s, 9.2, 1.5 + i * 1.33, 3.6, 1.2, h, d, { headSize: 16, bodySize: 14 }));
}
words('The seven kinds of rule, in plain language', [
  ['Boundary rules', 'Who may enter or leave. Who counts as a gardener, how you join, how you leave.'],
  ['Position rules', 'What roles exist, and how many people hold each. One water keeper; a chair.'],
  ['Authority / choice rules', 'What each role must, may, or must not do. Gardeners may water on their day.'],
  ['Information rules', 'What must, may, or must not be shared, with whom. The keeper reports the tank level weekly.'],
  ['Aggregation rules', 'How choices combine into a decision. Majority, two-thirds, consensus, the keeper alone.'],
  ['Payoff rules', 'Who pays, who gains, and what happens to rule breakers. Four work hours a season; a week without water.'],
  ['Scope rules', 'Which outcomes may be affected, and what is off limits. The meeting may not sell the land.'],
  ['Exogenous variables (title)', '"Exogenous" means set from outside. The rules come from outside the situation and shape it.'],
], 'The rule names on the Figure 4 diagram, translated, with Elm Street examples.');
words("Marc's questions: the same rules, seen from inside the seat", [
  ['WHO? (boundary, information, aggregation)', 'Who is in? Who gets told? Who has to agree?'],
  ['WHAT? (choice rules)', 'What am I allowed, required, or forbidden to do?'],
  ['HOW? (payoff rules)', 'How are costs and benefits shared, and how are breaches handled?'],
  ['WHY? (scope rules)', 'What outcomes are we here to affect at all?'],
  ['For whom / By whom (by roles)', 'Who benefits from a role, and who fills it. Asked of roles, not of particular people.'],
  ['Am I allowed? (derived authority)', 'My permission comes from a rule, not from me. "Derived" means it comes from somewhere else.'],
  ['Data & information / Knowledge & understanding', 'Information rules move data; aggregation turns what people know into a shared decision.'],
  ['parameterizes / models', 'Information sets the limits a choice is made within. Control describes how choices turn into results.'],
  ['Judges / Judgement: is it worth the effort and risk?', 'The yardsticks judge outcomes. Each person also judges: is cooperating worth it? Step 9 answers.'],
], "Ostrom draws the situation from outside, like an analyst. Marc's labels draw it from inside, like a participant.");
{
  const s = content('The rule nobody writes down: how do we decide?', "Aggregation rules are the ones groups most often leave unstated. Two people can sincerely disagree about whether something 'passed' because each assumed a different rule. A simple demonstration: one set of votes, four different outcomes.");
  para(s, 'The spring meeting votes on a new watering schedule. 30 members. 17 vote yes, 10 vote no, 3 are absent.', { x: 0.6, y: 1.6, w: 12.1, h: 0.6, fontSize: 18 });
  const R = [['Simple majority of those present', 'PASSES', '17 of 27', '2E6B45'], ['Two-thirds of those present', 'FAILS', 'needs 18 of 27', 'B5532D'], ['Consensus', 'FAILS', '10 objections', 'B5532D'], ['The water keeper decides', '?', 'depends on one person', '6B5B95']];
  R.forEach(([h, v, d, col], i) => {
    const x = 0.6 + i * 3.08;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.5, w: 2.9, h: 3.0, rectRadius: 0.08, fill: { color: C.background2 }, line: { color: C.background2 } });
    s.addText([{ text: h, options: { fontSize: 16, bold: true, color: C.text2, breakLine: true } }, { text: v, options: { fontSize: 40, bold: true, color: col, breakLine: true } }, { text: d, options: { fontSize: 14, color: '3E4A42' } }], { x: x + 0.15, y: 2.65, w: 2.6, h: 2.7, valign: 'top', isTextBox: true, margin: 0 });
  });
  para(s, 'Most conflict is two people silently assuming different aggregation rules. Ask early: who has to agree for this to count?', { x: 0.6, y: 5.8, w: 12.1, h: 0.9, fontSize: 17, bold: true, color: C.accent1 });
}

// ═════════════════════════════════════════════════════════════════════════
// 7 · WHAT LASTING RULES SHARE
sect(7, 'What lasting rules share', "Ostrom's design principles: patterns found in commons that lasted, and missing in those that failed.", "Ostrom first looked for specific rules that worked everywhere, and found none: the rules that worked varied enormously from place to place. So she moved up one level of generality and found patterns. She called them design principles, while stressing that people did not have them in mind when building their systems.");
{
  const s = content('Eight design principles, in plain words', "The list as updated by Cox, Arnold and Villamayor Tomas (2010), who reviewed over 100 studies and split three principles in two. About two-thirds of those studies found that robust resource systems had most of the principles and failures did not.");
  const D = [
    ['1 Clear boundaries', 'Everyone knows who is in (1A) and what the shared thing is (1B).'],
    ['2 Rules that fit', 'Rules suit this place and these people (2A). What you put in matches what you take out (2B).'],
    ['3 Collective choice', 'Most people affected by the rules help make and change them.'],
    ['4 Monitoring', 'Someone watches how the rules are kept (4A) and the condition of the resource (4B), and answers to the users.'],
    ['5 Graduated sanctions', 'Penalties start small and grow with repeated or serious breaches.'],
    ['6 Conflict resolution', 'Cheap, quick, local ways to settle disputes, including disputes about the rules.'],
    ['7 Recognition of rights', 'Governments and landowners outside the group respect its right to make its own rules.'],
    ['8 Nested enterprises', 'When part of something bigger, governance is layered: small self-governing groups inside larger ones.'],
  ];
  D.forEach(([h, b], i) => card(s, 0.6 + (i % 2) * 6.15, 1.55 + Math.floor(i / 2) * 1.33, 5.95, 1.2, h, b, { headSize: 16, bodySize: 14 }));
}
words('Words in the design principles, in plain language', [
  ['Design principle', 'A pattern found in long-lasting commons. Not a blueprint, and not something people consciously followed.'],
  ['Congruence with local conditions', 'The rules fit the place: its weather, its resource, its people. "Congruent" means fitting together.'],
  ['Appropriation and provision', 'Taking from the resource, and putting work, money or care back into it.'],
  ['Monitoring', 'Watching: who takes what, and how the resource is doing. Best done by users or people who answer to them.'],
  ['Graduated sanctions', '"Graduated" means stepping up. "Sanction" means penalty. A warning first, then stronger.'],
  ['Nested enterprises', 'Groups inside groups, each governing itself: a garden inside a neighborhood council inside a city.'],
], 'Terms used in the principles, translated.');
{
  const s = content('Each principle leans on particular kinds of rule', "Our own synthesis (not Ostrom's): which of the seven rule kinds, and which level, each principle depends on. This is how the frames connect. Principle 2A is the exception: whether rules fit the place is a judgment about the place, not something any rule can show.");
  const rows = [
    ['1 Clear boundaries', 'Boundary (who is in); scope (what the thing is)', 'Operational and constitutional'],
    ['2 Rules that fit', 'Payoff matched against choice (2B). 2A: no rule shows it', 'Operational'],
    ['3 Collective choice', 'Boundary, position, information, aggregation, scope', 'Collective choice'],
    ['4 Monitoring', 'Position (a monitor), choice (duty to watch), information (reports)', 'Operational'],
    ['5 Graduated sanctions', 'Payoff: the penalty, stepping up', 'Operational'],
    ['6 Conflict resolution', 'Position (a venue), boundary (who may come), aggregation (how it is settled)', 'Collective choice'],
    ['7 Recognition of rights', 'Scope, set by an outside body', 'Constitutional'],
    ['8 Nested enterprises', 'Boundary and position, linking groups of different sizes', 'Constitutional'],
  ];
  const head = ['Principle', 'Kinds of rule it rests on', 'Level'].map((t) => ({ text: t, options: { bold: true, color: 'FFFFFF', fill: { color: C.accent1 } } }));
  s.addTable([head, ...rows.map((r) => r.map((t, j) => ({ text: t, options: { bold: j === 0 } })))], { x: 0.6, y: 1.55, w: 12.1, colW: [3.0, 6.5, 2.6], fontSize: 14, color: C.text1, border: { type: 'solid', pt: 0.5, color: 'C9D3CC' }, rowH: 0.55, fill: { color: 'FFFFFF' }, valign: 'middle' });
}
{
  const s = content('Principle 3 is really five questions', "'The people affected help make the rules' sounds simple. The rule kinds split it into five questions, and a group can fail any one of them while sincerely believing it follows principle 3.");
  const Q = [['Are they seated?', 'Boundary rule'], ['Is there a seat for them?', 'Position rule, set at the constitutional level'], ['Do they see proposals in time?', 'Information rule'], ['Does their voice count?', 'Aggregation rule: a vote, consent, or only being asked'], ['What may they change?', 'Scope rule']];
  Q.forEach(([q, r], i) => {
    const x = 0.6 + i * 2.46;
    s.addShape(pres.shapes.OVAL, { x: x + 0.75, y: 1.75, w: 0.8, h: 0.8, fill: { color: C.accent2 }, line: { color: C.accent2 } });
    s.addText(String(i + 1), { x: x + 0.75, y: 1.75, w: 0.8, h: 0.8, fontSize: 24, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', isTextBox: true, margin: 0 });
    card(s, x, 2.8, 2.3, 2.6, q, r, { headSize: 17, bodySize: 14 });
  });
  para(s, 'The health worker in step 4 failed question 2. No amount of asking (question 3) or inviting (question 1) could fix it.', { x: 0.6, y: 5.8, w: 12.1, h: 0.9, fontSize: 17, italic: true, color: C.accent1 });
}

// ═════════════════════════════════════════════════════════════════════════
// 8 · ONE SENTENCE OF A RULE
sect(8, 'One sentence of a rule', 'Zoom in on a single written rule. Ostrom and Sue Crawford gave rules a grammar.', "Rules are made of sentences. Crawford and Ostrom (1995) showed every rule-like sentence has the same few parts, which they called ADICO. A later version, Institutional Grammar 2.0 (Frantz and Siddiki 2021), adds a few more. The Agreement Checker asks these parts as plain questions.");
{
  const s = content('The parts of one rule', 'Take one sentence from the garden bylaw and ask it the plain questions. Each part has a job. The OR ELSE is the part most often missing.');
  para(s, '"When the tank is below half, gardeners must not water their plots with sprinklers, or else they lose watering for a week."', { x: 0.6, y: 1.55, w: 12.1, h: 0.9, fontSize: 20, italic: true, color: C.text2 });
  const P = [['WHEN?', 'when the tank is below half', 'Condition'], ['WHO?', 'gardeners', 'Attribute'], ['MUST, MAY, OR MUST NOT?', 'must not', 'Deontic'], ['DO WHAT?', 'water', 'Aim'], ['TO WHAT?', 'their plots', 'Object'], ['HOW?', 'with sprinklers', 'Condition'], ['OR ELSE?', 'they lose watering for a week', 'Or else']];
  P.forEach(([q, a, adico], i) => {
    const x = 0.6 + i * 1.75;
    s.addText(q, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.06, x, y: 2.75, w: 1.65, h: 0.9, fill: { color: i === 6 ? C.accent4 : C.accent1 }, color: 'FFFFFF', fontSize: 13, bold: true, align: 'center', valign: 'middle', margin: 3 });
    s.addText(a, { x, y: 3.75, w: 1.65, h: 1.2, fontSize: 15, color: C.text1, align: 'center', valign: 'top', isTextBox: true, margin: 2 });
    s.addText(adico, { x, y: 5.0, w: 1.65, h: 0.4, fontSize: 13, italic: true, color: '5B6B60', align: 'center', isTextBox: true, margin: 0 });
  });
  para(s, 'Bottom row: the formal names in ADICO and its successor. A creating sentence ("The water keeper is chosen each spring from the members") answers different questions: WHAT ARE WE CREATING? MUST OR MAY? FORMED HOW? OUT OF WHAT?', { x: 0.6, y: 5.6, w: 12.1, h: 1.1, fontSize: 15, color: '3E4A42' });
}
words('Words of the rule grammar, in plain language', [
  ['Institutional Grammar (IG)', 'A way to break any rule-like sentence into the same few parts, so rules can be compared and checked.'],
  ['ADICO', 'The original five parts (Crawford and Ostrom 1995): Attribute, Deontic, aIm, Condition, Or else.'],
  ['Attribute', 'Who the sentence applies to. WHO?'],
  ['Deontic', 'The must, may, or must not. From the Greek for "what is binding".'],
  ['Aim and object', 'The action (DO WHAT?) and what it is done to (TO WHAT?).'],
  ['Condition', 'When, where and how the rule applies. IG 2.0 splits it into WHEN? and HOW?'],
  ['Or else', 'The consequence for breaking it. Without one, a sentence is a norm, not a rule.'],
  ['Constitutive statement ("creating agreement")', 'A sentence that creates a role, group or thing, rather than telling people what to do.'],
], 'Every term used for the parts of a rule, translated.');
{
  const s = content('No OR ELSE, no rule', "The grammar sorts sentences by strength. In real documents the OR ELSE is usually empty, which tells you the sentence is a hope, not a rule, and that what people actually do will drift away from it.");
  const L = [['Agreed rule', 'All parts, including an OR ELSE.', '"...or else they lose watering for a week."', '2E6B45'], ['Shared expectation (a norm)', 'Has MUST or MAY, but no OR ELSE.', '"Gardeners should keep paths clear."', 'C9822A'], ['Shared habit (a strategy)', 'No MUST or MAY, no OR ELSE. Just what people do.', '"We water early in the morning."', '6B5B95']];
  L.forEach(([h, d, ex, col], i) => {
    const y = 1.65 + i * 1.6;
    s.addText(h, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.08, x: 0.6, y, w: 3.6, h: 1.35, fill: { color: col }, color: 'FFFFFF', fontSize: 18, bold: true, align: 'center', valign: 'middle', margin: 4 });
    s.addText([{ text: d, options: { fontSize: 16, breakLine: true, color: C.text1 } }, { text: ex, options: { fontSize: 15, italic: true, color: '3E4A42' } }], { x: 4.45, y: y + 0.1, w: 8.2, h: 1.2, valign: 'middle', isTextBox: true, margin: 0 });
  });
  para(s, 'Shared habits are as close as writing gets to the unwritten metaconstitutional level from step 4.', { x: 0.6, y: 6.5, w: 12.1, h: 0.4, fontSize: 14, italic: true, color: C.accent1 });
}
{
  const s = content('What reading rules this closely finds', 'Three gaps the grammar reveals that a quick read misses. Each one ties a single sentence back to a design principle.');
  const F = [
    ['Things nobody created', 'A rule about "gardeners", with no sentence saying who counts as a gardener. A rule about "the tank", with nothing saying which tank.', 'Principle 1: clear boundaries'],
    ['Penalties nobody carries out', 'Follow the OR ELSE: who applies it? What creates that role? Whom does the role answer to?', 'Principles 4 and 5: monitoring and sanctions'],
    ['Triggers nobody reads', '"When the tank is below half" assumes someone reads the tank. If no sentence gives anyone that job, the rule never switches on.', 'Principle 4B: monitoring the resource'],
  ];
  F.forEach(([h, b, p], i) => {
    const x = 0.6 + i * 4.1;
    card(s, x, 1.65, 3.9, 3.9, h, b, { headSize: 18, bodySize: 15 });
    s.addText(p, { x, y: 5.7, w: 3.9, h: 0.6, fontSize: 14, bold: true, color: C.accent2, isTextBox: true, margin: 0 });
  });
}

// ═════════════════════════════════════════════════════════════════════════
// 9 · ONE PERSON DECIDING
sect(9, 'One person deciding', 'The smallest scale: one person, one moment. Is it worth cooperating?', "The last zoom. Good rules are not enough on their own. Ostrom's Nobel lecture says cooperation runs on trust: confidence that the others will do their share. Rules matter because they create the conditions in which that trust can grow.");
diagram('Cooperation runs on trust that others will do their share', 'fig5-trust-and-cooperation.png', 'Ostrom 2010, Figure 5, from Poteete, Janssen and Ostrom 2010', [
  'Read left to right: the setting shapes what people learn about each other.',
  'What they learn builds (or destroys) trust that others will reciprocate.',
  'Trust brings cooperation; cooperation brings benefits.',
  'The dashed loop: good results teach trust, bad results teach distrust.',
], "Ostrom's Figure 5. People are not the narrowly selfish calculators of older theory: they learn and adopt norms. But they will not keep cooperating if they believe others will not. The structure of the situation, especially the small features of it, decides whether trust can grow. Marc's question from Figure 4, 'Is it worth the effort and risk?', is answered here.");
words('Words on this diagram, in plain language', [
  ['Social dilemma', 'A situation where what is best for each person alone is bad for everyone together. Overwatering in a drought.'],
  ['Broader contextual variables', 'The big setting from step 1: the resource, the rules, the wider world.'],
  ['Microsituational variables', "Small features of the immediate situation: can people talk, do they know each other's record. Next slide."],
  ['Learning and norm-adopting individuals', 'People who learn from experience and take on shared expectations, rather than purely selfish calculators.'],
  ['Norm', 'A shared expectation about how people should act, usually unwritten.'],
  ['Reciprocators', 'People who return cooperation with cooperation: I do my share if you do yours.'],
  ['Levels of trust that other participants are reciprocators', 'How confident I am that the others will do their share if I do mine.'],
  ['Levels of cooperation / net benefits', 'How much people actually work together, and what everyone gains minus what it costs.'],
], 'Every term on the Figure 5 diagram, translated.');
{
  const s = content('Six conditions that make trust possible', "Ostrom's six (lecture pp. 661-662), from experiments and field studies. The design principles paired with each are our reading, not Ostrom's: they show how the rules from steps 6 and 7 build the conditions for trust in step 9.");
  const S6 = [
    ['People can talk, ideally face to face', 'Faces and tone tell people who is trustworthy.', 'Principles 3, 6'],
    ["People's past behavior is known", 'A track record makes cooperation safer.', 'Principle 4A'],
    ['Each contribution clearly makes a difference', '"Marginal per capita return": my share visibly matters.', 'Principle 2B'],
    ['People can enter or leave at low cost', 'No one is trapped as the only one still trying.', 'Principle 1A'],
    ['A long time horizon', 'Cooperation pays more over years than over weeks.', 'Principle 7'],
    ['Sanctions the group agreed to itself', 'Self-made penalties are rarely needed; imposed ones can backfire.', 'Principles 5, 3'],
  ];
  S6.forEach(([h, b, p], i) => {
    const x = 0.6 + (i % 3) * 4.1, y = 1.6 + Math.floor(i / 3) * 2.65;
    card(s, x, y, 3.9, 2.45, h, b, { headSize: 16, bodySize: 14 });
    s.addText(p, { x: x + 0.15, y: y + 1.95, w: 3.6, h: 0.35, fontSize: 13, bold: true, color: C.accent2, isTextBox: true, margin: 0 });
  });
}
{
  const s = content('What a neighborhood can change this month', "You cannot rewrite a constitution this month. You can change these small conditions now, and they are where trust starts. Each matches one of Ostrom's six.");
  const M = [
    ['Meet in person,', 'regularly, with everyone who shares the thing. Not only the organizers.'],
    ['Keep a record people agree to,', 'of who did what. Kept with them, never about them behind their backs.'],
    ['Make contributions visible:', 'a simple chart of tank levels or work hours shows each person their share mattered.'],
    ['Let people leave cheaply,', 'and take their own records with them. Free to leave makes staying a choice.'],
    ['Plan for years, not weeks:', 'secure the lease; write down how the rules can change.'],
    ['Write your own penalties,', 'together, starting small. Agreed sanctions are the ones that rarely need using.'],
  ];
  M.forEach(([h, b], i) => {
    const y = 1.6 + i * 0.88;
    s.addText(String(i + 1), { shape: pres.shapes.OVAL, x: 0.6, y, w: 0.6, h: 0.6, fill: { color: C.accent2 }, color: 'FFFFFF', fontSize: 18, bold: true, align: 'center', valign: 'middle', margin: 0 });
    s.addText([{ text: h + ' ', options: { bold: true, color: C.text2 } }, { text: b, options: { color: C.text1 } }], { x: 1.45, y, w: 11.2, h: 0.6, fontSize: 18, valign: 'middle', isTextBox: true, margin: 0 });
  });
}

// ═════════════════════════════════════════════════════════════════════════
// CLOSING
pres.addSection({ title: 'Closing' });
section = null;
phase = 'CLOSING';
{
  const s = content('Zooming back out', 'The nine scales are one picture seen at different distances. A problem noticed at one scale is often fixed at another: a complaint at the operational level may need a constitutional fix; a rule that never works may be missing the trust it depends on.');
  const lines = ['The system sets what is possible.', 'The kind of good sets the problem.', 'The situation is where people meet.', 'The levels say who can change what.', 'Seven parts make every situation.', 'Seven kinds of rule shape the parts.', 'The principles describe rules that last.', 'One sentence holds one rule.', 'One person decides whether to trust.'];
  RUNGS.forEach((r, i) => {
    const y = 1.55 + i * 0.58;
    s.addText(String(i + 1), { shape: pres.shapes.OVAL, x: 0.6, y, w: 0.45, h: 0.45, fill: { color: C.accent1 }, color: 'FFFFFF', fontSize: 14, bold: true, align: 'center', valign: 'middle', margin: 0 });
    s.addText([{ text: r + ':  ', options: { bold: true, color: C.text2 } }, { text: lines[i], options: { color: C.text1 } }], { x: 1.25, y, w: 11.4, h: 0.45, fontSize: 17, valign: 'middle', isTextBox: true, margin: 0 });
  });
}
{
  const s = content('Questions to take to your group', 'One question per scale. Start anywhere; most groups start with the last one.');
  const Q = ['What is the whole system around what we share?', 'What kind of thing is it, and what problem does that bring?', 'Where do we actually meet and decide?', 'Who decides who decides? Is anyone missing a seat?', 'What roles exist, and what does each know and control?', 'Which of our rules are written, and which are only habits?', 'Which design principles are we missing?', 'Which of our rules has no OR ELSE?', 'What would make each of us more confident the others will do their share?'];
  Q.forEach((q, i) => card(s, 0.6 + (i % 3) * 4.1, 1.55 + Math.floor(i / 3) * 1.75, 3.9, 1.6, `${i + 1}`, q, { headSize: 16, bodySize: 15, headColor: C.accent2 }));
}
words('Glossary (1 of 2)', [
  ['Action situation', 'Where people meet and choose things that affect each other.'],
  ['Actors / participants', 'The people or organizations taking part.'],
  ['Aggregation', 'How individual choices combine into one decision.'],
  ['Appropriation / provision', 'Taking from a resource / putting back into it.'],
  ['Biophysical conditions', 'The physical and natural facts of a place.'],
  ['Collective choice', 'The level where everyday rules are made and changed.'],
  ['Common-pool resource', 'Shared, hard to fence off, and used up by use.'],
  ['Constitutional', 'The level that decides who makes the rules and how.'],
  ['Design principles', 'Patterns found in long-lasting commons.'],
  ['Evaluative criteria', 'Yardsticks for judging results: fair, efficient, lasting.'],
  ['Exogenous / external variables', 'Things set from outside a situation.'],
  ['Graduated sanctions', 'Penalties that start small and step up.'],
], 'Every specialist word in this deck, A to G.', null);
words('Glossary (2 of 2)', [
  ['IAD framework', "Ostrom's Institutional Analysis and Development framework."],
  ['Institution', 'Rules, norms and shared habits, not a building or an agency.'],
  ['Institutional Grammar / ADICO', 'Breaking a rule sentence into its parts.'],
  ['Metaconstitutional', 'The unwritten culture under all written rules.'],
  ['Microsituational variables', 'Small features of the immediate situation that build or block trust.'],
  ['Nested enterprises', 'Self-governing groups inside larger ones.'],
  ['Norm', 'A shared, usually unwritten, expectation of behavior.'],
  ['Operational', 'The level of day-to-day doing.'],
  ['Positions', 'Roles or seats, which outlast the people in them.'],
  ['Reciprocator', 'Someone who returns cooperation with cooperation.'],
  ['Rules-in-use', 'The rules people actually follow.'],
  ['Social-ecological system (SES)', 'People and nature studied as one system.'],
], 'H to S.', null);
{
  const s = pres.addSlide({ masterName: 'TITLE', sectionTitle: 'Closing' });
  s.addText('Sources', { placeholder: 'title' });
  s.addText([
    { text: 'Ostrom, E. (2010). Beyond Markets and States: Polycentric Governance of Complex Economic Systems. American Economic Review 100(3). The 2009 Nobel lecture; Figures 1 to 6.', options: { breakLine: true } },
    { text: 'Ostrom, E. (1990). Governing the Commons. Ostrom, E. (2005). Understanding Institutional Diversity.', options: { breakLine: true } },
    { text: 'Ostrom, E. (2009). A General Framework for Analyzing Sustainability of Social-Ecological Systems. Science 325.', options: { breakLine: true } },
    { text: 'Cox, Arnold and Villamayor Tomas (2010), design principles. Crawford and Ostrom (1995), ADICO. Frantz and Siddiki (2021), IG 2.0. Poteete, Janssen and Ostrom (2010), Working Together.' },
  ], { x: 0.8, y: 3.5, w: 11.7, h: 2.6, fontSize: 16, color: 'EEF3EA', valign: 'top', isTextBox: true, margin: 0, paraSpaceAfter: 8 });
  s.addText(ATTR, { placeholder: 'attr' });
  s.addNotes("Diagrams: the RCN Graph Tool drawings in docs/ostrom-nobel/, rebuilt from the lecture figures with Marc's annotations. The levels panel and the Elm Street examples are additions, not Ostrom's.\n\n" + ATTR);
}

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log('wrote', OUT);
})();
