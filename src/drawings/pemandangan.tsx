import { circle, curvy, type DrawingDef, rect } from './kit';

// Path dari Twemoji (36x36): rumah (1f3e0), pohon (1f333), matahari (2600), awan (2601)
const POHON_BATANG = 'M22 33c0 2.209-1.791 3-4 3s-4-.791-4-3l1-9c0-2.209.791-2 3-2s3-.209 3 2l1 9z';
const POHON_DAUN = 'M34 17c0 8.837-7.163 12-16 12-8.836 0-16-3.163-16-12C2 8.164 11 0 18 0s16 8.164 16 17z';
const AWAN_PATH =
  'M31 22c-.467 0-.91.085-1.339.204.216-.526.339-1.1.339-1.704 0-2.485-2.015-4.5-4.5-4.5-1.019 0-1.947.351-2.701.921C22.093 14.096 19.544 12 16.5 12c-2.838 0-5.245 1.822-6.131 4.357C9.621 16.125 8.825 16 8 16c-4.418 0-8 3.582-8 8 0 4.419 3.582 8 8 8h23c2.762 0 5-2.238 5-5s-2.238-5-5-5z';
const RUMAH_DINDING = 'M5 16L18 3l13 13v17H5z';
const RUMAH_ATAP =
  'M31 17c-.256 0-.512-.098-.707-.293L18 4.414 5.707 16.707c-.391.391-1.023.391-1.414 0s-.391-1.023 0-1.414l13-13c.391-.391 1.023-.391 1.414 0l13 13c.391.391.391 1.023 0 1.414-.195.195-.451.293-.707.293z';

/**
 * Pemandangan rumah (kombinasi Twemoji Rumah + Pohon + Matahari + Awan):
 * matahari (1), atap & pintu (2), dinding & batang pohon (3), daun pohon & rumput (4), awan & jendela (5).
 */
export const PEMANDANGAN: DrawingDef = {
  name: 'Pemandangan',
  regions: [
    curvy('M0 162 Q50 150 100 162 Q150 174 200 158 L200 200 L0 200 Z', 4, [42, 184]),
    circle(34, 34, 20, 1),
    curvy(AWAN_PATH, 5, [152, 48], 2.2, 112, -2),
    curvy(POHON_BATANG, 3, [161, 152], 2.8, 111, 74),
    curvy(POHON_DAUN, 4, [161, 116], 2.8, 111, 74),
    curvy(RUMAH_DINDING, 3, [58, 134], 3.4, 16, 56),
    curvy(RUMAH_ATAP, 2, [77, 74], 3.4, 16, 56),
    rect(50, 144, 18, 24, 2, [59, 156]),
    rect(88, 122, 18, 18, 5, [97, 131]),
  ],
};
