# wiki-security-did

A FedWiki security module whose identity is a self-custodied `did:key`. It implements the same interface as `wiki-security-friends`, but replaces the shared "friend secret" with Ed25519 signatures: a person signs in by proving control of their DID (Decentralized Identifier), and may write a site iff their DID equals the owner DID. Implements the [DID-verifying FedWiki ownership spec](../../../docs/sodoto-did-ownership-plugin-spec.md).

## How sign-in works

1. The browser requests a challenge: `GET /auth/challenge` → `{ nonce, ttlMs }`.
2. It signs the nonce with the self-custodied key minted at onboarding (WebCrypto Ed25519; the private key never leaves the device). `client/signin.js` does this, reusing the `sodoto-identity` key.
3. It posts `POST /auth/verify { did, nonce, signature }`. The module verifies the signature against the `did:key` (same base58btc + `0xed01` decode the badge plugin uses), checks the nonce is live and single-use, and binds the session to the DID.
4. FedWiki's page-save path calls `isAuthorized(req)`, which returns true iff `req.session.did` equals the owner DID.

No password, no persona, no key on the server — the browser proves control of the private key by signing a fresh challenge.

## Ownership — bound to the expected holder

Ownership is not "first to sign in wins." Two ways to set it:

- **Provisioned (recommended):** at site creation the issuer/proxy calls `setOwner({ name, did })` from the registry, so `owner.json` records the intended holder's DID up front. The person just signs in to edit.
- **Constrained interactive claim:** if `owner.json` holds `{ name, expectDid }` (unclaimed but bound), the first sign-in **claims** it only if the signing DID equals `expectDid`; anyone else gets `403`.

`owner.json` (at `argv.id`, the site's `status/owner.json`): `{ "name": "...", "did": "did:key:z..." }`.

## Interface implemented

Factory `(log, loga, argv)` → `{ retrieveOwner(cb), getOwner(), setOwner(id, cb), getUser(req), isAuthorized(req), isAdmin(req), login(updateOwner), logout(), reclaim(), defineRoutes(app, cors, updateOwner) }`. `defineRoutes` registers `GET /auth/challenge`, `POST /auth/verify`, `POST /login` (== verify), `GET /logout`. Config: `argv.id` = owner file path; `argv.admin` = admin DID or array.

## Deploy

1. Vendor this module into the wiki image (like `wiki-plugin-sodoto-badge`) and set `security_type` (or `--security_type`) to `did`.
2. Provision each portfolio site's `status/owner.json` with the holder's DID from the registry (per-person sites — the recommended shape; the SCP per-patient-site provisioning is the precedent).
3. Serve `client/signin.js` and add a "Sign in with my SODOTO key" affordance to the portfolio.

Shared-site per-page ownership (`owner_scope: page`) — authorizing per page against the badge's `holderDid` — is described in the spec and not yet implemented here; the site-scoped model above is the first cut.

## Testing

- `npm test` — 22 checks. `test/did-auth.test.js` covers the crypto core (did:key decode, Ed25519 verify, and every rejection path: wrong key, tampered nonce, replay, expiry, unknown nonce). `test/module.test.js` covers the FedWiki interface and the sign-in flow with mock req/res, including the constrained-claim `403`.
- **Not covered by unit tests** (needs a running FedWiki with `security_type=did`): the wiki server actually calling `isAuthorized` on a real page PUT, and the browser widget against live routes. The browser→server signature interop is standard RFC-8032 Ed25519 (a valid signature verifies regardless of library), and the exact `did:key` path is the one the badge plugin already verifies WebCrypto signatures through.
