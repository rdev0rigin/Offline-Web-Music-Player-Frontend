import * as IO from 'socket.io-client';
import { SoundMeta } from '../models/sound.model';
import { Observable } from '@reactivex/rxjs';
import { getEventCached, setEventCache } from '../utilities/registerServiceWorker';

const io = IO('localhost:2820', {
	transports: ['websocket'],
	secure: true,
});

console.log('connected socket? ', io);

// io.on('error', (evt) => {
// 	console.log('ERROR; SOCKET', evt);
// });
//
// io.on('connect', (socket) => {
// 	console.log('connected', socket);
// });

export interface ResponseTransport {
	ok: boolean;
	message?: string;
	body?: any;
	payload?: any;
	details?: SoundMeta;
	data?: any;
}

export function responseSocket$ (
	event: string,
	payload: any,
): Observable<any> {
	console.log('response socket', payload, event);
	return Observable.create( async (observer) => {
		let response;
		if ('serviceWorker' in navigator) {
			response = await getEventCached(event);
		}
		if (response && response.ok) {
			observer.next(response);
			observer.complete();
		}
		io.emit(event, payload, (response) => {
			if (response.ok) {
				if ('serviceWorker' in navigator) {
					setEventCache(event, response);
				}
				observer.next(response.payload);
			} else {
				observer.error('Error: ', response.message);
			}

		});
	});
}

export function privateSocket(parameters: any): void {
	console.log('private event', parameters);
	io.emit(parameters.event, parameters.payload, parameters.callback);
}
