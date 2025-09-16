// src/utils/auth/user.js - User management functionality

import { safeLocalStorageGetItem, safeLocalStorageRemoveItem } from '../storage.js';
import { showPage } from '../navigation.js';

/**
 * Check if user is already logged in
 * @returns {boolean} - True if user is logged in, false otherwise
 */
export function checkLoggedInUser() {
  const user = safeLocalStorageGetItem('mangpongUser');
  if (user) {
    try {
      window.currentUser = JSON.parse(user);
      console.log('Found logged in user:', window.currentUser);
      return true;
    } catch (e) {
      console.error('Error parsing user data:', e);
      safeLocalStorageRemoveItem('mangpongUser');
    }
  }
  return false;
}

/**
 * Logout function
 */
export function logout() {
  window.currentUser = null;
  safeLocalStorageRemoveItem('mangpongUser');
  safeLocalStorageRemoveItem('mangpongJobs');
  showPage('login-screen');
}