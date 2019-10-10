import {MikroORM, SchemaGenerator} from "mikro-orm";

import {Person} from "../../src/db/model/Person";
import {Thing} from "../../src/db/model/Thing";

import config, {dbTmpFile} from '../../src/db/cli-config';

describe('creates objects', () => {
	let createdBy : Person;
	let orm: MikroORM;
	let generator: SchemaGenerator;

	beforeAll(async () => {
		orm = await MikroORM.init(config);
		generator = orm.getSchemaGenerator();
	});

	beforeEach(async () => {
		await generator.dropSchema();
		await generator.createSchema();

		createdBy = new Person({id: 'person:1', email: 'foo@bar.com'});
		await orm.em.persistAndFlush(createdBy);
	});

	afterAll(async () => {
		await orm.close();
		dbTmpFile.removeCallback();
	});

	test('populates everything', async () => {
		const thing = new Thing({id: 'thing:1', owner: createdBy}, createdBy);
		await orm.em.persistAndFlush(thing);
		expect(thing.createdBy.id).toEqual('person:1');

		orm.em.clear();

		const thing1 = await orm.em.findOne(Thing, 'thing:1', {populate: true});
		expect(thing1!.owner).not.toBeNull();
		expect(thing1!.owner.email).toBe(createdBy.email);
	});
});
