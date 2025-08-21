/**
 * Google Apps Script for JSONP Web App (with History)
 * Actions: login, register, saveJob
 * Sheets: Jobs, JobDetails, AdditionalFees, Users, JobHistory
 */
const SPREADSHEET_ID = '1fcq5P7vm3IxtJMDS9BLDwOYm8B14hFmmDdK257GHyoM';
const SHEET_JOBS = 'Jobs';
const SHEET_DETAILS = 'JobDetails';
const SHEET_FEES = 'AdditionalFees';
const SHEET_USERS = 'Users';
const SHEET_HISTORY = 'JobHistory';

function doGet(e) {
  const params = e && e.parameter ? e.parameter : {};
  const callback = params.callback || 'callback';
  const action = (params.action || '').toLowerCase();

  let result = { success: false, error: 'Invalid action' };

  try {
    ensureSheets();

    if (action === 'login') {
      result = handleLogin(params);
    } else if (action === 'register') {
      result = handleRegister(params);
    } else if (action === 'savejob') {
      result = handleSaveJob(params);
    } else if (action === 'getuserjobs') {
      result = handleGetUserJobs(params);
    } else if (action === 'getjobs') {
      result = handleGetJobs(params);
    } else {
      result = { success: false, error: 'Unknown action' };
    }
  } catch (err) {
    result = { success: false, error: String(err && err.message ? err.message : err) };
  }

  return ContentService
    .createTextOutput(`${callback}(${JSON.stringify(result)})`)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function handleGetUserJobs(p) {
  const ss = getSS();
  const jobsSheet = ss.getSheetByName(SHEET_JOBS);
  const jobData = jobsSheet.getDataRange().getValues();
  const headers = jobData.shift(); // remove header row

  const jobs = jobData.filter(row => row[3] === p.username).map(row => {
    const job = {};
    headers.forEach((header, index) => {
      job[header] = row[index];
    });
    return job;
  });

  return { success: true, jobs: jobs };
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
      'timestamp','jobDate','jobId','username','company','assignedBy','contact',
      'pickupProvince','pickupDistrict','status','incompleteReason',
      'mainServiceFee','additionalFeesTotal','totalAmount',
      'jobCount','feeCount',
      'companyTo1','province1','district1','recipient1','detail1','amount1',
      'companyTo2','province2','district2','recipient2','detail2','amount2',
      'companyTo3','province3','district3','recipient3','detail3','amount3',
      'companyTo4','province4','district4','recipient4','detail4','amount4',
      'companyTo5','province5','district5','recipient5','detail5','amount5',
      'feeName1','feeAmount1','feeName2','feeAmount2','feeName3','feeAmount3',
      'feeName4','feeAmount4','feeName5','feeAmount5','feeName6','feeAmount6',
      'feeName7','feeAmount7','feeName8','feeAmount8','feeName9','feeAmount9',
      'feeName10','feeAmount10'
    ];
    jobs.getRange(1,1,1,headers.length).setValues([headers]);
  }

  // JobDetails
  let details = ss.getSheetByName(SHEET_DETAILS);
  if (!details) details = ss.insertSheet(SHEET_DETAILS);
  if (details.getLastRow() === 0) {
    const headers = ['timestamp','jobId','index','companyTo','province','district','recipient','detail','amount'];
    details.getRange(1,1,1,headers.length).setValues([headers]);
  }

  // AdditionalFees
  let fees = ss.getSheetByName(SHEET_FEES);
  if (!fees) fees = ss.insertSheet(SHEET_FEES);
  if (fees.getLastRow() === 0) {
    const headers = ['timestamp','jobId','index','feeName','feeAmount'];
    fees.getRange(1,1,1,headers.length).setValues([headers]);
  }

  // Users
  let users = ss.getSheetByName(SHEET_USERS);
  if (!users) users = ss.insertSheet(SHEET_USERS);
  if (users.getLastRow() === 0) {
    const headers = ['username','password','fullName','phone','email','createdAt','lastLogin'];
    users.getRange(1,1,1,headers.length).setValues([headers]);
  }

  // JobHistory
  let history = ss.getSheetByName(SHEET_HISTORY);
  if (!history) history = ss.insertSheet(SHEET_HISTORY);
  if (history.getLastRow() === 0) {
    const headers = ['timestamp','action','jobId','username','field','oldValue','newValue'];
    history.getRange(1,1,1,headers.length).setValues([headers]);
  }
}

// ============== Auth ==============
function handleRegister(p) {
  const required = ['username','password','fullName','phone','email'];
  for (let k of required){
    if (!p[k]) return { success:false, error: 'Missing field: ' + k };
  }

  const ss = getSS();
  const sh = ss.getSheetByName(SHEET_USERS);
  const usernames = sh.getRange(2,1,Math.max(0,sh.getLastRow()-1),1).getValues().flat();
  if (usernames.includes(p.username)) return { success:false, error:'Username already exists' };

  sh.appendRow([p.username,p.password,p.fullName,p.phone,p.email,new Date(),'']);
  return { success:true, message:'Registered' };
}

function handleLogin(p) {
  const ss = getSS();
  const sh = ss.getSheetByName(SHEET_USERS);
  const rows = sh.getRange(2,1,Math.max(0,sh.getLastRow()-1),7).getValues();
  for (let i=0;i<rows.length;i++){
    const [username,password,fullName,phone,email,createdAt,lastLogin] = rows[i];
    if (String(username) === String(p.username)) {
      if (String(password) === String(p.password)) {
        sh.getRange(i+2,7).setValue(new Date());
        return { success:true, user:{ username, fullName, phone, email } };
      }
      return { success:false, error:'Wrong password' };
    }
  }
  return { success:false, error:'User not found' };
}

// ============== Save Job (with History) ==============
function handleSaveJob(p) {
  const ss = getSS();
  const jobs = ss.getSheetByName(SHEET_JOBS);
  const details = ss.getSheetByName(SHEET_DETAILS);
  const fees = ss.getSheetByName(SHEET_FEES);
  const history = ss.getSheetByName(SHEET_HISTORY);

  const timestamp = new Date().toISOString();
  
  // ใช้ jobId จากพารามิเตอร์ ถ้าไม่มีค่อยสร้างใหม่
  let jobId = (p.jobId && p.jobId.trim()) ? p.jobId.trim() : ('JOB-' + Math.floor(10000 + Math.random()*90000));

  // ค้นหา job เดิม
  const jobData = jobs.getDataRange().getValues();
  const headers = jobData[0];
  let existingIndex = -1;
  
  // หาแถวที่มี jobId นี้อยู่แล้ว
  for (let i = 1; i < jobData.length; i++) {
    if (jobData[i][2] === jobId) { // คอลัมน์ที่ 2 คือ jobId
      existingIndex = i;
      break;
    }
  }

  const newRow = [
    timestamp, p.jobDate||'', jobId, p.username||'', p.company||'', p.assignedBy||'', p.contact||'',
    p.pickupProvince||'', p.pickupDistrict||'', p.status||'', p.incompleteReason||'',
    toNumber(p.mainServiceFee), toNumber(p.additionalFeesTotal), toNumber(p.totalAmount),
    toNumber(p.jobCount), toNumber(p.feeCount)
  ];

  for (let i=1;i<=5;i++){
    newRow.push(p['companyTo'+i]||'', p['province'+i]||'', p['district'+i]||'',
                p['recipient'+i]||'', p['detail'+i]||'', toNumber(p['amount'+i]));
  }
  for (let j=1;j<=10;j++){
    newRow.push(p['feeName'+j]||'', toNumber(p['feeAmount'+j]));
  }

  if (existingIndex > 0) {
    // แก้ไข → log ค่าเก่า/ใหม่
    const oldRow = jobData[existingIndex];
    for (let c=0;c<headers.length;c++){
      const oldVal = oldRow[c];
      const newVal = newRow[c];
      if (String(oldVal) !== String(newVal)) {
        history.appendRow([new Date(), "update", jobId, p.username||'', headers[c], oldVal, newVal]);
      }
    }
    jobs.getRange(existingIndex+1,1,1,newRow.length).setValues([newRow]);
  } else {
    // สร้างใหม่
    jobs.appendRow(newRow);
    history.appendRow([new Date(),"create",jobId,p.username||'',"ALL","","Created new job"]);
  }

  return { success:true, jobId: jobId };
}

function toNumber(v) { let n = Number(v); return isNaN(n) ? 0 : n; }
function setupSheets() { ensureSheets(); }

function handleGetJobs(p) {
    const ss = getSS();
    const jobsSheet = ss.getSheetByName(SHEET_JOBS);
    const jobData = jobsSheet.getDataRange().getValues();
    const headers = jobData[0];
    
    const userJobs = [];
    
    for (let i = 1; i < jobData.length; i++) {
        const row = jobData[i];
        const jobUsername = row[3]; // username column
        
        if (jobUsername === p.username) {
            const job = {};
            headers.forEach((header, index) => {
                job[header] = row[index];
            });
            userJobs.push(job);
        }
    }
    
    return { success: true, jobs: userJobs };
}