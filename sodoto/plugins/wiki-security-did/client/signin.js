'use strict'
// Browser sign-in widget for wiki-security-did. Signs the server's challenge with
// the self-custodied key minted at onboarding (localStorage 'sodoto-identity',
// the same key sodoto-onboard.html / sodoto-sign.html use). The private key never
// leaves the device — only a signature over the nonce is sent.
//
//   <script src="/plugins/wiki-security-did/client/signin.js"></script>
//   const r = await sodotoSignIn();   // { ok, did, owner }  → now authorized to edit if owner
;(function (global) {
  const LS_KEY = 'sodoto-identity'
  function hexToBytes (h) { const u = new Uint8Array(h.length / 2); for (let i = 0; i < u.length; i++) u[i] = parseInt(h.substr(i * 2, 2), 16); return u }
  function b64url (bytes) { let s = ''; for (const b of bytes) s += String.fromCharCode(b); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') }
  async function keyFromSeed (seedHex) {
    const pkcs8 = new Uint8Array([0x30, 0x2e, 0x02, 0x01, 0x00, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x04, 0x22, 0x04, 0x20, ...hexToBytes(seedHex)])
    return crypto.subtle.importKey('pkcs8', pkcs8, { name: 'Ed25519' }, false, ['sign'])
  }
  async function sodotoSignIn (base) {
    base = base || ''
    const id = JSON.parse(localStorage.getItem(LS_KEY) || 'null')
    if (!id || !id.seedHex) throw new Error('no SODOTO identity on this device — onboard first')
    const { nonce } = await (await fetch(base + '/auth/challenge', { credentials: 'include' })).json()
    const key = await keyFromSeed(id.seedHex)
    const sig = new Uint8Array(await crypto.subtle.sign({ name: 'Ed25519' }, key, new TextEncoder().encode(nonce)))
    const r = await fetch(base + '/auth/verify', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ did: id.did, nonce, signature: b64url(sig) })
    })
    return r.json()   // { ok, did, owner }
  }
  global.sodotoSignIn = sodotoSignIn
})(typeof window !== 'undefined' ? window : this)
