// Service worker da Dionuel — permite abrir o site e ver os últimos
// dados carregados mesmo sem internet. Criar/editar/apagar continua a
// exigir rede (não há fila de escrita offline, de propósito: os dados só
// devem "entrar no sistema", visíveis para todos, quando há ligação).
//
// Suba este ficheiro por ficheiro, e o manifest.json, para a MESMA pasta
// onde está o index.html no servidor (ex.: Netlify) — senão o navegador
// não os encontra.

const CACHE_VERSAO = 'dionuel-v4-premium-interface';
const FICHEIROS_ESSENCIAIS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './vendor/supabase.js', './storefront-phase1.js', './storefront-phase1.css', './storefront-phase1-enhance.js', './storefront-request.js', './storefront-request.css']
    })
  );
});

self.addEventListener('activate', (evento) => {
  self.clients.claim();
  evento.waitUntil(
    caches.keys().then((nomes) =>
      Promise.all(nomes.filter((n) => n !== CACHE_VERSAO).map((n) => caches.delete(n)))
    )
  );
});

self.addEventListener('fetch', (evento) => {
  const req = evento.request;

  // Nunca intercetar escritas (POST/PATCH/PUT/DELETE) — têm de ir
  // sempre à rede a sério, e falhar claramente se não houver ligação.
  if(req.method !== 'GET') return;

  const url = new URL(req.url);
  const ehSupabaseRest = url.hostname.endsWith('.supabase.co') && url.pathname.startsWith('/rest/');

  // Navegação (abrir/recarregar a página): tenta a rede primeiro, cai
  // para a cópia guardada em cache se estiver offline.
  if(req.mode === 'navigate'){
    evento.respondWith(
      fetch(req).catch(() => caches.match('./index.html').then((r) => r || caches.match('./')))
    );
    return;
  }

  // Leituras ao Supabase (GET): tenta a rede e guarda a resposta mais
  // recente; se falhar (sem rede), usa a última resposta guardada —
  // é assim que os dados "nunca se perdem" mesmo após meses offline.
  if(ehSupabaseRest){
    evento.respondWith(
      fetch(req)
        .then((resp) => {
          const copia = resp.clone();
          caches.open(CACHE_VERSAO).then((cache) => cache.put(req, copia));
          return resp;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Tudo o resto (fontes, scripts do CDN, etc.): cache primeiro, com a
  // rede como reserva — mais rápido e funciona offline depois da 1ª visita.
  evento.respondWith(
    caches.match(req).then((cached) => {
      if(cached) return cached;
      return fetch(req).then((resp) => {
        const copia = resp.clone();
        caches.open(CACHE_VERSAO).then((cache) => cache.put(req, copia));
        return resp;
      }).catch(() => cached);
    })
  );
});
