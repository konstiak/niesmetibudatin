import React from 'react';
import { getAllStreets } from '../utils/scheduleUtils';
import { exportStreetCalendar, exportAllCalendar } from '../utils/calendarExport';

const ScheduleFilters = ({ selectedStreet, onStreetChange, allEvents, onPrintClick }) => {
  const streets = getAllStreets();

  const handleExportICS = () => {
    if (selectedStreet) {
      exportStreetCalendar(allEvents, selectedStreet);
    } else {
      exportAllCalendar(allEvents);
    }
  };

  // Funkcia pre odstránenie diakritiky
  const removeDiacritics = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  // Získame webcal URL pre iOS kalendár
  const getWebcalUrl = () => {
    const protocol = 'webcal:';
    const host = window.location.host;

    if (selectedStreet) {
      const noDiacritics = removeDiacritics(selectedStreet);
      const safeStreetName = noDiacritics.replace(/[^a-z0-9]/gi, '-').toLowerCase();
      return `${protocol}//${host}/calendar-${safeStreetName}.ics`;
    }

    return `${protocol}//${host}/calendar.ics`;
  };

  return (
    <div className="filters">
      <div className="filter-group">
        <label htmlFor="street-select">Vyberte ulicu:</label>
        <select
          id="street-select"
          value={selectedStreet}
          onChange={(e) => onStreetChange(e.target.value)}
        >
          <option value="">Všetky ulice</option>
          {streets.map((street) => (
            <option key={street} value={street}>
              {street}
            </option>
          ))}
        </select>
      </div>

      <div className="export-buttons">
        <a
          href={getWebcalUrl()}
          className="btn btn-primary"
          style={{ textDecoration: 'none', display: 'inline-block' }}
        >
          📅 Pridať do iOS kalendára
          {selectedStreet && ` (${selectedStreet})`}
        </a>
        <button
          className="btn btn-secondary"
          onClick={handleExportICS}
          style={{ marginLeft: '10px' }}
        >
          📥 Export do ics
          {selectedStreet && ` (${selectedStreet})`}
        </button>
        <button
          className="btn btn-secondary"
          onClick={onPrintClick}
        >
          🖨️ Vytlačiť harmonogram
        </button>
      </div>

      {selectedStreet && (
        <div className="info-box">
          <p>
            <strong>Zobrazujú sa odvozy pre ulicu:</strong> {selectedStreet}
          </p>
        </div>
      )}
    </div>
  );
};

export default ScheduleFilters;
