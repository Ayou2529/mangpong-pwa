# การใช้งานระบบ Generate & Copy Context

## โครงสร้างโฟลเดอร์ที่สร้างแล้ว:

```
.
├── .vscode/
│   ├── tasks.json          # กำหนด task สำหรับรันด้วย Ctrl+Shift+P
├── logs/
│   └── chat-log.txt        # เก็บประวัติการสนทนา (เทมเพลตเริ่มต้น)
├── errors/
│   ├── error-log.json      # เก็บ error ที่ยังไม่ได้แก้ (เทมเพลตเริ่มต้น)
│   └── recurring-errors.json # เก็บ error ที่เกิดซ้ำ (เทมเพลตเริ่มต้น)
├── generate-context.js     # สคริปต์หลักสำหรับอ่านข้อมูลและสร้าง context
├── context.json            # ไฟล์ context ที่สร้างอัตโนมัติ
└── CONTEXT_SUMMARY.md      # ไฟล์สรุป context ที่สร้างอัตโนมัติ
```

## วิธีใช้งาน:

1. **เปิดโปรเจคใน VS Code**
   - เปิดโฟลเดอร์โปรเจค `mangpong-pwa` ใน VS Code

2. **รัน Task เพื่อสร้าง Context**
   - กด `Ctrl+Shift+P` เพื่อเปิด Command Palette
   - พิมพ์ `Tasks: Run Task` และเลือก
   - เลือก task `Generate Context`
   - ระบบจะรัน script และสร้าง/อัปเดตไฟล์ context ให้โดยอัตโนมัติ

3. **ดูผลลัพธ์**
   - ไฟล์ `context.json` จะถูกอัปเดตด้วยข้อมูลล่าสุด
   - ไฟล์ `CONTEXT_SUMMARY.md` จะถูกสร้าง/อัปเดตด้วยข้อมูลสรุป รวมถึง:
     - ข้อมูลพื้นฐานของโปรเจค
     - ประวัติการสนทนา 3 รายการล่าสุด
     - ข้อผิดพลาดที่ยังไม่ได้แก้
     - ข้อผิดพลาดที่เกิดซ้ำ

## การอัปเดตข้อมูล:

- **Chat Logs**: อัปเดตไฟล์ `logs/chat-log.txt` ด้วยการสนทนาใหม่
- **Errors**: อัปเดตไฟล์ `errors/error-log.json` ด้วย error ใหม่
- **Recurring Errors**: อัปเดตไฟล์ `errors/recurring-errors.json` ด้วย error ที่เกิดซ้ำ

## ประโยชน์:

- สร้างข้อมูลบริบทของโปรเจคแบบอัตโนมัติ
- ติดตามประวัติการสนทนาและปัญหาที่เกิดขึ้น
- สรุปข้อมูลสำคัญในรูปแบบ markdown สำหรับแชร์กับทีม
- ใช้งานได้ด้วยคลิกเดียวผ่าน VS Code Task