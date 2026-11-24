import { Path } from 'react-native-svg';
import { circle, curvy, type DrawingDef, poly, rect } from './kit';

/**
 * Pemandangan rumah: matahari (1), atap & pintu (2), dinding & batang pohon (3),
 * daun pohon & rumput (4), awan & jendela (5).
 */
export const PEMANDANGAN: DrawingDef = {
  name: 'Pemandangan',
  regions: [
    curvy('M0 166 Q50 152 100 166 Q150 180 200 162 L200 200 L0 200 Z', 4, [36, 184]),
    circle(36, 36, 20, 1),
    curvy('M122 66 Q112 52 128 48 Q132 32 150 38 Q164 26 176 42 Q194 44 186 60 Q190 70 176 70 L130 70 Q120 72 122 66 Z', 5, [154, 56]),
    rect(158, 124, 12, 46, 3, [164, 156]),
    circle(164, 108, 26, 4),
    rect(50, 100, 80, 68, 3, [64, 122]),
    poly([[40, 102], [90, 60], [140, 102]], 2, [90, 88]),
    rect(82, 128, 20, 40, 2, [92, 150]),
    rect(108, 112, 16, 16, 5, [116, 120]),
  ],
  details: () => (
    <Path
      d="M36 6 V0 M36 66 V74 M6 36 H-2 M66 36 H74 M14 14 L8 8 M58 14 L64 8 M14 58 L8 64 M58 58 L64 64"
      stroke="#FFA000"
      strokeWidth={3}
      strokeLinecap="round"
    />
  ),
};
