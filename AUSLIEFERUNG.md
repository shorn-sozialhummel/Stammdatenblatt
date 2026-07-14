# Auslieferung auf STRATO — Schritt für Schritt

> Für Menschen ohne Programmier-Kenntnisse geschrieben. Wenn Sie eine Stelle nicht
> verstehen, überspringen Sie sie nicht — fragen Sie lieber kurz nach.

## Was Sie brauchen

- Zugang zum **STRATO Hosting Basic** (Domain **sh-stiftung-forms.de**).
- Ein **SFTP-Programm**, zum Beispiel das kostenlose **FileZilla**.
- Die SFTP-Zugangsdaten von STRATO (Server, Benutzername, Passwort, Port).
- Den Ordner **`dist/`** aus diesem Projekt — darin liegt **genau das**, was auf
  den Server gehört, sonst nichts.

## Ganz wichtig vorab

- Auf demselben Webspace läuft bereits eine andere Anwendung im Ordner
  **`Verhinderungspflege`**. **Diesen Ordner nicht anfassen** — nicht öffnen zum
  Ändern, nicht überschreiben, nicht löschen.
- Wir legen unser Formular in einen **eigenen Unterordner `formular`**, damit sich
  nichts in die Quere kommt.
- Das Formular ist danach erreichbar unter:
  **https://sh-stiftung-forms.de/formular/**

## Was hochgeladen wird — und was nicht

**Hochladen: der komplette Inhalt von `dist/`:**

```
dist/
├── .htaccess              ← WICHTIG, siehe Hinweis unten
├── index.html             ← das Formular
├── datenschutz.html       ← Datenschutzseite
├── styles.css
├── fields.js
├── form.js
├── pdf.js
├── logo.js
├── vendor/
│   ├── pdfmake.min.js
│   └── vfs_fonts.js
└── assets/
    └── LOGO-HIER-ABLEGEN.md   ← Hinweis, wo das Logo hingehört
```

**NICHT hochladen** (das sind Projekt- und Arbeitsdateien, die auf dem Server
nichts zu suchen haben):

- `vorlagen/` (die PDF-Vorlagen)
- `ANALYSE.md`, `ABGLEICH.md`, `CHANGELOG.md`, `BARRIEREFREIHEIT.md`,
  `AUSLIEFERUNG.md`, `PROJEKT-ANWEISUNGEN.md`, `CLAUDE.md`, `README.md`
- `check-fields.js`
- der Ordner `.git/` und alles andere, was nicht in `dist/` liegt

> **Merksatz:** Laden Sie **nur den Inhalt von `dist/`** hoch. Wenn Sie das tun,
> ist automatisch alles richtig.

## Das Logo (optional)

Wenn Sie ein Logo möchten:

1. Legen Sie die Datei **`logo.png`** in den Ordner **`assets/`** (auf dem Server:
   `/home/www/formular/assets/logo.png`).
2. Dann erscheint das Logo automatisch oben im Formular und in jeder PDF-Kopfzeile.

Ohne Logo funktioniert alles genauso — dann steht oben nur der Text
„Sozialhummel gGmbH".

## Schritt für Schritt mit FileZilla

1. **FileZilla öffnen** und oben die STRATO-Zugangsdaten eintragen
   (Server, Benutzername, Passwort, Port) → **Verbinden**.
2. **Versteckte Dateien sichtbar machen** (sonst fehlt die `.htaccess`!):
   Menü **Server → Anzeige versteckter Dateien erzwingen** anklicken.
3. Auf der **rechten Seite** (Server) in den Webspace-Ordner **`/home/www`**
   wechseln. Dort sehen Sie u. a. den Ordner `Verhinderungspflege` — **nicht
   anfassen**.
4. In `/home/www` einen **neuen Ordner** anlegen und **`formular`** nennen
   (Rechtsklick → Verzeichnis erstellen).
5. In den neuen Ordner **`formular`** wechseln (doppelklicken).
6. Auf der **linken Seite** (Ihr Computer) in den Ordner **`dist/`** dieses
   Projekts wechseln.
7. **Alle Dateien und Unterordner aus `dist/`** markieren (auch die `.htaccess`)
   und per Ziehen nach rechts in `formular` hochladen.
8. Warten, bis FileZilla unten „Übertragung erfolgreich" für alle Dateien meldet.

Danach sollte die Serverstruktur so aussehen:

```
/home/www/
├── Verhinderungspflege/   ← unverändert, nicht angefasst
└── formular/
    ├── .htaccess
    ├── index.html
    ├── datenschutz.html
    ├── styles.css
    ├── fields.js  form.js  pdf.js  logo.js
    ├── vendor/…
    └── assets/…
```

## Was die `.htaccess` tut (kurz erklärt)

Die Datei `.htaccess` liegt mit im Ordner und stellt drei Dinge ein:

- **Verzeichnislisting aus:** Niemand kann die Dateiliste des Ordners sehen.
- **HTTPS erzwingen:** Wer die Seite über `http://` aufruft, wird automatisch auf
  die sichere `https://`-Adresse umgeleitet. (Die Regel berücksichtigt Stratos
  Proxy über den Header `X-Forwarded-Proto`.)
- **Sicherheits-Header:** u. a. eine strenge „Content-Security-Policy", die dafür
  sorgt, dass die Seite wirklich nur ihre eigenen Dateien lädt und keine externen
  Aufrufe macht — passend zur Architektur „keine Datenübertragung".

Sie müssen an der `.htaccess` **nichts ändern**. Nur mit-hochladen.

## Nach dem Hochladen prüfen

1. **Formular lädt:** Im Browser **https://sh-stiftung-forms.de/formular/**
   öffnen. Es muss „Abschnitt 1 von 8: Zur Person" erscheinen.
2. **HTTPS-Weiterleitung greift:** Rufen Sie testweise
   **http://sh-stiftung-forms.de/formular/** auf (mit `http`). Die Adresse muss
   von selbst auf **https://** wechseln (Schloss-Symbol im Browser).
3. **Logo** (falls hochgeladen): Oben links erscheint das Logo. Ohne `logo.png`
   steht dort nur der Text — das ist in Ordnung.
4. **PDF wird erzeugt:** Tragen Sie im Formular einen Namen ein, gehen Sie bis zum
   Ende (Knopf „Weiter" oder „Abschnitt überspringen"), klicken Sie auf **„PDF
   herunterladen"**. Es muss ein PDF heruntergeladen werden, das oben
   „Stammdatenblatt und Wünsche des Kunden" zeigt, mit Kopf- und Fußzeile.
5. **Datenschutzseite:** Unten auf „Datenschutzhinweis (Entwurf)" klicken — die
   Seite **datenschutz.html** muss sich öffnen.
6. **Kein Verzeichnislisting:** Rufen Sie
   **https://sh-stiftung-forms.de/formular/vendor/** auf. Es darf **keine
   Dateiliste** erscheinen (stattdessen eine Fehlermeldung „Forbidden" o. Ä.) —
   das ist gewollt.

Wenn alle sechs Punkte stimmen, ist die Auslieferung fertig.

## Später aktualisieren

Wenn es eine neue Version gibt: einfach die geänderten Dateien aus `dist/` erneut
in `/home/www/formular` hochladen und die alten überschreiben. Der Ordner
`Verhinderungspflege` bleibt dabei immer unberührt.

## Wenn etwas nicht klappt

- **Die `.htaccess` fehlt auf dem Server:** In FileZilla „Anzeige versteckter
  Dateien erzwingen" einschalten (Schritt 2) und die `.htaccess` erneut hochladen.
- **Fehler 500 (Interner Serverfehler):** Sehr selten unterstützt ein Webspace
  einzelne `.htaccess`-Zeilen nicht. Dann in der `.htaccess` die betreffende Zeile
  vorübergehend mit einem `#` am Zeilenanfang deaktivieren und STRATO-Support
  fragen, welche Module (mod_rewrite, mod_headers) verfügbar sind.
- **PDF wird nicht erzeugt:** Seite einmal neu laden (Strg+F5) und erneut
  versuchen. Das Formular braucht kein Internet, aber einen aktuellen Browser.
