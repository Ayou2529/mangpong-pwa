# ✅ Google Apps Script Code พร้อมใช้งาน (ใช้ Sheet ID เดิม)

## 📋 สิ่งที่ต้องทำ:

### 1. Copy โค้ด Google Apps Script
- เปิดไฟล์ `google-apps-script-cors-fix.js` 
- Copy โค้ดทั้งหมด (174 บรรทัด)
- ไปที่ [script.google.com](https://script.google.com)
- สร้าง New Project
- ลบโค้ดเดิมทั้งหมด
- วางโค้ดใหม่

### 2. Deploy Google Apps Script
1. คลิก "Deploy" → "New deployment"
2. เลือก Type: "Web app"
3. ตั้งค่า:
   - **Execute as**: Me
   - **Who has access**: Anyone
4. คลิก "Deploy"
5. Copy URL ที่ได้

### 3. อัปเดต Frontend
ในไฟล์ `index.html` บรรทัด 1035:
```javascript
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_NEW_SCRIPT_ID/exec";
```

## 🎯 Sheet Structure ที่ใช้:

### Users Sheet:
```
A: Timestamp
B: Username  
C: Password
D: FullName
E: Phone
F: Email
G: Role
H: LastLogin
```

### Jobs Sheet:
```
A: Timestamp
B: JobId
C: Username
D: Status
E: JobDate
F: Company
G: AssignedBy
H: Contact
I: PickupProvince
J: PickupDistrict
K: TotalAmount
```

## ✅ สิ่งที่แก้ไขแล้ว:
- ✅ ใช้ Sheet ID เดิม: `1fcq5P7vm3IxtJMDS9BLDwO8B14hFmmDdK257GHyoM`
- ✅ ปรับ column mapping ให้ตรงกับ structure เดิม
- ✅ ใช้ JSONP แทน fetch เพื่อหลีกเลี่ยง CORS
- ✅ รองรับ actions: login, register, createJob, getJobs

## 🚀 ทดสอบ:
1. Deploy Google Apps Script
2. อัปเดต URL ใน index.html
3. ลองล็อคอินด้วยข้อมูลที่มีอยู่
4. ตรวจสอบ Console logs

**ไม่ต้องสร้าง Sheets ใหม่!** ใช้ Sheets เดิมที่มีอยู่แล้ว 🎉
