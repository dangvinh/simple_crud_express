import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { CreateProductSchema } from '../schemas/zod/product.openapi';

export const validateCreateProduct = (req: Request, res: Response, next: NextFunction) => {
  try {
    CreateProductSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      message: 'Invalid product data',
      errors: error instanceof z.ZodError ? error.message : [],
    });
  }
};
