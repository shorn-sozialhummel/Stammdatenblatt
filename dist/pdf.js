/* pdf.js — PDF- und JSON-Erzeugung im Browser (pdfmake)
 * =====================================================
 * KEIN Backend, KEIN fetch an einen Server. Alles entsteht lokal im Browser.
 * Liest Labels/Struktur aus window.FIELDS und formatiert die vom Formular
 * übergebenen Werte. Das PDF orientiert sich am Layout der Papiervorlagen
 * (Kopf- und Fußzeile der Sozialhummel).
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

  // Logo wird — wenn vorhanden — aus assets/logo.png geladen.
  // Fehlt die Datei (oder lässt sie sich nicht als Data-URL lesen, z. B. unter
  // file://), bleibt LOGO_DATAURL null und die Kopfzeile zeigt nur den Text.
  var LOGO_DATAURL = null;
  function preloadLogo() {
    try {
      var img = new Image();
      img.onload = function () {
        try {
          var c = document.createElement("canvas");
          c.width = img.naturalWidth || img.width;
          c.height = img.naturalHeight || img.height;
          c.getContext("2d").drawImage(img, 0, 0);
          LOGO_DATAURL = c.toDataURL("image/png");
        } catch (e) { LOGO_DATAURL = null; }
      };
      img.onerror = function () { LOGO_DATAURL = null; };
      img.src = "assets/logo.png";
    } catch (e) { LOGO_DATAURL = null; }
  }

  function fieldById(id) {
    for (var i = 0; i < FIELDS.length; i++) if (FIELDS[i].id === id) return FIELDS[i];
    return null;
  }
  function indexOf(id) { for (var i = 0; i < FIELDS.length; i++) if (FIELDS[i].id === id) return i; return 9999; }

  function isListType(f) { return f.type === "checkboxgroup" || f.type === "multiselect"; }

  // Array der lesbaren Labels (für Listen-Darstellung)
  function valueLabels(f, v) {
    var arr = Array.isArray(v) ? v : [];
    return arr.map(function (val) {
      var o = (f.options || []).filter(function (o) { return String(o.value) === String(val); })[0];
      return o ? o.label : String(val);
    });
  }

  // Wert lesbar machen (Optionen -> Labels, Boolean -> Ja) — für JSON/Einzeltext
  function readable(f, v) {
    if (f.type === "checkbox") return v === true ? "Ja" : "Nein";
    if (isListType(f)) return valueLabels(f, v).join(", ");
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
        id: id,
        label: f.label,
        wert: data[id],
        lesbar: readable(f, data[id]),
        listItems: isListType(f) ? valueLabels(f, data[id]) : null
      });
    });
    Object.keys(groups).forEach(function (sec) {
      groups[sec].sort(function (a, b) { return indexOf(a.id) - indexOf(b.id); });
    });
    return groups;
  }

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
  // Kopf- und Fußzeile (auf jeder Seite) — Layout wie die Papiervorlage
  // ------------------------------------------------------------
  function pageHeader() {
    var headText = {
      width: "*",
      alignment: "right",
      stack: [
        { text: "Sozialhummel gGmbH", bold: true, fontSize: 12 },
        { text: "Hilfen für sozial benachteiligte Menschen und Menschen mit Behinderung", fontSize: 8, color: "#333333" }
      ]
    };
    var left = LOGO_DATAURL
      ? { image: LOGO_DATAURL, fit: [150, 64], width: 160 }
      : { text: "", width: 160 };
    return { columns: [left, headText], margin: [40, 24, 40, 0] };
  }

  function pageFooter(currentPage, pageCount) {
    var col = { fontSize: 7, color: "#333333" };
    return {
      margin: [40, 8, 40, 0],
      stack: [
        {
          columns: [
            { width: "34%", stack: [
              "Sozialhummel gGmbH", "Mozartstraße 10", "53819 Neunkirchen-Seelscheid"
            ], fontSize: 7, color: "#333333" },
            { width: "33%", alignment: "center", fontSize: 7, color: "#333333", stack: [
              { text: "www.sozialhummel.de", link: "https://www.sozialhummel.de", color: "#0b5d3b" },
              "info@sozialhummel.de",
              "Tel: 0228 – 18 05 90 92"
            ] },
            { width: "33%", alignment: "right", fontSize: 7, color: "#333333", stack: [
              "Geschäftsführung: Silke Horn",
              "stv. Geschäftsführung: Axel Dewald",
              "IK-Nummer: 462534065",
              "HRB: 17329"
            ] }
          ]
        },
        { text: "Seite " + currentPage + " von " + pageCount, alignment: "right", fontSize: 7, color: "#333333", margin: [0, 4, 0, 0] }
      ]
    };
  }

  // ------------------------------------------------------------
  // PDF
  // ------------------------------------------------------------
  function buildDocDefinition(data) {
    var groups = groupBySection(data);
    var stamp = nowStamp();
    var content = [];

    content.push({ text: "Stammdatenblatt und Wünsche des Kunden", style: "title" });
    content.push({ text: "Erstellt am " + stamp.human + " — vom Kunden selbst ausgefüllt", style: "meta", margin: [0, 0, 0, 10] });

    var hadContent = false;
    for (var sec = 1; sec <= 8; sec++) {
      var items = groups[sec];
      if (!items || !items.length) continue; // leere Abschnitte weglassen
      hadContent = true;
      content.push({ text: sec + ". " + SECTION_TITLES[sec], style: "section" });
      var rows = items.map(function (it) {
        var valueCell;
        if (it.listItems && it.listItems.length) {
          valueCell = { ul: it.listItems, style: "value" };
        } else {
          valueCell = { text: it.lesbar, style: "value" };
        }
        return [{ text: it.label, style: "label" }, valueCell];
      });
      content.push({
        table: { widths: ["35%", "65%"], body: rows, dontBreakRows: true },
        layout: {
          hLineWidth: function () { return 0.5; },
          vLineWidth: function () { return 0; },
          hLineColor: function () { return "#cccccc"; },
          paddingTop: function () { return 4; },
          paddingBottom: function () { return 4; },
          paddingLeft: function () { return 0; },
          paddingRight: function () { return 6; }
        },
        margin: [0, 0, 0, 14]
      });
    }

    if (!hadContent) {
      content.push({ text: "Es wurden keine Angaben gemacht.", style: "value" });
    }

    return {
      info: { title: "Stammdatenblatt und Wünsche des Kunden — Sozialhummel gGmbH" },
      pageSize: "A4",
      pageMargins: [40, 90, 40, 96],
      header: function () { return pageHeader(); },
      footer: function (currentPage, pageCount) { return pageFooter(currentPage, pageCount); },
      content: content,
      defaultStyle: { font: "Roboto", fontSize: 11, color: "#14171a", lineHeight: 1.15 },
      styles: {
        title: { fontSize: 18, bold: true, color: "#14171a", margin: [0, 0, 0, 2] },
        meta: { fontSize: 9, color: "#4a5158" },
        section: { fontSize: 13, bold: true, color: "#0b5d3b", margin: [0, 8, 0, 6] },
        label: { bold: true, fontSize: 10 },
        value: { fontSize: 11 }
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
      formular: "Sozialhummel — Stammdatenblatt und Wünsche des Kunden",
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

  // Logo möglichst früh vorladen, damit es beim Download bereitsteht.
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", preloadLogo);
    } else {
      preloadLogo();
    }
  }

  window.SozialhummelPDF = {
    generatePDF: generatePDF, generateJSON: generateJSON,
    _buildJSON: buildJSON, _buildDoc: buildDocDefinition
  };
})();
