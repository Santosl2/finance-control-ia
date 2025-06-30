import { db } from '@config/db';
import { users } from '@config/db/schema';
import { InferSelectModel, type SQL } from 'drizzle-orm';
import { type PgTable, PgTableWithColumns } from 'drizzle-orm/pg-core';

export interface IRepository {
	create(data: any): Promise<any>;
	update(data: any): Promise<any>;
	delete(id: string): Promise<any>;
	findOne(id: string): Promise<any>;
	findAll(): Promise<any>;
}

export class DrizzleRepository<T extends PgTable> {
	constructor(private entity: T) {}

	get create() {
		return db.insert(this.entity);
	}

	get update() {
		return db.update(this.entity);
	}

	get delete() {
		return db.delete(this.entity);
	}

	find(where: SQL<unknown>) {
		return db
			.select()
			.from(this.entity as any)
			.where(where);
	}
}
