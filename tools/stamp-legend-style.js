#!/usr/bin/env node
// Stamp legend-row style onto the elements that follow the row, as bare fields.
//
// Why this exists
// ---------------
// graph-tool-v22 resolves a styled value as: element.ovr[field] -> legendRow[field]
// -> element[field] (function sv(), ~line 2189). So a node carrying only `type`
// renders perfectly IN THE TOOL while carrying no colour of its own in the file.
//
// Every other reader -- chat-Claude, a Neo4j projection, a converter, or a human
// scanning the JSON -- does not implement that chain, and sees an uncoloured graph.
//
// Stamping writes the resolved value onto the element as a plain field. Because the
// legend row still WINS over a bare field, the tool's behaviour is unchanged and the
// legend remains the single place to restyle. The bare fields are a fallback for
// everyone outside the tool. Both layers end up self-describing.
//
// Usage:  node tools/stamp-legend-style.js file.json [--write]

var fs = require('fs');

var NODE_FIELDS = ['color', 'borderColor', 'borderWidth', 'borderDash', 'fontColor', 'fontSize', 'icon'];
var EDGE_FIELDS = ['color', 'width', 'dash', 'fontSize', 'fontColor', 'linkFamily'];

function stamp(g) {
  var rows = {};
  (g.legendEntries || []).forEach(function (r) { rows[r.id] = r; });
  var counts = { nodes: 0, edges: 0, fields: 0, untyped: [] };

  function apply(el, fields, bucket) {
    if (!el.type) { counts.untyped.push(el.id); return; }
    var row = rows[el.type];
    if (!row) { counts.untyped.push(el.id); return; }
    var touched = false;
    fields.forEach(function (f) {
      // element override wins over the row and is already explicit -- leave it
      if (el.ovr && el.ovr[f] !== undefined && el.ovr[f] !== '') return;
      if (row[f] === undefined || row[f] === '') return;
      if (el[f] === row[f]) return;
      el[f] = row[f];
      counts.fields++;
      touched = true;
    });
    if (touched) counts[bucket]++;
  }

  (g.nodes || []).forEach(function (n) { apply(n, NODE_FIELDS, 'nodes'); });
  (g.edges || []).forEach(function (e) { apply(e, EDGE_FIELDS, 'edges'); });
  return counts;
}

if (require.main === module) {
  var file = process.argv[2];
  var write = process.argv.indexOf('--write') > -1;
  if (!file) { console.error('usage: stamp-legend-style.js file.json [--write]'); process.exit(2); }
  var g = JSON.parse(fs.readFileSync(file, 'utf8'));
  var c = stamp(g);
  // Only rewrite when something actually changed -- a no-op rewrite would reformat
  // the file under whoever is mid-edit, for nothing.
  if (write && c.fields) fs.writeFileSync(file, JSON.stringify(g, null, 2) + '\n');
  if (!c.fields) { console.log('nothing to stamp (already self-describing)'); process.exit(0); }
  console.log((write ? 'stamped ' : 'would stamp ') + c.fields + ' field(s) across ' +
    c.nodes + ' node(s) and ' + c.edges + ' edge(s)' +
    (c.untyped.length ? '\nfollowing no legend row (left alone): ' + c.untyped.join(', ') : ''));
}

module.exports = { stamp: stamp, NODE_FIELDS: NODE_FIELDS, EDGE_FIELDS: EDGE_FIELDS };
