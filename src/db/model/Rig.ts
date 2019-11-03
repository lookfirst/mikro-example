import {Entity, IdEntity, ManyToOne, PrimaryKey} from "mikro-orm";
import {RigType} from "./RigType";

@Entity()
export class Rig implements IdEntity<Rig>{
	@PrimaryKey()
	id!: number;

	@ManyToOne({nullable: false})
	type!: RigType;
}
