# sodoto-auto-seal

The NDC (Neighborhood Development Center) auto-seal engine — the last piece of coordinatorless SODOTO (See One, Do One, Teach One) issuance. When a contract's full mutual-attestation set is present and valid, and the witnessing mentor(s) are qualified, the engine applies the NDC seal: it signs the credential with the NDC key. No coordinator. Implements [docs/sodoto-ndc-auto-seal-spec.md](../../docs/sodoto-ndc-auto-seal-spec.md).

## Two rules it holds

- **People sign in their browsers; only the institutional seal is server-side.** The learner, mentor, and student each signed their gate attestations (Build B/D/E, v0.5) with their own keys — this engine only adds the NDC's own seal after verifying them.
- **Qualification reads the badges, verifies signatures — never a derived index.** `makeMentorQualified` checks the mentor's badge and verifies its NDC signature. A stale or missing index can only cause a false *negative*, never a false *positive*, so the Neo4j teaching graph stays a pure lens.

## The policy (`evaluate`)

Returns `{ ready, checks, reasons }`. It passes only when: not already sealed; all three gates complete; every gate carries a valid learner JWT and a valid mentor JWT (verified against those DIDs, claims bound to this contract/gate); Teach One carries a valid student JWT; every witnessing mentor is qualified (holds this skill, or is founding cohort); and the learner/issuer DIDs are present. A bug here mints false credentials — it is the security boundary, hence the tests.

## API

- `evaluate(contract, deps)` → `{ ready, checks, reasons }`
- `seal(contract, ndcSeedHex, opts?)` → the sealed credential (signs `credential.jwt` with the NDC key)
- `autoSeal(contract, ndcSeedHex, deps)` → `{ sealed, credential?, reasons?, checks }` — evaluate, then seal if ready, then `deps.onSealed(cred)`
- `makeMentorQualified({ foundingCohort, badgesFor, trustedIssuers })` → `async (mentorDid, skillSlug) => bool`

`deps`: `mentorQualified(did, skill)`, `alreadySealed(contractId)` (idempotency), `onSealed(cred)` (write the badge / project to graph).

## Integration (not built here)

This is the library. Standing an NDC server on it means: contract-formation endpoints (signed learner-request + mentor-agreement), a trigger that calls `autoSeal` when the last signature lands, **NDC key custody** (env/enclave, rotation, secure backup — the key becomes a server-side signing oracle, so per-NDC deployment limits blast radius), and `onSealed` wiring to write the badge and project it. An optional `seal_mode: review` (human co-sign queue for high-stakes skills) belongs at the `autoSeal` call site.

## Testing

- `npm test` — 13 checks: full seal (NDC JWT + embedded learner/mentor/student attestations all verify), every failure reason (missing mentor sig, wrong-key sig, unqualified mentor), qualification via a real prior badge (and rejection of a tampered one), and idempotency.
- **Not covered** (needs the NDC-server deployment): the contract-formation endpoints, live NDC key custody, and the `onSealed` write path.
