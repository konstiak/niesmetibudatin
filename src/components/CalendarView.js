import React, { useState } from 'react';
import { getEventsByMonth, getMonthName } from '../utils/scheduleUtils';

const CalendarView = ({ events, year = 2026 }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    const day = new Date(year, month - 1, 1).getDay();
    return day === 0 ? 6 : day - 1; // Convert Sunday (0) to 6, Monday (1) to 0, etc.
  };

  const monthEvents = getEventsByMonth(events, currentMonth, year);
  const daysInMonth = getDaysInMonth(currentMonth, year);
  const firstDay = getFirstDayOfMonth(currentMonth, year);

  const nextMonth = () => {
    setCurrentMonth((prev) => (prev === 12 ? 1 : prev + 1));
  };

  const prevMonth = () => {
    setCurrentMonth((prev) => (prev === 1 ? 12 : prev - 1));
  };

  const getEventsForDay = (day) => {
    const dateStr = `${year}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return monthEvents.filter((e) => e.date === dateStr);
  };

  const dayNames = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

  return (
    <div className="calendar-view">
      <div className="month-selector">
        <button onClick={prevMonth}>←</button>
        <h2>
          {getMonthName(currentMonth)} {year}
        </h2>
        <button onClick={nextMonth}>→</button>
      </div>

      <div className="calendar-grid">
        {dayNames.map((day) => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}

        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="calendar-day empty" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayEvents = getEventsForDay(day);

          return (
            <div key={day} className="calendar-day">
              <div className="day-number">{day}</div>
              <div className="day-events">
                {dayEvents.map((event, idx) => (
                  <div
                    key={idx}
                    className="day-event"
                    style={{ backgroundColor: event.wasteInfo.color }}
                    title={event.wasteInfo.description}
                  >
                    {event.wasteInfo.name}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
