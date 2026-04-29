# Buloke BTL Data Collection App

Mobile-first form for field agents to log apartment BTL channel data.  
Data flows: React form → Google Apps Script → Google Sheets (4 tabs).

---

## 3-Step Deploy

### Step 1 — Set up Google Sheets

1. Create a new Google Sheet (any name, e.g. "BTL Collections")
2. Go to **Extensions → Apps Script**
3. Delete all existing code, paste the entire contents of `GoogleAppsScript.js`
4. Click **Save** (💾), then select `setupAllSheets` from the function dropdown → **Run** (one-time, creates all 4 tabs + headers)
5. Click **Deploy → New Deployment**
   - Type: **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Click **Deploy** → copy the **Web App URL**

### Step 2 — Configure the app

```bash
cp .env.example .env
```

Open `.env` and paste your Web App URL:

```
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/XXXX/exec
```

### Step 3 — Deploy to Vercel (free)

```bash
npm install
npm run build
npx vercel --prod
```

Or connect your GitHub repo to vercel.com and add `VITE_APPS_SCRIPT_URL` in  
Project → Settings → Environment Variables.

---

## Local Development

```bash
npm install
npm run dev
```

---

## Google Sheet Tabs

| Tab | Contents |
|-----|----------|
| Raw Submissions | Every submission, newest first, 30 columns |
| Dashboard | KPIs, zone breakdown, channel availability counts |
| Agent Summary | Visits per agent, last active timestamp |
| Apartment Master | Deduplicated apartment list with latest visit info |

---

## Form Sections

1. **Agent Info** — name saved in browser, pre-filled every visit
2. **Property Info** — apartment name, possession year, resale value, units
3. **Location** — one-tap GPS or manual entry (locality, zone, pin code)
4. **Contact Details** — contact person, phone, email, bank account
5. **BTL Channels** — 11 channels with quoted prices + chair/table + live total
6. **Notes** — free text observations

## Offline Support

- Draft auto-saved to browser every 30 seconds
- Failed/offline submissions queued as pending drafts
- Auto-submits pending drafts when network returns
- Pending count shown in header bar
