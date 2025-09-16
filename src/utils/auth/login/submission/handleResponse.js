// src/utils/auth/login/submission/handleResponse.js - Handle login response

import { safeLocalStorageSetItem } from '../../../storage.js';

/**
 * Handle successful login response
 * @param {Object} response - The login response
 * @param {string} username - The username
 */
export async function handleLoginSuccess(response, username) {
  window.currentUser = response.user;
  safeLocalStorageSetItem('mangpongUser', JSON.stringify(window.currentUser));

  // Show success and redirect
  await Swal.fire({
    icon: 'success',
    title: 'เข้าสู่ระบบสำเร็จ!',
    text: `ยินดีต้อนรับ ${window.currentUser.fullName || username}`,
    confirmButtonText: 'ตกลง',
    confirmButtonColor: '#10b981',
  });

  // Show main app
  showPage('app');
  const userDisplayName = document.getElementById('user-display-name');
  if (userDisplayName) {
    userDisplayName.textContent = window.currentUser.fullName || username;
  }

  // Initialize app
  window.initializeApp();
}

/**
 * Handle failed login response
 * @param {Object} response - The login response
 */
export async function handleLoginFailure(response) {
  await Swal.fire({
    icon: 'error',
    title: 'เข้าสู่ระบบไม่สำเร็จ',
    text:
      response && response.error
        ? response.error
        : 'ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง',
    confirmButtonText: 'ตกลง',
    confirmButtonColor: '#ef4444',
  });
}