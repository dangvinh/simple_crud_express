import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import type { Express } from "express";

const corsOptions: cors.CorsOptions = {
  origin: ["http://localhost:4000"], // TODO: Replace with real client domains
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
