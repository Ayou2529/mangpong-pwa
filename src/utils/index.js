// src/utils/index.js - Main utils export

// Core utilities
export { showPage, showScreen, goBack } from './navigation.js';
export { initializeDateTime } from './date.js';

// Authentication
export { handleLogin, showLoginScreen, handleRegister, showRegisterScreen, checkLoggedInUser, logout } from './auth.js';

// API
export { submitToGoogleSheetsInternal, submitToGoogleSheetsWithRetry, loadJobsFromSheets, loadJobsInBackground } from './api.js';

// Validation
export { validateJobForm, validateLoginForm, validateRegisterForm } from './validation.js';

// Formatting
export { formatThaiDateInput, formatDate, formatThaiDate, formatCurrency, formatNumber } from './formatting.js';

// Storage
export { safeLocalStorageSetItem, safeLocalStorageGetItem, safeLocalStorageRemoveItem, isIOS, isAndroid } from './storage.js';