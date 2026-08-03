# SODOTO Acceptance Test

The one test that defines "SODOTO works," run identically at three layers. Nothing ships until it is green at Layer 2; the pilot is not "working" until it is green at Layer 3.

The discipline: the same loop runs at each layer, and each layer catches a different class of failure. Layer 2 is the one that stops drift — a plugin loading from `~/Downloads`, an unpinned dependency, a seed that targets the wrong folder — before it ever reaches the server.

## The layers

Layer 1 — Local dev (this Mac). Proves the loop works and, more importantly, proves *what makes it work* is honestly reproducible (nothing loading from outside the repo).

Layer 2 — Local container. Build the image, run it here, run the same loop. If it passes, the image reproduces local. If it fails, fix the **repo**, rebuild — never patch the running container.

Layer 3 — WikiCafe. After push and after Christian sets `SEED_DEMO=true`, run the same loop against the live pilot.

## The loop (acceptance criteria)

A badge, issued end to end. Every step must pass, in order:

1. **Issuer loads.** Open the issuer tool. `/config` resolves (proxy URL, `WIKI_SITE`), the passphrase is accepted, and no console errors.
2. **Demo cast is present.** The learner dropdown shows the three `DEMO —` people from the seeded registry, and nothing else (no real names).
3. **Issuer is DEMO Academy.** The issuer dropdown offers `DEMO Academy · test issuer` and it is selected. You paste the DEMO Academy seed from `sodoto/seed/demo-keys.json` (never a real key).
4. **Gates run.** Pick a skill and a `DEMO —` learner, run the See One / Do One / Teach One gates.
5. **Sign.** Sign the badge in the browser. This is the human step — the private key never leaves the browser. No error on sign.
6. **Write lands.** The badge writes to the learner's `demo-…-sodoto-portfolio` page. The issuer reports success, not an HTTP error.
7. **Renders.** Open that portfolio page in the wiki. The badge renders as a badge (skill name, issuer seal, gate dates), and reads `DEMO — <learner>` — unmistakably demo.
8. **Verifies + ledgered.** The badge's Verify button validates the JWT green in the browser. The `DEMO — SODOTO Badge Ledger` page shows a new row for it.

Green on all eight = the loop works at that layer.

## Running it

### Layer 1 — local dev

Preconditions, each already checked or noted:

- The badge plugin loads from the repo, not `~/Downloads`. Repoint once (needs sudo, so run it yourself): `sudo ln -sfn /Users/marcpierson/rcn/sodoto/plugins/wiki-plugin-sodoto-badge /usr/local/lib/node_modules/wiki/node_modules/wiki-plugin-sodoto-badge`, then restart the local wiki.
- Seed the local wiki: `SEED_DEMO=true WIKI_SITE=localhost python3 sodoto/seed/seed.py` (idempotent — safe to re-run).
- Start the proxy with `SODOTO_PROXY_SECRET` set, open the issuer, run the loop.

### Layer 2 — local container

- Build: `docker build -f deploy/docker/Dockerfile.sofi-proxy -t rcn-sodoto-proxy:test .`
- Run proxy + wiki sharing one `wiki-data` volume, with `SEED_DEMO=true` and a test `WIKI_SITE`.
- Automated half (no browser): confirm the proxy logged `[seed] wrote …`, `/api/people-registry` returns the three demo people, and the wiki serves the seeded portfolio pages.
- Manual half (browser): run steps 3–8 against the local container exactly as on Layer 1.
- A failure here is a repo fix, then rebuild — do not edit the running container.

### Layer 3 — WikiCafe

- Push (images go live overnight per Christian).
- Christian sets `SEED_DEMO=true` in the SODOTO `.env` — until then the pilot stays empty by design.
- Run the full eight-step loop against `sodoto.ndcgroup.relocalizecreativity.net/tools/sodoto-issuer.html`, viewing badges on `wiki-sodoto.ndcgroup.relocalizecreativity.net`.

## Cleanup

Everything the seed creates is prefixed `DEMO —` (names, portfolios, ledger title). To reset a layer, delete the `demo-*` pages and the `people-registry.json`, or re-provision the site. Real badges, when they come, carry no `DEMO —` prefix and never collide with these.
