// src/utils/api/jobs/loadJobs.js - Load jobs from sheets

import { submitToGoogleSheetsWithRetry } from '../retry.js';
import { safeLocalStorageGetItem, safeLocalStorageSetItem } from '../../storage.js';

// Global variables for caching
let jobCache = null;
let lastJobCacheTime = 0;
const JOB_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Cache jobs to reduce API calls
 * @param {boolean} forceRefresh - Whether to force refresh from API
 * @returns {Promise<Array>} - Promise that resolves with array of jobs
 */
export async function loadJobsFromSheets(forceRefresh = false) {
  const now = Date.now();
  
  // If we have cached data and it's not expired, return it
  if (!forceRefresh && jobCache && (now - lastJobCacheTime) < JOB_CACHE_DURATION) {
    console.log('Using cached job data');
    return jobCache;
  }
  
  // If we're offline, try to use cached data even if it's expired
  if (!navigator.onLine && jobCache) {
    console.log('Using expired cached job data due to offline status');
    return jobCache;
  }
  
  try {
    console.log('Fetching fresh job data from Google Sheets');
    const response = await submitToGoogleSheetsWithRetry({
      action: 'getJobs',
      username: window.currentUser?.username,
    });
    
    if (response && response.success && response.jobs) {
      jobCache = response.jobs;
      lastJobCacheTime = now;
      // Save to localStorage as backup
      safeLocalStorageSetItem('mangpongJobs', JSON.stringify(response.jobs));
      return response.jobs;
    } else {
      // If API fails but we have cached data, use it
      if (jobCache) {
        console.warn('API failed, using cached data');
        return jobCache;
      }
      
      // If no cached data, try localStorage
      const localJobs = safeLocalStorageGetItem('mangpongJobs');
      if (localJobs) {
        try {
          const parsed = JSON.parse(localJobs);
          jobCache = parsed;
          lastJobCacheTime = now;
          return parsed;
        } catch (e) {
          console.error('Error parsing local jobs:', e);
        }
      }
      
      // Return empty array as fallback
      return [];
    }
  } catch (error) {
    console.error('Error loading jobs from sheets:', error);
    
    // If we have cached data, use it
    if (jobCache) {
      console.log('Using cached job data due to error');
      return jobCache;
    }
    
    // Try localStorage as fallback
    const localJobs = safeLocalStorageGetItem('mangpongJobs');
    if (localJobs) {
      try {
        const parsed = JSON.parse(localJobs);
        jobCache = parsed;
        lastJobCacheTime = now;
        return parsed;
      } catch (e) {
        console.error('Error parsing local jobs:', e);
      }
    }
    
    // Return empty array as last resort
    return [];
  }
}