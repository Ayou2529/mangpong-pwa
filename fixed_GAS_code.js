/**
 * Google Apps Script for JSONP Web App (with History)
 * Actions: login, register, createJob, updateJob, getJobs, getJobById
 * Sheets: Jobs, JobDetails, AdditionalFees, Users, JobHistory
 */
const SPREADSHEET_ID = '1fcq5P7vm3IxtJMDS9BLDwO8B14hFmmDdK257GHyoM';
const SHEET_JOBS = 'Jobs';
const SHEET_DETAILS = 'JobDetails';
const SHEET_FEES = 'AdditionalFees';
const SHEET_USERS = 'Users';
const SHEET_HISTORY = 'JobHistory';

function doGet(e) {
  const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "3600"
  };
  
  const params = e && e.parameter ? e.parameter : {};
  const action = (params.action || '').toLowerCase();
  const callback = params.callback || 'callback';

  // Handle preflight OPTIONS request
  if (e.parameter && Object.keys(e.parameter).length === 0) {
    return ContentService.createTextOutput('')
      .setHeaders(CORS_HEADERS)
      .setMimeType(ContentService.MimeType.TEXT);
  }

  // Special case for service worker
  if (params.page === 'service-worker') {
    return ContentService.createTextOutput(
      HtmlService.createHtmlOutputFromFile('service-worker.js').getContent(),
    ).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  let result = { success: false, error: 'Invalid action' };

  try {
    ensureSheets();

    if (!action) {
      return serveWebApp();
    }

    result = handleAction(action, params);
  } catch (err) {
    result = {
      success: false,
      error: String(err && err.message ? err.message : err),
    };
  }

  // For JSONP requests (when callback is provided), return JSONP response
  if (callback && callback !== 'callback') {
    return ContentService.createTextOutput(
      `${callback}(${JSON.stringify(result)})`,
    ).setHeaders(CORS_HEADERS).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  
  // For regular requests, return JSON response with CORS headers
  return ContentService.createTextOutput(
    JSON.stringify(result),
  ).setHeaders(CORS_HEADERS).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "3600"
  };
  
  // Handle preflight OPTIONS request
  if (!e.postData) {
    return ContentService.createTextOutput('')
      .setHeaders(CORS_HEADERS)
      .setMimeType(ContentService.MimeType.TEXT);
  }
  
  let params = {};
  try {
    params = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService
      .createTextOutput(
        JSON.stringify({
          success: false,
          error: 'Invalid JSON in request body',
        }),
      )
      .setHeaders(CORS_HEADERS)
      .setMimeType(ContentService.MimeType.JSON);
  }

  const action = (params.action || '').toLowerCase();
  let result = { success: false, error: 'Invalid action' };

  try {
    ensureSheets();
    result = handleAction(action, params);
  } catch (err) {
    result = {
      success: false,
      error: String(err && err.message ? err.message : err),
    };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setHeaders(CORS_HEADERS)
    .setMimeType(ContentService.MimeType.JSON);
}

function serveWebApp() {
  return HtmlService.createHtmlOutputFromFile(
    'index.html',
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function handleAction(action, params) {
  let result = { success: false, error: 'Invalid action' };

  try {
    ensureSheets();

    switch (action) {
    case 'login':
      result = handleLogin(params);
      break;
    case 'register':
      result = handleRegister(params);
      break;
    case 'createjob':
      result = handleCreateJob(params);
      break;
    case 'updatejob':
      result = handleUpdateJob(params);
      break;
    case 'getjobs':
      result = handleGetJobs(params);
      break;
    case 'getjobbyid':
      result = handleGetJobById(params);
      break;
    default:
      result = { success: false, error: 'Invalid action: ' + action };
    }
  } catch (err) {
    Logger.log('Error in handleAction: ' + err);
    result = {
      success: false,
      error: String(err && err.message ? err.message : err),
    };
  }

  return result;
}

function handleLogin(params) {
  try {
    const username = params.username;
    const password = params.password;

    if (!username || !password) {
      return { success: false, error: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' };
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const users = ss.getSheetByName(SHEET_USERS);
    
    if (!users) {
      return { success: false, error: 'ไม่พบตารางผู้ใช้' };
    }

    const data = users.getDataRange().getValues();
    const headers = data[0];
    const usernameIndex = headers.indexOf('Username');
    const passwordIndex = headers.indexOf('Password');
    const fullNameIndex = headers.indexOf('FullName');
    const roleIndex = headers.indexOf('Role');

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[usernameIndex] === username && row[passwordIndex] === password) {
        return {
          success: true,
          user: {
            username: row[usernameIndex],
            fullName: row[fullNameIndex],
            role: row[roleIndex]
          }
        };
      }
    }

    return { success: false, error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
  } catch (err) {
    Logger.log('Error in handleLogin: ' + err);
    return { success: false, error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ: ' + err.toString() };
  }
}

function handleRegister(params) {
  try {
    const { username, password, fullName, phone, email } = params;

    if (!username || !password || !fullName || !phone || !email) {
      return { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' };
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const users = ss.getSheetByName(SHEET_USERS);
    
    if (!users) {
      return { success: false, error: 'ไม่พบตารางผู้ใช้' };
    }

    // Check if username already exists
    const data = users.getDataRange().getValues();
    const headers = data[0];
    const usernameIndex = headers.indexOf('Username');

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[usernameIndex] === username) {
        return { success: false, error: 'ชื่อผู้ใช้นี้มีอยู่แล้ว' };
      }
    }

    // Add new user
    const timestamp = new Date();
    users.appendRow([timestamp, username, password, fullName, phone, email, 'Messenger']);

    return { success: true, message: 'ลงทะเบียนสำเร็จ' };
  } catch (err) {
    Logger.log('Error in handleRegister: ' + err);
    return { success: false, error: 'เกิดข้อผิดพลาดในการลงทะเบียน: ' + err.toString() };
  }
}

function handleCreateJob(params) {
  // Implementation similar to your existing code
  // This is just a placeholder for brevity
  return { success: true, message: 'Job created successfully' };
}

function handleUpdateJob(params) {
  // Implementation similar to your existing code
  // This is just a placeholder for brevity
  return { success: true, message: 'Job updated successfully' };
}

function handleGetJobs(params) {
  // Implementation similar to your existing code
  // This is just a placeholder for brevity
  return { success: true, jobs: [] };
}

function handleGetJobById(params) {
  // Implementation similar to your existing code
  // This is just a placeholder for brevity
  return { success: true, job: {} };
}

function ensureSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Ensure Jobs sheet exists
  let jobs = ss.getSheetByName(SHEET_JOBS);
  if (!jobs) jobs = ss.insertSheet(SHEET_JOBS);
  if (jobs.getLastRow() === 0) {
    jobs.getRange(1, 1, 1, 10).setValues([[
      'Timestamp', 'JobId', 'Username', 'Status', 'JobDate', 'Company', 
      'AssignedBy', 'Contact', 'PickupProvince', 'PickupDistrict'
    ]]);
  }
  
  // Ensure JobDetails sheet exists
  let details = ss.getSheetByName(SHEET_DETAILS);
  if (!details) details = ss.insertSheet(SHEET_DETAILS);
  if (details.getLastRow() === 0) {
    details.getRange(1, 1, 1, 9).setValues([[
      'JobId', 'DestinationCompany', 'DeliveryProvince', 'DeliveryDistrict', 
      'Recipient', 'Description', 'Amount', 'Sequence', 'Username'
    ]]);
  }
  
  // Ensure AdditionalFees sheet exists
  let fees = ss.getSheetByName(SHEET_FEES);
  if (!fees) fees = ss.insertSheet(SHEET_FEES);
  if (fees.getLastRow() === 0) {
    fees.getRange(1, 1, 1, 5).setValues([[
      'JobId', 'Description', 'Amount', 'Sequence', 'Username'
    ]]);
  }
  
  // Ensure Users sheet exists
  let users = ss.getSheetByName(SHEET_USERS);
  if (!users) users = ss.insertSheet(SHEET_USERS);
  if (users.getLastRow() === 0) {
    users.getRange(1, 1, 1, 7).setValues([[
      'Timestamp', 'Username', 'Password', 'FullName', 'Phone', 'Email', 'Role'
    ]]);
  }
  
  // Ensure JobHistory sheet exists
  let history = ss.getSheetByName(SHEET_HISTORY);
  if (!history) history = ss.insertSheet(SHEET_HISTORY);
  if (history.getLastRow() === 0) {
    history.getRange(1, 1, 1, 8).setValues([[
      'Timestamp', 'JobId', 'Username', 'Action', 'Details', 'OldValue', 'NewValue', 'ModifiedBy'
    ]]);
  }
}