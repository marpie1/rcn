# SCP — DID Ownership for Shared Care Plans (Design Note)

Status: draft, to pick up after SODOTO deploys (Aug 18 2026) · Aug 16 2026 · internal engineering design note (not a user doc)

## Why this exists

SODOTO now has cryptographic per-person ownership: a learner edits their own FedWiki portfolio by proving control of their self-custodied `did:key` (challenge → sign a nonce in the browser → verify), with no shared password. The Shared Care Plan (SCP) deployment has the same underlying gap and should get the same foundation — but it is NOT a copy of the SODOTO rollout, because an SCP is edited by **both the patient and their CHW(s)** (and possibly the wider care team). That "shared, multi-editor" nature is the whole design problem here.

Acronyms at first use: SCP = Shared Care Plan; CHW = Community Health Worker; NDC = Neighborhood Development Center; DID = Decentralized Identifier (here a `did:key`).

## Where SCP stands today (grounded in the deploy config)

- **Single-host, not per-person.** `deploy/scp/Dockerfile.fedwiki` launches `wiki --port 3000` (no `--farm`), `deploy/scp/Caddyfile` routes exactly one `WIKI_DOMAIN`, and `deploy/scp/.env.example` defines a single wiki host. There are no per-patient subdomains in production.
- **The per-patient `.localhost` sites in `sofi-proxy.py` `provision-patient` are a dev-only pattern** — they were never productionized into farm mode + wildcard addressing.
- **Friends/shared-secret auth.** SCP `owner.json` carries a `friend.secret`; no `security_type=did`. Ownership is an operator-held secret, not a person proving their own key — the same gap SODOTO had before this work.

So the need is real; the question is the model.

## The core difference from SODOTO — authorization is a SET, not a person

A SODOTO portfolio has exactly one owner (the learner), so `owner_scope: site` and "one owner DID per site" fit perfectly. A care plan is inherently multi-party: the **patient** and their **CHW(s)** both edit the same plan, and the care team may too. The single-owner check (`session.did == the one owner`) does not fit. SCP needs an **authorized-editor set** per care plan — "these DIDs may edit this plan" — probably with roles.

This is the headline: **reuse the SODOTO DID identity + sign-in, but replace single-owner authorization with a multi-editor (and possibly role-aware) access model.**

## Proposed authorization model

- **Editor set in `owner.json`.** Instead of `{ name, did }`, an SCP site's owner record holds `{ name, editors: [ did, … ] }` (or `{ patient: did, chws: [did,…] }`). `isAuthorized(req)` becomes `session.did ∈ editors`. This is a modest extension of `wiki-security-did` (the challenge/verify core is unchanged).
- **Roles — start flat, add later.** Simplest v1: any authorized editor may edit (patient and CHW are peers on the plan). If clinical governance needs it later, add roles (e.g. patient can edit everything; CHW can edit contributions but not certain patient-only sections; read-only viewers for the wider team). Recommend flat first; roles are a real increment, not a v1 requirement.
- **Where the editor list comes from.** The patient/CHW registry at provisioning: the patient's own DID plus their currently-assigned CHW DID(s). Unlike SODOTO there is no badge to anchor identity (no `badge-sets-owner`), so the registry is the source of truth for who may edit.
- **Revocation.** Reassigning a CHW must remove their DID from the editor set (and ideally invalidate their live session). This matters more than in SODOTO — it is health data and CHW assignments change. An editor-list update + short session TTL covers it; a hard session kill is a later refinement.

## The addressing decision — per-patient subdomain vs single-host

Two shapes, same as the SODOTO discussion, but the recommendation differs because a care plan is a coherent multi-page unit per patient.

- **A. Per-patient site (subdomain).** Each patient's care plan is its own FedWiki site (`{patient}.wiki.<ndc>…`). Needs the same infra we built for SODOTO: wildcard DNS + Caddy on-demand TLS + farm mode. Clean isolation, natural "one plan per patient," and it reuses the SODOTO ask-endpoint/on-demand pattern. The editor-set auth rides on `owner_scope: site`.
- **B. Single-host, per-plan authorization.** Keep one SCP host; authorize per care-plan page-set. No new infra, but needs page-scope authorization code (deliberately not built for SODOTO) plus the multi-editor set.

Recommendation: **A (per-patient site)**, because an SCP is already modeled as a per-patient collection of pages (about-me + the 19 SCP plugin pages), so the site is the natural unit, and it reuses the SODOTO wildcard/on-demand infrastructure directly. This means SCP would adopt the same Christian-side infra change (one wildcard DNS record + the Caddy on-demand block) — but as a SEPARATE, later rollout, not bundled with Tuesday.

## Identity and key onboarding — patients AND CHWs

- **Both roles need self-custodied keys.** Same machinery as SODOTO: `tools/sodoto-onboard.html` (in-browser Ed25519 keygen) + `tools/sodoto-crypto.js` (passphrase-encrypted recovery). Reusable as-is; likely rebranded for the SCP context.
- **CHW keys are cross-patient.** A CHW onboards once; their DID is added to the editor set of each patient they are assigned to. One identity, many plans.
- **Patient key-custody UX is the hard part.** Patients may be less technical than SODOTO learners, and this is health data. The passphrase-encrypted-recovery model matters even more. Open question: **CHW-assisted onboarding** — a CHW helps a patient create their key — while preserving the principle that the key is the *patient's*, minted on the patient's device, never held by the CHW ([[project_self_custody_identity]]). Assisted setup without custody transfer needs care; spec it before building.
- **Relationship to the SCP 3.0 personal-computer track** ([[project_scp3_personal]]): that track already treats "own key per person" as load-bearing. This design is the FedWiki-ownership half of that; keep them aligned.

## Reusable vs new

Reusable (the proven parts): the `did:key` identity, the challenge-response sign-in (`wiki-security-did` core + `signin.js` + `wiki-plugin-sodoto-signin`), the Caddy on-demand-TLS ask pattern, the per-site provisioning scaffold, and `sodoto-crypto.js` recovery.

New for SCP: multi-editor (and optional role) authorization in the security module; registry-driven editor lists (patient + assigned CHWs) instead of badge-sourced ownership; the CHW-across-patients model; patient onboarding UX and assisted recovery; and productionizing per-patient farm addressing for SCP (which today runs single-host).

## Sensitivity note

SCP is health data — higher stakes than SODOTO portfolios. Beyond auth, a real rollout should weigh: an edit/access audit trail (who changed what, when), least-privilege roles, revocation on CHW reassignment, and whatever consent/sharing model the care team requires. These are out of scope for the first cut but should be named before a pilot with real patient data.

## Open decisions (for Marc, after SODOTO deploys)

- Flat editor set vs roles (patient / CHW / read-only viewer) for v1.
- Addressing: per-patient subdomain (A, recommended, reuses SODOTO infra) vs single-host per-page (B).
- CHW-assisted patient onboarding — how to help a patient mint a key without the CHW ever holding it.
- Care team beyond the CHW (clinicians, family) — are they editors, viewers, or federated-in?
- Revocation mechanics and whether an audit trail is required for the pilot.
- Alignment with [[project_scp3_personal]] and [[project_scp2]] (the 19 typed SCP plugins).

## Sequencing

After SODOTO is deployed and stable (Aug 18 2026+). No code until the model (editor-set-vs-roles and addressing) is decided. The SODOTO work is the proof that the foundation holds; this note is the delta to make it fit a shared, multi-editor care plan.
