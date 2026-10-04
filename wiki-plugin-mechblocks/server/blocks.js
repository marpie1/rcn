// Server blocks for Mech's PLUGIN block:  PLUGIN rcn
//
// Mech sends the lines indented under "PLUGIN rcn" here, runs nothing itself,
// and copies back whatever state these blocks write. Each block marks its own
// line with a status ("⇒ 409 nodes") or a trouble message, which Mech shows.
//
//   PROJECTIONS              list the Layer 1 folders on this site       -> items
//   PROJECTION whatcom       a Layer 1 folder's graph as an aspect      -> aspect
//   PROJECTION whatcom Person Program   keep only those kinds
//   BADGES                   SODOTO badges on this site's pages         -> aspect, items
//   BADGES diagram           only badges whose skill mentions "diagram"
//   HELLO                    proves the plugin answers                  -> nothing
//
// The aspect shape is Ward's: [{ id, source, result: [{ name, graph }] }] with
// graph = { nodes: [{ type, in, out, props: { name } }], rels: [{ type, from, to, props }] },
// so PREVIEW graph, SOLO and the Mech Blocks Graph Tool button all read it.

const fs = require('fs/promises')
const path = require('path')

const status = (elem, text) => { elem.status = text }
const trouble = (elem, text) => { elem.trouble = text }

class Graph {
  constructor() { this.nodes = []; this.rels = [] }
  node(type, props) {
    const at = this.nodes.findIndex(n => n.type == type && n.props.name == props.name)
    if (at >= 0) return at
    this.nodes.push({ type, in: [], out: [], props })
    return this.nodes.length - 1
  }
  rel(type, from, to, props = {}) {
    this.rels.push({ type, from, to, props })
    const r = this.rels.length - 1
    this.nodes[from].out.push(r)
    this.nodes[to].in.push(r)
    return r
  }
}

// Which state each line wrote, so the Mech Blocks notebook can draw the line
// from the server block that made it rather than from PLUGIN. Mech ignores it.
const wrote = (elem, ...keys) => { elem.writes = [...new Set([...(elem.writes || []), ...keys])] }

function addAspect(state, elem, command, name, graph) {
  wrote(elem, 'aspect')
  state.aspect = state.aspect || []
  state.aspect.push({ id: elem.key || command, source: command, result: [{ name, graph }] })
}

// Layer 1 folders live in the site's assets, as substrate/export.py --bundle lays them out.
function layer1Dir(ctx) {
  return path.join(ctx.assets, 'rcn-table')
}

const SAFE = /^[A-Za-z0-9_-]+$/

const blocks = {
  async HELLO({ elem }) {
    status(elem, 'the rcn plugin answers 😀')
  },

  async PROJECTIONS({ elem, state, ctx }) {
    const dir = layer1Dir(ctx)
    let names = []
    try {
      for (const d of await fs.readdir(dir, { withFileTypes: true }))
        if (d.isDirectory()) {
          try { await fs.access(path.join(dir, d.name, 'graph.json')); names.push(d.name) } catch {}
        }
    } catch {}
    if (!names.length) return trouble(elem, `No Layer 1 folders in this site's assets (rcn-table/<name>/graph.json).`)
    names.sort()
    state.items = names.map(n => `PROJECTION ${n}`)
    wrote(elem, 'items')
    status(elem, `${names.length} on this site: ${names.join(', ')}`)
  },

  async PROJECTION({ elem, args, command, state, ctx }) {
    const [db, ...kinds] = args
    if (!db) return trouble(elem, 'PROJECTION expects the name of a Layer 1 folder, like PROJECTION whatcom.')
    if (!SAFE.test(db)) return trouble(elem, `PROJECTION expects a plain folder name, not "${db}".`)
    let data
    try {
      data = JSON.parse(await fs.readFile(path.join(layer1Dir(ctx), db, 'graph.json'), 'utf8'))
    } catch {
      return trouble(elem, `No Layer 1 folder "${db}" on this site (looked for assets/rcn-table/${db}/graph.json).`)
    }
    const want = kinds.length ? new Set(kinds.map(k => k.toLowerCase())) : null
    const graph = new Graph()
    const at = new Map()
    for (const n of data.nodes || []) {
      if (want && !want.has(String(n.kind).toLowerCase())) continue
      at.set(n.key, graph.node(n.kind || 'Node', { name: n.name || n.key, key: n.key }))
    }
    let links = 0
    for (const e of data.edges || []) {
      if (!at.has(e.src) || !at.has(e.tgt)) continue
      graph.rel(e.label || 'link', at.get(e.src), at.get(e.tgt))
      links++
    }
    if (!graph.nodes.length) return trouble(elem, `PROJECTION ${db} found no nodes${want ? ` of kind ${kinds.join(', ')}` : ''}.`)
    addAspect(state, elem, command, want ? `${db}: ${kinds.join(', ')}` : db, graph)
    status(elem, `${graph.nodes.length} nodes, ${links} links`)
  },

  async BADGES({ elem, args, command, state, ctx }) {
    const words = args.map(a => a.toLowerCase())
    let files = []
    try { files = await fs.readdir(ctx.pages) } catch {
      return trouble(elem, `BADGES could not read this site's pages.`)
    }
    const graph = new Graph()
    const rows = []
    for (const file of files) {
      if (file.startsWith('.')) continue
      let page
      try { page = JSON.parse(await fs.readFile(path.join(ctx.pages, file), 'utf8')) } catch { continue }
      for (const item of page.story || []) {
        if (item.type != 'sodoto-badge') continue
        const c = item.credential || {}
        const skill = c.skill || item.text || '(unnamed skill)'
        if (words.length && !words.some(w => skill.toLowerCase().includes(w))) continue
        const holder = c.holderName || page.title || file
        const p = graph.node('Person', { name: holder, page: file })
        const s = graph.node('Skill', { name: skill })
        graph.rel('holds', p, s, { issued: c.issuedAt || '', issuer: c.issuer || '' })
        rows.push({ holder, skill, issued: c.issuedAt || '' })
      }
    }
    if (!rows.length) return trouble(elem, words.length ? `No badges for "${args.join(' ')}" on this site.` : 'No SODOTO badges on this site.')
    rows.sort((a, b) => a.holder.localeCompare(b.holder) || a.skill.localeCompare(b.skill))
    state.items = rows.map(r => `${r.holder}: ${r.skill}${r.issued ? ` (issued ${r.issued})` : ''}`)
    wrote(elem, 'items')
    const people = graph.nodes.filter(n => n.type == 'Person').length
    const skills = graph.nodes.filter(n => n.type == 'Skill').length
    addAspect(state, elem, command, words.length ? `badges: ${args.join(' ')}` : 'badges', graph)
    status(elem, `${rows.length} badges, ${people} people, ${skills} skills`)
  },
}

// Ward's run(), on the server: a line followed by an indented list is its body.
async function run(nest, state, ctx) {
  for (let here = 0; here < nest.length; here++) {
    const code = nest[here]
    if (!code || !('command' in code)) continue
    const [op, ...args] = code.command.split(/ +/)
    const next = nest[here + 1]
    const body = next && !('command' in next) ? nest[++here] : null
    if (blocks[op]) {
      try {
        await blocks[op]({ elem: code, command: code.command, op, args, body, state, ctx })
      } catch (err) {
        trouble(code, `${op} failed: ${err.message}`)
      }
    } else if (/^[A-Z]+$/.test(op)) trouble(code, `${op} isn't an rcn block. Try PROJECTIONS, PROJECTION, BADGES or HELLO.`)
    else if (/\S/.test(code.command)) trouble(code, 'Expected line to begin with all-caps keyword.')
  }
}

module.exports = { blocks, run }
