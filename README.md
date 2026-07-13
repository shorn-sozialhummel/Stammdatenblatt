# Stammdatenblatt und Wünsche — Sozialhummel gGmbH

Ein **barrierefreies Webformular**, mit dem Ratsuchende und potenzielle
Kundinnen und Kunden ihre Stammdaten und Wünsche selbst erfassen.

## Das Wichtigste

- **Keine Datenübertragung.** Das Formular läuft komplett im Browser. Am Ende
  entstehen ein **PDF** und ein **JSON** zum Herunterladen. Kein Server, kein
  Backend, keine Datenbank, kein `fetch`.
- **Funktioniert offline** und auch als lokale Datei (Doppelklick auf
  `index.html`).
- Reines HTML/CSS/JavaScript, kein Build-Schritt. Einzige Bibliothek:
  **pdfmake**, lokal in `vendor/` (kein CDN).

## Benutzen

Öffnen Sie `index.html` im Browser — fertig. Kein Webserver nötig.

## Auf Strato hochladen (SFTP)

Alle Dateien so, wie sie sind, per SFTP in das Web-Verzeichnis legen:

```
index.html
styles.css
form.js
pdf.js
fields.js
vendor/pdfmake.min.js
vendor/vfs_fonts.js
```

Danach ist das Formular unter Ihrer Domain erreichbar. `ANALYSE.md`,
`CHANGELOG.md`, `check-fields.js`, `vorlagen/` und die `*.md`-Dateien sind für
den Betrieb nicht nötig und müssen nicht hochgeladen werden.

## Felder ändern

Alle Felder stehen in **`fields.js`** (einzige Wahrheitsquelle). Regeln in
`PROJEKT-ANWEISUNGEN.md`:

- additiv arbeiten, nichts löschen (nur `deprecated: true`),
- kein Feld ohne Hilfetext,
- nur `name` ist Pflichtfeld, `sensitive`-Felder sind freiwillig.

Nach jeder Änderung prüfen:

```bash
node check-fields.js
```

## Projektstruktur

| Datei | Zweck |
|---|---|
| `index.html` | Formular-Gerüst, Abschluss- und Datenschutzseite |
| `styles.css` | Barrierefreies Layout (WCAG 2.1 AA / BITV 2.0) |
| `form.js` | Schrittlogik, Rendering aus der Registry, localStorage |
| `pdf.js` | PDF- und JSON-Erzeugung im Browser |
| `fields.js` | Feld-Registry (einzige Wahrheitsquelle) |
| `check-fields.js` | Prüfskript (`node check-fields.js`) |
| `vendor/` | pdfmake (lokal, kein CDN) |
| `vorlagen/` | Papiervorlagen (PDF) |
| `ANALYSE.md` | Feldanalyse beider Vorlagen |
| `PROJEKT-ANWEISUNGEN.md` | verbindliche Projektregeln + Definition of Done |

## Hinweise

- Der **Datenschutztext ist ein Entwurf** und noch rechtlich zu prüfen.
- Das **Sozialhummel-Logo** ist Platzhalter (Header-Emoji, Textzeile im PDF)
  und sollte ersetzt werden.
- Die **Feldliste** ist gegen die Original-PDFs abzugleichen, sobald diese in
  `vorlagen/` liegen (siehe `ANALYSE.md`, Abschnitt 6).
