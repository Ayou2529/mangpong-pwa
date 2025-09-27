# 🚀 คู่มือ Deploy Management - อัปเดตโค้ดโดยไม่เปลี่ยน URL

## 📋 ขั้นตอนการอัปเดต Google Apps Script

### 1. เข้าไปที่ Google Apps Script Project
1. ไปที่ [script.google.com](https://script.google.com)
2. เปิด Project ที่มี URL: `https://script.google.com/macros/s/AKfycbzApRVAYEOsXvLlRgVcXImwB80OeWt9KOFBCmO-yUc_UL5IjCP0g9pdmcb3tOIIAD7z/exec`

### 2. อัปเดตโค้ด
1. **ลบโค้ดเดิมทั้งหมด** ในไฟล์ `code.gs`
2. **Copy โค้ดใหม่** จากไฟล์ `google-apps-script-cors-fix.js` (167 บรรทัด)
3. **วางโค้ดใหม่** ในไฟล์ `code.gs`
4. **Save** โค้ด (Ctrl+S)

### 3. ใช้ Deploy Management
1. **คลิก "Deploy"** → **"Manage deployments"**
2. **คลิกปุ่ม "Edit"** (รูปดินสอ) ข้าง deployment ที่มีอยู่
3. **คลิก "New version"** เพื่อสร้างเวอร์ชันใหม่
4. **คลิก "Deploy"** เพื่ออัปเดต
5. **URL จะยังคงเดิม** ไม่ต้องเปลี่ยน!

## ✅ สิ่งที่แก้ไขในโค้ดใหม่:

### 1. แก้ไข Error `setHeaders`
- ❌ โค้ดเดิม: ใช้ `createJsonOutput` ที่มี `setHeaders`
- ✅ โค้ดใหม่: ใช้ `ContentService.createTextOutput` โดยตรง

### 2. ปรับ Action Names
- `createJob` → `createjob`
- `getJobs` → `getjobs`
- เพื่อให้ตรงกับโค้ดเดิม

### 3. ใช้ Sheet ID เดิม
- Sheet ID: `1fcq5P7vm3IxtJMDS9BLDwO8B14hFmmDdK257GHyoM`
- ไม่ต้องสร้าง Sheets ใหม่

## 🎯 Frontend ไม่ต้องเปลี่ยน!

URL ใน `index.html` ยังคงเดิม:
```javascript
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzApRVAYEOsXvLlRgVcXImwB80OeWt9KOFBCmO-yUc_UL5IjCP0g9pdmcb3tOIIAD7z/exec";
```

## 🔍 วิธีทดสอบ:

1. **อัปเดตโค้ด** ใน Google Apps Script
2. **ใช้ Deploy Management** สร้าง New Version
3. **ทดสอบ URL** โดยเปิด: https://script.google.com/macros/s/AKfycbzApRVAYEOsXvLlRgVcXImwB80OeWt9KOFBCmO-yUc_UL5IjCP0g9pdmcb3tOIIAD7z/exec?action=test&callback=test
4. **ควรได้ response:** `test({"success":false,"error":"Invalid action"})`

## ⚠️ ข้อสำคัญ:

- **ไม่ต้องสร้าง Deploy ใหม่!** ใช้ Deploy Management
- **URL จะยังคงเดิม** ไม่ต้องเปลี่ยน Frontend
- **โค้ดใหม่จะแก้ไข CORS error** ได้ทันที
- **ข้อมูลใน Sheets จะยังคงเดิม** ไม่หาย

## 🎉 ผลลัพธ์:

- ✅ แก้ไข CORS error
- ✅ URL เดิมยังใช้ได้
- ✅ ข้อมูลไม่หาย
- ✅ ไม่ต้องเปลี่ยน Frontend
