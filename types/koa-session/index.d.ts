// Type definitions for koa-session 3.0
// Project: https://github.com/koajs/session
// Definitions by: Yu Hsin Lu <https://github.com/kerol2r20/>
// Definitions: https://github.com/kerol2r20/DefinitelyTyped

/* =================== USAGE ===================

    import session = require("koa-session");
    import Koa = require('koa');

    var app = new Koa();
    app.use(session(app));

 =============================================== */

declare module 'koa-session' {
	import * as Koa from 'koa';

	namespace koaSession {
		interface Options {
			/**
			 * cookie key (default is koa:sess)
			 */
			key?: string;

			/**
			 * maxAge in ms (default is 1 days)
			 * 'session' will result in a cookie that expires when session/browser is closed
			 * Warning: If a session cookie is stolen, this cookie will never expire
			 */
			maxAge?: number | 'session';

			/**
			 * can overwrite or not (default true)
			 */
			overwrite?: boolean;

			/**
			 * httpOnly or not (default true)
			 */
			httpOnly?: boolean;

			/**
			 * signed or not (default true)
			 */
			signed?: boolean;

			/**
			 * You can store the session content in external stores(redis, mongodb or other DBs)
			 */
			store?: koaSession.Store;

			/**
			 * Hook: valid session value before use it
			 */
			valid?(...rest: Array<any>): void;

			/**
			 * Hook: before save session
			 */
			beforeSave?(...rest: Array<any>): void;
		}

		interface Session {
			/**
			 * Returns true if the session is new
			 */
			isNew: boolean;

			/**
			 * Set cookie's maxAge
			 */
			maxAge: number;

			/**
			 * Save this session no matter whether it is populated
			 */
			save(): void;
			[propName: string]: any;
		}

		interface Store {
			/**
			 * get session object by key
			 */
			get(key: any): any;

			/**
			 * set session object for key, with a maxAge (in ms)
			 */
			set(key: any, sess: any, maxAge?: number): any;

			/**
			 * destroy session for key
			 */
			destroy(key: any): void;
		}
	}

	function koaSession(CONFIG: koaSession.Options, app: Koa): Koa.Middleware;

	function koaSession(app: Koa): Koa.Middleware;

	module 'koa' {
		interface Context {
			session: koaSession.Session;
		}
	}

	export = koaSession;
}
