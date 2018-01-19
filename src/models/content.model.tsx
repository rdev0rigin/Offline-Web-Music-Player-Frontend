
/*
 * Copyright (c) 2018. 1o1 :{P
 */

import { mixin } from '../utilities/utilities';

declare type ContentType = string;

export interface ContentPackage {
	slug: string;
	data: any;
	componentName: string;
	type: ContentType;
}

export interface ContentPacket {
	slug: string;
	hash: Buffer;
	data?: {} | any[] | string;
	type: string;
	component: string;
	ok: boolean;
	message?: string;
	source?: string;
	encoding?: string;
}

export interface ContentPack {
	// type: any;
	// hash: ArrayBuffer;
	// component: string;
	[prop: string]: ContentPacket | any;
}

export interface ContentComponent {
	[componentName: string]: Map<ContentType, ContentPack>;
}

export interface ContentComponents {
	sounds: ContentComponent;
	contact: ContentComponent;
	mediaPlayer: ContentComponent;
	about: ContentComponent;
	footer: ContentComponent;
	navbar: ContentComponent;
	global: ContentComponent;
	stats: ContentComponent;
	metrics: ContentComponent;
}

export interface ContentBlock {
	history: Set<ContentBlock>;
	hash: ArrayBuffer;
	lastUpdated: Date | number;
	components: ContentComponents;
}

export interface PackBundle {
	componentName: string;
	pack: ContentPack;
}

export interface BlockComponent {
	[componentName: string]: Map<string, any>;
}


const ContentBlock = {
	lastUpdated: Date.now(),
	sounds: new Map<ContentType, ContentPack>(),
	contact: new Map<ContentType, ContentPack>(),
	mediaPlayer: new Map<ContentType, ContentPack>(),
	about: new Map<ContentType, ContentPack>(),
	footer: new Map<ContentType, ContentPack>(),
	social: new Map<ContentType, ContentPack>(),
	navbar: new Map<ContentType, ContentPack>(),
	global: new Map<ContentType, ContentPack>(),
	stats: new Map<ContentType, ContentPack>(),
	metrics: new Map<ContentType, ContentPack>(),
};
