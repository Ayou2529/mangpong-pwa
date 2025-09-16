// main.js - Main application entry point (import only)

// Import initialization module
import { initializeApp, handleDOMContentLoaded } from './src/utils/app.js';

// Export functions for global access
window.initializeApp = initializeApp;
window.showPage = handleDOMContentLoaded.showPage;
window.showScreen = handleDOMContentLoaded.showScreen;
window.logout = handleDOMContentLoaded.logout;
window.startNewJob = handleDOMContentLoaded.startNewJob;
window.editJob = handleDOMContentLoaded.editJob;
window.viewJob = handleDOMContentLoaded.viewJob;
window.cancelEdit = handleDOMContentLoaded.cancelEdit;

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);