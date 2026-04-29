export default function ContactDetails({ data, onChange }) {
  return (
    <section className="form-section">
      <h2 className="section-title">
        <span className="section-icon">📞</span> Contact Details
      </h2>

      <div className="field-group">
        <label className="field-label">Contact Person</label>
        <input
          type="text"
          className="field-input"
          placeholder="e.g. Mr. Sharma (RWA President)"
          value={data.contactPerson || ''}
          onChange={(e) => onChange('contactPerson', e.target.value)}
        />
      </div>

      <div className="field-group">
        <label className="field-label">Phone Number</label>
        <input
          type="tel"
          className="field-input"
          placeholder="98xxxxxxxx"
          value={data.phone || ''}
          onChange={(e) => onChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
        />
      </div>

      <div className="field-group">
        <label className="field-label">Email</label>
        <input
          type="email"
          className="field-input"
          placeholder="rwa@example.com"
          value={data.email || ''}
          onChange={(e) => onChange('email', e.target.value)}
        />
      </div>

      <div className="field-group">
        <label className="field-label">Account Number</label>
        <input
          type="tel"
          className="field-input"
          placeholder="Account number"
          value={data.bankAccountNo || ''}
          onChange={(e) => onChange('bankAccountNo', e.target.value.replace(/\D/g, ''))}
        />
      </div>

      <div className="field-row">
        <div className="field-group">
          <label className="field-label">IFSC Code</label>
          <input
            type="text"
            className="field-input"
            placeholder="e.g. HDFC0001234"
            value={data.ifsc || ''}
            onChange={(e) => onChange('ifsc', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11))}
          />
        </div>

        <div className="field-group">
          <label className="field-label">Bank Name</label>
          <input
            type="text"
            className="field-input"
            placeholder="e.g. HDFC Bank"
            value={data.bankName || ''}
            onChange={(e) => onChange('bankName', e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
