// src/pages/Admin.js - Admin role page

import { Header } from '../components/Header.js';

/**
 * Admin dashboard page
 * @param {Object} props - Page properties
 * @param {Object} props.stats - Statistics to display
 * @returns {string} - HTML string for the admin dashboard
 */
export function AdminDashboard({ stats }) {
  return `
    <div id="admin-dashboard" class="p-4">
      <div class="bg-gradient-to-r from-green-600 to-teal-700 text-white p-4 rounded-lg mb-4">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-xl font-bold">แผงควบคุมผู้ดูแล</h1>
            <p class="text-xs opacity-80">Mangpong Admin Panel</p>
          </div>
          <button
            class="text-xs opacity-80 hover:opacity-100"
            onclick="logout()"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="card bg-white p-4 text-center">
          <p class="text-gray-500 mb-1">งานทั้งหมด</p>
          <p class="text-2xl font-bold text-green-600">${stats.totalJobs || 0}</p>
        </div>
        <div class="card bg-white p-4 text-center">
          <p class="text-gray-500 mb-1">งานวันนี้</p>
          <p class="text-2xl font-bold text-blue-600">${stats.todayJobs || 0}</p>
        </div>
      </div>

      <div class="card bg-white p-4 mb-4">
        <h2 class="font-medium text-gray-700 mb-3">เมนูผู้ดูแล</h2>
        <div class="flex flex-col space-y-3">
          <button
            class="py-3 bg-indigo-50 rounded-lg text-indigo-600 font-medium flex items-center justify-center touch-target border border-indigo-200"
            onclick="showScreen('reports-screen')"
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            รายงาน
          </button>
          <button
            class="py-3 bg-purple-50 rounded-lg text-purple-600 font-medium flex items-center justify-center touch-target border border-purple-200"
            onclick="showScreen('users-screen')"
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            จัดการผู้ใช้
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Admin reports page
 * @returns {string} - HTML string for the reports page
 */
export function AdminReports() {
  const handleBack = () => {
    showScreen('admin-dashboard');
  };

  return `
    <div id="reports-screen" class="p-4 hidden">
      ${Header({ title: 'รายงาน', onBack: handleBack })}
      
      <div class="card bg-white p-4 mb-4">
        <h2 class="font-medium text-gray-700 mb-3">เลือกช่วงเวลา</h2>
        <div class="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label class="block text-gray-600 text-sm mb-1">จากวันที่</label>
            <input
              type="date"
              id="report-start-date"
              class="w-full p-3 border border-gray-300 rounded-md touch-target"
            />
          </div>
          <div>
            <label class="block text-gray-600 text-sm mb-1">ถึงวันที่</label>
            <input
              type="date"
              id="report-end-date"
              class="w-full p-3 border border-gray-300 rounded-md touch-target"
            />
          </div>
        </div>
        <button
          class="w-full py-2 bg-green-50 rounded-md text-green-600 font-medium border border-green-200 touch-target"
        >
          สร้างรายงาน
        </button>
      </div>

      <div class="card bg-white p-4">
        <h2 class="font-medium text-gray-700 mb-3">รายงานล่าสุด</h2>
        <div class="space-y-3">
          <div class="border border-gray-200 rounded-md p-3">
            <div class="flex justify-between">
              <span class="font-medium">รายงานประจำเดือน ส.ค. 2568</span>
              <span class="text-sm text-gray-500">PDF</span>
            </div>
            <div class="flex justify-between text-sm text-gray-600 mt-2">
              <span>สร้างเมื่อ: 1 ก.ย. 2568</span>
              <button class="text-indigo-600 font-medium">ดาวน์โหลด</button>
            </div>
          </div>
          <div class="border border-gray-200 rounded-md p-3">
            <div class="flex justify-between">
              <span class="font-medium">รายงานประจำเดือน ก.ค. 2568</span>
              <span class="text-sm text-gray-500">PDF</span>
            </div>
            <div class="flex justify-between text-sm text-gray-600 mt-2">
              <span>สร้างเมื่อ: 1 ส.ค. 2568</span>
              <button class="text-indigo-600 font-medium">ดาวน์โหลด</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}