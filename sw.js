/* OZAK Service Worker — تخزين مؤقت للعمل بدون إنترنت */
const V='ozak-v1',CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  /* خطوط Google: نسخة مخزنة أولاً ثم تحديث بالخلفية */
  if(u.hostname.includes('fonts.googleapis.com')||u.hostname.includes('fonts.gstatic.com')){
    e.respondWith(caches.open(V).then(c=>c.match(r).then(h=>{const n=fetch(r).then(x=>{c.put(r,x.clone());return x}).catch(()=>h);return h||n})));return}
  if(u.origin!==location.origin)return;
  /* ملفات التطبيق: من الكاش أولاً، وعند الفشل في التنقل نرجع لـ index */
  e.respondWith(caches.match(r).then(h=>h||fetch(r).then(x=>{const cp=x.clone();caches.open(V).then(c=>c.put(r,cp));return x}).catch(()=>r.mode==='navigate'?caches.match('./index.html'):undefined)));
});
