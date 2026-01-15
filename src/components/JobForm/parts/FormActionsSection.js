// src/components/JobForm/parts/FormActionsSection.js - Form actions section for Job Form

/**
 * Render form actions section
 * @param {boolean} isEditing - Whether we're editing a job
 * @returns {string} - HTML string for form actions
 */
export function renderFormActionsSection(isEditing) {
  return `
    <div class="flex space-x-4 mb-20">
      <button
        type="button"
        class="flex-1 py-3 btn-secondary rounded-md font-medium touch-target"
        onclick="cancelEdit()"
      >
        ยกเลิก
      </button>
      <button
        type="submit"
        class="flex-1 py-3 btn-primary rounded-md font-medium touch-target"
      >
        ${isEditing ? 'บันทึกการแก้ไข' : 'บันทึกงาน'}
      </button>
    </div>
  `;
}