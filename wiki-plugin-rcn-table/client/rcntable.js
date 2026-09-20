(function () {
  // ═════════════════════════════════════════════════════════════════════
  // RCN TABLE — the in-column half of the table callout.
  //
  // ONE NAME ONLY. wiki-plugin-rcngraph ships client/rcngraph.js AND
  // client/rcn-graph.js, and the two have already drifted apart. FedWiki loads
  // /plugins/<type>/<type>.js, so a second spelling is a second file that must
  // be kept in step by hand. The factory declares "Rcntable", the item type is
  // `rcntable`, and this is the only implementation.
  //
  // WHAT GOES IN THE COLUMN. Not the table — 189 rows by 34 columns will never
  // fit a 40em column, and shrinking it only produces something unreadable that
  // still does not fit. Ward's data plugin answers this by rendering the
  // DIMENSIONS ("55x8") and letting the reader scrub the columns by hovering.
  // We do the same, plus the first few subject names, because those are the
  // links — and links are what a wiki page is for.
  //
  // TWO CHANNELS, BOTH ALREADY IN FEDWIKI. A table has rows and columns, and
  // FedWiki has a coordination mechanism for each:
  //   rows    -> a.internal -> the slug -> the lineup moves
  //   columns -> the `thumb` event on .main -> chart/rollup/reduce/method react
  // So this needs no selection bus. The subject links are plain <a
  // class="internal"> and FedWiki's own handler navigates them; hovering a
  // column chip fires the thumb that Ward's downstream plugins already listen
  // for. Nothing here knows about the graph tool, and they still stay in step,
  // because they name the same things.
  // ═════════════════════════════════════════════════════════════════════

  // Farm sites are alice.localhost, scp-experiment.localhost, … so match the
  // suffix rather than the bare hostname.
  const LOCAL = /(^|\.)localhost$/.test(window.location.hostname)

  // THE SITE'S OWN ASSETS, NOT A CENTRAL SERVER. Deployed, the table reads a
  // folder that substrate/export.py wrote and the site owner dropped into
  // /assets/rcn-table/ — the tools beside one subfolder per database:
  //
  //   assets/rcn-table/rcn-table.html
  //   assets/rcn-table/rcn-table-map.html
  //   assets/rcn-table/graph-tool-v22.html     (the self-contained dist build)
  //   assets/rcn-table/<database>/index.json, table-<kind>.json, geo.json, graph.json
  //
  // So every site is its own substrate: whoever owns the site is the DBA, and
  // anyone who can read the page can read the table. Nothing talks to Neo4j.
  // An item may override either path (`tool`, `src`) to read another site's
  // folder — federation for tables. At home the popup keeps reading the live
  // api.py on 8768 so a steward sees Neo4j as it is, not as it was exported.
  const ASSETS = window.location.origin + '/assets/rcn-table/'
  // At home the substrate itself serves the tools (api.py serves the repo root),
  // so the popup and the projections share one origin and no second server is
  // needed — the same three containers as deploy/steward/.
  const tableURL = item => item.tool || (LOCAL
    ? 'http://localhost:8768/tools/rcn-table.html'
    : ASSETS + 'rcn-table.html')
  const tableSrc = item => item.src || (LOCAL ? null
    : ASSETS + encodeURIComponent(item.database || 'whatcom') + '/')
  const WINDOW_NAME = 'rcntable'
  const SAMPLE_ROWS = 3

  let pendingItem = null
  let pending$item = null

  // MUST match wiki-client lib/page.js asSlug() and the same function in
  // rcn-table.html and graph-tool-v22.html. One rule, or the join silently fails.
  function asSlug (name) {
    return String(name).replace(/\s/g, '-').replace(/[^A-Za-z0-9-]/g, '').toLowerCase()
  }

  function esc (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
  }

  function columnsOf (item) { return item.columns || [] }
  function rowsOf (item) { return item.data || [] }

  // THE TEXT IS THE CONTROL PANEL. Double-click opens FedWiki's own text editor
  // on item.text (and Cmd-I inside it opens About Rcntable Plugin, which the
  // editor does for every plugin). A line of the form `key: value` for one of
  // these four keys sets that field; every other line is left alone, so the
  // search-index text the popup writes on save keeps working, and a person can
  // put `kind: Program` above it. An empty value clears the field, which is how
  // to go back to the site's own folder after pointing at another site's.
  const CONFIG_KEYS = ['database', 'kind', 'src', 'tool']
  function configFromText (item) {
    String(item.text || '').split('\n').forEach(line => {
      const m = line.match(/^\s*(database|kind|src|tool)\s*:\s*(.*?)\s*$/i)
      if (!m) return
      const key = m[1].toLowerCase()
      if (m[2]) item[key] = m[2]; else delete item[key]
    })
  }

  function renderContent ($item, item) {
    configFromText(item)
    $item.empty()
    const cols = columnsOf(item)
    const rows = rowsOf(item)

    if (!rows.length) {
      const where = [item.database, item.kind].filter(Boolean).join(' · ')
      $item.append(`
        <div style="background:#eee;padding:15px;text-align:center;">
          <p style="font-weight:bold;margin:0 0 6px;">RCN Table${where ? ' — ' + esc(where) : ''}</p>
          <p style="color:#666;font-size:0.85em;margin:0 0 12px;">
            Rows from the substrate — scan, select, click through</p>
          <button class="open-table" style="cursor:pointer;">Open Table ↗</button>
          <p style="color:#888;font-size:0.75em;margin:12px 0 0;">
            double-click to edit · ⌘I in the editor for help</p>
        </div>`)
      return
    }

    const subject = item.subject && cols.indexOf(item.subject) >= 0 ? item.subject : null
    const shown = rows.length
    const total = item.total || shown
    const caption = [item.database, item.kind].filter(Boolean).join(' · ')

    const chips = cols.map(c =>
      `<span class="rcnt-col" data-col="${esc(c)}" title="${esc(c)}">${esc(c)}</span>`).join('')

    const samples = rows.slice(0, SAMPLE_ROWS).map(r => {
      const name = subject ? String(r[subject] || '') : ''
      if (!name) return ''
      // A plain internal link: FedWiki's own click handler takes it from here.
      return `<div class="rcnt-row"><a class="internal" href="/${esc(asSlug(name))}.html"
                data-page-name="${esc(name)}" title="${esc(name)}">${esc(name)}</a></div>`
    }).join('')

    const more = total > shown
      ? `<div class="rcnt-more">showing ${shown} of ${total} — open the table for the rest</div>`
      : ''

    $item.append(`
      <div class="rcnt">
        <div class="rcnt-head">
          <span class="rcnt-caption">${esc(caption || 'Table')}</span>
          <span class="rcnt-dim">${shown}&times;${cols.length}</span>
        </div>
        <div class="rcnt-cols">${chips}</div>
        <div class="rcnt-rows">${samples}</div>
        ${more}
        <div class="rcnt-actions"><button class="open-table">Open Table ↗</button></div>
      </div>`)
  }

  function bind ($item, item) {
    $item.on('click', '.open-table', () => {
      pendingItem = item
      pending$item = $item
      const popup = window.open(tableURL(item), WINDOW_NAME, 'popup,height=820,width=1440')
      if (popup) popup.focus()
    })

    // COLUMN CHANNEL. `thumb` is Ward's existing page-wide event and its unit is
    // the column name — exactly what a table has to offer. Publishing it here
    // means chart, rollup, reduce and method respond to this table with no
    // adapter and no knowledge of it.
    $item.on('mouseenter', '.rcnt-col', function () {
      $item.trigger('thumb', $(this).attr('data-col'))
    })
    $('.main').on('thumb', (evt, thumb) => {
      $item.find('.rcnt-col').each(function () {
        $(this).toggleClass('rcnt-col-lit', $(this).attr('data-col') === thumb)
      })
    })

    // Double-click anywhere opens the editor, as every FedWiki item does — except
    // on a link or the button, which have their own click and would fight it.
    $item.on('dblclick', e => {
      if ($(e.target).closest('a, button').length) return
      wiki.textEditor($item, item)
    })
  }

  function emit ($item, item) { renderContent($item, item) }

  function tableListener (event) {
    if (!event.source || !event.source.opener) return
    if (!event.data || event.data.toolType !== 'rcn-table') return

    const { data } = event

    switch (data.action) {
      case 'tableReady': {
        if (!pendingItem || !pending$item) return
        event.source.postMessage({
          action: 'loadTable',
          database: pendingItem.database || null,
          kind: pendingItem.kind || null,
          src: tableSrc(pendingItem),
          pageKey: pending$item.parents('.page').data('key')
        }, '*')
        break
      }
      case 'saveTable': {
        if (!pendingItem || !pending$item) return
        const incoming = data.item || {}
        // Copy the fields the item owns; leave FedWiki's own (id, type) alone.
        ;['columns', 'data', 'subject', 'kind', 'database', 'total', 'fetched', 'text']
          .forEach(k => { if (incoming[k] !== undefined) pendingItem[k] = incoming[k] })
        const $page = pending$item.parents('.page:first')
        wiki.pageHandler.put($page, { type: 'edit', id: pendingItem.id, item: pendingItem })
        renderContent(pending$item, pendingItem)
        bind(pending$item, pendingItem)
        break
      }
      case 'doInternalLink': {
        // ROW CHANNEL. The callout does not update a pane; it moves the lineup
        // on the page that opened it.
        const { title, site, pageKey, keepLineup } = data
        const $page = keepLineup
          ? null
          : $('.page').filter((i, el) => $(el).data('key') == pageKey)
        wiki.doInternalLink(title, $page, site)
        break
      }
      default:
        if (wiki.debug) console.log('rcntable listener — unknown action:', data)
    }
  }

  const STYLE = `
.rcnt { background:#f7f8fa; border:1px solid #dfe3e8; border-radius:4px; padding:8px 10px;
        font-family:system-ui,sans-serif; }
.rcnt-head { display:flex; align-items:baseline; gap:8px; margin-bottom:6px; }
.rcnt-caption { font-weight:700; font-size:12px; color:#16233b; flex:1;
        overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.rcnt-dim { font-size:16px; font-weight:700; color:#0f766e; letter-spacing:.02em; }
.rcnt-cols { display:flex; flex-wrap:wrap; gap:3px; margin-bottom:7px; }
.rcnt-col { font-size:10px; color:#64748b; background:#fff; border:1px solid #e2e8f0;
        border-radius:3px; padding:1px 5px; cursor:default; white-space:nowrap; }
.rcnt-col-lit { background:#cdf3ee; border-color:#0f766e; color:#0f766e; }
.rcnt-rows { border-top:1px solid #e2e8f0; padding-top:5px; }
.rcnt-row { font-size:12px; padding:1px 0; overflow:hidden;
        text-overflow:ellipsis; white-space:nowrap; }
.rcnt-more { font-size:10px; color:#94a3b8; padding-top:4px; font-style:italic; }
.rcnt-actions { margin-top:7px; text-align:center; }
.rcnt-actions button { font-size:11px; padding:2px 8px; border:1px solid #bbb;
        background:#fff; border-radius:3px; cursor:pointer; }
.rcnt-actions button:hover { background:#e8f0fe; border-color:#0f766e; }
`

  if (typeof window !== 'undefined') {
    if (!document.getElementById('rcntable-style')) {
      const el = document.createElement('style')
      el.id = 'rcntable-style'
      el.textContent = STYLE
      document.head.appendChild(el)
    }
    window.plugins['rcntable'] = { emit, bind }
    if (!window.rcnTableListener) {
      window.rcnTableListener = tableListener
      window.addEventListener('message', tableListener)
    }
  }
})()
