import { Circle } from 'react-native-svg';
import { circle, curvy, type DrawingDef } from './kit';

// Path dari Twemoji Gurita (1f419): punya tentakel belakang, tentakel tengah, badan depan, dan bintik/gelembung
const TENTAKEL_BELAKANG_KIRI =
  'M10 12c3 5 0 10.692-3 9.692s-4 2-1 3 9.465-.465 13-4c1-1 2-1 2-1L10 12z';
const TENTAKEL_BELAKANG_KANAN =
  'M26 12c-3 5 0 10.692 3 9.692s4 2 1 3-9.465-.465-13-4c-1-1-2-1-2-1L26 12z';
const TENTAKEL_TENGAH_KANAN =
  'M30.188 16c-3 5 0 10.692 3 9.692s4 2 1 3-9.465-.465-13-4c-1-1-2-1-2-1l11-7.692z';
const TENTAKEL_TENGAH_KIRI =
  'M5.812 16c3 5 0 10.692-3 9.692s-4 2-1 3 9.465-.465 13-4c1-1 2-1 2-1L5.812 16z';
const BADAN_DEPAN =
  'M33.188 31.375c-2.729.91-6.425-5.626-4.812-10.578C30.022 17.554 31 13.94 31 11c0-7.18-5.82-11-13-11S5 3.82 5 11c0 2.94.978 6.554 2.624 9.797 1.613 4.952-2.083 11.488-4.812 10.578-3-1-4 3-1 4s8.31-.627 12-4c2.189-2 4.189-2 4.189-2s2 0 4.188 2c3.69 3.373 9 5 12 4s1.999-5-1.001-4z';

/** Gurita (Twemoji 1f419): kepala & tentakel depan (1), tentakel tengah (2), tentakel atas (3), bintik & gelembung (4). */
export const GURITA: DrawingDef = {
  name: 'Gurita',
  regions: [
    curvy(TENTAKEL_BELAKANG_KIRI, 3, [26, 114], 4.8, 14, 14),
    curvy(TENTAKEL_BELAKANG_KANAN, 3, [174, 114], 4.8, 14, 14),
    curvy(TENTAKEL_TENGAH_KIRI, 2, [22, 144], 4.8, 14, 14),
    curvy(TENTAKEL_TENGAH_KANAN, 2, [178, 144], 4.8, 14, 14),
    curvy(BADAN_DEPAN, 1, [100, 84], 4.8, 14, 14),
    circle(72, 48, 11, 4),
    circle(128, 48, 11, 4),
    circle(32, 32, 10, 4),
    circle(168, 32, 10, 4),
  ],
  details: () => (
    <>
      <Circle cx={81} cy={115} r={8} fill="#292F33" />
      <Circle cx={119} cy={115} r={8} fill="#292F33" />
    </>
  ),
};
