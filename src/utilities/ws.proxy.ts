/*
 * Copyright (c) 2017. 1o1 :{P
 */

import * as url from 'url';

console.log('setting Proxy');
declare var window;

import { BehaviorSubject, Observable } from '@reactivex/rxjs';

const dataSource: BehaviorSubject<string> = new BehaviorSubject<string>('WebSocket Message BehaviorSubject');
export const dataSource$: Observable<string> = dataSource.asObservable();

// Templated from http://air.ghost.io/debugging-websockets-using-js-proxy-object/
let WebSocketProxy: {} = new Proxy(window.WebSocket, {
	construct: function (target: any, args: any) {

		// create WebSocket instance
		const instance: WebSocket = new target(...args);

		// WebSocket "onmessage" handler
		const messageHandler = (event) => {
			if (event.data) {
				dataSource.next(event.data);
			}
		};

		// remove event listeners
		instance.removeEventListener('message', messageHandler);

		// add event listeners
		instance.addEventListener('message', messageHandler);

		// proxy the WebSocket.send() function
		const sendProxy = new Proxy(instance.send, {
			apply: function (target: any, thisArg: any, args: any) {
				window.EventTarget.prototype.dispatchEvent('SocketSending', args);
				target.apply(thisArg, args);
			}
		});

		// replace the native send function with the proxy
		instance.send = sendProxy;

		// return the WebSocket instance
		return instance;
	},
});

window.WebSocket = WebSocketProxy;

WebSocketProxy = new Proxy(window.WebSocket, {
	construct: function (target: any, args: any) {
		// create WebSocket instance

		return new target(...args);
		// return the WebSocket instance
	},
});

// replace the native WebSocket with the proxy

window.WebSocket = WebSocketProxy;
console.log('WINDOW', window);
console.log('setting Message Proxy', new window.MessageEvent('foo'));

// let messageProxy = new Proxy(window.MessageEvent,{
// 	construct (target: any, argArray: any) {
// 		target = Object.assign( target, {forCaching: {}});
// 		let instance = new target(...argArray);
// 		console.log('constructor', argArray, Reflect.ownKeys(target));
// 		return instance;
// 	},
// });
window.EventTarget.prototype.addEventListener('SocketSending')
