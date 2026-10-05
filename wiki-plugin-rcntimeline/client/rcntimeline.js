(function () {

  // RCN Timeline — a small timeline on a wiki page: intervals as bars with their
  // fuzzy edges, the links between them, a date axis. The full RCN Timeline
  // (tools/rcn-timeline.html) solves and edits; this draws what the item holds.
  //
  //   item.timeline = { intervals:[{id,label,start,end,startFuzz,endFuzz,color,
  //                                 row,who,conf,note,page?,coops?}],
  //                     links:[{from,to,rel,who,note}] }
  //     — the Timeline tool's own export format. Dates are drawn as stored; no
  //       solving happens here. `page` names the wiki page a bar opens.
  //     — `rel` may be one relation ("meets") or a list (["before","meets"]),
  //       so the tool's parked relation-sets work does not break this plugin.
  //   item.text = first line the caption; the rest the intervals and links in
  //               words, for search and for wikis without this plugin.
  //
  // An item with no `timeline` is drawn from its text, in the tool's own
  // sentence form: "Label = Jan 2020 .. Jun 2021" (or "= 1970 .. 2026").

  const MON = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
  const MON_NAME = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const PALETTE = ['#2563eb', '#c0392b', '#1a7a4a', '#8e5cc4', '#d4a017', '#d4549a', '#0d9488', '#64748b']
  const ROW_H = 26, BAR_H = 14, AXIS_H = 22, PAD = 10
  const LINK_COLOR = '#7c3aed'
  const NS = 'http://www.w3.org/2000/svg'

  // The full RCN Timeline. A local wiki opens the working copy served on :8765;
  // anywhere else the site's own copy in its assets. An item may name its own
  // with a `tool` field. The tool opens any timeline passed as #tl=<base64 JSON>,
  // so opening needs nothing from the tool but that.
  const LOCAL = /(^|\.)localhost$/.test(window.location.hostname)
  const TOOL_URL = LOCAL
    ? 'http://localhost:8765/tools/rcn-timeline.html'
    : window.location.origin + '/assets/rcn-timeline/rcn-timeline.html'
  const b64 = str => btoa(unescape(encodeURIComponent(str)))

  const esc = s => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

  // "Jul 1 2019", "Jul 2019", "2019", "2019-07-01" -> fractional year.
  function toYear (d) {
    if (d == null || d === '') return null
    if (typeof d === 'number') return d
    const s = String(d).trim()
    let m
    if ((m = /^(-?\d{1,4})$/.exec(s))) return +m[1]
    if ((m = /^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?$/.exec(s))) return frac(+m[1], +m[2] - 1, +(m[3] || 1))
    if ((m = /^([A-Za-z]{3})[a-z]*\.?\s+(?:(\d{1,2}),?\s+)?(\d{4})$/.exec(s))) {
      const mo = MON.indexOf(m[1].toLowerCase())
      if (mo >= 0) return frac(+m[3], mo, +(m[2] || 1))
    }
    const t = Date.parse(s)
    return isNaN(t) ? null : frac(new Date(t).getUTCFullYear(), new Date(t).getUTCMonth(), new Date(t).getUTCDate())
  }
  function frac (y, mo, day) {
    const a = Date.UTC(y, 0, 1), b = Date.UTC(y + 1, 0, 1)
    return y + (Date.UTC(y, mo, day) - a) / (b - a)
  }
  function fmt (y) {
    const yr = Math.floor(y), d = new Date(Date.UTC(yr, 0, 1) + (y - yr) * (Date.UTC(yr + 1, 0, 1) - Date.UTC(yr, 0, 1)))
    return MON_NAME[d.getUTCMonth()] + ' ' + d.getUTCDate() + ' ' + d.getUTCFullYear()
  }
  const relWords = r => Array.isArray(r) ? 'one of ' + r.join(', ') : (r || 'before')

  function caption (item) { return String(item.text || '').split('\n')[0] }

  // The item's own intervals and links, as stored (or read from its text).
  function rawOf (item) {
    if (item.timeline && Array.isArray(item.timeline.intervals)) {
      return { intervals: item.timeline.intervals, links: item.timeline.links || [] }
    }
    const ivs = []
    String(item.text || '').split('\n').forEach((line, i) => {
      const m = /^(.+?)\s*=\s*(.+?)\s*\.\.\s*(.+)$/.exec(line.trim())
      if (m) ivs.push({ id: 't' + i, label: m[1], start: m[2], end: m[3] })
    })
    return { intervals: ivs, links: [] }
  }

  const lineupOn = item => /^LINEUP\s*$/m.test(String(item.text || ''))

  // Merge timelines from several sources — this item's own, its frozen
  // collection, the pages to its left. An interval is the same interval when
  // its id is the same (the co-op timeline's ids are global), so the first copy
  // wins. Lanes are kept per source: a source's row N stays one lane, placed
  // after the lanes already taken, so a firm and the co-op it became stay side
  // by side. Links merge on from + to + relation.
  function merge (parts) {
    const seen = new Set(), lanes = new Map(), intervals = [], links = [], seenL = new Set()
    parts.forEach((part, pi) => {
      (part.intervals || []).forEach(v => {
        if (seen.has(v.id)) return
        seen.add(v.id)
        const key = pi + ':' + (v.row == null ? v.id : v.row)
        if (!lanes.has(key)) lanes.set(key, lanes.size)
        intervals.push(Object.assign({}, v, { row: lanes.get(key) }))
      })
      ;(part.links || []).forEach(l => {
        const k = l.from + '|' + l.to + '|' + JSON.stringify(l.rel || 'before')
        if (!seenL.has(k)) { seenL.add(k); links.push(l) }
      })
    })
    return { intervals, links }
  }

  // What this item draws: its own, then (frozen ? the frozen collection :
  // LINEUP ? what the pages to its left offer now : nothing).
  function effective ($item, item) {
    const parts = [rawOf(item)]
    if (item.frozen) parts.push(item.frozen)
    else if (lineupOn(item) && $item) parts.push(...collect($item))
    return parts.length === 1 ? parts[0] : merge(parts)
  }

  // Every timeline to the left of this item in the lineup — earlier pages, and
  // earlier items on this page — the way the native Map plugin's LINEUP reads
  // marker sources. Browser-side only: pages open in this window, nothing fetched.
  function collect ($item) {
    const all = $('.item'), here = all.index($item)
    const out = []
    all.slice(0, here).filter('.rcntimeline-source').each(function () {
      if (this.timelineData) out.push(this.timelineData())
    })
    return out
  }

  function model (item, $item) { return normalize(effective($item, item)) }

  // Dates as fractional years, lanes packed top to bottom.
  function normalize (raw) {
    const ivs = raw.intervals, links = raw.links
    const out = []
    ivs.forEach((v, i) => {
      const s = toYear(v.start != null ? v.start : v.s)
      if (s == null) return
      let e = toYear(v.end != null ? v.end : v.e)
      if (e == null) e = s + 1
      out.push(Object.assign({}, v, {
        s, e, sf: +(v.startFuzz != null ? v.startFuzz : v.sf) || 0, ef: +(v.endFuzz != null ? v.endFuzz : v.ef) || 0,
        color: v.color || PALETTE[i % PALETTE.length], row: v.row == null ? i : v.row
      }))
    })
    // Lanes in use, packed top to bottom in their original order.
    const lanes = Array.from(new Set(out.map(v => v.row))).sort((a, b) => a - b)
    out.forEach(v => { v.lane = lanes.indexOf(v.row) })
    return { intervals: out, links, lanes: lanes.length }
  }

  // A tick step that gives four to seven labels across the span.
  function ticks (lo, hi) {
    const span = hi - lo
    const steps = [1 / 12, 0.25, 0.5, 1, 2, 5, 10, 20, 25, 50, 100]
    const step = steps.find(s => span / s <= 7) || 100
    const out = []
    for (let t = Math.ceil(lo / step) * step; t <= hi + 1e-9; t += step) {
      out.push({ t, label: step >= 1 ? String(Math.round(t)) : fmt(t).replace(/ \d+ /, ' ') })
    }
    return out
  }

  let measureCtx = null
  function textWidth (s) {
    measureCtx = measureCtx || document.createElement('canvas').getContext('2d')
    measureCtx.font = '600 11px system-ui, -apple-system, sans-serif'
    return measureCtx.measureText(s).width + 4
  }
  function fitText (s, w) {
    if (textWidth(s) <= w) return s
    if (w < textWidth(s.slice(0, 3) + '…')) return ''
    let lo = 3, hi = s.length
    while (lo < hi) { const m = Math.ceil((lo + hi) / 2); if (textWidth(s.slice(0, m).trimEnd() + '…') <= w) lo = m; else hi = m - 1 }
    return s.slice(0, lo).trimEnd() + '…'
  }

  function draw ($item, item, m) {
    const W = Math.max(280, ($item.width() || 420) - 18)
    const H = AXIS_H + m.lanes * ROW_H + PAD
    let lo = Math.min(...m.intervals.map(v => v.s - v.sf)), hi = Math.max(...m.intervals.map(v => v.e + v.ef))
    const pad = Math.max((hi - lo) * 0.03, 0.25); lo -= pad; hi += pad
    const x = t => PAD + (t - lo) / (hi - lo) * (W - 2 * PAD)
    const yMid = lane => AXIS_H + lane * ROW_H + ROW_H / 2
    const byId = {}; m.intervals.forEach(v => { byId[v.id] = v })

    const parts = []
    const defs = []
    // axis
    ticks(lo, hi).forEach(k => {
      parts.push(`<line x1="${x(k.t)}" y1="${AXIS_H - 4}" x2="${x(k.t)}" y2="${H - PAD / 2}" stroke="#eef2f7"/>`)
      parts.push(`<text x="${x(k.t) + 3}" y="${AXIS_H - 8}" font-size="10" fill="#94a3b8">${esc(k.label)}</text>`)
    })
    parts.push(`<line x1="0" y1="${AXIS_H - 4}" x2="${W}" y2="${AXIS_H - 4}" stroke="#e2e8f0"/>`)

    // bars: the fuzz shoulders fade in and out, the core is solid
    m.intervals.forEach((v, i) => {
      const y = yMid(v.lane) - BAR_H / 2, gid = 'g' + Math.floor(Math.random() * 1e9) + i
      defs.push(`<linearGradient id="${gid}L"><stop offset="0" stop-color="${esc(v.color)}" stop-opacity="0"/><stop offset="1" stop-color="${esc(v.color)}" stop-opacity=".75"/></linearGradient>`)
      defs.push(`<linearGradient id="${gid}R"><stop offset="0" stop-color="${esc(v.color)}" stop-opacity=".75"/><stop offset="1" stop-color="${esc(v.color)}" stop-opacity="0"/></linearGradient>`)
      const xs = x(v.s), xe = Math.max(x(v.e), xs + 2)
      const tip = [v.label, fmt(v.s) + ' – ' + fmt(v.e),
        (v.sf || v.ef) ? 'uncertain by ' + [v.sf ? v.sf + ' yr before' : '', v.ef ? v.ef + ' yr after' : ''].filter(Boolean).join(', ') : '',
        v.who ? 'Source: ' + v.who : '', v.conf != null ? 'Confidence ' + Math.round(v.conf * 100) + '%' : '',
        v.note || '', v.page ? '— click to open ' + v.page : ''].filter(Boolean).join('\n')
      parts.push(`<g class="rcnt-bar" data-page="${esc(v.page || '')}" style="cursor:${v.page ? 'pointer' : 'default'}"><title>${esc(tip)}</title>`
        + (v.sf ? `<rect x="${x(v.s - v.sf)}" y="${y}" width="${xs - x(v.s - v.sf)}" height="${BAR_H}" fill="url(#${gid}L)"/>` : '')
        + (v.ef ? `<rect x="${xe}" y="${y}" width="${x(v.e + v.ef) - xe}" height="${BAR_H}" fill="url(#${gid}R)"/>` : '')
        + `<rect x="${xs}" y="${y}" width="${xe - xs}" height="${BAR_H}" rx="3" fill="${esc(v.color)}" fill-opacity=".85"/></g>`)
    })

    // links, over the bars: from the end of one to the start of the other
    m.links.forEach(l => {
      const a = byId[l.from], b = byId[l.to]
      if (!a || !b) return
      const rel = Array.isArray(l.rel) ? null : (l.rel || 'before')
      const x1 = rel === 'during' ? x((a.s + a.e) / 2) : x(a.e), y1 = yMid(a.lane)
      const x2 = rel === 'during' ? x((a.s + a.e) / 2) : x(b.s), y2 = yMid(b.lane)
      const dy = Math.max(12, Math.abs(y2 - y1) / 2)
      parts.push(`<path d="M${x1},${y1} C${x1},${y1 + (y2 > y1 ? dy : -dy)} ${x2},${y2 - (y2 > y1 ? dy : -dy)} ${x2},${y2}" fill="none" stroke="${LINK_COLOR}" stroke-width="1.2" stroke-opacity=".7"${Array.isArray(l.rel) ? ' stroke-dasharray="3 3"' : ''}><title>${esc(a.label + ' ' + relWords(l.rel) + ' ' + b.label + (l.who ? '\nSource: ' + l.who : '') + (l.note ? '\n' + l.note : ''))}</title></path>`)
    })

    // labels last, on a white halo. At the bar's start when it fits there,
    // stopped short of the next bar in the same lane. A late, short bar whose
    // label runs off the right edge gets it just BEFORE the bar instead, ending
    // where the bar begins — pushed back over empty years it would read as a
    // bar that started decades early. Only when an earlier bar in the lane
    // fills that space does the label fall back to hugging the right edge.
    // Laid out right to left within each lane, so an earlier label stops where
    // a later one begins — a firm's label gives way to the co-op it became.
    const limit = {}
    m.intervals.slice().sort((a, b) => a.lane - b.lane || b.s - a.s).forEach(v => {
      let lx = Math.max(x(v.s) + 4, 4)
      const next = m.intervals.filter(o => o !== v && o.lane === v.lane && o.s > v.s).reduce((a, o) => Math.min(a, o.s), Infinity)
      const stop = Math.min(next < Infinity ? x(next) : W, limit[v.lane] != null ? limit[v.lane] : W)
      let room = stop - lx - 4
      const w = textWidth(v.label)
      if (next === Infinity && w > room) {
        const prevEnd = m.intervals.filter(o => o !== v && o.lane === v.lane && o.s < v.s)
          .reduce((a, o) => Math.max(a, x(o.e + o.ef)), 0)
        const before = x(v.s - v.sf) - 4 - w
        if (before >= Math.max(4, prevEnd + 4)) { lx = before; room = w }
        else { lx = Math.max(4, W - w - 4); room = W - lx - 4 }
      }
      const t = fitText(v.label, room)
      if (t) limit[v.lane] = Math.min(limit[v.lane] != null ? limit[v.lane] : W, lx - 6)
      if (t) parts.push(`<text x="${lx}" y="${yMid(v.lane) + 4}" font-size="11" font-weight="600" fill="#1e293b" paint-order="stroke" stroke="#fff" stroke-width="3" stroke-linejoin="round" pointer-events="none">${esc(t)}</text>`)
    })

    return `<svg xmlns="${NS}" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="display:block;font-family:system-ui,-apple-system,sans-serif"><defs>${defs.join('')}</defs>${parts.join('')}</svg>`
  }

  function emit ($item, item) {
    $item.empty()
    // Offer this item's timeline (its own, plus anything frozen into it) to any
    // LINEUP timeline to its right. Set before drawing, so a timeline further
    // right that renders first still finds it.
    $item.addClass('rcntimeline-source')
    const slug = $item.parents('.page:first').attr('id') || ''
    $item.get(0).timelineData = () => {
      const own = item.frozen ? merge([rawOf(item), item.frozen]) : rawOf(item)
      return { intervals: own.intervals, links: own.links, source: slug }
    }
    const m = model(item, $item)
    const cap = wiki.resolveLinks ? wiki.resolveLinks(esc(caption(item))) : esc(caption(item))
    const lineup = lineupOn(item)
    const controls = lineup
      ? `<button class="rcnt-freeze" title="${item.frozen ? 'Frozen: shift-click to unfreeze' : 'Freeze what the lineup shows into this page'}" style="cursor:pointer;${item.frozen ? 'color:#2563eb;' : ''}">❄︎</button>
         <button class="rcnt-refresh" title="Collect again from the pages to the left" style="cursor:pointer;"${item.frozen ? ' disabled' : ''}>↻</button> `
      : ''
    if (!m.intervals.length) {
      $item.append(`<div style="background:#f5f5f5;padding:12px;color:#64748b">`
        + (lineup ? `Nothing to collect yet. Open co-op pages to the left of this one, then press ↻. ${controls}`
          : `No intervals yet. Double-click and add lines of the form <code>Label = Jan 2020 .. Jun 2021</code>.`)
        + `</div>`)
      return
    }
    const note = lineup ? `<p class="caption" style="margin:2px 0 0;color:#64748b">${item.frozen
      ? 'Frozen: ' + m.intervals.length + ' intervals kept in this page.'
      : 'Collected from ' + collect($item).length + ' timeline(s) to the left.'}</p>` : ''
    $item.append(`<div style="background:#f5f5f5;padding:8px;">
      <div class="rcnt-canvas" style="background:#fff;border:1px solid #ddd;overflow-x:auto"></div>
      <p class="caption" style="margin:4px 0 0;">${cap}</p>${note}
      <div style="padding:6px 0 0;text-align:center;">${controls}<button class="rcnt-open" style="cursor:pointer;">Open in RCN Timeline ↗</button></div></div>`)
    // Width is known only once the item is in the page.
    const paint = () => $item.find('.rcnt-canvas').html(draw($item, item, m))
    paint()
    setTimeout(paint, 0)
  }

  // Open this item's timeline (what it draws, lineup included) in the full
  // tool, in its own window. The tool's "Save to wiki" posts the edited
  // timeline back; it lands in the item opened last.
  let pending = null      // {item, $item, win} — the item the tool will save into
  function openTool ($item, item) {
    const raw = effective($item, item)
    const tl = item.timeline && !item.frozen && !lineupOn(item) ? raw : {
      intervals: raw.intervals.map(v => Object.assign({}, v, v.start == null ? { start: fmt(toYear(v.s)), end: fmt(toYear(v.e)) } : {})),
      links: raw.links
    }
    const doc = Object.assign({ name: caption(item) || 'Timeline' }, tl)
    const url = (item.tool || TOOL_URL) + '#tl=' + b64(JSON.stringify(doc))
    const win = window.open(url, 'rcntimeline')
    pending = { item, $item, win }
    if (win) win.focus()
  }

  // The text an item carries beside its timeline: caption, then the intervals
  // and links in words (search reads it; a wiki without the plugin shows it).
  function words (item, tl) {
    const byId = {}; tl.intervals.forEach(v => { byId[v.id] = v })
    const keep = String(item.text || '').split('\n').filter(l => /^LINEUP\s*$/.test(l))
    return [caption(item)].concat(keep,
      tl.intervals.map(v => v.label + ': ' + v.start + ' – ' + v.end),
      tl.links.filter(l => byId[l.from] && byId[l.to])
        .map(l => byId[l.from].label + ' ' + relWords(l.rel) + ' ' + byId[l.to].label)).join('\n')
  }

  function save ($item, item) {
    wiki.pageHandler.put($item.parents('.page:first'), { type: 'edit', id: item.id, item })
    emit($item, item)
  }

  // Save-back from the full tool. Only the window this page opened is heard,
  // and it saves into the item opened last.
  function toolListener (event) {
    if (!pending || !event.data || event.data.toolType !== 'rcn-timeline') return
    if (pending.win && event.source !== pending.win) return
    if (event.data.action !== 'saveTimeline' || !event.data.timeline) return
    const { item, $item } = pending
    const tl = event.data.timeline
    item.timeline = { intervals: tl.intervals || [], links: tl.links || [] }
    delete item.frozen   // what was frozen is now in the item's own timeline
    item.text = words(item, item.timeline)
    save($item, item)
    try { event.source.postMessage({ toolType: 'rcn-timeline', action: 'saved', page: $item.parents('.page:first').data('data').title }, '*') } catch (e) {}
  }


  // ⓘ — this plugin's About page in one click. FedWiki opens it with Cmd/Ctrl-I,
  // but only from the item's text editor, which people seldom open when the real
  // work happens elsewhere. Redraws empty the item, so the mark puts itself back.
  function aboutMark ($item, type) {
    const el = $item.get(0)
    if (!el || el.__aboutMark) return
    el.__aboutMark = true
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative'
    const add = () => {
      if (el.querySelector(':scope > .rcn-about')) return
      const a = document.createElement('a')
      a.className = 'rcn-about'
      a.href = '/view/about-' + type + '-plugin'
      a.title = 'About this plugin'
      a.textContent = 'ⓘ'
      a.style.cssText = 'position:absolute;top:0;right:-18px;z-index:1000;font:15px/1 system-ui,sans-serif;color:#64748b;text-decoration:none;cursor:pointer;background:rgba(255,255,255,.75);border-radius:50%;padding:1px 2px'
      a.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()
        wiki.doInternalLink('about ' + type + ' plugin', $item.parents('.page:first'))
      })
      a.addEventListener('dblclick', e => e.stopPropagation())
      el.appendChild(a)
    }
    add()
    new MutationObserver(add).observe(el, { childList: true })
  }

  function bind ($item, item) {
    aboutMark($item, 'rcntimeline')
    $item.dblclick(e => { if (!$(e.target).closest('button').length) wiki.textEditor($item, item) })
    $item.on('click', '.rcnt-open', e => { e.stopPropagation(); openTool($item, item) })
    $item.on('click', '.rcnt-refresh', e => { e.stopPropagation(); emit($item, item) })
    $item.on('click', '.rcnt-freeze', e => {
      e.stopPropagation()
      if (e.shiftKey) { if (item.frozen) { delete item.frozen; save($item, item) } return }
      const got = merge(collect($item))
      if (!got.intervals.length) return
      item.frozen = item.frozen ? merge([item.frozen, got]) : got
      save($item, item)
    })
    $item.on('click', '.rcnt-bar', function (e) {
      const page = this.getAttribute('data-page')
      if (!page) return
      e.stopPropagation()
      wiki.doInternalLink(page, e.shiftKey ? null : $item.parents('.page:first'))
    })
  }

  if (typeof window !== 'undefined') {
    window.plugins.rcntimeline = { emit, bind }
    if (!window.rcnTimelineListener) {
      window.rcnTimelineListener = toolListener
      window.addEventListener('message', toolListener)
    }
  }
  if (typeof module !== 'undefined') {
    module.exports = { model, rawOf, merge, normalize, lineupOn, toYear, fmt, ticks, relWords, caption }
  }

})()
