import { SoundMeta } from './sound.model';

export interface ResponseSocketTransport {
	ok?: boolean;
	data?: any | Uint8Array;
	details?: SoundMeta;
	body?: any | SoundMeta | SoundMeta[];
	payload?: any;
	error?: boolean;
	message?: string;
}
