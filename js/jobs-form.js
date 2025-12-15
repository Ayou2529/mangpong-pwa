// Start new job with clean form
function startNewJob() {
    document.getElementById('edit-job-id').value = '';
    resetForm();
    showScreen('new-job-screen');
}

// Cancel edit and clear form
function cancelEdit() {
    document.getElementById('edit-job-id').value = '';
    resetForm();
    showScreen('home-screen');
}

// Edit job
function editJob(jobId) {
    console.log('editJob called with jobId:', jobId);

    const savedJobs = JSON.parse(localStorage.getItem('mangpongJobs') || '[]');
    const job = savedJobs.find(j => j.jobId === jobId);

    if (!job) {
        console.error('Job not found for ID:', jobId);
        Swal.fire({
            icon: 'error',
            title: 'ไม่พบงาน',
            text: 'ไม่สามารถหางานที่ต้องการแก้ไขได้',
            confirmButtonText: 'ตกลง'
        });
        return;
    }

    resetForm();
    populateFormWithJobData(job);
    showScreen('new-job-screen');
}

function resetForm() {
    const form = document.getElementById('new-job-form');
    form.reset();
    document.getElementById('edit-job-id').value = '';

    // Reset job date picker to today
    const jobDatePicker = document.getElementById('job-date-picker');
    if (jobDatePicker) {
        jobDatePicker.value = formatDate(new Date());
    }

    // Clear additional job details and fees
    const jobDetailsContainer = document.getElementById('job-details-container');
    const additionalFeesContainer = document.getElementById('additional-fees-container');

    // Reset to single job detail
    jobDetailsContainer.innerHTML = '';
    const defaultCard = createJobDetailCardHTML({});
    jobDetailsContainer.appendChild(defaultCard);
    defaultCard.querySelector('.amount-input').addEventListener('input', updateTotalAmount);

    additionalFeesContainer.innerHTML = '';

    updateTotalAmount();
}

function collectFormData() {
    const form = document.getElementById('new-job-form');

    // วันที่บันทึกงาน
    const jobDatePicker = document.getElementById('job-date-picker');
    const selectedDate = new Date(jobDatePicker.value);
    const thaiDateValue = formatThaiDateInput(selectedDate);

    // ข้อมูลหลักของงาน
    const editJobId = document.getElementById('edit-job-id').value;
    const base = {
        timestamp: selectedDate.toISOString(),
        jobDate: thaiDateValue,
        jobId: editJobId || 'JOB-' + Math.floor(10000 + Math.random() * 90000),
        username: currentUser ? currentUser.username : 'unknown',
        company: form.querySelector('select').value,
        assignedBy: form.querySelector('input[placeholder="ชื่อผู้มอบงาน"]').value,
        contact: form.querySelector('input[placeholder="ข้อมูลติดต่อ"]').value,
        pickupProvince: form.querySelector('input[placeholder="จังหวัด"]').value,
        pickupDistrict: form.querySelector('input[placeholder="เขต/อำเภอ"]').value
    };

    // รายละเอียดงาน
    const jobDetails = [];
    const jobDetailCards = document.querySelectorAll('.job-detail-card');
    jobDetailCards.forEach((card) => {
        const inputs = card.querySelectorAll('input, textarea');
        // Index 0: Company, 1: Prov, 2: Dist, 3: Recipient, 4: Detail, 5: Amount
        jobDetails.push({
            destinationCompany: inputs[0].value,
            deliveryProvince: inputs[1].value,
            deliveryDistrict: inputs[2].value,
            recipient: inputs[3].value,
            description: inputs[4].value,
            amount: parseFloat(inputs[5].value) || 0
        });
    });

    // ค่าบริการเพิ่มเติม
    const additionalFees = [];
    const feeItems = document.querySelectorAll('#additional-fees-container > div');
    feeItems.forEach(item => {
        const select = item.querySelector('select');
        const input = item.querySelector('input');
        if (select && input) {
            additionalFees.push({
                description: select.value,
                amount: parseFloat(input.value) || 0
            });
        }
    });

    // รวมยอดเงิน
    const mainServiceFee = jobDetails.reduce((sum, j) => sum + (parseFloat(j.amount) || 0), 0);
    const additionalFeesTotal = additionalFees.reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);
    const totalAmount = mainServiceFee + additionalFeesTotal;

    // แปลงเป็นรูปแบบแนวนอน
    const flat = {};
    jobDetails.forEach((d, i) => {
        const idx = i + 1;
        flat['companyTo' + idx] = d.destinationCompany || '';
        flat['province' + idx] = d.deliveryProvince || '';
        flat['district' + idx] = d.deliveryDistrict || '';
        flat['recipient' + idx] = d.recipient || '';
        flat['detail' + idx] = d.description || '';
        flat['amount' + idx] = (parseFloat(d.amount) || 0);
    });
    flat.jobCount = jobDetails.length;

    additionalFees.forEach((f, i) => {
        const idx = i + 1;
        flat['feeName' + idx] = f.description || '';
        flat['feeAmount' + idx] = (parseFloat(f.amount) || 0);
    });
    flat.feeCount = additionalFees.length;

    return {
        ...base,
        jobDetails: JSON.stringify(jobDetails),
        additionalFees: JSON.stringify(additionalFees),
        mainServiceFee,
        additionalFeesTotal,
        totalAmount,
        ...flat
    };
}


function updateTotalAmount() {
    let total = 0;
    // Sum job detail amounts
    document.querySelectorAll('.amount-input').forEach(input => {
        const value = parseFloat(input.value) || 0;
        total += value;
    });

    // Update main service fee
    const mainFeeEl = document.getElementById('main-service-fee');
    if (mainFeeEl) mainFeeEl.textContent = total.toFixed(2) + ' บาท';

    // Sum additional fees
    document.querySelectorAll('.fee-amount').forEach(input => {
        const value = parseFloat(input.value) || 0;
        total += value;
    });

    // Update total
    const totalEl = document.getElementById('total-amount');
    if (totalEl) totalEl.textContent = total.toFixed(2) + ' บาท';
}

function populateFormWithJobData(job) {
    // Reconstruct data if needed
    if (!job.jobDetails && job.jobCount > 0) {
        const reconstructedDetails = [];
        for (let i = 1; i <= job.jobCount; i++) {
            reconstructedDetails.push({
                destinationCompany: job['companyTo' + i] || '',
                deliveryProvince: job['province' + i] || '',
                deliveryDistrict: job['district' + i] || '',
                recipient: job['recipient' + i] || '',
                description: job['detail' + i] || '',
                amount: parseFloat(job['amount' + i]) || 0
            });
        }
        job.jobDetails = JSON.stringify(reconstructedDetails);
    }

    if (!job.additionalFees && job.feeCount > 0) {
        const reconstructedFees = [];
        for (let i = 1; i <= job.feeCount; i++) {
            reconstructedFees.push({
                description: job['feeName' + i] || '',
                amount: parseFloat(job['feeAmount' + i]) || 0
            });
        }
        job.additionalFees = JSON.stringify(reconstructedFees);
    }

    const form = document.getElementById('new-job-form');
    document.getElementById('edit-job-id').value = job.jobId;

    if (job.company) form.querySelector('select').value = job.company;
    if (job.assignedBy) form.querySelector('input[placeholder="ชื่อผู้มอบงาน"]').value = job.assignedBy;
    if (job.contact) form.querySelector('input[placeholder="ข้อมูลติดต่อ"]').value = job.contact;
    if (job.pickupProvince) form.querySelector('input[placeholder="จังหวัด"]').value = job.pickupProvince;
    if (job.pickupDistrict) form.querySelector('input[placeholder="เขต/อำเภอ"]').value = job.pickupDistrict;

    if (job.jobDate) {
        const parsedDate = parseThaiDate(job.jobDate);
        document.getElementById('job-date-picker').value = formatDate(parsedDate);
    }

    // Job details
    const container = document.getElementById('job-details-container');
    container.innerHTML = '';

    let jobDetails = [];
    if (job.jobDetails) {
        try {
            jobDetails = JSON.parse(job.jobDetails);
        } catch (error) {
            console.error('Error parsing job details:', error);
            jobDetails = [];
        }

        if (jobDetails.length === 0) {
            const firstCard = createJobDetailCardHTML({});
            container.appendChild(firstCard);
            firstCard.querySelector('.amount-input').addEventListener('input', updateTotalAmount);
        } else {
            jobDetails.forEach((detail, index) => {
                if (index === 0) {
                    // First card creation
                    const firstCard = createJobDetailCardHTML(detail);
                    container.appendChild(firstCard);
                    firstCard.querySelector('.amount-input').addEventListener('input', updateTotalAmount);
                } else {
                    // Using simulate click on add button to ensure listeners are attached or just manual creation
                    // Better to just create manually to be safe and fast without relying on DOM events we haven't set yet
                    const newCard = createJobDetailCardHTML(detail);
                    // Add remove button if it's not the first one?
                    // The original code adds remove button for >1 cards.
                    // IMPORTANT: The original code logic for 'add-job-detail' click adds a card with a remove button.
                    // The first card usually doesn't have a remove button.
                    // We should replicate that structure.

                    // Add remove button to the new card
                    addRemoveButtonToCard(newCard, container);

                    container.appendChild(newCard);
                    newCard.querySelector('.amount-input').addEventListener('input', updateTotalAmount);
                }
            });
        }
    } else {
        const firstCard = createJobDetailCardHTML({});
        container.appendChild(firstCard);
        firstCard.querySelector('.amount-input').addEventListener('input', updateTotalAmount);
    }

    // Additional fees
    const additionalFeesContainer = document.getElementById('additional-fees-container');
    additionalFeesContainer.innerHTML = '';

    if (job.additionalFees) {
        let additionalFees = [];
        try {
            additionalFees = JSON.parse(job.additionalFees);
        } catch (error) {
            additionalFees = [];
        }

        additionalFees.forEach(fee => {
            // Trigger the add fee logic
            const feeItem = createFeeItemHTML(fee);
            additionalFeesContainer.appendChild(feeItem);

            feeItem.querySelector('.remove-fee').addEventListener('click', function () {
                additionalFeesContainer.removeChild(feeItem);
                updateTotalAmount();
            });
            feeItem.querySelector('.fee-amount').addEventListener('input', updateTotalAmount);
        });
    }

    setTimeout(() => {
        updateTotalAmount();
    }, 100);
}

function createJobDetailCardHTML(detail) {
    const div = document.createElement('div');
    div.className = 'job-detail-card border border-gray-200 rounded-md p-3 mb-3';
    div.innerHTML = `
        <div class="flex justify-between items-center mb-2">
             <!-- Title will be set by js/app.js listener logic or we just ignore title updates for now -->
             <!-- Originally: <h3 class="font-medium">รายละเอียดงาน #${0 + 1}</h3> -->
             <!-- We'll keep it simple for now -->
        </div>
        <div class="mb-2">
            <label class="block text-gray-600 mb-1">บริษัทปลายทาง</label>
            <input type="text" class="w-full p-3 border border-gray-300 rounded-md touch-target" placeholder="ชื่อบริษัทปลายทาง" value="${detail.destinationCompany || ''}" required>
        </div>
        <div class="mb-2">
            <label class="block text-gray-600 mb-1">จังหวัดส่งของ</label>
            <input type="text" class="w-full p-3 border border-gray-300 rounded-md touch-target" placeholder="จังหวัดส่งของ" value="${detail.deliveryProvince || detail.deliveryLocation || ''}" required>
        </div>
        <div class="mb-2">
            <label class="block text-gray-600 mb-1">เขต/อำเภอส่งของ</label>
            <input type="text" class="w-full p-3 border border-gray-300 rounded-md touch-target" placeholder="เขต/อำเภอส่งของ" value="${detail.deliveryDistrict || ''}" required>
        </div>
        <div class="mb-2">
            <label class="block text-gray-600 mb-1">ผู้รับงาน</label>
            <input type="text" class="w-full p-3 border border-gray-300 rounded-md touch-target" placeholder="ชื่อผู้รับงาน" value="${detail.recipient || ''}" required>
        </div>
        <div class="mb-2">
            <label class="block text-gray-600 mb-1">รายละเอียด</label>
            <textarea class="w-full p-3 border border-gray-300 rounded-md touch-target" placeholder="รายละเอียดงาน" rows="2" required>${detail.description || ''}</textarea>
        </div>
        <div>
            <label class="block text-gray-600 mb-1">จำนวนเงิน (บาท)</label>
            <input type="number" class="w-full p-3 border border-gray-300 rounded-md amount-input touch-target" placeholder="0.00" min="0" step="0.01" value="${detail.amount || 0}" required>
        </div>
    `;
    return div;
}

function addRemoveButtonToCard(card, container) {
    const headerDiv = card.querySelector('div'); // The first div
    if (headerDiv) {
        headerDiv.innerHTML += `
            <button type="button" class="text-red-500 remove-job-detail touch-target" style="float:right">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
         `;
        card.querySelector('.remove-job-detail').addEventListener('click', function () {
            container.removeChild(card);
            updateTotalAmount();
        });
    }
}

function createFeeItemHTML(fee) {
    const feeItem = document.createElement('div');
    feeItem.className = 'flex justify-between items-center mb-2';
    // Helper to select option
    const isSelected = (val) => fee.description === val ? 'selected' : '';

    feeItem.innerHTML = `
        <div class="flex-1 mr-2">
            <select class="w-full p-3 border border-gray-300 rounded-md touch-target" required>
                <option value="" disabled ${!fee.description ? 'selected' : ''}>เลือกรายการ</option>
                <option value="บรรทุก" ${isSelected('บรรทุก')}>บรรทุก</option>
                <option value="ล่วงเวลา_OT" ${isSelected('ล่วงเวลา_OT')}>ล่วงเวลา_OT</option>
                <option value="กลับ" ${isSelected('กลับ')}>กลับ</option>
                <option value="รอ" ${isSelected('รอ')}>รอ</option>
            </select>
        </div>
        <div class="w-24 mr-2">
            <input type="number" class="w-full p-3 border border-gray-300 rounded-md fee-amount touch-target" placeholder="0.00" min="0" step="0.01" value="${fee.amount || 0}" required>
        </div>
        <button type="button" class="text-red-500 remove-fee touch-target">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    `;
    return feeItem;
}
