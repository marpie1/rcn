# Shared Care Plan + Groove — Claude Code Handoff

*April 13, 2026. For pickup with `cd ~/rcn && claude`.*

---

## What This Is

Two applications, independently usable, integrated at a clean seam:

**Groove** — a recreation of Ray Ozzie's peer-to-peer collaboration workspace (Groove Networks, 2000–2005). Secure, private shared spaces for small groups. Chat, files, threaded discussion, FedWiki page import/export.

**Shared Care Plan (SCP)** — a person-controlled health record, rebuilt on FedWiki. The person of record controls all access. SCP pages are FedWiki pages with a defined structure, so they flow in and out of Groove workspaces like any other page.

The integration point: a care team (person + CHW + 1–2 family members) coordinates in a Groove workspace and shares specific SCP pages into it. Neither app requires the other to function.

---

## First Task for Claude Code

**Install and run the Groove prototype.**

1. Copy `groove-workspace.tar.gz` from this handoff to `~/rcn/`
2. Extract: `tar -xzf groove-workspace.tar.gz`
3. `cd groove-workspace && npm install`
4. `npm start`
5. Open `http://localhost:3000`

`npm install` pulls: express, sql.js, libsodium-wrappers, cors, marked, uuid, node-fetch. No native compilation — sql.js is pure WebAssembly.

---

## What's Built in the Prototype

### File structure

```
groove-workspace/
  server/
    index.js                  — Express server, sql.js init, all routes wired
    crypto/
      identity.js             — libsodium: keypairs, signing, key wrapping, encryption
    db/
      sqldb.js                — sql.js wrapper (exec/run/all/get + auto-save to disk)
      workspace.js            — workspace registry
      discussion.js           — per-discussion DB (one .db file per discussion)
      fedwiki-page.js         — imported FedWiki page storage
    routes/
      identity.js             — POST /api/identity/generate, grant, revoke, log
      discussions.js          — CRUD discussions + messages
      pages.js                — import, list, get, export FedWiki pages
    data/                     — SQLite files written here at runtime
  public/
    index.html
    css/style.css
    js/
      api.js                  — fetch wrapper for all endpoints
      identity-ui.js          — identity creation, localStorage persistence
      page-viewer.js          — renders FedWiki JSON (paragraph, markdown, image, reference)
      discussion-ui.js        — threaded messages, reply, "written by other" flag, 5s poll
      app.js                  — initialises everything, sidebar list management
```

### What works (smoke-tested)

- `GET /api/discussions` → `{"discussions":[]}`
- `POST /api/identity/generate {"displayName":"Marc"}` → full identity with Ed25519 + X25519 keypairs
- `POST /api/discussions {"name":"..."}` → creates discussion, returns id
- Discussion DB: post messages, thread by parentId, mark written-by-other
- Crypto: key generation → grant (asymmetric wrap) → open grant → encrypt/decrypt round-trip all pass

### What's not yet built

- FedWiki page import requires network access to a live FedWiki — test against `ward.dojo.fed.wiki` or the local farm at `localfedwiki.relocalizecreativity.net`
- P2P sync (Automerge) — not started; server-mode only for now
- Workspace membership UI — API exists, no frontend yet
- Access grant UI — API exists (grant, revoke, timed expiry, access log), no frontend yet
- File sharing tool
- Calendar tool

---

## Encryption Architecture

**No external identity service.** Uses libsodium directly.

Each person gets two keypairs on identity creation:
- **Ed25519** (signing) — proves authorship of messages and grants
- **X25519** (box) — used for asymmetric key wrapping

Each workspace has a **symmetric key** (XSalsa20-Poly1305 via `crypto_secretbox`). When the workspace owner grants access to another person, they encrypt the workspace key using the recipient's X25519 public key (`crypto_box` with an ephemeral sender keypair). The recipient unwraps it with their secret key. Revocation marks the grant row as revoked; timed grants include `expires_at`.

The **access log** (who accessed what, when) is stored per workspace and is readable only by the workspace owner — implementing the SCP "Who's Accessed My Plan" requirement.

**Prototype caveat:** identity secret keys are currently stored server-side for simplicity. Production moves key generation and storage to the client (browser localStorage or Electron keychain). The server never sees secret keys. This is the primary security hardening task before any real deployment.

---

## Shared Care Plan Design

### Governing rules (non-negotiable)

- Person of record controls all access — grants, revocations, timed duration
- Every entry written by anyone other than the person must be prominently marked ("written by other" flag is already in the discussion DB schema and UI)
- Physician summary printout is a first-class output — clean, designed for the doctor's workflow
- Full feature set from the original Whatcom County SCP (validated with patients including Atlanta homeless mental health cohort):
  - Care Team, About Me, Diagnoses, Next Steps, Health Log, Medications, Reactions, Medical History, Advanced Directives, Who's Accessed My Plan

### SCP as FedWiki pages

Each SCP section is a FedWiki page with a defined item structure. Example: a Medications page has `type: "medication"` items with fields for name, dose, prescriber, start date, notes. The FedWiki JSON format handles this naturally.

The page import/export in Groove already handles raw FedWiki JSON with full fidelity — pages round-trip without data loss.

### FHIR

Use FHIR R4 as the interoperability target. The SCP data model should map to FHIR resources: Patient, Condition, MedicationStatement, AllergyIntolerance, CarePlan, Consent. This is the bridge to clinical systems and future EHR integration.

---

## Integration Architecture

```
Shared Care Plan (FedWiki, health plugins, FHIR-aligned)
        ↕  import / export FedWiki JSON
Groove Workspace (care team coordination layer)
        ↕  shared identity (libsodium keypairs)
Access Registry (person-controlled grants, timed, audited)
```

SCP pages work without Groove. Groove works without SCP. When a care team member needs to reference a health record entry in a discussion, they import that page into the workspace — it appears like any other FedWiki page but carries the SCP structure.

---

## Pilot

**Superior, AZ** with Chris Casillas and the NDC group. Core care team unit: person + Community Health Worker + 1–2 family members. CHWs use phones during home visits — offline-first matters. First deployment should be server-mode (no P2P required), hosted on RCN infrastructure.

---

## Key People

| Person | Role |
|--------|------|
| Marc Pierson | Project lead, original SCP contributor |
| Chris Casillas | Superior AZ NDC, first pilot site |
| Kerry Turner | RCN co-founder |
| Ward Cunningham | FedWiki creator, community collaborator |
| Robin Asby | Metaphorum, VSM community |

---

## Suggested Next Steps (in order)

1. `npm install && npm start` — confirm it runs on your machine
2. Import a live FedWiki page — test against `http://ward.dojo.fed.wiki/welcome-visitors`
3. Create a discussion, post messages, try the "written by other" checkbox
4. Define SCP FedWiki page schemas for each section as JSON templates
5. Build the access grant UI (grant a workspace key to a second identity, verify access log)
6. Move key generation to client-side — server never holds secret keys
7. Physician summary export — PDF from the SCP page set
8. Superior AZ deployment design

---

*Prototype rebuilt April 13, 2026 from conversation history. Archive: `groove-workspace.tar.gz`.*
