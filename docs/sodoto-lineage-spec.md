# SODOTO — Verifiable Lineage (Design Spec)

Marc Pierson and Claude Opus 5.5 · September 2026

Status: draft for agreement · September 26 2026 · internal engineering spec (not a user doc) · demo: `docs/sodoto-lineage-demo.html`

## Goal

Let anyone holding a SODOTO (See One, Do One, Teach One) credential — or anyone looking at one — follow the chain of transmission back to where the skill entered the network, and forward to who it went on to, checking every link cryptographically, in the browser, with no server to trust.

The intro already promises this: *"The chain of transmission is embedded in the credential."* Today that is true for one hop only. This spec makes it true for the whole chain.

## What a credential carries today

Each credential records its immediate neighbours and nothing beyond them:

- the **mentor** at each gate — name, DID (Decentralized Identifier), portfolio slug — and, from v0.5, the mentor's own signature on the gate;
- the **student** at Teach One — name, DID, portfolio — and the student's signature.

The full lineage exists only when many credentials are joined: the ledger page, the Mentoring Log and Students Taught sections, and the Neo4j projector's `TAUGHT` edges. None of those is signed, and the Neo4j lens lives on the Desktop only.

There is also a gap in what one hop proves. The credential names the mentor's DID, but not **the credential that qualified the mentor**. A verifier cannot tell, from the badge alone, that the mentor held the skill when they taught it. The auto-seal spec checks this at seal time (policy item 5) and then throws the answer away.

## Decision: link, don't copy

Two ways to put lineage in a credential:

- **Copy** the whole upstream chain into every new credential. Rejected. The chain is fixed at issue time, so it *could* be copied, but it copies the names and DIDs of everyone upstream into every portfolio forever; it grows with every generation; and a withdrawn upstream credential would live on in the copies.
- **Link** each credential to the one that qualified its mentor, by content hash. Adopted. This is how git commits point to their parents and how Nix closures are built. Each credential carries one pointer per mentor; following the pointers reconstructs the chain; the hash makes every link tamper-evident.

Upstream lineage is therefore *embedded as pointers and walked on demand*. Downstream lineage — who this person went on to teach — grows after issue, so it can never be inside the credential; it is *found through an index and then verified*.

## Format change — v0.6

v0.6 is v0.5 (mutually attested) plus one field: `qualifiedBy`, on every gate's `mentor` object. Because `gates` is inside the signed JWT payload (`vc.credentialSubject.sodoto.gates`), the pointer is covered by the NDC's signature and cannot be swapped after issue.

### Pointer to a mentor's credential

```json
"mentor": {
  "name": "Dana Okafor",
  "did": "did:key:z6Mk…",
  "portfolio": "dana-okafor-sodoto-portfolio",
  "qualifiedBy": {
    "type": "credential",
    "contractId": "sodoto-cld-demo-2026-0002",
    "issuerDid": "did:key:z6Mk…",
    "skillSlug": "cld",
    "digest": "sha256:9f2c…",
    "at": "https://dana-okafor.wiki-sodoto…/dana-okafor-sodoto-portfolio.json"
  }
}
```

- `digest` — SHA-256 over the exact bytes of the mentor credential's compact JWT string, hex, prefixed `sha256:`. Hashing the JWT string rather than re-serialised JSON avoids every canonicalisation problem: the bytes that were signed are the bytes that are hashed.
- `at` — a **location hint**: the FedWiki page JSON that held the badge at issue time. Only a hint. Any copy of the credential, from anywhere, is accepted if its digest matches. Sites move; the digest does not.
- `contractId`, `issuerDid`, `skillSlug` — so the walker can find the credential by other routes (ledger, static projection) when the hint is dead, and so a reader can see where a link goes without fetching it.

### Pointer to the root — the founding statement

Someone has to be first. The founders of a skill at an NDC have no mentor credential. They are qualified by a **founding statement**: a small JWT signed by the NDC key naming the skill, the founding cohort's DIDs and names, and the date. It is published once, on the NDC's site.

```json
"qualifiedBy": {
  "type": "founding",
  "statementId": "sodoto-founding-cld-demo-2025",
  "issuerDid": "did:key:z6Mk…",
  "skillSlug": "cld",
  "digest": "sha256:41ab…",
  "at": "https://demo-ndc…/sodoto-founding-cld.json"
}
```

The founding statement is the auto-seal spec's "founding cohort", made into a signed, citable document. Every lineage ends at one. A walk that ends anywhere else is incomplete, and the badge says so.

### Version and flags

`cred.version = "0.6"` when every completed gate's mentor carries a `qualifiedBy` that the issuer verified at issue time. A new flag `lineageRecorded: true` goes beside `mutuallyAttested`. A v0.5 credential that lacks pointers stays v0.5.

## Verifying one link

To accept that credential C's mentor M was qualified by credential P:

1. **Digest** — `sha256(P.jwt) == C.gate.mentor.qualifiedBy.digest`.
2. **Signature** — P's JWT verifies against P's `issuerDid`.
3. **Holder** — P's holder (`sub`) is M's DID. The mentor who signed C's gate is the person who holds P.
4. **Skill** — P certifies the same skill as C (see the open decision on skill families).
5. **Timing** — P was issued on or before the date of the gate M witnessed. The mentor held the skill *when they taught it*.
6. **Complete** — P is a full credential, not partial.

For a founding statement, checks 1, 2 and 4 apply, check 3 becomes *M's DID is in the cohort*, and check 5 becomes *the statement predates the gate*.

Each check is shown separately on the badge, so a failure says exactly which link broke and why.

## Walking the chain

- Start at the credential being viewed. Its parents are the distinct `qualifiedBy` pointers across its gate mentors — usually one mentor, so one parent.
- For each parent: fetch from `at`; if unreachable, look it up by `contractId` in the issuing NDC's ledger or static projection; verify the link; recurse.
- Stop at a founding statement (complete), at a credential with no pointers (a pre-v0.6 credential — "lineage not recorded before this point"), or at a link that fails or cannot be fetched (shown, never hidden).
- Guards: a visited set (a cycle is a failure, not a loop) and a depth limit of 50.
- Everything runs in the browser, the same way the badge's Verify already does. No SODOTO server is involved; the only network reads are the page JSON fetches.

## Downstream: who it went on to

The credential already signs one downstream fact: the Teach One student. That is shown directly.

Everyone who later earned the skill with this holder as mentor is found by **looking up credentials whose `qualifiedBy.digest` equals this credential's digest**. That lookup needs an index, and the index is untrusted in exactly the way the auto-seal spec already settled: *a derived artifact may accelerate lookup, but must never be trusted to grant.* Every downstream credential the index returns is fetched and its pointer verified before it is shown. A stale or partial index can hide a descendant (a false negative); it can never invent one.

The index candidates, in order of preference:

- the NDC's **ledger page**, extended with a digest column;
- the NDC's **Layer 1 static projection** (the `export.py` folder), which already runs on WikiCafe with no server;
- the Neo4j lens, for the Desktop.

## Privacy and leaving

- A credential copies only what it copies today: its own mentor's name and DID. The pointer adds a hash and a location, not more people.
- Names further up are shown only if their portfolios are reachable when someone walks the chain. A person who takes their portfolio down removes their name from every walk; downstream credentials still carry their DID and the digest, so the link still verifies if a copy is found, but it is no longer *displayed* with a name.
- Nothing about lineage needs a central register of people.

## What changes where

- **Issuer (`tools/sodoto-issuer.html`)** — at Sign & Issue, for each gate mentor: read the mentor's portfolio, find their badge for this skill, verify it (checks 2–6 above), and embed `qualifiedBy`. If none verifies and the mentor is not in the founding statement, full v0.6 issuance is blocked with the reason — the same shape as the existing "Issue as v0.3" escape hatch, which stays. Signing stays in the browser.
- **Founding statements** — a small panel (or a one-off script) for an NDC to sign and publish the founding statement per skill. Signed in the browser with the NDC key, like any credential.
- **Badge plugin (`wiki-plugin-sodoto-badge`)** — a Lineage row in the verify panel, a *Show lineage* control, the walker, and the chain view in the demo. This ships in the `rcn-sodoto-wiki` image.
- **Auto-seal (`sodoto/auto-seal`)** — policy item 5 already finds and verifies the mentor's badge; it now records what it found as `qualifiedBy` instead of discarding it.
- **Projector (`substrate/sodoto_projector.py`)** — add `(:Credential)-[:QUALIFIED_BY {digest}]->(:Credential)`, and mark `TAUGHT` edges that came from a verified pointer.
- **Ledger / static projection** — add the digest so downstream lookup works without Neo4j.

## Credentials already issued

The eight April credentials and everything up to v0.5 carry no pointers, and a signed credential cannot be edited. Two choices, not exclusive:

- **Leave them.** The walk stops at them with "lineage not recorded before this point". Honest, and costs nothing.
- **Lineage attestations.** The issuing NDC signs a separate small document — "credential X's mentor was qualified by credential Y, digest …" — that the walker accepts in place of an embedded pointer, shown with a different mark ("attested later"). This backfills the chain without pretending the old credentials said something they didn't.

## Failure and edge cases

- **Hint dead, no index copy** → the link shows "not reachable", with the digest, contract ID and issuer, so anyone holding a copy can complete it.
- **Hash mismatch** → shown as a broken link. The walk does not continue past it: nothing above a tampered credential can be trusted through it.
- **Mentor qualified at another NDC** → the pointer's `issuerDid` is that NDC. The link verifies cryptographically across the trust boundary; whether a verifier *trusts* that NDC is policy, shown as the issuer's name and seal.
- **Several mentors across gates** → several parents; the view branches.
- **Mentor's credential withdrawn later** → there is no revocation today. If one is added, the walker checks it at each link and shows "withdrawn after issue", which does not retroactively void the descendants — they were taught while the mentor was qualified.
- **Cycles** → impossible with honest timing (check 5), caught by the visited set regardless.

## What to build, in order

1. Founding statement: format, signing panel, one per demo skill.
2. Issuer: find and verify the mentor's badge; embed `qualifiedBy`; v0.6.
3. Badge plugin: Lineage row, walker, chain view (the demo is the reference).
4. Ledger digest column, then static projection, for downstream lookup.
5. Projector `QUALIFIED_BY`.
6. Auto-seal records `qualifiedBy` (when auto-seal is built).
7. Lineage attestations for legacy credentials, if wanted.

## Open decisions (for Marc)

1. **Skill families.** Can an EIP Expert mentor qualify an EIP Basic learner? If yes, the skill check becomes "same skill or a skill listed as covering it", and the covering list needs a home.
2. **Which gates need a qualified mentor.** All three (proposed), or only See One and Do One, with Teach One's verifier allowed to be any credential holder?
3. **Blocking.** Should a missing qualification *block* full issuance (proposed, matching auto-seal), or issue v0.5 with a warning?
4. **Legacy credentials.** Leave them, or backfill with NDC lineage attestations?
5. **Downstream display.** Show descendants by name on the badge, or only a count with names on click? Names are public on portfolios already; a count is quieter.
6. **Founding statement authority.** Signed by the NDC key alone, or co-signed by the founders?

## Future (pending): explore the network from a badge

Marc's direction: someone viewing a badge should be able to go past its own chain and explore the credentialling network around it — ask the graph questions such as who else this mentor taught, how far a skill has travelled from its founders, or where it stopped. The natural engine is the Neo4j teaching graph the projector already builds.

Pending on one problem: **standing up Neo4j on a public server.** Today Neo4j runs only on the Desktop Substrate, and WikiCafe has no Neo4j (Layer 1 exists precisely so the site works without it). Before this feature can be built, that needs a decision on hosting, cost, who operates it, and how a public read-only query endpoint is protected (read-only credentials, query timeouts and limits, no write paths).

The rule that governs it is already settled: the graph is a lens, never a source of truth. A query result can suggest where to look; anything the badge *asserts* is still verified against the signed credentials, link by link, as in this spec. The `QUALIFIED_BY` edges added to the projector are what make the graph's answers checkable that way.

A smaller step that needs no server: canned explorations over the Layer 1 static projection (the same folder the table and map already read), for the few questions people ask most.

## Relationship to the other pieces

- **Auto-seal spec** — this spec keeps what the auto-seal policy's qualification check discovers. The governing rule — verify the badge, never trust the index — is the same rule applied to downstream lookup.
- **Teaching graph** — stays a lens. With pointers, its lineage edges become checkable against the badges instead of merely derived from them.
- **Self-custody identity** — lineage is only as good as one-person-one-DID. The registry now refuses duplicate DIDs; the DID-linking design (previous DIDs, old key signs new) is what lets a lineage survive a person re-minting their key.
- **CfA-dSC and the three currencies** — out of scope. A lineage is the natural carrier for commons-debt flows, but nothing here depends on them.

Marc Pierson and Claude Opus 5.5 · September 2026
