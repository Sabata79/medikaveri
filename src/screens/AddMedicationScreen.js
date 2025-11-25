/**
 * AddMedicationScreen — Screen for adding a new medication.
 * @module src/screens/AddMedicationScreen
 * @author Sabata79
 * @since 2025-11-25
 * @updated 2025-11-25
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import BackHeader from '../components/BackHeader';
import { useMedications } from '../context/MedicationContext';
import { useAppTheme } from '../theme/theme';
import {
  DAY_SEGMENT_LIST,
  DAY_SEGMENT_LABELS,
  DAY_SEGMENT_ORDER,
  formatSegmentsToLabel,
} from '../constants/daySegments';
import { Ionicons } from '@expo/vector-icons';

export default function AddMedicationScreen({ navigation }) {
  const { addMedication } = useMedications();
  const { colors } = useAppTheme();
  const [step, setStep] = useState(1);

  const [name, setName] = useState('');
  const [doseAmount, setDoseAmount] = useState(1);

  // How many times per day (1–4)
  const [timesPerDay, setTimesPerDay] = useState(1);

  // Selected day segments – user chooses manually
  const [segments, setSegments] = useState([]);

  const [errors, setErrors] = useState({});

  const goBackStep = () => {
    if (step === 1) {
      navigation.goBack();
    } else {
      setStep((s) => Math.max(1, s - 1));
    }
  };

  const goNextFromStep1 = () => {
    if (!name.trim()) {
      setErrors({ name: 'Kirjoita lääkkeen nimi' });
      return;
    }
    setErrors({});
    setStep(2);
  };

  const handleSelectTimesPerDay = (value) => {
    setTimesPerDay(value);
    setSegments((prev) => {
      // if current selections fit within the new amount, keep them
      if (prev.length > 0 && prev.length <= value) {
        return prev;
      }
      // otherwise clear, user selects segments manually
      return [];
    });
  };

  const toggleSegment = (id) => {
    setSegments((prev) => {
      const exists = prev.includes(id);

      if (exists) {
        // allow turning off by click
        return prev.filter((s) => s !== id);
      }

      // max = timesPerDay
      if (prev.length >= timesPerDay) {
        return prev;
      }

      const next = [...prev, id];
      return next.sort(
        (a, b) => DAY_SEGMENT_ORDER.indexOf(a) - DAY_SEGMENT_ORDER.indexOf(b)
      );
    });
  };

  const goNextFromStep2 = () => {
    if (segments.length === 0) {
      setErrors({
        segments: 'Valitse vähintään yksi vuorokauden jakso.',
      });
      return;
    }

    if (segments.length !== timesPerDay) {
      setErrors({
        segments: `Valitse ${timesPerDay} jaksoa (nyt valittuna ${segments.length}).`,
      });
      return;
    }

    setErrors({});
    setStep(3);
  };

  const handleSave = () => {
    if (!name.trim()) {
      setStep(1);
      setErrors({ name: 'Kirjoita lääkkeen nimi' });
      return;
    }

    if (segments.length === 0) {
      setStep(2);
      setErrors({
        segments: 'Valitse vähintään yksi vuorokauden jakso.',
      });
      return;
    }

    setErrors({});

    addMedication({
      name: name.trim(),
      doseAmount,
      segments, // e.g. ['morning', 'evening'] – times are calculated internally
    });

    navigation.goBack();
  };

  const renderStepIndicator = () => (
    <Text style={[styles.stepIndicator, { color: colors.textMuted }]}>
      Vaihe {step} / 3
    </Text>
  );

  // --- STEP 1: name ---
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      {renderStepIndicator()}
      <Text style={[styles.question, { color: colors.textPrimary }]}>
        1. Minkä nimistä lääkettä otat?
      </Text>
      <Text style={[styles.helpText, { color: colors.textMuted }]}>
        Kirjoita lääkkeen nimi pakkauksesta.
      </Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Esim. Panadol 500 mg"
        placeholderTextColor="#6b7280"
        style={[
          styles.input,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.cardBorder,
            color: colors.textPrimary,
          },
        ]}
      />

      {errors.name && (
        <Text style={[styles.errorText, { color: '#f97316' }]}>
          {errors.name}
        </Text>
      )}

      <View style={styles.stepButtonsRow}>
        <TouchableOpacity
          style={[styles.stepButton, styles.secondaryStepButton]}
          onPress={goBackStep}
        >
          <Text style={styles.stepButtonText}>Peruuta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.stepButton,
            styles.primaryStepButton,
            !name.trim() && { opacity: 0.6 },
          ]}
          onPress={goNextFromStep1}
        >
          <Text style={styles.stepButtonText}>Seuraava</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // --- STEP 2: times/day + segments (without times) ---
  const renderStep2 = () => {
    const selectedText = formatSegmentsToLabel(segments);
    const selectedCount = segments.length;

    return (
      <View style={styles.stepContainer}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.step2ScrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {renderStepIndicator()}
          <Text style={[styles.question, { color: colors.textPrimary }]}>
            2. Montako kertaa lääke pitää ottaa vuorokaudessa?
          </Text>
          <Text style={[styles.helpText, { color: colors.textMuted }]}>
            Valitse kerrat lääkärin tai apteekin ohjeen mukaan. Sen jälkeen
            valitset, mihin vuorokauden jaksoihin annokset sijoittuvat.
          </Text>

          {/* 1x–4x selection */}
          <View style={styles.timesRow}>
            {[1, 2, 3, 4].map((val) => {
              const selected = val === timesPerDay;
              return (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.timesButton,
                    selected && styles.timesButtonSelected,
                  ]}
                  onPress={() => handleSelectTimesPerDay(val)}
                  activeOpacity={0.9}
                >
                  <Text
                    style={[
                      styles.timesButtonText,
                      selected && styles.timesButtonTextSelected,
                    ]}
                  >
                    {val}x
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Day segments */}
          <Text
            style={[
              styles.segmentIntro,
              { color: colors.textSecondary },
            ]}
          >
            Valitse tälle lääkkeelle vuorokauden jaksot (max {timesPerDay} kpl).
          </Text>

          <View style={styles.segmentList}>
            {DAY_SEGMENT_LIST.map((seg) => {
              const selected = segments.includes(seg.id);
              const iconColor = selected ? '#022c22' : '#e5e7eb';
              const labelColor = selected ? '#022c22' : '#e5e7eb';
              const subColor = selected ? '#064e3b' : '#9ca3af';

              return (
                <TouchableOpacity
                  key={seg.id}
                  style={[
                    styles.segmentButton,
                    selected && styles.segmentButtonSelected,
                  ]}
                  onPress={() => toggleSegment(seg.id)}
                  activeOpacity={0.85}
                >
                  <View style={styles.segmentHeaderRow}>
                    <View style={styles.segmentTitleRow}>
                      <Ionicons
                        name={seg.icon}
                        size={24}
                        color={iconColor}
                        style={styles.segmentIcon}
                      />
                      <Text
                        style={[
                          styles.segmentLabel,
                          { color: labelColor },
                        ]}
                      >
                        {seg.label}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.segmentWindow,
                        { color: subColor },
                      ]}
                    >
                      {seg.window}
                    </Text>
                  </View>

                  {seg.id === 'night' && (
                    <Text
                      style={[
                        styles.segmentNightHint,
                        { color: subColor },
                      ]}
                    >
                      Valitse yö vain, jos lääkärisi on ohjeistanut yöllisen
                      annoksen.
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <Text
            style={[styles.segmentSummary, { color: colors.textSecondary }]}
          >
            {selectedCount === 0
              ? 'Valitse vähintään yksi jakso.'
              : `Valitut jaksot: ${selectedText} (${selectedCount}x päivässä)`}
          </Text>

          <Text style={[styles.infoBox, { color: colors.textMuted }]}>
            Neljä kertaa päivässä otettavat lääkkeet ovat usein tarkasti
            ajastettuja. Varmista annosten kellonajat lääkäriltäsi tai
            apteekista. Tässä sovelluksessa valitset vain muistutusten
            ajankohdat.
          </Text>

          {errors.segments && (
            <Text style={[styles.errorText, { color: '#f97316' }]}>
              {errors.segments}
            </Text>
          )}
        </ScrollView>

        {/* button row fixed at the bottom */}
        <View style={styles.stepButtonsRow}>
          <TouchableOpacity
            style={[styles.stepButton, styles.secondaryStepButton]}
            onPress={goBackStep}
          >
            <Text style={styles.stepButtonText}>Edellinen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.stepButton, styles.primaryStepButton]}
            onPress={goNextFromStep2}
          >
            <Text style={styles.stepButtonText}>Seuraava</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // --- STEP 3: dose amount + summary (without times) ---
  const renderStep3 = () => {
    const selectedText = formatSegmentsToLabel(segments);
    const selectedCount = segments.length;
    const totalPerDay = doseAmount * selectedCount;

    return (
      <View style={styles.stepContainer}>
        {renderStepIndicator()}
        <Text style={[styles.question, { color: colors.textPrimary }]}>
          3. Kuinka monta annosta otat kerralla?
        </Text>

        <View
          style={[
            styles.block,
            { borderColor: '#1f2937' },
          ]}
        >
          <Text style={[styles.blockTitle, { color: colors.textPrimary }]}>
            Kerralla otettava määrä
          </Text>
          <View style={styles.doseRow}>
            <TouchableOpacity
              style={styles.doseButton}
              onPress={() => setDoseAmount((a) => Math.max(1, a - 1))}
            >
              <Text style={styles.doseButtonText}>−</Text>
            </TouchableOpacity>

            <View style={styles.doseValueBox}>
              <Text style={styles.doseValue}>{doseAmount}</Text>
              <Text style={styles.doseUnit}>tabletti(a)</Text>
            </View>

            <TouchableOpacity
              style={styles.doseButton}
              onPress={() => setDoseAmount((a) => Math.min(10, a + 1))}
            >
              <Text style={styles.doseButtonText}>＋</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
          {selectedCount > 0
            ? `Valitut jaksot: ${selectedText} (${selectedCount}x päivässä)`
            : 'Valitse jaksot edellisessä vaiheessa.'}
        </Text>
        <Text style={[styles.summaryText, { color: colors.textPrimary }]}>
          Yhteensä: {totalPerDay} tablettia päivässä
        </Text>

        <View style={styles.stepButtonsRow}>
          <TouchableOpacity
            style={[styles.stepButton, styles.secondaryStepButton]}
            onPress={goBackStep}
          >
            <Text style={styles.stepButtonText}>Edellinen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.stepButton, styles.primaryStepButton]}
            onPress={handleSave}
          >
            <Text style={styles.stepButtonText}>Tallenna muistutus</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCurrentStep = () => {
    if (step === 1) return renderStep1();
    if (step === 2) return renderStep2();
    return renderStep3();
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <BackHeader title="Lisää lääke" onBack={goBackStep} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>{renderCurrentStep()}</View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#020617',
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 12,
  },
  stepContainer: {
    flex: 1,
  },
  step2ScrollContent: {
    paddingBottom: 16,
  },
  stepIndicator: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  question: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 13,
    marginTop: 4,
  },
  stepButtonsRow: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  stepButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryStepButton: {
    backgroundColor: '#10b981',
  },
  secondaryStepButton: {
    backgroundColor: '#374151',
  },
  stepButtonText: {
    color: '#f9fafb',
    fontSize: 15,
    fontWeight: '600',
  },

  timesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timesButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 999,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timesButtonSelected: {
    backgroundColor: '#10b981',
  },
  timesButtonText: {
    color: '#e5e7eb',
    fontSize: 16,
    fontWeight: '600',
  },
  timesButtonTextSelected: {
    color: '#022c22',
  },

  segmentIntro: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  segmentList: {
    gap: 8,
  },
  segmentButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4b5563',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#020617',
  },
  segmentButtonSelected: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  segmentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  segmentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  segmentIcon: {
    marginRight: 8,
  },
  segmentLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  segmentWindow: {
    fontSize: 13,
  },
  segmentHint: {
    fontSize: 12,
  },
  segmentNightHint: {
    fontSize: 12,
  },
  segmentSummary: {
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
  },
  infoBox: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },

  block: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  doseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  doseButton: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doseButtonText: {
    color: '#e5e7eb',
    fontSize: 28,
    fontWeight: '600',
    marginTop: -4,
  },
  doseValueBox: {
    alignItems: 'center',
  },
  doseValue: {
    color: '#f9fafb',
    fontSize: 24,
    fontWeight: '700',
  },
  doseUnit: {
    color: '#9ca3af',
    fontSize: 14,
  },
  summaryText: {
    marginTop: 12,
    fontSize: 15,
    textAlign: 'center',
  },
});
