import React from 'react';
import { getWasteTypes } from '../utils/scheduleUtils';

const WasteLegend = () => {
  const wasteTypes = getWasteTypes();

  return (
    <div className="legend">
      <h3>Typy odpadu</h3>
      <div className="legend-items">
        {Object.entries(wasteTypes).map(([key, waste]) => (
          <div key={key} className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: waste.color }}
            />
            <div className="legend-text">
              <span className="legend-name">{waste.name}</span>
              <span className="legend-desc">{waste.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WasteLegend;
