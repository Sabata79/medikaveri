/**
 * SettingsContext — Context provider for app settings and preferences.
 * @module src/context/SettingsContext
 * @author Sabata79
 * @since 2025-11-25
 * @updated 2025-11-25
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadSettings, saveSettings } from '../storage/settingsStorage';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    themeMode: 'system',
  });
  const [isReady, setIsReady] = useState(false);

  // Load settings on mount
  useEffect(() => {
    (async () => {
      const loaded = await loadSettings();
      setSettings(loaded);
      setIsReady(true);
    })();
  }, []);

  // Save settings whenever they change
  useEffect(() => {
    if (!isReady) return;
    saveSettings(settings);
  }, [settings, isReady]);

  const setNotificationsEnabled = (value) => {
    setSettings((prev) => ({
      ...prev,
      notificationsEnabled: value,
    }));
  };

  const setThemeMode = (mode) => {
    setSettings((prev) => ({
      ...prev,
      themeMode: mode,
    }));
  };

  return (
    <SettingsContext.Provider
      value={{
        isReady,
        notificationsEnabled: settings.notificationsEnabled,
        themeMode: settings.themeMode,
        setNotificationsEnabled,
        setThemeMode,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used inside SettingsProvider');
  }
  return ctx;
}
