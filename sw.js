/* سرویس‌ورکر: همهٔ فایل‌ها یک‌بار کش می‌شوند و برنامه کاملاً آفلاین کار می‌کند.
   کدها (html/js/css) همیشه اول از اینترنت تازه گرفته می‌شوند و فقط وقتی اینترنت نیست از کش می‌آیند.
   این فایل خودکار ساخته می‌شود (tools/build_sw.py)؛ دستی ویرایشش نکنید. */
const CACHE = 'jam-60dfb735bb';
const ASSETS = [
 "./",
 "assets/css/shell.css",
 "assets/fonts/vazirmatn-subset.woff2",
 "assets/icons/apple-touch-icon.png",
 "assets/icons/icon-192.png",
 "assets/icons/icon-512.png",
 "assets/icons/icon.svg",
 "assets/icons/maskable-512.png",
 "assets/js/bridge.js",
 "assets/js/shell.js",
 "assets/lib/d3.min.js",
 "assets/lib/three.min.js",
 "data/places.json",
 "index.html",
 "manifest.webmanifest",
 "modules/atlas/app.js",
 "modules/atlas/data.js",
 "modules/atlas/index.html",
 "modules/countries/app.js",
 "modules/countries/data.js",
 "modules/countries/index.html",
 "modules/iran/app.js",
 "modules/iran/data.js",
 "modules/iran/index.html",
 "modules/sky/app.js",
 "modules/sky/index.html",
 "modules/solar/app.js",
 "modules/solar/index.html"
];
const FRESH = /(\.html|\.css|\.webmanifest|\/(app|shell|bridge)\.js)$|\/$/;

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.all(ASSETS.map(async a => {
      const r = await fetch(new Request(a, { cache: 'reload' }));
      if (!r.ok) throw new Error(a);
      await c.put(a, r);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if ((k.startsWith('zamin-asman-') || k.startsWith('jam-')) && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
    for (const c of await self.clients.matchAll()) c.postMessage({ sw: 'ready' });
  })());
});

async function fallback(cache, r) {
  return (await cache.match(r, { ignoreSearch: true })) ||
    (r.mode === 'navigate' ? (await cache.match('./')) || (await cache.match('index.html')) : null) || Response.error();
}
async function netFirst(r) {
  const cache = await caches.open(CACHE);
  try {
    const res = await Promise.race([fetch(r.url, { cache: 'no-cache' }), new Promise((_, j) => setTimeout(j, 4000))]);
    if (res.ok) cache.put(r, res.clone());
    return res;
  } catch (_) { return fallback(cache, r); }
}
async function cacheFirst(r) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(r, { ignoreSearch: true });
  if (hit) return hit;
  try { const res = await fetch(r); if (res.ok) cache.put(r, res.clone()); return res; } catch (_) { return Response.error(); }
}
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;
  e.respondWith(r.mode === 'navigate' || FRESH.test(u.pathname) ? netFirst(r) : cacheFirst(r));
});
