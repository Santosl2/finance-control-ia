import { env } from '@config/env';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const pg = postgres(env.DB_URL!);
const db = drizzle({
	client: pg,
});
export { db, pg };
