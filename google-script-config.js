// การตั้งค่า Google Script URL สำหรับ Production
// เพิ่มโค้ดนี้ใน index.html หรือไฟล์ config

<script>
  // ตั้งค่า Google Script URL สำหรับ Production
  if (window.location.hostname === 'ayou2529.github.io') {
    window.GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
  } else {
    // สำหรับ development
    window.GOOGLE_SCRIPT_URL = null;
  }
</script>
