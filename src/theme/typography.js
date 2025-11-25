/**
 * typography — Font family and size definitions for the app.
 * @module src/theme/typography
 * @author Sabata79
 * @since 2025-11-25
 * @updated 2025-11-25
 */
import { Platform } from 'react-native';

export const typography = {
  // Simple, clear sans-serif
  fontFamily: Platform.select({
    ios: 'System',       // iOS default sans-serif
    android: 'sans-serif', // Android base sans-serif
    default: 'System',
  }),
  sizes: {
    title: 22,      // main titles (e.g. "Today's medications")
    subtitle: 18,   // subtitles
    question: 20,   // step questions
    body: 16,       // base text
    small: 14,      // smaller labels
    button: 18,     // button text
  },
};
