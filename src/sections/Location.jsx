import { useState } from 'react';

const ZONES = ['North', 'South', 'East', 'West', 'Central'];

export default function Location({ data, onChange, gpsData, gpsStatus, gpsError, onCapture, onClearGPS }) {
  const [showManual, setShowManual] = useState(false);

  return (
    <section className="form-section">
      <h2 className="section-title">
        <span className="section-icon">📍</span> Location
      </h2>

      <div className="gps-box">
        {gpsStatus === 'idle' && (
          <button type="button" className="btn btn-gps" onClick={onCapture}>
            📍 Capture My Location
          </button>
        )}
        {gpsStatus === 'loading' && (
          <div className="gps-loading">
            <div className="spinner" />
            <span>Getting your location…</span>
          </div>
        )}
        {gpsStatus === 'success' && (
          <div className="gps-success">
            <div className="gps-coords">
              ✅ Location captured — {gpsData.lat}, {gpsData.lng}
            </div>
            <button type="button" className="btn btn-sm btn-outline" onClick={onClearGPS}>
              Clear GPS
            </button>
          </div>
        )}
        {gpsStatus === 'error' && (
          <div className="gps-error">
            <p>⚠️ {gpsError}</p>
            <button type="button" className="btn btn-gps" onClick={onCapture}>
              Try Again
            </button>
          </div>
        )}
      </div>

      <div className="manual-toggle">
        <button
          type="button"
          className={`btn btn-toggle ${showManual ? 'active' : ''}`}
          onClick={() => setShowManual((v) => !v)}
        >
          ✏️ {showManual ? 'Hide Manual Entry' : 'Enter Manually'}
        </button>
      </div>

      {showManual && (
        <div className="manual-fields">
          <div className="field-group">
            <label className="field-label">Locality</label>
            <input
              type="text"
              className="field-input"
              placeholder="e.g. Whitefield"
              value={data.locality}
              onChange={(e) => onChange('locality', e.target.value)}
            />
          </div>

          <div className="field-row">
            <div className="field-group">
              <label className="field-label">Zone</label>
              <select
                className="field-input"
                value={data.zone}
                onChange={(e) => onChange('zone', e.target.value)}
              >
                <option value="">Select zone</option>
                {ZONES.map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label className="field-label">Pin Code</label>
              <input
                type="tel"
                className="field-input"
                placeholder="560001"
                maxLength={6}
                value={data.pinCode}
                onChange={(e) => onChange('pinCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
