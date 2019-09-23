import * as assert from "assert";
import {MikroORM, SchemaGenerator} from "mikro-orm";

import {Person} from "../src/db/model/Person";
import {Thing} from "../src/db/model/Thing";

import config from '../src/db/cli-config';

describe('creates objects', () => {
	let createdBy : Person;
	let orm: MikroORM;
	let generator: SchemaGenerator;

	before(async () => {
		orm = await MikroORM.init(config);
		generator = orm.getSchemaGenerator();
	});

	beforeEach(async () => {
		await generator.dropSchema();
		await generator.createSchema();

		createdBy = new Person({id: 'person:1', email: 'foo@bar.com'});
		await orm.em.persistAndFlush(createdBy);
	});

	after(async () => {
		await orm.close();
	});

	it('creates a thing with createdBy relation', async () => {
		const thing = new Thing({id: 'thing:1'}, createdBy);
		await orm.em.persistAndFlush(thing);
		assert.strictEqual(thing.createdBy.id, 'person:1');

		orm.em.clear();

		const thing1 = await orm.em.findOne(Thing, {id: 'thing:1'},
			{populate: ['createdBy']});

		assert.strictEqual(thing1!.id, 'thing:1');
		assert.strictEqual(thing1!.createdBy.id, 'person:1');
		assert.strictEqual(thing1!.createdBy.unwrap().email, 'foo@bar.com');
	});

	it('creates a thing with createdBy relation through assign', async () => {
		const thing = new Thing({id: 'thing:1'}, createdBy);
		thing.assign({field: 'a field'});

		await orm.em.persistAndFlush(thing);
		assert.strictEqual(thing.createdBy.id, 'person:1');

		orm.em.clear();

		const thing1 = await orm.em.findOne(Thing, {id: 'thing:1'},
			{populate: ['createdBy']});

		assert.strictEqual(thing1!.id, 'thing:1');
		assert.strictEqual(thing1!.createdBy.id, 'person:1');
		assert.strictEqual(thing1!.createdBy.unwrap().email, 'foo@bar.com');

		assert.strictEqual((await thing1!.createdBy.load()).email, 'foo@bar.com');

		assert.strictEqual(thing1!.field, 'a field');
	});
});
