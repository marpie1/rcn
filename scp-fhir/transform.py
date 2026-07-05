#!/usr/bin/env python3
"""
transform.py — Map raw FHIR bundles → scp-import.json (coupler record-entry format)

Run automatically after each smart-proxy pull, or manually:
  python3 scp-fhir/transform.py
"""

import json, datetime
from collections import Counter
from pathlib import Path

HERE = Path(__file__).parent
RAW  = HERE / 'data' / 'raw'
OUT  = HERE / 'data' / 'scp-import.json'

# ── FHIR field helpers ────────────────────────────────────────────────────────

def resources(filename):
    """Load a raw file, return only real resources (drop OperationOutcome etc)."""
    path = RAW / filename
    if not path.exists():
        return []
    data = json.loads(path.read_text())
    if isinstance(data, list):
        return [e['resource'] for e in data
                if 'resource' in e
                and e['resource'].get('resourceType') not in ('OperationOutcome',)]
    if isinstance(data, dict) and data.get('resourceType') not in ('OperationOutcome',):
        return [data]
    return []

def code_text(cc):
    """Best display string from a CodeableConcept."""
    if not cc:
        return None
    if 'text' in cc:
        return cc['text']
    for c in cc.get('coding', []):
        if c.get('display'):
            return c['display']
    return None

def code_for(cc, system_substring):
    """Extract code value for a given coding system."""
    for c in (cc or {}).get('coding', []):
        if system_substring in c.get('system', ''):
            return c.get('code')
    return None

def first_date(r, *fields):
    """Try fields in order, return ISO date string (YYYY-MM-DD) of first hit."""
    for f in fields:
        v = r.get(f)
        if isinstance(v, dict):
            v = v.get('start') or v.get('end') or next(iter(v.values()), None)
        if v and isinstance(v, str):
            return v[:10]
    return ''

def obs_value(r):
    """Human-readable value from an Observation resource."""
    if 'valueQuantity' in r:
        q = r['valueQuantity']
        return f"{q.get('value','')} {(q.get('unit') or q.get('code','')).strip()}".strip()
    if 'valueString' in r:
        return r['valueString']
    if 'valueCodeableConcept' in r:
        return code_text(r['valueCodeableConcept']) or ''
    if 'valueBoolean' in r:
        return 'Yes' if r['valueBoolean'] else 'No'
    if 'component' in r:
        parts = []
        for comp in r['component']:
            label = code_text(comp.get('code'))
            val   = obs_value(comp)
            if label and val:
                parts.append(f"{label}: {val}")
        return ', '.join(parts)
    return None

def clinical_status(r):
    """Return the clinical status code string, or None."""
    return (r.get('clinicalStatus') or {}).get('coding', [{}])[0].get('code')

# ── Resource transformers ──────────────────────────────────────────────────────

def transform_patient():
    entries, meta = [], {}
    for r in resources('Patient.json'):
        # best name
        name = None
        for n in r.get('name', []):
            text = n.get('text') or f"{' '.join(n.get('given', []))} {n.get('family', '')}".strip()
            if n.get('use') == 'official' or name is None:
                name = text
        dob    = r.get('birthDate', '')
        gender = r.get('gender', '')
        meta   = {'name': name, 'dob': dob, 'gender': gender, 'fhir_id': r.get('id')}
        if name:
            entries.append({
                'source':     'fhir-patient',
                'entry_type': 'Background',
                'field':      'patient',
                'label':      'Patient',
                'date':       dob,
                'text':       f"Patient: {name}, {gender}, born {dob}",
            })
    return entries, meta

def transform_conditions():
    entries, problems = [], []
    active_codes = {'active', 'recurrence', 'relapse'}
    for r in resources('Condition.json'):
        if clinical_status(r) not in active_codes:
            continue
        text   = code_text(r.get('code'))
        if not text:
            continue
        icd10  = code_for(r.get('code'), 'icd-10')
        snomed = code_for(r.get('code'), 'snomed')
        onset  = first_date(r, 'onsetDateTime', 'onsetPeriod', 'recordedDate')
        sev    = code_text(r.get('severity'))
        problems.append({
            'text':        text,
            'code_icd10':  icd10,
            'code_snomed': snomed,
            'status':      'active',
            'onset':       onset,
            'severity':    sev,
        })
        note = f"Problem: {text}"
        if icd10:  note += f" (ICD-10 {icd10})"
        if snomed: note += f" / SNOMED {snomed}"
        if onset:  note += f", onset {onset}"
        if sev:    note += f", severity: {sev}"
        entries.append({
            'source':      'fhir-condition',
            'entry_type':  'Diagnosis',
            'date':        onset,
            'text':        note,
            'code_icd10':  icd10,
            'code_snomed': snomed,
        })
    return entries, problems

def transform_medications():
    entries = []
    for r in resources('MedicationRequest.json'):
        if r.get('status') not in ('active', 'on-hold'):
            continue
        text = code_text(r.get('medicationCodeableConcept'))
        if not text:
            continue
        dosage = next((d.get('text','') for d in r.get('dosageInstruction', [])), '')
        date   = first_date(r, 'authoredOn')
        note   = f"Medication: {text}"
        if dosage: note += f" — {dosage}"
        entries.append({
            'source':     'fhir-medication',
            'entry_type': 'Medication',
            'date':       date,
            'text':       note,
        })
    return entries

def transform_allergies():
    entries = []
    for r in resources('AllergyIntolerance.json'):
        if clinical_status(r) == 'inactive':
            continue
        text = code_text(r.get('code'))
        if not text:
            continue
        reaction = ''
        for rx in r.get('reaction', []):
            for m in rx.get('manifestation', []):
                reaction = code_text(m) or ''
                break
            break
        note = f"Allergy: {text}"
        if reaction: note += f" → {reaction}"
        entries.append({
            'source':     'fhir-allergy',
            'entry_type': 'Allergy',
            'date':       first_date(r, 'recordedDate'),
            'text':       note,
        })
    return entries

def transform_observations(filename, source_tag, type_tag):
    """Labs and vitals — de-duplicate to most recent value per test type."""
    latest = {}
    for r in resources(filename):
        if r.get('status') in ('cancelled', 'entered-in-error'):
            continue
        label = code_text(r.get('code'))
        value = obs_value(r)
        if not label or not value:
            continue
        date = first_date(r, 'effectiveDateTime', 'effectivePeriod', 'issued')
        key  = code_for(r.get('code'), 'loinc') or label
        if key not in latest or date > latest[key]['date']:
            latest[key] = {
                'source':     source_tag,
                'entry_type': type_tag,
                'date':       date,
                'label':      label,
                'value':      value,
                'text':       f"{type_tag}: {label} = {value}",
            }
    return list(latest.values())

def transform_reports():
    entries = []
    for r in resources('DiagnosticReport.json'):
        if r.get('status') in ('cancelled', 'entered-in-error', 'preliminary'):
            continue
        text = code_text(r.get('code'))
        if not text:
            continue
        conclusion = r.get('conclusion', '')
        date = first_date(r, 'effectiveDateTime', 'effectivePeriod', 'issued')
        note = f"Report: {text}"
        if conclusion: note += f" — {conclusion}"
        entries.append({
            'source':     'fhir-report',
            'entry_type': 'Report',
            'date':       date,
            'text':       note,
        })
    return entries

def transform_immunizations():
    entries = []
    for r in resources('Immunization.json'):
        if r.get('status') == 'not-done':
            continue
        text = code_text(r.get('vaccineCode'))
        if not text:
            continue
        entries.append({
            'source':     'fhir-immunization',
            'entry_type': 'Immunization',
            'date':       first_date(r, 'occurrenceDateTime', 'recorded'),
            'text':       f"Immunization: {text}",
        })
    return entries

def transform_procedures():
    entries = []
    for r in resources('Procedure.json'):
        if r.get('status') in ('not-done', 'entered-in-error'):
            continue
        text = code_text(r.get('code'))
        if not text:
            continue
        entries.append({
            'source':     'fhir-procedure',
            'entry_type': 'Procedure',
            'date':       first_date(r, 'performedDateTime', 'performedPeriod'),
            'text':       f"Procedure: {text}",
        })
    return entries

def transform_goals():
    entries = []
    for r in resources('Goal.json'):
        text = (r.get('description') or {}).get('text')
        if not text:
            continue
        status = code_text(r.get('achievementStatus')) or r.get('lifecycleStatus', '')
        date   = first_date(r, 'startDate')
        note   = f"Goal: {text}"
        if status: note += f" [{status}]"
        entries.append({
            'source':     'fhir-goal',
            'entry_type': 'Goal',
            'date':       date,
            'text':       note,
        })
    return entries

def transform_careplans():
    entries = []
    for r in resources('CarePlan.json'):
        if r.get('status') in ('revoked', 'entered-in-error'):
            continue
        cats  = r.get('category', [])
        title = r.get('title') or (code_text(cats[0]) if cats else None) or 'Care plan'
        date  = first_date(r, 'period')
        entries.append({
            'source':     'fhir-careplan',
            'entry_type': 'CarePlan',
            'date':       date,
            'text':       f"Care plan: {title}",
        })
    return entries

# ── Main ──────────────────────────────────────────────────────────────────────

def transform():
    patient_entries, patient_meta = transform_patient()
    condition_entries, problems   = transform_conditions()

    entries = (
        patient_entries +
        condition_entries +
        transform_medications() +
        transform_allergies() +
        transform_observations('Observation_lab.json',   'fhir-lab',   'Lab') +
        transform_observations('Observation_vital.json', 'fhir-vital', 'Vital') +
        transform_reports() +
        transform_immunizations() +
        transform_procedures() +
        transform_goals() +
        transform_careplans()
    )

    # Sort by date descending; undated entries go last
    entries.sort(key=lambda e: e.get('date') or '', reverse=True)

    output = {
        'patient':          patient_meta,
        'problems':         problems,
        'entries':          entries,
        'problem_count':    len(problems),
        'entry_count':      len(entries),
        'transformed_at':   datetime.datetime.now().isoformat(),
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(output, indent=2, ensure_ascii=False))
    return output

if __name__ == '__main__':
    result = transform()

    print(f"\nPatient: {result['patient'].get('name')} | "
          f"{result['patient'].get('gender')} | "
          f"born {result['patient'].get('dob')}")

    print(f"\nProblems ({result['problem_count']}):")
    for p in result['problems']:
        codes = ' / '.join(filter(None, [p.get('code_icd10'), p.get('code_snomed')]))
        print(f"  • {p['text']}" + (f" ({codes})" if codes else ''))

    print(f"\nEntries ({result['entry_count']}) by type:")
    counts = Counter(e['entry_type'] for e in result['entries'])
    for k, v in sorted(counts.items()):
        print(f"  {k:20s} {v}")

    print(f"\nSaved → {OUT}")
