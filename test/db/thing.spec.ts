import {MikroORM, SchemaGenerator} from "mikro-orm";

import {Person} from "../../src/db/model/Person";
import {Thing} from "../../src/db/model/Thing";

import config from '../../src/db/cli-config';

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
	});

	test('creates a thing with createdBy relation', async () => {
		const thing = new Thing({id: 'thing:1'}, createdBy);
		await orm.em.persistAndFlush(thing);
		expect(thing.createdBy.id).toEqual('person:1');

		orm.em.clear();

		const thing1 = await orm.em.findOne(Thing, {id: 'thing:1'},
			{populate: ['createdBy']});

		expect(thing1!.id).toEqual('thing:1');
		expect(thing1!.createdBy.id).toEqual('person:1');
		expect(thing1!.createdBy.unwrap().email).toEqual( 'foo@bar.com');
	});

	test('creates a thing with createdBy relation through assign', async () => {
		const thing = new Thing({id: 'thing:1'}, createdBy);
		thing.assign({field: 'a field'});

		await orm.em.persistAndFlush(thing);
		expect(thing.createdBy.id).toEqual('person:1');

		orm.em.clear();

		const thing1 = await orm.em.findOne(Thing, {id: 'thing:1'},
			{populate: ['createdBy']});

		expect(thing1!.id).toEqual('thing:1');
		expect(thing1!.createdBy.id).toEqual('person:1');
		expect(thing1!.createdBy.unwrap().email).toEqual('foo@bar.com');

		expect((await thing1!.createdBy.load()).email).toEqual('foo@bar.com');

		expect(thing1!.field).toEqual('a field');
	});
});
