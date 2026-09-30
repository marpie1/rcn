'use strict'
// Production-shaped farm data for no-restart.sh: the base host wiki.test with a
// wikiDomains entry that names its owner file (as the proxy used to write it),
// and one older person site, old.wiki.test, with its own entry and a root-level
// owner.json already claimed. Keys are written beside DATA for the client.
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const DATA = process.argv[2]
const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
function b58 (buf) { let n = 0n; for (const b of buf) n = n * 256n + BigInt(b); let o = ''; while (n > 0n) { o = B58[Number(n % 58n)] + o; n /= 58n } for (const b of buf) { if (b === 0) o = '1' + o; else break } return o }
function mint () {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519')
  const rawPub = publicKey.export({ format: 'der', type: 'spki' }).subarray(-32)
  const seed = privateKey.export({ format: 'der', type: 'pkcs8' }).subarray(-32)
  return { did: 'did:key:z' + b58(Buffer.concat([Buffer.from([0xed, 0x01]), rawPub])), seedHex: Buffer.from(seed).toString('hex') }
}
const admin = mint(), olive = mint(), carol = mint(), dave = mint(), mallory = mint()

fs.rmSync(DATA, { recursive: true, force: true })
const page = (title, id, text) => ({ title, story: [{ type: 'paragraph', id, text }],
  journal: [{ type: 'create', id: 'init', date: Date.now(), item: { title } }] })

// base host — owner in status/, as plain FedWiki keeps it
fs.mkdirSync(path.join(DATA, 'wiki.test', 'status'), { recursive: true })
fs.mkdirSync(path.join(DATA, 'wiki.test', 'pages'), { recursive: true })
fs.writeFileSync(path.join(DATA, 'wiki.test', 'status', 'owner.json'), JSON.stringify({ name: 'SODOTO Admin', did: admin.did }))

// an older person site — root-level owner.json, its own wikiDomains entry
fs.mkdirSync(path.join(DATA, 'old.wiki.test', 'pages'), { recursive: true })
fs.writeFileSync(path.join(DATA, 'old.wiki.test', 'owner.json'), JSON.stringify({ name: 'Olive', did: olive.did }))
fs.writeFileSync(path.join(DATA, 'old.wiki.test', 'pages', 'olive-sodoto-portfolio'),
  JSON.stringify(page('Olive SODOTO Portfolio', 'bbbbbbbbbbbbbbbb', 'Olive.')))

fs.writeFileSync(path.join(DATA, 'config.json'), JSON.stringify({ wikiDomains: {
  'wiki.test': { id: '/root/.wiki/wiki.test/status/owner.json' },
  'old.wiki.test': { id: '/root/.wiki/old.wiki.test/owner.json' }
} }, null, 2))

fs.writeFileSync(path.join(DATA, '..', 'keys.json'), JSON.stringify({ admin, olive, carol, dave, mallory }, null, 2))
