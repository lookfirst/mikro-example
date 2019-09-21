import {Entity, IEntity, OneToOne, PrimaryKey, Property} from "mikro-orm";
import {Dog} from "./Dog";

@Entity()
export class Person {
	@PrimaryKey()
	id: string;

	@Property({columnType: 'varchar'})
	email: string;

	@OneToOne({owner: true, nullable: true})
	dog: Dog;

	constructor(person: Partial<Person>) {
		this.id = person.id!;
		this.email = person.email!;
		this.dog = person.dog!;
	}
}

export interface Person extends IEntity<string> { }
