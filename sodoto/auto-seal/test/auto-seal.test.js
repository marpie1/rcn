'use strict'
// Tests for the NDC auto-seal engine. `node test/auto-seal.test.js`.
const crypto = require('crypto')
const assert = require('assert')
const { signJWT, verifyJWT } = require('../lib/crypto')
const { evaluate, seal, autoSeal, makeMentorQualified } = require('../lib/engine')

const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
function b58encode (buf) { let n = 0n; for (const b of buf) n = n * 256n + BigInt(b); let o = ''; while (n > 0n) { o = B58[Number(n % 58n)] + o; n /= 58n } for (const b of buf) { if (b === 0) o = '1' + o; else break } return o }
function mint () {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519')
  const raw = publicKey.export({ format: 'der', type: 'spki' }).subarray(-32)
  const did = 'did:key:z' + b58encode(Buffer.concat([Buffer.from([0xed, 0x01]), raw]))
  const seedHex = privateKey.export({ format: 'der', type: 'pkcs8' }).subarray(-32).toString('hex')
  return { did, seedHex }
}
const clone = o => JSON.parse(JSON.stringify(o))
let passed = 0
function ok (c, m) { assert.ok(c, m); console.log('  ✓', m); passed++ }

const ndc = mint(), learner = mint(), mentor = mint(), student = mint()
const skill = { slug: 'causal-loop-diagramming', name: 'Causal Loop Diagramming' }
const cid = 'RCN-CLD-900', men = { name: 'Ken', did: mentor.did }
const lj = g => signJWT({ iss: learner.did, contractId: cid, gate: g, skill: skill.slug, role: 'learner' }, learner.seedHex)
const mj = g => signJWT({ iss: mentor.did, contractId: cid, gate: g, skill: skill.slug, role: 'mentor' }, mentor.seedHex)
const contract = {
  contractId: cid, issuer: { did: ndc.did, name: 'RCN' }, skill,
  learner: { did: learner.did, name: 'Dana', portfolioSlug: 'dana-sodoto-portfolio', site: 'wiki' },
  gates: {
    SeeOne: { completedAt: '2026-08-01', mentor: men, learnerJwt: lj('SeeOne'), mentorJwt: mj('SeeOne') },
    DoOne: { completedAt: '2026-08-03', mentor: men, learnerJwt: lj('DoOne'), mentorJwt: mj('DoOne') },
    TeachOne: { completedAt: '2026-08-05', mentor: men, student: { name: 'Sam', did: student.did }, learnerJwt: lj('TeachOne'), mentorJwt: mj('TeachOne'), studentJwt: signJWT({ iss: student.did, contractId: cid, role: 'student' }, student.seedHex) }
  }
}

const cohortDep = { mentorQualified: makeMentorQualified({ foundingCohort: [mentor.did] }), alreadySealed: async () => false }

;(async () => {
  // --- happy path: fully attested + qualified mentor → sealed ---
  {
    let written = null
    const r = await autoSeal(contract, ndc.seedHex, { ...cohortDep, onSealed: c => { written = c } })
    ok(r.sealed, 'a complete, mutually-attested, qualified contract auto-seals')
    ok(r.credential.version === '0.5' && r.credential.sealedBy === 'ndc-server-auto', 'sealed credential is v0.5, marked server-auto')
    ok(verifyJWT(r.credential.jwt, ndc.did).valid, 'the NDC seal (credential JWT) verifies against the NDC DID')
    ok(verifyJWT(r.credential.gates.SeeOne.learnerJwt, learner.did).valid, 'embedded learner attestation verifies')
    ok(verifyJWT(r.credential.gates.DoOne.mentorJwt, mentor.did).valid, 'embedded mentor attestation verifies')
    ok(verifyJWT(r.credential.gates.TeachOne.studentJwt, student.did).valid, 'embedded student attestation verifies')
    ok(written && written.contractId === cid, 'onSealed hook receives the sealed credential (to write/project)')
  }

  // --- missing mentor signature → not sealed ---
  {
    const c = clone(contract); delete c.gates.DoOne.mentorJwt
    const r = await autoSeal(c, ndc.seedHex, cohortDep)
    ok(!r.sealed && r.reasons.includes('mentor-sig-DoOne'), 'a missing mentor signature blocks the seal')
  }

  // --- a party signs with the wrong key → not sealed ---
  {
    const c = clone(contract); c.gates.SeeOne.learnerJwt = mj('SeeOne')   // mentor's key, claimed as learner
    const r = await autoSeal(c, ndc.seedHex, cohortDep)
    ok(!r.sealed && r.reasons.includes('learner-sig-SeeOne'), 'a signature by the wrong key blocks the seal')
  }

  // --- mentor not qualified → not sealed ---
  {
    const notQual = { mentorQualified: makeMentorQualified({ foundingCohort: [] }), alreadySealed: async () => false }
    const r = await autoSeal(contract, ndc.seedHex, notQual)
    ok(!r.sealed && r.reasons.includes('mentor-qualified'), 'an unqualified mentor blocks the seal')
  }

  // --- qualification via a real prior badge (reads badges, verifies the NDC signature) ---
  {
    const goodBadge = { holderDid: mentor.did, skillSlug: skill.slug, issuerDid: ndc.did, jwt: signJWT({ iss: ndc.did, sub: mentor.did }, ndc.seedHex) }
    const q = makeMentorQualified({ badgesFor: async () => [goodBadge] })
    ok(await q(mentor.did, skill.slug), 'a mentor with a validly-signed badge for the skill is qualified')

    const tamperedBadge = { ...goodBadge, jwt: signJWT({ iss: ndc.did, sub: mentor.did }, learner.seedHex) } // signed by the wrong key
    const q2 = makeMentorQualified({ badgesFor: async () => [tamperedBadge] })
    ok(!(await q2(mentor.did, skill.slug)), 'a badge whose signature does not verify does NOT qualify')
  }

  // --- idempotent: an already-sealed contract is not sealed again ---
  {
    const r = await autoSeal(contract, ndc.seedHex, { ...cohortDep, alreadySealed: async () => true })
    ok(!r.sealed && r.reasons.includes('not-already-sealed'), 'an already-sealed contract is not re-sealed (idempotent)')
  }

  console.log(`\n${passed} checks passed.`)
})().catch(e => { console.error(e); process.exit(1) })
