import * as React from 'react';
import { render } from './render';
import { AppContainer } from 'react-hot-loader';
import { App } from './app';

render(
	<AppContainer>
		<App />
	</AppContainer>,
);

declare const module: any;
declare const require: any;

if (module.hot) {
	module.hot.accept('./app', () => {
		const NewApp = require('./app').App;
		render(
			<AppContainer>
				<NewApp />
			</AppContainer>,
		);
	});
}
