# RCN Deployment — Overview

This folder contains deployment artifacts for two RCN systems: **SCP + Groove** (Shared Care Plan) and **SODOTO** (credential issuance). They are deployed independently and may go to different hosting providers.

---

## SCP + Groove

### Standalone GitHub repo (primary — what was given to Wiki Café)

**Repo:** https://github.com/marpie1/rcn-scp  
**Companion:** https://github.com/marpie1/rcn-groove

This is the self-contained deployment package. A sysadmin clones it directly — they do not need the `rcn` repo. It builds images from source on the server and seeds 13 blank patient pages on first start.

**Sysadmin workflow:**
```bash
git clone https://github.com/marpie1/rcn-scp.git
cd rcn-scp
cp .env.example .env   # set ANTHROPIC_API_KEY
docker compose up --build
```

Services: FedWiki (port 3000), Groove (port 3001), proxy (port 8765).

This is what Christian at Wiki Café was given access to.

---

### `deploy/scp/` (production wrapper — Caddy + GHCR images)

A second approach built July 2026 for deployments that need HTTPS and domain routing. Uses pre-built images from GHCR instead of building from source. Intended for hand-off to sysadmins who do not have GitHub access.

**Sysadmin workflow:**
```bash
cp .env.example .env   # fill in domain names + secrets
docker compose up -d   # pulls images from ghcr.io/marpie1/rcn-scp-*
```

Services: FedWiki, Groove, sofi-proxy, Caddy (handles HTTPS automatically).

**To update images after pushing new code to GitHub:**
```bash
docker compose pull && docker compose up -d
```

**Contents:**
- `docker-compose.yml` — references `ghcr.io/marpie1/rcn-scp-*` images
- `Dockerfile.fedwiki`, `Dockerfile.groove`, `Dockerfile.sofi-proxy` — for Marc to rebuild images
- `Caddyfile` — reads domain names from `.env`
- `.env.example` — template (6 values to fill in)
- `README.md` — full sysadmin instructions

---

### Hosting request documents

| File | For |
|------|-----|
| `scp-hosting-request.md` | Jerry Norris, The Fledge (Lansing MI) |
| `scp-hosting-request-wikicafe.md` | Christian, Wiki Café |

---

## SODOTO

### `deploy/docker/` (Docker — what was given to Wiki Café)

Self-contained Docker Compose package. Three containers: sofi-proxy, FedWiki, Caddy.

**Sysadmin workflow:**
```bash
cp .env.example .env   # set domains + secrets
docker compose up -d --build
```

See `deploy/docker/README.md` for full instructions.

**Note:** The `docker-compose.yml` here still uses `build:` context (builds from source). If the sysadmin is pulling pre-built images, this needs to be updated to use `image:` references — the same fix that was applied to `deploy/scp/docker-compose.yml`.

---

### `deploy/README.md` (this file — Mac Mini launchd, outdated)

The original Mac Mini deployment used macOS launchd agents (`org.rcn.fedwiki.plist`, `org.rcn.sofi-proxy.plist`) instead of Docker. This approach was superseded by the Docker packages above. The launchd plists are kept for reference but are not the current deployment path.

---

### Hosting request documents

| File | For |
|------|-----|
| `sodoto-hosting-request.md` | Jerry Norris, The Fledge (Lansing MI) |
| `sodoto-hosting-request-wikicafe.md` | Christian, Wiki Café |

---

## Summary

| System | Current deployment | Sysadmin gets |
|--------|-------------------|---------------|
| SCP + Groove | `marpie1/rcn-scp` GitHub repo | GitHub access + clone instructions |
| SCP + Groove (alt) | `deploy/scp/` | 4 files + fill in `.env` |
| SODOTO | `deploy/docker/` | Folder contents + fill in `.env` |

The GitHub repo approach (`marpie1/rcn-scp`) and the `deploy/scp/` approach produce the same running system via different paths. Wiki Café is using the GitHub repo approach.
