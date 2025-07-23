import { config } from 'dotenv';
import { z } from 'zod';

import { logger } from '@/infrastructure/logging/logger';

// Load environment variables from .env file
config();

/**
 * Environment variable schema definition using zod
 * Includes validation for general app config, database, JWT, caching, rate limiting, and logging.
 */
const envSchema = z.object({
  // General App Settings
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),

  // Database
  DATABASE_URL: z.url(),

  // JWT Authentication
  JWT_SECRET: z.string().min(10, 'JWT_SECRET must be at least 10 characters'),
  JWT_EXPIRES_IN: z.string().default('1d'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000), // 15 minutes
  RATE_LIMIT_MAX: z.coerce.number().default(100),

  // Logging
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),

  // Caching (Redis)
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().int().min(1),
  REDIS_USERNAME: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),
  CACHE_TTL: z.coerce.number().default(3600),
  // CORS
  CORS_ORIGINS: z.string().default(''),
});

// Validate environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  // Use zod's treeifyError utility to format errors (flatten is deprecated)
  logger.error('❌ Invalid environment variables:', z.treeifyError(parsedEnv.error));
  process.exit(1);
}

export const env = {
  ...parsedEnv.data,
  CORS_ORIGIN_LIST: parsedEnv.data.CORS_ORIGINS.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
};
