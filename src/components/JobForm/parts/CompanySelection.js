// src/components/JobForm/parts/CompanySelection.js - Company selection for Job Form

/**
 * Render company selection
 * @param {Object} job - The job data
 * @returns {string} - HTML string for company selection
 */
export function renderCompanySelection(job) {
  return `
    <div class="mb-4">
      <h3 class="text-gray-600 font-medium mb-2">ข้อมูลการรับ</h3>
      <label class="block text-gray-600 mb-1">บริษัท/สถานที่รับงาน</label>
      <select
        class="w-full p-3 border border-gray-300 rounded-md mb-2 touch-target"
        required
      >
        <option value="" disabled ${!job?.company ? 'selected' : ''}>เลือกบริษัท</option>
        <option value="บจก.เวอริโฟน (ชั้น 3.2)" ${job?.company === 'บจก.เวอริโฟน (ชั้น 3.2)' ? 'selected' : ''}>
          บจก.เวอริโฟน (ชั้น 3.2)
        </option>
        <option value="บจก.เวอริโฟน (ชั้น 20)" ${job?.company === 'บจก.เวอริโฟน (ชั้น 20)' ? 'selected' : ''}>
          บจก.เวอริโฟน (ชั้น 20)
        </option>
        <option value="บจก.ไอมาร์ค" ${job?.company === 'บจก.ไอมาร์ค' ? 'selected' : ''}>
          บจก.ไอมาร์ค
        </option>
        <option value="บจก.สนง.ทองทวี" ${job?.company === 'บจก.สนง.ทองทวี' ? 'selected' : ''}>
          บจก.สนง.ทองทวี
        </option>
        <option value="บจก.ออฟฟิศเอที" ${job?.company === 'บจก.ออฟฟิศเอที' ? 'selected' : ''}>
          บจก.ออฟฟิศเอที
        </option>
      </select>
    </div>
  `;
}