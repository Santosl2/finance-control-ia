import { z } from 'zod';

const envSchema = z.object({
	DATABASE_URL: z.string().url(),
	TELEGRAM_BOT_TOKEN: z.string().min(1),
	GOOGLE_SPREADSHEET_ID: z.string().min(1),
	OLLAMA_API_URL: z.string().url(),

	// Optional
	FEATURE_FLAG_SAVE_TO_GOOGLE_SHEET: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
	console.error('❌ Invalid environment variables:', parsedEnv.error.format());
	throw new Error('Invalid environment variables');
}

export const env = {
	DB_URL: parsedEnv.data.DATABASE_URL,
	TELEGRAM_BOT_TOKEN: parsedEnv.data.TELEGRAM_BOT_TOKEN,
	GOOGLE_SPREADSHEET_ID: parsedEnv.data.GOOGLE_SPREADSHEET_ID,
	OLLAMA_API_URL: parsedEnv.data.OLLAMA_API_URL,

	// Optional
	FEATURE_FLAG_SAVE_TO_GOOGLE_SHEET:
		parsedEnv.data.FEATURE_FLAG_SAVE_TO_GOOGLE_SHEET === 'true',
};
