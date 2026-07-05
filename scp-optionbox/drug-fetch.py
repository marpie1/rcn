#!/usr/bin/env python3
"""
drug-fetch.py — resolve a drug name to RxCUI, fetch openFDA label + FAERS data, cache result.

Usage:
    python drug-fetch.py "apixaban"
    python drug-fetch.py --rxcui 1364435
    python drug-fetch.py "apixaban" "warfarin"   # fetch multiple

Cached at: data/cache/{rxcui}.json
"""

import sys, os, json, time, hashlib, argparse
from urllib.request import urlopen, Request
from urllib.parse import quote
from urllib.error import HTTPError, URLError
from datetime import datetime, timezone

CACHE_DIR = os.path.join(os.path.dirname(__file__), "data", "cache")
RXNORM_BASE  = "https://rxnav.nlm.nih.gov/REST"
OPENFDA_BASE = "https://api.fda.gov/drug"

os.makedirs(CACHE_DIR, exist_ok=True)

# ── HTTP helpers ──────────────────────────────────────────────────────────────

def get_json(url, delay=0.25):
    """GET JSON with a small polite delay. Returns parsed dict or None."""
    time.sleep(delay)
    try:
        req = Request(url, headers={"Accept": "application/json",
                                    "User-Agent": "scp-optionbox/1.0"})
        with urlopen(req, timeout=15) as r:
            return json.loads(r.read().decode())
    except HTTPError as e:
        if e.code == 404:
            return None
        print(f"  HTTP {e.code}: {url}", file=sys.stderr)
        return None
    except (URLError, Exception) as e:
        print(f"  Error: {e} — {url}", file=sys.stderr)
        return None


# ── RxNorm ────────────────────────────────────────────────────────────────────

def resolve_rxcui(name):
    """Drug name → RxCUI (ingredient-level). Returns str or None."""
    url = f"{RXNORM_BASE}/rxcui.json?name={quote(name)}&search=1"
    data = get_json(url)
    if not data:
        return None
    rxcui = data.get("idGroup", {}).get("rxnormId", [None])[0]
    if rxcui:
        return rxcui
    # fallback: approximate match
    url2 = f"{RXNORM_BASE}/approximateTerm.json?term={quote(name)}&maxEntries=1"
    data2 = get_json(url2)
    if not data2:
        return None
    candidates = data2.get("approximateGroup", {}).get("candidate", [])
    return candidates[0]["rxcui"] if candidates else None


def rxcui_info(rxcui):
    """Return {name, brand_names, tty} for a RxCUI."""
    url = f"{RXNORM_BASE}/rxcui/{rxcui}/properties.json"
    data = get_json(url)
    if not data:
        return {"name": None, "brand_names": [], "tty": None}
    props = data.get("properties", {})
    name = props.get("name", "")
    tty  = props.get("tty", "")

    # brand names: related IN/BN
    brands = []
    url2 = f"{RXNORM_BASE}/rxcui/{rxcui}/related.json?tty=BN"
    data2 = get_json(url2)
    if data2:
        groups = data2.get("relatedGroup", {}).get("conceptGroup", [])
        for g in groups:
            for c in g.get("conceptProperties", []):
                n = c.get("name", "")
                if n and n not in brands:
                    brands.append(n)

    return {"name": name.lower(), "brand_names": brands[:5], "tty": tty}


# ── openFDA label ─────────────────────────────────────────────────────────────

LABEL_FIELDS = [
    "boxed_warning",
    "warnings_and_cautions",
    "warnings",
    "adverse_reactions",
    "drug_interactions",
    "contraindications",
    "indications_and_usage",
]

FIELD_CHAR_LIMITS = {
    "boxed_warning":        6000,   # safety-critical — don't cut
    "warnings_and_cautions": 2000,
    "warnings":             2000,
    "adverse_reactions":    1500,
    "drug_interactions":    1500,
    "contraindications":    1500,
    "indications_and_usage": 800,
}

def _truncate(text_list, chars):
    """openFDA returns lists of strings; join and truncate."""
    if not text_list:
        return None
    text = " ".join(text_list)
    return text[:chars] + "…" if len(text) > chars else text


def fetch_label(name):
    """Fetch openFDA drug label by generic name. Returns dict of key fields."""
    url = (f"{OPENFDA_BASE}/label.json"
           f"?search=openfda.generic_name:{quote(name)}&limit=1")
    data = get_json(url)
    if not data or not data.get("results"):
        return {}

    r = data["results"][0]
    # stash the openfda RxCUIs (SCD-level) for future reference
    openfda_rxcuis = r.get("openfda", {}).get("rxcui", [])
    result = {"openfda_rxcuis": openfda_rxcuis}
    for field in LABEL_FIELDS:
        limit = FIELD_CHAR_LIMITS.get(field, 1000)
        val = _truncate(r.get(field), limit)
        if val:
            result[field] = val
    return result


# ── FAERS ─────────────────────────────────────────────────────────────────────

def fetch_faers(name, top_n=20):
    """Fetch top adverse reactions from FAERS for this drug name."""
    search = f"patient.drug.openfda.generic_name:{quote(name)}"

    # total report count (separate search — count endpoint doesn't return meta.total)
    total_url = f"{OPENFDA_BASE}/event.json?search={search}&limit=1"
    total_data = get_json(total_url)
    total = (total_data or {}).get("meta", {}).get("results", {}).get("total", 0)

    # top reactions by frequency
    count_url = (f"{OPENFDA_BASE}/event.json"
                 f"?search={search}"
                 f"&count=patient.reaction.reactionmeddrapt.exact&limit={top_n}")
    count_data = get_json(count_url)
    if not count_data or not count_data.get("results"):
        return {"total_reports": total, "top_reactions": []}

    reactions = [
        {"term": r["term"].lower(), "count": r["count"]}
        for r in count_data["results"][:top_n]
    ]
    return {"total_reports": total, "top_reactions": reactions}


# ── Cache ─────────────────────────────────────────────────────────────────────

def cache_path(rxcui):
    return os.path.join(CACHE_DIR, f"{rxcui}.json")


def load_cache(rxcui):
    path = cache_path(rxcui)
    if os.path.exists(path):
        with open(path) as f:
            return json.load(f)
    return None


def save_cache(rxcui, data, write_aliases=False):
    with open(cache_path(rxcui), "w") as f:
        json.dump(data, f, indent=2)
    if write_aliases:
        _write_aliases(rxcui, data)


def _write_aliases(rxcui, data):
    """Write alias files for SCD-level RxCUIs and drug name — call after final enrichment."""
    aliases = list(data.get("label", {}).get("openfda_rxcuis", []))
    if data.get("name"):
        aliases.append(data["name"].lower().replace(" ", "_"))
    for alias in aliases:
        if alias != rxcui:
            alias_path = os.path.join(CACHE_DIR, f"{alias}.json")
            with open(alias_path, "w") as f:
                json.dump(data, f, indent=2)


# ── Main fetch ────────────────────────────────────────────────────────────────

def fetch(name=None, rxcui=None, force=False):
    """
    Resolve name → rxcui if needed, fetch label + FAERS, write cache.
    Returns the cached dict.
    """
    if not rxcui:
        if not name:
            raise ValueError("Provide name or rxcui")
        print(f"Resolving RxCUI for '{name}'…")
        rxcui = resolve_rxcui(name)
        if not rxcui:
            print(f"  Could not resolve RxCUI for '{name}'", file=sys.stderr)
            return None
        print(f"  → RxCUI {rxcui}")

    if not force:
        cached = load_cache(rxcui)
        if cached:
            age_h = (datetime.now(timezone.utc).timestamp() -
                     datetime.fromisoformat(cached["fetched_at"]).timestamp()) / 3600
            print(f"Cache hit for {rxcui} ({age_h:.0f}h old)")
            return cached

    print(f"Fetching RxNorm info for {rxcui}…")
    info = rxcui_info(rxcui)
    display_name = name or info["name"] or rxcui

    print(f"Fetching openFDA label for {display_name}…")
    label = fetch_label(info["name"] or display_name)

    print(f"Fetching FAERS events for {display_name}…")
    faers = fetch_faers(info["name"] or display_name)

    result = {
        "rxcui":       rxcui,
        "name":        info["name"] or display_name,
        "brand_names": info["brand_names"],
        "tty":         info["tty"],
        "fetched_at":  datetime.now(timezone.utc).isoformat(),
        "label":       label,
        "faers":       faers,
    }
    save_cache(rxcui, result)  # write canonical; aliases deferred until after enrichment

    # Enrich FAERS reactions with MedlinePlus plain-language definitions
    print(f"Fetching MedlinePlus definitions for FAERS terms…")
    import medlineplus_fetch
    medlineplus_fetch.enrich_drug_cache(cache_path(rxcui))
    # Reload enriched result, then write aliases with full data
    result = load_cache(rxcui)
    _write_aliases(rxcui, result)

    has_bw = bool(label.get("boxed_warning"))
    reactions = result.get("faers", {}).get("top_reactions", [])
    defs = result.get("faers", {}).get("term_definitions", {})
    print(f"  Cached: {faers['total_reports']:,} FAERS reports, "
          f"{len(reactions)} reactions, "
          f"{sum(1 for v in defs.values() if v.get('title'))} definitions, "
          f"boxed_warning={'YES' if has_bw else 'no'}")
    return result


# ── CLI ───────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("names", nargs="*", help="Drug name(s) to fetch")
    parser.add_argument("--rxcui", help="Fetch by RxCUI directly (single drug)")
    parser.add_argument("--force", action="store_true", help="Ignore cache, re-fetch")
    parser.add_argument("--json", action="store_true", help="Print result JSON to stdout")
    args = parser.parse_args()

    if args.rxcui:
        result = fetch(rxcui=args.rxcui, force=args.force)
        if result and args.json:
            print(json.dumps(result, indent=2))
        return

    if not args.names:
        parser.print_help()
        return

    for name in args.names:
        result = fetch(name=name, force=args.force)
        if result and args.json:
            print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
