# ABGLEICH — Registry (`fields.js`) gegen die beiden PDF-Vorlagen

> Erstellt nach vollständigem Lesen beider PDFs (Seite für Seite) und Vergleich
> mit jedem Feld in `fields.js`. **In diesem Schritt wurde nichts am Code
> geändert.** Dies ist nur die Befund-Liste zur Entscheidung.
>
> Quell-Kürzel:
> **W** = „Checkliste: Wünsche des Kunden" (2 Seiten) ·
> **S** = „Stammdatenblatt Kunde 09/2024" (8 Seiten)
>
> Kurzbilanz: Die **einfachen Kopf-/Identitätsfelder stimmen gut**. Die großen
> Abweichungen liegen darin, dass die Vorlagen an vielen Stellen **feste
> Ankreuz-Optionen** vorgeben, wo die Registry ein **freies Textfeld** hat
> (v. a. Abschnitt 3, 4 und der ganze Pflege-Block Abschnitt 6). Außerdem sind
> Teile der internen Blöcke (Antragstellungs-Tabelle, BeWo Nr. 10) nur
> pauschal abgebildet.

---

## a) In den PDFs vorhanden, in `fields.js` FEHLEND

### Kundenseitig (sollten ins Formular)

| Vorlage | Seite | Wortlaut | Bemerkung |
|---|---|---|---|
| W | 1 | „Alter: ____ bis ____ Jahre" (unter *Assistenz*) | **Echtes fehlendes Feld:** gewünschte Altersspanne der Assistenzkraft (`wunsch_assistenz_alter_von/bis`). |
| W | 1 | „Sonstiges" (Block *Organisation*) | Freitext ohne Entsprechung. |
| W | 2 | „Sonstige" (Tabelle *Wünsche zur Pflege*) | Freitext ohne Entsprechung. |
| W | 2 | „Anbindung an den öffentlichen Nahverkehr: … Linie: ____  Name der Haltestelle: ____" | `oepnv` erfasst nur die Grobauswahl; **Linie** und **Haltestelle** fehlen. |
| W | 1 | „Datum:" (Kopf der Checkliste) | Datum des Wunschbogens — fehlt (evtl. intern). |
| S | 4 | „Nachweis der Betreuung/ Bevollmächtigung — □ liegt vor / □ liegt nicht vor" | Feld `betreuer_nachweis` fehlt. |
| S | 4 | „2. Angehörige … Adresse/ Tel." | Bei `angehoerige_*` fehlt ein **Adressfeld** (nur Telefon vorhanden). |
| S | 4 | „3. Sonstige Pflege-/ Betreuungsperson … Verhältnis zur/m Ratsuchenden" | Bei `betreuungsperson_*` fehlt **Verhältnis** und **Adresse**. |
| S | 5 | „Positionswechsel … □ Pflegebett vorhanden?" und „bevorzugte Liegeposition: rechts/links/Rücken/Bauch" | Diese Detailfelder fehlen. |
| S | 6 | „digitales Ausräumen" (Behandlungspflege) | **Echtes fehlendes Feld** — keine Entsprechung in Abschnitt 6. |

### Intern (Registry-Eintrag ja, im Formular ausgeblendet — aktuell nicht abgebildet)

| Vorlage | Seite | Wortlaut | Bemerkung |
|---|---|---|---|
| S | 1 | Antragstellungs-Tabelle, Zeilen: „Antrag für Assistenz / weitere? Kostenträger?", „Antrag PB oder Sachleistung?", „Arbeitsassistenz erforderlich?", „Antrag auf Fachleistungsstunden gewünscht? (Bewo)", „Örtlicher / überörtlicher Sozialhilfeträger", „Werkstattzeiten vorhanden?", „Behandlungspflege über Assistenz / Pflegedienst?", „Krankenkasse", „Abrechnung Pflegeberatung / Hilfsmittelberatung", „Abrechnung Pflegeschulung für Assistent*innen", „Bemerkungen" | Nur `int_antrag_kostentraeger`, `…_45_sgb_xi`, `…_37_3_sgb_xi`, `…_restpflegegeld`, `…_erwuenscht`, `…_erledigt` existieren. **Der Großteil der Antragstellungs-Zeilen fehlt.** |
| S | 7 | „Haushaltsvorstand (ja/nein)", „Anzahl Kinder", „Anzahl der Kinder, die im Haushalt leben" | BeWo Nr. 10 — fehlen. |
| S | 7 | „Kennt der Klient BeWo? Liegt Wechsel des BeWo-Anbieters vor? Hat es schon einmal BeWo gegeben?" | BeWo — fehlt. |
| S | 7 | „In welchem Ausmaß ist die Teilhabe eingeschränkt?" / „Welche Hilfen wurden bisher schon in Anspruch genommen/ beantragt?" | BeWo — fehlen. |
| S | 7 | „Weitere Krankheitsanamnese/Vorgeschichte: Medikation / stationäre Aufenthalte / Rehamaßnahmen" | BeWo — fehlen. |
| S | 8 | „Beschützende Maßnahmen (WfbM, Arbeitstherapie …)", „Was wird von BeWo erwartet?" | BeWo — fehlen. |

---

## b) In `fields.js` vorhanden, in den PDFs GAR NICHT (erfunden)

| id | Grund | Empfehlung |
|---|---|---|
| `aufzug` | „Aufzug" kommt in keiner Vorlage vor (S.3 nennt nur „Etage:"). | **Behalten** — sinnvolle, barrierearme Ergänzung; alternativ `deprecated`. Entscheidung Sozialhummel. |
| `int_bewo_leistungsart` | Kein solcher Begriff im BeWo-Block (S.7/8). Platzhalter aus der ersten Fassung. | **Ersetzen** durch die echten BeWo-Felder aus (a); bis dahin `deprecated`. |
| `int_bewo_kostentraeger` | Dito — im BeWo-Block nicht vorhanden. | **Ersetzen/`deprecated`.** |
| `int_bewo_umfang` | Dito — „Umfang/Fachleistungsstunden" steht so nicht im BeWo-Block. | **Ersetzen/`deprecated`.** |
| `adresse_plz`, `adresse_ort` | S.1 hat nur eine Zeile „Adresse:". Aufteilung in Straße/PLZ/Ort ist eine Verfeinerung, kein echtes Erfinden. | **Behalten** (bessere Erfassung). |
| `wunsch_assistenz_sonstiges` | Kein wörtliches Pendant; W.1/W.2 haben aber „Sonstiges"/„Sonstige". | **Behalten** (deckt „Sonstiges" ab). |
| `int_bewo_sonstiges` | Catch-all, kein wörtliches Pendant. | **Behalten** als Auffang, sobald echte BeWo-Felder ergänzt sind. |

> Hinweis: Es wurde **nichts** gelöscht — diese Liste ist nur ein Vorschlag.
> Gemäß Projektregel „additiv arbeiten" würde ein Entfernen ohnehin nur über
> `deprecated: true` erfolgen.

---

## c) Label / Typ / Auswahlmöglichkeiten WEICHEN AB

> Muster „Vorlage sagt X → Registry sagt Y".

### Bedeutungs-/Label-Abweichungen (inhaltlich wichtig)

| id | Vorlage (Quelle) | Registry |
|---|---|---|
| `patientenverfuegung` | W.1: „**Beratung / Unterstützung bei der Erstellung** einer Patientenverfügung" — ja/nein (Wunsch nach Hilfe) | „**Haben Sie** eine Patientenverfügung?" — ja/nein/in Arbeit (Besitz). **Andere Frage.** |
| `vorsorgevollmacht` | W.1: „**Beratung / Unterstützung bei der Erstellung** einer Vorsorgevollmacht" — ja/nein | „**Haben Sie** eine Vorsorgevollmacht?" — ja/nein/in Arbeit. **Andere Frage.** |
| `attest_krankenhaus` | W.1: „Unterstützung bei der Bereitstellung eines Attestes zur Assistenz im Krankenhaus" — **ja/nein** | „Attest für den Krankenhaus-Aufenthalt" — **Textarea**. Typ + Bedeutung. |
| `notfallplanung` | S.1: „Wer kümmert sich um den Kunden, wenn das gesamte Team wegen Krankheit ausfällt? (Notfallplanung)" | Label nur „Notfallplanung". Inhalt passt, Wortlaut kürzer. |

### Typ-Abweichung: Vorlage = Auswahl/Ankreuzen, Registry = Freitext

| id | Vorlage-Optionen (Quelle) | Registry-Typ |
|---|---|---|
| `sprache_kunde` | S.3: □ Übersetzer notwendig · □ verständliches Sprechen · □ verstehen · □ über Talker | `text` (frei) |
| `rauchen_kunde` | S.3: □ Raucher*in · □ Raucherhaushalt · □ nur draußen | `select` Ja/Nein |
| `familienstand` | S.3: ledig / verheiratet / verwitwet / geschieden / getrennt lebend / verpartnert | `text` (frei) |
| `lebenssituation` | S.3: alleinlebend / Partnerschaft / Angehörige / Wohngemeinschaft | `text` (frei) |
| `pflegeleistungen` | S.3: keine / Pflegegeld / Pflegesachleistungen / Kombileistungen / Persönliches Budget | `textarea` (frei) |
| `wohnsituation_aktuell` / `wohnsituation_gewuenscht` | S.3: Wohnung / Haus / Betreutes Wohnen / Alten-/behindertengerechtes Wohnen / Senioren-/Pflegeheim (je „derzeit" und „gewünscht") | `textarea` (frei) |
| `wunsch_assistenz_deutsch` | W.1: ausreichend (verstehen) / gut (verstehen/sprechen) / sehr gut (verhandlungssicher) | `text` (frei) |
| `wunsch_assistenz_pflegeerfahrung` | W.1: wichtig / weniger wichtig / zwingend erforderlich | `select` egal/Ja/Nein |
| `wunsch_assistenz_rauchen` | W.1: drinnen / draußen / außerhalb der Dienstzeiten / nur Nichtraucher | `select` egal / „Ja, darf rauchen" / „Nein, bitte nicht" |
| `wunsch_assistenz_fuehrerschein` | W.2: „Führerschein bzw. ein Auto und Fahrerfahrung (evtl. auch größere Fahrzeuge)?" (Freitextzeilen) | `select` egal/Ja/Nein |
| `oepnv` | W.2: □ Bus · □ Bahn · □ nein (+ Linie + Haltestelle) | `text` (frei) |
| `psychische_belastungen` | S.6: □ psychische Störung/Depressionen · □ Ängste, Panikattacken · □ Suchtverhalten · □ Störung Impulskontrolle | `textarea` (frei) |

### Abschnitt 6 (Pflege): Vorlage sehr differenziert, Registry je 1 Freitext

Die Vorlage (S.5/S.6) gibt zu jeder Position feste Ankreuz-Listen vor; die
Registry hat je Position nur ein `textarea` + den `…_selbststaendig`-Schalter.
Der **Schalter „weitgehend selbstständig" stimmt** überall mit der Vorlage
überein; die **Detail-Optionen fehlen** bzw. sind zu Freitext zusammengefasst:

| id | Vorlage-Optionen (S.5/S.6, Auszug) |
|---|---|
| `positionswechsel` | im Bett / im Rollstuhl; Liegeposition rechts/links/Rücken/Bauch; Pflegebett vorhanden? |
| `transfer_hilfsmittel` | kinästhetisch / mit Lifter / Rückenstützgürtel / Hebegurt / Lagerungstuch / Deckenlifter |
| `fortbewegung` | mit Rollstuhl / anderes Hilfsmittel |
| `treppensteigen` | nicht möglich / mit Hilfsmittel / mit personeller Hilfe |
| `koerperpflege` | Duschen / Baden / am Waschbecken / im Bett / aktivierende Pflege; komplette Hilfe / Teilleistungen |
| `ausscheidung` | kontinent / inkontinent; Mobilisation WC / Toilettenstuhl / Intimhygiene / Bekleidung; Verstopfung/Durchfall; Inkontinenzartikel / suprapubischer Dauerkatheter / künstlicher Darmausgang |
| `ernaehrung` | besondere Kost; Zubereitung Assistenz / Essen auf Rädern / selbstständig; angereicht / vorbereitet; besonderes Besteck / Strohhalm / Schluckstörung / Magensonde (PEG) |
| `medikamente` | oral / Magensonde (PEG) / rektal / Spritzen (i.v./i.m./s.c.) / Sonstiges; „wer stellt die Medikamente" |
| `hilfsmittel` | Kompressionsstrümpfe / Orthesen / Hörgeräte / Brille / Sonstiges |
| `beatmung` | Sauerstoff / Hustenassistent |
| `werte_kontrolle` | SpO² / Blutdruck / Blutzucker / Sonstiges |

### Options-Abweichungen im Detail

| id | Vorlage | Registry |
|---|---|---|
| `pflegegrad_gewuenscht` | S.3: **kein PG** / 1 / 2 / 3 / 4 / 5 | 1 / 2 / 3 / 4 / 5 — **„kein PG" fehlt**. |
| `geschlecht` | S.1: „(m/w)" | weiblich / männlich / **divers / keine Angabe** (Registry erweitert). |
| `wunsch_assistenz_geschlecht` | W.1: männlich / weiblich / **unwichtig** | egal / weiblich / männlich (Label „unwichtig" → „Ist mir egal"). |
| `betreuer_bereiche` | S.4: Gesundheitssorge / Aufenthaltsbestimmung / **Vertretung bei Behörden** / **Vermögensvorsorge** / **Post- und Fernmeldeverkehr** | Gesundheitssorge / Aufenthaltsbestimmung / Vermögens**sorge** / **Behörden und Ämter** / **Wohnungsangelegenheiten**. Drei Optionen weichen ab. |
| `merkzeichen` | S.3: „Merkzeichen:" (ohne Liste) | Standardliste G/aG/B/H/Bl/Gl/RF/TBl (Registry-Ergänzung). |
| `int_flyer_ausgehaendigt` | S.2: „Flyer / **Broschüre** ausgehändigt?" — ja/nein/**später** | Label nur „Flyer"; Typ `checkbox` (2-wertig statt 3-wertig). |
| `int_wuensche_ausgefuellt`, `int_vertrag_ausgehaendigt` | S.2: ja/nein/**später** | `checkbox` (2-wertig). |

---

## d) Korrekt übernommen (nur IDs)

```
name, geburtsdatum, telefon, email,
hauptdiagnose, nebendiagnosen, groesse, gewicht,
krankenversicherung, kv_nummer, kostentraeger, aktenzeichen,
pflegegrad_aktuell, gdb, gleichstellung, etage, haustiere,
rueckzugsraum, foto_freigabe,
wundversorgung, einmalkatheter, notfallplanung,
ziele_wo, ziele_veraenderung,
wunsch_assistenz_tagesablauf, wunsch_assistenz_freizeit,
angehoerige_vorhanden, angehoerige_name, angehoerige_verhaeltnis, angehoerige_telefon,
betreuungsperson_vorhanden, betreuungsperson_name, betreuungsperson_telefon,
betreuer_vorhanden, betreuer_name, betreuer_telefon,
hausarzt_vorhanden, hausarzt_name, hausarzt_telefon,
fachaerzte_vorhanden, fachaerzte_liste,
pflegedienst_vorhanden, pflegedienst_name, pflegedienst_telefon,
sonstige_dienste_vorhanden, sonstige_dienste_beschreibung,
int_datenerfassung_am, int_datenerfassung_durch,
int_wichtig_nicht_gefragt,
int_antrag_kostentraeger, int_antrag_erwuenscht, int_antrag_erledigt,
int_antrag_45_sgb_xi, int_antrag_37_3_sgb_xi, int_antrag_restpflegegeld
```

Die `…_selbststaendig`-Schalter in Abschnitt 6 sind ebenfalls vorlagentreu
(Vorlage: „□ weitgehend selbstständig"); ihre zugehörigen Detail-Textfelder
stehen wegen der Options-Abweichung oben unter **c)**.

---

## Vorschlag für den nächsten Schritt (nur zur Abstimmung, noch nichts geändert)

1. **Echte Fehlfelder ergänzen** (a): `wunsch_assistenz_alter_von/bis`,
   `digitales Ausräumen`, `betreuer_nachweis`, ÖPNV-Linie/Haltestelle,
   Adress-/Verhältnisfelder der Kontaktpersonen, Positionswechsel-Details.
2. **Freitext → Auswahl** dort, wo die Vorlage feste Optionen hat (c) — als
   `select`/`checkboxgroup`; die bisherigen Freitextfelder bleiben additiv als
   „Sonstiges/eigene Angaben" erhalten.
3. **Antragstellungs-Tabelle und BeWo-Block** (a, intern) vollständig als
   `audience: "intern"` nachbilden; die Platzhalter `int_bewo_*` aus (b) dann
   `deprecated` setzen.
4. `patientenverfuegung` / `vorsorgevollmacht` / `attest_krankenhaus`:
   entscheiden, ob „Besitz" **oder** „Wunsch nach Unterstützung" (Vorlage)
   gemeint ist — ggf. beides als getrennte Felder.

**Es wurde in diesem Schritt nichts an `fields.js`, `index.html` oder anderem
Code geändert.** Bitte um Ihr OK bzw. Ihre Priorisierung.
