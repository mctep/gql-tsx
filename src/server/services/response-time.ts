import * as Koa from 'koa';

export const responseTime: Koa.Middleware = async (ctx, next) => {
	const start = new Date;
	await next();
	const ms = new Date().getTime() - start.getTime();
	ctx.set('X-Response-Time', `${ms}ms`);
}
