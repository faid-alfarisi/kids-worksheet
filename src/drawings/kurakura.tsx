import { Circle } from 'react-native-svg';
import { circle, curvy, type DrawingDef } from './kit';

// Path dari Twemoji Kura-kura (1f422): setiap kepingan tempurung (tengah, kiri, kanan) adalah region terpisah!
const KEPALA =
  'M9.842 19.922c0 9.842 6.575 9.673 5.158 10.078-7 2-8.803-7.618-9.464-7.618-2.378 0-5.536-.423-5.536-2.46C0 17.883 2.46 15 6.151 15c2.379 0 3.691 2.883 3.691 4.922z';
const EKOR =
  'M36 28.638c0 1.104-3.518-.741-5 0-2 1-2-.896-2-2s1.343-1 3-1 4 1.895 4 3z';
const KAKI_DEPAN =
  'M16.715 33.143c0 2.761-1.279 2.857-2.857 2.857S11 35.903 11 33.143c0-.489.085-1.029.234-1.587.69-2.59 2.754-5.556 4.052-5.556 1.578 0 1.429 4.382 1.429 7.143z';
const KAKI_BELAKANG =
  'M25.286 33.143c0 2.761 1.278 2.857 2.856 2.857C29.721 36 31 35.903 31 33.143c0-.489-.085-1.029-.234-1.587-.691-2.59-2.754-5.556-4.052-5.556-1.578 0-1.428 4.382-1.428 7.143z';
const TEMPURUNG_DASAR = 'M32 27c0 4-5.149 4-11.5 4S9 31 9 27c0-6.627 5.149-12 11.5-12S32 20.373 32 27z';
const KEPING_TENGAH = 'M23.667 25.1c0 3.591-1.418 3.9-3.167 3.9s-3.167-.31-3.167-3.9S18.75 17 20.5 17s3.167 4.51 3.167 8.1z';
const KEPING_KANAN =
  'M30 24c.871 3.482-.784 4-2.533 4-1.749 0-2.533.69-2.533-2.9s-1.116-6.5.633-6.5C27.315 18.6 29 20 30 24z';
const KEPING_KIRI =
  'M16.067 25.1c0 3.591-.785 2.9-2.534 2.9s-3.404-.518-2.533-4c1-4 3.251-5.4 5-5.4 1.75 0 .067 2.91.067 6.5z';

/** Kura-kura (Twemoji 1f422): kepala, kaki & ekor (1), pinggiran tempurung (2), kepingan tempurung (3), gelembung (4). */
export const KURAKURA: DrawingDef = {
  name: 'Kura-kura',
  regions: [
    curvy(KEPALA, 1, [40, 102], 4.8, 14, 2),
    curvy(EKOR, 1, [174, 134], 4.8, 14, 2),
    curvy(KAKI_DEPAN, 1, [81, 160], 4.8, 14, 2),
    curvy(KAKI_BELAKANG, 1, [148, 160], 4.8, 14, 2),
    curvy(TEMPURUNG_DASAR, 2, [112, 142], 4.8, 14, 2),
    curvy(KEPING_KIRI, 3, [80, 114], 4.8, 14, 2),
    curvy(KEPING_TENGAH, 3, [112, 114], 4.8, 14, 2),
    curvy(KEPING_KANAN, 3, [146, 114], 4.8, 14, 2),
    circle(36, 46, 12, 4),
    circle(64, 28, 9, 4),
  ],
  details: () => <Circle cx={38} cy={88} r={5} fill="#292F33" />,
};
