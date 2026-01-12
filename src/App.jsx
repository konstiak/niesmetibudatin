import React, { useState, useEffect } from 'react';
import WasteLegend from './components/WasteLegend';
import EventsList from './components/EventsList';
import ScheduleFilters from './components/ScheduleFilters';
import CalendarView from './components/CalendarView';
import PrintableCalendar from './components/PrintableCalendar';
import { generateEvents, filterEventsByStreet, getUpcomingEvents } from './utils/scheduleUtils';

const App = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedStreet, setSelectedStreet] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list', 'calendar', or 'print'

  useEffect(() => {
    const events = generateEvents();
    setAllEvents(events);
    setFilteredEvents(getUpcomingEvents(events, 50));
  }, []);

  useEffect(() => {
    if (selectedStreet) {
      const filtered = filterEventsByStreet(allEvents, selectedStreet);
      setFilteredEvents(getUpcomingEvents(filtered, 50));
    } else {
      setFilteredEvents(getUpcomingEvents(allEvents, 50));
    }
  }, [selectedStreet, allEvents]);

  const eventsToShow = selectedStreet ? filterEventsByStreet(allEvents, selectedStreet) : allEvents;

  return (
    <div className={viewMode === 'print' ? 'show-print-preview' : ''}>
      {viewMode !== 'print' && (
        <>
          <header>
            <h1>🗑️ Harmonogram zberu odpadu</h1>
            <p>Budatín, Žilina • Rok 2026</p>
          </header>

          <div className="container">
            <ScheduleFilters
              selectedStreet={selectedStreet}
              onStreetChange={setSelectedStreet}
              allEvents={allEvents}
              onPrintClick={() => setViewMode('print')}
            />

            <WasteLegend />

            <div className="filters">
              <div className="export-buttons">
                <button
                  className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setViewMode('list')}
                >
                  📋 Zoznam
                </button>
                <button
                  className={`btn ${viewMode === 'calendar' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setViewMode('calendar')}
                >
                  📅 Kalendár
                </button>
                <button
                  className={`btn ${viewMode === 'print' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setViewMode('print')}
                >
                  🖨️ Vreckový kalendár
                </button>
              </div>
            </div>

            {viewMode === 'list' ? (
              <EventsList
                events={filteredEvents}
                title={selectedStreet ? `Odvozy pre ulicu ${selectedStreet}` : 'Nadchádzajúce odvozy'}
              />
            ) : viewMode === 'calendar' ? (
              <CalendarView events={eventsToShow} />
            ) : null}

            <div className="info-box" style={{ marginTop: '30px' }}>
              <h3>ℹ️ Dôležité informácie</h3>
              <p><strong>ZKO</strong> - zmiešaný komunálny odpad / čierna nádoba</p>
              <p><strong>BRKO</strong> - biologicky rozložiteľný kuchynský odpad / 20 l hnedá nádoba</p>
              <p><strong>Záhrada</strong> - Zelený odpad zo záhrad typ zbernej nádoby: 240 l hnedá nádoba. <em>Poznámka: služba je samostatne spoplatnená!</em></p>
              <p><strong>VKM + kov</strong> - nápojové kartóny (tetrapaky) a kovové obaly / žlté nádoby / žlté vrecia</p>
            </div>
          </div>

          <footer>
            <p>© 2026 Harmonogram zberu odpadu - Budatín, Žilina</p>
            <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
              Dáta sú informatívneho charakteru. Pre aktuálne informácie kontaktujte mestský úrad.
            </p>
          </footer>
        </>
      )}

      {viewMode === 'print' && (
        <>
          <div className="print-controls">
            <div className="container" style={{ padding: '20px' }}>
              <div className="filters" style={{ background: 'white', padding: '20px', marginBottom: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setViewMode('list')}
                >
                  ← Späť
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => window.print()}
                  style={{ marginLeft: '10px' }}
                >
                  🖨️ Vytlačiť
                </button>
              </div>
            </div>
          </div>
          <PrintableCalendar events={eventsToShow} selectedStreet={selectedStreet} />
        </>
      )}
    </div>
  );
};

export default App;
