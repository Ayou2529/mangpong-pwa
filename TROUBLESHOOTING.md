# Troubleshooting Guide for Mangpong PWA

## Common Issues and Solutions

### 1. "Unexpected end of input" JavaScript Error
**Problem**: Syntax error in main.js file
**Solution**: Already fixed in our updates. If you see this error:
- Make sure you're using the updated main.js file
- Check that the file ends properly with closing braces

### 2. "Unknown action" Response from Google Apps Script
**Problem**: Google Apps Script doesn't recognize the action parameter
**Solution**: Already fixed in our updates. If you still see this:
- Verify the Google Script URL in config.js is correct
- Check that you deployed the latest code with `clasp deploy`

### 3. Login/Registration Fails with No Error Message
**Problem**: Network issues or Google Apps Script not responding
**Solution**:
- Check browser console for network errors
- Verify internet connection
- Test Google Script URL directly in browser
- Check if Google Sheet is accessible

### 4. "Failed to register a ServiceWorker" Error
**Problem**: Opening file directly instead of through a web server
**Solution**: This is normal when opening locally. To fix:
- Use a local web server: `python -m http.server 8000`
- Or ignore this error for local testing

### 5. "ReferenceError: initializeApp is not defined"
**Problem**: Missing function in main.js
**Solution**: Already fixed in our updates. If you see this:
- Make sure you're using the updated main.js file

### 6. Form Validation Issues
**Problem**: Empty or invalid form fields
**Solution**:
- Make sure all required fields are filled
- Check browser console for specific validation errors
- Look for Swal alerts with error messages

## Debugging Steps

### Step 1: Check Browser Console
1. Press F12 to open Developer Tools
2. Go to Console tab
3. Look for any red error messages
4. Note any specific error messages

### Step 2: Check Network Requests
1. Press F12 to open Developer Tools
2. Go to Network tab
3. Try to login/register
4. Look for requests to your Google Script URL
5. Check response status and content

### Step 3: Test Google Script URL Directly
1. Open this URL in your browser:
   `https://script.google.com/macros/s/YOUR_SCRIPT_URL/exec?action=test&callback=callback`
2. You should see a JSONP response with test data

### Step 4: Verify Google Sheet Structure
1. Open your Google Sheet
2. Check that all required sheets exist:
   - Jobs
   - JobDetails
   - AdditionalFees
   - Users
   - JobHistory
3. Check that the first row contains proper headers

### Step 5: Check Local Storage
1. Press F12 to open Developer Tools
2. Go to Application tab
3. Expand Local Storage
4. Check for mangpongUser and mangpongJobs entries

## Quick Fixes

### If Login Still Doesn't Work:
1. Clear browser cache and cookies
2. Try in an incognito/private window
3. Check that your Google Script is deployed for "Anyone" access
4. Verify the SPREADSHEET_ID in your Google Apps Script code

### If Job Creation Fails:
1. Check that all required job fields are filled
2. Verify amounts are valid numbers
3. Check browser console for specific error messages

### If Data Doesn't Save:
1. Check that your Google Sheet ID is correct
2. Verify the Google Script has edit access to the sheet
3. Check that the sheet isn't open in another browser tab

## Contact for Help
If you're still having issues:
1. Take screenshots of browser console errors
2. Note the exact steps you took
3. Check if you can access the Google Script URL directly