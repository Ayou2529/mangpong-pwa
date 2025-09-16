// src/utils/navigation.js - Navigation functions

// Global variable to track the current top-level page
let currentPage = 'login-screen';

/**
 * Manages the visibility of top-level pages (login, register, app).
 * It ensures only one is visible at a time by toggling the 'hidden' class.
 * @param {string} pageId The ID of the page to show ('login-screen', 'register-screen', or 'app').
 */
export function showPage(pageId) {
  currentPage = pageId;

  // List of all top-level page container IDs
  const pages = ['login-screen', 'register-screen', 'app'];

  pages.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      if (id === currentPage) {
        element.classList.remove('hidden');
      } else {
        element.classList.add('hidden');
      }
    } else {
      console.warn(`Page element with ID '${id}' not found`);
    }
  });
}

// Screen navigation
export function showScreen(screenId) {
  // Hide all screens
  const homeScreen = document.getElementById('home-screen');
  const newJobScreen = document.getElementById('new-job-screen');
  const historyScreen = document.getElementById('history-screen');

  if (homeScreen) homeScreen.classList.add('hidden');
  if (newJobScreen) newJobScreen.classList.add('hidden');
  if (historyScreen) historyScreen.classList.add('hidden');

  // Show the selected screen
  const selectedScreen = document.getElementById(screenId);
  if (selectedScreen) selectedScreen.classList.remove('hidden');

  // Update navigation
  document.querySelectorAll('.nav-item').forEach((item) => {
    item.classList.remove('active');
  });

  // Set active nav item and refresh data
  if (screenId === 'home-screen') {
    const navItem = document.querySelectorAll('.nav-item')[0];
    if (navItem) navItem.classList.add('active');
    checkJobStatus(); // Use cached data for quick response
    updateStats(); // Use cached data for quick response
  } else if (screenId === 'new-job-screen') {
    const navItem = document.querySelectorAll('.nav-item')[1];
    if (navItem) navItem.classList.add('active');
    // Clear form if not editing
    const editJobId = document.getElementById('edit-job-id').value;
    if (!editJobId) {
      resetForm();
    } else {
      // If editing, ensure form is properly populated
      console.log('Entering edit mode for job:', editJobId);
    }
  } else if (screenId === 'history-screen') {
    const navItem = document.querySelectorAll('.nav-item')[2];
    if (navItem) navItem.classList.add('active');
    displayJobHistory(); // Use cached data for quick response
  }
}

// Start new job with clean form
export function startNewJob() {
  // Clear any existing edit state
  const editJobId = document.getElementById('edit-job-id');
  if (editJobId) editJobId.value = '';

  // Reset form to clean state
  resetForm();

  // Navigate to new job screen
  showScreen('new-job-screen');
}

// Cancel edit and clear form
export function cancelEdit() {
  // Explicitly turn off edit mode first.
  const editJobId = document.getElementById('edit-job-id');
  if (editJobId) editJobId.value = '';

  // Then, completely reset the form to its default, empty state.
  resetForm();

  // Finally, navigate back to the home screen.
  showScreen('home-screen');
}

// Edit job
export function editJob(jobId) {
  try {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    // Instead of redirecting to edit.html, we'll load the job data and populate the form
    loadJobForEdit(jobId);
  } catch (error) {
    console.error('Error editing job:', error);
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: `ไม่สามารถแก้ไขงานได้: ${error.message}`,
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#ef4444',
    });
  }
}

// View job
export function viewJob(jobId) {
  // Implementation would go here
}

// Reset form
function resetForm() {
  // Implementation would go here
}

// Load job for edit
function loadJobForEdit(jobId) {
  // Implementation would go here
}

// Check job status
function checkJobStatus() {
  // Implementation would go here
}

// Update stats
function updateStats() {
  // Implementation would go here
}

// Display job history
function displayJobHistory() {
  // Implementation would go here
}

// Setup history filters
export function setupHistoryFilters() {
  // Implementation would go here
}