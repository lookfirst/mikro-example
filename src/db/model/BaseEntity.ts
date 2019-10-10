import {Property} from "mikro-orm";


export abstract class BaseEntity {
	@Property({onUpdate: () => new Date(), columnType: 'timestamptz'})
	updatedAt = new Date();
}
