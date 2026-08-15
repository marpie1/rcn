'use strict'
// did-auth.js — framework-agnostic core for DID (Decentralized Identifier)
// authentication. No FedWiki, no Express here: just did:key decoding, Ed25519
// signature verification, a single-use challenge store, and the claim/authorize
// decisions. This is the security-critical part, and it is fully unit-testable.

const crypto = require('crypto')

const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

// base58btc decode (Bitcoin alphabet) — mirrors the sodoto-badge verifier.
function b58decode (s) {
  let n = 0n
  for (const c of s) {
    const i = B58.indexOf(c)
    if (i < 0) throw new Error('invalid base58 character')
    n = n * 58n + BigInt(i)
  }
  const bytes = []
  while (n > 0n) { bytes.unshift(Number(n % 256n)); n /= 256n }
  for (const c of s) { if (c === '1') bytes.unshift(0); else break }
  return Buffer.from(bytes)
}

// did:key:z<base58btc(0xed01 ‖ 32-byte ed25519 pubkey)>  ->  raw 32-byte key
function didKeyToPublicKey (did) {
  if (typeof did !== 'string' || !did.startsWith('did:key:z')) {
    throw new Error('not a did:key')
  }
  const decoded = b58decode(did.slice('did:key:z'.length))
  if (decoded[0] !== 0xed || decoded[1] !== 0x01) {
    throw new Error('did:key is not Ed25519')
  }
  const raw = decoded.subarray(2)
  if (raw.length !== 32) throw new Error('bad Ed25519 key length')
  return raw
}

// Wrap a raw 32-byte Ed25519 public key in the fixed SPKI DER prefix so Node's
// crypto can import it, then verify a detached signature over `message`.
const SPKI_ED25519_PREFIX = Buffer.from('302a300506032b6570032100', 'hex')
function verifyDidSignature (did, message, signature) {
  try {
    const raw = didKeyToPublicKey(did)
    const der = Buffer.concat([SPKI_ED25519_PREFIX, raw])
    const key = crypto.createPublicKey({ key: der, format: 'der', type: 'spki' })
    const msg = Buffer.isBuffer(message) ? message : Buffer.from(String(message), 'utf8')
    const sig = Buffer.isBuffer(signature) ? signature : Buffer.from(signature)
    return crypto.verify(null, msg, key, sig)
  } catch (e) {
    return false
  }
}

function b64urlToBuffer (s) {
  return Buffer.from(String(s).replace(/-/g, '+').replace(/_/g, '/'), 'base64')
}

// Single-use, time-bounded nonces. In-memory is fine for one server; swap the
// Map for a shared store if an NDC ever runs multiple proxy replicas.
class ChallengeStore {
  constructor ({ ttlMs = 120000, now = () => Date.now() } = {}) {
    this.ttlMs = ttlMs
    this.now = now
    this._m = new Map()  // nonce -> expiry
  }

  create () {
    this._sweep()
    const nonce = crypto.randomBytes(24).toString('base64url')
    this._m.set(nonce, this.now() + this.ttlMs)
    return nonce
  }

  // Redeem a nonce exactly once, if present and unexpired.
  redeem (nonce) {
    const exp = this._m.get(nonce)
    if (exp === undefined) return false
    this._m.delete(nonce)          // single use, even if expired
    return this.now() <= exp
  }

  _sweep () {
    const t = this.now()
    for (const [k, exp] of this._m) if (t > exp) this._m.delete(k)
  }
}

// Verify a sign-in attempt: the nonce must be live and single-use, and the
// signature must be a valid Ed25519 signature over the nonce by `did`.
function authenticate (store, { did, nonce, signature }) {
  if (!did || !nonce || !signature) return { ok: false, error: 'missing did, nonce, or signature' }
  if (!store.redeem(nonce)) return { ok: false, error: 'challenge expired, unknown, or already used' }
  if (!verifyDidSignature(did, Buffer.from(String(nonce), 'utf8'), b64urlToBuffer(signature))) {
    return { ok: false, error: 'signature does not verify against the DID' }
  }
  return { ok: true, did }
}

// A portfolio may be claimed only by its expected holder (bound from the badge
// / registry) — never "first to sign in wins".
function canClaim (sessionDid, expectedHolderDid) {
  return !!sessionDid && !!expectedHolderDid && sessionDid === expectedHolderDid
}

// A write is authorized iff the signed-in DID owns the target.
function isAuthorized (sessionDid, ownerDid) {
  return !!sessionDid && !!ownerDid && sessionDid === ownerDid
}

// The badge is the authority on who owns a portfolio (Marc's decision, Aug 2026):
// pull the holder DID from the first sodoto-badge item on the FedWiki page object.
// Returns '' if the page has no badge yet — an unbadged portfolio has no established
// holder, so ownership can't be claimed until a badge lands (fail closed).
function holderDidFromPage (page) {
  const story = (page && page.story) || []
  for (const item of story) {
    if (item && item.type === 'sodoto-badge') {
      const did = item.credential && item.credential.holderDid
      if (did) return did
    }
  }
  return ''
}

module.exports = {
  b58decode, didKeyToPublicKey, verifyDidSignature, b64urlToBuffer,
  ChallengeStore, authenticate, canClaim, isAuthorized, holderDidFromPage
}
