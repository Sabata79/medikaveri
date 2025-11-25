/**
 * theme — Theme palette and hook for app theming.
 * @module src/theme/theme
 * @author Sabata79
 * @since 2025-11-25
 * @updated 2025-11-25
 */
import { useColorScheme } from 'react-native';
import { useSettings } from '../context/SettingsContext';

const palettes = {
  dark: {
    background: '#020617',
    cardBackground: '#020617',
    cardBorder: '#1f2937',
    textPrimary: '#f9fafb',
    textSecondary: '#e5e7eb',
    textMuted: '#9ca3af',
    accent: '#10b981',
    danger: '#ef4444',
  },
  light: {
    background: '#f9fafb',
    cardBackground: '#ffffff',
    cardBorder: '#d1d5db',
    textPrimary: '#111827',
    textSecondary: '#374151',
    textMuted: '#6b7280',
    accent: '#059669',
    danger: '#b91c1c',
  },
};

export function useAppTheme() {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const { themeMode } = useSettings();

  // decide which theme to use
  let scheme = themeMode;
  if (themeMode === 'system') {
    scheme = systemScheme || 'light';
  }

  const colors = palettes[scheme] || palettes.dark;

  return { scheme, colors };
}
