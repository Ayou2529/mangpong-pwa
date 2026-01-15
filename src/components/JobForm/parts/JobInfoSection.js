// src/components/JobForm/parts/JobInfoSection.js - Job information section for Job Form

import { renderCompanySelection } from './CompanySelection.js';
import { renderAssignerInfo } from './AssignerInfo.js';
import { renderPickupLocation } from './PickupLocation.js';

/**
 * Render job information section
 * @param {Object} job - The job data
 * @returns {string} - HTML string for job information
 */
export function renderJobInfoSection(job) {
  return `
    <div class="card bg-white p-4 mb-4">
      <h2 class="font-medium text-gray-700 mb-3">ข้อมูลการรับงาน</h2>
      ${renderCompanySelection(job)}
      <div class="section-divider"></div>
      ${renderAssignerInfo(job)}
      <div class="section-divider"></div>
      ${renderPickupLocation(job)}
    </div>
  `;
}