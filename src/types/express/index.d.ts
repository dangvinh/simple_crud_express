// types/express/index.d.ts

declare module 'express' {
  interface Request {
    user?: {
      id: string;
      role: string;
      scopes: string[];
    };
  }
}
