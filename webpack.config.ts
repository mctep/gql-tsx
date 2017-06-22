import { Configuration } from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import { createDirname } from './src/util/dirname';

const dirname = createDirname(__dirname);

export default (): Configuration => ({
	entry: dirname('./src/client/index.ts'),
	output: {
		path: dirname('./build/client'),
		publicPath: '/client/',
		filename: '[name].[chunkhash].js',
	},
	module: {
		rules: [{
			test: /\.tsx?/,
			loader: 'awesome-typescript-loader',
			options: {
				configFileName: dirname('./src/client/tsconfig.json'),
			}
		}],
	},
	plugins: [new HtmlWebpackPlugin()],
});
