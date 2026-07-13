/* form.js — Schrittlogik, Rendering aus der Registry, localStorage
 * ================================================================
 * Liest ausschliesslich aus window.FIELDS (fields.js).
 * Kein Framework, kein Netzwerk. Alles bleibt im Browser.
 */
(function () {
  "use strict";

  var FIELDS = window.FIELDS || [];
  var STORAGE_KEY = "sozialhummel_stammdaten_v1";
  var SECTION_COUNT = 8;
  var SECTION_TITLES = {
    1: "Zur Person",
    2: "Gesundheit und Diagnosen",
    3: "Versicherung und Leistungen",
    4: "Wohnen und Umfeld",
    5: "Kontaktpersonen",
    6: "Unterstützungsbedarf",
    7: "Wünsche an die Assistenzkraft",
    8: "Abschluss"
  };
  var SECTION_INTROS = {
    1: "Nur Ihr Name ist ein Pflichtfeld. Alles andere ist freiwillig.",
    2: "Diese Angaben sind freiwillig. Sie können jedes Feld überspringen und im Gespräch klären.",
    3: "Angaben zu Versicherung und Leistungen. Alles freiwillig.",
    4: "Wie und wo Sie wohnen. Alles freiwillig.",
    5: "Wichtige Kontaktpersonen. Schalten Sie nur die Blöcke ein, die auf Sie zutreffen.",
    6: "Wobei brauchen Sie Unterstützung? Setzen Sie den Haken, wo Sie gut allein zurechtkommen. Alles freiwillig.",
    7: "Was wünschen Sie sich von Ihrer Assistenzkraft? Alles freiwillig.",
    8: "Zum Schluss noch ein paar Fragen. Danach können Sie Ihre Angaben herunterladen."
  };

  // ---- Zustand ----
  var state = { section: 1, values: {} };

  // ---- DOM ----
  var $ = function (id) { return document.getElementById(id); };
  var sectionsEl = $("sections");
  var liveEl = $("live-region");
  var errorEl = $("error-region");

  // ============================================================
  // Speicher
  // ============================================================
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        section: state.section, values: state.values
      }));
    } catch (e) { /* localStorage evtl. nicht verfügbar — kein Abbruch */ }
  }
  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var data = JSON.parse(raw);
      if (data && typeof data === "object") {
        state.values = data.values || {};
        if (data.section >= 1 && data.section <= SECTION_COUNT) {
          state.section = data.section;
        }
      }
    } catch (e) { /* defekter Stand wird ignoriert */ }
  }
  function clearStorage() {
    var ok = window.confirm(
      "Möchten Sie wirklich alle Angaben von diesem Gerät löschen? " +
      "Das kann nicht rückgängig gemacht werden."
    );
    if (!ok) return;
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    state.values = {};
    state.section = 1;
    showForm();
    render();
    announce("Alle Angaben wurden von diesem Gerät gelöscht.");
  }

  // ============================================================
  // Sichtbarkeit / showIf
  // ============================================================
  function asBool(v) { return v === true || v === "true"; }

  function isVisible(f) {
    if (!f.showIf) return true;
    var dep = FIELDS.filter(function (x) { return x.id === f.showIf.field; })[0];
    if (dep && !isVisible(dep)) return false;
    var cur = state.values[f.showIf.field];
    var want = f.showIf.value;
    if (typeof want === "boolean") return asBool(cur) === want;
    return String(cur == null ? "" : cur) === String(want);
  }

  function hasValue(f) {
    var v = state.values[f.id];
    if (f.type === "checkbox") return v === true;
    if (f.type === "checkboxgroup") return Array.isArray(v) && v.length > 0;
    return v != null && String(v).trim() !== "";
  }

  // ============================================================
  // Rendering eines Abschnitts
  // ============================================================
  function fieldsOfSection(sec) {
    return FIELDS.filter(function (f) {
      return f.section === sec && f.audience === "kunde" && f.deprecated !== true;
    });
  }

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "class") e.className = attrs[k];
      else e.setAttribute(k, attrs[k]);
    });
    if (text != null) e.textContent = text;
    return e;
  }

  function buildField(f) {
    var wrap = el("div", { "class": "field", "data-field-id": f.id });
    if (f.showIf) {
      wrap.setAttribute("data-showif-field", f.showIf.field);
      wrap.setAttribute("data-showif-value", String(f.showIf.value));
    }
    var helpId = "help-" + f.id;
    var errId = "err-" + f.id;
    var val = state.values[f.id];

    if (f.type === "checkbox") {
      var row = el("div", { "class": "check-row" });
      var cb = el("input", { type: "checkbox", id: f.id, "aria-describedby": helpId });
      if (val === true) cb.checked = true;
      cb.addEventListener("change", function () {
        state.values[f.id] = cb.checked;
        onValueChanged();
      });
      var lab = el("label", { "for": f.id }, f.label);
      row.appendChild(cb);
      row.appendChild(lab);
      wrap.appendChild(row);
      wrap.appendChild(el("span", { "class": "help", id: helpId }, f.help));
      return wrap;
    }

    if (f.type === "checkboxgroup") {
      var fs = el("fieldset", { "class": "checkgroup", "aria-describedby": helpId });
      var legend = el("legend", null, f.label);
      if (f.sensitive) legend.appendChild(makeSensitiveBadge());
      fs.appendChild(legend);
      fs.appendChild(el("span", { "class": "help", id: helpId }, f.help));
      var chosen = Array.isArray(val) ? val : [];
      f.options.forEach(function (o, i) {
        var oid = f.id + "_" + i;
        var l = el("label", { "for": oid });
        var box = el("input", { type: "checkbox", id: oid, value: o.value });
        if (chosen.indexOf(o.value) !== -1) box.checked = true;
        box.addEventListener("change", function () {
          var arr = Array.isArray(state.values[f.id]) ? state.values[f.id].slice() : [];
          var idx = arr.indexOf(o.value);
          if (box.checked && idx === -1) arr.push(o.value);
          if (!box.checked && idx !== -1) arr.splice(idx, 1);
          state.values[f.id] = arr;
          onValueChanged();
        });
        l.appendChild(box);
        l.appendChild(document.createTextNode(" " + o.label));
        fs.appendChild(l);
      });
      wrap.appendChild(fs);
      return wrap;
    }

    // Label (für input/textarea/select)
    var labelEl = el("label", { "for": f.id });
    labelEl.appendChild(document.createTextNode(f.label + " "));
    if (f.required) labelEl.appendChild(el("span", { "class": "req" }, "(Pflichtfeld)"));
    if (f.sensitive) labelEl.appendChild(makeSensitiveBadge());
    wrap.appendChild(labelEl);
    wrap.appendChild(el("span", { "class": "help", id: helpId }, f.help));

    var input;
    if (f.type === "textarea") {
      input = el("textarea", { id: f.id, "aria-describedby": helpId });
      if (val != null) input.value = val;
    } else if (f.type === "select") {
      input = el("select", { id: f.id, "aria-describedby": helpId });
      input.appendChild(el("option", { value: "" }, "Bitte wählen"));
      f.options.forEach(function (o) {
        var opt = el("option", { value: o.value }, o.label);
        if (String(val) === String(o.value)) opt.selected = true;
        input.appendChild(opt);
      });
    } else {
      var typeMap = { text: "text", tel: "tel", email: "email", date: "date", number: "number" };
      input = el("input", { type: typeMap[f.type] || "text", id: f.id, "aria-describedby": helpId });
      if (f.placeholder) input.setAttribute("placeholder", f.placeholder);
      if (val != null) input.value = val;
    }
    if (f.required) input.setAttribute("aria-required", "true");
    input.addEventListener("input", function () {
      state.values[f.id] = input.value;
      onValueChangedLight();
    });
    input.addEventListener("change", function () {
      state.values[f.id] = input.value;
      onValueChanged();
    });
    wrap.appendChild(input);
    wrap.appendChild(el("p", { "class": "field-error", id: errId, hidden: "hidden" }));
    return wrap;
  }

  function makeSensitiveBadge() {
    return el("span", { "class": "badge-sensitive", title: "Diese Angabe ist freiwillig." }, "freiwillig");
  }

  function render() {
    sectionsEl.innerHTML = "";
    var sec = state.section;

    var wrapper = el("section", {
      "class": "section", id: "section-" + sec,
      "aria-labelledby": "section-title", tabindex: "-1"
    });
    var h = el("h2", { "class": "section-title", id: "section-title" },
      "Abschnitt " + sec + ": " + SECTION_TITLES[sec]);
    wrapper.appendChild(h);
    wrapper.appendChild(el("p", { "class": "section-intro" }, SECTION_INTROS[sec] || ""));

    fieldsOfSection(sec).forEach(function (f) {
      wrapper.appendChild(buildField(f));
    });
    sectionsEl.appendChild(wrapper);

    applyVisibility();
    updateProgress();
    updateNav();
    clearErrorRegion();

    // Fokus auf die Abschnittsüberschrift (für Screenreader)
    wrapper.focus();
  }

  function applyVisibility() {
    var wraps = sectionsEl.querySelectorAll("[data-showif-field]");
    Array.prototype.forEach.call(wraps, function (w) {
      var f = w.getAttribute("data-showif-field");
      var want = w.getAttribute("data-showif-value");
      var cur = state.values[f];
      var visible;
      if (want === "true" || want === "false") visible = asBool(cur) === (want === "true");
      else visible = String(cur == null ? "" : cur) === want;
      w.hidden = !visible;
    });
  }

  // Bei Texteingabe nur speichern (kein Neu-Rendern, Fokus bleibt)
  function onValueChangedLight() { save(); }
  // Bei Auswahl/Checkbox: Sichtbarkeit neu berechnen + speichern
  function onValueChanged() { applyVisibility(); save(); }

  // ============================================================
  // Fortschritt & Navigation
  // ============================================================
  function updateProgress() {
    $("progress-text").textContent = "Abschnitt " + state.section + " von " + SECTION_COUNT +
      ": " + SECTION_TITLES[state.section];
    var ol = $("progress-steps");
    ol.innerHTML = "";
    for (var i = 1; i <= SECTION_COUNT; i++) {
      var li = el("li", null, i + ". " + SECTION_TITLES[i]);
      if (i === state.section) li.setAttribute("aria-current", "step");
      else if (i < state.section) li.className = "done";
      ol.appendChild(li);
    }
    $("progress-bar-fill").style.width = (state.section / SECTION_COUNT * 100) + "%";
  }

  function updateNav() {
    $("btn-back").disabled = (state.section === 1);
    $("btn-next").textContent = (state.section === SECTION_COUNT) ? "Zum Abschluss" : "Weiter";
  }

  function goTo(sec) {
    state.section = Math.max(1, Math.min(SECTION_COUNT, sec));
    save();
    render();
    window.scrollTo(0, 0);
  }

  // ============================================================
  // Validierung (nur name Pflicht; Formate nur wenn ausgefüllt)
  // ============================================================
  function validateSection(sec) {
    var problems = [];
    fieldsOfSection(sec).forEach(function (f) {
      if (!isVisible(f)) return;
      var v = state.values[f.id];
      if (f.required && (v == null || String(v).trim() === "")) {
        problems.push({ id: f.id, msg: "Bitte tragen Sie hier etwas ein: " + f.label + "." });
      }
      if (f.type === "email" && v && String(v).trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        problems.push({ id: f.id, msg: "Bitte prüfen Sie die E-Mail-Adresse: " + f.label + "." });
      }
    });
    return problems;
  }

  function showFieldErrors(problems) {
    // alte Fehler zurücksetzen
    Array.prototype.forEach.call(sectionsEl.querySelectorAll("[aria-invalid]"), function (n) {
      n.removeAttribute("aria-invalid");
    });
    Array.prototype.forEach.call(sectionsEl.querySelectorAll(".field-error"), function (n) {
      n.hidden = true; n.textContent = "";
    });

    problems.forEach(function (p) {
      var input = $(p.id);
      var errBox = $("err-" + p.id);
      if (input) {
        input.setAttribute("aria-invalid", "true");
        var describedby = (input.getAttribute("aria-describedby") || "").split(" ");
        if (describedby.indexOf("err-" + p.id) === -1) {
          describedby.push("err-" + p.id);
          input.setAttribute("aria-describedby", describedby.join(" ").trim());
        }
      }
      if (errBox) { errBox.textContent = p.msg; errBox.hidden = false; }
    });

    if (problems.length) {
      errorEl.hidden = false;
      errorEl.textContent = problems.length === 1
        ? problems[0].msg
        : "Bitte prüfen Sie " + problems.length + " Angaben in diesem Abschnitt.";
      var first = $(problems[0].id);
      if (first) first.focus();
    }
  }

  function clearErrorRegion() { errorEl.hidden = true; errorEl.textContent = ""; }

  function announce(msg) { liveEl.textContent = ""; setTimeout(function () { liveEl.textContent = msg; }, 30); }

  // ============================================================
  // Screens: Formular <-> Abschluss
  // ============================================================
  function showForm() {
    $("done-screen").hidden = true;
    $("form").hidden = false;
    $("progress-nav").hidden = false;
  }
  function showDone() {
    // name muss vorhanden sein
    var name = state.values.name;
    if (name == null || String(name).trim() === "") {
      goTo(1);
      showFieldErrors([{ id: "name", msg: "Bitte tragen Sie zuerst Ihren Namen ein. Das ist die einzige Pflichtangabe." }]);
      announce("Bitte tragen Sie zuerst Ihren Namen ein.");
      return;
    }
    $("form").hidden = true;
    $("progress-nav").hidden = true;
    var d = $("done-screen");
    d.hidden = false;
    d.focus();
    window.scrollTo(0, 0);
  }

  // ============================================================
  // Datenerhebung für PDF / JSON
  // ============================================================
  function collectData() {
    var out = {};
    FIELDS.forEach(function (f) {
      if (f.audience !== "kunde" || f.deprecated === true) return;
      if (!isVisible(f)) return;
      if (!hasValue(f)) return;
      out[f.id] = state.values[f.id];
    });
    return out;
  }

  // ============================================================
  // Ereignisse
  // ============================================================
  function onNext() {
    if (state.section === SECTION_COUNT) {
      var probs = validateSection(state.section);
      if (probs.length) { showFieldErrors(probs); return; }
      showDone();
      return;
    }
    var problems = validateSection(state.section);
    if (problems.length) { showFieldErrors(problems); return; }
    goTo(state.section + 1);
  }
  function onSkip() {
    if (state.section === SECTION_COUNT) { showDone(); return; }
    goTo(state.section + 1);
    announce("Abschnitt übersprungen. Sie sind jetzt in Abschnitt " + state.section + ".");
  }
  function onBack() { if (state.section > 1) goTo(state.section - 1); }

  function onDownloadPDF() {
    try {
      var data = collectData();
      window.SozialhummelPDF.generatePDF(data);
      $("after-download").hidden = false;
      announce("Das PDF wurde erstellt und wird heruntergeladen. Denken Sie danach an das Löschen des Zwischenspeichers, wenn Sie ein geteiltes Gerät nutzen.");
    } catch (e) {
      errorEl.hidden = false;
      errorEl.textContent = "Das PDF konnte nicht erstellt werden. Bitte laden Sie die Seite neu und versuchen Sie es erneut.";
    }
  }
  function onDownloadJSON() {
    try {
      var data = collectData();
      window.SozialhummelPDF.generateJSON(data);
      $("after-download").hidden = false;
      announce("Die JSON-Datei wurde erstellt und wird heruntergeladen.");
    } catch (e) {
      errorEl.hidden = false;
      errorEl.textContent = "Die Datei konnte nicht erstellt werden. Bitte laden Sie die Seite neu und versuchen Sie es erneut.";
    }
  }

  // Datenschutz-Dialog
  function openDS() {
    var dlg = $("datenschutz-dialog");
    if (typeof dlg.showModal === "function") dlg.showModal();
    else dlg.setAttribute("open", "open");
  }
  function closeDS() {
    var dlg = $("datenschutz-dialog");
    if (typeof dlg.close === "function") dlg.close();
    else dlg.removeAttribute("open");
  }

  // ============================================================
  // Init
  // ============================================================
  function init() {
    load();
    $("btn-next").addEventListener("click", onNext);
    $("btn-skip").addEventListener("click", onSkip);
    $("btn-back").addEventListener("click", onBack);
    $("btn-back-from-done").addEventListener("click", function () { showForm(); goTo(SECTION_COUNT); });
    $("btn-pdf").addEventListener("click", onDownloadPDF);
    $("btn-json").addEventListener("click", onDownloadJSON);
    $("btn-clear-storage").addEventListener("click", clearStorage);
    $("btn-clear-storage-2").addEventListener("click", clearStorage);
    $("btn-datenschutz").addEventListener("click", openDS);
    $("btn-datenschutz-2").addEventListener("click", openDS);
    $("btn-ds-close").addEventListener("click", closeDS);

    showForm();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
