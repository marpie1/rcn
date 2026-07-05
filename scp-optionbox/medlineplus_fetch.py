#!/usr/bin/env python3
"""
medlineplus-fetch.py — look up plain-language definitions for medical terms
via the MedlinePlus Web Services API; cache to data/cache/terms/.

Usage:
    python3 medlineplus-fetch.py "cerebrovascular accident"
    python3 medlineplus-fetch.py "haemorrhage" "dyspnoea" "thrombosis"
    python3 medlineplus-fetch.py --from-cache data/cache/1364430.json
      (reads FAERS top_reactions from a drug cache file and fetches all)

Cached at: data/cache/terms/{slug}.json
"""

import sys, os, json, time, re, argparse
from urllib.request import urlopen, Request
from urllib.parse import quote
from urllib.error import HTTPError, URLError
import xml.etree.ElementTree as ET

CACHE_DIR  = os.path.join(os.path.dirname(__file__), "data", "cache", "terms")
API_BASE   = "https://wsearch.nlm.nih.gov/ws/query"

os.makedirs(CACHE_DIR, exist_ok=True)

# ── Slug ──────────────────────────────────────────────────────────────────────

def slug(term):
    """Normalize term to a safe filename key."""
    return re.sub(r'[^a-z0-9]+', '_', term.lower().strip()).strip('_')


# ── Cache ─────────────────────────────────────────────────────────────────────

def cache_path(term):
    return os.path.join(CACHE_DIR, f"{slug(term)}.json")


def load_cache(term):
    path = cache_path(term)
    if os.path.exists(path):
        with open(path) as f:
            return json.load(f)
    return None


def save_cache(term, data):
    with open(cache_path(term), "w") as f:
        json.dump(data, f, indent=2)


# ── MedlinePlus API ───────────────────────────────────────────────────────────

def _strip_html(text):
    """Remove HTML tags from MedlinePlus summaries."""
    return re.sub(r'<[^>]+>', '', text or '').strip()


def fetch_medlineplus(term):
    """
    Search MedlinePlus Health Topics for term.
    Returns {term, title, summary, url} or {term, title:None, ...} on miss.
    """
    url = f"{API_BASE}?db=healthTopics&term={quote(term)}&retmax=1"
    time.sleep(0.3)
    try:
        req = Request(url, headers={"User-Agent": "scp-optionbox/1.0"})
        with urlopen(req, timeout=15) as r:
            xml_bytes = r.read()
    except (HTTPError, URLError) as e:
        print(f"  Network error for '{term}': {e}", file=sys.stderr)
        return {"term": term, "title": None, "summary": None, "url": None}

    try:
        root = ET.fromstring(xml_bytes)
    except ET.ParseError as e:
        print(f"  XML parse error for '{term}': {e}", file=sys.stderr)
        return {"term": term, "title": None, "summary": None, "url": None}

    # Structure: <nlmSearchResult><list><document url="..."><content name="...">
    doc = root.find('.//document')
    if doc is None:
        return {"term": term, "title": None, "summary": None, "url": None}

    topic_url = doc.get('url', '')
    title, summary = None, None

    for content in doc.findall('content'):
        name = content.get('name', '')
        if name == 'title':
            title = _strip_html(content.text)
        elif name == 'FullSummary' and not summary:
            text = _strip_html(content.text)
            # Take first sentence or up to 220 chars
            first = re.split(r'(?<=[.!?])\s', text)[0]
            summary = first[:280] + ('…' if len(first) > 280 else '')
        elif name == 'snippet' and not summary:
            summary = _strip_html(content.text)[:280]

    return {
        "term":    term,
        "title":   title,
        "summary": summary,
        "url":     topic_url,
    }


# ── Main lookup (with cache) ──────────────────────────────────────────────────

def lookup(term, force=False):
    """Fetch and cache a single term. Returns result dict."""
    if not force:
        cached = load_cache(term)
        if cached:
            return cached

    result = fetch_medlineplus(term)
    save_cache(term, result)

    status = f"→ {result['title']}" if result['title'] else "→ no match"
    print(f"  {term!r:35s} {status}")
    return result


def lookup_many(terms, force=False):
    """Fetch a list of terms; skip duplicates; return list of results."""
    seen = set()
    results = []
    for term in terms:
        key = slug(term)
        if key in seen:
            continue
        seen.add(key)
        results.append(lookup(term, force=force))
    return results


# ── Enrich a drug cache file ──────────────────────────────────────────────────

def enrich_drug_cache(drug_cache_path, force=False):
    """
    Read a drug cache JSON, fetch MedlinePlus definitions for all
    FAERS top_reactions, write them back as faers.term_definitions.
    """
    with open(drug_cache_path) as f:
        drug = json.load(f)

    reactions = [r['term'] for r in drug.get('faers', {}).get('top_reactions', [])]
    if not reactions:
        print("No FAERS reactions found in drug cache.")
        return drug

    print(f"Looking up {len(reactions)} terms for {drug.get('name', drug_cache_path)}…")
    defs = {}
    for r in lookup_many(reactions, force=force):
        defs[r['term']] = {
            "title":   r['title'],
            "summary": r['summary'],
            "url":     r['url'],
        }

    drug['faers']['term_definitions'] = defs

    with open(drug_cache_path, "w") as f:
        json.dump(drug, f, indent=2)

    found = sum(1 for v in defs.values() if v['title'])
    print(f"  Definitions found: {found}/{len(reactions)}")
    return drug


# ── CLI ───────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("terms", nargs="*", help="Term(s) to look up")
    parser.add_argument("--from-cache", metavar="DRUG_JSON",
                        help="Enrich a drug cache file with term definitions")
    parser.add_argument("--force", action="store_true", help="Ignore cache, re-fetch")
    parser.add_argument("--json", action="store_true", help="Print results as JSON")
    args = parser.parse_args()

    if args.from_cache:
        result = enrich_drug_cache(args.from_cache, force=args.force)
        if args.json:
            print(json.dumps(result['faers']['term_definitions'], indent=2))
        return

    if not args.terms:
        parser.print_help()
        return

    results = lookup_many(args.terms, force=args.force)
    if args.json:
        print(json.dumps(results, indent=2))
    else:
        print()
        for r in results:
            print(f"Term:    {r['term']}")
            print(f"Title:   {r['title'] or '(no match)'}")
            print(f"Summary: {r['summary'] or ''}")
            print(f"URL:     {r['url'] or ''}")
            print()

if __name__ == "__main__":
    main()
