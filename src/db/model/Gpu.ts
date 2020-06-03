import { Entity, ManyToOne, PrimaryKey } from 'mikro-orm';
import { Rig2 } from './Rig2';

@Entity()
export class Gpu {
	@PrimaryKey()
	id!: number;

	@ManyToOne()
	rig!: Rig2;
}
