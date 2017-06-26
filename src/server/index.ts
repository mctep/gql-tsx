import * as url from 'url';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyparser from 'koa-bodyparser';
import * as logger from 'koa-logger';
import * as session from 'koa-session';
import { graphqlKoa, graphiqlKoa } from 'graphql-server-koa';
import { sessionStore } from './services/session-store'
import { schema } from './schema';
import { responseTime } from './services/response-time';
import { passport, login, authRequired } from './services/passport';

const PORT = 3002;

const app = new Koa();
const router = new Router();

app.use(responseTime);
app.use(logger());
app.use(bodyparser());

app.keys = ['some secret key. needs to remove'];
app.use(session({ key: 'sess', store: sessionStore }, app));
app.use(passport.initialize());
app.use(passport.session());

router.get('/', ctx => {
	const { user } = ctx.state;
	ctx.body = user && `Hello, ${user.username}` || 'Please login';
});

router.post('/graphql', authRequired, graphqlKoa((context) => ({ schema, context })));

router.get('/graphiql', authRequired, graphiqlKoa(ctx => {
	const xProxyPath = ctx.req.headers['x-proxy-path'];
	const proxyPath = typeof xProxyPath === 'string' && url.parse(xProxyPath).pathname || '';

	return ({
		endpointURL: `${proxyPath}/graphql`,
	});
}));

router.post('/login', login);

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => console.log(`Server started at ${PORT} port`));
