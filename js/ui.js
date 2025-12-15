/**
 * Manages the visibility of top-level pages (login, register, app).
 * It ensures only one is visible at a time by toggling the 'hidden' class.
 * @param {string} pageId The ID of the page to show ('login-screen', 'register-screen', or 'app').
 */
function showPage(pageId) {
    currentPage = pageId;

    // List of all top-level page container IDs
    const pages = ['login-screen', 'register-screen', 'app'];

    pages.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            if (id === currentPage) {
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
            }
        }
    });
}

// Screen navigation
function showScreen(screenId) {
    // Hide all screens
    document.getElementById('home-screen').classList.add('hidden');
    document.getElementById('new-job-screen').classList.add('hidden');
    document.getElementById('history-screen').classList.add('hidden');

    // Show the selected screen
    document.getElementById(screenId).classList.remove('hidden');

    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Set active nav item and refresh data
    if (screenId === 'home-screen') {
        document.querySelectorAll('.nav-item')[0].classList.add('active');
        if (typeof checkJobStatus === 'function') checkJobStatus();
        if (typeof updateStats === 'function') updateStats();
    } else if (screenId === 'new-job-screen') {
        document.querySelectorAll('.nav-item')[1].classList.add('active');
        // Clear form if not editing
        const editJobId = document.getElementById('edit-job-id').value;
        if (!editJobId) {
            if (typeof resetForm === 'function') resetForm();
        } else {
            console.log('Entering edit mode for job:', editJobId);
        }
    } else if (screenId === 'history-screen') {
        document.querySelectorAll('.nav-item')[2].classList.add('active');
        if (typeof displayJobHistory === 'function') displayJobHistory();
    }
}

// Initialize date and time with Thai Buddhist calendar
function updateDateTime() {
    const now = new Date();

    // Convert to Thai Buddhist calendar
    const thaiYear = now.getFullYear() + 543;
    const thaiMonths = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    const thaiDays = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

    const dayName = thaiDays[now.getDay()];
    const day = now.getDate();
    const month = thaiMonths[now.getMonth()];
    const year = thaiYear;
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const dateTimeString = `${dayName} ${day} ${month} ${year} ${hours}:${minutes}`;
    document.getElementById('current-date-time').textContent = dateTimeString;

    const monthYearString = `${month} ${year}`;
    document.getElementById('current-month').textContent = monthYearString;

    // Set default date for history to today
    const selectedDateInput = document.getElementById('selected-date');
    if (selectedDateInput) {
        selectedDateInput.value = formatDate(now);
    }

    // Set default date for job date picker to today
    const jobDatePicker = document.getElementById('job-date-picker');
    if (jobDatePicker) {
        jobDatePicker.value = formatDate(now);
    }
}
