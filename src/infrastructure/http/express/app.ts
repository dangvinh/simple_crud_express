// src/infrastructure/http/express/app.ts
import express from "express";
import morgan from "morgan";
import "@/types/express";
import { productRouter } from "../../../interfaces/http/routes/product.routes";
import { applySecurityMiddleware } from "@/infrastructure/security/middlewares/security.middleware";
import { authenticateJWT } from "@/infrastructure/security/middlewares/jwt.middleware";
import { authorizeRole } from "@/infrastructure/security/middlewares/authorize-role.middleware";
import { authorizeScope } from "@/infrastructure/security/middlewares/authorize-scope.middleware";

const app = express();

applySecurityMiddleware(app);

// JSON parsing
app.use(express.json());

// Logging
app.use(morgan("dev"));

// Public GET route for all roles with product:read scope
app.get(
  "/api/v1/products",
  authenticateJWT,
  authorizeRole(["admin", "editor", "customer"]),
  authorizeScope(["product:read"]),
  productRouter,
);

// Protected routes for admin/editor with read/write
app.use(
  "/api/v1/products",
  authenticateJWT,
  authorizeRole(["admin", "editor"]),
  authorizeScope(["product:read", "product:write"]),
  productRouter,
);

export { app };
