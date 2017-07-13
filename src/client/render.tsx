import * as React from 'react';
import * as ReactDOM from 'react-dom';

const root = window.document.createElement('div');
document.body.appendChild(root);

export function render(element: React.ReactElement<any>) {
	ReactDOM.render(element, root);
}
