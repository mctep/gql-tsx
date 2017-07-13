import * as del from 'del';
import * as fs from 'fs';
import * as gulp from 'gulp';
import * as nodemon from 'gulp-nodemon';
import * as ts from 'gulp-typescript';
import * as gutil from 'gulp-util';
import { promisify } from 'util';
import * as webpack from 'webpack';
import * as WebpackDevServer from 'webpack-dev-server';
import { API_PORT, CLIENT_DEV_PORT, ANALYZER_PORT } from './src/server/env';

import { createDirname } from './src/util/dirname';
import { gql2ts } from './src/util/graphql/generate-tsd';
import { makeConfig } from './webpack.config';

const gulpLog = (prefix: string, msg: string) =>
	msg.split('\n').forEach(line => gutil.log(prefix, line));

const dirname = createDirname(__dirname);

const TS_BUILD_PATHS = fs
	.readdirSync(dirname('./src'))
	.filter(name => name !== 'client')
	.map(name => dirname('./build', name));

const tsProject = ts.createProject(dirname('./src/tsconfig.json'), {
	outDir: dirname('./build'),
});

gulp.task('client-build', () => {
	return del(dirname('./build/client'))
		.then(() => promisify(webpack)(makeConfig()))
		.then((stats: webpack.Stats) => {
			gulpLog('[webpack]', stats.toString('normal'));
		});
});

gulp.task('client-watch', () => {
	const compiler = webpack(
		makeConfig({
			dev: true,
			devServerPort: CLIENT_DEV_PORT,
			analyzerPort: ANALYZER_PORT,
		}),
	);

	new WebpackDevServer(compiler, {
		contentBase: dirname('/build'),
		publicPath: '/client',
		stats: {
			modules: true,
			colors: true,
		},
		hot: true,
		proxy: {
			'/api': {
				target: `http://localhost:${API_PORT}`,
				pathRewrite: { '^/api': '' },
				onProxyReq: (proxyReq: any) =>
					proxyReq.setHeader('x-proxy-path', '/api'),
			},
			'*': {
				target: `http://localhost:${CLIENT_DEV_PORT}/client`,
				ignorePath: true,
			},
		},
	}).listen(CLIENT_DEV_PORT, 'localhost', (error: any) => {
		if (error) {
			throw new gutil.PluginError('[webpack-dev-server]', error);
		}

		gulpLog('[webpack-dev-server]', `started at ${CLIENT_DEV_PORT} port`);
	});
});

gulp.task('server-build', ['schemas-build'], () =>
	Promise.all(TS_BUILD_PATHS.map(s => del(s))).then(() =>
		Promise.all([
			tsProject.src().pipe(tsProject()).js.pipe(gulp.dest(dirname('./build'))),
			gulp.src('./src/**/*.gql').pipe(gulp.dest(dirname('./build'))),
		]),
	),
);

gulp.task('server-watch', ['schemas-build'], () =>
	nodemon({
		script: dirname('./src/server'),
		ext: 'ts',
		watch: [dirname('./src/**/*.ts')],
		ignore: [dirname('./src/client/**/*.ts')],
		exec: 'ts-node',
	}),
);

gulp.task('schemas-build', () =>
	gulp.src('./src/**/*.gql').pipe(gql2ts()).pipe(gulp.dest(dirname('./src'))),
);

gulp.task('schemas-watch', () => {
	gulp.watch(dirname('./src/**/*.gql'), ['schemas-build']);
});

gulp.task('watch', ['client-watch', 'server-watch', 'schemas-watch']);
gulp.task('build', ['client-build', 'server-build']);
gulp.task('default', ['watch']);
