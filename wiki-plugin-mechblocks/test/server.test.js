// Server blocks for PLUGIN rcn, against a small fixture site.
const test = require('node:test')
const assert = require('node:assert')
const path = require('path')
const { run } = require('../server/blocks.js')

const site = path.join(__dirname, 'fixtures', 'site')
const ctx = { pages: path.join(site, 'pages'), assets: path.join(site, 'assets') }
const go = async (lines, state = {}) => {
  const mech = lines.map((command, i) => ({ command, key: `k.${i}` }))
  await run(mech, state, ctx)
  return { mech, state }
}

test('PROJECTIONS lists only folders that hold a graph.json', async () => {
  const { mech, state } = await go(['PROJECTIONS'])
  assert.deepStrictEqual(state.items, ['PROJECTION demo'])
  assert.match(mech[0].status, /1 on this site: demo/)
})

test('PROJECTION makes an aspect in Ward\'s shape', async () => {
  const { mech, state } = await go(['PROJECTION demo'])
  const g = state.aspect[0].result[0].graph
  assert.strictEqual(g.nodes.length, 3)
  assert.strictEqual(g.rels.length, 2)
  assert.deepStrictEqual(g.nodes[0], { type: 'Person', in: [], out: [0], props: { name: 'Ana', key: 'ana' } })
  assert.deepStrictEqual(g.rels[0], { type: 'member of', from: 0, to: 1, props: {} })
  assert.strictEqual(state.aspect[0].source, 'PROJECTION demo')
  assert.match(mech[0].status, /3 nodes, 2 links/)
})

test('PROJECTION keeps only the kinds named, and the links between them', async () => {
  const { state } = await go(['PROJECTION demo person entity'])
  const g = state.aspect[0].result[0].graph
  assert.deepStrictEqual(g.nodes.map(n => n.props.name), ['Ana', 'Food Co-op'])
  assert.strictEqual(g.rels.length, 1)
})

test('PROJECTION adds to an aspect already in state', async () => {
  const { state } = await go(['PROJECTION demo'], { aspect: [{ id: 'earlier', result: [] }] })
  assert.strictEqual(state.aspect.length, 2)
})

test('PROJECTION troubles: no name, unsafe name, missing folder', async () => {
  const { mech } = await go(['PROJECTION', 'PROJECTION ../etc', 'PROJECTION nothere'])
  assert.match(mech[0].trouble, /expects the name/)
  assert.match(mech[1].trouble, /plain folder name/)
  assert.match(mech[2].trouble, /No Layer 1 folder "nothere"/)
})

test('BADGES gathers people and skills from this site\'s pages', async () => {
  const { mech, state } = await go(['BADGES'])
  assert.deepStrictEqual(state.items, [
    'Ana: Causal Loop Diagramming (issued 2026-01-05)',
    'Ana: EIP Basic (issued 2026-02-01)',
    'Ben: Causal Loop Diagramming',
  ])
  const g = state.aspect[0].result[0].graph
  assert.strictEqual(g.nodes.filter(n => n.type == 'Skill').length, 2, 'a skill held by two people is one node')
  assert.match(mech[0].status, /3 badges, 2 people, 2 skills/)
  assert.deepStrictEqual(mech[0].writes, ['items', 'aspect'], 'the line says what it wrote')
})

test('BADGES with words keeps matching skills only', async () => {
  const { state } = await go(['BADGES loop'])
  assert.strictEqual(state.items.length, 2)
  const { mech } = await go(['BADGES knitting'])
  assert.match(mech[0].trouble, /No badges for "knitting"/)
})

test('unknown blocks and lower-case lines are named, as Mech would', async () => {
  const { mech } = await go(['WALK', 'hello'])
  assert.match(mech[0].trouble, /WALK isn't an rcn block/)
  assert.match(mech[1].trouble, /all-caps/)
})

function routes(argv) {
  const { startServer } = require('../server/server.js')
  const got = {}
  startServer({ app: { get: (route, h) => { got[route] = h } }, argv })
  return got
}

test('the slides come from the site\'s assets when uploaded there, else from the plugin', () => {
  const fs = require('fs'), os = require('os')
  const deck = '/plugin/mechblocks/rcn-mech-blocks-intro.pptx'
  const sent = argv => { let f; routes(argv)[deck]({}, { type() {}, sendFile: x => { f = x } }); return f }
  assert.match(sent({ db: ctx.pages, data: site }), /wiki-plugin-mechblocks\/docs\/rcn-mech-blocks-intro\.pptx$/)
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mb-'))
  fs.mkdirSync(path.join(tmp, 'assets', 'mechblocks'), { recursive: true })
  fs.writeFileSync(path.join(tmp, 'assets', 'mechblocks', 'rcn-mech-blocks-intro.pptx'), 'x')
  assert.strictEqual(sent({ db: ctx.pages, data: tmp }), path.join(tmp, 'assets', 'mechblocks', 'rcn-mech-blocks-intro.pptx'))
  assert.ok(fs.existsSync(path.join(__dirname, '..', 'docs', 'rcn-mech-blocks-intro.pptx')), 'the plugin carries its own copy')
})

test('the help pages come with the plugin, credit line second', () => {
  for (const slug of ['mech-blocks-introduction', 'mech-blocks-manual', 'mech-blocks-reference']) {
    const page = JSON.parse(require('fs').readFileSync(path.join(__dirname, '..', 'pages', slug), 'utf8'))
    assert.ok(page.story.length > 5, slug)
    assert.ok(page.story[1].attribution, `${slug}: credit line second`)
  }
})

test('the HTTP route decodes what Mech sends and answers in Mech\'s shape', async () => {
  const handler = routes({ db: ctx.pages, data: site })['/plugin/rcn/mech']
  const body = [{ command: 'PROJECTION demo', key: 'x.0' }]
  const b64 = s => Buffer.from(JSON.stringify(s), 'latin1').toString('base64')
  let sent
  await handler({ query: { mech: b64(body), state: b64({}) } }, { json: v => { sent = v } })
  assert.match(sent.mech[0].status, /3 nodes/)
  assert.strictEqual(sent.state.aspect.length, 1)
})
