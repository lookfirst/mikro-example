import {EntityCaseNamingStrategy, Options} from "mikro-orm";
import tmp from 'tmp';

export const dbTmpFile = tmp.fileSync({dir: './build', prefix: 'db-', postfix: '.sqlite'});

export default {
	baseDir: process.cwd(),
	entitiesDirs: ['./build/src/db/model'],
	entitiesDirsTs: ['./src/db/model'],
	debug: true,
	tsNode: true,
	type: 'sqlite',
	dbName: dbTmpFile.name,
	cache: { enabled: false },
	namingStrategy: EntityCaseNamingStrategy,
} as Options;
