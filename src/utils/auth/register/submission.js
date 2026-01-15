// src/utils/auth/register/submission.js - Register form submission

import { submitToGoogleSheetsWithRetry } from '../../api/retry.js';
import { ERROR_MESSAGES, ERROR_TITLES } from '../../../constants/errors.js';
import { showPage } from '../../navigation.js';

/**
 * Handle register form submission
 * @param {Object} formData - The form data to submit
 */
export async function handleRegisterSubmission(formData) {
  const { username, password, fullName, phone, email } = formData;

  // Show loading
  Swal.fire({
    title: 'กำลังสมัครสมาชิก...',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    // Add timeout to prevent hanging - increased to 20 seconds
    const timeout = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(ERROR_MESSAGES.TIMEOUT_ERROR)),
        20000,
      ),
    );

    const registerPromise = submitToGoogleSheetsWithRetry({
      action: 'register',
      username: username,
      password: password,
      fullName: fullName,
      phone: phone,
      email: email,
    });

    const response = await Promise.race([registerPromise, timeout]);

    if (response && response.success) {
      await Swal.fire({
        icon: 'success',
        title: 'สมัครสมาชิกสำเร็จ!',
        text: 'คุณสามารถเข้าสู่ระบบได้แล้ว',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#10b981',
      });

      // Clear form and show login screen
      document.getElementById('register-form').reset();
      showPage('login-screen');
    } else {
      await Swal.fire({
        icon: 'error',
        title: ERROR_TITLES.REGISTER_ERROR,
        text:
          response && response.error
            ? response.error
            : ERROR_MESSAGES.REGISTER_FAILED,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#ef4444',
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    
    // Provide more specific error messages based on the type of error
    let title = ERROR_TITLES.CONNECTION_FAILED;
    let text = ERROR_MESSAGES.NETWORK_ERROR;
    
    if (error.message && error.message.includes('หมดเวลา')) {
      title = ERROR_TITLES.TIMEOUT;
      text = 'การเชื่อมต่อกับเซิร์ฟเวอร์ใช้เวลานานเกินไป โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณ';
    } else if (error.message && error.message.includes('ไม่สามารถเชื่อมต่อ')) {
      title = ERROR_TITLES.CONNECTION_FAILED;
      text = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณ';
    }
    
    await Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#ef4444',
    });
  }
}