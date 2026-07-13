# ANALYSE — Feldanalyse beider Vorlagen

> **Status / wichtiger Hinweis:** Zum Zeitpunkt dieser Analyse lagen die beiden
> PDF-Vorlagen **nicht** im Repository (`vorlagen/` war leer). Die Feldliste
> unten ist deshalb **aus der Feldspezifikation im Auftrag abgeleitet** und noch
> **gegen die Original-PDFs zu prüfen**, sobald diese vorliegen. Exakte
> Seitenzahlen konnten daher nicht zitiert werden — die Quellenspalte nennt das
> vermutete Ursprungsdokument.
>
> Legende Quelle:
> **W** = „Wünsche des Kunden" (2 Seiten) · **S** = „Stammdatenblatt Kunde 09/2024" (8 Seiten)
> · **W+S** = zusammengeführte Dublette · **(neu)** = im Auftrag ergänzt.

## 1. Zusammenfassung

- Felder gesamt: **112**
- davon `audience: kunde` (im Formular sichtbar): **96**
- davon `audience: intern` (nur Registry, nicht angezeigt): **16**
- Pflichtfeld: **nur `name`**
- als `sensitive` (Gesundheit/psychisch, immer freiwillig) markiert: **27**
- Felder mit Anzeigebedingung `showIf`: **27**

Die vollständige, maschinenlesbare Wahrheit steht in `fields.js`. Diese Datei ist
eine menschenlesbare Ableitung davon.

## 2. Zusammengeführte Dubletten

Diese Felder kommen in beiden Vorlagen vor und wurden zu **einer** id vereinigt:

| Wünsche des Kunden (W) | Stammdatenblatt (S) | Neue id | Quelle |
|---|---|---|---|
| Name, Vorname | Name, Vorname | `name` | W+S |
| Diagnose | Hauptdiagnose | `hauptdiagnose` | W+S |
| Relevante Nebenerkrankungen | Nebendiagnosen | `nebendiagnosen` | W+S |
| Pflegegrad | Derzeitiger Pflegegrad | `pflegegrad_aktuell` | W+S |
| Gewicht / Größe | Größe / Gewicht | `groesse`, `gewicht` | W+S |
| Transfer – Hilfsmittel | Nr. 9 Transfer | `transfer_hilfsmittel` | W+S |
| Beatmung / Sauerstoff | Nr. 9 Beatmung | `beatmung` | W+S |
| Dekubitus / chronische Wunden | Nr. 9 Verbände von Wunden | `wundversorgung` | W+S |
| Spezielle Medikamente | Nr. 9 Medikamentengabe | `medikamente` | W+S |

## 3. Felder, die NUR ähnlich aussehen und NICHT zusammengelegt wurden

| Thema | Kunde selbst (S) | Anforderung an Assistenzkraft (W) |
|---|---|---|
| Geschlecht | `geschlecht` | `wunsch_assistenz_geschlecht` |
| Rauchen | `rauchen_kunde` | `wunsch_assistenz_rauchen` |
| Sprache | `sprache_kunde` | `wunsch_assistenz_deutsch` |
| Pflegeerfahrung | — | `wunsch_assistenz_pflegeerfahrung` |

Alle Anforderungen an die Assistenzkraft tragen das Präfix `wunsch_assistenz_`.

## 4. Interne Felder (`audience: intern` — nicht im Kundenformular)

Diese Felder bleiben in der Registry erhalten, werden aber vom Renderer
übersprungen (nicht gelöscht):

- **Tabelle „Antragstellung"**: `int_antrag_kostentraeger`,
  `int_antrag_erwuenscht`, `int_antrag_erledigt`, `int_antrag_45_sgb_xi`,
  `int_antrag_37_3_sgb_xi`, `int_antrag_restpflegegeld`
- **Datenerfassung**: `int_datenerfassung_am`, `int_datenerfassung_durch`
- **Interne Checkliste**: `int_wuensche_ausgefuellt`, `int_vertrag_ausgehaendigt`,
  `int_flyer_ausgehaendigt`, `int_wichtig_nicht_gefragt`
- **BeWo-Block Nr. 10** (außer den Zielfragen): `int_bewo_leistungsart`,
  `int_bewo_kostentraeger`, `int_bewo_umfang`, `int_bewo_sonstiges`
  — die genauen BeWo-Unterfelder sind **gegen die PDF zu prüfen**.

**Ausnahme:** Die Zielfragen aus Nr. 10 bleiben beim Kunden:
`ziele_wo` („Wo liegen die Ziele?") und `ziele_veraenderung`
(„Was möchten Sie wie verändern?").

## 5. Vollständige Feldliste nach Abschnitt


#### Abschnitt 1 — Zur Person

| id | Feld | Typ | audience | sensitive | Bedingung (showIf) |
|---|---|---|---|---|---|
| `name` | Name und Vorname | text | kunde | – | – |
| `geburtsdatum` | Geburtsdatum | date | kunde | – | – |
| `geschlecht` | Geschlecht | select | kunde | – | – |
| `adresse_strasse` | Straße und Hausnummer | text | kunde | – | – |
| `adresse_plz` | Postleitzahl | text | kunde | – | – |
| `adresse_ort` | Ort | text | kunde | – | – |
| `telefon` | Telefon | tel | kunde | – | – |
| `email` | E-Mail | email | kunde | – | – |
| `int_datenerfassung_am` | Datenerfassung am | date | intern | – | – |
| `int_datenerfassung_durch` | Datenerfassung durch | text | intern | – | – |

#### Abschnitt 2 — Gesundheit und Diagnosen

| id | Feld | Typ | audience | sensitive | Bedingung (showIf) |
|---|---|---|---|---|---|
| `hauptdiagnose` | Hauptdiagnose | textarea | kunde | ja | – |
| `nebendiagnosen` | Nebendiagnosen / weitere Erkrankungen | textarea | kunde | ja | – |
| `groesse` | Körpergröße | text | kunde | ja | – |
| `gewicht` | Körpergewicht | text | kunde | ja | – |
| `rauchen_kunde` | Rauchen Sie? | select | kunde | ja | – |
| `sprache_kunde` | Muttersprache / Sprache im Alltag | text | kunde | – | – |
| `psychische_belastungen` | Psychische Belastungen | textarea | kunde | ja | – |

#### Abschnitt 3 — Versicherung und Leistungen

| id | Feld | Typ | audience | sensitive | Bedingung (showIf) |
|---|---|---|---|---|---|
| `krankenversicherung` | Krankenversicherung | text | kunde | – | – |
| `kv_nummer` | Versichertennummer | text | kunde | – | – |
| `kostentraeger` | Kostenträger | text | kunde | – | – |
| `aktenzeichen` | Aktenzeichen | text | kunde | – | – |
| `pflegegrad_aktuell` | Derzeitiger Pflegegrad | select | kunde | ja | – |
| `pflegegrad_gewuenscht` | Gewünschter / beantragter Pflegegrad | select | kunde | ja | – |
| `pflegeleistungen` | Pflegeleistungen, die Sie schon bekommen | textarea | kunde | ja | – |
| `gdb` | Grad der Behinderung (GdB) | text | kunde | ja | – |
| `gleichstellung` | Gleichstellung | select | kunde | – | – |
| `merkzeichen` | Merkzeichen | checkboxgroup | kunde | ja | – |
| `int_antrag_kostentraeger` | Antragstellung: Kostenträger | text | intern | – | – |
| `int_antrag_erwuenscht` | Antragstellung: Erwünscht? | checkbox | intern | – | – |
| `int_antrag_erledigt` | Antragstellung: Erledigt? | checkbox | intern | – | – |
| `int_antrag_45_sgb_xi` | Antragstellung: §45 SGB XI | text | intern | – | – |
| `int_antrag_37_3_sgb_xi` | Antragstellung: §37.3 SGB XI | text | intern | – | – |
| `int_antrag_restpflegegeld` | Antragstellung: Restpflegegeld | text | intern | – | – |

#### Abschnitt 4 — Wohnen und Umfeld

| id | Feld | Typ | audience | sensitive | Bedingung (showIf) |
|---|---|---|---|---|---|
| `wohnsituation_aktuell` | Wie wohnen Sie zurzeit? | textarea | kunde | – | – |
| `wohnsituation_gewuenscht` | Wie möchten Sie gerne wohnen? | textarea | kunde | – | – |
| `etage` | In welcher Etage wohnen Sie? | text | kunde | – | – |
| `aufzug` | Gibt es einen Aufzug? | select | kunde | – | – |
| `lebenssituation` | Mit wem leben Sie zusammen? | text | kunde | – | – |
| `familienstand` | Familienstand | text | kunde | – | – |
| `oepnv` | Anbindung an Bus und Bahn | text | kunde | – | – |
| `rueckzugsraum` | Gibt es einen Rückzugsraum für die Assistenzkraft? | select | kunde | – | – |
| `haustiere` | Haustiere | text | kunde | – | – |
| `int_bewo_leistungsart` | BeWo: Leistungsart | text | intern | – | – |
| `int_bewo_kostentraeger` | BeWo: Kostenträger | text | intern | – | – |
| `int_bewo_umfang` | BeWo: Umfang / Fachleistungsstunden | text | intern | – | – |
| `int_bewo_sonstiges` | BeWo: Sonstiges | textarea | intern | – | – |

#### Abschnitt 5 — Kontaktpersonen

| id | Feld | Typ | audience | sensitive | Bedingung (showIf) |
|---|---|---|---|---|---|
| `angehoerige_vorhanden` | Ich möchte Angehörige angeben | checkbox | kunde | – | – |
| `angehoerige_name` | Angehörige: Name | text | kunde | – | `angehoerige_vorhanden=true` |
| `angehoerige_verhaeltnis` | Angehörige: Verhältnis zu Ihnen | text | kunde | – | `angehoerige_vorhanden=true` |
| `angehoerige_telefon` | Angehörige: Telefon | tel | kunde | – | `angehoerige_vorhanden=true` |
| `betreuungsperson_vorhanden` | Es gibt eine weitere Betreuungsperson | checkbox | kunde | – | – |
| `betreuungsperson_name` | Betreuungsperson: Name | text | kunde | – | `betreuungsperson_vorhanden=true` |
| `betreuungsperson_telefon` | Betreuungsperson: Telefon | tel | kunde | – | `betreuungsperson_vorhanden=true` |
| `betreuer_vorhanden` | Ich habe einen gesetzlichen Betreuer | checkbox | kunde | – | – |
| `betreuer_name` | Gesetzlicher Betreuer: Name | text | kunde | – | `betreuer_vorhanden=true` |
| `betreuer_telefon` | Gesetzlicher Betreuer: Telefon | tel | kunde | – | `betreuer_vorhanden=true` |
| `betreuer_bereiche` | Wofür ist der Betreuer zuständig? | checkboxgroup | kunde | – | `betreuer_vorhanden=true` |
| `hausarzt_vorhanden` | Ich möchte meinen Hausarzt angeben | checkbox | kunde | – | – |
| `hausarzt_name` | Hausarzt: Name | text | kunde | – | `hausarzt_vorhanden=true` |
| `hausarzt_telefon` | Hausarzt: Telefon | tel | kunde | – | `hausarzt_vorhanden=true` |
| `fachaerzte_vorhanden` | Ich möchte Fachärzte angeben | checkbox | kunde | – | – |
| `fachaerzte_liste` | Fachärzte | textarea | kunde | – | `fachaerzte_vorhanden=true` |
| `pflegedienst_vorhanden` | Ein Pflegedienst hilft mir | checkbox | kunde | – | – |
| `pflegedienst_name` | Pflegedienst: Name | text | kunde | – | `pflegedienst_vorhanden=true` |
| `pflegedienst_telefon` | Pflegedienst: Telefon | tel | kunde | – | `pflegedienst_vorhanden=true` |
| `sonstige_dienste_vorhanden` | Es gibt weitere Dienste oder Helfer | checkbox | kunde | – | – |
| `sonstige_dienste_beschreibung` | Weitere Dienste | textarea | kunde | – | `sonstige_dienste_vorhanden=true` |

#### Abschnitt 6 — Unterstützungsbedarf

| id | Feld | Typ | audience | sensitive | Bedingung (showIf) |
|---|---|---|---|---|---|
| `positionswechsel_selbststaendig` | Positionswechsel: Ich komme weitgehend allein zurecht | checkbox | kunde | – | – |
| `positionswechsel` | Positionswechsel: Wobei brauchen Sie Hilfe? | textarea | kunde | ja | `positionswechsel_selbststaendig=false` |
| `transfer_hilfsmittel_selbststaendig` | Transfer: Ich komme weitgehend allein zurecht | checkbox | kunde | – | – |
| `transfer_hilfsmittel` | Transfer: Hilfe und Hilfsmittel | textarea | kunde | ja | `transfer_hilfsmittel_selbststaendig=false` |
| `fortbewegung_selbststaendig` | Fortbewegung: Ich komme weitgehend allein zurecht | checkbox | kunde | – | – |
| `fortbewegung` | Fortbewegung: Wobei brauchen Sie Hilfe? | textarea | kunde | ja | `fortbewegung_selbststaendig=false` |
| `treppensteigen_selbststaendig` | Treppensteigen: Ich komme weitgehend allein zurecht | checkbox | kunde | – | – |
| `treppensteigen` | Treppensteigen: Wobei brauchen Sie Hilfe? | textarea | kunde | ja | `treppensteigen_selbststaendig=false` |
| `koerperpflege_selbststaendig` | Körperpflege: Ich komme weitgehend allein zurecht | checkbox | kunde | – | – |
| `koerperpflege` | Körperpflege: Wobei brauchen Sie Hilfe? | textarea | kunde | ja | `koerperpflege_selbststaendig=false` |
| `ausscheidung_selbststaendig` | Toilette / Ausscheidung: Ich komme weitgehend allein zurecht | checkbox | kunde | – | – |
| `ausscheidung` | Toilette / Ausscheidung: Wobei brauchen Sie Hilfe? | textarea | kunde | ja | `ausscheidung_selbststaendig=false` |
| `ernaehrung_selbststaendig` | Essen und Trinken: Ich komme weitgehend allein zurecht | checkbox | kunde | – | – |
| `ernaehrung` | Essen und Trinken: Wobei brauchen Sie Hilfe? | textarea | kunde | ja | `ernaehrung_selbststaendig=false` |
| `medikamente_selbststaendig` | Medikamente: Ich komme weitgehend allein zurecht | checkbox | kunde | – | – |
| `medikamente` | Medikamente: Wobei brauchen Sie Hilfe? | textarea | kunde | ja | `medikamente_selbststaendig=false` |
| `hilfsmittel_selbststaendig` | Hilfsmittel: Ich komme weitgehend allein zurecht | checkbox | kunde | – | – |
| `hilfsmittel` | Hilfsmittel: Welche nutzen Sie und wobei brauchen Sie Hilfe? | textarea | kunde | ja | `hilfsmittel_selbststaendig=false` |
| `wundversorgung_selbststaendig` | Wundversorgung: Ich komme weitgehend allein zurecht | checkbox | kunde | – | – |
| `wundversorgung` | Wundversorgung: Wobei brauchen Sie Hilfe? | textarea | kunde | ja | `wundversorgung_selbststaendig=false` |
| `beatmung_selbststaendig` | Beatmung / Sauerstoff: Ich komme weitgehend allein zurecht | checkbox | kunde | – | – |
| `beatmung` | Beatmung / Sauerstoff: Wobei brauchen Sie Hilfe? | textarea | kunde | ja | `beatmung_selbststaendig=false` |
| `werte_kontrolle_selbststaendig` | Werte kontrollieren: Ich komme weitgehend allein zurecht | checkbox | kunde | – | – |
| `werte_kontrolle` | Werte kontrollieren: Wobei brauchen Sie Hilfe? | textarea | kunde | ja | `werte_kontrolle_selbststaendig=false` |
| `einmalkatheter_selbststaendig` | Einmalkatheter: Ich komme weitgehend allein zurecht | checkbox | kunde | – | – |
| `einmalkatheter` | Einmalkatheter: Wobei brauchen Sie Hilfe? | textarea | kunde | ja | `einmalkatheter_selbststaendig=false` |

#### Abschnitt 7 — Wünsche an die Assistenzkraft

| id | Feld | Typ | audience | sensitive | Bedingung (showIf) |
|---|---|---|---|---|---|
| `wunsch_assistenz_geschlecht` | Gewünschtes Geschlecht der Assistenzkraft | select | kunde | – | – |
| `wunsch_assistenz_rauchen` | Darf die Assistenzkraft rauchen? | select | kunde | – | – |
| `wunsch_assistenz_deutsch` | Geforderte Deutschkenntnisse der Assistenzkraft | text | kunde | – | – |
| `wunsch_assistenz_pflegeerfahrung` | Soll die Assistenzkraft Pflegeerfahrung haben? | select | kunde | – | – |
| `wunsch_assistenz_fuehrerschein` | Soll die Assistenzkraft einen Führerschein haben? | select | kunde | – | – |
| `wunsch_assistenz_tagesablauf` | Ihr Tagesablauf | textarea | kunde | – | – |
| `wunsch_assistenz_freizeit` | Freizeit und gemeinsame Aktivitäten | textarea | kunde | – | – |
| `wunsch_assistenz_sonstiges` | Weitere Wünsche an die Assistenzkraft | textarea | kunde | – | – |

#### Abschnitt 8 — Abschluss

| id | Feld | Typ | audience | sensitive | Bedingung (showIf) |
|---|---|---|---|---|---|
| `ziele_wo` | Wo liegen Ihre Ziele? | textarea | kunde | – | – |
| `ziele_veraenderung` | Was möchten Sie wie verändern? | textarea | kunde | – | – |
| `patientenverfuegung` | Haben Sie eine Patientenverfügung? | select | kunde | ja | – |
| `vorsorgevollmacht` | Haben Sie eine Vorsorgevollmacht? | select | kunde | – | – |
| `attest_krankenhaus` | Attest für den Krankenhaus-Aufenthalt | textarea | kunde | ja | – |
| `notfallplanung` | Notfallplanung | textarea | kunde | ja | – |
| `foto_freigabe` | Dürfen wir für die Stellenanzeige ein Foto verwenden? | select | kunde | – | – |
| `int_wuensche_ausgefuellt` | Wünsche des Kunden ausgefüllt? | checkbox | intern | – | – |
| `int_vertrag_ausgehaendigt` | Vertrag ausgehändigt? | checkbox | intern | – | – |
| `int_flyer_ausgehaendigt` | Flyer ausgehändigt? | checkbox | intern | – | – |
| `int_wichtig_nicht_gefragt` | Was ist wichtig, was ich nicht gefragt habe? | textarea | intern | – | – |

## 6. Noch gegen die PDFs zu prüfen (offene Punkte)

Sobald die beiden PDFs in `vorlagen/` liegen, sind abzugleichen:

1. **Genaue BeWo-Unterfelder (Nr. 10)** — hier vorerst als `int_bewo_*`
   zusammengefasst.
2. **Exakte Options-/Antwortmöglichkeiten** einzelner Felder (z. B. Auswahllisten
   im Stammdatenblatt), die in der Papiervorlage evtl. feiner vorgegeben sind.
3. **Eventuelle Felder, die im Auftragstext nicht erwähnt** sind, aber in den
   PDFs stehen — diese wären additiv zu ergänzen.
4. **Seitenzahlen** als Quellenangabe pro Feld.

Alle Änderungen aus diesem Abgleich erfolgen **additiv** (kein Löschen, nur
ergänzen oder `deprecated` setzen).
