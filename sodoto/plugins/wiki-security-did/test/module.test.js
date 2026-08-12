'use strict'
// Module-level tests: the FedWiki interface (setOwner/retrieveOwner/isAuthorized)
// and the challenge→verify sign-in, driven with mock req/res. Run with
// `node test/module.test.js`. (The only thing NOT covered here is the live wiki
// server actually calling isAuthorized on a page PUT — that needs a running FedWiki.)
const crypto = require('crypto')
const assert = require('assert')
const os = require('os')
const path = require('path')
const fs = require('fs')

const makeModule = require('../index.js')

const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
function b58encode (buf) { let n = 0n; for (const b of buf) n = n * 256n + BigInt(b); let o = ''; while (n > 0n) { o = B58[Number(n % 58n)] + o; n /= 58n } for (const b of buf) { if (b === 0) o = '1' + o; else break } return o }
function mint () { const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519'); const raw = publicKey.export({ format: 'der', type: 'spki' }).subarray(-32); return { did: 'did:key:z' + b58encode(Buffer.concat([Buffer.from([0xed, 0x01]), raw])), privateKey } }
function signNonce (pk, nonce) { return crypto.sign(null, Buffer.from(String(nonce), 'utf8'), pk).toString('base64url') }
function res () { return { code: 200, body: null, status (c) { this.code = c; return this }, json (o) { this.body = o; return this }, redirect () {} } }
const noop = () => {}

let passed = 0
function ok (c, m) { assert.ok(c, m); console.log('  ✓', m); passed++ }

const alice = mint(), bob = mint()

// helper: run a full challenge→sign→verify against a module instance
function signIn (sec, identity, session) {
  const cr = res(); sec.challenge({}, cr)
  const nonce = cr.body.nonce
  const vr = res(); const req = { body: { did: identity.did, nonce, signature: signNonce(identity.privateKey, nonce) }, session }
  sec.verify(noop)(req, vr)
  return { req, vr }
}

// --- provisioned owner: the holder signs in and is authorized ---
{
  const idFile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'did-')), 'owner.json')
  const sec = makeModule(noop, noop, { id: idFile })
  sec.setOwner({ name: 'Dana', did: alice.did })                 // provisioned from the registry
  ok(sec.ownerDid() === alice.did, 'owner DID is set from provisioning')
  ok(JSON.parse(fs.readFileSync(idFile)).did === alice.did, 'owner.json on disk records the owner DID')

  const session = {}
  const { req, vr } = signIn(sec, alice, session)
  ok(vr.body && vr.body.ok && session.did === alice.did, 'holder signs a challenge → session bound to their DID')
  ok(sec.isAuthorized(req), 'the signed-in holder is authorized to write')
  ok(!sec.isAuthorized({ session: { did: bob.did } }), 'a different DID is not authorized to write')
  ok(!sec.isAuthorized({ session: {} }), 'an unauthenticated request is not authorized')
}

// --- wrong signer is rejected at verify ---
{
  const sec = makeModule(noop, noop, { id: path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'did-')), 'owner.json') })
  sec.setOwner({ name: 'Dana', did: alice.did })
  const cr = res(); sec.challenge({}, cr)
  const nonce = cr.body.nonce
  const vr = res()
  sec.verify(noop)({ body: { did: alice.did, nonce, signature: signNonce(bob.privateKey, nonce) }, session: {} }, vr)
  ok(vr.code === 401 && !vr.body.ok, 'a challenge signed by the wrong key is rejected (401)')
}

// --- constrained interactive claim: only the expected holder may claim ---
{
  const sec = makeModule(noop, noop, { id: path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'did-')), 'owner.json') })
  sec.setOwner({ name: 'Dana', expectDid: alice.did })            // unclaimed, but bound to alice
  ok(sec.ownerDid() === '', 'site is unclaimed (no owner DID yet)')

  const bobTry = signIn(sec, bob, {})
  ok(bobTry.vr.code === 403 && sec.ownerDid() === '', 'a stranger cannot claim a portfolio bound to someone else (403)')

  const aliceTry = signIn(sec, alice, {})
  ok(aliceTry.vr.body.ok && sec.ownerDid() === alice.did, 'the expected holder claims it, becoming the owner')
}

console.log(`\n${passed} checks passed.`)
