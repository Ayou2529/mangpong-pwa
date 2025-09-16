# Error Solutions Guide

This document provides detailed solutions for common errors encountered in the Mangpong Trading PWA project.

## 🚨 ERR001: Network Error - Failed to fetch data from Google Apps Script API

### Problem
This error occurs when the application cannot connect to the Google Apps Script API endpoint.

### Common Causes
1. Incorrect Google Apps Script URL in `config.js`
2. Script not deployed with proper access settings
3. Network connectivity issues
4. CORS policy restrictions

### Solutions
1. **Verify Google Apps Script URL**
   - Check that the URL in `config.js` is correct
   - Ensure it follows the format: `https://script.google.com/macros/s/{SCRIPT_ID}/exec`

2. **Check Script Deployment**
   - Open the Google Apps Script project
   - Go to Deploy > Manage Deployments
   - Ensure the deployment has "Anyone" access
   - Create a new deployment if needed

3. **Test API Endpoint**
   - Open the API URL directly in browser
   - Verify it returns data without errors
   - Check for any authentication prompts

4. **Implement Error Handling**
   ```javascript
   try {
     const response = await fetch(GOOGLE_SCRIPT_URL, {
       method: 'POST',
       body: formData
     });
     
     if (!response.ok) {
       throw new Error(`HTTP error! status: ${response.status}`);
     }
     
     const data = await response.json();
     return data;
   } catch (error) {
     console.error('Network error:', error);
     // Show user-friendly error message
     showError('Unable to connect to server. Please check your connection.');
   }
   ```

---

## 🎨 ERR002: UI Rendering Error - Modal dialog not displaying correctly on mobile devices

### Problem
Modal dialogs appear incorrectly or are unusable on mobile devices.

### Common Causes
1. Fixed pixel dimensions that don't adapt to screen size
2. Incorrect positioning CSS
3. Missing viewport meta tag
4. Z-index conflicts

### Solutions
1. **Use Responsive Units**
   ```css
   .modal {
     width: 90vw; /* Use viewport width instead of fixed pixels */
     max-width: 500px;
     height: auto;
     max-height: 90vh; /* Use viewport height */
   }
   ```

2. **Add Mobile-Specific Styles**
   ```css
   @media (max-width: 768px) {
     .modal {
       width: 95vw;
       top: 5vh;
       bottom: 5vh;
     }
   }
   ```

3. **Ensure Proper Viewport Meta Tag**
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

4. **Fix Positioning**
   ```css
   .modal {
     position: fixed;
     top: 50%;
     left: 50%;
     transform: translate(-50%, -50%);
     /* Remove fixed width/height */
   }
   ```

---

## 🌐 ERR003: CORS Error - Blocked by CORS policy

### Problem
Browser blocks requests due to CORS policy restrictions.

### Common Causes
1. Direct calls to Google Sheets API without proxy
2. Missing CORS headers in API responses
3. Incorrect domain configuration

### Solutions
1. **Use Google Apps Script as Proxy**
   - Always route API calls through Google Apps Script
   - Never make direct calls to Google Sheets API from frontend

2. **Set CORS Headers in GAS**
   ```javascript
   function doGet(e) {
     return ContentService
       .createTextOutput(JSON.stringify(processRequest(e)))
       .setMimeType(ContentService.MimeType.JSON)
       .setHeaders({
         'Access-Control-Allow-Origin': '*',
         'Access-Control-Allow-Methods': 'GET, POST',
         'Access-Control-Allow-Headers': 'Content-Type'
       });
   }
   ```

3. **Verify URL Configuration**
   - Ensure the Google Apps Script URL is correctly set in `config.js`
   - Test the URL directly in browser to verify it works

---

## 📦 ERR004: Reference Error - Cannot read property 'data' of undefined

### Problem
Attempting to access properties of an undefined object, commonly occurring when data hasn't loaded yet.

### Common Causes
1. Accessing data before API response
2. Missing null checks
3. Incorrect data structure assumptions

### Solutions
1. **Add Null Checks**
   ```javascript
   // Bad
   const items = data.items.map(item => item.name);
   
   // Good
   const items = data && data.items ? data.items.map(item => item.name) : [];
   ```

2. **Use Optional Chaining**
   ```javascript
   // Modern approach
   const items = data?.items?.map(item => item.name) || [];
   ```

3. **Implement Loading States**
   ```javascript
   if (loading) {
     return <div>Loading...</div>;
   }
   
   if (!data) {
     return <div>No data available</div>;
   }
   
   return <ItemList items={data.items} />;
   ```

4. **Validate Data Structure**
   ```javascript
   function processData(apiResponse) {
     if (!apiResponse || typeof apiResponse !== 'object') {
       console.error('Invalid API response:', apiResponse);
       return { items: [] };
     }
     
     return {
       items: Array.isArray(apiResponse.items) ? apiResponse.items : []
     };
   }
   ```

---

## 🔄 ERR005: Service Worker Error - Failed to register

### Problem
Service worker fails to register, breaking offline functionality.

### Common Causes
1. Service worker file not in root directory
2. Incorrect registration path
3. Browser not supporting service workers
4. HTTPS requirement not met

### Solutions
1. **Ensure Correct File Location**
   - Place `service-worker.js` in the root directory
   - Verify the file is being served correctly

2. **Fix Registration Code**
   ```javascript
   if ('serviceWorker' in navigator) {
     window.addEventListener('load', () => {
       navigator.serviceWorker.register('/service-worker.js')
         .then(registration => {
           console.log('SW registered: ', registration);
         })
         .catch(registrationError => {
           console.log('SW registration failed: ', registrationError);
         });
     });
   }
   ```

3. **Verify HTTPS**
   - Service workers require HTTPS in production
   - Use localhost for development (localhost is exempt from HTTPS requirement)

4. **Check Browser Support**
   ```javascript
   if ('serviceWorker' in navigator) {
     // Safe to use service workers
   } else {
     console.log('Service workers not supported');
     // Fallback for offline functionality
   }
   ```

---

## 💾 ERR006: Storage Error - Quota exceeded for localStorage

### Problem
Application exceeds the storage quota for localStorage.

### Common Causes
1. Storing large amounts of data
2. Not cleaning up old data
3. Storing binary data as strings
4. Multiple applications using localStorage

### Solutions
1. **Implement Data Cleanup**
   ```javascript
   function cleanLocalStorage() {
     const now = new Date().getTime();
     const oneWeek = 7 * 24 * 60 * 60 * 1000;
     
     for (let key in localStorage) {
       if (localStorage.hasOwnProperty(key)) {
         const item = JSON.parse(localStorage.getItem(key));
         if (item && item.timestamp && (now - item.timestamp > oneWeek)) {
           localStorage.removeItem(key);
         }
       }
     }
   }
   ```

2. **Use Compression for Large Data**
   ```javascript
   function saveToStorage(key, data) {
     const stringified = JSON.stringify(data);
     const compressed = LZString.compress(stringified);
     localStorage.setItem(key, compressed);
   }
   
   function loadFromStorage(key) {
     const compressed = localStorage.getItem(key);
     if (compressed) {
       const stringified = LZString.decompress(compressed);
       return JSON.parse(stringified);
     }
     return null;
   }
   ```

3. **Consider Alternative Storage**
   - Use IndexedDB for larger data storage
   - Implement server-side storage for critical data
   - Use sessionStorage for temporary data

---

## 🔐 ERR007: Authentication Error - LINE LIFF initialization failed

### Problem
LINE LIFF fails to initialize, preventing user authentication.

### Common Causes
1. Incorrect LINE LIFF ID
2. LIFF app not published
3. Domain restrictions
4. Network issues

### Solutions
1. **Verify LIFF ID**
   - Check the ID in `config.js`
   - Ensure it matches the LIFF app in LINE Developer Console

2. **Check LIFF App Status**
   - Go to LINE Developer Console
   - Verify the LIFF app is in "Published" status
   - Check that the endpoint URL is correct

3. **Implement Proper Error Handling**
   ```javascript
   try {
     await liff.init({ liffId: LIFF_ID });
     if (!liff.isLoggedIn()) {
       liff.login();
     }
   } catch (error) {
     console.error('LIFF initialization failed', error);
     showErrorMessage('Unable to initialize LINE login. Please try again later.');
   }
   ```

4. **Add Fallback Authentication**
   ```javascript
   if (!liff.isInClient()) {
     // Provide alternative login method for web browsers
     showEmailLogin();
   }
   ```

---

## 📈 Best Practices for Error Prevention

1. **Always implement error boundaries**
2. **Use try-catch blocks for async operations**
3. **Validate data before processing**
4. **Provide user-friendly error messages**
5. **Log errors for debugging**
6. **Test on multiple devices and browsers**
7. **Monitor error logs regularly**
8. **Implement graceful degradation**

## 🛠️ Tools for Error Debugging

1. **Browser Developer Tools**
   - Network tab for API errors
   - Console for JavaScript errors
   - Elements tab for UI issues

2. **Error Tracking Services**
   - Sentry for real-time error monitoring
   - LogRocket for session replay
   - Google Analytics for error tracking

3. **Testing Tools**
   - Jest for unit testing
   - Cypress for end-to-end testing
   - Lighthouse for PWA compliance