import { randomUUID } from "node:crypto";

// Generate a version 4 UUID
export function generateUUID(): string {
  return randomUUID();
}
