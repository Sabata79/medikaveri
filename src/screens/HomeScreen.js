/**
 * HomeScreen — Main screen showing today's medications and actions.
 * @module src/screens/HomeScreen
 * @author Sabata79
 * @since 2025-11-25
 * @updated 2025-11-25
 */
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useMedications } from '../context/MedicationContext';
import { useAppTheme } from '../theme/theme';
import { COMPLETE_TEXT } from '../constants/CompleteTexts';
import {
  DAY_SEGMENT_LABELS,
  DAY_SEGMENT_WINDOWS,
  DAY_SEGMENT_ORDER,
  DAY_SEGMENT_ICONS,
} from '../constants/daySegments';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const {
    medications,
    isReady,
    removeMedication,
    todayIntake,
    markDoseTaken,
  } = useMedications();

  const { colors } = useAppTheme();

  const confirmDelete = (med) => {
    Alert.alert(
      'Poista lääke',
      `Haluatko varmasti poistaa lääkkeen "${med.name}"?\n\n` +
        `Lääkkeen poistamisen jälkeen et saa enää päivittäistä muistutusta ` +
        `"${med.name}" lääkkeenotosta.`,
      [
        { text: 'Peruuta', style: 'cancel' },
        {
          text: 'Poista',
          style: 'destructive',
          onPress: () => removeMedication(med.id),
        },
      ]
    );
  };

  const getSegmentsForMed = (med) => {
    if (Array.isArray(med.segments) && med.segments.length > 0) {
      return [...med.segments].sort(
        (a, b) => DAY_SEGMENT_ORDER.indexOf(a) - DAY_SEGMENT_ORDER.indexOf(b)
      );
    }
    return [];
  };

  const isDoseTaken = (medId, segmentId) => {
    const forMed = todayIntake?.[medId];
    if (!forMed) return false;

    if (Array.isArray(forMed)) {
      return forMed.includes(segmentId);
    }

    return !!forMed[segmentId];
  };

  const isMedicationComplete = (med) => {
    const segments = getSegmentsForMed(med);
    if (segments.length === 0) return false;

    const forMed = todayIntake?.[med.id];
    if (!forMed) return false;

    if (Array.isArray(forMed)) {
      return segments.every((seg) => forMed.includes(seg));
    }

    return segments.every((seg) => !!forMed[seg]);
  };

  const getCompleteTextForMed = (med) => {
    if (!med?.id) return COMPLETE_TEXT[0];
    const hash = med.id
      .split('')
      .reduce((sum, ch) => sum + ch.charCodeAt(0), 0);

    const index = hash % COMPLETE_TEXT.length;
    return COMPLETE_TEXT[index];
  };

  const renderContent = () => {
    if (!isReady) {
      return (
        <View
          style={[
            styles.placeholderBox,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <Text style={[styles.placeholderText, { color: colors.textPrimary }]}>
            Ladataan lääkkeitä...
          </Text>
        </View>
      );
    }

    if (medications.length === 0) {
      return (
        <View
          style={[
            styles.placeholderBox,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <Text style={[styles.placeholderText, { color: colors.textPrimary }]}>
            Ei vielä lääkkeitä lisättynä.
          </Text>
          <Text
            style={[
              styles.placeholderTextSmall,
              { color: colors.textMuted },
            ]}
          >
            Paina “Lisää lääke” aloittaaksesi.
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
      >
        {medications.map((med) => {
          const segments = getSegmentsForMed(med);
          const completed = isMedicationComplete(med);
          const timesPerDay = segments.length || med.timesPerDay || 0;

          return (
            <View key={med.id} style={styles.medCardWrapper}>
              <View
                style={[
                  styles.medCard,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: completed ? colors.accent : colors.cardBorder,
                  },
                ]}
              >
                <View style={styles.medHeaderRow}>
                  <Text
                    style={[styles.medName, { color: colors.textPrimary }]}
                  >
                    {med.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => confirmDelete(med)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text
                      style={[styles.menuDots, { color: colors.textMuted }]}
                    >
                      •••
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text
                  style={[
                    styles.medSummary,
                    { color: colors.textSecondary },
                  ]}
                >
                  {med.doseAmount} kpl · {timesPerDay}x päivässä
                </Text>

                <View style={styles.dosesContainer}>
                  <Text
                    style={[
                      styles.dosesTitle,
                      { color: colors.textMuted },
                    ]}
                  >
                    Tämän päivän ottoajantkohdat:
                  </Text>

                  {segments.map((segId) => {
                    const taken = isDoseTaken(med.id, segId);
                    const label = DAY_SEGMENT_LABELS[segId] || segId;
                    const window = DAY_SEGMENT_WINDOWS[segId] || '';
                    const iconName = DAY_SEGMENT_ICONS[segId];

                    return (
                      <View key={segId} style={styles.doseRow}>
                        <View style={styles.segmentLeft}>
                          {iconName ? (
                            <Ionicons
                              name={iconName}
                              size={28}
                              color={colors.accent}
                              style={styles.segmentIcon}
                            />
                          ) : null}

                          <View style={styles.segmentTextColumn}>
                            <Text
                              style={[
                                styles.doseSegmentLabel,
                                { color: colors.textPrimary },
                              ]}
                            >
                              {label}
                            </Text>
                            {!!window && (
                              <Text
                                style={[
                                  styles.doseSegmentWindow,
                                  { color: colors.textMuted },
                                ]}
                              >
                                {window}
                              </Text>
                            )}
                          </View>
                        </View>

                        <TouchableOpacity
                          style={[
                            styles.doseButton,
                            {
                              backgroundColor: taken
                                ? colors.accent
                                : colors.cardBorder,
                            },
                          ]}
                          disabled={taken}
                          onPress={() => markDoseTaken(med.id, segId)}
                        >
                          <Text
                            style={[
                              styles.doseButtonText,
                              {
                                color: taken ? '#022c22' : colors.textPrimary,
                              },
                            ]}
                          >
                            {taken ? 'Otettu' : 'Merkitse otetuksi'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>

                {completed && (
                  <Text
                    style={[
                      styles.medDoneText,
                      { color: colors.accent },
                    ]}
                  >
                    {getCompleteTextForMed(med)}
                  </Text>
                )}
              </View>

              {completed && (
                <View style={styles.completedOverlay}>
                  <View style={styles.completedBadge}>
                    <Ionicons name="checkmark-circle" size={200} color="#16a34aa3" />
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]} >
          Tämän päivän lääkkeet
        </Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Lisää lääkkeet ja merkitse vuorokauden jaksot otetuiksi.
        </Text>
      </View>

      {renderContent()}

      <View style={[styles.buttonRow, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.primaryButton,
            { backgroundColor: colors.accent },
          ]}
          onPress={() => navigation.navigate('AddMedication')}
        >
          <Text style={styles.buttonText}>➕ Lisää lääke</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.secondaryButton,
            { backgroundColor: '#374151' },
          ]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.buttonText}>⚙️ Asetukset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: '#020617',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    color: '#e5e7eb',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    marginTop: 5, // moved 5px lower
    textAlign: 'center',
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
  },
  placeholderBox: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  placeholderText: {
    color: '#e5e7eb',
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  placeholderTextSmall: {
    color: '#6b7280',
    fontSize: 13,
    textAlign: 'center',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 8,
  },

  medCardWrapper: {
    marginBottom: 16,
  },
  medCard: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    backgroundColor: '#020617',
  },
  medHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  menuDots: {
    fontSize: 20,
    paddingHorizontal: 4,
  },
  medName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  medSummary: {
    fontSize: 16,
    marginTop: 2,
    marginBottom: 6,
    textAlign: 'center',
  },

  dosesContainer: {
    marginTop: 4,
    gap: 6,
  },
  dosesTitle: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  doseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  segmentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  segmentIcon: {
    marginRight: 10,
  },
  segmentTextColumn: {
    flexDirection: 'column',
  },
  doseSegmentLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  doseSegmentWindow: {
    fontSize: 13,
  },
  doseButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  doseButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },

  medDoneText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  completedOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  completedBadge: {
    width: 200,
    height: 200,
    borderRadius: 32,
    backgroundColor: 'rgba(15, 23, 42, 0)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 10, // moved 10px higher
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#10b981',
  },
  secondaryButton: {
    backgroundColor: '#374151',
  },
  buttonText: {
    color: '#f9fafb',
    fontSize: 15,
    fontWeight: '600',
  },
});
