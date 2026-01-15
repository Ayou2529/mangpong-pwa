// src/hooks/useDashboard.js - Custom hook for Dashboard logic

import { loadJobsFromSheets } from '../utils/api.js';

/**
 * Custom hook for Dashboard logic
 * @param {Object} user - Current user information
 * @returns {Object} - Object containing dashboard functions and data
 */
export function useDashboard(user) {
  /**
   * Load dashboard data
   * @returns {Promise<Object>} - Promise that resolves with dashboard data
   */
  async function loadDashboardData() {
    try {
      // Load jobs from sheets
      const jobs = await loadJobsFromSheets();
      
      // Filter jobs by user
      const userJobs = jobs.filter(job => job.username === user.username);
      
      // Calculate statistics
      const today = new Date();
      const todayJobs = userJobs.filter(job => {
        const jobDate = new Date(job.jobDate);
        return jobDate.toDateString() === today.toDateString();
      });
      
      const completedToday = todayJobs.filter(job => job.status === 'complete').length;
      
      // Get current month jobs
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const monthlyJobs = userJobs.filter(job => {
        const jobDate = new Date(job.jobDate);
        return jobDate.getMonth() === currentMonth && jobDate.getFullYear() === currentYear;
      }).length;
      
      // Get draft and incomplete jobs
      const draftJobs = userJobs.filter(job => job.status === 'draft');
      const incompleteJobs = userJobs.filter(job => job.status === 'incomplete');
      
      return {
        stats: {
          jobsToday: todayJobs.length,
          completedToday,
          monthlyJobs,
          totalJobs: userJobs.length,
        },
        draftJobs,
        incompleteJobs,
      };
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      return {
        stats: {
          jobsToday: 0,
          completedToday: 0,
          monthlyJobs: 0,
          totalJobs: 0,
        },
        draftJobs: [],
        incompleteJobs: [],
      };
    }
  }
  
  /**
   * Refresh dashboard data
   */
  async function refreshDashboard() {
    const data = await loadDashboardData();
    updateDashboardUI(data);
  }
  
  /**
   * Update dashboard UI with new data
   * @param {Object} data - Dashboard data
   */
  function updateDashboardUI(data) {
    // Update stats
    const jobsToday = document.getElementById('jobs-today');
    const completedToday = document.getElementById('completed-today');
    const monthlyJobs = document.getElementById('monthly-jobs');
    const totalJobs = document.getElementById('total-jobs');
    
    if (jobsToday) jobsToday.textContent = data.stats.jobsToday;
    if (completedToday) completedToday.textContent = data.stats.completedToday;
    if (monthlyJobs) monthlyJobs.textContent = data.stats.monthlyJobs;
    if (totalJobs) totalJobs.textContent = data.stats.totalJobs;
    
    // Update job lists
    updateJobLists(data.draftJobs, data.incompleteJobs);
  }
  
  /**
   * Update job lists in UI
   * @param {Array} draftJobs - Draft jobs to display
   * @param {Array} incompleteJobs - Incomplete jobs to display
   */
  function updateJobLists(draftJobs, incompleteJobs) {
    // Update draft jobs list
    const draftList = document.getElementById('draft-jobs-list');
    const draftCard = document.getElementById('draft-jobs-card');
    
    if (draftList && draftCard) {
      if (draftJobs.length > 0) {
        draftCard.classList.remove('hidden');
        draftList.innerHTML = draftJobs.map(job => `
          <li class="cursor-pointer hover:text-indigo-600" onclick="editJob('${job.jobId}')">
            ${job.jobId}: ${job.company || 'ไม่ระบุบริษัท'}
          </li>
        `).join('');
      } else {
        draftCard.classList.add('hidden');
      }
    }
    
    // Update incomplete jobs list
    const incompleteList = document.getElementById('incomplete-jobs-list');
    const incompleteCard = document.getElementById('incomplete-jobs-card');
    
    if (incompleteList && incompleteCard) {
      if (incompleteJobs.length > 0) {
        incompleteCard.classList.remove('hidden');
        incompleteList.innerHTML = incompleteJobs.map(job => `
          <li class="cursor-pointer hover:text-indigo-600" onclick="editJob('${job.jobId}')">
            ${job.jobId}: ${job.incompleteReason || 'ข้อมูลไม่ครบถ้วน'}
          </li>
        `).join('');
      } else {
        incompleteCard.classList.add('hidden');
      }
    }
  }
  
  return {
    loadDashboardData,
    refreshDashboard,
    updateDashboardUI,
  };
}