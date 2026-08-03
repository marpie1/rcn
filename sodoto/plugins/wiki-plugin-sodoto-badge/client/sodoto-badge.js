// wiki-plugin-sodoto-badge/client/sodoto-badge.js
// FedWiki plugin for SODOTO Verifiable Credential badges.
//
// Page item shape:
//   {
//     "type": "sodoto-badge",
//     "id": "a3f82b1c...",
//     "text": "Causal Loop Diagramming",   ← skill name (used by sitemap/search)
//     "credential": {
//       "id": "urn:uuid:...",
//       "skill": "Causal Loop Diagramming",
//       "issuer": "Columbia Valley NDC · Whatcom County WA",
//       "issuerUrl": "https://rcn.wiki/view/columbia-valley-ndc",
//       "issuerDid": "did:key:z6Mk...",
//       "holderDid": "did:key:z6Mk...",
//       "contractId": "sodoto-cld-cv-2026-0001",
//       "contractHash": "sha256:...",
//       "issuedAt": "2026-02-26",
//       "gates": {
//         "SeeOne":   { "completedAt": "...", "mentor": "..." },
//         "DoOne":    { "completedAt": "...", "mentor": "..." },
//         "TeachOne": { "completedAt": "...", "mentor": "..." }
//       },
//       "jwt": "eyJhbGci..."
//     }
//   }

;(function() {

  // ── STYLES ─────────────────────────────────────────────────
  // Injected once into the document head on first use.
  const STYLES = `
  .sodoto-badge {
    font-family: 'Source Serif 4', Georgia, serif;
    max-width: 480px;
    margin: 12px auto;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.08);
    background: #faf8f5;
    border: 1px solid #e0d8cc;
  }
  .badge-band {
    height: 6px;
    background: linear-gradient(90deg, #2a5c3f 0%, #4a8c6f 50%, #2a5c3f 100%);
  }
  .badge-body {
    display: flex;
    align-items: center;
    padding: 18px 20px 14px;
    gap: 16px;
  }
  .badge-main { flex: 1; min-width: 0; }
  .badge-label {
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #6b6055;
    margin-bottom: 4px;
  }
  .badge-skill {
    font-size: 18px;
    font-weight: 700;
    color: #1a1208;
    line-height: 1.2;
    margin-bottom: 8px;
  }
  .badge-gates {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 8px;
  }
  .gate-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.04em;
    padding: 3px 8px;
    border-radius: 12px;
    background: #2a5c3f;
    color: white;
  }
  .gate-pill-open {
    background: transparent;
    border: 1px solid #aaa;
    color: #888;
    font-weight: 400;
  }
  .gate-pill svg { width: 9px; height: 9px; }
  .badge-issuer {
    font-size: 10px;
    color: #6b6055;
    font-style: italic;
  }
  .badge-seal {
    flex-shrink: 0;
    width: 72px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    cursor: pointer;
  }
  .badge-seal .seal-svg { width: 72px; height: 72px; }
  .badge-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 20px 12px;
    border-top: 1px solid #e0d8cc;
    gap: 12px;
  }
  .verify-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: inherit;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    padding: 5px 12px;
    border-radius: 4px;
    border: 1.5px solid #2a5c3f;
    background: transparent;
    color: #2a5c3f;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .verify-btn:hover { background: #2a5c3f; color: white; }
  .verify-btn[data-state="valid"]   { border-color: #2a5c3f; background: #2a5c3f; color: white; }
  .verify-btn[data-state="invalid"] { border-color: #8b1a1a; background: #8b1a1a; color: white; }
  .verify-btn svg { width: 10px; height: 10px; }
  .verify-pulse {
    display: inline-block;
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #2a5c3f;
    animation: vpulse 0.8s ease-in-out infinite alternate;
  }
  @keyframes vpulse { from { opacity: 1; } to { opacity: 0.2; } }
  .verify-contract {
    font-size: 9px;
    letter-spacing: 0.08em;
    color: #9b8f82;
    font-family: 'SF Mono', 'Fira Mono', monospace;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 200px;
  }
  .verify-panel {
    background: #f5f0e8;
    border-top: 1px solid #e0d8cc;
    padding: 14px 20px;
  }
  .verify-row {
    display: flex;
    gap: 12px;
    padding: 4px 0;
    border-bottom: 1px solid #e8e0d4;
    font-size: 10px;
  }
  .verify-row:last-child { border-bottom: none; }
  .verify-row-label {
    width: 72px;
    flex-shrink: 0;
    color: #6b6055;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    font-size: 9px;
    padding-top: 1px;
  }
  .verify-row-value {
    color: #1a1208;
    overflow-wrap: break-word;
    word-break: normal;
    line-height: 1.4;
  }
  .verify-row-value.hash {
    display: flex;
    align-items: center;
    gap: 4px;
    max-width: 100%;
    overflow: hidden;
  }
  .verify-row-value.hash .hash-text {
    font-family: 'SF Mono', 'Fira Mono', monospace;
    font-size: 9px;
    color: #4a3f35;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
  }
  .verify-row-value.hash .copy-btn {
    flex-shrink: 0;
    opacity: 0;
    transition: opacity 0.15s;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0 2px;
    color: #2a6b5a;
    font-size: 11px;
    line-height: 1;
  }
  .verify-row-value.hash:hover .copy-btn {
    opacity: 1;
  }
  .verify-row-value.hash .copy-btn.copied {
    color: #2a5c3f;
  }
  `

  let stylesInjected = false
  function ensureStyles() {
    if (stylesInjected) return
    const el = document.createElement('style')
    el.textContent = STYLES
    document.head.appendChild(el)
    stylesInjected = true
  }

  // ── ISSUER REGISTRY ────────────────────────────────────────
  // Keyed by real Veramo-generated issuer DID.
  // Update this when a new NDC joins or provides official artwork.
  const ISSUER_REGISTRY = {
    'did:key:z6MkrpszcAgGXVm3svfuVL35xfPgncW77Ev15JGnE7YR7V64': { label: "ReLocalize Creativity Network", initial: "RCN", color: "#2A5C3F", icon: "placeholder" },
    'did:key:z6MkqfgCZjLZTtnJue7sc1WMEivM3zhS6SPPmZT7v3E2eK11': { label: "Columbia Valley NDC",           initial: "CV",  color: "#2A6B5A", icon: "placeholder" },
    'did:key:z6MkkPjFHVtxRRYNo2r5upSpNMsLekjv6JGPcFGGTr8pokv1': { label: "The Fledge",                   initial: "F",   color: "#3D6E8F", icon: "placeholder" },
    'did:key:z6MksuEnHPDjSXK5mwDXdmwoEttkDuJ8VW2kYpnuu5vTXTiP': { label: "Leo's",                        initial: "L",   color: "#6E1818", icon: "placeholder" },
    'did:key:z6MknaMKoMZwrjYTE8PfwR5wtMG3rwWY1neofsgMB89UoHam': { label: "Kula",                         initial: "K",   color: "#C06018", icon: "placeholder" },
  }
  const UNKNOWN_ISSUER = { label: "Unknown Issuer", initial: "?", color: "#6B6055", icon: "placeholder" }

  // Resolve a gate person field — handles v0.1 flat string or v0.2 object
  function resolvePerson(field) {
    if (!field) return { name: 'Unknown', did: null, portfolio: null }
    if (typeof field === 'string') return { name: field, did: null, portfolio: null }
    return { name: field.name || 'Unknown', did: field.did || null, portfolio: field.portfolio || null }
  }

  // Render a person as a clickable link if portfolio is known, otherwise plain text.
  // Uses the FedWiki internal-link convention (class + data-page-name) so a click
  // opens the portfolio in the lineup to the RIGHT of this badge, not a new window.
  // The slug lives in data-page-name — never the link text — because the text is a
  // display name that FedWiki's built-in handler would mis-slugify. The delegated
  // handler installed at the bottom of this file reads data-page-name. (baseUrl is
  // kept in the signature for call-site compatibility; it is no longer used.)
  function personLink(field, baseUrl) {
    const p = resolvePerson(field)
    if (p.portfolio) {
      return `<a class="sodoto-pagelink" href="/${p.portfolio}.html" data-page-name="${p.portfolio}" style="color:#2a6b5a;text-decoration:underline;cursor:pointer;">${p.name}</a>`
    }
    return p.name
  }

  function resolveIssuer(did) {
    return ISSUER_REGISTRY[did] || UNKNOWN_ISSUER
  }

  // ── SEAL SVG ───────────────────────────────────────────────
  function placeholderSeal(issuer, overlayColor, overlayMark) {
    const sz = issuer.initial.length > 1 ? '28' : '34'
    const ov = overlayColor
      ? `<circle cx="58" cy="58" r="12" fill="${overlayColor}" stroke="white" stroke-width="2"/>` +
        `<text x="58" y="63" text-anchor="middle" fill="white" font-family="sans-serif" font-size="13" font-weight="700">${overlayMark}</text>`
      : ''
    return `<svg class="seal-svg" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="38" cy="38" r="36" fill="${issuer.color}" opacity="0.15"/>
      <circle cx="38" cy="38" r="32" fill="${issuer.color}" opacity="0.25"/>
      <circle cx="38" cy="38" r="28" fill="${issuer.color}"/>
      <text x="38" y="47" text-anchor="middle" fill="white"
            font-family="Fraunces,Georgia,serif" font-size="${sz}" font-weight="700"
            letter-spacing="-1">${issuer.initial}</text>
      ${ov}
    </svg>`
  }


  function rcnSeal(overlayColor, overlayMark) {
    const ov = overlayColor
      ? `<circle cx="62" cy="62" r="12" fill="${overlayColor}" stroke="white" stroke-width="2"/>` +
        `<text x="62" y="67" text-anchor="middle" fill="white" font-family="sans-serif" font-size="13" font-weight="700">${overlayMark}</text>`
      : ''
    return `<svg class="seal-svg" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="rcn-clip">
          <circle cx="38" cy="38" r="28"/>
        </clipPath>
      </defs>
      <circle cx="38" cy="38" r="36" fill="#2A6B5A" opacity="0.12"/>
      <circle cx="38" cy="38" r="32" fill="white" stroke="#2A6B5A" stroke-width="3"/>
      <g clip-path="url(#rcn-clip)">
        <svg x="9" y="9" width="58" height="58" viewBox="20 114 345 279">
  <!-- Network only — no text. Cropped viewBox to just the node area.
       translate(0,43) is baked into the original coordinates below.
       Use at any size: width="64" or width="200", always sharp. -->
  <defs>
    <radialGradient id="b1" cx="38%" cy="32%" r="62%">
      <stop offset="0%"   stop-color="#7ec8b8"/>
      <stop offset="100%" stop-color="#2a6b5a"/>
    </radialGradient>
    <radialGradient id="b2" cx="38%" cy="32%" r="62%">
      <stop offset="0%"   stop-color="#9ecce0"/>
      <stop offset="100%" stop-color="#3d6e8f"/>
    </radialGradient>
    <radialGradient id="cr" cx="38%" cy="32%" r="62%">
      <stop offset="0%"   stop-color="#c45858"/>
      <stop offset="100%" stop-color="#6e1818"/>
    </radialGradient>
    <radialGradient id="or" cx="38%" cy="32%" r="62%">
      <stop offset="0%"   stop-color="#eda070"/>
      <stop offset="100%" stop-color="#c06018"/>
    </radialGradient>
  </defs>
  <g transform="translate(0,43)">
    <g stroke="#444" stroke-width="3" stroke-linecap="round">
      <line x1="118" y1="178" x2="52"  y2="104"/>
      <line x1="118" y1="178" x2="38"  y2="196"/>
      <line x1="118" y1="178" x2="66"  y2="288"/>
      <line x1="118" y1="178" x2="136" y2="294"/>
      <line x1="188" y1="280" x2="136" y2="294"/>
      <line x1="188" y1="280" x2="162" y2="336"/>
      <line x1="188" y1="280" x2="240" y2="316"/>
      <line x1="294" y1="146" x2="350" y2="84"/>
      <line x1="294" y1="146" x2="366" y2="168"/>
      <line x1="294" y1="146" x2="356" y2="212"/>
      <line x1="298" y1="246" x2="356" y2="212"/>
      <line x1="298" y1="246" x2="350" y2="284"/>
      <line x1="298" y1="246" x2="240" y2="316"/>
      <line x1="118" y1="178" x2="294" y2="146"/>
      <line x1="188" y1="280" x2="298" y2="246"/>
      <line x1="118" y1="178" x2="188" y2="280"/>
      <line x1="294" y1="146" x2="298" y2="246"/>
    </g>
    <circle cx="52"  cy="104" r="14" fill="#E07060"/>
    <circle cx="38"  cy="196" r="15" fill="#7B5EA7"/>
    <circle cx="66"  cy="288" r="13" fill="#4A9E5C"/>
    <circle cx="136" cy="294" r="12" fill="#6BB8D4"/>
    <circle cx="162" cy="336" r="14" fill="#E07060"/>
    <circle cx="240" cy="316" r="15" fill="#E8C840"/>
    <circle cx="350" cy="84"  r="13" fill="#4A9E5C"/>
    <circle cx="366" cy="168" r="12" fill="#C04848"/>
    <circle cx="356" cy="212" r="14" fill="#7B5EA7"/>
    <circle cx="350" cy="284" r="13" fill="#E8C840"/>
    <circle cx="118" cy="178" r="42" fill="url(#b1)"/>
    <circle cx="188" cy="280" r="37" fill="url(#cr)"/>
    <circle cx="294" cy="146" r="52" fill="url(#b2)"/>
    <circle cx="298" cy="246" r="26" fill="url(#or)"/>
  <!-- Site labels on hub nodes -->
  <text x="118" y="173" text-anchor="middle"
        font-family="Fraunces, Georgia, serif" font-size="9" font-weight="700"
        fill="white" opacity="0.95">Columbia Valley</text>
  <text x="118" y="185" text-anchor="middle"
        font-family="Fraunces, Georgia, serif" font-size="7.5" font-style="italic"
        fill="white" opacity="0.85">Whatcom County WA</text>

  <text x="294" y="141" text-anchor="middle"
        font-family="Fraunces, Georgia, serif" font-size="9" font-weight="700"
        fill="white" opacity="0.95">The Fledge</text>
  <text x="294" y="154" text-anchor="middle"
        font-family="Fraunces, Georgia, serif" font-size="7.5" font-style="italic"
        fill="white" opacity="0.85">Lansing MI</text>

  <text x="188" y="275" text-anchor="middle"
        font-family="Fraunces, Georgia, serif" font-size="9" font-weight="700"
        fill="white" opacity="0.95">Leo&#x2019;s</text>
  <text x="188" y="287" text-anchor="middle"
        font-family="Fraunces, Georgia, serif" font-size="7.5" font-style="italic"
        fill="white" opacity="0.85">Superior AZ</text>

  <text x="298" y="243" text-anchor="middle"
        font-family="Fraunces, Georgia, serif" font-size="9" font-weight="700"
        fill="white" opacity="0.95">Kula</text>
  <text x="298" y="255" text-anchor="middle"
        font-family="Fraunces, Georgia, serif" font-size="7.5" font-style="italic"
        fill="white" opacity="0.85">SE Texas</text>
  </g>
</svg>
      </g>
      ${ov}
    </svg>`
  }

  function sealSVG(verified, issuerDid) {
    const issuer = resolveIssuer(issuerDid)
    // Seal has two states only: plain (no overlay) or green ✓ (all gates complete + valid)
    const oc = verified === true ? '#2a5c3f' : null
    const om = verified === true ? '\u2713' : ''
    if (issuer.icon === 'rcn') return rcnSeal(oc, om)
    return placeholderSeal(issuer, oc, om)
  }

  function checkSVG() {
    return `<svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="currentColor"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
  }

  // ── ED25519 BROWSER VERIFIER ───────────────────────────────
  // Verifies a did:key EdDSA JWT using Web Crypto API.
  // No network call — the public key is encoded in the DID itself.
  async function verifyJWT(jwt, issuerDid) {
    try {
      const parts = jwt.split('.')
      if (parts.length !== 3) throw new Error('Malformed JWT')
      const header = JSON.parse(atob(parts[0].replace(/-/g,'+').replace(/_/g,'/')))
      if (header.alg !== 'EdDSA') throw new Error('Expected EdDSA algorithm')

      // Decode base58btc public key from did:key:z...
      const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
      function b58decode(s) {
        let n = 0n
        for (const c of s) n = n * 58n + BigInt(B58.indexOf(c))
        const h = n.toString(16).padStart(66,'0')
        return new Uint8Array(h.match(/.{2}/g).map(b => parseInt(b,16)))
      }
      // Strip 'did:key:z' prefix (z = base58btc multibase), decode, skip 2-byte multicodec prefix
      const pubKeyBytes = b58decode(issuerDid.replace('did:key:z','')).slice(2)

      // Import Ed25519 public key (algorithm name varies by browser)
      let cryptoKey
      try {
        cryptoKey = await crypto.subtle.importKey(
          'raw', pubKeyBytes, { name: 'NODE-ED25519', namedCurve: 'NODE-ED25519' }, false, ['verify'])
      } catch (_) {
        cryptoKey = await crypto.subtle.importKey(
          'raw', pubKeyBytes, { name: 'Ed25519' }, false, ['verify'])
      }

      const signingInput = new TextEncoder().encode(parts[0] + '.' + parts[1])
      const sigBytes = Uint8Array.from(
        atob(parts[2].replace(/-/g,'+').replace(/_/g,'/')), c => c.charCodeAt(0))

      const valid = await crypto.subtle.verify(
        { name: cryptoKey.algorithm.name }, cryptoKey, sigBytes, signingInput)
      return { valid }
    } catch (err) {
      return { valid: false, error: err.message }
    }
  }

  // ── BADGE RENDERER ─────────────────────────────────────────
  function renderBadge(cred, container) {
    const el = document.createElement('div')
    el.className = 'sodoto-badge'
    let verifyState = null  // null | 'pending' | 'valid' | 'invalid'

    function render() {
      // Pre-compute person links (must be outside nested template literal)
      const seeOneMentor   = personLink(cred.gates.SeeOne   && cred.gates.SeeOne.mentor,   window.location.origin)
      const doOneMentor    = personLink(cred.gates.DoOne    && cred.gates.DoOne.mentor,    window.location.origin)
      const teachOneMentor = personLink(cred.gates.TeachOne && cred.gates.TeachOne.mentor, window.location.origin)
      const teachOneStudent= personLink(cred.gates.TeachOne && cred.gates.TeachOne.student,window.location.origin)

      const sv = verifyState === 'valid'   ? true
               : verifyState === 'invalid' ? false
               : null

      // Count completed gates
      const allGates = ['SeeOne','DoOne','TeachOne']
      const completedGates = allGates.filter(g => cred.gates[g] && cred.gates[g].completedAt)
      const isPartial = completedGates.length < 3
      const gateCount = completedGates.length + ' of 3 gates complete'

      el.innerHTML = `
        <div class="badge-band"></div>
        <div class="badge-body">
          <div class="badge-main">
            <div class="badge-label">SODOTO Credential${isPartial ? ' &middot; <em style="font-style:italic;font-weight:400;color:#888;">Partial</em>' : ''}</div>
            <div class="badge-skill">${cred.skill}</div>
            <div class="badge-gates">
              ${allGates.map(g => {
                const done = cred.gates[g] && cred.gates[g].completedAt
                return `<div class="gate-pill${done ? '' : ' gate-pill-open'}">
                  ${done ? checkSVG() : ''}
                  ${g.replace('One',' One')}
                </div>`
              }).join('')}
            </div>
            <div class="badge-issuer">${cred.issuer} &middot; ${cred.issuedAt}</div>
          </div>
          <a class="badge-seal"
             href="${cred.issuerUrl || '#'}"
             target="_blank" rel="noopener"
             title="${cred.issuer}">
            ${sealSVG(sv && !isPartial, cred.issuerDid)}
          </a>
        </div>
        <div class="badge-footer">
          <button class="verify-btn" data-state="${verifyState || 'idle'}">
            ${verifyState === 'pending' ? '<span class="verify-pulse"></span> Verifying...'
            : verifyState === 'valid' && isPartial  ? checkSVG() + ' Signature Valid'
            : verifyState === 'valid' && !isPartial ? checkSVG() + ' Verified'
            : verifyState === 'invalid' ? '&#x2717; Invalid'
            : 'Verify Credential'}
          </button>
          ${verifyState === 'valid' && isPartial
            ? `<div class="verify-contract" style="color:#888;font-style:italic;">${gateCount}</div>`
            : `<div class="verify-contract">${cred.contractId}</div>`
          }
        </div>
        ${verifyState === 'valid' || verifyState === 'invalid' ? `
        <div class="verify-panel">
          <div class="verify-row">
            <div class="verify-row-label">Skill</div>
            <div class="verify-row-value">${cred.skill}</div>
          </div>
          <div class="verify-row">
            <div class="verify-row-label">Issued</div>
            <div class="verify-row-value">${cred.issuedAt}</div>
          </div>
          <div class="verify-row">
            <div class="verify-row-label">Contract</div>
            <div class="verify-row-value hash"><span class="hash-text">${cred.contractId}</span><button class="copy-btn" data-copy="${cred.contractId}" title="Copy">&#x2398;</button></div>
          </div>
          <div class="verify-row">
            <div class="verify-row-label">Hash</div>
            <div class="verify-row-value hash"><span class="hash-text">${cred.contractHash}</span><button class="copy-btn" data-copy="${cred.contractHash}" title="Copy">&#x2398;</button></div>
          </div>
          <div class="verify-row">
            <div class="verify-row-label">Issuer DID</div>
            <div class="verify-row-value hash"><span class="hash-text">${cred.issuerDid}</span><button class="copy-btn" data-copy="${cred.issuerDid}" title="Copy">&#x2398;</button></div>
          </div>
          <div class="verify-row">
            <div class="verify-row-label">Holder DID</div>
            <div class="verify-row-value hash"><span class="hash-text">${cred.holderDid}</span><button class="copy-btn" data-copy="${cred.holderDid}" title="Copy">&#x2398;</button></div>
          </div>
          ${cred.gates.SeeOne && cred.gates.SeeOne.completedAt ? `
          <div class="verify-row">
            <div class="verify-row-label">See One</div>
            <div class="verify-row-value">${cred.gates.SeeOne.completedAt} &middot; ${seeOneMentor} witnessed</div>
          </div>` : `
          <div class="verify-row">
            <div class="verify-row-label">See One</div>
            <div class="verify-row-value" style="color:#888;font-style:italic;">Open — not yet completed</div>
          </div>`}
          ${cred.gates.DoOne && cred.gates.DoOne.completedAt ? `
          <div class="verify-row">
            <div class="verify-row-label">Do One</div>
            <div class="verify-row-value">${cred.gates.DoOne.completedAt} &middot; ${doOneMentor} witnessed</div>
          </div>` : `
          <div class="verify-row">
            <div class="verify-row-label">Do One</div>
            <div class="verify-row-value" style="color:#888;font-style:italic;">Open — not yet completed</div>
          </div>`}
          ${cred.gates.TeachOne && cred.gates.TeachOne.completedAt ? `
          <div class="verify-row">
            <div class="verify-row-label">Teach One</div>
            <div class="verify-row-value">${cred.gates.TeachOne.completedAt} &middot; ${teachOneMentor} verifies ${cred.skill} taught to ${teachOneStudent}</div>
          </div>` : `
          <div class="verify-row">
            <div class="verify-row-label">Teach One</div>
            <div class="verify-row-value" style="color:#888;font-style:italic;">Open — not yet completed</div>
          </div>`}
        </div>` : ''}
      `

      el.querySelectorAll('.copy-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.stopPropagation()
          var text = btn.getAttribute('data-copy')
          navigator.clipboard.writeText(text).then(function() {
            btn.classList.add('copied')
            btn.textContent = '✓'
            setTimeout(function() {
              btn.classList.remove('copied')
              btn.innerHTML = '&#x2398;'
            }, 1500)
          })
        })
      })

      el.querySelector('.verify-btn').addEventListener('click', doVerify)
      el.querySelector('.badge-seal').addEventListener('click', function(e) {
        if (verifyState === null || verifyState === 'invalid') {
          e.preventDefault()
          doVerify()
        }
      })
    }

    function doVerify() {
      if (verifyState === 'pending') return
      verifyState = 'pending'
      render()
      verifyJWT(cred.jwt, cred.issuerDid)
        .then(function(r) { verifyState = r.valid ? 'valid' : 'invalid'; render() })
        .catch(function()  { verifyState = 'invalid'; render() })
    }

    container.appendChild(el)
    render()
  }

  // ── FEDWIKI PLUGIN API ─────────────────────────────────────
  // emit: called when the page is displayed (view mode)
  // bind: called when the page is editable (edit mode)
  // Both receive the item JSON and a jQuery-wrapped div.

  function emit($item, item) {
    ensureStyles()
    const cred = item.credential
    if (!cred) {
      $item.append('<p class="error">sodoto-badge: missing credential data</p>')
      return
    }
    renderBadge(cred, $item.get(0))
  }

  function bind($item, item) {
    // Badge is read-only — credentials are not edited by hand.
    // emit() has already been called by FedWiki before bind().
    // We just attach the click handler for edit mode inspection.
    $item.on('click', '.sodoto-badge', function() {
      if (typeof wiki !== 'undefined' && wiki.textEditor) {
        wiki.textEditor($item, item)
      }
    })
  }

  // Open SODOTO internal page links (participant portfolios, gate narratives) in
  // the FedWiki lineup to the RIGHT of the page that holds the link — not a new
  // browser window. One delegated, document-level handler covers both the badge
  // items rendered here and the static gate-HTML items the issuer tool writes,
  // and keeps working across the plugin's re-renders. The target slug is read
  // from data-page-name, so display text can be a human name.
  function installSodotoLinkHandler() {
    if (typeof document === 'undefined' || window.__sodotoLinkHandlerInstalled) return
    window.__sodotoLinkHandlerInstalled = true
    document.addEventListener('click', function(e) {
      // Catch both the new links (data-page-name) and the legacy /view/<slug>
      // links that older pages already have baked in — so existing portfolios
      // are fixed with no data migration. Only fires on pages where this plugin
      // is loaded, i.e. SODOTO badge pages, where /view/ links are ours.
      const a = e.target.closest && e.target.closest('a.sodoto-pagelink, a[href^="/view/"]')
      if (!a) return
      let slug = a.getAttribute('data-page-name')
      if (!slug) {
        const m = (a.getAttribute('href') || '').match(/^\/view\/([^\/?#]+)/)
        if (m) slug = decodeURIComponent(m[1])
      }
      if (!slug) return
      e.preventDefault()
      const page = a.closest('.page')            // the page holding the link
      // Reach the FedWiki global the same way bind() does: bare `wiki`, with a
      // window.wiki fallback for any environment that only exposes it there.
      const w = (typeof wiki !== 'undefined') ? wiki : (window.wiki || null)
      if (w && w.doInternalLink) {
        w.doInternalLink(slug, page)             // opens slug to the right of page
      }
    })
  }

  // ── Portfolio section accordion ────────────────────────────────────────────
  // Each <h3> heading collapses the story items beneath it (up to the next
  // heading) — everything stays on one page, collapsed by default, expand on
  // demand, using the same chevron idiom as the MORE outliner (▸ / ▾). Purely
  // presentational: it toggles a CSS class on sibling story items and never
  // touches page data. What you expand persists per page+heading in localStorage.
  const ACC_STYLE =
    '.sodoto-sec-hidden{display:none !important}' +
    '.sodoto-sec-toggle{display:inline-block;width:1.1em;text-align:center;cursor:pointer;' +
      'color:#999;user-select:none;margin-right:.25em;font-size:.9em}' +
    'h3[data-sodoto-acc]{cursor:pointer}' +
    'h3[data-sodoto-acc]:hover .sodoto-sec-toggle{color:#555}' +
    '.sodoto-mentgroup > td{border-top:2px solid #e5ddd0 !important;padding-top:7px !important}'
  let accStyleInjected = false
  function ensureAccStyle() {
    if (accStyleInjected || typeof document === 'undefined') return
    const s = document.createElement('style'); s.textContent = ACC_STYLE
    document.head.appendChild(s); accStyleInjected = true
  }
  // A heading item is an html story item that contains an <h3> and is not a badge.
  function isHeadingItem(item) {
    return !!(item.querySelector && item.querySelector('h3') && !item.querySelector('.sodoto-badge'))
  }
  // The items belonging to a heading: following siblings up to the next heading.
  function sectionBody(headingItem) {
    const body = []; let el = headingItem.nextElementSibling
    while (el && el.classList && el.classList.contains('item')) {
      if (isHeadingItem(el)) break
      body.push(el); el = el.nextElementSibling
    }
    return body
  }
  function accKey(headingItem, h3) {
    const page = headingItem.closest('.page')
    return 'sodoto-acc:' + ((page && page.id) || 'page') + ':' + (h3.textContent || '').trim().slice(0, 60)
  }
  function applySectionState(headingItem, collapsed) {
    sectionBody(headingItem).forEach(function(el) {
      if (collapsed && el.contains(document.activeElement)) return   // never hide an item being edited
      el.classList.toggle('sodoto-sec-hidden', collapsed)
    })
  }
  function enhanceHeading(headingItem) {
    const h3 = headingItem.querySelector('h3'); if (!h3) return
    let collapsed
    if (h3.dataset.sodotoAcc) {
      collapsed = h3.dataset.sodotoCollapsed === '1'        // already wired — just re-apply state
    } else {
      let stored = null; try { stored = localStorage.getItem(accKey(headingItem, h3)) } catch (e) {}
      collapsed = (stored === null) ? true : (stored === '1')   // default: collapsed
      const chev = document.createElement('span'); chev.className = 'sodoto-sec-toggle'
      h3.insertBefore(chev, h3.firstChild)
      h3.dataset.sodotoAcc = '1'
      h3.addEventListener('click', function(e) {
        e.preventDefault(); e.stopPropagation()
        const now = h3.dataset.sodotoCollapsed !== '1'      // toggle
        h3.dataset.sodotoCollapsed = now ? '1' : '0'
        const c = h3.querySelector('.sodoto-sec-toggle'); if (c) c.textContent = now ? '▸' : '▾'
        applySectionState(headingItem, now)
        try { localStorage.setItem(accKey(headingItem, h3), now ? '1' : '0') } catch (e2) {}
      })
    }
    h3.dataset.sodotoCollapsed = collapsed ? '1' : '0'
    const c = h3.querySelector('.sodoto-sec-toggle'); if (c) c.textContent = collapsed ? '▸' : '▾'
    applySectionState(headingItem, collapsed)
  }
  function initSodotoAccordion() {
    if (typeof document === 'undefined') return
    ensureAccStyle()
    document.querySelectorAll('.page .story').forEach(function(story) {
      Array.from(story.children).forEach(function(item) {
        if (item.classList && item.classList.contains('item') && isHeadingItem(item)) enhanceHeading(item)
      })
    })
  }
  // ── Mentoring Log grouping (client-side, presentation only) ─────────────────
  // The issuer just appends rows to one "Mentoring Log" table. Here we re-order
  // those rows at render into meaningful groups: by learner + skill, gates in
  // See → Do → Teach order, groups with the most recent activity first. Stored
  // data is never touched — this only moves DOM rows and adds a separator class,
  // and it only re-appends when the order actually changes (so the MutationObserver
  // doesn't loop).
  const GATE_RANK = { 'See One': 0, 'Do One': 1, 'Teach One': 2 }
  function parseMentRow(tr) {
    const td = tr.querySelectorAll('td')
    const learner = (td[0] ? td[0].textContent : '').trim()
    const skillGate = (td[1] ? td[1].textContent : '').trim()
    const date = (td[2] ? td[2].textContent : '').trim()
    const gm = skillGate.match(/(See One|Do One|Teach One)/)
    const gate = gm ? gm[1] : ''
    const skill = skillGate.split(' — ')[0].trim()
    const am = skillGate.match(/attempt\s+(\d+)/i)
    return { tr, key: learner + '|' + skill, gateRank: (gate in GATE_RANK) ? GATE_RANK[gate] : 9,
             date: date, attempt: am ? parseInt(am[1], 10) : 0 }
  }
  function sortMentoringTable(table) {
    const tbody = table.querySelector('tbody'); if (!tbody) return
    const original = Array.from(tbody.querySelectorAll(':scope > tr'))
    if (original.length < 2) return
    const rows = original.map(parseMentRow)
    const recency = {}   // most recent date per learner+skill group
    rows.forEach(function (r) { if (!recency[r.key] || r.date > recency[r.key]) recency[r.key] = r.date })
    const sorted = rows.slice().sort(function (a, b) {
      if (recency[a.key] !== recency[b.key]) return recency[a.key] < recency[b.key] ? 1 : -1  // recent groups first
      if (a.key !== b.key) return a.key < b.key ? -1 : 1                                        // keep each group contiguous
      if (a.gateRank !== b.gateRank) return a.gateRank - b.gateRank                             // See → Do → Teach
      if (a.date !== b.date) return a.date < b.date ? -1 : 1
      return a.attempt - b.attempt
    })
    // Re-append only if the order changed — prevents an observer feedback loop.
    const changed = sorted.some(function (r, i) { return r.tr !== original[i] })
    if (changed) sorted.forEach(function (r) { tbody.appendChild(r.tr) })
    // Mark the first row of each group (after the first) for a CSS separator.
    // Attribute-only change, so it doesn't feed the childList observer.
    let prevKey = null
    sorted.forEach(function (r) {
      r.tr.classList.toggle('sodoto-mentgroup', prevKey !== null && r.key !== prevKey)
      prevKey = r.key
    })
  }
  function sortMentoringLogs() {
    if (typeof document === 'undefined') return
    document.querySelectorAll('.page .story').forEach(function (story) {
      Array.from(story.children).forEach(function (item) {
        if (!(item.classList && item.classList.contains('item'))) return
        const h3 = item.querySelector('h3')
        if (!h3 || !/mentoring log/i.test(h3.textContent)) return
        let el = item.nextElementSibling
        while (el && el.classList && el.classList.contains('item') && !el.querySelector('h3')) {
          const table = el.querySelector('table')
          if (table) { sortMentoringTable(table); break }
          el = el.nextElementSibling
        }
      })
    })
  }

  let accTimer = null
  function runSodotoEnhancements() { initSodotoAccordion(); sortMentoringLogs() }
  function scheduleAccordion() { clearTimeout(accTimer); accTimer = setTimeout(runSodotoEnhancements, 150) }

  if (typeof window !== 'undefined') {
    installSodotoLinkHandler()
    // Wire the accordion once: run after the page settles, and re-run when
    // FedWiki adds or re-renders pages/items (observe childList only, so our own
    // class toggles don't feed back into the observer).
    if (typeof document !== 'undefined' && !window.__sodotoAccordionInstalled) {
      window.__sodotoAccordionInstalled = true
      scheduleAccordion()
      if (document.body) new MutationObserver(scheduleAccordion)
        .observe(document.body, { childList: true, subtree: true })
    }
    window.plugins = window.plugins || {}
    window.plugins['sodoto-badge'] = { emit, bind }
  }

  if (typeof module !== 'undefined') {
    module.exports = { renderBadge, resolveIssuer, verifyJWT }
  }

}())
