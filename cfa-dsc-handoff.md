# CfA-dSC Handoff for Claude Code
*ReLocalize Creativity Network — April 2026*

## What This Is

A **Dyadic Smart Contract (dSC)** system that integrates Fernando Flores' Conversations for Action (CfA) state machine with a three-currency settlement model (fiat / time-dollars / gift). The canonical example is a **Community Health Worker (CHW) contracting with a patient**.

This is part of the broader RCN tool stack. The dSC system connects to Veramo (DID/credential signing), Neo4j (graph storage), and FedWiki (human-readable contract pages per party).

---

## Directory Structure (on Marc's Mac)

```
~/veramo-rcn/          # Veramo agent, DID store, signing scripts
  agent.js             # Veramo agent configuration
  create-did.js        # Script: create a new did:key identity
  sign-contract.js     # Script: sign a contract JSON file with Ed25519

~/rcn/                 # Main RCN project (Claude Code home)
```

Files built in prior sessions (may need to be located or reconstructed):
- `cfa-dsc-creator.html` — single-file contract creation UI (was in outputs)
- `cfa-dsc-schema.json` — JSON schema v0.1 for the combined CfA-dSC document
- `cfa-dsc-validator/` — TypeScript library (25 tests passing)
  - `src/types.ts`
  - `src/transitions.ts`
  - `src/validator.ts`
  - `src/settlement.ts`
  - `src/index.ts`
  - `src/validator.test.ts`

---

## The Three-Currency Model

A contract specifies acceptable payment ranges across three currencies:

| Currency | Field | Notes |
|----------|-------|-------|
| Fiat (USD) | `fiat_min_usd` | Floor — always required |
| Time-dollars | `time_max_pct` | Ceiling as % of total; parties assess liquidity risk themselves |
| Gift | `gift.type` | `unconditional` or `conditional`; has a `direction` (performer→customer or customer→performer) |

**CHW example contract:**
- Total value: $100
- Fiat floor: $50
- Time: max 25% (1 hour @ $25/hr exchange rate)
- Gift: $25 unconditional, direction performer→customer (fee reduction)

Gift flows *from* CHW *to* patient here — the inverse of SODOTO where the learner gifts acknowledgment to the mentor. The `direction` field handles both cases.

**Design decision:** The platform does not enforce a network liquidity threshold for time-dollars. Parties assess that risk themselves. The UI may display current NDC time-dollar membership count as information only.

---

## The CfA State Machine

States: `initiated → negotiating → contracted → performing → satisfied`

Branch states: `cancelled`, `breakdown`, `renegotiating`, `dissatisfied`

Key rules:
- **CCS+T** (Conditions of Satisfaction + Time) is a hard gate — no CfA without it. Set in prior Conversation for Possibility.
- **SBU** (Shared Background of Understanding) is a soft gate — can be `confirmed`, `developing`, or `absent`. `developing` is acceptable if both parties explicitly acknowledge the gap.
- History entries are append-only, each signed with the actor's DID.
- `revise_contract` moves require dual signature and carry `amended_payment_spec` or `amended_conditions`.

---

## The JSON Schema (v0.1)

Key top-level fields:
```json
{
  "id": "urn:uuid:...",
  "version": "0.1",
  "type": ["VerifiableCredential", "DyadicSmartContract", "ConversationForAction"],
  "parties": { "customer": {...}, "performer": {...} },
  "preconditions": {
    "shared_background_of_understanding": { "status": "developing|confirmed|absent", "attestation": {...} },
    "conditions_of_satisfaction": { "met": true, "description": "...", "deadline": "...", "attestation": {...} }
  },
  "payment_spec": {
    "total_value_usd": 100,
    "fiat_min_usd": 50,
    "time_max_pct": 25,
    "fiat_per_hour": 25,
    "gift": { "type": "unconditional", "amount_usd": 25, "direction": "performer_to_customer" }
  },
  "cfa_state": {
    "current": "negotiating",
    "history": [ { "state": "...", "actor": "did:key:...", "timestamp": "...", "move": "...", "signature": "..." } ]
  },
  "settlement": null,
  "context_refs": [],
  "proof": { "type": "Ed25519Signature2020", "signatories": [...] }
}
```

`settlement` is null until satisfied. When resolved it carries the three-currency breakdown and both signatures — at that point the document becomes a settlement credential.

`context_refs` at the top level links to prior CfT/CfP artifacts (FedWiki pages). Per-move `conversation_ref` fields in history link to artifacts produced *during* the CfA.

---

## Veramo DIDs (on Marc's Mac)

Four persistent identities in `~/veramo-rcn`:

| Alias | DID |
|-------|-----|
| Patient A | (retrieve from `~/veramo-rcn` agent) |
| CHW Bellingham / Community Health Worker A | `did:key:z6MkjUQMCEXs71me52fFpPx8xpR6soCYef4mnUm4diAhsvYY` |
| (two others) | (retrieve from agent) |

**Known loose end:** The performer DID `z6MkjUQMCEXs71me52fFpPx8xpR6soCYef4mnUm4diAhsvYY` was created with alias "CHW Bellingham" but the contract creator UI used "Community Health Worker A". The signature is cryptographically valid (tied to the DID, not the alias), but the alias should be reconciled. Options:
1. `node ~/veramo-rcn/create-did.js "Community Health Worker A"` — new DID with matching alias
2. Update the existing alias in the Veramo database

---

## Neo4j Graph Structure

Nodes: `Party`, `Contract`  
Relationships: `(Party)-[:CUSTOMER_IN]->(Contract)`, `(Party)-[:PERFORMER_IN]->(Contract)`

Two test contracts may exist in the graph from the March session:
- `urn:uuid:224d434a-...` (March 22) — the main test contract
- `urn:uuid:e7dc51db-...` (March 23) — created during UI testing, can be deleted

To delete the test contract:
```cypher
MATCH (c:Contract {id: "urn:uuid:e7dc51db-a847-4246-9a65-247e619603ab"})
DETACH DELETE c
```

---

## FedWiki Integration

Each finalized contract produces two FedWiki pages — one per party — giving each their own view of the shared contract. Pages cross-reference each other ("View from Community Health Worker A"). Both were loading correctly at end of the March 24 session.

---

## What Was Working at End of March 24 Session

- State machine spec (full written spec)
- JSON schema v0.1
- Contract creator UI (HTML, single file) — produces valid contract JSON with base64 share links
- Veramo agent with four persistent DIDs
- Signing script — replaces `[pending: sign with Veramo]` placeholders with real Ed25519 proof values
- TypeScript validator library — 25 tests passing
- Neo4j finalize endpoint — stores contract and creates Party/Contract nodes
- FedWiki pages — both party views loading

---

## What Was NOT Yet Built

- **Verification script** — takes a fully signed contract, extracts the signing payload, confirms each proof value against the DID's public key. This is the stated next step.
- SODOTO credential issuance for dSC-related roles (e-VSM Basic, e-VSM Intermediate, etc.) — separate task but related infrastructure.
- Hosting `cfa-dsc-creator.html` on `relocalizecreativity.net` so share links work without both parties having the file locally.
- DID registry in Neo4j or FedWiki — so the contract creator can do name lookup rather than requiring manual DID paste.

---

## Suggested First Action for Claude Code

```bash
cd ~/rcn
ls ~/veramo-rcn/
```

Confirm what files are present, then locate or reconstruct `cfa-dsc-validator/` and `cfa-dsc-schema.json` in the project. Build the verification script as the next logical step: take a signed contract JSON, extract the payload, verify each Ed25519 signature against its DID's public key.
