import { app } from './app';

import { logger } from '@/infrastructure/logging/logger';
import { env } from '@/config/env.config';

const PORT = env.PORT;

export async function bootstrap(): Promise<void> {
  app.listen(PORT, () => {
    logger.info(`✅ Server listening on port ${PORT}`);
  });
}
