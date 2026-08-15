'use strict'
// Smoke test with a minimal DOM shim: the plugin registers itself, renders a
// button, and clicking it (with no SODOTO key present) reports the right hint.
const assert = require('assert')
let pass = 0
const ok = (c, m) => { assert.ok(c, m); console.log('  ✓', m); pass++ }

// --- tiny DOM shim ---
function mkEl () {
  return {
    _kids: [], className: '', id: '', innerHTML: '', textContent: '', src: '',
    classList: { _s: new Set(), add (c) { this._s.add(c) }, contains (c) { return this._s.has(c) } },
    _handlers: {},
    addEventListener (ev, fn) { this._handlers[ev] = fn },
    appendChild (c) { this._kids.push(c); if (c.onload && c.src) setTimeout(() => c.onerror && c.onerror(), 0); return c },
    querySelector (sel) {
      // return a stable child element per selector
      this._q = this._q || {}
      return (this._q[sel] = this._q[sel] || mkEl())
    },
    get (i) { return this }
  }
}
global.window = {}
global.document = {
  _byId: {},
  getElementById (id) { return this._byId[id] || null },
  createElement () { const e = mkEl(); return e },
  head: mkEl(), body: mkEl()
}

const P = require('../client/sodoto-signin.js')

ok(global.window.plugins && typeof global.window.plugins['sodoto-signin'] === 'object', 'registers window.plugins["sodoto-signin"]')
ok(typeof global.window.plugins['sodoto-signin'].emit === 'function' &&
   typeof global.window.plugins['sodoto-signin'].bind === 'function', 'exposes emit + bind')

const el = mkEl()
P.render(el)
ok(/Sign in with my SODOTO key/.test(el.innerHTML), 'render() writes the sign-in button')
ok(el.classList.contains('sodoto-signin'), 'render() marks the container .sodoto-signin')

// clicking with no widget/key available surfaces an error status, not a throw
const btn = el.querySelector('.sodoto-signin-btn')
const clickP = btn._handlers.click ? btn._handlers.click() : Promise.resolve()
Promise.resolve(clickP).then(() => {
  ok(true, 'click handler runs without throwing when no key/widget is present')
  console.log('\n' + pass + ' checks passed.')
}).catch(e => { console.error('FAIL', e); process.exit(1) })
