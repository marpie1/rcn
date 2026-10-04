#!/usr/bin/env node
// build-deck.js — "Governing What We Share": Ostrom's frames from the whole system down to one person.
// Uses the diagram PNGs in img/ (exported from the Graph Tool drawings in this folder, unmodified).
// Run: NODE_PATH=<dir with pptxgenjs> node build-deck.js   → governing-what-we-share.pptx
// Marc Pierson and Claude Opus 5.5 · October 2026
'use strict';
const path = require('path');
const pptxgen = require('pptxgenjs');
const { applyTheme } = require(process.env.PPTX_SKILL + '/scripts/apply_theme.js');

const HERE = __dirname;
const IMG = (f) => path.join(HERE, 'img', f);
const OUT = path.join(HERE, 'governing-what-we-share.pptx');
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
  'The people and the place', "What we're sharing", 'Where we meet and choose', 'Who sets the rules',
  "What's going on when we meet", 'The house rules', 'What long-lasting groups do', 'How a rule is put together', 'Do I do my share?',
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
  s.addText(chip || (section ? `STEP ${section.toUpperCase()}` : phase), { placeholder: 'chip' });
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
  if (body) runs.push({ text: body, options: { fontSize: o.bodySize || 14, color: o.bodyColor || C.text1, breakLine: !!o.foot } });
  if (o.foot) runs.push({ text: o.foot, options: { fontSize: 12, italic: true, color: '6B7A70' } });
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
// "You already know this": an everyday experience, then the plain-sense points it teaches
function known(title, story, points, notes) {
  const s = content(title, notes, section ? `STEP ${section.toUpperCase()} · YOU ALREADY KNOW THIS` : undefined);
  card(s, 0.6, 1.6, 5.6, 5.2, story[0], story[1], { fill: 'FBF3E6', headColor: C.accent2, headSize: 20, bodySize: 17 });
  points.forEach((p, i) => {
    const y = 1.6 + i * (5.2 / points.length);
    s.addText(String(i + 1), { shape: pres.shapes.OVAL, x: 6.55, y, w: 0.5, h: 0.5, fill: { color: C.accent1 }, color: 'FFFFFF', fontSize: 15, bold: true, align: 'center', valign: 'middle', margin: 0 });
    para(s, p, { x: 7.25, y: y + 0.02, w: 5.45, h: 5.2 / points.length - 0.1, fontSize: 17 });
  });
  return s;
}
// Diagram slide: picture left, what-it-shows right
function diagram(title, file, src, shows, notes) {
  const s = content(title, notes);
  const b = img(s, file, { x: 0.5, y: 1.55, w: 8.3, h: 5.15, alt: title });
  caption(s, src, b.x, b.y + b.h + 0.05, b.w);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 9.1, y: 1.55, w: 3.75, h: 5.3, rectRadius: 0.08, fill: { color: C.background2 }, line: { color: C.background2 }, objectName: 'reading panel' });
  s.addText('READING THE PICTURE', { x: 9.3, y: 1.7, w: 3.4, h: 0.3, fontSize: 12, bold: true, color: C.accent1, charSpacing: 1, isTextBox: true, margin: 0 });
  bullets(s, shows, { x: 9.3, y: 2.1, w: 3.4, h: 4.65, fontSize: 14 });
  return s;
}
// Words slide: every technical word on a diagram, in plain language
function words(title, terms, intro, notes, maxPer = 8) {
  if (terms.length > maxPer) {
    const n = Math.ceil(terms.length / maxPer), per = Math.ceil(terms.length / n);
    let last;
    for (let k = 0; k < n; k++) last = words(`${title} (${k + 1} of ${n})`, terms.slice(k * per, (k + 1) * per), intro, notes, maxPer);
    return last;
  }
  const s = content(title, notes || (intro + ' Read the terms aloud with the diagram on screen; each card is the plain-language meaning.'));
  let y0 = 1.55;
  if (intro) { para(s, intro, { x: 0.6, y: 1.5, w: 12.1, h: 0.45, fontSize: 15, italic: true, color: '3E4A42' }); y0 = 2.0; }
  const cols = 2, rows = Math.ceil(terms.length / cols), gap = 0.12;
  const W = (12.1 - gap) / cols, H = (6.85 - y0 - gap * (rows - 1)) / rows;
  terms.forEach(([t, d, ow], i) => {
    const c = Math.floor(i / rows), r = i % rows;
    card(s, 0.6 + c * (W + gap), y0 + r * (H + gap), W, H, t, d, { headSize: 15, bodySize: 14, headColor: C.accent1, foot: ow ? `Ostrom's word: ${ow}` : undefined });
  });
  return s;
}

// ═════════════════════════════════════════════════════════════════════════
// OPENING
pres.addSection({ title: 'Opening' });
{
  const s = pres.addSlide({ masterName: 'TITLE', sectionTitle: 'Opening' });
  s.addText('Governing What We Share', { placeholder: 'title' });
  s.addText('What people who share things already know, as Elinor Ostrom found it, one step at a time', { placeholder: 'body' });
  s.addText(ATTR, { placeholder: 'attr' });
  s.addNotes("For people new to Elinor Ostrom and new to community organizing. The deck goes one step at a time, from the widest view (the people and the place) to the narrowest (one person deciding whether to do their share). Each step starts from something everyone has lived through, says the point in plain words, and only then shows Ostrom's picture. Her technical words appear in small type as 'Ostrom's word', for anyone who wants to read her.\n\n" + ATTR);
}
{
  const s = content('You already know most of this', "Ostrom studied ordinary communities: fishing villages, farmers sharing irrigation ditches, villagers sharing mountain pastures and forests. What she found is what people in such places already know. Her words are hard because she was arguing with economists in their own language. In this deck the everyday words come first and her words come second.", 'OPENING');
  card(s, 0.6, 1.6, 3.9, 3.0, 'She studied ordinary places', 'Fishing villages. Farmers sharing water ditches. Villages sharing mountain meadows and forests. Neighbors, not experts.', { headSize: 18, bodySize: 16 });
  card(s, 4.7, 1.6, 3.9, 3.0, 'She found common sense', 'People who share something make their own rules, keep an eye on each other, settle their arguments, and look after the thing, often for centuries.', { headSize: 18, bodySize: 16 });
  card(s, 8.8, 1.6, 3.9, 3.0, 'Her words came from economics', 'She was proving economists wrong, so she wrote in their language. Here the everyday words come first; hers are in small type.', { headSize: 18, bodySize: 16 });
  para(s, "If something in this deck sounds strange, the fault is in the words, not in you. Every idea here is something you have seen happen.", { x: 0.6, y: 5.0, w: 12.1, h: 1.2, fontSize: 20, italic: true, color: C.accent1 });
}
{
  const s = content('What Ostrom set out to show', "Garrett Hardin's 1968 essay 'The Tragedy of the Commons' said anything shared gets ruined, because each person gains by taking a little more. The usual answers were: the government takes control, or the thing is divided up and sold. Ostrom went and looked at real places and found that people often look after shared things themselves. The Swiss village of Torbel formally organized its shared meadows in 1483. In 2009 she became the first woman to receive the Nobel Prize in Economics.", 'OPENING');
  card(s, 0.6, 1.6, 5.9, 2.4, 'What people were told', 'Anything shared gets used up. Each person takes a little more, and together they ruin it. So either the government runs it, or it gets divided up and sold.', { fill: 'F6E9E4', headColor: C.accent4, headSize: 18, bodySize: 16 });
  card(s, 6.8, 1.6, 5.9, 2.4, 'What she found', 'Neighbors who share something often run it well themselves, for generations. Not always. So: what do the ones that last do?', { fill: C.background2, headColor: C.accent1, headSize: 18, bodySize: 16 });
  s.addText([{ text: '1483', options: { fontSize: 54, bold: true, color: C.accent2, breakLine: true } }, { text: 'the Swiss village of Torbel writes down how it shares its mountain meadows', options: { fontSize: 15, color: C.text1 } }], { x: 0.6, y: 4.35, w: 5.9, h: 2.3, isTextBox: true, margin: 0, valign: 'top' });
  s.addText([{ text: '2009', options: { fontSize: 54, bold: true, color: C.accent2, breakLine: true } }, { text: 'Ostrom is the first woman to win the Nobel Prize in Economics. Her lecture is where these pictures come from.', options: { fontSize: 15, color: C.text1 } }], { x: 6.8, y: 4.35, w: 5.9, h: 2.3, isTextBox: true, margin: 0, valign: 'top' });
}
{
  const s = content('Nine steps, from the widest view to one person', "Like a camera zooming in. Each step asks one plain question. A problem you notice at one step is often fixed at another.", 'OPENING');
  const qs = ['What is around the thing we share?', 'Does it run out? Can we keep people out?', 'What shapes what happens when we get together?', 'Who decides the rules, and who decides who decides?', 'What are the moving parts of any get-together?', 'Which rule shapes which part?', 'What do groups that last a long time have in common?', 'What are the parts of one rule?', 'Why would I do my share?'];
  RUNGS.forEach((r, i) => {
    const y = 1.6 + i * 0.57;
    s.addText(String(i + 1), { shape: pres.shapes.OVAL, x: 0.6 + i * 0.25, y, w: 0.45, h: 0.45, fill: { color: i === 0 || i === 8 ? C.accent2 : C.accent1 }, color: C.background1, fontSize: 15, bold: true, align: 'center', valign: 'middle', margin: 0 });
    s.addText([{ text: r + '   ', options: { bold: true, color: C.text2 } }, { text: qs[i], options: { color: '3E4A42' } }], { x: 1.2 + i * 0.25, y, w: 9.4, h: 0.45, fontSize: 16, valign: 'middle', isTextBox: true, margin: 0 });
  });
  s.addText('widest', { x: 10.9, y: 1.6, w: 1.8, h: 0.45, fontSize: 13, italic: true, color: '5B6B60', align: 'right', isTextBox: true, margin: 0 });
  s.addText('one person', { x: 10.9, y: 1.6 + 8 * 0.57, w: 1.8, h: 0.45, fontSize: 13, italic: true, color: '5B6B60', align: 'right', isTextBox: true, margin: 0 });
}
{
  const s = content('One example all the way down: the Elm Street garden', "An imagined community garden we follow through every step. The same ideas fit a tool library, a neighborhood fund, a food pantry, or a health co-op. A second example, a community health worker who is never at the table, comes in step 4.", 'OPENING');
  const items = [
    ['30 plots, one water tank', 'The garden shares a single rain-fed tank. In a dry summer there is not enough for everyone.'],
    ['A written bylaw', 'Everyone has watering days. No sprinklers when the tank is below half.'],
    ['A water keeper', 'A gardener chosen each spring to keep an eye on the tank and on the watering.'],
    ['A spring meeting', 'Where the gardeners change their rules. The city leases them the land.'],
  ];
  items.forEach(([h, b], i) => card(s, 0.6 + (i % 2) * 6.15, 1.7 + Math.floor(i / 2) * 2.55, 5.95, 2.3, h, b, { headSize: 20, bodySize: 17 }));
}

// ═════════════════════════════════════════════════════════════════════════
// 1 · THE PEOPLE AND THE PLACE
sect(1, 'The people and the place', 'Nothing shared stands alone. It sits among people, a place, some rules, and the wider world.', "Step 1, the widest view. Start from the office fridge, then show Ostrom's picture of the same idea.");
known('Think of the office fridge', ['The office fridge', 'Whether it stays clean depends on the fridge itself, how big it is, how many people use it, the sign on the door, who cleans it on Fridays, and the building it sits in. When it gets gross, people change the sign, or start a cleaning rota.'], [
  'Every shared thing has four sides: the thing itself, the bits people take from it, the people, and the rules.',
  'They all push on each other. What people do changes the thing; the state of the thing changes what people do.',
  'Around it all is a wider world: money, laws, the weather, the neighborhood.',
], 'The office fridge is a small commons. Ask the room who has seen a shared fridge go bad, and what happened next. Everything on the next slide is already in that story.');
diagram('The thing we share, the people, the rules, and the world around them', 'fig6-social-ecological-system.png', 'Ostrom 2010, Figure 6, adapted from Ostrom 2007', [
  'Four corners: the shared thing (top left), what people take from it (bottom left), the rules and who makes them (top right), the people (bottom right).',
  'Middle: where people meet and make choices.',
  'Solid arrows: this affects that. Dashed arrows: the results come back around.',
  'Above and below: the wider world, and the nature next door.',
], "Ostrom's Figure 6. Read from the middle out. Point to each corner and name its office-fridge version, then its Elm Street version.");
words('Reading the picture, in everyday words', [
  ['The people and the place, together', 'People and nature tangled up, looked at as one thing rather than two.', 'social-ecological system (SES)'],
  ['The shared thing', 'The garden, the lake, the forest, the fridge, the fund.', 'resource system (RS)'],
  ['The bits we take or use', 'Gallons of water, fish, plots, shelf space, hours, dollars.', 'resource units (RU)'],
  ['The rules and who makes them', 'The bylaw, the spring meeting, the water keeper, the city.', 'governance system (GS)'],
  ['The people who use it', 'Gardeners, coworkers, fishers, neighbors.', 'users (U), later "actors"'],
  ['Where we meet and choose', 'Any time people get together and make choices that affect each other. Step 3 opens it up.', 'action situation'],
  ['What we do, and what comes of it', 'Taking, sharing news, arguing, pitching in; and how it turns out for people and the place.', 'interactions (I), outcomes (O)'],
  ['The wider world', 'The economy, the law, politics, the news, rents.', 'social, economic and political settings (S)'],
  ['The nature next door', 'Weather, the watershed, pollution drifting in.', 'related ecosystems (ECO)'],
  ['Solid and dashed arrows', 'Solid: this affects that. Dashed: results come back and change things.', 'direct causal link; feedback'],
], 'Each card: the everyday words first, what they mean, and the word Ostrom used.');
{
  const s = content('The four sides at Elm Street', 'Same four sides, in the garden. Ask your own group to fill in the four sides of whatever you share.');
  const P = [['The shared thing', 'The garden and its rain-fed tank.', 'ECECD9'], ['The bits we take or use', 'Gallons of water. Plots. The harvest.', 'ECECD9'], ['The rules and who makes them', 'The bylaw, the spring meeting, the water keeper, the city lease.', 'DCE8F4'], ['The people who use it', '30 gardeners, their families, and newcomers on the waiting list.', 'F8E6CF']];
  P.forEach(([h, b, f], i) => card(s, 0.6 + (i % 2) * 6.15, 1.6 + Math.floor(i / 2) * 1.75, 5.95, 1.55, h, b, { fill: f, headSize: 18, bodySize: 16 }));
  card(s, 0.6, 5.2, 5.95, 1.6, 'The wider world', 'The city budget and drought rules. Rents. Who has time to garden.', { fill: 'FFFFFF', line: 'C9D3CC', headSize: 18, bodySize: 16 });
  card(s, 6.75, 5.2, 5.95, 1.6, 'The nature next door', 'The watershed. Rainfall. Heat waves.', { fill: 'FFFFFF', line: 'C9D3CC', headSize: 18, bodySize: 16 });
}
{
  const s = content('When do neighbors get organized at all?', "From Ostrom's 2009 paper and her Nobel lecture: ten things that, across many places, made it more likely that people would organize themselves to look after something shared. Each is common sense once it is said out loud.");
  const T = [
    ['It is not too big', 'People can see and know the whole thing.', 'size'], ['It is worth saving', 'Not ruined, not so plentiful nobody cares.', 'productivity'],
    ['It behaves predictably', 'People can tell what it will do next.', 'predictability'], ['It stays put', 'Plots stay put; water and fish wander off.', 'mobility of units'],
    ['We can change our own rules', 'Nobody outside has to sign off.', 'collective-choice rules'], ['Not too many of us', 'Enough to do the work, few enough to know each other.', 'number of users'],
    ['Someone gets it started', 'A person willing to call the first meeting.', 'leadership'], ['We already trust each other', 'Some shared habits and goodwill are there.', 'norms, social capital'],
    ['We understand how it works', 'We know how the tank fills and empties.', 'knowledge of the system'], ['It matters to us', 'Enough to be worth the bother.', 'importance to users'],
  ];
  T.forEach(([h, b, ow], i) => card(s, 0.6 + (i % 2) * 6.15, 1.55 + Math.floor(i / 2) * 1.07, 5.95, 0.95, h, `${b}  (Ostrom: ${ow})`, { headSize: 15, bodySize: 14 }));
}

// ═════════════════════════════════════════════════════════════════════════
// 2 · WHAT WE'RE SHARING
sect(2, "What we're sharing", 'Two plain questions tell you what kind of trouble to expect: does it run out, and can you keep people out?', "Step 2. Before any rules, ask what kind of thing is shared. Start from a party.");
known('Think of a party', ['At a party', 'The pizza runs out: every slice someone eats is gone. The music does not: everyone hears it no matter how many dance. The coat room is easy to guard; the music next door is not.'], [
  'Some things run out when people use them. Some do not.',
  'Some things are easy to keep people out of. Some are not.',
  'Those two questions tell you what will go wrong: things taken too fast, or nobody pitching in.',
], 'Two questions, nothing more. Get the room to sort a few things from their own lives before showing the picture.');
diagram('Two questions sort everything people share', 'fig1-four-types-of-goods.png', 'Ostrom 2010, Figure 1, adapted from Ostrom 2005', [
  'Across the top: does it run out when people use it? (High = yes.)',
  'Down the side: is it hard to keep people out? (High = yes, hard.)',
  'Four boxes, four kinds of trouble.',
  "Ostrom's work was mostly about the top-left box: things that run out and are hard to fence off.",
  'These are regions, not boxes. Things slide between them.',
], "Ostrom's Figure 1. Translate the long labels out loud: 'subtractability of use' is 'does it run out', and 'difficulty of excluding potential beneficiaries' is 'can we keep people out'.");
words('Reading the picture, in everyday words', [
  ['Things we value', 'Anything people want or use, not only things for sale: water, safety, know-how, a hall.', 'goods'],
  ['Does it run out?', 'Does my use leave less for you?', 'subtractability of use'],
  ['Can we keep people out?', "How hard it is to stop people who didn't pay or help from getting it anyway.", 'difficulty of excluding potential beneficiaries'],
  ['Something we all draw from that can run out', 'Hard to keep people out, and it gets used up: groundwater, fish, the garden tank in August.', 'common-pool resource'],
  ['Something everyone gets, helped or not', "Hard to keep people out, and it doesn't run out: safety, know-how, a weather forecast.", 'public good'],
  ['Members only', 'Easy to keep people out, and it only runs short when crowded: a theater, a club, a daycare.', 'toll good (club good)'],
  ['Mine', 'Easy to keep people out, and it runs out: food, clothes, a car.', 'private good'],
  ['Getting a free ride', 'Enjoying it without doing your share.', 'free-riding'],
], 'Each card: the everyday words first, what they mean, and the word Ostrom used.');
{
  const s = content('Neighborhood things, sorted', "Ask the group to place the things it shares. The point is not the box; it is the trouble each box brings.");
  const Q = [
    ['Can run out, hard to fence off: the garden water, a shared fund, volunteer hours', 'Two troubles at once: some take too much, too few put back. You need rules for both taking and giving.', 'FBEFCB'],
    ['Everyone gets it: neighborhood safety, a shared know-how wiki', 'Everyone benefits whether or not they helped, so the trouble is getting enough people to chip in.', 'DCE8F4'],
    ["Members only: a tool library, a co-op's services, a meeting hall", 'Most of the work is deciding who is a member, what they pay, and what happens when it gets crowded.', 'E6E1F2'],
    ['Mine: the vegetables from your own plot', 'Little to sort out together. Your plot, your tomatoes.', 'ECEEEC'],
  ];
  Q.forEach(([h, b, f], i) => card(s, 0.6 + (i % 2) * 6.15, 1.6 + Math.floor(i / 2) * 2.1, 5.95, 1.95, h, b, { fill: f, headSize: 16, bodySize: 15 }));
  para(s, 'In a wet spring nobody fights over the garden water. In a drought, every gallon counts. The same thing can slide from one box toward another.', { x: 0.6, y: 5.95, w: 12.1, h: 0.8, fontSize: 16, italic: true, color: C.accent1 });
}

// ═════════════════════════════════════════════════════════════════════════
// 3 · WHERE WE MEET AND CHOOSE
sect(3, 'Where we meet and choose', 'What happens when people get together depends on the place, the people, and the rules they really follow.', "Step 3. Zoom in from the whole picture to one get-together. Start from a family dinner.");
known('Think of a family dinner', ['A family dinner', "What happens depends on what's in the fridge, who's at the table and how they get along, and the house rules (phones away, kids clear the plates). Afterwards everyone has an opinion on how it went. Next time, something changes."], [
  'Three things set the scene: the stuff, the people, and the rules people really follow.',
  'Then people do things, and something comes of it.',
  'People judge how it went, and that changes the next time. Sometimes it changes the rules.',
], 'Everything in the next picture is in the dinner story. The judging afterwards, and the changing of rules, is the part that matters most for organizing.');
diagram('What shapes what happens when we get together', 'fig2-iad-framework.png', "Ostrom 2010, Figure 2, adapted from Ostrom 2005. Green title: Marc's", [
  'Left: the stuff, the people, and the rules they really follow.',
  'Middle: the get-together, where people choose.',
  'Right: what people do, how it turns out, and how we judge whether it worked.',
  'Dashed arrows: how it went comes back around. The long one is people changing their own rules.',
], "Ostrom's Figure 2. The green title is Marc's: the two halves of the story, building trust and making rules that fit the place.");
words('Reading the picture, in everyday words', [
  ['How rules shape what people do', "Ostrom's whole way of looking at things, named after the job it does.", 'IAD (Institutional Analysis and Development) framework'],
  ['The ways we do things here', 'Rules, habits and expectations. Not a building or an agency.', 'institution'],
  ['Things set from outside', "What the people at the table can't change in the moment.", 'external variables (exogenous)'],
  ['The stuff', 'The physical facts: the water, the soil, the weather, the room.', 'biophysical conditions'],
  ['The people', 'Who they are, their history together, what they know, how far they trust each other.', 'attributes of community'],
  ['How things really work here', 'The rules people actually follow, which may not be the ones written down.', 'rules-in-use'],
  ['Where we meet and choose', 'Any get-together where choices affect each other: a meeting, watering day, a market.', 'action situation'],
  ['What we did, and what came of it', 'What people actually did, and how it turned out.', 'interactions, outcomes'],
  ['How we judge whether it worked', 'Was it fair? Did it waste anything? Can we see who did what? Will it last?', 'evaluative criteria'],
  ['Coming back around', 'How it went changes the next time, and sometimes the rules.', 'feedback'],
], 'Each card: the everyday words first, what they mean, and the word Ostrom used.');
{
  const s = content('The rules on paper, and how things really work', "Everyone knows the difference between the rule on the wall and how things really work. Ostrom said: study how things really work. You find it by watching and asking.");
  card(s, 0.6, 1.6, 5.95, 3.4, 'The rules on paper (the bylaw)', 'Water only on your day.\n\nNo sprinklers when the tank is below half.\n\nThe water keeper suspends anyone who breaks the rules.', { fill: 'ECEEEC', headSize: 18, bodySize: 17 });
  card(s, 6.75, 1.6, 5.95, 3.4, 'How things really work', "Early risers water any day; nobody minds.\n\nNobody reads the tank, so 'below half' never kicks in.\n\nThe keeper has never suspended anyone; a quiet word does it.", { fill: C.background2, headSize: 18, bodySize: 17 });
  para(s, "The gap is where to look. A rule nobody follows has gone stale. A habit everybody follows is a rule nobody wrote down. Both turn up only when you watch, ask, and keep track over time.", { x: 0.6, y: 5.3, w: 12.1, h: 1.5, fontSize: 18 });
}

// ═════════════════════════════════════════════════════════════════════════
// 4 · WHO SETS THE RULES
sect(4, 'Who sets the rules', 'Rules come from somewhere. Someone makes them, and someone decides who gets to make them.', "Step 4. Start from a household: who follows bedtime, who sets it, and who counts as a parent.");
known('Think of bedtime', ['Bedtime in a household', "The kids go to bed at 8 (that's doing). The parents set 8 o'clock (that's making the house rules). Whether Grandma also gets a say is a different question: who gets to make the rules at all. And underneath, everyone assumes things about what a family is that nobody ever wrote down."], [
  'Doing the thing.',
  'Making the house rules.',
  'Deciding who gets to make the house rules.',
  'What everybody takes for granted, underneath it all.',
], "Four layers. Each one decides the rules for the one below. That's the whole idea of the next picture.");
diagram('Each layer decides the rules for the layer below', 'levels-of-action.png', 'Added panel, after Kiser and Ostrom 1982 and Ostrom 2005; not a lecture figure', [
  'Read down: what each layer decides becomes the rules the next layer follows.',
  'Read up: people see how things turn out and take it to the layer that can change the rule.',
  'The higher the layer, the rarer the decision, and the more it changes.',
], 'An added panel. The lecture mentions these layers in one sentence and has no picture for them.');
words('Reading the picture, in everyday words', [
  ['Layers of deciding', 'Each layer sets the rules for the one below it.', 'levels of action'],
  ['Doing the work', 'Watering, harvesting, paying, keeping an eye out, giving someone a warning.', 'operational'],
  ['Setting the house rules', 'A meeting changes the watering days.', 'collective choice'],
  ['Deciding who sets the house rules', 'Who counts as a member, and how the meeting decides.', 'constitutional'],
  ['What we all take for granted', 'What feels fair, who counts, what a rule can even be. Never written down.', 'metaconstitutional'],
  ['The rules handed down', 'What one layer decides becomes the rules of the next.', 'rules-in-use for the level below'],
  ['Noticed and taken upstairs', 'How things turn out gets noticed, judged, and taken to a layer that can change things.', 'feedback between levels'],
  ['How it turns out', 'Water used, plots tended, care given, money moved.', 'outcomes'],
], 'Each card: the everyday words first, what they mean, and the word Ostrom used.');
{
  const s = content('The four layers at Elm Street', 'Same garden, four layers. Each higher decision is rarer and changes more.');
  const rows = [
    ['What we all take for granted', 'Do newcomers deserve a plot at all?', 'Unwritten, and the strongest.', '6B5B95'],
    ['Deciding who sets the rules', 'Who counts as a member, and how does the spring meeting decide?', 'Changes the most', 'B5532D'],
    ['Setting the house rules', 'The spring meeting changes the watering days.', 'Changes a rule', 'C9822A'],
    ['Doing the work', 'Watering on your day. The keeper has a word with someone who did not.', 'Changes a number. Most of the effort, least of the change', '2E6B45'],
  ];
  rows.forEach(([lv, ex, lev, col], i) => {
    const y = 1.6 + i * 1.3;
    s.addText(lv, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.08, x: 0.6, y, w: 3.3, h: 1.1, fill: { color: col }, color: 'FFFFFF', fontSize: 17, bold: true, align: 'center', valign: 'middle', margin: 4 });
    para(s, ex, { x: 4.1, y: y + 0.08, w: 5.4, h: 1.0, fontSize: 17, valign: 'middle' });
    para(s, lev, { x: 9.6, y: y + 0.08, w: 3.1, h: 1.0, fontSize: 15, italic: true, color: '3E4A42', valign: 'middle' });
  });
}
{
  const s = content('A quick test: which layer am I on?', 'Use it in any meeting. When someone proposes a change, ask which of these three it is.');
  const T = [['Does it change a number?', 'Doing the work', 'Easiest to do, smallest effect.', '2E6B45'], ['Does it change a rule?', 'Setting the house rules', 'Real change, made by the group.', 'C9822A'], ['Does it change who gets to change the rules?', 'Deciding who sets the rules', 'Rare, hard, and lasting.', 'B5532D']];
  T.forEach(([q, l, d, col], i) => {
    const x = 0.6 + i * 4.1;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.8, w: 3.9, h: 4.2, rectRadius: 0.1, fill: { color: col }, line: { color: col } });
    s.addText([{ text: q, options: { fontSize: 22, bold: true, color: 'FFFFFF', breakLine: true } }, { text: ' ', options: { fontSize: 10, breakLine: true } }, { text: l, options: { fontSize: 19, color: 'FFFFFF', bold: true, breakLine: true } }, { text: d, options: { fontSize: 16, color: 'FFFFFF' } }], { x: x + 0.25, y: 2.0, w: 3.4, h: 3.8, valign: 'middle', isTextBox: true, margin: 0 });
  });
  para(s, "Donella Meadows saw the same thing in all kinds of systems: changing numbers is the weakest push, and changing who can change things is among the strongest.", { x: 0.6, y: 6.2, w: 12.1, h: 0.7, fontSize: 15, italic: true, color: '3E4A42' });
}
{
  const s = content('One complaint, three layers: the missing seat', "A second example: a neighborhood health co-op whose community health worker is never part of decisions. Read at each layer, the same complaint means something different, and only the top reading points to the fix.");
  const steps = [
    ['Read as doing the work', '"Nobody asks the health worker." Sounds like a communication problem. Fix: ask more. It doesn\'t stick.', '2E6B45'],
    ['Read as house rules', '"The health worker isn\'t at the table where rules are made." Fix: invite them. They still have no vote.', 'C9822A'],
    ['Read as who sets the rules', '"There is no health-worker seat at all." You can\'t seat someone in a seat that doesn\'t exist. Only creating the seat fixes it.', 'B5532D'],
  ];
  steps.forEach(([h, b, col], i) => {
    const x = 0.6 + i * 4.1, y = 4.4 - i * 1.25;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 3.9, h: 2.45, rectRadius: 0.08, fill: { color: 'FFFFFF' }, line: { color: col, width: 2.5 } });
    s.addText([{ text: h, options: { bold: true, fontSize: 17, color: col, breakLine: true } }, { text: b, options: { fontSize: 15, color: C.text1 } }], { x: x + 0.18, y: y + 0.12, w: 3.55, h: 2.2, valign: 'top', isTextBox: true, margin: 0 });
  });
  para(s, 'The higher you read it, the more the fix changes.', { x: 0.6, y: 1.6, w: 7.5, h: 0.5, fontSize: 18, bold: true, color: C.accent1 });
}

// ═════════════════════════════════════════════════════════════════════════
// 5 · WHAT'S GOING ON WHEN WE MEET
sect(5, "What's going on when we meet", 'Every get-together has the same moving parts, like a game.', "Step 5. Open up one get-together. Ostrom built these parts with a game theorist, so start from a game everyone knows.");
known('Think of a pickup basketball game', ['Pickup basketball', "There are players. There are positions: guard, center. Each position can do certain things. You can see some things and not others. How the points add up decides who wins. Some scores are possible and some aren't. And winning or losing costs and pays something, even if it's just pride."], [
  'Who is playing, and in which spot.',
  'What each spot can do.',
  'What each player can see.',
  'How the moves add up to a result.',
  'What results are possible, and what each player gets out of them.',
], "Seven moving parts. Every meeting, market, watering day and family dinner has the same seven. The next picture just names them.");
diagram('The seven moving parts of any get-together', 'fig3-action-situation.png', 'Ostrom 2010, Figure 3, adapted from Ostrom 2005', [
  'People are put into roles.',
  'Roles come with things they can do.',
  'What people do leads to possible results, depending on what they know and how their choices add up.',
  'Each result costs and pays each role something.',
], "Ostrom's Figure 3. Her one-sentence version: people in roles choose what to do, depending on what they know, how their choices add up, and what it costs and pays them.");
words('Reading the picture, in everyday words', [
  ['The people taking part', 'Gardeners, the keeper, the city. Players.', 'actors (participants)'],
  ['Roles', 'Gardener, water keeper, chair. A role outlasts the person in it.', 'positions'],
  ['What each role can do', 'Water, harvest, propose, vote, report.', 'actions'],
  ['What people know', 'The tank level, who watered, what others did.', 'information about'],
  ['How our choices add up', 'One person decides? A vote? Everyone must agree?', 'control over'],
  ['What could happen', 'A full tank, dead tomatoes, a fight.', 'potential outcomes'],
  ['What each role gets out of it, minus what it costs', '"Net" just means after taking away the costs.', 'net costs and benefits'],
  ['Who goes where; what leads to what', 'Who sits in which seat, and which moves lead to which results.', 'assigned to; linked to'],
], 'Each card: the everyday words first, what they mean, and the word Ostrom used.');

// ═════════════════════════════════════════════════════════════════════════
// 6 · THE HOUSE RULES
sect(6, 'The house rules', 'Seven kinds of rule, one for each moving part. And the same rules seen from your own seat.', "Step 6. Every board game comes with rules for each moving part. So does every group.");
known('Think of the rules of a board game', ['The box lid of a board game', "How many can play. What pieces or roles there are. What moves each can make. Which cards are face down. How the score is counted. What you win or pay. When the game is over. Change any one and you've got a different game."], [
  'Who can play.  What roles there are.  What each can do.',
  'What you can see.  How it adds up.',
  'Who wins and pays what.  What the game is about.',
  "Groups have the same seven kinds of rule, written or not.",
], "Each kind of rule shapes one moving part from step 5. The next picture draws exactly that.");
diagram('Each kind of rule shapes one moving part', 'fig4-rules-acting-on-the-situation.png', "Ostrom 2010, Figure 4, adapted from Ostrom 2005. Green dotted labels: Marc's", [
  'Blue: the rules people really follow. Green: the get-together from step 5.',
  'Each red arrow: one kind of rule shaping one moving part.',
  "Green dotted labels are Marc's: the same rules as you'd ask them from your own seat.",
  'How it turns out gets judged, and comes back around to the rules.',
], "Ostrom's Figure 4. Her advice: ask of any rule, which moving part does it shape? That sorts every rule into one of seven kinds.");
{
  const s = content("Close-up: the rules, and Marc's questions", "The same picture, enlarged. Point to a blue rule box, follow its red arrow to the part it shapes, then read Marc's green question beside it.");
  const b = img(s, 'fig4-closeup.png', { x: 0.5, y: 1.5, w: 8.4, h: 5.3, alt: "Close-up of Figure 4: the seven rule types acting on the seven moving parts, with Marc's margin questions" });
  caption(s, "Detail of Figure 4. Green dotted labels: Marc's", b.x, b.y + b.h + 0.05, b.w);
  const F = [['Blue boxes', 'the seven kinds of rule'], ['Red arrows', 'which part each rule shapes'], ['White boxes', 'the seven moving parts from step 5'], ['Green dotted', "Marc's questions from your own seat: WHO? WHAT? HOW? WHY? For whom? By whom? Am I allowed?"]];
  F.forEach(([h, d], i) => card(s, 9.2, 1.5 + i * 1.33, 3.6, 1.2, h, d, { headSize: 16, bodySize: 14 }));
}
words('The seven kinds of house rule, in everyday words', [
  ["Who's in", 'Who counts as a gardener, how you join, how you leave.', 'boundary rules'],
  ['What jobs there are', 'One water keeper, a chair, how many of each.', 'position rules'],
  ['Who may do what', 'Gardeners may water on their day; nobody may use sprinklers below half.', 'choice (authority) rules'],
  ['Who gets told what', 'The keeper posts the tank level every week.', 'information rules'],
  ['How we decide', 'A vote? Two-thirds? Everyone agrees? The keeper alone?', 'aggregation rules'],
  ['Who pays, who gains', 'Four work hours a season; lose watering for a week if you break the rule.', 'payoff rules'],
  ["What's on the table", 'The meeting may change watering days, but may not sell the land.', 'scope rules'],
  ['Set from outside the get-together', 'The rules come from outside the moment and shape it.', 'exogenous variables (in the title)'],
], 'Each card: the everyday words first, a garden example, and the word Ostrom used.');
words("Marc's questions: the same rules, from your own seat", [
  ['WHO?', "Who's in? Who gets told? Who has to agree?", 'boundary, information and aggregation rules'],
  ['WHAT?', "What am I allowed, expected, or not allowed to do?", 'choice rules'],
  ['HOW?', 'How are costs and benefits shared, and how are slip-ups handled?', 'payoff rules'],
  ['WHY?', 'What are we here to change at all?', 'scope rules'],
  ['For whom? By whom?', 'Who a role serves, and who fills it. Asked about roles, not particular people.', 'position rules'],
  ['Am I allowed?', 'My permission comes from a rule, not from me.', '"derived authority"'],
  ['Know-how and know-what', 'Information rules pass facts around; deciding together turns what people know into a shared choice.', '"data & information", "knowledge & understanding"'],
  ['Sets the limits; describes how it adds up', 'What you know sets the limits of your choice. How choices combine describes how they turn into results.', '"parameterizes", "models"'],
  ['Is it worth the effort and risk?', 'The question each person asks before pitching in. Step 9 answers it.', '"judgement", "judges"'],
], "Ostrom draws the get-together from outside, like an observer. Marc's labels draw it from inside, like a participant.");
{
  const s = content('The rule nobody writes down: how do we decide?', "Groups rarely write down how they decide. Two people can honestly disagree about whether something passed because each assumed a different way of deciding. One set of votes, four results.");
  para(s, 'The spring meeting votes on a new watering schedule. 30 members. 17 vote yes, 10 vote no, 3 stay home.', { x: 0.6, y: 1.6, w: 12.1, h: 0.6, fontSize: 18 });
  const R = [['Most of those who came', 'PASSES', '17 of 27', '2E6B45'], ['Two-thirds of those who came', 'FAILS', 'needs 18 of 27', 'B5532D'], ['Everyone agrees', 'FAILS', '10 said no', 'B5532D'], ['The water keeper decides', '?', 'up to one person', '6B5B95']];
  R.forEach(([h, v, d, col], i) => {
    const x = 0.6 + i * 3.08;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.5, w: 2.9, h: 3.0, rectRadius: 0.08, fill: { color: C.background2 }, line: { color: C.background2 } });
    s.addText([{ text: h, options: { fontSize: 16, bold: true, color: C.text2, breakLine: true } }, { text: v, options: { fontSize: 40, bold: true, color: col, breakLine: true } }, { text: d, options: { fontSize: 15, color: '3E4A42' } }], { x: x + 0.15, y: 2.65, w: 2.6, h: 2.7, valign: 'top', isTextBox: true, margin: 0 });
  });
  para(s, 'Most quarrels are two people quietly assuming different ways of deciding. Ask early: who has to agree for this to count?', { x: 0.6, y: 5.8, w: 12.1, h: 0.9, fontSize: 17, bold: true, color: C.accent1 });
}

// ═════════════════════════════════════════════════════════════════════════
// 7 · WHAT LONG-LASTING GROUPS DO
sect(7, 'What long-lasting groups do', "Eight things Ostrom found again and again in groups that lasted, and missing in the ones that fell apart.", "Step 7. Ostrom looked for the one rule that always works and found none: what works differs from place to place. So she looked one step up, at what lasting groups have in common. She was clear the people in them never had a list.");
known('Think of a group that has lasted fifty years', ['A choir, a club, a congregation that has lasted fifty years', "Everyone knows who's a member. The dues feel fair for what you get. Members vote on the big things. Someone keeps track. Lateness gets a word before it gets a fine. Arguments get settled over coffee, not in court. The city leaves them alone. And they belong to something bigger."], [
  "You've seen all of this.",
  "Nobody there had a list. They worked it out over time.",
  "Ostrom found the same eight things in fishing villages, irrigation ditches and mountain meadows.",
], 'Ask the room to name a group they know that has lasted, and what it does. You will usually hear most of the eight.');
{
  const s = content("Eight things long-lasting groups do", "Ostrom's design principles, as updated by Cox, Arnold and Villamayor Tomas (2010), who checked them against more than 100 studies. About two-thirds found that lasting groups had most of these, and failed ones did not.");
  const D = [
    ["1 We know who's in, and what's ours", 'Who belongs (1A), and where the shared thing begins and ends (1B).', 'clear boundaries'],
    ['2 Rules that fit here, and a fair share', 'Rules suit this place (2A). What you put in matches what you take (2B).', 'congruence; proportional costs and benefits'],
    ['3 The people affected make the rules', 'Most people living under the rules help make and change them.', 'collective-choice arrangements'],
    ['4 We keep an eye out', 'On each other (4A) and on the thing itself (4B), by people who answer to us.', 'monitoring'],
    ['5 A word first, then step up', 'Small penalties at first, bigger for repeats.', 'graduated sanctions'],
    ['6 Settle it close to home', 'Quick, cheap, local ways to sort out arguments.', 'conflict-resolution mechanisms'],
    ['7 Outsiders let us run our own affairs', 'The city or landowner respects our right to make our rules.', 'minimal recognition of rights'],
    ['8 Groups within groups', 'Each small group runs itself, and links to the bigger ones it belongs to.', 'nested enterprises'],
  ];
  D.forEach(([h, b, ow], i) => card(s, 0.6 + (i % 2) * 6.15, 1.55 + Math.floor(i / 2) * 1.33, 5.95, 1.2, h, b, { headSize: 16, bodySize: 14, foot: `Ostrom's words: ${ow}` }));
}
{
  const s = content('Each of the eight leans on certain house rules', "Our own summary, not Ostrom's: which of the seven kinds of house rule each one depends on, and which layer from step 4 it sits on. Number 2A is the exception: whether rules fit a place is something you judge by looking at the place.");
  const rows = [
    ["1 We know who's in, and what's ours", "Who's in; what's on the table", 'Doing the work; deciding who sets the rules'],
    ['2 Rules that fit, and a fair share', 'Who pays, who gains, matched to who may do what', 'Doing the work'],
    ['3 The people affected make the rules', "Who's in, what jobs, who's told, how we decide, what's on the table", 'Setting the house rules'],
    ['4 We keep an eye out', 'A job for it; a duty to do it; who gets told', 'Doing the work'],
    ['5 A word first, then step up', 'Who pays: the penalty, stepping up', 'Doing the work'],
    ['6 Settle it close to home', 'A job (someone to go to); who may come; how it gets decided', 'Setting the house rules'],
    ['7 Outsiders let us run our affairs', "What's on the table, set by someone outside", 'Deciding who sets the rules'],
    ['8 Groups within groups', "Who's in and what jobs, linking small groups to big ones", 'Deciding who sets the rules'],
  ];
  const head = ['What lasting groups do', 'House rules it leans on', 'Layer'].map((t) => ({ text: t, options: { bold: true, color: 'FFFFFF', fill: { color: C.accent1 } } }));
  s.addTable([head, ...rows.map((r) => r.map((t, j) => ({ text: t, options: { bold: j === 0 } })))], { x: 0.6, y: 1.55, w: 12.1, colW: [3.6, 5.3, 3.2], fontSize: 14, color: C.text1, border: { type: 'solid', pt: 0.5, color: 'C9D3CC' }, rowH: 0.55, fill: { color: 'FFFFFF' }, valign: 'middle' });
}
{
  const s = content('"The people affected make the rules" is really five questions', "It sounds simple. The house rules split it into five questions, and a group can miss any one while sincerely believing it includes everyone.");
  const Q = [['Are they at the table?', "Who's in"], ['Is there a seat for them?', 'What jobs there are, decided by whoever sets the rules'], ['Do they hear about it in time?', 'Who gets told what'], ['Does their say count?', 'How we decide: a vote, a yes, or just being asked'], ['What may they change?', "What's on the table"]];
  Q.forEach(([q, r], i) => {
    const x = 0.6 + i * 2.46;
    s.addShape(pres.shapes.OVAL, { x: x + 0.75, y: 1.75, w: 0.8, h: 0.8, fill: { color: C.accent2 }, line: { color: C.accent2 } });
    s.addText(String(i + 1), { x: x + 0.75, y: 1.75, w: 0.8, h: 0.8, fontSize: 24, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', isTextBox: true, margin: 0 });
    card(s, x, 2.8, 2.3, 2.6, q, r, { headSize: 17, bodySize: 15 });
  });
  para(s, 'The health worker in step 4 failed question 2. No amount of telling (3) or inviting (1) could fix it.', { x: 0.6, y: 5.8, w: 12.1, h: 0.9, fontSize: 17, italic: true, color: C.accent1 });
}

// ═════════════════════════════════════════════════════════════════════════
// 8 · HOW A RULE IS PUT TOGETHER
sect(8, 'How a rule is put together', 'Every rule answers the same few questions. Ask them, and you can see what is missing.', "Step 8. Sue Crawford and Ostrom showed that every rule has the same few parts. Start from a parking sign.");
known('Think of a parking sign', ['A parking sign', '"No parking, 8am to 6pm, Monday to Friday. Violators will be towed." It says when, who it is for (drivers), what you must not do (park), where (here), and what happens if you do (towed).'], [
  'When does it apply?  Who is it for?',
  'Must, may, or must not?  Do what, to what, and how?',
  'Or else what?',
  'Take away the "or else" and it is a polite request.',
], "Every rule-like sentence has these parts. A missing part is a gap you can point to.");
{
  const s = content('The parts of one garden rule', 'Take one sentence from the garden bylaw and ask it the questions. Each part does a job. The OR ELSE is the one most often missing.');
  para(s, '"When the tank is below half, gardeners must not water their plots with sprinklers, or else they lose watering for a week."', { x: 0.6, y: 1.55, w: 12.1, h: 0.9, fontSize: 20, italic: true, color: C.text2 });
  const P = [['WHEN?', 'when the tank is below half', 'condition'], ['WHO?', 'gardeners', 'attribute'], ['MUST, MAY, OR MUST NOT?', 'must not', 'deontic'], ['DO WHAT?', 'water', 'aim'], ['TO WHAT?', 'their plots', 'object'], ['HOW?', 'with sprinklers', 'condition'], ['OR ELSE?', 'they lose watering for a week', 'or else']];
  P.forEach(([q, a, adico], i) => {
    const x = 0.6 + i * 1.75;
    s.addText(q, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.06, x, y: 2.75, w: 1.65, h: 0.9, fill: { color: i === 6 ? C.accent4 : C.accent1 }, color: 'FFFFFF', fontSize: 13, bold: true, align: 'center', valign: 'middle', margin: 3 });
    s.addText(a, { x, y: 3.75, w: 1.65, h: 1.2, fontSize: 16, color: C.text1, align: 'center', valign: 'top', isTextBox: true, margin: 2 });
    s.addText(`Ostrom: ${adico}`, { x, y: 5.0, w: 1.65, h: 0.4, fontSize: 12, italic: true, color: '6B7A70', align: 'center', isTextBox: true, margin: 0 });
  });
  para(s, 'A sentence that creates something ("The water keeper is chosen each spring from the members") asks different questions: what are we creating? must or may? how is it formed? out of what?', { x: 0.6, y: 5.6, w: 12.1, h: 1.1, fontSize: 16, color: '3E4A42' });
}
words('The rule questions, in everyday words', [
  ['How a rule is put together', 'Breaking any rule into the same few parts, so rules can be compared and checked.', 'Institutional Grammar (IG); ADICO'],
  ['Who is it for?', 'The people the rule applies to.', 'attribute'],
  ['Must, may, or must not?', 'Whether it is required, allowed, or forbidden.', 'deontic (Greek for "what binds")'],
  ['Do what, to what?', 'The action, and what it is done to.', 'aim; object'],
  ['When, and how?', 'When and where it applies, and the manner.', 'condition (IG 2.0: activation condition, execution constraint)'],
  ['Or else what?', 'What happens if you break it. Without one, it is a hope, not a rule.', 'or else (sanction)'],
  ['A sentence that creates something', 'Creates a role, a group or a thing, rather than telling people what to do.', 'constitutive statement'],
  ['The original five parts', 'Attribute, Deontic, aIm, Condition, Or else: A-D-I-C-O.', 'ADICO (Crawford and Ostrom 1995)'],
], 'Each card: the everyday words first, what they mean, and the word Ostrom used.');
{
  const s = content('No "or else", no rule', 'Sentences come in three strengths. In real bylaws the "or else" is usually missing, which tells you what will actually happen: people will drift away from it.');
  const L = [['A rule', 'It has an "or else".', '"...or else they lose watering for a week."', '2E6B45', 'Ostrom: rule'], ['An expectation', 'Must or should, but no "or else".', '"Gardeners should keep paths clear."', 'C9822A', 'Ostrom: norm'], ['A habit', "No must, no 'or else'. Just what people do.", '"We water early in the morning."', '6B5B95', 'Ostrom: shared strategy']];
  L.forEach(([h, d, ex, col, ow], i) => {
    const y = 1.65 + i * 1.6;
    s.addText(h, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.08, x: 0.6, y, w: 3.6, h: 1.35, fill: { color: col }, color: 'FFFFFF', fontSize: 20, bold: true, align: 'center', valign: 'middle', margin: 4 });
    s.addText([{ text: d, options: { fontSize: 17, breakLine: true, color: C.text1 } }, { text: ex, options: { fontSize: 16, italic: true, color: '3E4A42', breakLine: true } }, { text: ow, options: { fontSize: 12, italic: true, color: '6B7A70' } }], { x: 4.45, y: y + 0.05, w: 8.2, h: 1.3, valign: 'middle', isTextBox: true, margin: 0 });
  });
  para(s, 'Habits are as close as writing gets to "what we all take for granted" from step 4.', { x: 0.6, y: 6.5, w: 12.1, h: 0.4, fontSize: 15, italic: true, color: C.accent1 });
}
{
  const s = content('What reading a rule this closely turns up', 'Three gaps the questions find that a quick read misses. Each connects one sentence back to what lasting groups do.');
  const F = [
    ['Things nobody created', 'A rule about "gardeners", but nothing says who counts as a gardener. A rule about "the tank", but nothing says which tank.', "1: we know who's in, and what's ours"],
    ['Penalties nobody carries out', 'Follow the "or else": who applies it? What makes that their job? Who do they answer to?', '4 and 5: keeping an eye out; a word first'],
    ['Triggers nobody checks', '"When the tank is below half" assumes someone reads the tank. If nothing makes it anyone\'s job, the rule never kicks in.', '4: keeping an eye on the thing itself'],
  ];
  F.forEach(([h, b, p], i) => {
    const x = 0.6 + i * 4.1;
    card(s, x, 1.65, 3.9, 3.9, h, b, { headSize: 18, bodySize: 16 });
    s.addText(p, { x, y: 5.7, w: 3.9, h: 0.6, fontSize: 14, bold: true, color: C.accent2, isTextBox: true, margin: 0 });
  });
}

// ═════════════════════════════════════════════════════════════════════════
// 9 · DO I DO MY SHARE?
sect(9, 'Do I do my share?', 'The last step: one person, one moment. I pitch in if I trust the others will too.', "Step 9, the smallest scale. Rules matter, but people pitch in when they trust others will too. Start from a group project.");
known('Think of a group project, or the office coffee fund', ['The coffee fund', 'You put in your dollar if you think the others do. Once you notice people drinking without paying, you stop paying too. When everyone can see the jar and knows who paid, it keeps going for years.'], [
  'People will pitch in, but not to be the only one.',
  'Whether I pitch in depends on whether I trust you will.',
  'Trust grows from what we can see of each other.',
  'Good results build trust; bad ones wear it down.',
], "Everyone has been in this spot. Ostrom's Figure 5 draws exactly this.");
diagram('I do my share when I trust you will too', 'fig5-trust-and-cooperation.png', 'Ostrom 2010, Figure 5, from Poteete, Janssen and Ostrom 2010', [
  'Left: the wider setting and the small details of the moment.',
  'They shape what people learn about each other.',
  'That builds trust (or wears it down) that others will do their share.',
  'Trust means pitching in; pitching in pays off for everyone.',
  'Dashed loop: good results teach trust, bad results teach distrust.',
], "Ostrom's Figure 5. People are not the pure money-grubbers of older economics: they learn and they pick up shared habits. But they will not keep pitching in if they think others won't. Marc's question from step 6, 'Is it worth the effort and risk?', is answered here.");
words('Reading the picture, in everyday words', [
  ["When what's good for me is bad for us", 'Watering extra in a drought: fine for my tomatoes, bad for the garden.', 'social dilemma'],
  ['The big picture', 'Step 1: the shared thing, the people, the rules, the wider world.', 'broader contextual variables'],
  ['The small details of the moment', 'Can we talk? Do we know who did what? Next slide.', 'microsituational variables'],
  ['People who learn and pick up habits', 'Not pure calculators. We learn from what happens and take on shared expectations.', 'learning and norm-adopting individuals'],
  ['Someone who does their share', 'I pitch in if you pitch in.', 'reciprocator'],
  ['How sure I am the others will do their share', 'The trust in the middle of the picture.', 'levels of trust that other participants are reciprocators'],
  ['How much we pitch in', 'How much people actually work together.', 'levels of cooperation'],
  ['What we all get out of it', "What everyone gains, after what it cost.", 'net benefits'],
], 'Each card: the everyday words first, what they mean, and the word Ostrom used.');
{
  const s = content('Six things that make trust possible', "Ostrom's six, from experiments and real places (lecture pp. 661-662). The link to the eight things lasting groups do (step 7) is our reading, not hers: it shows how house rules build trust.");
  const S6 = [
    ['We can talk, face to face', 'Faces and tone tell us who to trust.', 'Lasting groups 3, 6', 'communication'],
    ['We know who has done what', 'A track record makes pitching in safer.', 'Lasting groups 4', 'reputations known'],
    ['My part clearly matters', 'I can see my share made a difference.', 'Lasting groups 2', 'high marginal per capita return'],
    ['I can walk away', "Nobody's stuck being the only one still trying.", 'Lasting groups 1', 'entry and exit'],
    ["We'll be here a long time", 'Pitching in pays more over years than weeks.', 'Lasting groups 7', 'long time horizon'],
    ['We made our own penalties', "Penalties we agreed to are rarely needed; ones forced on us backfire.", 'Lasting groups 5, 3', 'agreed-upon sanctioning'],
  ];
  S6.forEach(([h, b, p, ow], i) => {
    const x = 0.6 + (i % 3) * 4.1, y = 1.6 + Math.floor(i / 3) * 2.65;
    card(s, x, y, 3.9, 2.45, h, b, { headSize: 17, bodySize: 15, foot: `Ostrom's words: ${ow}` });
    s.addText(p, { x: x + 0.15, y: y + 2.0, w: 3.6, h: 0.32, fontSize: 13, bold: true, color: C.accent2, isTextBox: true, margin: 0 });
  });
}
{
  const s = content('What a neighborhood can change this month', "You can't rewrite who sets the rules this month. You can change these six small things now, and they are where trust starts.");
  const M = [
    ['Meet in person,', 'regularly, with everyone who shares the thing. Not only the organizers.'],
    ['Keep a record people agree to,', 'of who did what. Kept with them, never about them behind their backs.'],
    ['Make contributions visible:', 'a simple chart of tank levels or work hours shows each person their share mattered.'],
    ['Let people leave easily,', 'and take their own records with them. Free to leave makes staying a choice.'],
    ['Plan for years, not weeks:', 'secure the lease; write down how the rules can change.'],
    ['Write your own penalties,', 'together, starting small. Agreed penalties are the ones that rarely need using.'],
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
  const s = content('Zooming back out', 'The nine steps are one picture seen from different distances. A problem noticed at one step is often fixed at another.');
  const lines = ['What is around the thing decides what is possible.', 'Whether it runs out, and whether we can keep people out, decides the trouble.', "The stuff, the people and how things really work shape every get-together.", 'Each layer sets the rules for the one below.', 'Every get-together has the same seven moving parts.', 'Seven kinds of house rule shape those parts.', 'Lasting groups do eight things.', 'Every rule has the same few parts; look for the missing "or else".', 'I do my share when I trust you will.'];
  RUNGS.forEach((r, i) => {
    const y = 1.55 + i * 0.58;
    s.addText(String(i + 1), { shape: pres.shapes.OVAL, x: 0.6, y, w: 0.45, h: 0.45, fill: { color: C.accent1 }, color: 'FFFFFF', fontSize: 14, bold: true, align: 'center', valign: 'middle', margin: 0 });
    s.addText([{ text: r + (r.endsWith('?') ? '  ' : ':  '), options: { bold: true, color: C.text2 } }, { text: lines[i], options: { color: C.text1 } }], { x: 1.25, y, w: 11.4, h: 0.45, fontSize: 17, valign: 'middle', isTextBox: true, margin: 0 });
  });
}
{
  const s = content('Questions to take to your group', 'One question per step. Start anywhere; most groups start with the last one.');
  const Q = ['What is around the thing we share?', 'Does it run out? Can we keep people out?', 'Where do we really meet and decide?', 'Who decides who decides? Is anyone missing a seat?', 'What roles are there, and what does each know?', 'Which of our rules are written down, and which are just habits?', 'Which of the eight are we missing?', 'Which of our rules has no "or else"?', 'What would make each of us surer the others will do their share?'];
  Q.forEach((q, i) => card(s, 0.6 + (i % 3) * 4.1, 1.55 + Math.floor(i / 3) * 1.75, 3.9, 1.6, `${i + 1}`, q, { headSize: 16, bodySize: 16, headColor: C.accent2 }));
}
words('Everyday words, and Ostrom\'s', [
  ['Can run out, hard to fence off', '', 'common-pool resource'],
  ['Deciding who sets the house rules', '', 'constitutional'],
  ['Doing the work', '', 'operational'],
  ['Everyone gets it, helped or not', '', 'public good'],
  ['Groups within groups', '', 'nested enterprises'],
  ['How a rule is put together', '', 'Institutional Grammar; ADICO'],
  ['How things really work here', '', 'rules-in-use'],
  ['How we decide', '', 'aggregation rules'],
  ['How we judge whether it worked', '', 'evaluative criteria'],
  ['Keeping an eye out', '', 'monitoring'],
  ['Members only', '', 'toll (club) good'],
  ['The people and the place, together', '', 'social-ecological system'],
  ['Roles', '', 'positions'],
  ['Setting the house rules', '', 'collective choice'],
  ['The small details of the moment', '', 'microsituational variables'],
  ['Someone who does their share', '', 'reciprocator'],
  ['The stuff', '', 'biophysical conditions'],
  ['Taking from it / putting back into it', '', 'appropriation / provision'],
  ['The ways we do things here', '', 'institution'],
  ['What lasting groups do', '', 'design principles'],
  ['What we all take for granted', '', 'metaconstitutional'],
  ['What\'s on the table', '', 'scope rules'],
  ['Where we meet and choose', '', 'action situation'],
  ['A word first, then step up', '', 'graduated sanctions'],
], 'Alphabetical by the everyday words, with the word Ostrom used.', null, 12);
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
  s.addNotes("Diagrams: the RCN Graph Tool drawings in docs/ostrom-nobel/, rebuilt from the lecture figures with Marc's annotations. The layers panel, the everyday examples and the Elm Street garden are additions, not Ostrom's.\n\n" + ATTR);
}

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log('wrote', OUT);
})();
