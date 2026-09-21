#!/usr/bin/env node
'use strict'
/*
 * seal.js — put an NDC's seal on an exported records folder, and check one.
 *
 *   node substrate/seal.js keygen  ~/.rcn/ndc-seed            # once: a key, prints its did:key
 *   node substrate/seal.js seal    substrate/export/rcn-table/whatcom --name "Superior AZ NDC" --seed-file ~/.rcn/ndc-seed
 *   node substrate/seal.js verify  substrate/export/rcn-table/whatcom
 *
 * WHAT A SEAL IS. Level 3 of substrate/LAYERS-2-3.md: what an NDC publishes
 * is signed, so a reader's table can say "curated by Superior AZ NDC, as of
 * this date, verified" the way a SODOTO badge verifies — in the browser, from
 * the public key inside the did:key, with no server asked. It is not a lock:
 * anyone can still read and copy the folder. It is the authority to say "this
 * is ours, as of this date", which is the only control a federation offers.
 *
 * WHAT IT COVERS. An EdDSA JWT (the same shape as every SODOTO credential,
 * signed with sodoto/auto-seal/lib/crypto.js) whose payload carries a sha256
 * of every record file — table-*.json, geo.json, graph.json — so changing one
 * row anywhere breaks the seal. index.json carries the seal and is therefore
 * not itself hashed; everything a reader acts on is.
 *
 * WHO SIGNS. This is an institutional seal, the case feedback_sodoto_signing
 * allows on a server: people sign in their browsers, an institution may seal
 * on the machine it controls. The seed lives in a file with mode 600 that this
 * script reads and never prints. A person publishing from the table's own
 * Publish button seals in the browser instead; same JWT, same verifier.
 */
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { signJWT, verifyJWT } = require(path.join(__dirname, '..', 'sodoto', 'auto-seal', 'lib', 'crypto.js'))

const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
function b58encode (buf) {
  let n = 0n
  for (const b of buf) n = n * 256n + BigInt(b)
  let s = ''
  while (n > 0n) { s = B58[Number(n % 58n)] + s; n /= 58n }
  for (const b of buf) { if (b === 0) s = '1' + s; else break }
  return s
}
function didFromSeed (seedHex) {
  const priv = crypto.createPrivateKey({
    key: Buffer.concat([Buffer.from('302e020100300506032b657004220420', 'hex'), Buffer.from(seedHex, 'hex')]),
    format: 'der', type: 'pkcs8' })
  const spki = crypto.createPublicKey(priv).export({ format: 'der', type: 'spki' })
  const raw = spki.subarray(spki.length - 32)
  return 'did:key:z' + b58encode(Buffer.concat([Buffer.from([0xed, 0x01]), raw]))
}
function sha256 (buf) { return 'sha256:' + crypto.createHash('sha256').update(buf).digest('hex') }

function recordFiles (folder, index) {
  const names = Object.values((index.files && index.files.tables) || {})
    .concat([index.files && index.files.geo, index.files && index.files.graph].filter(Boolean))
  return names.map(n => [n, path.join(folder, n)])
}

function keygen (file) {
  if (fs.existsSync(file)) die(`${file} exists — not overwriting a key`)
  const seed = crypto.randomBytes(32).toString('hex')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, seed + '\n', { mode: 0o600 })
  console.log(`seed written to ${file} (mode 600). Back it up; it cannot be recovered.`)
  console.log(`did: ${didFromSeed(seed)}`)
}

function seal (folder, opts) {
  const indexPath = path.join(folder, 'index.json')
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'))
  const seed = fs.readFileSync(opts.seedFile, 'utf8').trim()
  if (!/^[0-9a-f]{64}$/i.test(seed)) die('seed file must hold 64 hex characters')
  const files = {}
  for (const [name, p] of recordFiles(folder, index)) {
    if (!fs.existsSync(p)) die(`missing ${name} — export first`)
    files[name] = sha256(fs.readFileSync(p))
  }
  const did = didFromSeed(seed)
  const now = new Date()
  const payload = {
    iss: did, sub: 'rcn-table/' + index.database, iat: Math.floor(now / 1000),
    name: opts.name, database: index.database, exported: index.exported,
    counts: index.counts, files
  }
  index.seal = { jwt: signJWT(payload, seed), issuer: did, name: opts.name, sealed: now.toISOString() }
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 1))
  console.log(`sealed ${folder} as "${opts.name}" (${did.slice(0, 16)}…${did.slice(-6)}), ${Object.keys(files).length} files`)
}

function verify (folder) {
  const index = JSON.parse(fs.readFileSync(path.join(folder, 'index.json'), 'utf8'))
  if (!index.seal) { console.log('unsealed'); return 1 }
  const { valid, payload, error } = verifyJWT(index.seal.jwt, index.seal.issuer)
  if (!valid) { console.log(`seal INVALID: signature (${error || 'bad'})`); return 2 }
  if (payload.sub !== 'rcn-table/' + index.database) { console.log('seal INVALID: sealed for ' + payload.sub); return 2 }
  let bad = 0
  for (const [name, p] of recordFiles(folder, index)) {
    const want = payload.files[name]
    const have = fs.existsSync(p) ? sha256(fs.readFileSync(p)) : 'missing'
    if (want !== have) { console.log(`  ${name}: CHANGED since sealing`); bad++ }
  }
  for (const name of Object.keys(payload.files)) if (!fs.existsSync(path.join(folder, name))) { console.log(`  ${name}: missing`); bad++ }
  if (bad) { console.log(`seal INVALID: ${bad} file(s) differ`); return 2 }
  console.log(`sealed by "${payload.name}" ${index.seal.issuer} on ${index.seal.sealed} — verified, ${Object.keys(payload.files).length} files`)
  return 0
}

function die (m) { console.error(m); process.exit(1) }

const argv = process.argv.slice(2)
const cmd = argv[0]
const opt = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : undefined }
if (cmd === 'keygen' && argv[1]) keygen(argv[1])
else if (cmd === 'seal' && argv[1]) {
  const seedFile = opt('--seed-file') || process.env.NDC_SEED_FILE
  const name = opt('--name')
  if (!seedFile || !name) die('seal needs --name "Who" and --seed-file <path> (or NDC_SEED_FILE)')
  seal(argv[1], { seedFile, name })
} else if (cmd === 'verify' && argv[1]) process.exit(verify(argv[1]))
else { console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0].split('\n').slice(2, 8).join('\n').replace(/^ \* ?/gm, '')); process.exit(1) }
