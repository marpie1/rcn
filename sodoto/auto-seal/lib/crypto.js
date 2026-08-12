'use strict'
// Minimal Ed25519 / did:key / JWT crypto for the NDC auto-seal engine (Node).
// Self-contained so an NDC server can run the engine without other RCN modules.
const crypto = require('crypto')

const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
function b58decode (s) {
  let n = 0n
  for (const c of s) { const i = B58.indexOf(c); if (i < 0) throw new Error('bad base58'); n = n * 58n + BigInt(i) }
  const b = []; while (n > 0n) { b.unshift(Number(n % 256n)); n /= 256n }
  for (const c of s) { if (c === '1') b.unshift(0); else break }
  return Buffer.from(b)
}
function didKeyToPublicKey (did) {
  if (typeof did !== 'string' || !did.startsWith('did:key:z')) throw new Error('not a did:key')
  const d = b58decode(did.slice('did:key:z'.length))
  if (d[0] !== 0xed || d[1] !== 0x01) throw new Error('did:key not Ed25519')
  const raw = d.subarray(2)
  if (raw.length !== 32) throw new Error('bad key length')
  return raw
}

const SPKI = Buffer.from('302a300506032b6570032100', 'hex')     // Ed25519 SPKI prefix
const PKCS8 = Buffer.from('302e020100300506032b657004220420', 'hex') // Ed25519 PKCS8 prefix
function pubKey (did) { return crypto.createPublicKey({ key: Buffer.concat([SPKI, didKeyToPublicKey(did)]), format: 'der', type: 'spki' }) }
function privKey (seedHex) { return crypto.createPrivateKey({ key: Buffer.concat([PKCS8, Buffer.from(seedHex, 'hex')]), format: 'der', type: 'pkcs8' }) }

function b64uJson (o) { return Buffer.from(JSON.stringify(o)).toString('base64url') }

// Sign a detached EdDSA JWT (header.payload.signature) with a 32-byte seed.
function signJWT (payload, seedHex) {
  const si = b64uJson({ alg: 'EdDSA', typ: 'JWT' }) + '.' + b64uJson(payload)
  const sig = crypto.sign(null, Buffer.from(si, 'utf8'), privKey(seedHex))
  return si + '.' + sig.toString('base64url')
}
// Verify a JWT against a did:key. Returns { valid, payload }.
function verifyJWT (jwt, did) {
  try {
    const p = String(jwt).split('.')
    if (p.length !== 3) return { valid: false, error: 'malformed' }
    const valid = crypto.verify(null, Buffer.from(p[0] + '.' + p[1], 'utf8'), pubKey(did), Buffer.from(p[2], 'base64url'))
    const payload = JSON.parse(Buffer.from(p[1], 'base64url').toString('utf8'))
    return { valid, payload }
  } catch (e) { return { valid: false, error: e.message } }
}

module.exports = { didKeyToPublicKey, signJWT, verifyJWT }
