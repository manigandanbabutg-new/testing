const CACHE = "v1";

const urls = [
    "/",
    "/offline.html"
];

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE)
            .then(cache => cache.addAll(urls))

    );

});

self.addEventListener("fetch", event => {

    event.respondWith(

        fetch(event.request)

        .catch(() => caches.match(event.request))

        .then(response => {

            return response || caches.match("/offline.html");

        })

    );

});
