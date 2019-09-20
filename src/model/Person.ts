import {Entity, IEntity, PrimaryKey} from "mikro-orm";

@Entity()
export class Person {
	@PrimaryKey()
	id: string;

	constructor(person: Partial<Person>) {
		this.id = person.id!;
	}
}

export interface Person extends IEntity<string> { }
