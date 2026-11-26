import { circle, curvy, type DrawingDef, rect } from './kit';

// Path dari Twemoji Mobil (1f697)
const BADAN = 'M13 32h20s3 0 3-4c0-2 0-6-1-7s-8-7-11-7h-6c-3 0-10 7-10 7l-4 1s-3 1-3 3v3s-1 .338-1 1.957C0 32 2 32 2 32h11z';
const JENDELA_DEPAN = 'M20 16h-2c-2 0-8 6-8 6s4.997-.263 10-.519V16z';
const JENDELA_BELAKANG = 'M30 19c-1-1-5-3-7-3h-1v5.379c4.011-.204 7.582-.379 8-.379 1 0 1-1 0-2z';

/** Mobil di Jalan (Twemoji 1f697 + Matahari): badan (1), jendela (2), ban (3), velg & matahari (4), aspal jalan (5). */
export const MOBIL: DrawingDef = {
  name: 'Mobil',
  regions: [
    rect(0, 156, 200, 44, 5, [100, 182]),
    circle(36, 36, 20, 4),
    curvy(BADAN, 1, [100, 128], 4.8, 14, 6),
    curvy(JENDELA_DEPAN, 2, [84, 98], 4.8, 14, 6),
    curvy(JENDELA_BELAKANG, 2, [132, 98], 4.8, 14, 6),
    circle(62, 155, 20, 3, [62, 139]),
    circle(62, 155, 9, 4),
    circle(144, 155, 20, 3, [144, 139]),
    circle(144, 155, 9, 4),
  ],
};
