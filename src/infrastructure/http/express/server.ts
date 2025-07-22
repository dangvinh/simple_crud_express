import { env } from "@/config/env.config";
import { app } from "./app";
import { RedisCache } from "@/infrastructure/cache/redis.client";

const PORT = env.PORT;

export async function bootstrap(): Promise<void> {
  const redisCache = new RedisCache();
  await redisCache.connectWithRetry();

  app.listen(PORT, () => {
    console.log(`✅ Server listening on port ${PORT}`);
  });
}
