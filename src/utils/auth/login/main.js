// src/utils/auth/login/main.js - Main login function

import { validateLoginFormElements } from './formValidation.js';
import { handleLoginSubmission } from './submission.js';

/**
 * Handle login form submission
 * @param {Event} e - The form submit event
 */
export async function handleLogin(e) {
  // Validate form elements and data
  const formData = await validateLoginFormElements(e);
  if (!formData) {
    return; // Validation failed, error message already shown
  }
  
  // Handle submission
  await handleLoginSubmission(formData);
}