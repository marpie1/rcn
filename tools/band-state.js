#!/usr/bin/env node
'use strict';
/*
 * band-state.js — the standing reminder. Where does RCN sit in each of Ostrom's
 * three arenas, and what is unanswered in each.
 *
 *     node tools/band-state.js
 *     node tools/band-state.js --brief     (the three-line version)
 *
 * WHY THIS EXISTS. Marc's route into Ostrom was Meadows' leverage points, and
 * the two frameworks are the same list cut at different places:
 *
 *   CONSTITUTIONAL     Meadows 1-4    paradigm, goals, the power to self-organise
 *   COLLECTIVE-CHOICE  Meadows 5-6    rules, and who may see what
 *   OPERATIONAL        Meadows 7-12   loop gains, delays, stocks, buffers, parameters
 *
 * Meadows' #4 — "power to add, change, evolve or self-organize system structure"
 * — IS Ostrom's constitutional level, stated in system-dynamics language. And
 * Meadows' #12, "constants and parameters", is a price at a till. The list runs
 * top to bottom from most leverage to least, which means the operational band is
 * where nearly all the effort goes and the least leverage lives.
 *
 * Ostrom cuts one distinction Meadows does not have: making a rule is
 * collective choice, deciding WHO MAY MAKE RULES is constitutional. Meadows #5
 * covers both. That distinction is the whole reason for three bands and not two.
 *
 * Reads the drawings, not the database, so it runs with nothing else up.
 */
var fs = require('fs'), path = require('path');
var DIR = __dirname;
var BRIEF = process.argv.indexOf('--brief') >= 0;

var BANDS = [
  ['constitutional',    'who may change the structure',            'Meadows 1-4'],
  ['collective-choice', 'what the rules and information flows are', 'Meadows 5-6'],
  ['operational',       'the parameters, delays, stocks and flows', 'Meadows 7-12'],
];

function graphs() {
  return fs.readdirSync(DIR).filter(function (f) { return /\.json$/.test(f); })
    .map(function (f) {
      try { var g = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')); } catch (e) { return null; }
      if (!g || !Array.isArray(g.nodes) || !Array.isArray(g.edges)) return null;
      g._file = f; return g;
    }).filter(Boolean);
}

var all = graphs();
var vna = all.filter(function (g) { return (g.graphAttrs || {}).method === 'vna'; });
var con = all.filter(function (g) { return (g.graphAttrs || {}).iadLevel === 'constitutional'; });

// constitutional band: read status straight off the legend rows people can see
var STATUS = { lg_settled: 'SETTLED', lg_ethic: 'ORGAN', lg_open: 'OPEN', lg_external: 'NOT OURS' };
var conRows = [];
con.forEach(function (g) {
  g.nodes.forEach(function (n) {
    if (STATUS[n.type]) conRows.push({ s: STATUS[n.type], label: String(n.label).replace(/\s+/g, ' ') });
  });
});

function bandOf(g) { return (g.graphAttrs || {}).iadLevel || 'unspecified'; }
function tx(g) {
  var ids = {}; g.nodes.forEach(function (n) { if (n.type) ids[n.id] = 1; });
  return g.edges.filter(function (e) { return ids[e.src] && ids[e.tgt]; });
}

var ev = { observed: 0, asserted: 0, unset: 0 };
var adopt = { full: 0, partial: 0, none: 0 };
all.forEach(function (g) {
  var d = 0, u = 0;
  g.edges.forEach(function (e) { if ((e.props || {}).evidence) d++; else u++; });
  if (d && !u) adopt.full++; else if (d) adopt.partial++; else adopt.none++;
});
all.forEach(function (g) {
  g.edges.forEach(function (e) {
    var v = (e.props || {}).evidence;
    if (v === undefined) return;   // undeclared drawings are counted under ADOPTION
    if (v === 'observed') ev.observed++; else if (v === 'asserted') ev.asserted++; else ev.unset++;
  });
});

var W = 68;
function rule(ch) { return new Array(W + 1).join(ch || '-'); }

if (BRIEF) {
  var o = conRows.filter(function (r) { return r.s === 'OPEN'; }).length;
  console.log('constitutional  ' + conRows.filter(function(r){return r.s==='SETTLED';}).length +
              ' settled, ' + o + ' OPEN, ' + conRows.filter(function(r){return r.s==='NOT OURS';}).length + ' not ours');
  console.log('collective      ' + vna.filter(function(g){return bandOf(g)==='collective-choice';}).length + ' situations');
  console.log('operational     ' + vna.filter(function(g){return bandOf(g)==='operational';}).length + ' situations');
  console.log('evidence        ' + ev.observed + ' observed / ' + ev.asserted + ' asserted');
  process.exit(0);
}

console.log('\n' + rule('='));
console.log('RCN BAND STATE   ' + new Date().toISOString().slice(0, 10));
console.log(rule('='));

BANDS.forEach(function (b) {
  var name = b[0];
  console.log('\n' + name.toUpperCase());
  console.log('  ' + b[1] + '   [' + b[2] + ']');

  if (name === 'constitutional') {
    ['ORGAN', 'SETTLED', 'OPEN', 'NOT OURS'].forEach(function (s) {
      var rows = conRows.filter(function (r) { return r.s === s; });
      rows.forEach(function (r) { console.log('    ' + s.padEnd(9) + r.label.toLowerCase()); });
    });
    if (!conRows.length) console.log('    (nothing drawn — see iad-constitutional-arena.rcn.json)');
    var open = conRows.filter(function (r) { return r.s === 'OPEN'; }).length;
    if (open) console.log('\n    ' + open + ' unanswered. Highest leverage in the system, and nobody owns them.');
    return;
  }

  var here = vna.filter(function (g) { return bandOf(g) === name; });
  if (!here.length) { console.log('    (no situation declares this level)'); return; }
  here.forEach(function (g) {
    var spans = (g.legendEntries || []).some(function (r) { return r.kind === 'edge' && r.iadLevel && r.iadLevel !== name; });
    console.log('    ' + g._file.replace(/\.rcn\.json|\.json/, '').padEnd(34) +
                String(tx(g).length).padStart(3) + ' transactions' + (spans ? '   (spans levels)' : ''));
  });
});

console.log('\n' + rule());
console.log('EVIDENCE     ' + ev.observed + ' observed  ' + ev.asserted + ' asserted  ' + ev.unset + ' unset   (across every drawing that declares any)');
console.log('ADOPTION     ' + adopt.full + ' drawing(s) fully declare evidence, ' + adopt.partial +
            ' partial, ' + adopt.none + ' none');
if (!ev.observed) console.log('             nothing in any band is measured yet.');
console.log('COMPONENTS   2 of Ostrom\'s 7 working components populated (positions, costs/benefits)');
console.log(rule());
console.log('WHICH BAND AM I IN?');
console.log('  changes a number ................. operational      (least leverage)');
console.log('  changes a rule ................... collective-choice');
console.log('  changes who may change the rule .. constitutional   (most leverage)');
console.log(rule() + '\n');
