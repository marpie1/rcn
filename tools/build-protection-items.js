#!/usr/bin/env node
// Builds tools/protection-survey-items.json from docs/neighborhood-protection-survey.md,
// the items file that evsm-svg-v3.html's "Extra Items → Load items" reads.
// The markdown is the source; do not hand-edit the JSON.
const fs = require('fs');
const path = require('path');
const src = path.join(__dirname, '..', 'docs', 'neighborhood-protection-survey.md');
const out = path.join(__dirname, 'protection-survey-items.json');
const md = fs.readFileSync(src, 'utf8').split('\n');

const items = [];
let block = null, blockName = null, blockHelp = null, factor = null, factorName = null, help = null, shellDef = null, perFactor = 0;

// response markers embedded in item text → scale
const SCALE_BY_MARKER = [
  [/\*\*Yes \/ No \/ Didn't come up\.?\*\*/i, 'ynd'],
  [/\*\*Yes \/ No \/ Don't know\.?\*\*/i, 'ynk'],
  [/\*\*Yes \/ No\.?\*\*/i, 'yn'],
  [/\*\*Better off.*?\*\*/i, 'd5'],
  [/\*\(free text.*?\)\*/i, 'free'],
];
const DEFAULT_SCALE = { A: 'ynd', B: 'agree4', C: 'agree4', D: 'yn', E: 'free' };

for (const raw of md) {
  const line = raw.trim();
  let m;
  if ((m = line.match(/^## Block ([A-E]) — (.+)$/))) {
    block = m[1]; blockName = m[2].replace(/\s*\(.*\)$/, ''); blockHelp = null; factor = null; factorName = null; help = null; shellDef = null; perFactor = 0;
    continue;
  }
  if ((m = line.match(/^### A\d+\. ([A-Z]{2}) — (.+)$/))) {
    factor = m[1]; factorName = m[2]; help = null; shellDef = null; perFactor = 0;
    continue;
  }
  if ((m = line.match(/^\*Shell: (.+)\*$/))) { shellDef = m[1]; continue; }
  if ((m = line.match(/^\*Here: (.+)\*$/))) { help = m[1]; continue; }
  if ((m = line.match(/^\*What it measures: (.+)\*$/))) { blockHelp = m[1].charAt(0).toUpperCase() + m[1].slice(1); continue; }
  if ((m = line.match(/^([A-Z]{1,2}-\d+)\. (.+)$/)) && block) {
    let text = m[2];
    let scale = DEFAULT_SCALE[block];
    for (const [re, sc] of SCALE_BY_MARKER) if (re.test(text)) { scale = sc; text = text.replace(re, ''); break; }
    text = text.replace(/\s*\*\*[^*]*\*\*\s*$/, '').replace(/\s+/g, ' ').trim();
    const tag = text.match(/^\((teamness|culture|people)\)\s*/);
    if (tag) text = text.slice(tag[0].length);
    perFactor++;
    const it = { id: m[1], surveyName: 'Protection Survey', block, blockName, text, scale };
    if (factor) { it.factor = factor; it.factorName = factorName; it.core = perFactor <= 2; }
    if (help) it.help = help;               // the neighborhood definition, on every item of the factor
    if (shellDef) it.shellDef = shellDef;   // Shell's name and definition, for anyone trained on Tripod
    if (blockHelp) it.blockHelp = blockHelp;
    if (tag) it.component = tag[1];
    if (block === 'B') it.help = '"The outside" means the city and county, the funders, and the institutions and professionals that provide services here: schools, clinics, agencies, churches as service providers.';
    items.push(it);
  }
}

const worlds = [
  'Employed by an institution that serves the neighborhood',
  'Receives services from one of those institutions',
  'Funder, municipal staff or elected',
  'Member of an ME or a between-institution project',
  'Holds a small group together',
  'Convener or Platform',
];

const payload = { surveyName: 'Protection Survey', source: 'docs/neighborhood-protection-survey.md', builtAt: new Date().toISOString().slice(0, 10), worlds, items };
fs.writeFileSync(out, JSON.stringify(payload, null, 2) + '\n');
const byBlock = items.reduce((a, i) => ((a[i.block] = (a[i.block] || 0) + 1), a), {});
console.log(`${items.length} items → ${path.relative(process.cwd(), out)}`, byBlock);
