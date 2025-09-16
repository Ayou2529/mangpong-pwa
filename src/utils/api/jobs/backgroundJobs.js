// src/utils/api/jobs/backgroundJobs.js - Background job loading

import { submitToGoogleSheetsWithRetry } from '../retry.js';
import { safeLocalStorageSetItem } from '../../storage.js';

/**
 * Load jobs in background to keep cache fresh
 * @returns {Promise<void>}
 */
export async function loadJobsInBackground() {
  try {
    const response = await submitToGoogleSheetsWithRetry({
      action: 'getJobs',
      username: window.currentUser?.username,
    });
    
    if (response && response.success && response.jobs) {
      // Save to localStorage as backup
      safeLocalStorageSetItem('mangpongJobs', JSON.stringify(response.jobs));
    }
  } catch (error) {
    console.warn('Background job refresh failed:', error);
  }
}