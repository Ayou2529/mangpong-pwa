// src/hooks/useJobForm.js - Custom hook for Job Form logic

import { submitToGoogleSheets } from '../utils/api.js';
import { safeLocalStorageGetItem, safeLocalStorageSetItem } from '../utils/storage.js';
import { validateJobForm } from '../utils/validation.js';

/**
 * Custom hook for Job Form logic
 * @param {Function} onSuccess - Callback function when form is submitted successfully
 * @returns {Object} - Object containing form functions
 */
export function useJobForm(onSuccess) {
  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  async function handleSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const jobData = Object.fromEntries(formData.entries());
    
    // Validate form data
    const validation = validateJobForm(jobData);
    if (!validation.isValid) {
      // Show validation errors
      alert(validation.errors.join('\n'));
      return;
    }
    
    try {
      // Submit to Google Sheets
      const response = await submitToGoogleSheets({
        action: jobData.jobId ? 'updateJob' : 'createJob',
        ...jobData,
      });
      
      if (response && response.success) {
        // Update local storage
        const jobs = JSON.parse(safeLocalStorageGetItem('mangpongJobs', '[]'));
        if (jobData.jobId) {
          // Update existing job
          const index = jobs.findIndex(job => job.jobId === jobData.jobId);
          if (index !== -1) {
            jobs[index] = { ...jobs[index], ...jobData, ...response.job };
          }
        } else {
          // Add new job
          jobs.push({ ...jobData, ...response.job });
        }
        safeLocalStorageSetItem('mangpongJobs', JSON.stringify(jobs));
        
        // Call success callback
        if (onSuccess) {
          onSuccess(response.job);
        }
      } else {
        throw new Error(response?.error || 'Failed to submit job');
      }
    } catch (error) {
      console.error('Error submitting job:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกงาน กรุณาลองใหม่อีกครั้ง');
    }
  }
  
  /**
   * Add a new job detail section to the form
   */
  function addJobDetail() {
    const container = document.getElementById('job-details-container');
    const jobDetailCount = container.querySelectorAll('.job-detail-card').length;
    
    if (jobDetailCount < 5) {
      const newDetail = document.createElement('div');
      newDetail.className = 'job-detail-card border border-gray-200 rounded-md p-3 mb-3';
      newDetail.innerHTML = `
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-medium">รายละเอียดงาน #${jobDetailCount + 1}</h3>
          <button type="button" class="text-red-500 remove-job-detail touch-target">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="mb-2">
          <label class="block text-gray-600 mb-1">บริษัทปลายทาง</label>
          <input type="text" class="w-full p-3 border border-gray-300 rounded-md touch-target" placeholder="ชื่อบริษัทปลายทาง" required />
        </div>
        <div class="mb-2">
          <label class="block text-gray-600 mb-1">จังหวัดส่งของ</label>
          <input type="text" class="w-full p-3 border border-gray-300 rounded-md touch-target" placeholder="จังหวัดส่งของ" required />
        </div>
        <div class="mb-2">
          <label class="block text-gray-600 mb-1">เขต/อำเภอส่งของ</label>
          <input type="text" class="w-full p-3 border border-gray-300 rounded-md touch-target" placeholder="เขต/อำเภอส่งของ" required />
        </div>
        <div class="mb-2">
          <label class="block text-gray-600 mb-1">ผู้รับงาน</label>
          <input type="text" class="w-full p-3 border border-gray-300 rounded-md touch-target" placeholder="ชื่อผู้รับงาน" required />
        </div>
        <div class="mb-2">
          <label class="block text-gray-600 mb-1">รายละเอียด</label>
          <textarea class="w-full p-3 border border-gray-300 rounded-md touch-target" placeholder="รายละเอียดงาน" rows="2" required></textarea>
        </div>
        <div>
          <label class="block text-gray-600 mb-1">จำนวนเงิน (บาท)</label>
          <input type="number" class="w-full p-3 border border-gray-300 rounded-md amount-input touch-target" placeholder="0.00" min="0" step="0.01" required />
        </div>
      `;
      
      container.appendChild(newDetail);
      
      // Add event listener to remove button
      const removeButton = newDetail.querySelector('.remove-job-detail');
      removeButton.addEventListener('click', function() {
        container.removeChild(newDetail);
        // Update numbering of remaining job details
        updateJobDetailNumbers();
      });
      
      // Add event listener to amount input
      const amountInput = newDetail.querySelector('.amount-input');
      amountInput.addEventListener('input', updateTotalAmount);
    }
  }
  
  /**
   * Update job detail numbers after removing one
   */
  function updateJobDetailNumbers() {
    const jobDetails = document.querySelectorAll('.job-detail-card');
    jobDetails.forEach((detail, index) => {
      const heading = detail.querySelector('h3');
      if (heading) {
        heading.textContent = `รายละเอียดงาน #${index + 1}`;
      }
    });
  }
  
  /**
   * Update total amount in the form
   */
  function updateTotalAmount() {
    const amountInputs = document.querySelectorAll('.amount-input');
    let total = 0;
    
    amountInputs.forEach(input => {
      const value = parseFloat(input.value) || 0;
      total += value;
    });
    
    const totalElement = document.getElementById('total-amount');
    if (totalElement) {
      totalElement.textContent = `${total.toFixed(2)} บาท`;
    }
    
    const mainServiceFeeElement = document.getElementById('main-service-fee');
    if (mainServiceFeeElement) {
      mainServiceFeeElement.textContent = `${total.toFixed(2)} บาท`;
    }
  }
  
  return {
    handleSubmit,
    addJobDetail,
    updateTotalAmount,
  };
}

// Export updateTotalAmount directly for use in other modules
export { updateTotalAmount };