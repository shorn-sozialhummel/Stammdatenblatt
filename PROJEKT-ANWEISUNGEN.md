# Projekt-Anweisungen — Stammdatenblatt / Wünsche-Formular der Sozialhummel gGmbH

> Diese Datei hält die verbindlichen Regeln für das Projekt fest. `CLAUDE.md`
> verweist auf sie. Sie wurde angelegt, weil im Repository zuvor keine
> Anweisungsdatei vorlag.

## Was das ist

Ein **barrierefreies Webformular**, mit dem Ratsuchende und potenzielle
Kundinnen und Kunden ihre Stammdaten und Wünsche selbst erfassen. Grundlage
sind zwei Papiervorlagen (Ordner `vorlagen/`):

- `2024_05_14_Wünsche_des_Kunden.pdf` (2 Seiten)
- `Stammdatenblatt_Kunde_09_2024.pdf` (8 Seiten)

## Zentrale Architekturentscheidung

**Es werden keinerlei Daten übertragen oder gespeichert.** Das Formular läuft
vollständig im Browser. Am Ende erzeugt es dort ein **PDF** und ein **JSON**,
die der Kunde herunterlädt und selbst weitergibt.

- Kein Backend, kein Server-Code, keine Datenbank, keine Ablage.
- Kein `fetch` an irgendeinen Server.
- Einzige externe Bibliothek: **pdfmake**, lokal eingebunden (kein CDN).
- Reines HTML / CSS / JavaScript. Kein Framework, kein Build-Schritt, kein npm-Runtime.
- Muss auch als lokale Datei (ohne Webserver) und offline funktionieren.
- Auslieferung: statisch per SFTP auf einen Strato-Webspace.

## Verbindliche Arbeitsregeln

1. **Additiv arbeiten.** Nichts löschen. Ausgemusterte Felder bekommen
   `deprecated: true`, bleiben aber in der Registry.
2. **Feld-Registry ist die einzige Wahrheitsquelle.** Alle Felder stehen in
   `fields.js`. Frontend, PDF/JSON und Prüfskript lesen nur von dort.
3. **Kein Feld ohne Hilfetext.** Jedes Feld hat einen `help`-Text in einfacher,
   kurzer Sprache — keine Fachbegriffe ohne Erklärung.
4. **Nur ein Pflichtfeld:** `name`. Alles andere ist freiwillig. Niemand darf am
   Formular scheitern.
5. **Sensible Daten sind freiwillig.** Felder mit `sensitive: true` (Gesundheit,
   psychische Daten) dürfen nie `required` sein und weisen im Hilfetext darauf
   hin, dass man sie überspringen und im Gespräch klären kann.
6. **Keine Einwilligungserklärung**, weil keine Daten verarbeitet werden.
7. **Interne Felder bleiben erhalten.** `audience: "intern"` steht in der
   Registry, wird aber im Kundenformular nicht angezeigt.

## Feld-Registry — Eigenschaften

Siehe Kopf von `fields.js`. Neu gegenüber einer reinen Basis-Registry:

- `section` — Abschnittsnummer 1–8
- `audience` — `"kunde"` oder `"intern"`
- `showIf` — optionale Anzeigebedingung `{ field, value }`
- `sensitive` — `true` bei Gesundheits-/psychischen Daten (dann nie `required`)

## Die 8 Abschnitte

1. Zur Person
2. Gesundheit und Diagnosen
3. Versicherung und Leistungen
4. Wohnen und Umfeld
5. Kontaktpersonen
6. Unterstützungsbedarf
7. Wünsche an die Assistenzkraft
8. Abschluss (Vorsorge, Ziele, dann PDF + JSON)

## Barrierefreiheit (nicht verhandelbar)

- WCAG 2.1 Level AA, Orientierung an BITV 2.0
- Vollständige Tastaturbedienung, sichtbarer Fokus, sinnvolle Tab-Reihenfolge
- Korrekte Labels, `aria-describedby` für Hilfetexte, `aria-invalid` für Fehler
- Fehlermeldungen in einer `aria-live`-Region
- Klickflächen mindestens 44 × 44 px
- Kontrast mindestens 4,5:1
- `prefers-reduced-motion` respektieren
- Funktioniert auf dem Handy

## Prüfen vor jeder Übergabe

- `node check-fields.js` muss fehlerfrei durchlaufen.
- `CHANGELOG.md` fortschreiben.
- Definition-of-Done-Checkliste (unten) abarbeiten.

## Definition of Done

- [ ] `node check-fields.js` läuft fehlerfrei durch.
- [ ] Jedes Feld hat einen Hilfetext.
- [ ] Nur `name` ist Pflichtfeld; alle `sensitive`-Felder sind freiwillig.
- [ ] Interne Felder sind in der Registry vorhanden, werden aber nicht angezeigt.
- [ ] Alle 8 Abschnitte sind erreichbar; „Zurück", „Weiter", „Abschnitt
      überspringen" und Fortschrittsanzeige funktionieren.
- [ ] Zwischenspeichern in `localStorage`; Hinweis und „Alle Daten löschen"-Knopf
      vorhanden.
- [ ] PDF- und JSON-Download funktionieren, vollständig im Browser, ohne Netz.
- [ ] pdfmake liegt lokal im Repo (kein CDN, offline nutzbar).
- [ ] Abschlussseite nennt mehrere Wege der Übergabe.
- [ ] Datenschutzhinweis vorhanden und als Entwurf gekennzeichnet.
- [ ] Tastaturbedienung, Fokus, Kontrast, Touch-Größen geprüft.
- [ ] Funktioniert als lokale Datei (Doppelklick auf `index.html`).
