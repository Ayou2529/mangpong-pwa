// วิธีที่ 1: ใช้ Proxy สำหรับ Development
// ติดตั้ง vite-plugin-proxy (ถ้ายังไม่มี)
// npm install --save-dev vite-plugin-proxy

// เพิ่มใน vite.config.js
import proxy from 'vite-plugin-proxy';

export default defineConfig({
  plugins: [
    // ... plugins อื่นๆ
    proxy({
      '/api': {
        target: 'https://script.google.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    })
  ],
  // ... โค้ดอื่นๆ
});

// วิธีที่ 2: ใช้ Environment Variables
// สร้างไฟล์ .env ใน root directory
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

// ใช้ใน index.html
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";