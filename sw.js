self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("keynova-cache").then(cache =>
      cache.addAll([
        "/",
        "/index.html",
        "/manifest.json",
        "/bg2.png",
        "/icon.png"
      ])
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
