declare module 'map-stream' {
	import * as fs from 'fs';
	function mapStream(...args: Array<any>): fs.WriteStream;
	namespace mapStream {

	}
	export = mapStream;
}
