// updated_main.js

// This function receives the data from the Google Apps Script.
function jsonpCallback(data) {
  // Check if the data is an array and contains records.
  if (Array.isArray(data) && data.length > 0) {
    // Call the function to display the job history on the page.
    displayJobHistory(data);
  } else {
    // If no data is returned, display a message.
    console.log("ไม่พบประวัติงานสำหรับผู้ใช้นี้");
    document.getElementById("job-history-container").innerHTML =
      "<p>ไม่พบประวัติงาน</p>";
  }
}

// Global variables
let currentUser = null;

// --- START: SAFE LOCALSTORAGE WRAPPERS ---

// Safe localStorage wrapper for iOS compatibility
function safeLocalStorageSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.error("localStorage setItem failed:", e);
    // iOS Safari sometimes throws QUOTA_EXCEEDED_ERR
    if (isIOS()) {
      // Try to clean up old data
      try {
        // Remove oldest jobs to free up space
        const jobs = JSON.parse(
          safeLocalStorageGetItem("mangpongJobs") || "[]"
        );
        if (jobs.length > 10) {
          // Keep only the most recent 10 jobs
          const recentJobs = jobs.slice(-10);
          safeLocalStorageSetItem("mangpongJobs", JSON.stringify(recentJobs));
          // Retry setting the item
          safeLocalStorageSetItem(key, value);
          return true;
        }
      } catch (cleanupError) {
        console.error("localStorage cleanup failed:", cleanupError);
      }
    }
    return false;
  }
}

// Safe localStorage getter
function safeLocalStorageGetItem(key, defaultValue = null) {
  try {
    return localStorage.getItem(key) || defaultValue;
  } catch (e) {
    console.error("localStorage getItem failed:", e);
    return defaultValue;
  }
}

// Safe localStorage removal
function safeLocalStorageRemoveItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error("localStorage removeItem failed:", e);
    return false;
  }
}

// --- END: SAFE LOCALSTORAGE WRAPPERS ---

// --- START: FIX FOR PAGE VISIBILITY ---

// Global variable to track the current top-level page
let currentPage = "login-screen";

/**
 * Manages the visibility of top-level pages (login, register, app).
 * It ensures only one is visible at a time by toggling the 'hidden' class.
 * @param {string} pageId The ID of the page to show ('login-screen', 'register-screen', or 'app').
 */
function showPage(pageId) {
  currentPage = pageId;

  // List of all top-level page container IDs
  const pages = ["login-screen", "register-screen", "app"];

  pages.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      if (id === currentPage) {
        element.classList.remove("hidden");
      } else {
        element.classList.add("hidden");
      }
    } else {
      console.warn(`Page element with ID '${id}' not found`);
    }
  });
}

// --- END: FIX FOR PAGE VISIBILITY ---

// Function to load jobs from Google Sheets
async function loadJobsFromSheets() {
  try {
    // Check if we have a current user
    if (!currentUser) {
      console.warn("No current user, returning empty array");
      return [];
    }

    // Check if Google Script URL is defined
    if (!window.GOOGLE_SCRIPT_URL) {
      console.warn("Google Script URL not defined, using localStorage only");
      return JSON.parse(safeLocalStorageGetItem("mangpongJobs") || "[]");
    }

    const response = await submitToGoogleSheets({
      action: "getJobs",
      username: currentUser.username,
    });

    if (response.success && response.jobs) {
      safeLocalStorageSetItem("mangpongJobs", JSON.stringify(response.jobs));
      return response.jobs;
    }
    // If response is not successful, fall back to localStorage
    console.warn(
      "Failed to load jobs from sheets, falling back to localStorage"
    );
    return JSON.parse(safeLocalStorageGetItem("mangpongJobs") || "[]");
  } catch (error) {
    console.error("Error loading jobs:", error);
    // Always fall back to localStorage on error
    return JSON.parse(safeLocalStorageGetItem("mangpongJobs") || "[]");
  }
}

// Authentication functions
function showLoginScreen() {
  showPage("login-screen");
}

function showRegisterScreen() {
  showPage("register-screen");
}

function logout() {
  safeLocalStorageRemoveItem("mangpongUser");
  currentUser = null;
  showPage("login-screen");
}

// Login form submission
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Validate form elements exist
    const usernameInput = document.getElementById("login-username");
    const passwordInput = document.getElementById("login-password");

    if (!usernameInput || !passwordInput) {
      await Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่พบองค์ประกอบฟอร์มที่จำเป็น",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Validate input
    if (!username || !password) {
      await Swal.fire({
        icon: "warning",
        title: "กรุณากรอกข้อมูล",
        text: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    console.log("Attempting login for user:", username);

    // Show loading
    Swal.fire({
      title: "กำลังเข้าสู่ระบบ...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      // Add timeout to prevent hanging
      const timeout = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("การเชื่อมต่อหมดเวลา กรุณาลองใหม่อีกครั้ง")),
          10000
        )
      );

      const requestData = {
        action: "login",
        username: username,
        password: password,
      };

      console.log("Sending login request:", requestData);

      const loginPromise = submitToGoogleSheets(requestData);

      const response = await Promise.race([loginPromise, timeout]);

      console.log("Received login response:", response);

      if (response && response.success) {
        currentUser = response.user;
        safeLocalStorageSetItem("mangpongUser", JSON.stringify(currentUser));

        // Show success and redirect
        await Swal.fire({
          icon: "success",
          title: "เข้าสู่ระบบสำเร็จ!",
          text: `ยินดีต้อนรับ ${currentUser.fullName || username}`,
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#10b981",
        });

        // Show main app
        showPage("app");
        const userDisplayName = document.getElementById("user-display-name");
        if (userDisplayName) {
          userDisplayName.textContent = currentUser.fullName || username;
        }

        // Initialize app
        initializeApp();
      } else {
        await Swal.fire({
          icon: "error",
          title: "เข้าสู่ระบบไม่สำเร็จ",
          text:
            response && response.error
              ? response.error
              : "ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      await Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text:
          error.message ||
          "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#ef4444",
      });
    }
  });
}

// Register form submission
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Validate form elements exist
    const usernameInput = document.getElementById("register-username");
    const passwordInput = document.getElementById("register-password");
    const confirmPasswordInput = document.getElementById(
      "register-confirm-password"
    );
    const fullNameInput = document.getElementById("register-fullname");
    const phoneInput = document.getElementById("register-phone");
    const emailInput = document.getElementById("register-email");

    if (
      !usernameInput ||
      !passwordInput ||
      !confirmPasswordInput ||
      !fullNameInput ||
      !phoneInput ||
      !emailInput
    ) {
      await Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่พบองค์ประกอบฟอร์มที่จำเป็น",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    const fullName = fullNameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();

    // Validate input
    if (
      !username ||
      !password ||
      !confirmPassword ||
      !fullName ||
      !phone ||
      !email
    ) {
      await Swal.fire({
        icon: "warning",
        title: "กรุณากรอกข้อมูลให้ครบ",
        text: "กรุณากรอกข้อมูลทุกช่อง",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      await Swal.fire({
        icon: "error",
        title: "รหัสผ่านไม่ตรงกัน",
        text: "กรุณาตรวจสอบรหัสผ่านและยืนยันรหัสผ่านให้ตรงกัน",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    // Show loading
    Swal.fire({
      title: "กำลังสมัครสมาชิก...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      // Add timeout to prevent hanging
      const timeout = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("การเชื่อมต่อหมดเวลา กรุณาลองใหม่อีกครั้ง")),
          10000
        )
      );

      const registerPromise = submitToGoogleSheets({
        action: "register",
        username: username,
        password: password,
        fullName: fullName,
        phone: phone,
        email: email,
      });

      const response = await Promise.race([registerPromise, timeout]);

      if (response && response.success) {
        await Swal.fire({
          icon: "success",
          title: "สมัครสมาชิกสำเร็จ!",
          text: "คุณสามารถเข้าสู่ระบบได้แล้ว",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#10b981",
        });

        // Clear form and show login screen
        registerForm.reset();
        showPage("login-screen");
      } else {
        await Swal.fire({
          icon: "error",
          title: "สมัครสมาชิกไม่สำเร็จ",
          text:
            response && response.error
              ? response.error
              : "ไม่สามารถสมัครสมาชิกได้ กรุณาลองใหม่อีกครั้ง",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      await Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text:
          error.message ||
          "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#ef4444",
      });
    }
  });
}

function submitToGoogleSheets(data) {
  return new Promise((resolve, reject) => {
    // Check if Google Script URL is defined
    if (!window.GOOGLE_SCRIPT_URL) {
      reject(new Error("Google Script URL ไม่ได้ถูกกำหนดไว้"));
      return;
    }

    const callbackName = "jsonpCallback_" + Date.now();

    // expose the callback globally
    window[callbackName] = (response) => {
      resolve(response);
      cleanUp();
    };

    // build query string, include the callback parameter
    const qs = new URLSearchParams({
      ...data,
      callback: callbackName,
    }).toString();

    // create the script tag that will load the JSONP response
    const script = document.createElement("script");
    script.src = `${window.GOOGLE_SCRIPT_URL}?${qs}`;
    script.onerror = () => {
      reject(new Error("ไม่สามารถเชื่อมต่อกับ Google Apps Script ได้"));
      cleanUp();
    };

    // Add timeout handling
    const timeoutId = setTimeout(() => {
      reject(new Error("การเชื่อมต่อกับ Google Apps Script หมดเวลา"));
      cleanUp();
    }, 10000); // 10 second timeout

    // cleanup function – remove script element and the temporary callback
    function cleanUp() {
      clearTimeout(timeoutId);
      delete window[callbackName];
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    }

    document.body.appendChild(script);
  });
}

// Initialize app
function initializeApp() {
  updateDateTime();
  checkJobStatus();
  updateStats();

  // Add event listeners to amount inputs
  document.querySelectorAll(".amount-input").forEach((input) => {
    input.addEventListener("input", updateTotalAmount);
  });
}

// Initialize date and time with Thai Buddhist calendar
function updateDateTime() {
  const now = new Date();

  // Convert to Thai Buddhist calendar
  const thaiYear = now.getFullYear() + 543;
  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  const thaiDays = [
    "อาทิตย์",
    "จันทร์",
    "อังคาร",
    "พุธ",
    "พฤหัสบดี",
    "ศุกร์",
    "เสาร์",
  ];

  const dayName = thaiDays[now.getDay()];
  const day = now.getDate();
  const month = thaiMonths[now.getMonth()];
  const year = thaiYear;
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  const dateTimeString = `${dayName} ${day} ${month} ${year} ${hours}:${minutes}`;
  const currentDateTime = document.getElementById("current-date-time");
  if (currentDateTime) {
    currentDateTime.textContent = dateTimeString;
  }

  const monthYearString = `${month} ${year}`;
  const currentMonth = document.getElementById("current-month");
  if (currentMonth) {
    currentMonth.textContent = monthYearString;
  }

  // Set default date for history to today
  const selectedDateInput = document.getElementById("selected-date");
  if (selectedDateInput) {
    selectedDateInput.value = formatDate(now);
  }

  // Set default date for job date picker to today
  const jobDatePicker = document.getElementById("job-date-picker");
  if (jobDatePicker) {
    jobDatePicker.value = formatDate(now);
  }
}

// Format date as DD/MM/YYYY for Thai input
function formatThaiDateInput(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear() + 543;
  return `${day}/${month}/${year}`;
}

// Format date as YYYY-MM-DD for input[type="date"]
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Convert date to Thai format for display
function formatThaiDate(dateString) {
  const date = new Date(dateString);
  const thaiYear = date.getFullYear() + 543;
  const thaiMonths = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];

  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const year = thaiYear;

  return `${day}/${month}/${year}`;
}

// Check incomplete and draft jobs from localStorage
async function checkJobStatus() {
  const savedJobs = await loadJobsFromSheets();

  const incompleteJobs = savedJobs.filter((job) => job.status === "incomplete");
  const draftJobs = savedJobs.filter((job) => job.status === "draft");

  // Handle incomplete jobs
  const incompleteCard = document.getElementById("incomplete-jobs-card");
  const incompleteList = document.getElementById("incomplete-jobs-list");

  if (incompleteCard && incompleteList) {
    if (incompleteJobs.length > 0) {
      incompleteCard.classList.remove("hidden");
      incompleteList.innerHTML = "";

      incompleteJobs.forEach((job) => {
        const li = document.createElement("li");
        li.textContent = `${job.jobId}: ${job.incompleteReason || "ข้อมูลไม่ครบถ้วน"}`;
        li.className = "cursor-pointer hover:text-indigo-600";
        li.onclick = function () {
          editJob(job.jobId);
        };
        incompleteList.appendChild(li);
      });
    } else {
      incompleteCard.classList.add("hidden");
    }
  }

  // Handle draft jobs
  const draftCard = document.getElementById("draft-jobs-card");
  const draftList = document.getElementById("draft-jobs-list");

  if (draftCard && draftList) {
    if (draftJobs.length > 0) {
      draftCard.classList.remove("hidden");
      draftList.innerHTML = "";

      draftJobs.forEach((job) => {
        const li = document.createElement("li");
        li.textContent = `${job.jobId}: ${job.company || "ไม่ระบุบริษัท"}`;
        li.className = "cursor-pointer hover:text-indigo-600";
        li.onclick = function () {
          editJob(job.jobId);
        };
        draftList.appendChild(li);
      });
    } else {
      draftCard.classList.add("hidden");
    }
  }
}

// Screen navigation
function showScreen(screenId) {
  // Hide all screens
  const homeScreen = document.getElementById("home-screen");
  const jobScreen = document.getElementById("job-screen");
  const historyScreen = document.getElementById("history-screen");

  if (homeScreen) homeScreen.classList.add("hidden");
  if (jobScreen) jobScreen.classList.add("hidden");
  if (historyScreen) historyScreen.classList.add("hidden");

  // Show the selected screen
  const selectedScreen = document.getElementById(screenId);
  if (selectedScreen) selectedScreen.classList.remove("hidden");

  // Update navigation
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
  });

  // Set active nav item and refresh data
  if (screenId === "home-screen") {
    const navItem = document.querySelectorAll(".nav-item")[0];
    if (navItem) navItem.classList.add("active");
    checkJobStatus();
    updateStats();
  } else if (screenId === "job-screen") {
    const navItem = document.querySelectorAll(".nav-item")[1];
    if (navItem) navItem.classList.add("active");
  } else if (screenId === "history-screen") {
    const navItem = document.querySelectorAll(".nav-item")[2];
    if (navItem) navItem.classList.add("active");
    displayJobHistory();
  }
}

// Add job detail
const addJobDetail = document.getElementById("add-job-detail");
if (addJobDetail) {
  addJobDetail.addEventListener("click", function () {
    const container = document.getElementById("job-details-container");
    const jobDetailCount =
      container.querySelectorAll(".job-detail-card").length;

    if (jobDetailCount < 5) {
      const newDetail = document.createElement("div");
      newDetail.className =
        "job-detail-card border border-gray-200 rounded-md p-3 mb-3";
      newDetail.innerHTML = `
                <div class="flex justify-between items-center mb-2">
                    <h3 class="font-medium">รายละเอียดงาน #${jobDetailCount + 1}</h3>
                    <button type="button" class="text-red-500 remove-job-detail touch-target">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="mb-2">
                    <label class="block text-gray-600 mb-1">บริษัทปลายทาง</label>
                    <input type="text" class="w-full p-3 border border-gray-300 rounded-md touch-target job-company-to" placeholder="ชื่อบริษัทปลายทาง" required>
                </div>
                <div class="mb-2">
                    <label class="block text-gray-600 mb-1">จังหวัดส่งของ</label>
                    <input type="text" class="w-full p-3 border border-gray-300 rounded-md touch-target job-province" placeholder="จังหวัดส่งของ" required>
                </div>
                <div class="mb-2">
                    <label class="block text-gray-600 mb-1">เขต/อำเภอส่งของ</label>
                    <input type="text" class="w-full p-3 border border-gray-300 rounded-md touch-target job-district" placeholder="เขต/อำเภอส่งของ" required>
                </div>
                <div class="mb-2">
                    <label class="block text-gray-600 mb-1">ผู้รับงาน</label>
                    <input type="text" class="w-full p-3 border border-gray-300 rounded-md touch-target job-recipient" placeholder="ชื่อผู้รับงาน" required>
                </div>
                <div class="mb-2">
                    <label class="block text-gray-600 mb-1">รายละเอียด</label>
                    <textarea class="w-full p-3 border border-gray-300 rounded-md touch-target job-detail" placeholder="รายละเอียดงาน" rows="2" required></textarea>
                </div>
                <div>
                    <label class="block text-gray-600 mb-1">จำนวนเงิน - บาท</label>
                    <input type="number" class="w-full p-3 border border-gray-300 rounded-md amount-input touch-target job-amount" placeholder="0.00" min="0" step="0.01" required>
                </div>
            `;
      container.appendChild(newDetail);

      // Add event listener to remove button
      newDetail
        .querySelector(".remove-job-detail")
        .addEventListener("click", function () {
          container.removeChild(newDetail);
          updateTotalAmount();
        });

      // Add event listener to amount input
      newDetail
        .querySelector(".amount-input")
        .addEventListener("input", updateTotalAmount);
    } else {
      Swal.fire({
        icon: "warning",
        title: "จำกัดจำนวนรายการ",
        text: "คุณสามารถเพิ่มรายละเอียดงานได้สูงสุด 5 รายการ",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#f59e0b",
      });
    }
  });
}

// Add additional fee
const addFee = document.getElementById("add-fee");
if (addFee) {
  addFee.addEventListener("click", function () {
    const container = document.getElementById("additional-fees-container");
    const feeItem = document.createElement("div");
    feeItem.className = "flex justify-between items-center mb-2";
    feeItem.innerHTML = `
            <div class="flex-1 mr-2">
                <select class="w-full p-3 border border-gray-300 rounded-md touch-target fee-name" required>
                    <option value="" disabled selected>เลือกรายการ</option>
                    <option value="บรรทุก">บรรทุก</option>
                    <option value="ล่วงเวลา_OT">ล่วงเวลา_OT</option>
                    <option value="กลับ">กลับ</option>
                    <option value="รอ">รอ</option>
                </select>
            </div>
            <div class="w-24 mr-2">
                <input type="number" class="w-full p-3 border border-gray-300 rounded-md fee-amount touch-target" placeholder="0.00" min="0" step="0.01" required>
            </div>
            <button type="button" class="text-red-500 remove-fee touch-target">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        `;
    container.appendChild(feeItem);

    // Add event listener to remove button
    feeItem.querySelector(".remove-fee").addEventListener("click", function () {
      container.removeChild(feeItem);
      updateTotalAmount();
    });

    // Add event listener to fee amount input
    feeItem
      .querySelector(".fee-amount")
      .addEventListener("input", updateTotalAmount);
  });
}

// Update total amount
function updateTotalAmount() {
  try {
    let total = 0;

    // Sum job detail amounts
    document.querySelectorAll(".job-amount, .amount-input").forEach((input) => {
      const value = parseFloat(input.value) || 0;
      total += value;
    });

    // Update main service fee
    const mainServiceFeeElement = document.getElementById("main-service-fee");
    if (mainServiceFeeElement) {
      mainServiceFeeElement.textContent = total.toFixed(2) + " บาท";
    }

    // Sum additional fees
    document.querySelectorAll(".fee-amount").forEach((input) => {
      const value = parseFloat(input.value) || 0;
      total += value;
    });

    // Update total
    const totalAmountElement = document.getElementById("total-amount");
    if (totalAmountElement) {
      totalAmountElement.textContent = total.toFixed(2) + " บาท";
    }
  } catch (error) {
    console.error("Error updating total amount:", error);
    // Don't throw error to prevent breaking the UI
  }
}

// Save job as draft (floating button)
const floatingSaveBtn = document.getElementById("floating-save-btn");
if (floatingSaveBtn) {
  floatingSaveBtn.addEventListener("click", async function () {
    // Show loading alert
    Swal.fire({
      title: "กำลังบันทึกร่าง...",
      text: "กรุณารอสักครู่",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const formData = collectFormData();
      formData.status = "draft";

      const response = await saveJob(formData, true);

      // Show success message
      await Swal.fire({
        icon: "info",
        title: "บันทึกร่างสำเร็จ!",
        text: `งาน ${formData.jobId} ถูกบันทึกเป็นร่างแล้ว`,
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#3b82f6",
      });

      // Update stats
      updateStats();

      // Add to draft jobs list
      const draftJobs = [
        { id: formData.jobId, company: formData.company || "แมงป่อง เทรดดิ้ง" },
      ];

      const draftCard = document.getElementById("draft-jobs-card");
      const draftList = document.getElementById("draft-jobs-list");

      draftCard.classList.remove("hidden");
      draftList.innerHTML = "";

      draftJobs.forEach((job) => {
        const li = document.createElement("li");
        li.textContent = `${job.id}: ${job.company}`;
        li.className = "cursor-pointer hover:text-indigo-600";
        li.onclick = function () {
          editJob(job.id);
        };
        draftList.appendChild(li);
      });

      // Reset form
      resetForm();

      // Go back to home screen
      showScreen("home-screen");
    } catch (error) {
      console.error("Error saving draft:", error);

      // Show error message
      await Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด!",
        text: error.message,
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#ef4444",
      });
    }
  });
}

// Collect form data
function collectFormData() {
  try {
    const form = document.getElementById("job-form");
    if (!form) {
      throw new Error("Form not found - job-form element missing");
    }

    // วันที่บันทึกงาน
    const jobDatePicker = document.getElementById("job-date-picker");
    if (!jobDatePicker) {
      throw new Error("Job date picker not found");
    }

    // When editing, preserve the original job date
    let selectedDate, thaiDateValue;
    const editJobId = document.getElementById("edit-job-id").value;
    const originalDateField = document.getElementById("original-job-date");
    if (editJobId && originalDateField && originalDateField.value) {
      // Editing existing job - preserve original date
      const originalThaiDate = originalDateField.value;
      selectedDate = parseThaiDate(originalThaiDate);
      thaiDateValue = originalThaiDate; // Use original Thai date format
    } else {
      // Creating new job - use current date
      selectedDate = new Date(jobDatePicker.value);
      thaiDateValue = formatThaiDateInput(selectedDate);
    }

    // ข้อมูลหลักของงาน
    const base = {
      timestamp: selectedDate.toISOString(),
      jobDate: thaiDateValue,
      jobId: editJobId || "JOB-" + Math.floor(10000 + Math.random() * 90000),
      username: currentUser ? currentUser.username : "unknown",
      company: document.getElementById("job-company").value || "",
      assignedBy: document.getElementById("job-assigned-by").value || "",
      contact: document.getElementById("job-contact").value || "",
      pickupProvince: document.getElementById("job-pickup-province").value || "",
      pickupDistrict: document.getElementById("job-pickup-district").value || "",
    };

    // รายละเอียดงาน (แบบโครงสร้างสำหรับใช้ในแอป)
    const jobDetails = [];
    const jobDetailCards = document.querySelectorAll(".job-detail-card");
    jobDetailCards.forEach((card, index) => {
      const inputs = card.querySelectorAll("input, textarea");
      jobDetails.push({
        destinationCompany: inputs[0] ? inputs[0].value : "",
        deliveryProvince: inputs[1] ? inputs[1].value : "",
        deliveryDistrict: inputs[2] ? inputs[2].value : "",
        recipient: inputs[3] ? inputs[3].value : "",
        description: inputs[4] ? inputs[4].value : "",
        amount: inputs[5] ? parseFloat(inputs[5].value) || 0 : 0,
      });
    });

    // ค่าบริการเพิ่มเติม (แบบโครงสร้างสำหรับใช้ในแอป)
    const additionalFees = [];
    const feeItems = document.querySelectorAll(
      "#additional-fees-container > div"
    );
    feeItems.forEach((item) => {
      const select = item.querySelector("select");
      const input = item.querySelector("input");
      if (select && input) {
        additionalFees.push({
          description: select.value,
          amount: parseFloat(input.value) || 0,
        });
      }
    });

    // รวมยอดเงิน
    const mainServiceFee = jobDetails.reduce(
      (sum, j) => sum + (parseFloat(j.amount) || 0),
      0
    );
    const additionalFeesTotal = additionalFees.reduce(
      (sum, f) => sum + (parseFloat(f.amount) || 0),
      0
    );
    const totalAmount = mainServiceFee + additionalFeesTotal;

    // แปลงเป็นรูปแบบแนวนอน flat สูงสุด 5 งาน และ 10 ค่าบริการเพิ่มเติม (ปรับได้ตามต้องการ)
    const flat = {};
    jobDetails.forEach((d, i) => {
      const idx = i + 1;
      flat["companyTo" + idx] = d.destinationCompany || "";
      flat["province" + idx] = d.deliveryProvince || "";
      flat["district" + idx] = d.deliveryDistrict || "";
      flat["recipient" + idx] = d.recipient || "";
      flat["detail" + idx] = d.description || "";
      flat["amount" + idx] = parseFloat(d.amount) || 0;
    });
    flat.jobCount = jobDetails.length;

    additionalFees.forEach((f, i) => {
      const idx = i + 1;
      flat["feeName" + idx] = f.description || "";
      flat["feeAmount" + idx] = parseFloat(f.amount) || 0;
    });
    flat.feeCount = additionalFees.length;

    // ส่งออกทั้งแบบโครงสร้าง (เพื่อให้แอปยังแสดงผลได้) และแบบแนวนอน (เพื่อบันทึกลงชีตหนึ่งแถว/งาน)
    return {
      ...base,
      // โครงสร้างเดิมสำหรับหน้าประวัติและดูรายละเอียด
      jobDetails: JSON.stringify(jobDetails),
      additionalFees: JSON.stringify(additionalFees),
      // ตัวเลขสรุป
      mainServiceFee,
      additionalFeesTotal,
      totalAmount,
      // ฟิลด์แบบแบนแนวนอน
      ...flat,
    };
  } catch (error) {
    console.error("Error collecting form data:", error);
    throw new Error(`Failed to collect form data: ${error.message}`);
  }
}

// Parse Thai date format DD/MM/YYYY to Date object
function parseThaiDate(thaiDateStr) {
  if (!thaiDateStr || !thaiDateStr.includes("/")) {
    return new Date();
  }

  const parts = thaiDateStr.split("/");
  if (parts.length !== 3) {
    return new Date();
  }

  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1; // Month is 0-indexed
  const thaiYear = parseInt(parts[2]);
  const gregorianYear = thaiYear - 543;

  return new Date(gregorianYear, month, day);
}

// Reset form
function resetForm() {
  const form = document.getElementById("job-form");
  if (form) form.reset();
  const editJobId = document.getElementById("edit-job-id");
  if (editJobId) editJobId.value = "";

  // Reset job date picker to today only if not editing
  const jobDatePicker = document.getElementById("job-date-picker");
  if (jobDatePicker && !editJobId.value) {
    jobDatePicker.value = formatDate(new Date());
    jobDatePicker.removeAttribute("data-original-date");
  }

  // Clear additional job details and fees
  const jobDetailsContainer = document.getElementById("job-details-container");
  const additionalFeesContainer = document.getElementById(
    "additional-fees-container"
  );

  if (jobDetailsContainer) {
    // Reset to single job detail
    jobDetailsContainer.innerHTML = `
            <div class="job-detail-card border border-gray-200 rounded-md p-3 mb-3">
                <div class="mb-2">
                    <label class="block text-gray-600 mb-1">บริษัทปลายทาง</label>
                    <input type="text" id="job-company-to-1" class="w-full p-3 border border-gray-300 rounded-md touch-target" placeholder="ชื่อบริษัทปลายทาง" required>
                </div>
                <div class="mb-2">
                    <label class="block text-gray-600 mb-1">จังหวัดส่งของ</label>
                    <input type="text" id="job-province-1" class="w-full p-3 border border-gray-300 rounded-md touch-target" placeholder="จังหวัดส่งของ" required>
                </div>
                <div class="mb-2">
                    <label class="block text-gray-600 mb-1">เขต/อำเภอส่งของ</label>
                    <input type="text" id="job-district-1" class="w-full p-3 border border-gray-300 rounded-md touch-target" placeholder="เขต/อำเภอส่งของ" required>
                </div>
                <div class="mb-2">
                    <label class="block text-gray-600 mb-1">ผู้รับงาน</label>
                    <input type="text" id="job-recipient-1" class="w-full p-3 border border-gray-300 rounded-md touch-target" placeholder="ชื่อผู้รับงาน" required>
                </div>
                <div class="mb-2">
                    <label class="block text-gray-600 mb-1">รายละเอียด</label>
                    <textarea id="job-detail-1" class="w-full p-3 border border-gray-300 rounded-md touch-target" placeholder="รายละเอียดงาน" rows="2" required></textarea>
                </div>
                <div>
                    <label class="block text-gray-600 mb-1">จำนวนเงิน (บาท)</label>
                    <input type="number" id="job-amount-1" class="w-full p-3 border border-gray-300 rounded-md amount-input touch-target" placeholder="0.00" min="0" step="0.01" value="0" required>
                </div>
            </div>
        `;
  }

  // Clear additional fees
  if (additionalFeesContainer) additionalFeesContainer.innerHTML = "";

  // Re-add event listeners
  const amountInputs = document.querySelectorAll(".amount-input");
  amountInputs.forEach((input) => {
    input.addEventListener("input", updateTotalAmount);
  });
  updateTotalAmount();

  // Log for debugging
  console.log(
    "Form reset completed. Edit job ID cleared:",
    document.getElementById("edit-job-id").value
  );
}

// Form submission
const jobForm = document.getElementById("job-form");
if (jobForm) {
  jobForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Check if form is valid
    const form = document.getElementById("job-form");
    const isValid = form.checkValidity();

    if (isValid) {
      // Show loading alert
      Swal.fire({
        title: "กำลังบันทึกข้อมูล...",
        text: "กรุณารอสักครู่",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const formData = collectFormData();
        const response = await saveJob(formData, false);

        // Show success message
        await Swal.fire({
          icon: "success",
          title: "บันทึกสำเร็จ!",
          text: `งาน ${formData.jobId} ถูกบันทึกเรียบร้อยแล้ว`,
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#10b981",
        });

        // Update stats
        updateStats();

        // Reset form
        resetForm();

        // Go back to home screen
        showScreen("home-screen");
      } catch (error) {
        console.error("Error submitting form:", error);

        // Show error message
        await Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด!",
          text: error.message,
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#ef4444",
        });
      }
    } else {
      // If form is not valid, show incomplete job notification
      const result = await Swal.fire({
        icon: "warning",
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณาตรวจสอบข้อมูลที่กรอก ต้องการบันทึกงานแบบไม่สมบูรณ์หรือไม่?",
        showCancelButton: true,
        confirmButtonText: "บันทึกแบบไม่สมบูรณ์",
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: "#f97316",
        cancelButtonColor: "#6b7280",
      });

      if (result.isConfirmed) {
        // Show loading alert
        Swal.fire({
          title: "กำลังบันทึกข้อมูล...",
          text: "กรุณารอสักครู่",
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        try {
          const formData = collectFormData();
          formData.status = "incomplete";
          formData.incompleteReason = "ข้อมูลไม่ครบถ้วน";

          const response = await saveJob(formData, false);

          // Show success message
          await Swal.fire({
            icon: "warning",
            title: "บันทึกแบบไม่สมบูรณ์",
            text: `งาน ${formData.jobId} ถูกบันทึกแล้ว แต่ข้อมูลไม่สมบูรณ์`,
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#f97316",
          });

          // Update stats and show incomplete job card
          updateStats();

          const incompleteJobs = [
            { id: formData.jobId, reason: "ข้อมูลไม่ครบถ้วน" },
          ];

          const incompleteCard = document.getElementById(
            "incomplete-jobs-card"
          );
          const incompleteList = document.getElementById(
            "incomplete-jobs-list"
          );

          incompleteCard.classList.remove("hidden");
          incompleteList.innerHTML = "";

          incompleteJobs.forEach((job) => {
            const li = document.createElement("li");
            li.textContent = `${job.id}: ${job.reason}`;
            li.className = "cursor-pointer hover:text-indigo-600";
            li.onclick = function () {
              editJob(job.id);
            };
            incompleteList.appendChild(li);
          });

          // Reset form
          resetForm();

          // Go back to home screen
          showScreen("home-screen");
        } catch (error) {
          console.error("Error submitting incomplete form:", error);

          // Show error message
          await Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด!",
            text: error.message,
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#ef4444",
          });
        }
      }
    }
  });
}

// Filter jobs by status
const statusFilters = document.querySelectorAll(".status-filter");
if (statusFilters) {
  statusFilters.forEach((button) => {
    button.addEventListener("click", function () {
      // Update active filter button
      document.querySelectorAll(".status-filter").forEach((btn) => {
        btn.classList.remove("active");
        btn.classList.remove("bg-blue-100");
        btn.classList.remove("border-blue-300");
        btn.classList.add("bg-white");
        btn.classList.add("border-gray-300");
      });

      this.classList.add("active");
      this.classList.add("bg-blue-100");
      this.classList.add("border-blue-300");

      // Filter jobs
      const status = this.getAttribute("data-status");
      const jobItems = document.querySelectorAll(".job-item");

      jobItems.forEach((item) => {
        if (status === "all" || item.getAttribute("data-status") === status) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
}

// Display job history
async function displayJobHistory() {
  // Show loading
  Swal.fire({
    title: "กำลังโหลดประวัติงาน...",
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const savedJobs = await loadJobsFromSheets();
    console.log("Loaded saved jobs:", savedJobs);

    const container = document.getElementById("job-history-container");
    const noJobsMessage = document.getElementById("no-jobs-message");

    if (container && noJobsMessage) {
      if (savedJobs.length === 0) {
        noJobsMessage.style.display = "block";
        Swal.close();
        return;
      }

      noJobsMessage.style.display = "none";

      // Sort jobs by timestamp (newest first)
      savedJobs.sort(
        (a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0)
      );

      // Filter jobs to the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentJobs = savedJobs.filter(
        (job) => new Date(job.timestamp) >= thirtyDaysAgo
      );

      // Clear existing job items (except no-jobs-message)
      const existingJobs = container.querySelectorAll(".job-item");
      existingJobs.forEach((job) => job.remove());

      if (recentJobs.length === 0) {
        noJobsMessage.style.display = "block";
        noJobsMessage.querySelector("p:first-of-type").textContent =
          "ไม่พบประวัติงานใน 30 วันล่าสุด";
        Swal.close();
        return;
      }

      recentJobs.forEach((job) => {
        const jobElement = createJobHistoryItem(job);
        container.insertBefore(jobElement, noJobsMessage);
      });

      // Add event delegation for edit and view buttons
      container.addEventListener("click", function (e) {
        console.log("Container click event:", e.target);

        if (e.target.closest('[data-action="edit"]')) {
          const editButton = e.target.closest('[data-action="edit"]');
          const jobId = editButton.getAttribute("data-job-id");
          console.log("Edit button clicked for job:", jobId);
          console.log("Edit button element:", editButton);
          editJob(jobId);
        }
      });
    }

    Swal.close();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด",
      text: error.message,
      confirmButtonText: "ตกลง",
      confirmButtonColor: "#ef4444",
    });
  }
}

function createJobHistoryItem(job) {
  console.log("Creating job history item for job:", job);

  const jobElement = document.createElement("div");
  jobElement.className = "card bg-white p-4 mb-4 job-item";
  jobElement.setAttribute("data-status", job.status || "complete");

  const statusBadge = getStatusBadge(job.status);
  const jobDate = formatThaiDate(job.timestamp);

  jobElement.innerHTML = `
        <div class="flex justify-between items-start mb-1">
            <h3 class="font-medium">${job.jobId}</h3>
            <span class="px-2 py-1 text-xs rounded-full ${statusBadge.class}">${statusBadge.text}</span>
        </div>
        <div class="text-sm text-gray-600 mb-2">
            <p>วันที่: ${jobDate}</p>
            <p>บริษัท: ${job.company || "ไม่ระบุ"}</p>
            <p>ผู้ติดต่อ: ${job.assignedBy || "ไม่ระบุ"}</p>
            <p>จำนวน: ${job.totalAmount ? job.totalAmount.toFixed(2) : "0.00"} บาท</p>
        </div>
        ${
          job.status === "incomplete"
            ? `
            <div class="bg-red-50 border-l-4 border-red-500 p-2 text-sm text-red-700 mb-2">
                <p>เหตุผลไม่สมบูรณ์: ${job.incompleteReason || "ข้อมูลไม่ครบถ้วน"}</p>
            </div>
        `
            : ""
        }
        ${
          job.status === "draft"
            ? `
            <div class="bg-amber-50 border-l-4 border-amber-500 p-2 text-sm text-amber-700 mb-2">
                <p>สถานะ: บันทึกเป็นร่าง</p>
            </div>
        `
            : ""
        }
        <div class="flex space-x-2">
          ${
            job.status === "complete"
              ? `
                <button class="text-sm text-indigo-600 font-medium flex items-center touch-target" data-action="edit" data-job-id="${job.jobId}">
                    แก้ไขงาน
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
            `
              : `
                <button class="text-sm text-indigo-600 font-medium flex items-center touch-target" data-action="edit" data-job-id="${job.jobId}">
                    ${job.status === "draft" ? "แก้ไขร่าง" : "แก้ไขงาน"}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
            `
          }
        </div>
    `;

  console.log("Created job element HTML:", jobElement.innerHTML);
  console.log("Job element:", jobElement);

  // Verify data attributes are set correctly
  const editButton = jobElement.querySelector('[data-action="edit"]');
  const viewButton = jobElement.querySelector('[data-action="view"]');
  if (editButton) {
    console.log(
      "Edit button data-job-id:",
      editButton.getAttribute("data-job-id")
    );
  }
  if (viewButton) {
    console.log(
      "View button data-job-id:",
      viewButton.getAttribute("data-job-id")
    );
  }

  return jobElement;
}

function getStatusBadge(status) {
  switch (status) {
    case "incomplete":
      return { class: "incomplete-badge", text: "ไม่สมบูรณ์" };
    case "draft":
      return { class: "draft-badge", text: "ร่าง" };
    default:
      return { class: "complete-badge", text: "สมบูรณ์" };
  }
}

// Filter by single date
const filterDateBtn = document.getElementById("filter-date-btn");
if (filterDateBtn) {
  filterDateBtn.addEventListener("click", function () {
    const selectedDate = new Date(
      document.getElementById("selected-date").value
    );

    // Create date range for the selected day (start of day to end of day)
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Filter jobs by the selected date
    const jobItems = document.querySelectorAll(".job-item");
    let hasVisibleJobs = false;

    jobItems.forEach((item) => {
      const jobDateText = item.querySelector(
        ".text-sm.text-gray-600 p:first-child"
      ).textContent;
      const jobDateStr = jobDateText.replace("วันที่: ", "");

      // Parse Thai date format back to compare
      const parts = jobDateStr.split("/");
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const monthMap = {
          "ม.ค.": 0,
          "ก.พ.": 1,
          "มี.ค.": 2,
          "เม.ย.": 3,
          "พ.ค.": 4,
          "มิ.ย.": 5,
          "ก.ค.": 6,
          "ส.ค.": 7,
          "ก.ย.": 8,
          "ต.ค.": 9,
          "พ.ย.": 10,
          "ธ.ค.": 11,
        };
        const month = monthMap[parts[1]];
        const year = parseInt(parts[2]) - 543; // Convert from Buddhist to Gregorian

        const jobDate = new Date(year, month, day);

        if (jobDate >= startOfDay && jobDate <= endOfDay) {
          // Check if it also matches the current status filter
          const currentStatusFilter = document
            .querySelector(".status-filter.active")
            .getAttribute("data-status");
          if (
            currentStatusFilter === "all" ||
            item.getAttribute("data-status") === currentStatusFilter
          ) {
            item.style.display = "block";
            hasVisibleJobs = true;
          } else {
            item.style.display = "none";
          }
        } else {
          item.style.display = "none";
        }
      }
    });

    // Show/hide no jobs message
    const noJobsMessage = document.getElementById("no-jobs-message");
    if (noJobsMessage) {
      if (hasVisibleJobs) {
        noJobsMessage.style.display = "none";
      } else {
        noJobsMessage.style.display = "block";
        noJobsMessage.querySelector("p:first-of-type").textContent =
          "ไม่พบงานในวันที่เลือก";
      }
    }

    // Update the header text
    const historyScreen = document.querySelector(
      "#history-screen p.text-xs.text-gray-500"
    );
    if (historyScreen) {
      const formattedDate = formatThaiDate(selectedDate.toISOString());
      historyScreen.textContent = `แสดงข้อมูลวันที่ ${formattedDate}`;
    }
  });
}

// Start new job with clean form
function startNewJob() {
  // Set mode to create
  const modeElement = document.getElementById("job-mode");
  if (modeElement) modeElement.value = "create";

  // Clear any existing edit state
  const editJobId = document.getElementById("edit-job-id");
  if (editJobId) editJobId.value = "";

  // Update UI for create mode
  const titleElement = document.getElementById("job-screen-title");
  if (titleElement) titleElement.textContent = "บันทึกงานใหม่";

  const submitBtn = document.getElementById("job-submit-btn");
  if (submitBtn) submitBtn.textContent = "บันทึกงาน";

  // Reset form to clean state
  resetForm();

  // Navigate to job screen
  showScreen("job-screen");
}

// Cancel edit and clear form
function cancelEdit() {
  // Explicitly turn off edit mode first.
  const editJobId = document.getElementById("edit-job-id");
  if (editJobId) editJobId.value = "";

  // Then, completely reset the form to its default, empty state.
  resetForm();

  // Finally, navigate back to the home screen.
  showScreen("home-screen");
}

// Edit job
async function editJob(jobId) {
  try {
    if (!jobId) {
      throw new Error("Job ID is required");
    }

    console.log("editJob called with jobId:", jobId);

    // Show loading animation immediately
    showLoadingAnimation("กำลังโหลดข้อมูลงาน...");

    // Try to get job data from backend first
    let job = null;
    try {
      const response = await submitToGoogleSheets({
        action: "getJobById",
        jobId: jobId,
        username: currentUser.username,
      });

      if (response && response.success && response.job) {
        job = response.job;
      }
    } catch (error) {
      console.warn("Failed to get job from backend, trying localStorage:", error);
    }

    // If not found in backend, try localStorage
    if (!job) {
      const savedJobs = await loadJobsFromSheets();
      job = savedJobs.find((j) => j.jobId === jobId);
    }

    console.log("Found job:", job);

    if (!job) {
      console.error("Job not found for ID:", jobId);
      hideLoadingAnimation();
      Swal.fire({
        icon: "error",
        title: "ไม่พบงาน",
        text: "ไม่สามารถหางานที่ต้องการแก้ไขได้",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    // Clear form first to ensure clean state
    resetForm();

    // Set mode to edit
    const modeElement = document.getElementById("job-mode");
    if (modeElement) modeElement.value = "edit";

    // Update UI for edit mode
    const titleElement = document.getElementById("job-screen-title");
    if (titleElement) titleElement.textContent = "แก้ไขงาน";

    const submitBtn = document.getElementById("job-submit-btn");
    if (submitBtn) submitBtn.textContent = "บันทึกการแก้ไข";

    // Populate form with job data
    populateFormWithJobData(job);
    showScreen("job-screen");

    // Hide loading animation after a short delay to ensure UI updates
    setTimeout(() => {
      hideLoadingAnimation();
    }, 500);
  } catch (error) {
    console.error("Error editing job:", error);
    hideLoadingAnimation();
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด",
      text: `ไม่สามารถแก้ไขงานได้: ${error.message}`,
      confirmButtonText: "ตกลง",
      confirmButtonColor: "#ef4444",
    });
  }
}

function populateFormWithJobData(job) {
  try {
    if (!job || typeof job !== "object") {
      throw new Error("Invalid job data provided");
    }

    // --- FIX STARTS HERE ---
    // Reconstruct structured data if it's not present (i.e., loaded from Sheets)
    if (!job.jobDetails && job.jobCount > 0) {
      const reconstructedDetails = [];
      for (let i = 1; i <= job.jobCount; i++) {
        reconstructedDetails.push({
          destinationCompany: job["companyTo" + i] || "",
          deliveryProvince: job["province" + i] || "",
          deliveryDistrict: job["district" + i] || "",
          recipient: job["recipient" + i] || "",
          description: job["detail" + i] || "",
          amount: parseFloat(job["amount" + i]) || 0,
        });
      }
      job.jobDetails = JSON.stringify(reconstructedDetails);
    }

    if (!job.additionalFees && job.feeCount > 0) {
      const reconstructedFees = [];
      for (let i = 1; i <= job.feeCount; i++) {
        reconstructedFees.push({
          description: job["feeName" + i] || "",
          amount: parseFloat(job["feeAmount" + i]) || 0,
        });
      }
      job.additionalFees = JSON.stringify(reconstructedFees);
    }
    // --- FIX ENDS HERE ---

    const form = document.getElementById("job-form");
    if (!form) return;

    // Set the edit job ID to preserve the existing job
    document.getElementById("edit-job-id").value = job.jobId;

    // Log for debugging
    console.log("Editing job:", job.jobId, "with data:", job);

    // Basic information
    if (job.company) {
      const companySelect = document.getElementById("job-company");
      if (companySelect) companySelect.value = job.company;
    }

    if (job.assignedBy) {
      const assignedBy = document.getElementById("job-assigned-by");
      if (assignedBy) assignedBy.value = job.assignedBy;
    }

    if (job.contact) {
      const contact = document.getElementById("job-contact");
      if (contact) contact.value = job.contact;
    }

    if (job.pickupProvince) {
      const pickupProvince = document.getElementById("job-pickup-province");
      if (pickupProvince) pickupProvince.value = job.pickupProvince;
    }

    if (job.pickupDistrict) {
      const pickupDistrict = document.getElementById("job-pickup-district");
      if (pickupDistrict) pickupDistrict.value = job.pickupDistrict;
    }

    // Set job date - convert from Thai format to date picker format
    if (job.jobDate) {
      const parsedDate = parseThaiDate(job.jobDate);
      const jobDatePicker = document.getElementById("job-date-picker");
      const originalDateField = document.getElementById("original-job-date");
      if (jobDatePicker) {
        // For editing, preserve the original job date
        jobDatePicker.value = formatDate(parsedDate);
        // Store the original date in a hidden field
        if (originalDateField) {
          originalDateField.value = job.jobDate;
        }
        // Visually indicate that date cannot be changed
        // Allow editing the date even when editing a job
        jobDatePicker.removeAttribute("title");
        // Remove visual indicator if exists
        const dateContainer = jobDatePicker.closest(".mb-3");
        if (dateContainer) {
          let indicator = dateContainer.querySelector(".date-edit-indicator");
          if (indicator) {
            dateContainer.removeChild(indicator);
          }
        }
      }
    }

    // Job details
    const container = document.getElementById("job-details-container");
    if (!container) return;

    // Clear existing job details
    container.innerHTML = "";

    // Initialize jobDetails variable at function level
    let jobDetails = [];

    if (job.jobDetails) {
      try {
        jobDetails = JSON.parse(job.jobDetails);
        console.log("Parsed job details:", jobDetails);
      } catch (error) {
        console.error("Error parsing job details:", error);
        jobDetails = [];
      }

      jobDetails.forEach((detail, index) => {
        if (index === 0) {
          // Use the first job detail card
          const firstCard = document.createElement("div");
          firstCard.className =
            "job-detail-card border border-gray-200 rounded-md p-3 mb-3";
          firstCard.innerHTML = `
                        <div class="mb-2">
                            <label class="block text-gray-600 mb-1">บริษัทปลายทาง</label>
                            <input type="text" class="w-full p-3 border border-gray-300 rounded-md touch-target job-company-to" placeholder="ชื่อบริษัทปลายทาง" value="${detail.destinationCompany || ""}" required>
                        </div>
                        <div class="mb-2">
                            <label class="block text-gray-600 mb-1">จังหวัดส่งของ</label>
                            <input type="text" class="w-full p-3 border border-gray-300 rounded-md touch-target job-province" placeholder="จังหวัดส่งของ" value="${detail.deliveryProvince || detail.deliveryLocation || ""}" required>
                        </div>
                        <div class="mb-2">
                            <label class="block text-gray-600 mb-1">เขต/อำเภอส่งของ</label>
                            <input type="text" class="w-full p-3 border border-gray-300 rounded-md touch-target job-district" placeholder="เขต/อำเภอส่งของ" value="${detail.deliveryDistrict || ""}" required>
                        </div>
                        <div class="mb-2">
                            <label class="block text-gray-600 mb-1">ผู้รับงาน</label>
                            <input type="text" class="w-full p-3 border border-gray-300 rounded-md touch-target job-recipient" placeholder="ชื่อผู้รับงาน" value="${detail.recipient || ""}" required>
                        </div>
                        <div class="mb-2">
                            <label class="block text-gray-600 mb-1">รายละเอียด</label>
                            <textarea class="w-full p-3 border border-gray-300 rounded-md touch-target job-detail" placeholder="รายละเอียดงาน" rows="2" required>${detail.description || ""}</textarea>
                        </div>
                        <div>
                            <label class="block text-gray-600 mb-1">จำนวนเงิน (บาท)</label>
                            <input type="number" class="w-full p-3 border border-gray-300 rounded-md amount-input touch-target job-amount" placeholder="0.00" min="0" step="0.01" value="${detail.amount || 0}" required>
                        </div>
                    `;
          container.appendChild(firstCard);

          // Add event listener to amount input
          firstCard
            .querySelector(".amount-input")
            .addEventListener("input", updateTotalAmount);
        } else {
          // Add additional job detail cards
          const addJobDetailBtn = document.getElementById("add-job-detail");
          if (addJobDetailBtn) addJobDetailBtn.click();
          const newCard = container.lastElementChild;
          const inputs = newCard.querySelectorAll(
            ".job-company-to, .job-province, .job-district, .job-recipient, .job-detail, .job-amount"
          );
          if (inputs[0]) inputs[0].value = detail.destinationCompany || "";
          if (inputs[1])
            inputs[1].value =
              detail.deliveryProvince || detail.deliveryLocation || "";
          if (inputs[2]) inputs[2].value = detail.deliveryDistrict || "";
          if (inputs[3]) inputs[3].value = detail.recipient || "";
          if (inputs[4]) inputs[4].value = detail.description || "";
          if (inputs[5]) inputs[5].value = detail.amount || 0;
        }
      });
    } else {
      // If no job details exist, create a default empty card
      const defaultCard = document.createElement("div");
      defaultCard.className =
        "job-detail-card border border-gray-200 rounded-md p-3 mb-3";
      defaultCard.innerHTML = `
                <div class="mb-2">
                    <label class="block text-gray-600 mb-1">บริษัทปลายทาง</label>
                    <input type="text" id="job-company-to-1" class="w-full p-3 border border-gray-300 rounded-md touch-target" placeholder="ชื่อบริษัทปลายทาง" required>
                </div>
                <div class="mb-2">
                    <label class="block text-gray-600 mb-1">จังหวัดส่งของ</label>
                    <input type="text" id="job-province-1" class="w-full p-3 border border-gray-300 rounded-md touch-target" placeholder="จังหวัดส่งของ" required>
                </div>
                <div class="mb-2">
                    <label class="block text-gray-600 mb-1">เขต/อำเภอส่งของ</label>
                    <input type="text" id="job-district-1" class="w-full p-3 border border-gray-300 rounded-md touch-target" placeholder="เขต/อำเภอส่งของ" required>
                </div>
                <div class="mb-2">
                    <label class="block text-gray-600 mb-1">ผู้รับงาน</label>
                    <input type="text" id="job-recipient-1" class="w-full p-3 border border-gray-300 rounded-md touch-target" placeholder="ชื่อผู้รับงาน" required>
                </div>
                <div class="mb-2">
                    <label class="block text-gray-600 mb-1">รายละเอียด</label>
                    <textarea id="job-detail-1" class="w-full p-3 border border-gray-300 rounded-md touch-target" placeholder="รายละเอียดงาน" rows="2" required></textarea>
                </div>
                <div>
                    <label class="block text-gray-600 mb-1">จำนวนเงิน (บาท)</label>
                    <input type="number" id="job-amount-1" class="w-full p-3 border border-gray-300 rounded-md amount-input touch-target" placeholder="0.00" min="0" step="0.01" value="0" required>
                </div>
            `;
      container.appendChild(defaultCard);

      // Add event listener to amount input
      defaultCard
        .querySelector(".amount-input")
        .addEventListener("input", updateTotalAmount);
    }

    // Additional fees
    const additionalFeesContainer = document.getElementById(
      "additional-fees-container"
    );
    if (additionalFeesContainer) additionalFeesContainer.innerHTML = ""; // Clear existing fees

    if (job.additionalFees) {
      let additionalFees = [];
      try {
        additionalFees = JSON.parse(job.additionalFees);
        console.log("Parsed additional fees:", additionalFees);
      } catch (error) {
        console.error("Error parsing additional fees:", error);
        additionalFees = [];
      }

      additionalFees.forEach((fee) => {
        const addFeeBtn = document.getElementById("add-fee");
        if (addFeeBtn) addFeeBtn.click();
        const newFee = additionalFeesContainer.lastElementChild;
        const select = newFee.querySelector("select");
        const input = newFee.querySelector("input");
        if (select && input) {
          select.value = fee.description || "";
          input.value = fee.amount || 0;
        }
      });
    }

    // Update totals and ensure Main Service Fee is displayed
    updateTotalAmount();

    // Also update the Main Service Fee display field if it exists
    const mainServiceFeeElement = document.getElementById("main-service-fee");
    if (mainServiceFeeElement) {
      console.log("Calculating total from jobDetails:", jobDetails);
      const totalAmount = jobDetails.reduce(
        (sum, detail) => sum + (parseFloat(detail.amount) || 0),
        0
      );
      console.log("Calculated total amount:", totalAmount);
      mainServiceFeeElement.textContent = totalAmount.toFixed(2) + " บาท";
    }

    // Log the final state for debugging
    console.log(
      "Form populated with job data. Main Service Fee:",
      mainServiceFeeElement ? mainServiceFeeElement.textContent : "N/A"
    );

    // Ensure totals are updated after a brief delay to allow DOM to settle
    setTimeout(() => {
      updateTotalAmount();
      console.log("Final totals update completed");
    }, 100);
  } catch (error) {
    console.error("Error populating form with job data:", error);
    throw new Error(`Failed to populate form: ${error.message}`);
  }
}

// View job
async function viewJob(jobId) {
  try {
    if (!jobId) {
      throw new Error("Job ID is required");
    }

    const savedJobs = await loadJobsFromSheets();
    const job = savedJobs.find((j) => j.jobId === jobId);

    if (!job) {
      await Swal.fire({
        icon: "error",
        title: "ไม่พบงาน",
        text: "ไม่สามารถหางานที่ต้องการดูได้",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    const jobDetails = job.jobDetails ? JSON.parse(job.jobDetails) : [];
    const additionalFees = job.additionalFees
      ? JSON.parse(job.additionalFees)
      : [];

    let jobDetailsHtml = "";
    jobDetails.forEach((detail, index) => {
      jobDetailsHtml += `
                <div class="mb-3 p-3 bg-gray-50 rounded border">
                    <h4 class="font-medium text-blue-600 mb-2">งาน #${index + 1}</h4>
                    <div class="grid grid-cols-1 gap-1 text-sm">
                        <p><strong>บริษัทปลายทาง:</strong> ${detail.destinationCompany || "ไม่ระบุ"}</p>
                        <p><strong>จังหวัดส่งของ:</strong> ${detail.deliveryProvince || detail.deliveryLocation || "ไม่ระบุ"}</p>
                        <p><strong>เขต/อำเภอส่งของ:</strong> ${detail.deliveryDistrict || "ไม่ระบุ"}</p>
                        <p><strong>ผู้รับงาน:</strong> ${detail.recipient || "ไม่ระบุ"}</p>
                        <p><strong>รายละเอียด:</strong> ${detail.description || "ไม่ระบุ"}</p>
                        <p><strong>จำนวนเงิน:</strong> ${detail.amount ? detail.amount.toFixed(2) : "0.00"} บาท</p>
                    </div>
                </div>
            `;
    });

    let additionalFeesHtml = "";
    if (additionalFees.length > 0) {
      additionalFeesHtml =
        '<h4 class="font-medium mt-4 mb-2 text-green-600">ค่าบริการเพิ่มเติม:</h4>';
      additionalFees.forEach((fee, index) => {
        additionalFeesHtml += `
                    <div class="mb-2 p-2 bg-green-50 rounded border border-green-200">
                        <div class="text-sm">
                            <p><strong>รายการ #${index + 1}:</strong> ${fee.description}</p>
                            <p><strong>จำนวนเงิน:</strong> ${fee.amount ? fee.amount.toFixed(2) : "0.00"} บาท</p>
                        </div>
                    </div>
                `;
      });
    }

    await Swal.fire({
      title: `รายละเอียดงาน ${job.jobId}`,
      html: `
                <div class="text-left">
                    <div class="mb-4">
                        <p><strong>วันที่:</strong> ${formatThaiDate(job.timestamp)}</p>
                        <p><strong>บริษัท:</strong> ${job.company || "ไม่ระบุ"}</p>
                        <p><strong>ผู้มอบงาน:</strong> ${job.assignedBy || "ไม่ระบุ"}</p>
                        <p><strong>ติดต่อ:</strong> ${job.contact || "ไม่ระบุ"}</p>
                        <p><strong>จังหวัดรับของ:</strong> ${job.pickupProvince || "ไม่ระบุ"}</p>
                        <p><strong>เขต/อำเภอรับของ:</strong> ${job.pickupDistrict || "ไม่ระบุ"}</p>
                    </div>
                    
                    <h4 class="font-medium mb-2">รายละเอียดงาน:</h4>
                    ${jobDetailsHtml}
                    
                    ${additionalFeesHtml}
                    
                    <div class="mt-4 pt-3 border-t">
                        <div class="flex justify-between font-bold">
                            <span>รวมทั้งหมด:</span>
                            <span>${job.totalAmount ? job.totalAmount.toFixed(2) : "0.00"} บาท</span>
                        </div>
                    </div>
                </div>
            `,
      confirmButtonText: "ปิด",
      confirmButtonColor: "#3b82f6",
      width: "90%",
    });
  } catch (error) {
    console.error("Error viewing job:", error);
    await Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด",
      text: `ไม่สามารถดูรายละเอียดงานได้: ${error.message}`,
      confirmButtonText: "ตกลง",
      confirmButtonColor: "#ef4444",
    });
  }
}

// Update statistics
async function updateStats() {
  try {
    const savedJobs = await loadJobsFromSheets();
    const today = new Date();
    const todayStr = today.toDateString();

    // Jobs today
    const jobsToday = savedJobs.filter((job) => {
      const jobDate = new Date(job.timestamp);
      return jobDate.toDateString() === todayStr;
    }).length;

    // Completed jobs today
    const completedToday = savedJobs.filter((job) => {
      const jobDate = new Date(job.timestamp);
      return jobDate.toDateString() === todayStr && job.status === "complete";
    }).length;

    // Monthly jobs
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const monthlyJobs = savedJobs.filter((job) => {
      const jobDate = new Date(job.timestamp);
      return (
        jobDate.getMonth() === currentMonth &&
        jobDate.getFullYear() === currentYear
      );
    }).length;

    // Total jobs
    const totalJobs = savedJobs.length;

    // Update display
    const jobsTodayEl = document.getElementById("jobs-today");
    if (jobsTodayEl) jobsTodayEl.textContent = jobsToday;
    const completedTodayEl = document.getElementById("completed-today");
    if (completedTodayEl) completedTodayEl.textContent = completedToday;
    const monthlyJobsEl = document.getElementById("monthly-jobs");
    if (monthlyJobsEl) monthlyJobsEl.textContent = monthlyJobs + " งาน";
    const totalJobsEl = document.getElementById("total-jobs");
    if (totalJobsEl) totalJobsEl.textContent = totalJobs + " งาน";

    // Update current month display
    const currentMonthEl = document.getElementById("current-month");
    if (currentMonthEl) {
      const thaiMonths = [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
      ];
      const thaiYear = today.getFullYear() + 543;
      currentMonthEl.textContent = `${thaiMonths[currentMonth]} ${thaiYear}`;
    }
  } catch (error) {
    console.error("Error updating stats:", error);
    // Don't throw error to prevent breaking the UI
  }
}

// Save job to localStorage and Google Sheets
function saveJob(jobData, isDraft = false) {
  try {
    if (!jobData || typeof jobData !== "object") {
      throw new Error("Invalid job data provided");
    }

    // Save to localStorage first
    let savedJobs = JSON.parse(safeLocalStorageGetItem("mangpongJobs") || "[]");

    // Check if editing existing job
    const editJobIdElement = document.getElementById("edit-job-id");
    if (!editJobIdElement) {
      throw new Error("Edit job ID element not found");
    }
    const editingJobId = editJobIdElement.value;

    if (editingJobId) {
      // Update existing job
      const jobIndex = savedJobs.findIndex((job) => job.jobId === editingJobId);
      if (jobIndex !== -1) {
        // Preserve existing data and merge with new data
        const existingJob = savedJobs[jobIndex];
        savedJobs[jobIndex] = {
          ...existingJob, // Keep all existing fields
          ...jobData, // Override with new form data
          jobId: editingJobId, // Ensure jobId remains the same
          timestamp: existingJob.timestamp, // Preserve original timestamp
          username: existingJob.username, // Preserve original username
        };
        console.log(
          "Updated existing job:",
          editingJobId,
          "with data:",
          savedJobs[jobIndex]
        );
      } else {
        // If not found, add as new (should not happen in normal flow)
        console.warn("Job not found for editing, adding as new:", editingJobId);
        savedJobs.push(jobData);
      }
    } else {
      // Add new job
      savedJobs.push(jobData);
      console.log("Added new job:", jobData.jobId);
    }

    safeLocalStorageSetItem("mangpongJobs", JSON.stringify(savedJobs));

    // Also submit to Google Sheets
    const action = editingJobId ? "updateJob" : "createJob";
    return submitToGoogleSheets({
      action: action,
      ...jobData,
      isDraft: isDraft,
    });
  } catch (error) {
    console.error("Error saving job:", error);
    throw new Error(`Failed to save job: ${error.message}`);
  }
}

// Prevent iOS Safari from aggressively caching AJAX requests
function preventIOSSafariCaching() {
  if (isIOS()) {
    // Add timestamp to all requests to prevent caching
    const originalSubmitToGoogleSheets = submitToGoogleSheets;
    submitToGoogleSheets = function (data) {
      // Add cache busting parameter
      data._ = Date.now();
      return originalSubmitToGoogleSheets(data);
    };
  }
}

// Call this function after DOM loads
document.addEventListener("DOMContentLoaded", function () {
  try {
    const loginScreen = document.getElementById("login-screen");
    if (loginScreen) {
      // Set initial page state
      showPage("login-screen");

      // Check if user is already logged in
      const savedUser = safeLocalStorageGetItem("mangpongUser");
      if (savedUser) {
        try {
          currentUser = JSON.parse(savedUser);
          showPage("app");
          const userDisplayName = document.getElementById("user-display-name");
          if (userDisplayName)
            userDisplayName.textContent =
              currentUser.fullName || currentUser.username || "ผู้ใช้งาน";
          initializeApp();
        } catch (parseError) {
          console.error("Error parsing saved user data:", parseError);
          // Clear invalid user data
          safeLocalStorageRemoveItem("mangpongUser");
        }
      }

      // iOS specific fixes
      if (isIOS()) {
        applyIOSFixes();
        preventIOSSafariCaching();
      }

      // Prevent zoom on iOS when focusing inputs
      const metaViewport = document.querySelector("meta[name=viewport]");
      if (metaViewport) {
        metaViewport.setAttribute(
          "content",
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        );
      }

      // Add fastclick to eliminate 300ms delay on mobile
      document.addEventListener("touchstart", function () {}, {
        passive: true,
      });
    } else {
      console.warn("Login screen element not found");
    }
  } catch (error) {
    console.error("Error during DOMContentLoaded:", error);
    // Even if there's an error, try to show the login screen
    const loginScreen = document.getElementById("login-screen");
    if (loginScreen) {
      showPage("login-screen");
    }
  }
});

// Function to detect iOS devices
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// Apply iOS specific fixes
function applyIOSFixes() {
  console.log("Applying iOS specific fixes");

  // Fix for 100vh issue on mobile Safari
  function fixViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  // Initial fix
  fixViewportHeight();

  // Fix on resize/orientation change
  window.addEventListener("resize", fixViewportHeight);
  window.addEventListener("orientationchange", fixViewportHeight);

  // Fix for input field styling
  const inputs = document.querySelectorAll("input, select, textarea");
  inputs.forEach((input) => {
    // Ensure all inputs have proper font size to prevent zoom
    if (!input.style.fontSize || parseInt(input.style.fontSize) < 16) {
      input.style.fontSize = "16px";
    }

    // Fix for rounded corners on iOS
    input.style.webkitAppearance = "none";
    input.style.borderRadius = "8px";
  });

  // Fix for date inputs on iOS
  const dateInputs = document.querySelectorAll('input[type="date"]');
  dateInputs.forEach((input) => {
    // Make date inputs more consistent across browsers
    input.style.webkitAppearance = "none";
    input.addEventListener("focus", function () {
      this.style.position = "relative";
      this.style.zIndex = "9999";
    });

    input.addEventListener("blur", function () {
      this.style.position = "";
      this.style.zIndex = "";
    });
  });
}

// Show loading animation
function showLoadingAnimation(message = "กรุณารอสักครู่...") {
  Swal.fire({
    title: message,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
}

// Hide loading animation
function hideLoadingAnimation() {
  Swal.close();
}

if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then((reg) => {
      console.log("✅ Service Worker registered", reg);
    })
    .catch((err) => {
      console.error("❌ Service Worker registration failed", err);
      // Don't show error to user as this is expected on iOS Safari
    });
}