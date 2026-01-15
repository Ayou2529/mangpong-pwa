// src/utils/error/handler.js

/**
 * แสดงข้อความแจ้งเตือนข้อผิดพลาด
 * @param {Error|string} error - ข้อผิดพลาดที่เกิดขึ้น
 * @param {string} title - หัวข้อข้อความแจ้งเตือน
 */
export async function showError(error, title = 'เกิดข้อผิดพลาด') {
  const errorMessage = error instanceof Error ? error.message : error;

  await Swal.fire({
    icon: 'error',
    title: title,
    text: errorMessage,
    confirmButtonText: 'ตกลง',
    confirmButtonColor: '#ef4444',
  });
}

/**
 * แสดงข้อความแจ้งเตือนการเชื่อมต่อล้มเหลว
 */
export async function showConnectionError() {
  await Swal.fire({
    icon: 'warning',
    title: 'การเชื่อมต่อล้มเหลว',
    text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง',
    confirmButtonText: 'ลองใหม่',
    confirmButtonColor: '#f59e0b',
  });
}

/**
 * บันทึกข้อผิดพลาดลงในระบบ
 * @param {Error} error - ข้อผิดพลาดที่เกิดขึ้น
 * @param {string} context - บริบทที่เกิดข้อผิดพลาด
 */
export function logError(error, context) {
  console.error(`[${context}] Error:`, error);

  try {
    const errors = JSON.parse(localStorage.getItem('errorLogs') || '[]');
    errors.push({
      timestamp: new Date().toISOString(),
      context,
      message: error.message,
      stack: error.stack,
    });
    localStorage.setItem('errorLogs', JSON.stringify(errors));
  } catch (e) {
    console.error('Failed to log error:', e);
  }
}
