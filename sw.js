// يحفظ ملفات التطبيق ليعمل دون إنترنت. عند تغيير أي ملف، غيّر رقم الإصدار أدناه.
var CACHE = "dalil-v2";
var FILES = ["./", "./index.html", "./style.css", "./data.js", "./app.js", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }));
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

// يعرض النسخة المحفوظة فوراً، ويحدّثها من الإنترنت في الخلفية إن توفر
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") { return; }
  var url = new URL(e.request.url);
  if (url.origin !== self.location.origin) { return; }
  e.respondWith(
    caches.open(CACHE).then(function (cache) {
      return cache.match(e.request, { ignoreSearch: true }).then(function (cached) {
        var net = fetch(e.request).then(function (res) {
          if (res && res.ok) { cache.put(e.request, res.clone()); }
          return res;
        }).catch(function () {
          return cached || cache.match("./index.html");
        });
        return cached || net;
      });
    })
  );
});
