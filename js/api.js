// Google Sheets connection using JSONP
function submitToGoogleSheets(data) {
    return new Promise((resolve, reject) => {
        const callbackName = 'jsonpCallback_' + Date.now();

        window[callbackName] = function (response) {
            resolve(response);
            delete window[callbackName];
            try {
                document.body.removeChild(script);
            } catch (e) {
                // Ignore if script already removed
            }
        };

        const queryParams = new URLSearchParams();
        for (let key in data) {
            queryParams.append(key, data[key]);
        }
        queryParams.append('callback', callbackName);

        const script = document.createElement('script');
        script.src = `${GOOGLE_SCRIPT_URL}?${queryParams.toString()}`;
        script.onerror = function () {
            reject(new Error('เกิดข้อผิดพลาดในการเชื่อมต่อ Google Sheets'));
            delete window[callbackName];
            try {
                document.body.removeChild(script);
            } catch (e) {
                // Ignore
            }
        };

        document.body.appendChild(script);
    });
}

// This function receives the data from the Google Apps Script.
function jsonpCallback(data) {
    // Check if the data is an array and contains records.
    if (Array.isArray(data) && data.length > 0) {
        // Call the function to display the job history on the page.
        // Ensure displayJobHistory exists before calling
        if (typeof displayJobHistory === 'function') {
            displayJobHistory(data);
        } else {
            console.warn('displayJobHistoryMain argument ignored as displayJobHistory function is not ready');
        }
    } else {
        // If no data is returned, display a message.
        console.log("No job history found for this user.");
        const container = document.getElementById('job-history-container');
        if (container) container.innerHTML = '<p>No job history found.</p>';
    }
}
