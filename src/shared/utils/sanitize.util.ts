// Sanitize string input by removing potentially dangerous characters
export function sanitizeString(value: string): string {
  return value.replace(/[<>]/g, "");
}
