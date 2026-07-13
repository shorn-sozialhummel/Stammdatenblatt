# CLAUDE.md

Dieses Projekt hat verbindliche Regeln in **[PROJEKT-ANWEISUNGEN.md](PROJEKT-ANWEISUNGEN.md)**.
Bitte dort zuerst vollständig lesen und alle Regeln einhalten.

## Kurzfassung der wichtigsten Regeln

- **Keine Datenübertragung, kein Backend.** Alles läuft im Browser. Am Ende
  entstehen PDF und JSON zum Download. Kein `fetch` an einen Server.
- **Additiv arbeiten.** Nichts löschen — ausgemusterte Felder nur `deprecated: true`.
- **`fields.js` ist die einzige Wahrheitsquelle** für alle Felder.
- **Kein Feld ohne Hilfetext.**
- **Nur `name` ist Pflichtfeld.** `sensitive`-Felder sind immer freiwillig.
- **Barrierefrei** (WCAG 2.1 AA / BITV 2.0) — nicht verhandelbar.
- Reines HTML/CSS/JS, kein Framework, kein Build. Einzige Bibliothek: **pdfmake**,
  lokal in `vendor/`.

## Vor jeder Übergabe

```bash
node check-fields.js      # muss fehlerfrei durchlaufen
```

Danach `CHANGELOG.md` fortschreiben und die Definition-of-Done-Checkliste in
`PROJEKT-ANWEISUNGEN.md` abarbeiten.

## Dateien

| Datei | Zweck |
|---|---|
| `fields.js` | Feld-Registry (einzige Wahrheitsquelle) |
| `check-fields.js` | Prüfskript für die Registry (`node check-fields.js`) |
| `index.html` | Formular-Gerüst und Abschluss-/Datenschutzseiten |
| `styles.css` | Barrierefreies Layout |
| `form.js` | Schrittlogik, Rendering aus der Registry, localStorage |
| `pdf.js` | PDF- und JSON-Erzeugung im Browser (pdfmake) |
| `vendor/` | pdfmake, lokal (kein CDN) |
| `vorlagen/` | die beiden PDF-Papiervorlagen |
| `ANALYSE.md` | Feldanalyse beider Vorlagen |
