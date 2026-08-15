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

// --- badge is the source of the owner: no badge → nobody can claim (fail closed);
//     once the badge names Alice, only Alice may claim ---
{
  const idFile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'did-')), 'owner.json')
  let pageHolder = ''                                            // portfolio has no badge yet
  const sec = makeModule(noop, noop, { id: idFile, expectedHolder: () => pageHolder })
  ok(sec.ownerDid() === '', 'site starts unowned')

  const early = signIn(sec, alice, {})
  ok(early.vr.code === 403 && sec.ownerDid() === '', 'no badge yet → nobody can claim (fail closed, 403)')

  pageHolder = alice.did                                         // issuer writes Alice's first badge
  const bobTry = signIn(sec, bob, {})
  ok(bobTry.vr.code === 403 && sec.ownerDid() === '', 'a non-holder cannot claim once the badge names Alice (403)')

  const aliceTry = signIn(sec, alice, {})
  ok(aliceTry.vr.body.ok && sec.ownerDid() === alice.did, 'the badge-named holder claims the site')
}

// --- owner sourced straight from the portfolio page file (badge holderDid) ---
{
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'did-'))
  const portfolioPath = path.join(dir, 'alex-rivera')
  fs.writeFileSync(portfolioPath, JSON.stringify({ title: 'Alex Rivera', story: [
    { type: 'sodoto-badge', credential: { holderDid: alice.did } }
  ] }))
  const sec = makeModule(noop, noop, { id: path.join(dir, 'owner.json'), portfolioPath })
  const bobTry = signIn(sec, bob, {})
  ok(bobTry.vr.code === 403, 'a stranger is refused against the page-file badge holder (403)')
  const aliceTry = signIn(sec, alice, {})
  ok(aliceTry.vr.body.ok && sec.ownerDid() === alice.did, 'the holder from the page-file badge claims the site')
}

// --- defineRoutes registers the auth routes incl. the sign-in widget ---
{
  const sec = makeModule(noop, noop, { id: path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'did-')), 'owner.json') })
  const routes = []
  const app = { get: (p) => routes.push('GET ' + p), post: (p) => routes.push('POST ' + p) }
  sec.defineRoutes(app, null, noop)
  ok(routes.includes('GET /auth/challenge') && routes.includes('POST /auth/verify') && routes.includes('GET /auth/signin.js'),
     'defineRoutes registers /auth/challenge, /auth/verify, and the /auth/signin.js widget')
}

// --- owner_scope guard: only shape A ('site') is supported ---
{
  let threw = false
  try { makeModule(noop, noop, { id: '/tmp/x', owner_scope: 'page' }) } catch (e) { threw = /owner_scope/.test(e.message) }
  ok(threw, "owner_scope 'page' is refused (only 'site' supported)")
  const okSite = makeModule(noop, noop, { id: path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'did-')), 'owner.json'), owner_scope: 'site' })
  ok(typeof okSite.isAuthorized === 'function', "owner_scope 'site' is accepted")
}

console.log(`\n${passed} checks passed.`)
