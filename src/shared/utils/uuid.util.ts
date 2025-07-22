import { v7 as uuidv7 } from "uuid";

// Generate a version 4 UUID
export function generateUUID(): string {
  return uuidv7();
}
