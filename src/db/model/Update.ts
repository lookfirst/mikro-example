import {Entity, PrimaryKey, Property} from "mikro-orm";
import {BaseEntity} from "./BaseEntity";
import {Person} from "./Person";

@Entity()
export class Update extends BaseEntity {
	@PrimaryKey()
	id!: number;

	@Property()
	person!: Person;

	@Property()
	type!: string;

	constructor(person: Person) {
		super();
		this.type = 'FOO';
		this.person = person;
	}
}
