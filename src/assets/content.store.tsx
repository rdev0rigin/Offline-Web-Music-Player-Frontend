/*
 * Copyright (c) 2018. 1o1 :{P
 */

import { BehaviorSubject } from '@reactivex/rxjs';
import { ContentBlock, ContentPack, ContentPackage, PackBundle } from '../models/content.model';
const cuid = require('cuid');

export interface ContentStore {
	id: string;
	hash: () => any;
	getContent: (token: string | number, componentName: string) => ContentPack;
	setContent: (contentPackage: ContentPackage) => Promise<void>;
}

function contentStore(): ContentStore {
	let ContentMap: BehaviorSubject<ContentBlock> = new BehaviorSubject<ContentBlock>({} as ContentBlock);
	const eid: string = cuid();
	const hash = new Buffer('not set');

	async function updateStore(componentName: string, contentPackage: ContentPackage | ContentPackage[]): Promise<void> {
		const packBundle: PackBundle = await packBundler(componentName, contentPackage as ContentPackage);
		const currentStore = ContentMap.value;
		let componentBundle = currentStore.components[componentName];

		for (let key of Object.keys(packBundle.pack)) {
			const type = packBundle.pack[key].type;
			const content = componentBundle.get(type);
			const updatedContent = { ...content, [key]: packBundle.pack[key]};
			componentBundle.set(key, updatedContent);
		}
		const updatedHash = await crypto.subtle.digest(
			'sha256',
			this.hash = await new Buffer(this.toString() + currentStore.toString())
		);
		const updatedStore = {
			...currentStore,
			components: {
				...currentStore.components,
				...componentBundle,
			},
			hash: updatedHash
		};
		ContentMap.next(updatedStore);
	}

	async function packBundler(componentName: string, ...contentPackage: ContentPackage[]): Promise<PackBundle> {
		let pack: ContentPack = {} as ContentPack;
		for (let packetData of contentPackage) {
			pack = {
				...pack,
				[packetData.slug]: {
					createDate: Date.now().toString(),
					slug: packetData.slug,
					hash: await crypto.subtle.digest('sha256', packetData.data.toString()),
					data: packetData.data,
					component: packetData.componentName,
					type: packetData.type,
					ok: true
				}
			};
		}
		return {componentName: componentName, pack: pack};
	}

	return {
		id: eid,
		hash : () => this.hash,
		getContent(slug: string | number, componentName: string): ContentPack {
			const store = ContentMap.value;
			return store.components[componentName][slug];
		},

		async setContent(contentPackage: ContentPackage | ContentPackage[]): Promise<void> {
			const arrifiedContentPackage: ContentPackage[] = Array.isArray(contentPackage) ? contentPackage : [contentPackage];
			await updateStore(arrifiedContentPackage[0].componentName, arrifiedContentPackage);
		    return;
		}
	};
}

contentStore.constructor.prototype = {
	constructor(target: ContentStore, args: any) {
		console.log('target', target);
	}
};
