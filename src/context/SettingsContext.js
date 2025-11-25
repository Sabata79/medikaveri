// src/context/SettingsContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadSettings, saveSettings } from '../storage/settingsStorage';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    themeMode: 'system',
  });
  const [isReady, setIsReady] = useState(false);

  // Lataa asetukset alussa
  useEffect(() => {
    (async () => {
      const loaded = await loadSettings();
      setSettings(loaded);
      setIsReady(true);
    })();
  }, []);

  // Tallenna asetukset aina kun muuttuu
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
