import { stores } from 'koa-session';

const store = {};

export const sessionStore: stores = {
	get: (key) => store[key],
	set: (key, value) => store[key] = value,
	destroy: (key) => delete store[key],
};
