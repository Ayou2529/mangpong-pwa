/**
 * Google Apps Script for Mangpong Trading Delivery (with History)
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
  
  // Handle preflight OPTIONS request
  if (!e.parameter || Object.keys(e.parameter).length === 0) {
    return ContentService.createTextOutput('')
      .setHeaders(CORS_HEADERS)
      .setMimeType(ContentService.MimeType.TEXT);
  }
  
  const params = e && e.parameter ? e.parameter : {};
  const action = (params.action || '').toLowerCase();
  const callback = params.callback || 'callback';

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
  try {
    const { 
      jobId, username, jobDate, company, assignedBy, contact, 
      pickupProvince, pickupDistrict, jobDetails, additionalFees, totalAmount 
    } = params;

    if (!jobId || !username || !jobDate || !company || !assignedBy || !contact || 
        !pickupProvince || !pickupDistrict || !jobDetails || !totalAmount) {
      return { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' };
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Save main job data
    const jobs = ss.getSheetByName(SHEET_JOBS);
    if (!jobs) {
      return { success: false, error: 'ไม่พบตารางงาน' };
    }
    
    const timestamp = new Date();
    jobs.appendRow([
      timestamp, jobId, username, 'complete', jobDate, company, 
      assignedBy, contact, pickupProvince, pickupDistrict, totalAmount
    ]);

    // Save job details
    const details = ss.getSheetByName(SHEET_DETAILS);
    if (!details) {
      return { success: false, error: 'ไม่พบตารางรายละเอียดงาน' };
    }
    
    for (let i = 0; i < jobDetails.length; i++) {
      const detail = jobDetails[i];
      details.appendRow([
        jobId, detail.destinationCompany, detail.deliveryProvince, 
        detail.deliveryDistrict, detail.recipient, detail.description, 
        detail.amount, i + 1, username
      ]);
    }

    // Save additional fees
    if (additionalFees && additionalFees.length > 0) {
      const fees = ss.getSheetByName(SHEET_FEES);
      if (!fees) {
        return { success: false, error: 'ไม่พบตารางค่าบริการเพิ่มเติม' };
      }
      
      for (let i = 0; i < additionalFees.length; i++) {
        const fee = additionalFees[i];
        fees.appendRow([
          jobId, fee.description, fee.amount, i + 1, username
        ]);
      }
    }

    // Save to history
    const history = ss.getSheetByName(SHEET_HISTORY);
    if (history) {
      history.appendRow([
        new Date(), jobId, username, 'create', 
        `สร้างงาน ${jobId}`, '', JSON.stringify(params), 'System'
      ]);
    }

    return { success: true, message: 'บันทึกงานสำเร็จ', jobId: jobId };
  } catch (err) {
    Logger.log('Error in handleCreateJob: ' + err);
    return { success: false, error: 'เกิดข้อผิดพลาดในการบันทึกงาน: ' + err.toString() };
  }
}

function handleUpdateJob(params) {
  try {
    const { 
      jobId, username, jobDate, company, assignedBy, contact, 
      pickupProvince, pickupDistrict, jobDetails, additionalFees, totalAmount, status
    } = params;

    if (!jobId || !username || !jobDate || !company || !assignedBy || !contact || 
        !pickupProvince || !pickupDistrict || !jobDetails || !totalAmount) {
      return { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' };
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Update main job data
    const jobs = ss.getSheetByName(SHEET_JOBS);
    if (!jobs) {
      return { success: false, error: 'ไม่พบตารางงาน' };
    }
    
    const jobData = jobs.getDataRange().getValues();
    const headers = jobData[0];
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

    let jobFound = false;
    for (let i = 1; i < jobData.length; i++) {
      if (jobData[i][jobIdIndex] === jobId) {
        jobFound = true;
        jobs.getRange(i + 1, timestampIndex + 1).setValue(new Date());
        jobs.getRange(i + 1, statusIndex + 1).setValue(status || 'complete');
        jobs.getRange(i + 1, jobDateIndex + 1).setValue(jobDate);
        jobs.getRange(i + 1, companyIndex + 1).setValue(company);
        jobs.getRange(i + 1, assignedByIndex + 1).setValue(assignedBy);
        jobs.getRange(i + 1, contactIndex + 1).setValue(contact);
        jobs.getRange(i + 1, pickupProvinceIndex + 1).setValue(pickupProvince);
        jobs.getRange(i + 1, pickupDistrictIndex + 1).setValue(pickupDistrict);
        jobs.getRange(i + 1, totalAmountIndex + 1).setValue(totalAmount);
        break;
      }
    }

    if (!jobFound) {
      return { success: false, error: 'ไม่พบงานที่ต้องการแก้ไข' };
    }

    // Update job details
    const details = ss.getSheetByName(SHEET_DETAILS);
    if (!details) {
      return { success: false, error: 'ไม่พบตารางรายละเอียดงาน' };
    }
    
    // Clear existing details for this job
    const detailData = details.getDataRange().getValues();
    const detailJobIdIndex = detailData[0].indexOf('JobId');
    
    for (let i = detailData.length - 1; i >= 1; i--) {
      if (detailData[i][detailJobIdIndex] === jobId) {
        details.deleteRow(i + 1);
      }
    }
    
    // Add updated details
    for (let i = 0; i < jobDetails.length; i++) {
      const detail = jobDetails[i];
      details.appendRow([
        jobId, detail.destinationCompany, detail.deliveryProvince, 
        detail.deliveryDistrict, detail.recipient, detail.description, 
        detail.amount, i + 1, username
      ]);
    }

    // Update additional fees
    const fees = ss.getSheetByName(SHEET_FEES);
    if (fees) {
      // Clear existing fees for this job
      const feeData = fees.getDataRange().getValues();
      const feeJobIdIndex = feeData[0].indexOf('JobId');
      
      for (let i = feeData.length - 1; i >= 1; i--) {
        if (feeData[i][feeJobIdIndex] === jobId) {
          fees.deleteRow(i + 1);
        }
      }
      
      // Add updated fees
      if (additionalFees && additionalFees.length > 0) {
        for (let i = 0; i < additionalFees.length; i++) {
          const fee = additionalFees[i];
          fees.appendRow([
            jobId, fee.description, fee.amount, i + 1, username
          ]);
        }
      }
    }

    // Save to history
    const history = ss.getSheetByName(SHEET_HISTORY);
    if (history) {
      history.appendRow([
        new Date(), jobId, username, 'update', 
        `แก้ไขงาน ${jobId}`, '', JSON.stringify(params), 'System'
      ]);
    }

    return { success: true, message: 'อัปเดตงานสำเร็จ', jobId: jobId };
  } catch (err) {
    Logger.log('Error in handleUpdateJob: ' + err);
    return { success: false, error: 'เกิดข้อผิดพลาดในการอัปเดตงาน: ' + err.toString() };
  }
}

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
          totalAmount: row[totalAmountIndex]
        });
      }
    }

    return { success: true, jobs: userJobs };
  } catch (err) {
    Logger.log('Error in handleGetJobs: ' + err);
    return { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลงาน: ' + err.toString() };
  }
}

function handleGetJobById(params) {
  try {
    const { jobId, username } = params;
    
    if (!jobId || !username) {
      return { success: false, error: 'กรุณาระบุรหัสงานและชื่อผู้ใช้' };
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

    let job = null;
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[jobIdIndex] === jobId && row[usernameIndex] === username) {
        job = {
          jobId: row[jobIdIndex],
          timestamp: row[timestampIndex],
          status: row[statusIndex],
          jobDate: row[jobDateIndex],
          company: row[companyIndex],
          assignedBy: row[assignedByIndex],
          contact: row[contactIndex],
          pickupProvince: row[pickupProvinceIndex],
          pickupDistrict: row[pickupDistrictIndex],
          totalAmount: row[totalAmountIndex]
        };
        break;
      }
    }

    if (!job) {
      return { success: false, error: 'ไม่พบงานที่ต้องการ' };
    }

    // Get job details
    const details = ss.getSheetByName(SHEET_DETAILS);
    if (details) {
      const detailData = details.getDataRange().getValues();
      const detailHeaders = detailData[0];
      const detailJobIdIndex = detailHeaders.indexOf('JobId');
      const detailDestinationCompanyIndex = detailHeaders.indexOf('DestinationCompany');
      const detailDeliveryProvinceIndex = detailHeaders.indexOf('DeliveryProvince');
      const detailDeliveryDistrictIndex = detailHeaders.indexOf('DeliveryDistrict');
      const detailRecipientIndex = detailHeaders.indexOf('Recipient');
      const detailDescriptionIndex = detailHeaders.indexOf('Description');
      const detailAmountIndex = detailHeaders.indexOf('Amount');
      const detailSequenceIndex = detailHeaders.indexOf('Sequence');

      const jobDetails = [];
      
      for (let i = 1; i < detailData.length; i++) {
        const row = detailData[i];
        if (row[detailJobIdIndex] === jobId) {
          jobDetails.push({
            destinationCompany: row[detailDestinationCompanyIndex],
            deliveryProvince: row[detailDeliveryProvinceIndex],
            deliveryDistrict: row[detailDeliveryDistrictIndex],
            recipient: row[detailRecipientIndex],
            description: row[detailDescriptionIndex],
            amount: row[detailAmountIndex],
            sequence: row[detailSequenceIndex]
          });
        }
      }
      
      // Sort by sequence
      jobDetails.sort((a, b) => a.sequence - b.sequence);
      job.jobDetails = jobDetails;
    }

    // Get additional fees
    const fees = ss.getSheetByName(SHEET_FEES);
    if (fees) {
      const feeData = fees.getDataRange().getValues();
      const feeHeaders = feeData[0];
      const feeJobIdIndex = feeHeaders.indexOf('JobId');
      const feeDescriptionIndex = feeHeaders.indexOf('Description');
      const feeAmountIndex = feeHeaders.indexOf('Amount');
      const feeSequenceIndex = feeHeaders.indexOf('Sequence');

      const additionalFees = [];
      
      for (let i = 1; i < feeData.length; i++) {
        const row = feeData[i];
        if (row[feeJobIdIndex] === jobId) {
          additionalFees.push({
            description: row[feeDescriptionIndex],
            amount: row[feeAmountIndex],
            sequence: row[feeSequenceIndex]
          });
        }
      }
      
      // Sort by sequence
      additionalFees.sort((a, b) => a.sequence - b.sequence);
      job.additionalFees = additionalFees;
    }

    return { success: true, job: job };
  } catch (err) {
    Logger.log('Error in handleGetJobById: ' + err);
    return { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลงาน: ' + err.toString() };
  }
}

function ensureSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Ensure Jobs sheet exists
  let jobs = ss.getSheetByName(SHEET_JOBS);
  if (!jobs) jobs = ss.insertSheet(SHEET_JOBS);
  if (jobs.getLastRow() === 0) {
    jobs.getRange(1, 1, 1, 11).setValues([[
      'Timestamp', 'JobId', 'Username', 'Status', 'JobDate', 'Company', 
      'AssignedBy', 'Contact', 'PickupProvince', 'PickupDistrict', 'TotalAmount'
    ]]);
  }
  
  // Ensure JobDetails sheet exists
  let details = ss.getSheetByName(SHEET_DETAILS);
  if (!details) details = ss.insertSheet(SHEET_DETAILS);
  if (details.getLastRow() === 0) {
    details.getRange(1, 1, 1, 10).setValues([[
      'JobId', 'DestinationCompany', 'DeliveryProvince', 'DeliveryDistrict', 
      'Recipient', 'Description', 'Amount', 'Sequence', 'Username', 'Timestamp'
    ]]);
  }
  
  // Ensure AdditionalFees sheet exists
  let fees = ss.getSheetByName(SHEET_FEES);
  if (!fees) fees = ss.insertSheet(SHEET_FEES);
  if (fees.getLastRow() === 0) {
    fees.getRange(1, 1, 1, 6).setValues([[
      'JobId', 'Description', 'Amount', 'Sequence', 'Username', 'Timestamp'
    ]]);
  }
  
  // Ensure Users sheet exists
  let users = ss.getSheetByName(SHEET_USERS);
  if (!users) users = ss.insertSheet(SHEET_USERS);
  if (users.getLastRow() === 0) {
    users.getRange(1, 1, 1, 8).setValues([[
      'Timestamp', 'Username', 'Password', 'FullName', 'Phone', 'Email', 'Role', 'LastLogin'
    ]]);
  }
  
  // Ensure JobHistory sheet exists
  let history = ss.getSheetByName(SHEET_HISTORY);
  if (!history) history = ss.insertSheet(SHEET_HISTORY);
  if (history.getLastRow() === 0) {
    history.getRange(1, 1, 1, 9).setValues([[
      'Timestamp', 'JobId', 'Username', 'Action', 'Details', 'OldValue', 'NewValue', 'ModifiedBy', 'IPAddress'
    ]]);
  }
}