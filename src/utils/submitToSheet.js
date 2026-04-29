// Replace this URL after deploying your Google Apps Script as a web app
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || '';

export async function submitToSheet(payload) {
  if (!APPS_SCRIPT_URL) {
    throw new Error('Apps Script URL not configured. Set VITE_APPS_SCRIPT_URL in your .env file.');
  }

  // Apps Script web apps often do not expose CORS response headers to browsers.
  // no-cors still sends the submission, but the response body is intentionally opaque.
  await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify(payload),
  });

  return { status: 'success' };
}
