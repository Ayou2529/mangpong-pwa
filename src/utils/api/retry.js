// src/utils/api/retry.js - Retry mechanism for API calls

// Remove the incorrect import since we're now exporting the function from submitToGoogleSheets.js

/**
 * Submit data to Google Apps Script with retry mechanism
 * @param {Object} data - The data to submit
 * @param {number} maxRetries - Maximum number of retries
 * @returns {Promise} - Promise that resolves with the response
 */
export async function submitToGoogleSheetsWithRetry(data, maxRetries = 3) {
  // Import the function dynamically to avoid circular dependencies
  const { submitToGoogleSheetsInternal } = await import('./submitToGoogleSheets.js');
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt} to connect to Google Sheets`);
      const result = await submitToGoogleSheetsInternal(data);
      return result;
    } catch (error) {
      console.warn(`Attempt ${attempt} failed:`, error.message);
      if (attempt === maxRetries) {
        // Last attempt failed, rethrow the error
        throw error;
      }
      // Wait a shorter time before retrying (500ms instead of 1000ms * attempt)
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}