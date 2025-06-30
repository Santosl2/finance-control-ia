import { defineConfig } from 'drizzle-kit';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
	throw new Error('DATABASE_URL is required');
}

export default defineConfig({
	dialect: 'postgresql',
	dbCredentials: {
		url: DATABASE_URL,
	},
	schema: './src/config/db/schema.ts',
	out: './src/config/db/migrations',
});
