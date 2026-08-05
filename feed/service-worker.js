const CACHE = "kfeed-v1";
const ASSETS = [
  "/quartz-site/feed/",
  "/quartz-site/feed/index.html",
  "/quartz-site/feed/data.json",
  "/quartz-site/feed/manifest.json",
  "/quartz-site/feed/icons/icon-192.png",
  "/quartz-site/feed/icons/icon-512.png",
];

// Install: cache core assets
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first for assets, network-first for data.json
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  
  // Network-first for data.json (always try fresh content)
  if (url.pathname.endsWith("data.json")) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE).then((cache) => cache.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }
  
  // Cache-first for everything else (images, icons, html)
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
