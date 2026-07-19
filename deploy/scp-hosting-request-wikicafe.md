# RCN Shared Care Plan — Hosting Request

**To:** Christian, Wiki Café  
**From:** Marc Pierson, ReLocalize Creativity Network  
**Date:** July 18, 2026

---

Thank you for getting back to me. I appreciate your willingness to look at this.

I am asking Wiki Café to host two RCN services: the Shared Care Plan (this document) and SODOTO, our skill credentialing system (see companion document). Both would run on the same server. I have sent a separate document for each.

---

## Shared Care Plan (SCP)

The Shared Care Plan is a person-controlled health record used by Community Health Workers and their clients. It runs on FedWiki — which you are already familiar with — extended with 19 custom plugins for structured health data: medications, vitals, diagnoses, care team, and so on.

The first live users will be a CHW and her clients in Superior, AZ.

---

## What it runs

Three containers alongside the existing Caddy setup you likely already have:

| Container | What it does |
|-----------|-------------|
| **FedWiki** | Hosts patient health record pages (custom SCP plugins pre-installed) |
| **Groove** | Collaborative workspace for CHW + client sessions |
| **sofi-proxy** | Serves browser tools and handles FedWiki write API calls |

Patient data lives in Docker volumes — completely separate from the software. Software updates never touch data.

---

## What I provide

- Pre-built Docker images on GitHub Container Registry (`ghcr.io/marpie1/rcn-scp-*`)
- `docker-compose.yml`, `Caddyfile`, `.env.example`, and a sysadmin README
- All future updates pushed by me — one command to apply on your end

---

## What I need from you

1. **Three subdomains** pointing to the server — for example:
   - `wiki.ndcgroup.relocalizecreativity.net`
   - `groove.ndcgroup.relocalizecreativity.net`
   - `proxy.ndcgroup.relocalizecreativity.net`

2. **A secret passphrase** — generate with `openssl rand -hex 32` and send it to me. I configure the browser tools with it on my end. (One passphrase covers both SCP and SODOTO if deploying together.)

3. **Confirmation** that Docker Compose v2 is available on the server.

---

## Deploying

Once I have the domain names and passphrase, I send you four files. Your sysadmin:

1. Fills in the `.env` (domain names + the passphrase)
2. Runs `docker compose up -d`

Caddy handles TLS automatically. Estimated time once DNS is live: 15 minutes.

**Future updates:**
```
docker compose pull && docker compose up -d
```

---

Please let me know if you have questions. Happy to jump on a call if that is easier.

**Marc Pierson**  
ReLocalize Creativity Network  
Bellingham, WA
