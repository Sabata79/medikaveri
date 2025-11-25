// App.js
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { MedicationProvider } from './src/context/MedicationContext';
import { SettingsProvider } from './src/context/SettingsContext';
import { useAppTheme } from './src/theme/theme';

function AppContent() {
  const { scheme } = useAppTheme();

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <MedicationProvider>
        <RootNavigator />
      </MedicationProvider>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
