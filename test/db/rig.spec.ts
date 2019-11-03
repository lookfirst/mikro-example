import {MikroORM, SchemaGenerator} from "mikro-orm";

import config, {dbTmpFile} from '../../src/db/cli-config';

import {Rig} from "../../src/db/model/Rig";
import {RigType} from "../../src/db/model/RigType";

describe('rigs', () => {
	let orm: MikroORM;
	let generator: SchemaGenerator;

	beforeAll(async () => {
		orm = await MikroORM.init(config);
		generator = orm.getSchemaGenerator();
	});

	beforeEach(async () => {
		await generator.dropSchema();
		await generator.createSchema();
	});

	afterAll(async () => {
		await orm.close();
		dbTmpFile.removeCallback();
	});

	xtest('creates orderBy correctly', async () => {
		const rig1 = new Rig();

		const rigType = new RigType();
		rigType.id = 1;
		rigType.name = 'rigType 1';

		rig1.id = 1;
		rig1.type = rigType;

		await orm.em.persistAndFlush(rig1);
		orm.em.clear();

		const result = await orm.em.findAndCount(Rig, {}, {
			orderBy: {type: 'asc'},
			populate: true,
		});

		console.log(result);
	});
});
