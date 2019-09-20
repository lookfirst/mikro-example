import {Entity, IdentifiedReference, IEntity, ManyToOne, PrimaryKey, Reference} from "mikro-orm";
import {Person} from "./Person";

@Entity()
export class Thing {

	@PrimaryKey()
	id: string;

	@ManyToOne()
	createdBy: IdentifiedReference<Person, 'id'>;

	constructor(thing: Partial<Thing>, createdBy: Person) {
		this.id = thing.id!;
		this.createdBy = Reference.create(createdBy);
	}
}

export interface Thing extends IEntity<string> { }
