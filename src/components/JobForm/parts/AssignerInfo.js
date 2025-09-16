// src/components/JobForm/parts/AssignerInfo.js - Assigner information for Job Form

/**
 * Render assigner information
 * @param {Object} job - The job data
 * @returns {string} - HTML string for assigner information
 */
export function renderAssignerInfo(job) {
  return `
    <div class="mb-4">
      <h3 class="text-gray-600 font-medium mb-2">ผู้มอบงาน</h3>
      <div class="mb-2">
        <label class="block text-gray-600 mb-1">ผู้มอบงาน</label>
        <input
          type="text"
          class="w-full p-3 border border-gray-300 rounded-md touch-target"
          placeholder="ชื่อผู้มอบงาน"
          value="${job?.assignerName || ''}"
          required
        />
      </div>
      <div>
        <label class="block text-gray-600 mb-1">ข้อมูลติดต่อ</label>
        <input
          type="text"
          class="w-full p-3 border border-gray-300 rounded-md touch-target"
          placeholder="ข้อมูลติดต่อ"
          value="${job?.assignerContact || ''}"
          required
        />
      </div>
    </div>
  `;
}