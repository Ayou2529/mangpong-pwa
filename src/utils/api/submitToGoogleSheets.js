// src/utils/api/submitToGoogleSheets.js - Updated API functions for Google Apps Script integration using JSONP

import {
  safeLocalStorageGetItem,
  safeLocalStorageSetItem,
} from '../storage.js';

// Request queue for handling offline scenarios
export const requestQueue = {
  requests: [],
  isProcessing: false,

  // Add request to queue
  add: function (requestData) {
    this.requests.push({
      data: requestData,
      timestamp: Date.now(),
      attempts: 0,
    });
    this.saveToStorage();
    // console.log('Request added to queue:', requestData);
  },

  // Process queue
  process: async function () {
    if (this.isProcessing || this.requests.length === 0 || !navigator.onLine) {
      return;
    }

    this.isProcessing = true;

    try {
      while (this.requests.length > 0) {
        const request = this.requests[0];
        request.attempts++;

        try {
          // console.log(`Processing queued request (attempt ${request.attempts}):`, request.data);
          await submitToGoogleSheetsInternal(request.data);

          // If successful, remove from queue
          this.requests.shift();
          this.saveToStorage();
          // console.log('Queued request processed successfully');
        } catch {
          // console.warn(`Queued request failed (attempt ${request.attempts}):`, error);

          // If max attempts reached, remove from queue
          if (request.attempts >= 3) {
            // console.error('Request failed after 3 attempts, removing from queue:', request.data);
            this.requests.shift();
            this.saveToStorage();
          } else {
            // Wait before retrying
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * request.attempts),
            );
          }
        }
      }
    } finally {
      this.isProcessing = false;
    }
  },

  // Save queue to localStorage
  saveToStorage: function () {
    try {
      safeLocalStorageSetItem(
        'mangpongRequestQueue',
        JSON.stringify(this.requests),
      );
    } catch {
      // console.error('Failed to save request queue to storage:', error);
    }
  },

  // Load queue from localStorage
  loadFromStorage: function () {
    try {
      const stored = safeLocalStorageGetItem('mangpongRequestQueue');
      if (stored) {
        this.requests = JSON.parse(stored);
        // console.log('Loaded request queue from storage:', this.requests);
      }
    } catch {
      // console.error('Failed to load request queue from storage:', error);
    }
  },

  // Clear queue
  clear: function () {
    this.requests = [];
    this.saveToStorage();
  },
};

export async function submitToGoogleSheets(data) {
  // If offline, queue the request
  if (!navigator.onLine) {
    // console.log('Offline - queuing request:', data);
    requestQueue.add(data);
    // Return a mock success response for offline requests
    return Promise.resolve({
      success: true,
      message: 'Request queued for later processing',
    });
  }

  // Wrapper function to implement retry mechanism
  return submitToGoogleSheetsWithRetry(data, 3); // Retry up to 3 times
}

// Submit data to Google Apps Script with retry mechanism
async function submitToGoogleSheetsWithRetry(data, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // console.log(`Attempt ${attempt} to connect to Google Sheets`);
      const result = await submitToGoogleSheetsInternal(data);
      return result;
    } catch {
      // console.warn(`Attempt ${attempt} failed:`, error.message);

      // If this is the last attempt, queue the request for later processing
      if (attempt === maxRetries) {
        // console.log('All attempts failed - queuing request for later:', data);
        requestQueue.add(data);
        // Return a mock success response to prevent UI errors
        return {
          success: true,
          message: 'Request queued for later processing',
        };
      }

      // Wait before retrying with exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Max 10 seconds
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// Mock implementation for development
function mockSubmitToGoogleSheetsInternal(data) {
  const delay = 1000; // Fixed delay for consistency

  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock responses based on action
      const mockResponse = generateMockResponse(data);
      resolve(mockResponse);
    }, delay);
  });
}

// Generate mock response based on action
function generateMockResponse(data) {
  switch (data.action) {
  case 'login':
    return generateLoginResponse(data);

  case 'register':
    return {
      success: true,
      message: 'ลงทะเบียนสำเร็จ',
    };

  case 'createJob':
    return {
      success: true,
      message: 'บันทึกงานสำเร็จ',
      jobId: 'JOB-' + Date.now(),
    };

  case 'getJobs':
    return {
      success: true,
      jobs: [
        {
          jobId: 'JOB-001',
          timestamp: new Date().toISOString(),
          status: 'complete',
          jobDate: new Date().toISOString(),
          company: 'ทดสอบ บริษัท',
          assignedBy: 'ทดสอบ ผู้สั่งงาน',
          contact: '0123456789',
          pickupProvince: 'กรุงเทพมหานคร',
          pickupDistrict: 'บางนา',
          totalAmount: 1000,
        },
      ],
    };

  default:
    return {
      success: true,
      message: 'ดำเนินการสำเร็จ',
    };
  }
}

// Generate login response
function generateLoginResponse(data) {
  // Always allow login with username 'admin' and password 'password' in development
  if (data.username === 'admin' && data.password === 'password') {
    return {
      success: true,
      user: {
        username: 'admin',
        fullName: 'Admin User',
        role: 'Admin',
      },
    };
  } else if (data.username === 'messenger' && data.password === 'password') {
    return {
      success: true,
      user: {
        username: 'messenger',
        fullName: 'Messenger User',
        role: 'Messenger',
      },
    };
  } else {
    return {
      success: false,
      error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
    };
  }
}

// Internal function that does the actual submission using JSONP
export async function submitToGoogleSheetsInternal(data) {
  // Check if Google Script URL is defined
  if (!window.GOOGLE_SCRIPT_URL) {
    throw new Error('Google Script URL ไม่ได้ถูกกำหนดไว้');
  }

  console.log('Using JSONP to connect to Google Apps Script:', window.GOOGLE_SCRIPT_URL);
  console.log('Sending data:', data);

  // Use JSONP instead of fetch to avoid CORS issues
  return new Promise((resolve, reject) => {
    try {
      // Create unique callback name
      const callbackName = 'callback_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
      
      // Create global callback function
      window[callbackName] = function(response) {
        console.log('JSONP response received:', response);
        
        // Clean up
        delete window[callbackName];
        const script = document.getElementById('jsonp-script-' + callbackName);
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
        
        // Check if response is valid
        if (response && typeof response === 'object') {
          resolve(response);
        } else {
          reject(new Error('Invalid response format'));
        }
      };
      
      // Create query parameters
      const params = new URLSearchParams({
        ...data,
        callback: callbackName,
        _random: Math.random() // Prevent caching
      });
      
      // Create script tag for JSONP
      const script = document.createElement('script');
      script.id = 'jsonp-script-' + callbackName;
      script.src = `${window.GOOGLE_SCRIPT_URL}?${params.toString()}`;
      
      // Handle error
      script.onerror = function() {
        console.error('JSONP script failed to load');
        delete window[callbackName];
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        reject(new Error('ไม่สามารถเชื่อมต่อกับ Google Apps Script ได้'));
      };
      
      // Add script to document
      document.head.appendChild(script);
      
      // Set timeout for connection
      setTimeout(() => {
        if (window[callbackName]) {
          console.error('JSONP request timeout');
          delete window[callbackName];
          const timeoutScript = document.getElementById('jsonp-script-' + callbackName);
          if (timeoutScript && timeoutScript.parentNode) {
            timeoutScript.parentNode.removeChild(timeoutScript);
          }
          reject(new Error('การเชื่อมต่อล้มเหลว: หมดเวลา'));
        }
      }, 30000); // 30 seconds
      
    } catch (error) {
      console.error('JSONP error:', error);
      reject(new Error('เกิดข้อผิดพลาดในการเชื่อมต่อ: ' + error.message));
    }
  });
}
