// src/components/Dashboard/parts/MonthlyReportSection.js - Monthly report section for Dashboard

/**
 * Render the monthly report section
 * @param {Object} stats - Statistics to display
 * @returns {string} - HTML string for the monthly report
 */
export function renderMonthlyReportSection(stats) {
  return `
    <div class="card bg-white p-4 mb-4">
      <h2 class="font-medium text-gray-700 mb-2">
        รายงานประจำเดือน
        <span id="current-month" class="text-indigo-600"></span>
      </h2>
      <div class="flex justify-between">
        <p class="text-gray-600">งานทั้งหมด (ปัจจุบัน):</p>
        <p class="font-medium" id="monthly-jobs">${stats.monthlyJobs || 0}</p>
      </div>
      <div class="flex justify-between">
        <p class="text-gray-600">งานทั้งหมด:</p>
        <p class="font-medium" id="total-jobs">${stats.totalJobs || 0}</p>
      </div>
    </div>
  `;
}