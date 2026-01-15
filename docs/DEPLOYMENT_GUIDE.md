# Google Apps Script Deployment Guide

## Overview
This guide explains how to deploy the updated Google Apps Script code that fixes CORS issues and removes the use of `document` in the server-side code.

## Prerequisites
- Access to the Google Apps Script project
- Access to the Google Sheets spreadsheet (ID: 1fcq5P7vm3IxtJMDS9BLDwO8B14hFmmDdK257GHyoM)

## Deployment Steps

### 1. Update Google Apps Script Code
1. Open the Google Apps Script project
2. Replace the existing code with the updated code from `updated_GAS_code_fixed.js`
3. Save the project (Ctrl+S or Cmd+S)

### 2. Deploy the Updated Script
1. In the Google Apps Script editor, click on "Deploy" → "Manage Deployments"
2. Select the existing deployment
3. Click the edit icon (pencil)
4. Select "New Version" from the version dropdown
5. Add a description for the update (e.g., "Fix CORS issues and remove document usage")
6. Click "Deploy"

### 3. Verify Deployment
1. After deployment, the URL should remain the same:
   `https://script.google.com/macros/s/AKfycbxZIMrFlOm3IzVSM-PqmgA91v-t48szqLLk9HD0IKdW9FBd3BFJ7SE9Eci6NEBcNa9v/exec`
2. Test the login functionality in the PWA application

## Key Improvements in the Updated Code

### 1. CORS Support
- Added proper CORS headers to all responses:
  ```javascript
  const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "3600"
  };
  ```
- The script now properly handles preflight OPTIONS requests

### 2. Removed `document` Usage
- Removed all usage of `document` object which is not available in server-side Google Apps Script
- Replaced JSONP responses with proper JSON responses using `ContentService`

### 3. Proper HTTP Method Handling
- `doGet` function handles GET requests and JSONP requests
- `doPost` function handles POST requests with JSON body

### 4. Better Error Handling
- Improved error handling with proper try/catch blocks
- More descriptive error messages

## Client-Side Changes

### 1. Updated API Implementation
- Replaced JSONP-based requests with modern `fetch` API
- Removed the need for JSONP callbacks
- Better error handling and response processing

### 2. Configuration
- The `config.js` file continues to use the same URL:
  `https://script.google.com/macros/s/AKfycbxZIMrFlOm3IzVSM-PqmgA91v-t48szqLLk9HD0IKdW9FBd3BFJ7SE9Eci6NEBcNa9v/exec`

## Testing
After deployment, test the following:
1. Login functionality
2. Registration functionality
3. Job creation
4. Job editing
5. Job history retrieval

## Troubleshooting
If issues occur:
1. Check the Google Apps Script execution logs
2. Verify the spreadsheet permissions
3. Ensure the spreadsheet ID is correct
4. Check the browser console for network errors

## Rollback Procedure
If issues occur, you can rollback by:
1. Going to "Deploy" → "Manage Deployments"
2. Selecting the previous version
3. Clicking "Deploy"

## Future Updates
When making future updates to the Google Apps Script:
1. Always create a new version
2. Test thoroughly before deploying
3. Document changes in the deployment description
4. Update this guide if deployment procedures change