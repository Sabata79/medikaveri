// src/utils/dateUtils.js
/**
 * dateUtils — Utility for date formatting and keys.
 * @module src/utils/dateUtils
 * @author Sabata79
 * @since 2025-11-25
 * @updated 2025-11-25
 */
export function getTodayKey() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`; // esim. "2025-03-22"
}
