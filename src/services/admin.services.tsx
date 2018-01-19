/*
 * Copyright (c) 2018. 1o1 :{P
 */

import { DCM_CONFIG } from '../settings/config';
import { privateSocket, ResponseTransport } from './web-socket.service';
import { SoundMeta } from '../models/sound.model';

export function submitNewSound(
	soundMeta: any,
	soundFile: any
): void {
	console.log('New Sound', soundMeta, soundFile);
	privateSocket(
		{
			event: 'PRIVATE::NEW_SOUND_META',
			payload: {
				soundMeta: soundMeta,
				jwt: localStorage.getItem(DCM_CONFIG.jwtKey),
				sessionId: localStorage.getItem(DCM_CONFIG.sessionKey)
			},
			callback: (response) => {
				if (response.ok) {
					console.log('sound meta submitted');
					uploadSoundFile(
						response.payload,
						soundFile
					);
				}
			}
		}
	);
}

export function authorize(
	ack: (authorized: ResponseTransport) => void
): void {
	const PATH = 'PRIVATE::AUTHORIZE';
	console.log('calling authorize');
	privateSocket({
		event: PATH,
		payload: {
			jwt: localStorage.getItem(DCM_CONFIG.jwtKey),
			sessionId: localStorage.getItem(DCM_CONFIG.sessionKey)
		},
		callback: ack
	});
}

export function loginHandler (
	credentials: {
		userName: string,
		pwd: string
	},
	ack: any
): void {
	const EVENT: string = 'LOGIN';
	privateSocket({
		event: EVENT,
		payload: {
			credentials: credentials,
			sessionId: localStorage.getItem(DCM_CONFIG.sessionKey)
		},
		callback: ack
	});
}

export function updateTrackProp(
	update: SoundMeta
): void {
	privateSocket({
		event: 'PRIVATE::UPDATE_SOUND_META',
		payload: {
			soundMeta: update,
			jwt: localStorage.getItem(DCM_CONFIG.jwtKey),
			sessionId: localStorage.getItem(DCM_CONFIG.sessionKey),
		},
		callback: (response: any) => {
			!response.ok
				? alert('Error Updating' + response.message)
				: console.log('Update Response', response);
		}
	});
}

export function uploadSoundFile(
	soundDetails: SoundMeta,
	file: File
): void {
	privateSocket({
		event: 'PRIVATE::FILE_UPLOAD',
		payload: {
			soundDetails: soundDetails,
			file: file
		},
		jwt: localStorage.getItem(DCM_CONFIG.jwtKey),
		callback: (response) => {
			!response.ok
				? alert('Error uploading file ' + response.message)
				: console.log('Upload response', response);
		}
	});
}

export function removeSound(id: string, callback: (response: any) => void): void {
	const REMOVE_EVENT = 'PRIVATE::DELETE_SOUND';
	privateSocket({
		event: REMOVE_EVENT,
		payload: {
			id: id,
			jwt: localStorage.getItem(DCM_CONFIG.jwtKey),
			sessionId: localStorage.getItem(DCM_CONFIG.sessionKey),
		},
		callback
	});
}