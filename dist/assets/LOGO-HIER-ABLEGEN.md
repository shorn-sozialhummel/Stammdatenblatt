# Logo hier ablegen

Legen Sie in diesen Ordner (`assets/`) das Logo der Sozialhummel gGmbH als Datei

    logo.png

Anforderungen:

- Dateiname **genau** `logo.png` (Kleinbuchstaben).
- Format **PNG**, gern mit transparentem Hintergrund.
- Empfohlen: Breite ca. 240–480 px (wird automatisch skaliert).

Sobald die Datei vorhanden ist, erscheint das Logo automatisch:

- **oben links im Formular** (`index.html`) und
- **in der Kopfzeile jeder PDF-Seite** (`pdf.js`).

Fehlt die Datei, funktioniert alles trotzdem — dann zeigt die Kopfzeile nur den
Textteil („Sozialhummel gGmbH …"), ohne Platzhalter.

## Hinweis zur PDF-Kopfzeile

Damit das Logo **im PDF** erscheint, muss das Formular über einen Webserver
(oder den späteren Strato-Webspace) geöffnet werden. Beim direkten Öffnen der
`index.html` als lokale Datei (`file://`) kann der Browser das Logo aus
Sicherheitsgründen nicht in das PDF einbetten — das Formular selbst zeigt es
dann aber trotzdem an. Ohne Logo bleibt das PDF sauber (nur Text).
