#!/bin/sh
# Check or restore an encrypted backup.
#
#   ./restore.sh --verify my-health-record-2026-07-22-1430.enc
#       Opens the backup, reports what is in it, and changes nothing.
#       A backup nobody has ever checked is not a backup. Do this once when
#       you set up, and once a year after that.
#
#   ./restore.sh my-health-record-2026-07-22-1430.enc
#       Replaces the record on this computer with the one in the backup.
#       This is also how you move to a new computer.
#
# Restoring stops the stack first, and makes a safety backup of whatever is
# currently on this computer before overwriting it.

set -e
cd "$(dirname "$0")"
. ./lib-common.sh
load_backup_settings

VERIFY=no
if [ "$1" = "--verify" ]; then
	VERIFY=yes
	shift
fi

FILE="$1"
if [ -z "$FILE" ]; then
	printf 'Which backup? For example:\n\n' >&2
	printf '    ./restore.sh --verify %s/my-health-record-....enc\n\n' "$BACKUP_DIR" >&2
	ls -1t "$BACKUP_DIR"/my-health-record-*.enc 2>/dev/null | head -5 | sed 's/^/    /' >&2
	exit 1
fi
if [ ! -f "$FILE" ]; then
	printf 'No such file: %s\n' "$FILE" >&2
	exit 1
fi

PP=$(read_passphrase 'Passphrase for this backup: ')

decrypt() {
	openssl enc -d $ENC_ARGS -pass fd:3 -in "$FILE" 3<<EOF
$PP
EOF
}

if [ "$VERIFY" = yes ]; then
	printf 'Opening the backup (your record is not touched)...\n\n'
	# Unpack into a throwaway container and describe what is inside.
	if ! decrypt 2>/dev/null | docker run --rm -i busybox sh -c '
		mkdir -p /tmp/b && tar xzf - -C /tmp/b 2>/dev/null || exit 1
		echo "  What is in this backup:"
		[ -f /tmp/b/MANIFEST ] && sed "s/^/    /" /tmp/b/MANIFEST
		people=/tmp/b/coupler-data/people.json
		if [ -f "$people" ]; then
			echo "    people: $(grep -o "\"id\"" "$people" | wc -l | tr -d " ")"
		fi
		echo "    record files: $(find /tmp/b/coupler-data -type f 2>/dev/null | wc -l | tr -d " ")"
		echo "    wiki pages:   $(find /tmp/b/wiki-data -path "*/pages/*" -type f 2>/dev/null | wc -l | tr -d " ")"
	'; then
		printf '\nThis backup could not be opened.\n' >&2
		printf 'Either the passphrase is wrong, or the file is damaged.\n' >&2
		exit 1
	fi
	printf '\nThe backup is readable and complete.\n'
	exit 0
fi

# ── real restore ─────────────────────────────────────────────────────────────

printf '\nThis will replace the record on this computer.\n'
printf 'Type yes to continue: '
read -r ANSWER
[ "$ANSWER" = "yes" ] || { printf 'Nothing changed.\n'; exit 0; }

printf 'Stopping...\n'
docker compose down >/dev/null 2>&1 || true

if volumes_exist; then
	SAFETY="$BACKUP_DIR/before-restore-$(date +%Y-%m-%d-%H%M).tar.gz"
	mkdir -p "$BACKUP_DIR"
	printf 'Saving what is here now, in case you need it back...\n'
	docker run --rm \
		-v "$VOL_COUPLER:/v/coupler-data:ro" \
		-v "$VOL_WIKI:/v/wiki-data:ro" \
		busybox tar czf - -C /v . > "$SAFETY"
	printf '  saved to %s (not encrypted — delete it when you are satisfied)\n' "$SAFETY"
fi

docker volume create "$VOL_COUPLER" >/dev/null
docker volume create "$VOL_WIKI" >/dev/null

printf 'Restoring...\n'
if ! decrypt 2>/dev/null | docker run --rm -i \
	-v "$VOL_COUPLER:/v/coupler-data" \
	-v "$VOL_WIKI:/v/wiki-data" \
	busybox sh -c 'rm -rf /v/coupler-data/* /v/wiki-data/* 2>/dev/null; tar xzf - -C /v'; then
	printf '\nRestore failed — wrong passphrase, or the file is damaged.\n' >&2
	printf 'Your previous record is in %s\n' "$SAFETY" >&2
	exit 1
fi
PP=''

printf '\nRestored. Start again with:  docker compose up -d\n'
