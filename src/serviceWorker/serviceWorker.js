importScripts("/service-worker/workbox-sw.js");

self.addEventListener("message", (e) => {
    if(e.data.action == 'skipWaiting') self.skipWaiting();
});

workbox.precaching.precacheAndRoute(injectionPoint);