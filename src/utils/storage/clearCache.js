// src/utils/storage/clearCache.js

/**
 * ล้างข้อมูล cache และ storage ทั้งหมด
 */
export async function clearAllCache() {
  // ล้าง localStorage
  localStorage.clear();

  // ล้าง sessionStorage
  sessionStorage.clear();

  // ล้าง cache ของ service worker
  if ("serviceWorker" in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }

      const keys = await caches.keys();
      for (const key of keys) {
        await caches.delete(key);
      }

      console.log("ล้าง cache และ service worker เรียบร้อยแล้ว");
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการล้าง cache:", error);
    }
  }
}

/**
 * ล้างข้อมูลการเข้าสู่ระบบ
 */
export function clearLoginData() {
  localStorage.removeItem("mangpongUser");
  localStorage.removeItem("mangpongRequestQueue");
  sessionStorage.removeItem("currentUser");
}
