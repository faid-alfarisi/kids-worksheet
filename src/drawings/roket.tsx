import { circle, curvy, type DrawingDef } from './kit';

// Path dari Twemoji Roket (1f680)
const SIRIP_UTAMA = 'M1 17l8-7 16 1 1 16-7 8s.001-5.999-6-12-12-6-12-6z';
const API_LUAR = 'M.973 35s-.036-7.979 2.985-11S15 21.187 15 21.187 14.999 29 11.999 32c-3 3-11.026 3-11.026 3z';
const BADAN = 'M35.999 0s-10 0-22 10c-6 5-6 14-4 16s11 2 16-4c10-12 10-22 10-22z';
const SIRIP_TENGAH = 'M8 28s0-4 1-5 13.001-10.999 14-10-9.001 13-10.001 14S8 28 8 28z';

/** Roket Luar Angkasa (Twemoji 1f680): badan roket (1), sirip merah (2), jendela (3), api pendorong (4), bintang (5). */
export const ROKET: DrawingDef = {
  name: 'Roket',
  regions: [
    curvy(SIRIP_UTAMA, 2, [44, 78], 4.8, 14, 14),
    curvy(API_LUAR, 4, [38, 160], 4.8, 14, 14),
    curvy(BADAN, 1, [120, 74], 4.8, 14, 14),
    curvy(SIRIP_TENGAH, 2, [82, 114], 4.8, 14, 14),
    circle(144, 58, 18, 3),
    circle(36, 36, 11, 5),
    circle(162, 152, 11, 5),
    circle(116, 168, 9, 5),
  ],
};
