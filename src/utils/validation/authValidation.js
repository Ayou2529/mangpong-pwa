// src/utils/validation/authValidation.js - Authentication form validation

/**
 * Validate login form data
 * @param {Object} loginData - Login form data
 * @returns {Object} - Validation result
 */
export function validateLoginForm(loginData) {
  const errors = [];
  
  if (!loginData.username) {
    errors.push('กรุณากรอกชื่อผู้ใช้');
  }
  
  if (!loginData.password) {
    errors.push('กรุณากรอกรหัสผ่าน');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate register form data
 * @param {Object} registerData - Register form data
 * @returns {Object} - Validation result
 */
export function validateRegisterForm(registerData) {
  const errors = [];
  
  if (!registerData.username) {
    errors.push('กรุณากรอกชื่อผู้ใช้');
  }
  
  if (!registerData.password) {
    errors.push('กรุณากรอกรหัสผ่าน');
  }
  
  if (!registerData.confirmPassword) {
    errors.push('กรุณายืนยันรหัสผ่าน');
  }
  
  if (registerData.password !== registerData.confirmPassword) {
    errors.push('รหัสผ่านไม่ตรงกัน');
  }
  
  if (!registerData.fullName) {
    errors.push('กรุณากรอกชื่อ-นามสกุล');
  }
  
  if (!registerData.phone) {
    errors.push('กรุณากรอกเบอร์โทรศัพท์');
  }
  
  if (!registerData.email) {
    errors.push('กรุณากรอกอีเมล');
  }
  
  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (registerData.email && !emailRegex.test(registerData.email)) {
    errors.push('รูปแบบอีเมลไม่ถูกต้อง');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}