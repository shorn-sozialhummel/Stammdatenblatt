# Auslieferung auf STRATO — Schritt für Schritt

> Für Menschen ohne Programmier-Kenntnisse geschrieben. Wenn Sie eine Stelle nicht
> verstehen, überspringen Sie sie nicht — fragen Sie lieber kurz nach.

## Was Sie brauchen

- Zugang zum **STRATO Hosting Basic** (Domain **sh-stiftung-forms.de**).
- Den Ordner **`dist/`** aus diesem Projekt — darin liegt **genau das**, was auf
  den Server gehört, sonst nichts.
- **Einen von zwei Wegen**, um die Dateien hochzuladen:
  - **Weg A – SFTP-Programm** (empfohlen bei vielen Dateien), z. B. das kostenlose
    **FileZilla**. Dazu die SFTP-Zugangsdaten von STRATO (Server, Benutzername,
    Passwort, Port).
  - **Weg B – Datei-Manager im STRATO-Kundenlogin** (ganz ohne Zusatzprogramm):
    im Browser bei STRATO anmelden → „Hosting" → „Datei-Manager".

Beide Wege führen zum selben Ziel. Wählen Sie den, der Ihnen leichter fällt.

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

## Weg A — Schritt für Schritt mit FileZilla

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

## Weg B — über den Datei-Manager im STRATO-Kundenlogin

Wenn Sie kein Programm installieren möchten:

1. Im Browser bei **STRATO anmelden** → **Hosting** → **Datei-Manager** öffnen.
2. In den Webspace-Ordner **`/home/www`** wechseln. Der Ordner
   `Verhinderungspflege` ist dort sichtbar — **nicht anfassen**.
3. Einen **neuen Ordner** anlegen und **`formular`** nennen, dann hineinwechseln.
4. Über die Schaltfläche **„Hochladen"** die Dateien aus `dist/` auswählen und
   hochladen. Am einfachsten geht das, wenn Sie `dist/` vorher als **ZIP-Datei**
   packen (die meisten Datei-Manager können ZIPs nach dem Upload direkt
   **entpacken**) — sonst laden Sie die Dateien und die Unterordner `vendor/` und
   `assets/` einzeln.
5. **Wichtig:** Die Datei **`.htaccess`** beginnt mit einem Punkt und wird von
   manchen Systemen als „versteckt" behandelt. Achten Sie darauf, dass sie
   **mit hochgeladen** wird. Falls der Datei-Manager sie nicht anzeigt, gibt es
   dort meist eine Einstellung „versteckte Dateien anzeigen".

Das Ergebnis ist dieselbe Ordnerstruktur wie bei Weg A.

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

## Prüfliste nach dem Hochladen (zum Abhaken)

- [ ] **Formular lädt:** **https://sh-stiftung-forms.de/formular/** im Browser
      öffnen — es erscheint „Abschnitt 1 von 8: Zur Person".
- [ ] **Logo erscheint:** oben links im Formular ist das Bienen-Logo zu sehen.
- [ ] **Alle 8 Abschnitte durchklickbar:** mit „Weiter" bzw. „Abschnitt
      überspringen" von Abschnitt 1 bis 8 durchgehen — die Fortschrittsanzeige
      zählt bis „8 von 8".
- [ ] **PDF wird erzeugt und enthält das Logo:** einen Namen eintragen, bis zum
      Ende gehen, auf **„PDF herunterladen"** klicken. Das PDF öffnet sich, zeigt
      oben „Stammdatenblatt und Wünsche des Kunden" und in der **Kopfzeile das
      Logo** sowie unten die Fußzeile mit Anschrift und „Seite X von Y".
- [ ] **HTTPS-Weiterleitung greift:** testweise **http://sh-stiftung-forms.de/formular/**
      (mit `http`) aufrufen — die Adresse wechselt von selbst auf **https://**
      (Schloss-Symbol).
- [ ] **Zwischenspeicher-Löschknopf funktioniert:** auf **„Alle Daten von diesem
      Gerät löschen"** klicken, die Sicherheitsfrage bestätigen — das Formular
      startet wieder leer bei Abschnitt 1.
- [ ] **Datenschutzseite:** unten auf „Datenschutzhinweis (Entwurf)" klicken —
      **datenschutz.html** öffnet sich.
- [ ] **Kein Verzeichnislisting:** **https://sh-stiftung-forms.de/formular/vendor/**
      aufrufen — es erscheint **keine** Dateiliste (sondern „Forbidden" o. Ä.).

Wenn alle Punkte abgehakt sind, ist die Auslieferung fertig.

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
