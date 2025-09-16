// src/components/Dashboard/parts/HeaderSection.js - Header section for Dashboard

/**
 * Render the header section
 * @param {Object} user - Current user information
 * @returns {string} - HTML string for the header
 */
export function renderHeaderSection(user) {
  return `
    <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-lg mb-4">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-xl font-bold">แมงป่อง เทรดดิ้ง</h1>
          <p class="text-xs opacity-80">Mangpong Delivery WebApp V1.0</p>
        </div>
        <div class="text-right">
          <div class="text-sm font-medium" id="user-display-name">
            ${user?.fullName || user?.username || 'ผู้ใช้งาน'}
          </div>
          <button
            class="text-xs opacity-80 hover:opacity-100"
            onclick="logout()"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
      <div class="mt-3 text-xs text-right opacity-70">TTW Source 1.0</div>
    </div>
  `;
}