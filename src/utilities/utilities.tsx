/*
 * Copyright (c) 2018. 1o1 :{P
 */

import { Observable } from '@reactivex/rxjs';
import { SoundMeta } from '../models/sound.model';
import { SoundSRC } from '../models/app.model';
import { isUndefined } from 'util';

/**
 * Mixin pattern from Emitter
 */
export function mixin<T, K extends T>(x: T, y: K): K {
	if (typeof x === typeof {}
	&& typeof y === typeof {}) {
		for (let key of Object.keys(x)) {
			y[key] = x[key];
		}
		return y;
	}
}

/**
 * Hash string.
 * @param {string} dataString
 * @param {string} algo
 * @returns {Promise<string>}
 */
export async function hash(dataString: string, algo: string = 'sha-256'): Promise<string> {
	const buffer = new Buffer(dataString, 'utf-8');
	return await window.crypto.subtle.digest(algo, buffer).toString();
}

export function counter (mod?: number): {
	increment: (offset: number) => void;
	decrement: (offset: number) => void;
	getCount: number;
} {
	let count = mod ? 0 % mod : 0;
	return {
		increment: (offset: number = 0) => count++ + offset,
		decrement: (offset: number = 0) => count-- + offset,
		getCount: count
	};
}

export const loadDependency = (url: string): Observable<boolean> => {
	return Observable.create(observer => {
		let node = document.createElement('script');
		node.async = true;
		node.src = url;
		node.onload = (e) => {
			observer.next(e);
		};
		document.head.appendChild(node);
	});
};

export function convertToArray(map: Map<any, any> | {[index: string]: {[prop: string]: any}}): any[] {
	let newArray = [];
	for (let key of Object.keys(map)) {
		newArray = [...newArray, map[key]];
	}
	return newArray;
}

export function bufferArrayToBase64(arrayBuffer: ArrayBuffer, format: string = 'audio/mp3'): string {
	if (arrayBuffer) {
		const base64Data = `data:${format};base64,${btoa(
			new Uint8Array(arrayBuffer)
				.reduce((data, byte) => data + String.fromCharCode(byte), '')
		)}`;
		return base64Data;
	} else {
		return 'boo';
	}
}

export function formatSeconds(seconds: number): string {
	return `${Math.trunc(seconds / 60) < 10
		? '0' + Math.trunc(seconds / 60)
		: Math.trunc(seconds / 60) }:${Math.trunc(seconds % 60) < 10
		? '0' +  Math.trunc(seconds % 60)
		: Math.trunc(seconds % 60)}`;
}

export async function testAndSetAudioProps(soundFile: File): Promise<SoundMeta> {
	return new Promise((resolve, reject): any => {
		const reader: FileReader = new FileReader();
		reader.onloadend = (evt: Event) => {
			if (reader.readyState === FileReader['DONE']) {
				console.log('file reader DONE');
				const urlString = new URL(reader.result);
				const audioELe = new Audio(urlString.toString());
				const response = {
					duration: audioELe.duration,
					data: reader.result,
					encode: HEADER_TO_MIME(reader.result.slice(0, 6))
				};
				console.log('new sound', response);
				resolve(response);
			}
		};
		reader.readAsDataURL(soundFile);
	});
}

export function isThere<T>(arg:  T ): T {
	if (isUndefined(arg)) {
		return null;
	}
	return arg;
}

export function HEADER_TO_MIME(header: string): string {
	switch (header.slice(0, 6)) {
		case'464f52':
			return 'aif';
		case'494433':
			return 'mp3';
		case'524946':
			return 'wav';
		case'664C61':
			return 'flac';
		case'000001':
			return 'mp4';
		default:
			return 'unknown';
	}
}
