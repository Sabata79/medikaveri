/**
 * MedicationContext — Context provider for medication state and logic.
 * @module src/context/MedicationContext
 * @author Sabata79
 * @since 2025-11-25
 * @updated 2025-11-25
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadMedications, saveMedications } from '../storage/medicationStorage';
import { calculateDoseTimes } from '../utils/calculateDoseTimes';
import { generateId } from '../utils/generateId';
import { loadTodayIntake, saveTodayIntake } from '../storage/intakeStorage';
import { getTodayKey } from '../utils/dateUtils';

const MedicationContext = createContext(null);

export function MedicationProvider({ children }) {
  const [medications, setMedications] = useState([]);
  const [isReady, setIsReady] = useState(false);

  // Today's intakes: { [medId]: { [time]: true } }
  const [todayKey, setTodayKey] = useState(getTodayKey());
  const [todayIntake, setTodayIntake] = useState({});

  // Load medications and today's intakes on mount
  useEffect(() => {
    (async () => {
      const stored = await loadMedications();
      setMedications(stored);

      const { dateKey, intake } = await loadTodayIntake();
      setTodayKey(dateKey);
      setTodayIntake(intake);

      setIsReady(true);
    })();
  }, []);

  // Save medications whenever they change
  useEffect(() => {
    if (!isReady) return;
    saveMedications(medications);
  }, [medications, isReady]);

  const createLocalId = () => {
    return `med_${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`;
  };

  const addMedication = ({ name, doseAmount, segments }) => {
    // segments: e.g. ['morning', 'evening']
    const doseTimes = calculateDoseTimes(segments);
    const timesPerDay = segments?.length ?? 0;

    const newMed = {
      id: createLocalId(),      // use the same ID function as before
      name,
      doseAmount,
      segments,                 // also store segments
      timesPerDay,              // e.g. 2x per day
      doseTimes,                // e.g. ['08:00', '20:00']
      // later: can add e.g. course duration, lastTaken, etc.
    };

    setMedications((prev) => [...prev, newMed]);
  };

  const removeMedication = (id) => {
    setMedications((prev) => prev.filter((med) => med.id !== id));
    // Also remove today's intake data for this medication
    setTodayIntake((prev) => {
      if (!prev[id]) return prev;
      const updated = { ...prev };
      delete updated[id];
      saveTodayIntake(todayKey, updated);
      return updated;
    });
  };

  // Mark a single dose time as taken for today
  const markDoseTaken = (medId, doseTime) => {
    setTodayIntake((prev) => {
      const medIntake = prev[medId] || {};
      if (medIntake[doseTime]) {
        return prev; // already taken
      }
      const updatedMed = { ...medIntake, [doseTime]: true };
      const updated = { ...prev, [medId]: updatedMed };
      saveTodayIntake(todayKey, updated);
      return updated;
    });
  };

  return (
    <MedicationContext.Provider
      value={{
        medications,
        isReady,
        addMedication,
        removeMedication,
        todayIntake,
        todayKey,
        markDoseTaken,
      }}
    >
      {children}
    </MedicationContext.Provider>
  );
}

export function useMedications() {
  const ctx = useContext(MedicationContext);
  if (!ctx) {
    throw new Error('useMedications must be used inside MedicationProvider');
  }
  return ctx;
}
