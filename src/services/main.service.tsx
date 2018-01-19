const cuid = require('cuid');
import{ DCM_CONFIG } from '../settings/config';
import { responseSocket$ } from './web-socket.service';
import { SoundSRC } from '../models/app.model';
import { SoundMeta } from '../models/sound.model';

export function getSoundsMetaData(callback: (res: SoundMeta[]) => void): void {
	const PATH = 'GET_SOUNDS_META';
	const sub = responseSocket$(PATH, {})
		.subscribe( (response) => {
			console.log('Event Response: GET_ALL_SOUNDS_DETAILS', response);
			callback(response);
			sub.unsubscribe();
		});
}

export async function getSoundData(soundId: string): Promise<SoundSRC> {
	const PATH = `//localhost:8081/${soundId}/mp3/${soundId}.mp3`;
	let response = await fetch(PATH);
	return await response.body.getReader().read();
}

export function sessionID(): string {
	let sessionId: string;
	sessionId = localStorage.getItem(DCM_CONFIG.sessionKey);
	if (!sessionId) {
		sessionId = cuid();
		localStorage.setItem(DCM_CONFIG.sessionKey, sessionId);
	}
	return sessionId;
}
