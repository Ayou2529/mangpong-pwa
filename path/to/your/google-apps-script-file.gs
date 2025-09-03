function handleSaveJob(params) {
  // Record the actual save time
  const timestamp = new Date();

  // Validate jobDate
  let jobDate;
  if (params.jobDate) {
    const parsedDate = new Date(params.jobDate);
    if (!isNaN(parsedDate.getTime())) {
      jobDate = parsedDate; // Use user-provided date if valid
    } else {
      jobDate = timestamp; // Fall back to current date if invalid
    }
  } else {
    jobDate = timestamp; // Fall back to current date if not provided
  }

  // Logic to save job with timestamp and jobDate
  const jobData = {
    timestamp: timestamp,
    jobDate: jobDate,
    // Include other job data from params as needed
  };

  // Continue with the existing logic for saving the job
  // ...
}
