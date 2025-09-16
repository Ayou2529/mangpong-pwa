// src/constants/errors.js - Error messages and codes

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
  TIMEOUT_ERROR: 'การเชื่อมต่อหมดเวลา กรุณาลองใหม่อีกครั้ง',
  LOGIN_FAILED: 'ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง',
  REGISTER_FAILED: 'ไม่สามารถสมัครสมาชิกได้ กรุณาลองใหม่อีกครั้ง',
  MISSING_FORM_ELEMENTS: 'ไม่พบองค์ประกอบฟอร์มที่จำเป็น',
  MISSING_INPUT: 'กรุณากรอกข้อมูลให้ครบ',
  PASSWORD_MISMATCH: 'รหัสผ่านไม่ตรงกัน',
};

export const ERROR_TITLES = {
  CONNECTION_FAILED: 'ไม่สามารถเชื่อมต่อได้',
  TIMEOUT: 'การเชื่อมต่อใช้เวลานานเกินไป',
  LOGIN_ERROR: 'เข้าสู่ระบบไม่สำเร็จ',
  REGISTER_ERROR: 'สมัครสมาชิกไม่สำเร็จ',
};