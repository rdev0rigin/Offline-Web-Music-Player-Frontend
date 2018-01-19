export interface SoundMeta {
	_id?: string;
	title?: string;
	description?: string;
	duration?: number;
	createdAt?: string;
	publishedOn?: string;
}

export interface  SoundData extends SoundMeta {
	soundData: Buffer | string;
	videoData: Buffer | string;
	imgData: Buffer | string;
}

export interface SongInsights extends SoundData {
	likes: number;
	shares: number;
	downloads: number;
	plays: number;

}

export function dummySound(): SoundMeta {
	return {
		_id: 'R-Dev;)',
		title: 'R-Dev;)',
		description: 'R-Dev;)',
		duration: 0,
		createdAt: 'R-Dev;)',
		publishedOn: 'R-Dev;)',
	};
}
