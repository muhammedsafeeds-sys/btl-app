import { useState, useEffect, useCallback, useRef } from 'react';
import AgentInfo from './sections/AgentInfo';
import PropertyInfo from './sections/PropertyInfo';
import Location from './sections/Location';
import ContactDetails from './sections/ContactDetails';
import BTLChannels from './sections/BTLChannels';
import Notes from './sections/Notes';
import { useGPS } from './hooks/useGPS';
import { useDraft } from './hooks/useDraft';
import { submitToSheet } from './utils/submitToSheet';
import './App.css';

const AGENT_KEY = 'btl_agent_name';
const CHANNELS_KEYS = [
  'noticeBoard', 'whatsapp', 'mygate', 'standee', 'banner',
  'flyer', 'emailMarketing', 'digitalScreen', 'telegram', 'adonmo', 'stall',
];

function emptyForm(agentName = '') {
  return {
    agentName,
    property: { apartmentName: '', possessionYear: '', resaleValue: '', numHouses: '' },
    location: { locality: '', zone: '', pinCode: '' },
    contact: { contactPerson: '', phone: '', email: '', bankDetails: '' },
    btl: {
      prices: Object.fromEntries(CHANNELS_KEYS.map((k) => [k, ''])),
      chairTable: '',
    },
    notes: '',
  };
}

function calcTotal(prices) {
  return CHANNELS_KEYS.reduce((s, k) => s + (parseFloat(prices[k]) || 0), 0);
}

export default function App() {
  const savedAgent = localStorage.getItem(AGENT_KEY) || '';
  const [form, setForm] = useState(emptyForm(savedAgent));
  const [submitState, setSubmitState] = useState('idle');
  const [pendingCount, setPendingCount] = useState(0);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  const { gpsData, gpsStatus, gpsError, captureLocation, clearGPS } = useGPS();
  const { saveDraftNow, loadDraft, clearDraft, addPending, getPending, clearPending } = useDraft(form, setForm);

  useEffect(() => {
    setPendingCount(getPending().length);
  }, []);

  useEffect(() => {
    const trySendPending = async () => {
      const pending = getPending();
      if (!pending.length || !navigator.onLine) return;
      try {
        for (const item of pending) {
          await submitToSheet(item);
        }
        clearPending();
        setPendingCount(0);
        showToast('Drafts submitted successfully ✅');
      } catch {
        // retry next time online
      }
    };
    window.addEventListener('online', trySendPending);
    return () => window.removeEventListener('online', trySendPending);
  }, []);

  useEffect(() => {
    const draft = loadDraft();
    if (draft && draft.property?.apartmentName) {
      setForm(draft);
      showToast('Draft restored');
    }
  }, []);

  function showToast(msg) {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 3500);
  }

  const setAgentName = useCallback((name) => {
    localStorage.setItem(AGENT_KEY, name);
    setForm((f) => ({ ...f, agentName: name }));
  }, []);

  const setProperty = useCallback((key, val) => {
    setForm((f) => ({ ...f, property: { ...f.property, [key]: val } }));
  }, []);

  const setLocation = useCallback((key, val) => {
    setForm((f) => ({ ...f, location: { ...f.location, [key]: val } }));
  }, []);

  const setContact = useCallback((key, val) => {
    setForm((f) => ({ ...f, contact: { ...f.contact, [key]: val } }));
  }, []);

  const setBTL = useCallback((key, val) => {
    setForm((f) => ({ ...f, btl: { ...f.btl, [key]: val } }));
  }, []);

  const setNotes = useCallback((val) => {
    setForm((f) => ({ ...f, notes: val }));
  }, []);

  function buildPayload() {
    const ts = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const total = calcTotal(form.btl.prices);
    return {
      timestamp: ts,
      agentName: form.agentName,
      apartmentName: form.property.apartmentName,
      possessionYear: form.property.possessionYear,
      resaleValue: form.property.resaleValue,
      numHouses: form.property.numHouses,
      latitude: gpsData.lat,
      longitude: gpsData.lng,
      mapsLink: gpsData.mapsLink,
      locality: form.location.locality,
      zone: form.location.zone,
      pinCode: form.location.pinCode,
      contactPerson: form.contact.contactPerson,
      phone: form.contact.phone,
      email: form.contact.email,
      bankDetails: form.contact.bankDetails,
      noticeBoard: form.btl.prices.noticeBoard,
      whatsapp: form.btl.prices.whatsapp,
      mygate: form.btl.prices.mygate,
      standee: form.btl.prices.standee,
      banner: form.btl.prices.banner,
      flyer: form.btl.prices.flyer,
      emailMarketing: form.btl.prices.emailMarketing,
      digitalScreen: form.btl.prices.digitalScreen,
      telegram: form.btl.prices.telegram,
      adonmo: form.btl.prices.adonmo,
      stall: form.btl.prices.stall,
      chairTable: form.btl.chairTable,
      totalQuotedPrice: total,
      notes: form.notes,
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.agentName.trim()) { showToast('Please enter your agent name'); return; }
    if (!form.property.apartmentName.trim()) { showToast('Please enter apartment name'); return; }

    const payload = buildPayload();
    setSubmitState('submitting');

    if (!navigator.onLine) {
      addPending(payload);
      setPendingCount((c) => c + 1);
      clearDraft();
      setSubmitState('idle');
      setForm(emptyForm(form.agentName));
      clearGPS();
      showToast('Saved as Draft — will submit when online');
      return;
    }

    try {
      await submitToSheet(payload);
      clearDraft();
      setSubmitState('success');
      setTimeout(() => {
        setSubmitState('idle');
        setForm(emptyForm(form.agentName));
        clearGPS();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 2500);
    } catch {
      addPending(payload);
      setPendingCount((c) => c + 1);
      clearDraft();
      setSubmitState('idle');
      setForm(emptyForm(form.agentName));
      clearGPS();
      showToast('Saved as Draft — will submit when online');
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">BTL Data Collection</h1>
          {pendingCount > 0 && (
            <div className="pending-badge">
              🕐 {pendingCount} Draft{pendingCount > 1 ? 's' : ''} Pending
            </div>
          )}
        </div>
      </header>

      {toast && <div className="toast">{toast}</div>}

      {submitState === 'success' && (
        <div className="success-overlay">
          <div className="success-card">
            <div className="success-icon">✅</div>
            <h2>Submitted Successfully!</h2>
            <p>Resetting form for next apartment…</p>
          </div>
        </div>
      )}

      <form className="form-body" onSubmit={handleSubmit} noValidate>
        <AgentInfo agentName={form.agentName} onChange={setAgentName} />
        <PropertyInfo data={form.property} onChange={setProperty} />
        <Location
          data={form.location}
          onChange={setLocation}
          gpsData={gpsData}
          gpsStatus={gpsStatus}
          gpsError={gpsError}
          onCapture={captureLocation}
          onClearGPS={clearGPS}
        />
        <ContactDetails data={form.contact} onChange={setContact} />
        <BTLChannels data={form.btl} onChange={setBTL} />
        <Notes value={form.notes} onChange={setNotes} />

        <div className="submit-area">
          <button type="submit" className="btn-submit" disabled={submitState === 'submitting'}>
            {submitState === 'submitting' ? 'Submitting…' : 'SUBMIT'}
          </button>
          <p className="autosave-hint">Auto-saved every 30 seconds</p>
        </div>
      </form>
    </div>
  );
}
