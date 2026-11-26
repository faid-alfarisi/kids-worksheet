import { Path } from 'react-native-svg';
import { curvy, type DrawingDef } from './kit';

// Path dari Twemoji Apel (1f34e) + Jeruk (1f34a) + OpenMoji Pisang utuh (1F34C)
const APEL_BADAN =
  'M24 7c-3 0-3 1-6 1s-3-1-6-1c-4 0-9 2-9 9 0 11 6 20 10 20 3 0 3-1 5-1s2 1 5 1c4 0 10-9 10-20 0-7.001-5-9-9-9z';
const APEL_DAUN = 'M19 7s3-4 8-4c4 0 6 2 6 2s-4 3-7 3-7-1-7-1z';
const JERUK_BADAN = 'M3 19.5C3 10.388 10.387 3 19.499 3c9.113 0 16.5 7.387 16.5 16.5S28.612 36 19.499 36C10.387 36 3 28.613 3 19.5z';
const JERUK_DAUN = 'M21 1s-3.106 4.318-7.021 5.273C11 7 7.041 7.07 6.646 6.15c-.394-.919 1.572-3.937 4.969-5.393C15.012-.698 21 1 21 1z';
const PISANG_UTUH =
  'M26 24.5 C19.5 32 10.5 31 4.5 28.5 L4.2 26.8 C14 25.5 22 18.5 23.5 6.5 L26.5 6.2 C29.5 14.5 27.5 21 26 24.5 Z';

/** Keranjang Buah (Apel + Jeruk + Pisang Utuh): keranjang (1), apel (2), pisang (3), jeruk (4), daun buah (5). */
export const KERANJANG_BUAH: DrawingDef = {
  name: 'Keranjang Buah',
  regions: [
    curvy(JERUK_DAUN, 5, [130, 36], 2.2, 98, 24),
    curvy(JERUK_BADAN, 4, [142, 74], 2.2, 98, 24),
    curvy(APEL_DAUN, 5, [76, 42], 2.4, 16, 28),
    curvy(APEL_BADAN, 2, [60, 86], 2.4, 16, 28),
    curvy(PISANG_UTUH, 3, [128, 102], 3.4, 62, 18),
    curvy('M22 120 L178 120 Q170 184 100 188 Q30 184 22 120 Z', 1, [100, 156]),
  ],
  details: () => (
    <Path d="M36 142 H164 M44 162 H156" stroke="#8D6E63" strokeWidth={2.5} strokeLinecap="round" />
  ),
};
