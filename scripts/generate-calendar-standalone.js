import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createEvents } from 'ics';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Načítame schedule data
const scheduleData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../waste-schedule.json'), 'utf-8')
);

// Funkcia pre generovanie eventov
function getAllEvents(data) {
  const events = [];
  const schedule = data.schedule;
  const year = data.year;

  // Process each waste type
  Object.entries(schedule).forEach(([wasteTypeKey, monthData]) => {
    Object.entries(monthData).forEach(([month, days]) => {
      days.forEach(day => {
        // Create date string directly to avoid timezone issues
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        // Determine which districts this applies to
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
function exportToICS(events) {
  const icsEvents = events.map(event => {
    const eventDate = new Date(event.date);
    const year = eventDate.getFullYear();
    const month = eventDate.getMonth() + 1;
    const day = eventDate.getDate();

    let title = `Odvoz: ${event.wasteInfo.name}`;
    let description = event.wasteInfo.description;
    if (event.districts.length < 50) {
      description += `\n\nUlice: ${event.districts.join(', ')}`;
    }

    return {
      start: [year, month, day],
      title,
      description,
      location: `Budatín, Žilina`,
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

// Generujeme eventy a ICS súbor
console.log('🔄 Generujem kalendár...');
const events = getAllEvents(scheduleData);
const icsContent = exportToICS(events);

if (icsContent) {
  // Uložíme ICS súbor do public/ priečinka
  const outputPath = path.resolve(__dirname, '../public/calendar.ics');

  // Vytvoríme public/ priečinok ak neexistuje
  const publicDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, icsContent, 'utf-8');
  console.log('✅ Kalendár vygenerovaný:', outputPath);
  console.log(`📅 Počet eventov: ${events.length}`);
} else {
  console.error('❌ Chyba pri generovaní kalendára');
  process.exit(1);
}
