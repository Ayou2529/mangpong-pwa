// src/utils/auth/register/main.js - Main register function

import { validateRegisterFormElements } from './formValidation.js';
import { handleRegisterSubmission } from './submission.js';

/**
 * Handle register form submission
 * @param {Event} e - The form submit event
 */
export async function handleRegister(e) {
  e.preventDefault();
  
  // Validate form elements and data
  const formData = await validateRegisterFormElements(e);
  if (!formData) {
    return; // Validation failed, error message already shown
  }
  
  // Handle submission
  await handleRegisterSubmission(formData);
}