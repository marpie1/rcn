#!/usr/bin/env python3
"""
db.py — the one way this project talks to Neo4j.

No driver dependency: Neo4j 5.x exposes a Cypher-over-HTTP endpoint
(/db/<name>/query/v2) that speaks plain JSON. Keeping it to stdlib means the
substrate has no install step, matching sofi-proxy.py and coupler-proxy.py.

Usage:
    python3 substrate/db.py -q "MATCH (n) RETURN count(n)"
    python3 substrate/db.py -f substrate/some.cypher
    python3 substrate/db.py --check          # environment + content summary

Credentials come from ~/rcn/.env.neo4j (gitignored). Never inline them here.
"""
import json, os, sys, urllib.request, urllib.error, base64, argparse

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_PATH = os.path.join(BASE, '.env.neo4j')


def load_env(path=ENV_PATH):
    # Two homes for the credentials, one precedence: the process environment
    # wins, then ~/rcn/.env.neo4j. A laptop has the file; the steward stack
    # (deploy/steward/) has only environment variables, set by docker compose.
    # Neither is required if the other is present.
    env = {}
    if os.path.exists(path):
        with open(path) as fh:
            for line in fh:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    env[k.strip()] = v.strip()
    for k in ('NEO4J_HTTP', 'NEO4J_USER', 'NEO4J_PASSWORD', 'NEO4J_DATABASE'):
        if os.environ.get(k):
            env[k] = os.environ[k]
    if not env.get('NEO4J_PASSWORD'):
        sys.exit(f"no Neo4j credentials — set NEO4J_PASSWORD in the environment "
                 f"or write {path}; see substrate/README.md")
    return env


ENV = load_env()
HTTP = ENV.get('NEO4J_HTTP', 'http://localhost:7474')
USER = ENV.get('NEO4J_USER', 'neo4j')
PASSWORD = ENV.get('NEO4J_PASSWORD', '')
DATABASE = ENV.get('NEO4J_DATABASE', 'neo4j')


def run(statement, params=None, database=None):
    """Run one Cypher statement. Returns list of dict rows. Raises on error."""
    db = database or DATABASE
    body = {"statement": statement}
    if params:
        body["parameters"] = params
    req = urllib.request.Request(
        f"{HTTP}/db/{db}/query/v2",
        data=json.dumps(body).encode(),
        headers={
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Basic ' + base64.b64encode(
                f"{USER}:{PASSWORD}".encode()).decode(),
        })
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            payload = json.load(resp)
    except urllib.error.HTTPError as e:
        detail = e.read().decode()[:500]
        raise RuntimeError(f"HTTP {e.code}: {detail}") from None
    except urllib.error.URLError as e:
        raise RuntimeError(
            f"cannot reach {HTTP} — is the DBMS running in Neo4j Desktop? ({e.reason})"
        ) from None
    if 'errors' in payload and payload['errors']:
        raise RuntimeError(json.dumps(payload['errors'], indent=2))
    data = payload.get('data', {})
    fields = data.get('fields', [])
    return [dict(zip(fields, row)) for row in data.get('values', [])]


def run_file(path):
    """Run a .cypher file. Statements separated by lines containing only ';'."""
    with open(path) as fh:
        text = fh.read()
    stmts, buf = [], []
    for line in text.splitlines():
        if line.strip() == ';':
            if buf:
                stmts.append('\n'.join(buf))
            buf = []
        else:
            buf.append(line)
    if [b for b in buf if b.strip()]:
        stmts.append('\n'.join(buf))
    out = []
    for s in stmts:
        stripped = '\n'.join(
            l for l in s.splitlines() if not l.strip().startswith('//'))
        if stripped.strip():
            out.append(run(stripped))
    return out


def check():
    print(f"endpoint  {HTTP}  db={DATABASE}")
    v = run("CALL dbms.components() YIELD name,versions,edition "
            "RETURN versions[0] AS version, edition")[0]
    print(f"server    Neo4j {v['version']} {v['edition']}")
    for label, q in [
        ("concepts", "MATCH (n:Concept) RETURN count(n) AS c"),
        ("instances", "MATCH (n:Instance) RETURN count(n) AS c"),
        ("families", "MATCH (n:Family) RETURN count(n) AS c"),
        ("REL edges", "MATCH ()-[r:REL]->() RETURN count(r) AS c"),
    ]:
        print(f"{label:<10} {run(q)[0]['c']}")


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('-q', '--query')
    ap.add_argument('-f', '--file')
    ap.add_argument('--check', action='store_true')
    a = ap.parse_args()
    if a.check:
        check()
    elif a.query:
        print(json.dumps(run(a.query), indent=2))
    elif a.file:
        for rows in run_file(a.file):
            if rows:
                print(json.dumps(rows, indent=2))
        print("ok")
    else:
        ap.print_help()
