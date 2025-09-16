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
    case 'test':
      result = { success: true, message: 'Test action successful' };
      break;
    default:
      result = { success: false, error: 'Unknown action: ' + action };
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

function getSS() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function ensureSheets() {
  const ss = getSS();

  // Jobs
  let jobs = ss.getSheetByName(SHEET_JOBS);
  if (!jobs) jobs = ss.insertSheet(SHEET_JOBS);
  if (jobs.getLastRow() === 0) {
    const headers = [
      'timestamp',
      'jobDate',
      'jobId',
      'username',
      'company',
      'assignedBy',
      'contact',
      'pickupProvince',
      'pickupDistrict',
      'status',
      'incompleteReason',
      'mainServiceFee',
      'additionalFeesTotal',
      'totalAmount',
      'jobCount',
      'feeCount',
      'companyTo1',
      'province1',
      'district1',
      'recipient1',
      'detail1',
      'amount1',
      'companyTo2',
      'province2',
      'district2',
      'recipient2',
      'detail2',
      'amount2',
      'companyTo3',
      'province3',
      'district3',
      'recipient3',
      'detail3',
      'amount3',
      'companyTo4',
      'province4',
      'district4',
      'recipient4',
      'detail4',
      'amount4',
      'companyTo5',
      'province5',
      'district5',
      'recipient5',
      'detail5',
      'amount5',
      'feeName1',
      'feeAmount1',
      'feeName2',
      'feeAmount2',
      'feeName3',
      'feeAmount3',
      'feeName4',
      'feeAmount4',
      'feeName5',
      'feeAmount5',
      'feeName6',
      'feeAmount6',
      'feeName7',
      'feeAmount7',
      'feeName8',
      'feeAmount8',
      'feeName9',
      'feeAmount9',
      'feeName10',
      'feeAmount10',
    ];
    jobs.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  // JobDetails
  let details = ss.getSheetByName(SHEET_DETAILS);
  if (!details) details = ss.insertSheet(SHEET_DETAILS);
  if (details.getLastRow() === 0) {
    const headers = [
      'timestamp',
      'jobId',
      'index',
      'companyTo',
      'province',
      'district',
      'recipient',
      'detail',
      'amount',
    ];
    details.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  // AdditionalFees
  let fees = ss.getSheetByName(SHEET_FEES);
  if (!fees) fees = ss.insertSheet(SHEET_FEES);
  if (fees.getLastRow() === 0) {
    const headers = ['timestamp', 'jobId', 'index', 'feeName', 'feeAmount'];
    fees.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  // Users
  let users = ss.getSheetByName(SHEET_USERS);
  if (!users) users = ss.insertSheet(SHEET_USERS);
  if (users.getLastRow() === 0) {
    const headers = [
      'username',
      'password',
      'fullName',
      'phone',
      'email',
      'createdAt',
      'lastLogin',
    ];
    users.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  // JobHistory
  let history = ss.getSheetByName(SHEET_HISTORY);
  if (!history) history = ss.insertSheet(SHEET_HISTORY);
  if (history.getLastRow() === 0) {
    const headers = [
      'timestamp',
      'action',
      'jobId',
      'username',
      'field',
      'oldValue',
      'newValue',
    ];
    history.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
}

// ============== Auth ==============
function handleRegister(p) {
  const required = ['username', 'password', 'fullName', 'phone', 'email'];
  for (const k of required) {
    if (!p[k] || String(p[k]).trim() === '')
      return { success: false, error: 'Missing field: ' + k };
  }

  const ss = getSS();
  const sh = ss.getSheetByName(SHEET_USERS);

  // Check if username already exists
  const data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(p.username)) {
      return { success: false, error: 'Username already exists' };
    }
  }

  // Hash the password before storing
  const hashedPassword = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(p.password).trim(),
  ).map(byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');

  // Add new user
  sh.appendRow([
    String(p.username).trim(),
    hashedPassword,
    String(p.fullName).trim(),
    String(p.phone).trim(),
    String(p.email).trim(),
    new Date(),
    '',
  ]);

  return { success: true, message: 'Registered successfully' };
}

function handleLogin(p) {
  if (!p.username || !p.password) {
    return { success: false, error: 'Username and password are required' };
  }

  const ss = getSS();
  const sh = ss.getSheetByName(SHEET_USERS);
  const data = sh.getDataRange().getValues();

  // Hash the provided password for comparison
  const hashedPassword = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(p.password),
  ).map(byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');

  // Look for user
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const [username, password, fullName, phone, email] = row;

    if (String(username) === String(p.username)) {
      // Check if password is already hashed (64 characters hex string)
      // or if it's a plain text password that needs to be migrated
      let passwordMatch = false;
      
      if (password.length === 64 && /^[0-9a-f]+$/.test(password)) {
        // Password is already hashed
        passwordMatch = (String(password) === hashedPassword);
      } else {
        // Password is plain text, compare directly and migrate if correct
        if (String(password) === String(p.password)) {
          passwordMatch = true;
          // Migrate to hashed password
          const newHashedPassword = Utilities.computeDigest(
            Utilities.DigestAlgorithm.SHA_256,
            String(p.password),
          ).map(byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
          
          sh.getRange(i + 1, 2).setValue(newHashedPassword);
        }
      }

      if (passwordMatch) {
        // Update last login
        sh.getRange(i + 1, 7).setValue(new Date());

        return {
          success: true,
          user: {
            username: String(username),
            fullName: String(fullName),
            phone: String(phone),
            email: String(email),
          },
        };
      }
      return { success: false, error: 'Wrong password' };
    }
  }

  return { success: false, error: 'User not found' };
}

// ============== Job Management ==============
/**
 * Create a new job
 * @param {Object} p - Parameters object
 * @returns {Object} Result object with success status and job ID
 */
function handleCreateJob(p) {
  const ss = getSS();
  const jobs = ss.getSheetByName(SHEET_JOBS);
  const history = ss.getSheetByName(SHEET_HISTORY);

  const timestamp = new Date().toISOString();

  // Validate jobDate
  let jobDate;
  if (p.jobDate) {
    const parsedDate = new Date(p.jobDate);
    if (!isNaN(parsedDate.getTime())) {
      jobDate = parsedDate; // Use user-provided date if valid
    } else {
      jobDate = new Date(); // Fall back to current date if invalid
    }
  } else {
    jobDate = new Date(); // Fall back to current date if not provided
  }

  // Create jobId
  const jobId = p.jobId || 'JOB-' + Math.floor(10000 + Math.random() * 90000);

  const newRow = [
    timestamp,
    jobDate.toISOString(),
    jobId,
    p.username || '',
    p.company || '',
    p.assignedBy || '',
    p.contact || '',
    p.pickupProvince || '',
    p.pickupDistrict || '',
    p.status || 'complete', // status
    p.incompleteReason || '', // incompleteReason
    toNumber(p.mainServiceFee),
    toNumber(p.additionalFeesTotal),
    toNumber(p.totalAmount),
    toNumber(p.jobCount),
    toNumber(p.feeCount),
  ];

  for (let i = 1; i <= 5; i++) {
    newRow.push(
      p['companyTo' + i] || '',
      p['province' + i] || '',
      p['district' + i] || '',
      p['recipient' + i] || '',
      p['detail' + i] || '',
      toNumber(p['amount' + i]),
    );
  }

  for (let j = 1; j <= 10; j++) {
    newRow.push(p['feeName' + j] || '', toNumber(p['feeAmount' + j]));
  }

  // Create new job
  jobs.appendRow(newRow);
  
  try {
    history.appendRow([
      new Date(),
      'create',
      jobId,
      p.username || '',
      'ALL',
      '',
      'Created new job',
    ]);
  } catch (e) {
    Logger.log('Error logging creation: ' + e);
  }

  return { success: true, jobId: jobId, message: 'Job created successfully' };
}

/**
 * Update an existing job
 * @param {Object} p - Parameters object
 * @returns {Object} Result object with success status and job ID
 */
function handleUpdateJob(p) {
  const ss = getSS();
  const jobs = ss.getSheetByName(SHEET_JOBS);
  const history = ss.getSheetByName(SHEET_HISTORY);

  if (!p.jobId) {
    return { success: false, error: 'Job ID is required for update' };
  }

  // Validate jobDate
  let jobDate;
  if (p.jobDate) {
    const parsedDate = new Date(p.jobDate);
    if (!isNaN(parsedDate.getTime())) {
      jobDate = parsedDate; // Use user-provided date if valid
    } else {
      jobDate = new Date(); // Fall back to current date if invalid
    }
  } else {
    jobDate = new Date(); // Fall back to current date if not provided
  }

  // Find existing job
  const jobData = jobs.getDataRange().getValues();
  const headers = jobData[0];
  let existingIndex = -1;

  // Find the row with this jobId
  for (let i = 1; i < jobData.length; i++) {
    if (String(jobData[i][2]) === String(p.jobId)) { // Column 2 is jobId
      existingIndex = i;
      break;
    }
  }

  if (existingIndex <= 0) {
    return { success: false, error: 'Job not found for update' };
  }

  // Get the original timestamp (preserve it)
  const originalTimestamp = jobData[existingIndex][0]; // Column 0 is timestamp

  const newRow = [
    originalTimestamp, // Preserve original timestamp
    jobDate.toISOString(),
    p.jobId,
    p.username || '',
    p.company || '',
    p.assignedBy || '',
    p.contact || '',
    p.pickupProvince || '',
    p.pickupDistrict || '',
    p.status || 'complete', // status
    p.incompleteReason || '', // incompleteReason
    toNumber(p.mainServiceFee),
    toNumber(p.additionalFeesTotal),
    toNumber(p.totalAmount),
    toNumber(p.jobCount),
    toNumber(p.feeCount),
  ];

  for (let i = 1; i <= 5; i++) {
    newRow.push(
      p['companyTo' + i] || '',
      p['province' + i] || '',
      p['district' + i] || '',
      p['recipient' + i] || '',
      p['detail' + i] || '',
      toNumber(p['amount' + i]),
    );
  }

  for (let j = 1; j <= 10; j++) {
    newRow.push(p['feeName' + j] || '', toNumber(p['feeAmount' + j]));
  }

  // Log changes to history
  const oldRow = jobData[existingIndex];
  for (
    let c = 0;
    c < Math.min(headers.length, newRow.length, oldRow.length);
    c++
  ) {
    const oldVal = oldRow[c];
    const newVal = newRow[c];
    if (String(oldVal) !== String(newVal)) {
      try {
        history.appendRow([
          new Date(),
          'update',
          p.jobId,
          p.username || '',
          headers[c],
          String(oldVal),
          String(newVal),
        ]);
      } catch (e) {
        Logger.log('Error logging history: ' + e);
      }
    }
  }
  
  // Update the job row
  jobs.getRange(existingIndex + 1, 1, 1, newRow.length).setValues([newRow]);

  return { success: true, jobId: p.jobId, message: 'Job updated successfully' };
}

/**
 * Get all jobs for a user
 * @param {Object} p - Parameters object with username
 * @returns {Object} Result object with success status and jobs array
 */
function handleGetJobs(p) {
  if (!p.username) {
    return { success: false, error: 'Username is required' };
  }

  const ss = getSS();
  const jobsSheet = ss.getSheetByName(SHEET_JOBS);
  const jobData = jobsSheet.getDataRange().getValues();

  if (jobData.length <= 1) {
    return { success: true, jobs: [] };
  }

  const headers = jobData[0];
  const userJobs = [];

  for (let i = 1; i < jobData.length; i++) {
    const row = jobData[i];
    const jobUsername = row[3]; // username column (0-indexed)

    if (String(jobUsername) === String(p.username)) {
      const job = {};
      headers.forEach((header, index) => {
        job[header] = row[index];
      });
      userJobs.push(job);
    }
  }

  return { success: true, jobs: userJobs };
}

/**
 * Get a specific job by ID
 * @param {Object} p - Parameters object with jobId
 * @returns {Object} Result object with success status and job object
 */
function handleGetJobById(p) {
  if (!p.jobId) {
    return { success: false, error: 'Job ID is required' };
  }

  const ss = getSS();
  const jobsSheet = ss.getSheetByName(SHEET_JOBS);
  
  // Use TextFinder to find the job ID in column C (index 3)
  const textFinder = jobsSheet.getRange('C:C').createTextFinder(p.jobId);
  const foundRange = textFinder.findNext();

  if (!foundRange) {
    return { success: false, error: 'Job not found' };
  }

  const rowIndex = foundRange.getRow();
  const headers = jobsSheet.getRange(1, 1, 1, jobsSheet.getLastColumn()).getValues()[0];
  const rowData = jobsSheet.getRange(rowIndex, 1, 1, jobsSheet.getLastColumn()).getValues()[0];

  const job = {};
  headers.forEach((header, index) => {
    job[header] = rowData[index];
  });

  return { success: true, job: job };
}

function toNumber(v) {
  if (v === undefined || v === null || v === '') return 0;
  const n = Number(v);
  return isNaN(n) ? 0 : n;
}

function setupSheets() {
  ensureSheets();
}