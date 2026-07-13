#!/usr/bin/env node
/*
 * check-fields.js — Prüfskript für die Feld-Registry (fields.js)
 * =============================================================
 *
 * Aufruf:  node check-fields.js
 *
 * Prüft, dass die Registry alle Regeln aus PROJEKT-ANWEISUNGEN.md einhält.
 * Beendet sich mit Code 0, wenn alles in Ordnung ist, sonst mit Code 1.
 *
 * Geprüft wird u. a.:
 *   - eindeutige, nicht-leere id
 *   - jedes Feld hat einen nicht-leeren Hilfetext (`help`)  ← kein Feld ohne Hilfetext
 *   - gültiger `type`
 *   - `section` ist eine Zahl 1..8                          ← NEU
 *   - `audience` ist "kunde" oder "intern"                  ← NEU
 *   - bei `sensitive: true` ist das Feld NICHT `required`   ← NEU
 *   - select/radio/checkboxgroup haben eine Optionsliste
 *   - `showIf` verweist auf ein existierendes Feld
 *   - genau ein required-Feld: `name`
 */

"use strict";

var FIELDS = require("./fields.js");

var VALID_TYPES = [
  "text", "textarea", "date", "tel", "email", "number",
  "select", "radio", "checkbox", "checkboxgroup"
];
var OPTION_TYPES = ["select", "radio", "checkboxgroup"];
var VALID_AUDIENCE = ["kunde", "intern"];
var MIN_SECTION = 1;
var MAX_SECTION = 8;

var errors = [];
var warnings = [];
var seen = Object.create(null);

function err(id, msg) { errors.push("[" + (id || "?") + "] " + msg); }
function warn(id, msg) { warnings.push("[" + (id || "?") + "] " + msg); }

if (!Array.isArray(FIELDS)) {
  console.error("FEHLER: fields.js exportiert kein Array.");
  process.exit(1);
}

// Erster Durchlauf: ids sammeln (für showIf-Prüfung)
var idSet = Object.create(null);
FIELDS.forEach(function (f) {
  if (f && typeof f.id === "string") { idSet[f.id] = true; }
});

var requiredCount = 0;

FIELDS.forEach(function (f, i) {
  var pos = "Index " + i;

  if (!f || typeof f !== "object") {
    err(pos, "Eintrag ist kein Objekt.");
    return;
  }

  // id
  if (typeof f.id !== "string" || f.id.trim() === "") {
    err(pos, "id fehlt oder ist leer.");
  } else if (seen[f.id]) {
    err(f.id, "id ist doppelt vergeben.");
  } else {
    seen[f.id] = true;
  }

  // label
  if (typeof f.label !== "string" || f.label.trim() === "") {
    err(f.id, "label fehlt oder ist leer.");
  }

  // help — KEIN Feld ohne Hilfetext
  if (typeof f.help !== "string" || f.help.trim() === "") {
    err(f.id, "help (Hilfetext) fehlt oder ist leer. Jedes Feld braucht einen Hilfetext.");
  } else if (f.help.trim().length < 10) {
    warn(f.id, "Hilfetext ist sehr kurz (< 10 Zeichen).");
  }

  // type
  if (VALID_TYPES.indexOf(f.type) === -1) {
    err(f.id, "type '" + f.type + "' ist ungültig. Erlaubt: " + VALID_TYPES.join(", "));
  }

  // section — NEU: Zahl 1..8
  if (typeof f.section !== "number" || !isFinite(f.section) ||
      f.section < MIN_SECTION || f.section > MAX_SECTION ||
      Math.floor(f.section) !== f.section) {
    err(f.id, "section muss eine ganze Zahl zwischen " + MIN_SECTION + " und " + MAX_SECTION + " sein (ist: " + f.section + ").");
  }

  // audience — NEU
  if (VALID_AUDIENCE.indexOf(f.audience) === -1) {
    err(f.id, "audience muss 'kunde' oder 'intern' sein (ist: " + f.audience + ").");
  }

  // sensitive => nicht required — NEU
  if (f.sensitive === true && f.required === true) {
    err(f.id, "Feld ist sensitive:true und darf deshalb NICHT required sein. Sensible Angaben sind immer freiwillig.");
  }

  // required zählen
  if (f.required === true) {
    requiredCount++;
    if (f.id !== "name") {
      warn(f.id, "Feld ist required. Laut Vorgabe ist nur 'name' Pflichtfeld.");
    }
  }

  // Optionen bei select/radio/checkboxgroup
  if (OPTION_TYPES.indexOf(f.type) !== -1) {
    if (!Array.isArray(f.options) || f.options.length === 0) {
      err(f.id, "type '" + f.type + "' braucht eine nicht-leere options-Liste.");
    } else {
      f.options.forEach(function (o, oi) {
        if (!o || typeof o.value === "undefined" || typeof o.label !== "string") {
          err(f.id, "option " + oi + " braucht value und label.");
        }
      });
    }
  } else if (typeof f.options !== "undefined") {
    warn(f.id, "options ist gesetzt, wird bei type '" + f.type + "' aber ignoriert.");
  }

  // showIf verweist auf existierendes Feld
  if (typeof f.showIf !== "undefined") {
    if (!f.showIf || typeof f.showIf.field !== "string") {
      err(f.id, "showIf braucht ein Feld { field: '<id>', value: <wert> }.");
    } else if (!idSet[f.showIf.field]) {
      err(f.id, "showIf verweist auf unbekanntes Feld '" + f.showIf.field + "'.");
    } else if (typeof f.showIf.value === "undefined") {
      err(f.id, "showIf braucht einen value.");
    }
  }

  // deprecated muss boolean sein, wenn gesetzt
  if (typeof f.deprecated !== "undefined" && typeof f.deprecated !== "boolean") {
    err(f.id, "deprecated muss true/false sein.");
  }
});

// Genau ein Pflichtfeld: name
if (requiredCount === 0) {
  err("name", "Es gibt kein Pflichtfeld. 'name' muss required sein.");
} else if (requiredCount > 1) {
  warn("*", "Es gibt " + requiredCount + " Pflichtfelder. Vorgesehen ist nur 'name'.");
}
if (!idSet["name"]) {
  err("name", "Pflichtfeld 'name' fehlt in der Registry.");
}

// --- Ausgabe ---
var total = FIELDS.length;
var kunde = FIELDS.filter(function (f) { return f.audience === "kunde"; }).length;
var intern = FIELDS.filter(function (f) { return f.audience === "intern"; }).length;
var deprecated = FIELDS.filter(function (f) { return f.deprecated === true; }).length;

console.log("check-fields.js — Prüfung der Feld-Registry");
console.log("--------------------------------------------");
console.log("Felder gesamt : " + total);
console.log("  audience=kunde  : " + kunde);
console.log("  audience=intern : " + intern);
console.log("  deprecated      : " + deprecated);
console.log("");

if (warnings.length) {
  console.log("Warnungen (" + warnings.length + "):");
  warnings.forEach(function (w) { console.log("  ! " + w); });
  console.log("");
}

if (errors.length) {
  console.log("FEHLER (" + errors.length + "):");
  errors.forEach(function (e) { console.log("  ✗ " + e); });
  console.log("");
  console.log("Ergebnis: NICHT bestanden.");
  process.exit(1);
} else {
  console.log("Ergebnis: Alles in Ordnung. ✓");
  process.exit(0);
}
