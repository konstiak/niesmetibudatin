import React from 'react';
import { getAllStreets } from '../utils/scheduleUtils';
import { exportStreetCalendar, exportAllCalendar } from '../utils/calendarExport';

const ScheduleFilters = ({ selectedStreet, onStreetChange, allEvents }) => {
  const streets = getAllStreets();

  const handleExport = () => {
    if (selectedStreet) {
      exportStreetCalendar(allEvents, selectedStreet);
    } else {
      exportAllCalendar(allEvents);
    }
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
        <button className="btn btn-primary" onClick={handleExport}>
          📅 Exportovať do kalendára (iOS)
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => window.print()}
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
