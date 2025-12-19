# 🗑️ Harmonogram zberu odpadu - Budatín, Žilina

Moderná webová aplikácia pre zobrazenie harmonogramu zberu odpadu v mestskej časti Budatín v Žiline na rok 2026.

## ✨ Funkcie

- 📅 Prehľadný harmonogram odvozu odpadu
- 🏘️ Filtrovanie podľa ulíc
- 📱 Export do iOS kalendára (.ics súbor)
- 🖨️ Možnosť tlače harmonogramu
- 📋 Zobrazenie formou zoznamu alebo kalendára
- 🎨 Farebné rozlíšenie typov odpadu
- 📲 Responzívny dizajn pre mobilné zariadenia

## 🗂️ Typy odpadu

- **Plast** - Plastový odpad (žltá)
- **Papier** - Papierový odpad (modrá)
- **VKM + kov** - Nápojové kartóny a kovové obaly (červená)
- **ZKO** - Zmiešaný komunálny odpad (šedá)
- **BRKO** - Biologicky rozložiteľný kuchynský odpad (hnedá)
- **Záhrada** - Zelený odpad zo záhrad (zelená)

## 🚀 Inštalácia a spustenie

### Požiadavky

- Node.js 18+
- npm alebo yarn

### Inštalácia závislostí

```bash
npm install
```

### Spustenie vývojového servera

```bash
npm run dev
```

Aplikácia bude dostupná na `http://localhost:5173`

### Build pre produkciu

```bash
npm run build
```

### Zobrazenie produkčného buildu

```bash
npm run preview
```

## 📁 Štruktúra projektu

```
niesmetibudatin/
├── src/
│   ├── components/          # React komponenty
│   │   ├── CalendarView.jsx # Kalendárové zobrazenie
│   │   ├── EventsList.jsx   # Zoznam udalostí
│   │   ├── ScheduleFilters.jsx # Filtre a export
│   │   └── WasteLegend.jsx  # Legenda typov odpadu
│   ├── App.jsx              # Hlavný komponent aplikácie
│   ├── main.jsx             # Entry point
│   ├── styles/
│   │   └── global.css       # Globálne štýly
│   └── utils/
│       ├── scheduleUtils.js # Pomocné funkcie pre harmonogram
│       └── calendarExport.js # Export do kalendára
├── waste-schedule.json      # Dáta harmonogramu
├── index.html               # HTML template
├── vite.config.js           # Vite konfigurácia
└── package.json
```

## 📱 Použitie

### Zobrazenie harmonogramu

1. Otvorte aplikáciu v prehliadači
2. Vyberte vašu ulicu z rozbaľovacieho menu
3. Zobrazia sa len odvozy relevantné pre vašu ulicu

### Export do iOS kalendára

1. Vyberte ulicu (alebo nechajte "Všetky ulice")
2. Kliknite na tlačidlo "📅 Exportovať do kalendára (iOS)"
3. Stiahnite .ics súbor
4. Otvorte súbor na iPhone/iPad
5. Kliknite "Pridať všetko" pre import do kalendára

**Poznámka:** Udalosti budú obsahovať pripomienky:
- 18 hodín pred odvozom
- 42 hodín pred odvozom (deň vopred večer)

### Prepínanie zobrazení

- **Zoznam** - Chronologický zoznam nadchádzajúcich odvozov
- **Kalendár** - Mesačné kalendárové zobrazenie s možnosťou prechádzania mesiacov

## 🛠️ Technológie

- **Vite 5** - Moderný build tool a dev server
- **React 18** - UI knižnica
- **ics** - Generovanie kalendárových súborov

## 📝 Aktualizácia dát

Dáta harmonogramu sú uložené v súbore `waste-schedule.json`. Pre aktualizáciu:

1. Upravte JSON súbor s novými dátami
2. Spustite `npm run dev` alebo `npm run build`

### Štruktúra JSON:

```json
{
  "city": "Žilina",
  "district": "Budatín",
  "year": 2026,
  "wasteTypes": { ... },
  "districts": { ... },
  "schedule": {
    "plast": {
      "1": [5, 19],  // Január: 5. a 19. deň
      "2": [3, 17],  // Február: 3. a 17. deň
      ...
    },
    ...
  }
}
```

## 🤝 Prispievanie

Návrhy na vylepšenie a pull requesty sú vítané!

## 📄 Licencia

MIT

## ⚠️ Disclaimer

Dáta sú informatívneho charakteru. Pre aktuálne a overené informácie kontaktujte Mestský úrad Žilina.

## 📞 Kontakt

Pre technické problémy vytvorte issue na GitHub repozitári.
