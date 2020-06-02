import {Entity, PrimaryKey, Property} from "mikro-orm";

@Entity()
export class RigType {
	@PrimaryKey()
	id!: number;

	@Property()
	name!: string;
}
