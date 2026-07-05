#!/usr/bin/env python3
"""
drug-interactions.py — check drug-drug interactions for all drugs in an option box,
and optionally against the patient's current FHIR medications.

Usage:
    python drug-interactions.py data/nnt-library/af-anticoagulation.json
    python drug-interactions.py --rxcuis 1364435 11289            # apixaban + warfarin
    python drug-interactions.py data/nnt-library/af-anticoagulation.json --fhir

The --fhir flag also checks each drug option against the patient's current meds
(reads ../scp-fhir/data/scp-import.json).
"""

import sys, os, json, time, argparse
from urllib.request import urlopen, Request
from urllib.parse import quote
from urllib.error import HTTPError, URLError
from itertools import combinations

RXNORM_BASE = "https://rxnav.nlm.nih.gov/REST"
FHIR_IMPORT = os.path.join(os.path.dirname(__file__), "..", "scp-fhir", "data", "scp-import.json")


# ── HTTP ──────────────────────────────────────────────────────────────────────

def get_json(url, delay=0.3):
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
    except Exception as e:
        print(f"  Error: {e}", file=sys.stderr)
        return None


# ── RxNorm interaction API ────────────────────────────────────────────────────

def check_pair(rxcui_a, rxcui_b, name_a=None, name_b=None):
    """
    Check a single drug pair via RxNorm interaction API.
    Returns list of interaction dicts or [].
    """
    url = f"{RXNORM_BASE}/interaction/list.json?rxcuis={rxcui_a}+{rxcui_b}"
    data = get_json(url)
    if not data:
        return []

    interactions = []
    full_list = data.get("fullInteractionTypeGroup", [])
    for group in full_list:
        source = group.get("sourceName", "")
        for itype in group.get("fullInteractionType", []):
            comment = itype.get("comment", "")
            for pair in itype.get("interactionPair", []):
                severity   = pair.get("severity", "unknown")
                description = pair.get("description", "")
                concepts   = pair.get("interactionConcept", [])
                drug_names = []
                for c in concepts:
                    mn = c.get("minConceptItem", {}).get("name", "")
                    if mn:
                        drug_names.append(mn.lower())
                interactions.append({
                    "drug_a":      name_a or rxcui_a,
                    "drug_b":      name_b or rxcui_b,
                    "rxcui_a":     rxcui_a,
                    "rxcui_b":     rxcui_b,
                    "severity":    severity,
                    "description": description,
                    "comment":     comment,
                    "source":      source,
                })
    return interactions


def check_many(pairs):
    """
    pairs: list of (rxcui, name) tuples.
    Returns all interactions found across all combinations.
    """
    results = []
    combos = list(combinations(pairs, 2))
    print(f"Checking {len(combos)} drug pair(s)…")
    for (rxcui_a, name_a), (rxcui_b, name_b) in combos:
        found = check_pair(rxcui_a, rxcui_b, name_a, name_b)
        if found:
            print(f"  {name_a} × {name_b}: {len(found)} interaction(s)")
            results.extend(found)
        else:
            print(f"  {name_a} × {name_b}: none found")
    return results


# ── Option box drug extraction ────────────────────────────────────────────────

def drugs_from_optionbox(path):
    """Return list of (rxcui, label) for drug-type options in an option box JSON."""
    with open(path) as f:
        data = json.load(f)
    drugs = []
    for opt in data.get("options", []):
        if opt.get("type") == "drug" and opt.get("rxnorm"):
            drugs.append((opt["rxnorm"], opt.get("label", opt["id"])))
    return drugs


# ── FHIR medication extraction ────────────────────────────────────────────────

def drugs_from_fhir():
    """
    Read ../scp-fhir/data/scp-import.json and extract medications
    that have an rxnorm field. Returns list of (rxcui, name).
    """
    if not os.path.exists(FHIR_IMPORT):
        print(f"FHIR import not found at {FHIR_IMPORT}", file=sys.stderr)
        return []

    with open(FHIR_IMPORT) as f:
        data = json.load(f)

    meds = []
    for entry in data.get("entries", []):
        if entry.get("entry_type") == "Medication" and entry.get("rxnorm"):
            meds.append((entry["rxnorm"], entry.get("text", entry["rxnorm"])))
    return meds


# ── Severity ranking ──────────────────────────────────────────────────────────

SEVERITY_RANK = {"high": 3, "moderate": 2, "low": 1, "unknown": 0,
                 "n/a": 0, "na": 0}

def rank_severity(s):
    return SEVERITY_RANK.get(s.lower(), 0)


def print_report(interactions, title="Interaction Report"):
    print(f"\n{'─'*60}")
    print(f"  {title}")
    print(f"{'─'*60}")
    if not interactions:
        print("  No interactions found.")
        return

    # sort by severity descending
    interactions.sort(key=lambda x: rank_severity(x["severity"]), reverse=True)
    for ix in interactions:
        sev = ix["severity"].upper()
        print(f"\n  [{sev}] {ix['drug_a']}  ×  {ix['drug_b']}")
        print(f"         {ix['description']}")
        if ix.get("comment"):
            print(f"         Note: {ix['comment']}")
        print(f"         Source: {ix['source']}")


# ── CLI ───────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("optionbox", nargs="?", help="Path to option box JSON")
    parser.add_argument("--rxcuis", nargs="+", help="RxCUI list to check directly")
    parser.add_argument("--fhir", action="store_true",
                        help="Also check against patient's FHIR medications")
    parser.add_argument("--json", action="store_true", help="Output JSON instead of report")
    args = parser.parse_args()

    # Collect drug pairs
    option_drugs = []
    if args.optionbox:
        option_drugs = drugs_from_optionbox(args.optionbox)
        print(f"Option box drugs: {[n for _, n in option_drugs]}")
    elif args.rxcuis:
        option_drugs = [(rxcui, rxcui) for rxcui in args.rxcuis]
    else:
        parser.print_help()
        return

    fhir_drugs = []
    if args.fhir:
        fhir_drugs = drugs_from_fhir()
        print(f"Patient FHIR meds: {[n for _, n in fhir_drugs]}")

    # Interactions among option drugs
    all_interactions = []
    if len(option_drugs) >= 2:
        ix = check_many(option_drugs)
        for i in ix:
            i["context"] = "option-vs-option"
        all_interactions.extend(ix)

    # Interactions: each option drug vs patient meds
    if fhir_drugs:
        print(f"\nChecking {len(option_drugs)} option drug(s) against {len(fhir_drugs)} patient med(s)…")
        for (opt_rxcui, opt_name) in option_drugs:
            for (med_rxcui, med_name) in fhir_drugs:
                ix = check_pair(opt_rxcui, med_rxcui, opt_name, med_name)
                for i in ix:
                    i["context"] = "option-vs-patient-med"
                if ix:
                    print(f"  {opt_name} × {med_name}: {len(ix)} interaction(s)")
                all_interactions.extend(ix)

    if args.json:
        print(json.dumps(all_interactions, indent=2))
    else:
        # Group by context
        opt_ix  = [i for i in all_interactions if i.get("context") == "option-vs-option"]
        fhir_ix = [i for i in all_interactions if i.get("context") == "option-vs-patient-med"]
        print_report(opt_ix,  "Option Drug–Drug Interactions")
        if fhir_drugs:
            print_report(fhir_ix, "Option vs Patient Medication Interactions")

        total = len(all_interactions)
        high  = sum(1 for i in all_interactions if rank_severity(i["severity"]) >= 3)
        print(f"\n  Total: {total} interaction(s), {high} high-severity")

if __name__ == "__main__":
    main()
