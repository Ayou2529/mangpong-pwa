// src/components/JobForm/parts/FormHeader.js - Form header section for Job Form

/**
 * Render form header section
 * @param {Object} job - The job data
 * @returns {string} - HTML string for form header
 */
export function renderFormHeader(job) {
  return `
    <input type="hidden" id="edit-job-id" name="jobId" value="${job?.jobId || ''}" />
    <input type="hidden" id="original-job-date" name="originalJobDate" value="${job?.jobDate || ''}" />
  `;
}