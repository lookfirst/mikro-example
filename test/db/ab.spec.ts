import {MikroORM, SchemaGenerator} from "mikro-orm";
import {A} from "../../src/db/model/A";
import {B} from "../../src/db/model/B";

import config, {dbTmpFile} from '../../src/db/cli-config';

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
		dbTmpFile.removeCallback();
	});

	test('creates and selects', async () => {
		const a = new A();
		a.id = 1;
		const b = new B();
		b.id = 1;

		a.b = b;
		await orm.em.persistAndFlush(a);

		orm.em.clear();

		const foundB = await orm.em.findOneOrFail(B, 1, ['a']);

		expect(foundB.a.id).toBe(1);
	});

	test('creates and selects populate true', async () => {
		const a = new A();
		a.id = 1;
		const b = new B();
		b.id = 1;

		a.b = b;
		await orm.em.persistAndFlush(a);

		orm.em.clear();

		const foundB = await orm.em.findOneOrFail(B, 1, {populate: true});
		expect(foundB.a.id).toBe(1);
	});

	test('create ab then create b and update a with b', async () => {
		const a = new A();
		a.id = 1;
		const b = new B();
		b.id = 1;

		a.b = b;
		await orm.em.persistAndFlush(a);

		orm.em.clear();

		const foundA = await orm.em.findOneOrFail(A, 1, {populate: true});
		const b2 = new B();
		b2.id = 2;
		foundA.b = b2;

		await orm.em.persistAndFlush(foundA);
	});
});
