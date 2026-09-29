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

  // ── Lineup merging ────────────────────────────────────────────────────
  // FedWiki's own Map plugin: each map item adds class `marker-source` and a
  // markerData() of its points; a map whose text has a LINEUP line collects
  // them from every item to its left and draws them with its own; ❄ freezes
  // the collection into the page. This plugin takes part both ways — it is a
  // native marker source, so a native LINEUP map collects RCN points — and it
  // adds a richer offer, `rcnmap-source` / rcnMapData(), so an RCN map
  // collecting from RCN maps merges the TIES as well as the points: a tie whose
  // ends come from different pages joins them into one network.
  const lineupOn = item => /^LINEUP\s*$/m.test(String(item.text || ''))
  const keyOf = p => String(p.wikiTitle || p.label || '').replace(/\s+/g, ' ').trim().toLowerCase()

  // Merge maps. A point is the same point when it names the same page (else the
  // same label); the first copy wins. Kinds and link kinds merge by key; if two
  // sources give one key different colours, the later one is renamed so each
  // keeps its own. Ties are remapped onto the merged points and deduplicated.
  function merge (parts) {
    const out = { types: {}, linkKinds: {}, parcels: [], links: [] }
    const byKey = new Map(), seenL = new Set()
    const same = (a, b) => a && b && a.color === b.color && a.label === b.label
    parts.forEach((part, pi) => {
      const tmap = {}, kmap = {}, idmap = {}
      Object.entries(part.types || {}).forEach(([k, t]) => {
        let kk = k; if (out.types[kk] && !same(out.types[kk], t)) kk = k + '@' + pi
        out.types[kk] = out.types[kk] || t; tmap[k] = kk
      })
      Object.entries(part.linkKinds || {}).forEach(([k, t]) => {
        let kk = k; if (out.linkKinds[kk] && !same(out.linkKinds[kk], t)) kk = k + '@' + pi
        out.linkKinds[kk] = out.linkKinds[kk] || t; kmap[k] = kk
      })
      ;(part.parcels || []).forEach(p => {
        const key = keyOf(p)
        if (!byKey.has(key)) {
          const id = 'p' + out.parcels.length
          byKey.set(key, id)
          out.parcels.push(Object.assign({}, p, { id, type: p.type != null ? (tmap[p.type] || p.type) : p.type }))
        }
        idmap[p.id] = byKey.get(key)
      })
      ;(part.links || []).forEach(l => {
        const a = idmap[l.from], b = idmap[l.to]
        if (!a || !b) return
        const kind = kmap[l.kind] || l.kind, k = a + '|' + b + '|' + kind
        if (!seenL.has(k)) { seenL.add(k); out.links.push(Object.assign({}, l, { from: a, to: b, kind })) }
      })
    })
    return out
  }

  // Every map to the left of this item: full data from RCN maps, points only
  // from native Map items.
  function collect ($item) {
    const all = $('.item'), here = all.index($item), out = []
    all.slice(0, here).each(function () {
      if (this.rcnMapData) out.push(this.rcnMapData())
      else if ($(this).hasClass('marker-source') && this.markerData) {
        out.push({ parcels: this.markerData().map((mk, i) => ({
          id: 'm' + i, label: String(mk.label || '').replace(/<[^>]*>/g, '').replace(/\[\[(.*?)\]\]/g, '$1').trim() || (mk.lat + ', ' + mk.lon),
          latLng: [mk.lat, mk.lon] })) })
      }
    })
    return out
  }

  // What this item draws: its own, then (frozen ? the frozen collection :
  // LINEUP ? what the maps to its left offer now : nothing).
  function effective ($item, item) {
    const own = model(item)
    if (item.frozen) return merge([own, item.frozen])
    if (lineupOn(item) && $item) return merge([own, ...collect($item)])
    return own
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
    // Offer this map to any LINEUP map to its right — the native way (points)
    // and the RCN way (points and ties). Set before drawing.
    const el = $item.get(0), slug = $item.parents('.page:first').attr('id') || ''
    const offered = () => item.frozen ? merge([model(item), item.frozen]) : model(item)
    $item.addClass('marker-source rcnmap-source')
    el.markerData = () => offered().parcels.map(p => ({ lat: p.latLng[0], lon: p.latLng[1], label: p.wikiTitle ? '[[' + p.wikiTitle + ']]' : p.label }))
    el.markerGeo = () => ({ type: 'FeatureCollection', features: offered().parcels.map(p => ({
      type: 'Feature', geometry: { type: 'Point', coordinates: [p.latLng[1], p.latLng[0]] }, properties: { label: p.label } })) })
    el.rcnMapData = () => Object.assign({ source: slug }, offered())
    const m = effective($item, item)
    const lineup = lineupOn(item)
    const controls = lineup
      ? `<div style="padding:6px 0 0;text-align:center;font-size:11px;color:#64748b;">`
        + (item.frozen ? `Frozen: ${m.parcels.length} points and ${m.links.length} ties kept in this page. `
          : `Collected from ${collect($item).length} map(s) to the left. `)
        + `<button class="rcnm-freeze" title="${item.frozen ? 'Frozen: shift-click to unfreeze' : 'Freeze what the lineup shows into this page'}" style="cursor:pointer;${item.frozen ? 'color:#2563eb;' : ''}">❄︎</button> `
        + `<button class="rcnm-refresh" title="Collect again from the maps to the left" style="cursor:pointer;"${item.frozen ? ' disabled' : ''}>↻</button></div>`
      : ''
    const id = 'rcnmap-' + Math.floor(Math.random() * 1e9)
    $item.append(`
      <div style="background:#f5f5f5;padding:8px;">
        <div id="${id}" style="height:320px;border:1px solid #ddd;background:#e5e7eb;"></div>
        <div class="rcnm-legend" style="font-size:11px;color:#475569;padding:6px 2px 0;line-height:1.7;">${legendHTML(m)}</div>
        <p class="caption" style="margin:4px 0 0;">${wiki.resolveLinks ? wiki.resolveLinks(esc(caption(item))) : esc(caption(item))}</p>
        ${controls}
      </div>
      <style>
        .rcnm-key{display:inline-flex;align-items:center;gap:4px;margin-right:10px;white-space:nowrap}
        .rcnm-dot{display:inline-block;width:9px;height:9px;border-radius:50%;border:1px solid #fff;box-shadow:0 0 0 1px #cbd5e1}
      </style>`)
    if (!m.parcels.length) {
      $item.find('#' + id).html(lineup
        ? '<p style="padding:12px;color:#64748b">Nothing to collect yet. Open co-op pages to the left of this one, then press ↻.</p>'
        : '<p style="padding:12px;color:#64748b">No points yet. Double-click to add lines of the form <code>48.75, -122.48 Name</code>.</p>')
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

  function save ($item, item) {
    wiki.pageHandler.put($item.parents('.page:first'), { type: 'edit', id: item.id, item })
    emit($item, item)
  }

  function bind ($item, item) {
    $item.dblclick(e => { if (!$(e.target).closest('button').length) wiki.textEditor($item, item) })
    $item.on('click', '.rcnm-refresh', e => { e.stopPropagation(); emit($item, item) })
    $item.on('click', '.rcnm-freeze', e => {
      e.stopPropagation()
      if (e.shiftKey) { if (item.frozen) { delete item.frozen; save($item, item) } return }
      const got = merge(collect($item))
      if (!got.parcels.length) return
      item.frozen = item.frozen ? merge([item.frozen, got]) : got
      save($item, item)
    })
  }

  if (typeof window !== 'undefined') {
    window.plugins.rcnmap = { emit, bind }
  }
  if (typeof module !== 'undefined') {
    module.exports = { model, caption, merge, lineupOn }
  }

})()
