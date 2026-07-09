const CACHE_NAME = "outlet-gadgets-v1";

const ASSETS = [
  "/",
  "/manifest.json",
  "/offline.html",
  "/Frame 4.png",
  "/icon-192.png",
  "/icon-512.png"
];

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );

  self.skipWaiting();
});

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", (event) => {

  // Ignore non-GET requests
  if (event.request.method !== "GET") return;

  event.respondWith(

    caches.match(event.request).then((cachedResponse) => {

      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {

          // Cache successful responses
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            event.request.url.startsWith(self.location.origin)
          ) {

            const responseClone = networkResponse.clone();

            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });

          }

          return networkResponse;

        })
        .catch(() => {

          // Offline fallback for pages
          if (event.request.mode === "navigate") {
            return caches.match("/offline.html");
          }

        });

    })

  );

});
