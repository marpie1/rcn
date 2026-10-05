// wiki-plugin-mechblocks — client.
//
// A "Mech Blocks" item sits on a page beside Ward Cunningham's Mech items and
// offers three things for each of them:
//   Edit in blocks ↗   the Mech Blocks tool in a popup; Save writes the text back
//                      into the Mech item, which Ward's plugin then runs as usual.
//   Watch it run       runs the script here with Ward's own interpreter and draws
//                      the shared notebook ("state") as it fills: an oval per entry,
//                      a solid line from the block that wrote it, a dashed line to
//                      each block that read it.
//   Graph Tool ↗       when a run has made graphs (state.aspect), draws them in the
//                      RCN Graph Tool.
// The Mech items themselves are never changed except by Save, and stay ordinary
// Mech items that any wiki with Ward's plugin can run.

import { format, tree } from '../vendor/mech/interpreter.js'
import { api, blocks, run } from '../vendor/mech/blocks.js'
import { makeTracer, instrument, preview } from './trace.mjs'
import { aspectToGraphJSON } from './aspect.mjs'
import toolHTML from '../build/mech-blocks.html'

const LOCAL = /(^|\.)localhost$/.test(window.location.hostname)
const GRAPH_URL = LOCAL
  ? 'http://localhost:8765/tools/graph-tool-v22.html'
  : 'https://marc.relocalizecreativity.net/assets/Drag/graph-tool-v22.html'

// Help: the pages and slides that come with the plugin, on this site.
const SLIDES = '/plugin/mechblocks/rcn-mech-blocks-intro.pptx'
const DOCS = [['Introduction', 'Mech Blocks Introduction'], ['Manual', 'Mech Blocks Manual'], ['Reference', 'Mech Blocks Reference']]
const slugOf = title => title.replace(/\s/g, '-').replace(/[^A-Za-z0-9-]/g, '').toLowerCase()

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Families as in the Mech Blocks tool: one colour per kind of thing in the notebook.
const FAMILY = [
  [['neighborhood', 'page', 'info'], '#1d4ed8', 'sites and pages'],
  [['aspect', 'marker'], '#15803d', 'graphs'],
  [['items'], '#c2410c', 'lists of items'],
  [['assets', 'tsv', 'txt', 'csv', 'html', 'json'], '#0f766e', 'files and text'],
  [['temperature', 'tick'], '#b45309', 'readings and counts'],
  [['result', 'commons', 'recent', 'actions'], '#7c3aed', 'from the server'],
  [['turtle'], '#4b5563', 'the turtle drawing'],
]
function family(key) {
  for (const [keys, color, label] of FAMILY) if (keys.includes(key)) return { color, label }
  return { color: '#6b7280', label: 'made by CODE or a plugin' }
}

// ── one tracer for our bundled copy of Ward's blocks; events go to the notebook
//    whose rendered script owns the block (format() gives each run a unique prefix)
const notebooks = new Map()   // prefix -> Notebook
const owner = who => notebooks.get(String(who).split('.')[0])
const tracer = makeTracer(ev => owner(ev.who)?.onState(ev))
instrument(blocks, tracer, ev => owner(ev.who)?.onBlock(ev))

function ensureCSS() {
  if (!document.querySelector("link[href='/plugins/mech/mech.css']"))
    $('<link rel="stylesheet" href="/plugins/mech/mech.css" type="text/css">').appendTo('head')
  if (!document.getElementById('mechblocks-css')) {
    const style = document.createElement('style')
    style.id = 'mechblocks-css'
    style.textContent = STYLE
    document.head.appendChild(style)
  }
}

const STYLE = `
.mechblocks { background:#f6f4ee; padding:10px 12px; border-radius:6px; font-size:14px; }
.mechblocks .mb-head { display:flex; justify-content:space-between; align-items:baseline; gap:8px; margin-bottom:6px; }
.mechblocks .mb-row { background:#fff; border:1px solid #ddd; border-radius:5px; padding:6px 8px; margin:5px 0; }
.mechblocks .mb-row code { font-size:12px; white-space:pre; display:block; margin-bottom:5px; color:#333; max-height:4.6em; overflow:hidden; }
.mechblocks button { cursor:pointer; font-size:13px; margin-right:4px; }
.mechblocks .mb-none { color:#666; font-style:italic; }
.mechblocks .mb-help { font-size:12px; margin:-2px 0 6px; }
.mb-nb { margin-top:10px; background:#fff; border:1px solid #ccc; border-radius:6px; padding:8px; }
.mb-nb-bar { display:flex; flex-wrap:wrap; gap:6px; align-items:center; margin-bottom:6px; font-size:13px; }
.mb-nb-body { position:relative; display:flex; gap:56px; align-items:flex-start; }
.mb-script { flex:0 1 auto; min-width:0; background:#eee; padding:8px; border-radius:4px; }
.mb-script .block.mb-running { outline:3px solid #fbbf24; border-radius:3px; }
.mb-ovals { flex:1 0 120px; display:flex; flex-direction:column; gap:10px; padding-top:4px; }
.mb-oval { border:2px solid var(--f); border-radius:999px; padding:3px 10px; background:#fff; font-size:12px; text-align:center; transition:box-shadow .25s, background .25s; }
.mb-oval b { color:var(--f); }
.mb-oval .mb-count { display:block; font-size:10px; color:#666; }
.mb-oval.missing { border-style:dashed; border-color:#b91c1c; color:#b91c1c; }
.mb-oval.absent { border-style:dashed; border-color:#cbd5e1; color:#94a3b8; }
.mb-oval.absent b { color:#94a3b8; }
.mb-oval.pulse { box-shadow:0 0 0 6px color-mix(in srgb, var(--f) 35%, transparent); background:color-mix(in srgb, var(--f) 12%, white); }
.mb-wires { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; overflow:visible; }
.mb-wires path { fill:none; }
.mb-wires path.flash { stroke-width:4 !important; }
.mb-log { margin-top:6px; font-size:12px; color:#444; max-height:7.5em; overflow:auto; border-top:1px solid #eee; padding-top:4px; }
.mb-key { font-size:11px; color:#555; margin-top:6px; }
`

// ── the item ────────────────────────────────────────────────────────────────

function emit($item, item) {
  ensureCSS()
  $item.append(`
    <div class="mechblocks">
      <div class="mb-head"><b>Mech Blocks</b><span><button class="mb-refresh" title="Look again for Mech items on this page">↻</button><button class="mb-new">＋ New Mech in blocks ↗</button></span></div>
      <div class="mb-help">${DOCS.map(([label, title]) => `<a class="mb-doc" href="/view/${slugOf(title)}" data-title="${esc(title)}">${label}</a>`).join(' · ')} · <a href="${SLIDES}" download>Slides (PPTX) ↓</a></div>
      <div class="mb-list"></div>
      <div class="mb-notebook"></div>
    </div>`)
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

function bind($item, item) {
  aboutMark($item, 'mechblocks')
  const $page = $item.parents('.page:first')
  // Ward's CODE, SHOW and lineup walks read the page key from the data-key
  // attribute, which wiki-client sets from 0.24 on. Older clients keep it only in
  // jQuery data, so copy it across for this page when it is missing.
  const pageEl = $page[0]
  if (pageEl && !pageEl.dataset.key && $page.data('key')) pageEl.dataset.key = $page.data('key')
  const list = () => renderList($item, $page)
  setTimeout(list, 0)
  $item.on('click', '.mb-refresh', list)
  $item.on('click', '.mb-new', () => openEditor($page, null, '', $item))
  $item.on('click', '.mb-edit', e => {
    const id = $(e.target).closest('.mb-row').data('id')
    const mech = mechItems($page).find(m => m.id == id)
    if (mech) openEditor($page, mech.id, mech.text, $item)
  })
  $item.on('click', '.mb-watch', e => {
    const id = $(e.target).closest('.mb-row').data('id')
    const mech = mechItems($page).find(m => m.id == id)
    if (mech) watch($item, $page, mech)
  })
  // double-click opens the item's editor, as on any FedWiki item (and there,
  // Cmd/Ctrl-I opens About Mechblocks Plugin); not on buttons, links or a run
  $item.on('dblclick', e => {
    if ($(e.target).closest('button, a, .mb-nb').length) return
    wiki.textEditor($item, item)
  })
  // the docs open beside this page in the lineup, as wiki links do
  $item.on('click', '.mb-doc', e => {
    e.preventDefault()
    wiki.doInternalLink($(e.target).data('title'), $page)
  })
}

// The page's Mech items: those drawn on the page (newest data, page order) plus
// any in the stored story not drawn yet. An item just added is drawn but not yet
// in the stored story, and wiki-client leaves its data-id attribute empty.
function mechItems($page) {
  const found = new Map()
  let story = []
  try { story = wiki.lineup.atKey($page.data('key')).getRawPage().story } catch {}
  for (const it of story) if (it.type == 'mech') found.set(it.id, it)
  const drawn = $page.find('.item').map((i, el) => wiki.getItem($(el))?.id).get()
  $page.find('.item.mech').each((i, el) => { const it = wiki.getItem($(el)); if (it && it.id) found.set(it.id, it) })
  const rank = it => { const d = drawn.indexOf(it.id); return d >= 0 ? d : 1000 + story.indexOf(it) }
  return [...found.values()].sort((a, b) => rank(a) - rank(b))
}

function itemElement($page, id) {
  return $page.find('.item.mech').filter((i, el) => wiki.getItem($(el))?.id == id).first()
}

function renderList($item, $page) {
  const mechs = mechItems($page)
  const html = mechs.length
    ? mechs.map((m, n) => `
        <div class="mb-row" data-id="${esc(m.id)}">
          <code>${esc((m.text || '').split('\n').slice(0, 3).join('\n'))}${(m.text || '').split('\n').length > 3 ? '\n…' : ''}</code>
          <button class="mb-edit">Edit in blocks ↗</button><button class="mb-watch">Watch it run</button>
          <span style="color:#888;font-size:12px">Mech item ${n + 1}</span>
        </div>`).join('')
    : `<div class="mb-none">No Mech items on this page yet. ＋ New Mech in blocks builds one.</div>`
  $item.find('.mb-list').html(html)
}

// ── Edit in blocks: the Mech Blocks tool in a popup ───────────────────────────

let editor = null   // { popup, $page, id, text, $after }

function openEditor($page, id, text, $after) {
  const url = URL.createObjectURL(new Blob([toolHTML], { type: 'text/html' }))
  const popup = window.open(url, 'mechblocks-editor', 'popup,width=1420,height=900')
  if (!popup) return alert('The browser blocked the Mech Blocks window. Allow pop-ups for this wiki and try again.')
  editor = { popup, $page, id, text, $after, url }
  popup.focus()
}

window.addEventListener('message', event => {
  if (!editor || event.source !== editor.popup) return
  const data = event.data || {}
  if (data.toolType != 'mech-blocks') return
  if (data.action == 'mechBlocksReady') {
    const title = editor.$page.data('data')?.title || ''
    const docs = Object.fromEntries(DOCS.map(([label, t]) => [label.toLowerCase(), `${location.origin}/view/${slugOf(t)}`]))
    docs.slides = location.origin + SLIDES
    editor.popup.postMessage({ toolType: 'mech-blocks', action: 'loadMech', text: editor.text, title, isNew: !editor.id, docs }, '*')
  }
  if (data.action == 'saveMech') {
    const text = String(data.text)
    if (editor.id) saveExisting(editor.$page, editor.id, text)
    else {
      const $new = wiki.createItem(editor.$page, editor.$after, { type: 'mech', text })
      editor.id = $new.data('item').id
    }
    editor.text = text
    editor.popup.postMessage({ toolType: 'mech-blocks', action: 'saved' }, '*')
    setTimeout(() => editor.$after && renderList(editor.$after, editor.$page), 700)
  }
})

// wiki-client's replaceItem, by hand: new item data, Ward's plugin draws it, the page records an edit.
function saveExisting($page, id, text) {
  const $mech = itemElement($page, id)
  const old = wiki.getItem($mech) || mechItems($page).find(m => m.id == id)
  const item = Object.assign({}, old, { text })
  $mech.empty().unbind()
  $mech.data('item', item)
  wiki.getPlugin('mech', plugin => {
    plugin.emit($mech, item)
    plugin.bind($mech, item)
  })
  wiki.pageHandler.put($page, { type: 'edit', id, item })
}

// ── Watch it run ─────────────────────────────────────────────────────────────

function watch($item, $page, mech) {
  for (const [prefix, nb] of notebooks) if (nb.$item.is($item)) notebooks.delete(prefix)
  const nest = tree((mech.text || '').split(/\n/), [], 0)
  const html = format(nest)
  const prefix = (html.match(/id=(\d+)\./) || [])[1] || String(Math.random())
  const pageKey = $page.data('key')
  const nb = new Notebook($item, mech, prefix)
  notebooks.set(prefix, nb)
  nb.render(html)
  const context = {
    item: mech, itemId: mech.id, pageKey,
    page: wiki.lineup.atKey(pageKey).getRawPage(),
    origin: window.origin,
    site: $page.data('site') || window.location.host,
    slug: $page.attr('id'),
    title: $page.data('data').title,
    blocks: Object.keys(blocks),
  }
  nb.state = { context, api }
  run(nest, tracer.wrap(nb.state, `${prefix}.top`))
}

class Notebook {
  constructor($item, mech, prefix) {
    this.$item = $item
    this.mech = mech
    this.prefix = prefix
    this.keys = new Map()     // key -> { writes, reads, missing, last, who }
    this.wires = new Map()    // `${kind}|${who}|${key}` -> count
    this.flashing = new Set()
    this.lines = []
    this.queued = false
    this.claims = new Map()   // PLUGIN line -> Map(key -> the server line that wrote it)
    this.failed = new Set()   // blocks that ended with a ✖︎
  }

  render(scriptHTML) {
    const first = (this.mech.text || '').split('\n')[0]
    this.$item.find('.mb-notebook').html(`
      <div class="mb-nb">
        <div class="mb-nb-bar"><span>Watching <code>${esc(first)}</code> run with Ward's own blocks. Click ▶ in the script to start it.</span>
          <button class="mb-graph" disabled title="Becomes active once the run has made graphs (state.aspect)">Graph Tool ↗</button>
          <button class="mb-close">Close</button></div>
        <div class="mb-nb-body">
          <div class="mb-script">${scriptHTML}</div>
          <div class="mb-ovals"><div class="mb-none">The notebook is empty.</div></div>
          <svg class="mb-wires"><defs>
            <marker id="mb-arrow-${this.prefix}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker>
          </defs></svg>
        </div>
        <div class="mb-key">Solid line: the block wrote it. Dashed line: the block read it. Red: a block needed it, it was not there, and the block stopped. Grey: looked for, not there, not needed.</div>
        <div class="mb-log"></div>
      </div>`)
    const $nb = this.$item.find('.mb-nb')
    $nb.on('click', '.mb-close', () => { notebooks.delete(this.prefix); $nb.remove() })
    $nb.on('click', '.mb-graph', () => this.toGraphTool())
  }

  label(who) {
    const el = document.getElementById(who)
    return el ? (el.firstChild?.textContent || el.textContent || '').trim().split(/\s+/)[0] : 'the script'
  }

  onBlock(ev) {
    const el = document.getElementById(ev.who)
    if (el) el.classList.toggle('mb-running', ev.phase == 'start')
    if (ev.phase == 'end' && el && el.querySelector('.trouble')) { this.failed.add(ev.who); this.schedule() }
  }

  onState(ev) {
    if (!String(ev.who).startsWith(this.prefix)) return
    // PLUGIN and GET copy back what server lines wrote; credit those lines instead.
    if (ev.kind == 'write' && ev.key == 'result' && ev.value && Array.isArray(ev.value.mech)) {
      const claim = new Map()
      for (const line of ev.value.mech.flat(9)) for (const k of (line && line.writes) || []) claim.set(k, line.key)
      this.claims.set(ev.who, claim)
    } else if (ev.kind == 'write' && this.claims.get(ev.who)?.has(ev.key) && document.getElementById(this.claims.get(ev.who).get(ev.key))) {
      ev = { ...ev, who: this.claims.get(ev.who).get(ev.key) }
    }
    const k = this.keys.get(ev.key) || { writes: 0, reads: 0, missing: 0, last: undefined }
    if (ev.kind == 'write') { k.writes++; k.last = ev.value; k.writer = ev.who }
    if (ev.kind == 'read') k.reads++
    if (ev.kind == 'miss') k.missing++
    if (ev.kind == 'delete') { k.deleted = true }
    this.keys.set(ev.key, k)
    const kind = ev.kind == 'miss' ? 'miss' : ev.kind == 'write' || ev.kind == 'delete' ? 'write' : 'read'
    const wk = `${kind}|${ev.who}|${ev.key}`
    const fresh = !this.wires.has(wk)
    this.wires.set(wk, (this.wires.get(wk) || 0) + 1)
    if (fresh && !String(ev.who).endsWith('.top')) {
      const verb = { write: ev.kind == 'delete' ? 'removed' : 'wrote', read: 'read', miss: 'looked for, and did not find,' }[kind]
      // a list or object is often filled after it is written, so only name plain values
      const plain = ev.value == null || typeof ev.value != 'object'
      this.lines.push(`${this.label(ev.who)} ${verb} ${ev.key}${kind == 'write' && ev.kind != 'delete' && plain ? ` (${preview(ev.value, 60)})` : ''}`)
    }
    this.flashing.add(wk)
    if (ev.key == 'aspect' && ev.kind == 'write') this.$item.find('.mb-graph').prop('disabled', false)
    this.schedule()
  }

  schedule() {
    if (this.queued) return
    this.queued = true
    requestAnimationFrame(() => { this.queued = false; this.draw() })
  }

  draw() {
    const $nb = this.$item.find('.mb-nb')
    if (!$nb.length) return
    const ovals = [...this.keys.entries()].map(([key, k]) => {
      const f = family(key)
      const absent = !k.writes && k.missing && !(this.state && key in tracer.unwrap(this.state))
      const missing = absent && this.missedBy(key).some(who => this.failed.has(who))
      const counts = [k.writes && `written ${k.writes}×`, k.reads && `read ${k.reads}×`, missing ? 'missing' : absent && 'not there'].filter(Boolean).join(' · ')
      const title = missing ? `${key}: a block needed this and stopped without it` : absent ? `${key}: looked for, not there, and nothing failed for want of it` : `${key} (${f.label}): ${preview(k.last)}${k.writer ? ` — last written by ${this.label(k.writer)}` : ''}`
      const pulse = [...this.flashing].some(w => w.endsWith(`|${key}`))
      return `<div class="mb-oval${missing ? ' missing' : absent ? ' absent' : ''}${pulse ? ' pulse' : ''}" data-key="${esc(key)}" style="--f:${f.color}" title="${esc(title)}"><b>${esc(key)}</b><span class="mb-count">${counts}</span></div>`
    })
    $nb.find('.mb-ovals').html(ovals.join('') || '<div class="mb-none">The notebook is empty.</div>')
    $nb.find('.mb-log').html(this.lines.slice(-30).map(esc).join('<br>'))

    // wires from each block to each oval it touched
    const body = $nb.find('.mb-nb-body')[0]
    const box = body.getBoundingClientRect()
    const svg = $nb.find('.mb-wires')[0]
    svg.querySelectorAll('path.w').forEach(p => p.remove())
    for (const [wk] of this.wires) {
      const [kind, who, key] = wk.split('|')
      if (who.endsWith('.top')) continue
      const el = document.getElementById(who)
      const ov = body.querySelector(`.mb-oval[data-key="${CSS_escape(key)}"]`)
      if (!el || !ov) continue
      const a = el.getBoundingClientRect(), b = ov.getBoundingClientRect()
      const x1 = a.left - box.left + Math.min(a.width, 140) + 4, y1 = a.top - box.top + a.height / 2
      const x2 = b.left - box.left - 2, y2 = b.top - box.top + b.height / 2
      const mx = (x1 + x2) / 2
      const color = kind == 'miss' ? (this.failed.has(who) ? '#b91c1c' : '#cbd5e1') : kind == 'write' ? family(key).color : '#94a3b8'
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      p.setAttribute('class', 'w' + (this.flashing.has(wk) ? ' flash' : ''))
      p.setAttribute('stroke', color)
      p.setAttribute('stroke-width', kind == 'write' ? 2.2 : 1.6)
      if (kind != 'write') p.setAttribute('stroke-dasharray', kind == 'miss' ? '2 4' : '6 4')
      // writes point at the oval; reads point back at the block
      p.setAttribute('d', kind == 'write' ? `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}` : `M${x2},${y2} C${mx},${y2} ${mx},${y1} ${x1},${y1}`)
      p.setAttribute('marker-end', `url(#mb-arrow-${this.prefix})`)
      svg.appendChild(p)
    }
    if (this.flashing.size) {
      clearTimeout(this.unflash)
      this.unflash = setTimeout(() => { this.flashing.clear(); this.draw() }, 450)
    }
  }

  missedBy(key) {
    return [...this.wires.keys()].filter(w => w.startsWith('miss|') && w.endsWith(`|${key}`)).map(w => w.split('|')[1])
  }

  toGraphTool() {
    const state = tracer.unwrap(this.state)
    if (!state.aspect) return
    const title = `${this.$item.parents('.page:first').data('data')?.title || 'Mech'} — Mech aspect`
    const graphJSON = aspectToGraphJSON(state.aspect, title)
    const popup = window.open(GRAPH_URL, 'rcngraph', 'popup,height=820,width=1440')
    if (!popup) return alert('The browser blocked the Graph Tool window. Allow pop-ups for this wiki and try again.')
    const ready = event => {
      if (event.source !== popup || event.data?.action != 'graphToolReady') return
      popup.postMessage({ action: 'loadGraph', graphJSON, pageTitle: title }, '*')
      window.removeEventListener('message', ready)
    }
    window.addEventListener('message', ready)
  }
}

function CSS_escape(s) {
  return window.CSS && CSS.escape ? CSS.escape(s) : String(s).replace(/"/g, '\\"')
}

window.plugins.mechblocks = { emit, bind }
