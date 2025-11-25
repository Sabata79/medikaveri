// src/constants/daySegments.js

// Kaikki jaksot listana
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

// Apusanakirjat: id -> label / aikaikkuna
export const DAY_SEGMENT_LABELS = DAY_SEGMENT_LIST.reduce((acc, seg) => {
  acc[seg.id] = seg.label;
  return acc;
}, {});

export const DAY_SEGMENT_WINDOWS = DAY_SEGMENT_LIST.reduce((acc, seg) => {
  acc[seg.id] = seg.window;
  return acc;
}, {});

// Järjestys, jota käytetään mm. sorttaukseen
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
