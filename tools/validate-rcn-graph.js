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
 *      paint and the node shows as a bare label). As of 2026-08-11 the tool
 *      defaults these on load, so this is a warning now, not an error — but
 *      write them anyway when the label needs room.
 *
 * It also checks the Rent Band Analysis extension fields (evolution, shadow,
 * pinnedBy, pressure) per Rent-Band-Analysis-Method.md v1.2 Part 5 Step 4.
 *
 * Usage:
 *   node validate-rcn-graph.js diagram.json
 *   node validate-rcn-graph.js diagram.json --fix   (writes diagram.fixed.json)
 *   node validate-rcn-graph.js map.json --cld loops.json   (cross-check pinnedBy)
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
var TOP_LEVEL = ['version', 'mode', 'modelName', 'modelNote', 'canvasBg', 'graphAttrs',
                 'cldLoopNames', 'legendEntries', 'legendVisible', 'legendCollapsed',
                 'customSymbols', 'nodes', 'edges', 'lines', 'metaEdges', 'lopBands'];
var MODES = ['select', 'node', 'edge', 'freeline', 'arrow', 'cld', 'eip', 'nrm',
             'opm', 'sfd', 'lop', 'trace', 'wardley'];

// Linkage of Processes (Deming / API). A half-typed linkage map is the failure
// worth catching: a key process with no owner or no measure is exactly what the
// List of Processes exists to expose, and an untyped linkage exports as
// LINKED_TO and loses what the arrow carried.
var LOP_TYPES = ['purpose', 'leadership', 'redesign', 'supplier', 'process', 'subprocess',
                 'output', 'customer', 'need', 'support', 'measure', 'research'];
var LOP_LINKS = ['flow', 'supplies', 'serves', 'supports', 'informs', 'requires', 'guides'];

function num(v) { return typeof v === 'number' && isFinite(v); }
function unit(v) { return num(v) && v >= 0 && v <= 1; }

// Rent Band Analysis fields (Rent-Band-Analysis-Method.md v1.2 Part 5 Step 4).
// Every one is optional; the point of these checks is that a HALF-filled RBA
// node is worse than none — a shadow with no basis is decoration, and a rent
// figure with no as-of date loses the first argument it is used in.
function checkRBA(n, at, errors, warnings, loopNames) {
  var isRBA = n.evolution !== undefined || n.shadow !== undefined ||
              n.pinnedBy !== undefined || n.pressure !== undefined;
  if (!isRBA) return;

  if (n.evolution !== undefined && !unit(n.evolution)) errors.push(at + ': evolution must be a number in [0,1] (0=Genesis, 1=Commodity)');
  if (n.visibility !== undefined && !unit(n.visibility)) errors.push(at + ': visibility must be a number in [0,1] (0=invisible, 1=visible to the user)');

  if (n.shadow !== undefined) {
    var s = n.shadow;
    if (!s || typeof s !== 'object' || Array.isArray(s)) { errors.push(at + ': shadow must be an object'); }
    else {
      if (!unit(s.evolution)) errors.push(at + ': shadow.evolution must be a number in [0,1] — required whenever shadow is present, it is where the band ends');
      if (!num(n.evolution)) errors.push(at + ': has shadow but no numeric evolution — the band needs both ends, and the shadow will not render');
      if (typeof s.basis !== 'string' || !s.basis.trim()) warnings.push(at + ': shadow has no basis — the shadow is an argued inference, not decoration. Record the comparables it rests on');
      if (unit(s.evolution) && unit(n.evolution) && s.evolution <= n.evolution) warnings.push(at + ': shadow.evolution (' + s.evolution + ') is not right of evolution (' + n.evolution + ') — a shadow at or left of the node is almost certainly an entry error, or the two axis conventions got crossed');
      if (s.rent !== undefined) {
        var r = s.rent;
        if (!r || typeof r !== 'object' || Array.isArray(r)) errors.push(at + ': shadow.rent must be an object');
        else {
          if (typeof r.label !== 'string' || !r.label.trim()) errors.push(at + ': shadow.rent.label is required — it is the figure drawn on the band');
          if (typeof r.basis !== 'string' || !r.basis.trim()) errors.push(at + ': shadow.rent.basis is required — a rent figure with no source cannot survive being contested');
          if (!r.asOf) warnings.push(at + ': shadow.rent has no asOf — rent figures go stale, and the band must always answer "says who, and when"');
        }
      }
    }
  }

  if (n.pinnedBy !== undefined) {
    if (!Array.isArray(n.pinnedBy)) errors.push(at + ': pinnedBy must be an array of loop references');
    else {
      n.pinnedBy.forEach(function (p) {
        if (typeof p !== 'string' || !p.trim()) { errors.push(at + ': pinnedBy entries must be non-empty strings'); return; }
        if (/^[RB]\d+$/.test(p.trim())) warnings.push(at + ': pinnedBy "' + p + '" is a bare R#/B# label. Those are assigned in loop-DETECTION order and renumber whenever the CLD is edited — reference the loop NAME instead');
        if (loopNames && loopNames.length && loopNames.indexOf(p.trim()) < 0) warnings.push(at + ': pinnedBy "' + p + '" matches no loop name in the supplied CLD');
      });
      if (!n.pinnedBy.length && n.shadow) warnings.push(at + ': has a shadow but an empty pinnedBy — a pin without a mechanism is an unfinished analysis. Which CLD loop holds it?');
    }
  }

  if (n.pressure !== undefined && n.pressure !== true) {
    var p = n.pressure;
    if (!p || typeof p !== 'object' || Array.isArray(p)) { errors.push(at + ': pressure must be an object, or the legacy boolean true'); }
    else {
      if (p.forces !== undefined && !Array.isArray(p.forces)) errors.push(at + ': pressure.forces must be an array');
      if (p.resistors !== undefined && p.resistance === undefined) warnings.push(at + ': pressure.resistors — the tool reads it, but "resistance" is the canonical spelling in the method. Rename it before the two drift apart');
      var res = p.resistance || p.resistors;
      if (res !== undefined && !Array.isArray(res)) errors.push(at + ': pressure.resistance must be an array');
      else if (Array.isArray(res)) {
        var pins = Array.isArray(n.pinnedBy) ? n.pinnedBy : [];
        res.forEach(function (r, ri) {
          var rat = at + ' pressure.resistance[' + ri + ']';
          if (!r || typeof r !== 'object') { errors.push(rat + ': not an object'); return; }
          if (typeof r.mechanism !== 'string' || !r.mechanism.trim()) warnings.push(rat + ': no mechanism named — the arrow claims something is actively resisting, so say what');
          if (!r.loop) warnings.push(rat + ': no loop reference — every resisting mechanism should point at the CLD loop that runs it');
          else if (pins.length && pins.indexOf(r.loop) < 0) warnings.push(rat + ': loop "' + r.loop + '" is not in this node\'s pinnedBy');
          if (!r.annualCost) warnings.push(rat + ': no annualCost — the Tullock cost is the fragility gauge; a dam whose maintenance grows faster than its rent is near failure');
        });
      }
    }
  }

  if (n.pressure !== undefined && n.shadow === undefined) warnings.push(at + ': has pressure but no shadow — the pressure arrow is drawn inside the rent band, so with no band it will not render');
}

function validate(doc, cld) {
  var errors = [], warnings = [], notes = [];
  if (!doc || typeof doc !== 'object') { errors.push('Root is not an object'); return { errors: errors, warnings: warnings, notes: notes }; }
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
  if (doc.mode !== undefined && MODES.indexOf(doc.mode) < 0) warnings.push('mode "' + doc.mode + '" is not one of ' + MODES.join('|') + ' — the tool will ignore it and open in whatever mode it was last in');

  // Loop names for pinnedBy cross-checking: the CLD passed with --cld if there
  // is one, else this file's own. cldLoopNames is keyed by sorted node ids; the
  // VALUES are the names a pin should reference.
  var declaredMode = doc.mode || (doc.meta && doc.meta.mode);
  var loopSrc = (cld && cld.cldLoopNames) || doc.cldLoopNames || null;
  var loopNames = loopSrc ? Object.keys(loopSrc).map(function (k) { return loopSrc[k]; }).filter(Boolean) : null;

  var rbaNodes = 0, derived = 0, noSize = 0;
  var lopNodes = 0, lopUnnumbered = 0, lopNoOwner = 0, lopNoMeasure = 0, lopUntypedEdges = 0;
  var ids = {};
  nodes.forEach(function (n, i) {
    var at = 'node[' + i + ']' + (n && n.id ? ' "' + n.id + '"' : '');
    if (!n || typeof n !== 'object') { errors.push(at + ': not an object'); return; }
    if (typeof n.id !== 'string' || !n.id) errors.push(at + ': missing string id');
    else { if (ids[n.id]) errors.push(at + ': duplicate id'); ids[n.id] = true; }
    if (typeof n.label !== 'string') warnings.push(at + ': label missing or non-string');
    // In a Wardley map evolution/visibility ARE the position — the tool derives
    // x/y from them on load. Writing both is allowed; writing only the pair the
    // analysis cares about is better, and is what we ask Chat for.
    var derivable = declaredMode === 'wardley' && unit(n.evolution) && unit(n.visibility);
    if (!num(n.x) || !num(n.y)) {
      if (derivable) derived++;   // the recommended shape, not a defect — counted, not warned
      else errors.push(at + ': x and y must be finite numbers');
    }
    if (!num(n.w) || n.w <= 0 || !num(n.h) || n.h <= 0) noSize++;
    if (n.shape !== undefined && SHAPES.indexOf(n.shape) < 0) {
      if (typeof n.shape === 'number') warnings.push(at + ': shape is the number ' + n.shape + ' — shape is a STRING enum, not a numeric code. Use one of ' + SHAPES.join('|') + ' (default "rounded"). The node still renders, as an ellipse, so this fails silently');
      else warnings.push(at + ': shape "' + n.shape + '" unknown, falls back to ellipse. Use one of ' + SHAPES.join('|'));
    }
    if (n.lopType !== undefined) {
      lopNodes++;
      if (LOP_TYPES.indexOf(n.lopType) < 0) warnings.push(at + ': lopType "' + n.lopType + '" unknown — use one of ' + LOP_TYPES.join('|') + '. It draws as a plain node and stays out of the List of Processes');
      if (n.lopType === 'process') {
        if (!n.lopNum) lopUnnumbered++;
        if (!(n.props && String(n.props.owner || '').trim())) lopNoOwner++;
        if (!(n.props && String(n.props.measure || '').trim())) lopNoMeasure++;
      }
    }
    if (n && typeof n === 'object' && (n.evolution !== undefined || n.shadow !== undefined || n.pinnedBy !== undefined || n.pressure !== undefined)) rbaNodes++;
    checkRBA(n, at, errors, warnings, loopNames);
  });
  // Rolled up, not per node. Nine identical warnings on a three-node file
  // teaches people to skip the warnings, which is the opposite of the job.
  if (noSize) warnings.push(noSize + ' node(s) have no w/h — they default to 108x46 on load. Set them where a long label needs the room');
  if (derived) notes.push(derived + ' node(s) take their position from evolution/visibility. Correct for a Wardley map — the tool derives x/y on load and writes the pixels back on export');
  if (rbaNodes && declaredMode !== 'wardley') warnings.push(rbaNodes + ' node(s) carry Rent Band Analysis fields but "mode" is not "wardley" — the bands, shadows and pins only render in Wardley mode');
  if (lopNodes && declaredMode !== 'lop') warnings.push(lopNodes + ' node(s) carry lopType but "mode" is not "lop" — the bands and the List of Processes only appear in LOP mode');
  if (lopNoOwner) warnings.push(lopNoOwner + ' key process(es) have no props.owner — the List of Processes asks who owns each one');
  if (lopNoMeasure) warnings.push(lopNoMeasure + ' key process(es) have no props.measure — a process nobody measures cannot be improved');
  if (lopUnnumbered) warnings.push(lopUnnumbered + ' key process(es) have no lopNum — run Renumber so the map and the List of Processes agree');

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
    if (e.lopLink !== undefined && LOP_LINKS.indexOf(e.lopLink) < 0) warnings.push(at + ': lopLink "' + e.lopLink + '" unknown — use one of ' + LOP_LINKS.join('|'));
    if (declaredMode === 'lop' && e.lopLink === undefined) lopUntypedEdges++;
  });
  if (lopUntypedEdges) warnings.push(lopUntypedEdges + ' edge(s) in a linkage map carry no lopLink — they draw plain and export as LINKED_TO, losing what the arrow carries');

  return { errors: errors, warnings: warnings, notes: notes };
}

function fix(doc) {
  if (doc.version === undefined) doc.version = '1.0';
  // migrate a meta block into the fields the tool actually persists
  if (doc.meta && typeof doc.meta === 'object') {
    if (!doc.modelName && (doc.meta.title || doc.meta.name)) doc.modelName = doc.meta.title || doc.meta.name;
    if (!doc.mode && doc.meta.mode) doc.mode = doc.meta.mode;
    if (!doc.modelNote) {
      var bits = [doc.meta.description || doc.meta.notes, [doc.meta.version && 'Schema ' + doc.meta.version,
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
var cldIx = args.indexOf('--cld');
var cldFile = cldIx >= 0 ? args[cldIx + 1] : null;
var file = args.filter(function (a, i) { return a !== '--fix' && a !== '--cld' && !(cldIx >= 0 && i === cldIx + 1); })[0];
if (!file) { console.error('usage: node validate-rcn-graph.js <file.json> [--fix] [--cld <cld.json>]'); process.exit(2); }
var doc;
try { doc = JSON.parse(fs.readFileSync(file, 'utf8')); }
catch (e) { console.error('Invalid JSON: ' + e.message); process.exit(2); }
var cld = null;
if (cldFile) {
  try { cld = JSON.parse(fs.readFileSync(cldFile, 'utf8')); }
  catch (e) { console.error('Invalid --cld JSON: ' + e.message); process.exit(2); }
}

if (doFix) {
  fix(doc);
  var out = file.replace(/\.json$/, '') + '.fixed.json';
  fs.writeFileSync(out, JSON.stringify(doc, null, 2));
  console.log('Wrote ' + out);
}

var r = validate(doc, cld);
(r.notes || []).forEach(function (n) { console.log('note  ' + n); });
r.warnings.forEach(function (w) { console.log('WARN  ' + w); });
r.errors.forEach(function (e) { console.log('ERROR ' + e); });
if (r.errors.length) { console.log('\nFAIL: ' + r.errors.length + ' error(s), ' + r.warnings.length + ' warning(s)'); process.exit(1); }
console.log('\nOK: renders in RCN Graph Tool (' + (doc.nodes || []).length + ' nodes, ' + (doc.edges || []).length + ' edges). ' + r.warnings.length + ' warning(s).');
