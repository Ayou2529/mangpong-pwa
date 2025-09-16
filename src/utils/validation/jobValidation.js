// src/utils/validation/jobValidation.js - Job form validation

/**
 * Validate job form data
 * @param {Object} jobData - Job form data
 * @returns {Object} - Validation result
 */
export function validateJobForm(jobData) {
  const errors = [];
  
  // Validate required fields
  if (!jobData['job-date-picker']) {
    errors.push('กรุณาเลือกวันที่บันทึกงาน');
  }
  
  if (!jobData.company) {
    errors.push('กรุณาเลือกบริษัท/สถานที่รับงาน');
  }
  
  if (!jobData.assignerName) {
    errors.push('กรุณากรอกชื่อผู้มอบงาน');
  }
  
  if (!jobData.assignerContact) {
    errors.push('กรุณากรอกข้อมูลติดต่อ');
  }
  
  if (!jobData.pickupProvince) {
    errors.push('กรุณากรอกจังหวัดรับของ');
  }
  
  if (!jobData.pickupDistrict) {
    errors.push('กรุณากรอกเขต/อำเภอรับของ');
  }
  
  // Validate job details
  const jobDetailsContainer = document.getElementById('job-details-container');
  if (jobDetailsContainer) {
    const jobDetailCards = jobDetailsContainer.querySelectorAll('.job-detail-card');
    
    if (jobDetailCards.length === 0) {
      errors.push('กรุณาเพิ่มรายละเอียดงานอย่างน้อย 1 รายการ');
    }
    
    jobDetailCards.forEach((card, index) => {
      const company = card.querySelector('input[type="text"]').value;
      const province = card.querySelectorAll('input[type="text"]')[1].value;
      const district = card.querySelectorAll('input[type="text"]')[2].value;
      const recipient = card.querySelectorAll('input[type="text"]')[3].value;
      const description = card.querySelector('textarea').value;
      const amount = card.querySelector('input[type="number"]').value;
      
      if (!company) {
        errors.push(`กรุณากรอกบริษัทปลายทางในรายการที่ ${index + 1}`);
      }
      
      if (!province) {
        errors.push(`กรุณากรอกจังหวัดส่งของในรายการที่ ${index + 1}`);
      }
      
      if (!district) {
        errors.push(`กรุณากรอกเขต/อำเภอส่งของในรายการที่ ${index + 1}`);
      }
      
      if (!recipient) {
        errors.push(`กรุณากรอกชื่อผู้รับงานในรายการที่ ${index + 1}`);
      }
      
      if (!description) {
        errors.push(`กรุณากรอกรายละเอียดในรายการที่ ${index + 1}`);
      }
      
      if (!amount || parseFloat(amount) <= 0) {
        errors.push(`กรุณากรอกจำนวนเงินที่มากกว่า 0 ในรายการที่ ${index + 1}`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}