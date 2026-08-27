#!/usr/bin/env python3
"""Idempotent SODOTO demo seeder.

Runs at proxy startup. Seeds the demo people-registry and the demo portfolio /
ledger / welcome pages into whatever site WIKI_SITE names — so it is correct on
localhost (dev) and on the WikiCafe domain alike, with no hardcoded site.

Opt-in: does nothing unless SEED_DEMO is truthy. A real (non-demo) deployment
simply leaves SEED_DEMO unset and is never touched.

Idempotent: only writes a file that is absent. It never overwrites an existing
page, registry, or owner file — so re-running on an already-seeded (or
operator-edited) site is a no-op, and real content is never clobbered.

The one exception is repair_localhost_sites(), which rewrites the dev-default
'localhost' site on existing registry entries to WIKI_SITE. Absent-only left
those people pointing at a site this host does not serve, which silently broke
their portfolio writes. It touches nothing else, and leaves real remote sites
(federation) alone.
"""
import json
import os
import sys

SRC          = os.path.dirname(os.path.abspath(__file__))
WIKI_SITE    = os.environ.get('WIKI_SITE', 'localhost')
WIKI_ROOT    = os.path.expanduser(os.environ.get('WIKI_ROOT', '~/.wiki'))
SODOTO_ROOT  = os.path.expanduser(os.environ.get('SODOTO_ROOT', '~/.sodoto'))
SEED_DEMO    = os.environ.get('SEED_DEMO', '').strip().lower() in ('1', 'true', 'yes', 'on')


def truthy_exit(msg):
    print(f"[seed] {msg}")
    sys.exit(0)


def repair_localhost_sites(registry_dest):
    """Point people still on the dev-default 'localhost' at the site we serve.

    The absent-only rule below protects operator-edited data, but it also meant a
    registry written once on localhost kept that site forever: every later boot
    skipped the whole file. Those people's portfolios were then written to a site
    this host does not serve, so their pages silently never appeared.

    This is deliberately narrow, not a re-stamp. Only the literal 'localhost'
    placeholder is corrected, and only when we serve something else. A person
    whose site is another NDC's real domain is federation, not staleness, and is
    left strictly alone.
    """
    if WIKI_SITE == 'localhost':
        return 0
    try:
        with open(registry_dest, encoding='utf-8') as f:
            registry = json.load(f)
    except (OSError, ValueError) as e:
        print(f"[seed] could not read registry to repair sites: {e}")
        return 0

    people = registry.get('people', [])
    stale = [p for p in people if p.get('site') == 'localhost']
    if not stale:
        return 0
    for person in stale:
        person['site'] = WIKI_SITE

    tmp = registry_dest + '.tmp'
    try:
        with open(tmp, 'w', encoding='utf-8') as f:
            json.dump(registry, f, ensure_ascii=False, indent=2)
        os.replace(tmp, registry_dest)   # atomic — never a half-written registry
    except OSError as e:
        print(f"[seed] could not write repaired registry: {e}")
        if os.path.exists(tmp):
            os.remove(tmp)
        return 0
    return len(stale)


def main():
    if not SEED_DEMO:
        truthy_exit("SEED_DEMO not set — skipping demo seed.")

    pages_src = os.path.join(SRC, 'pages')
    registry_src = os.path.join(SRC, 'people-registry.json')
    if not os.path.isdir(pages_src) or not os.path.isfile(registry_src):
        truthy_exit(f"seed source missing under {SRC} — nothing to do.")

    site_pages = os.path.join(WIKI_ROOT, WIKI_SITE, 'pages')
    os.makedirs(site_pages, exist_ok=True)
    os.makedirs(SODOTO_ROOT, exist_ok=True)

    wrote = []
    skipped = []

    # 1. People registry — stamp each person's site with WIKI_SITE. Absent-only.
    registry_dest = os.path.join(SODOTO_ROOT, 'people-registry.json')
    if os.path.exists(registry_dest):
        skipped.append('people-registry.json')
        repaired = repair_localhost_sites(registry_dest)
        if repaired:
            wrote.append(f"repaired site on {repaired} person/people (localhost → {WIKI_SITE})")
    else:
        with open(registry_src, encoding='utf-8') as f:
            registry = json.load(f)
        for person in registry.get('people', []):
            person['site'] = WIKI_SITE
        with open(registry_dest, 'w', encoding='utf-8') as f:
            json.dump(registry, f, ensure_ascii=False, indent=2)
        wrote.append(f"registry ({len(registry.get('people', []))} demo people)")

    # 2. Pages — one file per slug (filename minus .json). Absent-only.
    for fname in sorted(os.listdir(pages_src)):
        if not fname.endswith('.json'):
            continue
        slug = fname[:-5]
        dest = os.path.join(site_pages, slug)
        if os.path.exists(dest):
            skipped.append(slug)
            continue
        with open(os.path.join(pages_src, fname), encoding='utf-8') as f:
            page = json.load(f)
        with open(dest, 'w', encoding='utf-8') as f:
            json.dump(page, f, ensure_ascii=False)
        wrote.append(slug)

    # 3. owner.json — FedWiki reads it from the site's status/ subfolder, not the
    #    site root. Absent-only, so an already-claimed site is left alone. (Thanks
    #    to Christian for catching that this was landing in the wrong folder.)
    status_dir = os.path.join(WIKI_ROOT, WIKI_SITE, 'status')
    owner_dest = os.path.join(status_dir, 'owner.json')
    if not os.path.exists(owner_dest):
        os.makedirs(status_dir, exist_ok=True)
        with open(owner_dest, 'w', encoding='utf-8') as f:
            json.dump({'name': 'SODOTO (DEMO)', 'color': '#7c3aed'}, f, indent=2)
        wrote.append('status/owner.json')

    print(f"[seed] site={WIKI_SITE} root={WIKI_ROOT}")
    print(f"[seed] wrote:   {', '.join(wrote) if wrote else '(nothing new)'}")
    if skipped:
        print(f"[seed] skipped: {', '.join(skipped)} (already present)")


if __name__ == '__main__':
    main()
