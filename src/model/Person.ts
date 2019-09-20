import {Entity, IEntity, PrimaryKey, Property} from "mikro-orm";

@Entity()
export class Person {
	@PrimaryKey()
	id: string;

	@Property({columnType: 'varchar'})
	email: string;

	constructor(person: Partial<Person>) {
		this.id = person.id!;
		this.email = person.email!;
	}
}

export interface Person extends IEntity<string> { }
