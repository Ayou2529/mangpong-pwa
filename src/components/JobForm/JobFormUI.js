// src/components/JobForm/JobFormUI.js - Main Job Form UI component

import { renderFormHeader } from './parts/FormHeader.js';
import { renderDatePickerSection } from './parts/DatePickerSection.js';
import { renderJobInfoSection } from './parts/JobInfoSection.js';
import { renderJobDetailsSection } from './parts/JobDetailsSection.js';
import { renderServiceSummarySection } from './parts/ServiceSummarySection.js';
import { renderFormActionsSection } from './parts/FormActionsSection.js';

/**
 * Job form UI component for creating/editing jobs
 * @param {Object} props - Component properties
 * @param {Object} props.job - The job data to populate the form with (optional)
 * @returns {string} - HTML string for the job form UI
 */
export function JobFormUI({ job = null }) {
  const isEditing = !!job;
  
  return `
    <form id="${isEditing ? 'edit-job-form' : 'new-job-form'}">
      ${renderFormHeader(job)}
      ${renderDatePickerSection(job)}
      ${renderJobInfoSection(job)}
      ${renderJobDetailsSection(job)}
      ${renderServiceSummarySection(job)}
      ${renderFormActionsSection(isEditing)}
    </form>
  `;
}