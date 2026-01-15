// src/components/Dashboard/parts/DateTimeSection.js - Date and time section for Dashboard

/**
 * Render the date and time section
 * @returns {string} - HTML string for the date and time
 */
export function renderDateTimeSection() {
  return `
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
  `;
}