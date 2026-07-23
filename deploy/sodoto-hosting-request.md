# RCN SODOTO Credential System — Hosting Request

**To:** Jerry Norris and team, The Fledge  
**From:** Marc Pierson, ReLocalize Creativity Network  
**Date:** July 18, 2026

---

## What I am asking

I would like The Fledge to host the RCN SODOTO credential system on the same server as the Shared Care Plan (see companion document). These are two separate services — they run independently but share the same server.

---

## What it is

SODOTO stands for **See One, Do One, Teach One** — the classic apprenticeship sequence used in medicine and trades. It is RCN's system for issuing and verifying skill credentials across the NDC network.

When someone learns a skill at one NDC, a credentialed instructor issues them a digitally signed badge. That badge lives in a FedWiki portfolio page. Anyone can verify it in a browser with no server call — the math is in the badge itself. When that person later teaches someone else, they become an issuer in turn.

The credential is signed by the issuer in their own browser. The private key never touches the server. The server only stores the resulting badge — it cannot forge or alter credentials.

---

## What you would be running

Three lightweight services, all packaged as Docker containers:

| Service | What it does |
|---------|-------------|
| **FedWiki** | Hosts credential portfolio pages for learners and instructors |
| **Proxy** | Serves the issuer tool and handles FedWiki write calls |
| **Caddy** | Manages HTTPS and routes web traffic |

---

## What I need from you

**1. The same Linux server as the Shared Care Plan**  
SODOTO runs alongside SCP on the same server. No additional hardware needed.

**2. Two domain names**  
Two subdomains pointing to the same server. Examples (you choose the actual names):  
- `sodoto.fledge.ndcgroup.net` — the issuer tool and API
- `wiki.fledge.ndcgroup.net` — the FedWiki credential portfolios

**3. A secret passphrase**  
Same process as SCP — one terminal command, send me the result. (If you are deploying both services at the same time, one passphrase covers both.)

---

## What I provide

- Pre-built Docker images hosted on GitHub
- Four configuration files your sysadmin drops on the server
- Step-by-step README — deploy is about 15 minutes once DNS is live
- All future updates pushed by me — one command to apply them

---

## What your sysadmin does

**Initial deploy (one time):**
1. Copy four files to the server
2. Fill in five values in a config file (the two domain names, an email address, an API key I provide, and the passphrase)
3. Run: `docker compose up -d`

**For every software update I push:**
```
docker compose pull && docker compose up -d
```

---

## Security note — private keys

This is worth understanding because it is deliberately designed.

When an instructor issues a credential, they type their private key seed into the issuer tool in their own browser. It is used once to sign the credential and immediately cleared — it is never sent to the server and never stored anywhere on the server. Each instructor keeps their own key in a password manager.

This means: **even if your server were compromised, no private keys could be stolen from it.** The server holds only the signed badges, which are designed to be public.

---

## Data

- Credential portfolio pages are plain JSON text files — very small
- They live in a Docker volume on your server
- Backups are straightforward — one command exports the volume to a file
- I do not have access to data on your server

---

## Relationship to the Shared Care Plan

SODOTO and SCP run independently. A CHW might hold SODOTO credentials that qualify them to use the SCP system, but the two services do not talk to each other. They share the same server for convenience, not because they are coupled.

---

## Next step

If you are willing, have your sysadmin reply with:
1. The two domain names you would like to use
2. The generated passphrase — if deploying both SCP and SODOTO together, one passphrase works for both: `openssl rand -hex 32`

I will send the deployment files for both services together.

Thank you.

**Marc Pierson**  
ReLocalize Creativity Network  
Bellingham, WA
