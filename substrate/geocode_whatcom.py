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

import argparse, json, os, re, sys, time, urllib.parse, urllib.request
from load_whatcom import read, canon
from db import BASE

OUT = os.path.join(BASE, 'substrate', 'whatcom-geocoded.json')
ENDPOINT = 'https://nominatim.openstreetmap.org/search'
# Identifies the application, as the policy requires, without carrying anybody's
# email address to a service that does not need one.
UA = 'RCN-Toolset/0.1 (ReLocalize Creativity Network; +https://relocalizecreativity.net)'
DELAY = 1.2          # seconds between requests; their limit is one per second


# WHATCOM COUNTY ZIPs. Twelve of the 42 addresses have no town on them, which
# is not a gap in the record so much as a thing everybody in the county already
# knew. Filling it in for the QUERY is not the same as writing it into the CSV,
# which still says exactly what its author typed.
ZIP_CITY = {
    '98225': 'Bellingham', '98226': 'Bellingham', '98227': 'Bellingham',
    '98228': 'Bellingham', '98229': 'Bellingham',
    '98220': 'Acme', '98230': 'Blaine', '98240': 'Custer', '98244': 'Deming',
    '98247': 'Everson', '98248': 'Ferndale', '98262': 'Lummi Island',
    '98264': 'Lynden', '98266': 'Maple Falls', '98276': 'Nooksack',
    '98281': 'Point Roberts', '98295': 'Sumas',
}

# A SUITE IS NOT A PLACE ON THE GROUND. Thirteen of the fifteen addresses that
# failed the first pass name a room inside a building — Suite 204, #D-1,
# Ste 102, Suite F-188 — and a geocoder that resolves streets has nothing to
# match them against. Stripping the suite asks about the building instead,
# which is where the organisation actually is to within a few metres.
SUITE = re.compile(
    r'\s*[,#]?\s*(?:#|suite|ste\.?|unit|apt\.?|apartment|bldg\.?|building|rm\.?|room)'
    r'\s*[A-Za-z0-9\-]*\s*$', re.I)

# `1616 Cornwall, Avenue` — a comma that fell between a street and its type.
STRAY = re.compile(r',\s*(Avenue|Ave|Street|St|Road|Rd|Drive|Dr|Way|Boulevard|Blvd|Parkway|Pkwy)\b',
                   re.I)


def strip_suite(a):
    prev = None
    while prev != a:
        prev = a
        a = SUITE.sub('', a).strip().rstrip(',').strip()
    return a


def queries(r):
    """Most specific first. A second attempt is a second SEARCH, not a rewrite of
    the author's data — `Belingham` stays `Belingham` in the CSV whatever
    happens here, per decision 11. Dropping the town and keeping the ZIP is
    often what rescues a misspelling."""
    a = STRAY.sub(r' \1', (r.get('address') or '').strip()).strip()
    city = (r.get('city') or '').strip()
    st = (r.get('state') or '').strip()
    z = (r.get('zip_code') or '').strip()
    bare = strip_suite(a)
    town = city or ZIP_CITY.get(z, '')
    name = (r.get('entity_name') or '').strip()
    out = []
    # Most specific first, then progressively less. Each step drops one thing
    # the service cannot use, and the file records which one actually matched
    # so a reader can see how precise any given point is.
    if a and city and st:
        out.append(', '.join(x for x in [a, city, st, z] if x))
    if bare and town and st:
        out.append(', '.join(x for x in [bare, town, st, z] if x))
    if bare and st:
        out.append(', '.join(x for x in [bare, st, z] if x))
    if bare and z:
        out.append('%s, %s' % (bare, z))
    # Last resort: ask for the organisation by name. Weaker evidence — it finds
    # what OSM has decided this business is, not what the address says — so it
    # is only reached when every address form has failed, and `query` on the
    # record shows that is what happened.
    if name and town and st:
        out.append(', '.join(x for x in [name, town, st] if x))
    seen, uniq = set(), []
    for q in out:
        if q not in seen:
            seen.add(q)
            uniq.append(q)
    return uniq


# A GEOCODER ALWAYS FINDS SOMETHING. Loosening the query to get a hit is only
# safe if the hit is then checked, and the first loose pass proved it: asking
# for "1610 West Grover Street, WA, 98264" returned West Grover Street in
# MAGNOLIA, SEATTLE — a real street with the right name, 145km from Lynden —
# and "5603 Third Avenue, WA, 98248" landed in Skagit County. Both looked like
# perfectly good coordinates and both were wrong.
#
# So: if the address sits in a Whatcom ZIP, the answer has to be in Whatcom
# County, and a rejected candidate falls through to the next query rather than
# being accepted for want of anything better.
def in_expected_county(display, zipcode, city):
    if zipcode in ZIP_CITY or city.strip().title() in set(ZIP_CITY.values()):
        return 'whatcom county' in display.lower()
    return True          # outside the county we have nothing to check against


def lookup(q, zipcode='', city=''):
    url = ENDPOINT + '?' + urllib.parse.urlencode(
        {'q': q, 'format': 'json', 'limit': 3, 'countrycodes': 'us',
         'addressdetails': 1})
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=25) as resp:
        data = json.load(resp)
    for d in data or []:
        disp = d.get('display_name', '')
        if not in_expected_county(disp, zipcode, city):
            continue
        addr = d.get('address') or {}
        # Whether the match reached a building or stopped at the street. Not a
        # reason to reject — a street is the right answer for a suite — but the
        # reader of a point deserves to know which they are looking at.
        precision = 'building' if addr.get('house_number') else (
            'street' if addr.get('road') else 'area')
        return {'lat': d['lat'], 'long': d['lon'], 'matched': disp,
                'osm_type': d.get('osm_type', ''), 'query': q,
                'precision': precision}
    return None


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
                got = lookup(q, (r.get('zip_code') or '').strip(),
                             (r.get('city') or '').strip())
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
            print('  ✓ %-34s %s, %-11s %s' % (r['entity_name'][:34], got['lat'][:9],
                                              got['long'][:10], got.get('precision','')))
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
