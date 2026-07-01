# SODOTO Docker Deployment

Three containers: `sofi-proxy` (Python, port 8765), `fedwiki` (Node, port 3000), `caddy` (HTTPS, ports 80/443).

## Prerequisites

- Docker + Docker Compose v2
- Two DNS A records pointing to the server's public IP

## Steps

### 1. Clone the repo

```bash
git clone <rcn-repo-url> rcn
cd rcn/deploy/docker
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:
- `ANTHROPIC_API_KEY` — your Anthropic key
- `SODOTO_PROXY_SECRET` — generate with `openssl rand -hex 32`

### 3. Set your domains

Edit `Caddyfile` — replace both `example.com` domains with your real ones:

```
sodoto.yourcafe.net { ... }
wiki.yourcafe.net   { ... }
```

### 4. Migrate wiki data (if you have existing pages)

```bash
# From the machine where you already have wiki data:
rsync -avz ~/.wiki/ user@server:~/.wiki-import/

# On the server, copy into the Docker volume after first boot:
docker compose up -d fedwiki
docker cp ~/.wiki-import/. $(docker compose ps -q fedwiki):/root/.wiki/
docker compose restart fedwiki
```

Or just let FedWiki start fresh — pages will be created on demand by the issuer tool.

### 5. Configure the issuer tool

Edit the three-line config block at the top of `tools/sodoto-issuer.html`:

```js
const PROXY        = 'https://sodoto.yourcafe.net'
const WIKI_SITE    = 'localhost'
const PROXY_SECRET = 'the-secret-from-your-.env'
```

`WIKI_SITE` stays `'localhost'` — that's the FedWiki site directory name on disk.

### 6. Start everything

```bash
docker compose up -d --build
docker compose logs -f    # watch for errors
```

Caddy will obtain TLS certs automatically on first HTTPS request (requires DNS to be live).

## Ports summary

| Service     | Internal port | Exposed via Caddy              |
|-------------|---------------|--------------------------------|
| sofi-proxy  | 8765          | `sodoto.yourcafe.net`          |
| fedwiki     | 3000          | `wiki.yourcafe.net`            |
| caddy       | 80 / 443      | public                         |

sofi-proxy and fedwiki are **not** exposed directly — all traffic goes through Caddy.

## Private keys

Keys are never in the container. Each issuer enters their 64-char hex seed in their own browser at signing time. Store keys in a password manager or macOS Keychain.

## Updating

```bash
git pull
docker compose up -d --build
```

Wiki data persists in the `wiki-data` Docker volume across rebuilds.
