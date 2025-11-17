const CACHE_NAME = "streamlist-cache-v1";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll([
      "/",
      OFFLINE_URL,
      "/manifest.webmanifest"
    ]))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))
    )
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request).catch(async () => {
      const cache = await caches.open(CACHE_NAME);
      if (event.request.mode === "navigate") {
        return cache.match(OFFLINE_URL);
      }
      const match = await cache.match(event.request);
      return match || cache.match(OFFLINE_URL);
    })
  );
});
