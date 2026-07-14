# Barrierefreiheit — Prüfbericht und Maßnahmen

> Zielgruppe des Formulars sind Menschen mit Behinderung. Ein Teil bedient es über
> Screenreader, Talker oder ausschließlich per Tastatur. Barrierefreiheit ist hier
> kein Nebenpunkt.
>
> Orientierung: **WCAG 2.1 Level AA / BITV 2.0**. Geprüft am 2026-07-14 mit echten
> Browser-Tests (Chromium) und automatisiert mit **axe-core 4.10.2**.

## Zusammenfassung

- **axe-core: 0 Verstöße** (Regelsätze wcag2a, wcag2aa, wcag21a, wcag21aa) über
  alle 8 Abschnitte, den Abschluss-Screen und den Datenschutz-Dialog — inklusive
  aktivierter bedingter Felder (Kontaktpersonen-Blöcke).
- Alle geprüften Punkte bestanden. Zwei gezielte Verbesserungen wurden ergänzt
  (Skip-Link-Fokus, Fokus auf die Abschnittsüberschrift).

## 1. Tastaturbedienung

| Prüfung | Ergebnis |
|---|---|
| Alle 8 Abschnitte ohne Maus erreichbar (nur „Weiter"/„Zurück"/„Überspringen" per Tastatur) | **bestanden** — im Test per Tastatur von Abschnitt 1 bis 8 durchlaufen |
| Sichtbarer Fokus-Ring auf allen Bedienelementen | **bestanden** — `:focus-visible` mit 3 px kräftigem Ring (Magenta), Kontrast ≥ 6,5:1 |
| Logische Tab-Reihenfolge | **bestanden** — DOM-Reihenfolge = Leserichtung; keine positiven `tabindex` |
| Skip-Link ist erstes fokussierbares Element und wird bei Fokus sichtbar | **bestanden** |
| Ausgeblendete Felder (`showIf`) sind nicht per Tab erreichbar | **bestanden** — `hidden` entfernt sie aus der Tab-Reihenfolge |

## 2. Screenreader

| Prüfung | Ergebnis |
|---|---|
| Jedes Feld hat ein korrektes Label (`<label for>`, bzw. `<fieldset><legend>` bei Mehrfachauswahl) | **bestanden** (axe: keine „label"-Verstöße) |
| Hilfetexte über `aria-describedby` mit dem Feld verknüpft | **bestanden** — jedes Feld verweist auf seine `help-<id>` |
| Fehlermeldungen werden angekündigt | **bestanden** — `#error-region` mit `role="alert"` / `aria-live="assertive"`, zusätzlich `#live-region` (`aria-live="polite"`) |
| Fehlerfelder als fehlerhaft gekennzeichnet | **bestanden** — `aria-invalid="true"` + Fehlertext via `aria-describedby` |
| Abschnittswechsel wird angekündigt | **bestanden (nachgebessert)** — Fokus springt auf die Abschnittsüberschrift „Abschnitt X von 8: …" |
| Pflichtfeld ausgewiesen | **bestanden** — `name` mit `aria-required="true"` und sichtbarer Kennzeichnung |

Hinweis: Die Hilfetexte sind **dauerhaft sichtbar** (kein „?"-Aufklapp-Button).
Das ist bewusst so — es gibt keinen zusätzlichen Bedienschritt und der Text steht
für alle sofort zur Verfügung.

## 3. Kontraste (WCAG AA: 4,5:1 Text, 3:1 große Schrift / Bedienelemente)

Gemessene Verhältnisse (Auszug), **Hell-Modus**:

| Paar | Verhältnis |
|---|---|
| Fließtext auf Weiß | 17,99:1 |
| Hilfetext (grau) auf Weiß | 8,05:1 |
| Hilfetext auf Hinweisbox | 7,10:1 |
| Primär-Grün (Links, Überschriften) auf Weiß | 7,95:1 |
| Weiß auf Primär-Button (grün) | 7,95:1 |
| Fehlerrot auf Weiß / auf Fehlerbox | 8,12:1 / 7,11:1 |
| Rahmen auf Weiß (Bedienelement, ≥ 3:1) | 4,83:1 |
| Fokusring auf Weiß (≥ 3:1) | 6,58:1 |

**Dark Mode** (`prefers-color-scheme: dark`):

| Paar | Verhältnis |
|---|---|
| Text auf Hintergrund | 16,32:1 |
| Grau auf Hintergrund | 10,66:1 |
| Primär-Grün auf Hintergrund | 9,52:1 |
| dunkler Text auf Primär-Button | 8,74:1 |
| Fehlerrot auf Hintergrund | 7,93:1 |
| Fokusring auf Hintergrund | 7,30:1 |

Alle Werte liegen deutlich über den AA-Schwellen. axe-core meldet zusätzlich keine
`color-contrast`-Verstöße auf den tatsächlich gerenderten Seiten.

## 4. Klickflächen / Zielgrößen (≥ 44 × 44 px)

- Alle sichtbaren Bedienelemente (Knöpfe, Auswahl, Eingaben, Checkbox-/Options-
  Zeilen) sind **mindestens 44 px hoch** — automatisiert geprüft, keine Ausreißer.
- Checkboxen/Optionen: die Box selbst ist 24 px, die zugehörige **klickbare Zeile
  (`<label>`) ist ≥ 44 px** hoch, sodass die gesamte Zeile als Ziel dient.
- Es gibt keine „?"-Buttons (Hilfe ist dauerhaft sichtbar), also auch dort keine zu
  kleinen Ziele.

## 5. Zoom / Vergrößerung

- Getestet bei Viewport-Breiten 640 / 480 / 360 / 320 px (entspricht starker
  Vergrößerung bzw. Handy): **kein horizontales Scrollen** (Überhang 0 px).
- Einspaltiges, responsives Layout (`max-width`, Flexbox); auf schmalen Breiten
  werden die Navigationsknöpfe voll breit gestapelt.

## 6. Reduzierte Bewegung

- `@media (prefers-reduced-motion: reduce)` schaltet Animationen, Übergänge und
  weiches Scrollen ab. Im Test mit emulierter Einstellung: Übergangsdauer der
  Fortschrittsleiste = **0 s**.

## Nachgebesserte Punkte (dieser Arbeitsschritt)

1. **Skip-Link** „Direkt zum Inhalt springen" war vorhanden; das Ziel `<main>` hat
   jetzt `tabindex="-1"`, sodass der Fokus beim Aktivieren tatsächlich in den
   Inhalt springt (nicht nur scrollt).
2. **Fokus auf die Abschnittsüberschrift**: Beim Abschnittswechsel wandert der
   Fokus jetzt auf die `<h2>`-Überschrift („Abschnitt X von 8: …", `tabindex="-1"`,
   mit sichtbarem Fokus-Rahmen). So wissen Screenreader- und Tastatur-Nutzende
   sofort, wo sie sind.

Alles additiv, keine Änderung an der Feld-Registry (`fields.js`).

## Was NICHT geprüft werden konnte (ehrlich)

Automatisierte Tests und Kontrastmessungen finden viele, aber **nicht alle**
Barrieren. Die folgenden Punkte sollte die Sozialhummel mit **echten Nutzerinnen
und Nutzern** prüfen — das ist kein Makel, sondern eine eigene Aufgabe:

- **Echter Screenreader-Test** (NVDA, JAWS, VoiceOver, TalkBack): Klingt jede
  Ansage verständlich? Ist die Reihenfolge der Vorlesung sinnvoll? Werden die
  Mehrfachauswahl-Listen und der Abschnittswechsel gut angesagt?
- **Talker / alternative Eingabegeräte**: Bedienung mit Umfeldsteuerung, Sip-and-
  Puff, Tastenfeld o. Ä.
- **Menschen mit kognitiven Einschränkungen / Lernschwierigkeiten**: Ist die
  Sprache der Hilfetexte wirklich einfach genug? Sind die Abschnitte nicht zu lang?
- **Sprachausgabe/Übersetzung** für Menschen mit geringen Deutschkenntnissen.
- **Reale mobile Geräte** (Touch, kleine Displays, ältere Browser) statt nur
  emulierter Breiten.
- **Vergrößerungssoftware** und Betriebssystem-Kontrasteinstellungen jenseits des
  Browser-Zooms.

Empfehlung: einen kleinen Test mit 3–5 Personen aus der Zielgruppe, bevor das
Formular breit ausgerollt wird.
