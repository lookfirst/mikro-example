import {Entity, IEntity, ManyToOne, PrimaryKey} from "mikro-orm";
import {Thing} from "./Thing";

@Entity()
export class Dog {
	@PrimaryKey()
	id!: number;

	@ManyToOne()
	thing!: Thing;
}

export interface Dog extends IEntity<number> { }
