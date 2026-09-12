const CACHE_NAME = 'lookspace-v1.2-shell'
const CORE_ASSETS = ['/', '/index.html', '/manifest.webmanifest', '/icons/lookspace-192.png', '/icons/lookspace-512.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('lookspace-') && key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

async function networkFirst(request, fallbackKey) {
  try {
    const response = await fetch(request, { cache: 'no-store' })
    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(fallbackKey || request, response.clone())
    }
    return response
  } catch (error) {
    const cached = await caches.match(fallbackKey || request)
    if (cached) return cached
    throw error
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, '/index.html'))
    return
  }

  if (url.pathname === '/sw.js' || url.pathname === '/manifest.webmanifest') {
    event.respondWith(networkFirst(request))
    return
  }

  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(networkFirst(request))
    return
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response
        const copy = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
        return response
      })
    }),
  )
})
