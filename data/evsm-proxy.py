#!/usr/bin/env python3
"""
eVSM Local Proxy — forwards Anthropic API calls from the browser.
Usage:
  export ANTHROPIC_API_KEY=sk-ant-...
  python3 evsm-proxy.py

Then open evsm-aggregator.html via http://localhost:8765
"""
import os, json, urllib.request, urllib.error
from http.server import HTTPServer, BaseHTTPRequestHandler

PORT = 8765
API_KEY = os.environ.get('ANTHROPIC_API_KEY', '')
eVSM_DIR = os.path.dirname(os.path.abspath(__file__))
WIKI_PAGES_DIR = os.path.expanduser('~/.wiki/localhost/pages')

class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print(f"  {args[0]} {args[1]}")

    def do_OPTIONS(self):
        self.send_response(200)
        self._cors()
        self.end_headers()

    def do_GET(self):
        # Serve local files
        path = self.path.split('?')[0].lstrip('/')
        if not path:
            path = 'evsm-aggregator.html'
        filepath = os.path.join(eVSM_DIR, path)
        if os.path.isfile(filepath):
            ext = path.rsplit('.', 1)[-1]
            ctype = {'html':'text/html','json':'application/json',
                     'js':'text/javascript','css':'text/css'}.get(ext,'text/plain')
            with open(filepath, 'rb') as f:
                data = f.read()
            self.send_response(200)
            self.send_header('Content-Type', ctype)
            self._cors()
            self.end_headers()
            self.wfile.write(data)
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Not found')

    def do_POST(self):
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
                neo4j_password = 'sucramsucram'
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
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')

if __name__ == '__main__':
    if not API_KEY:
        print("⚠  ANTHROPIC_API_KEY not set — synthesis will not work.")
        print("   Set it with: export ANTHROPIC_API_KEY=sk-ant-...")
    print(f"eVSM Proxy running at http://localhost:{PORT}")
    print(f"Serving files from: {eVSM_DIR}")
    print(f"Open: http://localhost:{PORT}/evsm-aggregator.html")
    print("Ctrl+C to stop.\n")
    HTTPServer(('localhost', PORT), Handler).serve_forever()
