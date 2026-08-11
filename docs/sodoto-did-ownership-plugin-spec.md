# SODOTO — DID-Verifying FedWiki Ownership (Design Spec)

Status: draft · August 11 2026 · internal engineering spec (not a user doc)

## Goal

Let a person own and edit *their own* FedWiki portfolio using their self-custodied `did:key` — the same Ed25519 key they minted at onboarding (Build B) and sign gate attestations with (Build D) — so their SODOTO (See One, Do One, Teach One) DID (Decentralized Identifier) becomes their FedWiki identity. One identity per person across all of RCN, no FedWiki persona, no coordinator "logged in as" them.

This is the "path B → C" from the ownership discussion: authorize edits by proving control of the DID (B), aiming at the DID *being* the ownership identity (C).

## Why — the gap

FedWiki's ownership is per-*site* and uses FedWiki's *own* browser-held identity (a locally generated secret recorded in `status/owner.json`). That identity is orthogonal to the SODOTO DID. Today one site (`wiki-sodoto…`) is owned by Marc, and "logged in as DEMO Alex" was really Marc-as-owner. There is no way for the actual holder to prove "this is my page" and edit it while no one else can. The badge metadata we added (`holderPortfolio`, `holderDid`) solves *navigation* to the portfolio, not *authorization* to edit it. This spec closes that.

## Background — how FedWiki ownership works today

FedWiki (the `wiki` node module, pinned 0.27.0 in our image) selects an authentication/authorization backend via a pluggable **security module** (`security_type`). The module owns three responsibilities: establish a signed-in identity (login), record who owns a site (claim → `status/owner.json`), and authorize each page write (the `put` handler asks the security module whether the current identity may write). Stock modules include `wiki-security-friends` and `wiki-security-passportjs`. This pluggability is the supported extension point — we add a module, we do not patch the core.

Two facts shape the design: authorization is normally per-*site* (the owner owns everything on the site), and `owner.json` lives in the site's `status/` subfolder (the bug Christian caught earlier).

## Core idea — a `wiki-security-did` module

Ship a FedWiki security module that authenticates and authorizes via `did:key` signatures instead of a persona. Set `security_type` to it in the wiki image. It plugs into the same interface the stock modules implement, so the rest of FedWiki is untouched.

The module does four things:

1. **Challenge** — issues a short-lived random nonce for a browser to sign.
2. **Verify** — checks a submitted signature against a `did:key`, and on success establishes a session bound to that DID.
3. **Claim** — writes the owning DID into `owner.json` (or a page-level owner marker), *constrained* so only the expected holder can claim.
4. **Authorize** — on every `put`, allows the write only if the session DID equals the owner DID for that target.

## Sign-in flow (challenge–response, no shared secret)

1. On the portfolio, the user clicks **Sign in with my SODOTO key**.
2. Browser: `GET /auth/challenge` → `{ nonce, exp }` (server stores the nonce with a short TTL).
3. Browser signs the nonce with the user's `did:key` private key using WebCrypto Ed25519 — the exact machinery from onboarding/signing (the key is in the user's own storage; it never leaves the device).
4. Browser: `POST /auth/verify { did, nonce, signature }`.
5. Server recovers the public key from the `did:key` (same base58btc + `0xed01` multicodec decode the badge plugin uses), verifies the signature over the nonce, checks the nonce is unused and unexpired, and on success issues an httpOnly session cookie bound to `did`.
6. Subsequent `put` calls carry the session; the module authorizes them.

No password, no persona, no key on the server — the browser proves control of the private key by signing a fresh challenge. This is the same trust model as badge verification, run in reverse.

## Claiming a portfolio — constrained to the expected holder

FedWiki's default claim is "first identity to show up owns it," which is wrong here — a stranger could claim Alex's page. Instead the claim is **bound to the expected holder DID**:

- The server knows which DID should own which portfolio, from the people registry / the badge on the page (`holderDid`). On first sign-in to an unowned portfolio, the module claims it **only if** the session DID equals that expected `holderDid`; otherwise it refuses.
- This is also where the "association from the server" idea (see below) lands: the server is the authority on *who* a portfolio belongs to.

## Authorizing edits

On each `put`, allow the write iff `session.did == owner.did` for the target. Everyone else gets read-only (FedWiki's normal drag-a-copy-to-your-own-site federation still works for non-owners). Badge issuance is not affected — that write path is separate (below).

## Two deployment shapes

**A. Per-person sites (recommended).** Each person's portfolio is its own FedWiki site (farm mode), `owner.json.did = their DID`. Authorization is standard per-site owner check, just with a DID identity — minimal new logic, and it matches the sovereignty theme (each person, like each NDC, is sovereign over their own space). Cost: many small sites to provision (the issuer/proxy already provisions sites — the SCP per-patient-site pattern is the precedent).

**B. Shared site, per-page ownership.** One site, each portfolio page carries an owner DID; the module authorizes `put` per-page (`session.did == page.ownerDid`, where `ownerDid` is read from the badge's `holderDid` or a page owner marker). Fewer sites, but authorization becomes page-scoped custom logic rather than FedWiki's native per-site check.

Recommendation: **A for real deployments** (clean sovereignty, reuses provisioning, simplest auth), **B acceptable for the demo** to avoid a site per demo learner. The module should support both via a config flag (`owner_scope: site | page`).

## Coexistence with badge issuance

Two write paths, cleanly separated:

- **Badge issuance** → sofi-proxy (today: coordinator + passphrase; future: the NDC server auto-seals — see below). Writes the signed badge to the portfolio.
- **Narrative self-edit** → FedWiki `put`, authorized by `wiki-security-did`. The holder edits their own account of a gate, their about-me, etc.

The holder can edit their prose; only the NDC can write a sealed badge. Good separation of concerns.

## Security considerations

- **Challenge freshness** — single-use nonce, short TTL, server-side store; rejects replay.
- **Constrained claim** — a portfolio can only be claimed by its expected `holderDid`, so ownership can't be hijacked by whoever signs in first.
- **Key custody** — private key stays in the user's browser (Build B); the server only ever sees the public DID and signatures. `owner.json` holding a public DID is fine (it's public).
- **Loss / rotation** — if a person loses their key, they lose edit ability; recovery is the recovery seed from Build B (re-import → same DID). Rotating to a new DID requires an owner-transfer path (a signed hand-off, or an NDC-server override for the demo). Spec this out before production.
- **Session** — httpOnly, SameSite, short-lived, re-challenge on expiry.

## What to build

1. `wiki-security-did` — the FedWiki security module (npm package per our plugin conventions: `wiki-security-*`), implementing login/claim/authorize + the `/auth/challenge` and `/auth/verify` endpoints; `owner_scope: site | page` config.
2. A small **browser sign-in widget** that reuses the onboarding key to sign the challenge (share code with `sodoto-onboard.html` / `sodoto-sign.html`).
3. **Constrained-claim wiring** — the module learns the expected holder DID from the registry / the page's badge.
4. **Wire into the image** — add the module to the wiki image, set `security_type`, and (shape A) provision a per-person site at onboarding.
5. **Owner-transfer / recovery** path (can follow initial release).

## Open decisions (for Marc)

- Deployment shape A vs B (recommend A for prod, B for demo — support both).
- Where the module reads the expected holder DID (people registry vs the badge on the page).
- Owner-transfer/rotation model for lost keys.
- Whether the NDC server may override ownership (needed for demo reset; risky for prod).

## Relationship to "NDC association from the server"

This plugin is a **prerequisite** for removing the coordinator. Self-service issuance (that discussion) needs the mentor and learner to authenticate and sign on their own pages — which is exactly what DID sign-in provides. Together: the DID authenticates the person (this spec) → the person signs their attestation (Build D) → the NDC's server verifies the full mutual-attestation set and auto-applies the NDC seal (the coordinator-removal design). The DID is the single thread running through onboarding, attestation, ownership, and issuance.
