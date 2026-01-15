// src/components/Header/HeaderUI.js - UI for Header component

/**
 * Header UI component
 * @param {Object} props - Component properties
 * @param {string} props.title - The title to display
 * @param {Function} props.onBack - Function to call when back button is clicked
 * @returns {string} - HTML string for the header
 */
export function HeaderUI({ title, onBack }) {
  return `
    <div class="flex items-center mb-4">
      ${onBack ? `
        <button class="mr-2 touch-target" onclick="(${onBack.toString()})()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      ` : ''}
      <h1 class="text-xl font-bold">${title}</h1>
    </div>
  `;
}