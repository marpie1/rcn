# SODOTO DID Ownership — Deploy Runbook (Shape A · on-demand TLS)

Status: ready to execute · August 15 2026 · the coordinated flip that turns on per-person portfolio ownership by did:key

This is the step-by-step rollout for turning on DID login (a person edits their own FedWiki portfolio by proving control of their self-custodied `did:key`). Everything is already built, tested, and shipping dark; this runbook is only the coordinated flip. Decision locked (Marc, Aug 15 2026): **Shape A** (per-person sites, one hostname each) with **on-demand TLS** (Caddy mints a cert per host, gated by the proxy's ask endpoint).

## What flips, and who does each part

- **Marc / this repo:** re-run the integration test, build + push the two dark images, provision the cohort's sites, flip the compose env, verify.
- **Christian (WikiCafe):** one wildcard DNS record; pull the updated compose + Caddyfile; `docker compose up -d`.

Nothing here changes verification — badges stay verifiable client-side with no server. This only adds *edit* authorization for portfolio owners.

## Prerequisites

- The image code is on branch `substrate/states-as-variables` (commits `fd92316`, `3053a43`, `3239ab3`, `b88ba2a`, `f105978`, plus the ask endpoint). Nothing pushed yet.
- WikiCafe auto-pulls images hourly, so a pushed image reaches the server within the hour — but every did piece is env-gated, so a pushed image stays inert until the env is flipped. Order the steps so the env flip is the last thing.

## Steps

1. **Re-run the integration harness** (proves the wiki side still enforces ownership end-to-end): `sodoto/plugins/wiki-security-did/test/integration/run.sh` — expect 7/7. Also `npm test` in `wiki-security-did` (34) and `wiki-plugin-sodoto-signin` (5).

2. **Build + push the two dark images** (multi-arch, via the `rcnmulti` builder):
   - `rcn-sodoto-proxy` (adds provisioning, badge-sets-owner, the TLS ask endpoint — all gated by `SODOTO_DID_OWNERSHIP`).
   - `rcn-sodoto-wiki` (vendors `wiki-security-did` + `wiki-plugin-sodoto-signin`; CMD honors `WIKI_FARM` / `SECURITY_TYPE`).
   Both launch identically to today until the env is flipped, so this push is safe even under hourly auto-pull.

3. **Christian: wildcard DNS.** Add `*.{WIKI_DOMAIN}` (e.g. `*.wiki-sodoto.ndcgroup.relocalizecreativity.net`) as an A/AAAA record to WikiCafe's IP. This is the only new infra. The Caddy `on_demand_tls` + `*.{WIKI_DOMAIN}` block is already in `deploy/docker/Caddyfile`; it does nothing until this record exists and a hostname is provisioned.

4. **Provision the cohort's per-person sites.** For each learner, `POST /api/sodoto-provision-site` (admin, bearer token) with `{ name, slug, site, did? }`, where `site = {slug}.{WIKI_DOMAIN}` (the full prod hostname). This creates the site's `owner.json` (unclaimed), an empty portfolio page carrying the sign-in button, and the `wikiDomains` entry. Migrate existing demo portfolios the same way (each becomes its own site; badges move with it).

5. **Turn on farm + did, and restart.** Proxy: `SODOTO_DID_OWNERSHIP=1`. Wiki: `WIKI_FARM=1` and `SECURITY_TYPE=did`. Then `docker compose up -d`. The wiki restart is required so the farm reads the new `wikiDomains` (the farm reads them at startup — any later provisioning also needs a wiki restart to be served).

   **If the deployment overrides `command:`** — as a Swarm stack file typically does — those two wiki env vars are read by nothing, because the override replaces the image CMD that expands them. Pass the flags instead: `command: ["wiki","--farm","--port","3000","--security_type","did"]`. The proxy's `SODOTO_DID_OWNERSHIP` is a plain env read and is unaffected either way. **WikiCafe already runs farm + did this way (confirmed Aug 27 2026)** — check what is actually running before assuming a site is still on the single-site friends path.

6. **Verify (browser, on a real per-person site):**
   - Open `https://{slug}.{WIKI_DOMAIN}` — the portfolio shows the "Sign in with my SODOTO key" button; the cert was issued on demand.
   - The holder (their key in this browser) clicks sign in → "✓ Signed in — you can edit this page", and an edit saves.
   - A different browser / DID → "isn't yours to edit"; an edit is refused (403).
   - Issue a badge to a freshly provisioned (unclaimed) site → its `owner.json.did` is stamped to the holder (badge-sets-owner), and never overwritten by a later different badge.

## Rollback

Re-comment the three env vars and `docker compose up -d`. The wiki returns to single-site `friends`; the images are unchanged. `owner.json` files with a `did` are harmless in friends mode.

## Notes

- Per-person sites are addressed by hostname (FedWiki farm's only site discriminator), which is why shape A needs the wildcard record. The ask endpoint (`GET /api/tls-allow?domain=…`) refuses certs for any hostname that isn't the base host or a provisioned `wikiDomains` site, so the wildcard can't be abused.
- The private key never touches the server: sign-in is challenge → sign the nonce in the browser → verify. The NDC seal on badges is the only server-side signing, unchanged.
