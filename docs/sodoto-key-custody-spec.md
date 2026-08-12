# SODOTO — Key Custody: Passphrase-Encrypted Seed (Design Note)

Status: draft, for later · August 12 2026 · internal engineering design note

## Problem

Today a learner's private key (the Ed25519 seed) lives in browser `localStorage` and is backed up only by a 64-hex "recovery key" the user is told to save. `localStorage` is device-, browser-, and origin-bound and fragile (cleared by wiping site data, gone on a new device or a different browser, wiped in incognito), and it is not a secure vault. And "save this 64-hex string somewhere safe" is a poor UX for the average user. We want something a person can recover with a memorized passphrase, that works on a phone or a computer.

## Approach: passphrase-*encrypted* seed (not passphrase-*derived*)

Two candidates were weighed:

- **Passphrase-derived** — key = KDF(passphrase). Simplest mental model and nothing to store, but the identity's unforgeability becomes the passphrase's strength (offline-attackable from the public DID), it needs a deterministic salt (low-entropy or fetched), and changing the passphrase changes the DID.
- **Passphrase-encrypted seed (chosen)** — keep a strong random 256-bit key, encrypt it with the passphrase, store the ciphertext. The user still only remembers a passphrase, but the identity stays a strong random key, the passphrase can be changed without changing the DID (re-encrypt the same seed), and portability works by fetching/holding the ciphertext and decrypting.

Chosen: **passphrase-encrypted seed.** Same "just remember a passphrase" UX, without downgrading the key.

## The trilemma

You can have any two of {**convenient** (nothing to carry), **self-custodial** (no one else holds your key), **strong key** (unforgeable regardless of passphrase)} — not all three:

- Registry/portfolio + encrypted seed → convenient + strong key, **not** self-custodial (someone holds your encrypted key).
- Download + encrypted seed → self-custodial + strong key, **not** convenient (you carry the file).
- Pure passphrase-derived → convenient + self-custodial, **not** a strong key (passphrase-strength).

Because SODOTO (See One, Do One, Teach One) treats self-custody as load-bearing, we keep self-custody + strong key, and accept a small convenience cost — with an opt-in for those who want convenience instead.

## Where the encrypted blob lives — decision

- **Default: download** (self-custodial). The encrypted seed is nowhere public; an attacker must first steal the file *and* crack the passphrase. Crucially, passphrase-encryption makes the file **safe to keep in a password manager or cloud drive**, which is how most people would actually store it — so the "carry a file" burden is soft.
- **Optional: registry stash** (informed opt-in). A user may choose to store their encrypted blob in the people-registry for fetch-anywhere recovery, if they accept that the server then holds their (encrypted) key and becomes a honeypot for offline passphrase-grinding. This is a choice the user makes, not a default.
- **Never: the public portfolio page.** A FedWiki portfolio is world-readable, so a secret ciphertext there is handed to a *named* attacker for free — the worst confidentiality. (Storing a non-secret salt there would be acceptable only in the weaker derived model, which we are not using.)

Rationale: default to the self-custodial option that matches the project's principle; let convenience be an explicit, understood trade rather than a baked-in default.

## KDF and passphrase policy

- **KDF: Argon2id** (memory-hard, via a small WASM lib) so each offline guess is expensive; **PBKDF2** (native WebCrypto, zero dependency) is an acceptable weaker fallback if avoiding a WASM dependency matters more than resistance.
- **Enforce passphrase strength** (length + a strength meter). Since the ciphertext may be stored in a password manager or (opt-in) the registry, the passphrase is the last line — a weak one undoes the whole scheme.
- Encrypt with an authenticated cipher (AES-GCM or XChaCha20-Poly1305) using the KDF output as the key; store `{ kdf params, salt, iv, ciphertext }`.

## Component change-surface

Changes (the signing side only):

- **`sodoto-onboard.html`** — enter + confirm a passphrase (strength meter); generate the random seed, encrypt it, and produce the recovery blob for download (default) or optional registry stash. Replace "save this 64-hex recovery key" with "remember your passphrase (and keep this recovery file)".
- **`sodoto-sign.html`** — when the key isn't already unlocked on this device, accept a recovery file (or fetch from the registry if the user opted in) + passphrase → decrypt → sign.
- **`client/signin.js`** (wiki-security-did widget) — the same unlock path before signing the challenge.
- **Storage** — `localStorage` holds the decrypted key for the session/device as now; the durable artifact is the encrypted blob (downloaded, and optionally in the registry). Add an optional `encryptedSeed` field to the registry record for opt-in users.
- **A KDF dependency** — Argon2id WASM (or native PBKDF2).

Does **not** change (well-isolated):

- All **verification** — badge plugin, auto-seal engine, `wiki-security-did` verify core, issuer attestation checks — and the `did:key` / JWT / credential formats. The public identity and signatures are identical; only *how the signer obtains the private key on their device* changes.

## Rollout discipline

Ship as **one isolated, tested unit** — not dribbled across files — and **sequence it before wiring the ownership plugin live**, because the sign-in widget must handle the passphrase-unlock path. Its blast radius is only the signing surfaces (verification is untouched), which makes it a clean standalone increment and easy to debug in isolation.

## Open decisions

- Argon2id (WASM dependency) vs PBKDF2 (native, weaker) — pick the KDF.
- Registry opt-in: per-user authorized write of the `encryptedSeed` (the user proving their new DID to store their own blob).
- Passphrase change / rotation flow (re-encrypt the same seed; the DID is unchanged).
- Recovery-file format and whether the sign page auto-detects "no local key → prompt for file + passphrase".
