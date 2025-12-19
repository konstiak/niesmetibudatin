import { createEvents } from 'ics';

/**
 * Exports events to ICS calendar format for iOS
 * @param {Array} events - Array of waste collection events
 * @param {string} street - Optional street name to filter events
 * @returns {string} ICS file content
 */
export const exportToICS = (events, street = null) => {
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
    if (event.districts.length < 50) {
      description += `\n\nUlice: ${event.districts.join(', ')}`;
    }

    return {
      start: [year, month, day],
      duration: { hours: 0, minutes: 30 },
      title,
      description,
      location: `Budatín, Žilina${street ? `, ${street}` : ''}`,
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
};

/**
 * Downloads ICS file
 * @param {string} icsContent - ICS file content
 * @param {string} filename - Filename for download
 */
export const downloadICS = (icsContent, filename = 'harmonogram-odvoz-odpadu.ics') => {
  if (typeof window === 'undefined') return;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Exports and downloads calendar for a specific street
 * @param {Array} events - All events
 * @param {string} street - Street name
 */
export const exportStreetCalendar = (events, street) => {
  const filteredEvents = events.filter(event => event.districts.includes(street));
  const icsContent = exportToICS(filteredEvents, street);

  if (icsContent) {
    const safeStreetName = street.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    downloadICS(icsContent, `odvoz-odpadu-${safeStreetName}.ics`);
  }
};

/**
 * Exports and downloads calendar for all streets
 * @param {Array} events - All events
 */
export const exportAllCalendar = (events) => {
  const icsContent = exportToICS(events);

  if (icsContent) {
    downloadICS(icsContent, 'odvoz-odpadu-budatin-2026.ics');
  }
};

export default {
  exportToICS,
  downloadICS,
  exportStreetCalendar,
  exportAllCalendar
};
