// src/components/JobForm/JobForm.js - Job form component

export function JobForm({ onSubmit, onCancel }) {
  return `
    <form id="new-job-form" class="space-y-6">
      <!-- Job Date -->
      <div class="card bg-white p-4">
        <div class="mb-3">
          <label class="block text-gray-700 text-lg font-medium mb-2">วันที่บันทึกงาน</label>
          <input
            type="date"
            id="job-date-picker"
            class="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-target"
            required
          />
        </div>
      </div>

      <!-- Job Information -->
      <div class="card bg-white p-4">
        <h2 class="text-xl font-medium text-gray-800 mb-4">ข้อมูลการรับงาน</h2>

        <!-- รับ -->
        <div class="mb-6">
          <h3 class="text-lg text-gray-700 font-medium mb-3">ข้อมูลการรับ</h3>
          <label class="block text-gray-600 text-lg mb-2">บริษัท/สถานที่รับงาน</label>
          <select
            id="company-select"
            class="w-full p-4 text-lg border border-gray-300 rounded-lg mb-4 touch-target"
            required
          >
            <option value="" disabled selected>เลือกบริษัท</option>
            <option value="บจก.เวอริโฟน (ชั้น 3.2)">บจก.เวอริโฟน (ชั้น 3.2)</option>
            <option value="บจก.เวอริโฟน (ชั้น 20)">บจก.เวอริโฟน (ชั้น 20)</option>
            <option value="บจก.ไอมาร์ค">บจก.ไอมาร์ค</option>
            <option value="บจก.สนง.ทองทวี">บจก.สนง.ทองทวี</option>
            <option value="บจก.ออฟฟิศเอที">บจก.ออฟฟิศเอที</option>
          </select>
        </div>

        <div class="border-t border-gray-200 pt-6 mb-6"></div>

        <!-- ผู้มอบงาน -->
        <div class="mb-6">
          <h3 class="text-lg text-gray-700 font-medium mb-3">ผู้มอบงาน</h3>
          <div class="mb-4">
            <label class="block text-gray-600 text-lg mb-2">ผู้มอบงาน</label>
            <input
              type="text"
              id="assigned-by"
              class="w-full p-4 text-lg border border-gray-300 rounded-lg touch-target"
              placeholder="ชื่อผู้มอบงาน"
              required
            />
          </div>
          <div>
            <label class="block text-gray-600 text-lg mb-2">ข้อมูลติดต่อ</label>
            <input
              type="text"
              id="contact"
              class="w-full p-4 text-lg border border-gray-300 rounded-lg touch-target"
              placeholder="ข้อมูลติดต่อ"
              required
            />
          </div>
        </div>

        <div class="border-t border-gray-200 pt-6 mb-6"></div>

        <!-- สถานที่รับของ -->
        <div>
          <h3 class="text-lg text-gray-700 font-medium mb-3">สถานที่รับของ</h3>
          <div class="mb-4">
            <label class="block text-gray-600 text-lg mb-2">จังหวัดรับของ</label>
            <input
              type="text"
              id="pickup-province"
              class="w-full p-4 text-lg border border-gray-300 rounded-lg touch-target"
              placeholder="จังหวัด"
              required
            />
          </div>
          <div>
            <label class="block text-gray-600 text-lg mb-2">เขต/อำเภอรับของ</label>
            <input
              type="text"
              id="pickup-district"
              class="w-full p-4 text-lg border border-gray-300 rounded-lg touch-target"
              placeholder="เขต/อำเภอ"
              required
            />
          </div>
        </div>
      </div>

      <!-- Main Service Fee -->
      <div class="card bg-white p-4">
        <h2 class="text-xl font-medium text-gray-800 mb-4">
          ค่าบริการหลัก (Main Service Fee)
        </h2>
        <div id="job-details-container">
          <!-- Job details will be populated here -->
          <div class="job-detail-card border border-gray-200 rounded-lg p-4 mb-4">
            <div class="mb-4">
              <label class="block text-gray-600 text-lg mb-2">บริษัทปลายทาง</label>
              <input type="text" class="w-full p-4 text-lg border border-gray-300 rounded-lg touch-target" placeholder="ชื่อบริษัทปลายทาง" required>
            </div>
            <div class="mb-4">
              <label class="block text-gray-600 text-lg mb-2">จังหวัดส่งของ</label>
              <input type="text" class="w-full p-4 text-lg border border-gray-300 rounded-lg touch-target" placeholder="จังหวัดส่งของ" required>
            </div>
            <div class="mb-4">
              <label class="block text-gray-600 text-lg mb-2">เขต/อำเภอส่งของ</label>
              <input type="text" class="w-full p-4 text-lg border border-gray-300 rounded-lg touch-target" placeholder="เขต/อำเภอส่งของ" required>
            </div>
            <div class="mb-4">
              <label class="block text-gray-600 text-lg mb-2">ผู้รับงาน</label>
              <input type="text" class="w-full p-4 text-lg border border-gray-300 rounded-lg touch-target" placeholder="ชื่อผู้รับงาน" required>
            </div>
            <div class="mb-4">
              <label class="block text-gray-600 text-lg mb-2">รายละเอียด</label>
              <textarea class="w-full p-4 text-lg border border-gray-300 rounded-lg touch-target" placeholder="รายละเอียดงาน" rows="3" required></textarea>
            </div>
            <div>
              <label class="block text-gray-600 text-lg mb-2">จำนวนเงิน (บาท)</label>
              <input type="number" class="w-full p-4 text-lg border border-gray-300 rounded-lg amount-input touch-target" placeholder="0" min="0" step="1" value="0" required>
            </div>
          </div>
        </div>
        <button
          type="button"
          id="add-job-detail"
          class="w-full py-4 border-2 border-dashed border-indigo-500 rounded-lg text-indigo-500 flex items-center justify-center touch-target text-lg font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 mr-2"
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

      <!-- Summary -->
      <div class="card bg-white p-4">
        <h2 class="text-xl font-medium text-gray-800 mb-4">สรุปค่าบริการ</h2>
        <div class="flex justify-between mb-3">
          <p class="text-gray-600 text-lg">ค่าบริการหลัก:</p>
          <p class="font-medium text-lg" id="main-service-fee">0 บาท</p>
        </div>
        <div class="mb-3">
          <p class="text-gray-600 text-lg mb-2">รวมค่าบริการเพิ่มเติม:</p>
          <div id="additional-fees-container">
            <!-- Additional fees will be populated here -->
          </div>
          <button
            type="button"
            id="add-fee"
            class="mt-4 py-3 px-4 bg-blue-50 rounded-lg text-blue-600 flex items-center touch-target text-lg font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 mr-2"
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
        <div
          class="border-t border-gray-200 pt-4 mt-4 flex justify-between"
        >
          <p class="font-medium text-lg">รวมทั้งหมด:</p>
          <p class="font-bold text-indigo-600 text-xl" id="total-amount">0 บาท</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex space-x-4 mb-20">
        <button
          type="button"
          class="flex-1 py-4 btn-secondary rounded-lg font-medium text-lg touch-target"
          onclick="${onCancel || 'cancelEdit()'}"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          class="flex-1 py-4 btn-primary rounded-lg font-medium text-lg touch-target"
        >
          บันทึกงาน
        </button>
      </div>
    </form>
  `;
}