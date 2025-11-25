/**
 * daySegments — Time-of-day segments and helpers for medication scheduling.
 * @module src/constants/daySegments
 * @author Sabata79
 * @since 2025-11-25
 * @updated 2025-11-25
 */

// All segments as a list
export const DAY_SEGMENT_LIST = [
  {
    id: 'morning',
    label: 'Aamu',
    window: '06–12',
  },
  {
    id: 'day',
    label: 'Päivä',
    window: '12–18',
  },
  {
    id: 'evening',
    label: 'Ilta',
    window: '18–24',
  },
  {
    id: 'night',
    label: 'Yö',
    window: '00–06',
  },
];
// Helper dictionaries: id -> label / time window
export const DAY_SEGMENT_LABELS = DAY_SEGMENT_LIST.reduce((acc, seg) => {
  acc[seg.id] = seg.label;
  return acc;
}, {});

export const DAY_SEGMENT_WINDOWS = DAY_SEGMENT_LIST.reduce((acc, seg) => {
  acc[seg.id] = seg.window;
  return acc;
}, {});

// Order used e.g. for sorting
export const DAY_SEGMENT_ORDER = DAY_SEGMENT_LIST.map((seg) => seg.id);

// Ikonit (Ionicons-nimet)
export const DAY_SEGMENT_ICONS = {
  morning: 'sunny-outline',
  day: 'partly-sunny-outline',
  evening: 'moon-outline',
  night: 'moon-outline',
};

// Muuttaa segmenttilistan selkokieliseksi tekstiksi, esim.
// ['morning', 'evening'] -> "Aamu, Ilta (2x päivässä)"
export function formatSegmentsToLabel(segmentIds) {
  if (!Array.isArray(segmentIds) || segmentIds.length === 0) {
    return 'Ei valittuja jaksoja';
  }

  const sorted = [...segmentIds].sort(
    (a, b) => DAY_SEGMENT_ORDER.indexOf(a) - DAY_SEGMENT_ORDER.indexOf(b)
  );

  const labels = sorted.map((id) => DAY_SEGMENT_LABELS[id] || id);

  if (labels.length === 1) {
    return `${labels[0]} (1x päivässä)`;
  }

  return `${labels.join(', ')} (${labels.length}x päivässä)`;
}
