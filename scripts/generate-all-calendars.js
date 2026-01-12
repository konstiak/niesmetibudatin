import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createEvents } from 'ics';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Funkcia pre generovanie eventov
function getAllEvents(data) {
  const events = [];
  const schedule = data.schedule;
  const year = data.year;

  Object.entries(schedule).forEach(([wasteTypeKey, monthData]) => {
    Object.entries(monthData).forEach(([month, days]) => {
      days.forEach(day => {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        let districts = [];
        let wasteType = wasteTypeKey;

        if (wasteTypeKey.startsWith('zko_')) {
          const districtNum = wasteTypeKey.split('_')[1];
          districts = data.districts[`ZKO_${districtNum}`].streets;
          wasteType = 'zko';
        } else if (wasteTypeKey.startsWith('brko_')) {
          const districtNum = wasteTypeKey.split('_')[1];
          districts = data.districts[`BRKO_${districtNum}`].streets;
          wasteType = 'brko';
        } else {
          districts = data.districts.ALL.streets;
        }

        events.push({
          date: dateStr,
          wasteType,
          wasteTypeKey,
          districts,
          wasteInfo: data.wasteTypes[wasteType]
        });
      });
    });
  });

  return events.sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Funkcia pre export do ICS
function exportToICS(events, street = null) {
  const icsEvents = events.map(event => {
    const eventDate = new Date(event.date);
    const year = eventDate.getFullYear();
    const month = eventDate.getMonth() + 1;
    const day = eventDate.getDate();

    let title = `Odvoz: ${event.wasteInfo.name}`;
    if (street) {
      title += ` - ${street}`;
    }

    let description = event.wasteInfo.description;

    return {
      start: [year, month, day],
      title,
      description,
      location: street ? `${street}, Budatín, Žilina` : 'Budatín, Žilina',
      status: 'CONFIRMED',
      busyStatus: 'FREE',
      alarms: [
        {
          action: 'display',
          description: `Dnes je odvoz: ${event.wasteInfo.name}`,
          trigger: { hours: 18, minutes: 0, before: true }
        },
        {
          action: 'display',
          description: `Zajtra je odvoz: ${event.wasteInfo.name}`,
          trigger: { hours: 42, minutes: 0, before: true }
        }
      ],
      categories: ['Odvoz odpadu', event.wasteInfo.name],
      url: 'https://niesmetibudatin.sk'
    };
  });

  const { error, value } = createEvents(icsEvents);
  if (error) {
    console.error('Error creating ICS:', error);
    return null;
  }
  return value;
}

// Načítame schedule data
console.log('🔄 Generujem kalendáre pre všetky ulice...');
const scheduleData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../waste-schedule.json'), 'utf-8')
);

const allEvents = getAllEvents(scheduleData);
const publicDir = path.resolve(__dirname, '../public');

// Vytvoríme priečinok ak neexistuje
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generujeme hlavný kalendár (všetky ulice)
const mainIcsContent = exportToICS(allEvents);
if (mainIcsContent) {
  fs.writeFileSync(path.resolve(publicDir, 'calendar.ics'), mainIcsContent, 'utf-8');
  console.log('✅ Hlavný kalendár: public/calendar.ics');
}

// Generujeme kalendár pre každú ulicu
const streets = scheduleData.districts.ALL.streets;
let generatedCount = 0;

// Funkcia pre odstránenie diakritiky
function removeDiacritics(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

streets.forEach(street => {
  const streetEvents = allEvents.filter(event => event.districts.includes(street));
  const icsContent = exportToICS(streetEvents, street);

  if (icsContent) {
    const noDiacritics = removeDiacritics(street);
    const safeStreetName = noDiacritics.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const filename = `calendar-${safeStreetName}.ics`;
    fs.writeFileSync(path.resolve(publicDir, filename), icsContent, 'utf-8');
    generatedCount++;
  }
});

console.log(`✅ Vygenerované kalendáre pre ulice: ${generatedCount}`);
console.log(`📅 Celkový počet eventov: ${allEvents.length}`);
console.log('📁 Kalendáre uložené v: public/');
