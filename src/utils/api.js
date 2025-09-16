// src/utils/api.js - API functions for Google Apps Script integration

import { safeLocalStorageGetItem, safeLocalStorageSetItem } from './storage.js';

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

export function submitToGoogleSheets(data) {
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

// Internal function that does the actual submission using fetch
async function submitToGoogleSheetsInternal(data) {
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