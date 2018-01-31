import {merge} from 'lodash';

console.log('merge', merge({}, {foo: 'bar'}));
require('smoothscroll-polyfill').polyfill();

import { initializeWorker } from './utilities/registerServiceWorker';

if ('serviceWorker' in navigator) {
	console.log('SW boot');
	initializeWorker().then(() => {
		console.log('sw done registering');
		boot();
	});
} else {
	console.log('normal boot');
	boot();
}

import './styles/app.style.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app';
import { Router } from 'react-router';
import history from './routers/router.history';

function boot(): Element {

	return(
		ReactDOM.render(
			<Router history={history}>
				<App />
			</Router>,
			document.getElementById('root')
		)
	) as Element;
}
