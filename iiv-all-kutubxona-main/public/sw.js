const C='library-static-v10',F=['./','index.html','style.css?v=6','app.js?v=6','db.js?v=3','supabase-config.js?v=3','i18n.js','manifest.webmanifest','icons/icon-192.png','icons/logo.png'];
const put=(r,x)=>{if(x.ok){const y=x.clone();caches.open(C).then(c=>c.put(r,y))}return x};
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==C).map(n=>caches.delete(n)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
 // Запросы к базе и файлам Supabase никогда не кэшируем: данные должны быть свежими
 if(r.method!=='GET'||/\.supabase\.(co|in)$/.test(u.hostname))return;
 // Свои файлы: сначала сеть (всегда свежая версия), без интернета - из кэша
 if(u.origin===location.origin)return e.respondWith(fetch(r).then(x=>put(r,x)).catch(()=>caches.match(r)));
 // Библиотеки с CDN: из кэша, если есть
 e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>put(r,x))))});
