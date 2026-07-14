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
 *                        oder { field: "<id>", valueIn: [<werte>] } — sichtbar,
 *                        wenn der (auch Mehrfach-)Wert einen der Werte enthält.
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
      id: "oepnv_linie", section: 4, audience: "kunde", type: "text",
      label: "Linie",
      help: "Welche Bus- oder Bahnlinie hält in Ihrer Nähe? Freiwillig.",
      showIf: { field: "oepnv", valueIn: ["bus", "bahn"] },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "oepnv_haltestelle", section: 4, audience: "kunde", type: "text",
      label: "Name der Haltestelle",
      help: "Wie heißt die nächste Haltestelle? Freiwillig.",
      showIf: { field: "oepnv", valueIn: ["bus", "bahn"] },
      version: 1, changed: "2026-07-13"
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
      id: "angehoerige_adresse", section: 5, audience: "kunde", type: "text",
      label: "Angehörige: Adresse (falls abweichend)",
      help: "Nur ausfüllen, wenn die Person woanders wohnt als Sie. Freiwillig.",
      showIf: { field: "angehoerige_vorhanden", value: true },
      version: 1, changed: "2026-07-13"
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
      id: "betreuungsperson_verhaeltnis", section: 5, audience: "kunde", type: "text",
      label: "Betreuungsperson: Verhältnis zu Ihnen",
      help: "In welchem Verhältnis steht die Person zu Ihnen? Zum Beispiel Nachbarin, Freund, Betreuer. Freiwillig.",
      showIf: { field: "betreuungsperson_vorhanden", value: true },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "betreuungsperson_adresse", section: 5, audience: "kunde", type: "text",
      label: "Betreuungsperson: Adresse (falls abweichend)",
      help: "Nur ausfüllen, wenn die Person woanders wohnt als Sie. Freiwillig.",
      showIf: { field: "betreuungsperson_vorhanden", value: true },
      version: 1, changed: "2026-07-13"
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
      id: "betreuer_adresse", section: 5, audience: "kunde", type: "text",
      label: "Gesetzlicher Betreuer: Adresse (falls abweichend)",
      help: "Nur ausfüllen, wenn die Betreuung woanders zu erreichen ist als Sie selbst. Freiwillig.",
      showIf: { field: "betreuer_vorhanden", value: true },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "betreuer_nachweis", section: 5, audience: "kunde", type: "select",
      label: "Nachweis der Betreuung / Bevollmächtigung",
      help: "Gibt es einen Nachweis über die Betreuung, zum Beispiel einen Betreuerausweis? Freiwillig.",
      showIf: { field: "betreuer_vorhanden", value: true },
      options: [
        { value: "liegt_vor", label: "liegt vor" },
        { value: "liegt_nicht_vor", label: "liegt nicht vor" }
      ],
      version: 1, changed: "2026-07-13"
    },
    {
      id: "betreuer_bereiche", section: 5, audience: "kunde", type: "checkboxgroup",
      label: "Wofür ist der Betreuer zuständig?",
      help: "Kreuzen Sie nur die Bereiche an, die im Betreuerausweis stehen. Sie können mehrere ankreuzen. Freiwillig.",
      showIf: { field: "betreuer_vorhanden", value: true },
      options: [
        { value: "gesundheit", label: "Gesundheitssorge" },
        { value: "aufenthalt", label: "Aufenthaltsbestimmung" },
        { value: "behoerden", label: "Vertretung bei Behörden" },
        { value: "vermoegen", label: "Vermögensvorsorge" },
        { value: "post_fernmelde", label: "Post- und Fernmeldeverkehr" }
      ],
      version: 2, changed: "2026-07-13"
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
      id: "hausarzt_adresse", section: 5, audience: "kunde", type: "text",
      label: "Hausarzt: Adresse",
      help: "Wo ist die Praxis? Freiwillig.",
      showIf: { field: "hausarzt_vorhanden", value: true },
      version: 1, changed: "2026-07-13"
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
      id: "pflegedienst_ansprechpartner", section: 5, audience: "kunde", type: "text",
      label: "Pflegedienst: Ansprechpartner (Name, Vorname)",
      help: "Wen kann man beim Pflegedienst ansprechen? Freiwillig.",
      showIf: { field: "pflegedienst_vorhanden", value: true },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "pflegedienst_ansprechpartner_rolle", section: 5, audience: "kunde", type: "multiselect",
      label: "Pflegedienst: Rolle der Ansprechperson",
      help: "Ist die genannte Person Geschäftsführung oder Ansprechpartner? Sie können auch beides ankreuzen. Freiwillig.",
      showIf: { field: "pflegedienst_vorhanden", value: true },
      options: [
        { value: "geschaeftsfuehrer", label: "Geschäftsführer/in" },
        { value: "ansprechpartner", label: "Ansprechpartner/in" }
      ],
      version: 1, changed: "2026-07-13"
    },
    {
      id: "pflegedienst_adresse", section: 5, audience: "kunde", type: "text",
      label: "Pflegedienst: Adresse",
      help: "Wo sitzt der Pflegedienst? Freiwillig.",
      showIf: { field: "pflegedienst_vorhanden", value: true },
      version: 1, changed: "2026-07-13"
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
      help: "Ausgemustert (deprecated): ersetzt durch die Auswahlfelder zum Positionswechsel. Bleibt für alte Daten erhalten.",
      sensitive: true,
      showIf: { field: "positionswechsel_selbststaendig", value: false },
      status: "deprecated", version: 2, changed: "2026-07-13"
    },
    {
      id: "positionswechsel_optionen", section: 6, audience: "kunde", type: "multiselect",
      label: "Positionswechsel: Wobei brauchen Sie Hilfe?",
      help: "Wo brauchen Sie Hilfe beim Wechseln der Lage? Sie können mehrere Punkte ankreuzen. Alles freiwillig — Sie können es auch im Gespräch klären.",
      sensitive: true,
      options: [
        { value: "im_bett", label: "im Bett" },
        { value: "im_rollstuhl", label: "im Rollstuhl" }
      ],
      showIf: { field: "positionswechsel_selbststaendig", value: false },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "liegeposition", section: 6, audience: "kunde", type: "multiselect",
      label: "Bevorzugte Liegeposition",
      help: "Wie liegen Sie am liebsten? Sie können mehrere Punkte ankreuzen. Freiwillig.",
      sensitive: true,
      options: [
        { value: "rechts", label: "rechts" },
        { value: "links", label: "links" },
        { value: "ruecken", label: "Rücken" },
        { value: "bauch", label: "Bauch" }
      ],
      showIf: { field: "positionswechsel_selbststaendig", value: false },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "pflegebett_vorhanden", section: 6, audience: "kunde", type: "select",
      label: "Ist ein Pflegebett vorhanden?",
      help: "Haben Sie ein Pflegebett? Freiwillig.",
      sensitive: true,
      options: JA_NEIN,
      showIf: { field: "positionswechsel_selbststaendig", value: false },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "transfer_hilfsmittel_selbststaendig", section: 6, audience: "kunde", type: "checkbox",
      label: "Transfer: Ich komme weitgehend allein zurecht",
      help: "Transfer heißt umsetzen, zum Beispiel vom Bett in den Rollstuhl. Haken setzen, wenn Sie das selbst schaffen."
    },
    {
      id: "transfer_hilfsmittel", section: 6, audience: "kunde", type: "textarea",
      label: "Transfer: Hilfe und Hilfsmittel",
      help: "Ausgemustert (deprecated): ersetzt durch das Auswahlfeld zum Transfer. Bleibt für alte Daten erhalten.",
      sensitive: true,
      showIf: { field: "transfer_hilfsmittel_selbststaendig", value: false },
      status: "deprecated", version: 2, changed: "2026-07-13"
    },
    {
      id: "transfer_optionen", section: 6, audience: "kunde", type: "multiselect",
      label: "Transfer: Wie wird umgesetzt?",
      help: "Transfer heißt umsetzen, zum Beispiel vom Bett in den Rollstuhl. Wie wird das gemacht oder welche Hilfsmittel werden genutzt? Sie können mehrere Punkte ankreuzen. Freiwillig.",
      sensitive: true,
      options: [
        { value: "kinaesthetisch", label: "kinästhetisch" },
        { value: "lifter", label: "mit Lifter" },
        { value: "rueckenstuetzguertel", label: "mit Rückenstützgürtel" },
        { value: "hebegurt", label: "Hebegurt" },
        { value: "lagerungstuch", label: "Lagerungstuch" },
        { value: "deckenlifter", label: "Deckenlifter" }
      ],
      showIf: { field: "transfer_hilfsmittel_selbststaendig", value: false },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "fortbewegung_selbststaendig", section: 6, audience: "kunde", type: "checkbox",
      label: "Fortbewegung: Ich komme weitgehend allein zurecht",
      help: "Gehen oder Rollstuhl fahren in der Wohnung. Haken setzen, wenn Sie das selbst schaffen."
    },
    {
      id: "fortbewegung", section: 6, audience: "kunde", type: "textarea",
      label: "Fortbewegung: Wobei brauchen Sie Hilfe?",
      help: "Ausgemustert (deprecated): ersetzt durch das Auswahlfeld zur Fortbewegung. Bleibt für alte Daten erhalten.",
      sensitive: true,
      showIf: { field: "fortbewegung_selbststaendig", value: false },
      status: "deprecated", version: 2, changed: "2026-07-13"
    },
    {
      id: "fortbewegung_optionen", section: 6, audience: "kunde", type: "multiselect",
      label: "Fortbewegung: Womit bewegen Sie sich fort?",
      help: "Wie kommen Sie in der Wohnung voran? Sie können mehrere Punkte ankreuzen. Freiwillig.",
      sensitive: true,
      options: [
        { value: "rollstuhl", label: "mit Rollstuhl" },
        { value: "anderes_hilfsmittel", label: "anderes Hilfsmittel" }
      ],
      showIf: { field: "fortbewegung_selbststaendig", value: false },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "treppensteigen_selbststaendig", section: 6, audience: "kunde", type: "checkbox",
      label: "Treppensteigen: Ich komme weitgehend allein zurecht",
      help: "Haken setzen, wenn Sie Treppen allein schaffen."
    },
    {
      id: "treppensteigen", section: 6, audience: "kunde", type: "textarea",
      label: "Treppensteigen: Wobei brauchen Sie Hilfe?",
      help: "Ausgemustert (deprecated): ersetzt durch das Auswahlfeld und das Feld für eigene Angaben zum Treppensteigen. Bleibt für alte Daten erhalten.",
      sensitive: true,
      showIf: { field: "treppensteigen_selbststaendig", value: false },
      status: "deprecated", version: 2, changed: "2026-07-13"
    },
    {
      id: "treppensteigen_optionen", section: 6, audience: "kunde", type: "multiselect",
      label: "Treppensteigen: Was trifft zu?",
      help: "Wie kommen Sie Treppen hoch und runter? Sie können mehrere Punkte ankreuzen. Freiwillig.",
      sensitive: true,
      options: [
        { value: "nicht_moeglich", label: "nicht möglich" },
        { value: "mit_hilfsmittel", label: "mit Hilfsmittel (z. B. Treppensteighilfe)" },
        { value: "personelle_hilfe", label: "mit personeller Hilfe (Stützen, Aufsicht)" }
      ],
      showIf: { field: "treppensteigen_selbststaendig", value: false },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "treppensteigen_eigene", section: 6, audience: "kunde", type: "textarea",
      label: "Treppensteigen: eigene, sonstige Angaben",
      help: "Möchten Sie dazu noch etwas in eigenen Worten schreiben? Freiwillig. Sie können das Feld auch leer lassen und im Gespräch darüber reden.",
      sensitive: true,
      showIf: { field: "treppensteigen_selbststaendig", value: false },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "koerperpflege_selbststaendig", section: 6, audience: "kunde", type: "checkbox",
      label: "Körperpflege: Ich komme weitgehend allein zurecht",
      help: "Waschen, Duschen, Zähneputzen, Anziehen. Haken setzen, wenn Sie das selbst schaffen."
    },
    {
      id: "koerperpflege", section: 6, audience: "kunde", type: "textarea",
      label: "Körperpflege: Wobei brauchen Sie Hilfe?",
      help: "Ausgemustert (deprecated): ersetzt durch das Auswahlfeld und das Feld für eigene Angaben zur Körperpflege. Bleibt für alte Daten erhalten.",
      sensitive: true,
      showIf: { field: "koerperpflege_selbststaendig", value: false },
      status: "deprecated", version: 2, changed: "2026-07-13"
    },
    {
      id: "koerperpflege_optionen", section: 6, audience: "kunde", type: "multiselect",
      label: "Körperpflege: Wobei brauchen Sie Hilfe?",
      help: "Wobei und wie brauchen Sie Hilfe bei der Körperpflege? Sie können mehrere Punkte ankreuzen. Das ist eine persönliche Angabe und ganz freiwillig.",
      sensitive: true,
      options: [
        { value: "duschen", label: "Duschen" },
        { value: "baden", label: "Baden" },
        { value: "waschbecken", label: "am Waschbecken" },
        { value: "im_bett", label: "im Bett" },
        { value: "aktivierende_pflege", label: "aktivierende Pflege" },
        { value: "komplette_hilfe", label: "komplette Hilfe (Übernahme)" },
        { value: "teilleistungen", label: "nur Teilleistungen / punktuelle Hilfe (z. B. bei Intimpflege)" }
      ],
      showIf: { field: "koerperpflege_selbststaendig", value: false },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "koerperpflege_eigene", section: 6, audience: "kunde", type: "textarea",
      label: "Körperpflege: eigene, sonstige Angaben",
      help: "Möchten Sie dazu noch etwas in eigenen Worten schreiben? Freiwillig. Sie können das Feld auch leer lassen und im Gespräch darüber reden.",
      sensitive: true,
      showIf: { field: "koerperpflege_selbststaendig", value: false },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "ausscheidung_selbststaendig", section: 6, audience: "kunde", type: "checkbox",
      label: "Toilette / Ausscheidung: Ich komme weitgehend allein zurecht",
      help: "Toilettengang, Umgang mit Windeln oder Katheter. Haken setzen, wenn Sie das selbst schaffen."
    },
    {
      id: "ausscheidung", section: 6, audience: "kunde", type: "textarea",
      label: "Toilette / Ausscheidung: Wobei brauchen Sie Hilfe?",
      help: "Ausgemustert (deprecated): ersetzt durch die einzelnen Felder zur Ausscheidung. Bleibt für alte Daten erhalten.",
      sensitive: true,
      showIf: { field: "ausscheidung_selbststaendig", value: false },
      status: "deprecated", version: 2, changed: "2026-07-13"
    },
    {
      id: "ausscheidung_kontinenz", section: 6, audience: "kunde", type: "select",
      label: "Ausscheidung: Kontinenz",
      help: "Können Sie Blase und Darm kontrollieren? Das ist eine sehr persönliche Angabe und ganz freiwillig. Sie können es leer lassen und im Gespräch klären.",
      sensitive: true,
      options: [
        { value: "kontinent", label: "kontinent" },
        { value: "inkontinent", label: "inkontinent" }
      ],
      showIf: { field: "ausscheidung_selbststaendig", value: false },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "ausscheidung_unterstuetzung", section: 6, audience: "kunde", type: "multiselect",
      label: "Ausscheidung: Wobei brauchen Sie Unterstützung?",
      help: "Wobei brauchen Sie Hilfe rund um den Toilettengang? Sie können mehrere Punkte ankreuzen. Sehr persönlich und ganz freiwillig.",
      sensitive: true,
      options: [
        { value: "wc", label: "Mobilisation auf WC" },
        { value: "toilettenstuhl", label: "Mobilisation auf Toiletten-/ Duschstuhl" },
        { value: "intimhygiene", label: "Intimhygiene" },
        { value: "bekleidung", label: "Bekleidung richten" }
      ],
      showIf: { field: "ausscheidung_selbststaendig", value: false },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "ausscheidung_neigung", section: 6, audience: "kunde", type: "multiselect",
      label: "Ausscheidung: Neigung zu",
      help: "Haben Sie öfter Beschwerden mit dem Darm? Sie können mehrere Punkte ankreuzen. Freiwillig.",
      sensitive: true,
      options: [
        { value: "verstopfung", label: "Verstopfung" },
        { value: "durchfall", label: "Durchfall" }
      ],
      showIf: { field: "ausscheidung_selbststaendig", value: false },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "ausscheidung_hilfsmittel", section: 6, audience: "kunde", type: "multiselect",
      label: "Ausscheidung: Hilfsmittel",
      help: "Welche Hilfsmittel nutzen Sie? Sie können mehrere Punkte ankreuzen. Sehr persönlich und ganz freiwillig.",
      sensitive: true,
      options: [
        { value: "inkontinenzartikel", label: "Inkontinenzartikel" },
        { value: "spk", label: "Suprapubischer Dauerkatheter" },
        { value: "stoma", label: "künstlicher Darmausgang" }
      ],
      showIf: { field: "ausscheidung_selbststaendig", value: false },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "ausscheidung_eigene", section: 6, audience: "kunde", type: "textarea",
      label: "Ausscheidung: eigene, sonstige Angaben",
      help: "Möchten Sie dazu noch etwas in eigenen Worten schreiben? Freiwillig. Sie können das Feld auch leer lassen und im Gespräch darüber reden.",
      sensitive: true,
      showIf: { field: "ausscheidung_selbststaendig", value: false },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "ernaehrung_selbststaendig", section: 6, audience: "kunde", type: "checkbox",
      label: "Essen und Trinken: Ich komme weitgehend allein zurecht",
      help: "Essen zubereiten und zu sich nehmen. Haken setzen, wenn Sie das selbst schaffen."
    },
    {
      id: "ernaehrung", section: 6, audience: "kunde", type: "textarea",
      label: "Essen und Trinken: Wobei brauchen Sie Hilfe?",
      help: "Ausgemustert (deprecated): ersetzt durch die einzelnen Felder zur Ernährung. Bleibt für alte Daten erhalten.",
      sensitive: true,
      showIf: { field: "ernaehrung_selbststaendig", value: false },
      status: "deprecated", version: 2, changed: "2026-07-13"
    },
    {
      id: "ernaehrung_kost", section: 6, audience: "kunde", type: "textarea",
      label: "Ernährung: besondere / bevorzugte Kost",
      help: "Essen Sie etwas Besonderes oder besonders gern? Zum Beispiel weiche Kost oder bestimmte Speisen. Freiwillig.",
      sensitive: true,
      showIf: { field: "ernaehrung_selbststaendig", value: false },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "ernaehrung_zubereitung", section: 6, audience: "kunde", type: "multiselect",
      label: "Ernährung: Wer bereitet das Essen zu?",
      help: "Wer kocht Ihr Essen? Sie können mehrere Punkte ankreuzen. Freiwillig.",
      sensitive: true,
      options: [
        { value: "assistenten", label: "durch Assistenten" },
        { value: "essen_auf_raedern", label: "Essen auf Rädern" },
        { value: "selbst_angehoerige", label: "selbstständig / Angehörige" }
      ],
      showIf: { field: "ernaehrung_selbststaendig", value: false },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "ernaehrung_essen_muss", section: 6, audience: "kunde", type: "multiselect",
      label: "Ernährung: Das Essen muss ...",
      help: "Braucht Ihr Essen eine besondere Vorbereitung? Sie können mehrere Punkte ankreuzen. Freiwillig.",
      sensitive: true,
      options: [
        { value: "angereicht", label: "angereicht werden" },
        { value: "vorbereitet", label: "vorbereitet werden" }
      ],
      showIf: { field: "ernaehrung_selbststaendig", value: false },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "ernaehrung_hilfsmittel", section: 6, audience: "kunde", type: "multiselect",
      label: "Ernährung: Hilfsmittel",
      help: "Welche Hilfsmittel brauchen Sie beim Essen und Trinken? Sie können mehrere Punkte ankreuzen. Freiwillig.",
      sensitive: true,
      options: [
        { value: "besonderes_besteck", label: "besonderes Besteck" },
        { value: "strohhalm", label: "trinken mit Strohhalm" },
        { value: "schluckstoerung", label: "vorliegende Schluckstörung" },
        { value: "peg", label: "Magensonde (PEG)" }
      ],
      showIf: { field: "ernaehrung_selbststaendig", value: false },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "ernaehrung_eigene", section: 6, audience: "kunde", type: "textarea",
      label: "Ernährung: eigene, sonstige Angaben",
      help: "Möchten Sie dazu noch etwas in eigenen Worten schreiben? Freiwillig. Sie können das Feld auch leer lassen und im Gespräch darüber reden.",
      sensitive: true,
      showIf: { field: "ernaehrung_selbststaendig", value: false },
      version: 1, changed: "2026-07-13"
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
      help: "Ausgemustert (deprecated): ersetzt durch die einzelnen Felder zur Medikamentengabe. Bleibt für alte Daten erhalten.",
      sensitive: true,
      showIf: { field: "medikamente_selbststaendig", value: false },
      status: "deprecated", version: 2, changed: "2026-07-13"
    },
    {
      id: "medikamente_art", section: 6, audience: "kunde", type: "multiselect",
      label: "Medikamentengabe: Wie werden die Medikamente gegeben?",
      help: "Auf welchem Weg bekommen Sie Ihre Medikamente? Sie können mehrere Punkte ankreuzen. Freiwillig.",
      sensitive: true,
      options: [
        { value: "oral", label: "oral" },
        { value: "peg", label: "per Magensonde (PEG)" },
        { value: "rektal", label: "rektal" },
        { value: "spritzen", label: "Spritzen (i.v. / i.m. / s.c.)" },
        { value: "sonstiges", label: "Sonstiges" }
      ],
      showIf: { field: "medikamente_selbststaendig", value: false },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "medikamente_stellen", section: 6, audience: "kunde", type: "textarea",
      label: "Medikamente stellen / vorbereiten / organisieren",
      help: "Wer stellt Ihre Medikamente, bereitet sie vor oder organisiert sie? Zum Beispiel Sie selbst, Angehörige, ein Pflegedienst oder die Assistenz. Freiwillig.",
      sensitive: true,
      showIf: { field: "medikamente_selbststaendig", value: false },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "medikamente_eigene", section: 6, audience: "kunde", type: "textarea",
      label: "Medikamentengabe: eigene, sonstige Angaben",
      help: "Möchten Sie dazu noch etwas in eigenen Worten schreiben? Freiwillig. Sie können das Feld auch leer lassen und im Gespräch darüber reden.",
      sensitive: true,
      showIf: { field: "medikamente_selbststaendig", value: false },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "hilfsmittel_selbststaendig", section: 6, audience: "kunde", type: "checkbox",
      label: "Hilfsmittel: Ich komme weitgehend allein zurecht",
      help: "Umgang mit Hilfsmitteln wie Prothese oder Orthese. Haken setzen, wenn Sie das selbst schaffen."
    },
    {
      id: "hilfsmittel", section: 6, audience: "kunde", type: "textarea",
      label: "Hilfsmittel: Welche nutzen Sie und wobei brauchen Sie Hilfe?",
      help: "Ausgemustert (deprecated): ersetzt durch das Auswahlfeld zu den Hilfsmitteln. Bleibt für alte Daten erhalten.",
      sensitive: true,
      showIf: { field: "hilfsmittel_selbststaendig", value: false },
      status: "deprecated", version: 2, changed: "2026-07-13"
    },
    {
      id: "hilfsmittel_optionen", section: 6, audience: "kunde", type: "multiselect",
      label: "Hilfsmittel: Welche nutzen Sie?",
      help: "Welche Hilfsmittel nutzen Sie? Sie können mehrere Punkte ankreuzen. Freiwillig.",
      sensitive: true,
      options: [
        { value: "kompressionsstruempfe", label: "Kompressionsstrümpfe" },
        { value: "orthesen", label: "Orthesen" },
        { value: "hoergeraete", label: "Hörgeräte" },
        { value: "brille", label: "Brille" },
        { value: "sonstiges", label: "Sonstiges" }
      ],
      showIf: { field: "hilfsmittel_selbststaendig", value: false },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "wundversorgung_selbststaendig", section: 6, audience: "kunde", type: "checkbox",
      label: "Wundversorgung: Ich komme weitgehend allein zurecht",
      help: "Versorgung von Wunden oder Druckstellen (Dekubitus). Haken setzen, wenn Sie das selbst schaffen."
    },
    {
      id: "wundversorgung", section: 6, audience: "kunde", type: "textarea",
      label: "Verbände von Wunden / Einstichstellen — bitte beschreiben",
      help: "Verbände von Wunden (z. B. Druckgeschwüre) oder Einstichstellen (z. B. von PEG / SPK). Bitte beschreiben Sie, was zu versorgen ist. Freiwillig — Sie können es auch im Gespräch klären.",
      sensitive: true,
      showIf: { field: "wundversorgung_selbststaendig", value: false },
      version: 2, changed: "2026-07-13"
    },
    {
      id: "beatmung_vorhanden", section: 6, audience: "kunde", type: "select",
      label: "Werden Sie beatmet?",
      help: "Beatmung heißt: ein Gerät unterstützt oder übernimmt Ihr Atmen. Achtung: Sauerstoffgabe und ein Hustenassistent sind KEINE Beatmung. Wer beatmet wird, gibt es hier an. Diese Angabe hilft uns zu wissen, welche Qualifikation die Assistenzkraft braucht. Freiwillig.",
      sensitive: true,
      options: [
        { value: "nein", label: "nein" },
        { value: "nicht_invasiv", label: "nicht-invasiv (Maske)" },
        { value: "invasiv", label: "invasiv (Trachealkanüle)" }
      ],
      version: 1, changed: "2026-07-13"
    },
    {
      id: "beatmung_selbststaendig", section: 6, audience: "kunde", type: "checkbox",
      label: "Beatmung / Sauerstoff: Ich komme weitgehend allein zurecht",
      help: "Umgang mit Beatmung oder Sauerstoffgerät. Haken setzen, wenn Sie das selbst schaffen."
    },
    {
      id: "beatmung", section: 6, audience: "kunde", type: "textarea",
      label: "Beatmung / Sauerstoff: Wobei brauchen Sie Hilfe?",
      help: "Ausgemustert (deprecated): ersetzt durch das Auswahlfeld zur Beatmung. Bleibt für alte Daten erhalten.",
      sensitive: true,
      showIf: { field: "beatmung_selbststaendig", value: false },
      status: "deprecated", version: 2, changed: "2026-07-13"
    },
    {
      id: "beatmung_optionen", section: 6, audience: "kunde", type: "multiselect",
      label: "Beatmung: Was trifft zu?",
      help: "Brauchen Sie Sauerstoff oder einen Hustenassistenten? Sie können mehrere Punkte ankreuzen. Freiwillig.",
      sensitive: true,
      options: [
        { value: "sauerstoff", label: "Sauerstoff" },
        { value: "hustenassistent", label: "Hustenassistent" }
      ],
      showIf: { field: "beatmung_selbststaendig", value: false },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "werte_kontrolle_selbststaendig", section: 6, audience: "kunde", type: "checkbox",
      label: "Werte kontrollieren: Ich komme weitgehend allein zurecht",
      help: "Zum Beispiel Blutzucker oder Blutdruck messen. Haken setzen, wenn Sie das selbst schaffen."
    },
    {
      id: "werte_kontrolle", section: 6, audience: "kunde", type: "textarea",
      label: "Werte kontrollieren: Wobei brauchen Sie Hilfe?",
      help: "Ausgemustert (deprecated): ersetzt durch das Auswahlfeld zur Kontrolle von Werten. Bleibt für alte Daten erhalten.",
      sensitive: true,
      showIf: { field: "werte_kontrolle_selbststaendig", value: false },
      status: "deprecated", version: 2, changed: "2026-07-13"
    },
    {
      id: "werte_kontrolle_optionen", section: 6, audience: "kunde", type: "multiselect",
      label: "Kontrolle von Werten: Welche Werte werden kontrolliert?",
      help: "Welche Werte müssen regelmäßig gemessen werden? Sie können mehrere Punkte ankreuzen. Freiwillig.",
      sensitive: true,
      options: [
        { value: "spo2", label: "SpO2 (Sauerstoffsättigung)" },
        { value: "blutdruck", label: "Blutdruck" },
        { value: "blutzucker", label: "Blutzucker" },
        { value: "sonstiges", label: "Sonstiges" }
      ],
      showIf: { field: "werte_kontrolle_selbststaendig", value: false },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "werte_kontrolle_sonstiges", section: 6, audience: "kunde", type: "textarea",
      label: "Kontrolle von Werten: Sonstiges",
      help: "Wenn oben Sonstiges zutrifft: Welche weiteren Werte werden kontrolliert? Freiwillig.",
      sensitive: true,
      showIf: { field: "werte_kontrolle_selbststaendig", value: false },
      version: 1, changed: "2026-07-13"
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
    {
      id: "digitales_ausraeumen_selbststaendig", section: 6, audience: "kunde", type: "checkbox",
      label: "Digitales Ausräumen: Ich komme weitgehend allein zurecht",
      help: "Digitales Ausräumen heißt: den Darm mit der Hand entleeren. Haken setzen, wenn Sie das selbst schaffen.",
      version: 1, changed: "2026-07-13"
    },
    {
      id: "digitales_ausraeumen", section: 6, audience: "kunde", type: "select",
      label: "Digitales Ausräumen nötig?",
      help: "Brauchen Sie Hilfe beim Entleeren des Darms mit der Hand (digitales Ausräumen)? Das ist eine sehr persönliche Angabe und ganz freiwillig. Sie können es auch im Gespräch klären.",
      sensitive: true,
      options: JA_NEIN,
      showIf: { field: "digitales_ausraeumen_selbststaendig", value: false },
      version: 2, changed: "2026-07-13"
    },
    {
      id: "behandlungspflege_eigene", section: 6, audience: "kunde", type: "textarea",
      label: "Behandlungspflege: eigene, sonstige Angaben",
      help: "Möchten Sie zur Behandlungspflege noch etwas in eigenen Worten schreiben? Freiwillig. Sie können das Feld auch leer lassen und im Gespräch darüber reden.",
      sensitive: true,
      version: 2, changed: "2026-07-13"
    },

    /* ============================================================
     * ABSCHNITT 7 — Wünsche an die Assistenzkraft
     * Alle Anforderungen an die Assistenzkraft mit Präfix wunsch_assistenz_.
     * ============================================================ */
    {
      id: "wunsch_assistenz_geschlecht", section: 7, audience: "kunde", type: "select",
      label: "Gewünschtes Geschlecht der Assistenzkraft",
      help: "Wünschen Sie sich eine männliche oder weibliche Assistenzkraft? Wenn es Ihnen egal ist, wählen Sie unwichtig. Gemeint ist die Assistenzkraft, nicht Sie selbst. Freiwillig.",
      options: [
        { value: "maennlich", label: "männlich" },
        { value: "weiblich", label: "weiblich" },
        { value: "unwichtig", label: "unwichtig" }
      ],
      version: 2, changed: "2026-07-13"
    },
    {
      id: "wunsch_assistenz_alter_von", section: 7, audience: "kunde", type: "number",
      label: "Gewünschtes Alter der Assistenzkraft — von",
      help: "Falls Sie sich ein bestimmtes Alter der Assistenzkraft wünschen: ab welchem Alter (in Jahren)? Freiwillig. Sie können auch nur eines der beiden Felder ausfüllen.",
      placeholder: "z. B. 20",
      version: 1, changed: "2026-07-13"
    },
    {
      id: "wunsch_assistenz_alter_bis", section: 7, audience: "kunde", type: "number",
      label: "Gewünschtes Alter der Assistenzkraft — bis",
      help: "Bis zu welchem Alter (in Jahren)? Freiwillig. Wenn Sie beide Felder ausfüllen, muss der Wert bei von kleiner oder gleich dem Wert bei bis sein.",
      placeholder: "z. B. 60",
      version: 1, changed: "2026-07-13"
    },
    {
      id: "wunsch_assistenz_rauchen", section: 7, audience: "kunde", type: "select",
      label: "Darf die Assistenzkraft rauchen?",
      help: "Wenn ja, wo ist es für Sie in Ordnung? Gemeint ist die Assistenzkraft, nicht Sie selbst. Freiwillig.",
      options: [
        { value: "drinnen", label: "drinnen" },
        { value: "draussen", label: "draußen" },
        { value: "ausserhalb_dienstzeiten", label: "außerhalb der Dienstzeiten" },
        { value: "nur_nichtraucher", label: "nur Nichtraucher" }
      ],
      version: 2, changed: "2026-07-13"
    },
    {
      id: "wunsch_assistenz_deutsch", section: 7, audience: "kunde", type: "select",
      label: "Geforderte Deutschkenntnisse der Assistenzkraft",
      help: "Wie gut muss die Assistenzkraft Deutsch können? Gemeint ist die Assistenzkraft. Freiwillig.",
      options: [
        { value: "ausreichend", label: "ausreichend (verstehen)" },
        { value: "gut", label: "gut (verstehen/sprechen)" },
        { value: "sehr_gut", label: "sehr gut (verhandlungssicher)" }
      ],
      version: 2, changed: "2026-07-13"
    },
    {
      id: "wunsch_assistenz_pflegeerfahrung", section: 7, audience: "kunde", type: "select",
      label: "Wie wichtig ist Pflegeerfahrung der Assistenzkraft?",
      help: "Wie wichtig ist Ihnen, dass die Assistenzkraft schon Erfahrung in der Pflege hat? Freiwillig.",
      options: [
        { value: "wichtig", label: "wichtig" },
        { value: "weniger_wichtig", label: "weniger wichtig" },
        { value: "zwingend", label: "zwingend erforderlich" }
      ],
      version: 2, changed: "2026-07-13"
    },
    {
      id: "wunsch_assistenz_fuehrerschein", section: 7, audience: "kunde", type: "textarea",
      label: "Führerschein / Auto / Fahrerfahrung",
      help: "Soll die Assistenzkraft einen Führerschein haben oder Auto fahren können? Brauchen Sie Fahrerfahrung, evtl. auch mit größeren Fahrzeugen? Schreiben Sie es hier auf. Freiwillig.",
      version: 2, changed: "2026-07-13"
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
    },

    /* Echter BeWo-Block (Stammdatenblatt S. 7 und 8), Nr. 10.
       Nur intern — erscheint NICHT im Kundenformular. Hängt am Schalter
       int_bewo_zutreffend (Vorlage: Feld „entfällt" oben rechts).
       Die Zielfragen bleiben beim Kunden (ziele_wo, ziele_veraenderung). */
    {
      id: "int_bewo_zutreffend", section: 4, audience: "intern", type: "checkbox",
      label: "BeWo: trifft zu (Antrag auf Fachleistungen)",
      help: "Intern: Haken setzen, wenn der BeWo-Block (Betreutes Wohnen, Nr. 10) zutrifft. In der Papiervorlage entspricht dem das Feld entfällt (dann nicht gesetzt).",
      version: 1, changed: "2026-07-13"
    },
    {
      id: "int_bewo_haushaltsvorstand", section: 4, audience: "intern", type: "select",
      label: "BeWo: Haushaltsvorstand?",
      help: "Intern: Ist die ratsuchende Person Haushaltsvorstand?",
      showIf: { field: "int_bewo_zutreffend", value: true },
      options: JA_NEIN,
      version: 1, changed: "2026-07-13"
    },
    {
      id: "int_bewo_anzahl_kinder", section: 4, audience: "intern", type: "number",
      label: "BeWo: Anzahl Kinder",
      help: "Intern: Anzahl der Kinder insgesamt.",
      showIf: { field: "int_bewo_zutreffend", value: true },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "int_bewo_anzahl_kinder_haushalt", section: 4, audience: "intern", type: "number",
      label: "BeWo: Anzahl der Kinder, die im Haushalt leben",
      help: "Intern: Anzahl der Kinder, die im Haushalt leben.",
      showIf: { field: "int_bewo_zutreffend", value: true },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "int_bewo_kenntnis", section: 4, audience: "intern", type: "textarea",
      label: "BeWo: Kenntnis / Historie",
      help: "Intern: Kennt der Klient BeWo? Liegt ein Wechsel des BeWo-Anbieters vor? Hat es schon einmal BeWo gegeben?",
      showIf: { field: "int_bewo_zutreffend", value: true },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "int_bewo_teilhabe", section: 4, audience: "intern", type: "textarea",
      label: "BeWo: Ausmaß der Teilhabe-Einschränkung",
      help: "Intern: In welchem Ausmaß ist die Teilhabe eingeschränkt? (Alltagskompetenzen / gesellschaftliche Teilhabe).",
      showIf: { field: "int_bewo_zutreffend", value: true },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "int_bewo_hilfen_bisher", section: 4, audience: "intern", type: "textarea",
      label: "BeWo: bisher in Anspruch genommene / beantragte Hilfen",
      help: "Intern: Welche Hilfen wurden bisher schon in Anspruch genommen oder beantragt?",
      showIf: { field: "int_bewo_zutreffend", value: true },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "int_bewo_medikation", section: 4, audience: "intern", type: "textarea",
      label: "BeWo: Krankheitsanamnese — Medikation",
      help: "Intern: Weitere Krankheitsanamnese / Vorgeschichte — Medikation.",
      showIf: { field: "int_bewo_zutreffend", value: true },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "int_bewo_stationaere_aufenthalte", section: 4, audience: "intern", type: "textarea",
      label: "BeWo: Krankheitsanamnese — stationäre Aufenthalte",
      help: "Intern: Weitere Krankheitsanamnese / Vorgeschichte — stationäre Aufenthalte.",
      showIf: { field: "int_bewo_zutreffend", value: true },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "int_bewo_rehamassnahmen", section: 4, audience: "intern", type: "textarea",
      label: "BeWo: Krankheitsanamnese — Rehamaßnahmen",
      help: "Intern: Weitere Krankheitsanamnese / Vorgeschichte — Rehamaßnahmen.",
      showIf: { field: "int_bewo_zutreffend", value: true },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "int_bewo_beschuetzende_massnahmen", section: 4, audience: "intern", type: "textarea",
      label: "BeWo: Beschützende Maßnahmen",
      help: "Intern: Beschützende Maßnahmen (WfbM, Arbeitstherapie usw.).",
      showIf: { field: "int_bewo_zutreffend", value: true },
      version: 1, changed: "2026-07-13"
    },
    {
      id: "int_bewo_erwartung", section: 4, audience: "intern", type: "textarea",
      label: "BeWo: Handlungsbereitschaft / Motivation",
      help: "Intern: Handlungsbereitschaft / Motivation — was wird von BeWo erwartet?",
      showIf: { field: "int_bewo_zutreffend", value: true },
      version: 1, changed: "2026-07-13"
    }
  ];

  return FIELDS;
});
