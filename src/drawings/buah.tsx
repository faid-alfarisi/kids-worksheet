import { Path } from 'react-native-svg';
import { circle, curvy, type DrawingDef, ellipse } from './kit';

/** Keranjang buah: keranjang (1), apel (2), pisang (3), jeruk (4), daun (5). */
export const KERANJANG_BUAH: DrawingDef = {
  name: 'Keranjang Buah',
  regions: [
    circle(134, 82, 24, 4, [134, 72]),
    circle(70, 94, 28, 2, [66, 96]),
    ellipse(78, 60, 12, 6, -30, 5),
    curvy('M90 94 Q130 126 178 82 Q184 100 168 110 Q128 140 88 112 Z', 3, [130, 116]),
    curvy('M26 120 L174 120 Q168 180 100 184 Q32 180 26 120 Z', 1, [100, 170]),
  ],
  details: () => (
    <>
      <Path d="M70 66 Q70 58 74 52" stroke="#6D4C41" strokeWidth={4} strokeLinecap="round" fill="none" />
      <Path d="M36 138 H164 M44 156 H156" stroke="#8D6E63" strokeWidth={2.5} strokeLinecap="round" />
    </>
  ),
};
