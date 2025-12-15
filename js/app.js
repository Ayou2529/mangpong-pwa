// Initialize app
function initializeApp() {
    updateDateTime();
    if (typeof checkJobStatus === 'function') checkJobStatus();
    if (typeof updateStats === 'function') updateStats();
    if (typeof displayJobHistory === 'function') displayJobHistory();

    // Add event listeners to amount inputs
    document.querySelectorAll('.amount-input').forEach(input => {
        input.addEventListener('input', updateTotalAmount);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    // Set initial page state
    showPage('login-screen');

    // Check if user is already logged in
    const savedUser = localStorage.getItem('mangpongUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showPage('app');
        if (document.getElementById('user-display-name')) {
            document.getElementById('user-display-name').textContent = currentUser.fullName;
        }
        initializeApp();
    }

    // Prevent zoom on iOS when focusing inputs
    const metaViewport = document.querySelector('meta[name=viewport]');
    if (metaViewport) {
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
    }

    // Add fastclick to eliminate 300ms delay on mobile
    document.addEventListener('touchstart', function () { }, { passive: true });

    // Setup Event Listeners
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            await handleLogin(username, password);
        });
    }

    // Register form submission
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            const fullName = document.getElementById('register-fullname').value;
            const phone = document.getElementById('register-phone').value;
            const email = document.getElementById('register-email').value;

            if (password !== confirmPassword) {
                await Swal.fire({
                    icon: 'error',
                    title: 'รหัสผ่านไม่ตรงกัน',
                    text: 'กรุณาตรวจสอบรหัสผ่านและยืนยันรหัสผ่านให้ตรงกัน',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#ef4444'
                });
                return;
            }
            await handleRegister(username, password, fullName, phone, email);
        });
    }

    // New Job Form submission
    const newJobForm = document.getElementById('new-job-form');
    if (newJobForm) {
        newJobForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const isValid = newJobForm.checkValidity();

            if (isValid) {
                Swal.fire({
                    title: 'กำลังบันทึกข้อมูล...',
                    text: 'กรุณารอสักครู่',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                try {
                    const formData = collectFormData();
                    await saveJob(formData, false);

                    await Swal.fire({
                        icon: 'success',
                        title: 'บันทึกสำเร็จ!',
                        text: `งาน ${formData.jobId} ถูกบันทึกเรียบร้อยแล้ว`,
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#10b981'
                    });

                    updateStats();
                    resetForm();
                    showScreen('home-screen');

                } catch (error) {
                    console.error('Error submitting form:', error);
                    await Swal.fire({
                        icon: 'error',
                        title: 'เกิดข้อผิดพลาด!',
                        text: error.message,
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#ef4444'
                    });
                }
            } else {
                const result = await Swal.fire({
                    icon: 'warning',
                    title: 'ข้อมูลไม่ครบถ้วน',
                    text: 'กรุณาตรวจสอบข้อมูลที่กรอก ต้องการบันทึกงานแบบไม่สมบูรณ์หรือไม่?',
                    showCancelButton: true,
                    confirmButtonText: 'บันทึกแบบไม่สมบูรณ์',
                    cancelButtonText: 'ยกเลิก',
                    confirmButtonColor: '#f97316',
                    cancelButtonColor: '#6b7280'
                });

                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'กำลังบันทึกข้อมูล...',
                        text: 'กรุณารอสักครู่',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        showConfirmButton: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });

                    try {
                        const formData = collectFormData();
                        formData.status = 'incomplete';
                        formData.incompleteReason = 'ข้อมูลไม่ครบถ้วน';
                        await saveJob(formData, false);

                        await Swal.fire({
                            icon: 'warning',
                            title: 'บันทึกแบบไม่สมบูรณ์',
                            text: `งาน ${formData.jobId} ถูกบันทึกแล้ว แต่ข้อมูลไม่สมบูรณ์`,
                            confirmButtonText: 'ตกลง',
                            confirmButtonColor: '#f97316'
                        });

                        updateStats();
                        checkJobStatus();
                        resetForm();
                        showScreen('home-screen');
                    } catch (error) {
                        console.error('Error submitting incomplete form:', error);
                        await Swal.fire({
                            icon: 'error',
                            title: 'เกิดข้อผิดพลาด!',
                            text: error.message,
                            confirmButtonText: 'ตกลง',
                            confirmButtonColor: '#ef4444'
                        });
                    }
                }
            }
        });
    }

    // Add job detail button
    const addJobDetailBtn = document.getElementById('add-job-detail');
    if (addJobDetailBtn) {
        addJobDetailBtn.addEventListener('click', function () {
            const container = document.getElementById('job-details-container');
            const jobDetailCount = container.querySelectorAll('.job-detail-card').length;

            if (jobDetailCount < 5) {
                const newDetail = createJobDetailCardHTML({});
                addRemoveButtonToCard(newDetail, container);
                container.appendChild(newDetail);
                newDetail.querySelector('.amount-input').addEventListener('input', updateTotalAmount);
            } else {
                alert('คุณสามารถเพิ่มรายละเอียดงานได้สูงสุด 5 รายการ');
            }
        });
    }

    // Add fee button
    const addFeeBtn = document.getElementById('add-fee');
    if (addFeeBtn) {
        addFeeBtn.addEventListener('click', function () {
            const container = document.getElementById('additional-fees-container');
            const feeItem = createFeeItemHTML({});
            container.appendChild(feeItem);

            feeItem.querySelector('.remove-fee').addEventListener('click', function () {
                container.removeChild(feeItem);
                updateTotalAmount();
            });

            feeItem.querySelector('.fee-amount').addEventListener('input', updateTotalAmount);
        });
    }

    // Floating save button
    const floatingSaveBtn = document.getElementById('floating-save-btn');
    if (floatingSaveBtn) {
        floatingSaveBtn.addEventListener('click', async function () {
            Swal.fire({
                title: 'กำลังบันทึกร่าง...',
                text: 'กรุณารอสักครู่',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                const formData = collectFormData();
                formData.status = 'draft';

                await saveJob(formData, true);

                await Swal.fire({
                    icon: 'info',
                    title: 'บันทึกร่างสำเร็จ!',
                    text: `งาน ${formData.jobId} ถูกบันทึกเป็นร่างแล้ว`,
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#3b82f6'
                });

                updateStats();
                checkJobStatus();
                resetForm();
                showScreen('home-screen');

            } catch (error) {
                console.error('Error saving draft:', error);
                await Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด!',
                    text: error.message,
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#ef4444'
                });
            }
        });
    }

    // Filter date button
    const filterDateBtn = document.getElementById('filter-date-btn');
    if (filterDateBtn) {
        filterDateBtn.addEventListener('click', function () {
            const selectedDateInput = document.getElementById('selected-date');
            if (!selectedDateInput.value) return;

            const selectedDate = new Date(selectedDateInput.value);

            // Create date range for the selected day (start of day to end of day)
            const startOfDay = new Date(selectedDate);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(selectedDate);
            endOfDay.setHours(23, 59, 59, 999);

            // Filter jobs by the selected date
            const jobItems = document.querySelectorAll('.job-item');
            let hasVisibleJobs = false;

            jobItems.forEach(item => {
                const jobDateText = item.querySelector('.text-sm.text-gray-600 p:first-child').textContent;
                const jobDateStr = jobDateText.replace('วันที่: ', '');

                // Parse Thai date format back to compare
                const parts = jobDateStr.split('/');
                if (parts.length === 3) {
                    const day = parseInt(parts[0]);
                    const monthMap = {
                        'ม.ค.': 0, 'ก.พ.': 1, 'มี.ค.': 2, 'เม.ย.': 3, 'พ.ค.': 4, 'มิ.ย.': 5,
                        'ก.ค.': 6, 'ส.ค.': 7, 'ก.ย.': 8, 'ต.ค.': 9, 'พ.ย.': 10, 'ธ.ค.': 11
                    };
                    const month = monthMap[parts[1]];
                    const year = parseInt(parts[2]) - 543; // Convert from Buddhist to Gregorian

                    const jobDate = new Date(year, month, day);

                    if (jobDate >= startOfDay && jobDate <= endOfDay) {
                        // Check if it also matches the current status filter
                        const activeFilter = document.querySelector('.status-filter.active');
                        const currentStatusFilter = activeFilter ? activeFilter.getAttribute('data-status') : 'all';

                        if (currentStatusFilter === 'all' || item.getAttribute('data-status') === currentStatusFilter) {
                            item.style.display = 'block';
                            hasVisibleJobs = true;
                        } else {
                            item.style.display = 'none';
                        }
                    } else {
                        item.style.display = 'none';
                    }
                }
            });

            // Show/hide no jobs message manually
            const noJobsMessage = document.getElementById('no-jobs-message');
            if (hasVisibleJobs) {
                if (noJobsMessage) noJobsMessage.style.display = 'none';
            } else {
                if (noJobsMessage) {
                    noJobsMessage.style.display = 'block';
                    noJobsMessage.querySelector('p:first-of-type').textContent = 'ไม่พบงานในวันที่เลือก';
                }
            }

            // Update the header text
            const formattedDate = formatThaiDate(selectedDate.toISOString());
            const headerP = document.querySelector('#history-screen p.text-xs.text-gray-500');
            if (headerP) headerP.textContent = `แสดงข้อมูลวันที่ ${formattedDate}`;
        });
    }

    // Status filter buttons
    document.querySelectorAll('.status-filter').forEach(button => {
        button.addEventListener('click', function () {
            // Update active filter button
            document.querySelectorAll('.status-filter').forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('bg-blue-100');
                btn.classList.remove('border-blue-300');
                btn.classList.add('bg-white');
                btn.classList.add('border-gray-300');
            });

            this.classList.add('active');
            this.classList.add('bg-blue-100');
            this.classList.add('border-blue-300');

            // Filter jobs
            const status = this.getAttribute('data-status');
            const jobItems = document.querySelectorAll('.job-item');

            jobItems.forEach(item => {
                if (status === 'all' || item.getAttribute('data-status') === status) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // History container event delegation
    const historyContainer = document.getElementById('job-history-container');
    if (historyContainer) {
        historyContainer.addEventListener('click', function (e) {
            if (e.target.closest('[data-action="edit"]')) {
                const editButton = e.target.closest('[data-action="edit"]');
                const jobId = editButton.getAttribute('data-job-id');
                editJob(jobId);
            } else if (e.target.closest('[data-action="view"]')) {
                const viewButton = e.target.closest('[data-action="view"]');
                const jobId = viewButton.getAttribute('data-job-id');
                viewJob(jobId);
            }
        });
    }
});
