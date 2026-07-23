#!/bin/sh
# Choose the passphrase that opens the gate.
#
# Only a hash is stored, in .env. The passphrase itself is never written down —
# which also means nobody, including whoever wrote this software, can recover
# it for you. Write it somewhere safe.
#
#   ./set-passphrase.sh
#
# Run it again any time to change the passphrase, then: docker compose up -d

set -e
cd "$(dirname "$0")"

[ -f .env ] || touch .env

printf 'Choose a passphrase for this computer.\n'
docker run --rm -it caddy:latest caddy hash-password > .hash.tmp

HASH=$(tr -d '\r\n' < .hash.tmp)
rm -f .hash.tmp

# bcrypt hashes are full of $ signs, and docker compose reads $ in .env as the
# start of a variable name — it would silently eat part of the hash and the
# passphrase would never match. Doubling them escapes them.
HASH=$(printf '%s' "$HASH" | sed 's/\$/$$/g')

if [ -z "$HASH" ]; then
	printf 'No passphrase set — nothing changed.\n' >&2
	exit 1
fi

# Replace any existing entries rather than appending duplicates.
grep -v '^GATE_PASSWORD_HASH=' .env > .env.tmp 2>/dev/null || true
grep -v '^GATE_USER=' .env.tmp > .env.new 2>/dev/null || cp .env.tmp .env.new
mv .env.new .env
rm -f .env.tmp

printf 'GATE_USER=me\n' >> .env
printf 'GATE_PASSWORD_HASH=%s\n' "$HASH" >> .env

printf '\nPassphrase set. Apply it with:\n\n    docker compose up -d\n\n'
printf 'The username is "me". Your browser will ask for both.\n'
