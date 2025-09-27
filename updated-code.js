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

// Add CORS headers function
function setCORSHeaders(response) {
  const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '3600',
  };
  
  return response.setHeaders(CORS_HEADERS);
}

function doGet(e) {
  // Handle preflight requests
  if (e.parameter.method === 'OPTIONS') {
    return setCORSHeaders(ContentService.createTextOutput(''));
  }
  
  const params = e && e.parameter ? e.parameter : {};
  const action = (params.action || '').toLowerCase();
  const callback = params.callback || 'callback';

  // Special case for service worker
  if (params.page === 'service-worker') {
    return setCORSHeaders(
      ContentService.createTextOutput(
        HtmlService.createHtmlOutputFromFile('service-worker.js').getContent(),
      ).setMimeType(ContentService.MimeType.JAVASCRIPT)
    );
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
    return setCORSHeaders(
      ContentService.createTextOutput(
        `${callback}(${JSON.stringify(result)})`,
      ).setMimeType(ContentService.MimeType.JAVASCRIPT)
    );
  }
  
  // For regular requests, return JSON response with CORS headers
  return setCORSHeaders(
    ContentService.createTextOutput(
      JSON.stringify(result),
    ).setMimeType(ContentService.MimeType.JSON)
  );
}

function doPost(e) {
  // Handle preflight requests
  if (e.parameter && e.parameter.method === 'OPTIONS') {
    return setCORSHeaders(ContentService.createTextOutput(''));
  }
  
  let params = {};
  try {
    // Handle both form data and JSON payloads
    if (e.postData && e.postData.type === 'application/json') {
      params = JSON.parse(e.postData.contents);
    } else {
      params = e.parameter || {};
    }
  } catch (err) {
    return setCORSHeaders(
      ContentService
        .createTextOutput(
          JSON.stringify({
            success: false,
            error: 'Invalid JSON in request body',
          }),
        )
        .setMimeType(ContentService.MimeType.JSON)
    );
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

  return setCORSHeaders(
    ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON)
  );
}

// Handle OPTIONS preflight requests
function doOptions(e) {
  return setCORSHeaders(ContentService.createTextOutput(''));
}

function serveWebApp() {
  return setCORSHeaders(
    HtmlService.createHtmlOutputFromFile(
      'index.html',
    ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
  );
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

// ... rest of your existing code remains the same ...
// (I'm not including the rest of the functions for brevity since they don't need changes for CORS)