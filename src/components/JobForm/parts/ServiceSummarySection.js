// src/components/JobForm/parts/ServiceSummarySection.js - Service summary section for Job Form

/**
 * Render service summary section
 * @param {Object} job - The job data
 * @returns {string} - HTML string for service summary
 */
export function renderServiceSummarySection(job) {
  return `
    <div class="card bg-white p-4 mb-4">
      <h2 class="font-medium text-gray-700 mb-2">สรุปค่าบริการ</h2>
      <div class="flex justify-between mb-2">
        <p class="text-gray-600">ค่าบริการหลัก:</p>
        <p class="font-medium" id="main-service-fee">${job?.mainServiceFee || '0'} บาท</p>
      </div>
      <div class="mb-2">
        <p class="text-gray-600 mb-1">รวมค่าบริการเพิ่มเติม:</p>
        <div id="additional-fees-container">
          <!-- Additional fees will be added here -->
        </div>
        <button
          type="button"
          id="add-fee"
          class="mt-3 add-fee-btn touch-target"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          เพิ่มค่าบริการเพิ่มเติม
        </button>
      </div>
      <div class="border-t border-gray-200 pt-2 mt-2 flex justify-between">
        <p class="font-medium">รวมทั้งหมด:</p>
        <p class="font-bold text-indigo-600" id="total-amount">${job?.totalAmount || '0'} บาท</p>
      </div>
    </div>
  `;
}