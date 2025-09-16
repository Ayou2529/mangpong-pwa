// src/components/JobForm/parts/JobDetailsSection.js - Job details section for Job Form

/**
 * Render job details section
 * @param {Object} job - The job data
 * @returns {string} - HTML string for job details
 */
export function renderJobDetailsSection(job) {
  return `
    <div class="card bg-white p-4 mb-4">
      <h2 class="font-medium text-gray-700 mb-3">
        ค่าบริการหลัก (Main Service Fee)
      </h2>
      <div id="job-details-container">
        ${renderJobDetailCards(job?.jobDetails || [])}
      </div>
      <button
        type="button"
        id="add-job-detail"
        class="w-full py-3 border border-dashed border-indigo-500 rounded-md text-indigo-500 flex items-center justify-center touch-target"
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
        เพิ่มรายการ (สูงสุด 5)
      </button>
    </div>
  `;
}

/**
 * Render job detail cards
 * @param {Array} jobDetails - Array of job details
 * @returns {string} - HTML string for job detail cards
 */
function renderJobDetailCards(jobDetails) {
  if (jobDetails.length > 0) {
    return jobDetails.map((detail, index) => renderJobDetailCard(detail, index)).join('');
  }
  
  return renderJobDetailCard(null, 0);
}

/**
 * Render a single job detail card
 * @param {Object} detail - The job detail data
 * @param {number} index - The index of the job detail
 * @returns {string} - HTML string for a job detail card
 */
function renderJobDetailCard(detail, index) {
  return `
    <div class="job-detail-card border border-gray-200 rounded-md p-3 mb-3">
      <div class="flex justify-between items-center mb-2">
        <h3 class="font-medium">รายละเอียดงาน #${index + 1}</h3>
      </div>
      <div class="mb-2">
        <label class="block text-gray-600 mb-1">บริษัทปลายทาง</label>
        <input
          type="text"
          class="w-full p-3 border border-gray-300 rounded-md touch-target"
          placeholder="ชื่อบริษัทปลายทาง"
          value="${detail?.company || ''}"
          required
        />
      </div>
      <div class="mb-2">
        <label class="block text-gray-600 mb-1">จังหวัดส่งของ</label>
        <input
          type="text"
          class="w-full p-3 border border-gray-300 rounded-md touch-target"
          placeholder="จังหวัดส่งของ"
          value="${detail?.deliveryProvince || ''}"
          required
        />
      </div>
      <div class="mb-2">
        <label class="block text-gray-600 mb-1">เขต/อำเภอส่งของ</label>
        <input
          type="text"
          class="w-full p-3 border border-gray-300 rounded-md touch-target"
          placeholder="เขต/อำเภอส่งของ"
          value="${detail?.deliveryDistrict || ''}"
          required
        />
      </div>
      <div class="mb-2">
        <label class="block text-gray-600 mb-1">ผู้รับงาน</label>
        <input
          type="text"
          class="w-full p-3 border border-gray-300 rounded-md touch-target"
          placeholder="ชื่อผู้รับงาน"
          value="${detail?.recipientName || ''}"
          required
        />
      </div>
      <div class="mb-2">
        <label class="block text-gray-600 mb-1">รายละเอียด</label>
        <textarea
          class="w-full p-3 border border-gray-300 rounded-md touch-target"
          placeholder="รายละเอียดงาน"
          rows="2"
          required
        >${detail?.description || ''}</textarea>
      </div>
      <div>
        <label class="block text-gray-600 mb-1">จำนวนเงิน (บาท)</label>
        <input
          type="number"
          class="w-full p-3 border border-gray-300 rounded-md amount-input touch-target"
          placeholder="0.00"
          min="0"
          step="0.01"
          value="${detail?.amount || ''}"
          required
        />
      </div>
    </div>
  `;
}