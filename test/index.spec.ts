import * as assert from "assert";
import {MikroORM} from "mikro-orm";

import {Person} from "../src/model/Person";
import {Thing} from "../src/model/Thing";

import config from '../src/cli-config';

describe('creates objects', () => {
	let createdBy : Person;
	let orm: MikroORM;

	before(async () => {
		orm = await MikroORM.init(config);
		const generator = orm.getSchemaGenerator();
		await generator.dropSchema();
		await generator.createSchema();
	});

	beforeEach(async () => {
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
});
