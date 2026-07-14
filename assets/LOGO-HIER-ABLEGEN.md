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

## Optimale Logodatei

Damit das Logo gut aussieht und beim Austausch nicht wieder zu klein oder mit
weißem Rand erscheint, sollte die Datei so aussehen:

- **Transparenter Hintergrund** (PNG mit Alphakanal). So entsteht auf dem grauen
  Formular-Kopf **kein weißes Kästchen** um das Motiv.
- **Eng zugeschnitten** — kein großer leerer Rand um die Grafik. Sonst wirkt das
  Logo klein, weil die Skalierung den leeren Rand mitzählt.
- **Breiter als hoch** (Querformat). Kopf- und Fußzeile sind breit; ein
  querformatiges Logo nutzt den Platz und bleibt gut lesbar. Ein Quadrat wird
  dagegen klein gerechnet.
- **Mindestens 400 px breit** (gern mehr, z. B. 800 px), damit es auch bei
  höherer Bildschirm-Auflösung und im PDF scharf bleibt.
- Dateiname genau `logo.png`.

Die aktuell hinterlegte Datei erfüllt das (ca. 800 × 585 px, transparent,
zugeschnitten). Wird sie ersetzt, bitte an diesen Vorgaben orientieren.

Die Anzeigegröße ist im Code hinterlegt und muss normalerweise **nicht** angepasst
werden: im Formular über `.logo { max-height: 64px }` in `styles.css`, im PDF über
`fit: [150, 64]` in `pdf.js`.

## Hinweis zur PDF-Kopfzeile

Damit das Logo **im PDF** erscheint, muss das Formular über einen Webserver
(oder den späteren Strato-Webspace) geöffnet werden. Beim direkten Öffnen der
`index.html` als lokale Datei (`file://`) kann der Browser das Logo aus
Sicherheitsgründen nicht in das PDF einbetten — das Formular selbst zeigt es
dann aber trotzdem an. Ohne Logo bleibt das PDF sauber (nur Text).
