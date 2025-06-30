import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  GOOGLE_SPREADSHEET_ID: z.string().min(1),

  OLLAMA_API_URL: z.string().url(),
  USE_OLLAMA: z
    .string()
    .optional()
    .transform((val) => val === "true"),

  // Optional
  FEATURE_FLAG_SAVE_TO_GOOGLE_SHEET: z
    .string()
    .optional()
    .transform((val) => val === "true"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  throw new Error("Invalid environment variables");
}

export const env = parsedEnv.data;
