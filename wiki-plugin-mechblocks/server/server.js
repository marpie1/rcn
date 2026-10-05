// wiki-plugin-mechblocks — server.
// Answers Mech's "PLUGIN rcn" block at /plugin/rcn/mech, in the same shape as
// Ward's own server blocks: { mech: <the lines, marked with status or trouble>, state }.

const fs = require('fs')
const path = require('path')
const { run } = require('./blocks.js')

// Mech encodes with the browser's btoa, which is Latin-1; decode the same way.
const decode = b64 => JSON.parse(Buffer.from(b64, 'base64').toString('latin1'))

function startServer(params) {
  const { app, argv } = params
  const ctx = {
    pages: argv.db,
    assets: argv.assets || path.join(argv.data, 'assets'),
  }
  // The slides, for the Help links. A copy uploaded to this site's assets
  // (an Assets item named "mechblocks") wins, so the deck can be updated without
  // a new plugin version; otherwise the copy that came with the plugin is sent.
  // The intro, manual and reference are wiki pages: editing them on the site
  // likewise replaces the plugin's copy.
  const DECK = 'rcn-mech-blocks-intro.pptx'
  app.get(`/plugin/mechblocks/${DECK}`, (req, res) => {
    const uploaded = path.join(ctx.assets, 'mechblocks', DECK)
    const file = fs.existsSync(uploaded) ? uploaded : path.join(__dirname, '..', 'docs', DECK)
    res.type('application/vnd.openxmlformats-officedocument.presentationml.presentation')
    res.sendFile(file)
  })

  app.get('/plugin/rcn/mech', async (req, res) => {
    let mech, state
    try {
      mech = decode(req.query.mech || 'W10=')
      state = decode(req.query.state || 'e30=')
    } catch (err) {
      return res.json({ err: `could not read the request: ${err.message}` })
    }
    await run(mech, state, ctx)
    res.json({ mech, state })
  })
}

module.exports = { startServer }
