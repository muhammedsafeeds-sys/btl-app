export default function AgentInfo({ agentName, onChange }) {
  return (
    <section className="form-section">
      <h2 className="section-title">
        <span className="section-icon">👤</span> Agent Info
      </h2>
      <div className="field-group">
        <label className="field-label">Agent Name *</label>
        <input
          type="text"
          className="field-input"
          placeholder="Your full name"
          value={agentName}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="name"
        />
      </div>
    </section>
  );
}
