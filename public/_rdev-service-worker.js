// console.log('SW in da hizzy');
// const version = '0.0.17';
// const CACHE_KEY = 'rdev-worker-cache::' + version ;
//
// self.addEventListener('install', (evt) => {
//     console.log('install', evt);
//
//     // verify if content is stale
//
//     evt.waitUntil(preCache());
//
//     // calculate new values for content integrity
//
//     // set values and chain history
// });
//
// self.addEventListener('active', (evt) => {
//     console.log('active', evt);
//
//     // listen for any requests or procedure calls
//
//     // manage stream requests
//
//     // manage inter client-server messaging
//
// });
//
// self.addEventListener('fetch', (evt) => {
//     console.log('url', evt.request.url, evt.request.headers);
//     if(evt.request){
//         const protocall = evt.request.url.split(':')[0];
//         if (protocall === 'ws') {
//             const response = fetch(evt.request);
//             evt.respondWith(response);
//         }
//     }
//     if (evt.response && evt.response.status[0] !== 2) {
//         evt.respondWith(caches.match(evt.request, {
//             cacheName: CACHE_KEY
//         }));
//     }
//
//     if(evt.request.headers.get('range')) {
//         evt.respondWith(rangeResponder(evt));
//     } else {
//         evt.respondWith(responder(evt));
//     }
// });
//
// async function rangeResponder(evt) {
//     // Number(/^bytes\=(\d+)\-$/g.exec(event.request.headers.get('range'))[1]);
//     // const pos = Number(/^bytyes\=(\d+)\-$/g.exec(evt.request.headers.get('range'))[1]);
//     const poss = Number(/^bytyes\=(\d+)\-$/g.exec(evt.request.headers.get('range')));
//     const pos = !!poss.length > 1 ?  poss[1] : poss[-0];
//     console.log('Range?', evt.request);
//     const matched = await caches.match(evt.request,
//         {
//             cacheName: CACHE_KEY
//         });
//     if (matched) {
//         console.log('matched range', matched);
//         return matched;
//     }
//     const fetched = await fetch(evt.request);
//     console.log('fetched', fetched);
//     const ab = await fetched.arrayBuffer();
//     return await new Response(
//         ab.slice(pos),
//         {
//             status: 206,
//             statusText: 'partial',
//             headers: [
//                 [
//                     'Content-Range',
//                     'bytes ' + pos + (ab.byteLength - 1) + '/' + ab.byteLength
//                 ]
//             ]
//         }
//     );
// }
//
// async function responder(evt) {
//     const openCache = await caches.open(CACHE_KEY);
//     const matched = await openCache.match(evt.request);
//     if (matched){
//         console.log('matched', matched);
//         return matched;
//     }
//     return await openCache.add(evt.request)
//         .catch(err => {
//             console.log('Error: Cache add', err);
//             throw  err + err.stackTrace;
//         });
// }
//
// async function preCache() {
//     const cache = await caches.open(CACHE_KEY);
//     console.log('KEYS', cache.keys(), cache);
//     return caches.open(CACHE_KEY)
//     // .then(cache => {
//     //     console.log('cache', cache);
//     //     cache.addAll([
//     //         'history',
//     //         'hash',
//     //         'lastUpdated',
//     //         'sounds',
//     //         'contact',
//     //         'mediaPlayer',
//     //         'about',
//     //         'footer',
//     //         'navbar',
//     //         'global',
//     //         'stats',
//     //         'metrics',
//     //     ]);
//     // })
// }
//
// // self.addEventListener('fetch', function(event) {
// //     console.log('fetch catch', event.request);
// //     event.respondWith(cache.match(event.request).then(function(response) {
// //         console.log('hgjvhkbjlnk;lm',response);
// //         // caches.match() always resolves
// //         // but in case of success response will have value
// //         if (response !== undefined) {
// //             return response;
// //         } else {
// //             return fetch(event.request).then(function (response) {
// //                 // response may be used only once
// //                 // we need to save clone to put one copy in cache
// //                 // and serve second one
// //                 let responseClone = response.clone();
// //
// //                 copyaches.open('v1').then(function (cache) {
// //                     cache.put(event.request, responseClone);
// //                 });
// //                 return response;
// //             }).catch(function () {
// //                 return cache.match('/bike-red-strip.jpg');
// //             });
// //         }
// //     }));
// // });
// //
// // self.addEventListener('onupdatefound ', (updateEvent: any) => {
// //     console.log('reg0', updateEvent);
// //     return Object.keys(updateEvent).map(key => {
// //         console.log('key: ', key);
// //         return key;
// //     });
// // });
// // self.addEventListener('onstatechange', (stateEvent: any) => {
// //     if (stateEvent.state === 'installed') {
// //         if (navigator.serviceWorker.controller) {
// //             console.log('reg-n');
// //             // At this point, the old content will have been purged and
// //             // the fresh content will have been added to the cache.
// //             // It's the perfect time to display a 'New content is
// //             // available; please refresh.' message in your web app.
// //             console.log('New content is available; please refresh.');
// //         } else {
// //             // At this point, everything has been precached.
// //             // It's the perfect time to display a
// //             // 'Content is cached for offline use.' message.
// //             console.log('Content is cached for offline use.');
// //         }
// //     }
// // });
// // return registration.initializeWorker();
