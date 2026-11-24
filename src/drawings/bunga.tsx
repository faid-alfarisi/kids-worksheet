import { Circle, Path } from 'react-native-svg';
import { circle, type DrawingDef, ellipse, rect } from './kit';

const CX = 100;
const CY = 78;

/** Bunga tersenyum: kelopak (1), tengah (2), batang & daun (3), pipi (4). */
export const BUNGA: DrawingDef = {
  name: 'Bunga',
  regions: [
    rect(95, 108, 10, 84, 3, [100, 172]),
    ellipse(74, 162, 24, 11, -30, 3),
    ellipse(126, 150, 24, 11, 30, 3),
    ...Array.from({ length: 8 }, (_, k) => {
      const a = (k * 45 * Math.PI) / 180;
      return ellipse(CX + 46 * Math.cos(a), CY + 46 * Math.sin(a), 24, 14, k * 45, 1);
    }),
    circle(CX, CY, 30, 2, [CX, 60]),
    circle(81, 90, 9, 4),
    circle(119, 90, 9, 4),
  ],
  details: () => (
    <>
      <Circle cx={90} cy={74} r={4} fill="#333" />
      <Circle cx={110} cy={74} r={4} fill="#333" />
      <Path d="M93 87 Q100 95 107 87" stroke="#333" strokeWidth={3} strokeLinecap="round" fill="none" />
    </>
  ),
};
