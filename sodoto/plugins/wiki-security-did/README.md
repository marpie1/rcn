# wiki-security-did

A FedWiki security module whose identity is a self-custodied `did:key`. It implements the same interface as `wiki-security-friends`, but replaces the shared "friend secret" with Ed25519 signatures: a person signs in by proving control of their DID (Decentralized Identifier), and may write a site iff their DID equals the owner DID. Implements the [DID-verifying FedWiki ownership spec](../../../docs/sodoto-did-ownership-plugin-spec.md).

## How sign-in works

1. The browser requests a challenge: `GET /auth/challenge` → `{ nonce, ttlMs }`.
2. It signs the nonce with the self-custodied key minted at onboarding (WebCrypto Ed25519; the private key never leaves the device). `client/signin.js` does this, reusing the `sodoto-identity` key.
3. It posts `POST /auth/verify { did, nonce, signature }`. The module verifies the signature against the `did:key` (same base58btc + `0xed01` decode the badge plugin uses), checks the nonce is live and single-use, and binds the session to the DID.
4. FedWiki's page-save path calls `isAuthorized(req)`, which returns true iff `req.session.did` equals the owner DID.

No password, no persona, no key on the server — the browser proves control of the private key by signing a fresh challenge.

## Ownership — the badge is the authority, and it fails closed

Ownership is not "first to sign in wins." The **badge on the portfolio is the source of truth** for who may own it (its `credential.holderDid`) — Marc's decision, Aug 2026. The owner DID is established three ways, in order of precedence:

- **Set by the proxy when the badge lands (recommended, "badge-sets-owner"):** when sofi-proxy writes a badge to a portfolio it also writes `status/owner.json = { name, did: holderDid }`. Ownership is set the moment the first badge is issued; the person just signs in to edit.
- **Resolved at claim time from the badge:** if the site is unowned, an interactive sign-in **claims** it only if the signing DID equals the holder DID read from the portfolio — via an injected `argv.expectedHolder()` resolver, or `argv.portfolioPath` (the module reads the page and pulls the badge's `holderDid`).
- **Registry-provisioned fallback:** `owner.json` holding `{ name, expectDid }` (unclaimed but bound) — the first sign-in claims it only if the signing DID equals `expectDid`.

**Fail closed:** if no holder can be established (the portfolio has no badge yet, and no `expectDid`), the claim is **refused with `403`** — an unbadged portfolio has no owner and cannot be grabbed by whoever signs in first.

`owner.json` (at `argv.id`, the site's `status/owner.json`): `{ "name": "...", "did": "did:key:z..." }`.

## Interface implemented

Factory `(log, loga, argv)` → `{ retrieveOwner(cb), getOwner(), setOwner(id, cb), getUser(req), isAuthorized(req), isAdmin(req), login(updateOwner), logout(), reclaim(), defineRoutes(app, cors, updateOwner) }`. `defineRoutes` registers `GET /auth/challenge`, `POST /auth/verify`, `POST /login` (== verify), `GET /logout`. Config: `argv.id` = owner file path; `argv.admin` = admin DID or array; `argv.owner_scope` = `'site'` (default, and the only supported value — see below); `argv.portfolioPath` / `argv.expectedHolder` = where to read the badge holder for a constrained claim.

## Deploy

1. Vendor this module into the wiki image (like `wiki-plugin-sodoto-badge`) and set `security_type` (or `--security_type`) to `did`.
2. Provision each portfolio as its **own** FedWiki site (per-person sites — shape A; the SCP per-patient-site provisioning is the precedent). Ownership is set from the badge: sofi-proxy writes `status/owner.json.did = holderDid` on badge write ("badge-sets-owner").
3. Serve `client/signin.js` and add a "Sign in with my SODOTO key" affordance to the portfolio.

`owner_scope` is **`site`** (shape A) — the module refuses any other value (fail loud, rather than silently mis-authorize). Shared-site per-page ownership (`owner_scope: page`) is described in the spec but not implemented; shape A is the deployment target.

## Testing

- `npm test` — 33 checks. `test/did-auth.test.js` covers the crypto core (did:key decode, Ed25519 verify, and every rejection path: wrong key, tampered nonce, replay, expiry, unknown nonce) plus `holderDidFromPage` (badge = the authority). `test/module.test.js` covers the FedWiki interface and the sign-in flow with mock req/res, including the constrained-claim `403`, the badge-sourced claim, the fail-closed "no badge yet → nobody claims" `403`, and the `owner_scope` guard.
- **Not covered by unit tests** (needs a running FedWiki with `security_type=did`): the wiki server actually calling `isAuthorized` on a real page PUT, and the browser widget against live routes. The browser→server signature interop is standard RFC-8032 Ed25519 (a valid signature verifies regardless of library), and the exact `did:key` path is the one the badge plugin already verifies WebCrypto signatures through.
