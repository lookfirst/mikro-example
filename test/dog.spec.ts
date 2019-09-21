import * as assert from "assert";
import {MikroORM} from "mikro-orm";
import {Dog} from "../src/db/model/Dog";

import config from '../src/db/cli-config';

describe('creates dogs', () => {
	let orm: MikroORM;

	before(async () => {
		orm = await MikroORM.init(config);
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
});
