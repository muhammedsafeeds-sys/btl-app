// Replace this URL after deploying your Google Apps Script as a web app
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || '';

export async function submitToSheet(payload) {
  if (!APPS_SCRIPT_URL) {
    throw new Error('Apps Script URL not configured. Set VITE_APPS_SCRIPT_URL in your .env file.');
  }
  const response = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload),
  });
  const text = await response.text();
  let result;
  try {
    result = JSON.parse(text);
  } catch {
    result = { status: 'error', message: text };
  }
  if (result.status !== 'success') {
    throw new Error(result.message || 'Submission failed');
  }
  return result;
}
