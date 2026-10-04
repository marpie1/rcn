// wiki-plugin-sodoto-signin/client/sodoto-signin.js
// A FedWiki page item that renders a "Sign in with my SODOTO key" button on a
// portfolio. Clicking it proves control of the holder's did:key (challenge →
// sign the nonce in the browser → verify), which wiki-security-did turns into an
// edit session. The private key never leaves the device.
//
// Key point: the widget runs on the WIKI host, and browser storage is per-host.
// A key minted/restored on the tools host (sodoto.…) is NOT visible here. So this
// plugin also offers RESTORE on the wiki host itself — upload the recovery file +
// passphrase, decrypt in-browser, store the key here, then sign in. The decrypt
// is inlined (same PBKDF2-SHA256 600k → AES-GCM as tools/sodoto-crypto.js) so
// there is no cross-origin dependency.
//
// Page item shape:
//   { "type": "sodoto-signin", "id": "…", "text": "Sign in with your SODOTO key" }

;(function () {

  const LS_KEY = 'sodoto-identity'

  // ── inlined decrypt (mirrors tools/sodoto-crypto.js decryptSeed) ─────────────
  const crypto_ = (function () {
    const subtle = globalThis.crypto && globalThis.crypto.subtle
    const enc = new TextEncoder()
    function unb64 (s) { const bin = atob(s); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u }
    function bytesToHex (buf) { return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('') }
    async function deriveKey (passphrase, salt, iter) {
      const base = await subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey'])
      return subtle.deriveKey({ name: 'PBKDF2', salt, iterations: iter, hash: 'SHA-256' },
        base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'])
    }
    async function decryptSeed (blob, passphrase) {
      if (!subtle) throw new Error('secure crypto unavailable — open this over https')
      if (!blob || blob.kdf !== 'PBKDF2-SHA256') throw new Error('unrecognized recovery file')
      const key = await deriveKey(passphrase, unb64(blob.salt), blob.iter || 600000)
      let pt
      try { pt = await subtle.decrypt({ name: 'AES-GCM', iv: unb64(blob.iv) }, key, unb64(blob.ct)) }
      catch (e) { throw new Error('wrong passphrase or corrupted recovery file') }
      return bytesToHex(pt)
    }
    return { decryptSeed }
  })()

  const STYLES = `
  .sodoto-signin {
    font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
    max-width: 480px; margin: 12px auto; padding: 14px 16px;
    border: 1px solid #d9d4c9; border-radius: 8px; background: #faf8f5;
  }
  .sodoto-signin-btn, .sodoto-signin-restore-btn {
    font: inherit; font-weight: 600; font-size: 14px; cursor: pointer;
    color: #fff; background: #204630; border: none; padding: 9px 16px; border-radius: 6px;
  }
  .sodoto-signin-btn:hover, .sodoto-signin-restore-btn:hover { background: #2a5c3f; }
  .sodoto-signin-btn:disabled, .sodoto-signin-restore-btn:disabled { opacity: .6; cursor: default; }
  .sodoto-signin-status { margin-left: 10px; font-size: 13px; font-weight: 600; }
  .sodoto-signin-status.ok   { color: #15803d; }
  .sodoto-signin-status.warn { color: #b45309; }
  .sodoto-signin-status.err  { color: #b91c1c; }
  .sodoto-signin-hint { margin-top: 8px; font-size: 12px; color: #6b675e; }
  .sodoto-signin-restore { margin-top: 12px; padding-top: 12px; border-top: 1px solid #e3ded3; }
  .sodoto-signin-restore input { display: block; width: 100%; margin: 6px 0; font-size: 14px;
    padding: 8px 10px; border: 1px solid #c9c1b1; border-radius: 6px; box-sizing: border-box; }
  `

  function ensureStyles () {
    if (typeof document === 'undefined' || document.getElementById('sodoto-signin-styles')) return
    const el = document.createElement('style')
    el.id = 'sodoto-signin-styles'; el.textContent = STYLES
    document.head.appendChild(el)
  }

  // Load the shared sign-in widget (served by wiki-security-did at /security/signin.js,
  // same origin as the wiki). Resolves to window.sodotoSignIn.
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

  // Ed25519 in WebCrypto needs Chrome/Edge 137, Safari 17, Firefox 129. Older
  // browsers say "Algorithm: Unrecognized name" — mirrors tools/sodoto-crypto.js.
  function friendly (e) {
    const msg = (e && (e.message || e.name)) || String(e)
    if (!/unrecognized name|not supported|NotSupportedError/i.test(msg)) return msg
    return 'This browser is too old to use a SODOTO key. Update it (in Chrome: ⋮ menu → Help → About Google Chrome → Relaunch), then reload this page. ' +
      'Chrome or Edge 137+, Safari 17+, or Firefox 129+ all work.'
  }

  async function doSignIn (ui) {
    setStatus(ui.status, '', ''); ui.btn.disabled = true
    try {
      const signIn = await loadWidget()
      const r = await signIn()                       // { ok, did, owner }
      if (!r || !r.ok) setStatus(ui.status, 'err', (r && r.error) || 'sign-in failed')
      else if (r.owner) setStatus(ui.status, 'ok', '✓ Signed in — you can edit this page')
      else setStatus(ui.status, 'warn', 'Signed in, but this portfolio isn’t yours to edit')
    } catch (e) {
      // No key on THIS host's storage → offer restore right here.
      if (/no SODOTO identity/i.test(e.message)) {
        ui.restore.style.display = 'block'
        setStatus(ui.status, 'warn', 'No key on this device — restore it below to sign in.')
      } else setStatus(ui.status, 'err', friendly(e))
    } finally { ui.btn.disabled = false }
  }

  // Restore an identity ON THIS HOST from the encrypted recovery file + passphrase,
  // store it, then sign in. Nothing is uploaded — the file is unlocked in-browser.
  async function doRestore (ui) {
    setStatus(ui.status, '', '')
    const file = (ui.file.files || [])[0]
    if (!file) { setStatus(ui.status, 'err', 'Choose your recovery file.'); return }
    if (!ui.pass.value) { setStatus(ui.status, 'err', 'Enter your passphrase.'); return }
    ui.rbtn.disabled = true
    try {
      const data = JSON.parse(await file.text())
      const blob = data.recovery || data              // recovery file, or a bare blob
      if (!data.did) throw new Error('recovery file has no DID — use the file from onboarding')
      const seedHex = await crypto_.decryptSeed(blob, ui.pass.value)
      localStorage.setItem(LS_KEY, JSON.stringify({ did: data.did, seedHex, name: data.name || '', encrypted: blob, restoredAt: new Date().toISOString() }))
      ui.restore.style.display = 'none'
      await doSignIn(ui)                               // key is present now → sign in
    } catch (e) {
      setStatus(ui.status, 'err', e.message || String(e))
    } finally { ui.rbtn.disabled = false }
  }

  function render (el) {
    el.classList.add('sodoto-signin')
    el.innerHTML =
      '<button class="sodoto-signin-btn" type="button">🔑 Sign in with my SODOTO key</button>' +
      '<span class="sodoto-signin-status"></span>' +
      '<div class="sodoto-signin-hint">Prove control of your key to edit this portfolio. Your private key never leaves this device.</div>' +
      '<div class="sodoto-signin-restore" style="display:none">' +
        '<div class="sodoto-signin-hint">No key on this device? Restore it here — your recovery file + passphrase. Nothing is uploaded; it is unlocked in your browser.</div>' +
        '<input type="file" class="sodoto-signin-file" accept=".json,application/json">' +
        '<input type="password" class="sodoto-signin-pass" placeholder="your passphrase" autocomplete="current-password">' +
        '<button class="sodoto-signin-restore-btn" type="button">Restore &amp; sign in</button>' +
      '</div>'
    const q = function (s) { return el.querySelector(s) }
    const ui = { btn: q('.sodoto-signin-btn'), status: q('.sodoto-signin-status'), restore: q('.sodoto-signin-restore'),
      file: q('.sodoto-signin-file'), pass: q('.sodoto-signin-pass'), rbtn: q('.sodoto-signin-restore-btn') }
    ui.btn.addEventListener('click', function () { doSignIn(ui) })
    ui.rbtn.addEventListener('click', function () { doRestore(ui) })
    return el
  }

  function emit ($item, item) { ensureStyles(); render($item.get(0)) }

  function bind ($item, item) {
    $item.dblclick(function (e) {
      if (e.target && e.target.classList && (e.target.classList.contains('sodoto-signin-btn') || e.target.classList.contains('sodoto-signin-restore-btn'))) return
      if (typeof wiki !== 'undefined' && wiki.textEditor) wiki.textEditor($item, item)
    })
  }

  if (typeof window !== 'undefined') {
    window.plugins = window.plugins || {}
    window.plugins['sodoto-signin'] = { emit, bind }
  }

  if (typeof module !== 'undefined') {
    module.exports = { render, loadWidget, emit, bind, decryptSeed: crypto_.decryptSeed }
  }

}())
