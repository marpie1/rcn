#!/usr/bin/env python3
"""
SCP Problem-Knowledge Coupler Proxy — port 8766.
Sibling of sofi-proxy.py (port 8765).

Usage:
  export ANTHROPIC_API_KEY=sk-ant-...
  python3 coupler-proxy.py

Then open: http://localhost:8766
"""
import os, json, time, datetime, uuid, urllib.request, urllib.error
from http.server import HTTPServer, BaseHTTPRequestHandler
from socketserver import ThreadingMixIn

class ThreadingHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True

PORT    = 8766
API_KEY = os.environ.get('ANTHROPIC_API_KEY', '')
MODEL   = 'claude-sonnet-4-6'

BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
DATA_DIR  = os.path.join(BASE_DIR, 'scp-coupler', 'data')
UI_DIR    = os.path.join(BASE_DIR, 'scp-coupler')
WIKI_HOST = 'scp-experiment.localhost'
WIKI_PAGES_DIR = os.path.expanduser(f'~/.wiki/{WIKI_HOST}/pages')
FHIR_IMPORT        = os.path.join(BASE_DIR, 'scp-fhir', 'data', 'scp-import.json')
OPTIONBOX_INDEX    = os.path.join(BASE_DIR, 'scp-optionbox', 'data', 'nnt-library', 'index.json')
OPTIONBOX_BASE_URL = 'http://localhost:8770'

# ── Attention Matrix ─────────────────────────────────────────────────────────
# Severity I-IV × Probability band A-D → attention code 1-5
ATTENTION_MATRIX = {
    ('I',   'A'): 1, ('I',   'B'): 1, ('I',   'C'): 2, ('I',   'D'): 3,
    ('II',  'A'): 1, ('II',  'B'): 2, ('II',  'C'): 3, ('II',  'D'): 4,
    ('III', 'A'): 2, ('III', 'B'): 3, ('III', 'C'): 4, ('III', 'D'): 5,
    ('IV',  'A'): 3, ('IV',  'B'): 4, ('IV',  'C'): 5, ('IV',  'D'): 5,
}

def prob_to_band(estimate):
    if estimate >= 0.60: return 'A'
    if estimate >= 0.30: return 'B'
    if estimate >= 0.10: return 'C'
    return 'D'

def apply_attention_codes(frame):
    """Recompute attention codes for all assessment candidates. The LLM never sets these."""
    for c in frame.get('assessment_candidates', []):
        prob     = c.get('probability', {})
        estimate = prob.get('estimate', 0.0)
        severity = c.get('severity_class', 'IV')
        band     = prob_to_band(estimate)
        prob['band'] = band
        c['attention_code'] = ATTENTION_MATRIX.get((severity, band), 5)
    return frame

# ── PANAS-PA-10 Activation Band Crosswalk ────────────────────────────────────
# Provisional thresholds from Watson & Clark manual (past-week adult norms M≈31 SD≈7).
# Replace cut-points here (PANAS_BAND_CROSSWALK only) when Mahoney PA→PAM mapping obtained.
# Raw score range: 10–50 (sum of 10 items, each 1–5).
# Items: active, alert, attentive, determined, enthusiastic, excited,
#        inspired, interested, proud, strong
PANAS_PA10_ITEMS    = ['active','alert','attentive','determined','enthusiastic',
                        'excited','inspired','interested','proud','strong']
PANAS_BAND_VERSION  = '0.1-provisional-watson-clark-past-week'
PANAS_BAND_CROSSWALK = [
    (10, 24, 1),  # Band 1 — Learning the basics
    (25, 31, 2),  # Band 2 — Building awareness
    (32, 38, 3),  # Band 3 — Taking action
    (39, 50, 4),  # Band 4 — Staying the course
]
ACTIVATION_BAND_LABELS = {
    1: 'Learning the basics',
    2: 'Building awareness',
    3: 'Taking action',
    4: 'Staying the course',
}

def raw_to_activation_band(raw_score):
    for lo, hi, band in PANAS_BAND_CROSSWALK:
        if lo <= raw_score <= hi:
            return band
    return 1  # clamp low

# ── Data helpers ─────────────────────────────────────────────────────────────
def person_dir(person_id):
    safe = os.path.basename(person_id)
    return os.path.join(DATA_DIR, safe)

def safe_read(path, default=None):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return default

def safe_write(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def record_path(person_id, problem_n):
    return os.path.join(person_dir(person_id), f'p{problem_n}-record.json')

def frames_path(person_id, problem_n):
    return os.path.join(person_dir(person_id), f'p{problem_n}-frames.json')

# ── Anthropic call ───────────────────────────────────────────────────────────
def call_claude(system_prompt, user_content, max_tokens=4096):
    if not API_KEY:
        raise RuntimeError('ANTHROPIC_API_KEY not set')
    payload = json.dumps({
        'model': MODEL,
        'max_tokens': max_tokens,
        'system': system_prompt,
        'messages': [{'role': 'user', 'content': user_content}],
    }).encode()
    req = urllib.request.Request(
        'https://api.anthropic.com/v1/messages',
        data=payload,
        headers={
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'anthropic-version': '2023-06-01',
        },
        method='POST'
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        return json.loads(resp.read())

# ── System prompts ───────────────────────────────────────────────────────────
FRAME_SYSTEM = """You are a Problem-Knowledge Coupler generator. Your sole job is to produce a complete, explicit coupler frame for the stated problem — the full set of clinical findings that constitute a thorough workup, whether or not they have been gathered yet.

Core discipline: never conclude, always couple. You list candidate explanations alongside the findings that support or refute each one. You never settle on a single diagnosis. Conclusions belong to time, treatment, and the care team.

Output: STRICT JSON ONLY. No commentary, no markdown, no text before or after the JSON object.

Schema (follow exactly):
{
  "type": "coupler-frame",
  "version": 1,
  "generated": "<ISO 8601 timestamp>",
  "model": "<model name>",
  "problem": {
    "number": <integer>,
    "statement_vernacular": "<plain language>",
    "statement_clinical": "<clinical language>",
    "status": "active"
  },
  "subjective": [
    {
      "id": "s-NNN",
      "term": "<clinical term>",
      "vernacular": "<question in plain language the person can answer>",
      "why_it_matters": "<one sentence connecting this finding to the candidate assessments>",
      "status": "absent",
      "value": null,
      "missing": null
    }
  ],
  "objective": [
    {
      "id": "o-NNN",
      "term": "<clinical term>",
      "vernacular": "<plain language description>",
      "how_obtained": "<blood test / physical exam / imaging / etc.>",
      "status": "absent",
      "value": null,
      "missing": null
    }
  ],
  "assessment_candidates": [
    {
      "id": "a-NNN",
      "term": "<clinical term>",
      "vernacular": "<plain language explanation>",
      "supported_by": [],
      "refuted_by": [],
      "not_yet_testable": [],
      "basis": "<evidence basis or physiological reasoning>",
      "confidence_note": "<honest uncertainty statement>",
      "probability": {
        "estimate": <0.0-1.0>,
        "band": "<A|B|C|D>",
        "as_of": "<YYYY-MM-DD>",
        "moved_by": [],
        "history": []
      },
      "severity_class": "<I|II|III|IV>",
      "severity_vernacular": "<plain language consequence if this is real and goes unaddressed>"
    }
  ],
  "residual": {
    "vernacular": "Something not on this list — the differential is never closed",
    "probability_estimate": <0.0-1.0>
  },
  "plan_options": [
    {
      "id": "p-NNN",
      "linked_assessment": "<assessment id, e.g. a-001>",
      "term": "<clinical term>",
      "vernacular": "<plain language>",
      "basis": "<evidence basis>",
      "who_can_act": "<who can order or carry out this>"
    }
  ]
}

Probability bands (set these correctly in each candidate's probability.band):
  A: estimate ≥ 0.60 — likely
  B: estimate 0.30–0.59 — a real possibility
  C: estimate 0.10–0.29 — possible, less likely
  D: estimate < 0.10 — unlikely, still on the list

Severity classes (use for severity_class):
  I:   Could cost the person their life, or cause harm that cannot be undone
  II:  Could do serious harm, or take away abilities for good
  III: Could cause real trouble that care can likely put right
  IV:  Small trouble, likely to pass on its own

Rules:
1. Be EXHAUSTIVE but COMPACT: list all clinically important subjective and objective findings. Keep each field value to one concise sentence — no filler. Aim for 8–14 subjective items, 8–14 objective items, 5–10 assessment candidates.
2. Every item has BOTH a clinical term and a vernacular explanation.
3. Assessments are ALWAYS PLURAL. Include uncommon but high-severity possibilities.
4. Calibrate probabilities to any provided record data. If there is no record data, use conservative prior estimates and lean lower — the picture is incomplete. Never let probabilities sum to more than ~1.0 across all candidates plus residual.
5. Status fields: absent (nothing gathered), filled (complete data present), partial (something present but incomplete — use missing to say what is needed).
6. DO NOT include an attention_code field — the server computes it from the matrix.
7. The probability history array starts empty [] for a new frame.
8. For not_yet_testable entries, use descriptive strings like "o-003 (ferritin — not yet ordered)".
9. supported_by, refuted_by, not_yet_testable reference finding IDs from the subjective/objective arrays.
10. The residual line's probability_estimate should reflect what remains unexplained.
"""

MATCH_SYSTEM = """You are a Problem-Knowledge Coupler matcher. You receive a coupler frame and a set of person record entries. Update the frame to reflect the current evidence.

Your tasks:
1. Map record entries onto frame slots (subjective and objective). Update each finding's status: filled, partial, or absent. Set value from the record entry. Set missing if status is partial.
2. Re-estimate probabilities for each assessment candidate based on the current evidence. Update estimate and band.
3. Append to each candidate's probability.history — NEVER replace or truncate it. Add the new entry: {"estimate": <new>, "band": "<new>", "as_of": "<today>", "moved_by": [<finding ids that shifted the estimate>]}.
4. Set the top-level moved_by to finding IDs that most influenced each candidate's new estimate.
5. Update supported_by and refuted_by for each candidate based on newly filled findings.

Conservative matching: when unsure whether an entry fully satisfies a slot, mark it partial and explain in missing what is still needed.

Output: the complete updated frame JSON. Same schema as input, with updated fields. STRICT JSON ONLY — no commentary, no markdown.
"""

NARRATE_SYSTEM = """You receive a Problem-Knowledge Coupler frame with completeness statuses. Write a single paragraph of plain language.

Cover:
- What we know (filled findings and what they suggest about the candidates)
- What we do not know yet (the absent and partial findings that matter most)
- What the gaps mean (which missing pieces would most change the picture)

Rules:
- One paragraph, 3–6 sentences.
- No medical jargon without an inline explanation.
- No bullet points.
- Twain discipline: say it once, plainly.
- Output ONLY the paragraph text — no heading, no label, no extra text.
"""

# ── HTTP Handler ─────────────────────────────────────────────────────────────
class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print(f'  {args[0]} {args[1]}')

    def _cors(self):
        # Reflect Origin to handle sandboxed iframes (null origin) and normal callers
        origin = self.headers.get('Origin', '*')
        self.send_header('Access-Control-Allow-Origin', origin)
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
        if origin != '*':
            self.send_header('Vary', 'Origin')

    def _json(self, code, data):
        body = json.dumps(data, ensure_ascii=False).encode()
        self.send_response(code)
        self._cors()
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(body)

    def _err(self, code, msg):
        self._json(code, {'error': msg})

    def _read_body(self):
        length = int(self.headers.get('Content-Length', 0))
        return json.loads(self.rfile.read(length))

    def do_OPTIONS(self):
        self.send_response(200)
        self._cors()
        self.end_headers()

    # ── GET ──────────────────────────────────────────────────────────────────
    def do_GET(self):
        path = self.path.split('?')[0]

        # People list
        if path == '/api/people':
            data = safe_read(os.path.join(DATA_DIR, 'people.json'), [])
            self._json(200, data)
            return

        # Problems for a person
        if path.startswith('/api/problems/'):
            person_id = os.path.basename(path)
            p = os.path.join(person_dir(person_id), 'problems.json')
            self._json(200, safe_read(p, []))
            return

        # Person record
        if path.startswith('/api/person/'):
            person_id = path.split('/')[-1]
            p = os.path.join(person_dir(person_id), 'person.json')
            data = safe_read(p)
            if data is None:
                self._err(404, 'Person not found'); return
            self._json(200, data)
            return

        # Record entries for a problem
        if path.startswith('/api/record/'):
            parts = path.split('/')
            person_id = parts[3]; problem_n = parts[4]
            self._json(200, safe_read(record_path(person_id, problem_n), []))
            return

        # Frame versions for a problem
        if path.startswith('/api/frames/'):
            parts = path.split('/')
            person_id = parts[3]; problem_n = parts[4]
            self._json(200, safe_read(frames_path(person_id, problem_n), []))
            return

        # FedWiki export for a problem (one-way clinical view)
        if path.startswith('/api/export-fedwiki/'):
            parts = path.split('/')
            person_id = parts[3]; problem_n = parts[4]
            frames = safe_read(frames_path(person_id, problem_n), [])
            if not frames:
                self._err(404, 'No frames for this problem'); return
            frame = frames[-1]['frame']
            wiki_page = build_fedwiki_page(frame)
            self._json(200, wiki_page)
            return

        # PANAS instrument metadata (items + scale labels)
        if path == '/api/panas-meta':
            self._json(200, {
                'instrument': 'PANAS-PA-10 (past week)',
                'instructions': 'For each word below, indicate how much you have felt this way during the past week.',
                'scale': {1:'Very slightly or not at all', 2:'A little', 3:'Moderately', 4:'Quite a bit', 5:'Extremely'},
                'items': PANAS_PA10_ITEMS,
                'crosswalk_version': PANAS_BAND_VERSION,
                'band_labels': ACTIVATION_BAND_LABELS,
                'crosswalk': [{'lo':lo,'hi':hi,'band':b} for lo,hi,b in PANAS_BAND_CROSSWALK],
            })
            return

        # SCP context — human-readable view of what gets injected into frame calls
        if path == '/api/optionbox-index':
            try:
                with open(OPTIONBOX_INDEX) as f:
                    items = json.load(f)
                # Inject the base URL so the client knows where to open the option box
                self._json(200, {'base_url': OPTIONBOX_BASE_URL, 'items': items})
            except FileNotFoundError:
                self._json(200, {'base_url': OPTIONBOX_BASE_URL, 'items': []})
            except Exception as e:
                self._json(500, {'error': str(e)})
            return

        if path == '/api/fhir-context':
            entries = fetch_fhir_context()
            if not os.path.exists(FHIR_IMPORT):
                self._json(200, {'loaded': False, 'entries': [], 'patient': None})
            else:
                try:
                    data = json.loads(open(FHIR_IMPORT).read())
                    self._json(200, {
                        'loaded': True,
                        'patient': data.get('patient'),
                        'problems': data.get('problems', []),
                        'entries': entries,
                        'entry_count': len(entries),
                        'transformed_at': data.get('transformed_at', ''),
                    })
                except Exception as e:
                    self._json(500, {'error': str(e)})
            return

        if path == '/api/scp-context':
            entries = fetch_scp_context() + fetch_fhir_context()
            by_source = {}
            for e in entries:
                by_source.setdefault(e['source'], []).append(e)

            source_labels = {
                'scp-health-log': 'Health Log',
                'scp-visits':     'Visits',
                'scp-about-me':   'About Me',
            }
            rows_html = ''
            for src, items in by_source.items():
                rows_html += f'<h2>{source_labels.get(src, src)}</h2><table>'
                for e in items:
                    date = e.get('date', '')
                    text = e.get('text', '')
                    etype = e.get('entry_type', '')
                    rows_html += (f'<tr><td class="date">{date}</td>'
                                  f'<td class="type">{etype}</td>'
                                  f'<td class="text">{text}</td></tr>')
                rows_html += '</table>'

            html = f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8">
<title>SCP Context — {WIKI_HOST}</title>
<style>
body {{ font-family: system-ui, sans-serif; max-width: 820px; margin: 2rem auto; padding: 0 1rem; color: #1a1a2e; }}
h1 {{ font-size: 1.2rem; color: #1e3a5f; margin-bottom: 0.25rem; }}
p.sub {{ color: #6c757d; font-size: 0.9rem; margin-top: 0; margin-bottom: 2rem; }}
h2 {{ font-size: 1rem; font-weight: 700; color: #1e3a5f; border-bottom: 1px solid #dee2e6;
      padding-bottom: 0.3rem; margin-top: 2rem; }}
table {{ width: 100%; border-collapse: collapse; margin-bottom: 1rem; }}
td {{ padding: 0.35rem 0.5rem; vertical-align: top; font-size: 0.88rem;
      border-bottom: 1px solid #f0f0f0; }}
td.date {{ width: 6.5rem; color: #6c757d; white-space: nowrap; }}
td.type {{ width: 7rem; font-weight: 600; color: #2a4f7c; }}
td.text {{ }}
</style>
</head>
<body>
<h1>SCP Context Preview</h1>
<p class="sub">These {len(entries)} entries will be injected into every Generate Frame call.
Source: <strong>{WIKI_HOST}</strong></p>
{rows_html}
</body></html>"""
            body = html.encode()
            self.send_response(200)
            self._cors()
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(body)
            return

        # Bundle export — full portable state for one person
        if path.startswith('/api/bundle/'):
            person_id = os.path.basename(path)
            pdir = person_dir(person_id)
            person  = safe_read(os.path.join(pdir, 'person.json'))
            if person is None:
                self._err(404, 'Person not found'); return
            problems = safe_read(os.path.join(pdir, 'problems.json'), [])
            records, frames_map = {}, {}
            for prob in problems:
                n = str(prob['number'])
                records[n]    = safe_read(record_path(person_id, n), [])
                frames_map[n] = safe_read(frames_path(person_id, n), [])
            bundle = {
                'type': 'coupler-bundle',
                'bundle_version': 1,
                'exported': datetime.datetime.now(datetime.timezone.utc).isoformat(),
                'person': person,
                'problems': problems,
                'records': records,
                'frames': frames_map,
            }
            self._json(200, bundle)
            return

        # Static file serving
        rel = path.lstrip('/')
        if not rel:
            rel = 'index.html'
        filepath = os.path.join(UI_DIR, rel)
        if os.path.isfile(filepath):
            ext = rel.rsplit('.', 1)[-1] if '.' in rel else ''
            ctype = {'html': 'text/html', 'json': 'application/json',
                     'js': 'text/javascript', 'css': 'text/css'}.get(ext, 'text/plain')
            with open(filepath, 'rb') as f:
                body = f.read()
            self.send_response(200)
            self._cors()
            self.send_header('Content-Type', ctype)
            if ext == 'html':
                self.send_header('Cache-Control', 'no-store')
            self.end_headers()
            self.wfile.write(body)
        else:
            self._err(404, f'Not found: {path}')

    # ── POST ─────────────────────────────────────────────────────────────────
    def do_POST(self):
        path = self.path.split('?')[0]

        # Save person
        if path.startswith('/api/person/'):
            person_id = path.split('/')[-1]
            try:
                data = self._read_body()
                pdir = person_dir(person_id)
                safe_write(os.path.join(pdir, 'person.json'), data)
                # Upsert in people.json
                people_path = os.path.join(DATA_DIR, 'people.json')
                people = safe_read(people_path, [])
                entry = {'id': person_id, 'name': data.get('name', ''), 'dob': data.get('dob', '')}
                idx = next((i for i, p in enumerate(people) if p['id'] == person_id), None)
                if idx is not None:
                    people[idx] = entry
                else:
                    people.append(entry)
                safe_write(people_path, people)
                print(f'  PERSON SAVE {person_id}')
                self._json(200, {'ok': True})
            except Exception as e:
                self._err(500, str(e))
            return

        # Save problems list
        if path.startswith('/api/problems/'):
            person_id = os.path.basename(path)
            try:
                data = self._read_body()
                safe_write(os.path.join(person_dir(person_id), 'problems.json'), data)
                print(f'  PROBLEMS SAVE {person_id} ({len(data)} problems)')
                self._json(200, {'ok': True})
            except Exception as e:
                self._err(500, str(e))
            return

        # Append record entry
        if path.startswith('/api/record-entry/'):
            parts = path.split('/')
            person_id = parts[3]; problem_n = parts[4]
            try:
                entry = self._read_body()
                if 'id' not in entry:
                    entry['id'] = 'entry-' + uuid.uuid4().hex[:8]
                rp = record_path(person_id, problem_n)
                entries = safe_read(rp, [])
                # Upsert by id
                idx = next((i for i, e in enumerate(entries) if e.get('id') == entry['id']), None)
                if idx is not None:
                    entries[idx] = entry
                else:
                    entries.append(entry)
                safe_write(rp, entries)
                print(f'  RECORD ENTRY {person_id}/p{problem_n} #{entry["id"]}')
                self._json(200, {'ok': True, 'id': entry['id']})
            except Exception as e:
                self._err(500, str(e))
            return

        # Delete record entry
        if path.startswith('/api/delete-entry/'):
            parts = path.split('/')
            person_id = parts[3]; problem_n = parts[4]; entry_id = parts[5]
            try:
                rp = record_path(person_id, problem_n)
                entries = safe_read(rp, [])
                entries = [e for e in entries if e.get('id') != entry_id]
                safe_write(rp, entries)
                self._json(200, {'ok': True})
            except Exception as e:
                self._err(500, str(e))
            return

        # Save PANAS-PA-10 activation assessment
        if path.startswith('/api/activation/'):
            person_id = os.path.basename(path)
            try:
                body        = self._read_body()
                items       = body.get('items', [])   # list of 10 ints 1-5
                if len(items) != 10:
                    self._err(400, 'Expected exactly 10 item scores (1–5 each)'); return
                raw_score   = sum(int(s) for s in items)
                band        = raw_to_activation_band(raw_score)
                as_of       = body.get('as_of', datetime.date.today().isoformat())
                assessed_by = body.get('assessed_by', 'self')
                na_items    = body.get('na_items', [])  # optional NA-10, store don't gate

                ppath  = os.path.join(person_dir(person_id), 'person.json')
                person = safe_read(ppath, {})

                # Append current reading to history before replacing
                prev = person.get('activation', {})
                history = list(prev.get('history', []))
                if prev.get('raw_score') is not None:
                    history.append({
                        'raw_score':   prev['raw_score'],
                        'band':        prev['band'],
                        'as_of':       prev.get('as_of', ''),
                        'assessed_by': prev.get('assessed_by', ''),
                    })

                person['activation'] = {
                    'instrument':         'PANAS-PA-10 (past week)',
                    'crosswalk_version':  PANAS_BAND_VERSION,
                    'raw_score':          raw_score,
                    'band':               band,
                    'assessed_by':        assessed_by,
                    'as_of':              as_of,
                    'items':              items,
                    'history':            history,
                }
                if na_items:
                    person['activation']['na_raw_score'] = sum(int(s) for s in na_items)
                    person['activation']['na_items']     = na_items

                safe_write(ppath, person)
                print(f'  ACTIVATION  {person_id} raw={raw_score} band={band} ({ACTIVATION_BAND_LABELS[band]})')
                self._json(200, {
                    'ok': True,
                    'raw_score': raw_score,
                    'band': band,
                    'band_label': ACTIVATION_BAND_LABELS[band],
                    'as_of': as_of,
                })
            except Exception as e:
                self._err(500, str(e))
            return

        # Import bundle — restore full person state from a downloaded bundle file
        if path == '/api/import-bundle':
            try:
                bundle = self._read_body()
                if bundle.get('type') != 'coupler-bundle':
                    self._err(400, 'Not a coupler-bundle file'); return
                person  = bundle['person']
                person_id = os.path.basename(person['id'])
                pdir = person_dir(person_id)

                safe_write(os.path.join(pdir, 'person.json'), person)
                safe_write(os.path.join(pdir, 'problems.json'), bundle.get('problems', []))

                for n, entries in bundle.get('records', {}).items():
                    safe_write(record_path(person_id, n), entries)
                for n, fvers in bundle.get('frames', {}).items():
                    safe_write(frames_path(person_id, n), fvers)

                # Upsert in people.json
                people_path = os.path.join(DATA_DIR, 'people.json')
                people = safe_read(people_path, [])
                entry = {'id': person_id, 'name': person.get('name', ''), 'dob': person.get('dob', '')}
                idx = next((i for i, p in enumerate(people) if p['id'] == person_id), None)
                if idx is not None: people[idx] = entry
                else: people.append(entry)
                safe_write(people_path, people)

                print(f'  BUNDLE IMPORT {person_id} — {len(bundle.get("problems",[]))} problems, {len(bundle.get("records",{}))} records loaded')
                self._json(200, {'ok': True, 'person_id': person_id, 'name': person.get('name', '')})
            except Exception as e:
                self._err(500, str(e))
            return

        # Save frame (no AI — manual edit or post-generation save)
        if path == '/api/save-frame':
            try:
                body = self._read_body()
                person_id  = body['person_id']
                problem_n  = str(body['problem_n'])
                frame      = body['frame']
                frame = apply_attention_codes(frame)
                fp = frames_path(person_id, problem_n)
                versions = safe_read(fp, [])
                version_num = len(versions) + 1
                frame['version'] = version_num
                versions.append({'version': version_num, 'saved': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'frame': frame})
                safe_write(fp, versions)
                print(f'  FRAME SAVE  {person_id}/p{problem_n} v{version_num}')
                self._json(200, {'ok': True, 'version': version_num, 'frame': frame})
            except Exception as e:
                self._err(500, str(e))
            return

        # Push frame as FedWiki page to scp-experiment.localhost
        if path.startswith('/api/push-fedwiki/'):
            parts = path.split('/')
            person_id = parts[3]; problem_n = parts[4]
            try:
                frames = safe_read(frames_path(person_id, problem_n), [])
                if not frames:
                    self._err(404, 'No frames for this problem'); return
                frame = frames[-1]['frame']
                wiki_page = build_fedwiki_page(frame)
                slug = wiki_slug(wiki_page['title'])
                dest = os.path.join(WIKI_PAGES_DIR, slug)

                # Preserve existing journal if page already exists
                existing = safe_read(dest)
                if existing and existing.get('journal'):
                    now_ms = int(time.time() * 1000)
                    wiki_page['journal'] = existing['journal'] + [{
                        'type': 'edit',
                        'id': _uid(),
                        'date': now_ms,
                        'item': {'title': wiki_page['title']},
                    }]

                os.makedirs(WIKI_PAGES_DIR, exist_ok=True)
                with open(dest, 'w', encoding='utf-8') as f:
                    json.dump(wiki_page, f, ensure_ascii=False)
                print(f'  WIKI PUSH   {slug} → {WIKI_HOST}')
                self._json(200, {
                    'ok': True,
                    'slug': slug,
                    'title': wiki_page['title'],
                    'url': f'http://{WIKI_HOST}:3000/view/{slug}',
                })
            except Exception as e:
                print(f'  WIKI ERR    {e}')
                self._err(500, str(e))
            return

        # ── AI endpoints ─────────────────────────────────────────────────────
        if not API_KEY:
            self._err(500, 'ANTHROPIC_API_KEY not set')
            return

        # Generate coupler frame
        if path == '/api/frame':
            try:
                body      = self._read_body()
                person_id = body.get('person_id', '')
                problem   = body.get('problem', {})
                record    = body.get('record', [])

                # Augment record with SCP wiki context and FHIR data
                scp_entries  = fetch_scp_context()
                fhir_entries = fetch_fhir_context()
                if scp_entries or fhir_entries:
                    record = list(record) + scp_entries + fhir_entries
                    print(f'  CONTEXT: {len(scp_entries)} SCP + {len(fhir_entries)} FHIR entries')

                user_msg = f"""Problem: {json.dumps(problem, ensure_ascii=False)}

Existing record entries (may be empty — entries with source "scp-*" come from the Shared Care Plan):
{json.dumps(record, ensure_ascii=False, indent=2)}

Today's date: {datetime.date.today().isoformat()}
Model: {MODEL}

Generate the coupler frame for this problem."""

                print(f'  FRAME GEN   {person_id} p{problem.get("number")}')
                resp = call_claude(FRAME_SYSTEM, user_msg, max_tokens=16000)
                text = resp['content'][0]['text'].strip()

                # Strip any accidental markdown fences
                if text.startswith('```'):
                    text = text.split('\n', 1)[1].rsplit('```', 1)[0].strip()

                frame = json.loads(text)
                frame['model'] = MODEL
                frame['generated'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
                frame = apply_attention_codes(frame)

                # Persist if person_id + problem_n provided
                if person_id and problem.get('number'):
                    problem_n = str(problem['number'])
                    fp = frames_path(person_id, problem_n)
                    versions = safe_read(fp, [])
                    version_num = len(versions) + 1
                    frame['version'] = version_num
                    versions.append({'version': version_num, 'saved': frame['generated'], 'frame': frame})
                    safe_write(fp, versions)
                    print(f'  FRAME SAVED {person_id}/p{problem_n} v{version_num}')

                self._json(200, {'ok': True, 'frame': frame})
            except Exception as e:
                print(f'  FRAME ERR   {e}')
                self._err(500, str(e))
            return

        # Re-match record against frame
        if path == '/api/match':
            try:
                body      = self._read_body()
                person_id = body.get('person_id', '')
                problem_n = str(body.get('problem_n', ''))
                frame     = body.get('frame', {})
                record    = body.get('record', [])

                user_msg = f"""Current frame:
{json.dumps(frame, ensure_ascii=False, indent=2)}

Record entries to match:
{json.dumps(record, ensure_ascii=False, indent=2)}

Today's date: {datetime.date.today().isoformat()}

Update the frame with these record entries. Return the complete updated frame JSON."""

                print(f'  MATCH       {person_id}/p{problem_n}')
                resp = call_claude(MATCH_SYSTEM, user_msg, max_tokens=16000)
                text = resp['content'][0]['text'].strip()
                if text.startswith('```'):
                    text = text.split('\n', 1)[1].rsplit('```', 1)[0].strip()

                updated = json.loads(text)
                updated['model'] = MODEL
                updated = apply_attention_codes(updated)

                # Persist new version
                if person_id and problem_n:
                    fp = frames_path(person_id, problem_n)
                    versions = safe_read(fp, [])
                    version_num = len(versions) + 1
                    updated['version'] = version_num
                    versions.append({'version': version_num, 'saved': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'frame': updated})
                    safe_write(fp, versions)
                    print(f'  MATCH SAVED {person_id}/p{problem_n} v{version_num}')

                self._json(200, {'ok': True, 'frame': updated})
            except Exception as e:
                print(f'  MATCH ERR   {e}')
                self._err(500, str(e))
            return

        # Narrate
        if path == '/api/narrate':
            try:
                body  = self._read_body()
                frame = body.get('frame', {})
                user_msg = f"""Frame:
{json.dumps(frame, ensure_ascii=False, indent=2)}

Write the plain-language paragraph."""
                print(f'  NARRATE')
                resp = call_claude(NARRATE_SYSTEM, user_msg, max_tokens=600)
                text = resp['content'][0]['text'].strip()
                self._json(200, {'ok': True, 'narrative': text})
            except Exception as e:
                print(f'  NARRATE ERR {e}')
                self._err(500, str(e))
            return

        # Push narrative paragraph to pre-visit-summary wiki page
        if path.startswith('/api/push-narrative/'):
            parts = path.split('/')
            person_id = parts[3]; problem_n = parts[4]
            try:
                body      = self._read_body()
                narrative = body.get('narrative', '').strip()
                problem   = body.get('problem', {})
                if not narrative:
                    self._err(400, 'No narrative text'); return

                dest = os.path.join(WIKI_PAGES_DIR, 'pre-visit-summary')
                page = safe_read(dest)
                if page is None:
                    self._err(404, 'pre-visit-summary not found in wiki'); return

                now_ms  = int(time.time() * 1000)
                today   = datetime.date.today().isoformat()
                pnum    = int(problem_n)
                heading = f"PROBLEM {pnum}: {problem.get('statement_vernacular', '').upper()} — {today}"
                html = (f'<details>\n'
                        f'<summary style="cursor:pointer;font-weight:bold;font-size:1.1em">{esc(heading)}</summary>\n'
                        f'<div style="padding:0.5em 1em"><p>{esc(narrative)}</p></div>\n'
                        f'</details>')
                new_item = {
                    'type':      'html',
                    'id':        _uid(),
                    'problem_n': pnum,
                    'date':      today,
                    'text':      html,
                }

                # Replace existing narrative for this problem, or append
                story = page.get('story', [])
                idx = next((i for i, it in enumerate(story)
                            if it.get('problem_n') == pnum), None)
                if idx is not None:
                    story[idx] = new_item
                    action = 'edit'
                else:
                    story.append(new_item)
                    action = 'add'

                page['story'] = story
                page['journal'] = page.get('journal', []) + [{
                    'type': action, 'id': _uid(), 'date': now_ms,
                    'item': {'title': page['title']},
                }]

                with open(dest, 'w', encoding='utf-8') as f:
                    json.dump(page, f, ensure_ascii=False)

                print(f'  NARRATIVE   {action} problem {pnum} → pre-visit-summary')
                self._json(200, {
                    'ok':   True,
                    'slug': 'pre-visit-summary',
                    'url':  f'http://{WIKI_HOST}:3000/view/pre-visit-summary',
                })
            except Exception as e:
                print(f'  NARRATIVE ERR {e}')
                self._err(500, str(e))
            return

        self._err(404, f'Unknown endpoint: {path}')


# ── SCP context fetch ────────────────────────────────────────────────────────
def fetch_wiki_page(slug):
    """Fetch a page from scp-experiment.localhost. Returns story list or []."""
    try:
        url = f'http://{WIKI_HOST}:3000/{slug}.json'
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=4) as r:
            return json.loads(r.read())['story']
    except Exception:
        return []

def fetch_scp_context():
    """
    Pull health-log, visits, and about-me from scp-experiment and return
    a list of record-entry dicts that can be appended to the coupler record
    before the Claude call.
    """
    entries = []

    # health-log — diagnoses, symptoms, medications, lab results
    for item in fetch_wiki_page('health-log'):
        if item.get('type') == 'scp-log-entry':
            text = item.get('text') or item.get('summary', '')
            if text and text not in ('Diagnosis', 'Symptom', 'Medication', 'Lab'):
                entries.append({
                    'source': 'scp-health-log',
                    'entry_type': item.get('entry_type', 'note'),
                    'date': item.get('date', ''),
                    'text': text,
                })

    # visits — provider, visit type, date
    for item in fetch_wiki_page('visits'):
        if item.get('type') == 'scp-visit' and item.get('committed'):
            entries.append({
                'source': 'scp-visits',
                'entry_type': 'Visit',
                'date': item.get('date', ''),
                'provider': item.get('provider', ''),
                'visit_type': item.get('visit_type', ''),
                'text': item.get('text', ''),
            })

    # about-me — filled scp-field values
    for item in fetch_wiki_page('about-me'):
        if item.get('type') == 'scp-field' and item.get('value'):
            val = item['value']
            if isinstance(val, list):
                val = ', '.join(val)
            if val and val not in ('Unknown', ''):
                entries.append({
                    'source': 'scp-about-me',
                    'entry_type': 'Background',
                    'field': item.get('field', ''),
                    'label': item.get('label', ''),
                    'text': f"{item.get('label','')}: {val}",
                })

    return entries

def fetch_fhir_context():
    """
    Read scp-fhir/data/scp-import.json (written by transform.py after each pull)
    and return entries in the same record-entry format as fetch_scp_context().
    Returns [] silently if the file doesn't exist yet.
    """
    if not os.path.exists(FHIR_IMPORT):
        return []
    try:
        data = json.loads(open(FHIR_IMPORT).read())
        return data.get('entries', [])
    except Exception as e:
        print(f'FHIR context error: {e}')
        return []

# ── FedWiki helpers ──────────────────────────────────────────────────────────
def _uid():
    return uuid.uuid4().hex[:16]

def esc(s):
    return str(s).replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')

def wiki_slug(title):
    """Convert a FedWiki page title to its on-disk slug (matches FedWiki's own logic)."""
    import re
    return re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')

def build_fedwiki_page(frame):
    now_ms = int(time.time() * 1000)
    problem = frame.get('problem', {})
    title = f"Problem {problem.get('number', '?')}: {problem.get('statement_vernacular', '')}"

    story = []

    def md(text):
        story.append({'type': 'markdown', 'id': _uid(), 'text': text})

    # Header
    md(f"**{problem.get('statement_clinical', '')}**")
    md(f"Status: {problem.get('status', 'active').title()} · "
       f"Frame generated: {frame.get('generated', '')[:10]} · "
       f"Model: {frame.get('model', '')}")

    # Act Now / Move Fast strip
    urgent = [c for c in frame.get('assessment_candidates', []) if c.get('attention_code', 5) <= 2]
    if urgent:
        lines = ['**Needs prompt attention:**', '']
        for c in urgent:
            label = 'Act Now' if c.get('attention_code') == 1 else 'Move Fast'
            lines.append(f"- [{label}] **{c['term']}** ({c.get('vernacular', '')}) — {c.get('severity_vernacular', '')}")
        md('\n'.join(lines))


    def details(heading, rows):
        """Emit one html item: a collapsed <details> block containing HTML rows."""
        inner = '\n'.join(f'<p>{r}</p>' for r in rows)
        html = (f'<details>\n'
                f'<summary style="cursor:pointer;font-weight:bold;font-size:1.1em">{heading}</summary>\n'
                f'<div style="padding:0.5em 1em">{inner}</div>\n'
                f'</details>')
        story.append({'type': 'html', 'id': _uid(), 'text': html})

    # Subjective
    rows = []
    for item in frame.get('subjective', []):
        status = item.get('status', 'absent')
        val    = esc(item.get('value') or '')
        term   = esc(item['term']); vern = esc(item.get('vernacular', ''))
        if status == 'filled':
            rows.append(f'<strong>{term}</strong> ({vern}): {val}')
        elif status == 'partial':
            rows.append(f'<strong>{term}</strong> ({vern}): {val} '
                        f'<em>— Partial: {esc(item.get("missing","incomplete"))}</em>')
        else:
            rows.append(f'<em>Not yet gathered:</em> {term} ({vern})')
    details('SUBJECTIVE', rows)

    # Objective
    rows = []
    for item in frame.get('objective', []):
        status = item.get('status', 'absent')
        val    = esc(item.get('value') or '')
        term   = esc(item['term']); vern = esc(item.get('vernacular', ''))
        how    = esc(item.get('how_obtained', ''))
        if status == 'filled':
            rows.append(f'<strong>{term}</strong> ({vern}): {val} — obtained via {how}')
        elif status == 'partial':
            rows.append(f'<strong>{term}</strong> ({vern}): {val} '
                        f'<em>— Partial: {esc(item.get("missing","incomplete"))}</em>')
        else:
            rows.append(f'<em>Not yet gathered:</em> {term} ({vern}) — {how}')
    details('OBJECTIVE', rows)

    # Assessment
    code_labels = {1: 'Act Now', 2: 'Move Fast', 3: 'Work On It', 4: 'Watch It', 5: 'Let It Rest'}
    rows = []
    candidates = sorted(frame.get('assessment_candidates', []),
                        key=lambda c: -c.get('probability', {}).get('estimate', 0))
    for c in candidates:
        prob = c.get('probability', {})
        code = c.get('attention_code', 5)
        rows.append(f'<strong>{esc(c["term"])}</strong> ({esc(c.get("vernacular",""))})')
        rows.append(f'Probability: {int(prob.get("estimate",0)*100)}% (Band {esc(prob.get("band","?"))}) · '
                    f'Severity: Class {esc(c.get("severity_class","?"))} · '
                    f'Attention {code} — {code_labels.get(code,"")}')
        rows.append(f'Basis: {esc(c.get("basis",""))}')
        if c.get('confidence_note'):
            rows.append(f'<em>{esc(c["confidence_note"])}</em>')
        if c.get('supported_by'):
            rows.append(f'Supported by: {esc(", ".join(c["supported_by"]))}')
        if c.get('refuted_by'):
            rows.append(f'Refuted by: {esc(", ".join(c["refuted_by"]))}')
        if c.get('not_yet_testable'):
            rows.append(f'Not yet testable: {esc(", ".join(c["not_yet_testable"]))}')
        rows.append(f'If missed: {esc(c.get("severity_vernacular",""))}')
        rows.append('<hr>')
    residual = frame.get('residual', {})
    rows.append(f'<strong>Residual</strong> — something not on this list: '
                f'{esc(residual.get("vernacular",""))} '
                f'({int(residual.get("probability_estimate", 0.1)*100)}%)')
    details('ASSESSMENT — Candidates', rows)

    # Plan
    rows = []
    for p in frame.get('plan_options', []):
        rows.append(f'<strong>{esc(p["term"])}</strong> ({esc(p.get("vernacular",""))})')
        rows.append(f'{esc(p.get("basis",""))} — Can be done by: {esc(p.get("who_can_act",""))}')
        rows.append('<hr>')
    details('PLAN Options', rows)

    # Not yet gathered summary (always visible — it is the gap list)
    absent_s = [i['term'] for i in frame.get('subjective', []) if i.get('status') == 'absent']
    absent_o = [i['term'] for i in frame.get('objective', []) if i.get('status') == 'absent']
    if absent_s or absent_o:
        rows = []
        if absent_s:
            rows.append('<strong>Subjective</strong>')
            rows.extend(f'• {esc(t)}' for t in absent_s)
        if absent_o:
            rows.append('<strong>Objective</strong>')
            rows.extend(f'• {esc(t)}' for t in absent_o)
        details('NOT YET GATHERED', rows)

    journal = [{'type': 'create', 'id': _uid(), 'date': now_ms,
                'item': {'title': title}}]

    return {'title': title, 'story': story, 'journal': journal}


# ── Main ─────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    os.makedirs(DATA_DIR, exist_ok=True)
    if not API_KEY:
        print('  ANTHROPIC_API_KEY not set — AI endpoints will not work.')
        print('  Set it with: export ANTHROPIC_API_KEY=sk-ant-...')
    print(f'SCP Coupler Proxy running at http://localhost:{PORT}')
    print(f'Serving files from: {UI_DIR}')
    print(f'Data directory:     {DATA_DIR}')
    print('Ctrl+C to stop.\n')
    ThreadingHTTPServer(('0.0.0.0', PORT), Handler).serve_forever()
