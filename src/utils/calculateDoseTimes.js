// src/utils/calculateDoseTimes.js

// Voidaan hyödyntää päivävaiheiden ikkunoita teknisten kellonaikojen
// muodostamiseen, jos halutaan. Tämä ei näy käyttäjälle.
import { DAY_SEGMENT_WINDOWS } from '../constants/daySegments';

/**
 * Turvallinen apufunktio, joka palauttaa listan "HH:MM"-arvoja.
 *
 * Nykyisessä mallissa:
 * - UI EI näytä näitä kellonaikoja käyttäjälle
 * - Funktio on olemassa lähinnä mahdollista push-notifikaatioiden
 *   teknistä ajastusta varten ja jotta vanhat kutsut eivät riko appia.
 *
 * Hyväksyy kaksi erilaista kutsutapaa:
 *   1) calculateDoseTimes(['morning', 'evening'])
 *   2) calculateDoseTimes(firstTime, timesPerDay)  // vanha signatuuri
 */
export function calculateDoseTimes(arg1, arg2) {
  // UUSI MALLI: jos 1. argumentti on taulukko segmenttien id:itä
  // esim. ['morning', 'day', 'evening']
  if (Array.isArray(arg1)) {
    const segments = arg1;

    return segments.map((segId) => {
      const window = DAY_SEGMENT_WINDOWS?.[segId];

      // Yritetään laskea karkeasti ikkunan keskikohta HH:00 muodossa
      if (typeof window === 'string') {
        // Odotetaan muotoa "06–12" tms
        const parts = window.replace('–', '-').split('-'); // en dash -> hyphen
        if (parts.length === 2) {
          const start = parseInt(parts[0], 10);
          const end = parseInt(parts[1], 10);

          if (!Number.isNaN(start) && !Number.isNaN(end)) {
            const mid = (start + end) / 2; // karkea keskikohta
            const hour = Math.round(mid).toString().padStart(2, '0');
            return `${hour}:00`;
          }
        }
      }

      // Jos ei pystytty tulkitsemaan ikkunaa, anna vain neutraali aika
      return '08:00';
    });
  }

  // VANHA MALLI: (firstTime, timesPerDay) — ei haluta kaatua,
  // palautetaan tässä vaiheessa vain tyhjä lista.
  // Mahd. myöhemmin tänne voi lisätä vanhan logiikan jos sitä vielä tarvitaan.
  if (typeof arg1 === 'string' && typeof arg2 === 'number') {
    return [];
  }

  // Jos argumentit ovat mitä sattuu, palauta turvallisesti tyhjä taulukko.
  return [];
}
