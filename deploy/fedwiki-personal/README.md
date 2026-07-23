# A personal FedWiki

One person, one wiki, running on their own computer. Nothing is shared, nothing
is hosted, no domain name, no certificates. Two files make it work: a Dockerfile
that installs FedWiki, and a compose file that runs it.

## Start it

```
docker compose up -d
```

Then open <http://localhost:3000>. That's the wiki. Click the pencil to edit.

```
docker compose stop     # stop it
docker compose start    # start it again
docker compose logs -f  # see what it's doing
```

## Where the pages live

Inside a Docker volume called `fedwiki-personal_wiki-data`. Everything the
person writes is in there — it is the wiki.

Back it up:

```
docker run --rm -v fedwiki-personal_wiki-data:/data -v "$PWD:/out" \
  busybox tar czf /out/wiki-backup.tar.gz -C /data .
```

Restore it onto another machine:

```
docker run --rm -v fedwiki-personal_wiki-data:/data -v "$PWD:/in" \
  busybox tar xzf /in/wiki-backup.tar.gz -C /data
```

Rebuilding or upgrading the image does not touch the volume.

## Two things worth understanding

**`127.0.0.1:3000:3000` in docker-compose.yml.** This makes the wiki reachable
from this computer only — not from other machines on the wifi, not from the
internet. Changing it to `"3000:3000"` opens it to the whole local network.

**`--security_legacy` in the Dockerfile.** FedWiki ships read-only: without this
flag the edit pencil does nothing. The flag makes an unclaimed wiki editable by
whoever can reach it. Those two settings depend on each other — the flag is only
safe while the port stays on `127.0.0.1`. If the wiki is ever put on the network,
claim the site first so it has an owner.

## Adding plugins

Copy them into the wiki's `node_modules` in the Dockerfile, after the
`npm install -g wiki` line. `deploy/scp/Dockerfile.fedwiki` does this for the 19
SCP plugins and is the example to copy.

## Note for this repo

Port 3000 is already used by the native FedWiki running under
`org.rcn.fedwiki.plist`. To run both, change the host side of the port line to
something else, e.g. `"127.0.0.1:3010:3000"`, and open <http://localhost:3010>.
