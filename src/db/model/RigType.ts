import {Entity, IdEntity, PrimaryKey, Property} from "mikro-orm";

@Entity()
export class RigType implements IdEntity<RigType>{
	@PrimaryKey()
	id!: number;

	@Property()
	name!: string;
}
