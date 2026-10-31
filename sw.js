// Offline cache: pages come from the network first (so updates show at once) and fall back to the cache offline
const C='tawazun-v105',FILES=['./','index.html','manifest.webmanifest','icons/icon-180.png','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const same=new URL(e.request.url).origin===location.origin;
  const keep=r=>{if(r.ok&&same){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}return r};
  if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(keep).catch(()=>caches.match(e.request).then(h=>h||caches.match('index.html'))));return}
  e.respondWith(caches.match(e.request).then(hit=>{const net=fetch(e.request).then(keep).catch(()=>hit);return hit||net}))});
