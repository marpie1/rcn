'use strict'
// Client for no-restart.sh. phase1 runs against the production-shaped config;
// phase2 runs after the one-time migration restart, and never restarts again.
const crypto = require('crypto')
const http = require('http')
const fs = require('fs')
const path = require('path')

const KEYS = JSON.parse(fs.readFileSync(process.argv[2]))
const PHASE = process.argv[3]
const WPORT = parseInt(process.env.WIKIPORT, 10), PPORT = parseInt(process.env.PROXYPORT, 10)
const DATA = process.env.DATA
let pass = 0, fail = 0
const ok = (c, m) => { console.log((c ? 'PASS' : 'FAIL') + '  ' + m); c ? pass++ : fail++ }

const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
function b58 (buf) { let n = 0n; for (const b of buf) n = n * 256n + BigInt(b); let o = ''; while (n > 0n) { o = B58[Number(n % 58n)] + o; n /= 58n } for (const b of buf) { if (b === 0) o = '1' + o; else break } return o }
function mint () {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519')
  const rawPub = publicKey.export({ format: 'der', type: 'spki' }).subarray(-32)
  const seed = privateKey.export({ format: 'der', type: 'pkcs8' }).subarray(-32)
  return { did: 'did:key:z' + b58(Buffer.concat([Buffer.from([0xed, 0x01]), rawPub])), seedHex: Buffer.from(seed).toString('hex') }
}
function keyFromSeed (seedHex) {
  const pkcs8 = Buffer.concat([Buffer.from('302e020100300506032b657004220420', 'hex'), Buffer.from(seedHex, 'hex')])
  return crypto.createPrivateKey({ key: pkcs8, format: 'der', type: 'pkcs8' })
}
const signNonce = (seedHex, nonce) => crypto.sign(null, Buffer.from(nonce, 'utf8'), keyFromSeed(seedHex)).toString('base64url')

function req (port, method, host, p, { cookie, body, ctype, auth } = {}) {
  return new Promise((resolve) => {
    const data = body == null ? null : (ctype === 'form' ? body : JSON.stringify(body))
    const headers = { Host: host }
    if (data != null) { headers['Content-Type'] = ctype === 'form' ? 'application/x-www-form-urlencoded' : 'application/json'; headers['Content-Length'] = Buffer.byteLength(data) }
    if (cookie) headers.Cookie = cookie
    if (auth) headers.Authorization = 'Bearer ' + auth
    const r = http.request({ host: '127.0.0.1', port, method, path: p, headers }, (res) => {
      let b = ''; res.on('data', d => b += d); res.on('end', () => resolve({ status: res.statusCode, body: b, setCookie: res.headers['set-cookie'] }))
    })
    r.on('error', e => resolve({ status: 0, body: String(e) }))
    if (data != null) r.write(data); r.end()
  })
}
const wiki = (...a) => req(WPORT, ...a)
const json = s => { try { return JSON.parse(s) } catch (e) { return {} } }

async function provision (name, slug, did) {
  const r = await req(PPORT, 'POST', 'localhost', '/api/sodoto-provision-site', { auth: 'test-secret',
    body: { name, slug, site: `${slug}.wiki.test`, portfolioSlug: `${slug}-sodoto-portfolio`, did } })
  return { status: r.status, body: json(r.body) }
}
async function signIn (host, who) {
  const nonce = json((await wiki('GET', host, '/auth/challenge')).body).nonce
  const v = await wiki('POST', host, '/auth/verify', { body: { did: who.did, nonce, signature: signNonce(who.seedHex, nonce) } })
  return { status: v.status, body: json(v.body), cookie: (v.setCookie || []).map(c => c.split(';')[0]).join('; ') }
}
const edit = (id, text) => 'action=' + encodeURIComponent(JSON.stringify({ type: 'edit', id, item: { type: 'paragraph', id, text } }))
const itemId = slug => slug.replace(/[^a-z0-9]/g, '').slice(0, 16).padEnd(16, '0')
const cfg = () => json(fs.readFileSync(path.join(DATA, 'config.json'), 'utf8')).wikiDomains || {}

async function newPersonNoRestart (label, slug, who, { visitFirst } = {}) {
  const host = `${slug}.wiki.test`, pslug = `${slug}-sodoto-portfolio`
  if (visitFirst) {
    const early = await wiki('GET', host, '/auth/challenge')
    ok(early.status === 200, `${label}: their site answers even before it is provisioned (the farm starts it on first visit)`)
  }
  const p = await provision(label, slug, who.did)
  ok(p.status === 200 && p.body.ok, `${label}: provisioned`)
  ok(p.body.needsRestart === false, `${label}: the proxy reports no restart needed`)
  ok(!(host in cfg()), `${label}: no per-site entry was added to config.json`)
  ok(fs.existsSync(path.join(DATA, host, 'status', 'owner.json')), `${label}: owner file written to status/owner.json`)
  const m = await signIn(host, KEYS.mallory)
  ok(m.status === 403, `${label}: a stranger cannot claim the new site (403)`)
  const s = await signIn(host, who)
  ok(s.status === 200 && s.body.owner === true, `${label}: signs in and owns the site — no restart`)
  const put = await wiki('PUT', host, `/page/${pslug}/action`, { cookie: s.cookie, body: edit(itemId(slug), `edited by ${label}`), ctype: 'form' })
  ok(put.status === 200, `${label}: their edit is accepted (200)`)
  let onDisk = false
  try { onDisk = fs.readFileSync(path.join(DATA, host, 'pages', pslug), 'utf8').includes(`edited by ${label}`) } catch (e) {}
  ok(onDisk, `${label}: the edit is on disk`)
  const mp = await wiki('PUT', host, `/page/${pslug}/action`, { cookie: m.cookie, body: edit(itemId(slug), 'mallory'), ctype: 'form' })
  ok(mp.status === 403, `${label}: a stranger's edit is refused (403)`)
}

;(async () => {
  if (PHASE === 'phase1') {
    const p = await provision('Carol', 'carol', KEYS.carol.did)
    ok(p.status === 200 && p.body.ok, 'Carol provisioned against the old config shape')
    ok(p.body.needsRestart === true, 'the first provision migrates config.json and asks for one last restart')
    const c = cfg()
    ok(c['wiki.test'] && !('id' in c['wiki.test']), 'the base entry no longer names an owner file')
    ok(c['old.wiki.test'] && c['old.wiki.test'].id, 'the older site keeps its own entry')
  } else {
    await newPersonNoRestart('Carol', 'carol', KEYS.carol)   // provisioned in phase1; re-provision is a no-op
    const dave = mint()
    await newPersonNoRestart('Dave', 'dave', dave)
    const eve = mint()
    await newPersonNoRestart('Eve', 'eve', eve, { visitFirst: true })

    const cOnDave = await signIn('dave.wiki.test', KEYS.carol)
    ok(cOnDave.status === 200 && cOnDave.body.owner === false, "Carol is not an owner of Dave's site")
    const a = await signIn('wiki.test', KEYS.admin)
    ok(a.status === 200 && a.body.owner === true, 'the base site still belongs to its admin')
    const o = await signIn('old.wiki.test', KEYS.olive)
    ok(o.status === 200 && o.body.owner === true, 'an older site (own config entry, root owner.json) still belongs to its owner')
    const op = await wiki('PUT', 'old.wiki.test', '/page/olive-sodoto-portfolio/action', { cookie: o.cookie, body: edit('bbbbbbbbbbbbbbbb', 'olive edit'), ctype: 'form' })
    ok(op.status === 200, 'the older site owner can still edit')
  }
  console.log(`\n${PHASE}: ${pass} passed, ${fail} failed`)
  process.exit(fail ? 1 : 0)
})()
