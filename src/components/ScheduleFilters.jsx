import React from 'react';
import { getAllStreets } from '../utils/scheduleUtils';
import { exportStreetCalendar, exportAllCalendar } from '../utils/calendarExport';

const ScheduleFilters = ({ selectedStreet, onStreetChange, allEvents, onPrintClick }) => {
  const streets = getAllStreets();

  const handleExport = () => {
    if (selectedStreet) {
      exportStreetCalendar(allEvents, selectedStreet);
    } else {
      exportAllCalendar(allEvents);
    }
  };

  // Získame aktuálny hostname a port pre webcal URL
  const getWebcalUrl = () => {
    const protocol = window.location.protocol === 'https:' ? 'webcal:' : 'webcal:';
    const host = window.location.host;
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
        </a>
        <a
          href="/calendar.ics"
          download="odvoz-odpadu-budatin-2026.ics"
          className="btn btn-secondary"
          style={{ textDecoration: 'none', display: 'inline-block', marginLeft: '10px' }}
        >
          📥 Export do ics
        </a>
        <button
          className="btn btn-secondary"
          onClick={handleExport}
          style={{ marginLeft: '10px' }}
        >
          💾 Stiahnuť kalendár (filter)
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
