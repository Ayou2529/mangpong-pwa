// src/utils/auth/login/formValidation.js - Login form validation

import { validateLoginForm } from '../../validation/authValidation.js';

/**
 * Validate login form elements and data
 * @param {Event} e - The form submit event
 * @returns {Object|null} - Validation result or null if validation fails
 */
export async function validateLoginFormElements(e) {
  e.preventDefault();
  
  // Validate form elements exist
  const usernameInput = document.getElementById('login-username');
  const passwordInput = document.getElementById('login-password');

  if (!usernameInput || !passwordInput) {
    await Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่พบองค์ประกอบฟอร์มที่จำเป็น',
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#ef4444',
    });
    return null;
  }

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  // Validate input
  const validation = validateLoginForm({ username, password });
  if (!validation.isValid) {
    await Swal.fire({
      icon: 'warning',
      title: 'กรุณากรอกข้อมูล',
      text: validation.errors.join('\n'),
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#f59e0b',
    });
    return null;
  }

  return {
    username,
    password,
  };
}