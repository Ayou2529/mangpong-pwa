/**
 * Google Apps Script for Mangpong Trading Delivery - CORS Fixed Version
 */
const SPREADSHEET_ID = '1fcq5P7vm3IxtJMDS9BLDwO8B14hFmmDdK257GHyoM';
const SHEET_JOBS = 'Jobs';
const SHEET_DETAILS = 'JobDetails';
const SHEET_FEES = 'AdditionalFees';  
const SHEET_USERS = 'Users';
const SHEET_HISTORY = 'JobHistory';

// Helper to build JSON or JSONP output without using setHeaders (not supported in GAS)
function createJsonOutput(result, callback) {
  var json = JSON.stringify(result);
  if (callback) {
    // JSONP response
    return ContentService.createTextOutput(callback + '(' + json + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  // Plain JSON response
  return ContentService.createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

// Handle GET requests
function doGet(e) {
  var params = (e && e.parameter) ? e.parameter : {};
  var action = (params.action || '').toLowerCase();
  var callback = params.callback; // support JSONP from frontend

  var result = { success: false, error: 'Invalid action' };

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
    result = { success: false, error: String(err && err.message ? err.message : err) };
  }

  // Return JSON or JSONP based on presence of callback
  return createJsonOutput(result, callback);
}

// Handle POST requests
function doPost(e) {
  var params = {};
  try {
    if (e && e.postData && e.postData.contents) {
      params = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      params = e.parameter;
    }
  } catch (parseErr) {
    return createJsonOutput({ success: false, error: 'Invalid JSON in request body' });
  }

  var action = (params.action || '').toLowerCase();
  var result = { success: false, error: 'Invalid action' };

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
    result = { success: false, error: String(err && err.message ? err.message : err) };
  }

  // POST returns plain JSON (frontend uses JSONP via GET for login)
  return createJsonOutput(result);
}

// Handle OPTIONS preflight requests
// doOptions removed; JSONP avoids CORS

// Login handler
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
            role: row[roleIndex],
          },
        };
      }
    }
    
    return { success: false, error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
  } catch (err) {
    return { success: false, error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ: ' + err.toString() };
  }
}

// Register handler
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
    return { success: false, error: 'เกิดข้อผิดพลาดในการลงทะเบียน: ' + err.toString() };
  }
}

// Get jobs handler
function handleGetJobs(params) {
  try {
    const { username } = params;
    
    if (!username) {
      return { success: false, error: 'กรุณาระบุชื่อผู้ใช้' };
    }
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const jobs = ss.getSheetByName(SHEET_JOBS);
    
    if (!jobs) {
      return { success: false, error: 'ไม่พบตารางงาน' };
    }
    
    const data = jobs.getDataRange().getValues();
    const headers = data[0];
    
    // Find column indices
    const usernameIndex = headers.indexOf('Username');
    const jobIdIndex = headers.indexOf('JobId');
    const timestampIndex = headers.indexOf('Timestamp');
    const statusIndex = headers.indexOf('Status');
    const jobDateIndex = headers.indexOf('JobDate');
    const companyIndex = headers.indexOf('Company');
    const assignedByIndex = headers.indexOf('AssignedBy');
    const contactIndex = headers.indexOf('Contact');
    const pickupProvinceIndex = headers.indexOf('PickupProvince');
    const pickupDistrictIndex = headers.indexOf('PickupDistrict');
    const totalAmountIndex = headers.indexOf('TotalAmount');
    
    const userJobs = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[usernameIndex] === username) {
        userJobs.push({
          jobId: row[jobIdIndex],
          timestamp: row[timestampIndex],
          status: row[statusIndex],
          jobDate: row[jobDateIndex],
          company: row[companyIndex],
          assignedBy: row[assignedByIndex],
          contact: row[contactIndex],
          pickupProvince: row[pickupProvinceIndex],
          pickupDistrict: row[pickupDistrictIndex],
          totalAmount: row[totalAmountIndex],
        });
      }
    }
    
    return { success: true, jobs: userJobs };
  } catch (err) {
    return { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลงาน: ' + err.toString() };
  }
}

// Ensure all required sheets exist
function ensureSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Ensure Jobs sheet exists
  let jobs = ss.getSheetByName(SHEET_JOBS);
  if (!jobs) jobs = ss.insertSheet(SHEET_JOBS);
  if (jobs.getLastRow() === 0) {
    jobs.getRange(1, 1, 1, 11).setValues([[
      'Timestamp', 'JobId', 'Username', 'Status', 'JobDate', 'Company', 
      'AssignedBy', 'Contact', 'PickupProvince', 'PickupDistrict', 'TotalAmount',
    ]]);
  }
  
  // Ensure JobDetails sheet exists
  let details = ss.getSheetByName(SHEET_DETAILS);
  if (!details) details = ss.insertSheet(SHEET_DETAILS);
  if (details.getLastRow() === 0) {
    details.getRange(1, 1, 1, 10).setValues([[
      'JobId', 'DestinationCompany', 'DeliveryProvince', 'DeliveryDistrict', 
      'Recipient', 'Description', 'Amount', 'Sequence', 'Username', 'Timestamp',
    ]]);
  }
  
  // Ensure AdditionalFees sheet exists
  let fees = ss.getSheetByName(SHEET_FEES);
  if (!fees) fees = ss.insertSheet(SHEET_FEES);
  if (fees.getLastRow() === 0) {
    fees.getRange(1, 1, 1, 6).setValues([[
      'JobId', 'Description', 'Amount', 'Sequence', 'Username', 'Timestamp',
    ]]);
  }
  
  // Ensure Users sheet exists
  let users = ss.getSheetByName(SHEET_USERS);
  if (!users) users = ss.insertSheet(SHEET_USERS);
  if (users.getLastRow() === 0) {
    users.getRange(1, 1, 1, 8).setValues([[
      'Timestamp', 'Username', 'Password', 'FullName', 'Phone', 'Email', 'Role', 'LastLogin',
    ]]);
  }
  
  // Ensure JobHistory sheet exists
  let history = ss.getSheetByName(SHEET_HISTORY);
  if (!history) history = ss.insertSheet(SHEET_HISTORY);
  if (history.getLastRow() === 0) {
    history.getRange(1, 1, 1, 9).setValues([[
      'Timestamp', 'JobId', 'Username', 'Action', 'Details', 'OldValue', 'NewValue', 'ModifiedBy', 'IPAddress',
    ]]);
  }
}

// Create job handler (placeholder)
function handleCreateJob(params) {
  return { success: true, message: 'Create job functionality placeholder' };
}

// Update job handler (placeholder)
function handleUpdateJob(params) {
  return { success: true, message: 'Update job functionality placeholder' };
}

// Get job by ID handler (placeholder)
function handleGetJobById(params) {
  return { success: true, message: 'Get job by ID functionality placeholder' };
}