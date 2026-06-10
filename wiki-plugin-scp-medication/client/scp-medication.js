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
    '.scp-summary { font-size:.85rem; color:#333; padding:2px 0; cursor:default; }',
    '.scp-summary-meta { font-size:.75rem; color:#888; margin-top:1px; }',
    '.scp-summary-toggle { font-size:.75rem; color:#888; text-decoration:underline;',
    '  cursor:pointer; margin-left:8px; }',
    '.scp-full-detail { margin-top:6px; padding-top:6px; border-top:1px solid rgba(0,0,0,.08); }',
    '.scp-done { opacity:.75; }',
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

  function save($item, item) {
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

  function emitVital($item, item) {
    injectStyles();
    if (item.committed) {
      $item.append(
        '<div class="scp scp-done">' +
        '<div class="scp-head">Vital <span class="scp-summary-toggle">details</span></div>' +
        '<div class="scp-summary">' + vitalSummaryHtml(item) + '</div>' +
        '<div class="scp-full-detail" style="display:none">' +
          '<div class="scp-row"><span class="scp-lbl">Measurement</span><div class="scp-val">' + esc(item.measurement || '') + '</div></div>' +
          '<div class="scp-row"><span class="scp-lbl">Value</span><div class="scp-val">' + esc(item.value || '') + '</div></div>' +
          '<div class="scp-row"><span class="scp-lbl">Unit</span><div class="scp-val">' + esc(item.unit || '') + '</div></div>' +
          '<div class="scp-row"><span class="scp-lbl">Date</span><div class="scp-val">' + esc(item.date || '') + '</div></div>' +
          '<div class="scp-row"><span class="scp-lbl">Time</span><div class="scp-val">' + esc(item.time || '') + '</div></div>' +
          (item.notes ? '<div class="scp-row"><span class="scp-lbl">Notes</span><div class="scp-val">' + esc(item.notes) + '</div></div>' : '') +
        '</div>' +
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
    // Toggle detail panel when committed
    $item.find('.scp-summary-toggle').on('click', function () {
      $item.find('.scp-full-detail').toggle();
      $(this).text($(this).text() === 'details' ? 'hide' : 'details');
    });
    if (item.committed) return;

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

    // Commit: write ONE journal entry, collapse to summary
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

  function emitSymptom($item, item) {
    injectStyles();
    if (item.committed) {
      $item.append(
        '<div class="scp scp-done">' +
        '<div class="scp-head">Symptom <span class="scp-summary-toggle">details</span></div>' +
        '<div class="scp-summary">' + symptomSummaryHtml(item) + '</div>' +
        '<div class="scp-full-detail" style="display:none">' +
          '<div class="scp-row"><span class="scp-lbl">Symptom</span><div class="scp-val">' + esc(item.symptom || '') + '</div></div>' +
          '<div class="scp-row"><span class="scp-lbl">Severity</span><div class="scp-val">' + esc(item.severity || '') + '</div></div>' +
          '<div class="scp-row"><span class="scp-lbl">Date</span><div class="scp-val">' + esc(item.date || '') + '</div></div>' +
          '<div class="scp-row"><span class="scp-lbl">Duration</span><div class="scp-val">' + esc(item.duration || '') + '</div></div>' +
          (item.possible_cause ? '<div class="scp-row"><span class="scp-lbl">Possible Cause</span><div class="scp-val">' + esc(item.possible_cause) + '</div></div>' : '') +
          (item.action_taken   ? '<div class="scp-row"><span class="scp-lbl">Action Taken</span><div class="scp-val">'   + esc(item.action_taken)   + '</div></div>' : '') +
        '</div>' +
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
    $item.find('.scp-summary-toggle').on('click', function () {
      $item.find('.scp-full-detail').toggle();
      $(this).text($(this).text() === 'details' ? 'hide' : 'details');
    });
    if (item.committed) return;

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

    // Commit: write ONE journal entry, collapse to summary
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

  function emitVisit($item, item) {
    injectStyles();
    if (item.committed) {
      $item.append(
        '<div class="scp scp-done">' +
        '<div class="scp-head">Visit <span class="scp-summary-toggle">details</span></div>' +
        '<div class="scp-summary">' + visitSummaryHtml(item) + '</div>' +
        '<div class="scp-full-detail" style="display:none">' +
          '<div class="scp-row"><span class="scp-lbl">Provider</span><div class="scp-val">' + esc(item.provider || '') + '</div></div>' +
          '<div class="scp-row"><span class="scp-lbl">Type</span><div class="scp-val">' + esc(item.visit_type || '') + '</div></div>' +
          '<div class="scp-row"><span class="scp-lbl">Date</span><div class="scp-val">' + esc(item.date || '') + '</div></div>' +
          (item.reason     ? '<div class="scp-row"><span class="scp-lbl">Reason</span><div class="scp-val">'    + esc(item.reason)     + '</div></div>' : '') +
          (item.outcome    ? '<div class="scp-row"><span class="scp-lbl">Outcome</span><div class="scp-val">'   + esc(item.outcome)    + '</div></div>' : '') +
          (item.follow_up  ? '<div class="scp-row"><span class="scp-lbl">Follow Up</span><div class="scp-val">' + esc(item.follow_up)  + '</div></div>' : '') +
        '</div>' +
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
    $item.find('.scp-summary-toggle').on('click', function () {
      $item.find('.scp-full-detail').toggle();
      $(this).text($(this).text() === 'details' ? 'hide' : 'details');
    });
    if (item.committed) return;

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

    // Commit: write ONE journal entry, collapse to summary
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

}());
