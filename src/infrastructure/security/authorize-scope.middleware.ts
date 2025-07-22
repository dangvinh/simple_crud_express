import { Request, Response, NextFunction } from "express";

/**
 * Middleware to authorize based on user scopes from JWT payload.
 * @param requiredScopes - list of scopes required to access the route
 */
export function authorizeScope(requiredScopes: string[]) {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    const user = (req as any).user;

    if (!user || !Array.isArray(user.scope)) {
      return res
        .status(403)
        .json({ message: "Access denied. No scope information found." });
    }

    const hasRequiredScope = requiredScopes.some((scope) =>
      user.scope.includes(scope),
    );

    if (!hasRequiredScope) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient scope." });
    }

    next();
  };
}
