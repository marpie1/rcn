# wiki-plugin-sodoto-signin

A FedWiki page item that renders a **"Sign in with my SODOTO key"** button on a portfolio. It is the on-page affordance for [`wiki-security-did`](../wiki-security-did/): clicking it proves control of the holder's `did:key` (challenge → sign the nonce in the browser → verify), which the security module turns into an edit session for that person's own portfolio.

## Item shape

```json
{ "type": "sodoto-signin", "id": "…", "text": "Sign in with your SODOTO key" }
```

The proxy's `POST /api/sodoto-provision-site` puts one of these at the top of each new portfolio, so every per-person site ships with the button.

## How it works

`emit()` renders the button. On click it loads the shared sign-in widget the wiki serves at `/security/signin.js` (`window.sodotoSignIn` — the same code path the `wiki-security-did` integration test exercises), calls it, and reports the result:

- **owner** → "✓ Signed in — you can edit this page"
- authenticated but **not** the owner → "Signed in, but this portfolio isn't yours to edit"
- no key on this device → "No SODOTO key on this device — onboard or restore first"

The private key never leaves the browser; only a signature over the server's nonce is sent. An inline `<script>` in an `html` item would not run (setting innerHTML doesn't execute scripts), which is why this is a real plugin whose `emit()` runs.

## Testing

- `npm test` — smoke test with a minimal DOM shim: the plugin registers `window.plugins['sodoto-signin']`, `render()` writes the button, and a click with no key present surfaces an error status rather than throwing.
- Confirmed served/discovered by a real FedWiki 0.27 (`/system/plugins.json` lists `sodoto-signin`; `/plugins/sodoto-signin/sodoto-signin.js` → 200). The end-to-end sign-in flow it drives is covered 7/7 by `wiki-security-did/test/integration`.
- **Validated by hand:** the button's visual render + click in a real browser (the flow underneath is automated).
