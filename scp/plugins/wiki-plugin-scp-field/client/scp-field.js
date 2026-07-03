/**
 * wiki-plugin-scp-field
 * Styles are injected directly — FedWiki does not auto-load plugin CSS files.
 *
 * Supported widgets:
 *   textarea     — free text, auto-expanding
 *   select       — single-choice dropdown
 *   multiselect  — multiple checkboxes
 *   toggle       — yes/no boolean with optional comments
 *   contact-card   — emergency contact (name, phone, alt phone)
 *   person-card    — care team member (role, contact, access, appointments, comments)
 *   reaction-card   — allergy/intolerance or contraindication
 *   diagnosis-card    — chronic/long-term diagnosis
 *   medication-card   — prescribed or additional medication
 */

(function () {
  'use strict';

  // ── Styles (injected once into <head>) ─────────────────────────────────────

  var STYLES = '\
.scp-field{margin:.625rem 0;padding:.875rem 1rem;background:#fff;border:1px solid #e2e2ea;border-left:3px solid #5b6af0;border-radius:4px}\
.scp-label{font-weight:600;font-size:.875rem;color:#1a1a2e;margin-bottom:.25rem}\
.scp-hint{font-size:.8rem;color:#6b7280;margin-bottom:.5rem}\
.scp-textarea,.scp-select,.scp-comments-ta{display:block;width:100%;font-family:inherit;font-size:.9rem;line-height:1.4;padding:.5rem .625rem;border:1px solid #d1d5db;border-radius:4px;background:#fafafa;color:#1a1a2e;transition:border-color .15s,background .15s}\
.scp-textarea,.scp-comments-ta{min-height:2.2rem;overflow:hidden;resize:none}\
.scp-textarea:focus,.scp-select:focus,.scp-comments-ta:focus{outline:none;border-color:#5b6af0;background:#fff;box-shadow:0 0 0 2px rgba(91,106,240,.12)}\
.scp-select{appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%236b7280\' stroke-width=\'1.5\' fill=\'none\' stroke-linecap=\'round\'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right .75rem center;padding-right:2rem;cursor:pointer}\
.scp-checkgroup{display:flex;flex-wrap:wrap;gap:.5rem 1.5rem;padding:.25rem 0}\
.scp-check-label{display:flex;align-items:center;gap:.375rem;font-size:.9rem;color:#1a1a2e;cursor:pointer;user-select:none}\
.scp-checkbox{width:16px;height:16px;accent-color:#5b6af0;cursor:pointer;flex-shrink:0}\
.scp-toggle-label{display:flex;align-items:center;gap:.5rem;cursor:pointer;user-select:none}\
.scp-toggle{width:18px;height:18px;accent-color:#5b6af0;cursor:pointer}\
.scp-toggle-text{font-size:.9rem;color:#1a1a2e}\
.scp-comments-wrap{margin-top:.625rem}\
.scp-comments-label{display:block;font-size:.78rem;font-weight:500;color:#6b7280;margin-bottom:.25rem}\
.scp-hidden{display:none}\
.scp-card-rows{display:flex;flex-direction:column;gap:0}\
.scp-card-row{display:flex;align-items:center;gap:.5rem;padding:.3rem 0;border-bottom:1px solid #f3f4f6}\
.scp-card-row:last-child{border-bottom:none}\
.scp-card-label{flex:0 0 130px;font-size:.78rem;font-weight:500;color:#6b7280}\
.scp-card-input,.scp-card-select{flex:1;font-family:inherit;font-size:.88rem;padding:.25rem .5rem;border:1px solid #e5e7eb;border-radius:3px;background:#fafafa;color:#1a1a2e;min-width:0}\
.scp-card-input:focus,.scp-card-select:focus{outline:none;border-color:#5b6af0;background:#fff}\
.scp-card-select{appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\' viewBox=\'0 0 10 6\'%3E%3Cpath d=\'M1 1l4 4 4-4\' stroke=\'%236b7280\' stroke-width=\'1.5\' fill=\'none\' stroke-linecap=\'round\'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right .5rem center;padding-right:1.5rem;cursor:pointer}\
.scp-card-toggle{width:16px;height:16px;accent-color:#5b6af0;cursor:pointer}\
.scp-card-comments{flex:1;font-family:inherit;font-size:.88rem;padding:.25rem .5rem;border:1px solid #e5e7eb;border-radius:3px;background:#fafafa;color:#1a1a2e;min-height:1.8rem;overflow:hidden;resize:none;min-width:0}\
.scp-card-comments:focus{outline:none;border-color:#5b6af0;background:#fff}\
.scp-access-full{color:#166534}.scp-access-view{color:#1e40af}.scp-access-none{color:#991b1b}\
@media(max-width:600px){.scp-field{padding:.75rem}.scp-checkgroup{gap:.5rem 1rem}.scp-card-label{flex:0 0 100px}}\
.scp-none-known{font-size:.88rem;color:#6b7280;font-style:italic;padding:.3rem 0 .5rem}\
.scp-not-prescribed-flagged{border-color:#f59e0b;background:#fffbeb}\
.scp-not-prescribed-flagged:focus{border-color:#d97706;box-shadow:0 0 0 2px rgba(245,158,11,.15)}\
.scp-card-row-top{align-items:flex-start;padding-top:.4rem}\
.scp-reactions-group{padding:.1rem 0}\
';


  var stylesInjected = false;
  function ensureStyles() {
    if (stylesInjected) return;
    var el = document.createElement('style');
    el.textContent = STYLES;
    document.head.appendChild(el);
    stylesInjected = true;
  }

  // ── Shared option lists ────────────────────────────────────────────────────

  var SCP_PAGE_OPTIONS = [
    'About Me',
    'Care Team',
    'Diagnoses',
    'Medications',
    'Reactions',
    'History',
    'Next Steps',
    'Health Log',
    'Advanced Directives'
  ];

  var ACCESS_LEVEL_OPTIONS = ['Full Plan', 'Selected Pages'];

  var ACTIVITY_ACTION_OPTIONS = ['Viewed', 'Received Copy', 'Updated', 'Other'];

  var CPR_OPTIONS = [
    'Attempt CPR',
    'Do Not Attempt CPR (DNAR)'
  ];

  var MEDICAL_INTERVENTIONS_OPTIONS = [
    'Full Treatment',
    'Limited Interventions',
    'Comfort Measures Only'
  ];

  var VITAL_MEASUREMENT_OPTIONS = [
    'Blood Pressure',
    'Blood Glucose',
    'Weight',
    'Heart Rate / Pulse',
    'Temperature',
    'Oxygen Saturation (SpO2)',
    'Other'
  ];

  var SYMPTOM_SEVERITY_OPTIONS = ['Mild', 'Moderate', 'Severe', 'Very Severe'];

  var VISIT_TYPE_OPTIONS = [
    'Office Visit',
    'Telehealth / Video',
    'Phone / Nurse Line',
    'Emergency Room',
    'Hospital / Inpatient',
    'Lab / Imaging',
    'Other'
  ];

  var HISTORY_SECTION_OPTIONS = [
    { value: 'procedure',     label: 'Procedure / Surgery' },
    { value: 'hospital-visit', label: 'Hospital Visit' },
    { value: 'immunization',  label: 'Immunization' }
  ];

  var MED_TYPE_OPTIONS = ['Prescribed', 'Additional / OTC'];

  var TIMING_OPTIONS = [
    'Morning / Breakfast',
    'Midday / Lunch',
    'Evening / Dinner',
    'Bedtime',
    'As Needed (PRN)',
    'Other'
  ];

  var SUBSTANCE_TYPE_OPTIONS = [
    'Drug',
    'Food',
    'Environmental',
    'Latex / Material',
    'Contrast / Imaging',
    'Biological',
    'Insect / Venom',
    'Other'
  ];

  var REACTION_OPTIONS = [
    'Hives / Urticaria',
    'Rash',
    'Shortness of Breath',
    'Anaphylaxis',
    'Swelling / Angioedema',
    'Nausea / Vomiting',
    'Itching / Pruritus',
    'Dizziness / Fainting',
    'Stomach Pain / Cramping',
    'Other'
  ];

  var SECTION_OPTIONS = [
    { value: 'allergy',          label: 'Allergy / Intolerance' },
    { value: 'contraindication', label: 'Contraindication' }
  ];

  var ROLE_OPTIONS = [
    'Patient',
    'Primary Care Physician',
    'Specialist',
    'Nurse / NP / PA',
    'Community Health Worker',
    'Pharmacist',
    'Mental Health Provider',
    'Therapist / PT / OT',
    'Home Health Aide',
    'Social Worker',
    'Care Coordinator',
    'Clinical Care Specialist',
    'Family Member',
    'Friend / Neighbor',
    'Organization',
    'Other'
  ];

  var ACCESS_OPTIONS = [
    { value: 'full', label: 'Full Edit' },
    { value: 'view', label: 'View Only' },
    { value: 'none', label: 'No Access' }
  ];

  // ── emit ───────────────────────────────────────────────────────────────────

  function emit($item, item) {
    ensureStyles();
    $item.append(renderField(item));
  }

  // ── bind ───────────────────────────────────────────────────────────────────

  function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }

  function bind($item, item) {
    // initialise auto-height on pre-filled textareas
    $item.find('.scp-textarea, .scp-comments-ta, .scp-card-comments').each(function () {
      autoResize(this);
    });

    // ── original widgets ───────────────────────────────────────────────────

    $item.find('.scp-textarea').on('input', debounce(function () {
      autoResize(this);
      item.value = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-select').on('change', function () {
      item.value = this.value;
      markChanged($item);
    });

    $item.find('.scp-checkbox').on('change', function () {
      var vals = [];
      $item.find('.scp-checkbox:checked').each(function () { vals.push(this.value); });
      item.value = vals;
      markChanged($item);
    });

    $item.find('.scp-toggle').on('change', function () {
      item.value = this.checked;
      $item.find('.scp-comments-wrap').toggleClass('scp-hidden', !this.checked);
      markChanged($item);
    });

    $item.find('.scp-comments-ta').on('input', debounce(function () {
      autoResize(this);
      item.comments = this.value;
      markChanged($item);
    }, 600));

    // ── contact-card ───────────────────────────────────────────────────────

    $item.find('.scp-name').on('input', debounce(function () {
      item.name = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-phone').on('input', debounce(function () {
      item.phone = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-phone-alt').on('input', debounce(function () {
      item.phone_alt = this.value;
      markChanged($item);
    }, 600));

    // ── person-card ────────────────────────────────────────────────────────

    $item.find('.scp-role').on('change', function () {
      item.role = this.value;
      markChanged($item);
    });

    $item.find('.scp-contact').on('input', debounce(function () {
      item.contact = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-contact-alt').on('input', debounce(function () {
      item.contact_alt = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-access').on('change', function () {
      item.access = this.value;
      markChanged($item);
    });

    $item.find('.scp-appointments').on('change', function () {
      item.appointments = this.checked;
      markChanged($item);
    });

    $item.find('.scp-card-comments').on('input', debounce(function () {
      autoResize(this);
      item.comments = this.value;
      markChanged($item);
    }, 600));

    // ── reaction-card ──────────────────────────────────────────────────────

    $item.find('.scp-section').on('change', function () {
      item.section = this.value;
      markChanged($item);
    });

    $item.find('.scp-substance-type').on('change', function () {
      item.substance_type = this.value;
      markChanged($item);
    });

    $item.find('.scp-reaction-check').on('change', function () {
      var vals = [];
      $item.find('.scp-reaction-check:checked').each(function () { vals.push(this.value); });
      item.reactions = vals;
      markChanged($item);
    });

    $item.find('.scp-reason').on('input', debounce(function () {
      autoResize(this);
      item.reason = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-date-occurred').on('change', function () {
      item.date_occurred = this.value;
      markChanged($item);
    });

    $item.find('.scp-documented-by').on('input', debounce(function () {
      item.documented_by = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-private').on('change', function () {
      item.private = this.checked;
      markChanged($item);
    });

    $item.find('.scp-notes').on('input', debounce(function () {
      autoResize(this);
      item.notes = this.value;
      markChanged($item);
    }, 600));

    // ── diagnosis-card ─────────────────────────────────────────────────────

    $item.find('.scp-description').on('input', debounce(function () {
      item.description = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-icd-code').on('input', debounce(function () {
      item.icd_code = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-date-diagnosed').on('input', debounce(function () {
      item.date_diagnosed = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-diagnosed-by').on('input', debounce(function () {
      item.diagnosed_by = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-dx-comments').on('input', debounce(function () {
      autoResize(this);
      item.comments = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-dx-private').on('change', function () {
      item.private = this.checked;
      markChanged($item);
    });

    // ── access-card ───────────────────────────────────────────────────────

    $item.find('.scp-access-name').on('input', debounce(function () {
      item.name = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-access-role').on('input', debounce(function () {
      item.role = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-access-org').on('input', debounce(function () {
      item.organization = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-access-level').on('change', function () {
      item.access_level = this.value;
      markChanged($item);
    });

    $item.find('.scp-access-granted').on('input', debounce(function () {
      item.access_granted = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-access-expires').on('input', debounce(function () {
      item.access_expires = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-access-active').on('change', function () {
      item.active = this.checked;
      markChanged($item);
    });

    $item.find('.scp-pages-check').on('change', function () {
      var vals = [];
      $item.find('.scp-pages-check:checked').each(function () { vals.push(this.value); });
      item.pages_shared = vals;
      markChanged($item);
    });

    $item.find('.scp-access-comments').on('input', debounce(function () {
      autoResize(this);
      item.comments = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-access-private').on('change', function () {
      item.private = this.checked;
      markChanged($item);
    });

    // ── activity-card ─────────────────────────────────────────────────────

    $item.find('.scp-activity-date').on('input', debounce(function () {
      item.date = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-activity-who').on('input', debounce(function () {
      item.who = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-activity-action').on('change', function () {
      item.action = this.value;
      markChanged($item);
    });

    $item.find('.scp-activity-pages').on('input', debounce(function () {
      item.pages = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-activity-notes').on('input', debounce(function () {
      autoResize(this);
      item.notes = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-activity-private').on('change', function () {
      item.private = this.checked;
      markChanged($item);
    });

    // ── snapshot-card ─────────────────────────────────────────────────────

    $item.find('.scp-snapshot-by').on('input', debounce(function () {
      item.exported_by = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-snapshot-date').on('input', debounce(function () {
      item.export_date = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-snapshot-count').on('input', debounce(function () {
      item.access_count = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-snapshot-pages').on('input', debounce(function () {
      item.pages_exported = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-snapshot-notes').on('input', debounce(function () {
      autoResize(this);
      item.notes = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-snapshot-private').on('change', function () {
      item.private = this.checked;
      markChanged($item);
    });

    // ── polst-card ────────────────────────────────────────────────────────

    $item.find('.scp-polst-date-signed').on('input', debounce(function () {
      item.date_signed = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-polst-signed-by').on('input', debounce(function () {
      item.signed_by = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-polst-cpr').on('change', function () {
      item.cpr_preference = this.value;
      markChanged($item);
    });

    $item.find('.scp-polst-interventions').on('change', function () {
      item.medical_interventions = this.value;
      markChanged($item);
    });

    $item.find('.scp-polst-comments').on('input', debounce(function () {
      autoResize(this);
      item.comments = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-polst-doc-location').on('input', debounce(function () {
      autoResize(this);
      item.document_location = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-polst-private').on('change', function () {
      item.private = this.checked;
      markChanged($item);
    });

    // ── agent-card ────────────────────────────────────────────────────────

    $item.find('.scp-agent-name').on('input', debounce(function () {
      item.name = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-agent-relationship').on('input', debounce(function () {
      item.relationship = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-agent-phone').on('input', debounce(function () {
      item.phone = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-agent-phone-alt').on('input', debounce(function () {
      item.phone_alt = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-agent-email').on('input', debounce(function () {
      item.email = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-agent-authorized').on('input', debounce(function () {
      autoResize(this);
      item.authorized = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-agent-limitations').on('input', debounce(function () {
      autoResize(this);
      item.limitations = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-agent-doc-date').on('input', debounce(function () {
      item.date_of_document = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-agent-private').on('change', function () {
      item.private = this.checked;
      markChanged($item);
    });

    // ── wishes-card ───────────────────────────────────────────────────────

    $item.find('.scp-wishes-where').on('input', debounce(function () {
      autoResize(this);
      item.where_i_want_to_be = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-wishes-what-matters').on('input', debounce(function () {
      autoResize(this);
      item.what_matters_most = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-wishes-religious').on('input', debounce(function () {
      autoResize(this);
      item.religious_spiritual = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-wishes-other').on('input', debounce(function () {
      autoResize(this);
      item.other_wishes = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-wishes-private').on('change', function () {
      item.private = this.checked;
      markChanged($item);
    });

    // ── vital-card ────────────────────────────────────────────────────────

    $item.find('.scp-vital-measurement').on('change', function () {
      item.measurement = this.value;
      markChanged($item);
    });

    $item.find('.scp-vital-value').on('input', debounce(function () {
      item.value = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-vital-unit').on('input', debounce(function () {
      item.unit = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-vital-date').on('input', debounce(function () {
      item.date = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-vital-time').on('input', debounce(function () {
      item.time = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-vital-notes').on('input', debounce(function () {
      autoResize(this);
      item.notes = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-vital-private').on('change', function () {
      item.private = this.checked;
      markChanged($item);
    });

    // ── symptom-card ──────────────────────────────────────────────────────

    $item.find('.scp-symptom-text').on('input', debounce(function () {
      autoResize(this);
      item.symptom = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-symptom-severity').on('change', function () {
      item.severity = this.value;
      markChanged($item);
    });

    $item.find('.scp-symptom-date').on('input', debounce(function () {
      item.date = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-symptom-duration').on('input', debounce(function () {
      item.duration = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-symptom-cause').on('input', debounce(function () {
      autoResize(this);
      item.possible_cause = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-symptom-action').on('input', debounce(function () {
      autoResize(this);
      item.action_taken = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-symptom-private').on('change', function () {
      item.private = this.checked;
      markChanged($item);
    });

    // ── visit-card ────────────────────────────────────────────────────────

    $item.find('.scp-visit-provider').on('input', debounce(function () {
      item.provider = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-visit-type').on('change', function () {
      item.visit_type = this.value;
      markChanged($item);
    });

    $item.find('.scp-visit-date').on('input', debounce(function () {
      item.date = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-visit-reason').on('input', debounce(function () {
      autoResize(this);
      item.reason = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-visit-outcome').on('input', debounce(function () {
      autoResize(this);
      item.outcome = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-visit-followup').on('input', debounce(function () {
      autoResize(this);
      item.follow_up = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-visit-private').on('change', function () {
      item.private = this.checked;
      markChanged($item);
    });

    // ── goal-card ─────────────────────────────────────────────────────────

    $item.find('.scp-goal-text').on('input', debounce(function () {
      autoResize(this);
      item.goal = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-goal-date-set').on('input', debounce(function () {
      item.date_set = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-goal-target-date').on('input', debounce(function () {
      item.target_date = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-goal-set-by').on('input', debounce(function () {
      item.set_by = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-goal-achieved').on('change', function () {
      item.achieved = this.checked;
      markChanged($item);
    });

    $item.find('.scp-goal-comments').on('input', debounce(function () {
      autoResize(this);
      item.comments = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-goal-private').on('change', function () {
      item.private = this.checked;
      markChanged($item);
    });

    // ── action-card ───────────────────────────────────────────────────────

    $item.find('.scp-action-text').on('input', debounce(function () {
      autoResize(this);
      item.action = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-action-due-date').on('input', debounce(function () {
      item.due_date = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-action-assigned-to').on('input', debounce(function () {
      item.assigned_to = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-action-completed').on('change', function () {
      item.completed = this.checked;
      markChanged($item);
    });

    $item.find('.scp-action-comments').on('input', debounce(function () {
      autoResize(this);
      item.comments = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-action-private').on('change', function () {
      item.private = this.checked;
      markChanged($item);
    });

    // ── history-card ──────────────────────────────────────────────────────

    $item.find('.scp-history-section').on('change', function () {
      item.section = this.value;
      markChanged($item);
    });

    $item.find('.scp-history-date').on('input', debounce(function () {
      item.date = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-history-performed-by').on('input', debounce(function () {
      item.performed_by = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-history-dose').on('input', debounce(function () {
      item.dose_number = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-history-comments').on('input', debounce(function () {
      autoResize(this);
      item.comments = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-history-private').on('change', function () {
      item.private = this.checked;
      markChanged($item);
    });

    // ── medication-card ────────────────────────────────────────────────────

    $item.find('.scp-med-type').on('change', function () {
      item.med_type = this.value;
      markChanged($item);
    });

    $item.find('.scp-rxnorm').on('input', debounce(function () {
      item.rxnorm_code = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-prescribed-by').on('input', debounce(function () {
      item.prescribed_by = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-started').on('input', debounce(function () {
      item.started = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-directions').on('input', debounce(function () {
      autoResize(this);
      item.directions = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-use').on('input', debounce(function () {
      autoResize(this);
      item.use = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-timing-check').on('change', function () {
      var vals = [];
      $item.find('.scp-timing-check:checked').each(function () { vals.push(this.value); });
      item.timing = vals;
      markChanged($item);
    });

    $item.find('.scp-not-prescribed').on('input', debounce(function () {
      autoResize(this);
      item.not_prescribed = this.value;
      markChanged($item);
    }, 600));

    $item.find('.scp-med-private').on('change', function () {
      item.private = this.checked;
      markChanged($item);
    });

  }

  // ── Save ───────────────────────────────────────────────────────────────────

  function markChanged($item) {
    $item.trigger('change');
    $item.parents('.page').trigger('thumb');
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  function renderField(item) {
    var label = esc(item.label || item.field || '');
    var hint  = item.hint ? '<div class="scp-hint">' + esc(item.hint) + '</div>' : '';
    return '<div class="scp-field" data-field="' + esc(item.field || '') + '">' +
      '<div class="scp-label">' + label + '</div>' +
      hint +
      '<div class="scp-widget">' + renderWidget(item) + '</div>' +
      renderComments(item) +
    '</div>';
  }

  function renderWidget(item) {
    switch (item.widget) {
      case 'select':       return renderSelect(item);
      case 'multiselect':  return renderMultiselect(item);
      case 'toggle':       return renderToggle(item);
      case 'contact-card':  return renderContactCard(item);
      case 'person-card':   return renderPersonCard(item);
      case 'reaction-card':   return renderReactionCard(item);
      case 'diagnosis-card':    return renderDiagnosisCard(item);
      case 'medication-card':   return renderMedicationCard(item);
      case 'history-card':      return renderHistoryCard(item);
      case 'goal-card':         return renderGoalCard(item);
      case 'action-card':       return renderActionCard(item);
      case 'vital-card':        return renderVitalCard(item);
      case 'symptom-card':      return renderSymptomCard(item);
      case 'visit-card':        return renderVisitCard(item);
      case 'polst-card':        return renderPolstCard(item);
      case 'agent-card':        return renderAgentCard(item);
      case 'wishes-card':       return renderWishesCard(item);
      case 'access-card':       return renderAccessCard(item);
      case 'activity-card':     return renderActivityCard(item);
      case 'snapshot-card':     return renderSnapshotCard(item);
      default:             return renderTextarea(item);
    }
  }

  function renderTextarea(item) {
    return '<textarea class="scp-textarea" rows="1">' + esc(item.value || '') + '</textarea>';
  }

  function renderSelect(item) {
    var options = (item.options || []).map(function (o) {
      var sel = (o === item.value) ? ' selected' : '';
      return '<option value="' + esc(o) + '"' + sel + '>' + esc(o) + '</option>';
    }).join('');
    return '<select class="scp-select">' + options + '</select>';
  }

  function renderMultiselect(item) {
    var values = Array.isArray(item.value) ? item.value : [];
    var boxes = (item.options || []).map(function (o) {
      var chk = values.indexOf(o) !== -1 ? ' checked' : '';
      return '<label class="scp-check-label">' +
        '<input type="checkbox" class="scp-checkbox" value="' + esc(o) + '"' + chk + '>' +
        '<span>' + esc(o) + '</span>' +
      '</label>';
    }).join('');
    return '<div class="scp-checkgroup">' + boxes + '</div>';
  }

  function renderToggle(item) {
    var chk = item.value === true ? ' checked' : '';
    return '<label class="scp-toggle-label">' +
      '<input type="checkbox" class="scp-toggle"' + chk + '>' +
      '<span class="scp-toggle-text">Yes</span>' +
    '</label>';
  }

  function renderComments(item) {
    if (!('comments' in item) || item.widget === 'person-card' || item.widget === 'contact-card') return '';
    var hidden = (item.widget === 'toggle' && item.value !== true) ? ' scp-hidden' : '';
    return '<div class="scp-comments-wrap' + hidden + '">' +
      '<label class="scp-comments-label">Comments</label>' +
      '<textarea class="scp-comments-ta" rows="1">' + esc(item.comments || '') + '</textarea>' +
    '</div>';
  }

  // ── contact-card ───────────────────────────────────────────────────────────

  function renderContactCard(item) {
    return '<div class="scp-card-rows">' +
      cardRow('Name',       '<input type="text" class="scp-card-input scp-name" value="' + esc(item.name || '') + '">') +
      cardRow('Phone',      '<input type="tel"  class="scp-card-input scp-phone" value="' + esc(item.phone || '') + '">') +
      cardRow('Alt. Phone', '<input type="tel"  class="scp-card-input scp-phone-alt" value="' + esc(item.phone_alt || '') + '">') +
    '</div>';
  }

  // ── person-card ────────────────────────────────────────────────────────────

  function renderPersonCard(item) {
    var roleSelect = '<select class="scp-card-select scp-role">' +
      ROLE_OPTIONS.map(function (o) {
        var sel = (o === item.role) ? ' selected' : '';
        return '<option value="' + esc(o) + '"' + sel + '>' + esc(o) + '</option>';
      }).join('') +
    '</select>';

    var accessSelect = '<select class="scp-card-select scp-access">' +
      ACCESS_OPTIONS.map(function (o) {
        var sel = (o.value === item.access) ? ' selected' : '';
        return '<option value="' + esc(o.value) + '"' + sel + '>' + esc(o.label) + '</option>';
      }).join('') +
    '</select>';

    var apptChk = item.appointments ? ' checked' : '';
    var apptToggle = '<input type="checkbox" class="scp-card-toggle scp-appointments"' + apptChk + '>';

    var contactAltRow = ('contact_alt' in item)
      ? cardRow('Alt. Contact', '<input type="text" class="scp-card-input scp-contact-alt" value="' + esc(item.contact_alt || '') + '">')
      : '';

    var commentsRow = ('comments' in item)
      ? cardRow('Comments', '<textarea class="scp-card-comments" rows="1">' + esc(item.comments || '') + '</textarea>')
      : '';

    return '<div class="scp-card-rows">' +
      cardRow('Role',               roleSelect) +
      cardRow('Contact',            '<input type="text" class="scp-card-input scp-contact" value="' + esc(item.contact || '') + '">') +
      contactAltRow +
      cardRow('Access',             accessSelect) +
      cardRow('Manages appts.',     apptToggle) +
      commentsRow +
    '</div>';
  }

  // ── reaction-card ──────────────────────────────────────────────────────────

  function renderReactionCard(item) {
    // none_known: renders as a simple confirmed-absence statement
    if (item.none_known) {
      var sectionLabel = item.section === 'contraindication'
        ? 'Contraindications' : 'Allergies / Intolerances';
      return '<div class="scp-card-rows">' +
        '<div class="scp-none-known">No known ' + sectionLabel.toLowerCase() + ' — clinically documented</div>' +
        cardRow('Documented By', '<input type="text" class="scp-card-input scp-documented-by" value="' + esc(item.documented_by || '') + '">') +
        cardRow('Date',          '<input type="date" class="scp-card-input scp-date-occurred" value="' + esc(item.date_occurred || '') + '">') +
      '</div>';
    }

    var sectionSelect = '<select class="scp-card-select scp-section">' +
      SECTION_OPTIONS.map(function (o) {
        var sel = (o.value === item.section) ? ' selected' : '';
        return '<option value="' + esc(o.value) + '"' + sel + '>' + esc(o.label) + '</option>';
      }).join('') +
    '</select>';

    var typeSelect = '<select class="scp-card-select scp-substance-type">' +
      SUBSTANCE_TYPE_OPTIONS.map(function (o) {
        var sel = (o === item.substance_type) ? ' selected' : '';
        return '<option value="' + esc(o) + '"' + sel + '>' + esc(o) + '</option>';
      }).join('') +
    '</select>';

    var rxValues = Array.isArray(item.reactions) ? item.reactions : [];
    var rxBoxes = REACTION_OPTIONS.map(function (o) {
      var chk = rxValues.indexOf(o) !== -1 ? ' checked' : '';
      return '<label class="scp-check-label">' +
        '<input type="checkbox" class="scp-reaction-check" value="' + esc(o) + '"' + chk + '>' +
        '<span>' + esc(o) + '</span>' +
      '</label>';
    }).join('');

    var privateChk = item.private ? ' checked' : '';

    return '<div class="scp-card-rows">' +
      cardRow('Section',       sectionSelect) +
      cardRow('Type',          typeSelect) +
      '<div class="scp-card-row scp-card-row-top">' +
        '<span class="scp-card-label">Reaction(s)</span>' +
        '<div class="scp-checkgroup scp-reactions-group">' + rxBoxes + '</div>' +
      '</div>' +
      cardRow('Reason / Notes', '<textarea class="scp-card-comments scp-reason" rows="1">' + esc(item.reason || '') + '</textarea>') +
      cardRow('Date Occurred',  '<input type="date" class="scp-card-input scp-date-occurred" value="' + esc(item.date_occurred || '') + '">') +
      cardRow('Documented By',  '<input type="text" class="scp-card-input scp-documented-by" value="' + esc(item.documented_by || '') + '">') +
      cardRow('Private',        '<input type="checkbox" class="scp-card-toggle scp-private"' + privateChk + '>') +
      cardRow('Notes',          '<textarea class="scp-card-comments scp-notes" rows="1">' + esc(item.notes || '') + '</textarea>') +
    '</div>';
  }

  // ── medication-card ────────────────────────────────────────────────────────

  function renderMedicationCard(item) {
    var typeSelect = '<select class="scp-card-select scp-med-type">' +
      MED_TYPE_OPTIONS.map(function (o) {
        var sel = (o === item.med_type) ? ' selected' : '';
        return '<option value="' + esc(o) + '"' + sel + '>' + esc(o) + '</option>';
      }).join('') +
    '</select>';

    var timingVals = Array.isArray(item.timing) ? item.timing : [];
    var timingBoxes = TIMING_OPTIONS.map(function (o) {
      var chk = timingVals.indexOf(o) !== -1 ? ' checked' : '';
      return '<label class="scp-check-label">' +
        '<input type="checkbox" class="scp-timing-check" value="' + esc(o) + '"' + chk + '>' +
        '<span>' + esc(o) + '</span>' +
      '</label>';
    }).join('');

    var privateChk = item.private ? ' checked' : '';
    var notPrescribed = item.not_prescribed || '';
    var notPrescribedClass = notPrescribed
      ? 'scp-card-comments scp-not-prescribed scp-not-prescribed-flagged'
      : 'scp-card-comments scp-not-prescribed';

    return '<div class="scp-card-rows">' +
      cardRow('Type',          typeSelect) +
      cardRow('RxNorm Code',   '<input type="text" class="scp-card-input scp-rxnorm" value="' + esc(item.rxnorm_code || '') + '" placeholder="e.g. 860975">') +
      cardRow('Prescribed By', '<input type="text" class="scp-card-input scp-prescribed-by" value="' + esc(item.prescribed_by || '') + '">') +
      cardRow('Started',       '<input type="text" class="scp-card-input scp-started" value="' + esc(item.started || '') + '" placeholder="YYYY-MM-DD">') +
      cardRow('Directions',    '<textarea class="scp-card-comments scp-directions" rows="1">' + esc(item.directions || '') + '</textarea>') +
      cardRow('Use',           '<textarea class="scp-card-comments scp-use" rows="1">' + esc(item.use || '') + '</textarea>') +
      '<div class="scp-card-row scp-card-row-top">' +
        '<span class="scp-card-label">Timing</span>' +
        '<div class="scp-checkgroup">' + timingBoxes + '</div>' +
      '</div>' +
      cardRow('Not as prescribed', '<textarea class="' + notPrescribedClass + '" rows="1">' + esc(notPrescribed) + '</textarea>') +
      cardRow('Private',       '<input type="checkbox" class="scp-card-toggle scp-med-private"' + privateChk + '>') +
    '</div>';
  }

  // ── access-card ────────────────────────────────────────────────────────────

  function renderAccessCard(item) {
    var levelSelect = '<select class="scp-card-select scp-access-level">' +
      ACCESS_LEVEL_OPTIONS.map(function (o) {
        var sel = (o === item.access_level) ? ' selected' : '';
        return '<option value="' + esc(o) + '"' + sel + '>' + esc(o) + '</option>';
      }).join('') +
    '</select>';
    var activeChk  = item.active  ? ' checked' : '';
    var privateChk = item.private ? ' checked' : '';
    var sharedVals = Array.isArray(item.pages_shared) ? item.pages_shared : [];
    var pageBoxes = SCP_PAGE_OPTIONS.map(function (o) {
      var chk = sharedVals.indexOf(o) !== -1 ? ' checked' : '';
      return '<label class="scp-check-label">' +
        '<input type="checkbox" class="scp-pages-check" value="' + esc(o) + '"' + chk + '>' +
        '<span>' + esc(o) + '</span>' +
      '</label>';
    }).join('');
    return '<div class="scp-card-rows">' +
      cardRow('Name',           '<input type="text" class="scp-card-input scp-access-name" value="' + esc(item.name || '') + '">') +
      cardRow('Role',           '<input type="text" class="scp-card-input scp-access-role" value="' + esc(item.role || '') + '">') +
      cardRow('Organization',   '<input type="text" class="scp-card-input scp-access-org" value="' + esc(item.organization || '') + '">') +
      cardRow('Access Level',   levelSelect) +
      cardRow('Granted',        '<input type="text" class="scp-card-input scp-access-granted" value="' + esc(item.access_granted || '') + '" placeholder="YYYY-MM-DD">') +
      cardRow('Expires',        '<input type="text" class="scp-card-input scp-access-expires" value="' + esc(item.access_expires || '') + '" placeholder="YYYY-MM-DD or blank">') +
      cardRow('Active',         '<input type="checkbox" class="scp-card-toggle scp-access-active"' + activeChk + '>') +
      '<div class="scp-card-row scp-card-row-top">' +
        '<span class="scp-card-label">Pages Shared</span>' +
        '<div class="scp-checkgroup">' + pageBoxes + '</div>' +
      '</div>' +
      cardRow('Comments',       '<textarea class="scp-card-comments scp-access-comments" rows="1">' + esc(item.comments || '') + '</textarea>') +
      cardRow('Private',        '<input type="checkbox" class="scp-card-toggle scp-access-private"' + privateChk + '>') +
    '</div>';
  }

  // ── activity-card ──────────────────────────────────────────────────────────

  function renderActivityCard(item) {
    var actionSelect = '<select class="scp-card-select scp-activity-action">' +
      ACTIVITY_ACTION_OPTIONS.map(function (o) {
        var sel = (o === item.action) ? ' selected' : '';
        return '<option value="' + esc(o) + '"' + sel + '>' + esc(o) + '</option>';
      }).join('') +
    '</select>';
    var privateChk = item.private ? ' checked' : '';
    return '<div class="scp-card-rows">' +
      cardRow('Date',    '<input type="text" class="scp-card-input scp-activity-date" value="' + esc(item.date || '') + '" placeholder="YYYY-MM-DD">') +
      cardRow('Who',     '<input type="text" class="scp-card-input scp-activity-who" value="' + esc(item.who || '') + '">') +
      cardRow('Action',  actionSelect) +
      cardRow('Pages',   '<input type="text" class="scp-card-input scp-activity-pages" value="' + esc(item.pages || '') + '" placeholder="e.g. Full plan, Medications, Next Steps">') +
      cardRow('Notes',   '<textarea class="scp-card-comments scp-activity-notes" rows="1">' + esc(item.notes || '') + '</textarea>') +
      cardRow('Private', '<input type="checkbox" class="scp-card-toggle scp-activity-private"' + privateChk + '>') +
    '</div>';
  }

  // ── snapshot-card ──────────────────────────────────────────────────────────

  function renderSnapshotCard(item) {
    var privateChk = item.private ? ' checked' : '';
    return '<div class="scp-card-rows">' +
      cardRow('Exported By',     '<input type="text" class="scp-card-input scp-snapshot-by" value="' + esc(item.exported_by || '') + '">') +
      cardRow('Export Date',     '<input type="text" class="scp-card-input scp-snapshot-date" value="' + esc(item.export_date || '') + '" placeholder="YYYY-MM-DD">') +
      cardRow('Access Count',    '<input type="text" class="scp-card-input scp-snapshot-count" value="' + esc(item.access_count || '') + '">') +
      cardRow('Pages Exported',  '<input type="text" class="scp-card-input scp-snapshot-pages" value="' + esc(item.pages_exported || '') + '">') +
      cardRow('Notes',           '<textarea class="scp-card-comments scp-snapshot-notes" rows="1">' + esc(item.notes || '') + '</textarea>') +
      cardRow('Private',         '<input type="checkbox" class="scp-card-toggle scp-snapshot-private"' + privateChk + '>') +
    '</div>';
  }

  // ── polst-card ─────────────────────────────────────────────────────────────

  function renderPolstCard(item) {
    var cprSelect = '<select class="scp-card-select scp-polst-cpr">' +
      CPR_OPTIONS.map(function (o) {
        var sel = (o === item.cpr_preference) ? ' selected' : '';
        return '<option value="' + esc(o) + '"' + sel + '>' + esc(o) + '</option>';
      }).join('') +
    '</select>';
    var interventionSelect = '<select class="scp-card-select scp-polst-interventions">' +
      MEDICAL_INTERVENTIONS_OPTIONS.map(function (o) {
        var sel = (o === item.medical_interventions) ? ' selected' : '';
        return '<option value="' + esc(o) + '"' + sel + '>' + esc(o) + '</option>';
      }).join('') +
    '</select>';
    var privateChk = item.private ? ' checked' : '';
    return '<div class="scp-card-rows">' +
      cardRow('Date Signed',          '<input type="text" class="scp-card-input scp-polst-date-signed" value="' + esc(item.date_signed || '') + '" placeholder="YYYY-MM-DD">') +
      cardRow('Signed By',            '<input type="text" class="scp-card-input scp-polst-signed-by" value="' + esc(item.signed_by || '') + '">') +
      cardRow('CPR Preference',       cprSelect) +
      cardRow('Medical Interventions', interventionSelect) +
      cardRow('Comments',             '<textarea class="scp-card-comments scp-polst-comments" rows="1">' + esc(item.comments || '') + '</textarea>') +
      cardRow('Document Location',    '<textarea class="scp-card-comments scp-polst-doc-location" rows="1">' + esc(item.document_location || '') + '</textarea>') +
      cardRow('Private',              '<input type="checkbox" class="scp-card-toggle scp-polst-private"' + privateChk + '>') +
    '</div>';
  }

  // ── agent-card ─────────────────────────────────────────────────────────────

  function renderAgentCard(item) {
    var privateChk = item.private ? ' checked' : '';
    return '<div class="scp-card-rows">' +
      cardRow('Name',             '<input type="text"  class="scp-card-input scp-agent-name" value="' + esc(item.name || '') + '">') +
      cardRow('Relationship',     '<input type="text"  class="scp-card-input scp-agent-relationship" value="' + esc(item.relationship || '') + '">') +
      cardRow('Phone',            '<input type="tel"   class="scp-card-input scp-agent-phone" value="' + esc(item.phone || '') + '">') +
      cardRow('Alt. Phone',       '<input type="tel"   class="scp-card-input scp-agent-phone-alt" value="' + esc(item.phone_alt || '') + '">') +
      cardRow('Email',            '<input type="email" class="scp-card-input scp-agent-email" value="' + esc(item.email || '') + '">') +
      cardRow('Authorized To',    '<textarea class="scp-card-comments scp-agent-authorized" rows="1">' + esc(item.authorized || '') + '</textarea>') +
      cardRow('Limitations',      '<textarea class="scp-card-comments scp-agent-limitations" rows="1">' + esc(item.limitations || '') + '</textarea>') +
      cardRow('Document Date',    '<input type="text"  class="scp-card-input scp-agent-doc-date" value="' + esc(item.date_of_document || '') + '" placeholder="YYYY-MM-DD">') +
      cardRow('Private',          '<input type="checkbox" class="scp-card-toggle scp-agent-private"' + privateChk + '>') +
    '</div>';
  }

  // ── wishes-card ────────────────────────────────────────────────────────────

  function renderWishesCard(item) {
    var privateChk = item.private ? ' checked' : '';
    return '<div class="scp-card-rows">' +
      cardRow('Where I Want to Be',      '<textarea class="scp-card-comments scp-wishes-where" rows="1">' + esc(item.where_i_want_to_be || '') + '</textarea>') +
      cardRow('What Matters Most',       '<textarea class="scp-card-comments scp-wishes-what-matters" rows="1">' + esc(item.what_matters_most || '') + '</textarea>') +
      cardRow('Religious / Spiritual',   '<textarea class="scp-card-comments scp-wishes-religious" rows="1">' + esc(item.religious_spiritual || '') + '</textarea>') +
      cardRow('Other Wishes',            '<textarea class="scp-card-comments scp-wishes-other" rows="1">' + esc(item.other_wishes || '') + '</textarea>') +
      cardRow('Private',                 '<input type="checkbox" class="scp-card-toggle scp-wishes-private"' + privateChk + '>') +
    '</div>';
  }

  // ── vital-card ─────────────────────────────────────────────────────────────

  function renderVitalCard(item) {
    var measureSelect = '<select class="scp-card-select scp-vital-measurement">' +
      VITAL_MEASUREMENT_OPTIONS.map(function (o) {
        var sel = (o === item.measurement) ? ' selected' : '';
        return '<option value="' + esc(o) + '"' + sel + '>' + esc(o) + '</option>';
      }).join('') +
    '</select>';
    var privateChk = item.private ? ' checked' : '';
    return '<div class="scp-card-rows">' +
      cardRow('Measurement', measureSelect) +
      cardRow('Value',       '<input type="text" class="scp-card-input scp-vital-value" value="' + esc(item.value || '') + '" placeholder="e.g. 148/92, 187, 224">') +
      cardRow('Unit',        '<input type="text" class="scp-card-input scp-vital-unit" value="' + esc(item.unit || '') + '" placeholder="e.g. mmHg, mg/dL, lbs">') +
      cardRow('Date',        '<input type="text" class="scp-card-input scp-vital-date" value="' + esc(item.date || '') + '" placeholder="YYYY-MM-DD">') +
      cardRow('Time',        '<input type="text" class="scp-card-input scp-vital-time" value="' + esc(item.time || '') + '" placeholder="e.g. 8:00 AM, Fasting, Morning">') +
      cardRow('Notes',       '<textarea class="scp-card-comments scp-vital-notes" rows="1">' + esc(item.notes || '') + '</textarea>') +
      cardRow('Private',     '<input type="checkbox" class="scp-card-toggle scp-vital-private"' + privateChk + '>') +
    '</div>';
  }

  // ── symptom-card ───────────────────────────────────────────────────────────

  function renderSymptomCard(item) {
    var severitySelect = '<select class="scp-card-select scp-symptom-severity">' +
      SYMPTOM_SEVERITY_OPTIONS.map(function (o) {
        var sel = (o === item.severity) ? ' selected' : '';
        return '<option value="' + esc(o) + '"' + sel + '>' + esc(o) + '</option>';
      }).join('') +
    '</select>';
    var privateChk = item.private ? ' checked' : '';
    return '<div class="scp-card-rows">' +
      cardRow('Symptom',        '<textarea class="scp-card-comments scp-symptom-text" rows="1">' + esc(item.symptom || '') + '</textarea>') +
      cardRow('Severity',       severitySelect) +
      cardRow('Date',           '<input type="text" class="scp-card-input scp-symptom-date" value="' + esc(item.date || '') + '" placeholder="YYYY-MM-DD">') +
      cardRow('Duration',       '<input type="text" class="scp-card-input scp-symptom-duration" value="' + esc(item.duration || '') + '" placeholder="e.g. 2 hours, All day">') +
      cardRow('Possible Cause', '<textarea class="scp-card-comments scp-symptom-cause" rows="1">' + esc(item.possible_cause || '') + '</textarea>') +
      cardRow('Action Taken',   '<textarea class="scp-card-comments scp-symptom-action" rows="1">' + esc(item.action_taken || '') + '</textarea>') +
      cardRow('Private',        '<input type="checkbox" class="scp-card-toggle scp-symptom-private"' + privateChk + '>') +
    '</div>';
  }

  // ── visit-card ─────────────────────────────────────────────────────────────

  function renderVisitCard(item) {
    var typeSelect = '<select class="scp-card-select scp-visit-type">' +
      VISIT_TYPE_OPTIONS.map(function (o) {
        var sel = (o === item.visit_type) ? ' selected' : '';
        return '<option value="' + esc(o) + '"' + sel + '>' + esc(o) + '</option>';
      }).join('') +
    '</select>';
    var privateChk = item.private ? ' checked' : '';
    return '<div class="scp-card-rows">' +
      cardRow('Provider',   '<input type="text" class="scp-card-input scp-visit-provider" value="' + esc(item.provider || '') + '">') +
      cardRow('Type',       typeSelect) +
      cardRow('Date',       '<input type="text" class="scp-card-input scp-visit-date" value="' + esc(item.date || '') + '" placeholder="YYYY-MM-DD">') +
      cardRow('Reason',     '<textarea class="scp-card-comments scp-visit-reason" rows="1">' + esc(item.reason || '') + '</textarea>') +
      cardRow('Outcome',    '<textarea class="scp-card-comments scp-visit-outcome" rows="1">' + esc(item.outcome || '') + '</textarea>') +
      cardRow('Follow Up',  '<textarea class="scp-card-comments scp-visit-followup" rows="1">' + esc(item.follow_up || '') + '</textarea>') +
      cardRow('Private',    '<input type="checkbox" class="scp-card-toggle scp-visit-private"' + privateChk + '>') +
    '</div>';
  }

  // ── goal-card ──────────────────────────────────────────────────────────────

  function renderGoalCard(item) {
    var achievedChk = item.achieved ? ' checked' : '';
    var privateChk  = item.private  ? ' checked' : '';
    return '<div class="scp-card-rows">' +
      cardRow('Goal',        '<textarea class="scp-card-comments scp-goal-text" rows="1">' + esc(item.goal || '') + '</textarea>') +
      cardRow('Date Set',    '<input type="text" class="scp-card-input scp-goal-date-set" value="' + esc(item.date_set || '') + '" placeholder="YYYY-MM-DD">') +
      cardRow('Target Date', '<input type="text" class="scp-card-input scp-goal-target-date" value="' + esc(item.target_date || '') + '" placeholder="YYYY-MM-DD">') +
      cardRow('Set By',      '<input type="text" class="scp-card-input scp-goal-set-by" value="' + esc(item.set_by || '') + '">') +
      cardRow('Achieved',    '<input type="checkbox" class="scp-card-toggle scp-goal-achieved"' + achievedChk + '>') +
      cardRow('Comments',    '<textarea class="scp-card-comments scp-goal-comments" rows="1">' + esc(item.comments || '') + '</textarea>') +
      cardRow('Private',     '<input type="checkbox" class="scp-card-toggle scp-goal-private"' + privateChk + '>') +
    '</div>';
  }

  // ── action-card ────────────────────────────────────────────────────────────

  function renderActionCard(item) {
    var completedChk = item.completed ? ' checked' : '';
    var privateChk   = item.private   ? ' checked' : '';
    return '<div class="scp-card-rows">' +
      cardRow('Action',      '<textarea class="scp-card-comments scp-action-text" rows="1">' + esc(item.action || '') + '</textarea>') +
      cardRow('Due Date',    '<input type="text" class="scp-card-input scp-action-due-date" value="' + esc(item.due_date || '') + '" placeholder="YYYY-MM-DD">') +
      cardRow('Assigned To', '<input type="text" class="scp-card-input scp-action-assigned-to" value="' + esc(item.assigned_to || '') + '">') +
      cardRow('Completed',   '<input type="checkbox" class="scp-card-toggle scp-action-completed"' + completedChk + '>') +
      cardRow('Comments',    '<textarea class="scp-card-comments scp-action-comments" rows="1">' + esc(item.comments || '') + '</textarea>') +
      cardRow('Private',     '<input type="checkbox" class="scp-card-toggle scp-action-private"' + privateChk + '>') +
    '</div>';
  }

  // ── history-card ───────────────────────────────────────────────────────────

  function renderHistoryCard(item) {
    var sectionSelect = '<select class="scp-card-select scp-history-section">' +
      HISTORY_SECTION_OPTIONS.map(function (o) {
        var sel = (o.value === item.section) ? ' selected' : '';
        return '<option value="' + esc(o.value) + '"' + sel + '>' + esc(o.label) + '</option>';
      }).join('') +
    '</select>';

    var privateChk = item.private ? ' checked' : '';

    return '<div class="scp-card-rows">' +
      cardRow('Section',          sectionSelect) +
      cardRow('Date',             '<input type="text" class="scp-card-input scp-history-date" value="' + esc(item.date || '') + '" placeholder="YYYY, YYYY-MM, or YYYY-MM-DD">') +
      cardRow('Performed By / Facility', '<input type="text" class="scp-card-input scp-history-performed-by" value="' + esc(item.performed_by || '') + '">') +
      cardRow('Dose #',           '<input type="text" class="scp-card-input scp-history-dose" value="' + esc(item.dose_number || '') + '" placeholder="e.g. 1, 2">') +
      cardRow('Comments',         '<textarea class="scp-card-comments scp-history-comments" rows="1">' + esc(item.comments || '') + '</textarea>') +
      cardRow('Private',          '<input type="checkbox" class="scp-card-toggle scp-history-private"' + privateChk + '>') +
    '</div>';
  }

  // ── diagnosis-card ─────────────────────────────────────────────────────────

  function renderDiagnosisCard(item) {
    var privateChk = item.private ? ' checked' : '';
    return '<div class="scp-card-rows">' +
      cardRow('Description',   '<input type="text" class="scp-card-input scp-description" value="' + esc(item.description || '') + '" placeholder="Plain language description">') +
      cardRow('ICD Code',      '<input type="text" class="scp-card-input scp-icd-code" value="' + esc(item.icd_code || '') + '" placeholder="e.g. I10">') +
      cardRow('Date Diagnosed','<input type="text" class="scp-card-input scp-date-diagnosed" value="' + esc(item.date_diagnosed || '') + '" placeholder="YYYY or YYYY-MM">') +
      cardRow('Diagnosed By',  '<input type="text" class="scp-card-input scp-diagnosed-by" value="' + esc(item.diagnosed_by || '') + '">') +
      cardRow('Comments',      '<textarea class="scp-card-comments scp-dx-comments" rows="1">' + esc(item.comments || '') + '</textarea>') +
      cardRow('Private',       '<input type="checkbox" class="scp-card-toggle scp-dx-private"' + privateChk + '>') +
    '</div>';
  }

  function cardRow(labelText, inputHtml) {
    return '<div class="scp-card-row">' +
      '<span class="scp-card-label">' + esc(labelText) + '</span>' +
      inputHtml +
    '</div>';
  }

  // ── Utilities ──────────────────────────────────────────────────────────────

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function debounce(fn, ms) {
    var t;
    return function () {
      var ctx = this, args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, ms);
    };
  }

  // ── Register ───────────────────────────────────────────────────────────────

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { emit: emit, bind: bind };
  }
  window.plugins = window.plugins || {};
  window.plugins['scp-field'] = { emit: emit, bind: bind };

}());
