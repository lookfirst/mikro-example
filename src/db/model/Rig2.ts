import { Collection, Entity, OneToMany, PrimaryKey } from 'mikro-orm';
import { Gpu } from './Gpu';

@Entity()
export class Rig2 {
	@PrimaryKey()
	id!: number;

	@OneToMany(() => Gpu, (gpu) => gpu.rig)
	gpus = new Collection<Gpu>(this);
}
