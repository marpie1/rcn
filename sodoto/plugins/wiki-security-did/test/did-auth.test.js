'use strict'
// Unit tests for the DID-auth core. No framework — run with `node test/did-auth.test.js`.
const crypto = require('crypto')
const assert = require('assert')
const A = require('../lib/did-auth')

const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
function b58encode (buf) {
  let n = 0n
  for (const b of buf) n = n * 256n + BigInt(b)
  let o = ''
  while (n > 0n) { o = B58[Number(n % 58n)] + o; n /= 58n }
  for (const b of buf) { if (b === 0) o = '1' + o; else break }
  return o
}
// Mint an Ed25519 identity as the browser would: raw pubkey -> 0xed01 -> base58btc.
function mint () {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519')
  const rawPub = publicKey.export({ format: 'der', type: 'spki' }).subarray(-32)
  const did = 'did:key:z' + b58encode(Buffer.concat([Buffer.from([0xed, 0x01]), rawPub]))
  return { did, privateKey }
}
function signNonce (privateKey, nonce) {
  return crypto.sign(null, Buffer.from(String(nonce), 'utf8'), privateKey).toString('base64url')
}

let passed = 0
function ok (cond, msg) { assert.ok(cond, msg); console.log('  ✓', msg); passed++ }

// --- did:key encoding matches the badge-plugin decode (0xed01 + base58btc) ---
const alice = mint()
ok(alice.did.startsWith('did:key:z6Mk'), 'minted did:key has the Ed25519 z6Mk prefix')
ok(A.didKeyToPublicKey(alice.did).length === 32, 'did:key decodes to a 32-byte public key')

// --- happy path: sign the challenge, authenticate ---
{
  const store = new A.ChallengeStore()
  const nonce = store.create()
  const sig = signNonce(alice.privateKey, nonce)
  const r = A.authenticate(store, { did: alice.did, nonce, signature: sig })
  ok(r.ok && r.did === alice.did, 'valid signature over a fresh challenge authenticates')
}

// --- wrong key is rejected ---
{
  const store = new A.ChallengeStore()
  const nonce = store.create()
  const bob = mint()
  const sig = signNonce(bob.privateKey, nonce)          // Bob signs, claims to be Alice
  const r = A.authenticate(store, { did: alice.did, nonce, signature: sig })
  ok(!r.ok, 'signature by a different key is rejected: ' + r.error)
}

// --- tampered nonce (signed a different value) is rejected ---
{
  const store = new A.ChallengeStore()
  const nonce = store.create()
  const sig = signNonce(alice.privateKey, nonce + 'x')  // signed the wrong string
  const r = A.authenticate(store, { did: alice.did, nonce, signature: sig })
  ok(!r.ok, 'signature over a different message is rejected: ' + r.error)
}

// --- single use: the same nonce cannot be redeemed twice ---
{
  const store = new A.ChallengeStore()
  const nonce = store.create()
  const sig = signNonce(alice.privateKey, nonce)
  const first = A.authenticate(store, { did: alice.did, nonce, signature: sig })
  const second = A.authenticate(store, { did: alice.did, nonce, signature: sig })
  ok(first.ok && !second.ok, 'a challenge is single-use (replay rejected): ' + second.error)
}

// --- expired challenge is rejected (injected clock) ---
{
  let t = 1000
  const store = new A.ChallengeStore({ ttlMs: 100, now: () => t })
  const nonce = store.create()
  t += 200                                               // past the TTL
  const sig = signNonce(alice.privateKey, nonce)
  const r = A.authenticate(store, { did: alice.did, nonce, signature: sig })
  ok(!r.ok, 'an expired challenge is rejected: ' + r.error)
}

// --- unknown nonce is rejected ---
{
  const store = new A.ChallengeStore()
  const sig = signNonce(alice.privateKey, 'never-issued')
  const r = A.authenticate(store, { did: alice.did, nonce: 'never-issued', signature: sig })
  ok(!r.ok, 'an unissued challenge is rejected: ' + r.error)
}

// --- constrained claim & authorization ---
ok(A.canClaim(alice.did, alice.did), 'the expected holder can claim their portfolio')
ok(!A.canClaim(mint().did, alice.did), 'a stranger cannot claim someone else\'s portfolio')
ok(A.isAuthorized(alice.did, alice.did), 'the owner is authorized to write')
ok(!A.isAuthorized(mint().did, alice.did), 'a non-owner is not authorized to write')

// --- the badge is the authority on who owns a portfolio (holderDidFromPage) ---
{
  const page = { title: 'Alex', story: [
    { type: 'paragraph', text: 'about me' },
    { type: 'sodoto-badge', credential: { holderDid: alice.did, skill: 'x' } }
  ] }
  ok(A.holderDidFromPage(page) === alice.did, 'holderDidFromPage reads the holder DID from the page badge')
  ok(A.holderDidFromPage({ story: [{ type: 'paragraph' }] }) === '', 'a page with no badge yields no holder (fail closed)')
  ok(A.holderDidFromPage({}) === '' && A.holderDidFromPage(null) === '', 'a missing/empty page yields no holder')
}

console.log(`\n${passed} checks passed.`)
