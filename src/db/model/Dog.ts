import {Entity, IEntity, ManyToOne, OneToOne, PrimaryKey} from "mikro-orm";
import {Person} from "./Person";
import {Thing} from "./Thing";

@Entity()
export class Dog {
	@PrimaryKey()
	id!: number;

	@ManyToOne()
	thing!: Thing;

	@OneToOne({entity: () => Person, inversedBy: 'dog'})
	person!: Person;
}

export interface Dog extends IEntity<number> { }
