import { useState, useCallback } from 'react';

export function useGPS() {
  const [gpsData, setGpsData] = useState({ lat: '', lng: '', mapsLink: '' });
  const [gpsStatus, setGpsStatus] = useState('idle'); // idle | loading | success | error
  const [gpsError, setGpsError] = useState('');

  const captureLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      setGpsError('GPS not supported on this device.');
      return;
    }
    setGpsStatus('loading');
    setGpsError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        const mapsLink = `https://maps.google.com/?q=${lat},${lng}`;
        setGpsData({ lat, lng, mapsLink });
        setGpsStatus('success');
      },
      (err) => {
        setGpsStatus('error');
        setGpsError(
          err.code === 1
            ? 'Location permission denied. Please allow access in browser settings.'
            : 'Unable to get location. Try again or enter manually.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  const clearGPS = useCallback(() => {
    setGpsData({ lat: '', lng: '', mapsLink: '' });
    setGpsStatus('idle');
    setGpsError('');
  }, []);

  return { gpsData, gpsStatus, gpsError, captureLocation, clearGPS };
}
