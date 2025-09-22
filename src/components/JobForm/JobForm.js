// src/components/JobHistory.js - Job history component

/**
 * Job history component for displaying job history
 * @param {Object} props - Component properties
 * @param {Array} props.jobs - Array of jobs to display
 * @returns {string} - HTML string for the job history
 */
export function JobHistory({ jobs = [] }) {
  if (jobs.length === 0) {
    return `
      <div id="no-jobs-message" class="card bg-white p-4 text-center text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-12 w-12 mx-auto mb-2 text-gray-300"
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
        <p>ยังไม่มีประวัติงาน</p>
        <p class="text-sm">เริ่มบันทึกงานใหม่เพื่อดูประวัติที่นี่</p>
      </div>
    `;
  }

  return `
    <div class="space-y-4">
      ${jobs.map(job => `
        <div class="card bg-white p-4">
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="font-medium text-gray-800">${job.company || 'ไม่ระบุบริษัท'}</h3>
              <p class="text-sm text-gray-500">${job.jobId}</p>
            </div>
            <span class="px-2 py-1 rounded-full text-xs font-medium ${
  job.status === 'complete' ? 'bg-green-100 text-green-800' :
    job.status === 'incomplete' ? 'bg-red-100 text-red-800' :
      job.status === 'draft' ? 'bg-orange-100 text-orange-800' :
        'bg-gray-100 text-gray-800'
}">
              ${
  job.status === 'complete' ? 'สมบูรณ์' :
    job.status === 'incomplete' ? 'ไม่สมบูรณ์' :
      job.status === 'draft' ? 'ร่าง' :
        'ไม่ทราบสถานะ'
}
            </span>
          </div>
          
          <div class="flex justify-between text-sm text-gray-600 mb-3">
            <span>${job.jobDate ? new Date(job.jobDate).toLocaleDateString('th-TH') : 'ไม่ระบุวันที่'}</span>
            <span class="font-medium text-indigo-600">${job.totalAmount ? `${parseFloat(job.totalAmount).toLocaleString('th-TH')} บาท` : '0 บาท'}</span>
          </div>
          
          <div class="flex space-x-2">
            <button 
              class="flex-1 py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium border border-blue-200 touch-target"
              onclick="viewJob('${job.jobId}')"
            >
              ดูรายละเอียด
            </button>
            ${job.status !== 'complete' ? `
              <button 
                class="flex-1 py-2 bg-amber-50 text-amber-600 rounded-md text-sm font-medium border border-amber-200 touch-target"
                onclick="editJob('${job.jobId}')"
              >
                แก้ไข
              </button>
            ` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}