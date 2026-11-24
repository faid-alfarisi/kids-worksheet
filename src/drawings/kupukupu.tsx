import { Circle, Path } from 'react-native-svg';
import { circle, type DrawingDef, ellipse } from './kit';

/** Kupu-kupu besar: sayap atas (1), sayap bawah (2), bintik (3), badan & kepala (4). */
export const KUPUKUPU: DrawingDef = {
  name: 'Kupu-kupu',
  regions: [
    ellipse(60, 76, 40, 32, -25, 1, [46, 92]),
    ellipse(140, 76, 40, 32, 25, 1, [154, 92]),
    ellipse(70, 134, 28, 24, 20, 2, [62, 146]),
    ellipse(130, 134, 28, 24, -20, 2, [138, 146]),
    circle(58, 68, 11, 3),
    circle(142, 68, 11, 3),
    circle(74, 130, 8, 3),
    circle(126, 130, 8, 3),
    ellipse(100, 112, 10, 48, 0, 4, [100, 128]),
    circle(100, 58, 12, 4),
  ],
  details: () => (
    <>
      <Path d="M94 48 Q84 26 72 22 M106 48 Q116 26 128 22" stroke="#3A3A3A" strokeWidth={3} strokeLinecap="round" fill="none" />
      <Circle cx={72} cy={22} r={4} fill="#3A3A3A" />
      <Circle cx={128} cy={22} r={4} fill="#3A3A3A" />
    </>
  ),
};
