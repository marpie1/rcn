# RCN Shared Care Plan — Hosting Request

**To:** Jerry Norris and team, The Fledge  
**From:** Marc Pierson, ReLocalize Creativity Network  
**Date:** July 18, 2026

---

## What I am asking

I would like The Fledge to host the RCN Shared Care Plan (SCP) system. This is one of the core tools we are building for NDC neighborhoods, and having it hosted by a community we trust matters to me.

The first live users will be a Community Health Worker and her clients in Superior, AZ. The Fledge hosting it would be a meaningful act of mutual support between two NDCs in the network.

A companion document covers SODOTO — RCN's skill credentialing system. Both services would run on the same server. They are independent and described separately.

---

## What it is

The Shared Care Plan is a person-controlled health record. A Community Health Worker and their client use it together — during home visits and between them — to track medications, symptoms, vitals, care team, upcoming steps, and health history. The person whose health it is controls who can see their record.

It runs as a small set of web services on a Linux server. There is no proprietary software involved. Everything is open source.

---

## What you would be running

Four lightweight services, all packaged as Docker containers:

| Service | What it does |
|---------|-------------|
| **FedWiki** | Hosts the health record pages for each patient |
| **Groove** | Collaborative workspace where CHW and client work together |
| **Proxy** | Handles API calls and serves the browser tools |
| **Caddy** | Manages HTTPS and routes web traffic |

Patient data is stored in isolated data volumes on your server — completely separate from the software. When I push a software update, your server pulls the new version and restarts. Patient data is never touched.

---

## What I need from you

**1. A Linux server**  
Any standard VPS (Virtual Private Server) running Ubuntu or Debian. Docker must be available. This is a common, inexpensive setup — $10–20/month from most hosting providers.

**2. Docker and Docker Compose installed**  
These are standard tools. Most Linux servers either have them or can install them in minutes.

**3. SSH access for your sysadmin**  
Your sysadmin needs to be able to run commands on the server directly. No waiting on a third party.

**4. Three domain names**  
Subdomains pointing to the server. Examples (you choose the actual names):  
- `wiki.fledge.ndcgroup.net`  
- `groove.fledge.ndcgroup.net`  
- `proxy.fledge.ndcgroup.net`

**5. A secret passphrase**  
Your sysadmin generates one random string (one terminal command) and sends it to me. I configure the browser tools with it. This is how the tools authenticate to your server.

---

## What I provide

- Pre-built Docker images hosted on GitHub (your server downloads them — no source code needed)
- Four configuration files your sysadmin drops on the server
- A step-by-step README written for a sysadmin — deploy is about 15 minutes once DNS is live
- All future software updates pushed by me — your team just runs one command to apply them

---

## What your sysadmin does

**Initial deploy (one time):**
1. Copy four files to the server
2. Fill in six values in a config file (the three domain names, an email address, an API key I provide, and the passphrase)
3. Run: `docker compose up -d`

**For every software update I push:**
```
docker compose pull && docker compose up -d
```

That's it. Patient data is untouched.

---

## Data and privacy

- Patient data never leaves your server
- Data volumes survive software updates — nothing is overwritten
- Backing up is straightforward (one command exports the volumes to a file)
- I do not have access to patient data on your server

---

## Questions I can answer

- How much disk space? — Very little. FedWiki pages are plain JSON text files. A full patient record is a few kilobytes.
- How much RAM? — 512MB–1GB is sufficient for the pilot scale.
- Do you need to understand FedWiki or Docker? — No. The README walks through every step. If something goes wrong, send me the log output and I can diagnose it.
- What about backups? — I can add backup instructions to the README. The data volumes can be snapshotted or exported on any schedule.

---

## Next step

If you are willing, have your sysadmin reply with:
1. Confirmation that Docker is available on the server
2. The three domain names you would like to use
3. The generated passphrase (one command: `openssl rand -hex 32`)

I will configure the tools on my end and send the four deployment files with the README.

Thank you for considering this.

**Marc Pierson**  
ReLocalize Creativity Network  
Bellingham, WA
