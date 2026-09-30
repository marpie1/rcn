#!/usr/bin/env bash
# End-to-end integration test for wiki-security-did against a REAL FedWiki 0.27
# running in farm + security_type=did. Proves what the unit tests can't: FedWiki
# actually calling isAuthorized on a page PUT, per-site owner wiring via
# wikiDomains, challenge/verify with real Ed25519, and session cookies.
#
# Usage:  ./run.sh            (builds the wiki image, runs on host port 3010)
#         WIKIPORT=3011 ./run.sh
#
# Requires Docker. Builds deploy/docker/Dockerfile.fedwiki as rcn-sodoto-wiki:ditest.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/../../../../.." && pwd)"          # -> repo root (rcn)
PORT="${WIKIPORT:-3010}"
DATA="$(mktemp -d)/wiki"
KEYS="$(dirname "$DATA")/didtest-keys.json"   # setup.js writes keys beside DATA

cleanup() { docker rm -f didtest-wiki >/dev/null 2>&1 || true; rm -rf "$(dirname "$DATA")"; }
trap cleanup EXIT

echo "== build did-capable wiki image =="
docker build -q -f "$REPO/deploy/docker/Dockerfile.fedwiki" -t rcn-sodoto-wiki:ditest "$REPO" >/dev/null

echo "== lay down farm data (two per-person sites) =="
node "$HERE/setup.js" "$DATA" >/dev/null

echo "== start real FedWiki (farm + security_type=did) on :$PORT =="
docker rm -f didtest-wiki >/dev/null 2>&1 || true
docker run -d --name didtest-wiki -p "$PORT:3000" -v "$DATA:/root/.wiki" \
  rcn-sodoto-wiki:ditest sh -c "wiki --farm --port 3000 --security_type did" >/dev/null
for i in $(seq 1 60); do
  curl -s -m 3 -H "Host: alice.localhost" "localhost:$PORT/auth/challenge" 2>/dev/null | grep -q nonce && break
  sleep 0.5
done

echo "== drive the client end-to-end =="
WIKIPORT="$PORT" node "$HERE/client.js" "$KEYS" "$DATA"
