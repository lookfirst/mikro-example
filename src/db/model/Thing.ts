import {
	Collection,
	Entity,
	IdentifiedReference,
	IEntity,
	ManyToOne,
	OneToMany,
	PrimaryKey,
	Property,
	Reference
} from "mikro-orm";
import {Dog} from "./Dog";
import {Person} from "./Person";

@Entity()
export class Thing {

	@PrimaryKey()
	id: string;

	@Property({nullable: true})
	field: string;

	@ManyToOne()
	createdBy: IdentifiedReference<Person, 'id'>;

	@ManyToOne()
	owner!: Person;

	@OneToMany(() => Dog, (dog) => dog.thing)
	dogs = new Collection<Dog>(this);

	constructor(thing: Partial<Thing>, createdBy: Person) {
		this.id = thing.id!;
		this.field = thing.field!;
		this.createdBy = Reference.create(createdBy);
		this.owner = thing.owner!;
	}
}

export interface Thing extends IEntity<string> { }
