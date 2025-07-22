import { redis } from "./redis.client";
import { Product } from "@/domain/product/entities/product.entity";
import { logger } from "@/infrastructure/logging/logger";

const CACHE_PREFIX = "product:";
const CACHE_TTL = 60 * 5; // 5 minutes

function buildKey(id: string): string {
  return `${CACHE_PREFIX}${id}`;
}

export const ProductCache = {
  async get(id: string): Promise<Product | null> {
    const key = buildKey(id);
    try {
      const cached = await redis.get(key);
      if (!cached) {
        logger.debug(`Cache miss for product ${id}`);
        return null;
      }

      const json = JSON.parse(cached);
      logger.debug(`Cache hit for product ${id}`);
      return new Product(json); // Ensure DTO matches constructor
    } catch (e) {
      logger.warn(`Redis error during get for product ${id}`, e);
      return null;
    }
  },

  async set(product: Product): Promise<void> {
    const key = buildKey(product.id);
    try {
      const data = JSON.stringify(product);
      await redis.setEx(key, CACHE_TTL, data);
      logger.debug(`Product ${product.id} cached with TTL=${CACHE_TTL}s`);
    } catch (e) {
      logger.error(`Redis error during set for product ${product.id}`, e);
    }
  },

  async del(id: string): Promise<void> {
    const key = buildKey(id);
    try {
      await redis.del(key);
      logger.debug(`Product ${id} removed from cache`);
    } catch (e) {
      logger.error(`Redis error during delete for product ${id}`, e);
    }
  },
};
