(function () {

  // RCN Map — a small map on a wiki page that draws points AND the ties between
  // them. FedWiki's own Map plugin draws points only; the full RCN Map is a
  // full-screen tool in the site's assets. This sits between the two: the item
  // holds its own subject (a few KB in the RCN Map issue-file shape) and draws
  // it in the page column.
  //
  //   item.map  = { types, linkKinds, parcels:[{id,label,wikiTitle,type,latLng}],
  //                 links:[{from,to,kind,label}], view? }
  //   item.text = first line is the caption; the rest is a plain-words list of
  //               the points and ties, so FedWiki search finds them and a wiki
  //               without this plugin still shows something readable.
  //
  // An item with no `map` (a fresh one from the Factory) is drawn from its text
  // instead: every "lat, lon label" line is a point, the way the native Map
  // plugin reads it. Ties need `map`.
  //
  // Plan and later steps (lineup merging, popup round trip): docs/rcn-map-plugin-plan.md

  // Same Leaflet the native Map plugin loads, so the two share one copy on a
  // page instead of fighting over window.L.
  const LEAFLET_JS = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js'
  const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css'
  // Esri's light-grey canvas, the RCN Map's "Light" basemap: no key, and no
  // referrer requirement (tile.openstreetmap.org refuses referrer-less requests).
  const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/'
  const DEFAULT_COLOR = '#64748b'

  const esc = s => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

  // A "lat, lon label" line, as the native Map plugin reads it.
  const POINT = /^(-?\d{1,3}\.?\d*)[, ] *(-?\d{1,3}\.?\d*)\s*(.*)$/

  function caption (item) {
    return String(item.text || '').split('\n')[0]
  }

  // The data to draw: item.map, or points read from the text.
  function model (item) {
    if (item.map && Array.isArray(item.map.parcels)) return item.map
    const parcels = []
    String(item.text || '').split('\n').forEach((line, i) => {
      const m = POINT.exec(line.trim())
      if (!m) return
      const label = m[3].replace(/\[\[(.*?)\]\]/g, '$1').trim()
      parcels.push({ id: 'p' + i, label: label || (m[1] + ', ' + m[2]), latLng: [+m[1], +m[2]] })
    })
    return { types: {}, linkKinds: {}, parcels, links: [] }
  }

  function loadLeaflet (done) {
    if (!document.querySelector(`link[href='${LEAFLET_CSS}']`)) {
      $(`<link rel="stylesheet" href="${LEAFLET_CSS}">`).appendTo('head')
    }
    if (window.L && window.L.map) return done()
    wiki.getScript(LEAFLET_JS, done)
  }

  function legendHTML (m) {
    const usedTypes = new Set(m.parcels.map(p => p.type))
    const usedKinds = new Set((m.links || []).map(l => l.kind))
    const rows = []
    Object.keys(m.types || {}).filter(k => usedTypes.has(k)).forEach(k => {
      const t = m.types[k]
      rows.push(`<span class="rcnm-key"><span class="rcnm-dot" style="background:${esc(t.color)}"></span>${esc(t.label)}</span>`)
    })
    Object.keys(m.linkKinds || {}).filter(k => usedKinds.has(k)).forEach(k => {
      const lk = m.linkKinds[k]
      rows.push(`<span class="rcnm-key"><svg width="20" height="8"><line x1="0" y1="4" x2="20" y2="4" stroke="${esc(lk.color)}" stroke-width="${Math.min(3, lk.weight || 2)}" stroke-dasharray="${esc(lk.dash || '')}"/></svg>${esc(lk.label)}</span>`)
    })
    return rows.join('')
  }

  function emit ($item, item) {
    $item.empty()
    const m = model(item)
    const id = 'rcnmap-' + Math.floor(Math.random() * 1e9)
    $item.append(`
      <div style="background:#f5f5f5;padding:8px;">
        <div id="${id}" style="height:320px;border:1px solid #ddd;background:#e5e7eb;"></div>
        <div class="rcnm-legend" style="font-size:11px;color:#475569;padding:6px 2px 0;line-height:1.7;">${legendHTML(m)}</div>
        <p class="caption" style="margin:4px 0 0;">${wiki.resolveLinks ? wiki.resolveLinks(esc(caption(item))) : esc(caption(item))}</p>
      </div>
      <style>
        .rcnm-key{display:inline-flex;align-items:center;gap:4px;margin-right:10px;white-space:nowrap}
        .rcnm-dot{display:inline-block;width:9px;height:9px;border-radius:50%;border:1px solid #fff;box-shadow:0 0 0 1px #cbd5e1}
      </style>`)
    if (!m.parcels.length) {
      $item.find('#' + id).html('<p style="padding:12px;color:#64748b">No points yet. Double-click to add lines of the form <code>48.75, -122.48 Name</code>.</p>')
      return
    }
    loadLeaflet(() => draw($item, item, m, id))
  }

  function draw ($item, item, m, id) {
    const L = window.L
    const map = L.map(id, { scrollWheelZoom: false, zoomControl: true, attributionControl: true })
    L.tileLayer(ESRI + 'World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      maxNativeZoom: 16, maxZoom: 19,
      attribution: 'Tiles © Esri — Esri, HERE, Garmin, © OpenStreetMap contributors'
    }).addTo(map)
    L.tileLayer(ESRI + 'World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
      maxNativeZoom: 16, maxZoom: 19
    }).addTo(map)

    const byId = {}
    m.parcels.forEach(p => { byId[p.id] = p })

    // Ties first, so the points sit on top and stay clickable.
    ;(m.links || []).forEach(l => {
      const a = byId[l.from], b = byId[l.to]
      if (!a || !b) return
      const k = (m.linkKinds || {})[l.kind] || {}
      L.polyline([a.latLng, b.latLng], {
        color: k.color || DEFAULT_COLOR, weight: k.weight || 2.5,
        dashArray: k.dash || null, opacity: 0.85
      }).bindTooltip(esc(l.label || k.label || ''), { sticky: true }).addTo(map)
    })

    const $page = $item.parents('.page:first')
    m.parcels.forEach(p => {
      const t = (m.types || {})[p.type] || {}
      const c = p.contact || {}
      const tip = `<b>${esc(p.label)}</b>` + (t.label ? `<br>${esc(t.label)}` : '')
        + (c.website ? `<br>${esc(c.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''))}` : '')
        + (c.phone ? `<br>${esc(c.phone)}` : '')
        + '<br><i style="color:#64748b">click to open its page</i>'
      L.circleMarker(p.latLng, {
        radius: 7, fillColor: t.color || DEFAULT_COLOR, color: '#fff', weight: 1.5, fillOpacity: 0.95
      }).bindTooltip(tip, { direction: 'top', offset: [0, -6] })
        .on('click', () => wiki.doInternalLink(p.wikiTitle || p.label, $page))
        .addTo(map)
    })

    const v = m.view
    if (v && v.lat != null) {
      map.setView([v.lat, v.lng], v.zoom || 11)
    } else if (m.parcels.length === 1) {
      map.setView(m.parcels[0].latLng, 13)
    } else {
      map.fitBounds(L.latLngBounds(m.parcels.map(p => p.latLng)), { padding: [24, 24], maxZoom: 15 })
    }

    // Dragging the map must not drag the item, and a double-click on the map
    // should open the editor, as it does anywhere else on the item.
    L.DomEvent.disableClickPropagation(document.getElementById(id))
    map.doubleClickZoom.disable()
  }

  function bind ($item, item) {
    $item.dblclick(() => wiki.textEditor($item, item))
  }

  if (typeof window !== 'undefined') {
    window.plugins.rcnmap = { emit, bind }
  }
  if (typeof module !== 'undefined') {
    module.exports = { model, caption }
  }

})()
