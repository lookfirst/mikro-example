import {MikroORM, SchemaGenerator} from "mikro-orm";

import {Person} from "../../src/db/model/Person";
import {Update} from "../../src/db/model/Update";

import config, {dbTmpFile} from '../../src/db/cli-config';

describe('updates', () => {
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

	test('just does an insert', async () => {
		const person = new Person({id: '1'});
		const update = new Update(person);
		update.id = 1;
		expect(update.type).toBe('FOO');
		update.type = 'type';
		await orm.em.persistAndFlush(update);

		orm.em.clear();

		const updateFound = await orm.em.findOneOrFail(Update, 1);
		expect(updateFound.id).toBe(1);
		expect(updateFound.type).toBe('type');
	});
});
