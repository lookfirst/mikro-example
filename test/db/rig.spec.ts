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

	test('creates orderBy correctly', async () => {
		const rig1 = new Rig();

		const rigType = new RigType();
		rigType.id = 1;
		rigType.name = 'rigType 1';

		rig1.id = 1;
		rig1.type = rigType;

		await orm.em.persistAndFlush(rig1);
		orm.em.clear();

		const result = await orm.em.find(Rig, {}, {
			orderBy: {type: 'asc'},
			populate: true,
		});

		expect(result[0].type.name).toBe(rigType.name);
	});

	test('unit of works... so nice!', async () => {
		const rig1 = new Rig();
		const rigType1 = new RigType();
		rigType1.id = 1;
		rigType1.name = 'rigType 1';

		rig1.id = 1;
		rig1.type = rigType1;

		await orm.em.persistAndFlush(rig1);
		orm.em.clear();

		const rigChangeRig1 = await orm.em.findOneOrFail(Rig, rig1.id);

		const rigType2 = new RigType();
		rigType2.id = 2;
		rigType2.name = 'rigType 2';

		rigChangeRig1.type = rigType2;
		rigChangeRig1.type.name = 'removed';

		await orm.em.persistAndFlush([rigType2, rigChangeRig1]);
		orm.em.clear();

		const rigType1Db = await orm.em.findOneOrFail(RigType, rigType1.id);
		expect(rigType1Db.name).toBe('rigType 1');

		const rigAgain = await orm.em.findOneOrFail(Rig, rig1.id, {populate: true});
		expect(rigAgain.type.name).toBe('removed');
	});
});
