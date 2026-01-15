// Google Apps Script Code - แก้ไข CORS Issue
// ใช้ Deploy Management เพื่ออัปเดตโค้ดโดยไม่เปลี่ยน URL

function doGet(e) {
  const params = e && e.parameter ? e.parameter : {};
  const action = (params.action || '').toLowerCase();
  const callback = params.callback || 'callback';
  
  try {
    let result;
    
    switch(action) {
      case 'login':
        result = handleLogin(params);
        break;
      case 'register':
        result = handleRegister(params);
        break;
      case 'createjob':
        result = handleCreateJob(params);
        break;
      case 'getjobs':
        result = handleGetJobs(params);
        break;
      default:
        result = { success: false, error: 'Invalid action' };
    }
    
    // Return JSONP response (ไม่ใช้ setHeaders)
    return ContentService
      .createTextOutput(`${callback}(${JSON.stringify(result)})`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
      
  } catch (error) {
    console.error('Error:', error);
    return ContentService
      .createTextOutput(`${callback}(${JSON.stringify({success: false, error: error.toString()})})`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
}

function doPost(e) {
  // Handle POST requests (fallback)
  return doGet(e);
}

// Login handler
function handleLogin(params) {
  const username = params.username;
  const password = params.password;
  
  // Get user data from sheet
  const sheet = SpreadsheetApp.openById('1fcq5P7vm3IxtJMDS9BLDwOYm8B14hFmmDdK257GHyoM').getSheetByName('Users');
  const data = sheet.getDataRange().getValues();
  
  // Find user (Users sheet: Timestamp, Username, Password, FullName, Phone, Email, Role, LastLogin)
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === username && data[i][2] === password) {
      return {
        success: true,
        user: {
          username: username,
          fullName: data[i][3],
          role: data[i][6] || 'User',
          phone: data[i][4],
          email: data[i][5]
        }
      };
    }
  }
  
  return {
    success: false,
    error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
  };
}

// Register handler
function handleRegister(params) {
  const sheet = SpreadsheetApp.openById('1fcq5P7vm3IxtJMDS9BLDwOYm8B14hFmmDdK257GHyoM').getSheetByName('Users');
  
  // Check if user already exists (Users sheet: Timestamp, Username, Password, FullName, Phone, Email, Role, LastLogin)
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === params.username) {
      return {
        success: false,
        error: 'ชื่อผู้ใช้นี้มีอยู่แล้ว'
      };
    }
  }
  
  // Add new user
  sheet.appendRow([
    new Date(), // Timestamp
    params.username,
    params.password,
    params.fullName,
    params.phone,
    params.email,
    params.role || 'User',
    new Date() // LastLogin
  ]);
  
  return {
    success: true,
    message: 'ลงทะเบียนสำเร็จ'
  };
}

// Create job handler
function handleCreateJob(params) {
  const sheet = SpreadsheetApp.openById('1fcq5P7vm3IxtJMDS9BLDwOYm8B14hFmmDdK257GHyoM').getSheetByName('Jobs');
  
  const jobId = 'JOB-' + Date.now();
  
  // Jobs sheet: Timestamp, JobId, Username, Status, JobDate, Company, AssignedBy, Contact, PickupProvince, PickupDistrict, TotalAmount
  sheet.appendRow([
    new Date(), // Timestamp
    jobId,
    params.username,
    'pending', // Status
    params.jobDate,
    params.company,
    params.assignedBy,
    params.contact,
    params.pickupProvince,
    params.pickupDistrict,
    params.totalAmount
  ]);
  
  return {
    success: true,
    message: 'บันทึกงานสำเร็จ',
    jobId: jobId
  };
}

// Get jobs handler
function handleGetJobs(params) {
  const sheet = SpreadsheetApp.openById('1fcq5P7vm3IxtJMDS9BLDwOYm8B14hFmmDdK257GHyoM').getSheetByName('Jobs');
  const data = sheet.getDataRange().getValues();
  
  const jobs = [];
  // Jobs sheet: Timestamp, JobId, Username, Status, JobDate, Company, AssignedBy, Contact, PickupProvince, PickupDistrict, TotalAmount
  for (let i = 1; i < data.length; i++) {
    jobs.push({
      jobId: data[i][1],
      username: data[i][2],
      status: data[i][3],
      jobDate: data[i][4],
      company: data[i][5],
      assignedBy: data[i][6],
      contact: data[i][7],
      pickupProvince: data[i][8],
      pickupDistrict: data[i][9],
      totalAmount: data[i][10],
      createdAt: data[i][0]
    });
  }
  
  return {
    success: true,
    jobs: jobs
  };
}
