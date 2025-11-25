/**
 * TimePickerField — Time selection field component for medication reminders.
 * @module src/components/TimePickerField
 * @author Sabata79
 * @since 2025-11-25
 * @updated 2025-11-25
 */
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/theme';

export default function TimePickerField({
  label = 'Kellonaika', // Time
  helpText = 'Valitse kellonaika painamalla nappia.', // Select time by pressing the button.
  value,            // "HH:MM"
  onChange,         // (newTimeString) => void
}) {
  const [showPicker, setShowPicker] = useState(false);
  const { colors } = useAppTheme();
  const [date, setDate] = useState(() => {
    if (value && /^\d{2}:\d{2}$/.test(value)) {
      const [h, m] = value.split(':').map((n) => parseInt(n, 10));
      const d = new Date();
      d.setHours(h, m, 0, 0);
      return d;
    }
    const d = new Date();
    d.setHours(8, 0, 0, 0);
    return d;
  });

  useEffect(() => {
    if (value && /^\d{2}:\d{2}$/.test(value)) {
      const [h, m] = value.split(':').map((n) => parseInt(n, 10));
      const d = new Date();
      d.setHours(h, m, 0, 0);
      setDate(d);
    }
  }, [value]);

  const formatTime = (d) => {
    const h = d.getHours().toString().padStart(2, '0');
    const m = d.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  const handleChange = (event, selectedDate) => {
    setShowPicker(false);
    if (!selectedDate) return; // peruutus
    setDate(selectedDate);
    const formatted = formatTime(selectedDate);
    onChange && onChange(formatted);
  };

    return (
    <View style={styles.container}>
      {label ? (
        <Text
          style={[
            styles.label,
            { color: colors.textSecondary }, // teeman mukainen
          ]}
        >
          {label}
        </Text>
      ) : null}

      <TouchableOpacity
        style={[
          styles.timeButton,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.cardBorder,
          },
        ]}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.8}
      >
        <Ionicons
          name="time-outline"
          size={40}
          color={colors.textPrimary}
          style={styles.icon}
        />
        <Text
          style={[
            styles.timeButtonLabel,
            { color: colors.textMuted },
          ]}
        >
          Muistutus klo
        </Text>
        <Text
          style={[
            styles.timeButtonValue,
            { color: colors.textPrimary },
          ]}
        >
          {value}
        </Text>
      </TouchableOpacity>

      {helpText ? (
        <Text
          style={[
            styles.helpText,
            { color: colors.textMuted },
          ]}
        >
          {helpText}
        </Text>
      ) : null}

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  label: {
    color: '#e5e7eb',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  timeButton: {
    backgroundColor: '#111827',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  icon: {
    marginBottom: 8,
  },
  timeButtonLabel: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 4,
  },
  timeButtonValue: {
    color: '#f9fafb',
    fontSize: 28,
    fontWeight: '700',
  },
  helpText: {
    color: '#6b7280',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});
