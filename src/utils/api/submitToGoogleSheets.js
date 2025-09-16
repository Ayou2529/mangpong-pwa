// src/utils/api/submitToGoogleSheets.js - Updated API functions for Google Apps Script integration using fetch

import { safeLocalStorageGetItem, safeLocalStorageSetItem } from '../storage.js';

// Request queue for handling offline scenarios
export const requestQueue = {
  requests: [],
  isProcessing: false,
  
  // Add request to queue
  add: function(requestData) {
    this.requests.push({
      data: requestData,
      timestamp: Date.now(),
      attempts: 0,
    });
    this.saveToStorage();
    console.log('Request added to queue:', requestData);
  },
  
  // Process queue
  process: async function() {
    if (this.isProcessing || this.requests.length === 0 || !navigator.onLine) {
      return;
    }
    
    this.isProcessing = true;
    
    try {
      while (this.requests.length > 0) {
        const request = this.requests[0];
        request.attempts++;
        
        try {
          console.log(`Processing queued request (attempt ${request.attempts}):`, request.data);
          const response = await submitToGoogleSheetsInternal(request.data);
          
          // If successful, remove from queue
          this.requests.shift();
          this.saveToStorage();
          console.log('Queued request processed successfully');
        } catch (error) {
          console.warn(`Queued request failed (attempt ${request.attempts}):`, error);
          
          // If max attempts reached, remove from queue
          if (request.attempts >= 3) {
            console.error('Request failed after 3 attempts, removing from queue:', request.data);
            this.requests.shift();
            this.saveToStorage();
          } else {
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 1000 * request.attempts));
          }
        }
      }
    } finally {
      this.isProcessing = false;
    }
  },
  
  // Save queue to localStorage
  saveToStorage: function() {
    try {
      safeLocalStorageSetItem('mangpongRequestQueue', JSON.stringify(this.requests));
    } catch (error) {
      console.error('Failed to save request queue to storage:', error);
    }
  },
  
  // Load queue from localStorage
  loadFromStorage: function() {
    try {
      const stored = safeLocalStorageGetItem('mangpongRequestQueue');
      if (stored) {
        this.requests = JSON.parse(stored);
        console.log('Loaded request queue from storage:', this.requests);
      }
    } catch (error) {
      console.error('Failed to load request queue from storage:', error);
    }
  },
  
  // Clear queue
  clear: function() {
    this.requests = [];
    this.saveToStorage();
  },
};

export async function submitToGoogleSheets(data) {
  // If offline, queue the request
  if (!navigator.onLine) {
    console.log('Offline - queuing request:', data);
    requestQueue.add(data);
    // Return a mock success response for offline requests
    return Promise.resolve({ success: true, message: 'Request queued for later processing' });
  }
  
  // Wrapper function to implement retry mechanism
  return submitToGoogleSheetsWithRetry(data, 3); // Retry up to 3 times
}

// Submit data to Google Apps Script with retry mechanism
async function submitToGoogleSheetsWithRetry(data, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt} to connect to Google Sheets`);
      const result = await submitToGoogleSheetsInternal(data);
      return result;
    } catch (error) {
      console.warn(`Attempt ${attempt} failed:`, error.message);
      
      // If this is the last attempt, queue the request for later processing
      if (attempt === maxRetries) {
        console.log('All attempts failed - queuing request for later:', data);
        requestQueue.add(data);
        // Return a mock success response to prevent UI errors
        return { success: true, message: 'Request queued for later processing' };
      }
      
      // Wait before retrying with exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Max 10 seconds
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Mock implementation for development
function mockSubmitToGoogleSheetsInternal(data) {
  const delay = 1000; // Fixed delay for consistency
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock responses based on action
      switch (data.action) {
        case 'login':
          // Always allow login with username 'admin' and password 'password' in development
          if (data.username === 'admin' && data.password === 'password') {
            resolve({
              success: true,
              user: {
                username: 'admin',
                fullName: 'Admin User',
                role: 'Admin'
              }
            });
          } else if (data.username === 'messenger' && data.password === 'password') {
            resolve({
              success: true,
              user: {
                username: 'messenger',
                fullName: 'Messenger User',
                role: 'Messenger'
              }
            });
          } else {
            resolve({
              success: false,
              error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
              });
          }
          break;
          
        case 'register':
          resolve({
            success: true,
            message: 'ลงทะเบียนสำเร็จ'
          });
          break;
          
        case 'createJob':
          resolve({
            success: true,
            message: 'บันทึกงานสำเร็จ',
            jobId: 'JOB-' + Date.now()
          });
          break;
          
        case 'getJobs':
          resolve({
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
                totalAmount: 1000
              }
            ]
          });
          break;
          
        default:
          resolve({
            success: true,
            message: 'ดำเนินการสำเร็จ'
          });
      }
    }, delay);
  });
}

// Internal function that does the actual submission using fetch
export async function submitToGoogleSheetsInternal(data) {
  // Use mock implementation in development mode by checking if we're on localhost
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (isDev) {
    return mockSubmitToGoogleSheetsInternal(data);
  }
  
  // Check if Google Script URL is defined
  if (!window.GOOGLE_SCRIPT_URL) {
    throw new Error('Google Script URL ไม่ได้ถูกกำหนดไว้');
  }

  try {
    const response = await fetch(window.GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error(`ไม่สามารถเชื่อมต่อกับ Google Apps Script ได้: ${error.message}`);
  }
}