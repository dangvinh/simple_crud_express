// types/express/index.d.ts
import { Request } from "express";

declare module "express" {
  interface Request {
    user?: {
      id: string;
      role: string;
      scopes: string[];
    };
  }
}
