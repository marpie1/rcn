/* rcn-switch.js — move between the Graph Tool, the Map, the Timeline and the
 * Table without losing your place.
 *
 * ONE SOURCE. tools/paste-switch.js pastes this file into the four tools
 * between BEGIN/END marker lines, so each tool stays one complete file to
 * upload (the same reason build-deploy-tool.js pastes the icon lists into the
 * Graph Tool). Edit this file, then run  node tools/paste-switch.js .
 *
 * HOW IT WORKS. A "set" is a small JSON file that names where one dataset
 * lives in each tool:
 *
 *   { "name": "Co-ops of Whatcom County",
 *     "graph": "whatcom-coops-graph.json",        Graph Tool file
 *     "graphIdProp": "mapId",                      node prop holding the shared id (else the node id)
 *     "issue": "whatcom-wa--cooperatives",         RCN Map issue key
 *     "timeline": "whatcom-coops-timeline.json",   Timeline file
 *     "table": { "src": "folder", "kind": "Coop", "idColumn": "mapId" } }
 *
 * Paths are relative to the set file. Every tool opened as
 *   <tool>.html?set=<set file>&sel=<id>
 * loads its own part of the set and opens on the thing with that id. The ids
 * are the ones the map uses for its points; the other files carry the same id.
 *
 * A tool opened with ?set= shows a small bar — ⇄ Graph · Map · Timeline ·
 * Table — that opens the same dataset in another tool, carrying whatever is
 * selected now. Each tool keeps one tab (window name rcn-<tool>), so moving
 * back and forth reuses tabs instead of piling them up.
 *
 * Marc Pierson with Claude Opus 5.5, Oct 2026.
 */
(function () {
  var q = new URLSearchParams(location.search);
  var SET = q.get('set');
  var LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  var TOOLS = {
    graph:    { label: '🕸 Graph',    file: 'graph-tool-v22.html', dir: '/tools/' },
    map:      { label: '🗺 Map',      file: 'rcn_map.html',        dir: '/maps/'  },
    timeline: { label: '⏳ Timeline', file: 'rcn-timeline.html',   dir: '/tools/' },
    table:    { label: '▦ Table',    file: 'rcn-table.html',      dir: '/tools/' }
  };

  var S = window.RCNSet = {
    active: !!SET,       // opened from a set?
    set: null,           // the set file's contents, once loaded
    url: SET ? new URL(SET, location.href).href : null,
    sel: q.get('sel'),   // the id to open on
    here: null,
    getSel: null,
    // A path from the set file, made absolute.
    resolve: function (p) { return new URL(p, S.url).href; },
    // Called once by each tool. Returns a promise of the set (null if none).
    mount: function (tool, getSel) {
      S.here = tool; S.getSel = getSel;
      if (!SET) return Promise.resolve(null);
      if (!window.name || /^rcn-/.test(window.name)) window.name = 'rcn-' + tool;
      return fetch(S.url).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      }).then(function (set) {
        S.set = set; bar(); return set;
      }).catch(function (e) {
        console.warn('rcn-switch: could not load the set', S.url, e);
        return null;
      });
    },
    // Open the same set in another tool, on the current selection.
    go: function (tool) {
      var sel = (S.getSel && S.getSel()) || S.sel;
      var setPath = location.protocol === 'file:' ? S.url : new URL(S.url).pathname;
      var t = TOOLS[tool];
      var base = LOCAL ? t.dir + t.file : t.file;
      var url = base + '?set=' + encodeURIComponent(setPath) + (sel ? '&sel=' + encodeURIComponent(sel) : '');
      var w = window.open(url, 'rcn-' + tool);
      if (w) try { w.focus(); } catch (e) {}
    }
  };

  function has(tool) {
    var s = S.set || {};
    return tool === 'graph' ? !!s.graph : tool === 'map' ? !!s.issue
         : tool === 'timeline' ? !!s.timeline : tool === 'table' ? !!(s.table && s.table.src) : false;
  }

  function bar() {
    if (document.getElementById('rcn-switch')) return;
    var css = document.createElement('style');
    css.textContent =
      '#rcn-switch{position:fixed;left:50%;bottom:10px;transform:translateX(-50%);z-index:99999;' +
      'display:flex;align-items:center;gap:2px;padding:3px 6px;border-radius:16px;' +
      'background:rgba(255,255,255,.92);box-shadow:0 1px 6px rgba(0,0,0,.25);' +
      'font:12px system-ui,sans-serif;color:#334155}' +
      '#rcn-switch b{font-weight:600;margin-right:4px;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
      '#rcn-switch button{border:0;background:none;padding:3px 8px;border-radius:12px;cursor:pointer;font:inherit;color:#1d4ed8}' +
      '#rcn-switch button:hover{background:#e0e7ff}' +
      '#rcn-switch button.here{background:#1d4ed8;color:#fff;cursor:default}' +
      'body.presenting #rcn-switch{display:none}' +
      '@media print{#rcn-switch{display:none}}';
    document.head.appendChild(css);
    var d = document.createElement('div');
    d.id = 'rcn-switch';
    d.title = 'Open this same set in another tool, on what you have selected';
    var html = '<b title="' + esc(S.set.name || '') + '">⇄ ' + esc(S.set.name || 'Set') + '</b>';
    Object.keys(TOOLS).forEach(function (k) {
      if (!has(k)) return;
      html += '<button data-tool="' + k + '"' + (k === S.here ? ' class="here"' : '') + '>' + TOOLS[k].label + '</button>';
    });
    d.innerHTML = html;
    d.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      if (b.dataset.tool !== S.here) S.go(b.dataset.tool);
    });
    document.body.appendChild(d);
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
})();
