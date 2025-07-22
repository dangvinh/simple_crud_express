import { env } from "@/config/env";
import type { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

const corsOptions: cors.CorsOptions = {
  origin: env.CORS_ORIGIN_LIST,
  credentials: true,
};

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, please try again later.",
});

export function applySecurityMiddleware(app: Express): void {
  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(rateLimiter);
}
