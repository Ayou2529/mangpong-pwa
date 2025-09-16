// src/utils/formatting.js - Formatting utilities

/**
 * Format date as DD/MM/YYYY for Thai input
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export function formatThaiDateInput(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear() + 543;
  return `${day}/${month}/${year}`;
}

/**
 * Format date as YYYY-MM-DD for input[type="date"]
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Convert date to Thai format for display
 * @param {string} dateString - The date string to format
 * @returns {string} - Formatted date string
 */
export function formatThaiDate(dateString) {
  const date = new Date(dateString);
  const thaiYear = date.getFullYear() + 543;
  const thaiMonths = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
  ];

  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const year = thaiYear;

  return `${day}/${month}/${year}`;
}

/**
 * Format currency for display
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount) {
  return parseFloat(amount).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Format number with commas
 * @param {number} number - The number to format
 * @returns {string} - Formatted number string
 */
export function formatNumber(number) {
  return parseFloat(number).toLocaleString('th-TH');
}