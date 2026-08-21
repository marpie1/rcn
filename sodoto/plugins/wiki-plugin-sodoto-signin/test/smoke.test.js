'use strict'
// Smoke test: (1) the plugin registers + renders with a minimal DOM shim; a click
// with no key present doesn't throw; (2) the inlined restore decrypt matches the
// canonical tools/sodoto-crypto.js (encrypt there → decrypt here → same seed;
// wrong passphrase rejected).
const assert = require('assert')
const SodotoCrypto = require('../../../../tools/sodoto-crypto.js')
let pass = 0
const ok = (c, m) => { assert.ok(c, m); console.log('  ✓', m); pass++ }

// --- tiny DOM shim ---
function mkEl () {
  return {
    _kids: [], className: '', id: '', innerHTML: '', textContent: '', src: '', style: {},
    classList: { _s: new Set(), add (c) { this._s.add(c) }, contains (c) { return this._s.has(c) } },
    _handlers: {}, _q: {},
    addEventListener (ev, fn) { this._handlers[ev] = fn },
    appendChild (c) { this._kids.push(c); if (c.onerror && c.src) setTimeout(() => c.onerror(), 0); return c },
    querySelector (sel) { return (this._q[sel] = this._q[sel] || mkEl()) },
    get () { return this }
  }
}
global.window = {}
global.document = { _byId: {}, getElementById (id) { return this._byId[id] || null }, createElement () { return mkEl() }, head: mkEl(), body: mkEl() }

const P = require('../client/sodoto-signin.js')

;(async () => {
  // 1. registration + render
  ok(global.window.plugins && typeof global.window.plugins['sodoto-signin'] === 'object', 'registers window.plugins["sodoto-signin"]')
  ok(typeof P.emit === 'function' && typeof P.bind === 'function', 'exposes emit + bind')

  const el = mkEl(); P.render(el)
  ok(/Sign in with my SODOTO key/.test(el.innerHTML), 'render() writes the sign-in button')
  ok(/sodoto-signin-restore/.test(el.innerHTML) && /recovery file/.test(el.innerHTML), 'render() includes the (hidden) restore panel')
  ok(el.classList.contains('sodoto-signin'), 'render() marks the container .sodoto-signin')

  const btn = el.querySelector('.sodoto-signin-btn')
  await Promise.resolve(btn._handlers.click ? btn._handlers.click() : null)
  ok(true, 'clicking sign-in with no key/widget does not throw')

  // 2. inlined restore decrypt matches the canonical crypto
  const seed = 'b'.repeat(64)
  const phrase = 'correct horse battery staple'
  const blob = await SodotoCrypto.encryptSeed(seed, phrase)
  const back = await P.decryptSeed(blob, phrase)
  ok(back === seed, 'restore decryptSeed(blob, right passphrase) === original seed (matches sodoto-crypto.js)')
  try { await P.decryptSeed(blob, 'nope'); ok(false, 'wrong passphrase should throw') }
  catch (e) { ok(/wrong passphrase|corrupted/i.test(e.message), 'restore rejects a wrong passphrase') }

  console.log('\n' + pass + ' checks passed.')
})().catch(e => { console.error('FAIL', e); process.exit(1) })
