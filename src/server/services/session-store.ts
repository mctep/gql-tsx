import * as koaRedis from 'koa-redis';
import * as koaSession from 'koa-session';
import * as urlUtil from 'url';
import { SESSION_STORE_URL } from '../env';

const store: any = {};

let sessionStore: koaSession.Store = {
	get: key => store[key],
	set: (key, value) => (store[key] = value),
	destroy: key => delete store[key],
};

if (SESSION_STORE_URL) {
	const url = urlUtil.parse(SESSION_STORE_URL);

	if (url.protocol === 'redis:') {
		sessionStore = koaRedis({ url: SESSION_STORE_URL });
	}
}

export { sessionStore };
