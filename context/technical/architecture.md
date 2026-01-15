# Technical Architecture

## สถาปัตยกรรมระบบ

### Frontend Architecture
- **Core Technologies**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Tailwind CSS
- **PWA Features**: Service workers, Web App Manifest, Offline Support
- **Libraries**: 
  - SweetAlert2 สำหรับการแจ้งเตือน
  - jsPDF สำหรับการส่งออก PDF
  - Google Fonts (Prompt)

### Backend Architecture
- **Backend**: Google Apps Script
- **Database**: Google Sheets
- **API Endpoint**: https://script.google.com/macros/s/AKfycbxZIMrFlOm3IzVSM-PqmgA91v-t48szqLLk9HD0IKdW9FBd3BFJ7SE9Eci6NEBcNa9v/exec

### Data Flow
1. ผู้ใช้ป้อนข้อมูลผ่าน UI
2. ข้อมูลถูกส่งไปยัง Google Apps Script ผ่าน API
3. Google Apps Script ประมวลผลและบันทึกข้อมูลลง Google Sheets
4. ข้อมูลถูกดึงกลับมาแสดงใน UI

### Offline Support
- **Service Worker**: จัดการ caching ของ assets
- **Request Queue**: จัดคิวคำขอเมื่อไม่มีการเชื่อมต่อ
- **Local Storage**: จัดเก็บข้อมูลชั่วคราว
- **Sync Mechanism**: ซิงค์ข้อมูลเมื่อมีการเชื่อมต่ออีกครั้ง