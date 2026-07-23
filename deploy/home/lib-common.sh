#!/bin/sh
# Shared helpers. Not run directly.

PROJECT="${COMPOSE_PROJECT_NAME:-$(basename "$PWD")}"
VOL_COUPLER="${PROJECT}_coupler-data"
VOL_WIKI="${PROJECT}_wiki-data"

# Prompt without echoing the passphrase to the screen.
read_passphrase() {
	printf '%s' "$1" >&2
	# stty fails when stdin is not a terminal (a pipe, or a test run).
	# Without || true, `set -e` would kill the script right here.
	stty -echo 2>/dev/null || true
	read -r _pp
	stty echo 2>/dev/null || true
	printf '\n' >&2
	printf '%s' "$_pp"
}

volumes_exist() {
	docker volume inspect "$VOL_COUPLER" >/dev/null 2>&1 &&
		docker volume inspect "$VOL_WIKI" >/dev/null 2>&1
}

# Read BACKUP_DIR / BACKUP_KEEP from .env if present.
load_backup_settings() {
	BACKUP_DIR="./backups"
	BACKUP_KEEP=8
	if [ -f .env ]; then
		_d=$(grep '^BACKUP_DIR=' .env 2>/dev/null | cut -d= -f2-)
		_k=$(grep '^BACKUP_KEEP=' .env 2>/dev/null | cut -d= -f2-)
		[ -n "$_d" ] && BACKUP_DIR="$_d"
		[ -n "$_k" ] && BACKUP_KEEP="$_k"
	fi
	# A function whose last command is a false test returns non-zero, and
	# `set -e` would then kill the caller. Always succeed.
	return 0
}

# Encryption: AES-256 with a key stretched from the passphrase by PBKDF2.
# 600,000 rounds makes guessing a weak passphrase slow.
ENC_ARGS="-aes-256-cbc -pbkdf2 -iter 600000 -salt"
