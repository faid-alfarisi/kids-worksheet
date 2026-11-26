import { circle, curvy, type DrawingDef } from './kit';

// Path dari Twemoji Perahu Layar (26f5)
const TIANG = 'M20 26c0 .553-.447 1-1 1-.552 0-1-.447-1-1V1c0-.552.448-1 1-1 .553 0 1 .448 1 1v25z';
const LAMBUNG = 'M3 24h31v8H12c-6 0-9-8-9-8z';
const LAYAR_KIRI = 'M5 22s2-5 5-9 8-8 8-8-1 11-1 16v1s-3-1-6-1-6 1-6 1z';
const LAYAR_KANAN = 'M20 2s6 6 9 11c2.771 4.618 4 9 4 9s-3-1-6-1-6 1-6 1v-1c0-9-1-19-1-19z';

/** Kapal Layar (Twemoji 26f5): lambung kapal (1), layar kanan besar (2), layar kiri (3), matahari (4), laut (5). */
export const KAPAL_LAYAR: DrawingDef = {
  name: 'Kapal Layar',
  regions: [
    circle(32, 32, 18, 4),
    curvy(TIANG, 1, [105, 64], 4.8, 14, 14),
    curvy(LAYAR_KIRI, 3, [76, 94], 4.8, 14, 14),
    curvy(LAYAR_KANAN, 2, [134, 86], 4.8, 14, 14),
    curvy(LAMBUNG, 1, [106, 146], 4.8, 14, 14),
    curvy('M0 158 Q50 146 100 158 Q150 170 200 158 L200 200 L0 200 Z', 5, [100, 182]),
  ],
};
