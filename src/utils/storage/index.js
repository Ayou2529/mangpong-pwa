// src/utils/storage/index.js
import { clearAllCache, clearLoginData } from './clearCache.js';

// เก็บข้อมูลผู้ใช้
export function saveUserData(userData) {
  try {
    localStorage.setItem('mangpongUser', JSON.stringify(userData));
    sessionStorage.setItem('currentUser', JSON.stringify(userData));
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูลผู้ใช้:', error);
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
  return !!userData;
}

export { clearAllCache, clearLoginData };
