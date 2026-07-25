#!/usr/bin/env node
'use strict';
/*
 * validate-rcn-graph.js — checks a JSON file against the RCN Graph Tool
 * native v1.0 schema BEFORE it is imported, and refuses to pass the two
 * failures that have bitten us:
 *   1. edges using from/to (the importer reads src/tgt and ignores from/to,
 *      so the edge loads but never renders)
 *   2. nodes missing numeric w/h (autoSize only GROWS w/h, it never
 *      initialises them; undefined w => NaN radius => the shape does not
 *      paint and the node shows as a bare label)
 *
 * Usage:
 *   node validate-rcn-graph.js diagram.json
 *   node validate-rcn-graph.js diagram.json --fix   (writes diagram.fixed.json)
 *
 * Exit code 0 = renders, 1 = will not render, 2 = bad input.
 */
var fs = require('fs');

var SHAPES   = ['rect', 'rounded', 'ellipse', 'diamond', 'hexagon', 'cylinder', 'barrel'];
var POLARITY = ['+', '-', 'none'];
var DASH     = ['solid', 'dashed', 'dotted'];

// Exactly what buildState() emits (graph-tool-v22.html:~4330). Unknown NODE and
// EDGE fields survive a round-trip, because import and export both Object.assign
// over the whole object — but unknown TOP-LEVEL keys are dropped on export with
// no error. That asymmetry cost us a whole `meta` block (title, description,
// author, created, schema version) on 2026-07-25. Keep this list in step with
// buildState.
var TOP_LEVEL = ['version', 'modelName', 'modelNote', 'canvasBg', 'graphAttrs',
                 'cldLoopNames', 'legendEntries', 'legendVisible', 'customSymbols',
                 'nodes', 'edges', 'lines', 'metaEdges'];

function num(v) { return typeof v === 'number' && isFinite(v); }

function validate(doc) {
  var errors = [], warnings = [];
  if (!doc || typeof doc !== 'object') { errors.push('Root is not an object'); return { errors: errors, warnings: warnings }; }
  if (!Array.isArray(doc.nodes)) errors.push('Missing or non-array "nodes"');
  if (!Array.isArray(doc.edges)) errors.push('Missing or non-array "edges" (use [] for none)');
  var nodes = Array.isArray(doc.nodes) ? doc.nodes : [];
  var edges = Array.isArray(doc.edges) ? doc.edges : [];

  // round-trip survival: anything buildState() does not emit is lost on export
  Object.keys(doc).forEach(function (k) {
    if (TOP_LEVEL.indexOf(k) >= 0) return;
    // a meta block already mirrored into modelName/modelNote is fine — it is a
    // source-of-truth copy, not the only copy. Say so rather than crying wolf.
    if (k === 'meta' && doc.modelName && doc.modelNote) {
      warnings.push('top-level "meta": dropped on export, but "modelName" and "modelNote" are set, so nothing is lost. Keeping meta in the source file is fine');
      return;
    }
    var extra = '';
    if (k === 'meta') extra = ' — put the title in "modelName" and the description/author/date in "modelNote", which the tool does keep';
    warnings.push('top-level "' + k + '": the tool does not persist this key. It loads fine, then vanishes the first time anyone exports' + extra);
  });
  if (!doc.modelName) warnings.push('no "modelName": the Model Name field will read "Untitled" and the title is not stored anywhere');

  var ids = {};
  nodes.forEach(function (n, i) {
    var at = 'node[' + i + ']' + (n && n.id ? ' "' + n.id + '"' : '');
    if (!n || typeof n !== 'object') { errors.push(at + ': not an object'); return; }
    if (typeof n.id !== 'string' || !n.id) errors.push(at + ': missing string id');
    else { if (ids[n.id]) errors.push(at + ': duplicate id'); ids[n.id] = true; }
    if (typeof n.label !== 'string') warnings.push(at + ': label missing or non-string');
    if (!num(n.x) || !num(n.y)) errors.push(at + ': x and y must be finite numbers');
    if (!num(n.w) || n.w <= 0) errors.push(at + ': w must be a positive number — missing w gives NaN radius, node renders as a bare label');
    if (!num(n.h) || n.h <= 0) errors.push(at + ': h must be a positive number — missing h gives NaN radius, node renders as a bare label');
    if (n.shape !== undefined && SHAPES.indexOf(n.shape) < 0) {
      if (typeof n.shape === 'number') warnings.push(at + ': shape is the number ' + n.shape + ' — shape is a STRING enum, not a numeric code. Use one of ' + SHAPES.join('|') + ' (default "rounded"). The node still renders, as an ellipse, so this fails silently');
      else warnings.push(at + ': shape "' + n.shape + '" unknown, falls back to ellipse. Use one of ' + SHAPES.join('|'));
    }
  });

  edges.forEach(function (e, i) {
    var at = 'edge[' + i + ']' + (e && e.id ? ' "' + e.id + '"' : '');
    if (!e || typeof e !== 'object') { errors.push(at + ': not an object'); return; }
    if (typeof e.id !== 'string' || !e.id) errors.push(at + ': missing string id');
    if ('from' in e || 'to' in e) errors.push(at + ': uses from/to — tool reads src/tgt only, edge will import but never render. Rename from->src, to->tgt');
    if (typeof e.src !== 'string' || !e.src) errors.push(at + ': missing string src');
    else if (!ids[e.src]) errors.push(at + ': src "' + e.src + '" matches no node id');
    if (typeof e.tgt !== 'string' || !e.tgt) errors.push(at + ': missing string tgt');
    else if (!ids[e.tgt]) errors.push(at + ': tgt "' + e.tgt + '" matches no node id');
    if (e.polarity !== undefined && POLARITY.indexOf(e.polarity) < 0) warnings.push(at + ': polarity "' + e.polarity + '" not in +|-|none');
    if (e.delay !== undefined && typeof e.delay !== 'boolean') warnings.push(at + ': delay should be boolean');
    if (e.curved !== undefined && typeof e.curved !== 'boolean') warnings.push(at + ': curved should be boolean');
    if (e.dash !== undefined && DASH.indexOf(e.dash) < 0) warnings.push(at + ': dash "' + e.dash + '" not in solid|dashed|dotted');
  });

  return { errors: errors, warnings: warnings };
}

function fix(doc) {
  if (doc.version === undefined) doc.version = '1.0';
  // migrate a meta block into the fields the tool actually persists
  if (doc.meta && typeof doc.meta === 'object') {
    if (!doc.modelName && doc.meta.title) doc.modelName = doc.meta.title;
    if (!doc.modelNote) {
      var bits = [doc.meta.description, [doc.meta.version && 'Schema ' + doc.meta.version,
        doc.meta.created && 'created ' + doc.meta.created, doc.meta.author].filter(Boolean).join(' | ')];
      doc.modelNote = bits.filter(Boolean).join('\n\n');
    }
  }
  if (doc.canvasBg === undefined) doc.canvasBg = '#f9f9f7';
  if (!Array.isArray(doc.nodes)) doc.nodes = [];
  if (!Array.isArray(doc.edges)) doc.edges = [];
  doc.lines = Array.isArray(doc.lines) ? doc.lines : [];
  doc.metaEdges = Array.isArray(doc.metaEdges) ? doc.metaEdges : [];
  doc.nodes.forEach(function (n) {
    if (!n || typeof n !== 'object') return;
    if (!num(n.x)) n.x = 0;
    if (!num(n.y)) n.y = 0;
    if (!num(n.w) || n.w <= 0) n.w = 150;
    if (!num(n.h) || n.h <= 0) n.h = 72;
    if (n.shape === undefined) n.shape = 'rounded';
    if (n.color === undefined) n.color = '#ffffff';
    if (n.fontColor === undefined) n.fontColor = '#000000';
    if (n.borderColor === undefined) n.borderColor = '#000000';
    if (n.borderWidth === undefined) n.borderWidth = 1.5;
    if (n.borderDash === undefined) n.borderDash = 'solid';
    if (n.fontSize === undefined) n.fontSize = 12;
    if (n.note === undefined) n.note = '';
    if (!Array.isArray(n.extraLabels)) n.extraLabels = [];
    if (typeof n.props !== 'object' || !n.props) n.props = {};
  });
  doc.edges.forEach(function (e) {
    if (!e || typeof e !== 'object') return;
    if ('from' in e && e.src === undefined) e.src = e.from;
    if ('to' in e && e.tgt === undefined) e.tgt = e.to;
    delete e.from; delete e.to;
    if (e.color === undefined) e.color = '#000000';
    if (e.width === undefined) e.width = 1.5;
    if (e.fontSize === undefined) e.fontSize = 10;
    if (e.curved === undefined) e.curved = false;
    if (e.polarity === undefined) e.polarity = 'none';
    if (e.delay === undefined) e.delay = false;
    if (e.dash === undefined) e.dash = 'solid';
    if (e.note === undefined) e.note = '';
    if (!Array.isArray(e.traces)) e.traces = [];
    if (e.layer === undefined) e.layer = '';
    if (e.label === undefined) e.label = '';
    if (typeof e.props !== 'object' || !e.props) e.props = {};
  });
  return doc;
}

var args = process.argv.slice(2);
var doFix = args.indexOf('--fix') >= 0;
var file = args.filter(function (a) { return a !== '--fix'; })[0];
if (!file) { console.error('usage: node validate-rcn-graph.js <file.json> [--fix]'); process.exit(2); }
var doc;
try { doc = JSON.parse(fs.readFileSync(file, 'utf8')); }
catch (e) { console.error('Invalid JSON: ' + e.message); process.exit(2); }

if (doFix) {
  fix(doc);
  var out = file.replace(/\.json$/, '') + '.fixed.json';
  fs.writeFileSync(out, JSON.stringify(doc, null, 2));
  console.log('Wrote ' + out);
}

var r = validate(doc);
r.warnings.forEach(function (w) { console.log('WARN  ' + w); });
r.errors.forEach(function (e) { console.log('ERROR ' + e); });
if (r.errors.length) { console.log('\nFAIL: ' + r.errors.length + ' error(s), ' + r.warnings.length + ' warning(s)'); process.exit(1); }
console.log('\nOK: renders in RCN Graph Tool (' + (doc.nodes || []).length + ' nodes, ' + (doc.edges || []).length + ' edges). ' + r.warnings.length + ' warning(s).');
