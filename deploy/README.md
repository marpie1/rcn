# Mac Mini Deployment — SODOTO

## Prerequisites

```bash
# Node (for FedWiki)
brew install node

# FedWiki + badge plugin
npm install -g wiki wiki-plugin-sodoto-badge

# Caddy (reverse proxy + TLS)
brew install caddy

# Python 3 (built into macOS, already present)
```

## 1. Edit the launchd plists

In both `org.rcn.sofi-proxy.plist` and `org.rcn.fedwiki.plist`, replace:
- `USERNAME` → the Mac Mini's macOS username (e.g. `rcn`)
- `ANTHROPIC_API_KEY` value → real key
- `SODOTO_PROXY_SECRET` value → a strong random secret (e.g. `openssl rand -hex 32`)

## 2. Install launchd agents

```bash
cp deploy/org.rcn.sofi-proxy.plist ~/Library/LaunchAgents/
cp deploy/org.rcn.fedwiki.plist    ~/Library/LaunchAgents/

launchctl load ~/Library/LaunchAgents/org.rcn.sofi-proxy.plist
launchctl load ~/Library/LaunchAgents/org.rcn.fedwiki.plist

# Verify both are running
launchctl list | grep org.rcn
curl http://localhost:8765/tools/sodoto-issuer.html   # should return HTML
curl http://localhost:3000                             # should return FedWiki
```

Logs are at `~/Library/Logs/sofi-proxy.log` and `~/Library/Logs/fedwiki.log`.

## 3. Migrate wiki data

```bash
# From your dev machine:
rsync -avz ~/.wiki/ rcn@MAC_MINI_IP:~/.wiki/
```

After migration, FedWiki site directories will still be named `localhost/`. That's fine — sofi-proxy writes to `~/.wiki/{site}/pages/` where `site` comes from the API call, and the issuer tool sends `WIKI_SITE` as the site name. As long as `WIKI_SITE` in the tool matches what's on disk, it works.

## 4. Configure the Caddyfile

Edit `deploy/Caddyfile`:
- Replace `sodoto.example.com` with your actual domain
- Replace `wiki.example.com` with your wiki domain (or use subpath routing)

Make sure DNS A records for both domains point to the Mac Mini's public IP.

```bash
# Test config
caddy validate --config deploy/Caddyfile

# Run (will get TLS certs automatically)
caddy run --config deploy/Caddyfile
```

To run Caddy on boot:

```bash
sudo caddy run --config /Users/rcn/rcn/deploy/Caddyfile --environ &
# Or install as a system service:
sudo caddy install-service  # if your version supports it
```

## 5. Update sodoto-issuer.html for Mac Mini

Edit the three lines at the top of `tools/sodoto-issuer.html`:

```js
const PROXY        = 'https://sodoto.example.com'   // ← your domain
const WIKI_SITE    = 'localhost'                      // ← FedWiki site name on disk (usually 'localhost')
const PROXY_SECRET = 'the-secret-you-set-in-plist'   // ← match SODOTO_PROXY_SECRET
```

`WIKI_SITE` stays `'localhost'` if you migrated from dev with the same directory layout. Change it only if you renamed the wiki site directory on the Mac Mini.

## 6. Private keys

Private keys (64-char hex seeds) are entered by each issuer in their own browser at signing time and are never sent to the server. They should be stored securely by each person:
- macOS Keychain (Keychain Access app → New Password Item)
- A locally encrypted file (e.g. `gpg --symmetric keys.txt`)
- A password manager

The `veramo/keys.json` file on the dev machine is for reference only — do not copy it to the Mac Mini.

## 7. People registry

On first load, the issuer tool fetches `/api/people-registry` from sofi-proxy. If found, all browsers share the same registry. On every save (adding/removing a person), the browser POSTs the updated registry back to the server.

The file lives at `~/.sodoto/people-registry.json` on the Mac Mini (outside the web-serve path).

## Ports summary

| Service      | Port | Exposed via Caddy |
|-------------|------|-------------------|
| sofi-proxy  | 8765 | `sodoto.example.com` |
| FedWiki     | 3000 | `wiki.example.com`   |
| Caddy HTTPS | 443  | public               |
