// โค้ดปรับปรุงสำหรับจัดการ CORS ใน frontend
// อัปเดตส่วนนี้ในไฟล์ index.html

// ปรับปรุงฟังก์ชัน submitToGoogleSheets
async function submitToGoogleSheets(data) {
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzApRVAYEOsXvLlRgVcXImwB80OeWt9KOFBCmO-yUc_UL5IjCP0g9pdmcb3tOIIAD7z/exec";
  
  // ใช้ JSONP แทน fetch เพื่อหลีกเลี่ยง CORS
  return new Promise((resolve, reject) => {
    try {
      // สร้างชื่อ callback แบบสุ่ม
      const callbackName = 'callback_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
      
      // สร้างฟังก์ชัน callback แบบ global
      window[callbackName] = function(response) {
        // เคลียร์ callback หลังใช้งาน
        delete window[callbackName];
        
        // ลบ script tag ที่สร้าง
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
        
        resolve(response);
      };
      
      // สร้าง query parameters
      const params = new URLSearchParams({
        ...data,
        callback: callbackName,
        _random: Math.random() // ป้องกัน cache
      });
      
      // สร้าง script tag สำหรับ JSONP
      const script = document.createElement('script');
      script.src = `${GOOGLE_SCRIPT_URL}?${params.toString()}`;
      
      // จัดการ error
      script.onerror = function() {
        delete window[callbackName];
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
        reject(new Error('ไม่สามารถเชื่อมต่อกับ Google Apps Script ได้'));
      };
      
      // เพิ่ม script tag เข้าไปใน document
      document.head.appendChild(script);
      
      // ตั้ง timeout สำหรับการเชื่อมต่อ
      setTimeout(() => {
        if (window[callbackName]) {
          delete window[callbackName];
          if (script && script.parentNode) {
            script.parentNode.removeChild(script);
          }
          reject(new Error('การเชื่อมต่อล้มเหลว: หมดเวลา'));
        }
      }, 30000); // 30 วินาที
      
    } catch (error) {
      reject(new Error('เกิดข้อผิดพลาดในการเชื่อมต่อ: ' + error.message));
    }
  });
}

// ปรับปรุงฟังก์ชันทดสอบการเชื่อมต่อ
async function testGoogleScriptConnection() {
  try {
    console.log("กำลังทดสอบการเชื่อมต่อกับ Google Apps Script...");
    
    // ใช้ JSONP แทน fetch
    const response = await submitToGoogleSheets({ action: "test" });
    
    console.log("ผลการทดสอบการเชื่อมต่อ:", response);
    return true;
  } catch (error) {
    console.error("ไม่สามารถเชื่อมต่อกับ Google Apps Script:", error);
    return false;
  }
}