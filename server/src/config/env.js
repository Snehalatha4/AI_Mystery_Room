import { config } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
  MONGODB_URI: z.string().min(1).default('mongodb://127.0.0.1:27017/ai_mystery_room'),
  GEMINI_API_KEY: z.string().optional().default(''),
  GEMINI_MODEL: z.string().min(1).default('gemini-3.8-flash'),
  GEMINI_MAX_OUTPUT_TOKENS: z.coerce.number().int().min(1000).max(64000).default(16000),
  AI_MAX_RETRIES: z.coerce.number().int().min(0).max(3).default(2),
  MAX_CASE_RETRIES: z.coerce.number().int().min(0).max(3).default(2),
  AI_REQUEST_TIMEOUT_MS: z.coerce.number().int().min(5000).max(180000).default(60000),
  MAX_ACTIVE_GENERATIONS: z.coerce.number().int().positive().default(3),
  CASE_TTL_DAYS: z.coerce.number().int().positive().default(30),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(30),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}
export const env = parsed.data;
