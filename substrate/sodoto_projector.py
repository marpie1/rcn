#!/usr/bin/env python3
"""sodoto_projector.py — project SODOTO badge truth into Neo4j (a lens, not a source).

Reads sodoto-badge credentials out of FedWiki portfolio pages and upserts the
teaching graph — Person, Organization, Skill, Credential, GateAttempt, and the
teaching edges (TAUGHT / ATTESTED / HOLDS / ISSUED / CERTIFIES). The badge on the
portfolio stays the source of truth; Neo4j is a queryable lens over it. Issuing a
badge never depends on this running.

Idempotent on (contractId, holderDid) — safe to re-run (MERGE everywhere; re-runs
are no-ops). Not contractId alone: before Sep 2026 the issuer numbered contracts
per browser, so two browsers could give two different people's badges the same
contractId, and keying on it merged Kerry Turner's EIP Basic into Marc's. The
holder is what makes a badge's identity unique; --check warns about any shared IDs.
No (:Debt) node: debt/value is the separate currency layer (CfA-dSC), not SODOTO
provenance. See project_signed_substrate_no_chain / the SODOTO reference doc.

Usage:
    python3 substrate/sodoto_projector.py             # project the default wiki
    python3 substrate/sodoto_projector.py --pages DIR # a specific pages folder
    python3 substrate/sodoto_projector.py --check      # dry run — what would project (no Neo4j needed)
    python3 substrate/sodoto_projector.py --summary    # project, then print a lineage summary
    python3 substrate/sodoto_projector.py --rebuild    # clear this projector's nodes/edges, then project

Credentials for Neo4j come from ~/rcn/.env.neo4j via db.py (stdlib, Desktop only).
"""
import os, sys, json, glob, argparse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

DEFAULT_PAGES = os.path.expanduser(os.environ.get('WIKI_PAGES', '~/.wiki/localhost/pages'))
GATES = ['SeeOne', 'DoOne', 'TeachOne']

# One idempotent statement per credential. $cred is a flat map; $gates a list of
# completed-gate maps. Re-running MERGEs the same nodes/edges — no duplicates.
CYPHER = """
MERGE (org:Organization {did: $cred.issuerDid})
  SET org.name = coalesce($cred.issuer, org.name)
MERGE (learner:Person {did: $cred.holderDid})
  SET learner.name = coalesce($cred.holderName, learner.name)
MERGE (skill:Skill {name: $cred.skill})
MERGE (c:Credential {contractId: $cred.contractId, holderDid: $cred.holderDid})
  SET c.skill = $cred.skill, c.issuedAt = $cred.issuedAt, c.version = $cred.version,
      c.issuerDid = $cred.issuerDid, c.holderDid = $cred.holderDid,
      c.contractHash = $cred.contractHash, c.partial = $cred.partial,
      c.learnerAttested = $cred.learnerAttested
MERGE (org)-[:ISSUED]->(c)
MERGE (learner)-[:HOLDS]->(c)
MERGE (c)-[:CERTIFIES]->(skill)
WITH c, learner
UNWIND $gates AS g
  MERGE (m:Person {did: g.mentorDid})
    SET m.name = coalesce(g.mentorName, m.name)
  MERGE (m)-[att:ATTESTED {contractId: $cred.contractId, gate: g.gate}]->(learner)
    SET att.completedAt = g.completedAt
  MERGE (m)-[:TAUGHT {contractId: $cred.contractId, skill: $cred.skill}]->(learner)
  MERGE (ga:GateAttempt {contractId: $cred.contractId, holderDid: $cred.holderDid, gate: g.gate})
    SET ga.completedAt = g.completedAt, ga.attempts = g.attempts,
        ga.learnerAttested = g.learnerAttested
  MERGE (c)-[:HAS_GATE]->(ga)
  MERGE (learner)-[:ASSERTED {gate: g.gate}]->(ga)
  MERGE (m)-[:WITNESSED {gate: g.gate}]->(ga)
  FOREACH (_ IN CASE WHEN g.studentDid IS NOT NULL THEN [1] ELSE [] END |
    MERGE (st:Person {did: g.studentDid})
      SET st.name = coalesce(g.studentName, st.name)
    MERGE (learner)-[:TAUGHT {contractId: $cred.contractId, skill: $cred.skill}]->(st)
    MERGE (st)-[:ASSERTED {gate: g.gate}]->(ga)
  )
"""


def collect_credentials(pages_dir):
    """Every sodoto-badge credential across the pages folder, as (source, cred)."""
    out = []
    for path in sorted(glob.glob(os.path.join(pages_dir, '*'))):
        if os.path.isdir(path):
            continue
        try:
            with open(path, encoding='utf-8') as fh:
                page = json.load(fh)
        except (ValueError, OSError):
            continue
        for item in page.get('story', []):
            if item.get('type') == 'sodoto-badge' and item.get('credential'):
                out.append((os.path.basename(path), item['credential']))
    return out


def shared_contract_ids(creds):
    """contractIds carried by badges of more than one holder: {contractId: [holder names]}."""
    holders = {}
    for c in creds:
        holders.setdefault(c.get('contractId'), {})[c.get('holderDid')] = c.get('holderName') or c.get('holderDid')
    return {cid: sorted(h.values()) for cid, h in holders.items() if len(h) > 1}


# Everything this projector creates that --rebuild may remove. Person, Organization
# and Skill are left alone: they are shared, and MERGE brings them straight back.
REBUILD = [
    "MATCH ()-[r:TAUGHT|ATTESTED]->() WHERE r.contractId IS NOT NULL DELETE r",
    "MATCH (ga:GateAttempt) DETACH DELETE ga",
    "MATCH (c:Credential) DETACH DELETE c",
]


def projectable(cred):
    return bool(cred.get('contractId') and cred.get('issuerDid') and cred.get('holderDid'))


def to_params(cred):
    gates = []
    for gate in GATES:
        g = (cred.get('gates') or {}).get(gate)
        if not g or not g.get('completedAt'):
            continue
        mentor = g.get('mentor') or {}
        student = g.get('student') or {}
        gates.append({
            'gate': gate,
            'completedAt': g.get('completedAt'),
            'mentorDid': mentor.get('did'),
            'mentorName': mentor.get('name'),
            'studentDid': student.get('did') or None,
            'studentName': student.get('name'),
            'attempts': len(g.get('attempts') or []),
            'learnerAttested': bool(g.get('learnerJwt')),
        })
    cparams = {
        'issuerDid': cred.get('issuerDid'), 'issuer': cred.get('issuer'),
        'holderDid': cred.get('holderDid'), 'holderName': cred.get('holderName'),
        'skill': cred.get('skill'), 'contractId': cred.get('contractId'),
        'issuedAt': cred.get('issuedAt'), 'contractHash': cred.get('contractHash'),
        'version': cred.get('version') or '0.3',
        'partial': bool(cred.get('partial')),
        'learnerAttested': bool(cred.get('learnerAttested')),
    }
    return {'cred': cparams, 'gates': gates}


def print_summary(run):
    print("\n— teaching graph —")
    counts = [
        ("credentials", "MATCH (c:Credential) RETURN count(c) AS c"),
        ("people",      "MATCH (p:Person) RETURN count(p) AS c"),
        ("skills",      "MATCH (s:Skill) RETURN count(s) AS c"),
        ("TAUGHT edges","MATCH ()-[t:TAUGHT]->() RETURN count(t) AS c"),
    ]
    for label, q in counts:
        print(f"  {label:<14} {run(q)[0]['c']}")
    print("  most active mentors:")
    rows = run("MATCH (m:Person)-[:TAUGHT]->(l:Person) "
               "RETURN m.name AS mentor, count(DISTINCT l) AS learners "
               "ORDER BY learners DESC, mentor LIMIT 5")
    for r in rows:
        print(f"    {r['learners']:>2}  {r.get('mentor') or '(unnamed)'}")


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--pages', default=DEFAULT_PAGES, help='FedWiki pages folder to read')
    ap.add_argument('--check', action='store_true', help='dry run: list what would project (no Neo4j)')
    ap.add_argument('--summary', action='store_true', help='after projecting, print a lineage summary')
    ap.add_argument('--rebuild', action='store_true', help="clear this projector's credentials, gate attempts and teaching edges, then project")
    args = ap.parse_args()

    if not os.path.isdir(args.pages):
        sys.exit(f"pages folder not found: {args.pages}")

    found = collect_credentials(args.pages)
    good = [(src, c) for src, c in found if projectable(c)]
    skipped = len(found) - len(good)
    print(f"found {len(found)} badge(s) in {args.pages} — {len(good)} projectable, {skipped} skipped")
    for cid, names in shared_contract_ids([c for _s, c in good]).items():
        print(f"  WARNING: {cid} is used by {len(names)} different holders' badges ({', '.join(names)}) — kept apart by holder")

    if args.check:
        for _src, c in good:
            gates = [g for g in GATES if ((c.get('gates') or {}).get(g) or {}).get('completedAt')]
            who = c.get('holderName') or (c.get('holderDid') or '')[:16]
            print(f"  {c.get('contractId'):<34} {(c.get('skill') or '')[:26]:<26} "
                  f"{who:<18} gates={','.join(gates) or '-':<20} v{c.get('version') or '0.3'}")
        return

    from db import run  # imported here so --check needs no Neo4j / .env.neo4j
    if args.rebuild:
        for q in REBUILD:
            run(q)
        print("cleared this projector's credentials, gate attempts and teaching edges")
    projected = 0
    for _src, c in good:
        try:
            run(CYPHER, to_params(c))
            projected += 1
        except Exception as exc:  # noqa: BLE001 — report and continue over the batch
            print(f"  ! {c.get('contractId')}: {exc}")
    print(f"projected {projected} credential(s) into Neo4j (idempotent).")

    if args.summary:
        print_summary(run)


if __name__ == '__main__':
    main()
