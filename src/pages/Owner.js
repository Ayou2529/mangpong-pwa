// src/pages/Owner.js - Owner role page

import { Header } from '../components/Header.js';
import { showScreen } from '../utils/navigation.js';

/**
 * Owner dashboard page
 * @param {Object} props - Page properties
 * @param {Object} props.stats - Statistics to display
 * @returns {string} - HTML string for the owner dashboard
 */
export function OwnerDashboard({ stats }) {
  return `
    <div id="owner-dashboard" class="p-4">
      <div class="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-4 rounded-lg mb-4">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-xl font-bold">แผงควบคุมเจ้าของกิจการ</h1>
            <p class="text-xs opacity-80">Mangpong Owner Panel</p>
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
          <p class="text-gray-500 mb-1">รายได้ทั้งหมด</p>
          <p class="text-2xl font-bold text-purple-600">${stats.totalRevenue ? `${parseFloat(stats.totalRevenue).toLocaleString('th-TH')} บาท` : '0 บาท'}</p>
        </div>
        <div class="card bg-white p-4 text-center">
          <p class="text-gray-500 mb-1">รายได้เดือนนี้</p>
          <p class="text-2xl font-bold text-indigo-600">${stats.monthlyRevenue ? `${parseFloat(stats.monthlyRevenue).toLocaleString('th-TH')} บาท` : '0 บาท'}</p>
        </div>
      </div>

      <div class="card bg-white p-4 mb-4">
        <h2 class="font-medium text-gray-700 mb-3">สถิติ</h2>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">จำนวนพนักงาน</span>
            <span class="font-medium">${stats.totalEmployees || 0}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">จำนวน Messenger</span>
            <span class="font-medium">${stats.totalMessengers || 0}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">จำนวนบริษัท</span>
            <span class="font-medium">${stats.totalCompanies || 0}</span>
          </div>
        </div>
      </div>

      <div class="card bg-white p-4">
        <h2 class="font-medium text-gray-700 mb-3">เมนูเจ้าของกิจการ</h2>
        <div class="flex flex-col space-y-3">
          <button
            class="py-3 bg-purple-50 rounded-lg text-purple-600 font-medium flex items-center justify-center touch-target border border-purple-200"
            onclick="showScreen('financial-reports-screen')"
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
            รายงานการเงิน
          </button>
          <button
            class="py-3 bg-amber-50 rounded-lg text-amber-600 font-medium flex items-center justify-center touch-target border border-amber-200"
            onclick="showScreen('payroll-screen')"
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
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            จ่ายเงินเดือน
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Owner financial reports page
 * @returns {string} - HTML string for the financial reports page
 */
export function OwnerFinancialReports() {
  const handleBack = () => {
    showScreen('owner-dashboard');
  };

  return `
    <div id="financial-reports-screen" class="p-4 hidden">
      ${Header({ title: 'รายงานการเงิน', onBack: handleBack })}
      
      <div class="card bg-white p-4 mb-4">
        <h2 class="font-medium text-gray-700 mb-3">เลือกช่วงเวลา</h2>
        <div class="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label class="block text-gray-600 text-sm mb-1">จากวันที่</label>
            <input
              type="date"
              id="financial-start-date"
              class="w-full p-3 border border-gray-300 rounded-md touch-target"
            />
          </div>
          <div>
            <label class="block text-gray-600 text-sm mb-1">ถึงวันที่</label>
            <input
              type="date"
              id="financial-end-date"
              class="w-full p-3 border border-gray-300 rounded-md touch-target"
            />
          </div>
        </div>
        <button
          class="w-full py-2 bg-purple-50 rounded-md text-purple-600 font-medium border border-purple-200 touch-target"
        >
          สร้างรายงาน
        </button>
      </div>

      <div class="card bg-white p-4">
        <h2 class="font-medium text-gray-700 mb-3">รายงานล่าสุด</h2>
        <div class="space-y-3">
          <div class="border border-gray-200 rounded-md p-3">
            <div class="flex justify-between">
              <span class="font-medium">รายงานการเงิน ส.ค. 2568</span>
              <span class="text-sm text-gray-500">PDF</span>
            </div>
            <div class="flex justify-between text-sm text-gray-600 mt-2">
              <span>สร้างเมื่อ: 1 ก.ย. 2568</span>
              <button class="text-indigo-600 font-medium">ดาวน์โหลด</button>
            </div>
          </div>
          <div class="border border-gray-200 rounded-md p-3">
            <div class="flex justify-between">
              <span class="font-medium">รายงานการเงิน ก.ค. 2568</span>
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