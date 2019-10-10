import {Entity, IdEntity, OneToOne, PrimaryKey} from "mikro-orm";
import {B} from "./B";

@Entity()
export class A implements IdEntity<A>{
	@PrimaryKey()
	id!: number;

	@OneToOne(() => B, b => b.a, {owner: true})
	b!: B;
}
