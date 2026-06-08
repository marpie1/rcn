(function () {

  const GRAPH_URL = 'http://localhost:8765/tools/graph-tool-v22.html'
  const WINDOW_NAME = 'rcn-graph'

  function emit($item, item) {
    $item.append(`
      <div style="background-color:#eee;padding:15px;text-align:center;">
        <p style="font-weight:bold;margin:0 0 6px;">RCN Graph Tool</p>
        <p style="color:#666;font-size:0.85em;margin:0 0 12px;">CLD · EIP · OPM · VSM · NRM</p>
        <button class="open-graph" style="cursor:pointer;">Open Graph Tool ↗</button>
      </div>
    `)
  }

  function bind($item, item) {
    $item.find('.open-graph').on('click', () => {
      const popup = window.open(GRAPH_URL, WINDOW_NAME, 'popup,height=820,width=1440')
      if (popup) popup.focus()
    })
    $item.on('dblclick', () => wiki.textEditor($item, item))
  }

  // Listen for messages posted back from the graph tool popup
  function graphListener(event) {
    if (event.origin !== 'http://localhost:8765') return
    if (!event.source || !event.source.opener) return

    const { data } = event
    const { action, title, site, pageKey, keepLineup } = data

    switch (action) {
      case 'doInternalLink': {
        const $page = keepLineup
          ? null
          : $('.page').filter((i, el) => $(el).data('key') == pageKey)
        wiki.doInternalLink(title, $page, site)
        break
      }
      case 'showResult': {
        wiki.showResult(wiki.newPage(data.page), { $page: keepLineup ? null : undefined })
        break
      }
      default:
        if (wiki.debug) console.log('rcn-graph listener — unknown action:', data)
    }
  }

  if (typeof window !== 'undefined') {
    window.plugins['rcn-graph'] = { emit, bind }
    if (!window.rcnGraphListener) {
      window.rcnGraphListener = graphListener
      window.addEventListener('message', graphListener)
    }
  }

})()
