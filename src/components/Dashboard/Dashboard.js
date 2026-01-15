// src/components/Dashboard.js - Dashboard component

/**
 * Dashboard component for the home screen
 * @param {Object} props - Component properties
 * @param {Object} props.stats - Statistics to display
 * @param {Array} props.draftJobs - Draft jobs to display
 * @param {Array} props.incompleteJobs - Incomplete jobs to display
 * @returns {string} - HTML string for the dashboard
 */
export function Dashboard({ stats, draftJobs = [], incompleteJobs = [] }) {
  return `
    <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-lg mb-4">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-xl font-bold">แมงป่อง เทรดดิ้ง</h1>
          <p class="text-xs opacity-80">Mangpong Delivery WebApp V1.0</p>
        </div>
        <div class="text-right">
          <div class="text-sm font-medium" id="user-display-name">
            ผู้ใช้งาน
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

    <div class="card bg-white p-3 mb-4">
      <div class="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-indigo-500 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p class="text-gray-700" id="current-date-time"></p>
      </div>
    </div>

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

    <div class="card bg-white p-4 mb-4">
      <h2 class="font-medium text-gray-700 mb-3">เมนูทางลัด</h2>
      <div class="flex flex-col space-y-3">
        <button
          class="py-3 btn-success rounded-lg text-white font-medium flex items-center justify-center touch-target"
          onclick="startNewJob()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
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
          งานใหม่
        </button>
        <button
          class="py-3 bg-blue-50 rounded-lg text-blue-600 font-medium flex items-center justify-center touch-target border border-blue-200"
          onclick="showScreen('history-screen')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          ประวัติ
        </button>
      </div>
    </div>

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

    ${draftJobs.length > 0 ? `
      <div id="draft-jobs-card" class="card bg-white p-4 border-l-4 border-amber-500 mb-4">
        <div class="flex items-center mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-amber-500 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <h2 class="font-medium text-gray-700">งานที่บันทึกเป็นแบบร่าง</h2>
        </div>
        <ul id="draft-jobs-list" class="text-sm text-gray-600 ml-7 list-disc">
          ${draftJobs.map(job => `
            <li class="cursor-pointer hover:text-indigo-600" onclick="editJob('${job.jobId}')">
              ${job.jobId}: ${job.company || 'ไม่ระบุบริษัท'}
            </li>
          `).join('')}
        </ul>
        <button
          class="mt-2 text-sm text-indigo-600 font-medium flex items-center touch-target"
          onclick="showScreen('history-screen')"
        >
          แก้ไข
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    ` : ''}

    ${incompleteJobs.length > 0 ? `
      <div id="incomplete-jobs-card" class="card bg-white p-4 border-l-4 border-red-500 mb-4">
        <div class="flex items-center mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-red-500 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 class="font-medium text-gray-700">งานที่บันทึกไม่สมบูรณ์</h2>
        </div>
        <ul id="incomplete-jobs-list" class="text-sm text-gray-600 ml-7 list-disc">
          ${incompleteJobs.map(job => `
            <li class="cursor-pointer hover:text-indigo-600" onclick="editJob('${job.jobId}')">
              ${job.jobId}: ${job.incompleteReason || 'ข้อมูลไม่ครบถ้วน'}
            </li>
          `).join('')}
        </ul>
        <button
          class="mt-2 text-sm text-indigo-600 font-medium flex items-center touch-target"
          onclick="showScreen('history-screen')"
        >
          แก้ไข
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    ` : ''}
  `;
}