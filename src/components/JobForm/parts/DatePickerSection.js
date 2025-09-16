// src/components/JobForm/parts/DatePickerSection.js - Date picker section for Job Form

/**
 * Render date picker section
 * @param {Object} job - The job data
 * @returns {string} - HTML string for date picker
 */
export function renderDatePickerSection(job) {
  return `
    <div class="card bg-white p-4 mb-4">
      <div class="mb-3">
        <label class="block text-gray-600 mb-1">วันที่บันทึกงาน</label>
        <input
          type="date"
          id="job-date-picker"
          class="w-full p-3 border border-gray-300 rounded-md touch-target"
          value="${job?.jobDate || ''}"
          required
        />
      </div>
      <div class="flex items-center text-sm text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>สามารถเลือกวันที่เพื่อบันทึกงานย้อนหลังได้</span>
      </div>
    </div>
  `;
}