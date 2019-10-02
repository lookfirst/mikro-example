import {Entity, IEntity, OneToOne, PrimaryKey} from "mikro-orm";
import {A} from "./A";

@Entity()
export class B {
	@PrimaryKey()
	id!: number;

	@OneToOne(() => A, a => a.b)
	a!: A;
}

export interface B extends IEntity<number> { }
