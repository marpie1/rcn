/*
 * fedwiki-print-bookmarklet.js — print the open lineup as a document, no terminal.
 *
 * SOURCE. Build with: node ~/rcn/tools/build-lineup-bookmarklet.js
 *
 * Opens a new window holding the lineup rendered as one continuous document —
 * no wiki chrome, no columns, no flags — and calls print() on it. Save as PDF
 * from the print dialog.
 *
 * Rendering matches export-fedwiki-page.js: markdown/paragraph/html items only,
 * blocks split so one item can mix prose, lists and quotes, [[wiki links]]
 * turned into internal anchors when the target is in the lineup and links back
 * to the live wiki otherwise.
 *
 * The build script substitutes the placeholder constant below.
 */
(function () {
  var LINKS = '__LINKS__';   /* 'anchor' (jump within the document) or 'text' (plain, no links) */

  /* Same look as export-fedwiki-page.js --to html: a document, not a web page. */
  var STYLE = "body{background:#fff;color:#000;font:16px/1.55 Georgia,'Times New Roman',serif;max-width:46em;margin:2.5em auto;padding:0 1em}" +
    "h1,h2,h3,h4,h5,h6{font-family:Helvetica,Arial,sans-serif;color:#000;line-height:1.25}" +
    "a{color:#000}code{font:0.9em/1.4 Menlo,Consolas,monospace;background:#f4f4f4;padding:0 .25em}" +
    "blockquote{margin:0 0 0 2em;font-style:italic}" +
    "table{border-collapse:collapse}td,th{border:1px solid #000;padding:.3em .6em}" +
    ".item{margin:0 0 1em 0}.page-section{margin-bottom:3em}" +
    "@media print{body{margin:0 auto}.page-section{page-break-inside:auto}h1,h2{page-break-after:avoid}}";

  var $ = window.jQuery || window.$;
  if (!$) return say('Not a FedWiki page (no jQuery found).', true);

  var $pages = $('.page');
  if (!$pages.length) return say('No pages found in this lineup.', true);

  var collected = [], slugs = {};

  $pages.each(function () {
    var $p = $(this);
    var po = null;
    try { po = $p.data('key') && wiki.lineup && wiki.lineup.atKey ? wiki.lineup.atKey($p.data('key')) : null; }
    catch (e) { po = null; }
    var raw = (po && typeof po.getRawPage === 'function') ? po.getRawPage() : $p.data('data');
    if (!raw || typeof raw.title !== 'string' || !Array.isArray(raw.story)) return;
    var slug = (po && typeof po.getSlug === 'function' && po.getSlug()) || $p.attr('id') || asSlug(raw.title);
    collected.push({ slug: slug, page: raw });
    slugs[slug] = true;
  });

  if (!collected.length) return say('Nothing could be printed from this lineup.', true);

  var body = collected.map(function (c) {
    return '<section class="page-section" id="page-' + c.slug + '">\n' + pageToHtml(c.page) + '\n</section>';
  }).join('\n');

  var title = 'Lineup: ' + collected[0].page.title;
  var doc = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>' +
    esc(title) + '</title><style>' + STYLE + '</style></head><body>\n' +
    '<h1>' + esc(title) + '</h1>\n' + body + '\n</body></html>';

  var w = window.open('', '_blank');
  if (!w) return say('The print window was blocked. Allow pop-ups for this site and click again.', true);
  w.document.open();
  w.document.write(doc);
  w.document.close();

  /* Give the new window a beat to lay out before the print dialog opens,
     otherwise some browsers print a blank first page. */
  setTimeout(function () { try { w.focus(); w.print(); } catch (e) {} }, 350);

  say('Printing ' + collected.length + ' page' + (collected.length === 1 ? '' : 's') + ' — choose "Save as PDF"');

  /* ---------- rendering (mirrors export-fedwiki-page.js) ---------- */

  function pageToHtml(page) {
    var out = ['<h2>' + esc(page.title) + '</h2>'];
    for (var i = 0; i < page.story.length; i++) {
      var it = page.story[i], inner = null;
      if ((it.type === 'markdown' || it.type === 'paragraph') && typeof it.text === 'string')
        inner = mdToHtml(resolveLinks(it.text));
      else if (it.type === 'html' && typeof it.text === 'string')
        inner = it.text;
      if (inner !== null) out.push('<div class="item" id="' + (it.id || '') + '">\n' + inner + '\n</div>');
    }
    return out.join('\n');
  }

  function resolveLinks(text) {
    return text.replace(/\[\[([^\]]+)\]\]/g, function (_, t) {
      var slug = asSlug(t);
      if (LINKS === 'text') return t;
      if (slugs[slug]) return '[' + t + '](#page-' + slug + ')';
      return '[' + t + '](' + location.origin + '/view/' + slug + ')';
    });
  }

  function mdToHtml(text) {
    var t = String(text).trim();
    var h = t.match(/^(#{1,6})\s+([\s\S]*)$/);
    if (h) return '<h' + (h[1].length + 1) + '>' + inline(esc(h[2].trim())) + '</h' + (h[1].length + 1) + '>';

    var lines = t.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
    if (!lines.length) return '';

    var blocks = [];
    for (var i = 0; i < lines.length; i++) {
      var l = lines[i];
      var kind = /^[-*]\s+/.test(l) ? 'ul' : /^\d+[.)]\s+/.test(l) ? 'ol' : /^>\s?/.test(l) ? 'quote' : 'p';
      var last = blocks[blocks.length - 1];
      if (last && last.kind === kind) last.lines.push(l);
      else blocks.push({ kind: kind, lines: [l] });
    }

    return blocks.map(function (b) {
      if (b.kind === 'ul' || b.kind === 'ol') {
        var lis = b.lines.map(function (l) {
          return '  <li>' + inline(esc(l.replace(/^([-*]|\d+[.)])\s+/, ''))) + '</li>';
        }).join('\n');
        return '<' + b.kind + '>\n' + lis + '\n</' + b.kind + '>';
      }
      if (b.kind === 'quote') {
        return '<blockquote>' + inline(esc(b.lines.map(function (l) {
          return l.replace(/^>\s?/, '');
        }).join(' '))) + '</blockquote>';
      }
      return '<p>' + inline(esc(b.lines.join(' '))) + '</p>';
    }).join('\n');
  }

  function inline(s) {
    /* \ue000 sentinels, not NUL: a NUL byte inside a javascript: URL is a
       good way to have the browser quietly refuse the bookmarklet. */
    var codes = [];
    s = s.replace(/`([^`]+)`/g, function (_, c) { codes.push(c); return '\uE000' + (codes.length - 1) + '\uE000'; });
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|\W)\*([^*\n]+)\*(?=\W|$)/g, '$1<em>$2</em>');
    s = s.replace(/(^|\W)_([^_\n]+)_(?=\W|$)/g, '$1<em>$2</em>');
    s = s.replace(/\uE000(\d+)\uE000/g, function (_, i) { return '<code>' + codes[+i] + '</code>'; });
    return s;
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function asSlug(title) {
    return String(title).replace(/\s/g, '-').replace(/[^A-Za-z0-9-]/g, '').toLowerCase();
  }

  function say(msg, isError) {
    var d = document.createElement('div');
    d.textContent = msg;
    d.style.cssText = 'position:fixed;z-index:99999;left:50%;top:20px;transform:translateX(-50%);' +
      'padding:10px 16px;border-radius:6px;font:14px system-ui,sans-serif;color:#fff;' +
      'box-shadow:0 2px 8px rgba(0,0,0,.3);background:' + (isError ? '#b00' : '#282');
    document.body.appendChild(d);
    setTimeout(function () { d.remove(); }, 5000);
  }
})();
