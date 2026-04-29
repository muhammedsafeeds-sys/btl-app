import { useEffect, useRef, useCallback } from 'react';

const DRAFT_KEY = 'btl_draft';
const PENDING_KEY = 'btl_pending_submissions';

export function useDraft(formData, setFormData) {
  const intervalRef = useRef(null);

  // Save draft every 30 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    }, 30000);
    return () => clearInterval(intervalRef.current);
  }, [formData]);

  const saveDraftNow = useCallback((data) => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  }, []);

  const loadDraft = useCallback(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    return saved ? JSON.parse(saved) : null;
  }, []);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
  }, []);

  // Pending offline submissions
  const addPending = useCallback((submission) => {
    const existing = JSON.parse(localStorage.getItem(PENDING_KEY) || '[]');
    existing.push(submission);
    localStorage.setItem(PENDING_KEY, JSON.stringify(existing));
  }, []);

  const getPending = useCallback(() => {
    return JSON.parse(localStorage.getItem(PENDING_KEY) || '[]');
  }, []);

  const clearPending = useCallback(() => {
    localStorage.removeItem(PENDING_KEY);
  }, []);

  const hasDraft = useCallback(() => {
    return !!localStorage.getItem(DRAFT_KEY);
  }, []);

  return { saveDraftNow, loadDraft, clearDraft, addPending, getPending, clearPending, hasDraft };
}
