import * as env from 'node-env-file';
import { createDirname } from '../util/dirname';

const dirname = createDirname(__dirname);

env(dirname('../../volume/.env'));

export const SECRET_KEY: string = process.env.SECRET_KEY || 'some secret key. needs to remove';
export const SESSION_STORE_URL: string = process.env.SESSION_STORE_URL || null;
export const API_PORT: number = parseInt(process.env.API_PORT) || 3001;
