import * as Koa from 'koa';
import * as passport from 'koa-passport';
import * as passportLocal from 'passport-local';

export { passport };

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
	if (id === 1) {
		done(null, { id: 1, username: 'test', password: 'test' });
	} else {
		done(new Error('not found??'), null);
	}
});

const localStrategy = new passportLocal.Strategy((username, password, done) => {
	if (username === 'test' && password === 'test') {
		done(null, { id: 1, username: 'test', password: 'test' });
	} else {
		done(null, false);
	}
});

passport.use(localStrategy);

export const login: Koa.Middleware = (ctx, next) => {
	passport.authenticate('local', (_, user) => {
		if (user === false) {
			ctx.status = 401;
		} else {
			ctx.login(user);
			ctx.body = { success: true };
		}
	})(ctx, next);
};

export const authRequired: Koa.Middleware = (ctx, next) => {
	if (!ctx.isAuthenticated()) {
		ctx.status = 401;
	} else {
		next();
	}
}
