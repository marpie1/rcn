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

## Deploy (ships "dark", flipped by env)

The wiki image (`deploy/docker/Dockerfile.fedwiki`) already vendors this module and launches with `wiki --port 3000 ${SECURITY_TYPE:+--security_type $SECURITY_TYPE}` — so with `SECURITY_TYPE` **unset** it runs exactly as today's `friends` deployment, and the module is inert. This makes the image safe to publish under WikiCafe's hourly auto-pull; nothing changes until the env is flipped.

To turn on DID ownership at a coordinated moment:

1. Set `SECURITY_TYPE=did` on the wiki service and `SODOTO_DID_OWNERSHIP=1` on the proxy service (compose env).
2. Provision each portfolio as its **own** FedWiki site (per-person sites — shape A) via the proxy's `POST /api/sodoto-provision-site`; the SCP per-patient-site provisioning is the precedent. Ownership is set from the badge: sofi-proxy writes `owner.json.did = holderDid` on badge write ("badge-sets-owner"), and never overwrites an existing owner.
3. The module serves its widget at `GET /auth/signin.js` (same-origin); add a "Sign in with my SODOTO key" affordance to the portfolio that calls `sodotoSignIn()`.

`owner_scope` is **`site`** (shape A) — the module refuses any other value (fail loud, rather than silently mis-authorize). Shared-site per-page ownership (`owner_scope: page`) is described in the spec but not implemented; shape A is the deployment target.

## Testing

- `npm test` — 33 checks. `test/did-auth.test.js` covers the crypto core (did:key decode, Ed25519 verify, and every rejection path: wrong key, tampered nonce, replay, expiry, unknown nonce) plus `holderDidFromPage` (badge = the authority). `test/module.test.js` covers the FedWiki interface and the sign-in flow with mock req/res, including the constrained-claim `403`, the badge-sourced claim, the fail-closed "no badge yet → nobody claims" `403`, and the `owner_scope` guard.
- `test/integration/run.sh` — **end-to-end against a REAL FedWiki 0.27** in `--farm --security_type did` (builds the wiki image, lays down two per-person sites, drives challenge→verify→PUT over HTTP). Proves what unit tests can't: the module loads under real FedWiki, the farm wires per-site owner via `wikiDomains[site].id`, `verify` sets a `client-sessions` cookie, and **FedWiki calls `isAuthorized` on a real `PUT /page/:slug/action`** — allowing the owner (200), rejecting anon and non-owner (403). 7/7. Requires Docker.
- **Still validated only by hand:** the on-page "Sign in with my SODOTO key" affordance in the wiki UI (the widget itself is served — `/security/signin.js` natively, and `/auth/signin.js` — and unit-covered). The browser→server signature interop is standard RFC-8032 Ed25519.
