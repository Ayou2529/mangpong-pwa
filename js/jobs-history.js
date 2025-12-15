// Display job history
async function displayJobHistory() {
    // Show loading
    const loadingPopup = Swal.fire({
        title: 'กำลังโหลดประวัติงาน...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        const savedJobs = await loadJobsFromSheets();
        console.log('Loaded saved jobs:', savedJobs);

        const container = document.getElementById('job-history-container');
        const noJobsMessage = document.getElementById('no-jobs-message');

        if (savedJobs.length === 0) {
            if (noJobsMessage) noJobsMessage.style.display = 'block';
            Swal.close();
            return;
        }

        if (noJobsMessage) noJobsMessage.style.display = 'none';

        // Sort jobs by timestamp (newest first)
        savedJobs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Filter jobs to the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentJobs = savedJobs.filter(job => new Date(job.timestamp) >= thirtyDaysAgo);

        // Clear existing job items (except no-jobs-message)
        const existingJobs = container.querySelectorAll('.job-item');
        existingJobs.forEach(job => job.remove());

        if (recentJobs.length === 0) {
            if (noJobsMessage) {
                noJobsMessage.style.display = 'block';
                noJobsMessage.querySelector('p:first-of-type').textContent = 'ไม่พบประวัติงานใน 30 วันล่าสุด';
            }
            Swal.close();
            return;
        }

        recentJobs.forEach(job => {
            const jobElement = createJobHistoryItem(job);
            if (noJobsMessage) container.insertBefore(jobElement, noJobsMessage);
            else container.appendChild(jobElement);
        });

        Swal.close();
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: error.message,
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#ef4444'
        });
    }
}

// Check incomplete and draft jobs from localStorage
async function checkJobStatus() {
    const savedJobs = await loadJobsFromSheets();

    const incompleteJobs = savedJobs.filter(job => job.status === 'incomplete');
    const draftJobs = savedJobs.filter(job => job.status === 'draft');

    // Handle incomplete jobs
    const incompleteCard = document.getElementById('incomplete-jobs-card');
    const incompleteList = document.getElementById('incomplete-jobs-list');

    if (incompleteJobs.length > 0) {
        incompleteCard.classList.remove('hidden');
        incompleteList.innerHTML = '';

        incompleteJobs.forEach(job => {
            const li = document.createElement('li');
            li.textContent = `${job.jobId}: ${job.incompleteReason || 'ข้อมูลไม่ครบถ้วน'}`;
            li.className = 'cursor-pointer hover:text-indigo-600';
            li.onclick = function () { editJob(job.jobId); };
            incompleteList.appendChild(li);
        });
    } else {
        incompleteCard.classList.add('hidden');
    }

    // Handle draft jobs
    const draftCard = document.getElementById('draft-jobs-card');
    const draftList = document.getElementById('draft-jobs-list');

    if (draftJobs.length > 0) {
        draftCard.classList.remove('hidden');
        draftList.innerHTML = '';

        draftJobs.forEach(job => {
            const li = document.createElement('li');
            li.textContent = `${job.jobId}: ${job.company || 'ไม่ระบุบริษัท'}`;
            li.className = 'cursor-pointer hover:text-indigo-600';
            li.onclick = function () { editJob(job.jobId); };
            draftList.appendChild(li);
        });
    } else {
        draftCard.classList.add('hidden');
    }
}

// Update statistics
async function updateStats() {
    const savedJobs = await loadJobsFromSheets();
    const today = new Date();
    const todayStr = today.toDateString();

    // Jobs today
    const jobsToday = savedJobs.filter(job => {
        const jobDate = new Date(job.timestamp);
        return jobDate.toDateString() === todayStr;
    }).length;

    // Completed jobs today
    const completedToday = savedJobs.filter(job => {
        const jobDate = new Date(job.timestamp);
        return jobDate.toDateString() === todayStr && job.status === 'complete';
    }).length;

    // Monthly jobs
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const monthlyJobs = savedJobs.filter(job => {
        const jobDate = new Date(job.timestamp);
        return jobDate.getMonth() === currentMonth && jobDate.getFullYear() === currentYear;
    }).length;

    // Update display
    document.getElementById('jobs-today').textContent = jobsToday;
    document.getElementById('completed-today').textContent = completedToday;
    document.getElementById('monthly-jobs').textContent = monthlyJobs;
}
