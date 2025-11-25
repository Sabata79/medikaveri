// src/context/MedicationContext.js
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

  // Päivän otot: { [medId]: { [time]: true } }
  const [todayKey, setTodayKey] = useState(getTodayKey());
  const [todayIntake, setTodayIntake] = useState({});

  // Lataa alussa lääkkeet + päivän otot
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

  // Tallenna lääkkeet aina kun muuttuu
  useEffect(() => {
    if (!isReady) return;
    saveMedications(medications);
  }, [medications, isReady]);

  const createLocalId = () => {
    return `med_${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`;
  };

  const addMedication = ({ name, doseAmount, segments }) => {
    // segments: esim. ['morning', 'evening']
    const doseTimes = calculateDoseTimes(segments);
    const timesPerDay = segments?.length ?? 0;

    const newMed = {
      id: createLocalId(),      // käytä samaa ID-funktiota kuin aiemmin
      name,
      doseAmount,
      segments,                 // talletetaan myös segmentit
      timesPerDay,              // esim. 2x päivässä
      doseTimes,                // esim. ['08:00', '20:00']
      // myöhemmin tänne voidaan lisätä esim. kuurin kesto, lastTaken jne.
    };

    setMedications((prev) => [...prev, newMed]);
  };

  const removeMedication = (id) => {
    setMedications((prev) => prev.filter((med) => med.id !== id));
    // Samalla poistetaan myös päivän otto-tiedot tälle lääkkeelle
    setTodayIntake((prev) => {
      if (!prev[id]) return prev;
      const updated = { ...prev };
      delete updated[id];
      saveTodayIntake(todayKey, updated);
      return updated;
    });
  };

  // Merkitse yksittäinen kellonaika otetuksi tälle päivälle
  const markDoseTaken = (medId, doseTime) => {
    setTodayIntake((prev) => {
      const medIntake = prev[medId] || {};
      if (medIntake[doseTime]) {
        return prev; // jo otettu
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
