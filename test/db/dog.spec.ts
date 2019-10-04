import {MikroORM, SchemaGenerator} from "mikro-orm";
import {Dog} from "../../src/db/model/Dog";

import {Person} from "../../src/db/model/Person";
import {Thing} from "../../src/db/model/Thing";

import config from '../../src/db/cli-config';

describe('creates dogs', () => {
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
	});

	test('creates a dog', async () => {
		const dog = new Dog();
		await orm.em.persistAndFlush(dog);

		orm.em.clear();

		const dog1 = await orm.em.findOne(Dog, {id: dog.id});
		expect(dog1!.id).toBe(1);
	});

	test('thing has many dogs', async () => {
		const createdBy = new Person({id: 'person:1', email: 'foo@bar.com'});
		await orm.em.persistAndFlush(createdBy);

		const dog1 = new Dog();
		const dog2 = new Dog();

		const thing = new Thing({id: 'thing1', field: 'field1'}, createdBy);
		thing.dogs.add(dog1, dog2);

		await orm.em.persistAndFlush(thing);

		orm.em.clear();

		const thing1 = await orm.em.findOne(Thing, {id: thing.id});
		expect((await thing1!.dogs.init()).length).toBe(2);
	});

	test('creates a dog with an owner', async () => {
		const dog = new Dog();
		const person = new Person({id: 'person:1', email: 'foo@bar.com', dog});

		await orm.em.persistAndFlush(person);

		orm.em.clear();

		const dog1 = await orm.em.findOne(Dog, dog.id, ['person']);
		expect(dog1!.person!.id).toEqual(person.id);

		orm.em.clear();

		const person1 = await orm.em.findOne(Person, person.id, ['dog']);
		expect(person1!.dog.id).toEqual(dog1!.id);

		orm.em.clear();

		const person2 = await orm.em.findOne(Person, person.id, true);
		expect(person2!.dog.id).toEqual(dog1!.id);
	});
});
