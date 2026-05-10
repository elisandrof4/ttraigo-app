// TTRAIGO SERVICE WORKER — FIX MINIMO
// No cambia diseño ni funciones.
// Solo evita que el modo offline intercepte Supabase, Firebase u otros servicios externos.

const CACHE_NAME = "ttraigo-premium-v23-fix-sw";
const ASSETS = [
  "/",
  "/index.html",
  "/login.html",
  "/cliente.html",
  "/chofer.html",
  "/tracking.html",
  "/acompanante.html",
  "/offline.html",
  "/manifest.json",
  "/ttraigo-icon.svg",
  "/icon-192.svg",
  "/icon-512.svg",
  "/maskable-icon.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);

  // Si la petición NO es al dominio de Ttraigo, no tocarla.
  // Esto deja pasar Supabase, Firebase, Google Fonts, CDN, etc.
  if (url.origin !== self.location.origin) {
    return;
  }

  // No interceptar llamadas API ni métodos que no sean GET.
  if (req.method !== "GET" || url.pathname.startsWith("/api/")) {
    return;
  }

  event.respondWith(
    fetch(req)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        return res;
      })
      .catch(() => caches.match(req).then(cached => cached || caches.match("/offline.html")))
  );
});
