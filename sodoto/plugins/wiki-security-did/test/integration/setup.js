'use strict'
// Lay down a FedWiki farm data dir with two per-person sites, each owner.json
// pre-claimed to a real did:key (simulating badge-sets-owner having run). Saves
// the seeds so the client can sign challenges. Paths are CONTAINER paths
// (/root/.wiki/...) because the wiki runs in a container mounting DATA there.
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const DATA = process.argv[2] || '/tmp/didtest-data'   // host path to write
const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
function b58 (buf) { let n = 0n; for (const b of buf) n = n * 256n + BigInt(b); let o = ''; while (n > 0n) { o = B58[Number(n % 58n)] + o; n /= 58n } for (const b of buf) { if (b === 0) o = '1' + o; else break } return o }
function mint () {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519')
  const rawPub = publicKey.export({ format: 'der', type: 'spki' }).subarray(-32)
  const seed = privateKey.export({ format: 'der', type: 'pkcs8' }).subarray(-32)   // 32-byte seed
  const did = 'did:key:z' + b58(Buffer.concat([Buffer.from([0xed, 0x01]), rawPub]))
  return { did, seedHex: Buffer.from(seed).toString('hex') }
}

const alice = mint(), bob = mint()
const sites = {
  'alice.localhost': { name: 'Alice', slug: 'alice-portfolio', owner: alice.did },
  'bob.localhost':   { name: 'Bob',   slug: 'bob-portfolio',   owner: bob.did }
}

fs.rmSync(DATA, { recursive: true, force: true })
const wikiDomains = {}
for (const [site, s] of Object.entries(sites)) {
  const siteDir = path.join(DATA, site)
  const pagesDir = path.join(siteDir, 'pages')
  fs.mkdirSync(pagesDir, { recursive: true })
  // owner.json — pre-claimed to the holder DID (as badge-sets-owner would leave it)
  fs.writeFileSync(path.join(siteDir, 'owner.json'),
    JSON.stringify({ name: s.name, did: s.owner }, null, 2))
  // the portfolio page with one editable item, plus a home page
  const item = { type: 'paragraph', id: 'aaaaaaaaaaaaaaaa', text: `${s.name}'s portfolio.` }
  const page = { title: `${s.name} SODOTO Portfolio`, story: [item],
    journal: [{ type: 'create', id: 'init', date: Date.now(), item: { title: `${s.name} SODOTO Portfolio` } }] }
  fs.writeFileSync(path.join(pagesDir, s.slug), JSON.stringify(page, null, 2))
  fs.writeFileSync(path.join(pagesDir, 'welcome-visitors'),
    JSON.stringify({ title: 'Welcome Visitors', story: [], journal: [] }))
  // CONTAINER path — the wiki sees the data at /root/.wiki
  wikiDomains[site] = { id: `/root/.wiki/${site}/owner.json` }
}
fs.writeFileSync(path.join(DATA, 'config.json'), JSON.stringify({ wikiDomains }, null, 2))

fs.writeFileSync(path.join(DATA, '..', 'didtest-keys.json'),
  JSON.stringify({ alice, bob, sites }, null, 2))
console.log('wrote farm data to', DATA)
console.log('sites:', Object.keys(sites).join(', '))
console.log('alice.did', alice.did)
console.log('bob.did  ', bob.did)
