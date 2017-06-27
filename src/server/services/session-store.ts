import * as urlUtil from 'url';
import { stores } from 'koa-session';
import * as koaRedis from 'koa-redis';
import { SESSION_STORE_URL } from '../env';

const store = {};

let sessionStore: stores = {
	get: (key) => store[key],
	set: (key, value) => store[key] = value,
	destroy: (key) => delete store[key],
};

const url = urlUtil.parse(SESSION_STORE_URL);

if (url.protocol === 'redis:') {
	sessionStore = koaRedis({ url: SESSION_STORE_URL });
}

export { sessionStore };

