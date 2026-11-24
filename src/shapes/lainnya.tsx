import { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import { face, OUTLINE, part, type ShapeDef, starPath, stroke } from './kit';

const STAR = starPath(50, 54, 46, 21);

const PETALS = [0, 1, 2, 3, 4].map((i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
  return { x: 50 + 19 * Math.cos(a), y: 40 + 19 * Math.sin(a) };
});

/** Pakaian, rumah, dan bentuk-bentuk umum. */
export const LAINNYA = {
  kaos: {
    name: 'baju',
    color: '#42A5F5',
    recolor: true,
    draw: (p, sil) => (
      <>
        <Path {...p} d="M34 14 Q50 27 66 14 L91 30 L81 47 L71 41 L71 89 L29 89 L29 41 L19 47 L9 30 Z" />
        {!sil && <Path d="M38 16 Q50 29 62 16" stroke={OUTLINE} strokeWidth={3} fill="none" />}
        {!sil && <Circle cx={50} cy={58} r={9} fill="#fff" opacity={0.55} />}
      </>
    ),
  },
  celana: {
    name: 'celana',
    color: '#5C6BC0',
    recolor: true,
    draw: (p, sil) => (
      <>
        <Path {...p} d="M23 11 H77 L83 91 H58 L50 45 L42 91 H17 Z" />
        {!sil && <Path d="M23 23 H77" stroke={OUTLINE} strokeWidth={3} />}
        {!sil && <Circle cx={50} cy={17} r={2.5} fill={OUTLINE} />}
      </>
    ),
  },
  rumah: {
    name: 'garasi',
    color: '#EF5350',
    recolor: true,
    draw: (p, sil) => (
      <>
        <Path {...p} d="M10 48 L50 12 L90 48 V90 H10 Z" />
        {!sil && <Rect x={30} y={56} width={40} height={34} rx={3} fill="#fff" stroke={OUTLINE} strokeWidth={2.5} />}
        {!sil && <Path d="M30 67 H70 M30 78 H70" stroke={OUTLINE} strokeWidth={2} />}
        {!sil && <Circle cx={50} cy={38} r={6} fill="#fff" stroke={OUTLINE} strokeWidth={2.5} />}
      </>
    ),
  },
  bunga: {
    name: 'bunga',
    color: '#F06292',
    look: 'pohon',
    recolor: true,
    draw: (p, sil) => (
      <>
        <Path d="M50 60 V96" {...stroke('#43A047', sil, 6)} />
        <Ellipse {...part('#66BB6A', sil)} cx={62} cy={82} rx={11} ry={6} transform="rotate(-30 62 82)" />
        {PETALS.map((q, i) => (
          <Circle key={i} {...p} cx={q.x} cy={q.y} r={16} />
        ))}
        <Circle {...part('#FFD54F', sil)} cx={50} cy={40} r={12} />
        {face(sil, 50, 38, 4.5, 2.4)}
      </>
    ),
  },
  bintang: {
    name: 'bintang',
    color: '#FFCA28',
    recolor: true,
    draw: (p, sil) => (
      <>
        <Path {...p} d={STAR} />
        {face(sil, 50, 52, 9, 4)}
      </>
    ),
  },
  hati: {
    name: 'hati',
    color: '#EF5350',
    recolor: true,
    draw: (p, sil) => (
      <>
        <Path {...p} d="M50 90 C20 68 6 50 10 32 C14 15 38 10 50 28 C62 10 86 15 90 32 C94 50 80 68 50 90 Z" />
        {!sil && <Ellipse cx={28} cy={32} rx={7} ry={5} fill="#fff" opacity={0.6} transform="rotate(-35 28 32)" />}
        {face(sil, 50, 46, 11, 4)}
      </>
    ),
  },
  balon: {
    name: 'balon',
    color: '#AB47BC',
    recolor: true,
    draw: (p, sil) => (
      <>
        <Path d="M50 78 Q42 86 52 92 Q58 96 50 99" {...stroke('#616161', sil, 2.5)} />
        <Path {...p} d="M44 78 H56 L50 70 Z" />
        <Ellipse {...p} cx={50} cy={40} rx={29} ry={33} />
        {!sil && <Ellipse cx={38} cy={26} rx={6} ry={10} fill="#fff" opacity={0.55} transform="rotate(25 38 26)" />}
      </>
    ),
  },
} satisfies Record<string, ShapeDef>;
