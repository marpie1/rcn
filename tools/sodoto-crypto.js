'use strict'
// sodoto-crypto.js — passphrase-encrypt / decrypt an Ed25519 seed for portable
// recovery. The identity stays a strong random 256-bit seed; the passphrase only
// protects the recovery blob, so the blob is safe to keep in a password manager
// or cloud. PBKDF2-SHA256 (600k) -> AES-GCM, all native WebCrypto — no dependency.
// Runs in the browser and in Node (globalThis.crypto.subtle), so it can be unit
// tested. If Argon2id hardening is wanted later, only deriveKey changes.
;(function (root, factory) {
  const mod = factory()
  if (typeof module !== 'undefined' && module.exports) module.exports = mod
  else root.SodotoCrypto = mod
})(typeof self !== 'undefined' ? self : this, function () {
  const subtle = globalThis.crypto && globalThis.crypto.subtle
  const rng = (n) => globalThis.crypto.getRandomValues(new Uint8Array(n))
  const ITER = 600000
  const enc = new TextEncoder()

  function b64 (buf) { let s = ''; for (const b of new Uint8Array(buf)) s += String.fromCharCode(b); return btoa(s) }
  function unb64 (s) { const bin = atob(s); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u }
  function hexToBytes (h) { const u = new Uint8Array(h.length / 2); for (let i = 0; i < u.length; i++) u[i] = parseInt(h.substr(i * 2, 2), 16); return u }
  function bytesToHex (buf) { return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('') }

  async function deriveKey (passphrase, salt, iter) {
    const base = await subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey'])
    return subtle.deriveKey({ name: 'PBKDF2', salt, iterations: iter, hash: 'SHA-256' },
      base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'])
  }

  // seedHex (64 hex) + passphrase -> a self-describing recovery blob (JSON-safe).
  async function encryptSeed (seedHex, passphrase) {
    if (!subtle) throw new Error('secure crypto unavailable — open over https')
    if (!/^[0-9a-fA-F]{64}$/.test(seedHex || '')) throw new Error('seed must be 64 hex chars')
    const salt = rng(16); const iv = rng(12)
    const key = await deriveKey(passphrase, salt, ITER)
    const ct = await subtle.encrypt({ name: 'AES-GCM', iv }, key, hexToBytes(seedHex))
    return { v: 1, kdf: 'PBKDF2-SHA256', iter: ITER, salt: b64(salt), iv: b64(iv), ct: b64(ct) }
  }

  // recovery blob + passphrase -> seedHex. Throws on a wrong passphrase (AES-GCM
  // authentication fails), so a bad passphrase can never yield a wrong-but-valid key.
  async function decryptSeed (blob, passphrase) {
    if (!subtle) throw new Error('secure crypto unavailable — open over https')
    if (!blob || blob.kdf !== 'PBKDF2-SHA256') throw new Error('unrecognized recovery file')
    const key = await deriveKey(passphrase, unb64(blob.salt), blob.iter || ITER)
    let pt
    try { pt = await subtle.decrypt({ name: 'AES-GCM', iv: unb64(blob.iv) }, key, unb64(blob.ct)) }
    catch (e) { throw new Error('wrong passphrase or corrupted recovery file') }
    return bytesToHex(pt)
  }

  // A minimal strength gate — the passphrase is the last line of defense.
  function passphraseStrength (pw) {
    pw = pw || ''
    let score = 0
    if (pw.length >= 8) score++; if (pw.length >= 12) score++; if (pw.length >= 16) score++
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++
    if (/\d/.test(pw)) score++; if (/[^A-Za-z0-9]/.test(pw)) score++
    return { ok: pw.length >= 12, score, label: score < 3 ? 'weak' : score < 5 ? 'fair' : 'strong' }
  }

  // Ed25519 in WebCrypto arrived late: Chrome/Edge 137, Safari 17, Firefox 129.
  // An older browser fails with "Algorithm: Unrecognized name", which tells a
  // learner nothing. Probe once, so a page can say so before they type anything.
  let ed25519Probe = null
  function ed25519Supported () {
    if (!ed25519Probe) {
      ed25519Probe = subtle
        ? subtle.generateKey({ name: 'Ed25519' }, false, ['sign', 'verify']).then(() => true, () => false)
        : Promise.resolve(false)
    }
    return ed25519Probe
  }

  // "Chrome 126", "Safari 16.4", … or '' — named in the message so the person
  // can see the problem is the version, not them.
  function browserName () {
    const ua = (globalThis.navigator && navigator.userAgent) || ''
    let m
    if ((m = ua.match(/Edg\/(\d+)/))) return 'Edge ' + m[1]
    if ((m = ua.match(/Firefox\/(\d+)/))) return 'Firefox ' + m[1]
    if ((m = ua.match(/Chrome\/(\d+)/))) return 'Chrome ' + m[1]
    if ((m = ua.match(/Version\/([\d.]+).*Safari/))) return 'Safari ' + m[1]
    return ''
  }

  function isTooOldError (e) {
    return /unrecognized name|not supported|NotSupportedError/i.test((e && (e.message || e.name)) || String(e))
  }

  function tooOldMessage () {
    const b = browserName()
    return 'This browser is too old to make or use a SODOTO key' + (b ? ' (it is ' + b + ')' : '') + '. ' +
      'Update it, then open this link again. In Chrome: click the ⋮ menu (or the "New Chrome available" button) → Help → About Google Chrome → Relaunch. ' +
      'Any of these work: Chrome or Edge 137 or later, Safari 17 or later, Firefox 129 or later.'
  }

  return { encryptSeed, decryptSeed, passphraseStrength, ed25519Supported, isTooOldError, tooOldMessage }
})
