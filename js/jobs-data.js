// Function to load jobs from Google Sheets
async function loadJobsFromSheets() {
    try {
        const response = await submitToGoogleSheets({
            action: 'getJobs',
            username: currentUser.username
        });

        if (response.success && response.jobs) {
            localStorage.setItem('mangpongJobs', JSON.stringify(response.jobs));
            return response.jobs;
        }
        return [];
    } catch (error) {
        console.error('Error loading jobs:', error);
        return JSON.parse(localStorage.getItem('mangpongJobs') || '[]');
    }
}

// Save job to localStorage and Google Sheets
function saveJob(jobData, isDraft = false) {
    // Save to localStorage first
    let savedJobs = JSON.parse(localStorage.getItem('mangpongJobs') || '[]');

    // Check if editing existing job
    const editingJobId = document.getElementById('edit-job-id').value;

    if (editingJobId) {
        // Update existing job
        const jobIndex = savedJobs.findIndex(job => job.jobId === editingJobId);
        if (jobIndex !== -1) {
            // Preserve existing data and merge with new data
            const existingJob = savedJobs[jobIndex];
            savedJobs[jobIndex] = {
                ...existingJob,           // Keep all existing fields
                ...jobData,               // Override with new form data
                jobId: editingJobId,      // Ensure jobId remains the same
                timestamp: existingJob.timestamp, // Preserve original timestamp
                username: existingJob.username    // Preserve original username
            };
            console.log('Updated existing job:', editingJobId, 'with data:', savedJobs[jobIndex]);
        } else {
            // If not found, add as new (should not happen in normal flow)
            console.warn('Job not found for editing, adding as new:', editingJobId);
            savedJobs.push(jobData);
        }
    } else {
        // Add new job
        savedJobs.push(jobData);
        console.log('Added new job:', jobData.jobId);
    }

    localStorage.setItem('mangpongJobs', JSON.stringify(savedJobs));

    // Also submit to Google Sheets
    return submitToGoogleSheets({
        action: 'saveJob',
        ...jobData,
        isDraft: isDraft
    });
}
