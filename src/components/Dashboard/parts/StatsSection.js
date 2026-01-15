// src/components/Dashboard/parts/StatsSection.js - Stats section for Dashboard

/**
 * Render the statistics section
 * @param {Object} stats - Statistics to display
 * @returns {string} - HTML string for the statistics
 */
export function renderStatsSection(stats) {
  return `
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div class="card bg-white p-4 text-center">
        <p class="text-gray-500 mb-1">รับงานวันนี้</p>
        <p class="text-2xl font-bold text-indigo-600" id="jobs-today">${stats.jobsToday || 0}</p>
      </div>
      <div class="card bg-white p-4 text-center">
        <p class="text-gray-500 mb-1">ส่งงานวันนี้</p>
        <p class="text-2xl font-bold text-green-600" id="completed-today">${stats.completedToday || 0}</p>
      </div>
    </div>
  `;
}