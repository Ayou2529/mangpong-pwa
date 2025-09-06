// Function to get query parameters from URL
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
}

// Function to load job data when page loads
document.addEventListener("DOMContentLoaded", async function () {
  const params = getQueryParams();
  const jobId = params.jobId;
  
  if (jobId) {
    try {
      // Load job data for editing
      await loadJobForEdit(jobId);
    } catch (error) {
      console.error("Error loading job for edit:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถโหลดข้อมูลงานสำหรับแก้ไขได้",
        confirmButtonText: "ตกลง",
      });
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "ข้อมูลไม่ครบถ้วน",
      text: "ไม่พบหมายเลขงานสำหรับแก้ไข",
      confirmButtonText: "ตกลง",
    }).then(() => {
      // Redirect to home page
      window.location.href = "index.html";
    });
  }
});

// Add event listener to the edit form
document.addEventListener("DOMContentLoaded", function () {
  const editForm = document.getElementById("edit-job-form");
  if (editForm) {
    editForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      
      try {
        // Update the job
        await updateJob();
        
        // Show success message and redirect
        Swal.fire({
          icon: "success",
          title: "บันทึกสำเร็จ!",
          text: "บันทึกการแก้ไขงานเรียบร้อยแล้ว",
          confirmButtonText: "ตกลง",
        }).then(() => {
          // Redirect to home page or history page
          window.location.href = "index.html#history";
        });
      } catch (error) {
        console.error("Error updating job:", error);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถบันทึกการแก้ไขงานได้",
          confirmButtonText: "ตกลง",
        });
      }
    });
  }
});