# SODOTO — Claude Code Onboarding Context
## ReLocalize Creativity Network
### Updated April 8, 2026

---

## What This Document Is

Everything Claude Code needs to continue SODOTO development. It covers what was designed, what was built, what files exist in `~/rcn`, and exactly where to pick up.

---

## What SODOTO Is

**See One, Do One, Teach One** — a federated apprenticeship credentialing system for RCN practitioners. It issues W3C Verifiable Credentials (signed JWTs) through a three-gate process:

- **SeeOne** — the learner observed a skilled practitioner
- **DoOne** — the learner performed the skill under a mentor's witness
- **TeachOne** — the learner successfully taught the skill to someone else

Credentials are issued by NDC organizations (not individuals), rendered as badges inside FedWiki pages via a custom `sodoto-badge` plugin, and verifiable entirely in the browser — no server call, no blockchain.

---

## Current State (as of April 8, 2026 session)

### What works
- **8 credentials issued, all cryptographically valid** — verify button passes in browser
- **Persistent keys on disk** — `~/rcn/veramo/` rebuilt and committed (except keys.json)
- **5 NDC issuers registered** with branding in both plugin locations
- **Marc's portfolio** has 8 badges, all verify-button valid
- **Teaching chain documented**: Kerry → Marc (CLD), Marc → 5 students (CLD)
- **Plugin installed** in both `~/.wiki/localhost/assets/` and `~/node_modules/`

### Issued credentials

| Credential | Issued | Issuer |
|---|---|---|
| Causal Loop Diagramming | 2025-12-10 | RCN |
| e-VSM Basic | 2026-01-15 | RCN |
| e-VSM Intermediate | 2026-02-10 | RCN |
| e-VSM Site Manager | 2026-03-05 | RCN |
| EIP Basic | 2026-01-20 | RCN |
| EIP Intermediate | 2026-02-18 | RCN |
| EIP Expert | 2026-03-20 | RCN |
| Stock and Flow Diagramming | 2026-01-08 | RCN |

### Key DIDs
- **RCN issuer**: `did:key:z6MkrpszcAgGXVm3svfuVL35xfPgncW77Ev15JGnE7YR7V64`
- **Marc holder**: `did:key:z6MkozBoq41VqSMQVvzunaCcqFbUmG531deb2SjTDNb2Qswb`
- **Kerry**: `did:key:z6Mkr8Xwq2GdTKMUzrkHyizSsCVUcCvG3WqjF6sJ2nweMPZ2`
- **Noah**: `did:key:z6MkmsryVRZGZuiCp4wwo5UgszvaunmH9ukLvUkgzyy1MrJe`

Full DID set (all 5 NDC issuers + all people) in `~/rcn/veramo/dids.json`.

### Known gaps
- e-VSM, EIP, and SFD credentials have **single clean-pass gate histories** — real multi-attempt histories needed when actual dates and mentors are available. Marc's CLD credential is the reference (two-attempt histories per gate).
- Marlowe contract source file (`sodoto-mutual-certification.marlowe`) not on disk.
- Design docs (SODOTO-Attestation-Model.md etc.) not on disk — content preserved in conversation history.
- `cfa-dsc-schema.json` not yet in `~/rcn`.

---

## File Map

### Committed to ~/rcn git repo
```
~/rcn/
  veramo/
    keys.json         ← LOCAL ONLY, gitignored, private keys for 5 NDCs + Marc, Kerry, Noah
    dids.json         ← committed, public info only
    people.json       ← committed, embedding-ready name/did/portfolio records
    credentials/      ← committed, all 8 signed credential JSON files
  SODOTO-CLAUDE-CODE-CONTEXT.md  ← this file
  .gitignore          ← keys.json excluded
```

### Present but not yet committed to ~/rcn
```
~/rcn/
  wiki-plugin-sodoto-badge/   ← not yet staged
```

### Also present (not in ~/rcn)
```
~/.wiki/localhost/
  assets/wiki-plugin-sodoto-badge/client/sodoto-badge.js
  pages/marc-pierson-sodoto-portfolio      ← 8 badges, real JWTs, v0.3 format
  pages/kerry-turner-sodoto-portfolio
  pages/noah-williams-sodoto-portfolio
  pages/rcn-sodoto-ledger
~/node_modules/wiki-plugin-sodoto-badge/
```

---

## Credential Format: v0.3 (fully implemented)

Marc's CLD credential in `~/.wiki/localhost/pages/marc-pierson-sodoto-portfolio` is the reference implementation. Key structure:

- Gates use `attempts[]` arrays — each attempt has `date`, `mentor` object, `mentorAssertion`, `learnerAssertion`, `outcome`, `narrative`
- `outcome` values: `complete` | `ended` (failed/incomplete)
- `narrative` is a FedWiki page slug linking to the attempt record
- TeachOne adds `evidencedBy` (student's DoOne page slug) and `student` object per attempt
- Top-level `mentor` field on each gate records the final passing mentor

### Next: v0.4 (planned)
- **Learner JWT** — learner cryptographically acknowledges each passing attempt
- **Student JWT** — student signs affirmation + debt creation at TeachOne
- **Debt record** created in Neo4j when TeachOne passes

---

## NDC Issuers (5 registered)

All five have Ed25519 key pairs in `~/rcn/veramo/keys.json` and are registered in the plugin ISSUER_REGISTRY with seal branding.

| NDC | Location |
|-----|----------|
| ReLocalize Creativity Network | Bellingham WA |
| Columbia Valley NDC | Whatcom County WA |
| The Fledge | Lansing MI |
| Leo's | (placeholder) |
| Kula | (placeholder) |

---

## Skills Registry

### Issued (8)
- Causal Loop Diagramming ✓
- e-VSM Basic ✓
- e-VSM Intermediate ✓
- e-VSM Site Manager ✓
- EIP Basic ✓
- EIP Intermediate ✓
- EIP Expert ✓
- Stock and Flow Diagramming ✓

### Not yet issued (23)
Stock Flow Modeling, System Dynamics Modeling, VSM, EIP Stage Sketching, Six Context Questions, Social Action Tetrahedron (PIOA), Social System Tetrahedron (BGTE), Cynefin, 15 Ps, Process Mapping, Linkage Mapping, Value Stream Mapping, A3 Problem Solving, Bayesian Belief Modeling, Vester's Sensitivity Systems Modeling (nine interacting skills — credential cluster design needed), Object Process Methodology (OPM/OPCloud), Model-based System Engineering, Persistent Syntegrating, DSRP, Story Mapping, Pattern Writing, Ganz Organizing Story Sequence, FedWiki, Campfire Conversation/Cave Drawing Set, Arrows Diagram/GraphViz, Neo4j, Tom Sawyer Perspective, Conversation Taxonomy, Local Newspaper in FedWiki

---

## FedWiki Plugin: sodoto-badge

- File: `~/.wiki/localhost/assets/wiki-plugin-sodoto-badge/client/sodoto-badge.js`
- Renders skill name, issuer seal, gate completion dates, mentor names (clickable), attempt history table
- Verify button: extracts public key from issuer DID string, verifies JWT using Web Crypto API — entirely in browser
- Status: **fully working**, all 8 badges verify clean

---

## CfA-dSC Integration (March 2026 — designed, not yet in ~/rcn)

The dSC is the economic record layer; the CfA state machine is the governance layer. Each CfA state transition writes to the dSC record. Three-currency settlement: fiat + time + gift. Signed JSON via Veramo/Ed25519 — no blockchain. Schema (`cfa-dsc-schema.json`) needs reconstruction and committing to `~/rcn`.

---

## Where to Pick Up

1. **Real gate histories** — replace single clean-pass attempts in e-VSM, EIP, SFD credentials with actual dates and mentors when available.
2. **FedWiki portfolio pages** — create holder portfolio pages for each credential, parallel to Marc's structure.
3. **v0.4** — learner JWT, student JWT, Neo4j debt record on TeachOne completion.
4. **cfa-dsc-schema.json** — reconstruct and commit to `~/rcn`.

---

## Key Design Decisions (Do Not Revisit Without Good Reason)

- `did:key` not did:web — public key self-contained in DID string
- Ed25519 via Veramo — proven working, no blockchain
- Signed JSON not Marlowe for economic settlement — Marlowe for process governance only
- No monetary payment in SODOTO contract — three-party confirmation IS the authorization
- FedWiki as primary UI — badges live in wiki pages
- Neo4j for graph relationships

---

## Naming

- Credentialing system: **SODOTO**
- Survey/diagnostic tool: **e-VSM** (SOFI / SOFI-VSM retired — do not use)

---

*Last updated: April 8, 2026 — 8 credentials issued, keys persistent, plugin registry complete.*
