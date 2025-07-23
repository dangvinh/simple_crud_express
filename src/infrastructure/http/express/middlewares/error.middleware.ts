import type { Request, Response, NextFunction } from 'express';

import { DomainError } from '@/shared/errors/domain.error';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { ValidationError } from '@/shared/errors/validation.error';
import { AuthenticationError, AuthorizationError } from '@/shared/errors/auth.error';
import { DatabaseError } from '@/shared/errors/database.error';
import { logger } from '@/infrastructure/logging/logger';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof DomainError) {
    return res.status(400).json({
      error: 'DomainError',
      message: err.message,
    });
  }

  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
    });
  }

  if (err instanceof AuthenticationError || err instanceof AuthorizationError) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
    });
  }

  if (err instanceof DatabaseError) {
    logger.error('Database error occurred', { error: err });
    return res.status(err.statusCode).json({
      error: err.name,
      message: 'Internal database error',
    });
  }

  logger.error('Unhandled error occurred', { error: err });

  return res.status(500).json({
    error: 'InternalServerError',
    message: 'Something went wrong',
  });
}
