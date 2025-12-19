import React from 'react';
import { formatDate } from '../utils/scheduleUtils';

const EventsList = ({ events, title = "Nadchádzajúce odvozy" }) => {
  if (!events || events.length === 0) {
    return (
      <div className="events-list">
        <h2>{title}</h2>
        <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          Žiadne udalosti na zobrazenie
        </p>
      </div>
    );
  }

  return (
    <div className="events-list">
      <h2>{title}</h2>
      {events.map((event, index) => (
        <div
          key={`${event.date}-${event.wasteType}-${index}`}
          className="event-card"
          style={{ borderLeftColor: event.wasteInfo.color }}
        >
          <div className="event-header">
            <div className="event-date">{formatDate(event.date)}</div>
            <div
              className="waste-badge"
              style={{ backgroundColor: event.wasteInfo.color }}
            >
              {event.wasteInfo.name}
            </div>
          </div>
          <div className="event-description">{event.wasteInfo.description}</div>
        </div>
      ))}
    </div>
  );
};

export default EventsList;
