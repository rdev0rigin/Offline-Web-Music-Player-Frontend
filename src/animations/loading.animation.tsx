import * as React from 'react';
import { ReactElement } from 'react';
const cuid = require('cuid');
export interface LoaderAnimation {
	render: () => void;
	stop: () => void;
}

export function loaderAnimation(): LoaderAnimation {
	let eleRef;
	let ghostEle;

	function init(ele: HTMLDivElement, that = this){
		eleRef = ele;
		ghostEle = eleRef.cloneNode(false);
		if(!this.eleRef.has('id')){
			this.eleRef.id = cuid()
		}
		const containerAttr: string[] = [
			'position:relative',
			'display:grid',
			`grid-template-columns:repeat(5, calc(${(eleRef.getAttribute('height'))})`,
			`grid-template-rows:${eleRef.getAttribute('height')}`,
			'grid-template-areas:"Cell0 Cell1 Cell2 Cell3 Cell4"',
			'transform:translate(-100%, -100%)',
			'transition(all, .4s, linear',
			'id:Loader',
		];

		for (let atr of containerAttr) {
			const prop = atr.split(':');
			ghostEle.attributes[prop[0]] = prop[1];
		};

		for(let i = 0; i < 4; i++) {
			ghostEle.appendChild(
		<div
					className={`Cell${i}`}
					key={i}
				/>
			)
		};
		const animationLoop: any = setInterval(() => {
			ghostEle.className = `${ghostEle.className} pulse-spin}`;

		});
	}

	return {
		load: (target: HTMLDivElement) => {
			init(target);
		},
		render: () => {
			eleRef.insertNode(this.ghostEle);
		},
		stop: () => {
			ghostEle.hidden = true;
			setTimeout(
				() => {
				ghostEle.cladisplay = 'none';
			},
			30000);
		}
	}
};
