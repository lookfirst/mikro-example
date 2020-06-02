import { MikroORM, SchemaGenerator } from 'mikro-orm';

import config, { dbTmpFile } from '../../src/db/cli-config';
import { Rig2 } from '../../src/db/model/Rig2';
import { Gpu } from '../../src/db/model/Gpu';

describe('tests rig2', () => {
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

	function addRemoveGpus(rig: Rig2, gpu1: Gpu) {
		rig.gpus.remove(gpu1);
		expect(rig.gpus.length).toBe(0);

		const gpu2 = new Gpu();
		rig.gpus.add(gpu2);
		expect(rig.gpus.length).toBe(1);

		orm.em.persistLater(rig);
	}

	test('creates and updates', async () => {
		let rig1 = new Rig2();
		const gpu1 = new Gpu();
		rig1.gpus.add(gpu1);
		await orm.em.persistAndFlush(rig1);

		orm.em.clear();

		rig1 = await orm.em.findOneOrFail(Rig2, rig1.id, true);
		addRemoveGpus(rig1, gpu1);
		expect(rig1.gpus.length).toBe(1);
		expect(rig1.gpus[0].id).toBeUndefined();

		await orm.em.flush();

		orm.em.clear();

		const rig1db = await orm.em.findOneOrFail(Rig2, rig1.id, true);
		expect(rig1db.gpus.length).toBe(1);
		expect(rig1db.gpus[0].id).toBe(2);
	});
});
