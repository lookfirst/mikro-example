import {AbstractNamingStrategy} from "mikro-orm";

export class PascalCaseNamingStrategy extends AbstractNamingStrategy {

	classToTableName(entityName: string): string {
		return entityName;
	}

	joinColumnName(propertyName: string): string {
		return propertyName;
	}

	joinKeyColumnName(entityName: string, referencedColumnName?: string): string {
		return entityName.substr(0, 1).toLowerCase() + entityName.substr(1);
	}

	joinTableName(sourceEntity: string, targetEntity: string, propertyName?: string): string {
		return this.classToTableName(sourceEntity) + '_to_' + this.classToTableName(targetEntity);
	}

	propertyToColumnName(propertyName: string): string {
		return propertyName;
	}

	referenceColumnName(): string {
		return 'id';
	}

}

