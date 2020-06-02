import {Entity, ManyToOne, PrimaryKey} from "mikro-orm";
import {RigType} from "./RigType";

@Entity()
export class Rig {
	@PrimaryKey()
	id!: number;

	@ManyToOne({nullable: false})
	type!: RigType;
}
