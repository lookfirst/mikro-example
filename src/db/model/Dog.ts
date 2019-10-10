import {Entity, IdEntity, ManyToOne, OneToOne, PrimaryKey} from "mikro-orm";
import {Person} from "./Person";
import {Thing} from "./Thing";

@Entity()
export class Dog implements IdEntity<Dog> {
	@PrimaryKey()
	id!: number;

	@ManyToOne()
	thing!: Thing;

	@OneToOne(() => Person, person => person.dog)
	person!: Person;
}
