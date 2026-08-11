#!/usr/bin/env node
// Generate the SODOTO DEMO seed: a demo issuer + demo learners, their portfolio
// pages, the ledger, and a people-registry — all DEMO-tagged so nothing here is
// ever confused with a real credential.
//
// Identities are DETERMINISTIC (seed = sha256("rcn-sodoto-demo::" + label)), so
// every run produces the same demo cast and the committed public files stay in
// sync with the DEMO Academy DID hardcoded in the issuer tool. The private seeds
// are throwaway demo keys — written to demo-keys.json, which is gitignored, so
// the pattern of never committing key material holds even for demo.
//
// The did:key derivation is validated against a real published DID before any
// demo identity is emitted: if the base58/multicodec handling here didn't match
// the browser's, that self-check fails and the script aborts.

const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

// ── base58btc (Bitcoin alphabet) ─────────────────────────────────────────────
const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
function b58encode(bytes) {
  let zeros = 0
  while (zeros < bytes.length && bytes[zeros] === 0) zeros++
  const digits = [0]
  for (let i = zeros; i < bytes.length; i++) {
    let carry = bytes[i]
    for (let j = 0; j < digits.length; j++) {
      carry += digits[j] << 8
      digits[j] = carry % 58
      carry = (carry / 58) | 0
    }
    while (carry) { digits.push(carry % 58); carry = (carry / 58) | 0 }
  }
  let out = '1'.repeat(zeros)
  for (let k = digits.length - 1; k >= 0; k--) out += B58[digits[k]]
  return out
}
function b58decode(str) {
  const bytes = [0]
  for (const ch of str) {
    let carry = B58.indexOf(ch)
    if (carry < 0) throw new Error('bad base58 char: ' + ch)
    for (let j = 0; j < bytes.length; j++) {
      carry += bytes[j] * 58
      bytes[j] = carry & 0xff
      carry >>= 8
    }
    while (carry) { bytes.push(carry & 0xff); carry >>= 8 }
  }
  let zeros = 0
  for (const ch of str) { if (ch === '1') zeros++; else break }
  const res = new Uint8Array(zeros + bytes.length)
  for (let k = 0; k < bytes.length; k++) res[zeros + k] = bytes[bytes.length - 1 - k]
  return res
}

// ── Ed25519: 32-byte seed → raw public key, and → did:key ────────────────────
const PKCS8_PREFIX = Buffer.from('302e020100300506032b657004220420', 'hex')
function seedToPubkey(seedBuf) {
  const der = Buffer.concat([PKCS8_PREFIX, seedBuf])
  const priv = crypto.createPrivateKey({ key: der, format: 'der', type: 'pkcs8' })
  const jwk = crypto.createPublicKey(priv).export({ format: 'jwk' })
  return Buffer.from(jwk.x, 'base64url')            // raw 32-byte Ed25519 pubkey
}
function pubkeyToDid(pubBuf) {
  const prefixed = Buffer.concat([Buffer.from([0xed, 0x01]), pubBuf])  // multicodec ed25519-pub
  return 'did:key:z' + b58encode(prefixed)
}
function seedHexToDid(seedHex) {
  return pubkeyToDid(seedToPubkey(Buffer.from(seedHex, 'hex')))
}

// ── Self-check: round-trip a real published DID (base58 + multicodec) ─────────
// Marc's real DID from the issuer's SEED_PEOPLE. We only decode/re-encode it —
// no private key involved — to prove our encoding matches the browser's.
const KNOWN_DID = 'did:key:z6MkozBoq41VqSMQVvzunaCcqFbUmG531deb2SjTDNb2Qswb'
const decoded = b58decode(KNOWN_DID.replace('did:key:z', ''))
if (decoded[0] !== 0xed || decoded[1] !== 0x01) {
  throw new Error('self-check: multicodec prefix mismatch')
}
const reencoded = pubkeyToDid(Buffer.from(decoded.slice(2)))
if (reencoded !== KNOWN_DID) {
  throw new Error(`self-check FAILED: ${reencoded} !== ${KNOWN_DID}`)
}
console.log('✓ did:key encoding validated against a real published DID')

// ── Deterministic demo identity ──────────────────────────────────────────────
function demoIdentity(label) {
  const seed = crypto.createHash('sha256').update('rcn-sodoto-demo::' + label).digest()
  const seedHex = seed.toString('hex')
  return { label, seedHex, did: seedHexToDid(seedHex) }
}

const issuer   = demoIdentity('DEMO Academy')
const learners = [
  { slug: 'demo-alex-rivera',  name: 'DEMO Alex Rivera'  },
  { slug: 'demo-sam-okafor',   name: 'DEMO Sam Okafor'   },
  { slug: 'demo-jules-navarro', name: 'DEMO Jules Navarro' },
].map(l => ({ ...l, ...demoIdentity(l.name), portfolioSlug: l.slug + '-sodoto-portfolio' }))

// ── FedWiki helpers ──────────────────────────────────────────────────────────
// A real timestamp, not 0 — otherwise Recent Changes renders "NaN years ago".
const SEED_DATE = Date.parse('2026-08-04T12:00:00Z')
function itemId(s) { return crypto.createHash('sha256').update(s).digest('hex').slice(0, 16) }
function page(title, story) {
  return { title, story, journal: [{ type: 'create', id: itemId('create::' + title),
                                     date: SEED_DATE, item: { title } }] }
}

const OUT = __dirname
const PAGES = path.join(OUT, 'pages')
fs.mkdirSync(PAGES, { recursive: true })

// people-registry — the single source of demo learners (site: localhost) ------
const registry = { people: learners.map(l => ({
  slug: l.slug, name: l.name, did: l.did, site: 'localhost', portfolioSlug: l.portfolioSlug,
})) }
fs.writeFileSync(path.join(OUT, 'people-registry.json'), JSON.stringify(registry, null, 2) + '\n')

// one empty scaffolded portfolio per learner — badges get signed in by Marc ----
for (const l of learners) {
  const p = page(`${l.name} SODOTO Portfolio`, [
    { type: 'paragraph', id: itemId('intro::' + l.slug),
      text: `**DEMO portfolio.** This is throwaway demo data — safe to keep or delete. ` +
            `Badges signed through the issuer tool for **${l.name}** appear below.` },
  ])
  fs.writeFileSync(path.join(PAGES, l.portfolioSlug + '.json'), JSON.stringify(p) + '\n')
}

// ledger — the issuer appends a row per signed badge; slug is fixed in the tool -
const ledger = page('RCN SODOTO Ledger', [
  { type: 'paragraph', id: itemId('ledger-intro'),
    text: '**DEMO ledger.** Every badge signed in this demo is recorded here. ' +
          'Throwaway data — safe to reset.' },
])
fs.writeFileSync(path.join(PAGES, 'rcn-sodoto-ledger.json'), JSON.stringify(ledger) + '\n')

// welcome-visitors — DEMO landing page ----------------------------------------
const welcome = page('DEMO SODOTO Credentialing', [
  { type: 'paragraph', id: itemId('welcome'),
    text: 'This is the **DEMO** SODOTO credentialing wiki. Everything here is ' +
          'test data. Learner portfolios and the badge ledger are all prefixed DEMO.' },
])
fs.writeFileSync(path.join(PAGES, 'welcome-visitors.json'), JSON.stringify(welcome) + '\n')

// private seeds — GITIGNORED. Marc pastes the DEMO Academy seed to sign. -------
const keys = {
  _note: 'Throwaway DEMO seeds. Paste the DEMO Academy seedHex into the issuer to sign demo badges. Regenerate anytime with generate-demo-seed.js.',
  issuer,
  learners: learners.map(l => ({ label: l.name, slug: l.slug, seedHex: l.seedHex, did: l.did })),
}
fs.writeFileSync(path.join(OUT, 'demo-keys.json'), JSON.stringify(keys, null, 2) + '\n')

// ── Report ───────────────────────────────────────────────────────────────────
console.log('\nDEMO issuer:')
console.log(`  ${issuer.label}`)
console.log(`  did: ${issuer.did}`)
console.log('\nDEMO learners:')
for (const l of learners) console.log(`  ${l.name.padEnd(22)} ${l.did}`)
console.log('\nWrote:')
console.log('  sodoto/seed/people-registry.json      (public — demo registry)')
console.log('  sodoto/seed/pages/*.json              (public — 3 portfolios, ledger, welcome)')
console.log('  sodoto/seed/demo-keys.json            (GITIGNORED — private seeds)')
console.log(`\nPut this DID in the issuer tool's ISSUERS as "demoAcademy":`)
console.log(`  ${issuer.did}`)
