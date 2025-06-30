import { type InferSelectModel, sql } from 'drizzle-orm';
import {
	PgInsert,
	decimal,
	pgTable,
	timestamp,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: uuid().unique().primaryKey().defaultRandom(),
	email: varchar().notNull().unique(),
	password: varchar().notNull(),
	name: varchar().notNull(),
	// payment_customer_id: varchar(),
	// payment_method_id: varchar(),
	// payment_subscription_id: varchar(),
	// payment_subscription_status: varchar(),
	// payment_subscription_plan: varchar(),
	phone: varchar(),
	document: varchar(),
	// ID do telegram ou whatsapp
	unique_id: varchar().notNull().unique(),
	created_at: timestamp({
		withTimezone: true,
	})
		.notNull()
		.defaultNow(),
	updated_at: timestamp({
		withTimezone: true,
	})
		.notNull()
		.defaultNow()
		.$onUpdate(() => sql`NOW()`),
});

export const expenses = pgTable('expenses', {
	id: uuid().unique().primaryKey().defaultRandom(),
	user_id: uuid()
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
	cost: decimal().notNull(),
	category: varchar().notNull(),
	description: varchar().notNull(),
	type: varchar().notNull(), // Expense or Income
	created_at: varchar().notNull(),
	updated_at: varchar().notNull(),
});

export type UsersDTO = InferSelectModel<typeof users>;

export type ExpensesDTO = InferSelectModel<typeof expenses>;
