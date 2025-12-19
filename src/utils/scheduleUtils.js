import scheduleData from '../../waste-schedule.json';

export const getWasteTypes = () => scheduleData.wasteTypes;
export const getDistricts = () => scheduleData.districts;
export const getSchedule = () => scheduleData.schedule;

/**
 * Generates all waste collection events for the year
 * @returns {Array} Array of event objects with date, wasteType, and districts
 */
export const generateEvents = () => {
  const events = [];
  const schedule = scheduleData.schedule;
  const year = scheduleData.year;

  // Process each waste type
  Object.entries(schedule).forEach(([wasteTypeKey, monthData]) => {
    Object.entries(monthData).forEach(([month, days]) => {
      days.forEach(day => {
        const date = new Date(year, parseInt(month) - 1, day);

        // Determine which districts this applies to
        let districts = [];
        let wasteType = wasteTypeKey;

        if (wasteTypeKey.startsWith('zko_')) {
          const districtNum = wasteTypeKey.split('_')[1];
          districts = scheduleData.districts[`ZKO_${districtNum}`].streets;
          wasteType = 'zko';
        } else if (wasteTypeKey.startsWith('brko_')) {
          const districtNum = wasteTypeKey.split('_')[1];
          districts = scheduleData.districts[`BRKO_${districtNum}`].streets;
          wasteType = 'brko';
        } else {
          districts = scheduleData.districts.ALL.streets;
        }

        events.push({
          date: date.toISOString().split('T')[0],
          wasteType,
          wasteTypeKey,
          districts,
          wasteInfo: scheduleData.wasteTypes[wasteType]
        });
      });
    });
  });

  return events.sort((a, b) => new Date(a.date) - new Date(b.date));
};

/**
 * Filters events by street
 * @param {Array} events - All events
 * @param {string} street - Street name to filter by
 * @returns {Array} Filtered events
 */
export const filterEventsByStreet = (events, street) => {
  if (!street) return events;
  return events.filter(event => event.districts.includes(street));
};

/**
 * Gets events for a specific month
 * @param {Array} events - All events
 * @param {number} month - Month number (1-12)
 * @param {number} year - Year
 * @returns {Array} Filtered events
 */
export const getEventsByMonth = (events, month, year) => {
  return events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === month - 1 && eventDate.getFullYear() === year;
  });
};

/**
 * Gets upcoming events
 * @param {Array} events - All events
 * @param {number} count - Number of events to return
 * @returns {Array} Upcoming events
 */
export const getUpcomingEvents = (events, count = 10) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return events
    .filter(event => new Date(event.date) >= now)
    .slice(0, count);
};

/**
 * Gets all unique streets
 * @returns {Array} Sorted array of street names
 */
export const getAllStreets = () => {
  return scheduleData.districts.ALL.streets.sort();
};

/**
 * Formats date to Slovak format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('sk-SK', options);
};

/**
 * Gets Slovak month name
 * @param {number} month - Month number (1-12)
 * @returns {string} Month name
 */
export const getMonthName = (month) => {
  const months = [
    'Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún',
    'Júl', 'August', 'September', 'Október', 'November', 'December'
  ];
  return months[month - 1];
};

export default {
  getWasteTypes,
  getDistricts,
  getSchedule,
  generateEvents,
  filterEventsByStreet,
  getEventsByMonth,
  getUpcomingEvents,
  getAllStreets,
  formatDate,
  getMonthName
};
