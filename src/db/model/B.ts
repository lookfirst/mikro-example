import {Entity, IdEntity, OneToOne, PrimaryKey} from "mikro-orm";
import {A} from "./A";

@Entity()
export class B implements IdEntity<B> {
	@PrimaryKey()
	id!: number;

	@OneToOne(() => A, a => a.b)
	a!: A;
}
