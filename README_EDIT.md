# Mangpong Delivery System - Edit Functionality

## Overview
This update adds the ability to edit existing jobs in the Mangpong Delivery System. The system now supports both creating new jobs and editing existing ones using a unified form interface.

## New Files
1. `edit.html` - The edit job page
2. `main_edit.js` - Updated JavaScript with edit functionality
3. `gas_edit.js` - Updated Google Apps Script with backend functions
4. `edit.js` - JavaScript for handling edit page logic

## Key Features

### Frontend (edit.html + main_edit.js)
- Unified form for both creating and editing jobs
- Query string handling (`edit.html?jobId=xxxx`)
- Automatic form population when editing
- Consistent UI for both create and edit modes

### Backend (Google Apps Script)
- `handleCreateJob(params)` - Create new jobs with current timestamp
- `handleUpdateJob(params)` - Update existing jobs while preserving original timestamp
- `handleGetJobById(params)` - Retrieve job data by ID for editing

## How to Use

### Creating a New Job
1. Navigate to `index.html`
2. Click "งานใหม่" (New Job)
3. Fill in the job details
4. Click "บันทึกงาน" (Save Job)

### Editing an Existing Job
1. Navigate to `index.html`
2. Click "ประวัติ" (History)
3. Find the job you want to edit
4. Click the "แก้ไขงาน" (Edit Job) button
5. You will be redirected to `edit.html?jobId=xxxx`
6. The form will be automatically populated with existing data
7. Make your changes
8. Click "บันทึกการแก้ไข" (Save Changes)

## Technical Details

### Frontend Functions
- `loadJobForEdit(jobId)` - Loads job data from backend
- `populateEditFormWithJobData(job)` - Fills the form with job data
- `updateJob()` - Submits updated job data to backend
- `collectEditFormData()` - Gathers form data for submission
- `resetEditForm()` - Resets the edit form

### Backend Functions
- `handleCreateJob(p)` - Creates a new job with:
  - `timestamp = new Date()` (actual save time)
  - `jobDate = params.jobDate` or `new Date()` (can be past dates)
  - Returns `{ success:true, jobId }`

- `handleUpdateJob(p)` - Updates an existing job:
  - Finds row by jobId
  - Preserves original timestamp
  - Updates other values including jobDate
  - Uses `setValues` to update the row
  - Returns `{ success:true, jobId }`

- `handleGetJobById(p)` - Retrieves job data:
  - Finds row by jobId
  - Returns data as `{ header: value }`
  - Returns `{ success:true, job }`

## Benefits
1. Single form for both create and edit operations
2. Preserves original job creation timestamp
3. Allows editing of job dates (including past dates)
4. Consistent user experience across both modes
5. Automatic form population for editing