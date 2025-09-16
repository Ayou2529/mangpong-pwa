// src/utils/auth/register/formValidation.js - Register form validation

import { validateRegisterForm } from '../../validation/authValidation.js';

/**
 * Validate register form elements and data
 * @returns {Object|null} - Validation result or null if validation fails
 */
export async function validateRegisterFormElements() {
  // Validate form elements exist
  const usernameInput = document.getElementById('register-username');
  const passwordInput = document.getElementById('register-password');
  const confirmPasswordInput = document.getElementById(
    'register-confirm-password',
  );
  const fullNameInput = document.getElementById('register-fullname');
  const phoneInput = document.getElementById('register-phone');
  const emailInput = document.getElementById('register-email');

  if (
    !usernameInput ||
    !passwordInput ||
    !confirmPasswordInput ||
    !fullNameInput ||
    !phoneInput ||
    !emailInput
  ) {
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
  const confirmPassword = confirmPasswordInput.value.trim();
  const fullName = fullNameInput.value.trim();
  const phone = phoneInput.value.trim();
  const email = emailInput.value.trim();

  // Validate input
  const validation = validateRegisterForm({ 
    username, 
    password, 
    confirmPassword, 
    fullName, 
    phone, 
    email, 
  });
  
  if (!validation.isValid) {
    await Swal.fire({
      icon: 'warning',
      title: 'กรุณากรอกข้อมูลให้ครบ',
      text: validation.errors.join('\n'),
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#f59e0b',
    });
    return null;
  }

  return {
    username,
    password,
    fullName,
    phone,
    email,
  };
}