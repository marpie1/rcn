#!/usr/bin/env python3
"""
smart-proxy.py — SMART on FHIR proxy for SCP
Port 8767, HTTPS (requires localhost.pem + localhost-key.pem from mkcert)

Setup:
  brew install mkcert && mkcert -install && mkcert localhost
  mv localhost.pem localhost-key.pem scp-fhir/
  python3 scp-fhir/smart-proxy.py
"""

import base64, datetime, hashlib, json, secrets, socketserver, ssl
import sys, threading, urllib.error, urllib.parse, urllib.request
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

# ── Config ────────────────────────────────────────────────────────────────────
HERE     = Path(__file__).parent
DATA_RAW = HERE / 'data' / 'raw'
DATA_RAW.mkdir(parents=True, exist_ok=True)

cfg_path = HERE / 'config.json'
if not cfg_path.exists():
    print('config.json not found — copy config.json.example and fill in client IDs')
    sys.exit(1)

cfg          = json.loads(cfg_path.read_text())
ENV          = cfg.get('env', 'sandbox')
CLIENT_ID    = cfg[ENV]['client_id']
FHIR_BASE    = cfg[ENV]['fhir_base'].rstrip('/') + '/'
REDIRECT_URI = cfg['redirect_uri']
PORT         = 8767

# ── PKCE helpers ──────────────────────────────────────────────────────────────
def pkce_pair():
    verifier  = secrets.token_urlsafe(96)
    digest    = hashlib.sha256(verifier.encode()).digest()
    challenge = base64.urlsafe_b64encode(digest).rstrip(b'=').decode()
    return verifier, challenge

# ── FHIR / OAuth helpers ──────────────────────────────────────────────────────
def discover():
    url = FHIR_BASE + '.well-known/smart-configuration'
    req = urllib.request.Request(url, headers={'Accept': 'application/json'})
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.load(r)

def fhir_get(url, token):
    req = urllib.request.Request(url, headers={
        'Authorization': f'Bearer {token}',
        'Accept':        'application/fhir+json',
    })
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

def fetch_pages(path, token):
    """Fetch a FHIR search result, following Bundle next-page links."""
    entries, url = [], FHIR_BASE + path.lstrip('/')
    while url:
        bundle = fhir_get(url, token)
        entries.extend(bundle.get('entry', []))
        url = next((l['url'] for l in bundle.get('link', [])
                    if l.get('relation') == 'next'), None)
    return entries

# ── Resource pull ─────────────────────────────────────────────────────────────
# Epic quirks: Observation and CarePlan require category; never omit aud on auth
QUERIES = [
    ('Condition',          'Condition?patient={pid}&category=problem-list-item'),
    ('MedicationRequest',  'MedicationRequest?patient={pid}'),
    ('AllergyIntolerance', 'AllergyIntolerance?patient={pid}'),
    ('Observation_lab',    'Observation?patient={pid}&category=laboratory'),
    ('Observation_vital',  'Observation?patient={pid}&category=vital-signs'),
    ('DiagnosticReport',   'DiagnosticReport?patient={pid}'),
    ('Immunization',       'Immunization?patient={pid}'),
    ('Procedure',          'Procedure?patient={pid}'),
    ('DocumentReference',  'DocumentReference?patient={pid}'),
    ('CarePlan',           'CarePlan?patient={pid}&category=assess-plan'),
    ('Goal',               'Goal?patient={pid}'),
]

def pull_all(patient_id, token):
    summary = {}

    # Patient (single resource, not a search)
    try:
        patient = fhir_get(f'{FHIR_BASE}Patient/{patient_id}', token)
        (DATA_RAW / 'Patient.json').write_text(json.dumps(patient, indent=2))
        summary['Patient'] = 1
        print(f'  Patient ✓')
    except Exception as e:
        summary['Patient'] = f'ERROR: {e}'
        print(f'  Patient ✗ {e}')

    # Search resources
    for name, tmpl in QUERIES:
        try:
            entries = fetch_pages(tmpl.format(pid=patient_id), token)
            (DATA_RAW / f'{name}.json').write_text(json.dumps(entries, indent=2))
            summary[name] = len(entries)
            print(f'  {name}: {len(entries)}')
        except Exception as e:
            summary[name] = f'ERROR: {e}'
            print(f'  {name} ✗ {e}')

    summary['pulled_at'] = datetime.datetime.now().isoformat()
    (DATA_RAW / '_summary.json').write_text(json.dumps(summary, indent=2))
    return summary

# ── Server ────────────────────────────────────────────────────────────────────
class FHIRServer(socketserver.ThreadingMixIn, HTTPServer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._lock        = threading.Lock()
        self.discovery    = None
        self.pkce_verifier = None
        self.oauth_state  = None
        self.token_data   = None
        self.patient_id   = None
        self.pull_summary = None

class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print(f'  {self.path} — {fmt % args}')

    def send_html(self, html, status=200):
        body = html.encode()
        self.send_response(status)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', len(body))
        self.end_headers()
        self.wfile.write(body)

    def send_json(self, data, status=200):
        body = json.dumps(data, indent=2).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', len(body))
        self.end_headers()
        self.wfile.write(body)

    def redirect(self, url):
        self.send_response(302)
        self.send_header('Location', url)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        params = dict(urllib.parse.parse_qsl(parsed.query))
        srv    = self.server
        route  = parsed.path

        if   route == '/':         self.send_html(self.page_home())
        elif route == '/launch':   self.route_launch(srv)
        elif route == '/callback': self.route_callback(srv, params)
        elif route == '/status':
            with srv._lock:
                self.send_json({
                    'connected':    srv.token_data is not None,
                    'patient_id':   srv.patient_id,
                    'pull_summary': srv.pull_summary,
                    'env':          ENV,
                })
        elif route == '/data':
            f = DATA_RAW / '_summary.json'
            self.send_json(json.loads(f.read_text()) if f.exists()
                           else {'error': 'No data pulled yet'}, 200 if f.exists() else 404)
        else:
            self.send_html('<h1>404</h1>', 404)

    # ── /launch ───────────────────────────────────────────────────────────────
    def route_launch(self, srv):
        if not srv.discovery:
            try:
                srv.discovery = discover()
                print('OAuth endpoints discovered')
            except Exception as e:
                self.send_html(f'<pre>Discovery failed: {e}</pre>', 500)
                return

        verifier, challenge = pkce_pair()
        state = secrets.token_urlsafe(16)

        with srv._lock:
            srv.pkce_verifier = verifier
            srv.oauth_state   = state

        params = urllib.parse.urlencode({
            'response_type':         'code',
            'client_id':             CLIENT_ID,
            'redirect_uri':          REDIRECT_URI,
            'scope':                 'openid fhirUser patient/*.read',
            'state':                 state,
            'aud':                   FHIR_BASE,          # required by Epic
            'code_challenge':        challenge,
            'code_challenge_method': 'S256',
        })
        self.redirect(f'{srv.discovery["authorization_endpoint"]}?{params}')

    # ── /callback ─────────────────────────────────────────────────────────────
    def route_callback(self, srv, params):
        error = params.get('error')
        if error:
            desc = params.get('error_description', '')
            self.send_html(f'<pre>Auth error: {error}\n{desc}</pre>', 400)
            return

        code           = params.get('code')
        returned_state = params.get('state')

        with srv._lock:
            expected_state = srv.oauth_state
            verifier       = srv.pkce_verifier

        if returned_state != expected_state:
            self.send_html('<pre>State mismatch — possible CSRF, try again</pre>', 400)
            return

        # Exchange code → token
        try:
            data = urllib.parse.urlencode({
                'grant_type':    'authorization_code',
                'code':          code,
                'redirect_uri':  REDIRECT_URI,
                'client_id':     CLIENT_ID,
                'code_verifier': verifier,
            }).encode()
            req = urllib.request.Request(
                srv.discovery['token_endpoint'], data=data,
                headers={'Content-Type': 'application/x-www-form-urlencoded'})
            with urllib.request.urlopen(req, timeout=20) as r:
                token_data = json.load(r)
        except urllib.error.HTTPError as e:
            body = e.read().decode(errors='replace')
            self.send_html(f'<pre>Token exchange failed ({e.code}):\n{body}</pre>', 500)
            return
        except Exception as e:
            self.send_html(f'<pre>Token exchange error: {e}</pre>', 500)
            return

        access_token = token_data.get('access_token')
        patient_id   = token_data.get('patient')

        with srv._lock:
            srv.token_data    = token_data
            srv.patient_id    = patient_id
            srv.pkce_verifier = None
            srv.oauth_state   = None

        print(f'Authenticated — patient_id: {patient_id}')
        print('Pulling FHIR resources...')

        try:
            summary = pull_all(patient_id, access_token)
            with srv._lock:
                srv.pull_summary = summary
            print('Pull complete.')
        except Exception as e:
            print(f'Pull error: {e}')

        # Auto-transform raw bundles → scp-import.json for the coupler
        try:
            import transform
            transform.transform()
            print('Transform complete → data/scp-import.json')
        except Exception as e:
            print(f'Transform error: {e}')

        self.redirect('/')

    # ── Landing page ──────────────────────────────────────────────────────────
    def page_home(self):
        srv = self.server
        with srv._lock:
            connected  = srv.token_data is not None
            patient_id = srv.patient_id
            summary    = srv.pull_summary

        if connected:
            status = f'<div class="status ok">&#9679; Connected — patient <code>{patient_id}</code></div>'
            rows   = ''.join(
                f'<tr class="{"err" if isinstance(v,str) and "ERROR" in v else ""}"><td>{k}</td><td>{v}</td></tr>'
                for k, v in summary.items() if k != 'pulled_at'
            ) if summary else ''
            pulled_at = (summary or {}).get('pulled_at', '')
            action = f'''
              <table class="tbl">{rows}</table>
              <p class="note">Raw bundles → <code>scp-fhir/data/raw/</code> &nbsp;·&nbsp; Pulled {pulled_at[:19]}</p>
              <a class="btn sec" href="/launch">Re-authenticate</a>
              <a class="btn" href="/data" target="_blank">Summary JSON</a>'''
        else:
            status = '<div class="status off">&#9679; Not connected</div>'
            action = '<a class="btn" href="/launch">Connect my record</a>'

        return f'''<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SCP FHIR Connector</title>
<style>
*,*::before,*::after{{box-sizing:border-box;margin:0;padding:0}}
:root{{--navy:#1e3a5f;--nl:#2a4f7c;--bg:#f8f9fa;--s:#fff;--br:#dee2e6;--t:#1a1a2e;--mu:#6c757d;--gr:#2d7a4f;--re:#c0392b}}
body{{font-family:system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--t);line-height:1.6}}
header{{background:var(--navy);color:#fff;padding:.9rem 1.5rem;display:flex;align-items:center;gap:1rem}}
header a{{color:rgba(255,255,255,.7);text-decoration:none;font-size:.82rem}}header a:hover{{color:#fff}}
header h1{{font-size:1rem;font-weight:600;flex:1}}
.badge{{font-size:.7rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;background:rgba(255,255,255,.15);padding:2px 8px;border-radius:3px}}
main{{max-width:600px;margin:2rem auto;padding:0 1.25rem 3rem}}
.card{{background:var(--s);border:1px solid var(--br);border-radius:8px;padding:1.4rem;margin-bottom:1rem}}
h2{{font-size:1.2rem;font-weight:700;color:var(--navy);margin-bottom:.75rem}}
.status{{font-size:.9rem;margin-bottom:1rem}}
.ok{{color:var(--gr)}}.off{{color:var(--mu)}}
.btn{{display:inline-block;background:var(--navy);color:#fff;text-decoration:none;padding:.5rem 1rem;border-radius:5px;font-size:.88rem;font-weight:500;margin:.25rem .35rem 0 0}}
.btn:hover{{background:var(--nl)}}.sec{{background:var(--s);color:var(--navy);border:1px solid var(--navy)}}
.tbl{{width:100%;border-collapse:collapse;font-size:.86rem;margin-bottom:.75rem}}
.tbl td{{padding:.35rem .5rem;border-bottom:1px solid var(--br)}}
.tbl td:first-child{{font-weight:600;color:var(--navy)}}
.tbl .err td{{color:var(--re)}}
.note{{font-size:.8rem;color:var(--mu);margin-bottom:.75rem}}
code{{background:#eee;padding:1px 4px;border-radius:3px;font-size:.85em}}
footer{{font-size:.78rem;color:var(--mu);padding:.75rem 1rem}}
</style></head>
<body>
<header>
  <a href="../scp-coupler/">← Coupler</a>
  <h1>SCP FHIR Connector</h1>
  <span class="badge">{ENV}</span>
</header>
<main>
  <div class="card">
    <h2>Connect your health record</h2>
    <p style="font-size:.88rem;margin-bottom:.9rem">Pulls your clinical data from Epic via SMART on FHIR and saves it locally for the Problem-Knowledge Coupler.</p>
    {status}
    {action}
  </div>
  <div class="card">
    <p class="note">
      Client: <code>{CLIENT_ID[:8]}…</code> &nbsp;·&nbsp;
      FHIR: <code>{FHIR_BASE[:45]}…</code><br>
      All data is stored locally. Nothing leaves your machine.
    </p>
  </div>
</main>
</body></html>'''

# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == '__main__':
    cert_file = HERE / 'localhost.pem'
    key_file  = HERE / 'localhost-key.pem'

    if not cert_file.exists() or not key_file.exists():
        print('SSL certificates missing. Run:')
        print()
        print('  brew install mkcert')
        print('  mkcert -install')
        print('  cd scp-fhir && mkcert localhost')
        print()
        sys.exit(1)

    server = FHIRServer(('localhost', PORT), Handler)
    ctx    = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    ctx.load_cert_chain(str(cert_file), str(key_file))
    server.socket = ctx.wrap_socket(server.socket, server_side=True)

    print(f'SCP FHIR proxy → https://localhost:{PORT}')
    print(f'Environment: {ENV}  |  Client: {CLIENT_ID[:8]}...')
    print('Press Ctrl+C to stop.')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nStopped.')
