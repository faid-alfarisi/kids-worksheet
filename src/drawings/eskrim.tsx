import { Path } from 'react-native-svg';
import { circle, type DrawingDef, poly } from './kit';

/** Es krim tiga tingkat: cone (1), scoop bawah & atas (2), scoop tengah (3), ceri (4). */
export const ESKRIM: DrawingDef = {
  name: 'Es Krim',
  regions: [
    poly([[68, 112], [132, 112], [100, 194]], 1, [100, 160]),
    circle(100, 102, 34, 2, [100, 116]),
    circle(100, 66, 28, 3, [100, 78]),
    circle(100, 38, 22, 2, [100, 40]),
    circle(104, 13, 9, 4),
  ],
  details: () => (
    <>
      <Path d="M106 4 Q112 -2 118 0" stroke="#558B2F" strokeWidth={3} strokeLinecap="round" fill="none" />
    </>
  ),
};
