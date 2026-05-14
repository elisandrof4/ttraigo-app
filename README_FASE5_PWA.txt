const CACHE_NAME = "ttraigo-premium-v8-pwa";
const ASSETS = ["/","/index.html","/login.html","/cliente.html","/chofer.html","/tracking.html","/acompanante.html","/offline.html","/manifest.json","/ttraigo-icon.svg","/icon-192.svg","/icon-512.svg","/maskable-icon.svg"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  event.respondWith(fetch(req).then(res => {
    const clone = res.clone();
    caches.open(CACHE_NAME).then(cache => { if (req.url.startsWith(self.location.origin)) cache.put(req, clone); });
    return res;
  }).catch(() => caches.match(req).then(cached => cached || caches.match("/offline.html"))));
});
