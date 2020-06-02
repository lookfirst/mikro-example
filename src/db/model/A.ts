import {Entity, OneToOne, PrimaryKey} from "mikro-orm";
import {B} from "./B";

@Entity()
export class A {
	@PrimaryKey()
	id!: number;

	@OneToOne(() => B, b => b.a, {owner: true, nullable: true})
	b?: B | null;
}
