import * as path from 'path';
import * as fs from 'fs';
import { graphql, introspectionQuery } from 'graphql';
import { getTemplateGenerator, Transform } from 'graphql-code-generator';
import { makeExecutableSchema } from 'graphql-tools';
import * as File from 'vinyl';
import * as mapStream from 'map-stream';

const templateGenerator = getTemplateGenerator('typescript');

export function gql2ts(): fs.WriteStream {
	return mapStream((file, cb) => {
		generateTypescriptDefenitions(file).then(f => cb(null, f)).catch(cb);
	});
}

export async function generateTypescriptDefenitions(file: File) {
	if (!file || !file.isBuffer()) { return null; }

	const typeDefs = file.contents.toString('utf-8');
	const outPath = path.join(
		path.dirname(file.path),
		path.basename(file.path, '.gql'),
	) + '.d.ts';

	const template = await templateGenerator;
	const schema = makeExecutableSchema({ typeDefs });

	const introspection = (
		await graphql(schema, introspectionQuery)
	).data as { __schema: null };

	const files = await Transform({
		documents: [],
		introspection,
		isDev: false,
		noDocuments: true,
		noSchema: false,
		template,
		outPath,
	});

	let contents = new Buffer(files[0].content.replace(/^\s{2}/gm, '\t'));
	contents = Buffer.concat([
		new Buffer(`/*
This file was automatically generated
Please do not change it
*/\n\n`),
		contents,
	]);

	return new File({
		cwd: '/',
		base: path.basename(files[0].path),
		path: files[0].path,
		contents,
	});
}
