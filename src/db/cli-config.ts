import {PascalCaseNamingStrategy} from "./PascalCaseNamingStrategy";

export default {
	baseDir: __dirname, // defaults to `process.cwd()`,
	entitiesDirs: ['../../build/db/model'],
	entitiesDirsTs: ['./model'],
	debug: true,
	type: 'sqlite',
	dbName: './build/test.sqlite',
	warnWhenNoEntities: true,
	cache: { enabled: false },
	namingStrategy: PascalCaseNamingStrategy,
};
