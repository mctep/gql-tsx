import * as path from 'path';
export const createDirname = (dirname: string) => (...args: Array<string>) => path.resolve(dirname, ...args);
