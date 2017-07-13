import * as path from 'path';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import {
	Configuration,
	HotModuleReplacementPlugin,
	Loader,
	NamedModulesPlugin,
	optimize,
	DefinePlugin,
} from 'webpack';
import { createDirname } from './src/util/dirname';

const dirname = createDirname(__dirname);

const { CommonsChunkPlugin } = optimize;

function moduleIn(names: Array<string>) {
	return (module: any) => {
		if (!module.context) {
			return false;
		}

		const moduleName = path
			.relative(dirname('./node_modules'), module.context)
			.split('/')[0];

		return names.some(name => name === moduleName);
	};
}

interface Config {
	dev?: boolean;
	devServerPort?: number;
	analyzerPort?: number;
}

function getEntry(config: Config) {
	let app = [
		dirname(
			config.dev ? './src/client/index.dev.tsx' : './src/client/index.tsx',
		),
	];

	if (config.devServerPort) {
		app = new Array().concat(
			[
				'react-hot-loader/patch',
				`webpack-dev-server/client?http://localhost:${config.devServerPort}`,
				'webpack/hot/only-dev-server',
			],
			app,
		);
	}
	return { app };
}

function tsRule(config: Config) {
	const use: Array<Loader> = [
		{
			loader: 'awesome-typescript-loader',
			options: {
				configFileName: dirname('./src/client/tsconfig.json'),
			},
		},
	];

	if (config.devServerPort) {
		use.unshift({ loader: 'react-hot-loader/webpack' });
	}

	return { test: /\.tsx?/, use };
}

function getPlugins(config: Config) {
	const analyzerProps = config.analyzerPort
		? {
				analyzerPort: config.analyzerPort,
				openAnalyzer: false,
			}
		: {
				analyzerMode: 'static',
				openAnalyzer: false,
				generateStatsFile: true,
			};

	const plugins = [
		new DefinePlugin({
			'process.env': {
				NODE_ENV: !config.dev && 'production',
			},
		}),

		new NamedModulesPlugin(),

		new CommonsChunkPlugin({
			name: 'vendor',
			minChunks: module =>
				module.context && module.context.indexOf('node_modules') !== -1,
		}),

		new CommonsChunkPlugin({
			name: 'react',
			minChunks: moduleIn([
				'react',
				'react-dom',
				'prop-types',
				'create-react-class',
				'fbjs',
			]),
		}),

		new CommonsChunkPlugin({ name: 'manifest' }),

		new HtmlWebpackPlugin(),

		new BundleAnalyzerPlugin(analyzerProps),
	];

	if (config.devServerPort) {
		plugins.unshift(new HotModuleReplacementPlugin());
	}

	return plugins;
}

export function makeConfig(config: Config = {}): Configuration {
	const node: any = !config.dev ? false : undefined;

	return {
		entry: getEntry(config),
		node,
		resolve: { extensions: ['.ts', '.tsx', '.js'] },
		output: {
			path: dirname('./build/client'),
			publicPath: '/client/',
			filename: '[name].[hash].js',
		},
		module: {
			rules: [tsRule(config)],
		},
		plugins: getPlugins(config),
	};
}

export default (): Configuration => makeConfig();
