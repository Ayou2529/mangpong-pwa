// src/utils/storage/index.js
import { clearAllCache, clearLoginData } from './clearCache.js';

// เก็บข้อมูลผู้ใช้
export function saveUserData(userData) {
  try {
    // เพิ่ม timestamp และ device info
    const userDataWithMeta = {
      ...userData,
      loginTime: Date.now(),
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language
      }
    };
    
    localStorage.setItem('mangpongUser', JSON.stringify(userDataWithMeta));
    sessionStorage.setItem('currentUser', JSON.stringify(userDataWithMeta));
    
    console.log('User data saved:', userDataWithMeta);
    return true;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูลผู้ใช้:', error);
    return false;
  }
}

// ดึงข้อมูลผู้ใช้
export function getUserData() {
  try {
    const userData = localStorage.getItem('mangpongUser');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:', error);
    return null;
  }
}

// ตรวจสอบสถานะการเข้าสู่ระบบ
export function isLoggedIn() {
  const userData = getUserData();
  if (!userData) return false;
  
  // ตรวจสอบว่า session ยังไม่หมดอายุ (24 ชั่วโมง)
  const loginTime = userData.loginTime || 0;
  const now = Date.now();
  const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  if (now - loginTime > sessionDuration) {
    console.log('Session expired, clearing user data');
    clearLoginData();
    return false;
  }
  
  return true;
}

export { clearAllCache, clearLoginData };
