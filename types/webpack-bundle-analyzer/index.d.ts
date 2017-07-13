declare module 'webpack-bundle-analyzer' {
	import { Plugin } from 'webpack';

	export class BundleAnalyzerPlugin extends Plugin {
		constructor(config: any);
	}
}
