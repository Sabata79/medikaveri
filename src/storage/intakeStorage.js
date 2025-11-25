/**
 * intakeStorage — AsyncStorage helpers for medication intake tracking.
 * @module src/storage/intakeStorage
 * @author Sabata79
 * @since 2025-11-25
 * @updated 2025-11-25
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTodayKey } from '../utils/dateUtils';

const INTAKE_KEY = 'MEDICATION_INTAKE_V1';

// Returns { dateKey, intake }
// intake format: { [medId]: { [time]: true } }
export async function loadTodayIntake() {
  try {
    const json = await AsyncStorage.getItem(INTAKE_KEY);
    const today = getTodayKey();

    if (!json) {
      return { dateKey: today, intake: {} };
    }

    const parsed = JSON.parse(json);
    // If stored date is different from today → start with empty
    if (!parsed.dateKey || parsed.dateKey !== today) {
      return { dateKey: today, intake: {} };
    }

    return parsed;
  } catch (e) {
    console.warn('Error loading intake', e);
    return { dateKey: getTodayKey(), intake: {} };
  }
}

export async function saveTodayIntake(dateKey, intake) {
  try {
    await AsyncStorage.setItem(
      INTAKE_KEY,
      JSON.stringify({ dateKey, intake })
    );
  } catch (e) {
    console.warn('Error saving intake', e);
  }
}
