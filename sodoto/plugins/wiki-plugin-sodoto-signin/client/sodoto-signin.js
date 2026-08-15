// wiki-plugin-sodoto-signin/client/sodoto-signin.js
// A FedWiki page item that renders a "Sign in with my SODOTO key" button on a
// portfolio. Clicking it proves control of the holder's did:key (challenge →
// sign the nonce in the browser → verify), which the wiki-security-did module
// turns into an edit session. The private key never leaves the device.
//
// Page item shape:
//   { "type": "sodoto-signin", "id": "…", "text": "Sign in with your SODOTO key" }
//
// The actual signing is the shared widget the wiki serves at /security/signin.js
// (window.sodotoSignIn) — the same code path the integration test exercises. This
// plugin is just the on-page affordance around it. An inline <script> in an html
// item would NOT run (innerHTML doesn't execute scripts), which is why this is a
// real plugin whose emit() runs.

;(function () {

  const STYLES = `
  .sodoto-signin {
    font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
    max-width: 480px; margin: 12px auto; padding: 14px 16px;
    border: 1px solid #d9d4c9; border-radius: 8px; background: #faf8f5;
  }
  .sodoto-signin-btn {
    font: inherit; font-weight: 600; font-size: 14px; cursor: pointer;
    color: #fff; background: #204630; border: none;
    padding: 9px 16px; border-radius: 6px;
  }
  .sodoto-signin-btn:hover { background: #2a5c3f; }
  .sodoto-signin-btn:disabled { opacity: .6; cursor: default; }
  .sodoto-signin-status { margin-left: 10px; font-size: 13px; font-weight: 600; }
  .sodoto-signin-status.ok   { color: #15803d; }
  .sodoto-signin-status.warn { color: #b45309; }
  .sodoto-signin-status.err  { color: #b91c1c; }
  .sodoto-signin-hint { margin-top: 8px; font-size: 12px; color: #6b675e; }
  `

  function ensureStyles () {
    if (typeof document === 'undefined' || document.getElementById('sodoto-signin-styles')) return
    const el = document.createElement('style')
    el.id = 'sodoto-signin-styles'; el.textContent = STYLES
    document.head.appendChild(el)
  }

  // Load the shared sign-in widget on demand (served by wiki-security-did at
  // /security/signin.js). Cached after first load. Resolves to window.sodotoSignIn.
  function loadWidget () {
    if (typeof window !== 'undefined' && typeof window.sodotoSignIn === 'function') {
      return Promise.resolve(window.sodotoSignIn)
    }
    return new Promise(function (resolve, reject) {
      const s = document.createElement('script')
      s.src = '/security/signin.js'
      s.onload = function () {
        if (typeof window.sodotoSignIn === 'function') resolve(window.sodotoSignIn)
        else reject(new Error('sign-in widget did not initialize'))
      }
      s.onerror = function () { reject(new Error('could not load the sign-in widget')) }
      document.head.appendChild(s)
    })
  }

  function setStatus (el, kind, msg) { el.className = 'sodoto-signin-status ' + kind; el.textContent = msg }

  async function doSignIn (btn, status) {
    setStatus(status, '', ''); btn.disabled = true
    try {
      const signIn = await loadWidget()
      const r = await signIn()                       // { ok, did, owner }
      if (!r || !r.ok) setStatus(status, 'err', (r && r.error) || 'sign-in failed')
      else if (r.owner) setStatus(status, 'ok', '✓ Signed in — you can edit this page')
      else setStatus(status, 'warn', 'Signed in, but this portfolio isn’t yours to edit')
    } catch (e) {
      const msg = /no SODOTO identity/i.test(e.message)
        ? 'No SODOTO key on this device — onboard or restore first'
        : e.message
      setStatus(status, 'err', msg)
    } finally { btn.disabled = false }
  }

  // Build the button UI into an element; returns the root (also used by tests).
  function render (el) {
    el.classList.add('sodoto-signin')
    el.innerHTML =
      '<button class="sodoto-signin-btn" type="button">🔑 Sign in with my SODOTO key</button>' +
      '<span class="sodoto-signin-status"></span>' +
      '<div class="sodoto-signin-hint">Prove control of your key to edit this portfolio. ' +
      'Your private key never leaves this device.</div>'
    const btn = el.querySelector('.sodoto-signin-btn')
    const status = el.querySelector('.sodoto-signin-status')
    btn.addEventListener('click', function () { doSignIn(btn, status) })
    return el
  }

  function emit ($item, item) {
    ensureStyles()
    render($item.get(0))
  }

  function bind ($item, item) {
    // Double-click the card (not the button) to edit the item in place.
    $item.dblclick(function (e) {
      if (e.target && e.target.classList && e.target.classList.contains('sodoto-signin-btn')) return
      if (typeof wiki !== 'undefined' && wiki.textEditor) wiki.textEditor($item, item)
    })
  }

  if (typeof window !== 'undefined') {
    window.plugins = window.plugins || {}
    window.plugins['sodoto-signin'] = { emit, bind }
  }

  if (typeof module !== 'undefined') {
    module.exports = { render, loadWidget, emit, bind }
  }

}())
