import {Entity, IEntity, PrimaryKey} from "mikro-orm";

@Entity()
export class Dog {
	@PrimaryKey()
	id!: number;
}

export interface Dog extends IEntity<number> { }
