// Validation functions that can be easily tested

/**
 * Validate job form
 * @param {HTMLElement} form - The form element to validate
 * @returns {string[]} - Array of error messages
 */
function validateJobForm(form) {
  const errors = [];

  // Validate basic job information
  const companySelect = form.querySelector('select');
  if (!companySelect || !companySelect.value) {
    errors.push('กรุณาเลือกบริษัท/สถานที่รับงาน');
  }

  const assignedBy = form.querySelector('input[placeholder="ชื่อผู้มอบงาน"]');
  if (!assignedBy || !assignedBy.value.trim()) {
    errors.push('กรุณากรอกชื่อผู้มอบงาน');
  }

  const contact = form.querySelector('input[placeholder="ข้อมูลติดต่อ"]');
  if (!contact || !contact.value.trim()) {
    errors.push('กรุณากรอกข้อมูลติดต่อ');
  }

  const pickupProvince = form.querySelector('input[placeholder="จังหวัด"]');
  if (!pickupProvince || !pickupProvince.value.trim()) {
    errors.push('กรุณากรอกจังหวัดรับของ');
  }

  const pickupDistrict = form.querySelector('input[placeholder="เขต/อำเภอ"]');
  if (!pickupDistrict || !pickupDistrict.value.trim()) {
    errors.push('กรุณากรอกเขต/อำเภอรับของ');
  }

  // Validate job details
  const jobDetailCards = form.querySelectorAll('.job-detail-card');
  if (jobDetailCards.length === 0) {
    errors.push('กรุณาเพิ่มรายละเอียดงานอย่างน้อย 1 รายการ');
  } else {
    jobDetailCards.forEach((card, index) => {
      const inputs = card.querySelectorAll('input, textarea');
      const destinationCompany = inputs[0];
      const deliveryProvince = inputs[1];
      const deliveryDistrict = inputs[2];
      const recipient = inputs[3];
      const description = inputs[4];
      const amount = inputs[5];

      if (!destinationCompany || !destinationCompany.value.trim()) {
        errors.push(`กรุณากรอกบริษัทปลายทางสำหรับงาน #${index + 1}`);
      }

      if (!deliveryProvince || !deliveryProvince.value.trim()) {
        errors.push(`กรุณากรอกจังหวัดส่งของสำหรับงาน #${index + 1}`);
      }

      if (!deliveryDistrict || !deliveryDistrict.value.trim()) {
        errors.push(`กรุณากรอกเขต/อำเภอส่งของสำหรับงาน #${index + 1}`);
      }

      if (!recipient || !recipient.value.trim()) {
        errors.push(`กรุณากรอกชื่อผู้รับงานสำหรับงาน #${index + 1}`);
      }

      if (!description || !description.value.trim()) {
        errors.push(`กรุณากรอกรายละเอียดงาน #${index + 1}`);
      }

      if (!amount || isNaN(parseFloat(amount.value)) || parseFloat(amount.value) <= 0) {
        errors.push(`กรุณากรอกจำนวนเงินที่ถูกต้องสำหรับงาน #${index + 1}`);
      }
    });
  }

  // Validate additional fees (if any)
  const feeItems = document.querySelectorAll('#additional-fees-container > div');
  feeItems.forEach((item, index) => {
    const select = item.querySelector('select');
    const input = item.querySelector('input');

    if (select && select.value && (!input || !input.value.trim())) {
      errors.push(`กรุณากรอกจำนวนเงินสำหรับค่าบริการเพิ่มเติม #${index + 1}`);
    }

    if (input && input.value.trim() && (!select || !select.value)) {
      errors.push(`กรุณาเลือกรายการค่าบริการเพิ่มเติม #${index + 1}`);
    }

    if (input && input.value.trim() && select && select.value) {
      if (isNaN(parseFloat(input.value)) || parseFloat(input.value) <= 0) {
        errors.push(`กรุณากรอกจำนวนเงินที่ถูกต้องสำหรับค่าบริการเพิ่มเติม #${index + 1}`);
      }
    }
  });

  return errors;
}

module.exports = {
  validateJobForm,
};