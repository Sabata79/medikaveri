/**
 * calculateDoseTimes — Utility for calculating dose times based on segments.
 * @module src/utils/calculateDoseTimes
 * @author Sabata79
 * @since 2025-11-25
 * @updated 2025-11-25
 */

// Can use day segment windows to form technical times if needed. This is not shown to the user.
import { DAY_SEGMENT_WINDOWS } from '../constants/daySegments';

/**
 * Safe helper function that returns a list of "HH:MM" values.
 *
 * In the current model:
 * - UI DOES NOT show these times to the user
 * - Function exists mainly for technical push notification scheduling
 *   and to avoid breaking old calls in the app.
 *
 * Accepts two call signatures:
 *   1) calculateDoseTimes(['morning', 'evening'])
 *   2) calculateDoseTimes(firstTime, timesPerDay)  // old signature
 */
export function calculateDoseTimes(arg1, arg2) {
  // NEW MODEL: if the first argument is an array of segment ids
  // e.g. ['morning', 'day', 'evening']
  if (Array.isArray(arg1)) {
    const segments = arg1;

    return segments.map((segId) => {
      const window = DAY_SEGMENT_WINDOWS?.[segId];

      // Try to roughly calculate the window midpoint as HH:00
      if (typeof window === 'string') {
        // Expecting format like "06–12" etc.
        const parts = window.replace('–', '-').split('-'); // en dash -> hyphen
        if (parts.length === 2) {
          const start = parseInt(parts[0], 10);
          const end = parseInt(parts[1], 10);

          if (!Number.isNaN(start) && !Number.isNaN(end)) {
            const mid = (start + end) / 2; // rough midpoint
            const hour = Math.round(mid).toString().padStart(2, '0');
            return `${hour}:00`;
          }
        }
      }

      // If window could not be parsed, just return a neutral time
      return '08:00';
    });
  }

  // OLD MODEL: (firstTime, timesPerDay) — do not want to crash,
  // just return an empty list for now.
  // Possibly later, old logic can be added here if still needed.
  if (typeof arg1 === 'string' && typeof arg2 === 'number') {
    return [];
  }

  // If arguments are invalid, safely return an empty array.
  return [];
}
