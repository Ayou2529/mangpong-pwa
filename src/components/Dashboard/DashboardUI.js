// src/components/Dashboard/DashboardUI.js - Main Dashboard UI component

import { renderHeaderSection } from './parts/HeaderSection.js';
import { renderDateTimeSection } from './parts/DateTimeSection.js';
import { renderStatsSection } from './parts/StatsSection.js';
import { renderQuickActionsSection } from './parts/QuickActionsSection.js';
import { renderMonthlyReportSection } from './parts/MonthlyReportSection.js';
import { renderDraftJobsSection } from './parts/DraftJobsSection.js';
import { renderIncompleteJobsSection } from './parts/IncompleteJobsSection.js';

/**
 * Dashboard UI component
 * @param {Object} props - Component properties
 * @param {Object} props.user - Current user information
 * @param {Object} props.stats - Statistics to display
 * @param {Array} props.draftJobs - Draft jobs to display
 * @param {Array} props.incompleteJobs - Incomplete jobs to display
 * @returns {string} - HTML string for the dashboard UI
 */
export function DashboardUI({ user, stats, draftJobs = [], incompleteJobs = [] }) {
  return `
    ${renderHeaderSection(user)}
    ${renderDateTimeSection()}
    ${renderStatsSection(stats)}
    ${renderQuickActionsSection()}
    ${renderMonthlyReportSection(stats)}
    ${renderDraftJobsSection(draftJobs)}
    ${renderIncompleteJobsSection(incompleteJobs)}
  `;
}