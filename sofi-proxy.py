#!/usr/bin/env python3
"""
eVSM Local Proxy — forwards Anthropic API calls from the browser.
Usage:
  export ANTHROPIC_API_KEY=sk-ant-...
  python3 evsm-proxy.py

Then open evsm-aggregator.html via http://localhost:8765
"""
import os, json, hmac, urllib.request, urllib.error
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler

PORT = int(os.environ.get("PORT", 8765))
API_KEY = os.environ.get('ANTHROPIC_API_KEY', '')
PROXY_SECRET = os.environ.get('SODOTO_PROXY_SECRET', '')

# DID-ownership mode (security_type=did, per-person sites). When ON, a badge write
# also stamps that site's owner.json.did = the badge holder's DID (badge-sets-owner),
# and the SODOTO site-provisioning endpoint is meaningful. OFF by default, so every
# addition below is inert on today's single-site friends deployment.
DID_OWNERSHIP = os.environ.get('SODOTO_DID_OWNERSHIP', '').strip().lower() not in ('', '0', 'false', 'no', 'off')

# Operator-only endpoints — these require the proxy passphrase. Everything else
# is reached by patient-facing tools whose users don't hold that passphrase.
ADMIN_PATHS = {
    '/api/people-registry',
    '/api/list-patients',
    '/api/provision-patient',
    '/api/sodoto-provision-site',
    '/api/wiki-write',
    '/api/finalize-contract',
    '/api/wiki-write-badge',
    '/api/wiki-update-item',
    '/api/wiki-add-items',
}
eVSM_DIR = os.path.dirname(os.path.abspath(__file__))

# The site this deployment actually serves. Same env var and same default as
# sodoto/seed/seed.py, so the two agree about where pages live. This was
# hardcoded to 'localhost', which is right in dev and wrong everywhere else:
# on a real domain /api/wiki-write dropped pages into ~/.wiki/localhost/pages,
# a directory FedWiki never serves, and the write "succeeded" into a void.
WIKI_SITE = os.environ.get('WIKI_SITE', 'localhost')
WIKI_PAGES_DIR = os.path.expanduser(f'~/.wiki/{WIKI_SITE}/pages')
PEOPLE_REGISTRY_FILE = os.path.expanduser('~/.sodoto/people-registry.json')

class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print(f"  {args[0]} {args[1]}")

    def _auth_ok(self):
        """Return True if request carries a valid bearer token (or no secret is configured)."""
        if not PROXY_SECRET:
            return True
        auth = self.headers.get('Authorization', '')
        return hmac.compare_digest(auth, f'Bearer {PROXY_SECRET}')

    def _admin_gate(self):
        """Block unauthenticated access to operator-only endpoints.

        Patient-facing endpoints are deliberately absent from ADMIN_PATHS — the
        people using them have no reason to hold the operator passphrase.
        Returns True when the request has been denied and handling should stop.
        """
        if self.path.split('?')[0] not in ADMIN_PATHS:
            return False
        if self._auth_ok():
            return False
        print(f"  DENIED {self.command} {self.path}")
        self.send_response(401)
        self._cors()
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({'error': 'Unauthorized'}).encode())
        return True

    def do_OPTIONS(self):
        self.send_response(200)
        self._cors()
        self.end_headers()

    def do_GET(self):
        if self._admin_gate():
            return

        if self.path == '/config':
            # Deliberately does NOT include the proxy secret. This endpoint is
            # unauthenticated and CORS-open, so anything returned here is public.
            # The issuer tool asks the operator for the passphrase instead.
            cfg = {
                'proxyUrl':     os.environ.get('PROXY_URL', 'http://localhost:8765'),
                'wikiSite':     WIKI_SITE,
                'authRequired': bool(PROXY_SECRET),
            }
            body = json.dumps(cfg).encode()
            self.send_response(200)
            self._cors()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(body)
            return

        if self.path.split('?')[0] == '/api/tls-allow':
            # Caddy on-demand-TLS gate: issue a cert ONLY for domains we actually
            # host — the SODOTO base wiki host, or a provisioned per-person site
            # (a key in ~/.wiki/config.json wikiDomains). Stops Caddy minting certs
            # for arbitrary hostnames. Unauthenticated by design (Caddy calls it
            # internally) and read-only; returns 200 to allow, 403 to deny.
            from urllib.parse import urlparse, parse_qs
            domain = parse_qs(urlparse(self.path).query).get('domain', [''])[0].strip().lower()
            allowed = False
            if domain:
                base = set(d.lower() for d in [
                    os.environ.get('WIKI_SITE', ''),
                    os.environ.get('SODOTO_WIKI_DOMAIN', ''),
                ] if d)
                if domain in base:
                    allowed = True
                else:
                    try:
                        with open(os.path.expanduser('~/.wiki/config.json'), encoding='utf-8') as f:
                            allowed = domain in (json.load(f).get('wikiDomains') or {})
                    except (FileNotFoundError, ValueError):
                        allowed = False
            self.send_response(200 if allowed else 403)
            self._cors()
            self.end_headers()
            self.wfile.write(b'ok' if allowed else b'no')
            return

        if self.path.startswith('/api/wiki-read-page'):
            from urllib.parse import urlparse, parse_qs
            qs = parse_qs(urlparse(self.path).query)
            site = os.path.basename(qs.get('site', [''])[0])
            slug = os.path.basename(qs.get('slug', [''])[0])
            if not site or not slug:
                self.send_response(400); self._cors(); self.end_headers()
                self.wfile.write(b'Missing site or slug'); return
            page_path = os.path.expanduser(f'~/.wiki/{site}/pages/{slug}')
            try:
                with open(page_path, 'r', encoding='utf-8') as f:
                    data = f.read().encode()
                self.send_response(200)
                self._cors()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(data)
            except FileNotFoundError:
                self.send_response(404); self._cors(); self.end_headers()
                self.wfile.write(b'Page not found')
            return

        if self.path == '/api/list-patients':
            try:
                config_path = os.path.expanduser('~/.wiki/config.json')
                with open(config_path, 'r', encoding='utf-8') as f:
                    cfg = json.load(f)
                patients = []
                for site, meta in cfg.get('wikiDomains', {}).items():
                    if site == 'localhost' or not site.endswith('.localhost'):
                        continue
                    owner_path = meta.get('id', '')
                    owner_name = site.replace('.localhost', '')
                    if os.path.exists(owner_path):
                        try:
                            with open(owner_path) as f:
                                o = json.load(f)
                            owner_name = o.get('name', owner_name)
                        except Exception:
                            pass
                    slug = site.replace('.localhost', '')
                    patients.append({'name': owner_name, 'slug': slug, 'site': site})
                self.send_response(200); self._cors()
                self.send_header('Content-Type', 'application/json'); self.end_headers()
                self.wfile.write(json.dumps({'patients': patients}).encode())
            except Exception as e:
                self.send_response(500); self._cors(); self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
            return

        if self.path.startswith('/api/people-registry'):
            try:
                with open(PEOPLE_REGISTRY_FILE, 'r', encoding='utf-8') as f:
                    data = f.read().encode()
            except FileNotFoundError:
                data = b'{"people":[]}'
            self.send_response(200)
            self._cors()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(data)
            return

        # Serve local files
        path = self.path.split('?')[0].lstrip('/')
        if not path:
            path = 'evsm-aggregator.html'

        # Vester is the one tool with a build step, so it needs an alias:
        # /vester/ -> vester/dist/index.html, /vester/assets/x -> vester/dist/assets/x.
        # Gives the app a single stable URL and matches the nginx route, so the
        # dev and deployed URLs are identical. Vite's base is '/vester/' to suit.
        # Source under vester/src/ stays unreachable, which is what we want.
        if path == 'vester' or path.startswith('vester/'):
            rest = path[len('vester'):].lstrip('/')
            if not rest.startswith('dist/'):
                path = 'vester/dist/' + (rest or 'index.html')

        filepath = os.path.join(eVSM_DIR, path)
        if os.path.isfile(filepath):
            ext = path.rsplit('.', 1)[-1]
            ctype = {'html':'text/html','json':'application/json',
                     'js':'text/javascript','css':'text/css'}.get(ext,'text/plain')
            with open(filepath, 'rb') as f:
                data = f.read()
            self.send_response(200)
            self.send_header('Content-Type', ctype)
            if ext == 'html':
                self.send_header('Cache-Control', 'no-store')
            self._cors()
            self.end_headers()
            self.wfile.write(data)
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Not found')

    def do_POST(self):
        if self._admin_gate():
            return

        if self.path == '/api/write-issue':
            length = int(self.headers.get('Content-Length', 0))
            body   = self.rfile.read(length)
            try:
                payload    = json.loads(body)
                # Sanitise key — no path traversal
                key        = payload['key'].replace('..', '').replace('/', '').replace('\\', '')
                label      = payload['label']
                ndc        = payload['ndc']
                issue_data = payload['issueData']

                issue_dir  = os.path.join(eVSM_DIR, 'tools', 'issue-data')
                os.makedirs(issue_dir, exist_ok=True)

                # Write issue JSON
                issue_path = os.path.join(issue_dir, key + '.json')
                with open(issue_path, 'w', encoding='utf-8') as f:
                    json.dump(issue_data, f, ensure_ascii=False, indent=2)
                print(f"  ISSUE WRITE {issue_path}")

                # Upsert entry in issue-index.json
                index_path = os.path.join(issue_dir, 'issue-index.json')
                try:
                    with open(index_path, 'r', encoding='utf-8') as f:
                        index = json.load(f)
                except (FileNotFoundError, json.JSONDecodeError):
                    index = []

                entry = {
                    'key':   key,
                    'label': label,
                    'ndc':   ndc,
                    'url':   f'http://localhost:8765/tools/issue-data/{key}.json',
                    'map':   f'http://localhost:8765/tools/issue-polygon-map.html?issue={key}'
                }
                pos = next((i for i, e in enumerate(index) if e.get('key') == key), None)
                if pos is not None:
                    index[pos] = entry
                else:
                    index.append(entry)
                with open(index_path, 'w', encoding='utf-8') as f:
                    json.dump(index, f, ensure_ascii=False, indent=2)
                print(f"  ISSUE INDEX {len(index)} entries")

                self.send_response(200); self._cors()
                self.send_header('Content-Type', 'application/json'); self.end_headers()
                self.wfile.write(json.dumps({'ok': True, 'key': key}).encode())
            except Exception as e:
                self.send_response(500); self._cors(); self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
            return

        if self.path == '/api/wiki-save-item':
            length = int(self.headers.get('Content-Length', 0))
            body = json.loads(self.rfile.read(length))
            site = os.path.basename(body.get('site', ''))
            slug = os.path.basename(body.get('slug', ''))
            item_id = body.get('id', '')
            updates = body.get('updates', {})
            page_path = os.path.expanduser(f'~/.wiki/{site}/pages/{slug}')
            try:
                with open(page_path, 'r', encoding='utf-8') as f:
                    page = json.load(f)
                for item in page.get('story', []):
                    if item.get('id') == item_id:
                        item.update(updates)
                        break
                with open(page_path, 'w', encoding='utf-8') as f:
                    json.dump(page, f)
                self.send_response(200)
                self._cors()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"ok":true}')
            except Exception as e:
                self.send_response(500)
                self._cors()
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
            return

        if self.path == '/api/provision-patient':
            length = int(self.headers.get('Content-Length', 0))
            body = json.loads(self.rfile.read(length))
            try:
                import re, time as _time, secrets as _secrets
                name = body.get('name', '').strip()
                slug = body.get('slug', '').strip()
                if not name or not slug:
                    raise ValueError('name and slug are required')
                # Safety: slug must be lowercase alphanumeric + hyphens only
                if not re.match(r'^[a-z0-9][a-z0-9-]*[a-z0-9]$', slug):
                    raise ValueError('slug must be lowercase letters, numbers, and hyphens')
                site = slug + '.localhost'
                wiki_root = os.path.expanduser('~/.wiki')
                site_dir  = os.path.join(wiki_root, site)
                pages_dir = os.path.join(site_dir, 'pages')
                os.makedirs(pages_dir, exist_ok=True)

                # owner.json — include friend.secret for reclaim
                reclaim_secret = _secrets.token_hex(32)
                owner = {'name': name, 'email': slug + '@localhost', 'color': '#0f766e',
                         'friend': {'secret': reclaim_secret}}
                with open(os.path.join(site_dir, 'owner.json'), 'w') as f:
                    json.dump(owner, f, indent=2)

                # about-me page (only if it doesn't exist)
                about_path = os.path.join(pages_dir, 'about-me')
                if not os.path.exists(about_path):
                    about_id = re.sub(r'[^a-z0-9]', '', slug)[:16].ljust(16, '0')
                    about_page = {
                        'title': 'About Me',
                        'story': [
                            {'type': 'scp-about', 'id': about_id,
                             'legal_name': name, 'preferred_name': name,
                             'primary_language': 'English', 'committed': True}
                        ],
                        'journal': [
                            {'type': 'create', 'id': 'init',
                             'date': int(_time.time() * 1000),
                             'item': {'title': 'About Me'}}
                        ]
                    }
                    with open(about_path, 'w', encoding='utf-8') as f:
                        json.dump(about_page, f, ensure_ascii=False, indent=2)

                # Seed all canonical SCP page templates (only pages that don't exist)
                templates_dir = os.path.expanduser('~/rcn/scp/pages')
                seeded = []
                if os.path.isdir(templates_dir):
                    for fname in sorted(os.listdir(templates_dir)):
                        if not fname.endswith('.json'):
                            continue
                        page_slug = fname[:-5]
                        if page_slug == 'about-me':
                            continue  # personalized version created above
                        dest = os.path.join(pages_dir, page_slug)
                        if os.path.exists(dest):
                            continue
                        with open(os.path.join(templates_dir, fname), encoding='utf-8') as f:
                            page = json.load(f)
                        if page_slug == 'welcome-visitors':
                            # Personalize: [Patient Name] → name, add tool buttons
                            for it in page.get('story', []):
                                if isinstance(it.get('text'), str):
                                    it['text'] = it['text'].replace('[Patient Name]', name)
                            page['story'].append({
                                'type': 'html', 'id': 'wv-tools0000000001',
                                'text': (f'<p style="display:flex;gap:10px">'
                                         f'<a href="http://localhost:8765/tools/my-health-picture.html?person={slug}" style="display:inline-block;background:#0f766e;color:white;padding:7px 16px;border-radius:6px;font-weight:600;font-size:13px;text-decoration:none">Health Picture</a>'
                                         f'<a href="http://localhost:8765/tools/scp-chat.html?site={site}" style="display:inline-block;background:#7c3aed;color:white;padding:7px 16px;border-radius:6px;font-weight:600;font-size:13px;text-decoration:none">Appointment Prep</a>'
                                         f'<a href="http://localhost:8766/" style="display:inline-block;background:#b45309;color:white;padding:7px 16px;border-radius:6px;font-weight:600;font-size:13px;text-decoration:none">Health Choices</a></p>')
                            })
                        with open(dest, 'w', encoding='utf-8') as f:
                            json.dump(page, f, ensure_ascii=False)
                        seeded.append(page_slug)

                # config.json — add wikiDomains entry if missing
                config_path = os.path.join(wiki_root, 'config.json')
                with open(config_path, 'r', encoding='utf-8') as f:
                    cfg = json.load(f)
                cfg.setdefault('wikiDomains', {})
                if site not in cfg['wikiDomains']:
                    cfg['wikiDomains'][site] = {'id': os.path.join(site_dir, 'owner.json')}
                    with open(config_path, 'w', encoding='utf-8') as f:
                        json.dump(cfg, f, ensure_ascii=False, indent=2)
                    needs_restart = True
                else:
                    needs_restart = False

                print(f"  PROVISION  {site} ({name})")
                self.send_response(200); self._cors()
                self.send_header('Content-Type', 'application/json'); self.end_headers()
                self.wfile.write(json.dumps({
                    'ok': True, 'slug': slug, 'site': site,
                    'wikiUrl':     f'http://{site}:3000',
                    'mhpUrl':      f'/tools/my-health-picture.html?person={slug}',
                    'reclaimCode': reclaim_secret,
                    'seeded': seeded,
                    'needsWikiRestart': needs_restart
                }).encode())
            except Exception as e:
                self.send_response(400); self._cors(); self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
            return

        if self.path == '/api/people-registry':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            try:
                data = json.loads(body)
                os.makedirs(os.path.dirname(PEOPLE_REGISTRY_FILE), exist_ok=True)
                with open(PEOPLE_REGISTRY_FILE, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                print(f"  REGISTRY WRITE {len(data.get('people', []))} people")
                self.send_response(200); self._cors()
                self.send_header('Content-Type', 'application/json'); self.end_headers()
                self.wfile.write(b'{"ok":true}')
            except Exception as e:
                self.send_response(500); self._cors(); self.end_headers()
                self.wfile.write(str(e).encode())
            return

        if self.path == '/api/wiki-write':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            try:
                payload = json.loads(body)
                slug = payload['slug']
                page = payload['page']
                # Sanitize slug — no path traversal
                slug = os.path.basename(slug)
                dest = os.path.join(WIKI_PAGES_DIR, slug)
                os.makedirs(WIKI_PAGES_DIR, exist_ok=True)
                with open(dest, 'w', encoding='utf-8') as f:
                    json.dump(page, f, ensure_ascii=False, indent=2)
                print(f"  WIKI WRITE {dest}")
                self.send_response(200)
                self._cors()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'ok': True, 'slug': slug}).encode())
            except Exception as e:
                self.send_response(500)
                self._cors()
                self.end_headers()
                self.wfile.write(str(e).encode())
            return

        if self.path == '/api/finalize-contract':
            import base64, datetime
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            try:
                data = json.loads(body)
                contract = data.get('contract', {})
                neo4j_password = os.environ.get('NEO4J_PASSWORD', 'neo4j')
                results = {'neo4j': None, 'fedwiki': [], 'errors': []}

                cid     = contract.get('id','')
                cust    = contract.get('parties',{}).get('customer',{})
                perf    = contract.get('parties',{}).get('performer',{})
                pay     = contract.get('payment_spec',{})
                cos     = contract.get('preconditions',{}).get('conditions_of_satisfaction',{})
                sbu     = contract.get('preconditions',{}).get('shared_background_of_understanding',{})
                status  = contract.get('cfa_state',{}).get('current','initiated')
                created = contract.get('created_at', datetime.datetime.utcnow().isoformat())
                short_id = cid.replace('urn:uuid:','')[:8].upper()
                created_date = created[:10]

                # Neo4j
                try:
                    cypher = """
MERGE (cu:Party {did: $cust_did}) SET cu.name = $cust_name
MERGE (pe:Party {did: $perf_did}) SET pe.name = $perf_name
MERGE (c:Contract {id: $cid})
  SET c.created_at = $created, c.status = $status,
      c.conditions = $conditions, c.deadline = $deadline,
      c.total_usd = $total_usd, c.fiat_min_usd = $fiat_min_usd,
      c.version = $version
MERGE (cu)-[:CUSTOMER_IN]->(c)
MERGE (pe)-[:PERFORMER_IN]->(c)
"""
                    params = {
                        'cust_did': cust.get('did',''), 'cust_name': cust.get('name',''),
                        'perf_did': perf.get('did',''), 'perf_name': perf.get('name',''),
                        'cid': cid, 'created': created, 'status': status,
                        'conditions': cos.get('description',''), 'deadline': cos.get('deadline',''),
                        'total_usd': pay.get('total_value_usd',0),
                        'fiat_min_usd': pay.get('fiat_min_usd',0),
                        'version': contract.get('version','0.1')
                    }
                    neo4j_body = json.dumps({'statements':[{'statement':cypher,'parameters':params}]}).encode()
                    token = base64.b64encode(f'neo4j:{neo4j_password}'.encode()).decode()
                    req = urllib.request.Request(
                        'http://localhost:7474/db/neo4j/tx/commit',
                        data=neo4j_body,
                        headers={'Content-Type':'application/json','Authorization':f'Basic {token}'}
                    )
                    urllib.request.urlopen(req, timeout=10)
                    results['neo4j'] = 'ok'
                except Exception as e:
                    results['errors'].append(f'neo4j: {e}')

                # FedWiki
                pay_summary = f"Total: ${pay.get('total_value_usd',0)} · Fiat min: ${pay.get('fiat_min_usd',0)}"
                if pay.get('fiat_per_hour'):
                    pay_summary += f" · {pay.get('time_max_pct',0)}% time @ ${pay.get('fiat_per_hour',0)}/hr"
                gift = pay.get('gift',{})
                if gift and gift.get('type','none') != 'none':
                    pay_summary += f" · {gift.get('type','')} gift ${gift.get('amount_usd',0)}"

                party_configs = [
                    (cust.get('name','Customer'), 'customer', 'patient-a.localhost',
                     perf.get('name',''), 'community-health-worker-a.localhost'),
                    (perf.get('name','Performer'), 'performer', 'community-health-worker-a.localhost',
                     cust.get('name',''), 'patient-a.localhost'),
                ]

                for (own_name, own_role, own_host, other_name, other_host) in party_configs:
                    try:
                        slug = 'contract-' + short_id.lower()
                        ledger_slug = own_name.lower().replace(' ','-') + '-contracts'
                        now_ms = int(datetime.datetime.utcnow().timestamp()*1000)

                        page = {
                            'title': f'Contract {short_id}',
                            'story': [
                                {'type':'paragraph','id':'p1','text':f'**{own_role.title()}**: {own_name} · **Counterparty**: {other_name}'},
                                {'type':'paragraph','id':'p2','text':f'**Conditions**: {cos.get("description","")}'},
                                {'type':'paragraph','id':'p3','text':f'**Deadline**: {cos.get("deadline","")} · **Status**: {status}'},
                                {'type':'paragraph','id':'p4','text':f'**Payment**: {pay_summary}'},
                                {'type':'paragraph','id':'p5','text':f'**SBU**: {sbu.get("status","")}' + (f' · {sbu.get("note","")}' if sbu.get("note") else "")},
                                {'type':'paragraph','id':'p6','text':f'**Contract ID**: {cid}'},
                                {'type':'paragraph','id':'p7','text':f'**Created**: {created_date}'},
                                {'type':'reference','id':'p8','site':other_host,'slug':slug,
                                 'title':f'Contract {short_id}','text':f'View from {other_name}'},
                            ],
                            'journal': [{'type':'create','id':'j1',
                                'item':{'title':f'Contract {short_id}'},'date':now_ms}]
                        }

                        wiki_dir = os.path.expanduser(f'~/.wiki/{own_host}/pages')
                        os.makedirs(wiki_dir, exist_ok=True)
                        with open(os.path.join(wiki_dir, slug), 'w', encoding='utf-8') as f:
                            json.dump(page, f, ensure_ascii=False, indent=2)

                        # Ledger page
                        ledger_path = os.path.join(wiki_dir, ledger_slug)
                        try:
                            existing = json.load(open(ledger_path, encoding='utf-8'))
                        except:
                            existing = {'title':f'{own_name} Contracts','story':[],'journal':[]}

                        existing['story'].append({
                            'type':'reference','id':'r-'+short_id.lower(),
                            'site':own_host,'slug':slug,
                            'title':f'Contract {short_id}',
                            'text':f'{created_date} · {other_name} · deadline {cos.get("deadline","")}'
                        })
                        existing['journal'].append({'type':'edit','id':'j-'+short_id.lower(),'date':now_ms})
                        with open(os.path.join(wiki_dir, ledger_slug), 'w', encoding='utf-8') as f:
                            json.dump(existing, f, ensure_ascii=False, indent=2)
                        results['fedwiki'].append(f'{own_host}: ok')
                    except Exception as e:
                        results['errors'].append(f'fedwiki {own_host}: {e}')

                self.send_response(200)
                self._cors()
                self.send_header('Content-Type','application/json')
                self.end_headers()
                self.wfile.write(json.dumps(results).encode())
            except Exception as e:
                self.send_response(500)
                self._cors()
                self.end_headers()
                self.wfile.write(str(e).encode())
            return

        if self.path == '/api/sodoto-provision-site':
            length = int(self.headers.get('Content-Length', 0))
            body = json.loads(self.rfile.read(length))
            try:
                import re, time as _time
                name = (body.get('name') or '').strip()
                slug = (body.get('slug') or '').strip()
                if not name or not slug:
                    raise ValueError('name and slug are required')
                if not re.match(r'^[a-z0-9][a-z0-9-]*[a-z0-9]$', slug):
                    raise ValueError('slug must be lowercase letters, numbers, and hyphens')
                site = os.path.basename((body.get('site') or (slug + '.localhost')).strip())
                portfolio_slug = os.path.basename((body.get('portfolioSlug') or (slug + '-sodoto-portfolio')).strip())
                expect_did = (body.get('did') or '').strip()   # claim-before-badge fallback only

                wiki_root = os.path.expanduser('~/.wiki')
                site_dir  = os.path.join(wiki_root, site)
                pages_dir = os.path.join(site_dir, 'pages')
                os.makedirs(pages_dir, exist_ok=True)

                # owner.json — UNCLAIMED (no did): the badge is the authority, and
                # badge-sets-owner stamps the did when the first badge lands. expectDid
                # (if the caller knows the holder's DID) only lets them claim before
                # their first badge; it is a fallback, not the source of truth.
                owner_path = os.path.join(site_dir, 'owner.json')
                if not os.path.exists(owner_path):
                    owner_obj = {'name': name, 'email': slug + '@localhost', 'color': '#204630'}
                    if expect_did:
                        owner_obj['expectDid'] = expect_did
                    with open(owner_path, 'w', encoding='utf-8') as f:
                        json.dump(owner_obj, f, indent=2)

                # empty scaffolded portfolio page. Title has NO em-dash so
                # asSlug(title) == portfolio_slug (the slug bug fixed in the seed).
                portfolio_path = os.path.join(pages_dir, portfolio_slug)
                if not os.path.exists(portfolio_path):
                    now_ms = int(_time.time() * 1000)
                    pid = (re.sub(r'[^a-z0-9]', '', slug)[:16]).ljust(16, '0')
                    sid = (pid[:8] + 'signin00')[:16]
                    title = f'{name} SODOTO Portfolio'
                    page = {
                        'title': title,
                        'story': [
                            {'type': 'sodoto-signin', 'id': sid,
                             'text': 'Sign in with your SODOTO key'},
                            {'type': 'paragraph', 'id': pid,
                             'text': f'Portfolio for **{name}**. Badges appear here as gates are signed. '
                                     f'Sign in with your SODOTO key to edit this page.'}
                        ],
                        'journal': [
                            {'type': 'create', 'id': 'init', 'date': now_ms, 'item': {'title': title}}
                        ]
                    }
                    with open(portfolio_path, 'w', encoding='utf-8') as f:
                        json.dump(page, f, ensure_ascii=False, indent=2)

                # config.json — farm wikiDomains entry, points the security module at owner.json
                config_path = os.path.join(wiki_root, 'config.json')
                needs_restart = False
                try:
                    with open(config_path, encoding='utf-8') as f:
                        cfg = json.load(f)
                except (FileNotFoundError, ValueError):
                    cfg = {}
                cfg.setdefault('wikiDomains', {})
                if site not in cfg['wikiDomains']:
                    cfg['wikiDomains'][site] = {'id': owner_path}
                    with open(config_path, 'w', encoding='utf-8') as f:
                        json.dump(cfg, f, ensure_ascii=False, indent=2)
                    needs_restart = True

                self.send_response(200); self._cors()
                self.send_header('Content-Type', 'application/json'); self.end_headers()
                self.wfile.write(json.dumps({'ok': True, 'site': site, 'portfolioSlug': portfolio_slug,
                                             'owner': owner_path, 'needsRestart': needs_restart}).encode())
            except Exception as e:
                self.send_response(500); self._cors(); self.end_headers()
                self.wfile.write(str(e).encode())
            return

        if self.path == '/api/wiki-write-badge':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            try:
                payload = json.loads(body)
                site      = payload['site']
                slug      = payload['slug']
                badge_item = payload['badgeItem']
                # Sanitize — no path traversal
                site = os.path.basename(site)
                slug = os.path.basename(slug)
                pages_dir = os.path.expanduser(f'~/.wiki/{site}/pages')
                os.makedirs(pages_dir, exist_ok=True)
                page_path = os.path.join(pages_dir, slug)
                now_ms = int(__import__('time').time() * 1000)
                # Load existing page or create a skeleton
                try:
                    with open(page_path, 'r', encoding='utf-8') as f:
                        page = json.load(f)
                except FileNotFoundError:
                    page = {
                        'title': slug.replace('-', ' ').title(),
                        'story': [],
                        'journal': [{'type': 'create', 'id': 'init', 'date': now_ms,
                                     'item': {'title': slug.replace('-', ' ').title()}}]
                    }
                # Upsert: find existing badge by contractId, replace in-place; otherwise append
                if 'story' not in page:
                    page['story'] = []
                contract_id = (badge_item.get('credential') or {}).get('contractId')
                existing_idx = None
                if contract_id:
                    for idx, item in enumerate(page['story']):
                        if item.get('type') == 'sodoto-badge' and \
                           (item.get('credential') or {}).get('contractId') == contract_id:
                            existing_idx = idx
                            break
                if 'journal' not in page:
                    page['journal'] = []
                if existing_idx is not None:
                    # Keep original item id, update credential data in-place
                    original_id = page['story'][existing_idx]['id']
                    badge_item['id'] = original_id
                    page['story'][existing_idx] = badge_item
                    page['journal'].append({
                        'type': 'edit',
                        'id': original_id,
                        'date': now_ms,
                        'item': badge_item
                    })
                else:
                    page['story'].append(badge_item)
                    page['journal'].append({
                        'type': 'add',
                        'id': badge_item.get('id', 'unknown'),
                        'date': now_ms,
                        'item': badge_item
                    })
                with open(page_path, 'w', encoding='utf-8') as f:
                    json.dump(page, f, ensure_ascii=False, indent=2)
                print(f"  BADGE WRITE {page_path}")
                # badge-sets-owner: in DID-ownership mode the badge is the authority
                # on who owns this per-person site — stamp owner.json.did = holderDid
                # the first time a badge lands. Never overwrite an existing owner DID
                # (no hijack); a wrong/duplicate badge can't seize an owned site.
                if DID_OWNERSHIP:
                    try:
                        holder_did = (badge_item.get('credential') or {}).get('holderDid')
                        if holder_did:
                            owner_path = os.path.expanduser(f'~/.wiki/{site}/owner.json')
                            try:
                                with open(owner_path, encoding='utf-8') as f:
                                    owner_obj = json.load(f)
                            except (FileNotFoundError, ValueError):
                                owner_obj = {}
                            if not owner_obj.get('did'):
                                owner_obj['did'] = holder_did
                                owner_obj.setdefault('name', slug.replace('-', ' ').title())
                                os.makedirs(os.path.dirname(owner_path), exist_ok=True)
                                with open(owner_path, 'w', encoding='utf-8') as f:
                                    json.dump(owner_obj, f, indent=2)
                                print(f"  BADGE-SETS-OWNER {site} -> {holder_did}")
                    except Exception as _e:
                        print(f"  badge-sets-owner skipped: {_e}")
                self.send_response(200)
                self._cors()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'ok': True, 'slug': slug}).encode())
            except Exception as e:
                self.send_response(500)
                self._cors()
                self.end_headers()
                self.wfile.write(str(e).encode())
            return

        if self.path == '/api/wiki-update-item':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            try:
                import time
                payload = json.loads(body)
                site    = os.path.basename(payload['site'])
                slug    = os.path.basename(payload['slug'])
                item_id = payload['itemId']
                text    = payload['text']
                page_path = os.path.expanduser(f'~/.wiki/{site}/pages/{slug}')
                with open(page_path, 'r', encoding='utf-8') as f:
                    page = json.load(f)
                updated = False
                for item in page.get('story', []):
                    if item.get('id') == item_id:
                        item['text'] = text
                        updated = True
                        break
                if not updated:
                    raise KeyError(f'Item {item_id} not found in {slug}')
                now_ms = int(time.time() * 1000)
                page.setdefault('journal', []).append(
                    {'type': 'edit', 'id': item_id, 'date': now_ms,
                     'item': {'id': item_id, 'type': 'paragraph', 'text': text}})
                with open(page_path, 'w', encoding='utf-8') as f:
                    json.dump(page, f, ensure_ascii=False, indent=2)
                print(f"  ITEM UPDATE {site}/{slug}#{item_id}")
                self.send_response(200); self._cors()
                self.send_header('Content-Type', 'application/json'); self.end_headers()
                self.wfile.write(json.dumps({'ok': True}).encode())
            except Exception as e:
                self.send_response(500); self._cors(); self.end_headers()
                self.wfile.write(str(e).encode())
            return

        if self.path == '/api/wiki-add-items':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            try:
                import time
                payload = json.loads(body)
                site  = os.path.basename(payload['site'])
                slug  = os.path.basename(payload['slug'])
                items = payload['items']
                # Create the site's pages dir if it isn't there yet, the same way
                # wiki-write-page does. Without this, adding an item to a page on
                # a site this host has never served fails with FileNotFoundError
                # on the write, not the read — so the fallback below looked like
                # it worked and the request still 500'd.
                pages_dir = os.path.expanduser(f'~/.wiki/{site}/pages')
                os.makedirs(pages_dir, exist_ok=True)
                page_path = os.path.join(pages_dir, slug)
                now_ms = int(time.time() * 1000)
                try:
                    with open(page_path, 'r', encoding='utf-8') as f:
                        page = json.load(f)
                except FileNotFoundError:
                    page = {'title': slug.replace('-', ' ').title(),
                            'story': [], 'journal': [
                                {'type': 'create', 'id': 'init', 'date': now_ms,
                                 'item': {'title': slug.replace('-', ' ').title()}}]}
                page.setdefault('story', [])
                page.setdefault('journal', [])
                for item in items:
                    page['story'].append(item)
                    page['journal'].append({'type': 'add', 'id': item.get('id', 'unknown'),
                                            'date': now_ms, 'item': item})
                with open(page_path, 'w', encoding='utf-8') as f:
                    json.dump(page, f, ensure_ascii=False, indent=2)
                print(f"  ADD ITEMS  {site}/{slug} +{len(items)}")
                self.send_response(200); self._cors()
                self.send_header('Content-Type', 'application/json'); self.end_headers()
                self.wfile.write(json.dumps({'ok': True, 'added': len(items)}).encode())
            except Exception as e:
                self.send_response(500); self._cors(); self.end_headers()
                self.wfile.write(str(e).encode())
            return

        if self.path == '/api/wiki-write-page':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            try:
                payload = json.loads(body)
                site = os.path.basename(payload['site'])
                slug = os.path.basename(payload['slug'])
                page = payload['page']
                pages_dir = os.path.expanduser(f'~/.wiki/{site}/pages')
                os.makedirs(pages_dir, exist_ok=True)
                page_path = os.path.join(pages_dir, slug)
                with open(page_path, 'w', encoding='utf-8') as f:
                    json.dump(page, f, ensure_ascii=False, indent=2)
                print(f"  PAGE WRITE {site}/{slug}")
                self.send_response(200); self._cors()
                self.send_header('Content-Type', 'application/json'); self.end_headers()
                self.wfile.write(json.dumps({'ok': True, 'slug': slug}).encode())
            except Exception as e:
                self.send_response(500); self._cors(); self.end_headers()
                self.wfile.write(str(e).encode())
            return

        if self.path != '/api/anthropic':
            self.send_response(404); self.end_headers(); return

        if not API_KEY:
            self.send_response(500); self._cors(); self.end_headers()
            self.wfile.write(b'ANTHROPIC_API_KEY not set'); return

        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length)

        req = urllib.request.Request(
            'https://api.anthropic.com/v1/messages',
            data=body,
            headers={
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'anthropic-version': '2023-06-01'
            },
            method='POST'
        )
        try:
            with urllib.request.urlopen(req) as resp:
                self.send_response(resp.status)
                self._cors()
                # Forward streaming headers
                ct = resp.headers.get('Content-Type','application/json')
                self.send_header('Content-Type', ct)
                self.end_headers()
                # Stream chunks through
                while True:
                    chunk = resp.read(1024)
                    if not chunk:
                        break
                    self.wfile.write(chunk)
                    self.wfile.flush()
        except urllib.error.HTTPError as e:
            err = e.read()
            self.send_response(e.code)
            self._cors()
            self.send_header('Content-Type','application/json')
            self.end_headers()
            self.wfile.write(err)

    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')

if __name__ == '__main__':
    if not API_KEY:
        print("⚠  ANTHROPIC_API_KEY not set — synthesis will not work.")
        print("   Set it with: export ANTHROPIC_API_KEY=sk-ant-...")
    print(f"eVSM Proxy running at http://localhost:{PORT}")
    print(f"Serving files from: {eVSM_DIR}")
    print(f"Open: http://localhost:{PORT}/evsm-aggregator.html")
    print("Ctrl+C to stop.\n")
    if PROXY_SECRET:
        print(f"Auth: Bearer token required (SODOTO_PROXY_SECRET is set)")
    else:
        print(f"⚠  SODOTO_PROXY_SECRET not set — API endpoints are open.")
    ThreadingHTTPServer(('0.0.0.0', PORT), Handler).serve_forever()
