# SODOTO Deployment Handoff
**Date:** 2026-06-07  
**From:** Marc Pierson (RCN)  
**To:** Wiki Café (hosting) + Marc Pierson (issuer tool config)

---

## What is being deployed

Three Docker containers running as a single unit:

| Container | What it does |
|-----------|-------------|
| `sofi-proxy` | Serves the issuer tool at port 8765; handles all wiki write operations |
| `fedwiki` | Node.js wiki server at port 3000; hosts learner portfolios |
| `caddy` | HTTPS reverse proxy; handles TLS automatically via Let's Encrypt |

All configuration is in `deploy/docker/`.

---

## Step 1 — Wiki Café: generate a shared secret

On your server, run:

```bash
openssl rand -hex 32
```

Save the output. This is `SODOTO_PROXY_SECRET`. You will need to share it with Marc so he can bake it into the issuer tool before the first build.

---

## Step 2 — no longer needed

The issuer tool used to have the domain and secret hardcoded at the top of
`tools/sodoto-issuer.html`. It no longer does, and the secret must never be put
there — anything in that file is served to every visitor.

The tool now reads `PROXY` and `WIKI_SITE` at runtime from the proxy's `/config`
endpoint, and prompts the operator for the passphrase, which is kept in that
browser's local storage. Both come from the server's `.env`, so there is nothing
for Marc to edit between Step 1 and Step 3.

---

## Step 3 — Wiki Café: deploy

**Prerequisites:**
- Docker and Docker Compose v2 installed
- Two DNS A records pointing to the server's public IP (e.g. `sodoto.yourcafe.net` and `wiki.yourcafe.net`)
- Port 80 and 443 open in the firewall

**Steps:**

```bash
# 1. Get the repo
git clone <rcn-repo-url> rcn
cd rcn/deploy/docker

# 2. Set up environment
cp .env.example .env
```

Edit `.env`:
```
ANTHROPIC_API_KEY=sk-ant-...        ← Marc will provide this, or use your own
SODOTO_PROXY_SECRET=<from step 1>
```

```bash
# 3. Set your domains
#    Edit Caddyfile — replace both sodoto.example.com and wiki.example.com

# 4. Build and start
docker compose up -d --build

# 5. Watch for errors
docker compose logs -f
```

Caddy fetches TLS certificates automatically on the first HTTPS request. DNS must be live before this works.

**Verify it's running:**
```bash
curl https://sodoto.yourcafe.net/tools/sodoto-issuer.html   # should return HTML
curl https://wiki.yourcafe.net                               # should return FedWiki
```

---

## Step 4 — Marc: migrate wiki data (optional)

If you want to bring existing learner portfolios from your dev machine:

```bash
# On your dev machine:
rsync -avz ~/.wiki/ user@wiki-cafe-server:~/wiki-import/

# On the server, copy into the running container:
docker cp ~/wiki-import/. $(docker compose -f ~/rcn/deploy/docker/docker-compose.yml ps -q fedwiki):/root/.wiki/
docker compose -f ~/rcn/deploy/docker/docker-compose.yml restart fedwiki
```

If starting fresh, skip this — pages are created on demand when credentials are issued.

---

## Step 5 — Marc: brief the issuers

Each issuer (trainer, supervisor) needs:

1. **The issuer tool URL:** `https://sodoto.yourcafe.net/tools/sodoto-issuer.html`
2. **Their private key seed** — the 64-character hex string from `veramo/keys.json` that corresponds to their DID. They should store it in:
   - macOS Keychain (Keychain Access → New Password Item), or
   - A password manager (1Password, Bitwarden, etc.)

The key is entered manually in the browser at signing time. It is never sent to the server.

---

## Ongoing operations (Wiki Café)

**Updating to a new version:**
```bash
cd rcn
git pull
cd deploy/docker
docker compose up -d --build
```

Wiki data persists in Docker volumes — a rebuild does not affect existing pages.

**Viewing logs:**
```bash
docker compose logs sofi-proxy
docker compose logs fedwiki
docker compose logs caddy
```

**Restarting a single service:**
```bash
docker compose restart sofi-proxy
```

**Backing up wiki data:**
```bash
docker run --rm -v sodoto_wiki-data:/data -v $(pwd):/backup \
  alpine tar czf /backup/wiki-data-$(date +%Y%m%d).tar.gz /data
```
(Run from `deploy/docker/`. The volume name prefix `sodoto_` comes from Docker Compose using the directory name.)

---

## How users access the platform

| User | URL | What they do |
|------|-----|-------------|
| Issuers | `https://sodoto.yourcafe.net/tools/sodoto-issuer.html` | Run the gate-by-gate credential workflow; paste key seed to sign |
| Learners / Verifiers | `https://wiki.yourcafe.net` | View portfolio pages; badges verify client-side, no login needed |

---

## What is NOT on the server

- Private key seeds — each issuer keeps their own, entered in their browser only
- Anthropic API keys — in `.env` only, never in the image or git
- The `veramo/keys.json` file from the dev machine — excluded via `.dockerignore`

---

## Questions / issues

Contact Marc Pierson at RCN.
