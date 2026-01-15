# คู่มือแก้ไขปัญหา - Mangpong PWA

## ปัญหาที่แก้ไขแล้ว

### 1. ปัญหาโลโก้ไม่แสดงบน iPhone

**สาเหตุ:**
- ไม่มี maskable icon สำหรับ iPhone
- manifest.json ไม่มี Apple-specific meta tags
- Service Worker ไม่ได้ cache icon อย่างถูกต้อง

**การแก้ไข:**
- ✅ เพิ่ม `icon-maskable.png` ใน manifest.json
- ✅ เพิ่ม Apple-specific meta tags ใน index.html
- ✅ อัปเดต Service Worker ให้ cache maskable icon
- ✅ เพิ่ม `apple-touch-icon` และ `apple-mobile-web-app-*` meta tags

### 2. ปัญหาการล็อคอินบนเดสก์ท็อป

**สาเหตุ:**
- การตรวจสอบ environment ไม่ครอบคลุมทุกกรณี
- การจัดการ session ไม่มี expiration time
- ไม่มี device tracking สำหรับ cross-device login

**การแก้ไข:**
- ✅ ปรับปรุงการตรวจสอบ environment ให้ครอบคลุมมากขึ้น
- ✅ เพิ่ม session expiration (24 ชั่วโมง)
- ✅ เพิ่ม device info tracking
- ✅ เพิ่ม logging สำหรับ debugging

## วิธีทดสอบการแก้ไข

### สำหรับ iPhone:
1. เปิด Safari บน iPhone
2. ไปที่ URL ของแอป
3. กดปุ่ม Share → "Add to Home Screen"
4. ตรวจสอบว่าโลโก้แสดงถูกต้อง

### สำหรับการล็อคอิน:
1. ลองล็อคอินบนมือถือและเดสก์ท็อป
2. ตรวจสอบ Console logs เพื่อดู environment detection
3. ทดสอบการล็อคอินหลังจาก 24 ชั่วโมง

## การ Debug

### ตรวจสอบ Environment:
```javascript
// เปิด Developer Console และดู logs
console.log('Environment check:', {
  hostname: window.location.hostname,
  protocol: window.location.protocol,
  isDev: isDev
});
```

### ตรวจสอบ User Data:
```javascript
// ตรวจสอบข้อมูลผู้ใช้ที่บันทึก
console.log('User data:', JSON.parse(localStorage.getItem('mangpongUser')));
```

### ตรวจสอบ PWA Status:
```javascript
// ตรวจสอบว่าแอปติดตั้งเป็น PWA หรือไม่
console.log('PWA installed:', window.matchMedia('(display-mode: standalone)').matches);
```

## คำแนะนำเพิ่มเติม

### สำหรับ iPhone:
- ต้องใช้ HTTPS หรือ localhost เท่านั้น
- ต้องมี manifest.json ที่ถูกต้อง
- ต้องมี service worker ที่ทำงาน

### สำหรับการล็อคอิน:
- บน localhost จะใช้ mock data (admin/password)
- บน production จะเชื่อมต่อกับ Google Apps Script
- Session จะหมดอายุใน 24 ชั่วโมง

## การอัปเดต Service Worker

หลังจากแก้ไขไฟล์ ให้ทำการอัปเดต Service Worker:

1. เปิด Developer Tools
2. ไปที่ Application tab
3. คลิก Service Workers
4. คลิก "Update" หรือ "Unregister" แล้ว reload

## การ Clear Cache

หากยังมีปัญหา ให้ลอง clear cache:

1. เปิด Developer Tools
2. ไปที่ Application tab
3. คลิก Storage
4. คลิก "Clear storage"
5. Reload หน้าเว็บ
