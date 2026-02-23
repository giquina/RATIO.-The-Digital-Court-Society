/**
 * Input validation helpers for Convex mutations.
 * Prevents oversized payloads, injection via long strings, and invalid data.
 */

export function validateStringLength(
  value: string,
  field: string,
  maxLength: number
): void {
  if (value.length > maxLength) {
    throw new Error(`${field} exceeds maximum length of ${maxLength} characters`);
  }
}

export function validateOptionalStringLength(
  value: string | undefined,
  field: string,
  maxLength: number
): void {
  if (value !== undefined && value.length > maxLength) {
    throw new Error(`${field} exceeds maximum length of ${maxLength} characters`);
  }
}

export function validateArrayLength(
  arr: unknown[],
  field: string,
  maxItems: number
): void {
  if (arr.length > maxItems) {
    throw new Error(`${field} exceeds maximum of ${maxItems} items`);
  }
}

// Standard limits for common fields
export const LIMITS = {
  TITLE: 200,
  BIO: 2000,
  DESCRIPTION: 5000,
  CONTENT: 50000,
  NAME: 100,
  SHORT_TEXT: 500,
  URL: 2000,
  MODULES: 20,
  EMAIL: 254,
} as const;
