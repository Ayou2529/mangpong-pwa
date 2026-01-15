// src/pages/Messenger.js - Messenger role page

import { Header } from '../components/Header.js';
import { Dashboard } from '../components/Dashboard.js';
import { JobForm } from '../components/JobForm.js';
import { JobHistory } from '../components/JobHistory.js';
import { showScreen } from '../utils/navigation.js';

/**
 * Messenger home page
 * @param {Object} props - Page properties
 * @param {Object} props.stats - Statistics to display
 * @param {Array} props.draftJobs - Draft jobs to display
 * @param {Array} props.incompleteJobs - Incomplete jobs to display
 * @returns {string} - HTML string for the messenger home page
 */
export function MessengerHome({ stats, draftJobs, incompleteJobs }) {
  return `
    <div id="home-screen" class="p-4">
      ${Dashboard({ stats, draftJobs, incompleteJobs })}
    </div>
  `;
}

/**
 * Messenger new job page
 * @returns {string} - HTML string for the new job page
 */
export function MessengerNewJob() {
  const handleBack = () => {
    showScreen('home-screen');
  };

  return `
    <div id="new-job-screen" class="p-4 hidden">
      ${Header({ title: 'บันทึกงานใหม่', onBack: handleBack })}
      ${JobForm({})}
    </div>
  `;
}

/**
 * Messenger history page
 * @param {Object} props - Page properties
 * @param {Array} props.jobs - Jobs to display
 * @returns {string} - HTML string for the history page
 */
export function MessengerHistory({ jobs }) {
  const handleBack = () => {
    showScreen('home-screen');
  };

  return `
    <div id="history-screen" class="p-4 hidden">
      ${Header({ title: 'ประวัติงาน', onBack: handleBack })}
      
      <div class="card bg-white p-4 mb-4">
        <h2 class="font-medium text-gray-700 mb-3">เลือกวันที่</h2>
        <div class="mb-3">
          <label class="block text-gray-600 text-sm mb-1">วันที่</label>
          <input
            type="date"
            id="selected-date"
            class="w-full p-3 border border-gray-300 rounded-md touch-target"
            required
          />
        </div>
        <button
          id="filter-date-btn"
          class="w-full py-2 bg-blue-50 rounded-md text-blue-600 font-medium border border-blue-200 touch-target"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 inline mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          กรองข้อมูล
        </button>
      </div>

      <div class="mb-4 flex space-x-2 overflow-x-auto pb-1">
        <button
          class="px-3 py-2 bg-blue-100 rounded-full text-sm border border-blue-300 flex items-center status-filter active"
          data-status="all"
        >
          <span class="w-2 h-2 bg-gray-500 rounded-full mr-1"></span>
          ทั้งหมด
        </button>
        <button
          class="px-3 py-2 bg-white rounded-full text-sm border border-gray-300 flex items-center status-filter"
          data-status="complete"
        >
          <span class="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
          สมบูรณ์
        </button>
        <button
          class="px-3 py-2 bg-white rounded-full text-sm border border-gray-300 flex items-center status-filter"
          data-status="incomplete"
        >
          <span class="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
          ไม่สมบูรณ์
        </button>
        <button
          class="px-3 py-2 bg-white rounded-full text-sm border border-gray-300 flex items-center status-filter"
          data-status="draft"
        >
          <span class="w-2 h-2 bg-orange-500 rounded-full mr-1"></span>
          ร่าง
        </button>
      </div>

      <div id="job-history-container">
        ${JobHistory({ jobs })}
      </div>
    </div>
  `;
}