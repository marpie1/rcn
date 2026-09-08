"""
geocode_whatcom.py — turn the 2017 entity addresses into coordinates, once.

WHY THIS IS A SEPARATE SCRIPT AND WRITES A FILE.

Decision 17: the files are the source of truth and the database is derived.
load_whatcom.py wipes and rebuilds `whatcom` from the CSVs on every run, so
coordinates written straight into Neo4j would survive exactly until the next
load. They have to land in a file that the loader reads — and this is the first
new data RCN has produced that did not come from a CSV or a drawing, so it is
the first real test of that rule.

The file is substrate/whatcom-geocoded.json, keyed by the same canon() the
loader uses, and it records for every hit WHICH query matched and WHAT the
service said it found. A coordinate with no way to check what produced it is
not evidence, it is decoration.

WHAT LEAVES THIS MACHINE. One HTTP request per address to Nominatim
(OpenStreetMap) — the same project whose tiles the map already draws. These are
organisation addresses from a 2017 public-sector survey, not people's homes;
the PERSON sheet is deliberately NOT geocoded here, and should not be without
asking the people in it.

Nominatim's usage policy: identify the application, at most one request per
second, do not hammer it. Hence the User-Agent below and DELAY.

RE-RUNNING IS SAFE. Anything already in the output file is skipped, so a second
run costs nothing and asks the service nothing. Delete an entry to re-query it.

    python3 substrate/geocode_whatcom.py --src "/path/to/CVS files on 010918"
"""

import argparse, json, os, sys, time, urllib.parse, urllib.request
from load_whatcom import read, canon
from db import BASE

OUT = os.path.join(BASE, 'substrate', 'whatcom-geocoded.json')
ENDPOINT = 'https://nominatim.openstreetmap.org/search'
# Identifies the application, as the policy requires, without carrying anybody's
# email address to a service that does not need one.
UA = 'RCN-Toolset/0.1 (ReLocalize Creativity Network; +https://relocalizecreativity.net)'
DELAY = 1.2          # seconds between requests; their limit is one per second


def queries(r):
    """Most specific first. A second attempt is a second SEARCH, not a rewrite of
    the author's data — `Belingham` stays `Belingham` in the CSV whatever
    happens here, per decision 11. Dropping the town and keeping the ZIP is
    often what rescues a misspelling."""
    a = (r.get('address') or '').strip()
    city = (r.get('city') or '').strip()
    st = (r.get('state') or '').strip()
    z = (r.get('zip_code') or '').strip()
    out = []
    if a and city and st:
        out.append(', '.join(x for x in [a, city, st, z] if x))
    if a and st:
        out.append(', '.join(x for x in [a, st, z] if x))
    if a and z:
        out.append('%s, %s' % (a, z))
    seen, uniq = set(), []
    for q in out:
        if q not in seen:
            seen.add(q)
            uniq.append(q)
    return uniq


def lookup(q):
    url = ENDPOINT + '?' + urllib.parse.urlencode(
        {'q': q, 'format': 'json', 'limit': 1, 'countrycodes': 'us',
         'addressdetails': 0})
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=25) as resp:
        data = json.load(resp)
    if not data:
        return None
    d = data[0]
    return {'lat': d['lat'], 'long': d['lon'],
            'matched': d.get('display_name', ''),
            'osm_type': d.get('osm_type', ''), 'query': q}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--src', required=True)
    a = ap.parse_args()

    rows = read(a.src)['ENTITY']
    have = [r for r in rows if (r.get('address') or '').strip()]

    store = {}
    if os.path.exists(OUT):
        store = json.load(open(OUT))
    print('%d entity rows carry an address; %d already geocoded'
          % (len(have), sum(1 for r in have if canon(r['entity_name']) in store)))

    asked = hit = miss = 0
    failures = []
    for r in have:
        key = canon(r['entity_name'])
        if key in store:
            continue
        got = None
        for q in queries(r):
            asked += 1
            try:
                got = lookup(q)
            except Exception as e:
                print('  ! %-34s %s' % (r['entity_name'][:34], e))
                got = None
            time.sleep(DELAY)
            if got:
                break
        if got:
            hit += 1
            got['name'] = r['entity_name']
            got['fetched'] = time.strftime('%Y-%m-%d')
            got['source'] = 'nominatim'
            store[key] = got
            print('  ✓ %-34s %s, %s' % (r['entity_name'][:34], got['lat'][:9], got['long'][:10]))
        else:
            miss += 1
            failures.append(r['entity_name'])
            print('  – %-34s no match' % r['entity_name'][:34])
        # Write as we go: 42 lookups is a minute of somebody else's service, and
        # losing it to a crash at row 40 would mean asking for all of it again.
        json.dump(store, open(OUT, 'w'), indent=2, sort_keys=True)

    print('\n%d requests, %d located, %d not found' % (asked, hit, miss))
    if failures:
        print('\nNOT FOUND — left without coordinates rather than guessed at:')
        for f in failures:
            print('  ' + f)
    print('\nwrote %s (%d entries)' % (os.path.relpath(OUT, BASE), len(store)))


if __name__ == '__main__':
    main()
