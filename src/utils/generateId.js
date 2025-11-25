/**
 * generateId — Utility for generating unique IDs.
 * @module src/utils/generateId
 * @author Sabata79
 * @since 2025-11-25
 * @updated 2025-11-25
 */
export function generateId(prefix = 'med') {
  const timePart = Date.now().toString();
  const randomPart = Math.random().toString(16).slice(2, 8);
  return `${prefix}-${timePart}-${randomPart}`;
}