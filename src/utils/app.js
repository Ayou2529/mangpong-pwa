// src/utils/app.js - Main application initialization and core functions

import { submitToGoogleSheets, requestQueue } from './api.js';
import { safeLocalStorageGetItem, safeLocalStorageSetItem, safeLocalStorageRemoveItem } from './storage.js';
import { updateDateTime, formatThaiDate } from './date.js';
import { showPage, showScreen, startNewJob, editJob, viewJob, cancelEdit, setupHistoryFilters } from './navigation.js';

// Global variables
let currentUser = null;
let jobCache = null;
let lastJobCacheTime = 0;
const JOB_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Initialize app
export function initializeApp() {
  updateDateTime();
  checkJobStatus(true); // Force refresh on app initialization
  updateStats(true); // Force refresh on app initialization
  displayJobHistory(true); // Force refresh on app initialization

  // Add event listeners to amount inputs
  document.querySelectorAll('.amount-input').forEach((input) => {
    // Check if input is defined before adding event listener
    if (input) {
      input.addEventListener('input', updateTotalAmount);
    }
  });
  
  // Set up periodic background updates
  setInterval(() => {
    if (navigator.onLine) {
      loadJobsInBackground();
    }
  }, 5 * 60 * 1000); // Check for updates every 5 minutes
}

// Check incomplete and draft jobs from localStorage
export async function checkJobStatus(forceRefresh = false) {
  const savedJobs = await loadJobsFromSheets(forceRefresh);

  // Ensure savedJobs is an array before filtering
  const jobsArray = Array.isArray(savedJobs) ? savedJobs : [];
  
  const incompleteJobs = jobsArray.filter((job) => job && job.status === 'incomplete');
  const draftJobs = jobsArray.filter((job) => job && job.status === 'draft');

  // Handle incomplete jobs
  const incompleteCard = document.getElementById('incomplete-jobs-card');
  const incompleteList = document.getElementById('incomplete-jobs-list');

  if (incompleteCard && incompleteList) {
    if (incompleteJobs.length > 0) {
      incompleteCard.classList.remove('hidden');
      incompleteList.innerHTML = '';

      incompleteJobs.forEach((job) => {
        // Check if job is defined before accessing properties
        if (job) {
          const li = document.createElement('li');
          li.textContent = `${job.jobId}: ${job.incompleteReason || 'ข้อมูลไม่ครบถ้วน'}`;
          li.className = 'cursor-pointer hover:text-indigo-600';
          li.onclick = function () {
            editJob(job.jobId);
          };
          incompleteList.appendChild(li);
        }
      });
    } else {
      incompleteCard.classList.add('hidden');
    }
  }

  // Handle draft jobs
  const draftCard = document.getElementById('draft-jobs-card');
  const draftList = document.getElementById('draft-jobs-list');

  if (draftCard && draftList) {
    if (draftJobs.length > 0) {
      draftCard.classList.remove('hidden');
      draftList.innerHTML = '';

      draftJobs.forEach((job) => {
        // Check if job is defined before accessing properties
        if (job) {
          const li = document.createElement('li');
          li.textContent = `${job.jobId}: ${job.company || 'ไม่ระบุบริษัท'}`;
          li.className = 'cursor-pointer hover:text-indigo-600';
          li.onclick = function () {
            editJob(job.jobId);
          };
          draftList.appendChild(li);
        }
      });
    } else {
      draftCard.classList.add('hidden');
    }
  }
}

// Cache jobs to reduce API calls
export async function loadJobsFromSheets(forceRefresh = false) {
  const now = Date.now();
  
  // If we have cached data and it's not expired, return it
  if (!forceRefresh && jobCache && (now - lastJobCacheTime) < JOB_CACHE_DURATION) {
    console.log('Using cached job data');
    return jobCache || [];
  }
  
  // If we're offline, try to use cached data even if it's expired
  if (!navigator.onLine && jobCache) {
    console.log('Using expired cached job data due to offline status');
    return jobCache || [];
  }
  
  try {
    console.log('Fetching fresh job data from Google Sheets');
    const response = await submitToGoogleSheets({
      action: 'getJobs',
      username: currentUser ? currentUser.username : '',
    });
    
    // Check if response is defined and has the expected properties
    if (response && response.success && response.jobs) {
      // Ensure jobs is an array
      const jobsArray = Array.isArray(response.jobs) ? response.jobs : [];
      jobCache = jobsArray;
      lastJobCacheTime = now;
      // Save to localStorage as backup
      safeLocalStorageSetItem('mangpongJobs', JSON.stringify(jobsArray));
      return jobsArray;
    } else {
      // If API fails but we have cached data, use it
      if (jobCache) {
        console.warn('API failed, using cached data');
        return jobCache || [];
      }
      
      // If no cached data, try localStorage
      const localJobs = safeLocalStorageGetItem('mangpongJobs');
      if (localJobs) {
        try {
          const parsed = JSON.parse(localJobs);
          // Ensure parsed data is an array
          const jobsArray = Array.isArray(parsed) ? parsed : [];
          jobCache = jobsArray;
          lastJobCacheTime = now;
          return jobsArray;
        } catch (e) {
          console.error('Error parsing local jobs:', e);
        }
      }
      
      // Return empty array as fallback
      return [];
    }
  } catch (error) {
    console.error('Error loading jobs from sheets:', error);
    
    // If we have cached data, use it
    if (jobCache) {
      console.log('Using cached job data due to error');
      return jobCache || [];
    }
    
    // Try localStorage as fallback
    const localJobs = safeLocalStorageGetItem('mangpongJobs');
    if (localJobs) {
      try {
        const parsed = JSON.parse(localJobs);
        // Ensure parsed data is an array
        const jobsArray = Array.isArray(parsed) ? parsed : [];
        jobCache = jobsArray;
        lastJobCacheTime = now;
        return jobsArray;
      } catch (e) {
        console.error('Error parsing local jobs:', e);
      }
    }
    
    // Return empty array as last resort
    return [];
  }
}

// Load jobs in background to keep cache fresh
export async function loadJobsInBackground() {
  try {
    // Check if currentUser is defined before accessing username
    if (!currentUser || !currentUser.username) {
      console.warn('User not logged in, skipping background job refresh');
      return;
    }
    
    const response = await submitToGoogleSheets({
      action: 'getJobs',
      username: currentUser.username,
    });
    
    // Check if response is defined and has the expected properties
    if (response && response.success && response.jobs) {
      // Ensure jobs is an array
      const jobsArray = Array.isArray(response.jobs) ? response.jobs : [];
      jobCache = jobsArray;
      lastJobCacheTime = Date.now();
      // Save to localStorage as backup
      safeLocalStorageSetItem('mangpongJobs', JSON.stringify(jobsArray));
    }
  } catch (error) {
    console.warn('Background job refresh failed:', error);
  }
}

// Display job history
export async function displayJobHistory(forceRefresh = false) {
  // Show loading
  Swal.fire({
    title: 'กำลังโหลดประวัติงาน...',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const savedJobs = await loadJobsFromSheets(forceRefresh);
    console.log('Loaded saved jobs:', savedJobs);

    const container = document.getElementById('job-history-container');
    const noJobsMessage = document.getElementById('no-jobs-message');

    if (container && noJobsMessage) {
      // Ensure savedJobs is an array
      const jobsArray = Array.isArray(savedJobs) ? savedJobs : [];
      
      if (jobsArray.length === 0) {
        noJobsMessage.style.display = 'block';
        Swal.close();
        // Show export button if there are jobs
        const exportBtn = document.getElementById('export-pdf-btn');
        const exportBtnMobile = document.getElementById('export-pdf-btn-mobile');
        if (exportBtn) exportBtn.style.display = 'none';
        if (exportBtnMobile) exportBtnMobile.style.display = 'none';
        return;
      }

      noJobsMessage.style.display = 'none';

      // Sort jobs by timestamp (newest first)
      jobsArray.sort(
        (a, b) => {
          // Check if a and b are defined before accessing timestamp
          const timeA = a && a.timestamp ? new Date(a.timestamp || 0) : new Date(0);
          const timeB = b && b.timestamp ? new Date(b.timestamp || 0) : new Date(0);
          return timeB - timeA;
        }
      );

      // Filter jobs to the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentJobs = jobsArray.filter(
        (job) => {
          // Check if job is defined before accessing timestamp
          if (!job || !job.timestamp) return false;
          return new Date(job.timestamp) >= thirtyDaysAgo;
        }
      );

      // Clear existing job items (except no-jobs-message)
      const existingJobs = container.querySelectorAll('.job-item');
      existingJobs.forEach((job) => job.remove());

      if (recentJobs.length === 0) {
        noJobsMessage.style.display = 'block';
        noJobsMessage.querySelector('p:first-of-type').textContent =
          'ไม่พบประวัติงานใน 30 วันล่าสุด';
        Swal.close();
        // Show export button if there are jobs
        const exportBtn = document.getElementById('export-pdf-btn');
        const exportBtnMobile = document.getElementById('export-pdf-btn-mobile');
        if (exportBtn) exportBtn.style.display = 'none';
        if (exportBtnMobile) exportBtnMobile.style.display = 'none';
        return;
      }

      recentJobs.forEach((job) => {
        // Check if job is defined before creating element
        if (job) {
          const jobElement = createJobHistoryItem(job);
          container.insertBefore(jobElement, noJobsMessage);
        }
      });
      
      // Show export button since we have jobs
      const exportBtn = document.getElementById('export-pdf-btn');
      const exportBtnMobile = document.getElementById('export-pdf-btn-mobile');
      if (exportBtn) exportBtn.style.display = 'block';
      if (exportBtnMobile) exportBtnMobile.style.display = 'block';
    }

    Swal.close();
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: error.message,
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#ef4444',
    });
  }
}

function createJobHistoryItem(job) {
  console.log('Creating job history item for job:', job);

  // Check if job is defined
  if (!job) {
    console.error('Cannot create job history item: job is undefined');
    return document.createElement('div');
  }

  const jobElement = document.createElement('div');
  jobElement.className = 'card bg-white p-4 mb-4 job-item';
  jobElement.setAttribute('data-status', job.status || 'complete');

  const statusBadge = getStatusBadge(job.status);
  const jobDate = job.timestamp ? formatThaiDate(job.timestamp) : 'ไม่ระบุวันที่';

  jobElement.innerHTML = `
        <div class="flex justify-between items-start mb-1">
            <h3 class="font-medium">${job.jobId || 'ไม่ระบุ ID'}</h3>
            <span class="px-2 py-1 text-xs rounded-full ${statusBadge.class}">${statusBadge.text}</span>
        </div>
        <div class="text-sm text-gray-600 mb-2">
            <p>วันที่: ${jobDate}</p>
            <p>บริษัท: ${job.company || 'ไม่ระบุ'}</p>
            <p>ผู้ติดต่อ: ${job.assignedBy || 'ไม่ระบุ'}</p>
            <p>จำนวน: ${job.totalAmount ? job.totalAmount.toFixed(2) : '0.00'} บาท</p>
        </div>
        ${
  job.status === 'incomplete'
    ? `
            <div class="bg-red-50 border-l-4 border-red-500 p-2 text-sm text-red-700 mb-2">
                <p>เหตุผลไม่สมบูรณ์: ${job.incompleteReason || 'ข้อมูลไม่ครบถ้วน'}</p>
            </div>
        `
    : ''
}
        ${
  job.status === 'draft'
    ? `
            <div class="bg-amber-50 border-l-4 border-amber-500 p-2 text-sm text-amber-700 mb-2">
                <p>สถานะ: บันทึกเป็นร่าง</p>
            </div>
        `
    : ''
}
        <div class="flex space-x-2">
          <button class="text-sm text-indigo-600 font-medium flex items-center touch-target" onclick="editJob('${job.jobId || ''}')">
            ${
  job.status === 'draft' 
    ? 'แก้ไขร่าง' 
    : job.status === 'incomplete' 
      ? 'แก้ไขงานไม่สมบูรณ์' 
      : 'แก้ไขงาน'
}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
    `;

  console.log('Created job element HTML:', jobElement.innerHTML);
  console.log('Job element:', jobElement);

  return jobElement;
}

function getStatusBadge(status) {
  switch (status) {
  case 'incomplete':
    return { class: 'incomplete-badge', text: 'ไม่สมบูรณ์' };
  case 'draft':
    return { class: 'draft-badge', text: 'ร่าง' };
  default:
    return { class: 'complete-badge', text: 'สมบูรณ์' };
  }
}

// Update statistics
export async function updateStats() {
  try {
    const savedJobs = await loadJobsFromSheets();
    // Ensure savedJobs is an array
    const jobsArray = Array.isArray(savedJobs) ? savedJobs : [];
    
    const today = new Date();
    const todayStr = today.toDateString();

    // Jobs today
    const jobsToday = jobsArray.filter((job) => {
      // Check if job and job.timestamp are defined
      if (!job || !job.timestamp) return false;
      const jobDate = new Date(job.timestamp);
      return jobDate.toDateString() === todayStr;
    }).length;

    // Completed jobs today
    const completedToday = jobsArray.filter((job) => {
      // Check if job and job.timestamp are defined
      if (!job || !job.timestamp) return false;
      const jobDate = new Date(job.timestamp);
      return jobDate.toDateString() === todayStr && job.status === 'complete';
    }).length;

    // Monthly jobs
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const monthlyJobs = jobsArray.filter((job) => {
      // Check if job and job.timestamp are defined
      if (!job || !job.timestamp) return false;
      const jobDate = new Date(job.timestamp);
      return (
        jobDate.getMonth() === currentMonth &&
        jobDate.getFullYear() === currentYear
      );
    }).length;

    // Total jobs
    const totalJobs = jobsArray.length;

    // Update display
    const jobsTodayEl = document.getElementById('jobs-today');
    if (jobsTodayEl) jobsTodayEl.textContent = jobsToday;
    const completedTodayEl = document.getElementById('completed-today');
    if (completedTodayEl) completedTodayEl.textContent = completedToday;
    const monthlyJobsEl = document.getElementById('monthly-jobs');
    if (monthlyJobsEl) monthlyJobsEl.textContent = monthlyJobs + ' งาน';
    const totalJobsEl = document.getElementById('total-jobs');
    if (totalJobsEl) totalJobsEl.textContent = totalJobs + ' งาน';

    // Update current month display
    const currentMonthEl = document.getElementById('current-month');
    if (currentMonthEl) {
      const thaiMonths = [
        'มกราคม',
        'กุมภาพันธ์',
        'มีนาคม',
        'เมษายน',
        'พฤษภาคม',
        'มิถุนายน',
        'กรกฎาคม',
        'สิงหาคม',
        'กันยายน',
        'ตุลาคม',
        'พฤศจิกายน',
        'ธันวาคม',
      ];
      const thaiYear = today.getFullYear() + 543;
      currentMonthEl.textContent = `${thaiMonths[currentMonth]} ${thaiYear}`;
    }
  } catch (error) {
    console.error('Error updating stats:', error);
    // Don't throw error to prevent breaking the UI
  }
}

// Handle DOM Content Loaded
export function handleDOMContentLoaded() {
  // Check if user is already logged in
  if (!checkLoggedInUser()) {
    showPage('login-screen');
  }
  
  // Set up history filters
  setupHistoryFilters();
  
  // Update date/time every minute
  setInterval(updateDateTime, 60000);
  
  // Process request queue when online
  window.addEventListener('online', function() {
    console.log('Online - processing request queue');
    requestQueue.process();
  });
  
  // Load request queue from storage
  requestQueue.loadFromStorage();
  
  // Attach login form event listener
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    // Remove any existing event listeners to prevent duplicates
    const newLoginForm = loginForm.cloneNode(true);
    loginForm.parentNode.replaceChild(newLoginForm, loginForm);
    
    // Add new event listener
    newLoginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      
      // Import and use the login handler
      const { handleLogin } = await import('./auth/login.js');
      await handleLogin(e);
    });
  }
  
  // Attach register form event listener
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    // Remove any existing event listeners to prevent duplicates
    const newRegisterForm = registerForm.cloneNode(true);
    registerForm.parentNode.replaceChild(newRegisterForm, registerForm);
    
    // Add new event listener
    newRegisterForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      
      // Import and use the register handler
      const { handleRegister } = await import('./auth/register.js');
      await handleRegister(e);
    });
  }
}

// Check if user is logged in
function checkLoggedInUser() {
  const user = safeLocalStorageGetItem('mangpongUser');
  if (user) {
    try {
      currentUser = JSON.parse(user);
      console.log('Found logged in user:', currentUser);
      showPage('app');
      const userDisplayName = document.getElementById('user-display-name');
      if (userDisplayName) {
        userDisplayName.textContent = currentUser.fullName || currentUser.username;
      }
      initializeApp();
      return true;
    } catch (e) {
      console.error('Error parsing user data:', e);
      safeLocalStorageRemoveItem('mangpongUser');
    }
  }
  return false;
}

// Export functions for global access
handleDOMContentLoaded.showPage = showPage;
handleDOMContentLoaded.showScreen = showScreen;
handleDOMContentLoaded.logout = function() {
  currentUser = null;
  safeLocalStorageRemoveItem('mangpongUser');
  safeLocalStorageRemoveItem('mangpongJobs');
  showPage('login-screen');
};
handleDOMContentLoaded.startNewJob = startNewJob;
handleDOMContentLoaded.editJob = editJob;
handleDOMContentLoaded.viewJob = viewJob;
handleDOMContentLoaded.cancelEdit = cancelEdit;