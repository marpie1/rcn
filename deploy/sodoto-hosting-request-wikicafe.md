# RCN SODOTO Credential System — Hosting Request

**To:** Christian, Wiki Café  
**From:** Marc Pierson, ReLocalize Creativity Network  
**Date:** July 18, 2026

---

This is the companion document to the Shared Care Plan hosting request. Both services would run on the same server.

You may already have an earlier version of the SODOTO deployment files — this supersedes anything previously sent.

---

## SODOTO

SODOTO (See One, Do One, Teach One) is RCN's skill credentialing system. Instructors issue digitally signed badges to learners. Badges live in FedWiki portfolio pages and are verifiable in any browser with no server call. Private keys never touch the server — each instructor signs in their own browser.

---

## What it runs

Two containers alongside Caddy:

| Container | What it does |
|-----------|-------------|
| **FedWiki** | Hosts credential portfolio pages |
| **sofi-proxy** | Serves the issuer tool and handles FedWiki write API calls |

---

## What I provide

- Pre-built Docker images on GitHub Container Registry (`ghcr.io/marpie1/rcn-scp-proxy`, `ghcr.io/marpie1/rcn-sodoto-wiki`)
- `docker-compose.yml`, `Caddyfile`, `.env.example`, and a sysadmin README
- All future updates pushed by me

---

## What I need from you

1. **Two subdomains** pointing to the server — for example:
   - `sodoto.ndcgroup.relocalizecreativity.net`
   - `wiki-sodoto.ndcgroup.relocalizecreativity.net`

2. **A secret passphrase** — `openssl rand -hex 32`. If deploying SCP and SODOTO together, one passphrase covers both.

---

## Deploying

Same process as SCP — four files, fill in `.env`, run `docker compose up -d`.

---

**Marc Pierson**  
ReLocalize Creativity Network  
Bellingham, WA
