/*
 * Copyright (c) 2018. 1o1 :{P
 */

import { mixin } from './utilities';

var objectProto = Object.getPrototypeOf(BlockChain);
var ownProps = objectProto.defineProperties;

export function BlockChain(props: {[prop: string]: any}): void {
	Object.keys(props)
		.forEach(key => {
			this[key] = props[key];
		}
	);
	this.hash;
	this.add();
	crypto.subtle.digest(
		'sha256',
		ownProps.toString()
	).then(
	(res) => {
		this.hash = res;
	});
}

Object.getPrototypeOf(BlockChain).nextBlock = (props: {[prop: string]: any}) => {

};

BlockChain.prototype.add = (update) => {
	const nextContent = mixin(this.contents.entries(), update);
};

let propFoo = {bat: 'metal'};

console.log('BC', new BlockChain(propFoo));
console.log('BC no new', BlockChain(propFoo));
