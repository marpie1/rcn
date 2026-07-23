#!/bin/sh
# Make an encrypted backup of your health record.
#
#   ./backup.sh
#
# Writes one encrypted file. That file is unreadable without your passphrase,
# so it is safe to keep anywhere ordinary — a USB stick, Dropbox, iCloud, an
# external drive. Without encryption there is nowhere good to put a backup;
# with it, anywhere is fine.
#
# If you forget the passphrase you lose the backup, not your record. The live
# record on this computer is untouched. Make a new backup and move on.
#
# Use the same passphrase as the gate unless you have a reason not to. A backup
# keeps whichever passphrase was current when it was made, so if you change the
# gate passphrase later, older backups still want the old one.

set -e
cd "$(dirname "$0")"
. ./lib-common.sh
load_backup_settings

if ! volumes_exist; then
	printf 'No record found to back up (looked for the %s and %s volumes).\n' \
		"$VOL_COUPLER" "$VOL_WIKI" >&2
	printf 'Has the stack been started at least once?\n' >&2
	exit 1
fi

mkdir -p "$BACKUP_DIR"
STAMP=$(date +%Y-%m-%d-%H%M%S)
OUT="$BACKUP_DIR/my-health-record-$STAMP.enc"

PP=$(read_passphrase 'Passphrase for this backup: ')
PP2=$(read_passphrase 'Again: ')
if [ "$PP" != "$PP2" ]; then
	printf 'Those did not match. Nothing was written.\n' >&2
	exit 1
fi
if [ -z "$PP" ]; then
	printf 'Empty passphrase. Nothing was written.\n' >&2
	exit 1
fi

printf 'Backing up...\n'

# A manifest travels inside the archive so a backup can describe itself
# without being restored.
MANIFEST=$(mktemp)
{
	printf 'created: %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
	printf 'source: %s\n' "$(hostname)"
} > "$MANIFEST"

# Read both volumes read-only, stream a tar out, encrypt it on the way to disk.
# The passphrase goes to openssl on file descriptor 3 so it never appears in
# the process list.
docker run --rm \
	-v "$VOL_COUPLER:/v/coupler-data:ro" \
	-v "$VOL_WIKI:/v/wiki-data:ro" \
	-v "$MANIFEST:/v/MANIFEST:ro" \
	busybox tar czf - -C /v . |
	openssl enc $ENC_ARGS -pass fd:3 -out "$OUT" 3<<EOF
$PP
EOF

rm -f "$MANIFEST"
PP=''

SIZE=$(du -h "$OUT" | cut -f1 | tr -d ' ')
printf '\nBacked up to %s (%s)\n' "$OUT" "$SIZE"

# Keep several. A corrupted record faithfully written over your only good copy
# is a real way to lose everything.
COUNT=$(ls -1 "$BACKUP_DIR"/my-health-record-*.enc 2>/dev/null | wc -l | tr -d ' ')
if [ "$COUNT" -gt "$BACKUP_KEEP" ]; then
	ls -1t "$BACKUP_DIR"/my-health-record-*.enc | tail -n +$((BACKUP_KEEP + 1)) |
		while read -r old; do
			rm -f "$old"
			printf 'Removed old backup: %s\n' "$(basename "$old")"
		done
fi

printf '\nCheck it worked:  ./restore.sh --verify %s\n' "$OUT"
