// Build client/mechblocks.js: our code + Ward's vendored interpreter, one file.
//   npm run build
// Ward's ./mech.js registers his plugin when imported, so it is swapped for
// src/mech-shim.mjs; the Mech Blocks tool page is embedded as text so the
// editor popup needs no hosting.
import * as esbuild from 'esbuild'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
await fs.mkdir(path.join(root, 'build'), { recursive: true })
await fs.copyFile(path.join(root, '..', 'tools', 'mech-blocks.html'), path.join(root, 'build', 'mech-blocks.html'))

// The introduction, manual and reference travel with the plugin as wiki pages,
// built from tools/mech-blocks-*.md by docs/make_mech_blocks_fedwiki.sh, and the
// deck travels as a file the server hands out. So the Help links work on every
// site that has the plugin, with nothing to upload.
const docPages = JSON.parse(await fs.readFile(path.join(root, '..', 'docs', 'fedwiki-pages', 'mech-blocks.json'), 'utf8'))
await fs.mkdir(path.join(root, 'pages'), { recursive: true })
for (const [slug, page] of Object.entries(docPages))
  await fs.writeFile(path.join(root, 'pages', slug), JSON.stringify(page, null, 2))
await fs.mkdir(path.join(root, 'docs'), { recursive: true })
await fs.copyFile(path.join(root, '..', 'tools', 'rcn-mech-blocks-intro.pptx'), path.join(root, 'docs', 'rcn-mech-blocks-intro.pptx'))
console.log(`pages: ${Object.keys(docPages).join(', ')}; docs/rcn-mech-blocks-intro.pptx`)

const shim = {
  name: 'mech-shim',
  setup(build) {
    build.onResolve({ filter: /^\.\/mech\.js$/ }, args =>
      args.importer.includes(`${path.sep}vendor${path.sep}mech${path.sep}`)
        ? { path: path.join(root, 'src', 'mech-shim.mjs') }
        : undefined)
  },
}

const pkg = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'))
await esbuild.build({
  entryPoints: [path.join(root, 'src', 'mechblocks.mjs')],
  bundle: true,
  format: 'iife',
  loader: { '.html': 'text' },
  plugins: [shim],
  banner: { js: `/* wiki-plugin-mechblocks ${pkg.version} — includes Ward Cunningham's Mech interpreter (MIT), see vendor/mech */` },
  outfile: path.join(root, 'client', 'mechblocks.js'),
  logLevel: 'info',
})

// ── The graphtool Code item: ordinary Mech, no plugin needed ─────────────────
// Ward's CODE loads Code items with btoa, which fails on anything beyond
// Latin-1, so the build refuses such characters rather than ship a broken item.
const aspectSrc = (await fs.readFile(path.join(root, 'src', 'aspect.mjs'), 'utf8'))
  .replace(/^export function /gm, 'function ')
const graphtoolCode = `${aspectSrc}
// CODE graphtool -- send state.aspect to the RCN Graph Tool in a new window.
export function graphtool(where) {
  if (!this.aspect) return this.api.trouble('graphtool expects "aspect", like from WALK or PLUGIN rcn.')
  const url = where || (/(^|\\.)localhost$/.test(location.hostname)
    ? 'http://localhost:8765/tools/graph-tool-v22.html'
    : 'https://marc.relocalizecreativity.net/assets/Drag/graph-tool-v22.html')
  const graphJSON = aspectToGraphJSON(this.aspect, this.context.title + ' - Mech aspect')
  const popup = window.open(url, 'rcngraph', 'popup,height=820,width=1440')
  if (!popup) return this.api.trouble('The browser blocked the Graph Tool window. Allow pop-ups for this wiki.')
  const ready = e => {
    if (e.source !== popup || !e.data || e.data.action !== 'graphToolReady') return
    popup.postMessage({ action: 'loadGraph', graphJSON, pageTitle: graphJSON.modelName }, '*')
    window.removeEventListener('message', ready)
  }
  window.addEventListener('message', ready)
  return graphJSON.nodes.length + ' nodes sent to the Graph Tool'
}
`
const wide = [...graphtoolCode].find(c => c.codePointAt(0) > 255)
if (wide) throw new Error(`graphtool Code item has a character Mech's CODE cannot load: U+${wide.codePointAt(0).toString(16)}`)

// ── pages/about-mechblocks-plugin ───────────────────────────────────────────
const CREDIT = '*Marc Pierson and Claude Opus 5.5 · October 2026*'
let n = 0
const id = () => (0x5a17e00000000000n + BigInt(++n)).toString(16)
const story = [
  ['paragraph', 'Mech Blocks works beside Ward Cunningham\'s Mech items. For each Mech item on its page it offers Edit in blocks, which opens the Mech Blocks tool and saves the script back, and Watch it run, which runs the script with Ward\'s own blocks and draws the shared notebook as it fills.'],
  ['markdown', CREDIT, { attribution: true }],
  ['paragraph', 'See [https://github.com/marpie1/rcn/tree/master/wiki-plugin-mechblocks GitHub] for plugin source.'],
  ['markdown', 'Help: [[Mech Blocks Introduction]] · [[Mech Blocks Manual]] · [[Mech Blocks Reference]] · [Slides (PPTX)](/plugin/mechblocks/rcn-mech-blocks-intro.pptx)'],
  ['paragraph', 'Watch the notebook: an oval for each thing the blocks pass along, a solid line from the block that wrote it, a dashed line to each block that read it, and red when a block looked for something that was not there. When the run has made graphs, Graph Tool draws them in the RCN Graph Tool.'],
  ['mech', 'CLICK\n NEIGHBORS\n WALK 6 steps\n PREVIEW graph'],
  ['paragraph', 'PLUGIN rcn adds server blocks for RCN data on this site. PROJECTIONS lists the Layer 1 folders, PROJECTION whatcom makes one into graphs (PROJECTION whatcom Person Program keeps those kinds), and BADGES gathers the SODOTO badges on this site\'s pages.'],
  ['mech', 'CLICK\n PLUGIN rcn\n  PROJECTIONS\n  BADGES\n PREVIEW items'],
  ['mech', 'CLICK\n PLUGIN rcn\n  PROJECTION whatcom Person Program\n SOLO'],
  ['mechblocks', ''],
  ['paragraph', 'Without this plugin, ordinary Mech can still draw its graphs in the Graph Tool: the Code item below defines graphtool, and CODE graphtool sends state.aspect there.'],
  ['mech', 'CLICK\n NEIGHBORS\n WALK 6 steps\n CODE graphtool'],
  ['code', graphtoolCode],
  ['paragraph', 'Mech is Ward Cunningham\'s work: github.com/WardCunningham/wiki-plugin-mech, handbook at mech.fed.wiki. Mech Blocks bundles his interpreter under its MIT licence.'],
].map(([type, text, extra]) => ({ type, id: id(), text, ...(extra || {}) }))
const t0 = Date.parse('2026-10-04T12:00:00Z')
const journal = [{ type: 'create', item: { title: 'About Mechblocks Plugin', story: [] }, date: t0, author: 'Marc Pierson with Claude Opus 5.5' },
  ...story.map((item, k) => ({ type: 'add', id: item.id, item, date: t0 + k + 1, ...(k ? { after: story[k - 1].id } : {}) }))]
await fs.mkdir(path.join(root, 'pages'), { recursive: true })
await fs.writeFile(path.join(root, 'pages', 'about-mechblocks-plugin'), JSON.stringify({ title: 'About Mechblocks Plugin', story, journal }, null, 2))
console.log(`pages/about-mechblocks-plugin: ${story.length} items; graphtool Code item ${graphtoolCode.length} chars, Latin-1 only`)
