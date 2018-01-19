import { SoundMeta } from './sound.model';

export interface DComposedMusicAppState extends ComponentHeights {
	dataReady: boolean;
	hideNavbar: boolean;
	tracks: SoundMeta[];
	showSticky: boolean;
	scrollY: number;
	yLength: number;
	displayHeight: number;
	currentView: string;
	viewHeight: number;
	arrowStyle: string;
}

export interface ComponentHeights {
	componentHeights?: {
		[id: string]: number;
	};
}
export const APP_INITIAL_STATE = {
	dataReady: true,
	hideNavbar: false,
	tracks: [],
	showSticky: true,
	scrollY: null,
	yLength: null,
	displayHeight: null,
	currentView: null,
	viewHeight: null,
	componentHeights: {},
	arrowStyle: ''
};

export interface SoundSRC {
	get?: any;
	ok?: boolean;
	sound_id?: string;
	src?: string;
}
