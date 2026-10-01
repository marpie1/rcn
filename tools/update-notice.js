// update-notice.js — tells a person when the tool page they have open has been
// updated on the server, so a tab left open across a deploy doesn't keep
// running old code without anyone knowing. Include it on any tool page:
//
//   <script src="update-notice.js"></script>
//
// It fetches the page's own file once to remember it, then again every few
// minutes and whenever the tab comes back into view. If the file has changed it
// shows a bar with a Reload button. It never reloads by itself: the person may
// have a form half filled in. Does nothing on file:// (there is no server).
;(function () {
  if (location.protocol === 'file:') return
  const EVERY_MS = 5 * 60 * 1000
  const url = location.pathname
  let baseline = null, shown = false

  function hash (s) {   // FNV-1a — enough to tell two versions apart
    let h = 0x811c9dc5
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) }
    return (h >>> 0).toString(16) + ':' + s.length
  }
  async function current () {
    try {
      const r = await fetch(url, { cache: 'no-store' })
      return r.ok ? hash(await r.text()) : null
    } catch (_) { return null }   // offline or server restarting — try later
  }
  function show () {
    if (shown) return
    shown = true
    const bar = document.createElement('div')
    bar.setAttribute('role', 'status')
    bar.style.cssText = 'position:fixed;left:0;right:0;top:0;z-index:99999;display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px 16px;background:#fdf6e3;border-bottom:2px solid #c9a227;font:14px/1.4 system-ui,sans-serif;color:#3b2f00;'
    bar.innerHTML = '<span><b>This tool was updated.</b> Reload to get the new version — finish or copy anything you are typing first.</span>'
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.textContent = 'Reload'
    btn.style.cssText = 'font:inherit;font-weight:700;padding:4px 14px;border:1px solid #3b2f00;background:#3b2f00;color:#fff;border-radius:4px;cursor:pointer;'
    btn.onclick = () => location.reload()
    bar.appendChild(btn)
    document.body.appendChild(bar)
    // make room, so the bar doesn't cover the top of the page
    const pad = parseFloat(getComputedStyle(document.body).paddingTop) || 0
    document.body.style.paddingTop = (pad + bar.offsetHeight) + 'px'
  }
  async function check () {
    if (shown) return
    const now = await current()
    if (!now) return
    if (baseline === null) { baseline = now; return }
    if (now !== baseline) show()
  }

  check()
  setInterval(check, EVERY_MS)
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') check() })
})()
