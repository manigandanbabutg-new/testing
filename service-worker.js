const CACHE_NAME = "outlet-gadgets-v1";

const urlsToCache = [
    "/",
    "/index.html",
    "/offline.html",
    "/manifest.json",
    "/Frame 4.png",
    "/icon-192.png",
    "/icon-512.png"
];

// Install
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );

    self.skipWaiting();
});

// Activate
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
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

    event.respondWith(

        caches.match(event.request)

        .then(response => {

            if (response) {
                return response;
            }

            return fetch(event.request)
                .catch(() => {

                    if (event.request.mode === "navigate") {
                        return caches.match("/offline.html");
                    }

                });

        })

    );

});
