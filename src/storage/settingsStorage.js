/**
 * settingsStorage — AsyncStorage helpers for app settings persistence.
 * @module src/storage/settingsStorage
 * @author Sabata79
 * @since 2025-11-25
 * @updated 2025-11-25
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = 'SETTINGS_V1';

const defaultSettings = {
  notificationsEnabled: true,
  themeMode: 'light', // 'system' | 'light' | 'dark'
};

export async function loadSettings() {
  try {
    const json = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!json) {
      return defaultSettings;
    }
    const parsed = JSON.parse(json);
    return {
      ...defaultSettings,
      ...parsed, // if new fields are added in the future
    };
  } catch (e) {
    console.warn('Error loading settings', e);
    return defaultSettings;
  }
}

export async function saveSettings(settings) {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Error saving settings', e);
  }
}
