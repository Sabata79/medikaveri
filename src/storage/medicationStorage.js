/**
 * medicationStorage — AsyncStorage helpers for medication list persistence.
 * @module src/storage/medicationStorage
 * @author Sabata79
 * @since 2025-11-25
 * @updated 2025-11-25
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const MEDICATIONS_KEY = 'MEDICATIONS_V1'; // version tag for future model changes

export async function loadMedications() {
  try {
    const json = await AsyncStorage.getItem(MEDICATIONS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.warn('Error loading medications', e);
    return [];
  }
}

export async function saveMedications(medications) {
  try {
    await AsyncStorage.setItem(MEDICATIONS_KEY, JSON.stringify(medications));
  } catch (e) {
    console.warn('Error saving medications', e);
  }
}
