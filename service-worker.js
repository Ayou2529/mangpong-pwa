const CACHE_NAME = "mangpong-cache-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
});

self.addEventListener("fetch", event => {
  const url = event.request.url;
  
  // อย่าแคช JSONP ของ Google Apps Script เพื่อให้ได้ข้อมูลล่าสุดเสมอ
  if (url.includes("script.google.com/macros/s/")) {
    return; // ปล่อยให้ network จัดการ
  }

  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request);
    })
  );
});
