// Type definitions for koa-redis 3.0
// Project: https://github.com/koajs/koa-redis
// Definitions by: Nick Simmons <https://github.com/nsimmons>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'koa-redis' {
	import * as koaSession from 'koa-session';
	import { ClientOpts } from 'redis';

	namespace koaRedis {
		interface Options extends ClientOpts {
			duplicate?: boolean;
			client?: any;
		}
	}

	function koaRedis(options: koaRedis.Options): koaSession.Store;

	export = koaRedis;
}
