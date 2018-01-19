import { Observable } from '@reactivex/rxjs';
import { ReactText } from 'react';

enum ValidatorTest {
	// Just one match should return a false
	negate
}

// negate = (val: string, patterns: string | string[]): ValidatorTest => {
// 		let response = 0;
// 		if (patterns && patterns.length) {
// 			for (let partern of patterns) {
// 				response += val.match(partern).length;
//
// 				if (response > 0) {
// 					return false;
// 				}
// 				return true;
// 			}
// 		} else {
// 			// response += val[0].match(patterns).length;
// 		}
// 	},

	// Any match will return true
	// has = (...val, ...patterns): boolean => {
	// 	let response = [];
	// 	for (let partern of patterns) {
	// 		response = [...response, val[0].match(partern)];
	// 		if (response.length > 0) {
	// 			return false;
	// 		}
	// 	}
	// 	return true;
	// },
	//
	// A match
	// exact = async (val: string | number, stringPtern: string): boolean => {
	// 	return  '' + val  === stringPtern;
	// }
// }

// ValidatorTest.negate('one2thre', '2')
// 	.then(res => {
// 		console.log('negate', res);
// 	}
// );
//
// ValidatorTest.has('one2thre', '2')
// 	.then(res => {
// 		console.log('haS', res);
// 	}
// );
//
// ValidatorTest.exact('one2thre', '2')
// 	.then(res => {
// 		console.log('exact', res);
// 	}
// );
//

export interface Validation {
}

export interface Validator {
	validation: (string | string);
	[modelKey: string]: string;
}

export interface InputModel {
	id: string;
	type: string;
	value: (string | number | null);
	validator?: Validator;
}

export interface ContactFormData extends FormData {
	name: string;
	location: string;
	email: string;
	phone?: string;
}

export interface FormData {
	subject: string;
	text: string;
	date?: (Date | number | string);
}

export const NEW_CONTACT_DATA = {
	name: 'inti',
	location: 'init',
	email: 'init',
	phone: 'init',
	subject: 'init',
	text: 'init',
};

export interface FormHandler {
	changeHandler: (key: string, nextVal: ReactText) => void;
	submitHandler: () => void;
	isValid: () => Promise<{}>;
	updateModel: (key: string, value: ReactText) => void;
	model$: () => Observable<any>;
	getModel: (key: string) => InputModel;
}