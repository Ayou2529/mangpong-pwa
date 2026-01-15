// src/components/Dashboard/parts/QuickActionsSection.js - Quick actions section for Dashboard

/**
 * Render the quick actions section
 * @returns {string} - HTML string for the quick actions
 */
export function renderQuickActionsSection() {
  return `
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
  `;
}