// src/storage/intakeStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTodayKey } from '../utils/dateUtils';

const INTAKE_KEY = 'MEDICATION_INTAKE_V1';

// Palauttaa { dateKey, intake }
// intake-muoto: { [medId]: { [time]: true } }
export async function loadTodayIntake() {
  try {
    const json = await AsyncStorage.getItem(INTAKE_KEY);
    const today = getTodayKey();

    if (!json) {
      return { dateKey: today, intake: {} };
    }

    const parsed = JSON.parse(json);
    // Jos talletettu päivä on eri kuin tämä päivä → aloita tyhjällä
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
