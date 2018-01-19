
/*
 * Copyright (c) 2018. 1o1 :{P
 */

import { Observable } from '@reactivex/rxjs';

export interface UserCache {
	local: any;
	twitter: any;
}

let paths = {
	hash: '0/',
	CURRENT_VERSIONS: 'WEB_WORKER::VERSIONS_LIST::GET',
	WORKER_URL: '/rdev-worker.js',
	PRE_CACHE: 'PRE_CACHE'
};
let worker;

export async function initializeWorker(): Promise<void> {
	let workerRegistration =
		await navigator.serviceWorker.getRegistration();
	if (!workerRegistration) {
		await navigator.serviceWorker
			.register(paths.WORKER_URL)
			.then(registration => {
				if (registration.installing) {
					worker = registration.installing;
				}
				if (registration.active) {
					worker = registration.active;
				}
				if (registration.waiting) {
					worker = registration.waiting;
				}
				worker.addEventListener('statechange', (state) => {
					if (state === 'installing'){
						console.log('installing on reg worker');
						// worker.waitUntil(worker.preCache(['footer', 'sounds']))
						worker.postMessage({
							type: 'TEST'
						});
					}
				});
		});
	}
}

export async function getEventCached(event: string): Promise<any> {
	const openCache = await caches.open(paths.PRE_CACHE);
	const request = new Request(event);
	return await openCache.match(request);
}

export async function setEventCache(event: string, eventResponse: any): Promise<void> {
	const openCache = await caches.open(paths.PRE_CACHE);
	const request = new Request(event);
	const response = new Response(eventResponse);
	// worker.postMessage({
	// 	type: 'CACHE::EVENT_RESPONSE',
	// 	payload: 'FOO BAT METAL'
	// });
	await openCache.put(request, response.clone())
		.catch(err => console.log('Error: Putting cached response ', err));

}
