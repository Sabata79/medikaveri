// src/storage/medicationStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const MEDICATIONS_KEY = 'MEDICATIONS_V1'; // versio tagiin, jos malli muuttuu tulevaisuudessa

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
