'use strict'
// wiki-security-did — a FedWiki security module whose identity is a self-custodied
// did:key. It implements the same interface as wiki-security-friends, but swaps the
// shared "friend secret" for Ed25519 signatures: a person signs in by proving
// control of their DID (challenge → sign the nonce → verify), and may write iff
// their DID equals the owner DID recorded in owner.json.
//
// Owner is set from the registry at provisioning (owner.json = {name, did, expectDid});
// so ownership is bound to the expected holder, never "first to sign in wins".
//
// Config (argv): id = owner identity file path; admin = admin DID or array; the
// module also honors owner.expectDid for a constrained interactive claim.

const fs = require('fs')
const A = require('./lib/did-auth')

module.exports = function (log, loga, argv) {
  argv = argv || {}
  const idFile = argv.id
  const admins = [].concat(argv.admin || []).filter(Boolean)
  const challenges = new A.ChallengeStore({ ttlMs: 2 * 60 * 1000 })
  let owner = {}

  // Shape A only (per-person sites, owner_scope: site). Shared-site per-page
  // ownership isn't implemented — fail loud rather than silently mis-authorize.
  const scope = argv.owner_scope || 'site'
  if (scope !== 'site') {
    throw new Error(`wiki-security-did: owner_scope '${scope}' is not supported yet (only 'site' — shape A, per-person sites)`)
  }

  // Who may claim this (unowned) site — the badge on the portfolio is the authority
  // (Marc's decision, Aug 2026). Resolve in order: an injected resolver (tests /
  // custom wiring), the portfolio page file (badge holderDid), then the
  // registry-provisioned expectDid as a fallback. '' → cannot establish a holder,
  // so the claim is refused (fail closed).
  function expectedHolderDid () {
    if (typeof argv.expectedHolder === 'function') {
      try { return argv.expectedHolder() || '' } catch (e) { return '' }
    }
    if (argv.portfolioPath) {
      try { return A.holderDidFromPage(JSON.parse(fs.readFileSync(argv.portfolioPath, 'utf8'))) || '' }
      catch (e) { return '' }
    }
    return owner.expectDid || ''
  }

  function retrieveOwner (cb) {
    if (!idFile) { if (cb) cb(); return }
    fs.readFile(idFile, (err, data) => {
      if (!err) { try { owner = JSON.parse(data) } catch (e) { owner = {} } }
      if (cb) cb()
    })
  }
  function getOwner () { return owner.name || '' }
  function ownerDid () { return owner.did || '' }
  function setOwner (id, cb) {                 // id = { name, did[, expectDid] }
    owner = Object.assign({}, owner, id)
    if (idFile) { try { fs.writeFileSync(idFile, JSON.stringify(owner, null, 2)) } catch (e) {} }
    if (cb) cb()
  }
  function getUser (req) { return (req && req.session && req.session.did) || undefined }
  function isAuthorized (req) { return A.isAuthorized(getUser(req), ownerDid()) }
  function isAdmin (req) { const d = getUser(req); return !!d && admins.indexOf(d) >= 0 }

  // ---- sign-in: our widget calls these two routes ----
  function challenge (req, res) {
    res.json({ nonce: challenges.create(), ttlMs: challenges.ttlMs })
  }
  function verify (updateOwner) {
    return function (req, res) {
      const body = req.body || {}
      const r = A.authenticate(challenges, { did: body.did, nonce: body.nonce, signature: body.signature })
      if (!r.ok) return res.status(401).json({ ok: false, error: r.error })
      // Unclaimed site: claim it only if this DID is the expected holder — and
      // only if a holder can be established at all (the badge is the authority).
      if (!ownerDid()) {
        const expected = expectedHolderDid()
        if (!expected) {
          return res.status(403).json({ ok: false, error: 'this portfolio has no badge yet — ownership cannot be established until a badge is issued' })
        }
        if (!A.canClaim(r.did, expected)) {
          return res.status(403).json({ ok: false, error: 'this portfolio belongs to a different identity' })
        }
        setOwner({ name: owner.name || r.did, did: r.did })
        if (updateOwner) updateOwner(getOwner())
      }
      if (req.session) req.session.did = r.did
      res.json({ ok: true, did: r.did, owner: A.isAuthorized(r.did, ownerDid()) })
    }
  }
  function login (updateOwner) { return verify(updateOwner) }   // "login" == verify a signed challenge
  function logout () {
    return function (req, res) {
      if (req.session && req.session.reset) req.session.reset()
      res.redirect('/')
    }
  }
  function reclaim () {   // DID needs no reclaim code — you prove the key. Kept for interface parity.
    return function (req, res) { res.status(501).json({ ok: false, error: 'reclaim not used; prove your DID' }) }
  }

  function defineRoutes (app, cors, updateOwner) {
    const mw = cors || function (req, res, next) { next() }
    app.get('/auth/challenge', mw, challenge)
    app.post('/auth/verify', mw, verify(updateOwner))
    app.post('/login', mw, verify(updateOwner))
    app.get('/logout', logout())
    app.post('/auth/reclaim/', mw, reclaim())
  }

  return {
    retrieveOwner, getOwner, setOwner, getUser, isAuthorized, isAdmin,
    login, logout, reclaim, defineRoutes,
    // exposed for provisioning / tests
    ownerDid, challenge, verify
  }
}
