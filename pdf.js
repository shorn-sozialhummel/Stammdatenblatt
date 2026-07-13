/* pdf.js — PDF- und JSON-Erzeugung im Browser (pdfmake)
 * =====================================================
 * KEIN Backend, KEIN fetch. Alles entsteht lokal im Browser.
 * Liest Labels/Struktur aus window.FIELDS und formatiert die vom
 * Formular übergebenen Werte.
 */
(function () {
  "use strict";

  var FIELDS = window.FIELDS || [];
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

  function fieldById(id) {
    for (var i = 0; i < FIELDS.length; i++) if (FIELDS[i].id === id) return FIELDS[i];
    return null;
  }

  // Wert lesbar machen (Optionen -> Labels, Boolean -> Ja)
  function readable(f, v) {
    if (f.type === "checkbox") return v === true ? "Ja" : "Nein";
    if (f.type === "checkboxgroup") {
      var arr = Array.isArray(v) ? v : [];
      return arr.map(function (val) {
        var o = (f.options || []).filter(function (o) { return String(o.value) === String(val); })[0];
        return o ? o.label : val;
      }).join(", ");
    }
    if (f.type === "select") {
      var opt = (f.options || []).filter(function (o) { return String(o.value) === String(v); })[0];
      return opt ? opt.label : String(v);
    }
    return String(v);
  }

  // data = { id: value } (bereits gefiltert: nur sichtbare, nicht-leere Kundenfelder)
  function groupBySection(data) {
    var groups = {};
    Object.keys(data).forEach(function (id) {
      var f = fieldById(id);
      if (!f || f.audience !== "kunde") return;
      var sec = f.section;
      (groups[sec] = groups[sec] || []).push({
        id: id, label: f.label, wert: data[id], lesbar: readable(f, data[id])
      });
    });
    // Reihenfolge innerhalb des Abschnitts wie in der Registry
    Object.keys(groups).forEach(function (sec) {
      groups[sec].sort(function (a, b) {
        return indexOf(a.id) - indexOf(b.id);
      });
    });
    return groups;
  }
  function indexOf(id) { for (var i = 0; i < FIELDS.length; i++) if (FIELDS[i].id === id) return i; return 9999; }

  function nowStamp() {
    var d = new Date();
    function p(n) { return (n < 10 ? "0" : "") + n; }
    return {
      iso: d.toISOString(),
      human: p(d.getDate()) + "." + p(d.getMonth() + 1) + "." + d.getFullYear(),
      file: d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate())
    };
  }

  function safeName(data) {
    var n = data.name ? String(data.name) : "Stammdatenblatt";
    return n.replace(/[^\wäöüÄÖÜß \-]/g, "").replace(/\s+/g, "_").slice(0, 60) || "Stammdatenblatt";
  }

  // ------------------------------------------------------------
  // PDF
  // ------------------------------------------------------------
  function buildDocDefinition(data) {
    var groups = groupBySection(data);
    var stamp = nowStamp();
    var content = [];

    content.push({ text: "Sozialhummel gGmbH", style: "org" });
    content.push({ text: "Stammdatenblatt und Wünsche", style: "title" });
    content.push({ text: "Erstellt am " + stamp.human + " — vom Kunden selbst ausgefüllt", style: "meta" });
    content.push({ text: " ", margin: [0, 4] });

    for (var sec = 1; sec <= 8; sec++) {
      var items = groups[sec];
      if (!items || !items.length) continue; // leere Abschnitte weglassen
      content.push({ text: SECTION_TITLES[sec], style: "section" });
      var rows = items.map(function (it) {
        return [
          { text: it.label, style: "label" },
          { text: it.lesbar, style: "value" }
        ];
      });
      content.push({
        table: { widths: ["40%", "60%"], body: rows },
        layout: {
          hLineWidth: function () { return 0.5; },
          vLineWidth: function () { return 0; },
          hLineColor: function () { return "#cccccc"; },
          paddingTop: function () { return 4; },
          paddingBottom: function () { return 4; }
        },
        margin: [0, 0, 0, 12]
      });
    }

    if (content.length <= 4) {
      content.push({ text: "Es wurden keine Angaben gemacht.", style: "value" });
    }

    return {
      info: { title: "Stammdatenblatt und Wünsche — Sozialhummel gGmbH" },
      pageSize: "A4",
      pageMargins: [40, 60, 40, 60],
      header: function (currentPage) {
        return currentPage === 1 ? null : {
          text: "Sozialhummel gGmbH — Stammdatenblatt und Wünsche",
          style: "runningHead", margin: [40, 20, 40, 0]
        };
      },
      footer: function (currentPage, pageCount) {
        return {
          columns: [
            { text: "Sozialhummel gGmbH", style: "runningFoot" },
            { text: "Seite " + currentPage + " von " + pageCount, style: "runningFoot", alignment: "right" }
          ],
          margin: [40, 10, 40, 0]
        };
      },
      content: content,
      defaultStyle: { font: "Roboto", fontSize: 11, color: "#14171a" },
      styles: {
        org: { fontSize: 12, bold: true, color: "#0b5d3b" },
        title: { fontSize: 20, bold: true, margin: [0, 2, 0, 2] },
        meta: { fontSize: 9, color: "#4a5158" },
        section: { fontSize: 14, bold: true, color: "#0b5d3b", margin: [0, 10, 0, 6] },
        label: { bold: true, fontSize: 10 },
        value: { fontSize: 11 },
        runningHead: { fontSize: 8, color: "#4a5158" },
        runningFoot: { fontSize: 8, color: "#4a5158" }
      }
    };
  }

  function generatePDF(data) {
    if (!window.pdfMake) throw new Error("pdfmake nicht geladen");
    var def = buildDocDefinition(data || {});
    pdfMake.createPdf(def).download("Stammdatenblatt_" + safeName(data || {}) + ".pdf");
  }

  // ------------------------------------------------------------
  // JSON
  // ------------------------------------------------------------
  function buildJSON(data) {
    var stamp = nowStamp();
    var groups = groupBySection(data);
    var lesbar = [];
    for (var sec = 1; sec <= 8; sec++) {
      if (!groups[sec]) continue;
      groups[sec].forEach(function (it) {
        lesbar.push({ abschnitt: sec, abschnitt_titel: SECTION_TITLES[sec], feld: it.id, label: it.label, wert: it.lesbar });
      });
    }
    return {
      formular: "Sozialhummel — Stammdatenblatt und Wünsche",
      version: 1,
      hinweis: "Vom Kunden selbst im Browser erstellt. Keine Serverübertragung.",
      erstellt_am: stamp.iso,
      daten: data,     // Roh-Werte je Feld-id — für die Übernahme ohne Abtippen
      lesbar: lesbar   // menschenlesbare Aufstellung
    };
  }

  function generateJSON(data) {
    var json = JSON.stringify(buildJSON(data || {}), null, 2);
    var blob = new Blob([json], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "Stammdatenblatt_" + safeName(data || {}) + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  window.SozialhummelPDF = {
    generatePDF: generatePDF, generateJSON: generateJSON,
    _buildJSON: buildJSON, _buildDoc: buildDocDefinition
  };
})();
