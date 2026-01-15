// src/components/JobForm/parts/PickupLocation.js - Pickup location for Job Form

/**
 * Render pickup location
 * @param {Object} job - The job data
 * @returns {string} - HTML string for pickup location
 */
export function renderPickupLocation(job) {
  return `
    <div>
      <h3 class="text-gray-600 font-medium mb-2">สถานที่รับของ</h3>
      <div class="mb-2">
        <label class="block text-gray-600 mb-1">จังหวัดรับของ</label>
        <input
          type="text"
          class="w-full p-3 border border-gray-300 rounded-md touch-target"
          placeholder="จังหวัด"
          value="${job?.pickupProvince || ''}"
          required
        />
      </div>
      <div>
        <label class="block text-gray-600 mb-1">เขต/อำเภอรับของ</label>
        <input
          type="text"
          class="w-full p-3 border border-gray-300 rounded-md touch-target"
          placeholder="เขต/อำเภอ"
          value="${job?.pickupDistrict || ''}"
          required
        />
      </div>
    </div>
  `;
}