import {
	Configuration,
	Loader,
	optimize,
	HotModuleReplacementPlugin,
	NamedModulesPlugin,
} from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import { createDirname } from './src/util/dirname';

const dirname = createDirname(__dirname);

const { CommonsChunkPlugin } = optimize;

interface ICompilationProps {
	port?: number;
}

export default (props: ICompilationProps): Configuration => {
	const app = [dirname('./src/client/index.tsx')];

	if (props.port) {
		app.unshift(
			'react-hot-loader/patch',
			`webpack-dev-server/client?http://localhost:${props.port}`,
			'webpack/hot/only-dev-server',
		);
	}

	const tsUse: Array<Loader> = [{
		loader: 'awesome-typescript-loader',
		options: {
			configFileName: dirname('./src/client/tsconfig.json'),
		}
	}];

	if (props.port) {
		tsUse.unshift({ loader: 'react-hot-loader/webpack' });
	}

	const plugins = [
		new NamedModulesPlugin(),

		new CommonsChunkPlugin({
			name: 'vendor',
			minChunks: module => module.context && module.context.indexOf('node_modules') !== -1,
		}),
		new CommonsChunkPlugin({
			name: 'react',
			minChunks: module => module.context && module.context.indexOf('node_modules/react') !== -1,
		}),
		new CommonsChunkPlugin({
			name: 'manifest',
		}),
		new HtmlWebpackPlugin(),
	];

	if (props.port) {
		plugins.unshift(new HotModuleReplacementPlugin());
	}

	return {
		entry: { app },
		resolve: { extensions: ['.ts', '.tsx', '.js'] },
		output: {
			path: dirname('./build/client'),
			publicPath: '/client/',
			filename: '[name].[hash].js',
		},
		module: { rules: [{ test: /\.tsx?/, use: tsUse }] },
		plugins,
	}
};
