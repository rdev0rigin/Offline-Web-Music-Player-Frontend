import { dummySound, SoundMeta } from './sound.model';

export const MEDIA_PLAYER_INITIAL_STATE: MediaPlayerState = {
	playList: [],
	currentTrack: dummySound(),
	currentIndex: 0,
	currentSeek: 0,
	dataReady: false
};

export interface MediaPlayerState {
	playList: SoundMeta[];
	dataReady: boolean;
	currentIndex: 0;
	currentTrack?: SoundMeta;
	currentSeek: number;
}

export interface MediaPlayerProps {
	style?: {};
	isControlled?: boolean;
	playList?: SoundMeta[];
	playListHandler?: (e: React.SyntheticEvent<Event>, t: SoundMeta) => void;
	controllerEvents?: (type: string) => void;
}
