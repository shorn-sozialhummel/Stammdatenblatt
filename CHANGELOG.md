# Changelog

Alle nennenswerten Änderungen an diesem Projekt.
Format lose nach „Keep a Changelog". Additiv — nichts wird gelöscht.

## [0.7.0] — 2026-07-13 — Fehlende Felder ergänzt (ABGLEICH a): ÖPNV-Details + Kontaktpersonen

Rein additiv. Kein bestehendes Feld inhaltlich verändert.

### Renderer/Prüfer: neue `showIf`-Variante `valueIn` (additiv)

- `showIf` unterstützt jetzt zusätzlich `{ field, valueIn: [<werte>] }` — sichtbar,
  wenn der (auch Mehrfach-)Wert einen der genannten Werte enthält. Ergänzt in
  `form.js` (`isVisible`; `applyVisibility` nutzt jetzt einheitlich `isVisible`),
  `check-fields.js` (Validierung akzeptiert `value` **oder** `valueIn`) und im
  Doku-Kopf von `fields.js`. Bestehende `showIf { field, value }` unverändert.

### Abschnitt 4 — ÖPNV-Details (Vorlage W, Seite 2)

- `oepnv_linie` (Freitext) und `oepnv_haltestelle` (Freitext), nur sichtbar, wenn
  bei `oepnv` **Bus oder Bahn** gewählt ist (`showIf … valueIn: ["bus","bahn"]`).

### Abschnitt 5 — Kontaktpersonen (Vorlage S, Seite 4)

Ergänzt wurde jeweils nur, was in der Vorlage steht und bisher fehlte; alle Felder
hängen am bestehenden „…_vorhanden"-Schalter des Blocks (`showIf`):

- Angehörige: `angehoerige_adresse` (Adresse, falls abweichend).
- Sonstige Betreuungsperson: `betreuungsperson_verhaeltnis`, `betreuungsperson_adresse`.
- Gesetzlicher Betreuer: `betreuer_adresse`, `betreuer_nachweis`
  (select: liegt vor · liegt nicht vor).
- Hausarzt: `hausarzt_adresse`.
- Pflegedienst: `pflegedienst_ansprechpartner`, `pflegedienst_ansprechpartner_rolle`
  (multiselect: Geschäftsführer/in · Ansprechpartner/in), `pflegedienst_adresse`.

Alle neuen Felder `version: 1`, `changed: 2026-07-13`, mit Hilfetext. Alle
„…_vorhanden"-Schalter der Blöcke 2–8 waren bereits vorhanden; keiner musste
ergänzt werden.

### Bereits vorhanden — nichts ergänzt

- Fachärzte (`fachaerzte_liste`, Freitext) und Sonstige Dienste
  (`sonstige_dienste_beschreibung`, Freitext) decken die Vorlage bereits ab.

### Nicht angefasst (bewusst)

- `betreuer_bereiche` bleibt unverändert. **Hinweis:** seine Optionen weichen von
  der Vorlage ab (Registry: Vermögenssorge / Behörden und Ämter /
  Wohnungsangelegenheiten; Vorlage: Vertretung bei Behörden / Vermögensvorsorge /
  Post- und Fernmeldeverkehr — siehe ABGLEICH c). Das ist eine Options-Änderung an
  einem bestehenden Feld und wird erst auf ausdrückliche Ansage gemacht.
- Interner BeWo-Block (kommt im nächsten Paket).
- `pdf.js`, `index.html`, `styles.css` nicht angefasst.

`node check-fields.js` läuft fehlerfrei (159 Felder, 15 deprecated).

## [0.6.1] — 2026-07-13 — Behandlungspflege: Beatmungsfeld + Kopplungen korrigiert

Nacharbeit zu den beiden in 0.6.0 offen gelassenen Punkten.

### Neu

- `beatmung_vorhanden` (select: nein · nicht-invasiv (Maske) · invasiv
  (Trachealkanüle)), `sensitive`, freiwillig. Steht **vor** dem Beatmungs-
  Schalter und `beatmung_optionen`, immer sichtbar (kein `showIf`). Der Hilfetext
  erklärt, dass Sauerstoffgabe und Hustenassistent keine Beatmung sind und dass
  die Angabe die nötige Qualifikation der Assistenzkraft mitbestimmt.
  `version: 1`, `changed: 2026-07-13`. `beatmung_optionen` bleibt unverändert.
- `digitales_ausraeumen_selbststaendig` (Schalter „weitgehend selbstständig"),
  passend zum Muster der anderen Positionen. `version: 1`, `changed: 2026-07-13`.

### Geändert (Kopplung korrigiert)

- `digitales_ausraeumen`: `showIf` nicht mehr an `einmalkatheter_selbststaendig`,
  sondern an den eigenen Schalter `digitales_ausraeumen_selbststaendig`.
  `version: 2`, `changed: 2026-07-13`.
- `behandlungspflege_eigene`: `showIf` **ersatzlos entfernt** — der Block-Freitext
  ist jetzt immer sichtbar. `version: 2`, `changed: 2026-07-13`.

### Dokumentation

- `ABGLEICH.md`: Nachtrag ergänzt — die Papiervorlage kennt bei „Beatmung" nur
  Sauerstoff/Hustenassistent, kein eigenes Beatmungsfeld; das Webformular ergänzt
  es bewusst; Empfehlung, die Papiervorlage nachzuziehen.

`node check-fields.js` läuft fehlerfrei (148 Felder, 15 deprecated). Nur
`fields.js`, `ABGLEICH.md` und `CHANGELOG.md` geändert; kein anderer Code.

## [0.6.0] — 2026-07-13 — Abschnitt 6, Teil 2: Behandlungspflege an die Vorlage angeglichen

Grundlage: Stammdatenblatt Seite 6, Block „Behandlungspflege". Gleiches Muster
wie bei der Grundpflege: bisheriges Freitextfeld auf `status: "deprecated"`, neues
`multiselect` daneben, `…_selbststaendig`-Schalter bleibt, alle neuen Felder
`sensitive` und per `showIf` an den jeweiligen Schalter gekoppelt.

### Ausgemustert (`status: "deprecated"`, bleiben für alte Daten)

- `medikamente`, `hilfsmittel`, `beatmung`, `werte_kontrolle` (je `version: 2`).

### Neu

- **Medikamentengabe:** `medikamente_art` (oral · per Magensonde (PEG) · rektal ·
  Spritzen (i.v./i.m./s.c.) · Sonstiges), `medikamente_stellen` (Freitext: wer
  stellt/vorbereitet/organisiert die Medikamente), `medikamente_eigene` (Freitext).
- **Hilfsmittel:** `hilfsmittel_optionen` (Kompressionsstrümpfe · Orthesen ·
  Hörgeräte · Brille · Sonstiges).
- **Beatmung:** `beatmung_optionen` (Sauerstoff · Hustenassistent).
- **Kontrolle von Werten:** `werte_kontrolle_optionen` (SpO2 · Blutdruck ·
  Blutzucker · Sonstiges) + `werte_kontrolle_sonstiges` (Freitext).
- `digitales_ausraeumen` (ja/nein).
- `behandlungspflege_eigene` (Freitext „eigene, sonstige Angaben" für den Block).

  Alle neuen Felder `version: 1`, `changed: 2026-07-13`, sachliche Hilfetexte in
  einfacher Sprache mit Hinweis auf Freiwilligkeit.

### Geändert (nur Label/Hilfetext, kein Typwechsel)

- `wundversorgung`: bleibt Freitext; Label und Hilfetext an den Vorlagen-Wortlaut
  angeglichen („Verbände von Wunden (z. B. Druckgeschwüre) / Einstichstellen
  (z. B. von PEG / SPK). Bitte beschreiben."). `version: 2`, `changed: 2026-07-13`.

### Unverändert (bewusst)

- `einmalkatheter` und `einmalkatheter_selbststaendig` unverändert (waren bereits
  vorhanden).
- `form.js`, `pdf.js`, `check-fields.js`, `index.html`, `styles.css` nicht
  angefasst. `node check-fields.js` läuft fehlerfrei (146 Felder, 15 deprecated).

### Offen / zur Entscheidung (nicht eigenmächtig umgebaut)

- **Kopplung von `digitales_ausraeumen` und `behandlungspflege_eigene`:** beide
  sind an `einmalkatheter_selbststaendig` gekoppelt (in der Vorlage stehen sie in
  demselben Unterblock). Alternativen: eigener Schalter oder ohne `showIf`.
- **Eigenes „Beatmung: ja/nein":** die Vorlage listet unter der Überschrift
  „Beatmung" nur Sauerstoff/Hustenassistent. Ein separates Ja/Nein-Feld
  („werden Sie beatmet?") wäre denkbar — bei Bedarf ergänze ich es nach Freigabe.

## [0.5.0] — 2026-07-13 — Abschnitt 6, Teil 1: Grundpflege an die Vorlage angeglichen

Grundlage: Stammdatenblatt Seite 5 und Ernährungsblock Seite 6, Punkt 9
„Gewünschte To-Do's". Nur die **Grundpflege** (7 Positionen). Die
**Behandlungspflege bleibt unberührt** (kommt im nächsten Paket).

Muster je Position: der bestehende `…_selbststaendig`-Schalter bleibt unverändert;
dazu ein `multiselect` mit den Ankreuzoptionen der Vorlage; dazu ein
Freitextfeld „eigene, sonstige Angaben", wo die Vorlage es vorsieht. Alle neuen
Felder sind `sensitive` (freiwillig) und erscheinen nur, wenn der Schalter nicht
gesetzt ist (`showIf`). Die bisherigen Freitextfelder werden **nicht gelöscht**,
sondern auf `status: "deprecated"` gesetzt (wie bei `sprache_kunde`).

### Ausgemustert (`status: "deprecated"`, bleiben für alte Daten)

- `positionswechsel`, `transfer_hilfsmittel`, `fortbewegung`, `treppensteigen`,
  `koerperpflege`, `ausscheidung`, `ernaehrung` (je `version: 2`).

### Neu

- **Positionswechsel:** `positionswechsel_optionen` (im Bett · im Rollstuhl),
  `liegeposition` (rechts · links · Rücken · Bauch), `pflegebett_vorhanden`
  (ja/nein).
- **Transfer:** `transfer_optionen` (kinästhetisch · mit Lifter · mit
  Rückenstützgürtel · Hebegurt · Lagerungstuch · Deckenlifter).
- **Fortbewegung:** `fortbewegung_optionen` (mit Rollstuhl · anderes Hilfsmittel).
- **Treppensteigen:** `treppensteigen_optionen` (nicht möglich · mit Hilfsmittel ·
  mit personeller Hilfe) + Freitext `treppensteigen_eigene`.
- **Körperpflege:** `koerperpflege_optionen` (Duschen · Baden · am Waschbecken ·
  im Bett · aktivierende Pflege · komplette Hilfe · nur Teilleistungen) +
  Freitext `koerperpflege_eigene`.
- **Ausscheidung:** `ausscheidung_kontinenz` (kontinent · inkontinent),
  `ausscheidung_unterstuetzung` (Mobilisation auf WC · auf Toiletten-/Duschstuhl ·
  Intimhygiene · Bekleidung richten), `ausscheidung_neigung` (Verstopfung ·
  Durchfall), `ausscheidung_hilfsmittel` (Inkontinenzartikel · Suprapubischer
  Dauerkatheter · künstlicher Darmausgang) + Freitext `ausscheidung_eigene`.
- **Ernährung:** `ernaehrung_kost` (Freitext), `ernaehrung_zubereitung` (durch
  Assistenten · Essen auf Rädern · selbstständig/Angehörige), `ernaehrung_essen_muss`
  (angereicht · vorbereitet), `ernaehrung_hilfsmittel` (besonderes Besteck ·
  Strohhalm · Schluckstörung · Magensonde (PEG)) + Freitext `ernaehrung_eigene`.

  Alle neuen Felder mit `version: 1`, `changed: 2026-07-13`, ausführlichem
  Hilfetext (bei intimen Themen sachlich, einfache Sprache, Hinweis auf
  Freiwilligkeit und Klärung im Gespräch).

### Unverändert (bewusst)

- Behandlungspflege (`medikamente`, `hilfsmittel`, `wundversorgung`, `beatmung`,
  `werte_kontrolle`, `einmalkatheter`) und die restlichen fehlenden Felder aus
  `ABGLEICH.md`.
- Keine Typänderung an bestehenden Feldern (nur Deprecation + neue Felder).
- `form.js`, `pdf.js`, `check-fields.js`, `index.html`, `styles.css` nicht
  angefasst — der vorhandene Renderer deckt `multiselect`/`select`/`textarea`
  bereits ab. `node check-fields.js` läuft fehlerfrei (137 Felder, 11 deprecated).

## [0.4.0] — 2026-07-13 — Abschnitt 7 (Wünsche an die Assistenzkraft) an die Vorlage angeglichen

Grundlage: „Wünsche des Kunden", Seite 1 und 2. Optionen wörtlich aus der Vorlage.

### Geändert (Optionen/Typ wörtlich aus der Vorlage W.1)

- `wunsch_assistenz_geschlecht`: Optionen jetzt **männlich · weiblich ·
  unwichtig** (statt egal/weiblich/männlich).
- `wunsch_assistenz_deutsch`: `text` → `select` (**ausreichend (verstehen) ·
  gut (verstehen/sprechen) · sehr gut (verhandlungssicher)**).
- `wunsch_assistenz_pflegeerfahrung`: Optionen jetzt **wichtig · weniger wichtig ·
  zwingend erforderlich** (statt Ja/Nein/egal).
- `wunsch_assistenz_rauchen`: Optionen jetzt **drinnen · draußen · außerhalb der
  Dienstzeiten · nur Nichtraucher** (statt egal/Ja/Nein).
- `wunsch_assistenz_fuehrerschein`: `select` (Ja/Nein/egal) → **Freitext**
  (`textarea`) „Führerschein / Auto / Fahrerfahrung", passend zur Freitextzeile
  der Vorlage W.2. (Umgestellt, kein zweites Feld angelegt.)

### Neu (fehlten, stehen aber in Vorlage W.1)

- `wunsch_assistenz_alter_von` und `wunsch_assistenz_alter_bis` (je Zahl,
  optional) — bilden die Altersspanne „Alter ___ bis ___ Jahre".
- **Validierung** (in `form.js`): Sind in Abschnitt 7 beide Felder ausgefüllt,
  muss „von" ≤ „bis" sein; sonst Fehlermeldung (`aria-invalid`, `aria-live`) und
  „Weiter" wird blockiert. Ein einzeln ausgefülltes Feld ist erlaubt.

### Geprüft, bereits vorhanden (Vorlage W.2) — unverändert

- `wunsch_assistenz_tagesablauf` (Tagesablauf, Arbeit/Arztbesuche) und
  `wunsch_assistenz_freizeit` (Freizeitgestaltung) sind bereits als Freitext
  vorhanden — keine Änderung nötig.

Für alle geänderten/neuen Felder: Hilfetext angepasst, `version` erhöht,
`changed: 2026-07-13`. `node check-fields.js` läuft fehlerfrei (118 Felder,
davon 4 deprecated). Abschnitt 6 und die restlichen fehlenden Felder aus
`ABGLEICH.md` bewusst unangetastet.

## [0.3.0] — 2026-07-13 — Feldtypen Abschnitt 2/3/4 an die Vorlagen angeglichen

Aus Freitextfeldern werden Auswahlfelder mit genau den Optionen der Vorlage.
Abschnitt 6 und 7 sowie fehlende Felder bleiben bewusst unangetastet.

### Neu

- **Feldtyp `multiselect`** (Mehrfachauswahl per Checkbox; Wert = Array von
  values). Additiv ergänzt in `fields.js` (Registry + Doku-Kopf), im Renderer
  `form.js` (rendert wie `checkboxgroup`), in der PDF/JSON-Ausgabe `pdf.js`
  (Labels werden aufgelöst und mit Komma verbunden) und in `check-fields.js`
  (gültiger Typ, braucht Optionsliste). Bestehende Typen unverändert.
- **Deprecation über `status: "deprecated"`** statt der zuvor eingeführten
  Eigenschaft `deprecated: true`. `fields.js`, `form.js`, `pdf.js` und
  `check-fields.js` erkennen jetzt `status`. Doku-Kopf und Projektregel
  entsprechend angepasst.
- Neue Felder: `muttersprache` (Freitext), `sprache_hilfen` (multiselect),
  `psychische_belastungen_eigene` (Freitext, sensitive).

### Geändert (Freitext → Auswahl, Optionen wörtlich aus der Vorlage)

- **Abschnitt 2**
  - `sprache_kunde`: aufgeteilt → auf `status: "deprecated"` gesetzt (bleibt
    für alte Daten erhalten); ersetzt durch `muttersprache` + `sprache_hilfen`
    (Übersetzer/in notwendig · verstehen · verständliches Sprechen · über Talker).
  - `rauchen_kunde`: `select` → `multiselect` (Raucher*in · Raucherhaushalt ·
    nur draußen). Hilfetext: keine Auswahl = Nichtraucher.
  - `psychische_belastungen`: `textarea` → `multiselect` (psychische Störung,
    z. B. Depressionen · Ängste, Panikattacken · Suchtverhalten · Störung der
    Impulskontrolle), plus Freitextfeld `psychische_belastungen_eigene`.
- **Abschnitt 3**
  - `pflegeleistungen`: `textarea` → `multiselect` (keine · Pflegegeld ·
    Pflegesachleistungen · Kombileistungen · Persönliches Budget).
  - `pflegegrad_gewuenscht`: Option „kein Pflegegrad" ergänzt (vor PG 1).
- **Abschnitt 4**
  - `familienstand`: `text` → `select` (ledig · verheiratet · verwitwet ·
    geschieden · getrennt lebend · verpartnert).
  - `lebenssituation`: `text` → `multiselect` (alleinlebend · Partnerschaft ·
    Angehörige · Wohngemeinschaft).
  - `wohnsituation_aktuell` (= „derzeit") und `wohnsituation_gewuenscht`:
    `textarea` → `select` (Wohnung · Haus · Betreutes Wohnen ·
    Alten-/behindertengerechtes Wohnen · Senioren-/Pflegeheim).
  - `oepnv`: `text` → `multiselect` (Bus · Bahn · nein).

  Für alle geänderten Felder: Hilfetext angepasst, `version` erhöht,
  `changed: 2026-07-13` gesetzt.

### Angepasst (Konsistenz `deprecated: true` → `status: "deprecated"`)

- `int_bewo_leistungsart`, `int_bewo_kostentraeger`, `int_bewo_umfang`: von der
  im vorigen Schritt eingeführten Eigenschaft `deprecated: true` auf
  `status: "deprecated"` umgestellt (Inhalt unverändert).

### Unverändert (bewusst)

- Abschnitt 6 (Grund-/Behandlungspflege), Abschnitt 7 (`wunsch_assistenz_*`)
  und alle in `ABGLEICH.md` als fehlend markierten Felder — kommen später.
- `node check-fields.js` läuft fehlerfrei (116 Felder, davon 4 deprecated).

## [0.2.0] — 2026-07-13 — Abgleich mit den Papiervorlagen (Teil 1: Bedeutung & erfundene Felder)

Grundlage: `ABGLEICH.md` (vollständiger Vergleich der Registry mit beiden
Original-PDFs). In diesem Schritt wurden **nur Bedeutungsfehler und erfundene
Felder** korrigiert. Feldtypen, Optionen und fehlende Felder folgen später.

### Neu

- Feld `organisation_sonstiges` (Abschnitt 8, Freitext) — entspricht dem Feld
  „Sonstiges" im Organisations-Block der Vorlage „Wünsche des Kunden" (S. 1).
- Zwei additive Registry-Eigenschaften dokumentiert: `version` (Feld-Änderungs-
  stand) und `changed` (Datum der letzten Änderung, `YYYY-MM-DD`).

### Geändert (Bedeutung an die Vorlage angepasst — die Vorlage gewinnt)

- `patientenverfuegung`: von „Haben Sie eine Patientenverfügung?" (Besitz) zu
  **„Möchten Sie Unterstützung beim Erstellen einer Patientenverfügung?"**
  (Wunsch nach Unterstützung). Optionen jetzt Ja/Nein (vorher Ja/Nein/In Arbeit),
  Hilfetext angepasst. `version: 2`, `changed: 2026-07-13`.
- `vorsorgevollmacht`: analog auf **„Möchten Sie Unterstützung beim Erstellen
  einer Vorsorgevollmacht?"** umgestellt. Optionen Ja/Nein, Hilfetext angepasst.
  `version: 2`, `changed: 2026-07-13`.
- `attest_krankenhaus`: von Freitext (`textarea`) auf **Ja/Nein** (`select`)
  umgestellt und zu **„Möchten Sie Unterstützung bei einem Attest zur Assistenz
  im Krankenhaus?"** umformuliert. `version: 2`, `changed: 2026-07-13`.

### Ausgemustert (`deprecated: true`, NICHT gelöscht)

- `int_bewo_leistungsart`, `int_bewo_kostentraeger`, `int_bewo_umfang`:
  Platzhalter der ersten Fassung ohne Entsprechung im echten BeWo-Block (Nr. 10)
  der Vorlage. Als `deprecated` markiert, Hilfetext um den Hinweis ergänzt, dass
  sie durch die echten BeWo-Felder ersetzt werden. `version: 2`,
  `changed: 2026-07-13`.

### Unverändert (bewusst)

- `aufzug` bleibt aktiv und unverändert (sinnvolle Ergänzung).
- `adresse_plz`, `adresse_ort`, `wunsch_assistenz_sonstiges`,
  `int_bewo_sonstiges` bleiben unverändert.
- Kein anderer Code angefasst (`index.html`, `form.js`, `pdf.js`, `styles.css`,
  `check-fields.js` unverändert). `node check-fields.js` läuft fehlerfrei
  (113 Felder, davon 3 deprecated).

## [0.1.0] — 2026-07-13 — Erste Fassung

### Neu

- **Projektregeln**: `PROJEKT-ANWEISUNGEN.md` und `CLAUDE.md` angelegt (lagen im
  Repository zuvor nicht vor).
- **Feld-Registry** `fields.js` als einzige Wahrheitsquelle — 112 Felder
  (96 `kunde`, 16 `intern`). Jedes Feld mit Hilfetext. Neue Eigenschaften:
  `section`, `audience`, `showIf`, `sensitive`. Nur `name` ist Pflichtfeld;
  alle `sensitive`-Felder sind freiwillig.
- **Prüfskript** `check-fields.js` — prüft zusätzlich `section` (1–8),
  `audience` (`kunde`/`intern`) und dass `sensitive`-Felder nicht `required`
  sind. Läuft fehlerfrei durch.
- **Analyse** `ANALYSE.md` — vollständige Feldliste beider Vorlagen, Zuordnung
  zu Abschnitten, `audience`, zusammengeführte Dubletten, Trennung der nur
  scheinbar gleichen Felder (`geschlecht`/`wunsch_assistenz_geschlecht` usw.).
- **Formular** (`index.html`, `styles.css`, `form.js`): 8 Abschnitte,
  Fortschrittsanzeige, „Zurück" / „Weiter" / „Abschnitt überspringen",
  bedingte Felder (`showIf`), Blöcke mit Ein/Aus-Schalter in Abschnitt 5,
  „weitgehend selbstständig"-Schalter in Abschnitt 6.
- **Barrierefreiheit**: Skip-Link, sichtbarer Fokus, `aria-describedby` für
  Hilfetexte, `aria-invalid` für Fehler, `aria-live`-Fehlerregion,
  Klickflächen ≥ 44 px, Kontrast ≥ 4,5:1, Dark Mode, `prefers-reduced-motion`,
  responsiv fürs Handy.
- **Zwischenspeichern** in `localStorage` nach jeder Eingabe; sichtbarer
  Hinweis „nur auf diesem Gerät"; Knopf „Alle Daten von diesem Gerät löschen"
  (mit Hilfetext); Erinnerung nach dem Download.
- **PDF/JSON im Browser** (`pdf.js`) mit **pdfmake**, lokal in `vendor/`
  eingebunden (kein CDN). PDF im Layout der Vorlagen mit Kopf-/Fußzeile;
  leere Felder werden weggelassen. JSON mit Roh-Werten (für Übernahme ohne
  Abtippen) und lesbarer Aufstellung.
- **Abschlussseite** mit mehreren Übergabewegen (mitbringen, Post,
  E-Mail an info@sozialhummel.de mit Sicherheitshinweis, Termin).
- **Datenschutzhinweis** als Dialog, deutlich als **Entwurf** gekennzeichnet.
- **pdfmake** `vendor/pdfmake.min.js` + `vendor/vfs_fonts.js` (v0.2.10).

### Geändert

- (keine Änderungen an Bestand — es gab noch keinen.)

### Offen / gegen die PDFs zu prüfen

- Die beiden Papiervorlagen lagen zum Zeitpunkt der ersten Fassung **nicht** im
  Repository (`vorlagen/` war leer). Die Feldliste ist aus der Auftrags-
  Spezifikation abgeleitet und **gegen die Original-PDFs abzugleichen**
  (siehe `ANALYSE.md`, Abschnitt 6): genaue BeWo-Unterfelder (Nr. 10),
  exakte Auswahllisten, evtl. zusätzliche Felder, Seitenzahlen als Quelle.
- Das echte Sozialhummel-Logo ist noch als Platzhalter (Emoji im Header,
  Textzeile im PDF) hinterlegt und sollte ersetzt werden.
