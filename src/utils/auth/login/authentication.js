// src/utils/auth/login/authentication.js
import { saveUserData } from "../../storage/index.js";
import { submitToGoogleSheetsWithRetry } from "../../api/retry.js";

/**
 * ตรวจสอบการเข้าสู่ระบบ
 * @param {string} username - ชื่อผู้ใช้
 * @param {string} password - รหัสผ่าน
 * @returns {Promise<Object>} ผลลัพธ์การเข้าสู่ระบบ
 */
export async function authenticate(username, password) {
  try {
    const response = await submitToGoogleSheetsWithRetry({
      action: "login",
      username: username,
      password: password,
    });

    if (response && response.success) {
      // บันทึกข้อมูลผู้ใช้
      saveUserData(response.user);
      return {
        success: true,
        user: response.user,
      };
    } else {
      return {
        success: false,
        error: response?.error || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
      };
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการตรวจสอบการเข้าสู่ระบบ:", error);
    return {
      success: false,
      error: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
    };
  }
}
