// src/components/Dashboard/parts/DraftJobsSection.js - Draft jobs section for Dashboard

/**
 * Render the draft jobs section
 * @param {Array} draftJobs - Draft jobs to display
 * @returns {string} - HTML string for the draft jobs
 */
export function renderDraftJobsSection(draftJobs) {
  if (draftJobs.length === 0) {
    return '';
  }
  
  return `
    <div id="draft-jobs-card" class="card bg-white p-4 border-l-4 border-amber-500 mb-4">
      <div class="flex items-center mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-amber-500 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        <h2 class="font-medium text-gray-700">งานที่บันทึกเป็นแบบร่าง</h2>
      </div>
      <ul id="draft-jobs-list" class="text-sm text-gray-600 ml-7 list-disc">
        ${draftJobs.map(job => `
          <li class="cursor-pointer hover:text-indigo-600" onclick="editJob('${job.jobId}')">
            ${job.jobId}: ${job.company || 'ไม่ระบุบริษัท'}
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