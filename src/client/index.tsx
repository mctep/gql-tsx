import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { App } from './app';

const root = window.document.createElement('div');
document.body.appendChild(root);

function render(Component) {
	ReactDOM.render((
		<AppContainer>
			<Component />
		</AppContainer>
	), root);
}

render(App);

declare const module: any;
declare const require: any;

if (typeof module !== 'undefined') {
	if (module.hot) {
		module.hot.accept('./app', () => {
			render(require('./app').default)
		});
	}
}

