# SODOTO Docker Deployment

Three containers: `sofi-proxy` (Python, port 8765), `fedwiki` (Node, port 3000), `caddy` (HTTPS, ports 80/443).

Images are pre-built and published to GitHub Container Registry, so nothing is
compiled on the server. Marc pushes updates; this server pulls them.

## Prerequisites

- Docker + Docker Compose v2
- Two DNS records pointing to the server's public IP

## Steps

### 1. Get the deployment files

```bash
git clone <rcn-repo-url> rcn
cd rcn/deploy/docker
```

Only four files matter here: `docker-compose.yml`, `Caddyfile`, `.env.example`,
and this README.

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in every value. `.env` drives both the containers and the Caddyfile, so
there is no other file to hand-edit:

- `SODOTO_DOMAIN`, `WIKI_DOMAIN` — the two public hostnames
- `ACME_EMAIL` — for Let's Encrypt notices
- `PROXY_URL` — `https://` plus `SODOTO_DOMAIN`
- `WIKI_SITE` — leave as `localhost` (the FedWiki site directory on disk)
- `ANTHROPIC_API_KEY` — a key created for this server alone
- `SODOTO_PROXY_SECRET` — generate with `openssl rand -hex 32`

### 3. Migrate wiki data (if you have existing pages)

```bash
# From the machine where you already have wiki data:
rsync -avz ~/.wiki/ user@server:~/.wiki-import/

# On the server, copy into the Docker volume after first boot:
docker compose up -d fedwiki
docker cp ~/.wiki-import/. $(docker compose ps -q fedwiki):/root/.wiki/
docker compose restart fedwiki
```

Or just let FedWiki start fresh — pages will be created on demand by the issuer tool.

### 4. Start everything

```bash
docker compose pull
docker compose up -d
docker compose logs -f    # watch for errors
```

Caddy will obtain TLS certs automatically on first HTTPS request (requires DNS to be live).

## The operator passphrase

`SODOTO_PROXY_SECRET` guards the operator-only API endpoints — the patient
registry, patient provisioning, and badge writes. Patient-facing tools do not
use it and their users never need it.

The proxy never serves this value. Operators open the issuer tool or the patient
admin tool, are prompted once, and the passphrase is kept in that browser's local
storage. If it is ever rotated, the tools prompt again on the next 401.

`GET /config` is unauthenticated and deliberately carries only non-secret values.

## Ports summary

| Service     | Internal port | Exposed via Caddy   |
|-------------|---------------|---------------------|
| sofi-proxy  | 8765          | `SODOTO_DOMAIN`     |
| fedwiki     | 3000          | `WIKI_DOMAIN`       |
| caddy       | 80 / 443      | public              |

sofi-proxy and fedwiki are **not** exposed directly — all traffic goes through Caddy.

## Private keys

Keys are never in the container. Each issuer enters their 64-char hex seed in their own browser at signing time. Store keys in a password manager or macOS Keychain.

## Updating

```bash
docker compose pull
docker compose up -d
```

Wiki data persists in the `wiki-data` Docker volume across image updates.
