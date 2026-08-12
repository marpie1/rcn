'use strict'
// NDC auto-seal engine. When a contract's full mutual-attestation set is present
// and valid, and the witnessing mentor(s) are qualified, apply the NDC seal —
// sign the credential with the NDC key. No coordinator. Implements
// docs/sodoto-ndc-auto-seal-spec.md.
//
// Two rules the spec fixes in place:
//  - People sign in their browsers; only the institutional seal is server-side.
//  - Qualification reads the BADGES (verifies signatures), never a derived graph.
const { verifyJWT, signJWT } = require('./crypto')

const GATES = ['SeeOne', 'DoOne', 'TeachOne']

// Verify a party's attestation JWT for a gate: signature by `did`, and the claims
// bind it to this contract/gate (and role, where given).
function attests (jwt, did, want) {
  if (!jwt || !did) return false
  const r = verifyJWT(jwt, did)
  if (!r.valid) return false
  for (const k of Object.keys(want)) if (String(r.payload[k]) !== String(want[k])) return false
  return true
}

// The policy — the automated gate that replaces a coordinator's judgment.
// deps.mentorQualified(mentorDid, skillSlug) -> Promise<bool>   (reads badges)
// deps.alreadySealed(contractId)             -> Promise<bool>   (idempotency)
async function evaluate (contract, deps = {}) {
  const checks = []
  const add = (name, pass, detail) => checks.push({ name, pass: !!pass, detail })
  const cid = contract.contractId

  add('not-already-sealed', !(deps.alreadySealed && await deps.alreadySealed(cid)), 'contractId not previously sealed')
  add('gates-complete', GATES.every(g => contract.gates[g] && contract.gates[g].completedAt), 'all three gates complete')

  for (const g of GATES) {
    const gate = contract.gates[g] || {}
    add(`learner-sig-${g}`, attests(gate.learnerJwt, contract.learner.did, { contractId: cid, gate: g }), `learner signed ${g}`)
    const mdid = gate.mentor && gate.mentor.did
    add(`mentor-sig-${g}`, attests(gate.mentorJwt, mdid, { contractId: cid, gate: g, role: 'mentor' }), `mentor signed ${g}`)
  }

  const t = contract.gates.TeachOne || {}
  add('student-sig', attests(t.studentJwt, t.student && t.student.did, { contractId: cid }), 'student signed their Do One')

  const mentors = [...new Set(GATES.map(g => contract.gates[g] && contract.gates[g].mentor && contract.gates[g].mentor.did).filter(Boolean))]
  let qualified = mentors.length > 0
  for (const md of mentors) if (!(deps.mentorQualified && await deps.mentorQualified(md, contract.skill.slug))) qualified = false
  add('mentor-qualified', qualified, 'every witnessing mentor holds this skill (or is founding cohort)')

  add('identity', !!(contract.learner.did && contract.issuer.did), 'learner and issuer DIDs present')

  const ready = checks.every(c => c.pass)
  return { ready, checks, reasons: checks.filter(c => !c.pass).map(c => c.name) }
}

// Apply the NDC seal: build the credential and sign it with the NDC key.
function seal (contract, ndcSeedHex, opts = {}) {
  const now = opts.now || (() => Date.now())
  const gates = {}
  for (const g of GATES) {
    const gg = contract.gates[g]
    if (!gg || !gg.completedAt) continue
    gates[g] = { completedAt: gg.completedAt, mentor: gg.mentor, learnerJwt: gg.learnerJwt, mentorJwt: gg.mentorJwt }
    if (g === 'TeachOne') { gates[g].student = gg.student; gates[g].studentJwt = gg.studentJwt }
  }
  const cred = {
    id: `urn:uuid:${contract.contractId}`, skill: contract.skill.name,
    issuer: contract.issuer.name, issuerDid: contract.issuer.did,
    holderDid: contract.learner.did, holderName: contract.learner.name,
    holderPortfolio: contract.learner.portfolioSlug, holderSite: contract.learner.site,
    contractId: contract.contractId, issuedAt: new Date(now()).toISOString().slice(0, 10),
    version: '0.5', mutuallyAttested: true, learnerAttested: true, sealedBy: 'ndc-server-auto', gates
  }
  const payload = {
    vc: { '@context': ['https://www.w3.org/2018/credentials/v1'], type: ['VerifiableCredential', 'SODOTOCredential'],
      credentialSubject: { name: contract.learner.name, sodoto: { skill: contract.skill.name, skillSlug: contract.skill.slug, version: '0.5', mutuallyAttested: true, gates, contractId: contract.contractId } } },
    sub: contract.learner.did, iss: contract.issuer.did, nbf: Math.floor(now() / 1000)
  }
  cred.jwt = signJWT(payload, ndcSeedHex)
  return cred
}

// Orchestrate: evaluate → (if ready) seal → onSealed(write badge / project).
async function autoSeal (contract, ndcSeedHex, deps = {}) {
  const ev = await evaluate(contract, deps)
  if (!ev.ready) return { sealed: false, reasons: ev.reasons, checks: ev.checks }
  const credential = seal(contract, ndcSeedHex, deps)
  if (deps.onSealed) await deps.onSealed(credential)
  return { sealed: true, credential, checks: ev.checks }
}

// Mentor qualification — reads BADGES and verifies their NDC signature. A stale or
// missing index can only cause a false negative, never a false positive.
// badgesFor(mentorDid) -> Promise<[{ holderDid, skillSlug, issuerDid, jwt }]>
function makeMentorQualified ({ foundingCohort = [], badgesFor, trustedIssuers = null } = {}) {
  const cohort = new Set(foundingCohort)
  return async (mentorDid, skillSlug) => {
    if (cohort.has(mentorDid)) return true
    if (!badgesFor) return false
    const badges = await badgesFor(mentorDid)
    for (const b of badges || []) {
      if (b.holderDid !== mentorDid || b.skillSlug !== skillSlug) continue
      if (trustedIssuers && trustedIssuers.indexOf(b.issuerDid) < 0) continue
      if (verifyJWT(b.jwt, b.issuerDid).valid) return true   // trust the signature, not an index
    }
    return false
  }
}

module.exports = { evaluate, seal, autoSeal, makeMentorQualified }
