// src/infrastructure/http/express/app.ts
import express from 'express';
import morgan from 'morgan';

import { productRouter } from '../../../interfaces/http/routes/product.routes';

import { applySecurityMiddleware } from '@/infrastructure/http/express/middlewares/security.middleware';
import { SwaggerConfig } from '@/config/swagger.config';
import { redisCache } from '@/infrastructure/cache';
// import { authenticateJWT } from "@/infrastructure/http/express/middlewares/jwt.middleware";
// import { authorizeRole } from "@/infrastructure/http/express/middlewares/authorize-role.middleware";
// import { authorizeScope } from "@/infrastructure/http/express/middlewares/authorize-scope.middleware";

const app = express();

SwaggerConfig.registerSchemas();
SwaggerConfig.setup(app);

applySecurityMiddleware(app);

// JSON parsing
app.use(express.json());

// Logging
app.use(morgan('dev'));

// Public GET route for all roles with product:read scope
app.get(
  '/api/v1/products',
  // authenticateJWT,
  // authorizeRole(["admin", "editor", "customer"]),
  // authorizeScope(["product:read"]),
  productRouter,
);

// Protected routes for admin/editor with read/write
app.use(
  '/api/v1/products',
  // authenticateJWT,
  // authorizeRole(["admin", "editor"]),
  // authorizeScope(["product:read", "product:write"]),
  productRouter,
);

await redisCache.connectWithRetry();

export { app };
