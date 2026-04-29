/**
 * Buloke BTL Data Collection - Google Apps Script
 *
 * HOW TO DEPLOY:
 * 1. Open your Google Sheet
 * 2. Extensions -> Apps Script
 * 3. Paste this entire file, replacing any existing code
 * 4. Click Save, then select "setupAllSheets" from dropdown -> Run
 *    (one-time: creates all 4 tabs with headers and formulas)
 * 5. Deploy -> New Deployment
 *    Type: Web App | Execute as: Me | Who has access: Anyone
 * 6. Copy the Web App URL -> paste into .env as VITE_APPS_SCRIPT_URL
 */

var SHEET_NAME_RAW = 'Raw Submissions';

var HEADERS = [
  'Timestamp',
  'Agent Name',
  'Apartment Name',
  'Possession Year',
  'Resale Value (Cr)',
  'No. of Houses',
  'Latitude',
  'Longitude',
  'Google Maps Link',
  'Locality',
  'Zone',
  'Pin Code',
  'Contact Person',
  'Phone Number',
  'Email',
  'Bank Account No',
  'IFSC Code',
  'Bank Name',
  'Notice Board (Rs)',
  'WhatsApp / Adda (Rs)',
  'MyGate / NBH (Rs)',
  'Standee (Rs)',
  'Banner (Rs)',
  'Flyer (Rs)',
  'Email Marketing (Rs)',
  'Digital Screen (Rs)',
  'Telegram (Rs)',
  'AdOnMo (Rs)',
  'Stall (Rs)',
  'Chair / Table',
  'Total Quoted Price (Rs)',
  'Notes'
];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = getOrCreateSheet(ss, SHEET_NAME_RAW);

    var row = [
      data.timestamp || new Date().toLocaleString(),
      data.agentName || '',
      data.apartmentName || '',
      data.possessionYear || '',
      data.resaleValue || '',
      data.numHouses || '',
      data.latitude || '',
      data.longitude || '',
      data.mapsLink || '',
      data.locality || '',
      data.zone || '',
      data.pinCode || '',
      data.contactPerson || '',
      data.phone || '',
      data.email || '',
      data.bankAccountNo || '',
      data.ifsc || '',
      data.bankName || '',
      toNum(data.noticeBoard),
      toNum(data.whatsapp),
      toNum(data.mygate),
      toNum(data.standee),
      toNum(data.banner),
      toNum(data.flyer),
      toNum(data.emailMarketing),
      toNum(data.digitalScreen),
      toNum(data.telegram),
      toNum(data.adonmo),
      toNum(data.stall),
      data.chairTable || '',
      toNum(data.totalQuotedPrice),
      data.notes || ''
    ];

    sheet.insertRowAfter(1);
    sheet.getRange(2, 1, 1, row.length).setValues([row]);
    highlightToday(sheet);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'BTL endpoint is live' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setValues([HEADERS]);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#22c55e');
  headerRange.setFontColor('#ffffff');
  sheet.setFrozenRows(1);
  sheet.setColumnWidths(1, HEADERS.length, 160);
  sheet.setColumnWidth(9, 220);
  sheet.setColumnWidth(32, 300);
  return sheet;
}

function highlightToday(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) { return; }
  var today = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd/MM/yyyy');
  var tsValues = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < tsValues.length; i++) {
    var rowNum = i + 2;
    var cellVal = String(tsValues[i][0]);
    var bg = (cellVal.indexOf(today) !== -1) ? '#f0fff4' : '#ffffff';
    sheet.getRange(rowNum, 1, 1, HEADERS.length).setBackground(bg);
  }
}

function toNum(val) {
  var n = parseFloat(val);
  return isNaN(n) ? '' : n;
}

function setupAllSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  getOrCreateSheet(ss, SHEET_NAME_RAW);
  setupDashboard(ss);
  setupAgentSummary(ss);
  setupApartmentMaster(ss);
  SpreadsheetApp.getUi().alert('Setup complete! All 4 tabs created.');
}

function setupDashboard(ss) {
  var sheet = ss.getSheetByName('Dashboard');
  if (!sheet) { sheet = ss.insertSheet('Dashboard'); }
  sheet.clear();

  var r = "'Raw Submissions'";

  var rows = [];
  rows.push(['METRIC', 'VALUE']);
  rows.push(['Total Apartments Visited', '=COUNTA(' + r + '!C2:C)']);
  rows.push(['Visits Today', '=COUNTIFS(' + r + '!A2:A,">="&TODAY(),' + r + '!A2:A,"<"&(TODAY()+1))']);
  rows.push(['Avg Quoted per Visit (Rs)', '=IFERROR(AVERAGE(' + r + '!AE2:AE),0)']);
  rows.push(['Highest Quoted Price (Rs)', '=IFERROR(MAX(' + r + '!AE2:AE),0)']);
  rows.push(['Apartment with Highest Quote', '=IFERROR(INDEX(' + r + '!C2:C,MATCH(MAX(' + r + '!AE2:AE),' + r + '!AE2:AE,0)),"-")']);
  rows.push(['', '']);
  rows.push(['ZONE', 'VISITS']);
  rows.push(['North',   '=COUNTIF(' + r + '!K2:K,"North")']);
  rows.push(['South',   '=COUNTIF(' + r + '!K2:K,"South")']);
  rows.push(['East',    '=COUNTIF(' + r + '!K2:K,"East")']);
  rows.push(['West',    '=COUNTIF(' + r + '!K2:K,"West")']);
  rows.push(['Central', '=COUNTIF(' + r + '!K2:K,"Central")']);
  rows.push(['', '']);
  rows.push(['CHANNEL', 'ENTRIES WITH PRICE > 0']);
  rows.push(['Notice Board',    '=COUNTIF(' + r + '!S2:S,">"&0)']);
  rows.push(['WhatsApp / Adda', '=COUNTIF(' + r + '!T2:T,">"&0)']);
  rows.push(['MyGate / NBH',    '=COUNTIF(' + r + '!U2:U,">"&0)']);
  rows.push(['Standee',         '=COUNTIF(' + r + '!V2:V,">"&0)']);
  rows.push(['Banner',          '=COUNTIF(' + r + '!W2:W,">"&0)']);
  rows.push(['Flyer',           '=COUNTIF(' + r + '!X2:X,">"&0)']);
  rows.push(['Email Marketing', '=COUNTIF(' + r + '!Y2:Y,">"&0)']);
  rows.push(['Digital Screen',  '=COUNTIF(' + r + '!Z2:Z,">"&0)']);
  rows.push(['Telegram',        '=COUNTIF(' + r + '!AA2:AA,">"&0)']);
  rows.push(['AdOnMo',          '=COUNTIF(' + r + '!AB2:AB,">"&0)']);
  rows.push(['Stall',           '=COUNTIF(' + r + '!AC2:AC,">"&0)']);
  rows.push(['Chair / Table (YES)', '=COUNTIF(' + r + '!AD2:AD,"YES")']);

  sheet.getRange(1, 1, rows.length, 2).setValues(rows);
  styleRow(sheet, 1);
  styleRow(sheet, 8);
  styleRow(sheet, 15);
  sheet.setColumnWidth(1, 280);
  sheet.setColumnWidth(2, 180);
  sheet.setFrozenRows(1);
}

function setupAgentSummary(ss) {
  var sheet = ss.getSheetByName('Agent Summary');
  if (!sheet) { sheet = ss.insertSheet('Agent Summary'); }
  sheet.clear();

  var r = "'Raw Submissions'";
  sheet.getRange(1, 1, 1, 3).setValues([['Agent Name', 'Total Visits', 'Last Active']]);
  styleRow(sheet, 1);
  sheet.getRange(2, 1).setFormula('=IFERROR(UNIQUE(FILTER(' + r + '!B2:B,' + r + '!B2:B<>"")),"-")');
  sheet.getRange(2, 2).setFormula('=IFERROR(COUNTIF(' + r + '!B2:B,A2),"")');
  sheet.getRange(2, 3).setFormula('=IFERROR(TEXT(MAXIFS(' + r + '!A2:A,' + r + '!B2:B,A2),"dd mmm yyyy hh:mm"),"")');
  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 120);
  sheet.setColumnWidth(3, 200);
  sheet.setFrozenRows(1);
}

function setupApartmentMaster(ss) {
  var sheet = ss.getSheetByName('Apartment Master');
  if (!sheet) { sheet = ss.insertSheet('Apartment Master'); }
  sheet.clear();

  var r = "'Raw Submissions'";
  var hdrs = ['Apartment Name', 'Last Visit', 'Agent', 'Zone', 'Visits', 'Avg Quoted (Rs)', 'Maps Link'];
  sheet.getRange(1, 1, 1, hdrs.length).setValues([hdrs]);
  styleRow(sheet, 1);
  sheet.getRange(2, 1).setFormula('=IFERROR(UNIQUE(FILTER(' + r + '!C2:C,' + r + '!C2:C<>"")),"-")');
  sheet.getRange(2, 2).setFormula('=IFERROR(TEXT(MAXIFS(' + r + '!A2:A,' + r + '!C2:C,A2),"dd mmm yyyy"),"")');
  sheet.getRange(2, 3).setFormula('=IFERROR(INDEX(' + r + '!B2:B,MATCH(MAXIFS(' + r + '!A2:A,' + r + '!C2:C,A2),' + r + '!A2:A,0)),"")');
  sheet.getRange(2, 4).setFormula('=IFERROR(INDEX(' + r + '!K2:K,MATCH(MAXIFS(' + r + '!A2:A,' + r + '!C2:C,A2),' + r + '!A2:A,0)),"")');
  sheet.getRange(2, 5).setFormula('=IFERROR(COUNTIF(' + r + '!C2:C,A2),"")');
  sheet.getRange(2, 6).setFormula('=IFERROR(AVERAGEIF(' + r + '!C2:C,A2,' + r + '!AE2:AE),"")');
  sheet.getRange(2, 7).setFormula('=IFERROR(INDEX(' + r + '!I2:I,MATCH(MAXIFS(' + r + '!A2:A,' + r + '!C2:C,A2),' + r + '!A2:A,0)),"")');
  sheet.setColumnWidths(1, hdrs.length, 180);
  sheet.setFrozenRows(1);
}

function styleRow(sheet, rowNum) {
  var range = sheet.getRange(rowNum, 1, 1, 2);
  range.setFontWeight('bold');
  range.setBackground('#22c55e');
  range.setFontColor('#ffffff');
}
