import { useMemo } from 'react';

const CHANNELS = [
  { key: 'noticeBoard', label: 'Notice Board' },
  { key: 'whatsapp', label: 'WhatsApp / Adda' },
  { key: 'mygate', label: 'MyGate / NBH' },
  { key: 'standee', label: 'Standee' },
  { key: 'banner', label: 'Banner' },
  { key: 'flyer', label: 'Flyer' },
  { key: 'emailMarketing', label: 'Email (Marketing)' },
  { key: 'digitalScreen', label: 'Digital Screen' },
  { key: 'telegram', label: 'Telegram' },
  { key: 'adonmo', label: 'AdOnMo' },
  { key: 'stall', label: 'Stall' },
];

function formatINR(val) {
  if (!val) return '';
  return Number(val).toLocaleString('en-IN');
}

export default function BTLChannels({ data, onChange }) {
  const total = useMemo(() => {
    return CHANNELS.reduce((sum, ch) => {
      const v = parseFloat(data.prices[ch.key]) || 0;
      return sum + v;
    }, 0);
  }, [data.prices]);

  return (
    <section className="form-section">
      <h2 className="section-title">
        <span className="section-icon">📣</span> BTL Channel Information
      </h2>

      <div className="channel-list">
        {CHANNELS.map((ch) => (
          <div key={ch.key} className="channel-row">
            <span className="channel-name">{ch.label}</span>
            <div className="channel-price">
              <span className="rupee">₹</span>
              <input
                type="number"
                className="field-input price-input"
                placeholder="0"
                min="0"
                value={data.prices[ch.key]}
                onChange={(e) => onChange('prices', { ...data.prices, [ch.key]: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="chair-table-row">
        <span className="channel-name">Chair / Table</span>
        <div className="yes-no-group">
          <button
            type="button"
            className={`btn-yn ${data.chairTable === 'YES' ? 'active-yes' : ''}`}
            onClick={() => onChange('chairTable', 'YES')}
          >
            YES
          </button>
          <button
            type="button"
            className={`btn-yn ${data.chairTable === 'NO' ? 'active-no' : ''}`}
            onClick={() => onChange('chairTable', 'NO')}
          >
            NO
          </button>
        </div>
      </div>

      <div className="total-row">
        <span className="total-label">Total Quoted Price</span>
        <span className="total-value">
          ₹ {formatINR(total)}
        </span>
      </div>
    </section>
  );
}
