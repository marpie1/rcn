'use strict'
// Drive the real FedWiki (farm + security_type=did) over HTTP: sign a challenge,
// verify (get a session cookie), then attempt an authorized page PUT. Proves the
// live integration unit tests can't: FedWiki calling isAuthorized on a real PUT.
const crypto = require('crypto')
const http = require('http')
const fs = require('fs')

const KEYS = JSON.parse(fs.readFileSync(process.argv[2] || '/tmp/didtest-keys.json'))
const PORT = parseInt(process.env.WIKIPORT || '3000', 10)
let pass = 0, fail = 0
const ok = (c, m) => { console.log((c ? 'PASS' : 'FAIL') + '  ' + m); c ? pass++ : fail++ }

function keyFromSeed (seedHex) {
  const pkcs8 = Buffer.concat([Buffer.from('302e020100300506032b657004220420', 'hex'), Buffer.from(seedHex, 'hex')])
  return crypto.createPrivateKey({ key: pkcs8, format: 'der', type: 'pkcs8' })
}
const signNonce = (seedHex, nonce) => crypto.sign(null, Buffer.from(nonce, 'utf8'), keyFromSeed(seedHex)).toString('base64url')

function req (method, host, path, { cookie, body, ctype } = {}) {
  return new Promise((resolve) => {
    const data = body == null ? null : (ctype === 'form' ? body : JSON.stringify(body))
    const headers = { Host: host }
    if (data != null) { headers['Content-Type'] = ctype === 'form' ? 'application/x-www-form-urlencoded' : 'application/json'; headers['Content-Length'] = Buffer.byteLength(data) }
    if (cookie) headers['Cookie'] = cookie
    const r = http.request({ host: '127.0.0.1', port: PORT, method, path, headers }, (res) => {
      let b = ''; res.on('data', d => b += d); res.on('end', () => resolve({ status: res.statusCode, body: b, setCookie: res.headers['set-cookie'] }))
    })
    r.on('error', e => resolve({ status: 0, body: String(e) }))
    if (data != null) r.write(data); r.end()
  })
}

async function signIn (host, seedHex, did) {
  const ch = await req('GET', host, '/auth/challenge')
  const nonce = JSON.parse(ch.body).nonce
  const v = await req('POST', host, '/auth/verify', { body: { did, nonce, signature: signNonce(seedHex, nonce) } })
  const cookie = (v.setCookie || []).map(c => c.split(';')[0]).join('; ')
  return { status: v.status, body: JSON.parse(v.body || '{}'), cookie }
}
function editAction (id, text) {
  const action = { type: 'edit', id, item: { type: 'paragraph', id, text } }
  return 'action=' + encodeURIComponent(JSON.stringify(action))
}

(async () => {
  const A = KEYS.alice, B = KEYS.bob
  const aliceHost = 'alice.localhost', aliceSlug = 'alice-portfolio'

  // 0. the module loaded under real FedWiki: /auth/challenge answers
  const ch = await req('GET', aliceHost, '/auth/challenge')
  ok(ch.status === 200 && !!JSON.parse(ch.body || '{}').nonce, 'wiki-security-did loaded: GET /auth/challenge returns a nonce')

  // 1. the pre-claimed owner (Alice) signs in → session bound, owner:true
  const aliceSes = await signIn(aliceHost, A.seedHex, A.did)
  ok(aliceSes.status === 200 && aliceSes.body.ok && aliceSes.body.owner === true, 'owner Alice signs the challenge → verified, recognized as owner')

  // 2. an unauthenticated PUT to Alice's site is rejected (403)
  const anon = await req('PUT', aliceHost, `/page/${aliceSlug}/action`, { body: editAction('aaaaaaaaaaaaaaaa', 'anon edit'), ctype: 'form' })
  ok(anon.status === 403, 'unauthenticated PUT to the portfolio is rejected (403)')

  // 3. Alice's authorized PUT succeeds, and the page actually changes on disk
  const put = await req('PUT', aliceHost, `/page/${aliceSlug}/action`, { cookie: aliceSes.cookie, body: editAction('aaaaaaaaaaaaaaaa', 'EDITED BY OWNER'), ctype: 'form' })
  ok(put.status === 200, 'owner Alice PUT /page/'+aliceSlug+'/action is authorized (200) — FedWiki called isAuthorized and allowed it')
  const pageFile = `${process.argv[3] || '/tmp/didtest-data'}/${aliceHost}/pages/${aliceSlug}`
  let changed = false
  try { changed = JSON.stringify(JSON.parse(fs.readFileSync(pageFile))).includes('EDITED BY OWNER') } catch (e) {}
  ok(changed, 'the owner-authorized edit was written to the page on disk')

  // 4. Bob signs in on Alice's site → NOT owner (site already Alice's), and his PUT is rejected
  const bobSes = await signIn(aliceHost, B.seedHex, B.did)
  ok(bobSes.status === 200 && bobSes.body.ok && bobSes.body.owner === false, 'Bob authenticates on Alice\'s site but is NOT the owner (owner:false)')
  const bobPut = await req('PUT', aliceHost, `/page/${aliceSlug}/action`, { cookie: bobSes.cookie, body: editAction('aaaaaaaaaaaaaaaa', 'BOB WUZ HERE'), ctype: 'form' })
  ok(bobPut.status === 403, 'a non-owner (Bob) PUT to Alice\'s portfolio is rejected (403)')

  console.log(`\n${pass} passed, ${fail} failed`)
  process.exit(fail ? 1 : 0)
})()
