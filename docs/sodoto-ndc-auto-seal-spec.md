# SODOTO — NDC-Server Auto-Seal (Design Spec)

Status: draft · August 11 2026 · internal engineering spec (not a user doc)

## Goal

Remove the coordinator. Each NDC (Neighborhood Development Center) runs its own SODOTO (See One, Do One, Teach One) server, holding that NDC's signing key. Learners self-onboard, and mentors, learners, and students sign the gate attestations directly with their self-custodied DIDs (Decentralized Identifiers). When a contract's full mutual-attestation set is present and valid, the NDC's server **automatically applies the NDC seal** — it signs the credential with the NDC key and publishes the badge. "Association with the NDC" is no longer a coordinator pasting a key; it is *this credential was sealed by this NDC's server after verifying the protocol completed.*

Each NDC is sovereign: its own server, its own key, its own domain.

## What changes

The coordinator's per-credential job decomposes into three piles, none needing a coordinator:

- **Register a learner** → self-service (Build B/C: the learner mints and registers their own DID).
- **Record the gates** → the actual humans sign directly. The mentor signs (they witnessed), the learner signs (they did it), the student signs their Do One at Teach One. The gate record *is* those signatures.
- **Apply the NDC seal** → the server does it automatically, after verifying the signatures and the mentor's qualification.

What remains is institutional, not clerical (see "What still needs a human").

## The shift in what the NDC seal means

Today the seal encodes a coordinator's judgment: "I confirm this learner earned it." After auto-seal, it encodes a *verified fact*: "NDC-X's server confirmed that the learner completed the See/Do/Teach protocol for this skill, witnessed by a qualified mentor, with every party's cryptographic attestation present and valid." The NDC vouches for the **process having completed correctly**, mechanically and auditably — arguably more trustworthy than a manual sign-off, because every input is a non-repudiable signature on the record.

## New requirement: the mentor signs each gate

v0.4 embeds a **learner** JWT (JSON Web Token) per gate and a **student** JWT at Teach One. With no coordinator transcribing the mentor's attestation, the **mentor must also sign each gate** — a mentor JWT, verified against the mentor's DID. This is the one concrete format addition this design needs (call it v0.5): every completed gate carries `learnerJwt` + `mentorJwt`; Teach One additionally carries `studentJwt`. The mentor signs with the same in-browser machinery the learner already uses (Build D).

## End-to-end flow (no coordinator)

1. **Contract forms from a dyadic agreement.** A learner requests skill S from NDC-X (signs the request). A qualified mentor agrees to witness (signs the agreement). The contract exists once both signatures are present; the server assigns a `contractId`. This is the CfA-dSC-style dyadic commitment, applied to credentialing.
2. **Gates accrue signatures.** For each gate, the mentor and learner (and, at Teach One, the student) sign the attestation on their own devices. The server stores each signed JWT on the gate.
3. **The server watches the contract.** When the last required signature lands, the server runs the **auto-seal policy** (below).
4. **Auto-seal.** If the policy passes, the server signs the credential with the NDC key, writes the sealed badge to the learner's portfolio, and projects it to the teaching graph. Idempotent on `contractId` — sealing twice is a no-op.
5. **Verification stays serverless.** The badge carries the issuing NDC's `did:key`; anyone verifies it in-browser with no call to the NDC server. Server-held signing does not compromise serverless verification — the public key is in the badge's DID.

## The auto-seal policy — what the server verifies before sealing

This policy is the automated gate that replaces the coordinator's judgment, and it is the security boundary. For a full credential (skill S, learner L, mentor M, issuer NDC-X):

1. All three gates present with `outcome = complete`.
2. Each gate carries a valid **learner JWT** — signature verifies against L's DID.
3. Each gate carries a valid **mentor JWT** — signature verifies against M's DID.
4. Teach One carries a valid **student JWT** — verifies against the student's DID.
5. **Mentor qualification** — M holds a valid NDC-sealed credential for S, established by verifying M's badge signature directly (see *Qualification: what to trust*), *or* M is in NDC-X's founding cohort for S. This is the check that makes the lineage real and blocks bootstrapping from nothing.
6. **Identity consistency** — the signing DIDs match the registered learner/mentor/student; the learner is the badge holder.
7. **Not already sealed** — no existing credential for this `contractId`.
8. **Sanity** — gates in order, dates plausible (soft checks).

All pass → sign with the NDC key. Any fail → the contract stays pending (missing inputs) or is rejected (invalid inputs), with the reason recorded. The policy must be robust, tested, and auditable — a bug here mints false credentials.

## Qualification: what to trust

Decided: qualification reads the **badges** — the source of truth — never a derived projection. The governing rule is *a derived artifact may accelerate lookup, but must never be trusted to grant a credential.*

- At seal time the server locates the mentor's qualifying badge and **verifies its signature** against the issuing NDC's key. It trusts the signature, not any index — exactly what an ordinary verifier trusts.
- A local **derived index** (badges → who-holds-what), rebuilt from the badges, may be kept purely to *find* candidate badges quickly. Because the grant still hinges on verifying the badge signature, a stale or corrupt index can only cause a false *negative* (mentor "not found" → the seal simply waits), never a false *positive* (a credential minted on bad data).
- The Neo4j teaching graph therefore stays exactly what it was decided to be — a lens, deletable and rebuildable, **never a dependency of issuance**. If lineage-shaped qualification ("N hops from the founding cohort") is ever wanted, the graph may be queried as a *hint* to find candidate badges, but the seal still verifies the signature.
- Cross-NDC qualification (a mentor credentialed by another NDC) is a federation read: fetch that badge and verify its signature across the trust boundary — verifying, not trusting a merged index.

## Contract formation and mentor discovery

Without a coordinator to "open a contract," it forms from the learner request + mentor agreement (both signed). Mentor discovery is self-organizing: the server (or the teaching graph) can list who holds S — the pool of qualified mentors — and the learner and a willing mentor agree. The founding cohort seeds the very first mentors; every later mentor is someone the chain already credentialed.

## The NDC key on the server — posture and mitigations

This is the real trade-off. The NDC private key now lives on the NDC's server so it can auto-sign, rather than only in a coordinator's browser at signing time. Mitigations:

- **Per-NDC server** — a compromised key affects one NDC, not the network (federation limits blast radius).
- **Key custody** — enclave/HSM if available; at minimum encrypted at rest, decrypted only in memory at signing time, tightly access-controlled; never in the image or in git.
- **The policy is the boundary** — the server signs only after the full verification above; harden and audit it.
- **Optional review gate** — for high-stakes skills, run in "queue" mode: the policy assembles a ready-to-seal item and an NDC admin confirms with a human co-sign, instead of fully automatic. Config per NDC or per skill (`seal_mode: auto | review`).
- **Rotation** — an NDC can rotate to a new `did:key`; old credentials still verify against the old DID embedded in their badges; new credentials use the new key. Publish the NDC's current key at a well-known endpoint and/or bind it to the domain. Back up the NDC seed securely — losing it means no new seals (existing ones survive).

## Reconciling with "signing belongs to the user in the browser"

The rule holds. *People* — mentor, learner, student — still sign in their own browsers with their own keys; those signatures are the load-bearing evidence. Only the **institutional seal** is server-automated, the way a certificate authority signs. An institution's own agent applying its own seal after verifying the evidence is not the same as forging a person's signature.

## Federation — each NDC sovereign

Each NDC = its own server + key + domain. A person's DID is the same across NDCs (self-custody), so one identity can hold credentials from many NDCs. Because verification recovers the issuing NDC's public key from the badge's `did:key`, it remains serverless and cross-NDC by construction. NDCs can also set a **cross-NDC trust policy** for mentor qualification: does a mentor credentialed by NDC-Y qualify to witness on NDC-X? (Default: same-NDC; opt-in to honor peers.)

## What still needs a human

The NDC administrator: deploy and run the server; custody, back up, and rotate the NDC key; declare the **founding cohort** (the trust root — the initial qualified mentors); set the auto-seal policy (`auto` vs `review`, per skill); handle disputes and revocation; curate the skill catalog. These are governance tasks, done rarely — not the per-credential clerical loop that exists today.

## Abuse / sybil resistance

The risk is collusion — a fake mentor and learner minting credentials. Defenses:

- **Qualification chain** — a mentor must already hold the credential (NDC-sealed), so a chain of real credentials rooted in the founding cohort is required; you cannot bootstrap from nothing. Collusion needs a real credential-holder to participate — which is exactly the point of witness-based credentialing.
- **Non-repudiable public record** — every attestation is a signature on the record; a mentor who rubber-stamps stakes their own credential and reputation (the mentor-standard from the user manual, now cryptographic).
- **Graph visibility + rate limits** — collusion clusters and unusual issuance rates are visible in the teaching graph.

This is not perfect — a corrupt real mentor can vouch falsely — but that is inherent to any witness system; the difference is it is all on the record and traceable.

## Failure and edge cases

- Incomplete gates → contract stays pending; no seal.
- Mentor's own credential revoked → qualification check fails; no seal.
- Disputed attestation → flagged; auto-seal must not fire on a flagged contract; NDC admin dispute process resolves it.
- Participant key loss → recover via the recovery seed (Build B); cannot sign until recovered.
- NDC key loss → no new seals; existing credentials still verify. Secure backup of the NDC seed is critical.

## What to build

1. **Mentor JWT per gate** (v0.5 format addition) — the mentor signs each gate with their own key, alongside the learner and student.
2. **Contract-formation endpoints** — signed learner-request + signed mentor-agreement form the contract server-side.
3. **Auto-seal policy engine** — verify the full attestation set + mentor qualification (by verifying the mentor's badge signature — badges, not the graph) → sign with the NDC key → write badge → project to graph; idempotent on `contractId`; records pass/fail reasons.
4. **NDC key custody** on the server (enclave/env, rotation, secure backup) + a published-current-key endpoint.
5. **Founding-cohort bootstrap** — declare the initial trust anchors (admin-declared or self-signed roots).
6. **`seal_mode: auto | review`** — optional human co-sign queue for high-stakes skills.
7. **Per-NDC deployment** — each NDC gets its own server (own domain + key), reusing the current image plus the key + policy engine + auto-seal trigger.

## Open decisions (for Marc)

- Strict `auto` seal vs `review` gate — globally, or per skill?
- NDC key custody: env vs enclave/HSM; rotation cadence; backup custody.
- Founding-cohort declaration mechanism (how the trust root is seeded).
- Contract-formation UX and mentor discovery.
- Cross-NDC mentor qualification: same-NDC only, or a federated trust policy?

## Relationship to the other pieces

- **DID-ownership plugin** ([sodoto-did-ownership-plugin-spec.md](sodoto-did-ownership-plugin-spec.md)) is the prerequisite: it is how the mentor and learner authenticate to sign on their own pages. The DID authenticates the person → the person signs their attestation (Build D, extended with the mentor JWT here) → the NDC server verifies the set and auto-seals. The DID is the single thread through onboarding, attestation, ownership, and issuance.
- **v0.4 → v0.5** — this design adds the mentor JWT to the credential format; everything else (learner/student JWTs, required-for-full, badge verification) carries forward.
- **Teaching graph** ([the projector](sodoto-teaching-graph-manual.html)) stays a pure lens, **not** an input to issuance — decided. Mentor qualification reads the badges directly and verifies their signatures (see *Qualification: what to trust*); the graph may at most be queried as a lookup hint, never trusted to grant a credential.
