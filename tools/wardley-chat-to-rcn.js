#!/usr/bin/env node
'use strict';
/*
 * wardley-chat-to-rcn.js — turn a Wardley map written by Claude Chat, or
 * exported by the Wardley Map Generator, into RCN Graph Tool native JSON.
 *
 * Two input shapes are accepted:
 *   { title, query, components, dependencies }     bare — what an LLM writes
 *   { aiOriginal, userEdited }                     the generator's export
 *
 * THE AXIS IS THE WHOLE PROBLEM. Those files carry x as 0–1 with no statement
 * of which end is which, and the two conventions in play run opposite ways:
 *
 *   commodity-right   x=1 is Commodity      standard Wardley, what Chat writes
 *   genesis-right     x=1 is Genesis        this generator's internal format
 *
 * Guess wrong and the map comes out mirrored — every commodity sitting in
 * Genesis — which looks entirely deliberate and is completely wrong. So the
 * direction is declared, never inferred. A generator export is known by its
 * wrapper; anything else must be told with --axis.
 *
 * Output is the RCN convention throughout: evolution 0=Genesis → 1=Commodity,
 * visibility 1=visible to the user, with x/y derived to match the tool's grid.
 *
 * Usage:
 *   node wardley-chat-to-rcn.js map.json --axis commodity-right
 *   node wardley-chat-to-rcn.js map.json --axis genesis-right -o out.json
 *   node wardley-chat-to-rcn.js generator-export.json          (axis implied)
 *
 * Exit 0 = wrote a file, 2 = bad input or undeclared axis.
 */
var fs = require('fs');
var path = require('path');

// Must match graph-tool-v22.html: WM_PAD 60, WM_CW 900, WM_CH 700.
var X1 = 60, W = 780, Y1 = 60, H = 580;
var AXES = ['commodity-right', 'genesis-right'];

function clamp01(v) { v = +v; return !isFinite(v) ? 0 : v < 0 ? 0 : v > 1 ? 1 : v; }
function r3(v) { return +v.toFixed(3); }
function evoX(ev) { return +(X1 + ev * W).toFixed(1); }
function visY(vis) { return +(Y1 + (1 - vis) * H).toFixed(1); }

function slugIds(components) {
  var used = {}, map = {};
  components.forEach(function (c) {
    var base = String(c.name || 'node').toLowerCase()
      .replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'node';
    var id = base, n = 2;
    while (used[id]) { id = base + '_' + n; n++; }
    used[id] = true; map[c.name] = id;
  });
  return map;
}

function convert(src, axis, sourceName) {
  var components = Array.isArray(src.components) ? src.components : [];
  var deps = Array.isArray(src.dependencies) ? src.dependencies : [];
  var ids = slugIds(components);

  var nodes = components.map(function (c) {
    var ev = clamp01(axis === 'genesis-right' ? 1 - (+c.x) : +c.x);
    var vis = clamp01(+c.y);
    return {
      id: ids[c.name], label: c.name || 'Node',
      x: evoX(ev), y: visY(vis), w: 150, h: 60,
      shape: 'rect',
      color: c.color || '#DBEAFE',
      borderColor: '#000000', borderWidth: 2,
      fontColor: '#000000', fontSize: 12, borderDash: 'solid',
      evolution: r3(ev), visibility: r3(vis),
      note: c.comment || '',
      extraLabels: [], props: {}
    };
  });

  var edges = [], i = 1, dropped = [];
  deps.forEach(function (d) {
    var s = ids[d[0]], t = ids[d[1]];
    if (!s || !t) { dropped.push(d.join(' → ')); return; }
    edges.push({
      id: 'e' + i++, src: s, tgt: t, label: '',
      color: '#000000', width: 2, fontSize: 10, curved: false,
      polarity: 'none', delay: false, dash: 'solid', note: '',
      traces: [], props: {}
    });
  });

  var note = [];
  if (src.query) note.push(src.query);
  note.push('Converted from ' + sourceName + ' by wardley-chat-to-rcn.js on ' +
    new Date().toISOString().slice(0, 10) + '.');
  note.push('Source axis: ' + axis + '. Stored in RCN convention — evolution 0=Genesis to 1=Commodity, visibility 1=visible.');

  return {
    doc: {
      version: '1.0', mode: 'wardley',
      modelName: src.title || 'Wardley Map',
      modelNote: note.join('\n\n'),
      canvasBg: '#ffffff', graphAttrs: {}, cldLoopNames: {},
      legendEntries: [], legendVisible: false, legendCollapsed: false,
      customSymbols: [], nodes: nodes, edges: edges, lines: [], metaEdges: []
    },
    dropped: dropped
  };
}

var args = process.argv.slice(2);
function flag(name) { var i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; }
var axis = flag('--axis');
var outFile = flag('-o') || flag('--out');
var file = args.filter(function (a, i) {
  if (a.charAt(0) === '-') return false;
  var prev = args[i - 1];
  return prev !== '--axis' && prev !== '-o' && prev !== '--out';
})[0];

if (!file) {
  console.error('usage: node wardley-chat-to-rcn.js <map.json> [--axis commodity-right|genesis-right] [-o out.json]');
  process.exit(2);
}

var src;
try { src = JSON.parse(fs.readFileSync(file, 'utf8')); }
catch (e) { console.error('Invalid JSON: ' + e.message); process.exit(2); }

var sourceName = path.basename(file), inner = src, implied = null;
if (src.userEdited || src.aiOriginal) {
  inner = src.userEdited || src.aiOriginal;
  implied = 'genesis-right';
  sourceName += ' (Wardley Map Generator export)';
}
if (!Array.isArray(inner.components)) {
  console.error('No components array. Expected {title, query, components, dependencies} or a generator export.');
  process.exit(2);
}

if (axis && AXES.indexOf(axis) < 0) {
  console.error('Unknown --axis "' + axis + '". Use commodity-right or genesis-right.');
  process.exit(2);
}
if (!axis) {
  if (implied) {
    axis = implied;
    console.log('Axis: ' + axis + ' (implied — this is a generator export).');
  } else {
    console.error('\nThis file does not say which way its evolution axis runs, and guessing mirrors the map.\n');
    console.error('  --axis commodity-right   x=1 means Commodity. Standard Wardley. What Claude Chat writes.');
    console.error('  --axis genesis-right     x=1 means Genesis. The Wardley Map Generator\'s internal format.\n');
    console.error('Check one component you are sure about. In a bicycle map, if "Global Container Shipping"');
    console.error('(pure commodity) has the HIGHEST x, the file is commodity-right.\n');
    process.exit(2);
  }
}

var result = convert(inner, axis, sourceName);
var out = outFile || file.replace(/\.json$/i, '') + '-rcn.json';
fs.writeFileSync(out, JSON.stringify(result.doc, null, 2));

console.log('Wrote ' + out);
console.log('  ' + result.doc.nodes.length + ' nodes, ' + result.doc.edges.length + ' edges, axis ' + axis);
result.dropped.forEach(function (d) { console.log('  DROPPED dependency (name matches no component): ' + d); });

// Sanity read-back, in the user's own terms: name the two extremes so a
// mirrored map is caught here rather than three steps later on a screen.
var byEv = result.doc.nodes.slice().sort(function (a, b) { return a.evolution - b.evolution; });
if (byEv.length) {
  console.log('\nCheck the axis landed right:');
  console.log('  most Genesis (leftmost):   ' + byEv[0].label + '  (evolution ' + byEv[0].evolution + ')');
  console.log('  most Commodity (rightmost): ' + byEv[byEv.length - 1].label + '  (evolution ' + byEv[byEv.length - 1].evolution + ')');
  console.log('If those are backwards, re-run with the other --axis.');
}
console.log('\nNext: node validate-rcn-graph.js ' + out);
