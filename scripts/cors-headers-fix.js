/**
 * เพิ่มโค้ดส่วนนี้ในไฟล์ code.js ของคุณใน Google Apps Script
 * ให้ใส่ไว่ด้านบนสุดของไฟล์ หรือเพิ่มในฟังก์ชัน doGet และ doPost
 */

// เพิ่มฟังก์ชันนี้สำหรับจัดการ CORS headers
function setCORSHeaders(response) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '3600'
  };
  
  return response.setHeaders(corsHeaders);
}

// ปรับปรุง doGet function
function doGet(e) {
  // จัดการ preflight request
  if (e.requestMethod === 'OPTIONS') {
    return setCORSHeaders(ContentService.createTextOutput(''));
  }
  
  // โค้ดเดิมของคุณ...
  // เพิ่ม setCORSHeaders ก่อน return ทุก response
  // ตัวอย่าง:
  // return setCORSHeaders(ContentService.createTextOutput(JSON.stringify(result))
  //   .setMimeType(ContentService.MimeType.JSON));
}

// ปรับปรุง doPost function
function doPost(e) {
  // จัดการ preflight request
  if (e.requestMethod === 'OPTIONS') {
    return setCORSHeaders(ContentService.createTextOutput(''));
  }
  
  // โค้ดเดิมของคุณ...
  // เพิ่ม setCORSHeaders ก่อน return ทุก response
  // ตัวอย่าง:
  // return setCORSHeaders(ContentService.createTextOutput(JSON.stringify(result))
  //   .setMimeType(ContentService.MimeType.JSON));
}

// เพิ่ม doOptions function สำหรับจัดการ preflight requests
function doOptions(e) {
  return setCORSHeaders(ContentService.createTextOutput(''));
}