import { Configuration, optimize, HotModuleReplacementPlugin } from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import { createDirname } from './src/util/dirname';

const dirname = createDirname(__dirname);

const { CommonsChunkPlugin } = optimize;

export default (): Configuration => ({
	entry: {
		app: [
			'react-hot-loader/patch',
			dirname('./src/client/index.tsx')
		]
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
	output: {
		path: dirname('./build/client'),
		publicPath: '/client/',
		filename: '[name].[hash].js',
	},
	module: {
		rules: [{
			test: /\.tsx?/,
			use: [
				{ loader: 'react-hot-loader/webpack' },
				{
					loader: 'awesome-typescript-loader',
					options: {
						configFileName: dirname('./src/client/tsconfig.json'),
					}
				}
			]
		}],
	},
	plugins: [
		new HotModuleReplacementPlugin(),

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
		new HtmlWebpackPlugin()
	],

	devServer: {
		hot: true,
	},
});
