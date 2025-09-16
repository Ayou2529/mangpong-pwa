// src/utils/date.js - Date and time utilities

// Initialize date and time with Thai Buddhist calendar
export function updateDateTime() {
  const now = new Date();

  // Convert to Thai Buddhist calendar
  const thaiYear = now.getFullYear() + 543;
  const thaiMonths = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม',
  ];
  const thaiDays = [
    'อาทิตย์',
    'จันทร์',
    'อังคาร',
    'พุธ',
    'พฤหัสบดี',
    'ศุกร์',
    'เสาร์',
  ];

  const dayName = thaiDays[now.getDay()];
  const day = now.getDate();
  const month = thaiMonths[now.getMonth()];
  const year = thaiYear;
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const dateTimeString = `${dayName} ${day} ${month} ${year} ${hours}:${minutes}`;
  const currentDateTime = document.getElementById('current-date-time');
  if (currentDateTime) {
    currentDateTime.textContent = dateTimeString;
  }

  const monthYearString = `${month} ${year}`;
  const currentMonth = document.getElementById('current-month');
  if (currentMonth) {
    currentMonth.textContent = monthYearString;
  }

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

// Format date as YYYY-MM-DD for input[type="date"]
export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Convert date to Thai format for display
export function formatThaiDate(dateString) {
  const date = new Date(dateString);
  const thaiYear = date.getFullYear() + 543;
  const thaiMonths = [
    'ม.ค.',
    'ก.พ.',
    'มี.ค.',
    'เม.ย.',
    'พ.ค.',
    'มิ.ย.',
    'ก.ค.',
    'ส.ค.',
    'ก.ย.',
    'ต.ค.',
    'พ.ย.',
    'ธ.ค.',
  ];

  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const year = thaiYear;

  return `${day}/${month}/${year}`;
}