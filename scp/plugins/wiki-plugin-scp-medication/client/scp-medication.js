/**
 * wiki-plugin-scp
 *
 * Individual typed plugins for the Shared Care Plan.
 * Each item type registers separately so FedWiki's factory system can create
 * items of a specific type without editing raw JSON.
 *
 * Types registered:
 *   scp-medication  scp-vital  scp-symptom  scp-visit
 */

(function () {
  'use strict';

  // ── Styles ─────────────────────────────────────────────────────────────────
  // Minimal — inherits wiki font, background, and color. No card chrome.

  var STYLES = [
    '.scp { padding: 4px 0 6px; }',
    '.scp-head { font-size:.84rem; font-weight:600; color:#333; padding-bottom:3px;',
    '  margin-bottom:4px; border-bottom:1px solid rgba(0,0,0,.1); }',
    '.scp-row { display:flex; align-items:baseline; gap:8px; padding:2px 0; }',
    '.scp-lbl { flex:0 0 110px; font-size:.7rem; color:#888; text-transform:uppercase;',
    '  letter-spacing:.04em; padding-top:3px; line-height:1.3; }',
    '.scp-val { flex:1; min-width:0; }',
    '.scp-val input, .scp-val select, .scp-val textarea {',
    '  font:inherit; font-size:.88rem; width:100%; box-sizing:border-box;',
    '  border:none; border-bottom:1px solid transparent;',
    '  background:transparent; color:inherit; padding:2px 0; margin:0; }',
    '.scp-val input:focus, .scp-val select:focus, .scp-val textarea:focus {',
    '  outline:none; border-bottom-color:#aaa; background:rgba(0,0,0,.02); }',
    '.scp-val textarea { resize:none; overflow:hidden; min-height:1.3em; line-height:1.4; }',
    '.scp-val select { cursor:pointer; }',
    '.scp-checks { display:flex; flex-wrap:wrap; gap:3px 14px; padding:3px 0; }',
    '.scp-chk { display:flex; align-items:center; gap:4px; font-size:.84rem; cursor:pointer; }',
    '.scp-flag { color:#b45309; font-size:.78rem; font-style:italic; margin-top:2px; padding-left:118px; }',
    '.scp-commit-btn { display:block; margin-top:8px; padding:5px 12px; font-size:.82rem;',
    '  background:#2563eb; color:#fff; border:none; border-radius:3px; cursor:pointer; }',
    '.scp-commit-btn:hover { background:#1d4ed8; }',
    '.scp-fold-btn { float:right; background:none; border:none; cursor:pointer;',
    '  font-size:.8rem; color:#aaa; padding:0 2px; line-height:1; }',
    '.scp-fold-btn:hover { color:#555; }',
    '.scp-summary { font-size:.85rem; color:#555; padding:2px 0; cursor:pointer; }',
    '.scp-summary:hover { color:#222; }',
    '.scp-done { opacity:.8; }',
  ].join('\n');

  var injected = false;
  function injectStyles() {
    if (injected) return;
    var s = document.createElement('style');
    s.textContent = STYLES;
    document.head.appendChild(s);
    injected = true;
  }

  // ── Utilities ───────────────────────────────────────────────────────────────

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── Search text generation ──────────────────────────────────────────────────
  // Populates item.text so FedWiki's search index can find SCP content.
  // Called automatically by save() for every type.

  function scpText(item) {
    var p = [];
    function add(label, val) { if (val) p.push(label ? label + ' ' + val : val); }
    switch (item.type) {
      case 'scp-medication':
        add('Medication:', item.label);
        if (item.med_type)   p.push('(' + item.med_type + ')');
        add('Prescribed by', item.prescribed_by ? item.prescribed_by + '.' : null);
        add('Started',       item.started ? item.started + '.' : null);
        add('',              item.directions);
        add('Use:',          item.use);
        if (item.timing && item.timing.length) p.push('Timing: ' + item.timing.join(', ') + '.');
        add('Not as prescribed:', item.not_prescribed);
        break;
      case 'scp-vital':
        if (item.measurement) p.push(item.measurement + ' reading:');
        add('', item.value);
        add('', item.unit);
        add('on', item.date);
        add('at', item.time);
        add('', item.notes);
        break;
      case 'scp-symptom':
        add('Symptom:', item.symptom);
        if (item.severity) p.push('(' + item.severity + ')');
        add('on',              item.date);
        add('Duration:',       item.duration ? item.duration + '.' : null);
        add('Possible cause:', item.possible_cause);
        add('Action taken:',   item.action_taken);
        break;
      case 'scp-visit':
        add('Visit with', item.provider);
        if (item.visit_type) p.push('(' + item.visit_type + ')');
        add('on',        item.date ? item.date + '.' : null);
        add('Reason:',   item.reason);
        add('Outcome:',  item.outcome);
        add('Follow up:', item.follow_up);
        break;
      case 'scp-about':
        var name = item.preferred_name || item.legal_name;
        add('About:', name);
        if (item.preferred_name && item.legal_name) p.push('(legal: ' + item.legal_name + ')');
        add('Born',     item.dob ? item.dob + '.' : null);
        add('Pronouns:', item.pronouns ? item.pronouns + '.' : null);
        add('Language:', item.language ? item.language + '.' : null);
        add('Phone:',    item.phone ? item.phone + '.' : null);
        add('Emergency contact:', item.emergency_contact);
        add('',          item.emergency_phone ? item.emergency_phone + '.' : null);
        add('',          item.notes);
        break;
      case 'scp-provider':
        if (item.name) {
          var role = [item.role, item.specialty].filter(Boolean).join(', ');
          p.push('Care team: ' + item.name + (role ? ' (' + role + ')' : '') + '.');
        }
        add('Phone:', item.phone ? item.phone + '.' : null);
        add('When to call:', item.when_to_call);
        add('', item.notes);
        break;
      case 'scp-diagnosis':
        if (item.condition) p.push('Diagnosis: ' + item.condition + (item.status ? ' (' + item.status + ')' : '') + '.');
        add('ICD:', item.icd_code ? item.icd_code + '.' : null);
        add('Diagnosed', item.diagnosed_date ? item.diagnosed_date + '.' : null);
        add('By',        item.diagnosing_provider ? item.diagnosing_provider + '.' : null);
        add('',          item.notes);
        break;
      case 'scp-reaction':
        add('Reaction to:', item.substance ? item.substance + '.' : null);
        add('',             item.reaction);
        add('Severity:',    item.severity ? item.severity + '.' : null);
        add('Identified',   item.date_identified ? item.date_identified + '.' : null);
        add('',             item.notes);
        break;
      case 'scp-history':
        add('Medical history:', item.event);
        add('on',      item.date ? item.date + '.' : null);
        add('Provider:', item.provider ? item.provider + '.' : null);
        add('',          item.notes);
        break;
      case 'scp-next-step':
        if (item.action) p.push('Next step: ' + item.action + (item.status ? ' (' + item.status + ').' : '.'));
        add('Who:',    item.who ? item.who + '.' : null);
        add('By:',     item.by_when ? item.by_when + '.' : null);
        add('',        item.notes);
        break;
      case 'scp-directive':
        add('Advanced directive:', item.directive_type ? item.directive_type + '.' : null);
        add('',          item.details);
        add('Proxy:',    item.proxy_name);
        add('',          item.proxy_phone ? item.proxy_phone + '.' : null);
        add('Document:', item.document_location ? item.document_location + '.' : null);
        add('Signed',    item.date_signed ? item.date_signed + '.' : null);
        break;
      case 'scp-access':
        add('Plan accessed by:', item.accessor);
        if (item.role) p.push('(' + item.role + ')');
        add('on',      item.date ? item.date + '.' : null);
        add('Reason:', item.reason);
        break;
    }
    return p.join(' ');
  }

  function save($item, item) {
    item.text = scpText(item);
    var $page = $item.parents('.page:first');
    wiki.pageHandler.put($page, { type: 'edit', id: item.id, item: item });
  }

  function grow(el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }

  // Move item to top of page story (reverse chronological for health log cards)
  function moveToTop($item, item) {
    var $page = $item.parents('.page:first');
    var ids = [];
    $page.find('.item').each(function () { ids.push($(this).attr('data-id')); });
    var myIdx = ids.indexOf(item.id);
    if (myIdx > 0) {
      ids.splice(myIdx, 1);
      ids.unshift(item.id);
      wiki.pageHandler.put($page, { type: 'move', id: item.id, order: ids });
    }
  }

  // ── DOM helpers ─────────────────────────────────────────────────────────────

  function row(lbl, html) {
    return '<div class="scp-row">' +
      '<span class="scp-lbl">' + esc(lbl) + '</span>' +
      '<div class="scp-val">' + html + '</div>' +
    '</div>';
  }

  function inp(cls, v, ph) {
    return '<input class="' + cls + '" value="' + esc(v || '') + '"' +
      (ph ? ' placeholder="' + esc(ph) + '"' : '') + '>';
  }

  function ta(cls, v) {
    return '<textarea class="' + cls + '" rows="1">' + esc(v || '') + '</textarea>';
  }

  function sel(cls, opts, cur) {
    return '<select class="' + cls + '">' +
      opts.map(function (o) {
        var v = typeof o === 'object' ? o.value : o;
        var l = typeof o === 'object' ? o.label : o;
        return '<option value="' + esc(v) + '"' + (v === cur ? ' selected' : '') + '>' + esc(l) + '</option>';
      }).join('') +
    '</select>';
  }

  function chks(cls, opts, cur) {
    var vals = Array.isArray(cur) ? cur : [];
    return '<div class="scp-checks">' +
      opts.map(function (o) {
        var chk = vals.indexOf(o) !== -1 ? ' checked' : '';
        return '<label class="scp-chk">' +
          '<input type="checkbox" class="' + cls + '" value="' + esc(o) + '"' + chk + '>' +
          '<span>' + esc(o) + '</span></label>';
      }).join('') +
    '</div>';
  }


  // ══════════════════════════════════════════════════════════════════════════
  // scp-medication
  // ══════════════════════════════════════════════════════════════════════════

  var MED_TYPE = ['Prescribed', 'Additional / OTC'];
  var TIMING   = ['Morning / Breakfast', 'Midday / Lunch', 'Evening / Dinner',
                  'Bedtime', 'As Needed (PRN)', 'Other'];

  function emitMedication($item, item) {
    injectStyles();
    var flag = item.not_prescribed
      ? '<div class="scp-flag">Not taken as prescribed: ' + esc(item.not_prescribed) + '</div>'
      : '';
    $item.append(
      '<div class="scp">' +
      '<div class="scp-head">' + esc(item.label || 'New Medication') + '</div>' +
      row('Medication Name', inp('scp-label', item.label, 'Name, dose, and form — e.g. Metformin 500mg Tablet')) +
      row('Type',            sel('scp-med-type', MED_TYPE, item.med_type)) +
      row('RxNorm',          inp('scp-rxnorm', item.rxnorm_code, 'optional')) +
      row('Prescribed By',   inp('scp-prescribed-by', item.prescribed_by)) +
      row('Started',         inp('scp-started', item.started, 'YYYY-MM-DD')) +
      row('Directions',      ta('scp-directions', item.directions)) +
      row('Use / Purpose',   ta('scp-use', item.use)) +
      row('Timing',          chks('scp-timing', TIMING, item.timing)) +
      row('Not as prescribed', ta('scp-not-prescribed', item.not_prescribed)) +
      flag +
      '</div>'
    );
  }

  function bindMedication($item, item) {
    $item.find('.scp-directions, .scp-use, .scp-not-prescribed').each(function () { grow(this); });

    // input: update item data + live preview only, no save
    $item.find('.scp-label').on('input', function () {
      item.label = this.value;
      $item.find('.scp-head').text(this.value || 'New Medication');
    });
    $item.find('.scp-rxnorm').on('input',        function () { item.rxnorm_code    = this.value; });
    $item.find('.scp-prescribed-by').on('input', function () { item.prescribed_by  = this.value; });
    $item.find('.scp-started').on('input',       function () { item.started        = this.value; });
    $item.find('.scp-directions').on('input',    function () { grow(this); item.directions     = this.value; });
    $item.find('.scp-use').on('input',           function () { grow(this); item.use            = this.value; });
    $item.find('.scp-not-prescribed').on('input',function () { grow(this); item.not_prescribed = this.value; });

    // focusout: save when leaving any text field (FedWiki pattern)
    $item.on('focusout', 'input, textarea', function () { save($item, item); });

    // selects and checkboxes: save immediately on change
    $item.find('.scp-med-type').on('change', function () { item.med_type = this.value; save($item, item); });
    $item.find('.scp-timing').on('change', function () {
      var v = []; $item.find('.scp-timing:checked').each(function () { v.push(this.value); });
      item.timing = v; save($item, item);
    });
  }

  window.plugins['scp-medication'] = {
    emit: emitMedication,
    bind: bindMedication,
    editor: function ($item, item) {
      item.label    = item.label    || 'New Medication';
      item.med_type = item.med_type || 'Prescribed';
      item.timing   = item.timing   || [];
      $item.empty();
      emitMedication($item, item);
      bindMedication($item, item);
      save($item, item);
    }
  };


  // ══════════════════════════════════════════════════════════════════════════
  // scp-vital
  // Publishes a thumb event so downstream chart/bars plugins can consume data.
  // ══════════════════════════════════════════════════════════════════════════

  var VITALS = ['Blood Pressure', 'Blood Glucose', 'Weight', 'Heart Rate / Pulse',
                'Temperature', 'Oxygen Saturation (SpO2)', 'Other'];

  function vitalSummaryHtml(item) {
    var s = esc(item.measurement || 'Vital');
    if (item.value) s += ': ' + esc(item.value);
    if (item.unit)  s += ' ' + esc(item.unit);
    if (item.date)  s += ' — ' + esc(item.date);
    return s;
  }

  function vitalDetailHtml(item) {
    return '<div class="scp-row"><span class="scp-lbl">Measurement</span><div class="scp-val">' + esc(item.measurement || '') + '</div></div>' +
      '<div class="scp-row"><span class="scp-lbl">Value</span><div class="scp-val">' + esc(item.value || '') + '</div></div>' +
      '<div class="scp-row"><span class="scp-lbl">Unit</span><div class="scp-val">' + esc(item.unit || '') + '</div></div>' +
      '<div class="scp-row"><span class="scp-lbl">Date</span><div class="scp-val">' + esc(item.date || '') + '</div></div>' +
      '<div class="scp-row"><span class="scp-lbl">Time</span><div class="scp-val">' + esc(item.time || '') + '</div></div>' +
      (item.notes ? '<div class="scp-row"><span class="scp-lbl">Notes</span><div class="scp-val">' + esc(item.notes) + '</div></div>' : '');
  }

  function emitVital($item, item) {
    injectStyles();
    if (item.committed) {
      $item.append(
        '<div class="scp scp-done">' +
        '<div class="scp-head">Vital<button class="scp-fold-btn" title="collapse">▲</button></div>' +
        '<div class="scp-detail">' + vitalDetailHtml(item) + '</div>' +
        '<div class="scp-summary" style="display:none">' + vitalSummaryHtml(item) + '</div>' +
        '</div>'
      );
      return;
    }
    $item.append(
      '<div class="scp">' +
      '<div class="scp-head">Vital: ' + esc(item.measurement || '') + '</div>' +
      row('Measurement', sel('scp-measurement', VITALS, item.measurement)) +
      row('Value',       inp('scp-vital-value', item.value, 'e.g. 148/92')) +
      row('Unit',        inp('scp-vital-unit', item.unit, 'e.g. mmHg, mg/dL')) +
      row('Date',        inp('scp-vital-date', item.date, 'YYYY-MM-DD')) +
      row('Time',        inp('scp-vital-time', item.time, 'e.g. 8:00 AM, Fasting')) +
      row('Notes',       ta('scp-vital-notes', item.notes)) +
      '<button class="scp-commit-btn">Save Entry</button>' +
      '</div>'
    );
  }

  function bindVital($item, item) {
    if (item.committed) {
      $item.find('.scp-fold-btn').on('click', function () {
        if ($item.find('.scp-detail').is(':visible')) {
          $item.find('.scp-detail').hide();
          $item.find('.scp-summary').show();
          $(this).text('▼');
        } else {
          $item.find('.scp-detail').show();
          $item.find('.scp-summary').hide();
          $(this).text('▲');
        }
      });
      $item.find('.scp-summary').on('click', function () {
        $item.find('.scp-detail').show();
        $item.find('.scp-summary').hide();
        $item.find('.scp-fold-btn').text('▲');
      });
      return;
    }

    $item.find('.scp-vital-notes').each(function () { grow(this); });

    function thumb() {
      if (item.value && item.date) {
        $item.trigger('thumb', { date: item.date, value: item.value, measurement: item.measurement });
      }
    }

    // input: update item data only, no save
    $item.find('.scp-vital-value').on('input', function () { item.value = this.value; });
    $item.find('.scp-vital-unit').on('input',  function () { item.unit  = this.value; });
    $item.find('.scp-vital-date').on('input',  function () { item.date  = this.value; });
    $item.find('.scp-vital-time').on('input',  function () { item.time  = this.value; });
    $item.find('.scp-vital-notes').on('input', function () { grow(this); item.notes = this.value; });

    // select: update live preview only
    $item.find('.scp-measurement').on('change', function () {
      item.measurement = this.value;
      $item.find('.scp-head').text('Vital: ' + this.value);
    });

    // Commit: write ONE journal entry, re-render as read-only (stays expanded)
    $item.find('.scp-commit-btn').on('click', function () {
      item.committed = true;
      save($item, item);
      thumb();
      $item.empty();
      emitVital($item, item);
      bindVital($item, item);
    });
  }

  window.plugins['scp-vital'] = {
    emit: emitVital,
    bind: bindVital,
    editor: function ($item, item) {
      item.measurement = item.measurement || 'Blood Pressure';
      $item.empty();
      emitVital($item, item);
      bindVital($item, item);
      save($item, item);
      moveToTop($item, item);
    }
  };


  // ══════════════════════════════════════════════════════════════════════════
  // scp-symptom
  // ══════════════════════════════════════════════════════════════════════════

  var SEVERITY = ['Mild', 'Moderate', 'Severe', 'Very Severe'];

  function symptomSummaryHtml(item) {
    var s = esc(item.symptom || 'Symptom');
    if (item.severity) s += ' (' + esc(item.severity) + ')';
    if (item.date)     s += ' — ' + esc(item.date);
    return s;
  }

  function symptomDetailHtml(item) {
    return '<div class="scp-row"><span class="scp-lbl">Symptom</span><div class="scp-val">' + esc(item.symptom || '') + '</div></div>' +
      '<div class="scp-row"><span class="scp-lbl">Severity</span><div class="scp-val">' + esc(item.severity || '') + '</div></div>' +
      '<div class="scp-row"><span class="scp-lbl">Date</span><div class="scp-val">' + esc(item.date || '') + '</div></div>' +
      '<div class="scp-row"><span class="scp-lbl">Duration</span><div class="scp-val">' + esc(item.duration || '') + '</div></div>' +
      (item.possible_cause ? '<div class="scp-row"><span class="scp-lbl">Possible Cause</span><div class="scp-val">' + esc(item.possible_cause) + '</div></div>' : '') +
      (item.action_taken   ? '<div class="scp-row"><span class="scp-lbl">Action Taken</span><div class="scp-val">'   + esc(item.action_taken)   + '</div></div>' : '');
  }

  function emitSymptom($item, item) {
    injectStyles();
    if (item.committed) {
      $item.append(
        '<div class="scp scp-done">' +
        '<div class="scp-head">Symptom<button class="scp-fold-btn" title="collapse">▲</button></div>' +
        '<div class="scp-detail">' + symptomDetailHtml(item) + '</div>' +
        '<div class="scp-summary" style="display:none">' + symptomSummaryHtml(item) + '</div>' +
        '</div>'
      );
      return;
    }
    $item.append(
      '<div class="scp">' +
      '<div class="scp-head">Symptom: ' + esc(item.symptom || '') + '</div>' +
      row('Symptom',        ta('scp-symptom-text', item.symptom)) +
      row('Severity',       sel('scp-severity', SEVERITY, item.severity)) +
      row('Date',           inp('scp-symptom-date', item.date, 'YYYY-MM-DD')) +
      row('Duration',       inp('scp-symptom-duration', item.duration, 'e.g. 2 hours')) +
      row('Possible Cause', ta('scp-symptom-cause', item.possible_cause)) +
      row('Action Taken',   ta('scp-symptom-action', item.action_taken)) +
      '<button class="scp-commit-btn">Save Entry</button>' +
      '</div>'
    );
  }

  function bindSymptom($item, item) {
    if (item.committed) {
      $item.find('.scp-fold-btn').on('click', function () {
        if ($item.find('.scp-detail').is(':visible')) {
          $item.find('.scp-detail').hide();
          $item.find('.scp-summary').show();
          $(this).text('▼');
        } else {
          $item.find('.scp-detail').show();
          $item.find('.scp-summary').hide();
          $(this).text('▲');
        }
      });
      $item.find('.scp-summary').on('click', function () {
        $item.find('.scp-detail').show();
        $item.find('.scp-summary').hide();
        $item.find('.scp-fold-btn').text('▲');
      });
      return;
    }

    $item.find('.scp-symptom-text, .scp-symptom-cause, .scp-symptom-action').each(function () { grow(this); });

    // input: update item data + live preview only, no save
    $item.find('.scp-symptom-text').on('input', function () {
      grow(this); item.symptom = this.value;
      $item.find('.scp-head').text('Symptom: ' + this.value);
    });
    $item.find('.scp-symptom-date').on('input',     function () { item.date          = this.value; });
    $item.find('.scp-symptom-duration').on('input', function () { item.duration      = this.value; });
    $item.find('.scp-symptom-cause').on('input',    function () { grow(this); item.possible_cause = this.value; });
    $item.find('.scp-symptom-action').on('input',   function () { grow(this); item.action_taken   = this.value; });

    // select: update only
    $item.find('.scp-severity').on('change', function () { item.severity = this.value; });

    // Commit: write ONE journal entry, re-render as read-only (stays expanded)
    $item.find('.scp-commit-btn').on('click', function () {
      item.committed = true;
      save($item, item);
      $item.empty();
      emitSymptom($item, item);
      bindSymptom($item, item);
    });
  }

  window.plugins['scp-symptom'] = {
    emit: emitSymptom,
    bind: bindSymptom,
    editor: function ($item, item) {
      item.symptom  = item.symptom  || '';
      item.severity = item.severity || 'Mild';
      $item.empty();
      emitSymptom($item, item);
      bindSymptom($item, item);
      save($item, item);
      moveToTop($item, item);
    }
  };


  // ══════════════════════════════════════════════════════════════════════════
  // scp-visit
  // ══════════════════════════════════════════════════════════════════════════

  var VISIT_TYPE = ['Office Visit', 'Telehealth / Video', 'Phone / Nurse Line',
                   'Emergency Room', 'Hospital / Inpatient', 'Lab / Imaging', 'Other'];

  function visitSummaryHtml(item) {
    var s = esc(item.provider || 'Visit');
    if (item.visit_type) s += ' — ' + esc(item.visit_type);
    if (item.date)       s += ' — ' + esc(item.date);
    return s;
  }

  function visitDetailHtml(item) {
    return '<div class="scp-row"><span class="scp-lbl">Provider</span><div class="scp-val">' + esc(item.provider || '') + '</div></div>' +
      '<div class="scp-row"><span class="scp-lbl">Type</span><div class="scp-val">' + esc(item.visit_type || '') + '</div></div>' +
      '<div class="scp-row"><span class="scp-lbl">Date</span><div class="scp-val">' + esc(item.date || '') + '</div></div>' +
      (item.reason    ? '<div class="scp-row"><span class="scp-lbl">Reason</span><div class="scp-val">'    + esc(item.reason)    + '</div></div>' : '') +
      (item.outcome   ? '<div class="scp-row"><span class="scp-lbl">Outcome</span><div class="scp-val">'   + esc(item.outcome)   + '</div></div>' : '') +
      (item.follow_up ? '<div class="scp-row"><span class="scp-lbl">Follow Up</span><div class="scp-val">' + esc(item.follow_up) + '</div></div>' : '');
  }

  function emitVisit($item, item) {
    injectStyles();
    if (item.committed) {
      $item.append(
        '<div class="scp scp-done">' +
        '<div class="scp-head">Visit<button class="scp-fold-btn" title="collapse">▲</button></div>' +
        '<div class="scp-detail">' + visitDetailHtml(item) + '</div>' +
        '<div class="scp-summary" style="display:none">' + visitSummaryHtml(item) + '</div>' +
        '</div>'
      );
      return;
    }
    $item.append(
      '<div class="scp">' +
      '<div class="scp-head">Visit: ' + esc(item.provider || '') + '</div>' +
      row('Provider',  inp('scp-visit-provider', item.provider)) +
      row('Type',      sel('scp-visit-type', VISIT_TYPE, item.visit_type)) +
      row('Date',      inp('scp-visit-date', item.date, 'YYYY-MM-DD')) +
      row('Reason',    ta('scp-visit-reason', item.reason)) +
      row('Outcome',   ta('scp-visit-outcome', item.outcome)) +
      row('Follow Up', ta('scp-visit-followup', item.follow_up)) +
      '<button class="scp-commit-btn">Save Entry</button>' +
      '</div>'
    );
  }

  function bindVisit($item, item) {
    if (item.committed) {
      $item.find('.scp-fold-btn').on('click', function () {
        if ($item.find('.scp-detail').is(':visible')) {
          $item.find('.scp-detail').hide();
          $item.find('.scp-summary').show();
          $(this).text('▼');
        } else {
          $item.find('.scp-detail').show();
          $item.find('.scp-summary').hide();
          $(this).text('▲');
        }
      });
      $item.find('.scp-summary').on('click', function () {
        $item.find('.scp-detail').show();
        $item.find('.scp-summary').hide();
        $item.find('.scp-fold-btn').text('▲');
      });
      return;
    }

    $item.find('.scp-visit-reason, .scp-visit-outcome, .scp-visit-followup').each(function () { grow(this); });

    // input: update item data + live preview only, no save
    $item.find('.scp-visit-provider').on('input', function () {
      item.provider = this.value;
      $item.find('.scp-head').text('Visit: ' + this.value);
    });
    $item.find('.scp-visit-date').on('input',     function () { item.date       = this.value; });
    $item.find('.scp-visit-reason').on('input',   function () { grow(this); item.reason    = this.value; });
    $item.find('.scp-visit-outcome').on('input',  function () { grow(this); item.outcome   = this.value; });
    $item.find('.scp-visit-followup').on('input', function () { grow(this); item.follow_up = this.value; });

    // select: update only
    $item.find('.scp-visit-type').on('change', function () { item.visit_type = this.value; });

    // Commit: write ONE journal entry, re-render as read-only (stays expanded)
    $item.find('.scp-commit-btn').on('click', function () {
      item.committed = true;
      save($item, item);
      $item.empty();
      emitVisit($item, item);
      bindVisit($item, item);
    });
  }

  window.plugins['scp-visit'] = {
    emit: emitVisit,
    bind: bindVisit,
    editor: function ($item, item) {
      item.provider   = item.provider   || '';
      item.visit_type = item.visit_type || 'Office Visit';
      $item.empty();
      emitVisit($item, item);
      bindVisit($item, item);
      save($item, item);
      moveToTop($item, item);
    }
  };


  // ── Shared fold-toggle helper for log-style committed items ─────────────────

  function bindFoldToggle($item) {
    $item.find('.scp-fold-btn').on('click', function () {
      if ($item.find('.scp-detail').is(':visible')) {
        $item.find('.scp-detail').hide();
        $item.find('.scp-summary').show();
        $(this).text('▼');
      } else {
        $item.find('.scp-detail').show();
        $item.find('.scp-summary').hide();
        $(this).text('▲');
      }
    });
    $item.find('.scp-summary').on('click', function () {
      $item.find('.scp-detail').show();
      $item.find('.scp-summary').hide();
      $item.find('.scp-fold-btn').text('▲');
    });
  }


  // ══════════════════════════════════════════════════════════════════════════
  // scp-about  — About Me
  // ══════════════════════════════════════════════════════════════════════════

  function aboutDetailHtml(item) {
    return '<div class="scp-row"><span class="scp-lbl">Preferred Name</span><div class="scp-val">' + esc(item.preferred_name || '') + '</div></div>' +
      '<div class="scp-row"><span class="scp-lbl">Legal Name</span><div class="scp-val">'       + esc(item.legal_name || '')      + '</div></div>' +
      '<div class="scp-row"><span class="scp-lbl">Date of Birth</span><div class="scp-val">'    + esc(item.dob || '')             + '</div></div>' +
      '<div class="scp-row"><span class="scp-lbl">Pronouns</span><div class="scp-val">'         + esc(item.pronouns || '')        + '</div></div>' +
      '<div class="scp-row"><span class="scp-lbl">Language</span><div class="scp-val">'         + esc(item.language || '')        + '</div></div>' +
      '<div class="scp-row"><span class="scp-lbl">Phone</span><div class="scp-val">'            + esc(item.phone || '')           + '</div></div>' +
      (item.address           ? '<div class="scp-row"><span class="scp-lbl">Address</span><div class="scp-val">'           + esc(item.address)           + '</div></div>' : '') +
      (item.emergency_contact ? '<div class="scp-row"><span class="scp-lbl">Emergency Contact</span><div class="scp-val">' + esc(item.emergency_contact) + '</div></div>' : '') +
      (item.emergency_phone   ? '<div class="scp-row"><span class="scp-lbl">Emergency Phone</span><div class="scp-val">'   + esc(item.emergency_phone)   + '</div></div>' : '') +
      (item.notes             ? '<div class="scp-row"><span class="scp-lbl">Notes</span><div class="scp-val">'             + esc(item.notes)             + '</div></div>' : '');
  }

  function emitAbout($item, item) {
    injectStyles();
    if (item.committed) {
      $item.append(
        '<div class="scp scp-done">' +
        '<div class="scp-head">About Me<button class="scp-fold-btn">▲</button></div>' +
        '<div class="scp-detail">' + aboutDetailHtml(item) + '</div>' +
        '<div class="scp-summary" style="display:none">' + esc(item.preferred_name || item.legal_name || 'About Me') + '</div>' +
        '</div>'
      );
      return;
    }
    $item.append(
      '<div class="scp">' +
      '<div class="scp-head">About Me</div>' +
      row('Preferred Name',    inp('scp-about-preferred', item.preferred_name, 'Name you go by')) +
      row('Legal Name',        inp('scp-about-legal',     item.legal_name)) +
      row('Date of Birth',     inp('scp-about-dob',       item.dob, 'YYYY-MM-DD')) +
      row('Pronouns',          inp('scp-about-pronouns',  item.pronouns, 'e.g. she/her')) +
      row('Language',          inp('scp-about-language',  item.language, 'Preferred language')) +
      row('Phone',             inp('scp-about-phone',     item.phone)) +
      row('Address',           ta('scp-about-address',    item.address)) +
      row('Emergency Contact', inp('scp-about-ec-name',   item.emergency_contact)) +
      row('Emergency Phone',   inp('scp-about-ec-phone',  item.emergency_phone)) +
      row('Notes',             ta('scp-about-notes',      item.notes)) +
      '<button class="scp-commit-btn">Save Entry</button>' +
      '</div>'
    );
  }

  function bindAbout($item, item) {
    if (item.committed) { bindFoldToggle($item); return; }
    $item.find('.scp-about-address, .scp-about-notes').each(function () { grow(this); });
    $item.find('.scp-about-preferred').on('input', function () { item.preferred_name    = this.value; });
    $item.find('.scp-about-legal').on('input',     function () { item.legal_name        = this.value; });
    $item.find('.scp-about-dob').on('input',       function () { item.dob              = this.value; });
    $item.find('.scp-about-pronouns').on('input',  function () { item.pronouns         = this.value; });
    $item.find('.scp-about-language').on('input',  function () { item.language         = this.value; });
    $item.find('.scp-about-phone').on('input',     function () { item.phone            = this.value; });
    $item.find('.scp-about-address').on('input',   function () { grow(this); item.address           = this.value; });
    $item.find('.scp-about-ec-name').on('input',   function () { item.emergency_contact = this.value; });
    $item.find('.scp-about-ec-phone').on('input',  function () { item.emergency_phone   = this.value; });
    $item.find('.scp-about-notes').on('input',     function () { grow(this); item.notes = this.value; });
    $item.find('.scp-commit-btn').on('click', function () {
      item.committed = true;
      save($item, item);
      $item.empty(); emitAbout($item, item); bindAbout($item, item);
    });
  }

  window.plugins['scp-about'] = {
    emit: emitAbout,
    bind: bindAbout,
    editor: function ($item, item) {
      $item.empty();
      emitAbout($item, item);
      bindAbout($item, item);
      save($item, item);
    }
  };


  // ══════════════════════════════════════════════════════════════════════════
  // scp-provider  — Care Team member
  // ══════════════════════════════════════════════════════════════════════════

  var PROVIDER_ROLE = ['Primary Care', 'Specialist', 'Nurse', 'Community Health Worker',
                       'Pharmacist', 'Social Worker', 'Dentist', 'Mental Health', 'Other'];

  function providerDetailHtml(item) {
    return '<div class="scp-row"><span class="scp-lbl">Name</span><div class="scp-val">'      + esc(item.name || '')      + '</div></div>' +
      '<div class="scp-row"><span class="scp-lbl">Role</span><div class="scp-val">'           + esc(item.role || '')      + '</div></div>' +
      (item.specialty    ? '<div class="scp-row"><span class="scp-lbl">Specialty</span><div class="scp-val">'    + esc(item.specialty)    + '</div></div>' : '') +
      '<div class="scp-row"><span class="scp-lbl">Phone</span><div class="scp-val">'          + esc(item.phone || '')     + '</div></div>' +
      (item.fax          ? '<div class="scp-row"><span class="scp-lbl">Fax</span><div class="scp-val">'          + esc(item.fax)          + '</div></div>' : '') +
      (item.when_to_call ? '<div class="scp-row"><span class="scp-lbl">When to Call</span><div class="scp-val">' + esc(item.when_to_call) + '</div></div>' : '') +
      (item.notes        ? '<div class="scp-row"><span class="scp-lbl">Notes</span><div class="scp-val">'        + esc(item.notes)        + '</div></div>' : '');
  }

  function emitProvider($item, item) {
    injectStyles();
    if (item.committed) {
      var summary = esc(item.name || 'Provider') + (item.role ? ' — ' + esc(item.role) : '');
      $item.append(
        '<div class="scp scp-done">' +
        '<div class="scp-head">Care Team<button class="scp-fold-btn">▲</button></div>' +
        '<div class="scp-detail">' + providerDetailHtml(item) + '</div>' +
        '<div class="scp-summary" style="display:none">' + summary + '</div>' +
        '</div>'
      );
      return;
    }
    $item.append(
      '<div class="scp">' +
      '<div class="scp-head">' + esc(item.name || 'Care Team Member') + '</div>' +
      row('Name',         inp('scp-prov-name',     item.name)) +
      row('Role',         sel('scp-prov-role',     PROVIDER_ROLE, item.role)) +
      row('Specialty',    inp('scp-prov-specialty',item.specialty)) +
      row('Phone',        inp('scp-prov-phone',    item.phone)) +
      row('Fax',          inp('scp-prov-fax',      item.fax)) +
      row('When to Call', ta('scp-prov-when',      item.when_to_call)) +
      row('Notes',        ta('scp-prov-notes',     item.notes)) +
      '<button class="scp-commit-btn">Save Entry</button>' +
      '</div>'
    );
  }

  function bindProvider($item, item) {
    if (item.committed) { bindFoldToggle($item); return; }
    $item.find('.scp-prov-when, .scp-prov-notes').each(function () { grow(this); });
    $item.find('.scp-prov-name').on('input', function () {
      item.name = this.value;
      $item.find('.scp-head').text(this.value || 'Care Team Member');
    });
    $item.find('.scp-prov-specialty').on('input', function () { item.specialty    = this.value; });
    $item.find('.scp-prov-phone').on('input',     function () { item.phone        = this.value; });
    $item.find('.scp-prov-fax').on('input',       function () { item.fax          = this.value; });
    $item.find('.scp-prov-when').on('input',      function () { grow(this); item.when_to_call = this.value; });
    $item.find('.scp-prov-notes').on('input',     function () { grow(this); item.notes        = this.value; });
    $item.find('.scp-prov-role').on('change',     function () { item.role = this.value; });
    $item.find('.scp-commit-btn').on('click', function () {
      item.committed = true;
      save($item, item);
      $item.empty(); emitProvider($item, item); bindProvider($item, item);
    });
  }

  window.plugins['scp-provider'] = {
    emit: emitProvider,
    bind: bindProvider,
    editor: function ($item, item) {
      item.role = item.role || 'Primary Care';
      $item.empty();
      emitProvider($item, item);
      bindProvider($item, item);
      save($item, item);
    }
  };


  // ══════════════════════════════════════════════════════════════════════════
  // scp-diagnosis  — Diagnosis
  // ══════════════════════════════════════════════════════════════════════════

  var DX_STATUS = ['Active', 'Managed', 'Resolved'];

  function diagnosisDetailHtml(item) {
    return '<div class="scp-row"><span class="scp-lbl">Condition</span><div class="scp-val">' + esc(item.condition || '') + '</div></div>' +
      (item.icd_code            ? '<div class="scp-row"><span class="scp-lbl">ICD Code</span><div class="scp-val">'           + esc(item.icd_code)            + '</div></div>' : '') +
      '<div class="scp-row"><span class="scp-lbl">Diagnosed</span><div class="scp-val">'          + esc(item.diagnosed_date || '')      + '</div></div>' +
      (item.diagnosing_provider ? '<div class="scp-row"><span class="scp-lbl">Provider</span><div class="scp-val">'           + esc(item.diagnosing_provider) + '</div></div>' : '') +
      '<div class="scp-row"><span class="scp-lbl">Status</span><div class="scp-val">'             + esc(item.status || '')              + '</div></div>' +
      (item.notes               ? '<div class="scp-row"><span class="scp-lbl">Notes</span><div class="scp-val">'              + esc(item.notes)               + '</div></div>' : '');
  }

  function emitDiagnosis($item, item) {
    injectStyles();
    if (item.committed) {
      var summary = esc(item.condition || 'Diagnosis') + (item.status ? ' (' + esc(item.status) + ')' : '');
      $item.append(
        '<div class="scp scp-done">' +
        '<div class="scp-head">Diagnosis<button class="scp-fold-btn">▲</button></div>' +
        '<div class="scp-detail">' + diagnosisDetailHtml(item) + '</div>' +
        '<div class="scp-summary" style="display:none">' + summary + '</div>' +
        '</div>'
      );
      return;
    }
    $item.append(
      '<div class="scp">' +
      '<div class="scp-head">' + esc(item.condition || 'New Diagnosis') + '</div>' +
      row('Condition',           inp('scp-dx-condition', item.condition)) +
      row('ICD Code',            inp('scp-dx-icd',       item.icd_code, 'optional')) +
      row('Diagnosed',           inp('scp-dx-date',      item.diagnosed_date, 'YYYY-MM-DD')) +
      row('Diagnosing Provider', inp('scp-dx-provider',  item.diagnosing_provider)) +
      row('Status',              sel('scp-dx-status',    DX_STATUS, item.status)) +
      row('Notes',               ta('scp-dx-notes',      item.notes)) +
      '<button class="scp-commit-btn">Save Entry</button>' +
      '</div>'
    );
  }

  function bindDiagnosis($item, item) {
    if (item.committed) { bindFoldToggle($item); return; }
    $item.find('.scp-dx-notes').each(function () { grow(this); });
    $item.find('.scp-dx-condition').on('input', function () {
      item.condition = this.value;
      $item.find('.scp-head').text(this.value || 'New Diagnosis');
    });
    $item.find('.scp-dx-icd').on('input',      function () { item.icd_code            = this.value; });
    $item.find('.scp-dx-date').on('input',     function () { item.diagnosed_date      = this.value; });
    $item.find('.scp-dx-provider').on('input', function () { item.diagnosing_provider = this.value; });
    $item.find('.scp-dx-notes').on('input',    function () { grow(this); item.notes   = this.value; });
    $item.find('.scp-dx-status').on('change',  function () { item.status = this.value; });
    $item.find('.scp-commit-btn').on('click', function () {
      item.committed = true;
      save($item, item);
      $item.empty(); emitDiagnosis($item, item); bindDiagnosis($item, item);
    });
  }

  window.plugins['scp-diagnosis'] = {
    emit: emitDiagnosis,
    bind: bindDiagnosis,
    editor: function ($item, item) {
      item.status = item.status || 'Active';
      $item.empty();
      emitDiagnosis($item, item);
      bindDiagnosis($item, item);
      save($item, item);
    }
  };


  // ══════════════════════════════════════════════════════════════════════════
  // scp-reaction  — Allergy / Adverse Reaction
  // ══════════════════════════════════════════════════════════════════════════

  var RXN_SEVERITY = ['Mild', 'Moderate', 'Severe', 'Life-threatening'];

  function reactionDetailHtml(item) {
    return '<div class="scp-row"><span class="scp-lbl">Substance</span><div class="scp-val">'      + esc(item.substance || '')        + '</div></div>' +
      (item.reaction        ? '<div class="scp-row"><span class="scp-lbl">Reaction</span><div class="scp-val">'        + esc(item.reaction)        + '</div></div>' : '') +
      '<div class="scp-row"><span class="scp-lbl">Severity</span><div class="scp-val">'            + esc(item.severity || '')         + '</div></div>' +
      (item.date_identified ? '<div class="scp-row"><span class="scp-lbl">Date Identified</span><div class="scp-val">' + esc(item.date_identified) + '</div></div>' : '') +
      (item.notes           ? '<div class="scp-row"><span class="scp-lbl">Notes</span><div class="scp-val">'           + esc(item.notes)           + '</div></div>' : '');
  }

  function emitReaction($item, item) {
    injectStyles();
    if (item.committed) {
      var summary = esc(item.substance || 'Reaction') + (item.severity ? ' — ' + esc(item.severity) : '');
      $item.append(
        '<div class="scp scp-done">' +
        '<div class="scp-head">Reaction<button class="scp-fold-btn">▲</button></div>' +
        '<div class="scp-detail">' + reactionDetailHtml(item) + '</div>' +
        '<div class="scp-summary" style="display:none">' + summary + '</div>' +
        '</div>'
      );
      return;
    }
    $item.append(
      '<div class="scp">' +
      '<div class="scp-head">' + esc(item.substance || 'New Reaction') + '</div>' +
      row('Substance',       inp('scp-rxn-substance', item.substance)) +
      row('Reaction',        ta('scp-rxn-reaction',   item.reaction)) +
      row('Severity',        sel('scp-rxn-severity',  RXN_SEVERITY, item.severity)) +
      row('Date Identified', inp('scp-rxn-date',       item.date_identified, 'YYYY-MM-DD')) +
      row('Notes',           ta('scp-rxn-notes',       item.notes)) +
      '<button class="scp-commit-btn">Save Entry</button>' +
      '</div>'
    );
  }

  function bindReaction($item, item) {
    if (item.committed) { bindFoldToggle($item); return; }
    $item.find('.scp-rxn-reaction, .scp-rxn-notes').each(function () { grow(this); });
    $item.find('.scp-rxn-substance').on('input', function () {
      item.substance = this.value;
      $item.find('.scp-head').text(this.value || 'New Reaction');
    });
    $item.find('.scp-rxn-reaction').on('input', function () { grow(this); item.reaction       = this.value; });
    $item.find('.scp-rxn-date').on('input',     function () { item.date_identified = this.value; });
    $item.find('.scp-rxn-notes').on('input',    function () { grow(this); item.notes          = this.value; });
    $item.find('.scp-rxn-severity').on('change',function () { item.severity = this.value; });
    $item.find('.scp-commit-btn').on('click', function () {
      item.committed = true;
      save($item, item);
      $item.empty(); emitReaction($item, item); bindReaction($item, item);
    });
  }

  window.plugins['scp-reaction'] = {
    emit: emitReaction,
    bind: bindReaction,
    editor: function ($item, item) {
      item.severity = item.severity || 'Mild';
      $item.empty();
      emitReaction($item, item);
      bindReaction($item, item);
      save($item, item);
    }
  };


  // ══════════════════════════════════════════════════════════════════════════
  // scp-history  — Medical History event  (log style: commit + fold + top)
  // ══════════════════════════════════════════════════════════════════════════

  function historySummaryHtml(item) {
    var s = esc(item.event || 'History');
    if (item.date) s += ' — ' + esc(item.date);
    return s;
  }

  function historyDetailHtml(item) {
    return '<div class="scp-row"><span class="scp-lbl">Event</span><div class="scp-val">' + esc(item.event || '') + '</div></div>' +
      '<div class="scp-row"><span class="scp-lbl">Date</span><div class="scp-val">' + esc(item.date || '') + '</div></div>' +
      '<div class="scp-row"><span class="scp-lbl">Provider</span><div class="scp-val">' + esc(item.provider || '') + '</div></div>' +
      (item.notes ? '<div class="scp-row"><span class="scp-lbl">Notes</span><div class="scp-val">' + esc(item.notes) + '</div></div>' : '');
  }

  function emitHistory($item, item) {
    injectStyles();
    if (item.committed) {
      $item.append(
        '<div class="scp scp-done">' +
        '<div class="scp-head">History<button class="scp-fold-btn">▲</button></div>' +
        '<div class="scp-detail">' + historyDetailHtml(item) + '</div>' +
        '<div class="scp-summary" style="display:none">' + historySummaryHtml(item) + '</div>' +
        '</div>'
      );
      return;
    }
    $item.append(
      '<div class="scp">' +
      '<div class="scp-head">History: ' + esc(item.event || '') + '</div>' +
      row('Event',    ta('scp-hist-event',    item.event)) +
      row('Date',     inp('scp-hist-date',    item.date, 'YYYY-MM-DD')) +
      row('Provider', inp('scp-hist-prov',    item.provider)) +
      row('Notes',    ta('scp-hist-notes',    item.notes)) +
      '<button class="scp-commit-btn">Save Entry</button>' +
      '</div>'
    );
  }

  function bindHistory($item, item) {
    if (item.committed) { bindFoldToggle($item); return; }
    $item.find('.scp-hist-event, .scp-hist-notes').each(function () { grow(this); });
    $item.find('.scp-hist-event').on('input', function () {
      grow(this); item.event = this.value;
      $item.find('.scp-head').text('History: ' + this.value);
    });
    $item.find('.scp-hist-date').on('input', function () { item.date     = this.value; });
    $item.find('.scp-hist-prov').on('input', function () { item.provider = this.value; });
    $item.find('.scp-hist-notes').on('input',function () { grow(this); item.notes = this.value; });
    $item.find('.scp-commit-btn').on('click', function () {
      item.committed = true;
      save($item, item);
      $item.empty(); emitHistory($item, item); bindHistory($item, item);
    });
  }

  window.plugins['scp-history'] = {
    emit: emitHistory,
    bind: bindHistory,
    editor: function ($item, item) {
      $item.empty();
      emitHistory($item, item);
      bindHistory($item, item);
      save($item, item);
      moveToTop($item, item);
    }
  };


  // ══════════════════════════════════════════════════════════════════════════
  // scp-next-step  — Next Step / Action Item
  // ══════════════════════════════════════════════════════════════════════════

  var STEP_WHO    = ['Patient', 'Family / Caregiver', 'Community Health Worker', 'Provider', 'Other'];
  var STEP_STATUS = ['Planned', 'In Progress', 'Done'];

  function nextStepDetailHtml(item) {
    return '<div class="scp-row"><span class="scp-lbl">Action</span><div class="scp-val">'  + esc(item.action || '')  + '</div></div>' +
      '<div class="scp-row"><span class="scp-lbl">Who</span><div class="scp-val">'          + esc(item.who || '')     + '</div></div>' +
      (item.by_when ? '<div class="scp-row"><span class="scp-lbl">By When</span><div class="scp-val">' + esc(item.by_when) + '</div></div>' : '') +
      '<div class="scp-row"><span class="scp-lbl">Status</span><div class="scp-val">'       + esc(item.status || '')  + '</div></div>' +
      (item.notes   ? '<div class="scp-row"><span class="scp-lbl">Notes</span><div class="scp-val">'   + esc(item.notes)   + '</div></div>' : '');
  }

  function emitNextStep($item, item) {
    injectStyles();
    if (item.committed) {
      var summary = esc(item.action || 'Next Step') + (item.status ? ' (' + esc(item.status) + ')' : '');
      $item.append(
        '<div class="scp scp-done">' +
        '<div class="scp-head">Next Step<button class="scp-fold-btn">▲</button></div>' +
        '<div class="scp-detail">' + nextStepDetailHtml(item) + '</div>' +
        '<div class="scp-summary" style="display:none">' + summary + '</div>' +
        '</div>'
      );
      return;
    }
    $item.append(
      '<div class="scp">' +
      '<div class="scp-head">' + esc(item.action || 'New Next Step') + '</div>' +
      row('Action',  ta('scp-step-action',  item.action)) +
      row('Who',     sel('scp-step-who',    STEP_WHO,    item.who)) +
      row('By When', inp('scp-step-by',     item.by_when, 'YYYY-MM-DD or description')) +
      row('Status',  sel('scp-step-status', STEP_STATUS, item.status)) +
      row('Notes',   ta('scp-step-notes',   item.notes)) +
      '<button class="scp-commit-btn">Save Entry</button>' +
      '</div>'
    );
  }

  function bindNextStep($item, item) {
    if (item.committed) { bindFoldToggle($item); return; }
    $item.find('.scp-step-action, .scp-step-notes').each(function () { grow(this); });
    $item.find('.scp-step-action').on('input', function () {
      grow(this); item.action = this.value;
      $item.find('.scp-head').text(this.value || 'New Next Step');
    });
    $item.find('.scp-step-by').on('input',     function () { item.by_when = this.value; });
    $item.find('.scp-step-notes').on('input',  function () { grow(this); item.notes = this.value; });
    $item.find('.scp-step-who').on('change',   function () { item.who    = this.value; });
    $item.find('.scp-step-status').on('change',function () { item.status = this.value; });
    $item.find('.scp-commit-btn').on('click', function () {
      item.committed = true;
      save($item, item);
      $item.empty(); emitNextStep($item, item); bindNextStep($item, item);
    });
  }

  window.plugins['scp-next-step'] = {
    emit: emitNextStep,
    bind: bindNextStep,
    editor: function ($item, item) {
      item.who    = item.who    || 'Patient';
      item.status = item.status || 'Planned';
      $item.empty();
      emitNextStep($item, item);
      bindNextStep($item, item);
      save($item, item);
    }
  };


  // ══════════════════════════════════════════════════════════════════════════
  // scp-directive  — Advanced Directive
  // ══════════════════════════════════════════════════════════════════════════

  var DIRECTIVE_TYPE = ['DNR / DNI', 'Healthcare Proxy', 'Living Will', 'POLST', 'Other'];

  function directiveDetailHtml(item) {
    return '<div class="scp-row"><span class="scp-lbl">Type</span><div class="scp-val">'            + esc(item.directive_type || '')    + '</div></div>' +
      (item.details           ? '<div class="scp-row"><span class="scp-lbl">Details</span><div class="scp-val">'           + esc(item.details)           + '</div></div>' : '') +
      (item.proxy_name        ? '<div class="scp-row"><span class="scp-lbl">Proxy Name</span><div class="scp-val">'        + esc(item.proxy_name)        + '</div></div>' : '') +
      (item.proxy_phone       ? '<div class="scp-row"><span class="scp-lbl">Proxy Phone</span><div class="scp-val">'       + esc(item.proxy_phone)       + '</div></div>' : '') +
      (item.document_location ? '<div class="scp-row"><span class="scp-lbl">Document Location</span><div class="scp-val">' + esc(item.document_location) + '</div></div>' : '') +
      (item.date_signed       ? '<div class="scp-row"><span class="scp-lbl">Date Signed</span><div class="scp-val">'       + esc(item.date_signed)       + '</div></div>' : '');
  }

  function emitDirective($item, item) {
    injectStyles();
    if (item.committed) {
      $item.append(
        '<div class="scp scp-done">' +
        '<div class="scp-head">Directive<button class="scp-fold-btn">▲</button></div>' +
        '<div class="scp-detail">' + directiveDetailHtml(item) + '</div>' +
        '<div class="scp-summary" style="display:none">' + esc(item.directive_type || 'Advanced Directive') + '</div>' +
        '</div>'
      );
      return;
    }
    $item.append(
      '<div class="scp">' +
      '<div class="scp-head">' + esc(item.directive_type || 'Advanced Directive') + '</div>' +
      row('Directive Type',    sel('scp-dir-type',     DIRECTIVE_TYPE, item.directive_type)) +
      row('Details',           ta('scp-dir-details',   item.details)) +
      row('Proxy Name',        inp('scp-dir-proxy',    item.proxy_name)) +
      row('Proxy Phone',       inp('scp-dir-phone',    item.proxy_phone)) +
      row('Document Location', inp('scp-dir-location', item.document_location)) +
      row('Date Signed',       inp('scp-dir-signed',   item.date_signed, 'YYYY-MM-DD')) +
      '<button class="scp-commit-btn">Save Entry</button>' +
      '</div>'
    );
  }

  function bindDirective($item, item) {
    if (item.committed) { bindFoldToggle($item); return; }
    $item.find('.scp-dir-details').each(function () { grow(this); });
    $item.find('.scp-dir-details').on('input',  function () { grow(this); item.details           = this.value; });
    $item.find('.scp-dir-proxy').on('input',    function () { item.proxy_name          = this.value; });
    $item.find('.scp-dir-phone').on('input',    function () { item.proxy_phone         = this.value; });
    $item.find('.scp-dir-location').on('input', function () { item.document_location   = this.value; });
    $item.find('.scp-dir-signed').on('input',   function () { item.date_signed         = this.value; });
    $item.find('.scp-dir-type').on('change', function () {
      item.directive_type = this.value;
      $item.find('.scp-head').text(this.value);
    });
    $item.find('.scp-commit-btn').on('click', function () {
      item.committed = true;
      save($item, item);
      $item.empty(); emitDirective($item, item); bindDirective($item, item);
    });
  }

  window.plugins['scp-directive'] = {
    emit: emitDirective,
    bind: bindDirective,
    editor: function ($item, item) {
      item.directive_type = item.directive_type || 'DNR / DNI';
      $item.empty();
      emitDirective($item, item);
      bindDirective($item, item);
      save($item, item);
    }
  };


  // ══════════════════════════════════════════════════════════════════════════
  // scp-access  — Who's Accessed My Plan  (log style: commit + fold + top)
  // ══════════════════════════════════════════════════════════════════════════

  function accessSummaryHtml(item) {
    var s = esc(item.accessor || 'Access');
    if (item.role) s += ' (' + esc(item.role) + ')';
    if (item.date) s += ' — ' + esc(item.date);
    return s;
  }

  function accessDetailHtml(item) {
    return '<div class="scp-row"><span class="scp-lbl">Accessor</span><div class="scp-val">' + esc(item.accessor || '') + '</div></div>' +
      '<div class="scp-row"><span class="scp-lbl">Role</span><div class="scp-val">' + esc(item.role || '') + '</div></div>' +
      '<div class="scp-row"><span class="scp-lbl">Date</span><div class="scp-val">' + esc(item.date || '') + '</div></div>' +
      (item.reason ? '<div class="scp-row"><span class="scp-lbl">Reason</span><div class="scp-val">' + esc(item.reason) + '</div></div>' : '');
  }

  function emitAccess($item, item) {
    injectStyles();
    if (item.committed) {
      $item.append(
        '<div class="scp scp-done">' +
        '<div class="scp-head">Access<button class="scp-fold-btn">▲</button></div>' +
        '<div class="scp-detail">' + accessDetailHtml(item) + '</div>' +
        '<div class="scp-summary" style="display:none">' + accessSummaryHtml(item) + '</div>' +
        '</div>'
      );
      return;
    }
    $item.append(
      '<div class="scp">' +
      '<div class="scp-head">Access: ' + esc(item.accessor || '') + '</div>' +
      row('Who Accessed', inp('scp-acc-who',    item.accessor)) +
      row('Their Role',   inp('scp-acc-role',   item.role)) +
      row('Date',         inp('scp-acc-date',   item.date, 'YYYY-MM-DD')) +
      row('Reason',       ta('scp-acc-reason',  item.reason)) +
      '<button class="scp-commit-btn">Save Entry</button>' +
      '</div>'
    );
  }

  function bindAccess($item, item) {
    if (item.committed) { bindFoldToggle($item); return; }
    $item.find('.scp-acc-reason').each(function () { grow(this); });
    $item.find('.scp-acc-who').on('input', function () {
      item.accessor = this.value;
      $item.find('.scp-head').text('Access: ' + this.value);
    });
    $item.find('.scp-acc-role').on('input',   function () { item.role   = this.value; });
    $item.find('.scp-acc-date').on('input',   function () { item.date   = this.value; });
    $item.find('.scp-acc-reason').on('input', function () { grow(this); item.reason = this.value; });
    $item.find('.scp-commit-btn').on('click', function () {
      item.committed = true;
      save($item, item);
      $item.empty(); emitAccess($item, item); bindAccess($item, item);
    });
  }

  window.plugins['scp-access'] = {
    emit: emitAccess,
    bind: bindAccess,
    editor: function ($item, item) {
      $item.empty();
      emitAccess($item, item);
      bindAccess($item, item);
      save($item, item);
      moveToTop($item, item);
    }
  };

}());
