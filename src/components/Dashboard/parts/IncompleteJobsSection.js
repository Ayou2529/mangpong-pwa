// src/components/Dashboard/parts/IncompleteJobsSection.js - Incomplete jobs section for Dashboard

/**
 * Render the incomplete jobs section
 * @param {Array} incompleteJobs - Incomplete jobs to display
 * @returns {string} - HTML string for the incomplete jobs
 */
export function renderIncompleteJobsSection(incompleteJobs) {
  if (incompleteJobs.length === 0) {
    return '';
  }
  
  return `
    <div id="incomplete-jobs-card" class="card bg-white p-4 border-l-4 border-red-500 mb-4">
      <div class="flex items-center mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-red-500 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 class="font-medium text-gray-700">งานที่บันทึกไม่สมบูรณ์</h2>
      </div>
      <ul id="incomplete-jobs-list" class="text-sm text-gray-600 ml-7 list-disc">
        ${incompleteJobs.map(job => `
          <li class="cursor-pointer hover:text-indigo-600" onclick="editJob('${job.jobId}')">
            ${job.jobId}: ${job.incompleteReason || 'ข้อมูลไม่ครบถ้วน'}
          </li>
        `).join('')}
      </ul>
      <button
        class="mt-2 text-sm text-indigo-600 font-medium flex items-center touch-target"
        onclick="showScreen('history-screen')"
      >
        แก้ไข
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 ml-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  `;
}