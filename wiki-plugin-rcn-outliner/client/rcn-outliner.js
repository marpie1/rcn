(function () {

  const OUTLINER_URL = 'http://localhost:8765/tools/more-outliner.html'
  const WINDOW_NAME = 'rcn-outliner'

  function emit($item, item) {
    $item.append(`
      <div style="background-color:#eee;padding:15px;text-align:center;">
        <p style="font-weight:bold;margin:0 0 6px;">MORE Outliner</p>
        <p style="color:#666;font-size:0.85em;margin:0 0 12px;">Outline · Hoist · Export MD / HTML / FedWiki</p>
        <button class="open-outliner" style="cursor:pointer;">Open Outliner ↗</button>
      </div>
    `)
  }

  function bind($item, item) {
    $item.find('.open-outliner').on('click', () => {
      const popup = window.open(OUTLINER_URL, WINDOW_NAME, 'popup,height=820,width=1440')
      if (popup) popup.focus()
    })
    $item.on('dblclick', () => wiki.textEditor($item, item))
  }

  // Listen for messages posted back from the outliner popup
  function outlinerListener(event) {
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
        if (wiki.debug) console.log('rcn-outliner listener — unknown action:', data)
    }
  }

  if (typeof window !== 'undefined') {
    window.plugins['rcn-outliner'] = { emit, bind }
    if (!window.rcnOutlinerListener) {
      window.rcnOutlinerListener = outlinerListener
      window.addEventListener('message', outlinerListener)
    }
  }

})()
