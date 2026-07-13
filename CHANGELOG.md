# Changelog

Alle nennenswerten Änderungen an diesem Projekt.
Format lose nach „Keep a Changelog". Additiv — nichts wird gelöscht.

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
