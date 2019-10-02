import {MikroORM, SchemaGenerator} from "mikro-orm";
import {A} from "../../src/db/model/A";
import {B} from "../../src/db/model/B";

import config from '../../src/db/cli-config';

describe('creates and selects', () => {
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

	test('creates and selects', async () => {
		const a = new A();
		a.id = 1;
		const b = new B();
		b.id = 1;

		a.b = b;
		await orm.em.persistAndFlush(a);

		const foundB = await orm.em.findOneOrFail(B, 1, ['a']);
		expect(foundB.a.id).toBe(1);
	});
});