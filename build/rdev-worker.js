/*
 * Copyright (c) 2017. 1o1 :{P
 */
console.log('SW in da hizzy', self, this);
const version = '0.0.32';
const CACHE_KEY = 'rdev-worker-cache::' + version ;

self.addEventListener('message', async (message) => {
    const openCache = await caches.open(CACHE_KEY);

    switch(message.type) {
        case'SOCKET::MESSAGE':
            console.log('WORKER::socket message  \n ', message);
            const req = transformMessageToRequest(message);
            cacheWebSocketMessage(req);
            break;
        case'CACHE::VERSIONS':
            console.log('versions', message);
            break;
        case'CACHE::EVENT_RESPONSE':
            console.log('Event', message);
            break;
        case'CACHE_HISTORY::GET_LAST':
            console.log('last', message);
            break;
        case'CACHE::CHECK_GET':
            const response = await isCached();
            console.log('get cache', response);
            message.payload.ack(response);
            break;
        default:
            console.log('ERROR Worker: Message Type Not Recognized', message);
    }
});

self.addEventListener('install', (evt) => {
    console.log('install', evt);

    // verify if content is stale
    // evt.waitUntil(preCache());

    // calculate new values for content integrity

    // set values and chain history
});

self.addEventListener('active', (evt) => {
    // console.log('active', evt);

    // listen for any requests or procedure calls

    // manage stream requests

    // manage inter client-server messaging

});

self.addEventListener('fetch', (evt) => {
    if (evt.response) {
        evt.respondWith(caches.match(evt.request, {
            cacheName: CACHE_KEY
        }));
    }

    // console.log('url', evt.request);
    if (evt.request) {
        const protocol = evt.request.url.split(':')[0];
        if (protocol === 'ws') {
            const response = fetch(evt.request);
            evt.respondWith(response);
        }

        if(evt.request.headers.get('range')) {
            evt.respondWith(rangeResponder(evt));
        } else {
            evt.respondWith(responder(evt));
        }
    }
});

async function rangeResponder(evt) {

    // Number(/^bytes\=(\d+)\-$/g.exec(event.request.headers.get('range'))[1]);
    // const pos = Number(/^bytyes\=(\d+)\-$/g.exec(evt.request.headers.get('range'))[1]);
    const rangeReq = evt.request.headers.get('range');
    const regMatchs = /^bytes\=(\d+)\-$/g.exec(rangeReq);
    console.log('reg', regMatchs);
    const poss = regMatchs.length > 1 ?  regMatchs[1] : regMatchs[-0];
    const pos  = Number(poss);

    // console.log('Range?', evt.request);
    const matched = await caches.match(evt.request,
        {
            cacheName: CACHE_KEY
        });
    if (matched) {
        // console.log('matched range', matched);
        return matched;
    }
    const fetched = await fetch(evt.request);
    // console.log('fetched', fetched);
    if (fetched) {
       console.log('Error: fetching ', evt.request);
       return;
    }
    const ab = await fetched.arrayBuffer();
    const openCache = await caches.open(CACHE_KEY);
    const response = await new Response(
        ab.slice(pos),
        {
            status: 206,
            statusText: 'partial',
            headers: [
                [
                    'Content-Range',
                    'bytes ' + pos + (ab.byteLength - 1) + '/' + ab.byteLength
                ]
            ]
        }
    );
    await openCache.put(evt.request, response);
    return response;
}

async function responder(evt) {
    const openCache = await caches.open(CACHE_KEY);
    let matched = await openCache.match(evt.request);
    if (matched) {
        return matched;
    }
    const response = await fetch(evt.request);
    await openCache.put(evt.request, response.clone());
    return response;
}

async function transformMessageToRequest(message){
    const regMatch = await /(\d+)/g.exec(message.data.payload);
    const data = message.data.payload.replace(regMatch[0], '');

    console.log('Data', data);

    const payload = JSON.parse(data[0]);
    const event = payload.event;
    return new Request(event, {method: 'GET'});
}
async function cacheWebSocketMessage(req) {
    const openCache = await caches.open(CACHE_KEY);
    const res = new Response(payload);
    console.log('socket caching', res, req, event, payload);
    await openCache.put(req, res);
}

async function preCache(componentNames) {
    componentNames.forEach(
        async (componentName) => {
            const componentCache = await caches.open(componentName);
            const pack = componentCache.match()
        }
    );
    // console.log('KEYS', cache.keys(), cache);
    // const openCache = await caches.open(CACHE_KEY);
    // await openCache.addAll([
    //         'sounds',
    //         'contact',
    //         'mediaPlayer',
    //         'about',
    //         'footer',
    //         'navbar',
    //         'global',
    //     ]);
}

async function isCached(event) {
    console.log('hit', event);
    const openCache = await caches.open(CACHE_KEY);
    const req  = new Request(event);
    const response = await openCache.match(req);
    if (response){
        return {ok: true, response: response};
    }
    return {ok: false};
}

async function whatVersion(componentName){

}
