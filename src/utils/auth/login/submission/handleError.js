// src/utils/auth/login/submission/handleError.js - Handle login errors

import { ERROR_MESSAGES, ERROR_TITLES } from '../../../../constants/errors.js';

/**
 * Handle login errors
 * @param {Error} error - The error that occurred
 */
export async function handleLoginError(error) {
  console.error('Login error:', error);
  
  // Provide more specific error messages based on the type of error
  let title = ERROR_TITLES.CONNECTION_FAILED;
  let text = ERROR_MESSAGES.NETWORK_ERROR;
  
  if (error.message && error.message.includes('หมดเวลา')) {
    title = ERROR_TITLES.TIMEOUT;
    text = 'การเชื่อมต่อกับเซิร์ฟเวอร์ใช้เวลานานเกินไป โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณ';
  } else if (error.message && error.message.includes('ไม่สามารถเชื่อมต่อ')) {
    title = ERROR_TITLES.CONNECTION_FAILED;
    text = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณ';
  } else if (error.message && error.message.includes('Google Script URL ไม่ได้ถูกกำหนดไว้')) {
    title = 'การกำหนดค่าผิดพลาด';
    text = 'Google Script URL ไม่ได้ถูกกำหนดไว้ในระบบ โปรดติดต่อผู้ดูแลระบบ';
  } else if (error.message) {
    // For other specific errors, show the actual error message
    text = error.message;
  }
  
  // Add troubleshooting suggestions
  const troubleshooting = `
    <div class="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
      <p class="font-medium mb-2">คำแนะนำในการแก้ไขปัญหา:</p>
      <ul class="list-disc pl-5 space-y-1">
        <li>ตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณ</li>
        <li>ลองรีเฟรชหน้านี้อีกครั้ง (Ctrl+F5 หรือ Cmd+Shift+R)</li>
        <li>หากปัญหายังคงอยู่ โปรดติดต่อผู้ดูแลระบบ</li>
      </ul>
    </div>
  `;
  
  await Swal.fire({
    icon: 'error',
    title: title,
    html: `${text}${error.message && !text.includes(error.message) ? `<br><small class="text-gray-500">(${error.message})</small>` : ''}${troubleshooting}`,
    confirmButtonText: 'ตกลง',
    confirmButtonColor: '#ef4444',
  });
}