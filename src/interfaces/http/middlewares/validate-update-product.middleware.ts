import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { UpdateProductSchema } from '../schemas/zod/product.openapi';

export function validateUpdateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    UpdateProductSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      message: 'Invalid request payload',
      errors: error instanceof z.ZodError ? error.message : error,
    });
  }
}
