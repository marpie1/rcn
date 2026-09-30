#!/usr/bin/env bash
# No-restart provisioning, end to end: the REAL proxy (sofi-proxy.py from this
# repo) provisions a new person site while the REAL wiki farm is running, and
# that person signs in and edits without the wiki ever being restarted.
#
# It starts from a production-shaped config — the base host's wikiDomains entry
# naming an owner file, and one older site with its own entry — so it also proves
# the one-time migration (one last restart) and that older sites keep working.
#
# Usage:  ./no-restart.sh      Requires Docker.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/../../../../.." && pwd)"
WPORT="${WIKIPORT:-3012}"; PPORT="${PROXYPORT:-8799}"
TMP="$(mktemp -d)"; DATA="$TMP/wiki"; NET=didnr-net

cleanup() { docker rm -f didnr-wiki didnr-proxy >/dev/null 2>&1 || true; docker network rm $NET >/dev/null 2>&1 || true; rm -rf "$TMP"; }
trap cleanup EXIT

echo "== build did-capable wiki image =="
docker build -q -f "$REPO/deploy/docker/Dockerfile.fedwiki" -t rcn-sodoto-wiki:ditest "$REPO" >/dev/null

echo "== lay down production-shaped farm data =="
node "$HERE/no-restart-setup.js" "$DATA" >/dev/null

start_wiki() {
  docker rm -f didnr-wiki >/dev/null 2>&1 || true
  docker run -d --name didnr-wiki --network $NET -p "$WPORT:3000" -v "$DATA:/root/.wiki" \
    rcn-sodoto-wiki:ditest sh -c "wiki --farm --port 3000 --security_type did" >/dev/null
  for i in $(seq 1 60); do
    curl -s -m 3 -H "Host: wiki.test" "localhost:$WPORT/auth/challenge" 2>/dev/null | grep -q nonce && return
    sleep 0.5
  done
  echo "wiki did not come up"; docker logs didnr-wiki | tail -20; exit 1
}

docker network create $NET >/dev/null
echo "== start real wiki farm and real proxy (same data folder) =="
start_wiki
# The proxy from THIS repo, run in a python container that sees the wiki data at
# the same path the wiki does, exactly as the two containers share it in production.
docker run -d --name didnr-proxy --network $NET -p "$PPORT:8765" -v "$DATA:/root/.wiki" \
  -v "$REPO/sofi-proxy.py:/app/sofi-proxy.py:ro" -w /app \
  -e WIKI_SITE=wiki.test -e SODOTO_DID_OWNERSHIP=1 -e SODOTO_PROXY_SECRET=test-secret -e PYTHONUNBUFFERED=1 \
  python:3.12-slim python3 sofi-proxy.py >/dev/null
for i in $(seq 1 60); do curl -s -m 3 "localhost:$PPORT/config" >/dev/null 2>&1 && break; sleep 0.5; done

echo "== drive it =="
WIKIPORT="$WPORT" PROXYPORT="$PPORT" DATA="$DATA" \
  node "$HERE/no-restart-client.js" "$TMP/keys.json" phase1
echo "== the one-time migration restart =="
start_wiki
WIKIPORT="$WPORT" PROXYPORT="$PPORT" DATA="$DATA" \
  node "$HERE/no-restart-client.js" "$TMP/keys.json" phase2
