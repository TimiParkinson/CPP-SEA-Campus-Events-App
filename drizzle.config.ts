import { defineConfig } from 'drizzle-kit';
import 'dotenv/config'; // Make drizzle.config.ts load .env

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'postgresql',
	dbCredentials: { url: process.env.DATABASE_URL },
	verbose: true,
	strict: true,
	out: './drizzle' // Tells drizzle-kit where to drop its migration files, keep it so schema history is visible
});
