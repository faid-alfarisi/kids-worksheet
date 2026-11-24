import { Circle, Path } from 'react-native-svg';
import { circle, curvy, type DrawingDef, ellipse, poly } from './kit';

/** Ikan besar: badan (1), ekor & sirip (2), belang (3), gelembung (4). */
export const IKAN: DrawingDef = {
  name: 'Ikan',
  regions: [
    poly([[148, 100], [190, 62], [180, 100], [190, 138]], 2, [174, 100]),
    curvy('M78 64 Q98 28 132 62 Z', 2, [106, 54]),
    curvy('M92 132 Q108 186 132 130 Z', 2, [112, 150]),
    ellipse(95, 100, 62, 42, 0, 1, [66, 124]),
    curvy('M112 62 Q100 100 112 138 L126 134 Q114 100 126 66 Z', 3, [117, 100]),
    curvy('M84 61 Q70 100 84 139 L97 140 Q86 100 97 60 Z', 3, [88, 100]),
    circle(30, 48, 10, 4),
    circle(46, 24, 8, 4),
  ],
  details: () => (
    <>
      <Circle cx={54} cy={90} r={8} fill="#fff" stroke="#3A3A3A" strokeWidth={2.5} />
      <Circle cx={56} cy={90} r={4} fill="#333" />
      <Path d="M38 108 Q46 116 54 110" stroke="#333" strokeWidth={3} strokeLinecap="round" fill="none" />
    </>
  ),
};
