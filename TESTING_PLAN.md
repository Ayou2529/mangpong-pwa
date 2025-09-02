# Testing Plan for Mangpong PWA

## Prerequisites
1. Make sure you've completed the clasp deployment steps
2. Ensure config.js has the correct Google Script URL
3. Have a Google Sheet ready with the proper structure

## Test 1: Basic Application Load
1. Open `index.html` in your browser
2. Verify that:
   - Login screen appears
   - No JavaScript errors in console (except the Tailwind warning)
   - All UI elements are visible and functional

## Test 2: User Registration
1. Click on "สมัครสมาชิก" (Register)
2. Fill in the registration form with:
   - Username: testuser
   - Password: testpass123
   - Confirm Password: testpass123
   - Full Name: Test User
   - Phone: 0123456789
   - Email: test@example.com
3. Click "สมัครสมาชิก" button
4. Verify that:
   - Success message appears
   - You're redirected to login screen
   - No errors in console

## Test 3: User Login
1. Enter the credentials you just created:
   - Username: testuser
   - Password: testpass123
2. Click "เข้าสู่ระบบ"
3. Verify that:
   - Success message appears
   - You're redirected to the main dashboard
   - User name is displayed in the header
   - No errors in console

## Test 4: Job Creation
1. Click on "งานใหม่" (New Job)
2. Fill in job details:
   - Select a company
   - Fill in assigned by and contact info
   - Fill in pickup location
   - Add job details (destination, recipient, amount)
3. Click "บันทึกงาน"
4. Verify that:
   - Success message appears
   - You're redirected to home screen
   - Job appears in history

## Test 5: Job History
1. Click on "ประวัติ" (History)
2. Verify that:
   - Your created job appears in the list
   - Job details are displayed correctly
   - Status badges show correctly

## Test 6: Logout
1. Click on "ออกจากระบบ" (Logout)
2. Verify that:
   - You're redirected to login screen
   - User session is cleared

## Common Issues to Watch For:
1. "Unexpected end of input" errors - Fixed in our updates
2. "Unknown action" errors - Fixed in Google Apps Script
3. Network timeout errors - Should be handled with better messages
4. Form validation errors - Should provide clear feedback

## If You Encounter Issues:
1. Check browser console for specific error messages
2. Verify Google Script URL in config.js
3. Ensure Google Sheet has proper structure
4. Check network tab for failed requests to Google Apps Script