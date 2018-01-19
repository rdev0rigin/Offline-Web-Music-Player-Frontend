import { dummySound, SoundMeta } from './sound.model';

export interface AdminComponentState  {
	dataReady: boolean;
	tracks: SoundMeta[];
	currentTrack: SoundMeta;
}

export const ADMIN_INITIAL_STATE = {
	tracks: [],
	currentTrack: dummySound(),
	dataReady: false
};

export interface AdminComponentProps {
	session: string;
	jwt: Buffer | string;
	history: any;
}
