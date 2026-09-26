#!/usr/bin/env node
// Builds docs/sodoto-lineage-demo.html — a working demo of the v0.6 badge
// proposed in docs/sodoto-lineage-spec.md.
//
// Everything cryptographic is real: fresh Ed25519 keys, a signed founding
// statement, and a chain of signed credentials whose mentors carry
// qualifiedBy pointers (sha256 over the parent's compact JWT). The page
// verifies all of it in the browser. Only the network is simulated — the
// "fetch" of each portfolio page reads from data embedded in the page.
//
// Keys are generated per run and thrown away; no real person or NDC key is
// involved. The badge's look comes from the real plugin's STYLES block, read
// from the plugin source, so the demo cannot drift from what the wiki shows.
//
//   node sodoto/lineage-demo/make-demo.js

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const ROOT = path.resolve(__dirname, '..', '..')
const PLUGIN = path.join(ROOT, 'sodoto/plugins/wiki-plugin-sodoto-badge/client/sodoto-badge.js')
const OUT = path.join(ROOT, 'docs/sodoto-lineage-demo.html')

// ── crypto helpers ────────────────────────────────────────────────────────────
const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
function b58encode(bytes) {
  let n = BigInt('0x' + Buffer.from(bytes).toString('hex'))
  let s = ''
  while (n > 0n) { s = B58[Number(n % 58n)] + s; n /= 58n }
  for (const b of bytes) { if (b === 0) s = '1' + s; else break }
  return s
}
const b64u = buf => Buffer.from(buf).toString('base64url')

function makeKey() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519')
  const raw = Buffer.from(publicKey.export({ format: 'jwk' }).x, 'base64url')
  return { privateKey, did: 'did:key:z' + b58encode(Buffer.concat([Buffer.from([0xed, 0x01]), raw])) }
}
function signJWT(payload, key) {
  const input = b64u(JSON.stringify({ alg: 'EdDSA', typ: 'JWT' })) + '.' + b64u(JSON.stringify(payload))
  return input + '.' + b64u(crypto.sign(null, Buffer.from(input), key.privateKey))
}
const digest = jwt => 'sha256:' + crypto.createHash('sha256').update(jwt, 'utf8').digest('hex')
const ts = d => Math.floor(new Date(d + 'T12:00:00Z').getTime() / 1000)

// ── the cast (fictional) ──────────────────────────────────────────────────────
const SKILL = { name: 'Causal Loop Diagramming', slug: 'cld' }
const HOST = 'wiki-sodoto.demo.example'
const ndc = { ...makeKey(), label: 'DEMO NDC · Superior AZ', url: 'https://demo-ndc.example' }
const person = (name, slug) => ({ name, slug, ...makeKey(), site: `${slug}.${HOST}`, portfolio: `${slug}-sodoto-portfolio` })
const rosa  = person('Rosa Alvarez', 'rosa-alvarez')
const maria = person('Maria Lopez',  'maria-lopez')
const dana  = person('Dana Okafor',  'dana-okafor')
const sam   = person('Sam Rivera',   'sam-rivera')
const jules = person('Jules Navarro','jules-navarro')
const omar  = person('Omar Haddad',  'omar-haddad')
const lina  = person('Lina Begay',   'lina-begay')
const pageUrl = p => `https://${p.site}/${p.portfolio}.json`

// sites: location hint → page JSON, exactly what a FedWiki fetch would return
const sites = {}
function putBadge(p, cred) {
  const url = pageUrl(p)
  sites[url] = sites[url] || { title: `${p.name} SODOTO Portfolio`, story: [] }
  sites[url].story.push({ type: 'sodoto-badge', id: 'badge-' + cred.contractId, text: cred.skill, credential: cred })
}

// ── the root: a founding statement ────────────────────────────────────────────
const FOUNDED = '2025-03-03'
const foundingUrl = 'https://demo-ndc.example/sodoto-founding-cld.json'
const foundingPayload = {
  iss: ndc.did, nbf: ts(FOUNDED),
  sodotoFounding: {
    statementId: 'sodoto-founding-cld-demo-2025', skill: SKILL.name, skillSlug: SKILL.slug, date: FOUNDED,
    cohort: [{ name: rosa.name, did: rosa.did, portfolio: rosa.portfolio }],
  },
}
const foundingJwt = signJWT(foundingPayload, ndc)
sites[foundingUrl] = { title: 'SODOTO Founding Cohort — Causal Loop Diagramming', story: [
  { type: 'sodoto-founding', id: 'founding-cld', text: SKILL.name, statement: { ...foundingPayload.sodotoFounding, issuerDid: ndc.did, issuer: ndc.label, jwt: foundingJwt } } ] }
const foundingRef = { type: 'founding', statementId: foundingPayload.sodotoFounding.statementId, issuerDid: ndc.did,
                      skillSlug: SKILL.slug, digest: digest(foundingJwt), at: foundingUrl }

// ── credentials ───────────────────────────────────────────────────────────────
let seq = 0
function credRef(cred, holder) {
  return { type: 'credential', contractId: cred.contractId, issuerDid: cred.issuerDid, skillSlug: SKILL.slug,
           digest: digest(cred.jwt), at: pageUrl(holder) }
}
// One gate attestation, signed by whoever makes it (learner, mentor or student).
const attest = (signer, contractId, gate, role, date) =>
  signJWT({ iss: signer.did, nbf: ts(date), sodotoAttest: { contractId, gate, skill: SKILL.slug, role, date } }, signer)

function issue({ holder, mentor, qualifiedBy, dates, student, legacy }) {
  const contractId = `sodoto-${SKILL.slug}-demo-${dates.issued.slice(0, 4)}-${String(++seq).padStart(4, '0')}`
  const m = { name: mentor.name, did: mentor.did, portfolio: mentor.portfolio, ...(legacy ? {} : { qualifiedBy }) }
  const gates = {}
  for (const [gate, date] of [['SeeOne', dates.see], ['DoOne', dates.do], ['TeachOne', dates.teach]]) {
    gates[gate] = {
      completedAt: date, mentor: m,
      learnerJwt: attest(holder, contractId, gate, 'learner', date),
      mentorJwt:  attest(mentor, contractId, gate, 'mentor', date),
    }
  }
  gates.TeachOne.student = { name: student.name, did: student.did, portfolio: student.portfolio }
  gates.TeachOne.studentJwt = attest(student, contractId, 'TeachOne', 'student', dates.teach)
  const version = legacy ? '0.5' : '0.6'
  const contractHash = 'sha256:' + crypto.createHash('sha256').update(JSON.stringify({ contractId, gates })).digest('hex')
  const payload = {
    vc: { '@context': ['https://www.w3.org/2018/credentials/v1', 'https://rcn.wiki/credentials/sodoto/v1'],
          type: ['VerifiableCredential', 'SODOTOCredential'],
          credentialSubject: { name: holder.name, sodoto: {
            skill: SKILL.name, skillSlug: SKILL.slug, version, learnerAttested: true, mutuallyAttested: true,
            ...(legacy ? {} : { lineageRecorded: true }), gates, contractId, contractHash } } },
    issuer: { name: ndc.label, url: ndc.url }, sub: holder.did, nbf: ts(dates.issued), iss: ndc.did,
  }
  const cred = {
    id: `urn:uuid:${contractId}`, skill: SKILL.name, issuer: ndc.label, issuerUrl: ndc.url, issuerDid: ndc.did,
    holderDid: holder.did, holderName: holder.name, holderPortfolio: holder.portfolio, holderSite: holder.site,
    contractId, contractHash, issuedAt: dates.issued, gates, version,
    learnerAttested: true, mutuallyAttested: true, ...(legacy ? {} : { lineageRecorded: true }),
  }
  cred.jwt = signJWT(payload, ndc)
  putBadge(holder, cred)
  return cred
}

const cMaria = issue({ holder: maria, mentor: rosa, qualifiedBy: foundingRef, student: omar,
  dates: { see: '2025-06-10', do: '2025-08-21', teach: '2025-11-04', issued: '2025-11-12' } })
const cDana = issue({ holder: dana, mentor: maria, qualifiedBy: credRef(cMaria, maria), student: lina,
  dates: { see: '2025-12-02', do: '2026-01-15', teach: '2026-02-11', issued: '2026-02-20' } })
const cSam = issue({ holder: sam, mentor: dana, qualifiedBy: credRef(cDana, dana), student: jules,
  dates: { see: '2026-03-09', do: '2026-04-28', teach: '2026-06-10', issued: '2026-06-18' } })
const cJules = issue({ holder: jules, mentor: sam, qualifiedBy: credRef(cSam, sam), student: lina,
  dates: { see: '2026-07-01', do: '2026-08-05', teach: '2026-09-02', issued: '2026-09-09' } })
// A credential from before v0.6: mutually attested, but no pointer to the mentor's credential.
const cOmar = issue({ holder: omar, mentor: maria, legacy: true, student: lina,
  dates: { see: '2026-01-06', do: '2026-02-17', teach: '2026-03-24', issued: '2026-04-02' } })

// The NDC's ledger: an untrusted index, used only to FIND descendants.
const ledger = [cMaria, cDana, cSam, cJules, cOmar].map(c => {
  const q = c.gates.DoOne.mentor.qualifiedBy
  const holder = [maria, dana, sam, jules, omar].find(p => p.did === c.holderDid)
  return { contractId: c.contractId, holder: c.holderName, issuedAt: c.issuedAt, at: pageUrl(holder),
           qualifiedByDigest: q && q.type === 'credential' ? q.digest : null }
})

const DATA = { sites, ledger, show: [ { url: pageUrl(sam), contractId: cSam.contractId }, { url: pageUrl(omar), contractId: cOmar.contractId } ],
               issuers: { [ndc.did]: { label: 'DEMO NDC', initial: 'D', color: '#2A6B5A' } },
               taintTarget: { url: pageUrl(maria), contractId: cMaria.contractId, name: maria.name } }

// ── page ──────────────────────────────────────────────────────────────────────
const src = fs.readFileSync(PLUGIN, 'utf8')
const m = src.match(/const STYLES = `([\s\S]*?)\n  `/)
if (!m) throw new Error('could not find STYLES in the badge plugin')
const template = fs.readFileSync(path.join(__dirname, 'demo-template.html'), 'utf8')
const html = template
  .replace('/*__PLUGIN_STYLES__*/', () => m[1])
  .replace('/*__DATA__*/null', () => JSON.stringify(DATA))
fs.writeFileSync(OUT, html)
console.log('wrote', path.relative(ROOT, OUT), `(${(html.length / 1024).toFixed(0)} KB)`)

// Artifact version: the publish skeleton supplies doctype, <head>, <body> and the
// viewport meta, so strip ours. Pass a path to write it: make-demo.js --artifact <file>
const ai = process.argv.indexOf('--artifact')
if (ai > 0 && process.argv[ai + 1]) {
  const body = html
    .replace(/<!doctype html>\s*/i, '').replace(/<html[^>]*>\s*/i, '').replace(/<\/html>\s*$/i, '')
    .replace(/<head>\s*/i, '').replace(/<\/head>\s*/i, '').replace(/<body>\s*/i, '').replace(/<\/body>\s*/i, '')
    .replace(/<meta charset="utf-8">\s*/i, '').replace(/<meta name="viewport"[^>]*>\s*/i, '')
  fs.writeFileSync(process.argv[ai + 1], body)
  console.log('wrote artifact body', process.argv[ai + 1])
}
