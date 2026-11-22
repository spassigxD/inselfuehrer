# Inselführer

Filter für die deutschen Fundlisten von **Animal Crossing: New Horizons**: Fische, Insekten und Meerestiere. Die Daten liegen im Repository (`data/critters.json` und `public/critters`), die App braucht die Quellseiten zur Laufzeit nicht.

Die Nordhalbkugel ist voreingestellt. Wo die Listen eine Südhalbkugel nennen, lässt sie sich umschalten.

## Lokal starten

```bash
npm install
npm run dev
```

Die App läuft auf Port **3847** (`http://127.0.0.1:3847`).

```bash
npm test
npm run build
```

## Filter

Auf jeder Übersicht lassen sich Monat, Uhrzeit, Fundort und Preis kombinieren.

- **Monat:** alle zwölf Monate, dazu „Aktiv in diesem Monat“ oder „Nur diesen Monat“.
- **Uhrzeit:** eine Stunde, zum Beispiel 16 Uhr für 16:00. Fenster wie 16–9 gehen über Mitternacht. Die Endstunde gilt nicht mehr: 9–16 endet um 16:00.
- **Fundort:** die Orte aus der jeweiligen Liste.
- **Preis:** mindestens, mehr als, höchstens oder weniger als ein Betrag in Sternis. „Mehr als 10.000“ lässt sich direkt einstellen.

Beispiele:

- Fische im Meer, die mehr als 10.000 Sternis wert sind
- Insekten, die im November um 16 Uhr aktiv sind
