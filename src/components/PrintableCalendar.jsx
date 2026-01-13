import React from 'react';
import { getEventsByMonth, getMonthName } from '../utils/scheduleUtils';

const PrintableCalendar = ({ events, selectedStreet }) => {
  const year = 2026;

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    const day = new Date(year, month - 1, 1).getDay();
    return day === 0 ? 6 : day - 1; // Convert Sunday (0) to 6, Monday (1) to 0
  };

  const getEventsForDay = (month, day) => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter((e) => e.date === dateStr);
  };

  const renderMonth = (month) => {
    const monthEvents = getEventsByMonth(events, month, year);
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    const dayNames = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

    return (
      <div key={month} className="print-month">
        <h3 className="print-month-name">{getMonthName(month)}</h3>
        <div className="print-calendar-grid">
          {dayNames.map((day) => (
            <div key={day} className="print-day-header">
              {day}
            </div>
          ))}

          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="print-day empty" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayEvents = getEventsForDay(month, day);

            // Get background colors for this day
            const colors = dayEvents.map(e => e.wasteInfo.color);

            // Create gradient if multiple events
            let backgroundColor = '#fff';
            if (colors.length === 1) {
              backgroundColor = colors[0];
            } else if (colors.length > 1) {
              // Create striped pattern for multiple waste types
              const stops = colors.map((color, idx) => {
                const start = (idx / colors.length) * 100;
                const end = ((idx + 1) / colors.length) * 100;
                return `${color} ${start}%, ${color} ${end}%`;
              }).join(', ');
              backgroundColor = `linear-gradient(135deg, ${stops})`;
            }

            const isWeekend = (firstDay + i) % 7 >= 5;

            return (
              <div
                key={day}
                className={`print-day ${isWeekend ? 'weekend' : ''}`}
                style={
                  colors.length > 0
                    ? { background: backgroundColor }
                    : {}
                }
              >
                <span className={colors.length > 0 ? 'has-event' : ''}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="printable-calendar">
      <div className="print-legend">
        {selectedStreet && (
          <div className="print-street-name">
            {selectedStreet}
          </div>
        )}
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#FFD700' }}></div>
          <span>Plast</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#0080FF' }}></div>
          <span>Papier</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#FF0000' }}></div>
          <span>Kov</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#808080' }}></div>
          <span>Komunálny</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#8B4513' }}></div>
          <span>Bio</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#00FF00' }}></div>
          <span>Záhrada</span>
        </div>
      </div>

      <div className="print-months-grid">
        {Array.from({ length: 12 }, (_, i) => renderMonth(i + 1))}
      </div>
    </div>
  );
};

export default PrintableCalendar;
