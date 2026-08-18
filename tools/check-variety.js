#!/usr/bin/env node
/**
 * check-variety.js — Ashby's Law, applied to method steps.
 *
 *   node tools/check-variety.js
 *
 * THE RULE
 *
 *   A step is legitimate when the order its TOOL PRESUMES does not exceed the
 *   order the SITUATION actually has.
 *
 * This is the Law of Requisite Variety, and Conant-Ashby behind it: every good
 * regulator of a system must be a model of that system. Order and variety are
 * inverse — a tool that presumes more order presumes LESS variety. Stock-and-Flow
 * can only express quantified relations, so pointed at a complex social situation
 * it is a regulator with less variety than the system it is meant to regulate. It
 * cannot absorb it. The output is confident and wrong: garbage dressed in numbers.
 *
 * Under-presuming is never an error. A causal loop diagram of a simple process is
 * merely more variety than the job needs, which costs time, not truth. That is why
 * the fallback rule — when lost, drop back to CLD — is an Ashby move: it RAISES
 * the regulator's variety.
 *
 * Domains, least ordered to most:  chaotic < complex < complicated < simple
 * Sources: `presumes` in catalog.json (from the fills in Marc's "Models for
 * Seeing Systems"), `appliesWhen` in methods.json.
 */

'use strict';
const fs = require('fs');
const path = require('path');
const D = __dirname;

const RANK = { chaotic: 0, complex: 1, complicated: 2, simple: 3 };
const catalog = JSON.parse(fs.readFileSync(path.join(D, 'catalog.json'), 'utf8'));
const methods = JSON.parse(fs.readFileSync(path.join(D, 'methods.json'), 'utf8'));
const tool = Object.fromEntries(catalog.tools.map(t => [t.id, t]));

let checked = 0, flags = [], skipped = [], unclassified = new Set();

for (const m of methods.methods) {
  const domains = m.appliesWhen;
  if (!domains) continue;
  if (domains.includes('any')) { skipped.push(`${m.id} — appliesWhen "any"`); continue; }
  if (domains.includes('disorder')) { skipped.push(`${m.id} — appliesWhen "disorder" (domain not yet known)`); continue; }
  const sit = Math.min(...domains.map(d => RANK[d]).filter(n => n !== undefined));
  for (const [i, s] of (m.steps || []).entries()) {
    if (!s.tool) continue;
    const t = tool[s.tool];
    if (!t) { unclassified.add(`${s.tool} (not in catalog)`); continue; }
    if (!t.presumes) { unclassified.add(s.tool); continue; }
    checked++;
    // a step may declare its own situation: methods descend domains as they proceed
    const stepSit = s.situation && RANK[s.situation] !== undefined ? RANK[s.situation] : sit;
    const stepDomain = s.situation || domains.join('/');
    const p = RANK[t.presumes];
    if (p > stepSit) {
      flags.push({
        method: m.id, step: i + 1, question: s.question, tool: s.tool,
        presumes: t.presumes, situation: stepDomain,
        gated: !!s.gate, gate: s.gate
      });
    }
  }
}

const line = '─'.repeat(72);
console.log(line);
console.log('REQUISITE VARIETY CHECK — does any step reach for a tool above its domain?');
console.log(line);
console.log(`steps checked: ${checked}   flagged: ${flags.length}`);
if (skipped.length) { console.log('\nnot applicable:'); skipped.forEach(s => console.log('  · ' + s)); }
if (unclassified.size) console.log('\ntools with no `presumes` (rule cannot apply): ' + [...unclassified].join(', '));

for (const f of flags) {
  console.log('\n' + line);
  console.log(`${f.method}  step ${f.step}`);
  console.log(`  "${f.question}"`);
  console.log(`  tool ${f.tool} presumes ${f.presumes.toUpperCase()}, situation is ${f.situation.toUpperCase()}`);
  console.log(`  → the model has less variety than the system it is pointed at`);
  if (f.gated) {
    console.log(`  BUT the step is GATED, which is how a method legitimately crosses domains:`);
    console.log(`     "${f.gate.slice(0, 160)}${f.gate.length > 160 ? '…' : ''}"`);
  } else {
    console.log(`  and the step carries NO GATE — nothing forces the order to be established first.`);
  }
}
console.log('\n' + line);
const ungated = flags.filter(f => !f.gated);
console.log(ungated.length
  ? `${ungated.length} ungated crossing(s) — each needs a gate, or the tool is wrong for the step.`
  : flags.length ? 'Every crossing is gated. The methods descend domains deliberately.'
                 : 'No crossings.');
