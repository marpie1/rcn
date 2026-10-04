// Turn Mech's state.aspect into an RCN Graph Tool model.
//
// state.aspect is what WALK, SOURCE aspect and the rcn server blocks leave:
//   [{ id, source, result: [{ name, graph: { nodes:[{type, props:{name}}], rels:[{type, from, to}] } }] }]
// The Graph Tool wants { version, modelName, nodes:[{id,label,x,y,w,h,...}], edges:[{src,tgt,...}] }.
// Nodes are merged across every aspect by type + name, so a page reached by two
// walks is one box. Layout: one column per node type, most-connected at the top.

const PALETTE = ['#1d4ed8', '#15803d', '#b45309', '#7c3aed', '#be185d', '#0f766e', '#c2410c', '#4b5563']

export function aspectGraphs(aspect) {
  const out = []
  for (const each of aspect || []) {
    for (const r of each.result || []) if (r && r.graph && r.graph.nodes) out.push({ name: r.name, graph: r.graph, source: each.source || each.id })
  }
  return out
}

export function aspectToGraphJSON(aspect, title = 'Mech aspect', { maxNodes = 400 } = {}) {
  const graphs = aspectGraphs(aspect)
  const nodes = new Map()          // key type\0name -> node
  const edges = new Map()          // key src\0tgt\0type -> edge
  const degree = new Map()
  let dropped = 0
  const keyOf = n => `${n.type || 'Node'}\u0000${(n.props && n.props.name) || ''}`
  for (const { graph } of graphs) {
    const ids = graph.nodes.map(n => {
      const k = keyOf(n)
      if (!nodes.has(k)) {
        if (nodes.size >= maxNodes) { dropped++; return null }
        nodes.set(k, { key: k, type: n.type || 'Node', name: (n.props && n.props.name) || '(unnamed)', props: n.props || {} })
      }
      return k
    })
    for (const r of graph.rels || []) {
      const a = ids[r.from], b = ids[r.to]
      if (!a || !b) continue
      const ek = `${a}\u0000${b}\u0000${r.type || ''}`
      if (edges.has(ek)) continue
      edges.set(ek, { a, b, type: r.type || '' })
      degree.set(a, (degree.get(a) || 0) + 1)
      degree.set(b, (degree.get(b) || 0) + 1)
    }
  }

  const types = [...new Set([...nodes.values()].map(n => n.type))]
  const colorOf = t => PALETTE[types.indexOf(t) % PALETTE.length]
  const idOf = new Map()
  const outNodes = []
  types.forEach((t, col) => {
    const list = [...nodes.values()].filter(n => n.type == t)
      .sort((x, y) => (degree.get(y.key) || 0) - (degree.get(x.key) || 0) || x.name.localeCompare(y.name))
    list.forEach((n, row) => {
      const id = `n${outNodes.length + 1}`
      idOf.set(n.key, id)
      const w = Math.min(220, Math.max(96, 18 + n.name.length * 7))
      outNodes.push({
        id, label: n.name, x: 160 + col * 280, y: 80 + row * 70, w, h: 48,
        shape: 'rounded', note: `${t} · from Mech`, props: { mechType: t, ...flat(n.props) },
        fontSize: 12, fontColor: '#000000', color: '#ffffff', borderColor: colorOf(t),
        borderWidth: 2, borderDash: 'solid', extraLabels: [], icon: '',
      })
    })
  })
  const outEdges = [...edges.values()].map((e, i) => ({
    id: `e${i + 1}`, src: idOf.get(e.a), tgt: idOf.get(e.b), label: e.type,
    arrowDir: 'forward', color: '#64748b', width: 1.5, dash: 'solid', fontSize: 10,
    fontColor: '#000000', curved: true, polarity: 'none', props: {},
  }))

  const sources = [...new Set(graphs.map(g => g.source).filter(Boolean))]
  return {
    version: '1.0', mode: 'select', modelName: title, canvasBg: '#ffffff',
    modelNote: `Drawn from Mech state.aspect: ${graphs.length} aspect${graphs.length == 1 ? '' : 's'}` +
      (sources.length ? ` from ${sources.join('; ')}` : '') + `. Columns are node types: ${types.join(', ')}.` +
      (dropped ? ` ${dropped} nodes beyond the first ${maxNodes} were left out.` : ''),
    graphAttrs: {}, cldLoopNames: {}, legendEntries: [], legendVisible: false, legendCollapsed: false,
    customSymbols: [], nodes: outNodes, edges: outEdges, lines: [], metaEdges: [],
  }
}

// props become strings so the Graph Tool's property panel can show them
function flat(props) {
  const out = {}
  for (const [k, v] of Object.entries(props || {})) {
    if (k == 'name') continue
    out[k] = typeof v == 'object' ? JSON.stringify(v) : String(v)
  }
  return out
}
