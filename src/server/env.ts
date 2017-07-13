import * as fs from 'fs';
import * as env from 'node-env-file';
import { createDirname } from '../util/dirname';

const dirname = createDirname(__dirname);
const envFile = dirname('../../volume/.env');

if (fs.existsSync(envFile)) {
	env(envFile);
}

export const SECRET_KEY: string =
	process.env.SECRET_KEY || 'some secret key. needs to remove';

export const SESSION_STORE_URL = process.env.SESSION_STORE_URL || '';

export const CLIENT_DEV_PORT =
	parseInt(process.env.CLIENT_DEV_PORT as string, 10) || 8081;

export const API_PORT =
	parseInt(process.env.API_PORT as string, 10) ||
	(CLIENT_DEV_PORT && CLIENT_DEV_PORT + 1) ||
	8082;

export const ANALYZER_PORT =
	parseInt(process.env.ANALYZER_PORT as string, 10) ||
	(API_PORT && API_PORT + 1) ||
	8083;
