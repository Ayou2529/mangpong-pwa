// src/components/Dashboard/Dashboard.js - Main Dashboard component

import { DashboardUI } from './DashboardUI.js';
import { useDashboard } from '../../hooks/useDashboard.js';

/**
 * Main Dashboard component
 * @param {Object} props - Component properties
 * @param {Object} props.user - Current user information
 * @returns {string} - HTML string for the dashboard
 */
export function Dashboard({ user }) {
  // Get dashboard functions from hook
  const { loadDashboardData } = useDashboard(user);
  
  // Load initial data
  loadDashboardData().then(data => {
    // Update UI with data after rendering
    setTimeout(() => {
      const dashboardElement = document.getElementById('dashboard-container');
      if (dashboardElement) {
        dashboardElement.innerHTML = DashboardUI({ user, ...data });
      }
    }, 0);
  });
  
  // Return initial loading state
  return `
    <div id="dashboard-container">
      <div class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    </div>
  `;
}