// change staticCacheName's name to update cache
const staticCacheName = 'site-static-v2'
const dynamicCacheName = 'site-dynamic-cache'
const assets = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/ui.js',
  '/js/materialize.min.js',
  '/css/styles.css',
  '/css/materialize.min.css',
  '/img/dish.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
  '/pages/fallback.html'
]

const limitCacheSize = (name, size) => { 
  caches.open(name).then(cache => {
      caches.keys().then(keys => {
        if(keys.length > size){
          cache.delete(keys[0]).then(limitCacheSize(name, size))
        }
    })
  })
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      console.log('caching shell assets')
      return cache.addAll(assets)
    })
  )
})

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys
        .filter(function(key) {
          return key !== staticCacheName && key !== dynamicCacheName
        })
        .map(function(key) {
          console.log('deleting cache', key)
          return caches.delete(key)
        })
      )
    })
  )
})

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(res) {
      return res || fetch(event.request).then(function(res) {
        return caches.open(dynamicCacheName).then(function(cache) {
          cache.put(event.request.url, res.clone())
          limitCacheSize(dynamicCacheName, 15)
          return res
        })
      })
    }).catch(function(err) {
      const fallBackForHTML = event.request.url.indexOf('.html') > -1;

      if (fallBackForHTML)
        return caches.match('/pages/fallback.html')
      
      
    })
  )
})
