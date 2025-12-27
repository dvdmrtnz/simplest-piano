/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
const PRECACHE = 'precache-v4';
const RUNTIME = 'runtime';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  './',
  'index.html',
  'style.css',
  'main.js',
  '3party/tone.min.js',
  'sounds/021.mp3',
  'sounds/022.mp3',
  'sounds/023.mp3',
  'sounds/024.mp3',
  'sounds/025.mp3',
  'sounds/026.mp3',
  'sounds/027.mp3',
  'sounds/028.mp3',
  'sounds/029.mp3',
  'sounds/030.mp3',
  'sounds/031.mp3',
  'sounds/032.mp3',
  'sounds/033.mp3',
  'sounds/034.mp3',
  'sounds/035.mp3',
  'sounds/036.mp3',
  'sounds/037.mp3',
  'sounds/038.mp3',
  'sounds/039.mp3',
  'sounds/040.mp3',
  'sounds/041.mp3',
  'sounds/042.mp3',
  'sounds/043.mp3',
  'sounds/044.mp3',
  'sounds/045.mp3',
  'sounds/046.mp3',
  'sounds/047.mp3',
  'sounds/048.mp3',
  'sounds/049.mp3',
  'sounds/050.mp3',
  'sounds/051.mp3',
  'sounds/052.mp3',
  'sounds/053.mp3',
  'sounds/054.mp3',
  'sounds/055.mp3',
  'sounds/056.mp3',
  'sounds/057.mp3',
  'sounds/058.mp3',
  'sounds/059.mp3',
  'sounds/060.mp3',
  'sounds/061.mp3',
  'sounds/062.mp3',
  'sounds/063.mp3',
  'sounds/064.mp3',
  'sounds/065.mp3',
  'sounds/066.mp3',
  'sounds/067.mp3',
  'sounds/068.mp3',
  'sounds/069.mp3',
  'sounds/070.mp3',
  'sounds/071.mp3',
  'sounds/072.mp3',
  'sounds/073.mp3',
  'sounds/074.mp3',
  'sounds/075.mp3',
  'sounds/076.mp3',
  'sounds/077.mp3',
  'sounds/078.mp3',
  'sounds/079.mp3',
  'sounds/080.mp3',
  'sounds/081.mp3',
  'sounds/082.mp3',
  'sounds/083.mp3',
  'sounds/084.mp3',
  'sounds/085.mp3',
  'sounds/086.mp3',
  'sounds/087.mp3',
  'sounds/088.mp3',
  'sounds/089.mp3',
  'sounds/090.mp3',
  'sounds/091.mp3',
  'sounds/092.mp3',
  'sounds/093.mp3',
  'sounds/094.mp3',
  'sounds/095.mp3',
  'sounds/096.mp3',
  'sounds/097.mp3',
  'sounds/098.mp3',
  'sounds/099.mp3',
  'sounds/100.mp3',
  'sounds/101.mp3',
  'sounds/102.mp3',
  'sounds/103.mp3',
  'sounds/104.mp3',
  'sounds/105.mp3',
  'sounds/106.mp3',
  'sounds/107.mp3',
  'sounds/108.mp3',
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  console.log('Service Worker installing.');

  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  console.log('Service Worker activating.');

  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request).then(response => {
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});
