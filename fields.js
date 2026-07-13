/*
 * fields.js — Feld-Registry (einzige Wahrheitsquelle)
 * ===================================================
 *
 * Diese Datei beschreibt JEDES Feld des Formulars an genau einer Stelle.
 * Das Frontend (form.js), die PDF-/JSON-Erzeugung (pdf.js) und das Prüfskript
 * (check-fields.js) lesen ausschliesslich aus dieser Registry.
 *
 * REGELN (siehe PROJEKT-ANWEISUNGEN.md):
 *   - Additiv arbeiten. Felder werden NIE gelöscht, nur `status: "deprecated"` gesetzt.
 *   - KEIN Feld ohne Hilfetext (`help`).
 *   - `sensitive: true` (Gesundheit/psychische Daten) => das Feld ist freiwillig
 *     und darf NICHT `required` sein.
 *   - `audience: "intern"` => Registry-Eintrag ja, im Kundenformular NICHT anzeigen.
 *
 * Feld-Eigenschaften:
 *   id         (String)  eindeutig, unveränderlich
 *   section    (1..8)    Abschnitt im Formular
 *   audience   ("kunde"|"intern")
 *   type       ("text"|"textarea"|"date"|"tel"|"email"|"number"|
 *               "select"|"radio"|"checkbox"|"checkboxgroup"|"multiselect")
 *               multiselect = Mehrfachauswahl per Checkbox; Wert ist ein Array
 *               von values (wie checkboxgroup).
 *   label      (String)  sichtbare Beschriftung
 *   help       (String)  Hilfetext in einfacher Sprache — PFLICHT
 *   required   (Bool)    optional, Standard false. Nur `name` ist true.
 *   sensitive  (Bool)    optional, Standard false.
 *   options    (Array)   nur bei select/radio/checkboxgroup/multiselect: [{value,label}]
 *   showIf     (Object)  optional: { field: "<id>", value: <wert> }
 *   placeholder(String)  optional
 *   status     (String)  optional: "active" (Standard) oder "deprecated".
 *                        Ausgemusterte Felder bleiben erhalten, werden aber im
 *                        Formular und in PDF/JSON übersprungen.
 *   note       (String)  optional, interne Notiz (z.B. Quelle/„gegen PDF prüfen")
 *   version    (Number)  optional, Änderungsstand des einzelnen Feldes (Start 1)
 *   changed    (String)  optional, Datum der letzten Änderung (YYYY-MM-DD)
 */

(function (root, factory) {
  var FIELDS = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = FIELDS;            // Node (check-fields.js)
  } else {
    root.FIELDS = FIELDS;               // Browser (window.FIELDS)
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // Wiederkehrende Optionslisten
  var JA_NEIN = [
    { value: "ja", label: "Ja" },
    { value: "nein", label: "Nein" }
  ];
  var JA_NEIN_EGAL = [
    { value: "egal", label: "Ist mir egal" },
    { value: "ja", label: "Ja" },
    { value: "nein", label: "Nein" }
  ];
  // Wohnformen (Vorlage Stammdatenblatt S. 3) — für „derzeit" und „gewünscht"
  var WOHNFORMEN = [
    { value: "wohnung", label: "Wohnung" },
    { value: "haus", label: "Haus" },
    { value: "betreutes_wohnen", label: "Betreutes Wohnen" },
    { value: "barrierefrei", label: "Alten-/ behindertengerechtes Wohnen" },
    { value: "pflegeheim", label: "Senioren-/ Pflegeheim" }
  ];

  var FIELDS = [

    /* ============================================================
     * ABSCHNITT 1 — Zur Person
     * ============================================================ */
    {
      id: "name", section: 1, audience: "kunde", type: "text",
      label: "Name und Vorname",
      help: "Bitte tragen Sie Ihren Vor- und Nachnamen ein. Das ist die einzige Angabe, die wir brauchen. Alles andere ist freiwillig.",
      required: true
    },
    {
      id: "geburtsdatum", section: 1, audience: "kunde", type: "date",
      label: "Geburtsdatum",
      help: "Wann sind Sie geboren? Diese Angabe ist freiwillig."
    },
    {
      id: "geschlecht", section: 1, audience: "kunde", type: "select",
      label: "Geschlecht",
      help: "Ihr Geschlecht. Diese Angabe ist freiwillig. Gemeint ist Ihr eigenes Geschlecht — nicht, welche Assistenzkraft Sie sich wünschen. Das fragen wir später.",
      options: [
        { value: "weiblich", label: "weiblich" },
        { value: "maennlich", label: "männlich" },
        { value: "divers", label: "divers" },
        { value: "keine_angabe", label: "keine Angabe" }
      ]
    },
    {
      id: "adresse_strasse", section: 1, audience: "kunde", type: "text",
      label: "Straße und Hausnummer",
      help: "Ihre Anschrift. Freiwillig."
    },
    {
      id: "adresse_plz", section: 1, audience: "kunde", type: "text",
      label: "Postleitzahl",
      help: "Die Postleitzahl Ihres Wohnorts. Freiwillig."
    },
    {
      id: "adresse_ort", section: 1, audience: "kunde", type: "text",
      label: "Ort",
      help: "Ihr Wohnort. Freiwillig."
    },
    {
      id: "telefon", section: 1, audience: "kunde", type: "tel",
      label: "Telefon",
      help: "Unter welcher Nummer können wir Sie erreichen? Freiwillig."
    },
    {
      id: "email", section: 1, audience: "kunde", type: "email",
      label: "E-Mail",
      help: "Ihre E-Mail-Adresse, falls Sie eine haben. Freiwillig."
    },

    /* ============================================================
     * ABSCHNITT 2 — Gesundheit und Diagnosen
     * ============================================================ */
    {
      id: "hauptdiagnose", section: 2, audience: "kunde", type: "textarea",
      label: "Hauptdiagnose",
      help: "Ihre wichtigste Diagnose, wenn Sie sie nennen möchten. Das ist eine Gesundheitsangabe und freiwillig. Sie dürfen dieses Feld überspringen und alles im Gespräch klären.",
      sensitive: true
    },
    {
      id: "nebendiagnosen", section: 2, audience: "kunde", type: "textarea",
      label: "Nebendiagnosen / weitere Erkrankungen",
      help: "Weitere Erkrankungen, die für die Unterstützung wichtig sind. Gesundheitsangabe, freiwillig. Sie können das auch später besprechen.",
      sensitive: true
    },
    {
      id: "groesse", section: 2, audience: "kunde", type: "text",
      label: "Körpergröße",
      help: "Ihre Größe, zum Beispiel in Zentimetern. Freiwillig. Hilft bei der Planung von Hilfsmitteln.",
      sensitive: true, placeholder: "z. B. 172 cm"
    },
    {
      id: "gewicht", section: 2, audience: "kunde", type: "text",
      label: "Körpergewicht",
      help: "Ihr Gewicht, zum Beispiel in Kilogramm. Freiwillig. Hilft, wenn beim Umsetzen (Transfer) geholfen werden muss.",
      sensitive: true, placeholder: "z. B. 68 kg"
    },
    {
      id: "rauchen_kunde", section: 2, audience: "kunde", type: "multiselect",
      label: "Rauchen — was trifft auf Sie zu?",
      help: "Gemeint sind Sie selbst, nicht die Assistenzkraft. Sie können mehrere Punkte ankreuzen. Wenn Sie nichts ankreuzen, gehen wir davon aus, dass Sie nicht rauchen. Freiwillig.",
      sensitive: true,
      options: [
        { value: "raucher", label: "Raucher*in" },
        { value: "raucherhaushalt", label: "Raucherhaushalt" },
        { value: "nur_draussen", label: "nur draußen" }
      ],
      version: 2, changed: "2026-07-13"
    },
    {
      id: "sprache_kunde", section: 2, audience: "kunde", type: "text",
      label: "Muttersprache / Sprache im Alltag",
      help: "Ausgemustert (deprecated): aufgeteilt in die Felder muttersprache (Freitext) und sprache_hilfen (Auswahl). Bleibt für alte Daten erhalten.",
      status: "deprecated", version: 2, changed: "2026-07-13"
    },
    {
      id: "muttersprache", section: 2, audience: "kunde", type: "text",
      label: "Muttersprache / Sprache im Alltag",
      help: "Welche Sprache sprechen Sie am liebsten? Gemeint sind Sie selbst, nicht die Assistenzkraft. Freiwillig.",
      version: 1, changed: "2026-07-13"
    },
    {
      id: "sprache_hilfen", section: 2, audience: "kunde", type: "multiselect",
      label: "Brauchen Sie Hilfe bei der Verständigung?",
      help: "Wählen Sie aus, was auf Sie zutrifft. Sie können auch mehrere Punkte ankreuzen. Wenn nichts zutrifft, lassen Sie es leer. Freiwillig.",
      options: [
        { value: "uebersetzer", label: "Übersetzer/in notwendig" },
        { value: "verstehen", label: "verstehen" },
        { value: "verstaendliches_sprechen", label: "verständliches Sprechen" },
        { value: "talker", label: "über Talker" }
      ],
      version: 1, changed: "2026-07-13"
    },
    {
      id: "psychische_belastungen", section: 2, audience: "kunde", type: "multiselect",
      label: "Psychische Belastungen",
      help: "Damit unsere Assistenz sich gut auf Sie einstellen kann: Ist etwas davon bei Ihnen bekannt? Sie können mehrere Punkte ankreuzen. Das ist eine sehr persönliche Angabe und ganz freiwillig — Sie können es leer lassen und lieber im Gespräch darüber reden.",
      sensitive: true,
      options: [
        { value: "psych_stoerung", label: "psychische Störung, z. B. Depressionen" },
        { value: "aengste", label: "Ängste, Panikattacken" },
        { value: "suchtverhalten", label: "Suchtverhalten" },
        { value: "impulskontrolle", label: "Störung der Impulskontrolle" }
      ],
      version: 2, changed: "2026-07-13"
    },
    {
      id: "psychische_belastungen_eigene", section: 2, audience: "kunde", type: "textarea",
      label: "Psychische Belastungen — eigene Angaben",
      help: "Möchten Sie dazu noch etwas in eigenen Worten schreiben? Ganz freiwillig. Sie können das Feld auch leer lassen und im Gespräch darüber reden.",
      sensitive: true,
      version: 1, changed: "2026-07-13"
    },

    /* ============================================================
     * ABSCHNITT 3 — Versicherung und Leistungen
     * ============================================================ */
    {
      id: "krankenversicherung", section: 3, audience: "kunde", type: "text",
      label: "Krankenversicherung",
      help: "Der Name Ihrer Krankenkasse, zum Beispiel AOK oder Techniker. Freiwillig."
    },
    {
      id: "kv_nummer", section: 3, audience: "kunde", type: "text",
      label: "Versichertennummer",
      help: "Die Nummer auf Ihrer Versichertenkarte. Freiwillig."
    },
    {
      id: "kostentraeger", section: 3, audience: "kunde", type: "text",
      label: "Kostenträger",
      help: "Wer bezahlt die Leistungen? Zum Beispiel Pflegekasse, Sozialamt oder Krankenkasse. Freiwillig."
    },
    {
      id: "aktenzeichen", section: 3, audience: "kunde", type: "text",
      label: "Aktenzeichen",
      help: "Falls Sie ein Aktenzeichen von Amt oder Kasse haben, tragen Sie es hier ein. Freiwillig."
    },
    {
      id: "pflegegrad_aktuell", section: 3, audience: "kunde", type: "select",
      label: "Derzeitiger Pflegegrad",
      help: "Welchen Pflegegrad haben Sie zurzeit? Wenn Sie keinen haben, wählen Sie kein Pflegegrad. Freiwillig.",
      sensitive: true,
      options: [
        { value: "kein", label: "kein Pflegegrad" },
        { value: "1", label: "Pflegegrad 1" },
        { value: "2", label: "Pflegegrad 2" },
        { value: "3", label: "Pflegegrad 3" },
        { value: "4", label: "Pflegegrad 4" },
        { value: "5", label: "Pflegegrad 5" }
      ]
    },
    {
      id: "pflegegrad_gewuenscht", section: 3, audience: "kunde", type: "select",
      label: "Gewünschter / beantragter Pflegegrad",
      help: "Möchten Sie einen höheren Pflegegrad beantragen? Wenn ja, welchen? Freiwillig.",
      sensitive: true,
      options: [
        { value: "kein", label: "kein Pflegegrad" },
        { value: "1", label: "Pflegegrad 1" },
        { value: "2", label: "Pflegegrad 2" },
        { value: "3", label: "Pflegegrad 3" },
        { value: "4", label: "Pflegegrad 4" },
        { value: "5", label: "Pflegegrad 5" }
      ],
      version: 2, changed: "2026-07-13"
    },
    {
      id: "pflegeleistungen", section: 3, audience: "kunde", type: "multiselect",
      label: "Pflegeleistungen, die Sie schon bekommen",
      help: "Welche Leistungen bekommen Sie heute schon? Sie können mehrere Punkte ankreuzen. Freiwillig.",
      sensitive: true,
      options: [
        { value: "keine", label: "keine" },
        { value: "pflegegeld", label: "Pflegegeld" },
        { value: "pflegesachleistungen", label: "Pflegesachleistungen" },
        { value: "kombileistungen", label: "Kombileistungen" },
        { value: "persoenliches_budget", label: "Persönliches Budget" }
      ],
      version: 2, changed: "2026-07-13"
    },
    {
      id: "gdb", section: 3, audience: "kunde", type: "text",
      label: "Grad der Behinderung (GdB)",
      help: "Steht in Ihrem Schwerbehindertenausweis, zum Beispiel 50 oder 100. Freiwillig.",
      sensitive: true, placeholder: "z. B. 50"
    },
    {
      id: "gleichstellung", section: 3, audience: "kunde", type: "select",
      label: "Gleichstellung",
      help: "Sind Sie einem schwerbehinderten Menschen gleichgestellt? Wenn Sie es nicht wissen, lassen Sie das Feld leer. Freiwillig.",
      options: JA_NEIN
    },
    {
      id: "merkzeichen", section: 3, audience: "kunde", type: "checkboxgroup",
      label: "Merkzeichen",
      help: "Merkzeichen stehen in Ihrem Ausweis. Wählen Sie alle, die zutreffen. Wenn Sie keine haben, lassen Sie es leer. Freiwillig.",
      sensitive: true,
      options: [
        { value: "G", label: "G (gehbehindert)" },
        { value: "aG", label: "aG (außergewöhnlich gehbehindert)" },
        { value: "B", label: "B (Begleitung nötig)" },
        { value: "H", label: "H (hilflos)" },
        { value: "Bl", label: "Bl (blind)" },
        { value: "Gl", label: "Gl (gehörlos)" },
        { value: "RF", label: "RF (Rundfunkbeitrag)" },
        { value: "TBl", label: "TBl (taubblind)" }
      ]
    },

    /* ============================================================
     * ABSCHNITT 4 — Wohnen und Umfeld
     * ============================================================ */
    {
      id: "wohnsituation_aktuell", section: 4, audience: "kunde", type: "select",
      label: "Wie wohnen Sie zurzeit?",
      help: "Wählen Sie die Wohnform, die zurzeit auf Sie zutrifft. Freiwillig.",
      options: WOHNFORMEN,
      version: 2, changed: "2026-07-13"
    },
    {
      id: "wohnsituation_gewuenscht", section: 4, audience: "kunde", type: "select",
      label: "Wie möchten Sie gerne wohnen?",
      help: "Wählen Sie die Wohnform, die Sie sich wünschen. Freiwillig.",
      options: WOHNFORMEN,
      version: 2, changed: "2026-07-13"
    },
    {
      id: "etage", section: 4, audience: "kunde", type: "text",
      label: "In welcher Etage wohnen Sie?",
      help: "Zum Beispiel Erdgeschoss oder 2. Stock. Freiwillig.",
      placeholder: "z. B. 2. Stock"
    },
    {
      id: "aufzug", section: 4, audience: "kunde", type: "select",
      label: "Gibt es einen Aufzug?",
      help: "Können Sie mit einem Aufzug in Ihre Wohnung kommen? Freiwillig.",
      options: JA_NEIN
    },
    {
      id: "lebenssituation", section: 4, audience: "kunde", type: "multiselect",
      label: "Mit wem leben Sie zusammen?",
      help: "Wählen Sie aus, was auf Sie zutrifft. Sie können mehrere Punkte ankreuzen. Freiwillig.",
      options: [
        { value: "alleinlebend", label: "alleinlebend" },
        { value: "partnerschaft", label: "Partnerschaft" },
        { value: "angehoerige", label: "Angehörige" },
        { value: "wohngemeinschaft", label: "Wohngemeinschaft" }
      ],
      version: 2, changed: "2026-07-13"
    },
    {
      id: "familienstand", section: 4, audience: "kunde", type: "select",
      label: "Familienstand",
      help: "Wählen Sie Ihren Familienstand. Freiwillig.",
      options: [
        { value: "ledig", label: "ledig" },
        { value: "verheiratet", label: "verheiratet" },
        { value: "verwitwet", label: "verwitwet" },
        { value: "geschieden", label: "geschieden" },
        { value: "getrennt_lebend", label: "getrennt lebend" },
        { value: "verpartnert", label: "verpartnert" }
      ],
      version: 2, changed: "2026-07-13"
    },
    {
      id: "oepnv", section: 4, audience: "kunde", type: "multiselect",
      label: "Anbindung an Bus und Bahn",
      help: "Womit sind Sie an den öffentlichen Nahverkehr angebunden? Sie können mehrere Punkte ankreuzen. Freiwillig.",
      options: [
        { value: "bus", label: "Bus" },
        { value: "bahn", label: "Bahn" },
        { value: "nein", label: "nein" }
      ],
      version: 2, changed: "2026-07-13"
    },
    {
      id: "rueckzugsraum", section: 4, audience: "kunde", type: "select",
      label: "Gibt es einen Rückzugsraum für die Assistenzkraft?",
      help: "Hat die Assistenzkraft bei Ihnen einen Raum für Pausen? Freiwillig.",
      options: JA_NEIN
    },
    {
      id: "haustiere", section: 4, audience: "kunde", type: "text",
      label: "Haustiere",
      help: "Leben Tiere bei Ihnen? Zum Beispiel ein Hund oder eine Katze. Das ist wichtig für Menschen mit Tierhaar-Allergie. Freiwillig."
    },

    /* ============================================================
     * ABSCHNITT 5 — Kontaktpersonen
     * Jeder Block hat einen Schalter. Erst wenn er an ist, erscheinen die Felder.
     * ============================================================ */
    {
      id: "angehoerige_vorhanden", section: 5, audience: "kunde", type: "checkbox",
      label: "Ich möchte Angehörige angeben",
      help: "Setzen Sie den Haken, wenn Sie eine Person aus der Familie nennen möchten. Wenn nicht, lassen Sie ihn weg — dann bleibt der Block leer."
    },
    {
      id: "angehoerige_name", section: 5, audience: "kunde", type: "text",
      label: "Angehörige: Name",
      help: "Name der Person aus der Familie. Freiwillig.",
      showIf: { field: "angehoerige_vorhanden", value: true }
    },
    {
      id: "angehoerige_verhaeltnis", section: 5, audience: "kunde", type: "text",
      label: "Angehörige: Verhältnis zu Ihnen",
      help: "Zum Beispiel Tochter, Sohn, Ehefrau. Freiwillig.",
      showIf: { field: "angehoerige_vorhanden", value: true }
    },
    {
      id: "angehoerige_telefon", section: 5, audience: "kunde", type: "tel",
      label: "Angehörige: Telefon",
      help: "Telefonnummer der Person. Freiwillig.",
      showIf: { field: "angehoerige_vorhanden", value: true }
    },

    {
      id: "betreuungsperson_vorhanden", section: 5, audience: "kunde", type: "checkbox",
      label: "Es gibt eine weitere Betreuungsperson",
      help: "Setzen Sie den Haken, wenn Ihnen noch jemand anderes hilft — außer der Familie und einem gesetzlichen Betreuer."
    },
    {
      id: "betreuungsperson_name", section: 5, audience: "kunde", type: "text",
      label: "Betreuungsperson: Name",
      help: "Name dieser Person. Freiwillig.",
      showIf: { field: "betreuungsperson_vorhanden", value: true }
    },
    {
      id: "betreuungsperson_telefon", section: 5, audience: "kunde", type: "tel",
      label: "Betreuungsperson: Telefon",
      help: "Telefonnummer dieser Person. Freiwillig.",
      showIf: { field: "betreuungsperson_vorhanden", value: true }
    },

    {
      id: "betreuer_vorhanden", section: 5, audience: "kunde", type: "checkbox",
      label: "Ich habe einen gesetzlichen Betreuer",
      help: "Setzen Sie den Haken, wenn ein Gericht eine rechtliche Betreuung für Sie angeordnet hat."
    },
    {
      id: "betreuer_name", section: 5, audience: "kunde", type: "text",
      label: "Gesetzlicher Betreuer: Name",
      help: "Name Ihrer gesetzlichen Betreuerin oder Ihres Betreuers. Freiwillig.",
      showIf: { field: "betreuer_vorhanden", value: true }
    },
    {
      id: "betreuer_telefon", section: 5, audience: "kunde", type: "tel",
      label: "Gesetzlicher Betreuer: Telefon",
      help: "Telefonnummer. Freiwillig.",
      showIf: { field: "betreuer_vorhanden", value: true }
    },
    {
      id: "betreuer_bereiche", section: 5, audience: "kunde", type: "checkboxgroup",
      label: "Wofür ist der Betreuer zuständig?",
      help: "Wählen Sie die Bereiche, für die Ihr Betreuer zuständig ist. Steht im Betreuerausweis. Freiwillig.",
      showIf: { field: "betreuer_vorhanden", value: true },
      options: [
        { value: "gesundheit", label: "Gesundheitssorge" },
        { value: "aufenthalt", label: "Aufenthaltsbestimmung" },
        { value: "vermoegen", label: "Vermögenssorge" },
        { value: "behoerden", label: "Behörden und Ämter" },
        { value: "wohnung", label: "Wohnungsangelegenheiten" }
      ]
    },

    {
      id: "hausarzt_vorhanden", section: 5, audience: "kunde", type: "checkbox",
      label: "Ich möchte meinen Hausarzt angeben",
      help: "Setzen Sie den Haken, wenn Sie Ihre Hausärztin oder Ihren Hausarzt nennen möchten."
    },
    {
      id: "hausarzt_name", section: 5, audience: "kunde", type: "text",
      label: "Hausarzt: Name",
      help: "Name der Praxis oder der Ärztin / des Arztes. Freiwillig.",
      showIf: { field: "hausarzt_vorhanden", value: true }
    },
    {
      id: "hausarzt_telefon", section: 5, audience: "kunde", type: "tel",
      label: "Hausarzt: Telefon",
      help: "Telefonnummer der Praxis. Freiwillig.",
      showIf: { field: "hausarzt_vorhanden", value: true }
    },

    {
      id: "fachaerzte_vorhanden", section: 5, audience: "kunde", type: "checkbox",
      label: "Ich möchte Fachärzte angeben",
      help: "Setzen Sie den Haken, wenn Sie Fachärztinnen oder Fachärzte nennen möchten."
    },
    {
      id: "fachaerzte_liste", section: 5, audience: "kunde", type: "textarea",
      label: "Fachärzte",
      help: "Welche Fachärzte behandeln Sie? Zum Beispiel Neurologie oder Orthopädie. Gern mit Namen und Telefon. Freiwillig.",
      showIf: { field: "fachaerzte_vorhanden", value: true }
    },

    {
      id: "pflegedienst_vorhanden", section: 5, audience: "kunde", type: "checkbox",
      label: "Ein Pflegedienst hilft mir",
      help: "Setzen Sie den Haken, wenn ein Pflegedienst zu Ihnen kommt."
    },
    {
      id: "pflegedienst_name", section: 5, audience: "kunde", type: "text",
      label: "Pflegedienst: Name",
      help: "Name des Pflegedienstes. Freiwillig.",
      showIf: { field: "pflegedienst_vorhanden", value: true }
    },
    {
      id: "pflegedienst_telefon", section: 5, audience: "kunde", type: "tel",
      label: "Pflegedienst: Telefon",
      help: "Telefonnummer des Pflegedienstes. Freiwillig.",
      showIf: { field: "pflegedienst_vorhanden", value: true }
    },

    {
      id: "sonstige_dienste_vorhanden", section: 5, audience: "kunde", type: "checkbox",
      label: "Es gibt weitere Dienste oder Helfer",
      help: "Setzen Sie den Haken, wenn Ihnen noch andere Dienste helfen. Zum Beispiel Essen auf Rädern oder ein Fahrdienst."
    },
    {
      id: "sonstige_dienste_beschreibung", section: 5, audience: "kunde", type: "textarea",
      label: "Weitere Dienste",
      help: "Welche Dienste sind das und wie erreicht man sie? Freiwillig.",
      showIf: { field: "sonstige_dienste_vorhanden", value: true }
    },

    /* ============================================================
     * ABSCHNITT 6 — Unterstützungsbedarf
     * Grundpflege + Behandlungspflege. Jede Position hat einen Schalter
     * „weitgehend selbstständig". Ist er an, wird das Textfeld ausgeblendet.
     * Alle Angaben hier sind Gesundheitsangaben => sensitive, freiwillig.
     * ============================================================ */

    /* --- Grundpflege --- */
    {
      id: "positionswechsel_selbststaendig", section: 6, audience: "kunde", type: "checkbox",
      label: "Positionswechsel: Ich komme weitgehend allein zurecht",
      help: "Zum Beispiel im Bett die Lage wechseln. Haken setzen, wenn Sie das selbst schaffen."
    },
    {
      id: "positionswechsel", section: 6, audience: "kunde", type: "textarea",
      label: "Positionswechsel: Wobei brauchen Sie Hilfe?",
      help: "Beschreiben Sie, wobei Sie beim Lagewechsel Hilfe brauchen. Gesundheitsangabe, freiwillig — Sie können es auch im Gespräch klären.",
      sensitive: true,
      showIf: { field: "positionswechsel_selbststaendig", value: false }
    },
    {
      id: "transfer_hilfsmittel_selbststaendig", section: 6, audience: "kunde", type: "checkbox",
      label: "Transfer: Ich komme weitgehend allein zurecht",
      help: "Transfer heißt umsetzen, zum Beispiel vom Bett in den Rollstuhl. Haken setzen, wenn Sie das selbst schaffen."
    },
    {
      id: "transfer_hilfsmittel", section: 6, audience: "kunde", type: "textarea",
      label: "Transfer: Hilfe und Hilfsmittel",
      help: "Wobei brauchen Sie beim Umsetzen Hilfe? Welche Hilfsmittel nutzen Sie, zum Beispiel Lifter oder Rutschbrett? Gesundheitsangabe, freiwillig.",
      sensitive: true,
      showIf: { field: "transfer_hilfsmittel_selbststaendig", value: false }
    },
    {
      id: "fortbewegung_selbststaendig", section: 6, audience: "kunde", type: "checkbox",
      label: "Fortbewegung: Ich komme weitgehend allein zurecht",
      help: "Gehen oder Rollstuhl fahren in der Wohnung. Haken setzen, wenn Sie das selbst schaffen."
    },
    {
      id: "fortbewegung", section: 6, audience: "kunde", type: "textarea",
      label: "Fortbewegung: Wobei brauchen Sie Hilfe?",
      help: "Wobei brauchen Sie beim Gehen oder Fahren Hilfe? Gesundheitsangabe, freiwillig.",
      sensitive: true,
      showIf: { field: "fortbewegung_selbststaendig", value: false }
    },
    {
      id: "treppensteigen_selbststaendig", section: 6, audience: "kunde", type: "checkbox",
      label: "Treppensteigen: Ich komme weitgehend allein zurecht",
      help: "Haken setzen, wenn Sie Treppen allein schaffen."
    },
    {
      id: "treppensteigen", section: 6, audience: "kunde", type: "textarea",
      label: "Treppensteigen: Wobei brauchen Sie Hilfe?",
      help: "Wobei brauchen Sie auf Treppen Hilfe? Gesundheitsangabe, freiwillig.",
      sensitive: true,
      showIf: { field: "treppensteigen_selbststaendig", value: false }
    },
    {
      id: "koerperpflege_selbststaendig", section: 6, audience: "kunde", type: "checkbox",
      label: "Körperpflege: Ich komme weitgehend allein zurecht",
      help: "Waschen, Duschen, Zähneputzen, Anziehen. Haken setzen, wenn Sie das selbst schaffen."
    },
    {
      id: "koerperpflege", section: 6, audience: "kunde", type: "textarea",
      label: "Körperpflege: Wobei brauchen Sie Hilfe?",
      help: "Wobei brauchen Sie bei der Körperpflege Hilfe? Gesundheitsangabe, freiwillig.",
      sensitive: true,
      showIf: { field: "koerperpflege_selbststaendig", value: false }
    },
    {
      id: "ausscheidung_selbststaendig", section: 6, audience: "kunde", type: "checkbox",
      label: "Toilette / Ausscheidung: Ich komme weitgehend allein zurecht",
      help: "Toilettengang, Umgang mit Windeln oder Katheter. Haken setzen, wenn Sie das selbst schaffen."
    },
    {
      id: "ausscheidung", section: 6, audience: "kunde", type: "textarea",
      label: "Toilette / Ausscheidung: Wobei brauchen Sie Hilfe?",
      help: "Wobei brauchen Sie hier Hilfe? Das ist eine sehr persönliche Angabe und ganz freiwillig.",
      sensitive: true,
      showIf: { field: "ausscheidung_selbststaendig", value: false }
    },
    {
      id: "ernaehrung_selbststaendig", section: 6, audience: "kunde", type: "checkbox",
      label: "Essen und Trinken: Ich komme weitgehend allein zurecht",
      help: "Essen zubereiten und zu sich nehmen. Haken setzen, wenn Sie das selbst schaffen."
    },
    {
      id: "ernaehrung", section: 6, audience: "kunde", type: "textarea",
      label: "Essen und Trinken: Wobei brauchen Sie Hilfe?",
      help: "Wobei brauchen Sie beim Essen und Trinken Hilfe? Zum Beispiel Sonde oder besondere Kost. Gesundheitsangabe, freiwillig.",
      sensitive: true,
      showIf: { field: "ernaehrung_selbststaendig", value: false }
    },

    /* --- Behandlungspflege --- */
    {
      id: "medikamente_selbststaendig", section: 6, audience: "kunde", type: "checkbox",
      label: "Medikamente: Ich komme weitgehend allein zurecht",
      help: "Medikamente richten und einnehmen. Haken setzen, wenn Sie das selbst schaffen."
    },
    {
      id: "medikamente", section: 6, audience: "kunde", type: "textarea",
      label: "Medikamente: Wobei brauchen Sie Hilfe?",
      help: "Welche Hilfe brauchen Sie bei Medikamenten? Gibt es besondere Medikamente, zum Beispiel Spritzen? Gesundheitsangabe, freiwillig.",
      sensitive: true,
      showIf: { field: "medikamente_selbststaendig", value: false }
    },
    {
      id: "hilfsmittel_selbststaendig", section: 6, audience: "kunde", type: "checkbox",
      label: "Hilfsmittel: Ich komme weitgehend allein zurecht",
      help: "Umgang mit Hilfsmitteln wie Prothese oder Orthese. Haken setzen, wenn Sie das selbst schaffen."
    },
    {
      id: "hilfsmittel", section: 6, audience: "kunde", type: "textarea",
      label: "Hilfsmittel: Welche nutzen Sie und wobei brauchen Sie Hilfe?",
      help: "Welche Hilfsmittel nutzen Sie? Wobei brauchen Sie dabei Hilfe? Gesundheitsangabe, freiwillig.",
      sensitive: true,
      showIf: { field: "hilfsmittel_selbststaendig", value: false }
    },
    {
      id: "wundversorgung_selbststaendig", section: 6, audience: "kunde", type: "checkbox",
      label: "Wundversorgung: Ich komme weitgehend allein zurecht",
      help: "Versorgung von Wunden oder Druckstellen (Dekubitus). Haken setzen, wenn Sie das selbst schaffen."
    },
    {
      id: "wundversorgung", section: 6, audience: "kunde", type: "textarea",
      label: "Wundversorgung: Wobei brauchen Sie Hilfe?",
      help: "Haben Sie chronische Wunden oder Druckstellen, die versorgt werden müssen? Gesundheitsangabe, freiwillig.",
      sensitive: true,
      showIf: { field: "wundversorgung_selbststaendig", value: false }
    },
    {
      id: "beatmung_selbststaendig", section: 6, audience: "kunde", type: "checkbox",
      label: "Beatmung / Sauerstoff: Ich komme weitgehend allein zurecht",
      help: "Umgang mit Beatmung oder Sauerstoffgerät. Haken setzen, wenn Sie das selbst schaffen."
    },
    {
      id: "beatmung", section: 6, audience: "kunde", type: "textarea",
      label: "Beatmung / Sauerstoff: Wobei brauchen Sie Hilfe?",
      help: "Werden Sie beatmet oder brauchen Sie Sauerstoff? Welche Hilfe ist nötig? Gesundheitsangabe, freiwillig.",
      sensitive: true,
      showIf: { field: "beatmung_selbststaendig", value: false }
    },
    {
      id: "werte_kontrolle_selbststaendig", section: 6, audience: "kunde", type: "checkbox",
      label: "Werte kontrollieren: Ich komme weitgehend allein zurecht",
      help: "Zum Beispiel Blutzucker oder Blutdruck messen. Haken setzen, wenn Sie das selbst schaffen."
    },
    {
      id: "werte_kontrolle", section: 6, audience: "kunde", type: "textarea",
      label: "Werte kontrollieren: Wobei brauchen Sie Hilfe?",
      help: "Welche Werte müssen kontrolliert werden und wobei brauchen Sie Hilfe? Gesundheitsangabe, freiwillig.",
      sensitive: true,
      showIf: { field: "werte_kontrolle_selbststaendig", value: false }
    },
    {
      id: "einmalkatheter_selbststaendig", section: 6, audience: "kunde", type: "checkbox",
      label: "Einmalkatheter: Ich komme weitgehend allein zurecht",
      help: "Einmaliges Katheterisieren. Haken setzen, wenn Sie das selbst schaffen."
    },
    {
      id: "einmalkatheter", section: 6, audience: "kunde", type: "textarea",
      label: "Einmalkatheter: Wobei brauchen Sie Hilfe?",
      help: "Brauchen Sie Hilfe beim Katheterisieren? Das ist eine sehr persönliche Angabe und ganz freiwillig.",
      sensitive: true,
      showIf: { field: "einmalkatheter_selbststaendig", value: false }
    },

    /* ============================================================
     * ABSCHNITT 7 — Wünsche an die Assistenzkraft
     * Alle Anforderungen an die Assistenzkraft mit Präfix wunsch_assistenz_.
     * ============================================================ */
    {
      id: "wunsch_assistenz_geschlecht", section: 7, audience: "kunde", type: "select",
      label: "Gewünschtes Geschlecht der Assistenzkraft",
      help: "Wünschen Sie sich eine weibliche oder männliche Assistenzkraft? Gemeint ist die Assistenzkraft, nicht Sie selbst. Freiwillig.",
      options: [
        { value: "egal", label: "Ist mir egal" },
        { value: "weiblich", label: "weiblich" },
        { value: "maennlich", label: "männlich" }
      ]
    },
    {
      id: "wunsch_assistenz_rauchen", section: 7, audience: "kunde", type: "select",
      label: "Darf die Assistenzkraft rauchen?",
      help: "Ist es für Sie in Ordnung, wenn die Assistenzkraft raucht? Gemeint ist die Assistenzkraft, nicht Sie selbst. Freiwillig.",
      options: [
        { value: "egal", label: "Ist mir egal" },
        { value: "ja", label: "Ja, darf rauchen" },
        { value: "nein", label: "Nein, bitte nicht" }
      ]
    },
    {
      id: "wunsch_assistenz_deutsch", section: 7, audience: "kunde", type: "text",
      label: "Geforderte Deutschkenntnisse der Assistenzkraft",
      help: "Wie gut muss die Assistenzkraft Deutsch sprechen? Zum Beispiel: für einfache Gespräche reicht. Gemeint ist die Assistenzkraft. Freiwillig."
    },
    {
      id: "wunsch_assistenz_pflegeerfahrung", section: 7, audience: "kunde", type: "select",
      label: "Soll die Assistenzkraft Pflegeerfahrung haben?",
      help: "Wünschen Sie sich, dass die Assistenzkraft schon Erfahrung in der Pflege hat? Freiwillig.",
      options: JA_NEIN_EGAL
    },
    {
      id: "wunsch_assistenz_fuehrerschein", section: 7, audience: "kunde", type: "select",
      label: "Soll die Assistenzkraft einen Führerschein haben?",
      help: "Brauchen Sie eine Assistenzkraft, die Auto fahren kann? Freiwillig.",
      options: JA_NEIN_EGAL
    },
    {
      id: "wunsch_assistenz_tagesablauf", section: 7, audience: "kunde", type: "textarea",
      label: "Ihr Tagesablauf",
      help: "Wie sieht ein normaler Tag bei Ihnen aus? Wann brauchen Sie am meisten Unterstützung? Das hilft, die passende Assistenzkraft zu finden. Freiwillig."
    },
    {
      id: "wunsch_assistenz_freizeit", section: 7, audience: "kunde", type: "textarea",
      label: "Freizeit und gemeinsame Aktivitäten",
      help: "Was machen Sie gern in Ihrer Freizeit? Was möchten Sie gemeinsam mit der Assistenzkraft unternehmen? Freiwillig."
    },
    {
      id: "wunsch_assistenz_sonstiges", section: 7, audience: "kunde", type: "textarea",
      label: "Weitere Wünsche an die Assistenzkraft",
      help: "Ist Ihnen sonst noch etwas an der Assistenzkraft wichtig? Schreiben Sie es hier auf. Freiwillig."
    },

    /* ============================================================
     * ABSCHNITT 8 — Abschluss
     * Vorsorge-Dokumente, Ziele, Foto-Freigabe. Danach PDF/JSON.
     * ============================================================ */
    {
      id: "ziele_wo", section: 8, audience: "kunde", type: "textarea",
      label: "Wo liegen Ihre Ziele?",
      help: "Was ist Ihnen im Leben wichtig? Wo möchten Sie hin? Freiwillig."
    },
    {
      id: "ziele_veraenderung", section: 8, audience: "kunde", type: "textarea",
      label: "Was möchten Sie wie verändern?",
      help: "Gibt es etwas, das Sie in Ihrem Alltag verändern möchten? Wie soll die Unterstützung dabei helfen? Freiwillig."
    },
    {
      id: "patientenverfuegung", section: 8, audience: "kunde", type: "select",
      label: "Möchten Sie Unterstützung beim Erstellen einer Patientenverfügung?",
      help: "In einer Patientenverfügung legen Sie fest, welche Behandlung Sie möchten, wenn Sie selbst nicht mehr entscheiden können. Wir können Sie beim Erstellen unterstützen. Möchten Sie das? Freiwillig.",
      sensitive: true,
      options: JA_NEIN,
      version: 2, changed: "2026-07-13"
    },
    {
      id: "vorsorgevollmacht", section: 8, audience: "kunde", type: "select",
      label: "Möchten Sie Unterstützung beim Erstellen einer Vorsorgevollmacht?",
      help: "Mit einer Vorsorgevollmacht darf eine Person Ihres Vertrauens für Sie entscheiden. Wir können Sie beim Erstellen unterstützen. Möchten Sie das? Freiwillig.",
      options: JA_NEIN,
      version: 2, changed: "2026-07-13"
    },
    {
      id: "attest_krankenhaus", section: 8, audience: "kunde", type: "select",
      label: "Möchten Sie Unterstützung bei einem Attest zur Assistenz im Krankenhaus?",
      help: "Manche Menschen brauchen auch im Krankenhaus ihre Assistenz. Dafür hilft ein Attest. Möchten Sie, dass wir Sie dabei unterstützen? Freiwillig.",
      sensitive: true,
      options: JA_NEIN,
      version: 2, changed: "2026-07-13"
    },
    {
      id: "organisation_sonstiges", section: 8, audience: "kunde", type: "textarea",
      label: "Sonstiges (Organisation)",
      help: "Gibt es sonst etwas zur Organisation, bei dem wir Sie unterstützen sollen? Schreiben Sie es hier auf. Freiwillig.",
      version: 1, changed: "2026-07-13"
    },
    {
      id: "notfallplanung", section: 8, audience: "kunde", type: "textarea",
      label: "Notfallplanung",
      help: "Was ist im Notfall wichtig? Wen soll man anrufen? Worauf muss man achten? Freiwillig.",
      sensitive: true
    },
    {
      id: "foto_freigabe", section: 8, audience: "kunde", type: "select",
      label: "Dürfen wir für die Stellenanzeige ein Foto verwenden?",
      help: "Wenn wir eine Assistenzkraft für Sie suchen, hilft manchmal ein Foto in der Anzeige. Sie entscheiden, ob das für Sie in Ordnung ist. Sie geben hier kein Foto ab — nur Ihre Erlaubnis. Freiwillig.",
      options: JA_NEIN
    },

    /* ============================================================
     * INTERNE FELDER — audience: "intern"
     * Registry-Eintrag ja, im Kundenformular NICHT anzeigen, NICHT löschen.
     * (Tabelle „Antragstellung", Datenerfassung, interne Checkliste, BeWo Nr. 10)
     * ============================================================ */

    /* Tabelle „Antragstellung" */
    {
      id: "int_antrag_kostentraeger", section: 3, audience: "intern", type: "text",
      label: "Antragstellung: Kostenträger",
      help: "Intern: Kostenträger-Zeile aus der Antragstellungs-Tabelle. Wird im Kundenformular nicht angezeigt."
    },
    {
      id: "int_antrag_erwuenscht", section: 3, audience: "intern", type: "checkbox",
      label: "Antragstellung: Erwünscht?",
      help: "Intern: Spalte Erwünscht? der Antragstellungs-Tabelle."
    },
    {
      id: "int_antrag_erledigt", section: 3, audience: "intern", type: "checkbox",
      label: "Antragstellung: Erledigt?",
      help: "Intern: Spalte Erledigt? der Antragstellungs-Tabelle."
    },
    {
      id: "int_antrag_45_sgb_xi", section: 3, audience: "intern", type: "text",
      label: "Antragstellung: §45 SGB XI",
      help: "Intern: Zeile §45 SGB XI der Antragstellungs-Tabelle."
    },
    {
      id: "int_antrag_37_3_sgb_xi", section: 3, audience: "intern", type: "text",
      label: "Antragstellung: §37.3 SGB XI",
      help: "Intern: Zeile §37.3 SGB XI der Antragstellungs-Tabelle."
    },
    {
      id: "int_antrag_restpflegegeld", section: 3, audience: "intern", type: "text",
      label: "Antragstellung: Restpflegegeld",
      help: "Intern: Zeile Restpflegegeld der Antragstellungs-Tabelle."
    },

    /* Datenerfassung */
    {
      id: "int_datenerfassung_am", section: 1, audience: "intern", type: "date",
      label: "Datenerfassung am",
      help: "Intern: Datum der Datenerfassung durch die Sozialhummel."
    },
    {
      id: "int_datenerfassung_durch", section: 1, audience: "intern", type: "text",
      label: "Datenerfassung durch",
      help: "Intern: Wer die Daten erfasst hat."
    },

    /* Interne Checkliste */
    {
      id: "int_wuensche_ausgefuellt", section: 8, audience: "intern", type: "checkbox",
      label: "Wünsche des Kunden ausgefüllt?",
      help: "Intern: Checkliste — wurde der Wünsche-Bogen ausgefüllt?"
    },
    {
      id: "int_vertrag_ausgehaendigt", section: 8, audience: "intern", type: "checkbox",
      label: "Vertrag ausgehändigt?",
      help: "Intern: Checkliste — wurde der Vertrag ausgehändigt?"
    },
    {
      id: "int_flyer_ausgehaendigt", section: 8, audience: "intern", type: "checkbox",
      label: "Flyer ausgehändigt?",
      help: "Intern: Checkliste — wurde der Flyer ausgehändigt?"
    },
    {
      id: "int_wichtig_nicht_gefragt", section: 8, audience: "intern", type: "textarea",
      label: "Was ist wichtig, was ich nicht gefragt habe?",
      help: "Intern: Notizfeld der beratenden Person."
    },

    /* BeWo-Block Nr. 10 (ohne die Zielfragen — die sind beim Kunden: ziele_wo, ziele_veraenderung) */
    {
      id: "int_bewo_leistungsart", section: 4, audience: "intern", type: "text",
      label: "BeWo: Leistungsart",
      help: "Intern: Platzhalter aus der ersten Fassung. Ausgemustert (deprecated): kommt im echten BeWo-Block der Vorlage (Nr. 10) nicht vor und wird durch die echten BeWo-Felder ersetzt. Nicht im Kundenformular.",
      status: "deprecated", version: 2, changed: "2026-07-13"
    },
    {
      id: "int_bewo_kostentraeger", section: 4, audience: "intern", type: "text",
      label: "BeWo: Kostenträger",
      help: "Intern: Platzhalter aus der ersten Fassung. Ausgemustert (deprecated): kommt im echten BeWo-Block der Vorlage (Nr. 10) nicht vor und wird durch die echten BeWo-Felder ersetzt. Nicht im Kundenformular.",
      status: "deprecated", version: 2, changed: "2026-07-13"
    },
    {
      id: "int_bewo_umfang", section: 4, audience: "intern", type: "text",
      label: "BeWo: Umfang / Fachleistungsstunden",
      help: "Intern: Platzhalter aus der ersten Fassung. Ausgemustert (deprecated): kommt im echten BeWo-Block der Vorlage (Nr. 10) nicht vor und wird durch die echten BeWo-Felder ersetzt. Nicht im Kundenformular.",
      status: "deprecated", version: 2, changed: "2026-07-13"
    },
    {
      id: "int_bewo_sonstiges", section: 4, audience: "intern", type: "textarea",
      label: "BeWo: Sonstiges",
      help: "Intern: weitere Angaben aus dem BeWo-Block (Nr. 10). Genaue Felder gegen die PDF-Vorlage prüfen.",
      note: "Gegen Stammdatenblatt-PDF (Nr. 10) prüfen, sobald die Vorlage vorliegt."
    }
  ];

  return FIELDS;
});
