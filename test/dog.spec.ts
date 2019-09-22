import * as assert from "assert";
import {MikroORM} from "mikro-orm";
import {Dog} from "../src/db/model/Dog";

import config from '../src/db/cli-config';
import {Person} from "../src/db/model/Person";
import {Thing} from "../src/db/model/Thing";

describe('creates dogs', () => {
	let orm: MikroORM;

	before(async () => {
		orm = await MikroORM.init(config as any);
		const generator = orm.getSchemaGenerator();
		await generator.dropSchema();
		await generator.createSchema();
	});

	after(async () => {
		await orm.close();
	});

	it('creates a dog', async () => {
		const dog = new Dog();
		await orm.em.persistAndFlush(dog);

		orm.em.clear();

		const dog1 = await orm.em.findOne(Dog, {id: dog.id});
		assert.strictEqual(dog1!.id, 1);
	});

	it('thing has many dogs', async () => {
		const createdBy = new Person({id: 'person:1', email: 'foo@bar.com'});
		await orm.em.persistAndFlush(createdBy);

		const dog1 = new Dog();
		const dog2 = new Dog();

		const thing = new Thing({id: 'thing1', field: 'field1'}, createdBy);
		thing.dogs.add(dog1, dog2);

		await orm.em.persistAndFlush(thing);

		orm.em.clear();

		const thing1 = await orm.em.findOne(Thing, {id: thing.id});
		assert.strictEqual((await thing1!.dogs.init()).length, 2);
	});

	it('creates a dog with an owner', async () => {
		const person = new Person({id: 'person:1', email: 'foo@bar.com'});
		const dog = new Dog();
		person.dog = dog;
		dog.person = person;

		await orm.em.persistAndFlush(person);

		orm.em.clear();

		const dog1 = await orm.em.findOne(Dog, {id: dog.id});
		assert.strictEqual((await dog1!.person!.init()).id, person.id);
	});
});
