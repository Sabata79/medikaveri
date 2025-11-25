// src/theme/typography.js
import { Platform } from 'react-native';

export const typography = {
  // Yksinkertainen, selkeä sans-serif
  fontFamily: Platform.select({
    ios: 'System',       // iOSin default sans-serif
    android: 'sans-serif', // Androidin perussans
    default: 'System',
  }),
  sizes: {
    title: 22,      // pääotsikot (esim. "Tämän päivän lääkkeet")
    subtitle: 18,   // alaotsikot
    question: 20,   // step-kysymykset
    body: 16,       // perustekstit
    small: 14,      // pienemmät selitteet
    button: 18,     // nappitekstit
  },
};
