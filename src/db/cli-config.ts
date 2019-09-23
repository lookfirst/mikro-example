import {EntityCaseNamingStrategy, Options} from "mikro-orm";

export default {
	baseDir: process.cwd(),
	entitiesDirs: ['./build/src/db/model'],
	entitiesDirsTs: ['./src/db/model'],
	debug: true,
	type: 'sqlite',
	dbName: './build/test.sqlite',
	cache: { enabled: false },
	namingStrategy: EntityCaseNamingStrategy,
} as Options;
