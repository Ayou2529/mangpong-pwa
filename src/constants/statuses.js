// src/constants/statuses.js - Job statuses

export const JOB_STATUSES = {
  DRAFT: 'draft',
  INCOMPLETE: 'incomplete',
  COMPLETE: 'complete',
};

export const JOB_STATUS_LABELS = {
  [JOB_STATUSES.DRAFT]: 'ร่าง',
  [JOB_STATUSES.INCOMPLETE]: 'ไม่สมบูรณ์',
  [JOB_STATUSES.COMPLETE]: 'สมบูรณ์',
};

export const JOB_STATUS_COLORS = {
  [JOB_STATUSES.DRAFT]: 'bg-orange-100 text-orange-800',
  [JOB_STATUSES.INCOMPLETE]: 'bg-red-100 text-red-800',
  [JOB_STATUSES.COMPLETE]: 'bg-green-100 text-green-800',
};