// src/utils/auth/login/submission/main.js - Main login submission

import { submitToGoogleSheetsWithRetry } from '../../../api/retry.js';
import { handleLoginSuccess, handleLoginFailure } from './handleResponse.js';
import { handleLoginError } from './handleError.js';
import { ERROR_MESSAGES } from '../../../../constants/errors.js';

/**
 * Handle login form submission
 * @param {Object} formData - The form data to submit
 */
export async function handleLoginSubmission(formData) {
  const { username, password } = formData;

  console.log('Attempting login for user:', username);

  // Show loading
  Swal.fire({
    title: 'กำลังเข้าสู่ระบบ...',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    // Check if we're offline first
    if (!navigator.onLine) {
      await Swal.fire({
        icon: 'warning',
        title: 'ออฟไลน์',
        html: `
          <p>คุณกำลังออฟไลน์อยู่ในขณะนี้</p>
          <div class="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
            <p class="font-medium mb-2">คำแนะนำ:</p>
            <ul class="list-disc pl-5 space-y-1">
              <li>ตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณ</li>
              <li>เปิด Wi-Fi หรือข้อมูลมือถือ</li>
              <li>ลองใหม่อีกครั้งเมื่อเชื่อมต่ออินเทอร์เน็ตแล้ว</li>
            </ul>
          </div>
        `,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#f59e0b',
      });
      return;
    }

    // Add timeout to prevent hanging - increased to 20 seconds
    const timeout = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(ERROR_MESSAGES.TIMEOUT_ERROR)),
        20000,
      ),
    );

    const requestData = {
      action: 'login',
      username: username,
      password: password,
    };

    console.log('Sending login request:', requestData);

    const loginPromise = submitToGoogleSheetsWithRetry(requestData);

    const response = await Promise.race([loginPromise, timeout]);

    console.log('Received login response:', response);

    if (response && response.success) {
      await handleLoginSuccess(response, username);
    } else {
      await handleLoginFailure(response);
    }
  } catch (error) {
    await handleLoginError(error);
  }
}