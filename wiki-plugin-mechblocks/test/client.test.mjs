// The tracer and the aspect converter: pure parts of the client.
import test from 'node:test'
import assert from 'node:assert'
import { makeTracer, instrument, preview } from '../src/trace.mjs'
import { aspectToGraphJSON } from '../src/aspect.mjs'

test('reads, writes, misses and deletes are credited to the block that did them', () => {
  const events = []
  const t = makeTracer(e => events.push(`${e.who} ${e.kind} ${e.key}`))
  const state = { context: {}, api: {} }
  const a = t.wrap(state, 'A')
  a.neighborhood = [1]
  void a.neighborhood
  void ('aspect' in a)
  void a.context; void a.api; a.debug = true
  const b = t.wrap(a, 'B')                // a child given its parent's view
  void b.neighborhood
  delete b.neighborhood
  assert.deepStrictEqual(events, ['A write neighborhood', 'A read neighborhood', 'A miss aspect', 'B read neighborhood', 'B delete neighborhood'])
  assert.strictEqual(t.unwrap(b), state, 'every view writes to the one real state')
  assert.strictEqual(state.debug, true)
})

test('instrument says when a block starts and ends, and hands it a traced view', async () => {
  const seen = []
  const t = makeTracer(e => seen.push(`${e.who}:${e.kind}:${e.key}`))
  const blocks = {
    MAKE: { emit: ({ state }) => { state.items = ['x'] } },
    WAIT: { emit: async ({ state }) => { await null; void state.items } },
  }
  instrument(blocks, t, e => seen.push(`${e.who}:${e.phase}`))
  instrument(blocks, t, () => assert.fail('instrumenting twice must not wrap twice'))
  const state = {}
  blocks.MAKE.emit({ state, elem: { id: 'p.0' }, command: 'MAKE' })
  await blocks.WAIT.emit({ state, elem: { id: 'p.1' }, command: 'WAIT' })
  await null
  assert.deepStrictEqual(seen, ['p.0:start', 'p.0:write:items', 'p.1:start', 'p.0:end', 'p.1:read:items', 'p.1:end'])
})

test('preview stays short', () => {
  assert.strictEqual(preview([1, 2, 3]), '3 items')
  assert.strictEqual(preview('x'.repeat(500)).length, 161)
  assert.strictEqual(preview(undefined), 'undefined')
})

const walkAspect = [
  { id: 'w1', source: 'WALK 2 steps', result: [
    { name: 'step 1', graph: { nodes: [{ type: 'Page', props: { name: 'Home', site: 'a' } }, { type: 'Page', props: { name: 'About' } }], rels: [{ type: 'link', from: 0, to: 1 }] } },
    { name: 'step 2', graph: { nodes: [{ type: 'Page', props: { name: 'About' } }, { type: 'Site', props: { name: 'a.wiki' } }], rels: [{ type: 'on', from: 0, to: 1 }] } },
    { name: 'empty', graph: null },
  ] },
]

test('aspects become one Graph Tool model, merged by type and name', () => {
  const g = aspectToGraphJSON(walkAspect, 'T')
  assert.strictEqual(g.modelName, 'T')
  assert.deepStrictEqual(g.nodes.map(n => n.label).sort(), ['About', 'Home', 'a.wiki'])
  assert.strictEqual(g.edges.length, 2)
  for (const n of g.nodes) for (const f of ['w', 'h', 'fontSize', 'borderColor', 'borderDash']) assert.ok(f in n, `node needs ${f}`)
  assert.match(g.nodes[0].fontColor, /^#[0-9a-f]{6}$/)
  for (const e of g.edges) for (const f of ['width', 'fontSize', 'curved', 'dash', 'polarity']) assert.ok(f in e, `edge needs ${f}`)
  const ids = new Set(g.nodes.map(n => n.id))
  assert.ok(g.edges.every(e => ids.has(e.src) && ids.has(e.tgt)))
  assert.strictEqual(g.nodes.find(n => n.label == 'Home').props.site, 'a')
  const cols = new Set(g.nodes.map(n => n.x))
  assert.strictEqual(cols.size, 2, 'one column per type')
})

test('a big aspect is capped and says so', () => {
  const nodes = Array.from({ length: 30 }, (_, i) => ({ type: 'Page', props: { name: `p${i}` } }))
  const g = aspectToGraphJSON([{ result: [{ name: 'big', graph: { nodes, rels: [] } }] }], 'big', { maxNodes: 10 })
  assert.strictEqual(g.nodes.length, 10)
  assert.match(g.modelNote, /20 nodes beyond the first 10/)
})

test('the graphtool Code item on the about page loads the way Ward\'s CODE loads it', async () => {
  const fs = await import('node:fs/promises')
  const page = JSON.parse(await fs.readFile(new URL('../pages/about-mechblocks-plugin', import.meta.url), 'utf8'))
  const code = page.story.filter(i => i.type == 'code').map(i => i.text).join('\n')
  const mod = await import(`data:text/javascript;base64,${btoa(code)}`)   // btoa throws beyond Latin-1, as in Mech
  assert.strictEqual(typeof mod.graphtool, 'function')
  let trouble
  const reply = mod.graphtool.call({ api: { trouble: m => (trouble = m) } })
  assert.match(trouble, /expects "aspect"/, 'without an aspect it says so, in Mech\'s way')
  void reply
  const ids = page.story.map(i => i.id)
  assert.strictEqual(new Set(ids).size, ids.length, 'item ids are unique')
  assert.ok(page.story[1].attribution, 'the credit line is the second item')
  assert.deepStrictEqual(page.journal.filter(a => a.type == 'add').map(a => a.id), ids, 'the journal adds every item in order')
})
