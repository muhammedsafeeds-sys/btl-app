const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1970 + 11 }, (_, i) => 1970 + i);

export default function PropertyInfo({ data, onChange }) {
  return (
    <section className="form-section">
      <h2 className="section-title">
        <span className="section-icon">🏢</span> Property Info
      </h2>

      <div className="field-group">
        <label className="field-label">Apartment Name *</label>
        <input
          type="text"
          className="field-input"
          placeholder="e.g. Prestige Lakeside Habitat"
          value={data.apartmentName}
          onChange={(e) => onChange('apartmentName', e.target.value)}
        />
      </div>

      <div className="field-row">
        <div className="field-group">
          <label className="field-label">Possession Year</label>
          <select
            className="field-input"
            value={data.possessionYear}
            onChange={(e) => onChange('possessionYear', e.target.value)}
          >
            <option value="">Select year</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="field-group">
          <label className="field-label">Resale Value (Cr)</label>
          <input
            type="number"
            className="field-input"
            placeholder="e.g. 1.5"
            step="0.1"
            min="0"
            value={data.resaleValue}
            onChange={(e) => onChange('resaleValue', e.target.value)}
          />
        </div>
      </div>

      <div className="field-group">
        <label className="field-label">No. of Houses</label>
        <input
          type="number"
          className="field-input"
          placeholder="e.g. 450"
          min="0"
          value={data.numHouses}
          onChange={(e) => onChange('numHouses', e.target.value)}
        />
      </div>
    </section>
  );
}
