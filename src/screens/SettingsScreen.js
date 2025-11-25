// src/screens/SettingsScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { useAppTheme } from '../theme/theme';
import BackHeader from '../components/BackHeader';
import { useSettings } from '../context/SettingsContext';

export default function SettingsScreen({ navigation }) {
  const {
    isReady,
    notificationsEnabled,
    themeMode,
    setNotificationsEnabled,
    setThemeMode,
  } = useSettings();
  const { colors } = useAppTheme();

  const handleToggleNotifications = (value) => {
    setNotificationsEnabled(value);
    // myöhemmin kytketään tähän oikeat ilmoitusluvat / peruutukset
  };

  const handleSelectTheme = (mode) => {
    setThemeMode(mode);
    // myöhemmin: kytketään oikeaan teemapalettiin
  };

  if (!isReady) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <BackHeader title="Asetukset" onBack={() => navigation.goBack()} />
        <View style={styles.loadingBox}>
          <Text style={[styles.loadingText, { color: colors.textPrimary }]}>
            Ladataan asetuksia...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <BackHeader title="Asetukset" onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        {/* Ilmoitukset */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Ilmoitukset
          </Text>
          <Text
            style={[
              styles.sectionDescription,
              { color: colors.textMuted },
            ]}
          >
            Lääkemuistutukset ovat käytössä, kun tämä kytkin on päällä.
          </Text>

          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>
              Lääkemuistutukset
            </Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              thumbColor={notificationsEnabled ? colors.accent : '#f9fafb'}
              trackColor={{ false: '#4b5563', true: '#047857' }}
            />
          </View>
        </View>

        {/* Teema */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Teema
          </Text>
          <Text
            style={[
              styles.sectionDescription,
              { color: colors.textMuted },
            ]}
          >
            Voit käyttää tummaa tai vaaleaa tilaa, tai seurata puhelimen omaa
            asetusta.
          </Text>

          <View style={styles.themeRow}>
            <ThemeOption
              label="Seuraa puhelinta"
              value="system"
              selected={themeMode === 'system'}
              onPress={handleSelectTheme}
            />
          </View>

          <View style={styles.themeRow}>
            <ThemeOption
              label="Tumma"
              value="dark"
              selected={themeMode === 'dark'}
              onPress={handleSelectTheme}
            />
            <ThemeOption
              label="Vaalea"
              value="light"
              selected={themeMode === 'light'}
              onPress={handleSelectTheme}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

function ThemeOption({ label, value, selected, onPress }) {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      style={[
        styles.themeButton,
        {
          borderColor: colors.cardBorder,
          backgroundColor: colors.cardBackground,
        },
        selected && {
          borderColor: colors.accent,
        },
      ]}
      onPress={() => onPress(value)}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.themeButtonText,
          { color: colors.textPrimary },
          selected && {
            color: colors.accent,
            fontWeight: '700',
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#020617',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#e5e7eb',
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    backgroundColor: '#020617',
  },
  sectionTitle: {
    color: '#e5e7eb',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionDescription: {
    color: '#9ca3af',
    fontSize: 13,
    marginBottom: 12,
  },
  row: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: {
    color: '#e5e7eb',
    fontSize: 16,
  },
  themeRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  themeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#4b5563',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeButtonSelected: {
    borderColor: '#10b981',
    backgroundColor: '#022c22',
  },
  themeButtonText: {
    color: '#e5e7eb',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  themeButtonTextSelected: {
    color: '#bbf7d0',
    fontWeight: '700',
  },
});
