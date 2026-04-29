export default function Notes({ value, onChange }) {
  return (
    <section className="form-section">
      <h2 className="section-title">
        <span className="section-icon">📝</span> Notes
      </h2>
      <div className="field-group">
        <textarea
          className="field-input notes-textarea"
          placeholder="Observations, follow-up details, RWA contact notes, pending actions…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
        />
      </div>
    </section>
  );
}
