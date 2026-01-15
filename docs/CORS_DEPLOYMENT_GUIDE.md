# คู่มือการ Deploy Google Apps Script + GitHub Pages (แก้ไข CORS)

## ขั้นตอนที่ 1: เตรียม Google Apps Script

### 1.1 สร้าง Google Apps Script Project
1. ไปที่ [script.google.com](https://script.google.com)
2. คลิก "New Project"
3. เปลี่ยนชื่อเป็น "Mangpong Delivery API"

### 1.2 ตั้งค่า Google Sheets
1. สร้าง Google Sheets ใหม่
2. ตั้งชื่อเป็น "Mangpong Delivery Data"
3. สร้าง Sheets ตามนี้:
   - **Users**: username, password, fullName, role, phone, email, createdAt
   - **Jobs**: jobId, username, jobDate, company, assignedBy, contact, pickupProvince, pickupDistrict, pickupAddress, deliveryProvince, deliveryDistrict, deliveryAddress, totalAmount, notes, status, createdAt

### 1.3 คัดลอกโค้ด Google Apps Script
1. ลบโค้ดเดิมทั้งหมด
2. คัดลอกโค้ดจากไฟล์ `google-apps-script-cors-fix.js`
3. แก้ไข `YOUR_SHEET_ID` เป็น Sheet ID ของคุณ

### 1.4 Deploy Google Apps Script
1. คลิก "Deploy" → "New deployment"
2. เลือก Type: "Web app"
3. ตั้งค่า:
   - **Execute as**: Me
   - **Who has access**: Anyone
4. คลิก "Deploy"
5. คัดลอก Web app URL (จะได้ URL แบบ: `https://script.google.com/macros/s/AKfycbz.../exec`)

## ขั้นตอนที่ 2: เตรียม Frontend Code

### 2.1 อัปเดต Frontend Code
1. โค้ดใน `src/utils/api/submitToGoogleSheets.js` ได้ถูกอัปเดตแล้ว
2. ใช้ JSONP แทน fetch เพื่อหลีกเลี่ยง CORS

### 2.2 ตั้งค่า Google Script URL
เพิ่มโค้ดนี้ใน `index.html`:

```html
<script>
  // ตั้งค่า Google Script URL สำหรับ Production
  if (window.location.hostname === 'ayou2529.github.io') {
    window.GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
  } else {
    // สำหรับ development
    window.GOOGLE_SCRIPT_URL = null;
  }
</script>
```

## ขั้นตอนที่ 3: Deploy บน GitHub Pages

### 3.1 เตรียม Repository
1. สร้าง GitHub repository
2. อัปโหลดโค้ดทั้งหมด
3. ตั้งค่า GitHub Pages:
   - ไปที่ Settings → Pages
   - เลือก Source: "Deploy from a branch"
   - เลือก Branch: "main" หรือ "master"

### 3.2 อัปเดต Google Script URL
1. แก้ไข `YOUR_SCRIPT_ID` ในโค้ดให้เป็น Script ID จริง
2. Commit และ push การเปลี่ยนแปลง

## ขั้นตอนที่ 4: ทดสอบ

### 4.1 ทดสอบการเชื่อมต่อ
1. เปิด Developer Console
2. ลองล็อคอินด้วยข้อมูลทดสอบ
3. ตรวจสอบ logs:
   ```
   Environment check: {hostname: "ayou2529.github.io", protocol: "https:", isDev: false}
   Using JSONP to connect to Google Apps Script: https://script.google.com/...
   JSONP response received: {success: true, user: {...}}
   ```

### 4.2 ทดสอบฟังก์ชันต่างๆ
- ✅ ล็อคอิน
- ✅ ลงทะเบียน
- ✅ สร้างงาน
- ✅ ดูรายการงาน

## การแก้ไขปัญหา

### ปัญหา: "Google Script URL ไม่ได้ถูกกำหนดไว้"
**วิธีแก้:**
1. ตรวจสอบว่า `window.GOOGLE_SCRIPT_URL` ถูกตั้งค่าแล้ว
2. ตรวจสอบ hostname ในโค้ด

### ปัญหา: "ไม่สามารถเชื่อมต่อกับ Google Apps Script ได้"
**วิธีแก้:**
1. ตรวจสอบว่า Google Apps Script ได้ deploy แล้ว
2. ตรวจสอบว่า URL ถูกต้อง
3. ตรวจสอบว่า "Who has access" ตั้งเป็น "Anyone"

### ปัญหา: "Invalid response format"
**วิธีแก้:**
1. ตรวจสอบว่า Google Apps Script ส่ง response ที่ถูกต้อง
2. ตรวจสอบ console logs

## ข้อมูลเพิ่มเติม

### การ Debug
```javascript
// ตรวจสอบ environment
console.log('Current environment:', {
  hostname: window.location.hostname,
  protocol: window.location.protocol,
  scriptURL: window.GOOGLE_SCRIPT_URL
});

// ตรวจสอบ JSONP request
console.log('JSONP request URL:', script.src);
```

### การทดสอบ JSONP
```javascript
// ทดสอบการเชื่อมต่อ
fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=test&callback=test')
  .then(response => response.text())
  .then(data => console.log('Response:', data));
```

## สรุป

การแก้ไข CORS issue นี้ใช้วิธี:
1. **Google Apps Script**: ใช้ `doGet()` แทน `doPost()` และส่ง JSONP response
2. **Frontend**: ใช้ JSONP แทน fetch API
3. **Deploy**: ตั้งค่า Google Apps Script เป็น "Anyone" access

วิธีนี้จะแก้ปัญหา CORS ได้อย่างสมบูรณ์และใช้งานได้จริงบน GitHub Pages
