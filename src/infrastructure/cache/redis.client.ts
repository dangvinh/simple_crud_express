import { createClient } from "redis";
import { env } from "@/config/env";

const credentials =
  env.REDIS_USERNAME && env.REDIS_PASSWORD
    ? `${env.REDIS_USERNAME}:${env.REDIS_PASSWORD}@`
    : "";

const redisUrl = `redis://${credentials}${env.REDIS_HOST}:${env.REDIS_PORT}`;

const redis = createClient({ url: redisUrl });

redis.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

redis.on("connect", () => {
  console.log("✅ Redis connected.");
});

await redis.connect();

export { redis };
