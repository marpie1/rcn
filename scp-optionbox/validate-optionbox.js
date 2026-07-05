#!/usr/bin/env node
// validate-optionbox.js — validates an option box JSON file against schema rules
// Usage: node validate-optionbox.js <file.json>

const fs = require('fs');

const file = process.argv[2];
if (!file) {
  console.error('Usage: node validate-optionbox.js <file.json>');
  process.exit(1);
}

let data;
try {
  data = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch (e) {
  console.error('✗ [ERROR] JSON parse failed:', e.message);
  process.exit(1);
}

const issues = [];
const err  = (msg) => issues.push({ level: 'error', msg });
const warn = (msg) => issues.push({ level: 'warn',  msg });

// ── decision ──────────────────────────────────────────────────────────────────
const d = data.decision;
if (!d) {
  err('Missing required field: decision');
} else {
  if (!d.problem)       err('decision.problem is required');
  if (!d.question)      err('decision.question is required');
  if (!d.time_horizon)  err('decision.time_horizon is required');
  if (typeof d.denominator !== 'number' || d.denominator < 1)
    err('decision.denominator must be a positive number');
  if (d.pretest_probability !== null && d.pretest_probability !== undefined) {
    if (typeof d.pretest_probability !== 'number' || d.pretest_probability < 0 || d.pretest_probability > 1)
      err('decision.pretest_probability must be null or a number between 0 and 1');
  }
}

const denom = d && d.denominator;

// ── options ───────────────────────────────────────────────────────────────────
if (!Array.isArray(data.options) || data.options.length === 0) {
  err('options must be a non-empty array');
} else {
  const validTypes = ['drug', 'test', 'procedure', 'watchful_waiting'];
  const hasWatchful = data.options.some(o => o.type === 'watchful_waiting');
  if (!hasWatchful)
    warn('No watchful_waiting option — required unless clinically incoherent (add it or document why omitted)');

  for (const [i, opt] of data.options.entries()) {
    const p = `options[${i}] ("${opt.id || '?'}")`;

    if (!opt.id)    err(`${p}: id is required`);
    if (!opt.label) err(`${p}: label is required`);
    if (!opt.type)  err(`${p}: type is required`);
    else if (!validTypes.includes(opt.type))
      err(`${p}: type must be one of: ${validTypes.join(', ')}`);

    if (opt.type === 'drug' && !opt.rxnorm)
      warn(`${p}: drug option has no rxnorm (RxCUI); needed for Phase 2 openFDA lookup`);

    if (!opt.burden) warn(`${p}: no burden field`);
    if (!opt.unknowns || opt.unknowns.length === 0)
      warn(`${p}: no unknowns — every option should state what is not known`);

    // benefits
    for (const [j, b] of (opt.benefits || []).entries()) {
      validateOutcome(b, `${p}.benefits[${j}]`, 'benefit');
    }

    // harms
    for (const [j, h] of (opt.harms || []).entries()) {
      validateOutcome(h, `${p}.harms[${j}]`, 'harm');
      if (!h.rac) warn(`${p}.harms[${j}]: no RAC cell — every harm should have one`);
    }
  }
}

function validateOutcome(o, prefix, type) {
  if (!o.outcome) err(`${prefix}: outcome is required`);

  if (typeof o.with_option !== 'number')    err(`${prefix}: with_option must be a number`);
  if (typeof o.without_option !== 'number') err(`${prefix}: without_option must be a number`);

  if (typeof o.with_option === 'number' && typeof o.without_option === 'number') {
    if (o.with_option < 0 || o.without_option < 0)
      err(`${prefix}: values cannot be negative`);
    if (denom) {
      if (o.with_option > denom)    err(`${prefix}: with_option (${o.with_option}) exceeds denominator (${denom})`);
      if (o.without_option > denom) err(`${prefix}: without_option (${o.without_option}) exceeds denominator (${denom})`);
    }
    if (type === 'benefit' && o.with_option > o.without_option)
      warn(`${prefix}: with_option > without_option in a benefit row — this looks like a harm`);
    if (type === 'harm' && o.with_option < o.without_option)
      warn(`${prefix}: with_option < without_option in a harm row — this looks like a benefit`);
  }

  if (o.rac) validateRac(o.rac, `${prefix}.rac`);

  if (o.evidence) validateEvidence(o.evidence, `${prefix}.evidence`);
  else warn(`${prefix}: no evidence block`);
}

function validateRac(rac, prefix) {
  const severities = ['I', 'II', 'III', 'IV'];
  const probs      = ['A', 'B', 'C', 'D'];
  if (!severities.includes(rac.severity)) err(`${prefix}.severity must be one of: ${severities.join(', ')}`);
  if (!probs.includes(rac.probability))   err(`${prefix}.probability must be one of: ${probs.join(', ')}`);
  const expectedCode = ({ I: '1', II: '2', III: '3', IV: '4' }[rac.severity] || '?') + rac.probability;
  if (rac.code !== expectedCode) warn(`${prefix}.code '${rac.code}' does not match severity+probability '${expectedCode}'`);
}

function validateEvidence(ev, prefix) {
  const bases  = ['RCT', 'meta-analysis', 'observational', 'label', 'expert'];
  const grades = ['high', 'moderate', 'low', 'very_low'];
  const funds  = ['industry', 'public', 'mixed', 'unknown'];
  if (!bases.includes(ev.basis))   err(`${prefix}.basis must be one of: ${bases.join(', ')}`);
  if (!grades.includes(ev.grade))  err(`${prefix}.grade must be one of: ${grades.join(', ')}`);
  if (!ev.source)                  err(`${prefix}.source is required`);
  if (ev.funding && !funds.includes(ev.funding))
    err(`${prefix}.funding must be one of: ${funds.join(', ')}`);
}

// ── report ────────────────────────────────────────────────────────────────────
if (issues.length === 0) {
  console.log(`✓  ${file} — valid option box`);
  process.exit(0);
}

for (const issue of issues) {
  const mark = issue.level === 'error' ? '✗ [ERROR]' : '⚠ [WARN] ';
  console.log(`${mark} ${issue.msg}`);
}

const errorCount = issues.filter(i => i.level === 'error').length;
const warnCount  = issues.filter(i => i.level === 'warn').length;
console.log(`\n${errorCount} error(s), ${warnCount} warning(s) in ${file}`);
if (errorCount > 0) process.exit(1);
