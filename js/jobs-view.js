// View job
async function viewJob(jobId) {
    const savedJobs = JSON.parse(localStorage.getItem('mangpongJobs') || '[]');
    const job = savedJobs.find(j => j.jobId === jobId);

    if (!job) {
        await Swal.fire({
            icon: 'error',
            title: 'ไม่พบงาน',
            text: 'ไม่สามารถหางานที่ต้องการดูได้',
            confirmButtonText: 'ตกลง'
        });
        return;
    }

    const jobDetails = job.jobDetails ? JSON.parse(job.jobDetails) : [];
    const additionalFees = job.additionalFees ? JSON.parse(job.additionalFees) : [];

    let jobDetailsHtml = '';
    jobDetails.forEach((detail, index) => {
        jobDetailsHtml += `
            <div class="mb-3 p-3 bg-gray-50 rounded border">
                <h4 class="font-medium text-blue-600 mb-2">งาน #${index + 1}</h4>
                <div class="grid grid-cols-1 gap-1 text-sm">
                    <p><strong>บริษัทปลายทาง:</strong> ${detail.destinationCompany || 'ไม่ระบุ'}</p>
                    <p><strong>จังหวัดส่งของ:</strong> ${detail.deliveryProvince || detail.deliveryLocation || 'ไม่ระบุ'}</p>
                    <p><strong>เขต/อำเภอส่งของ:</strong> ${detail.deliveryDistrict || 'ไม่ระบุ'}</p>
                    <p><strong>ผู้รับงาน:</strong> ${detail.recipient || 'ไม่ระบุ'}</p>
                    <p><strong>รายละเอียด:</strong> ${detail.description || 'ไม่ระบุ'}</p>
                    <p><strong>จำนวนเงิน:</strong> ${detail.amount ? detail.amount.toFixed(2) : '0.00'} บาท</p>
                </div>
            </div>
        `;
    });

    let additionalFeesHtml = '';
    if (additionalFees.length > 0) {
        additionalFeesHtml = '<h4 class="font-medium mt-4 mb-2 text-green-600">ค่าบริการเพิ่มเติม:</h4>';
        additionalFees.forEach((fee, index) => {
            additionalFeesHtml += `
                <div class="mb-2 p-2 bg-green-50 rounded border border-green-200">
                    <div class="text-sm">
                        <p><strong>รายการ #${index + 1}:</strong> ${fee.description}</p>
                        <p><strong>จำนวนเงิน:</strong> ${fee.amount ? fee.amount.toFixed(2) : '0.00'} บาท</p>
                    </div>
                </div>
            `;
        });
    }

    await Swal.fire({
        title: `รายละเอียดงาน ${job.jobId}`,
        html: `
            <div class="text-left">
                <div class="mb-4">
                    <p><strong>วันที่:</strong> ${formatThaiDate(job.timestamp)}</p>
                    <p><strong>บริษัท:</strong> ${job.company || 'ไม่ระบุ'}</p>
                    <p><strong>ผู้มอบงาน:</strong> ${job.assignedBy || 'ไม่ระบุ'}</p>
                    <p><strong>ติดต่อ:</strong> ${job.contact || 'ไม่ระบุ'}</p>
                    <p><strong>จังหวัดรับของ:</strong> ${job.pickupProvince || 'ไม่ระบุ'}</p>
                    <p><strong>เขต/อำเภอรับของ:</strong> ${job.pickupDistrict || 'ไม่ระบุ'}</p>
                </div>
                
                <h4 class="font-medium mb-2">รายละเอียดงาน:</h4>
                ${jobDetailsHtml}
                
                ${additionalFeesHtml}
                
                <div class="mt-4 pt-3 border-t">
                    <div class="flex justify-between font-bold">
                        <span>รวมทั้งหมด:</span>
                        <span>${job.totalAmount ? job.totalAmount.toFixed(2) : '0.00'} บาท</span>
                    </div>
                </div>
            </div>
        `,
        confirmButtonText: 'ปิด',
        confirmButtonColor: '#3b82f6',
        width: '90%'
    });
}
