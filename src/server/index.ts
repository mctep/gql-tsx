import { graphiqlKoa, graphqlKoa } from 'graphql-server-koa';
import * as Koa from 'koa';
import * as bodyparser from 'koa-bodyparser';
import * as koaLogger from 'koa-logger';
import * as Router from 'koa-router';
import * as session from 'koa-session';
import * as url from 'url';
import * as env from './env';
import { logger } from './logger';
import { schema } from './schema';
import { authRequired, login, passport } from './services/passport';
import { responseTime } from './services/response-time';
import { sessionStore } from './services/session-store';

const app = new Koa();
const router = new Router();

app.use(responseTime);
app.use(koaLogger());
app.use(bodyparser());

app.keys = [env.SECRET_KEY];
app.use(session({ key: 'sid', store: sessionStore }, app));
app.use(passport.initialize());
app.use(passport.session());

router.get('/', ctx => {
	const { user } = ctx.state;
	ctx.body = (user && `Hello, ${user.username}`) || 'Please login';
});

router.post(
	'/graphql',
	authRequired,
	graphqlKoa(context => ({ schema, context })),
);

router.get(
	'/graphiql',
	authRequired,
	graphiqlKoa(ctx => {
		const xProxyPath = ctx.req.headers['x-proxy-path'];
		const proxyPath =
			(typeof xProxyPath === 'string' && url.parse(xProxyPath).pathname) || '';

		return {
			endpointURL: `${proxyPath}/graphql`,
		};
	}),
);

router.post('/login', login);

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(env.API_PORT, () =>
	logger.log(`Server started at ${env.API_PORT} port`),
);
