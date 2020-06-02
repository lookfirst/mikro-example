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


	test('move b from a1 to a2', async () => {
		const a1 = new A();
		a1.id = 1;
		const a2 = new A();
		a2.id = 2;

		const b = new B();
		b.id = 1;

		a1.b = b;
		await orm.em.persistAndFlush([a1, b, a2]);
		orm.em.clear();

		const foundA2 = await orm.em.findOneOrFail(A, a2.id, {populate: true});
		const foundA1 = await orm.em.findOneOrFail(A, a1.id, {populate: true});

		foundA2.b = foundA1.b;
		foundA1.b = null;

		expect(foundA2.b).toBeDefined();
		expect(foundA1.b).toBeNull();

		await orm.em.persistAndFlush([foundA1, foundA2]);

		orm.em.clear();

		const foundA11 = await orm.em.findOneOrFail(A, a1.id, {populate: true});
		const foundA22 = await orm.em.findOneOrFail(A, a2.id, {populate: true});

		expect(foundA22.b).toBeDefined();
		expect(foundA11.b).toBeNull();
	});
});
