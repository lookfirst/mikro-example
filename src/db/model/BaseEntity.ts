import {IEntity, Property} from "mikro-orm";


export abstract class BaseEntity {
	@Property({onUpdate: () => new Date(), columnType: 'timestamptz'})
	updatedAt = new Date();
}

export interface BaseEntity extends IEntity {
}
