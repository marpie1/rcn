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
  const TABLE_URL = LOCAL
    ? 'http://localhost:8765/tools/rcn-table.html'
    : 'https://marc.relocalizecreativity.net/assets/Drag/rcn-table.html'
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

  function renderContent ($item, item) {
    $item.empty()
    const cols = columnsOf(item)
    const rows = rowsOf(item)

    if (!rows.length) {
      $item.append(`
        <div style="background:#eee;padding:15px;text-align:center;">
          <p style="font-weight:bold;margin:0 0 6px;">RCN Table</p>
          <p style="color:#666;font-size:0.85em;margin:0 0 12px;">
            Rows from the substrate — scan, select, click through</p>
          <button class="open-table" style="cursor:pointer;">Open Table ↗</button>
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
      const popup = window.open(TABLE_URL, WINDOW_NAME, 'popup,height=820,width=1440')
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

    $item.on('dblclick', '.rcnt-head, .rcnt-dim', () => wiki.textEditor($item, item))
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
