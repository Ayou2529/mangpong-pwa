// src/utils/storage.js - Safe localStorage wrappers

// Safe localStorage wrapper for iOS compatibility
export function safeLocalStorageSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.error('localStorage setItem failed:', e);
    // iOS Safari sometimes throws QUOTA_EXCEEDED_ERR
    if (isIOS()) {
      // Try to clean up old data
      try {
        // Remove oldest jobs to free up space
        const jobs = JSON.parse(
          safeLocalStorageGetItem('mangpongJobs') || '[]',
        );
        if (jobs.length > 10) {
          // Keep only the most recent 10 jobs
          const recentJobs = jobs.slice(-10);
          safeLocalStorageSetItem('mangpongJobs', JSON.stringify(recentJobs));
          // Retry setting the item
          safeLocalStorageSetItem(key, value);
          return true;
        }
      } catch (cleanupError) {
        console.error('localStorage cleanup failed:', cleanupError);
      }
    }
    return false;
  }
}

// Safe localStorage getter
export function safeLocalStorageGetItem(key, defaultValue = null) {
  try {
    return localStorage.getItem(key) || defaultValue;
  } catch (e) {
    console.error('localStorage getItem failed:', e);
    return defaultValue;
  }
}

// Safe localStorage removal
export function safeLocalStorageRemoveItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error('localStorage removeItem failed:', e);
    return false;
  }
}

// Detects iOS devices
function isIOS() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.userAgent.includes('Mac') && navigator.maxTouchPoints > 1)
  );
}