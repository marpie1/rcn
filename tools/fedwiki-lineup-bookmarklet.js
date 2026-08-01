/*
 * fedwiki-lineup-bookmarklet.js — capture the open lineup from inside the browser.
 *
 * This is the SOURCE. Do not paste it into a bookmark directly.
 * Build the installable bookmarklets and their instruction page with:
 *
 *     node ~/rcn/tools/build-lineup-bookmarklet.js
 *
 * which writes fedwiki-lineup-bookmarklet.html — open that and drag the links
 * to the bookmarks bar.
 *
 * Why this exists alongside fedwiki-lineup.js (the Node script): this runs inside
 * the tab, so it reads what the BROWSER has, not what the server has. That means
 * it captures unsaved edits, ghost pages, and pages behind a login — none of
 * which the script can reach.
 *
 * The build script substitutes the two placeholder constants below.
 */
(function () {
  var SHAPE = '__SHAPE__';       /* 'bundle' (for Claude / export script) or 'export' (drag-and-drop) */
  var JOURNAL = '__JOURNAL__';   /* 'fork', 'full', or 'none' */

  var $ = window.jQuery || window.$;
  if (!$) return say('Not a FedWiki page (no jQuery found).', true);

  var $pages = $('.page');
  if (!$pages.length) return say('No pages found in this lineup.', true);

  var pages = {}, captured = 0, skipped = 0, firstTitle = null;

  $pages.each(function () {
    var $p = $(this);

    /* Two routes to the same live object, verified identical in the browser:
       $page.data('data') IS the raw page {title, story, journal}, and it is the
       very object wiki.lineup.atKey(key).getRawPage() returns. Prefer the lineup
       route because the pageObject also knows the slug and the remote site;
       fall back to the DOM when lineup is unavailable. */
    var po = null;
    try { po = $p.data('key') && wiki.lineup && wiki.lineup.atKey ? wiki.lineup.atKey($p.data('key')) : null; }
    catch (e) { po = null; }

    var raw = (po && typeof po.getRawPage === 'function') ? po.getRawPage() : $p.data('data');
    if (!raw || typeof raw.title !== 'string' || !Array.isArray(raw.story)) { skipped++; return; }

    var site = $p.data('site');
    if (!site && po && typeof po.isRemote === 'function' && po.isRemote() && typeof po.getRemoteSite === 'function') {
      site = po.getRemoteSite(location.host);
    }
    if (!site || site === 'view' || site === 'origin' || site === 'local') site = location.host;

    var slug = (po && typeof po.getSlug === 'function' && po.getSlug()) || $p.attr('id') || asSlug(raw.title);

    var key = slug;
    if (pages[key]) {
      var tag = String(site).split('.')[0], n = 2;
      key = slug + '-' + tag;
      while (pages[key]) key = slug + '-' + tag + '-' + (n++);
    }

    pages[key] = { title: raw.title, story: raw.story, journal: shapeJournal(raw.journal, site) };
    if (!firstTitle) firstTitle = raw.title;
    captured++;
  });

  if (!captured) return say('Nothing could be captured from this lineup.', true);

  var payload;
  if (SHAPE === 'export') {
    payload = pages;
  } else {
    payload = {
      title: 'Lineup: ' + firstTitle,
      story: [
        { type: 'paragraph', id: newId(),
          text: 'Lineup of ' + captured + ' page' + (captured === 1 ? '' : 's') +
                ' captured from ' + location.host + ' on ' + new Date().toISOString().slice(0, 10) + '.' },
        { type: 'importer', id: newId(), pages: pages }
      ],
      journal: [{ type: 'fork', date: Date.now() }]
    };
  }

  var name = 'lineup-' + Object.keys(pages)[0] + '-' + new Date().toISOString().slice(0, 10) +
             (SHAPE === 'export' ? '-import' : '') + '.json';
  download(name, JSON.stringify(payload, null, 2));

  say('Captured ' + captured + ' page' + (captured === 1 ? '' : 's') +
      (skipped ? ' (' + skipped + ' skipped)' : '') + ' → ' + name);

  /* ---------- helpers ---------- */

  function shapeJournal(journal, site) {
    journal = Array.isArray(journal) ? journal : [];
    if (JOURNAL === 'full') return journal;
    if (JOURNAL === 'none') return [];
    var last = journal[journal.length - 1];
    return [{ type: 'fork', site: site, date: (last && last.date) || Date.now() }];
  }

  function asSlug(title) {
    return String(title).replace(/\s/g, '-').replace(/[^A-Za-z0-9-]/g, '').toLowerCase();
  }

  function newId() {
    var s = '';
    for (var i = 0; i < 16; i++) s += '0123456789abcdef'[Math.floor(Math.random() * 16)];
    return s;
  }

  function download(filename, text) {
    var blob = new Blob([text], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  /* A floating note rather than alert() — alert blocks the page and, in some
     automation contexts, wedges it entirely. */
  function say(msg, isError) {
    var d = document.createElement('div');
    d.textContent = msg;
    d.style.cssText = 'position:fixed;z-index:99999;left:50%;top:20px;transform:translateX(-50%);' +
      'padding:10px 16px;border-radius:6px;font:14px system-ui,sans-serif;color:#fff;' +
      'box-shadow:0 2px 8px rgba(0,0,0,.3);background:' + (isError ? '#b00' : '#282');
    document.body.appendChild(d);
    setTimeout(function () { d.remove(); }, 4000);
  }
})();
